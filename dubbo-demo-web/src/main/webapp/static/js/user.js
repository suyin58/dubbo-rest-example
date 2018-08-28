function getUrlParam(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r!=null) return decodeURI(r[2]); return null; //返回参数值
}

//id是表单form的id，isReadOnly=true表示控件全部设置为不可编辑，isReadOnly=false表示控件全部设置为可编辑
function setReadOnly(id,isReadOnly){
    var nodes=$('#'+id).find("input");//根绝form的id得到form所有input的子节点
    //支持单个控件设置ReadOnly
    if(nodes.length==0){
        var readOnlyNode=document.getElementById(id);
        var isSelectInput=readOnlyNode.className.indexOf("bui-select-input");
        if(isSelectInput>-1){//判断是否是下拉控件
            if(isReadOnly){
                var valueSel=readOnlyNode.value;
                $(readOnlyNode).bind("change",{valueSel:valueSel},function(ev){//两个参数就{valueName1:value1,valueName2:value2}
                    this.value=ev.data.valueSel;
                });
                }else{
                    $(readOnlyNode).unbind("change");
                }
        }
        readOnlyNode.readOnly=isReadOnly;
        return;
    }
    
    //多个控件
    for(var i=0; i<nodes.length;i++){
        var isSelectInput=nodes[i].className.indexOf("bui-select-input");
        if(isSelectInput>-1){//判断是否是下拉控件
            if(isReadOnly){
                var valueSel=nodes[i].value;
                $(nodes[i]).bind("change",{valueSel:valueSel},function(ev){//两个参数就{valueName1:value1,valueName2:value2}
                    this.value=ev.data.valueSel;
                });
                }else{
                    $(nodes[i]).unbind("change");
            }
        }
        nodes[i].readOnly=isReadOnly;
    }
    //设置textarea可编辑和不可编辑
    var nodesTextarea=$('#'+id).find("textarea");
    for(var i=0; i<nodesTextarea.length;i++){
        nodesTextarea[i].readOnly=isReadOnly;
    }
}


//时间再table里面  ,列表renderer事件里面写.注释："val.length==8"表示转让日期
function longToDate(value){
    if(value === null||value === "") return "";
    var val=value+"";
    if(val.length==8){
        return  val.substring(0,4)+"-"+val.substring(4,6)+"-"+val.substring(6);
    }else{
        var longLen=val.length;
        for(var i=0;i<6-longLen;i++){
            val="0"+val;
        }
        return  val.substring(0,2)+":"+val.substring(2,4)+":"+val.substring(4);
    }
}
function longToTimeStr(value){
    var val=value+"";
    var hour=val.substring(0,val.length-4).length>1?val.substring(0,val.length-4):("0"+val.substring(0,val.length-4));
    var min=val.substring(val.length-4,val.length-2);
    var sec=val.substring(val.length-2,val.length);
    return hour+":"+min+":"+sec;
}
function stringToDateTime(value){
    if(value==null||value==""||value=="0") return "";
    
    value = value + "";
    value=value.substring(0,4)+"-"+value.substring(4,6)+"-"+value.substring(6);
    return value;
}

function footerButtonView(isSure){
    $(".bui-stdmod-footer button").each(function(){
        if ($(this).text().trim() == "确定") {
            if (isSure == true) {
                $(this).show();
            } else {
                $(this).hide();
            }
        }
    });
}

function setColumnsArray(columnsArray,hearders,fields){
    for(var i in columnsArray){
        if(columnsArray[i].visible!=false){
            hearders.push(columnsArray[i].title);
            fields.push(columnsArray[i].dataIndex);
        }

    }
    
}

function setColumnsArrayExp(columnsArray,hearders,fields){
    for(var i in columnsArray){
        if(columnsArray[i].visible!=false){
            hearders.push(columnsArray[i].title);
            if(columnsArray[i].expField != null){
                fields.push(columnsArray[i].expField);
            }else{
                fields.push(columnsArray[i].dataIndex);
            }
        }

    }
    
}

//设置columns数据字典转意的Enum
function setEnum(enumArray,data){
    for(var o in data){
            enumArray[data[o].value] = data[o].label;
     }
}

//设置日期控件时间
function setCalendarDate(destNodeId, calendarNode) {
    var calendarNumberValue = changeToNumberStr($(calendarNode).val());
    $('#' + destNodeId).val(calendarNumberValue);
}

//将日期控件时间转化为数字
//如"2014-09-13"转为"20140913"
function changeToNumberStr(value) {
    return value.replace(/-/g, '');
}


window.onload=function(){
    document.getElementsByTagName("body")[0].onkeydown = function(e){
       stopBackSpace(e);
    }  ;
    initButton();
    initBindEvent();
    function stopBackSpace(e){
        var event = e || window.event;
        //获取事件对象
        //var elem = event.relatedTarget || event.srcElement || event.target ||event.currentTarget;
            if(event.keyCode==8){//判断按键为backSpace键
                //获取按键按下时光标做指向的element
                var elem = event.srcElement || event.target;
                //判断是否需要阻止按下键盘的事件默认传递
                var name = elem.nodeName;
                if(name!='INPUT' && name!='TEXTAREA'){
                    return _stopIt(event);
                }
                var type_e = elem.type.toUpperCase();
                if(name=='INPUT' && (type_e!='TEXT' && type_e!='TEXTAREA' && type_e!='PASSWORD' && type_e!='FILE')){
                        return _stopIt(event);
                }
                if(name=='INPUT' && (elem.readOnly==true || elem.disabled ==true)){
                        return _stopIt(event);
                }
        }
    }
    
    function _stopIt(e){
        if(e.preventDefault ){
            e.preventDefault();
        }else{//ie8及以下
            e.returnValue = false ;
        }
  
        return false;
    }
};

