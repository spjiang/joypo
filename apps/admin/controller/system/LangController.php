<?php
/**
 * 前台界面文案管理（中英文语言包）
 */
namespace app\admin\controller\system;

use core\basic\Controller;
use app\admin\model\system\LangModel;
use app\common\I18n;

class LangController extends Controller
{

    private $model;

    public function __construct()
    {
        // 与其它后台控制器一致：Kernel 会挂载 AdminController 鉴权；
        // 此处补齐语言表/菜单，并刷新当前会话侧栏。
        $this->model = new LangModel();
        I18n::ensureLangReady();
        I18n::ensureLangMenu();
    }

    public function index()
    {
        if ($_POST) {
            $action = post('action');
            if ($action === 'sync') {
                $n = $this->model->syncFromFiles(session('username') ?: 'admin');
                I18n::clearLangCache();
                success('已从语言包文件同步，新增/补全 ' . $n . ' 条。', $this->langIndexUrl());
            }

            $zh = post('zh', 'array', false, '', array());
            $en = post('en', 'array', false, '', array());
            $remark = post('remark', 'array', false, '', array());
            if (! is_array($zh)) {
                $zh = array();
            }
            if (! is_array($en)) {
                $en = array();
            }
            if (! is_array($remark)) {
                $remark = array();
            }

            $updated = 0;
            foreach ($zh as $id => $zhVal) {
                $id = (int) $id;
                if ($id < 1) {
                    continue;
                }
                $data = array(
                    'zh' => isset($zh[$id]) ? (string) $zh[$id] : '',
                    'en' => isset($en[$id]) ? (string) $en[$id] : '',
                    'remark' => isset($remark[$id]) ? (string) $remark[$id] : '',
                    'update_user' => session('username') ?: 'admin'
                );
                if ($this->model->modRow($id, $data)) {
                    $updated ++;
                }
            }
            I18n::clearLangCache();
            $this->log('修改界面文案成功，更新 ' . $updated . ' 条');
            $g = trim((string) (post('filter_grp') ?: get('grp', 'var')));
            $k = trim((string) (post('filter_keyword') ?: get('keyword', 'vars')));
            success('保存成功！', $this->langIndexUrl($g, $k));
        }

        // 首次打开自动从文件补齐缺失 key
        if ($this->model->getCount() < 1) {
            $this->model->syncFromFiles(session('username') ?: 'admin');
        }

        $grp = trim((string) get('grp', 'var'));
        $keyword = trim((string) get('keyword', 'vars'));
        $labels = I18n::groupLabels();
        $groups = $this->model->getGroups();
        $groupOptions = array();
        if (is_array($groups)) {
            foreach ($groups as $g) {
                $code = is_object($g) ? $g->grp : $g;
                $opt = new \stdClass();
                $opt->code = $code;
                $opt->label = isset($labels[$code]) ? $labels[$code] : $code;
                $groupOptions[] = $opt;
            }
        }
        $rows = $this->model->getList($grp, $keyword);
        if (is_array($rows)) {
            foreach ($rows as $row) {
                $g = isset($row->grp) ? $row->grp : '';
                $row->grp_label = isset($labels[$g]) ? $labels[$g] : $g;
            }
        }

        $this->assign('grp', $grp);
        $this->assign('keyword', $keyword);
        $this->assign('group_options', $groupOptions);
        $this->assign('langs', $rows);
        $this->assign('lang_count', is_array($rows) ? count($rows) : 0);
        $this->display('system/lang.html');
    }

    /** 兼容模式已有 ?p=，附加参数只能用 &，禁止再拼 ? */
    private function langIndexUrl($grp = '', $keyword = '')
    {
        $base = url('/admin/Lang/index');
        $parts = array();
        if ($grp !== '') {
            $parts[] = 'grp=' . rawurlencode($grp);
        }
        if ($keyword !== '') {
            $parts[] = 'keyword=' . rawurlencode($keyword);
        }
        if (! $parts) {
            return $base;
        }
        $sep = (strpos($base, '?') !== false) ? '&' : '?';
        return $base . $sep . implode('&', $parts);
    }
}
