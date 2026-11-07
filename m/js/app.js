function check(form) {

	if (form.lx_name.value == '') {
		alert("请输入姓名!");
		form.lx_name.focus();
		return false;
	}
	if (form.lx_phone.value == '') {
		alert("请添加手机！");
		return false;
	}
	if($.trim($("#lx_phone").val())!="")
		 {
		  var reg = /^1[3|4|5|8][0-9]\d{4,8}$/;
		  if(!reg.test($.trim($('#lx_phone').val())))
		  {
		   alert("手机号码格式不对！");
		   $("#lx_phone").focus()
		   return false;
		  }
		 }
	if (form.lx_qq.value == '') {
		alert("请填写完微信再进行提交！");
		form.lx_qq.focus();
		return false;
	}
	if (form.lx_content.value == '') {
		alert("请填写完内容再进行提交！");
		form.lx_content.focus();
		return false;
	}
	return true;
} 