$(document).on('contextmenu',function(){
    return  false;
});

//加载按钮
function initButton() {
    var str = $("#functionNo").val();
    $('.bui-grid-tbar').find('li').each(function() {
        var id = $(this).attr("id");
        if (str && str.indexOf(id) < 0 ) {
            $(this).remove();
        }
    });
    // priviledge权限
    $(".priv").each(function() {
        var functionId = $(this).attr("functionId");
        if (str && str.indexOf(functionId) < 0 ) {
            $(this).remove();
        }
    });
};



//value是表示要格式化的值,num是表示保留的小数位数。
function formatMoney(value, num)
{
    if(value == null){
        value = 0;
    }
    num = num > 0 && num <= 20 ? num : 2;
   value = parseFloat((value + "").replace(/[^\d\.-]/g, "")).toFixed(num) + "";
   var l = value.split(".")[0].split("").reverse(),
   r = value.split(".")[1];
   t = "";
   for(var i = 0; i < l.length; i ++ )
   {
      t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
   }
   return t.split("").reverse().join("") + "." + r;
}

//value是表示要格式化的值,num是表示保留的小数位数。
function formatNumber(value, num) {
    var returnstr = "";
    num = num >= 0 && num <= 20 ? num : 2;
    if (num == 0) {
        value = value + "";
    } else {
        value = parseFloat((value + "").replace(/[^\d\.-]/g, "")).toFixed(num) + "";
    }
    var l = value.split(".")[0].split("").reverse(), r = value.split(".")[1];
    t = "";
    for (var i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }
    returnstr =  t.split("").reverse().join("");
    if(r) {
        returnstr = returnstr + "." + r;
    }
    
    return returnstr;
}

//id是表示要格式化的元素id,num表示要保留的小数位数
function formatDomToMoneyValue(id, num)
{
    var oldValue = $("#"+id).val();
    $("#"+id).val(formatMoney(oldValue, num));
}

//id是表示要格式化的元素id
function formatDomToDateValue(id)
{
    var oldValue = $("#"+id).val();
    $("#"+id).val(longToDate(oldValue));
}

//“1”转化成“01”,""=>"00"
function numberStrToTimeStr(numberStr) {
    if (!numberStr) {
        numberStr = "";
    }
    if (numberStr.length == 0) {
        numberStr = "00";
    } else if(numberStr.length == 1) {
        numberStr = "0" + numberStr;
    }
    return numberStr;
}
function displayDetailIcon(Tooltip){
    $('.bui-grid-bbar').prepend('<span class="detail" id="detailTips">详情</span>');
    //使用模板左下方显示
    var toolTips = new Tooltip.Tip({
        trigger : '#detailTips',
        alignType : 'top-left',
        offset : 10,
        width:120,
        title : '双击列表可查看详情', //自定义大段文本
        elCls : 'custom',
        titleTpl : '<p>{title}</p>'
        });
    toolTips.render();
}

//选择区间日期时，如果前一个日期大于后一个日期，则前后日期两个值互换
//function setCompareCalendarDate(setValueId, srcNode, compareDatePrefixId) {
//    var fromDateSelect = $("#" + compareDatePrefixId + "FromSelect");
//    var fromDateSelectValue = fromDateSelect.val();
//    var toDateSelect = $("#" + compareDatePrefixId + "ToSelect");
//    var toDateSelectValue = toDateSelect.val();
//    if (fromDateSelectValue && toDateSelectValue) {
//        if (fromDateSelectValue > toDateSelectValue) {
//            fromDateSelect.val(toDateSelectValue);
//            setCalendarDate(compareDatePrefixId + "FromValue", fromDateSelect);
//            toDateSelect.val(fromDateSelectValue);
//            setCalendarDate(compareDatePrefixId + "ToValue", toDateSelect);
//        } else {
//            setCalendarDate(setValueId, srcNode);
//        }
//    } else {
//        setCalendarDate(setValueId, srcNode);
//    }
//}

function setCompareCalendarDate(startDateInput, endDateInput) {
    var startDate = startDateInput.val();
    var endDate = endDateInput.val();
    if (startDate && endDate) {
        if (startDate > endDate) {//交换数据
            startDateInput.val(endDate);
            endDateInput.val(startDate);
        }
        
    }
    startDateInput.next('input').val(changeToNumberStr(startDateInput.val()));
    endDateInput.next('input').val(changeToNumberStr(endDateInput.val()));
}
//输入区间数字时，如果前面的值大于后面的值，则两个值互换
function setCompareNumber(minInput,maxInput) {
    minValue = minInput.val();
    maxValue = maxInput.val();
    if (minValue && maxValue) {
        minValue = new Number(minValue);
        maxValue = new Number(maxValue);
        if (minValue > maxValue) {
            minInput.val(maxValue);
            maxInput.val(minValue);
        }
    }
}

