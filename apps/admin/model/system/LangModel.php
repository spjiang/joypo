<?php
/**
 * 前台界面文案（语言包）模型
 */
namespace app\admin\model\system;

use core\basic\Model;
use app\common\I18n;

class LangModel extends Model
{

    public function getList($grp = '', $keyword = '')
    {
        $query = parent::table('ay_lang')->order('grp ASC,sorting ASC,lang_key ASC');
        if ($grp !== '') {
            $grp = addslashes($grp);
            $query->where("grp='$grp'");
        }
        if ($keyword !== '') {
            $keyword = addslashes($keyword);
            $query->where("(lang_key LIKE '%$keyword%' OR zh LIKE '%$keyword%' OR en LIKE '%$keyword%' OR remark LIKE '%$keyword%')");
        }
        return $query->select();
    }

    public function getGroups()
    {
        return parent::table('ay_lang')->group('grp')
            ->order('grp ASC')
            ->column('grp');
    }

    public function getCount()
    {
        return (int) parent::table('ay_lang')->count();
    }

    public function modRow($id, array $data)
    {
        return parent::table('ay_lang')->where("id=$id")
            ->autoTime()
            ->update($data);
    }

    public function modByKey($key, array $data)
    {
        $key = addslashes($key);
        return parent::table('ay_lang')->where("lang_key='$key'")
            ->autoTime()
            ->update($data);
    }

    public function syncFromFiles($username = 'admin')
    {
        return I18n::syncFromFiles($username);
    }
}
