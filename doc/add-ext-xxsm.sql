-- 体系优势轮播弹窗：消息说明字段（中文 / 英文）
-- 模型：新闻(mcode=2)，栏目 scode=23
SET NAMES utf8mb4;

ALTER TABLE ay_content_ext
  ADD COLUMN IF NOT EXISTS ext_xxsm varchar(1000) NULL COMMENT '消息说明' AFTER ext_cpcs;

ALTER TABLE ay_content_ext
  ADD COLUMN IF NOT EXISTS ext_xxsm_en varchar(1000) NULL COMMENT '消息说明英文' AFTER ext_xxsm;

INSERT INTO ay_extfield (mcode, name, type, value, description, sorting)
SELECT '2', 'ext_xxsm', '2', '', '消息说明', '10'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM ay_extfield WHERE name='ext_xxsm');

INSERT INTO ay_extfield (mcode, name, type, value, description, sorting)
SELECT '2', 'ext_xxsm_en', '2', '', '消息说明英文', '11'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM ay_extfield WHERE name='ext_xxsm_en');