$(document).ready(function(){
    $('.date-range input').on('change',function(ev){
        //alert($(this).attr('rules')+"   *****  "+$(this).siblings().attr('rules'));
        var startDateInput,endDateInput;
        if($(this).attr('rules') == 'startDate'){
            startDateInput = $(this);
            endDateInput = $(this).siblings('input:text');
            if (!endDateInput.val()) {
                endDateInput.val(startDateInput.val());
            }
        }else{
            startDateInput = $(this).siblings('input:text');
            endDateInput = $(this);
        }
        setCompareCalendarDate(startDateInput,endDateInput);
    });
    
    $('.number-range input').on('blur',function(ev){
        var minInput,maxInput;
        if($(this).attr('rules') == 'min'){
            minInput = $(this);
            maxInput = $(this).siblings();
        }else{
            minInput = $(this).siblings();
            maxInput = $(this);
        }
        setCompareNumber(minInput,maxInput);
    });
});
//编辑菜单关闭后显示列表页
function showGridList(editForm, scrollTop){
    editForm.clearFields();
    editForm.clearErrors();
    $('#editContent').addClass('hide');
    $('#detailContent').addClass('hide');
    $('#listContent').removeClass('hide');
    if (!scrollTop) {
        scrollTop = 0;
    }
    $(window).scrollTop(scrollTop);
}

//关闭编辑窗口
function editFormClose(paramsObj) {
    var oldContent = paramsObj.oldContent;
    var editForm = paramsObj.editForm;
    var editSubmit = paramsObj.editSubmit;
    var scrollTop = paramsObj.scrollTop;
    var newContent = editForm.getRecord();
    if(contentHasChange(oldContent, newContent)){
        $(window).scrollTop(0);
        customConfirm("表单信息已修改，是否提交",function(){
            editSubmit();
        },function(){
            showGridList(editForm, scrollTop);
        });
    } else {
        showGridList(editForm, scrollTop);
    }
    
}

//验证表单是否改变
function contentHasChange(oldData, newData){
    var hasChange = false;
    for(var i in oldData){
        if(i && i != 'undefined'&& oldData[i] != newData[i] && !(oldData[i] instanceof Array)){
            hasChange = true;
        }
    }
    return hasChange;
}
//自定义确认弹窗
function customConfirm(msg,confirmFunc,cancelFunc){
    BUI.Message.Show({
        msg : msg,
        icon : 'question',
        buttons : [
            {
                text:'是',
                elCls : 'button button-primary',
                handler : function(){
                    confirmFunc();
                    this.close();
                }
            },
            {
                text:'否',
                elCls : 'button',
                handler : function(){
                    cancelFunc();
                    this.close();
                }
            }
        ]
        });
}

function replaceInputNumber() {
    this.value=this.value.replace(/[^\d\.]/g,'');
}

function initBindEvent() {
    $(".number").live("keyup", replaceInputNumber);
    $(".number").live("afterpaste", replaceInputNumber);
}

function formatTimeUnit(v) {
    if (v < 10) {
        return '0' + v;
    }
    return v;
}

function addTipDiv(addDiv, listenerDiv) {
    var _tipHandler = (function() {
        var _divContent = "<div class='tipDiv well' style='display:none'>" +
                                "<div class='icon-div'>"  +
                                    "<span class='x-icon x-icon-small x-icon-warning'>!</span>" +
                                "</div>"+
                                "<div class='tip-content'>提示信息未设置！</div>" +
                                "<div id='remove' class='remove' style='display:none'><i class='icon icon-remove'></i></div>" +
                            "</div>";
        var _tipDivSelector = addDiv + " .tipDiv";
        var _tipDivContentSelector = _tipDivSelector + " .tip-content";
        var _removeSelector = _tipDivSelector + " .remove";
        $(addDiv).prepend(_divContent);
        
        var _tipMessage = "提示信息未设置，请设置。";
        // 提示信息常量
        var _tip_msg_consts = {
            success : "你已提交成功，按取消键或者左侧返回按钮退出该页面。",
            dataNotChange : "页面未修改，请修改后提交。"
        };

        // 设置关闭按钮是否课件，默认不可见
        var _removeIconVisible = false;

        // 设置默认关闭提示的时间。默认5s; 当默认关闭时间小于0，不关闭
        var _defaultSeconds = 5;

        var _show = function(msg,callback) {
            if (msg && msg != "") {
                _tipMessage = msg;
            }
            $(_tipDivContentSelector).html(_tipMessage);
            $(_tipDivSelector).css("display", "block");
            if (_defaultSeconds > 0) {
                watchInternal();
            }
            if(callback) {
                callback();
            }
        };
        var _hide = function() {
            $(_tipDivSelector).css("display", "none");
        };

        var _setMessage = function(msg) {
            _tipMessage = msg;
        };

        var _setIconVisible = function(value) {
            _removeIconVisible = value;
            setIconVisible();
        };

        var _setFadeSeconds = function(value) {
            _defaultSeconds = value;
        };

        function watchInternal() {
            var seconds = _defaultSeconds;
            var count = setInterval(function() {
                seconds--;
                if (seconds <= 0) {
                    _hide();
                    clearInterval(count);
                }
            }, 1000);
        }
        ;
        function setIconVisible() {
            console.log(_removeIconVisible);
            _removeIconVisible ? $(_removeSelector).css("display", "block") : $(_removeSelector).css("display", "none");
        }
        ;
        // 监听事件-监听关闭按钮
        $(_removeSelector).live("click", function() {
            $(_tipDivSelector).css("display", "none");
        });
        // 监听事件-监听内容按键
        $(listenerDiv).keydown(function() {
            $(_tipDivSelector).css("display", "none");
        });

        return {
            show : _show,
            hide : _hide,
            setMessage : _setMessage,
            setRemoveIconVisible : _setIconVisible,
            setFadeSeconds : _setFadeSeconds,
            consts : _tip_msg_consts
        };

    })("" || {});
    return _tipHandler;
}


