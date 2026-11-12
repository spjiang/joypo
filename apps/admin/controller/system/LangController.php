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
                success('已从语言包文件同步，新增/补全 ' . $n . ' 条。', url('/admin/Lang/index'));
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
            $qs = '';
            if ($g = get('grp')) {
                $qs .= '&grp=' . urlencode($g);
            }
            if ($k = get('keyword')) {
                $qs .= '&keyword=' . urlencode($k);
            }
            success('保存成功！', url('/admin/Lang/index') . $qs);
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
}
