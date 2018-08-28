//BUI手机号码验证
Form.Rules.add({
	name : 'phoneNumber',
	msg : '请填写正确的手机号码！',
	validator : function(value,baseValue,formatMsg){
		var regexp = /1(?:[38]\d|4[57]|5[01256789])\d{8}/;
		if(value && !regexp.test(value)){
		return formatMsg;
		}
		}
});
//BUI身份证验证
Form.Rules.add({
	name : 'idCard',
	msg : '身份证输入不合法！',
	validator : function(value,baseValue,formatMsg){
		var regexp = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;  
		if(value && !regexp.test(value)){
			return formatMsg;
		}  
	
	}
});