function setSelectedTop(grid){
    grid.setSelected(grid.getItemAt(0));
}
//增删改修改后锁定对应行
function  setSelectedAdd(){
    store.on('load',function (){
        grid.setSelected(grid.getItemAt(0));
    });
}
function  setSelectedModify(grid,store){
    var selections = grid.getSelection();
    var selectedIndex=grid.indexOfItem(selections[0]);
    store.on('load',function (){
        grid.setSelected(grid.getItemAt(selectedIndex));
    });
}
function setSelectedDel(grid,store){
    var selections = grid.getSelection();
    var totalCount=store.getTotalCount();
    var start=store.get("start");
    var count=grid.getCount();
    var selectedIndex=grid.indexOfItem(selections[0]);
    var pageSize=store.get("pageSize");
    if(totalCount<=start+pageSize){
        selectedIndex=selectedIndex==(count-1)?selectedIndex-1:selectedIndex;
    }
    store.on('load',function (){
        grid.setSelected(grid.getItemAt(selectedIndex));
    });
}
function toAtoc(str){
    var value = str.replace(/[\u4e00-\u9fa5]/g,"");
    return atoc(value.replace(/,/g,""));
}
function toAtocFen(str){
    var value = str.replace(/[\u4e00-\u9fa5]/g,"");
    return atoc(value.replace(/,/g,"")).replace(/元/g,"").replace(/角/g,"").replace(/分/g,"")+"份";
}
/**
 * 数字转中文
 * @param dValue
 * @returns
 */
function atoc(dValue) {
	var maxDec = 2;
	// 验证输入金额数值或数值字符串：
	dValue = dValue.toString().replace(/,/g, "");
	dValue = dValue.replace(/^0+/, ""); // 金额数值转字符、移除逗号、移除前导零
	if (dValue == "") {
		return "零元整";
	} // （错误：金额为空！）
	else if (isNaN(dValue)) {
		return "错误：金额不是合法的数值！";
	}
	var minus = ""; // 负数的符号“-”的大写：“负”字。可自定义字符，如“（负）”。
	var CN_SYMBOL = ""; // 币种名称（如“人民币”，默认空）
	if (dValue.length > 1) {
		if (dValue.indexOf('-') == 0) {
			dValue = dValue.replace("-", "");
			minus = "负";
		} // 处理负数符号“-”
		if (dValue.indexOf('+') == 0) {
			dValue = dValue.replace("+", "");
		} // 处理前导正数符号“+”（无实际意义）
	}
	// 变量定义：
	var vInt = "";
	var vDec = ""; // 字符串：金额的整数部分、小数部分
	var resAIW; // 字符串：要输出的结果
	var parts; // 数组（整数部分.小数部分），length=1时则仅为整数。
	var digits, radices, bigRadices, decimals; // 数组：数字（0~9——零~玖）；基（十进制记数系统中每个数字位的基是10——拾,佰,仟）；大基（万,亿,兆,京,垓,杼,穰,沟,涧,正）；辅币（元以下，角/分/厘/毫/丝）。
	var zeroCount; // 零计数
	var i, p, d; // 循环因子；前一位数字；当前位数字。
	var quotient, modulus; // 整数部分计算用：商数、模数。
	// 金额数值转换为字符，分割整数部分和小数部分：整数、小数分开来搞（小数部分有可能四舍五入后对整数部分有进位）。
	var NoneDecLen = (typeof (maxDec) == "undefined" || maxDec == null || Number(maxDec) < 0 || Number(maxDec) > 5); // 是否未指定有效小数位（true/false）
	parts = dValue.split('.'); // 数组赋值：（整数部分.小数部分），Array的length=1则仅为整数。
	if (parts.length > 1) {
		vInt = parts[0];
		vDec = parts[1]; // 变量赋值：金额的整数部分、小数部分
		if (NoneDecLen) {
			maxDec = vDec.length > 5 ? 5 : vDec.length;
		} // 未指定有效小数位参数值时，自动取实际小数位长但不超5。
		var rDec = Number("0." + vDec);
		rDec *= Math.pow(10, maxDec);
		rDec = Math.round(Math.abs(rDec));
		rDec /= Math.pow(10, maxDec); // 小数四舍五入
		var aIntDec = rDec.toString().split('.');
		if (Number(aIntDec[0]) == 1) {
			vInt = (Number(vInt) + 1).toString();
		} // 小数部分四舍五入后有可能向整数部分的个位进位（值1）
		if (aIntDec.length > 1) {
			vDec = aIntDec[1];
		} else {
			vDec = "";
		}
	} else {
		vInt = dValue;
		vDec = "";
		if (NoneDecLen) {
			maxDec = 0;
		}
	}
	if (vInt.length > 44) {
		return "错误：金额值太大了！整数位长【" + vInt.length.toString() + "】超过了上限——44位/千正/10^43（注：1正=1万涧=1亿亿亿亿亿，10^40）！";
	}
	// 准备各字符数组 Prepare the characters corresponding to the digits:
	digits = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"); // 零~玖
	radices = new Array("", "拾", "佰", "仟"); // 拾,佰,仟
	bigRadices = new Array("", "万", "亿", "兆", "京", "垓", "杼", "穰", "沟", "涧", "正"); // 万,亿,兆,京,垓,杼,穰,沟,涧,正
	decimals = new Array("角", "分", "厘", "毫", "丝"); // 角/分/厘/毫/丝
	resAIW = ""; // 开始处理
	// 处理整数部分（如果有）
	if (Number(vInt) > 0) {
		zeroCount = 0;
		for (i = 0; i < vInt.length; i++) {
			p = vInt.length - i - 1;
			d = vInt.substr(i, 1);
			quotient = p / 4;
			modulus = p % 4;
			if (d == "0") {
				zeroCount++;
			} else {
				if (zeroCount > 0) {
					resAIW += digits[0];
				}
				zeroCount = 0;
				resAIW += digits[Number(d)] + radices[modulus];
			}
			if (modulus == 0 && zeroCount < 4) {
				resAIW += bigRadices[quotient];
			}
		}
		resAIW += "元";
	}
	// 处理小数部分（如果有）
	for (i = 0; i < vDec.length; i++) {
		d = vDec.substr(i, 1);
		if (d != "0") {
			resAIW += digits[Number(d)] + decimals[i];
		}
	}
	// 处理结果
	if (resAIW == "") {
		resAIW = "零" + "元";
	} // 零元
	if (vDec == "") {
		resAIW += "整";
	} // ...元整
	resAIW = CN_SYMBOL + minus + resAIW; // 人民币/负......元角分/整
	return resAIW;
}

