<?php
namespace app\common;

use core\basic\Config;

/**
 * 前台中英文切换。
 * 界面文案走语言包；数据库字段在英文有内容时才覆盖中文。
 */
class I18n
{
    const COOKIE = 'joypo_lang';

    public static function boot()
    {
        self::ensureColumns();
        $lang = isset($_GET['lang']) ? $_GET['lang'] : '';
        if ($lang === 'zh' || $lang === 'en') {
            setcookie(self::COOKIE, $lang, time() + 86400 * 365, '/');
            $_COOKIE[self::COOKIE] = $lang;
        }
    }

    public static function lang()
    {
        $lang = isset($_COOKIE[self::COOKIE]) ? $_COOKIE[self::COOKIE] : 'zh';
        return $lang === 'en' ? 'en' : 'zh';
    }

    public static function t($key)
    {
        $packs = self::packs();
        $lang = self::lang();
        if (isset($packs[$lang][$key]) && $packs[$lang][$key] !== '') {
            return $packs[$lang][$key];
        }
        if (isset($packs['zh'][$key])) {
            return $packs['zh'][$key];
        }
        return $key;
    }

    public static function url($lang)
    {
        $uri = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '/';
        $parts = parse_url($uri);
        $path = isset($parts['path']) && $parts['path'] !== '' ? $parts['path'] : '/';
        $query = isset($parts['query']) ? $parts['query'] : '';
        $query = preg_replace('/(^|&)lang=(?:zh|en)(?=&|$)/', '', $query);
        $query = trim((string) $query, '&');
        $query = $query === '' ? 'lang=' . $lang : $query . '&lang=' . $lang;
        return $path . '?' . $query;
    }

    public static function filled($value)
    {
        if (! is_string($value)) {
            return false;
        }
        $text = trim(html_entity_decode(strip_tags($value), ENT_QUOTES, 'UTF-8'));
        $text = str_replace("\xc2\xa0", '', $text);
        return $text !== '';
    }

    /**
     * 英文模式下，英文字段有内容才覆盖对应中文字段。
     *
     * @param mixed $row
     * @param array $fields
     * @return mixed
     */
    public static function apply($row, array $fields)
    {
        if (self::lang() !== 'en' || $row === null || $row === false || $row === '') {
            return $row;
        }
        foreach ($fields as $field) {
            $enKey = $field . '_en';
            if (is_object($row)) {
                if (isset($row->$enKey) && self::filled($row->$enKey)) {
                    $row->$field = $row->$enKey;
                }
            } elseif (is_array($row) && isset($row[$enKey]) && self::filled($row[$enKey])) {
                $row[$field] = $row[$enKey];
            }
        }
        return $row;
    }

    public static function ensureColumns()
    {
        static $done = false;
        if ($done) {
            return;
        }
        $done = true;
        $map = array(
            'ay_site' => array('title_en', 'subtitle_en', 'keywords_en', 'description_en', 'copyright_en', 'icp_en'),
            'ay_content_sort' => array('name_en', 'subname_en', 'title_en', 'keywords_en', 'description_en', 'def1_en', 'def2_en', 'def3_en'),
            'ay_content' => array('title_en', 'keywords_en', 'description_en', 'content_en'),
            'ay_company' => array('address_en')
        );
        $type = Config::get('database.type');
        try {
            if ($type === 'mysqli' || $type === 'pdo_mysql') {
                self::ensureMysqlColumns($map);
            } else {
                self::ensureSqliteColumns($map);
            }
        } catch (\Exception $e) {
            return;
        }
    }

    private static function ensureSqliteColumns(array $map)
    {
        $path = ROOT_PATH . Config::get('database.dbname');
        if (! is_file($path)) {
            return;
        }
        $db = new \SQLite3($path);
        $db->busyTimeout(5000);
        foreach ($map as $table => $cols) {
            $have = array();
            $res = $db->query('PRAGMA table_info(' . $table . ')');
            if (! $res) {
                continue;
            }
            while ($info = $res->fetchArray(SQLITE3_ASSOC)) {
                $have[$info['name']] = true;
            }
            foreach ($cols as $col) {
                if (! isset($have[$col])) {
                    $db->exec('ALTER TABLE ' . $table . ' ADD COLUMN ' . $col . " TEXT NOT NULL DEFAULT ''");
                }
            }
        }
        $db->close();
    }

    private static function ensureMysqlColumns(array $map)
    {
        $cfg = Config::get('database');
        $db = new \mysqli($cfg['host'], $cfg['user'], $cfg['passwd'], $cfg['dbname'], (int) $cfg['port']);
        if ($db->connect_errno) {
            return;
        }
        $db->set_charset('utf8mb4');
        foreach ($map as $table => $cols) {
            $have = array();
            $res = $db->query('SHOW COLUMNS FROM `' . $table . '`');
            if (! $res) {
                continue;
            }
            while ($info = $res->fetch_assoc()) {
                $have[$info['Field']] = true;
            }
            foreach ($cols as $col) {
                if (! isset($have[$col])) {
                    $db->query('ALTER TABLE `' . $table . '` ADD COLUMN `' . $col . "` varchar(512) NOT NULL DEFAULT ''");
                }
            }
        }
        $db->close();
    }

    private static function packs()
    {
        static $packs;
        if ($packs === null) {
            $packs = array(
                'zh' => self::load('zh'),
                'en' => self::load('en')
            );
        }
        return $packs;
    }

    private static function load($lang)
    {
        $file = ROOT_PATH . '/lang/' . $lang . '.php';
        if (! is_file($file)) {
            return array();
        }
        $data = include $file;
        return is_array($data) ? $data : array();
    }
}
