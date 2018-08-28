
(function(host) {
	var window = host || window,
	doc = document,
	selectedValue ={},
	popUpBankFrame = null,
	docBankFrame=null,
	selectEventProxy = null,
	linkMoreBank=null,
	divTagePProxy=null,
	divTageGProxy=null,
	tableBankP=null,
	tableBankG=null,
	tdTageG=null,
	tdTageP=null,
	iClose=null,
	divTageP=null,
	divTageG=null,
	iMoreBank=null,
	bankTop=null,
	bankTopHtml=null,
	moreBankDivP=null,
	moreBankDivG=null,
	hotEventProxy = null,
	bankTopProxy = null,
	bankCloseProxy=null,
	bankMoreProxy=null,
	scrollEventProxy = null,
	toString = Object.prototype.toString,
	bank = {
	},
	hotBank = [],
	KEY = ["安徽", "福建", "甘肃", "广东", "广西", "贵州","海南","河北","河南","黑龙江","湖北", "湖南","吉林","江苏", "江西","辽宁","内蒙古","宁夏","青海",  "山西",  "山东","陕西",   "四川",    "西藏",  "新疆","云南", "浙江"],
	ID = {
		bankFrame: "div_select_bank_sub_menu",
		bankList: "div_bank_list"
	},
	CLAZZ = {
		bankFrame: "mod_list_bank bank-selector-inner",
		bankTop: "bank_top bank-selector-inner",
		bankList: "list_wrap bank-selector-inner",
		bankHot: "bankHot bank-selector-inner",
		bankCont: "bank_cont bank-selector-inner",
		col1: "col1 bank-selector-inner",
		col2: "col2 bank-selector-inner",
		table: "mod_bank_list bank-selector-inner"
	};
	var bankListP=["中国工商银行","中国农业银行","招商银行","中国建设银行","交通银行","中国银行","中国光大银行","中国邮政储蓄银行","中信银行","中国民生银行","浦发银行","兴业银行","杭州银行","上海银行","宁波银行","平安银行","广发银行","华夏银行"];
	var bankPSrc=["zggsyh","zgnyyh","zsyh","zgjsyh","jtyh","zgyh","zggdyh_","zgyzcxyh","zxyh","zgmsyh","shpfyh","xyyh","hzyh","shyh","npyh","payh","gfyh"];
	var bankListG=["中国工商银行","中国农业银行","招商银行","中国建设银行","交通银行","杭州银行","中国邮政储蓄银行","兴业银行","宁波银行","平安银行","浦发银行","广发银行","中国民生银行","华夏银行"];
	var bankGSrc=["zggsyh","zgnyyh","zsyh","zgjsyh","jtyh","hzyh","zgyzcxyh","xyyh","npyh","payh","shpfyh","gfyh","zgmsyh"];
	function createBankTopHtml(){
		var fragment = doc.createDocumentFragment();
		var tableTag=doc.createElement("table");
		var trTage=doc.createElement("tr");
		tdTageG=doc.createElement("td");
		tdTageP=doc.createElement("td");
	    divTageP=doc.createElement("div");
	    divTageG=doc.createElement("div");
		var aP=doc.createElement("a");
		aP.title="支持以下银行对公账户";
		var aG=doc.createElement("a");
		aG.title="支持以下银行对私账户";
		divTagePProxy=divTageP;
		divTageGProxy=divTageG;
		divTageP.className="tagDiv bank-selector-inner";
		divTageG.className="tagDiv bank-selector-inner";
		var textP = doc.createTextNode("对公账户");
		divTageP.appendChild(textP);
		aP.appendChild(divTageP);
		tdTageP.appendChild(aP);
		var textG = doc.createTextNode("对私账户");
		divTageG.appendChild(textG);
		aG.appendChild(divTageG);
		tdTageG.appendChild(aG);
		
		trTage.appendChild(tdTageG);
		trTage.appendChild(tdTageP);
		tableTag.appendChild(trTage);
		tableTag.className="tableTag bank-selector-inner";
		
		tableBankP=doc.createElement("table");
		var trP=doc.createElement("tr");
		var thP=doc.createElement("th");
		for (var i=0; i<12;i++) {
			var a = doc.createElement("a");
			a.title=bankListP[i];
			var img=doc.createElement("img");
			img.src="../../images/bankImgs/"+bankPSrc[i]+".png";
			img.bankName=bankListP[i];
			a.appendChild(img);
			if(i==0||(i+1)%3!=0){
				a.className="jiange bank-selector-inner";
			}
			thP.appendChild(a);
		}
		moreBankDivP = doc.createElement("div");
		moreBankDivP.style.display = "none";
		moreBankDivP.className="moreBankDetail";
		for (var j = 12, len = bankListP.length; j < len; j++) {
			var a = doc.createElement("a");
			a.title=bankListP[j];
			a.innerHTML=bankListP[j];
			a.bankName=bankListP[j];
			a.className="textA";
//			var img=doc.createElement("img");
//			img.src="../../images/bankImgs/"+bankPSrc[j]+".png";
//			img.bankName=bankListP[j];
//			a.appendChild(img);
			if(j==0||(j+1)%3!=0){
				a.className="jiange bank-selector-inner textA";
			}
			moreBankDivP.appendChild(a);
		}
		thP.appendChild(moreBankDivP);
		trP.appendChild(thP);
		tableBankP.appendChild(trP);
		tableBankG=doc.createElement("table");
		var trG=doc.createElement("tr");
		var thG=doc.createElement("th");
		for (var i=0; i<12;i++) {
			var a = doc.createElement("a");
			a.title=bankListG[i];
			var img=doc.createElement("img");
			img.src="../../images/bankImgs/"+bankGSrc[i]+".png";
			img.bankName=bankListG[i];
			a.appendChild(img);
			if(i==0||(i+1)%3!=0){
				a.className="jiange bank-selector-inner";
			}
			thG.appendChild(a);
		}
		moreBankDivG = doc.createElement("div");
		moreBankDivG.style.display = "none";
		moreBankDivG.className="moreBankDetail";
		for (var j = 12, len = bankListG.length; j < len; j++) {
			var a = doc.createElement("a");
			a.title=bankListG[j];
			a.innerHTML=bankListG[j];
			a.bankName=bankListG[j];
			a.className="textA";
//			var img=doc.createElement("img");
//			img.src="../../images/bankImgs/"+bankGSrc[j]+".png";
//			img.bankName=bankListG[j];
//			a.appendChild(img);
			if(j==0||(j+1)%3!=0){
				a.className="jiange bank-selector-inner textA";
			}
			moreBankDivG.appendChild(a);
		}
		thG.appendChild(moreBankDivG);
		trG.appendChild(thG);
		tableBankG.appendChild(trG);
		fragment.appendChild(tableTag);
		fragment.appendChild(tableBankP);
		fragment.appendChild(tableBankG);
		return fragment;
	}
	function createHotBankHtml() {
		var fragment = doc.createDocumentFragment();
		var link = doc.createElement("a");
		var i = doc.createElement("i");
		i.className="icon-double-angle-down bank-selector-inner";
		link.title="点击展开更多银行";
		link.appendChild(i);
		fragment.appendChild(link);
		return fragment;
	}
	function createBankTRHtml() {
		var fragment = doc.createDocumentFragment();
		
		return fragment;
	}
	function createBankContentHtml() {
		var fragment = doc.createDocumentFragment(),
		table = doc.createElement("table"),
		colgroup = doc.createElement("colgroup"),
		tbody = doc.createElement("tbody"),
		col1 = doc.createElement("col"),
		col2 = doc.createElement("col"),
		trHtml = createBankTRHtml();
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
	function bankScroll(m) {
		if (m && typeof m === "string") {
			m = m.toUpperCase();
			var bankListDiv = doc.getElementById(ID.bankList),
			tr = doc.getElementById("miao_" + m);
			if (tr !== null) {
				bankListDiv.scrollTop = tr.offsetTop + 5;
			}
		}
	}
	function addSelectCloseEvent(proxyTag, type, callback){
		proxyTag["on" + type] = function(e) {
			var event = e || window.event;
			bankSelector.close();
			stopPropagation(event);
			preventDefault(event);
		};
	}
	function addBankMoreEvent(proxyTag, type, callback){
		proxyTag["on" + type] = function(e) {
			if(tdTageG.className.indexOf("tableTagPGSelected")>-1){
				if(moreBankDivG.style.display == "block"){
					moreBankDivG.style.display = "none";
					bankTop.style.height="275px";
					iMoreBank.className="icon-double-angle-down bank-selector-inner";
					iClose.style.marginBottom="220px";
					linkMoreBank.title="点击展开更多银行";
					linkMoreBank.statue="0";
				}else{
					moreBankDivG.style.display = "block";
					bankTop.style.height="395px";
					iMoreBank.className="icon-double-angle-up bank-selector-inner";
					iClose.style.marginBottom="340px";
					linkMoreBank.title="收起";
					linkMoreBank.statue="1";
				}
			}else{
				if(moreBankDivP.style.display == "block"){
					moreBankDivP.style.display = "none";
					bankTop.style.height="275px";
					iMoreBank.className="icon-double-angle-down bank-selector-inner";
					iClose.style.marginBottom="220px";
					linkMoreBank.title="点击展开更多银行";
					linkMoreBank.statue="0";
				}else{
					moreBankDivP.style.display = "block";
					bankTop.style.height="395px";
					iMoreBank.className="icon-double-angle-up bank-selector-inner";
					iClose.style.marginBottom="340px";
					linkMoreBank.title="收起";
					linkMoreBank.statue="1";
				}
			}
		};
	}
	function addSelectEvent(proxyTag, type, callback) {
		proxyTag["on" + type] = function(e) {
			var event = e || window.event,
			target = event.srcElement || event.target;
			if (target.tagName.toLowerCase() == "a") {
				//selectedValue.bank = target.bankProperty;
				//selectedValue.city=target.bankProperty;
				//callback(selectedValue);
				alert(1);
			}
			stopPropagation(event);
			preventDefault(event);
		};
	}
	
	function addPEvent(proxyTag, type, callback){
		proxyTag["on" + type] = function(e) {
			if(tdTageG.className.indexOf("tableTagPGSelected")>-1){
				return false;
			}
			tdTageG.className="tableTagPGSelected bank-selector-inner";
			tdTageP.className="bank-selector-inner";
			divTageP.className="tagDivSelected bank-selector-inner";
			divTageG.className="tagDiv bank-selector-inner";
			bankTop.removeChild(tableBankP);
			if(linkMoreBank.statue=="0"){
				moreBankDivG.style.display = "none";
			}else{
				moreBankDivG.style.display = "block";
			}
			bankTop.appendChild(tableBankG);
		};
	}
	function addGEvent(proxyTag, type, callback){
		proxyTag["on" + type] = function(e) {
			if(tdTageP.className.indexOf("tableTagPGSelected")>-1){
				return false;
			}
			tdTageP.className="tableTagPGSelected bank-selector-inner";
			tdTageG.className="bank-selector-inner";
			divTageG.className="tagDivSelected bank-selector-inner";
			divTageP.className="tagDiv bank-selector-inner";
			bankTop.removeChild(tableBankG);
			if(linkMoreBank.statue=="0"){
				moreBankDivP.style.display = "none";
			}else{
				moreBankDivP.style.display = "block";
			}
			bankTop.appendChild(tableBankP);
		};
	}
	function bankSelectedEvent(proxyTag, type, callback) {
		proxyTag["on" + type] = function(e) {
			var event = e || window.event,
			target = event.srcElement || event.target;
			if (target.tagName.toLowerCase() == "div") {
				return;
			}
			if (target.tagName.toLowerCase() != "img"&&target.className.indexOf("textA")==-1) {
				return;
			}
			selectedValue.bankName = target.bankName;
			if(tdTageP.className.indexOf("tableTagPGSelected")){
				selectedValue.accountFlag ="1";
			}else if(tdTageG.className.indexOf("tableTagPGSelected")){
				selectedValue.accountFlag ="2";
			}
			callback(selectedValue);
			bankSelector.close();
			stopPropagation(event);
			preventDefault(event);
		};
	}
	function addOutClickClose(proxyTag, type) {
		proxyTag["on" + type] = function(e) {
			var event = e || window.event,
			target = event.srcElement || event.target;
			if (target.className.indexOf("bank-selector-inner") >-1) {
				return;
			}
			bankSelector.close();
		};
	}
	function createFrame() {
		var bankFrame = doc.createElement("div"),
		bankClose = doc.createElement("div"),
		tableFrame = doc.createElement("table"),
		tableTr = doc.createElement("tr"),
		tableTdTop = doc.createElement("td"),
		tableTdClose = doc.createElement("td"),
		bankHot = doc.createElement("div"),
		bankList = doc.createElement("div"),
		bankCont = doc.createElement("div"),
		hotBankHtml = createHotBankHtml(),
		bankContentHtml = createBankContentHtml();
		bankTopHtml = createBankTopHtml();
		tableTdClose.className="opreationLeft bank-selector-inner";
		iClose = doc.createElement("i");
		bankTop = doc.createElement("div");
		hotEventProxy = bankHot;
		bankTopProxy=bankTop;
		scrollEventProxy = bankTop;
		popUpBankFrame = bankFrame;
		bankFrame.id = ID.bankFrame;
		bankFrame.className = CLAZZ.bankFrame;
		bankTop.className = CLAZZ.bankTop;
		bankHot.className = CLAZZ.bankHot;
		bankList.id = ID.bankList;
		iClose.className="icon-remove icon-remove-bank";
        bankClose.className="bank-selector-inner closeDiv";
        bankCloseProxy=iClose;
		bankList.className = CLAZZ.bankList;
		bankCont.className = CLAZZ.bankCont;
		bankHot.appendChild(hotBankHtml);
		bankCont.appendChild(bankContentHtml);
		bankTop.appendChild(bankTopHtml);
		bankList.appendChild(bankCont);
		bankClose.appendChild(iClose);
		tableTdClose.appendChild(bankClose);
		tableTdTop.appendChild(bankTop);
		tableTr.appendChild(tableTdTop);
		tableTr.appendChild(tableTdClose);
		tableFrame.appendChild(tableTr);
		bankFrame.appendChild(tableFrame);
		//bankFrame.appendChild(bankHot);
		//bankFrame.appendChild(bankList);
		
		var bankMore = doc.createElement("div");
		bankMore.className="bank-selector-inner";
		bankMoreProxy=bankMore;
		linkMoreBank = doc.createElement("a");
		linkMoreBank.statue="0";
		linkMoreBank.className="bank-selector-inner";
		iMoreBank = doc.createElement("i");
		iMoreBank.className="bank-selector-inner icon-double-angle-down";
		linkMoreBank.title="点击展开更多银行";
		linkMoreBank.appendChild(iMoreBank);
		bankMore.appendChild(linkMoreBank);
		tableTdClose.appendChild(bankMore);
		return bankFrame;
	}
	var bankSelector = {
		version: "2.0",
		point: {
			left: 0,
			top: 0
		},
		callback: function() {},
		show: function() {
			var lenght = arguments.length,
			options,
			point = bankSelector.point,
			callback = bankSelector.callback;
			docBankFrame = doc.getElementById(ID.bankFrame);
			if (!popUpBankFrame || !docBankFrame) {
				popUpBankFrame = createFrame();
				doc.body.appendChild(popUpBankFrame);
			}
			tdTageP.className="";
			tdTageG.className="";
			bankTop.appendChild(tableBankG);
			bankTop.appendChild(tableBankP);
			if (lenght ==2) {
				point = arguments[0];
				callback = arguments[1];
				bankTop.removeChild(tableBankG);
				tdTageP.className="tableTagPGSelected bank-selector-inner";
				divTageG.className="tagDivSelected bank-selector-inner";
				divTageP.className="tagDiv bank-selector-inner";
			} else if (lenght == 3) {
				point = arguments[0];
				callback = arguments[1];
				var flagMark = arguments[2];
				if(flagMark+""=="0"){
					bankTop.removeChild(tableBankG);
					tdTageP.className="tableTagPGSelected bank-selector-inner";
					divTageG.className="tagDivSelected bank-selector-inner";
					divTageP.className="tagDiv bank-selector-inner";
				}else if(flagMark+""=="1"){
					bankTop.removeChild(tableBankP);
					tdTageG.className="tableTagPGSelected bank-selector-inner";
					divTageP.className="tagDivSelected bank-selector-inner";
					divTageG.className="tagDiv bank-selector-inner";
				}
			} else {
				options = arguments[0];
				if (options && typeof options === "object") {
					point.left = options.left || bankSelector.point;
					point.top = options.top || bankSelector.top;
					callback = options.selected || bankSelector.callback;
				}
			}
			
			bankSelector.fix(point);
			bankSelector.bind(callback);
			popUpBankFrame.style.display = "block";
			return this;
		},
		close: function() {
			if (popUpBankFrame) {
				popUpBankFrame.style.display = "none";
			}
		},
		getSelectedValue: function() {
			return selectedValue;
		},
		fix: function(point) {
			if (point && typeof point === "object") {
				var left = parseInt(point.left, 10) || 0,
				top = parseInt(point.top, 10) || 0;
				bankSelector.point = {
					left: left,
					top: top
				};
				if (popUpBankFrame) {
					popUpBankFrame.style.left = left + "px";
					popUpBankFrame.style.top = top + "px";
				}
			}
			return this;
		},
		bind: function(callback) {
			if (toString.call(callback) === "[object Function]") {
				bankSelector.callback = callback;
				if (popUpBankFrame !== null) {
					bankSelectedEvent(bankTopProxy, "click", callback);
					addSelectEvent(hotEventProxy, "click", callback);
					addSelectCloseEvent(bankCloseProxy, "click", callback);
					addBankMoreEvent(bankMoreProxy, "click", callback);
					addPEvent(divTagePProxy, "click", callback);
					addGEvent(divTageGProxy, "click", callback);
					addOutClickClose(doc, "click", callback);
				}
			}
			return this;
		}
	};
	window.bankSelector = bankSelector;
})(window);