/**
 * 中文转数字
 * @param num
 * @returns
 */
function aNumber(num) {
	var numArray = new Array();
	var unit = "亿万元$";
	for ( var i = 0; i < unit.length; i++) {
		var re = eval("/" + (numArray[i - 1] ? unit.charAt(i - 1) : "") + "(.*)" + unit.charAt(i) + "/");
		if (num.match(re)) {
			numArray[i] = num.match(re)[1].replace(/^拾/, "壹拾");
			numArray[i] = numArray[i].replace(/[零壹贰叁肆伍陆柒捌玖]/g, function($1) {
				return "零壹贰叁肆伍陆柒捌玖".indexOf($1);
			});
			numArray[i] = numArray[i].replace(/[分角拾佰仟]/g, function($1) {
				return "*" + Math.pow(10, "分角 拾佰仟 ".indexOf($1) - 2) + "+"
			}).replace(/^\*|\+$/g, "").replace(/整/, "0");
			numArray[i] = "(" + numArray[i] + ")*" + Math.ceil(Math.pow(10, (2 - i) * 4));
		} else
			numArray[i] = 0;
	}
	return eval(numArray.join("+"));
}




//列表中 金额显示悬浮大写
var t1 = new BUI.Tooltip.Tip({
    trigger : '.bui-grid-cell-money-format',
    alignType : 'left', //方向
    elCls : 'tips tips-success',
    titleTpl : '<div>{title}</div>'
  });
$('.bui-grid-cell-money-format').live('mouseenter',function(){
    $(this).clearQueue();
    t1.set('title',toAtoc($(this).html()));
    t1.render();
});
$('.bui-grid-cell-money-format').live('mouseout',function(){
    t1.hide();
});
//列表中 份额显示悬浮大写
var t5 = new BUI.Tooltip.Tip({
    trigger : '.bui-grid-cell-fen-format',
    alignType : 'left', //方向
    elCls : 'tips tips-success',
    titleTpl : '<div>{title}</div>'
  });
$('.bui-grid-cell-fen-format').live('mouseenter',function(){
    $(this).clearQueue();
    t5.set('title',toAtocFen($(this).html()));
    t5.render();
    
});
$('.bui-grid-cell-fen-format').live('mouseout',function(){
    t5.hide();
});

//金额输入框的提示信息
var t2 = new BUI.Tooltip.Tip({
    trigger : '.bui-input-text-format',
    alignType : 'top-left', //方向
    offset : 6,
    elCls : 'tips tips-success',
    titleTpl : '<div>{title}</div>'
});
$('.bui-input-text-format').live('keyup',function(){
    $(this).clearQueue();
    t2.set('title',toAtoc($(this).val()));
    t2.render();
    t2.show();
});
$('.bui-input-text-format').live('mouseenter',function(){
    $(this).clearQueue();
    t2.set('title',toAtoc($(this).val()));
    t2.render();
    
});
$('.bui-input-text-format').live('mouseout',function(){
    t2.hide();
});
$('.bui-input-text-format').live('blur',function(){
    t2.hide();
});




