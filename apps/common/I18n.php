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
        self::ensureLangReady();
        if (self::isAdminRequest()) {
            self::ensureLangMenu();
        }
        $lang = isset($_GET['lang']) ? $_GET['lang'] : '';
        if ($lang === 'zh' || $lang === 'en') {
            setcookie(self::COOKIE, $lang, time() + 86400 * 365, '/');
            $_COOKIE[self::COOKIE] = $lang;
        }
    }

    private static function isAdminRequest()
    {
        $uri = isset($_SERVER['REQUEST_URI']) ? (string) $_SERVER['REQUEST_URI'] : '';
        $script = isset($_SERVER['SCRIPT_NAME']) ? (string) $_SERVER['SCRIPT_NAME'] : '';
        return (strpos($uri, '/admin') !== false) || (strpos($script, 'admin.php') !== false);
    }

    /** 分组中文名（后台筛选） */
    public static function groupLabels()
    {
        return array(
            'nav' => '导航',
            'pager' => '分页',
            'content' => '内容页',
            'search' => '搜索',
            'foot' => '页脚',
            'contact' => '联系我们',
            'cta' => '行动按钮',
            'message' => '留言',
            'video' => '视频',
            'hero' => '品牌主张',
            'mission' => '企业使命',
            'vision' => '企业愿景',
            'values' => '核心价值观',
            'home' => '首页',
            'stat' => '数据统计',
            'rd' => '研发优势',
            'about' => '关于我们',
            'prod' => '产品页',
            'yf' => '研发制造',
            'join' => '加入我们',
            'other' => '其他'
        );
    }

    public static function clearLangCache()
    {
        $file = self::langCacheFile();
        if (is_file($file)) {
            @unlink($file);
        }
        // 清空进程内静态缓存
        self::$packCache = null;
        self::$renderCache = array();
    }

    /**
     * 建表（若不存在）。前端/后台首次访问时自动执行。
     */
    public static function ensureLangReady()
    {
        static $done = false;
        if ($done) {
            return;
        }
        $done = true;
        try {
            self::ensureLangTable();
            self::restoreHeroLineKeys();
        } catch (\Exception $e) {
            return;
        }
    }

    /**
     * 撤销合并：拆回 hero.line1 / hero.line2，并删除 hero.line。
     */
    private static function restoreHeroLineKeys()
    {
        static $done = false;
        if ($done) {
            return;
        }
        $done = true;
        $rows = self::fetchAllRows();
        if (! $rows) {
            return;
        }

        $zhFile = self::loadFile('zh');
        $enFile = self::loadFile('en');
        $zh1File = isset($zhFile['hero.line1']) ? (string) $zhFile['hero.line1'] : '以工匠精神打造';
        $zh2File = isset($zhFile['hero.line2']) ? (string) $zhFile['hero.line2'] : '安全可靠的电池解决方案';
        $en1File = isset($enFile['hero.line1']) ? (string) $enFile['hero.line1'] : 'Crafted with care';
        $en2File = isset($enFile['hero.line2']) ? (string) $enFile['hero.line2'] : 'Safe and reliable battery solutions';

        $splitPair = function ($combined, $line1File, $line2File) {
            $combined = trim((string) $combined);
            if ($combined === '') {
                return array($line1File, $line2File);
            }
            $parts = preg_split("/\r\n|\n|\r/", $combined);
            if (is_array($parts) && count($parts) >= 2) {
                return array(trim((string) $parts[0]), trim((string) $parts[1]));
            }
            // 无换行时：按文件中的第二行后缀拆开
            if ($line2File !== '' && mb_substr($combined, -mb_strlen($line2File)) === $line2File) {
                $head = trim(mb_substr($combined, 0, mb_strlen($combined) - mb_strlen($line2File)));
                $head = rtrim($head, " \t\n\r\0\x0B");
                if ($head !== '') {
                    return array($head, $line2File);
                }
            }
            return array($line1File, $line2File);
        };

        $need = isset($rows['hero.line']);
        // 上次误拆：line1 被写成整句，需纠正
        if (! $need && isset($rows['hero.line1']['zh'])) {
            $z1 = (string) $rows['hero.line1']['zh'];
            if ($zh2File !== '' && $z1 !== $zh1File && mb_substr($z1, -mb_strlen($zh2File)) === $zh2File) {
                $need = true;
            }
        }
        if (! $need) {
            return;
        }

        $now = date('Y-m-d H:i:s');
        $srcZh = isset($rows['hero.line']['zh']) ? (string) $rows['hero.line']['zh'] : (isset($rows['hero.line1']['zh']) ? (string) $rows['hero.line1']['zh'] : '');
        $srcEn = isset($rows['hero.line']['en']) ? (string) $rows['hero.line']['en'] : (isset($rows['hero.line1']['en']) ? (string) $rows['hero.line1']['en'] : '');
        list($zh1, $zh2) = $splitPair($srcZh, $zh1File, $zh2File);
        list($en1, $en2) = $splitPair($srcEn, $en1File, $en2File);

        $upsert = function ($key, $zh, $en) use ($rows, $now) {
            if (isset($rows[$key])) {
                self::updateLangRow($key, array(
                    'zh' => $zh,
                    'en' => $en,
                    'grp' => 'hero',
                    'update_user' => 'system',
                    'update_time' => $now
                ));
            } else {
                self::insertLangRow(array(
                    'lang_key' => $key,
                    'grp' => 'hero',
                    'zh' => $zh,
                    'en' => $en,
                    'remark' => '',
                    'sorting' => $key === 'hero.line1' ? 10 : 11,
                    'create_user' => 'system',
                    'update_user' => 'system',
                    'create_time' => $now,
                    'update_time' => $now
                ));
            }
        };

        $upsert('hero.line1', $zh1, $en1);
        $upsert('hero.line2', $zh2, $en2);
        self::deleteLangKey('hero.line');
        self::clearLangCache();
    }

    private static function deleteLangKey($key)
    {
        $key = (string) $key;
        if ($key === '') {
            return false;
        }
        try {
            $type = Config::get('database.type');
            if ($type === 'mysqli' || $type === 'pdo_mysql') {
                $cfg = Config::get('database');
                $db = new \mysqli($cfg['host'], $cfg['user'], $cfg['passwd'], $cfg['dbname'], (int) $cfg['port']);
                if ($db->connect_errno) {
                    return false;
                }
                $db->set_charset('utf8mb4');
                $stmt = $db->prepare('DELETE FROM ay_lang WHERE lang_key=?');
                if (! $stmt) {
                    $db->close();
                    return false;
                }
                $stmt->bind_param('s', $key);
                $ok = $stmt->execute();
                $stmt->close();
                $db->close();
                return $ok;
            }
            $path = ROOT_PATH . Config::get('database.dbname');
            if (! is_file($path)) {
                return false;
            }
            $db = new \SQLite3($path);
            $db->busyTimeout(5000);
            $stmt = $db->prepare('DELETE FROM ay_lang WHERE lang_key=:k');
            $stmt->bindValue(':k', $key, SQLITE3_TEXT);
            $ok = (bool) $stmt->execute();
            $db->close();
            return $ok;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * 注册后台菜单「界面文案」并授予系统管理员角色。
     */
    public static function ensureLangMenu()
    {
        static $done = false;
        if ($done) {
            return;
        }
        $done = true;
        $type = Config::get('database.type');
        try {
            if ($type === 'mysqli' || $type === 'pdo_mysql') {
                self::ensureLangMenuMysql();
            } else {
                self::ensureLangMenuSqlite();
            }
        } catch (\Exception $e) {
            return;
        }
    }

    /**
     * 从 lang/*.php 补齐缺失键；不覆盖库中已有 zh/en（除非对方为空且文件有值）。
     * @return int 新增条数
     */
    public static function syncFromFiles($username = 'admin')
    {
        self::ensureLangReady();
        $zh = self::loadFile('zh');
        $en = self::loadFile('en');
        $keys = array_unique(array_merge(array_keys($zh), array_keys($en)));
        sort($keys);
        $existing = self::fetchAllRows();
        $now = date('Y-m-d H:i:s');
        $added = 0;
        foreach ($keys as $key) {
            $grp = self::keyGroup($key);
            $zhVal = isset($zh[$key]) ? (string) $zh[$key] : '';
            $enVal = isset($en[$key]) ? (string) $en[$key] : '';
            if (isset($existing[$key])) {
                $row = $existing[$key];
                $needZh = ($row['zh'] === '' || $row['zh'] === null) && $zhVal !== '';
                $needEn = ($row['en'] === '' || $row['en'] === null) && $enVal !== '';
                if ($needZh || $needEn) {
                    self::updateLangRow($key, array(
                        'zh' => $needZh ? $zhVal : $row['zh'],
                        'en' => $needEn ? $enVal : $row['en'],
                        'grp' => $grp,
                        'update_user' => $username,
                        'update_time' => $now
                    ));
                }
                continue;
            }
            if (self::insertLangRow(array(
                'lang_key' => $key,
                'grp' => $grp,
                'zh' => $zhVal,
                'en' => $enVal,
                'remark' => '',
                'sorting' => 255,
                'create_user' => $username,
                'update_user' => $username,
                'create_time' => $now,
                'update_time' => $now
            ))) {
                $added ++;
            }
        }
        self::clearLangCache();
        return $added;
    }

    public static function lang()
    {
        $lang = isset($_COOKIE[self::COOKIE]) ? $_COOKIE[self::COOKIE] : 'zh';
        return $lang === 'en' ? 'en' : 'zh';
    }

    public static function t($key)
    {
        return self::cachedRender('html', $key, function ($raw) {
            return self::renderHtml($raw);
        });
    }

    /** 属性、占位符：去掉样式标签，只留可见文字 */
    public static function tAttr($key)
    {
        return self::cachedRender('attr', $key, function ($raw) {
            return htmlspecialchars(self::plainText($raw), ENT_QUOTES, 'UTF-8');
        });
    }

    /** 脚本字符串：返回带引号的 JSON，避免引号或标签把页面脚本截断 */
    public static function tJs($key)
    {
        return self::cachedRender('js', $key, function ($raw) {
            return json_encode(self::plainText($raw), JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);
        });
    }

    /**
     * 界面文案入库前收成行内样式。
     * 文案会嵌在标题、段落、按钮里，段落标签改成换行，避免再套一层块级元素。
     *
     * @param string $html 已解码的编辑器 HTML
     * @return string 未转义的安全 HTML；纯文本保持原样
     */
    public static function normalizeRichText($html)
    {
        if (! is_string($html) || $html === '') {
            return '';
        }
        $html = str_replace(array("\r\n", "\r"), "\n", $html);
        if (strpos($html, '<') === false) {
            $text = str_replace("\xc2\xa0", ' ', $html);
            $visible = preg_replace('/\s+/u', '', $text);
            return $visible === '' ? '' : trim($text);
        }

        $html = preg_replace('/<br\b[^>]*>/i', "\n", $html);
        // 段落上的对齐改挂到行内元素，避免拆掉块标签时样式丢失
        $guard = 0;
        $prev = null;
        while ($prev !== $html && $guard < 20) {
            $prev = $html;
            $guard ++;
            $html = preg_replace_callback('/<(p|div|li|h[1-6])\b([^>]*)>(.*?)<\/\1>/is', function ($m) {
                $inner = $m[3];
                if (preg_match('/text-align\s*:\s*(center|right|justify)/i', $m[2], $am)) {
                    return '<span style="display:inline-block;width:100%;text-align:' . strtolower($am[1]) . '">' . $inner . "</span>\n";
                }
                return $inner . "\n";
            }, $html);
        }
        $html = preg_replace('/<\/\s*(?:p|div|h[1-6]|li|tr|blockquote)\s*>/i', "\n", $html);
        $html = preg_replace('/<\s*(?:p|div|h[1-6]|li|tr|ul|ol|table|tbody|thead|blockquote)\b[^>]*>/i', '', $html);
        $html = self::keepInlineTags($html);
        $html = str_replace("\xc2\xa0", ' ', $html);
        $html = preg_replace("/[ \t]+\n/", "\n", $html);
        $html = preg_replace("/\n{3,}/", "\n\n", $html);
        $html = trim($html);
        $visible = preg_replace('/\s+/u', '', strip_tags(str_replace("\n", '', $html)));
        if ($visible === '') {
            return '';
        }
        $html = str_replace("\n", '<br>', $html);
        $html = preg_replace('/^(?:<br>)+|(?:<br>)+$/i', '', $html);
        return $html;
    }

    private static function cachedRender($bucket, $key, $builder)
    {
        $id = $bucket . "\0" . self::lang() . "\0" . (string) $key;
        if (isset(self::$renderCache[$id])) {
            return self::$renderCache[$id];
        }
        $raw = self::lookup($key);
        $decoded = decode_string($raw);
        if (! is_string($decoded)) {
            $decoded = (string) $raw;
        }
        $html = $builder($decoded);
        self::$renderCache[$id] = $html;
        return $html;
    }

    private static function lookup($key)
    {
        $key = (string) $key;
        $packs = self::packs();
        $lang = self::lang();
        if (isset($packs[$lang][$key]) && $packs[$lang][$key] !== '') {
            return (string) $packs[$lang][$key];
        }
        if (isset($packs['zh'][$key])) {
            return (string) $packs['zh'][$key];
        }
        return $key;
    }

    /** $decoded 已是 decode_string 之后的文案。纯文本再解数字实体，避免 &#91; 被二次转义成可见字符。 */
    private static function renderHtml($decoded)
    {
        if (! preg_match('/<(?:span|strong|b|em|i|u|a|br|sub|sup|font)\b/i', $decoded)) {
            $text = html_entity_decode($decoded, ENT_QUOTES, 'UTF-8');
            return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
        }
        return self::rebuildInline($decoded, true);
    }

    private static function plainText($decoded)
    {
        $text = preg_replace('/<br\b[^>]*>/i', ' ', (string) $decoded);
        $text = html_entity_decode(strip_tags($text), ENT_QUOTES, 'UTF-8');
        $text = str_replace("\xc2\xa0", ' ', $text);
        $text = preg_replace('/\s+/u', ' ', $text);
        return trim($text);
    }

    /** 只保留行内标签，并洗掉事件属性。文本先不转义。 */
    private static function keepInlineTags($html)
    {
        $html = filter_html($html);
        $html = strip_tags($html, '<span><strong><b><em><i><u><a><sub><sup><font>');
        $html = html_entity_decode($html, ENT_QUOTES, 'UTF-8');
        $html = filter_html($html);
        $html = strip_tags($html, '<span><strong><b><em><i><u><a><sub><sup><font>');
        return self::rebuildInline($html, false);
    }

    private static function rebuildInline($html, $escapeText)
    {
        $allowed = 'span|strong|b|em|i|u|br|a|sub|sup|font';
        $parts = preg_split('/(<\/?(?:' . $allowed . ')\b[^>]*>)/i', (string) $html, -1, PREG_SPLIT_DELIM_CAPTURE);
        if (! is_array($parts)) {
            return $escapeText ? htmlspecialchars((string) $html, ENT_QUOTES, 'UTF-8') : (string) $html;
        }
        $out = '';
        foreach ($parts as $part) {
            if (preg_match('/^<\/?(?:' . $allowed . ')\b/i', $part)) {
                $out .= self::sanitizeInlineTag($part);
            } else {
                $out .= $escapeText ? htmlspecialchars($part, ENT_QUOTES, 'UTF-8') : $part;
            }
        }
        return $out;
    }

    private static function sanitizeInlineTag($tagHtml)
    {
        if (! preg_match('/^<\s*(\/)?\s*([a-z0-9]+)\b([^>]*)>$/i', trim($tagHtml), $m)) {
            return '';
        }
        $close = $m[1] === '/';
        $tag = strtolower($m[2]);
        $allowed = array('span', 'strong', 'b', 'em', 'i', 'u', 'br', 'a', 'sub', 'sup', 'font');
        if (! in_array($tag, $allowed, true)) {
            return '';
        }
        if ($close) {
            return $tag === 'br' ? '' : '</' . $tag . '>';
        }
        if ($tag === 'br') {
            return '<br>';
        }
        $attrs = $m[3];
        $keep = '';
        if (preg_match('/\sstyle\s*=\s*("|\')(.*?)\1/is', $attrs, $sm)) {
            $css = filter_inline_style_attr($sm[2]);
            $css = str_replace(array('"', '<', '>'), array("'", '', ''), $css);
            if ($css !== '') {
                $keep .= ' style="' . $css . '"';
            }
        }
        if ($tag === 'a' && preg_match('/\shref\s*=\s*("|\')(.*?)\1/is', $attrs, $hm)) {
            $href = self::safeHref($hm[2]);
            if ($href !== '') {
                $keep .= ' href="' . htmlspecialchars($href, ENT_QUOTES, 'UTF-8') . '"';
            }
        }
        if ($tag === 'font') {
            foreach (array('color', 'size', 'face') as $name) {
                if (preg_match('/\s' . $name . '\s*=\s*("|\')(.*?)\1/i', $attrs, $fm)) {
                    $val = preg_replace('/[^a-zA-Z0-9#,\.\-\s]/', '', $fm[2]);
                    if ($val !== '') {
                        $keep .= ' ' . $name . '="' . $val . '"';
                    }
                }
            }
        }
        return '<' . $tag . $keep . '>';
    }

    private static function safeHref($href)
    {
        $href = trim(html_entity_decode((string) $href, ENT_QUOTES, 'UTF-8'));
        if ($href === '' || preg_match('/[\s\x00-\x1f]/', $href)) {
            return '';
        }
        if (preg_match('#^(https?:|mailto:|tel:)#i', $href)) {
            return $href;
        }
        if ($href[0] === '/' || $href[0] === '#') {
            return $href;
        }
        return '';
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
        if (self::hasMedia($value)) {
            return true;
        }
        $text = trim(html_entity_decode(strip_tags($value), ENT_QUOTES, 'UTF-8'));
        $text = str_replace("\xc2\xa0", '', $text);
        $text = preg_replace('/\s+/u', '', $text);
        return $text !== '';
    }

    /**
     * 富文本里只有图片、没有可见文字时也算有内容。
     * 编辑器空段落（<p><br></p>、&nbsp;）不算。
     */
    public static function hasMedia($value)
    {
        if (! is_string($value) || $value === '') {
            return false;
        }
        return (bool) preg_match('/<(?:img|video|audio|iframe|source)\b/i', $value);
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
            'ay_content_sort' => array('name_en', 'subname_en', 'title_en', 'keywords_en', 'description_en', 'def1_en', 'def2_en', 'def3_en', 'pic_en'),
            'ay_content' => array('title_en', 'keywords_en', 'description_en', 'content_en', 'ico_en', 'tags_en', 'subtitle_en'),
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
                $have[$info['Field']] = strtolower((string) $info['Type']);
            }
            foreach ($cols as $col) {
                $ddl = self::mysqlColumnDdl($col);
                if (! isset($have[$col])) {
                    $db->query('ALTER TABLE `' . $table . '` ADD COLUMN `' . $col . '` ' . $ddl);
                } elseif ($col === 'content_en' && strpos($have[$col], 'text') === false) {
                    $db->query('ALTER TABLE `' . $table . '` MODIFY `' . $col . '` ' . $ddl);
                }
            }
        }
        $db->close();
    }

    private static function mysqlColumnDdl($col)
    {
        if ($col === 'content_en') {
            return 'MEDIUMTEXT NULL';
        }
        return "varchar(512) NOT NULL DEFAULT ''";
    }

    private static $packCache = null;

    private static $renderCache = array();

    private static function packs()
    {
        self::ensureLangReady();
        if (self::$packCache !== null) {
            return self::$packCache;
        }
        $cacheFile = self::langCacheFile();
        if (is_file($cacheFile)) {
            $cached = include $cacheFile;
            if (is_array($cached) && isset($cached['zh']) && isset($cached['en'])) {
                self::$packCache = $cached;
                return self::$packCache;
            }
        }

        $packs = array(
            'zh' => self::loadFile('zh'),
            'en' => self::loadFile('en')
        );
        // 库中非空值覆盖文件
        foreach (self::fetchAllRows() as $key => $row) {
            if (isset($row['zh']) && $row['zh'] !== '') {
                $packs['zh'][$key] = $row['zh'];
            }
            if (isset($row['en']) && $row['en'] !== '') {
                $packs['en'][$key] = $row['en'];
            }
        }
        self::$packCache = $packs;
        self::writeLangCache($packs);
        return self::$packCache;
    }

    private static function loadFile($lang)
    {
        $file = ROOT_PATH . '/lang/' . $lang . '.php';
        if (! is_file($file)) {
            return array();
        }
        $data = include $file;
        return is_array($data) ? $data : array();
    }

    private static function langCacheFile()
    {
        $dir = RUN_PATH . '/cache';
        if (! is_dir($dir)) {
            @mkdir($dir, 0777, true);
        }
        return $dir . '/joypo_lang.php';
    }

    private static function writeLangCache(array $packs)
    {
        $file = self::langCacheFile();
        $export = var_export($packs, true);
        @file_put_contents($file, "<?php\nreturn " . $export . ";\n", LOCK_EX);
    }

    public static function keyGroup($key)
    {
        $pos = strpos($key, '.');
        if ($pos === false) {
            return 'other';
        }
        return substr($key, 0, $pos);
    }

    private static function ensureLangTable()
    {
        $type = Config::get('database.type');
        if ($type === 'mysqli' || $type === 'pdo_mysql') {
            $cfg = Config::get('database');
            $db = new \mysqli($cfg['host'], $cfg['user'], $cfg['passwd'], $cfg['dbname'], (int) $cfg['port']);
            if ($db->connect_errno) {
                return;
            }
            $db->set_charset('utf8mb4');
            $db->query("CREATE TABLE IF NOT EXISTS `ay_lang` (
              `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
              `lang_key` varchar(100) NOT NULL,
              `grp` varchar(40) NOT NULL DEFAULT '',
              `zh` text NOT NULL,
              `en` text NOT NULL,
              `remark` varchar(255) NOT NULL DEFAULT '',
              `sorting` int(10) NOT NULL DEFAULT 255,
              `create_user` varchar(30) NOT NULL DEFAULT '',
              `update_user` varchar(30) NOT NULL DEFAULT '',
              `create_time` datetime DEFAULT NULL,
              `update_time` datetime DEFAULT NULL,
              PRIMARY KEY (`id`),
              UNIQUE KEY `ay_lang_key` (`lang_key`),
              KEY `ay_lang_grp` (`grp`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
            $db->close();
            return;
        }
        $path = ROOT_PATH . Config::get('database.dbname');
        if (! is_file($path)) {
            return;
        }
        $db = new \SQLite3($path);
        $db->busyTimeout(5000);
        $db->exec("CREATE TABLE IF NOT EXISTS ay_lang (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lang_key TEXT NOT NULL UNIQUE,
            grp TEXT NOT NULL DEFAULT '',
            zh TEXT NOT NULL DEFAULT '',
            en TEXT NOT NULL DEFAULT '',
            remark TEXT NOT NULL DEFAULT '',
            sorting INTEGER NOT NULL DEFAULT 255,
            create_user TEXT NOT NULL DEFAULT '',
            update_user TEXT NOT NULL DEFAULT '',
            create_time TEXT,
            update_time TEXT
        )");
        $db->close();
    }

    private static function ensureLangMenuMysql()
    {
        $cfg = Config::get('database');
        $db = new \mysqli($cfg['host'], $cfg['user'], $cfg['passwd'], $cfg['dbname'], (int) $cfg['port']);
        if ($db->connect_errno) {
            return;
        }
        $db->set_charset('utf8mb4');
        $url = '/admin/Lang/index';
        $mcode = 'M1091';
        $exists = $db->query("SELECT id FROM ay_menu WHERE url='" . $db->real_escape_string($url) . "' OR mcode='" . $mcode . "' LIMIT 1");
        if ($exists && $exists->num_rows < 1) {
            $now = date('Y-m-d H:i:s');
            $db->query("INSERT INTO ay_menu (mcode,pcode,name,url,sorting,status,shortcut,ico,create_user,update_user,create_time,update_time) VALUES (
                '{$mcode}','M156','界面文案','{$url}',206,1,1,'fa-language','admin','admin','{$now}','{$now}')");
            $db->query("INSERT INTO ay_menu_action (mcode,action) VALUES ('{$mcode}','mod')");
        }
        // 系统管理员角色授权
        $has = $db->query("SELECT id FROM ay_role_level WHERE rcode='R101' AND level='" . $db->real_escape_string($url) . "' LIMIT 1");
        if ($has && $has->num_rows < 1) {
            $db->query("INSERT INTO ay_role_level (rcode,level) VALUES ('R101','" . $db->real_escape_string($url) . "')");
        }
        $db->close();
        self::injectSessionLangPermission($url);
    }

    private static function ensureLangMenuSqlite()
    {
        $path = ROOT_PATH . Config::get('database.dbname');
        if (! is_file($path)) {
            return;
        }
        $db = new \SQLite3($path);
        $db->busyTimeout(5000);
        $url = '/admin/Lang/index';
        $mcode = 'M1091';
        $res = $db->querySingle("SELECT id FROM ay_menu WHERE url='$url' OR mcode='$mcode' LIMIT 1");
        if (! $res) {
            $now = date('Y-m-d H:i:s');
            $db->exec("INSERT INTO ay_menu (mcode,pcode,name,url,sorting,status,shortcut,ico,create_user,update_user,create_time,update_time) VALUES (
                '$mcode','M156','界面文案','$url',206,1,1,'fa-language','admin','admin','$now','$now')");
            $db->exec("INSERT INTO ay_menu_action (mcode,action) VALUES ('$mcode','mod')");
        }
        $has = $db->querySingle("SELECT id FROM ay_role_level WHERE rcode='R101' AND level='$url' LIMIT 1");
        if (! $has) {
            $db->exec("INSERT INTO ay_role_level (rcode,level) VALUES ('R101','$url')");
        }
        $db->close();
        self::injectSessionLangPermission($url);
    }

    /** 当前登录会话立即获得访问权，并补齐侧栏菜单树中的「界面文案」 */
    private static function injectSessionLangPermission($url)
    {
        if (! function_exists('session')) {
            return;
        }
        $levels = session('levels');
        if (! is_array($levels)) {
            return;
        }
        if (! in_array($url, $levels, true)) {
            $levels[] = $url;
            session('levels', $levels);
        }
        self::injectSessionLangMenu($url);
    }

    /** 把「界面文案」挂到当前会话 menu_tree（全局配置 M156 下），免重新登录 */
    private static function injectSessionLangMenu($url)
    {
        $tree = session('menu_tree');
        if (! is_array($tree) || ! $tree) {
            return;
        }
        foreach ($tree as $node) {
            if (! is_object($node) || empty($node->son) || ! is_array($node->son)) {
                continue;
            }
            foreach ($node->son as $son) {
                if (is_object($son) && isset($son->url) && $son->url === $url) {
                    return; // 已有
                }
            }
        }
        $item = new \stdClass();
        $item->id = 0;
        $item->mcode = 'M1091';
        $item->pcode = 'M156';
        $item->name = '界面文案';
        $item->url = $url;
        $item->shortcut = 1;
        $item->ico = 'fa-language';
        $item->sorting = 206;
        $item->status = 1;
        $attached = false;
        foreach ($tree as $node) {
            if (is_object($node) && isset($node->mcode) && $node->mcode === 'M156') {
                if (! is_array($node->son)) {
                    $node->son = array();
                }
                $node->son[] = $item;
                $attached = true;
                break;
            }
        }
        if (! $attached) {
            // 找不到父级时，挂到第一个有 son 的节点，避免完全看不见
            foreach ($tree as $node) {
                if (is_object($node) && isset($node->son) && is_array($node->son)) {
                    $node->son[] = $item;
                    $attached = true;
                    break;
                }
            }
        }
        if ($attached) {
            session('menu_tree', $tree);
        }
    }

    private static function fetchAllRows()
    {
        $rows = array();
        try {
            $type = Config::get('database.type');
            if ($type === 'mysqli' || $type === 'pdo_mysql') {
                $cfg = Config::get('database');
                $db = new \mysqli($cfg['host'], $cfg['user'], $cfg['passwd'], $cfg['dbname'], (int) $cfg['port']);
                if ($db->connect_errno) {
                    return $rows;
                }
                $db->set_charset('utf8mb4');
                // 表可能尚未创建
                $check = $db->query("SHOW TABLES LIKE 'ay_lang'");
                if (! $check || $check->num_rows < 1) {
                    $db->close();
                    return $rows;
                }
                $res = $db->query('SELECT lang_key,zh,en,grp FROM ay_lang');
                if ($res) {
                    while ($r = $res->fetch_assoc()) {
                        $rows[$r['lang_key']] = $r;
                    }
                }
                $db->close();
                return $rows;
            }
            $path = ROOT_PATH . Config::get('database.dbname');
            if (! is_file($path)) {
                return $rows;
            }
            $db = new \SQLite3($path);
            $db->busyTimeout(5000);
            $res = @$db->query('SELECT lang_key,zh,en,grp FROM ay_lang');
            if ($res) {
                while ($r = $res->fetchArray(SQLITE3_ASSOC)) {
                    $rows[$r['lang_key']] = $r;
                }
            }
            $db->close();
        } catch (\Exception $e) {
            return array();
        }
        return $rows;
    }

    private static function insertLangRow(array $data)
    {
        try {
            $type = Config::get('database.type');
            if ($type === 'mysqli' || $type === 'pdo_mysql') {
                $cfg = Config::get('database');
                $db = new \mysqli($cfg['host'], $cfg['user'], $cfg['passwd'], $cfg['dbname'], (int) $cfg['port']);
                if ($db->connect_errno) {
                    return false;
                }
                $db->set_charset('utf8mb4');
                $stmt = $db->prepare('INSERT INTO ay_lang (lang_key,grp,zh,en,remark,sorting,create_user,update_user,create_time,update_time) VALUES (?,?,?,?,?,?,?,?,?,?)');
                if (! $stmt) {
                    $db->close();
                    return false;
                }
                $langKey = (string) $data['lang_key'];
                $grp = (string) $data['grp'];
                $zh = (string) $data['zh'];
                $en = (string) $data['en'];
                $remark = (string) $data['remark'];
                $sorting = (int) $data['sorting'];
                $cu = (string) $data['create_user'];
                $uu = (string) $data['update_user'];
                $ct = (string) $data['create_time'];
                $ut = (string) $data['update_time'];
                $stmt->bind_param('sssssissss', $langKey, $grp, $zh, $en, $remark, $sorting, $cu, $uu, $ct, $ut);
                $ok = $stmt->execute();
                $stmt->close();
                $db->close();
                return $ok;
            }
            $path = ROOT_PATH . Config::get('database.dbname');
            if (! is_file($path)) {
                return false;
            }
            $db = new \SQLite3($path);
            $db->busyTimeout(5000);
            $stmt = $db->prepare('INSERT INTO ay_lang (lang_key,grp,zh,en,remark,sorting,create_user,update_user,create_time,update_time) VALUES (:k,:g,:zh,:en,:r,:s,:cu,:uu,:ct,:ut)');
            $stmt->bindValue(':k', $data['lang_key'], SQLITE3_TEXT);
            $stmt->bindValue(':g', $data['grp'], SQLITE3_TEXT);
            $stmt->bindValue(':zh', $data['zh'], SQLITE3_TEXT);
            $stmt->bindValue(':en', $data['en'], SQLITE3_TEXT);
            $stmt->bindValue(':r', $data['remark'], SQLITE3_TEXT);
            $stmt->bindValue(':s', $data['sorting'], SQLITE3_INTEGER);
            $stmt->bindValue(':cu', $data['create_user'], SQLITE3_TEXT);
            $stmt->bindValue(':uu', $data['update_user'], SQLITE3_TEXT);
            $stmt->bindValue(':ct', $data['create_time'], SQLITE3_TEXT);
            $stmt->bindValue(':ut', $data['update_time'], SQLITE3_TEXT);
            $ok = (bool) $stmt->execute();
            $db->close();
            return $ok;
        } catch (\Exception $e) {
            return false;
        }
    }

    private static function updateLangRow($key, array $data)
    {
        try {
            $type = Config::get('database.type');
            if ($type === 'mysqli' || $type === 'pdo_mysql') {
                $cfg = Config::get('database');
                $db = new \mysqli($cfg['host'], $cfg['user'], $cfg['passwd'], $cfg['dbname'], (int) $cfg['port']);
                if ($db->connect_errno) {
                    return false;
                }
                $db->set_charset('utf8mb4');
                $stmt = $db->prepare('UPDATE ay_lang SET zh=?, en=?, grp=?, update_user=?, update_time=? WHERE lang_key=?');
                if (! $stmt) {
                    $db->close();
                    return false;
                }
                $zh = (string) $data['zh'];
                $en = (string) $data['en'];
                $grp = (string) $data['grp'];
                $uu = (string) $data['update_user'];
                $ut = (string) $data['update_time'];
                $langKey = (string) $key;
                $stmt->bind_param('ssssss', $zh, $en, $grp, $uu, $ut, $langKey);
                $ok = $stmt->execute();
                $stmt->close();
                $db->close();
                return $ok;
            }
            $path = ROOT_PATH . Config::get('database.dbname');
            if (! is_file($path)) {
                return false;
            }
            $db = new \SQLite3($path);
            $db->busyTimeout(5000);
            $stmt = $db->prepare('UPDATE ay_lang SET zh=:zh, en=:en, grp=:g, update_user=:uu, update_time=:ut WHERE lang_key=:k');
            $stmt->bindValue(':zh', $data['zh'], SQLITE3_TEXT);
            $stmt->bindValue(':en', $data['en'], SQLITE3_TEXT);
            $stmt->bindValue(':g', $data['grp'], SQLITE3_TEXT);
            $stmt->bindValue(':uu', $data['update_user'], SQLITE3_TEXT);
            $stmt->bindValue(':ut', $data['update_time'], SQLITE3_TEXT);
            $stmt->bindValue(':k', $key, SQLITE3_TEXT);
            $ok = (bool) $stmt->execute();
            $db->close();
            return $ok;
        } catch (\Exception $e) {
            return false;
        }
    }
}
