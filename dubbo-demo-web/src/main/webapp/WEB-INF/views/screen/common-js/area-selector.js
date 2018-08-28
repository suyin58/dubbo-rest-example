
(function(host) {
	var window = host || window,
	doc = document,
	selectedValue ={},
	popUpProvinceFrame = null,
	selectEventProxy = null,
	hotEventProxy = null,
	provinceCloseProxy=null,
	scrollEventProxy = null,
	toString = Object.prototype.toString,
	province = {
		安徽: [{
			name: "合肥市",
			spell: "安徽省"
		},{
			name: "芜湖市",
			spell: "安徽省"
		},{
			name: "蚌埠市",
			spell: "安徽省"
		},{
			name: "淮南市",
			spell: "安徽省"
		},{
			name: "马鞍山市",
			spell: "安徽省"
		},{
			name: "淮北市",
			spell: "安徽省"
		},{
			name: "铜陵市",
			spell: "安徽省"
		},{
			name: "安庆市",
			spell: "安徽省"
		},{
			name: "黄山市",
			spell: "安徽省"
		},{
			name: "滁州市",
			spell: "安徽省"
		},{
			name: "阜阳市",
			spell: "安徽省"
		},{
			name: "宿州市",
			spell: "安徽省"
		},{
			name: "巢湖市",
			spell: "安徽省"
		},{
			name: "六安市",
			spell: "安徽省"
		},{
			name: "亳州市",
			spell: "安徽省"
		},{
			name: "池州市",
			spell: "安徽省"
		},{
			name: "宣城市",
			spell: "安徽省"
		}],
		福建: [{
			name: "福州市",
			spell: "福建省"
		},{
			name: "厦门市",
			spell: "福建省"
		},{
			name: "莆田市",
			spell: "福建省"
		},{
			name: "三明市",
			spell: "福建省"
		},{
			name: "泉州市",
			spell: "福建省"
		},{
			name: "漳州市",
			spell: "福建省"
		},{
			name: "南平市",
			spell: "福建省"
		},{
			name: "龙岩市",
			spell: "福建省"
		},{
			name: "宁德市",
			spell: "福建省"
		}],
		甘肃: [{
			name: "兰州市",
			spell: "甘肃省"
		},{
			name: "嘉峪关市",
			spell: "甘肃省"
		},{
			name: "金昌市",
			spell: "甘肃省"
		},{
			name: "白银市",
			spell: "甘肃省"
		},{
			name: "天水市",
			spell: "甘肃省"
		},{
			name: "武威市",
			spell: "甘肃省"
		},{
			name: "张掖市",
			spell: "甘肃省"
		},{
			name: "平凉市",
			spell: "甘肃省"
		},{
			name: "酒泉市",
			spell: "甘肃省"
		},{
			name: "庆阳市",
			spell: "甘肃省"
		},{
			name: "定西市",
			spell: "甘肃省"
		},{
			name: "陇南市",
			spell: "甘肃省"
		},{
			name: "临夏回族自治州",
			spell: "甘肃省"
		},{
			name: "甘南藏族自治州",
			spell: "甘肃省"
		}],
		广东: [{
			name: "广州市",
			spell: "广东省"
		},{
			name: "深圳市",
			spell: "广东省"
		},{
			name: "珠海市",
			spell: "广东省"
		},{
			name: "汕头市",
			spell: "广东省"
		},{
			name: "韶关市",
			spell: "广东省"
		},{
			name: "佛山市",
			spell: "广东省"
		},{
			name: "江门市",
			spell: "广东省"
		},{
			name: "湛江市",
			spell: "广东省"
		},{
			name: "茂名市",
			spell: "广东省"
		},{
			name: "肇庆市",
			spell: "广东省"
		},{
			name: "惠州市",
			spell: "广东省"
		},{
			name: "梅州市",
			spell: "广东省"
		},{
			name: "汕尾市",
			spell: "广东省"
		},{
			name: "河源市",
			spell: "广东省"
		},{
			name: "阳江市",
			spell: "广东省"
		},{
			name: "清远市",
			spell: "广东省"
		},{
			name: "东莞市",
			spell: "广东省"
		},{
			name: "中山市",
			spell: "广东省"
		},{
			name: "潮州市",
			spell: "广东省"
		},{
			name: "揭阳市",
			spell: "广东省"
		},{
			name: "云浮市",
			spell: "广东省"
		},{
			name: "佛山市",
			spell: "广东省"
		}],
		
		广西: [{
			name: "南宁市",
			spell: "广西壮族自治区"
		},{
			name: "柳州市",
			spell: "广西壮族自治区"
		},{
			name: "桂林市",
			spell: "广西壮族自治区"
		},{
			name: "梧州市",
			spell: "广西壮族自治区"
		},{
			name: "北海市",
			spell: "广西壮族自治区"
		},{
			name: "防城港市",
			spell: "广西壮族自治区"
		},{
			name: "钦州市",
			spell: "广西壮族自治区"
		},{
			name: "贵港市",
			spell: "广西壮族自治区"
		},{
			name: "玉林市",
			spell: "广西壮族自治区"
		},{
			name: "百色市",
			spell: "广西壮族自治区"
		},{
			name: "贺州市",
			spell: "广西壮族自治区"
		},{
			name: "河池市",
			spell: "广西壮族自治区"
		},{
			name: "来宾市",
			spell: "广西壮族自治区"
		},{
			name: "崇左市",
			spell: "广西壮族自治区"
		}],
		贵州: [{
			name: "贵阳市",
			spell: "贵州省"
		},{
			name: "六盘水市",
			spell: "贵州省"
		},{
			name: "遵义市",
			spell: "贵州省"
		},{
			name: "安顺市",
			spell: "贵州省"
		},{
			name: "铜仁地区",
			spell: "贵州省"
		},{
			name: "黔西南布依族苗族自治州",
			spell: "贵州省"
		},{
			name: "毕节地区",
			spell: "贵州省"
		},{
			name: "黔东南苗族侗族自治州",
			spell: "贵州省"
		},{
			name: "黔南布依族苗族自治州",
			spell: "贵州省"
		}],
		海南: [{
			name: "海口市",
			spell: "海南省"
		},{
			name: "三亚市",
			spell: "海南省"
		}],
		
		河北: [{
			name: "石家庄市",
			spell: "河北省"
		},{
			name: "唐山市",
			spell: "河北省"
		},{
			name: "秦皇岛市",
			spell: "河北省"
		},{
			name: "邯郸市",
			spell: "河北省"
		},{
			name: "邢台市",
			spell: "河北省"
		},{
			name: "保定市",
			spell: "河北省"
		},{
			name: "张家口市",
			spell: "河北省"
		},{
			name: "承德市",
			spell: "河北省"
		},{
			name: "沧州市",
			spell: "河北省"
		},{
			name: "廊坊市",
			spell: "河北省"
		},{
			name: "衡水市",
			spell: "河北省"
		}],
		河南: [{
			name: "郑州市",
			spell: "河南省"
		},{
			name: "开封市",
			spell: "河南省"
		},{
			name: "洛阳市",
			spell: "河南省"
		},{
			name: "平顶山市",
			spell: "河南省"
		},{
			name: "鹤壁市",
			spell: "河南省"
		},{
			name: "新乡市",
			spell: "河南省"
		},{
			name: "焦作市",
			spell: "河南省"
		},{
			name: "濮阳市",
			spell: "河南省"
		},{
			name: "许昌市",
			spell: "河南省"
		},{
			name: "漯河市",
			spell: "河南省"
		},{
			name: "三门峡市",
			spell: "河南省"
		},{
			name: "南阳市",
			spell: "河南省"
		},{
			name: "商丘市",
			spell: "河南省"
		},{
			name: "信阳市",
			spell: "河南省"
		},{
			name: "周口市",
			spell: "河南省"
		},{
			name: "驻马店市",
			spell: "河南省"
		}],
		黑龙江: [{
			name: "哈尔滨市",
			spell: "黑龙江省"
		},
		{
			name: "齐齐哈尔市",
			spell: "黑龙江省"
		},
		{
			name: "鸡西市",
			spell: "黑龙江省"
		},
		{
			name: "鹤岗市",
			spell: "黑龙江省"
		},
		{
			name: "双鸭山市",
			spell: "黑龙江省"
		},
		{
			name: "大庆市",
			spell: "黑龙江省"
		},
		{
			name: "伊春市",
			spell: "黑龙江省"
		},
		{
			name: "佳木斯市",
			spell: "黑龙江省"
		},
		{
			name: "七台河市",
			spell: "黑龙江省"
		},
		{
			name: "牡丹江市",
			spell: "黑龙江省"
		},
		{
			name: "黑河市",
			spell: "黑龙江省"
		},
		{
			name: "绥化市",
			spell: "黑龙江省"
		},
		{
			name: "大兴安岭地区",
			spell: "黑龙江省"
		}],
		湖北: [{
			name: "武汉市",
			spell: "湖北省"
		},{
			name: "黄石市",
			spell: "湖北省"
		},{
			name: "十堰市",
			spell: "湖北省"
		},{
			name: "宜昌市",
			spell: "湖北省"
		},{
			name: "襄樊市",
			spell: "湖北省"
		},{
			name: "鄂州市",
			spell: "湖北省"
		},{
			name: "荆门市",
			spell: "湖北省"
		},{
			name: "孝感市",
			spell: "湖北省"
		},{
			name: "荆州市",
			spell: "湖北省"
		},{
			name: "黄冈市",
			spell: "湖北省"
		},{
			name: "咸宁市",
			spell: "湖北省"
		},{
			name: "随州市",
			spell: "湖北省"
		},{
			name: "恩施土家族苗族自治州",
			spell: "湖北省"
		},{
			name: "神农架",
			spell: "湖北省"
		}],
		湖南: [{
			name: "长沙市",
			spell: "湖南省"
		},{
			name: "株洲市",
			spell: "湖南省"
		},{
			name: "湘潭市",
			spell: "湖南省"
		},{
			name: "衡阳市",
			spell: "湖南省"
		},{
			name: "邵阳市",
			spell: "湖南省"
		},{
			name: "岳阳市",
			spell: "湖南省"
		},{
			name: "常德市",
			spell: "湖南省"
		},{
			name: "张家界市",
			spell: "湖南省"
		},{
			name: "益阳市",
			spell: "湖南省"
		},{
			name: "郴州市",
			spell: "湖南省"
		},{
			name: "永州市",
			spell: "湖南省"
		},{
			name: "怀化市",
			spell: "湖南省"
		},{
			name: "娄底市",
			spell: "湖南省"
		},{
			name: "湘西土家族苗族自治州",
			spell: "湖南省"
		}],
		江苏: [{
			name: "南京市",
			spell: "江苏省"
		},{
			name: "无锡市",
			spell: "江苏省"
		},{
			name: "徐州市",
			spell: "江苏省"
		},{
			name: "常州市",
			spell: "江苏省"
		},{
			name: "苏州市",
			spell: "江苏省"
		},{
			name: "南通市",
			spell: "江苏省"
		},{
			name: "连云港市",
			spell: "江苏省"
		},{
			name: "淮安市",
			spell: "江苏省"
		},{
			name: "盐城市",
			spell: "江苏省"
		},{
			name: "扬州市",
			spell: "江苏省"
		},{
			name: "镇江市",
			spell: "江苏省"
		},{
			name: "泰州市",
			spell: "江苏省"
		},{
			name: "宿迁市",
			spell: "江苏省"
		}],
		
		
		辽宁: [{
			name: "沈阳市",
			spell: "辽宁省"
		},
		{
			name: "大连市",
			spell: "辽宁省"
		},
		{
			name: "鞍山市",
			spell: "辽宁省"
		},
		{
			name: "抚顺市",
			spell: "辽宁省"
		},
		{
			name: "本溪市",
			spell: "辽宁省"
		},
		{
			name: "丹东市",
			spell: "辽宁省"
		},
		{
			name: "锦州市",
			spell: "辽宁省"
		},
		{
			name: "营口市",
			spell: "辽宁省"
		},
		{
			name: "阜新市",
			spell: "辽宁省"
		},
		{
			name: "辽阳市",
			spell: "辽宁省"
		},
		{
			name: "盘锦市",
			spell: "辽宁省"
		},
		{
			name: "铁岭市",
			spell: "辽宁省"
		},
		{
			name: "朝阳市",
			spell: "辽宁省"
		},
		{
			name: "葫芦岛市",
			spell: "辽宁省"
		}],
		
		
		江西: [{
			name: "南昌市",
			spell: "江西省"
		},
		{
			name: "景德镇市",
			spell: "江西省"
		},
		{
			name: "萍乡市",
			spell: "江西省"
		},
		{
			name: "九江市",
			spell: "江西省"
		},
		{
			name: "新余市",
			spell: "江西省"
		},
		{
			name: "鹰潭市",
			spell: "江西省"
		},
		{
			name: "赣州市",
			spell: "江西省"
		},
		{
			name: "吉安市",
			spell: "江西省"
		},
		{
			name: "宜春市",
			spell: "江西省"
		},
		{
			name: "抚州市",
			spell: "江西省"
		},
		{
			name: "上饶市",
			spell: "江西省"
		}],
		吉林: [{
			name: "长春市",
			spell: "吉林省"
		},{
			name: "吉林市",
			spell: "吉林省"
		},{
			name: "四平市",
			spell: "吉林省"
		},{
			name: "辽源市",
			spell: "吉林省"
		},{
			name: "通化市",
			spell: "吉林省"
		},{
			name: "白山市",
			spell: "吉林省"
		},{
			name: "松原市",
			spell: "吉林省"
		},{
			name: "白城市",
			spell: "吉林省"
		},{
			name: "延边朝鲜族自治州",
			spell: "吉林省"
		}],
		
		内蒙古: [{
			name: "呼和浩特市",
			spell: "内蒙古自治区"
		},{
			name: "包头市",
			spell: "内蒙古自治区"
		},{
			name: "乌海市",
			spell: "内蒙古自治区"
		},{
			name: "赤峰市",
			spell: "内蒙古自治区"
		},{
			name: "通辽市",
			spell: "内蒙古自治区"
		},{
			name: "鄂尔多斯市",
			spell: "内蒙古自治区"
		},{
			name: "呼伦贝尔市",
			spell: "内蒙古自治区"
		},{
			name: "巴彦淖尔市",
			spell: "内蒙古自治区"
		},{
			name: "乌兰察布市",
			spell: "内蒙古自治区"
		},{
			name: "兴安盟",
			spell: "内蒙古自治区"
		},{
			name: "锡林郭勒盟",
			spell: "内蒙古自治区"
		},{
			name: "阿拉善盟",
			spell: "内蒙古自治区"
		}],
		宁夏: [{
			name: "银川市",
			spell: "宁夏回族自治区"
		},{
			name: "石嘴山市",
			spell: "宁夏回族自治区"
		},{
			name: "吴忠市",
			spell: "宁夏回族自治区"
		},{
			name: "固原市",
			spell: "宁夏回族自治区"
		},{
			name: "中卫市",
			spell: "宁夏回族自治区"
		}],
		青海: [{
			name: "西宁市",
			spell: "青海省"
		},{
			name: "海东地区",
			spell: "青海省"
		},{
			name: "海北藏族自治州",
			spell: "青海省"
		},{
			name: "黄南藏族自治州",
			spell: "青海省"
		},{
			name: "海南藏族自治州",
			spell: "青海省"
		},{
			name: "果洛藏族自治州",
			spell: "青海省"
		},{
			name: "玉树藏族自治州",
			spell: "青海省"
		},{
			name: "海西蒙古族藏族自治州",
			spell: "青海省"
		}],
		山东: [{
			name: "济南市",
			spell: "山东省"
		},
		{
			name: "青岛市",
			spell: "山东省"
		},
		{
			name: "淄博市",
			spell: "山东省"
		},
		{
			name: "枣庄市",
			spell: "山东省"
		},
		{
			name: "东营市",
			spell: "山东省"
		},
		{
			name: "烟台市",
			spell: "山东省"
		},
		{
			name: "潍坊市",
			spell: "山东省"
		},
		{
			name: "济宁市",
			spell: "山东省"
		},
		{
			name: "泰安市",
			spell: "山东省"
		},
		{
			name: "威海市",
			spell: "山东省"
		},
		{
			name: "日照市",
			spell: "山东省"
		},
		{
			name: "莱芜市",
			spell: "山东省"
		},
		{
			name: "临沂市",
			spell: "山东省"
		},
		{
			name: "德州市",
			spell: "山东省"
		},
		{
			name: "聊城市",
			spell: "山东省"
		},
		{
			name: "滨州市",
			spell: "山东省"
		},
		{
			name: "菏泽市",
			spell: "山东省"
		}],
		山西: [{
			name: "太原市",
			spell: "山西省"
		},
		{
			name: "大同市",
			spell: "山西省"
		},
		{
			name: "阳泉市",
			spell: "山西省"
		},
		{
			name: "长治市",
			spell: "山西省"
		},
		{
			name: "晋城市",
			spell: "山西省"
		},
		{
			name: "朔州市",
			spell: "山西省"
		},
		{
			name: "运城市",
			spell: "山西省"
		},
		{
			name: "忻州市",
			spell: "山西省"
		},
		{
			name: "临汾市",
			spell: "山西省"
		},
		{
			name: "吕梁市",
			spell: "山西省"
		}],
		陕西: [{
			name: "西安市",
			spell: "陕西省"
		},{
			name: "铜川市",
			spell: "陕西省"
		},{
			name: "宝鸡市",
			spell: "陕西省"
		},{
			name: "咸阳市",
			spell: "陕西省"
		},{
			name: "渭南市",
			spell: "陕西省"
		},{
			name: "延安市",
			spell: "陕西省"
		},{
			name: "汉中市",
			spell: "陕西省"
		},{
			name: "榆林市",
			spell: "陕西省"
		},{
			name: "安康市",
			spell: "陕西省"
		},{
			name: "商洛市",
			spell: "陕西省"
		}],
		四川: [{
			name: "成都市",
			spell: "四川省"
		},{
			name: "自贡市",
			spell: "四川省"
		},{
			name: "攀枝花市",
			spell: "四川省"
		},{
			name: "泸州市",
			spell: "四川省"
		},{
			name: "德阳市",
			spell: "四川省"
		},{
			name: "绵阳市",
			spell: "四川省"
		},{
			name: "广元市",
			spell: "四川省"
		},{
			name: "遂宁市",
			spell: "四川省"
		},{
			name: "内江市",
			spell: "四川省"
		},{
			name: "乐山市",
			spell: "四川省"
		},{
			name: "南充市",
			spell: "四川省"
		},{
			name: "眉山市",
			spell: "四川省"
		},{
			name: "宜宾市",
			spell: "四川省"
		},{
			name: "广安市",
			spell: "四川省"
		},{
			name: "达州市",
			spell: "四川省"
		},{
			name: "雅安市",
			spell: "四川省"
		},{
			name: "巴中市",
			spell: "四川省"
		},{
			name: "资阳市",
			spell: "四川省"
		},{
			name: "阿坝藏族羌族自治州",
			spell: "四川省"
		},{
			name: "甘孜藏族自治州",
			spell: "四川省"
		},{
			name: "凉山彝族自治州",
			spell: "四川省"
		}],
		西藏: [{
			name: "拉萨市",
			spell: "西藏自治区"
		},{
			name: "昌都地区",
			spell: "西藏自治区"
		},{
			name: "山南地区",
			spell: "西藏自治区"
		},{
			name: "日喀则地区",
			spell: "西藏自治区"
		},{
			name: "那曲地区",
			spell: "西藏自治区"
		},{
			name: "阿里地区",
			spell: "西藏自治区"
		},{
			name: "林芝地区",
			spell: "西藏自治区"
		}],
		新疆: [{
			name: "乌鲁木齐市",
			spell: "新疆维吾尔自治区"
		},{
			name: "克拉玛依市",
			spell: "新疆维吾尔自治区"
		},{
			name: "吐鲁番地区",
			spell: "新疆维吾尔自治区"
		},{
			name: "哈密地区",
			spell: "新疆维吾尔自治区"
		},{
			name: "昌吉回族自治州",
			spell: "新疆维吾尔自治区"
		},{
			name: "博尔塔拉蒙古自治州",
			spell: "新疆维吾尔自治区"
		},{
			name: "巴音郭楞蒙古自治州",
			spell: "新疆维吾尔自治区"
		},{
			name: "阿克苏地区",
			spell: "新疆维吾尔自治区"
		},{
			name: "克孜勒苏柯尔克孜自治州",
			spell: "新疆维吾尔自治区"
		},{
			name: "喀什地区",
			spell: "新疆维吾尔自治区"
		},{
			name: "和田地区",
			spell: "新疆维吾尔自治区"
		},{
			name: "伊犁哈萨克自治州",
			spell: "新疆维吾尔自治区"
		},{
			name: "塔城地区",
			spell: "新疆维吾尔自治区"
		},{
			name: "阿勒泰地区",
			spell: "新疆维吾尔自治区"
		},{
			name: "石河子市",
			spell: "新疆维吾尔自治区"
		},{
			name: "阿拉尔市",
			spell: "新疆维吾尔自治区"
		},{
			name: "图木舒克市",
			spell: "新疆维吾尔自治区"
		},{
			name: "五家渠市",
			spell: "新疆维吾尔自治区"
		}],
		云南: [{
			name: "昆明市",
			spell: "云南省"
		},{
			name: "曲靖市",
			spell: "云南省"
		},{
			name: "玉溪市",
			spell: "云南省"
		},{
			name: "保山市",
			spell: "云南省"
		},{
			name: "昭通市",
			spell: "云南省"
		},{
			name: "丽江市",
			spell: "云南省"
		},{
			name: "思茅市",
			spell: "云南省"
		},{
			name: "临沧市",
			spell: "云南省"
		},{
			name: "楚雄彝族自治州",
			spell: "云南省"
		},{
			name: "红河哈尼族彝族自治州",
			spell: "云南省"
		},{
			name: "文山壮族苗族自治州",
			spell: "云南省"
		},{
			name: "西双版纳傣族自治州",
			spell: "云南省"
		},{
			name: "大理白族自治州",
			spell: "云南省"
		},{
			name: "德宏傣族景颇族自治州",
			spell: "云南省"
		},{
			name: "怒江傈僳族自治州",
			spell: "云南省"
		},{
			name: "迪庆藏族自治州",
			spell: "云南省"
		}],
		浙江: [{
			name: "杭州市",
			spell: "浙江省"
		},{
			name: "宁波市",
			spell: "浙江省"
		},{
			name: "温州市",
			spell: "浙江省"
		},{
			name: "嘉兴市",
			spell: "浙江省"
		},{
			name: "湖州市",
			spell: "浙江省"
		},{
			name: "绍兴市",
			spell: "浙江省"
		},{
			name: "金华市",
			spell: "浙江省"
		},{
			name: "衢州市",
			spell: "浙江省"
		},{
			name: "舟山市",
			spell: "浙江省"
		},{
			name: "台州市",
			spell: "浙江省"
		},{
			name: "丽水市",
			spell: "浙江省"
		}]
	},
	hotProvince = [{
		name: "北京",
		spell: "北京市"
	},{
		name: "上海",
		spell: "上海市"
	},{
		name: "重庆",
		spell: "重庆市"
	},
	{
		name: "天津",
		spell: "天津市"
	},
	{
		name: "香港",
		spell: "香港"
	},
	{
		name: "澳门",
		spell: "澳门"
	},
	{
		name: "台湾",
		spell: "台湾"
	}],
	KEY = ["安徽", "福建", "甘肃", "广东", "广西", "贵州","海南","河北","河南","黑龙江","湖北", "湖南","吉林","江苏", "江西","辽宁","内蒙古","宁夏","青海",  "山西",  "山东","陕西",   "四川",    "西藏",  "新疆","云南", "浙江"],
	ID = {
		provinceFrame: "div_select_province_sub_menu",
		provinceList: "div_province_list"
	},
	CLAZZ = {
		provinceFrame: "mod_list_province area-selector-inner",
		provinceTop: "province_top area-selector-inner",
		provinceList: "list_wrap area-selector-inner",
		provinceHot: "hot area-selector-inner",
		provinceCont: "province_cont area-selector-inner",
		col1: "col1 area-selector-inner",
		col2: "col2  area-selector-inner",
		table: "mod_province_list area-selector-inner"
	};
	function createProvinceTopHtml() {
		var fragment = doc.createDocumentFragment(),
		span = doc.createElement("span"),
		txt1 = doc.createTextNode("省份索引：");
		var table=doc.createElement("table");
		var tr=doc.createElement("tr");
		var td=doc.createElement("td");
		var th=doc.createElement("th");
		span.appendChild(txt1);
		th.appendChild(span);
		for (var row in province) {
			if (province.hasOwnProperty(row)) {
				a = doc.createElement("a");
				a.title=row;
				a.href = "#" + row;
				a.appendChild(doc.createTextNode(row));
				td.appendChild(a);
			}
		}
		tr.appendChild(th);
		tr.appendChild(td);
		table.appendChild(tr);
		fragment.appendChild(table);
		return fragment;
	}
	function createHotProvinceHtml() {
		var fragment = doc.createDocumentFragment(),
		span = doc.createElement("span"),
		txt1 = doc.createTextNode("");
		span.className="area-selector-inner";
		var table=doc.createElement("table");
		var tr=doc.createElement("tr");
		var td=doc.createElement("td");
		var th=doc.createElement("th");
		table.className="area-selector-inner";
		tr.className="area-selector-inner";
		td.className="area-selector-inner";
		th.className="area-selector-inner";
		span.appendChild(txt1);
		th.appendChild(span);
		link = null;
		for (var i = 0, len = hotProvince.length; i < len; i++) {
			currentProvince = hotProvince[i];
			link = doc.createElement("a");
			provinceText = doc.createTextNode(currentProvince.name);
			link.title=currentProvince.name;
			link.provinceProperty=currentProvince.spell;
			link.appendChild(provinceText);
			td.appendChild(link);
		}
		tr.appendChild(th);
		tr.appendChild(td);
		table.appendChild(tr);
		fragment.appendChild(table);
		return fragment;
	}
	function createProvinceTRHtml() {
		var fragment = doc.createDocumentFragment();
		for (var miao in province) {
			if (province.hasOwnProperty(miao)) {
				var tr = doc.createElement("tr"),
				th = doc.createElement("th"),
				td = doc.createElement("td"),
				span = doc.createElement("span"),
				text = doc.createTextNode(miao),
				miaoArray = province[miao],
				currentMiao = null,
				a = null;
				for (var j = 0, len = miaoArray.length; j < len; j++) {
					currentMiao = miaoArray[j];
					a = doc.createElement("a");
					a.title=currentMiao.name;
					a.appendChild(doc.createTextNode(currentMiao.name));
					a.provinceProperty=currentMiao.spell;
					td.appendChild(a);
				}
				span.appendChild(text);
				th.appendChild(span);
				tr.id = "miao_" + miao;
				tr.appendChild(th);
				tr.appendChild(td);
				fragment.appendChild(tr);
			}
		}
		return fragment;
	}
	function createProvinceContentHtml() {
		var fragment = doc.createDocumentFragment(),
		table = doc.createElement("table"),
		colgroup = doc.createElement("colgroup"),
		tbody = doc.createElement("tbody"),
		col1 = doc.createElement("col"),
		col2 = doc.createElement("col"),
		trHtml = createProvinceTRHtml();
		table.className = CLAZZ.table;
		col1.className = CLAZZ.col1;
		col2.className = CLAZZ.col2;
		colgroup.appendChild(col1);
		colgroup.appendChild(col2);
		tbody.appendChild(trHtml);
		table.appendChild(colgroup);
		table.appendChild(tbody);
		selectEventProxy = table;
		fragment.appendChild(table);
		return fragment;
	}
	function stopPropagation(event) {
		if (event.stopPropagation) {
			event.stopPropagation();
		} else {
			event.cancelBubble = true;
		}
	}
	function preventDefault(event) {
		if (event.preventDefault) {
			event.preventDefault();
		} else {
			event.returnValue = false;
		}
	}
	function provinceScroll(m) {
		if (m && typeof m === "string") {
			m = m.toUpperCase();
			var provinceListDiv = doc.getElementById(ID.provinceList),
			tr = doc.getElementById("miao_" + m);
			if (tr !== null) {
				provinceListDiv.scrollTop = tr.offsetTop + 5;
			}
		}
	}
	function addSelectCloseEvent(proxyTag, type, callback){
		proxyTag["on" + type] = function(e) {
			var event = e || window.event;
			areaSelector.close();
			stopPropagation(event);
			preventDefault(event);
		};
	}
	function addSelectEvent(proxyTag, type, callback) {
		proxyTag["on" + type] = function(e) {
			var event = e || window.event,
			target = event.srcElement || event.target;
			if (target.tagName.toLowerCase() == "a") {
				selectedValue.province = target.provinceProperty;
				selectedValue.city=target.provinceProperty;
				callback(selectedValue);
				areaSelector.close();
			}
			stopPropagation(event);
			preventDefault(event);
		};
	}
	function addOutClickClose(proxyTag, type) {
		proxyTag["on" + type] = function(e) {
			var event = e || window.event,
			target = event.srcElement || event.target;
			if (target.className.indexOf("area-selector-inner") >-1) {
				return;
			}
			areaSelector.close();
		};
	}
	function provinceSelectedEvent(proxyTag, type, callback) {
		proxyTag["on" + type] = function(e) {
			var event = e || window.event,
			target = event.srcElement || event.target;
			if (target.tagName.toLowerCase() == "a") {
				selectedValue.city = target.innerHTML;
				selectedValue.province = target.provinceProperty;
				callback(selectedValue);
				areaSelector.close();
			}
			stopPropagation(event);
			preventDefault(event);
		};
	}
	function addScrollEvent(proxyTag, type) {
		proxyTag["on" + type] = function(e) {
			var event = e || window.event,
			target = event.srcElement || event.target;
			if (target.tagName.toLowerCase() == "a") {
				var m = target.getAttribute("href").replace(/^#/, "") || "A";
				provinceScroll(m);
			}
			stopPropagation(event);
			preventDefault(event);
		};
	}
	function createFrame() {
		var provinceFrame = doc.createElement("div"),
		provinceClose = doc.createElement("div"),
		tableFrame = doc.createElement("table"),
		tableTr = doc.createElement("tr"),
		tableTdTop = doc.createElement("td"),
		tableTdClose = doc.createElement("td"),
		provinceTop = doc.createElement("div"),
		i = doc.createElement("i"),
		provinceHot = doc.createElement("div"),
		provinceList = doc.createElement("div"),
		provinceCont = doc.createElement("div"),
		hotProvinceHtml = createHotProvinceHtml(),
		provinceContentHtml = createProvinceContentHtml(),
		provinceTopHtml = createProvinceTopHtml();
		hotEventProxy = provinceHot;
		scrollEventProxy = provinceTop;
		popUpprovinceFrame = provinceFrame;
		provinceFrame.id = ID.provinceFrame;
		provinceFrame.className = CLAZZ.provinceFrame;
		provinceTop.className = CLAZZ.provinceTop;
		provinceHot.className = CLAZZ.provinceHot;
		provinceList.id = ID.provinceList;
        i.className="icon-remove";
        provinceClose.className="closeDiv";
        provinceCloseProxy=provinceClose;
		provinceList.className = CLAZZ.provinceList;
		provinceCont.className = CLAZZ.provinceCont;
		provinceHot.appendChild(hotProvinceHtml);
		provinceCont.appendChild(provinceContentHtml);
		provinceTop.appendChild(provinceTopHtml);
		provinceList.appendChild(provinceCont);
		provinceClose.appendChild(i);
		tableTdClose.appendChild(provinceClose);
		tableTdTop.appendChild(provinceTop);
		tableTr.appendChild(tableTdTop);
		tableTr.appendChild(tableTdClose);
		tableFrame.appendChild(tableTr);
		provinceFrame.appendChild(tableFrame);
		provinceFrame.appendChild(provinceHot);
		provinceFrame.appendChild(provinceList);
		return provinceFrame;
	}
	var areaSelector = {
		version: "2.0",
		point: {
			left: 0,
			top: 0
		},
		callback: function() {},
		show: function() {
			var lenght = arguments.length,
			options,
			point = areaSelector.point,
			callback = areaSelector.callback;
			if (lenght == 2) {
				point = arguments[0];
				callback = arguments[1];
			} else {
				options = arguments[0];
				if (options && typeof options === "object") {
					point.left = options.left || areaSelector.point;
					point.top = options.top || areaSelector.top;
					callback = options.selected || areaSelector.callback;
				}
			}
			var docProvinceFrame = doc.getElementById(ID.provinceFrame);
			if (!popUpProvinceFrame || !docProvinceFrame) {
				popUpProvinceFrame = createFrame();
				addScrollEvent(scrollEventProxy, "click");
				doc.body.appendChild(popUpProvinceFrame);
			}
			areaSelector.fix(point);
			areaSelector.bind(callback);
			popUpProvinceFrame.style.display = "block";
			return this;
		},
		close: function() {
			if (popUpProvinceFrame) {
				popUpProvinceFrame.style.display = "none";
			}
		},
		getSelectedValue: function() {
			return selectedValue;
		},
		fix: function(point) {
			if (point && typeof point === "object") {
				var left = parseInt(point.left, 10) || 0,
				top = parseInt(point.top, 10) || 0;
				areaSelector.point = {
					left: left,
					top: top
				};
				if (popUpProvinceFrame) {
					popUpProvinceFrame.style.left = left + "px";
					popUpProvinceFrame.style.top = top + "px";
				}
			}
			return this;
		},
		bind: function(callback) {
			if (toString.call(callback) === "[object Function]") {
				areaSelector.callback = callback;
				if (popUpProvinceFrame !== null) {
					provinceSelectedEvent(selectEventProxy, "click", callback);
					addSelectEvent(hotEventProxy, "click", callback);
					addSelectCloseEvent(provinceCloseProxy, "click", callback);
					addOutClickClose(doc, "click", callback);
				}
			}
			return this;
		}
	};
	window.areaSelector = areaSelector;
})(window);