//份额输入框的提示信息
var t3 = new BUI.Tooltip.Tip({
    trigger : '.bui-input-text-format-fen',
    alignType : 'top-left', //方向
    offset : 6,
    elCls : 'tips tips-success',
    titleTpl : '<div>{title}</div>'
});
$('.bui-input-text-format-fen').live('keyup',function(){
    $(this).clearQueue();
    t3.set('title',toAtocFen($(this).val()));
    t3.render();
    t3.show();
});
$('.bui-input-text-format-fen').live('mouseenter',function(){
    $(this).clearQueue();
    t3.set('title',toAtocFen($(this).val()));
    t3.render();
    
});
$('.bui-input-text-format-fen').live('mouseout',function(){
    t3.hide();
});
$('.bui-input-text-format-fen').live('blur',function(){
    t3.hide();
});





//银行卡的提示信息
var t4 = new BUI.Tooltip.Tip({
    trigger : '.bui-input-text-format-bankNo',
    alignType : 'top-left', //方向
    offset : 6,
    elCls : 'tips tips-success',
    titleTpl : '<div   style="font-size:14px;font-weight:900;">{title}</div>'
 });
$('.bui-input-text-format-bankNo').live('keyup',function(){
    onlyNum(this);
    $(this).clearQueue();
    t4.set('title',formatBankNo($(this).val()));
    t4.render();
    t4.show();
});
$('.bui-input-text-format-bankNo').live('mouseenter',function(){
    $(this).clearQueue();
    t4.set('title',formatBankNo($(this).val()));
    t4.render();
    t4.show();
    
});
$('.bui-input-text-format-bankNo').live('mouseout',function(){
    t4.hide();
});
$('.bui-input-text-format-bankNo').live('blur',function(){
    t4.hide();
});
function onlyNum(node){
    node.value=node.value.replace(/\D/g,'');
}
//格式化银行卡号
function formatBankNo(numberStr) {
    if (numberStr == null||numberStr == "") {
        return "&nbsp;";
    }
    numberStr = numberStr.replace(/[\u4e00-\u9fa5]/g,"");
    var re = /(\d{4})(\d+)/;
    while (re.test(numberStr)) {
        numberStr = numberStr.replace(re, "$1&nbsp;$2");
    }
    return numberStr;
}

//银行卡的提示信息
var IDCardTips = new BUI.Tooltip.Tip({
    trigger : '.bui-input-text-format-idCardNo',
    alignType : 'top-left', //方向
    offset : 6,
    elCls : 'tips tips-success',
    titleTpl : '<div   style="font-size:14px;font-weight:900;">{title}</div>'
 });

$('.bui-input-text-format-idCardNo').live('keyup',function(){
    onlyNum(this);
    $(this).clearQueue();
    IDCardTips.set('title',formatIDCardNo($(this).val()));
    IDCardTips.render();
    IDCardTips.show();
});
$('.bui-input-text-format-idCardNo').live('mouseover',function(){
    $(this).clearQueue();
    IDCardTips.set('title',formatIDCardNo($(this).val()));
    IDCardTips.render();
    IDCardTips.show();
    
});
$('.bui-input-text-format-idCardNo').live('mouseout',function(){
    IDCardTips.hide();
});
$('.bui-input-text-format-idCardNo').live('blur',function(){
    IDCardTips.hide();
});;

function formatIDCardNo(val){
    if(val){
        var reg1 = /(\d{6})(\d+)/;
        var reg2 = /(\d{6})(\d{8})(\d+)/;
        if (reg2.test(val)) {
            val = val.replace(reg2, "$1 $2 $3");
        }else if (reg1.test(val)) {
            val = val.replace(reg1, "$1 $2");
        }
    }else{
        val = "&ensp;";
    }
    return val;
}
// 添加规则
function ruleHandlerFunction() {
    var _ruleHandle = (function(){
        function checkStartEndTime(startTime, endTime){
                var start=new Date(startTime.replace("-", "/").replace("-", "/"));
                var end=new Date(endTime.replace("-", "/").replace("-", "/"));
                var timeGap = end - start;
                if(timeGap < 0){
                    return -1;
                }else if (timeGap == 0 ) {
                    return 0;
                }else if(timeGap > 0) {
                    return 1;
                }
                return -2;
        }
        // 日期规则：不能大于对应日期-
        var _ruleBeforeThan = function() {
            BUI.Form.Rules.add({
                    name : 'dayBeforeThan',
                    msg : "所选日期要小于{0}",
                    validator:function(value, baseValue, formatMsg) {
                        var result = checkStartEndTime(value, $(baseValue).val());
                        if(result == 0 || result == -1) {
                            return "所选日期要小于" + $(baseValue).val() ;
                        }
                        $(baseValue + "~.x-field-error").remove();
                        $(baseValue).removeClass("bui-form-field-error");
                    }
                });
        };
        // 日期规则：不能小于对应日期-
        var _ruleAfterThan = function() {
            BUI.Form.Rules.add({
                name : 'dayAfterThan',
                msg : "所选日期要大于{0}",
                validator:function(value, baseValue, formatMsg) {
                    var result = checkStartEndTime(value, $(baseValue).val());
                    if(result == 1 || result == 0) {
                        return "所选日期要大于" + $(baseValue).val() ;
                    }
                    $(baseValue + "~.x-field-error").remove();
                    $(baseValue).removeClass("bui-form-field-error");
                }});
        };
        return {
            addRuleBeforeThan : _ruleBeforeThan,
            addRuleAfterThan : _ruleAfterThan
        };
    })();
    return _ruleHandle;
}




