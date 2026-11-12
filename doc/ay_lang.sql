-- 前台界面文案（中英文）后台可编辑
-- 读取优先级：库中非空值 > lang/zh.php|en.php 文件兜底
SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS `ay_lang` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `lang_key` varchar(100) NOT NULL COMMENT '文案键，如 home.rd',
  `grp` varchar(40) NOT NULL DEFAULT '' COMMENT '分组前缀',
  `zh` text NOT NULL COMMENT '中文',
  `en` text NOT NULL COMMENT '英文',
  `remark` varchar(255) NOT NULL DEFAULT '' COMMENT '备注',
  `sorting` int(10) NOT NULL DEFAULT '255',
  `create_user` varchar(30) NOT NULL DEFAULT '',
  `update_user` varchar(30) NOT NULL DEFAULT '',
  `create_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ay_lang_key` (`lang_key`),
  KEY `ay_lang_grp` (`grp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='前台界面文案';
