-- subtitle_en
SET @exist := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='ay_content' AND COLUMN_NAME='subtitle_en');
SET @sql := IF(@exist=0, 'ALTER TABLE ay_content ADD COLUMN subtitle_en varchar(512) NOT NULL DEFAULT ''''', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

INSERT INTO ay_model (mcode,name,type,urlname,listtpl,contenttpl,status,issystem,create_user,update_user,create_time,update_time)
SELECT '7','发展历程','2','list','','news.html','1','0','admin','admin',NOW(),NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM ay_model WHERE mcode='7');

INSERT INTO ay_content_sort (
  acode, mcode, pcode, scode, name, listtpl, contenttpl, status, outlink, subname, ico, pic,
  title, keywords, description, filename, sorting, create_user, update_user, create_time, update_time,
  gtype, gid, gnote, def1, def2, def3, name_en, subname_en, title_en, keywords_en, description_en,
  def1_en, def2_en, def3_en, pic_en
) SELECT
  'cn', '7', '1', '29', '发展历程', '', 'news.html', '1', '', '', '', '',
  '', '', '', 'fzls', 200, 'admin', 'admin', NOW(), NOW(),
  '4', '0', '', '', '', '', 'History', '', '', '', '',
  '', '', '', ''
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM ay_content_sort WHERE scode='29');

DELETE FROM ay_content WHERE scode='29' AND create_user='admin' AND title REGEXP '^[0-9]{4}$';

INSERT INTO ay_content (
  acode, scode, subscode, title, titlecolor, subtitle, filename, author, source, outlink, date,
  ico, pics, content, tags, enclosure, keywords, description, sorting, status, istop, isrecommend, isheadline,
  visits, likes, oppose, create_user, update_user, create_time, update_time, gtype, gid, gnote, picstitle,
  title_en, keywords_en, description_en, content_en, ico_en, tags_en, subtitle_en
) VALUES
('cn','29','','2026','#333333','战略聚焦','','超级管理员','本站','',NOW(),
 '/skin/images/fz1.png','','','','','','战略聚焦，强化能力',1,'1','0','0','0',
 0,0,0,'admin','admin',NOW(),NOW(),'4','0','','',
 '2026','','Strategic focus, strengthening capabilities','','','','Strategic Focus'),
('cn','29','','2025','#333333','产能倍增','','超级管理员','本站','',NOW(),
 '/skin/images/fz2.png','','','','','','久普能源新厂搬迁，产能倍增',2,'1','0','0','0',
 0,0,0,'admin','admin',NOW(),NOW(),'4','0','','',
 '2025','','Joypo Energy relocates to a new plant, doubling capacity','','','','Capacity Doubled'),
('cn','29','','2024','#333333','湖南省专精特新企业','','超级管理员','本站','',NOW(),
 '/skin/images/fz3.png','','','','','','久普能源荣获湖南省专精特新企业',3,'1','0','0','0',
 0,0,0,'admin','admin',NOW(),NOW(),'4','0','','',
 '2024','','Joypo Energy named a Hunan Specialized, Refined, Distinctive and Innovative Enterprise','','','','Hunan Specialized & Innovative Enterprise'),
('cn','29','','2023','#333333','精益管理','','超级管理员','本站','',NOW(),
 '/skin/images/fz4.png','','','','','','数字化管理，生产导入MES系统',4,'1','0','0','0',
 0,0,0,'admin','admin',NOW(),NOW(),'4','0','','',
 '2023','','Digital management with MES introduced into production','','','','Lean Management'),
('cn','29','','2022','#333333','开拓海外市场','','超级管理员','本站','',NOW(),
 '/skin/images/fz5.png','','','','','','开拓海外市场，获得CE、IEC、CB等国际产品认证',5,'1','0','0','0',
 0,0,0,'admin','admin',NOW(),NOW(),'4','0','','',
 '2022','','Expanding overseas markets with CE, IEC, CB and other international certifications','','','','Expanding Overseas'),
('cn','29','','2021','#333333','自主研发','','超级管理员','本站','',NOW(),
 '/skin/images/fz6.png','','','','','','久普能源荣获高新技术企业',6,'1','0','0','0',
 0,0,0,'admin','admin',NOW(),NOW(),'4','0','','',
 '2021','','Joypo Energy recognized as a High-tech Enterprise','','','','Independent R&D'),
('cn','29','','2020','#333333','技术钻研','','超级管理员','本站','',NOW(),
 '/skin/images/fz7.png','','','','','','久普通过ISO三大质量管理体系（ISO9001、ISO14001、ISO45001）',7,'1','0','0','0',
 0,0,0,'admin','admin',NOW(),NOW(),'4','0','','',
 '2020','','Joypo certified to ISO 9001, ISO 14001 and ISO 45001','','','','Technical Excellence'),
('cn','29','','2019','#333333','公司成立','','超级管理员','本站','',NOW(),
 '/skin/images/fz8.png','','','','','','湖南久普能源科技有限公司',8,'1','0','0','0',
 0,0,0,'admin','admin',NOW(),NOW(),'4','0','','',
 '2019','','Hunan Joypo Energy Technology Co., Ltd.','','','','Company Founded');