//界面方向键的监听和使用
function  listenerDirection(grid,store){
    if(grid&&store){
        var id=grid.get("el").parent().attr('id');
        var targetDom=document.getElementById(id);
        $(targetDom).live("keydown",function(e){
            var ev = document.all ? window.event : e;
            if(ev.keyCode == 37 ||ev.keyCode == 38 ||ev.keyCode == 39 ||ev.keyCode == 40 ){
                switch(ev.keyCode) {
                        case 37:
                            pagLeft(id);
                            break;
                        case 38:
                            gridUp(grid,store);
                            break;
                        case 39:
                            pagRight(id);
                            break;
                        case 40:
                            gridDown(grid,store);
                            break;
                }
                return false;
            }
        });
        var t0 = new BUI.Tooltip.Tip({
                trigger : '.tableButton',
                alignType : 'top', //方向
                offset : 8,
                elCls : 'tips tips-success',
                titleTpl : '<div>{title}</div>'
            });

        $('.tableButton').live('mouseover',function(){
                $(this).clearQueue();
                t0.set('title',"可按左右方向键进行切换");
                t0.render();
                t0.show();
                
            });
        $('.tableButton').live('mouseout',function(){
            t0.hide();
        });
    }
}
function pagLeft(id){
    if($('#'+id+' .display-tableButton.active').parent('.tableButton').prev().size()==0){
        $('#'+id).find('.tableButton:last').trigger('click');
    }else{
        $('#'+id+' .display-tableButton.active').parent('.tableButton').prev().trigger('click');
    }
}

function pagRight(id){
    if($('#'+id+' .display-tableButton.active').parent('.tableButton').next().size()==0){
        $('#'+id).find('.tableButton:first').trigger('click');
    }else{
        $('#'+id+' .display-tableButton.active').parent('.tableButton').next().trigger('click');
    }
    
}
function gridUp(grid,store){
    var selections = grid.getSelection();
//    var totalCount=store.getTotalCount();
//    var pageSize=store.get("pageSize");
//    var start=store.get("start");
    var selectedIndex=grid.indexOfItem(selections[0]);
    if(selectedIndex==0){
//        $(window).scrollTop($(document).height());
//        if(totalCount<=start+pageSize){
//            grid.setSelected(grid.getItemAt(totalCount%pageSize-1));
//            return;
//        }
//        grid.setSelected(grid.getItemAt(pageSize-1));
        return;
    }
    grid.setSelected(grid.getItemAt(selectedIndex-1));
    $(window).scrollTop($(window).scrollTop()-25);
}
function gridDown(grid,store){
    var selections = grid.getSelection();
    var pageSize=store.get("pageSize");
    var selectedIndex=grid.indexOfItem(selections[0]);
    if(selectedIndex>=(pageSize-1)){
//        grid.setSelected(grid.getItemAt(0));
//        $(window).scrollTop(0);
        return;
    }
    var totalCount=store.getTotalCount();
    var start=store.get("start");
    var count=grid.getCount();
    if(totalCount<=start+pageSize&&selectedIndex==(count-1)){
//        grid.setSelected(grid.getItemAt(0));
//        $(window).scrollTop(0);
        return;
    }
    grid.setSelected(grid.getItemAt(selectedIndex+1));
    $(window).scrollTop($(window).scrollTop()+25);
}

/*
 * 功能：计算两个日期之间的期限（天数）
 * 日期：2014/11/10
 * 说明：如开始日期是20140101，结束日期是20140102，那么计算的期限结果是1天
 */
function calculateTerm(beginDate,endDate){
    //var st1 = "2014/12/30 00:00";
    //var st2 = "2014/12/31 00:00";
    
    var st1 = beginDate.substring(0, 4) + "/" + beginDate.substring(4, 6) + "/" + beginDate.substring(6)+" 00:00";
    var st2 = endDate.substring(0, 4) + "/" + endDate.substring(4, 6) + "/" + endDate.substring(6)+" 00:00";
    var time1 = new Date(st1);
    var time2 = new Date(st2);
    
    var term = 0;
    if( endDate> beginDate)
        term = (time2.getTime()-time1.getTime())/1000/60/60/24;//Math.abs((time2.getTime()-time1.getTime())/1000/60/60/24);//分钟
    
    return term;
}

/*
 * 功能：设置区域控件值
 * 日期：2014/11/24
 * 说明：
 */
function setbankBelongArea(areaShowValue,province,city,data){
    if(data==null)
        return;
    
    if(data.province==data.city){
        $("#"+areaShowValue).val(data.province) ;
    }else{
        $("#"+areaShowValue).val(data.province+data.city) ;
    }
    $("#"+province).val(data.province) ;
    $("#"+city).val(data.city);
}


