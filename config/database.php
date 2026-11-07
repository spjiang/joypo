<?php
/**
 * 主数据库连接参数，未配置的参数使用框架惯性配置
 * Docker 中设置 JOYPO_DB_TYPE=mysqli 后连接 MySQL 服务；本机未设置时仍使用 SQLite。
 */
if (getenv('JOYPO_DB_TYPE') === 'mysqli') {
    return array(
        'database' => array(
            'type' => 'mysqli',
            'host' => getenv('JOYPO_DB_HOST') ?: 'db',
            'user' => getenv('JOYPO_DB_USER') ?: 'joypo',
            'passwd' => getenv('JOYPO_DB_PASSWORD') !== false ? getenv('JOYPO_DB_PASSWORD') : '',
            'port' => getenv('JOYPO_DB_PORT') ?: '3306',
            'dbname' => getenv('JOYPO_DB_NAME') ?: 'joypo',
            'charset' => 'utf8mb4',
        ),
    );
}

return array(
    'database' => array(
        'type' => 'sqlite',
        'host' => '127.0.0.1',
        'user' => 'pboot',
        'passwd' => '123456',
        'port' => '3306',
        'dbname' => '/data/57b663c9df1663d7636700fa2ba7eb79.db',
    ),
);
