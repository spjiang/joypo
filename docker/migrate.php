<?php
/**
 * 首次启动时把 data 目录中的 SQLite 站点库导入 MySQL。
 * 已有业务表时直接跳过，避免覆盖容器里的数据。
 */
if (getenv('JOYPO_DB_TYPE') !== 'mysqli') {
    exit(0);
}

$host = getenv('JOYPO_DB_HOST') ?: 'db';
$port = getenv('JOYPO_DB_PORT') ?: '3306';
$name = getenv('JOYPO_DB_NAME') ?: 'joypo';
$user = getenv('JOYPO_DB_USER') ?: 'joypo';
$pass = getenv('JOYPO_DB_PASSWORD') ?: '';

$mysql = null;
$lastError = 'unknown';
for ($i = 0; $i < 60; $i++) {
    try {
        $mysql = new PDO(
            "mysql:host={$host};port={$port};dbname={$name};charset=utf8mb4",
            $user,
            $pass,
            array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION)
        );
        break;
    } catch (Throwable $e) {
        $lastError = $e->getMessage();
        sleep(1);
    }
}
if (!$mysql) {
    fwrite(STDERR, "MySQL 未就绪：{$lastError}\n");
    exit(1);
}

$ready = $mysql->query("SHOW TABLES LIKE 'ay_area'")->fetch();
if ($ready) {
    echo "MySQL 已有站点数据，跳过导入。\n";
    exit(0);
}

$sqlitePath = '/var/www/html/data/57b663c9df1663d7636700fa2ba7eb79.db';
if (!is_file($sqlitePath)) {
    $files = glob('/var/www/html/data/*.db') ?: array();
    usort($files, function ($a, $b) {
        return filesize($b) <=> filesize($a);
    });
    $sqlitePath = $files ? $files[0] : '';
}
if (!$sqlitePath || !is_file($sqlitePath)) {
    fwrite(STDERR, "找不到可导入的 SQLite 数据库。\n");
    exit(1);
}

echo "从 {$sqlitePath} 导入 MySQL...\n";
$sqlite = new PDO('sqlite:' . $sqlitePath, null, null, array(
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
));

$tables = $sqlite->query("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name")->fetchAll(PDO::FETCH_COLUMN);
$created = array();

try {
    $mysql->exec('SET FOREIGN_KEY_CHECKS = 0');
    foreach ($tables as $table) {
        $columns = $sqlite->query('PRAGMA table_info(' . quoteIdent($table) . ')')->fetchAll(PDO::FETCH_ASSOC);
        $defs = array();
        $pk = array();
        foreach ($columns as $column) {
            $isPk = (int) $column['pk'] === 1;
            $maxLen = $sqlite->query('SELECT MAX(LENGTH(' . quoteIdent($column['name']) . ')) FROM ' . quoteIdent($table))->fetchColumn();
            $defs[] = '`' . $column['name'] . '` ' . mysqlType($column['type'], $isPk, $maxLen)
                . columnConstraint($column, $isPk);
            if ($isPk) {
                $pk[] = '`' . $column['name'] . '`';
            }
        }
        $pkSql = count($pk) > 1 ? ', PRIMARY KEY (' . implode(',', $pk) . ')' : '';
        $mysql->exec(
            'CREATE TABLE `' . $table . '` (' . implode(',', $defs) . $pkSql
            . ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
        );
        $created[] = $table;

        $rows = $sqlite->query('SELECT * FROM ' . quoteIdent($table))->fetchAll(PDO::FETCH_ASSOC);
        if (!$rows) {
            continue;
        }
        $fields = array_keys($rows[0]);
        $colSql = '`' . implode('`,`', $fields) . '`';
        $placeholders = implode(',', array_fill(0, count($fields), '?'));
        $insert = $mysql->prepare('INSERT INTO `' . $table . '` (' . $colSql . ') VALUES (' . $placeholders . ')');
        $mysql->beginTransaction();
        foreach ($rows as $row) {
            $insert->execute(array_values($row));
        }
        $mysql->commit();
        echo "  {$table}: " . count($rows) . " 行\n";
    }

    $indexes = $sqlite->query("SELECT sql FROM sqlite_master WHERE type = 'index' AND sql IS NOT NULL")->fetchAll(PDO::FETCH_COLUMN);
    foreach ($indexes as $indexSql) {
        $mysql->exec(convertIndex($indexSql));
    }
    echo "导入完成。\n";
} catch (Throwable $e) {
    if ($mysql->inTransaction()) {
        $mysql->rollBack();
    }
    foreach (array_reverse($created) as $table) {
        $mysql->exec('DROP TABLE IF EXISTS `' . $table . '`');
    }
    fwrite(STDERR, "导入失败：" . $e->getMessage() . "\n");
    exit(1);
}

function quoteIdent($name)
{
    return '"' . str_replace('"', '""', $name) . '"';
}

function mysqlType($sqliteType, $isPk, $maxLen)
{
    $type = strtoupper($sqliteType);
    if ($isPk && strpos($type, 'INT') !== false) {
        return 'int unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY';
    }
    if (strpos($type, 'INT') !== false) {
        return 'int';
    }
    if (preg_match('/TEXT\((\d+)\)/', $type, $match)) {
        $length = (int) $match[1];
        return $length <= 1000 ? 'varchar(' . $length . ')' : 'text';
    }
    if (strpos($type, 'BLOB') !== false) {
        return 'blob';
    }
    if (strpos($type, 'REAL') !== false || strpos($type, 'FLOA') !== false || strpos($type, 'DOUB') !== false) {
        return 'double';
    }
    $maxLen = (int) $maxLen;
    if ($maxLen <= 512) {
        return 'varchar(512)';
    }
    return 'mediumtext';
}

function columnConstraint($column, $isPk)
{
    if ($isPk && strpos(strtoupper($column['type']), 'INT') !== false) {
        return '';
    }
    $sql = ((int) $column['notnull'] === 1) ? ' NOT NULL' : ' NULL';
    if ($column['dflt_value'] !== null) {
        $sql .= ' DEFAULT ' . $column['dflt_value'];
    }
    return $sql;
}

function convertIndex($sql)
{
    $sql = str_replace('"', '`', $sql);
    return preg_replace('/\s+ASC\b/i', '', $sql);
}