//不能输入中文
function  noChinese(node$){
    node$.live("keyup",function(){
        this.value = this.value.replace(/[\u4e00-\u9fa5]/g,"");
    });
}
//实现滚动时，表单头固定的功能
var markHeadScrollTop = 0;
function fixedHeadFunction(targetId){
    //滚动距离超过该grid的底部距离或者小于顶部距离时，去掉固定属性
    if($(document).scrollTop() < markHeadScrollTop || ($('#'+targetId+' .bui-grid-bbar').position() && $(document).scrollTop() > $('#'+targetId+' .bui-grid-bbar').position().top))
    {
        $('#'+targetId+' .bui-grid-header-container').removeClass('header-title-fixed');
    }
    //当滚动距离大于头部距离时加上固定属性
    if($('#'+targetId+' .bui-grid-header-container:not(".header-title-fixed")').position()
            && $('#'+targetId+' .bui-grid-bbar').position()
            && $(document).scrollTop() > $('#'+targetId+' .bui-grid-header-container:not(".header-title-fixed")').position().top
            && $(document).scrollTop() < $('#'+targetId+' .bui-grid-bbar').position().top)
    {
        markHeadScrollTop = $('#'+targetId+' .bui-grid-header-container:not(".header-title-fixed")').position().top -$('#'+targetId+' .bui-grid-header-container:not(".header-title-fixed")').height();
        $('#'+targetId+'  .bui-grid-header-container').addClass('header-title-fixed');
    }
}

$('.content').live('keydown',function(ev){
    
    if(ev.keyCode == '13' && $('#btnSearch:visible').length > 0){
        $('#btnSearch').trigger('click');
        return false;
    }
});

//导出Excel
function exportExcel(store,url,formId){
    var records=store.getCount();
    if(records==0){
        BUI.Message.Alert("没有可导出的数据");
        return;
    }
    
    var currentPage=$(".bui-pb-page").val();
    var limit=$(".bui-pb-tc").val();
    var start=(currentPage-1)*limit;
    
    var searchForm=document.getElementById(formId);
    $(searchForm).append("<input type='hidden' name='limit' value='"+limit+"'>")
       .append("<input type='hidden' name='start' value='"+start+"'>");
    
    for(var i = 0; i<searchForm.length;i++){
    	searchForm[i].value = searchForm[i].value.trim();
    }
    
     searchForm.action=url;
     searchForm.method="post";
     searchForm.submit();
     $("input[name='limit']").remove();
     $("input[name='start']").remove();
}

/**
 * 导出Excel
 * @param url 链接
 * @param data json参数
 */
function exportExcelEx(url, data){
    var form=document.createElement("form");
    document.body.appendChild(form);
    form.id="_exportForm"
    form.action= url;
    if (data) {
        data = JSON.parse(data);
        for ( var i in data) {
          //console.log('<input type="hidden" name="' + i + '" value="' + data[i] + '" />');
          $('<input type="hidden" name="' + i + '" value="' + html_encode(data[i]) + '" />').appendTo(form);
        }
    }
    form.method="post";
    form.submit();
    document.body.removeChild(form);
}

function html_encode(str)
{
  var s = "";
  if (str.length == 0) return "";
  s = str.replace(/&/g, "&gt;");
  s = s.replace(/</g, "&lt;");
  s = s.replace(/>/g, "&gt;");
  //不能转换空格,否则存到数据库数据会有一个不是空格的空白,显示到页面会变成'?'
//  s = s.replace(/ /g, "&nbsp;");
  s = s.replace(/\'/g, "&#39;");
  s = s.replace(/\"/g, "&quot;");
  s = s.replace(/\n/g, "<br>");
  return s;
}

function validateIdCard(idCard){
    var regIdCard=/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;

    if(regIdCard.test(idCard)){
        if(idCard.length==18){
            var idCardWi=new Array( 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 );
            var idCardY=new Array( 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 );
            var idCardWiSum=0;
            for(var i=0;i<17;i++){
                idCardWiSum+=idCard.substring(i,i+1)*idCardWi[i];
            }
        
            var idCardMod=idCardWiSum%11;
            var idCardLast=idCard.substring(17);
        
            if(idCardMod==2){
                    if(idCardLast=="X"||idCardLast=="x"){
                        return true;
                    }else{
                        return false;
                    }
            }else{
                    if(idCardLast==idCardY[idCardMod]){
                        return true;
                    }else{
                        return false;
                    }
            }
        }
    }else{
        return false;
    }
}

/**
 * 设置日历控件的时分秒
 */

function getJSDateYYYYMMDD() {
    var jsDate = new Date();
    var month =  (jsDate.getMonth()+1) > 9? (jsDate.getMonth()+1): ("0" + (jsDate.getMonth()+1));
    var date = jsDate.getDate() > 9?  jsDate.getDate() : ("0" + jsDate.getDate());
    return ("" + jsDate.getFullYear() + "-" +month + "-"  + date);
}

function setCalendarTime(time) {
    var reg = /^\d\d:\d\d\:\d\d$/;
    var regTime = "10:00:00";
    if(reg.test(time)) {
        regTime = time;
    }
    var date =   getJSDateYYYYMMDD() +  " " + regTime;
    return date;
}

/**
 * 获取枚举数组的指定key对应的值
 * @param enum
 * @param key
 * @returns {String}
 */
function getDictValue(dictArray, key) {
    var value = "";
    if (dictArray != null) {
        value = dictArray[key];
    }
    if (value == null) {
        if(key!=null){
            value = key;
        }else{
            value = "";
        }
    }
    return value;
}