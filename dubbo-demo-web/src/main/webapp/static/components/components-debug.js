
/**
 * @fileOverview 定义核心对象
 * @version 0.1
 */

/**
 * @name Horn
 * @class Horn
 * Horn对象<br/>
 * Horn UI 的基类对象
 */
/** @lends Horn# */
var Horn = Horn || {
	debug_:false,
	fixed_:true,
    debug: function(funcName, data) {
		if (Horn.debug_ && typeof console != 'undefined' && typeof console.log != 'undefined') {
			console.log(funcName, data);
		}
	}
};
;(function(H){
	var _current = null,_cache = null;
	var _uuid = 0;
    
    var readyFun = [],registerFun = [];
	
    var registerUI = [] ;
    
    var cachedDicts = {};
    
	/**
	 * @description 继承属性和方法
	 * @function
	 * @name Horn#apply
	 * @param {Object} o 继承对象
	 * @param {Object} c 被继承对象
	 * @ignore
	 */
	H.apply = function(o, c, defaults){
        if(defaults){
            H.apply(o, defaults);
        }
        if(o && c && typeof c == 'object'){
            for(var p in c){
                o[p] = c[p];
            }
        }
        return o;
    };
    function supportFixed(){
		var _div = $('<div style="display:none;position:fixed;z-index:100;"></div>');
		$("body").append(_div);
		return _div.css("position") == 'fixed';
	
    }
    function init() {
    	Horn.fixed_=supportFixed();
    	Horn.debug("Horn.init","regist...");
		for ( var i = 0; i < registerFun.length; i++) {
			registerFun[i]();
		}
		Horn.debug("Horn.init","ready...");
		while (readyFun.length > 0) {
			var fun = readyFun.shift();
			fun();
		}
	}
    H.apply(H, {
    	/**
		 * @description 获取唯一ID
		 * @function
		 * @static
		 * @name Horn#id
		 * @param {Object} prefix 返回ID的前缀
		 * @ignore
		 */
    	id : function(prefix){
    		if(!prefix){
    			prefix = "horn-comp-";
    		}
    		return prefix + (_uuid++);
    	},
    	/**
		 * @description 实现继承
		 * @function
		 * @static
		 * @name Horn#extend
		 * @param {Object} sb 子类类
		 * @param {Object} sp 父类
		 * @param {Object} overrides 需要被重写的类
		 * @ignore
		 */
        extend : (function(){
            var io = function(o){
                for(var m in o){
                    this[m] = o[m];
                }
            };
            var oc = Object.prototype.constructor;

            return function(sb, sp, overrides){
                if(typeof sp == 'object'){
                    overrides = sp;
                    sp = sb;
                    sb = overrides.constructor != oc ? overrides.constructor : function(){sp.apply(this, arguments);};
                }
                var F = function(){},
                    sbp,
                    spp = sp.prototype;

                F.prototype = spp;
                sbp = sb.prototype = new F();
                sbp.constructor=sb;
                sb.superclass=spp;
                if(spp.constructor == oc){
                    spp.constructor=sp;
                }
                sb.override = function(o){
                    H.override(sb, o);
                };
                sbp.superclass = sbp.supr = (function(){
                    return spp;
                });
                sbp.override = io;
                H.override(sb, overrides);
                sb.extend = function(o){return H.extend(sb, o);};
                return sb;
            };
        })(),
        /**
		 * @description 实现重载
		 * @function
		 * @static 
		 * @name Horn#override
		 * @param {Object} origclass 原始类
		 * @param {Object} overrides 重载对象
		 * @ignore
		 */
        override : function(origclass, overrides){
            if(overrides){
                var p = origclass.prototype;
                H.apply(p, overrides);
            }
        },
        /**
		 * @description 获取当前Screen
		 * 
		 * @function
		 * @static 
		 * @name Horn#getCurrent
		 * @ignore
		 */
        getCurrent : function(){
//			//以前的current是放在screen或者是form上，不科学，现在去除了tabforjs，可以不需要这个了。
//        	if(!_current){
//	        	if ($("div.h_tab-screen").children("ul").children("li").size() > 0) {
//					_current = $("div.h_tab-screen").nextAll("div").first();
//				} else {
//					_current = $("div.h_screen");
//				}
//        	}
        	if(_current){
        		return _current;
        	}
        	return $(document.body);
        },
        /**
         * @description 设置当前Screen
         * @function
         * @static
         * @name Horn#setCurrent
         * @param {Object} curr
         * @ignore
         */
        setCurrent : function(curr){
        	if(curr){
        		_current = curr;
        	}
        },
        /**
		 * @description 创建组件
		 * @function
		 * @static 
		 * @name Horn#createComp
		 * @param clazz {Function} 类型
		 * @param args {Object} 参数
		 * @ignore
		 */
        createComp : function(clazz,args){
        	if(typeof clazz == "function"){
        		var cmp = new clazz(args);
        		if(cmp instanceof H.Base){
        			this.data(cmp);
        			return cmp;
        		}
        	}
        	return null;
        },
        /**
		 * @description 存储/获取组件
		 * @function
		 * @static 
		 * @name Horn#data
		 * @param arg1 {String/Object}
		 * @param arg2 {String} 参数
		 * @ignore
		 */
        data : function(arg1,arg2){
        	if(!_cache){
        		var tempForm = this.getCurrent().find("form");
        		if(tempForm.length > 0){
        			_cache = tempForm.first(); 
        		}else{
        			_cache = this.getCurrent();
        		}
        	}
        	if($.type(arg1)=="object"){
    			return _cache.data(arg1.getQID(),arg1) ;
    		}
    		else if($.type(arg1)=="string" && arg2){
    			return _cache.data(arg1,arg2) ;
    		}
    		else if($.type(arg1)=="string" && !arg2){
    			return _cache.data(arg1) ;
    		}
    		return _cache.data() ;
        },
        /**
		 * @description 获取组件名称
		 * @function
		 * @static 
		 * @name Horn#getQID
		 * @param arg1 {String} 组件名
		 * @param arg2 {String} 组件别名
		 * @ignore
		 */
        getQID : function(name,alias){
			return name + "$" + (alias || "_") ;
    	},
    	/**
    	 * <b>静态方法</b>
		 * 工具组件的名称获取组件，此方法为静态方法
		 * @function
		 * @static 
		 * @name Horn#getComp
		 * @param  {String} name 组件名称<b>所有组件的名称不能重复，否则只能取到最后一个</b>
		 * @return  {Object} comp 组件对象
		 * @example
		 * Horn.getComp("compName")
		 */
        getComp : function(arg1,arg2){
    		return this.data(this.getQID(arg1,arg2)) ;
        },
        /**
         * @description 根据获取到的el对象来获取对应的组件。
         * 				注意：由于某些组件的el并非是组件化的el，因此可能会导致根据el获取不到对应的组件,
         * 				除非你确定获取到的el是Horn内组件的el，否则不推荐使用。
         * 				。
         * @function
         * @static
         * @name Horn#getCompByEl
         * @param el {JQuery} 使用JQuery获取到的对象
         * @ignore
         */
        getCompByEl : function(el){
        	return H.Base.getCompByEl(el);
        },
        /**
		 * @description 
		 * 		注册初始化方法，创建/扩展框架组件使用
		 * 		框架组件应继承Horn.Base，否则有些特性将无法使用
		 * @function
		 * @static 
		 * @name Horn#register
		 * @param fun {Function} function
		 * @ignore
		 */
        register : function(fun) {
			registerFun.push(fun);
		},
		/**
		 * <b>静态方法</b>
		 * 在页面渲染完成后执行的方法，可注册多次，使用先进先出的执行顺序。<br/>
		 * 执行顺序如下：<br/>
		 * head资源引入的顺序，如果是在components的js加载之前加载，则之前的jquery.ready会先被执行；<br/>
		 * 在components的js加载之后的脚本以及代码中的片段代码遵守以下规则：<br>
		 * Horn.ready的执行顺序优先于jquery.ready<br>
		 * 多个Horn.ready按照代码顺序执行
		 * @function
		 * @static 
		 * @name Horn#ready
		 * @param  {Function} fun 函数
		 * @return {void}
		 * @example
		 * Horn.ready(function(){
    	 *   //TODO
    	 * });
		 */
		ready : function(fun) {
			readyFun.push(fun);
		},
		/**
		 * <b>静态方法</b>
		 * 根据组件id获取组件，此方法为静态方法
		 * @param {String} id <b>所有组件的ID不能重复，否则只能取到第一个</b>
		 * @name Horn#getCompById
		 * @return 
		 * @function
		 * @return  {Object} comp 组件对象
		 * @example
		 * Horn.getCompById("compId");
		 */
	    getCompById : function(id){
	    	return Horn.Base.getCompById(id);
	    },
		/**
		 * @description 
		 * 		注册提交事件，返回false将阻止form提交
		 * @function
		 * @static 
		 * @deprecated 
		 * 		本方案不安全，因此不推荐使用
		 * @name Horn.submitHandler
		 * @param fun {Function} function
		 * @ignore
		 */
		submitHandler : function(fn,_form) {
			var form = $.type(_form)=='string' ? this.getComp(_form) : _form ;
			if(form && form instanceof H.Base){
				form.on('beforesubmit',fn);
			}else{
					var forms = H.getCurrent().find("form");
					forms.each(function(idx,formitem){
						var formComp = H.getCompByEl(formitem);
						if(!formComp){
							H.ready(function(){
								var formComp = H.getCompByEl(formitem);
								formComp.on('beforesubmit',fn);
							});
						}else{
							formComp.on('beforesubmit',fn);
						}
					});
			}
		},
        /**
         * @description 在指定元素下面增加html字符串所表示的元素或页面跳转(html以Redirect:打头)
         * @function
         * @static
         * @name Horn#render
         * @param {string} pageletId 所指定元素的id
         * @param {string} html 所要增加的html字符串
         * @ignore
         */
		render : function(pageletId, html) {
			if (html.indexOf("Redirect:") > -1) {
				window.location = html.substr(9);
			} else {
				$("#" + pageletId).append(html);
			}
		},
        /**
         * @description 初始化页面元素
         * @function
         * @static
         * @name Horn#init
         * @ignore
         */
		init : function(){
			init();
		},
		/**
		 * @description 注册需要初始化的UI
		 * @function
		 * @static 
		 * @name Horn#regUI
		 * @param selector {String} 选择器
		 * @param type {Function} 类型
		 * @ignore
		 */
		regUI : function(selector,type){
			var ui = {} ;
			ui.selector = selector ;
			ui.type = type ;
			registerUI.push(ui) ;
		},
		/**
		 * @description 执行所有初始化方法
		 * @function
		 * @static 
		 * @name Horn#getUIReady
		 * @ignore
		 */
		getUIReady : function(){
			return function(current,sub){
				current = current || H.getCurrent() ;
				function create(list,Class){
					var arr = new Array ;
					list.each(function(i, o) {
						arr.push(H.createComp(Class,o)) ;
					});
					if(Class.DATANAME){
						H.data(Class.DATANAME,sub? arr.concat(H.data(Class.DATANAME)) : arr) ;
					}
				}
				for(var i=0;i<registerUI.length;i++){
					var ui = registerUI[i] ;
					var selects = current.find(ui.selector) ;
					create(selects,ui.type) ;
				}
				Horn.enterToTab(current);
			};
		},
		/**
		 * @description 将enter事件注册为焦点切换
		 * @function
		 * @static 
		 * @name Horn#enterToTab
		 * @ignore
		 */
		enterToTab : function(scope){
	         var inp = scope.find('input:text:visible,input:password:visible');
	         var bindfunc = function (e) {
	             var key = e.which;
	             if (key == 13) {
	                 e.preventDefault();
	                 var nxtIdx = inp.index(this) + 1;
	                 inp.eq(nxtIdx).focus();
	             }
	         };
	         inp.unbind('keydown',bindfunc);
	         inp.bind('keydown', bindfunc);
			
		},
		/**
		 * @description 从字典缓存中获取字典（js）
		 * @function
		 * @static 
		 * @name Horn#getDict
		 * @param {String} 字典名
		 * @ignore
		 */
		/**
         * @description 根据字典名及key获取value（建议使用Horn.Util.getDicts）
         * @function
         * @static 
         * @name Horn#getDict
         * @param {string} dictName 字典名
         * @param {boolean} keys 字典key，可以为单个或多个，多个key以逗号分隔
         * @returns {String} values 字典value，单个或多个，多个value以逗号分隔（当key未定义时返回整个字典）
         */
		getDict : function(dictName, keys){
			if(!cachedDicts[dictName]){
				//先把dict解析出来，避免重复查找dom
				var dictUl = $('.hc_checkboxdiv[ref_target='+dictName+'_s]');
				if(!dictUl.get(0)){
					dictUl = $('.hc_checkboxdiv[ref_target='+dictName+'_m]');
				}
				var lis = dictUl.find("li"),
					staticDict = {}
					;
				lis.each(function(idx,li){
					li = $(li);
					var label = li.attr('title');
					var key = li.attr('value');
					if(!key){
						key = li.attr('key');
					}
					staticDict[key] = label;
				});
				cachedDicts[dictName] = staticDict;
			}
			if (keys) {
				return Horn.Util.getDicts(dictName, keys);
			}
			return cachedDicts[dictName];
			
		}
    });
    
    H.register(H.getUIReady());
    $(document).ready(function() {
		init();
	});

	
	H.Base = function(){
	    this.init.apply(this, arguments);
	};
	H.Base = H.extend(H.Base,{
		COMPONENT_CLASS:"Base",
		/**
		 * @description 组件的name
		 * @field
		 * @type String
		 * @ignore
		 */
		name : null,
		/**
		 * @description 组件的别名
		 * @field
		 * @type String
		 * @ignore
		 */
		alias : null,
		/**
		 * @description 组件所对应的DomElement
		 * @field
		 * @type DomElement
		 * @ignore
		 */
		el : null,
		/**
		 * 从页面进入的参数
		 * @field
		 * @private
		 * @type {Object}
		 * @ignore
		 */
		params : {},
		REG_FUNCTION_NAME:[],
		regFuncs:function(arr){
			this.REG_FUNCTION_NAME=this.REG_FUNCTION_NAME.concat(arr);
			var _base = this, el = this.el;
			if( this.REG_FUNCTION_NAME.length != 0 ){
				for(var i=0 ; i<this.REG_FUNCTION_NAME.length ; i++){
					var funcname = this.REG_FUNCTION_NAME[i];
					if(typeof funcname == 'string' ){
						el[funcname] = function(){
							_base[funcname].apply(_base,arguments);
						};
					}else{
						el[funcname['src']] = function(){
							_base[funcname['tgt']].apply(_base,arguments);
						};
					}
				}
			}
		},
		/**
		 * @ignore
		 */
		regEvents:[],
		/**
		 * @ignore
		 * @function
		 */
		init : function(){
			this.el = $(arguments[0]);
			//this.el.data(H.Base.COMPMENTOBJECT,this);
			this.alias = this.alias || this.el.attr("alias");
			this.name = this.name || this.el.attr("name") ;
			if(this.el&&this.el.attr("paramcacheid")){
				if(Horn.paramCaches){
					this.params = Horn.paramCaches[this.el.attr("paramcacheid")];
					Horn.debug("Horn.UI["+this.COMPONENT_CLASS+"]:params",this.params);
				}
			}
			if ((!this.name) && this.params && this.params.name
					&& !this.el.attr('nonamebyparams')){
				this.name = this.params.name;
			}
			if ((!this.alias) && this.params
					&& this.params.alias){
				this.alias = this.params.alias;
			}
			var name1;
			if (this.params && this.params.name1){
				name1 = this.params.name1;
			}
			this.name = this.name || name1 || H.id();
			this.initCompEvnets();
			this.initStandardEvents();
			this.el.data("QID",this.getQID());
		},
		customEvents : "",
		initStandardEvents : function() {
			var eventTarget = this.getEventTarget && this.getEventTarget();
			var events = this.params && this.params.events;
			if (!events || !eventTarget || !eventTarget.length)return;
			var _this = this;
			$.each(events, function(i, o){
				var eventName = o.event.toLowerCase();
	    		if (_this.customEvents == "" || _this.customEvents.indexOf(eventName) == -1) {
	    			var fn = o["function"] || function(){};
	    			var params = null;
	    			if ($.type(fn) === "string") {
	    				var eventObj = Horn.Util.getFunObj(fn);
	    				fn = eventObj.fn;
	    				params = eventObj.params;
	    			}
	    			if (eventName.indexOf("on") == 0 && $.type(fn) === "function") {
    					eventTarget.bind(eventName.substring(2), params, function(e){
    						return fn.call(_this, e);
    					});
    				}
	    		}
	    	});
		},
		initCompEvnets :function(){
			this.events={};
			if(this.params&&this.params.events){
				var events = this.params.events;
				if(!$.isPlainObject(this.params.events))return;
				for(var key in events){
					var a = Horn.Util.getFunObj(events[key]||'');
					this.on(key,a.fn);
				}
			}
		},
		/**
		 * @description 获取唯一标识
         * @function
		 * @return String
		 * @ignore
		 */
		getQID : function(){
			return H.getQID(this.name,this.alias);
		},
		/**
		 * 所有事件函数
		 * @type {Map}
		 * @ignore
		 */
		events : null,
		/**
		 * 注册一个事件
		 * @param {String} event 事件名称
		 * @param {Function} fn 对应函数
		 * @function
		 * @ignore
		 */
		on : function(event,fn){
			if(!this.events[event]){
				this.events[event] = [];
			}
			this.events[event].push(fn);
		},
		/**
		 * 取消事件
		 * @param {String} event 事件名称
		 * @param {Function} fn 对应函数
		 * @function
		 * @ignore
		 */
		un : function(event,fn){
			var events = this.events[event];
			if(!events){
				return;
			}
			var del = false;
			for(var i =0;i<events.length;i++){
				var eventfn = events[i];
				if(eventfn == fn){
					del = true;
				}
				if( del && i<events.length-1 ){
					events[i] = events[i+1];
				}
			}
			if(del) {
				events.length -=1;
			}
		},
		/**
		 * 执行事件
		 * @param {String} event 事件名称
		 * @param {Object...}  args 执行事件函数时的参数
		 * @return Boolean 执行中断返回false，否则返回true
		 * @function
		 * @ignore
		 */
		fire : function(event){
			var events = this.events[event];
			if(!events) return true;
			var args = [];
			$(arguments).each(function(idx,arg){
				if(idx != 0 ) args.push(arg);
			});
			for(var i = 0; i<events.length ; i++){
				var fn = events[i];
				if(fn.apply(this,args) === false ) {
					return false;
				}
			}
			return true;
		}
	});
	$.extend(H.Base,{
		/**
		 * el.data中存储的HornCompment名称
		 * @type String
		 * @final
		 * @field
		 * @ignore
		 */
		COMPMENTOBJECT:'COMPMENTOBJECT',
		/**
		 * 从dom对象上获取到element
		 * @param {DomElement} el
		 * @return {Horn.Base}
		 * @function
		 */
	    getCompByEl : function(_el){
	    	if(_el instanceof Horn.Base){
	    		return _el;
	    	}
	    	var el = $(_el);
	    	return el.comp();
	    },
		/**
		 * 根据id获取到组件对象
		 * @param {String} id
		 * @return {Horn.Base}
		 * @function
		 * @ignore
		 */
	    getCompById : function(id){
	    	var el = $('#' + id);
	    	return el.comp();
	    }
	    
	});

	jQuery.fn.comp = function(){
		return Horn.data(this.data("QID"));
		//return this.data(H.Base.COMPMENTOBJECT);
	};
})(Horn);




/**
 * @fileOverview Horn.Util 工具类
 * @version 0.1
 */
/**
 * @description 工具类
 * @class
 * @name Horn.Util
 * @static
 */
/**
 * @lends Horn.Util
 */
var Horn = Horn || {} ;
;(function(H){ 
	Horn.Util = {
		dictCache : {},
	    /**
	     * @description 改变方法的作用域
         * @function
         * @name Horn.Util.apply
	     * @param {Function} fn 需要改变作用域的方法
	     * @param {Object} scope 作用域
	     */
	    apply : function(fn,scope){
			return (function(){
				return fn.apply(scope,arguments);
			}) ;
		},
		/**
		 * @description 根据字符串，获取事件对象，包括方法和参数
		 * @function
         * @name Horn.Util.getFunObj
         * @param {String} event
		 */
		getFunObj : function(event) {
			var name = event;
			var params = [];
			if (event.indexOf("(") > -1) {
				name = event.substring(0, event.indexOf("("));
				var ps = event.substring(event.indexOf("(") + 1,
						event.indexOf(")")).split(",");
				for ( var i = 0; i < ps.length; i++) {
					if (ps[i]) {
						params.push(eval("(" + ps[i] + ")"));
					}
				}
			}
			return {
				"fn" : eval("(window."+name+")"),
				"params" : params
			};
		},
		/**
		 * @description 阻止事件冒泡
		 * @function
     	 * @name Horn.Util.stopPropagation
		 * @param {Event} e
		 */
	    stopPropagation:function(e) {
	        if (e && e.stopPropagation) {
	            //支持w3c的stopPropagation()方法
	            e.stopPropagation();
	        } else {
	            //使用ie的方式取消冒泡
	            window.event.cancelBubble = true;
	        }
	    },
		/**
		 * @description 对象转数组
		 * @function
         * @name Horn.Util.obj2Arr
		 * @param obj {Object} 简单对象
		 * @returns {Array}
		 */
	    obj2Arr : function(obj){
	    	var arr = [] ;
	    	if($.type(obj)=="object"){
	    		for(var i in obj){
	    			if("string,number,boolean".indexOf($.type(obj[i]))>-1){
	    				arr.push({"name":i,"value":obj[i]}) ;
	    			}
	    		}
	    	}
	    	return arr ;
	    },
		/**
		 * @description 数组转对象
		 * @function
         * @name Horn.Util.arr2Obj
		 * @param {Array} serValues jQuery序列化数组
		 * @returns {Object} Object
		 */
	    arr2Obj : function(serValues){
	    	var values = {} ;
			for(var i=0;i<serValues.length;i++){
				var name = serValues[i]['name'] ;
				var value = serValues[i]['value'] ;
				if(values[name]!==undefined && values[name]!=="" && values[name]!==null){
					values[name] = values[name] + "" ;
					if(values[name]){
						values[name] = values[name] +","+ value ;
					}
					else{
						values[name] = value ;
					}
				}
				else{
					values[name] = value ;
				}
			}
			return values ;
	    },
		/**
		 * @description 获取form表单提交数据
		 * @function
         * @name Horn.Util.getValues
		 * @param {Object}form
		 * @returns {Object} Object
		 */
		getValues : function(form){
			var serValues = $(form).serializeArray() ;
			var values = this.arr2Obj(serValues) ;
			return values ;
		},
		/**
         * @description 把对象转换为字符串
         * @function
         * @name Horn.Util.encode
		 * @param {object} object 对象
		 * @returns {String} 转换结果字符串
		 */
		encode : function(object) {
			return (function() {
				var _this = this;
				if(_this===null || _this===undefined){
					return "" ;
				}
				if (_this instanceof Function || _this instanceof RegExp) {
					return _this.toString();
				}
				if (_this instanceof String) {
					return '"' + _this.toString() + '"';
				}
				if (_this instanceof Boolean || _this instanceof Number) {
					return _this.toString();
				}
				if (_this instanceof Date) {
					return _this.getTime();
				}
				if (_this instanceof Object || _this instanceof Array) {
					var tempArr = new Array;
					if (_this instanceof Array) {
						for ( var i = 0; i < _this.length; i++) {
							tempArr.push(arguments.callee.call(_this[i]));
						}
					} else {
						for ( var fieldname in _this) {
							if(_this[fieldname]==null || _this[fieldname]==undefined){
								tempArr.push(arguments.callee.call(fieldname) + ':' + '""');
								continue;
							}
							if (jQuery.type(_this[fieldname]) == 'function' || jQuery.type(_this[fieldname]) == 'regexp') {
								continue;
							}
							if (_this[fieldname] instanceof Object) {
								tempArr.push(arguments.callee.call(fieldname) + ':' + arguments.callee.call(_this[fieldname]));
								continue;
							}
							tempArr.push(arguments.callee.call(fieldname) + ':' + arguments.callee.call(_this[fieldname]));
						}
					}
					var retString = tempArr.join('');
					if (_this instanceof Array) {
						retString = '[' + tempArr.join(',') + ']';
					} else {
						retString = '{' + tempArr.join(',') + '}';
					}
					return retString;
				} else {
					return _this.toString();
				}
			}).call(object);
		},
		/**
         * @description 把字符串转换成对象
         * @function
         * @name Horn.Util.decode
		 * @param {string} string 字符串
		 * @returns {object} 转换结果
		 */
		decode : function(string) {
			return jQuery.parseJSON(string);
		},
		 /**
         * @description 获取url后面所带参数的值
         * @function
         * @name Horn.Util.getParamValue
         * @param {string} name 字符串
         * @returns {string} value 值
         */
		getParamValue : function(name){
		    var value = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]*)(\&?)", "i"));
		    return value ? value[1] : value;
		},
		 /**
         * @description Bigpipe动态加载页面的方法
         * @function
         * @name Horn.Util.loadBp
         * @param {object} d 页面元素id属性值或页面元素dom对象
         * @param {string} url 请求的地址
         * @param {object} data 待发送 Key/value参数
         * @param {string} method get或post
         * @param {object} callback 回调函数
         */
		loadBp : function(d,url,data,method,callback){
			function render(obj, bp) {
		        obj.children().remove();
		        BigPipe.onArrive(bp) ;
		        BigPipe.start();
		        H.getUIReady()(obj) ;
		        if(callback) callback.call(obj,obj,bp);
		    }
	    	data = data || {} ;
	    	var id = d ;
	    	var dom = d ;
	    	if(typeof d=="object"){
	    		dom = $(d) ;
	    		if(!dom.attr("id")){
	    			dom.attr("id",H.id());
	    		}
	    		id = dom.attr("id") ;
	    	}
	    	else if(typeof d=="string"){
	    		dom = $("#" + id) ;
	    	}
	    	else{
	    		return ;
	    	}
	        url = (url.indexOf("?") === -1 ? url +"?" : url+"&") + "pagelet=" + id ;
	        if(url.indexOf("http")==-1){
	        	url = context_path+url;
	        }
	        if(method == 'get'){
	        	$.get(url,data,function(result) {
		            render(dom, eval("("+result+")"));
		        });
	        }else{
	        	$.post(url,data,function(result) {
		            render(dom, eval("("+result+")"));
		        });	
	        }
		},
		/**
         * @description 序列化对象
         * @function
         * @name Horn.Util.serializeObject
         * @param {object} param
         * @returns {object} value
         */
		serializeObject : function(param){
			function serArray(per,p){
				var arr = per[p] ;
				for(var i=0 ; i<arr.length; i++){
					var obj = arr[i] ;
					for(var prop in obj){
						if("string,boolean,number".indexOf(jQuery.type(obj[prop]))>-1){
							per[ p + '['+i+'].' + prop] = obj[prop] ;
						}
					}
				}
			}
			if(param && typeof param=='object'){
				for(var p in param){
					if(jQuery.type(param[p])=="array"){
						serArray(param,p);
						delete param[p] ;
					}
				}
			}
			return param ;
		},
        /**
         * @description 动态加载css样式文件
         * @function
         * @name Horn.Util.loadCss
         * @param {string} url 样式地址
         */
		loadCss:function(url){
			BigPipe.onArrive({"html":"","id":H.id(),"css":[url],"js":[],"jsCode":""});
		},
		/**
         * @description 动态加载js文件
         * @function
         * @name Horn.Util.loadScript
         * @param {string} url js文件地址
         */
		loadScript:function(url){
			BigPipe.onArrive({"html":"","id":H.id(),"css":[],"js":[url],"jsCode":""});
			BigPipe.start();
		},
        /**
         * @description 在框架内请求跳转
         * @function
         * @name Horn.Util.jump
         * @param {string} url 样式地址
         * @param {boolean} reload 是否重新载入，若是重新载入，需要加上一个时间戳以规避ie的缓存
         */
		jump : function(url,reload){
			if(Horn.TabScreen){
				this.loadBp(Horn.getCurrent(), url, {},'get');
			}else{
				if(reload){
					url = (url.indexOf("?") === -1 ? url +"?" : url+"&") + "_=" + new Date().getTime();
				}
				window.location = url;
			}
		},
		/**
         * @description 根据字典名及key获取value
         * @function
         * @name Horn.Util.getDicts
         * @param {string} dictName 字典名
         * @param {boolean} keys 字典key，可以为单个或多个，多个key以逗号分隔
         * @returns {String} values 字典value，单个或多个，多个value以逗号分隔（当key未定义时返回该字典名字典）
         */
		getDicts : function(dictName, keys) {
			if (!Horn.Util.dictCache[dictName]) {
				var dictDivs = $("div.hc_hide_div").children("div.hc_checkboxdiv");
				var dictDiv;
				dictDivs.each(function(i, obj){
					var ref_target_str = obj.getAttribute("ref_target");
					if (ref_target_str && (ref_target_str.substring(0, ref_target_str.lastIndexOf("_")) == dictName)) {
						dictDiv = $(obj);
						return false;
					}
				});
				if (dictDiv) {
					Horn.Util.dictCache[dictName] = {};
					dictDiv.find("li").each(function(i, obj){
						var $obj = $(obj);
						Horn.Util.dictCache[dictName][$obj.attr("key")] = $obj.attr("title");
					});
				} else {
					return undefined;
				}
			}
			
			if (keys) {
				if (keys.indexOf(",") != -1) {
					var ks = keys.split(",");
					var values = "";
					$.each(ks, function(i, key){
						if (key) {
							values += "," + Horn.Util.dictCache[dictName][key];
						}
					});
					return values && (values.indexOf(",") != -1 ? values.substring(1) : values);
				} else {
					return Horn.Util.dictCache[dictName][keys];
				}
			} else {
				return Horn.Util.dictCache[dictName];
			}
			
		}
	} ;
})(Horn);

/**
 * @description 获取字符数组
 * @function
 * @name String.toCharArray
 * @returns {Array} array
 */
String.prototype.toCharArray = function() {
	return this.split("");
};
/**
 * @description 获取N个相同的字符串
 * @function
 * @name String.repeat
 * @param {number} num
 */
String.prototype.repeat = function(num) {
	var tmpArr = [];
	for ( var i = 0; i < num; i++)
		tmpArr.push(this);
	return tmpArr.join("");
};
/**
 * @description 逆排序
 * @function
 * @name String.reverse
 */
String.prototype.reverse = function() {
	return this.split("").reverse().join("");
};
/**
 * @description 测试是否是数字
 * @function
 * @name String.isNumeric
 */
String.prototype.isNumeric = function() {
	var tmpFloat = parseFloat(this);
	if (isNaN(tmpFloat))
		return false;
	var tmpLen = this.length - tmpFloat.toString().length;
	return tmpFloat + "0".Repeat(tmpLen) == this;
};
/**
 * @description 测试是否是整数
 * @function
 * @name String.isInt
 */
String.prototype.isInt = function() {
	if (this == "NaN")
		return false;
	return this == parseInt(this).toString();
};
/**
 * @description 合并多个空白为一个空白
 * @function
 * @name String.resetBlank
 */
String.prototype.resetBlank = function() {
	return this.replace(/\s+/g, " ");
};
/**
 * @description 除去左边空白
 * @function
 * @name String.ltrim
 */
String.prototype.ltrim = function() {
	return this.replace(/^\s+/g, "");
};

/**
 * @description 除去右边空白
 * @function
 * @name String.rtrim
 */
String.prototype.rtrim = function() {
	return this.replace(/\s+$/g, "");
};
/**
 * @description 除去两边空白
 * @function
 * @name String.trim
 */
String.prototype.trim = function() {
	return this.replace(/(^\s+)|(\s+$)/g, "");
};

/**
 * @description 保留数字
 * @function
 * @name String.getNum
 */
String.prototype.getNum = function() {
	return this.replace(/[^\d]/g, "");
};

/**
 * @description 保留字母
 * @function
 * @name String.getEn
 */
String.prototype.getEn = function() {
	return this.replace(/[^A-Za-z]/g, "");
};

/**
 * @description 保留中文
 * @function
 * @name String.getCn
 */
String.prototype.getCn = function() {
	return this.replace(/[^\u4e00-\u9fa5\uf900-\ufa2d]/g, "");
};

/**
 * @description 得到字节长度
 * @function
 * @name String.getRealLength
 */
String.prototype.getRealLength = function() {
	return this.replace(/[^x00-xff]/g, "--").length;
};
/**
 * @description 从左截取指定长度的字串
 * @function
 * @name String.left
 * @param {number} n
 */
String.prototype.left = function(n) {
	return this.slice(0, n);
};
/**
 * @description 从右截取指定长度的字串
 * @function
 * @name String.right
 * @param {number} n
 */
String.prototype.right = function(n) {
	return this.slice(this.length - n);
};

/**
 * @description HTML编码
 * @function
 * @name String.HTMLEncode
 */
String.prototype.HTMLEncode = function() {
	var re = this;
	var q1 = [ /x26/g, /x3C/g, /x3E/g, /x20/g ];
	var q2 = [ "&", "<", ">", " " ];
	for ( var i = 0; i < q1.length; i++)
		re = re.replace(q1[i], q2[i]);
	return re;
};
/**
 * @description Unicode转化
 * @function
 * @name String.ascW
 */
String.prototype.ascW = function() {
	var strText = "";
	for ( var i = 0; i < this.length; i++)
		strText += "&#" + this.charCodeAt(i) + ";";
	return strText;
};
/**
 * @description 首字母大写
 * @function
 * @name String.firstUp
 */
String.prototype.firstUp = function(){
	return this.replace(/(^|\s+)\w/g,function(s){return s.toUpperCase();});
};
/**
 * @description 左端补充字符
 * @function
 * @name String.leftPad
 * @param {string} str 原字符串
 * @param {string} pad 补充字符
 * @param {number} len 补充后字符串总长度
 */
String.leftPad = function(str,pad,len) {
	if(!str){
		return str ;
	}
	if(pad!==undefined && pad!=='' && len>0){
		str = str + "" ;
		pad = pad + "" ;
		while(str.length<len){
			str = pad + str ;
		}
	}
	return str ;
} ;
/**
 * @description 元素在数组中的下标
 * @function
 * @name Array.indexOf
 * @param {Object} object 待查找元素
 * @return 元素在数组中的位置，未找到返回-1
 */
if(!Array.indexOf){
    Array.prototype.indexOf = function(Object){
        for(var i = 0;i<this.length;i++){
            if(this[i] == Object){
                return i;
            }
        }
        return -1;
    };
}
/*
 * 修改日期                        修改人员        修改说明
 * -----------------------------------------------------------------------
 * 2014-4-25 		周智星	BUG #6859 【tip】Horn.Tip.info传入的消失时间不是延迟消失的时间，而是开始消隐到真正消失的时间
 * -----------------------------------------------------------------------
 */
/**
 * @name Horn.Tip
 * @class
 * 提示信息组件<br/>
 * 消息提示，包含成功提示、警告提示、错误提示
 * 在延迟时间到达时，提示框自动隐藏或通过点击提示框马上隐藏
 */

/**
 * @lends Horn.Tip#
 */
 var Horn = Horn || {};
;(function(H){
	Horn.Tip = new (function(){
		function show(el,second){
            el.click(function(){
                $(this).remove();
            });
            $(el).delay(2000).fadeOut(second);
			//var next = $(el).next() ;
		//	$(el).slideDown(1000,"swing",function(){
			//	show(next,second);
		//	}).delay(second * 1000).slideUp(1000,"swing") ;
		}
		
        /**
         * 初始化提示消息显示效果
         * @ignore
         * @function
         * @name Horn.Tip#init
         * @param {Number}毫秒
         */
		this.init = function(second){
			var tip = $("div.h_tips") ;
			var first = tip.children("div").first() ;
				show(first,second?second:Horn.Tip.AUTO_HIDE_DELAY_SEC) ;
		} ;
        /**
         * 清空提示消息内容
         * @function
         * @name Horn.Tip#clear
         * @ignore
         */
		this.clear = function(){
			var tip = $("div.h_tips") ;
			tip.children("div:hidden").remove() ;
		} ;
        /**
         * 添加提示消息
         * @function
         * @name Horn.Tip#addTip
         * @param type 提示类型
         * @param message 提示消息
         * @ignore
         */
		this.addTip = function(type,message){
			if (arguments.length == 1){
				return this.addTip(Horn.Tip.TYPES.INFO, type);
			}
			var css = "";
			if(type ==  Horn.Tip.TYPES.INFO){
				css = Horn.Tip.CSS.INFO;
			}else if(type ==  Horn.Tip.TYPES.WARNING){
				css = Horn.Tip.CSS.WARNING;
			}else if(type ==  Horn.Tip.TYPES.SUCCESS){
				css = Horn.Tip.CSS.SUCCESS;
			} 
			var tip = $("div.h_tips") ;
			var isFirst = false ;
			if(tip.length==0){
				isFirst = true ;
				tip = $('<div class="h_tips"></div>') ;
				tip.appendTo($(document.body)) ;
			}
			if(message){
				var style = "" ;
				if(isFirst){
					if(Horn.fixed_){
						tip.css("position","fixed");
					}
				}
				if(!isFirst){
		//			style = "style='display:none;'" ;
				}
				tip.prepend($("<div class='"+css+"' "+style+">"+message+"</div>")) ;
			}
		} ;
        /**
         * 添加提示消息
         * @function
         * @name Horn.Tip#addTips
         * @param {Array} messages 提示消息数组
         * @ignore
         */
		this.addTips = function(type,messages){
			if (arguments.length == 1){
				return this.addTips(Horn.Tip.TYPES.INFO, type);
			}
			if(messages && messages.length){
				for(var i=0;i<messages.length;i++){
					this.addTip(type,messages[i]) ;
				}	
			}
		};
	}) ;
	
	Horn.apply(Horn.Tip,{
        /**
         * @description 提示消息种类
         * @field
         * @static
         * @private
         * @name Horn.Tip#TYPES
         */
		TYPES :{
			INFO : "C",
			WARNING : "W",
			SUCCESS :"S"
		},
        /**
         * @description 提示消息对应的css
         * @field
         * @static
         * @private
         * @name Horn.Tip#CSS
         */
		CSS : {
			INFO : "h_i",
			WARNING : "h_e",
			SUCCESS :"h_s"	
		},
        /**
         * @description 自动隐藏的延迟时间
         * @field
         * @static
         * @private
         * @name Horn.Tip#AUTO_HIDE_DELAY_SEC
         * @ignore
         */
		AUTO_HIDE_DELAY_SEC : 500,
        /**
         * @description 显示提示消息
         * @function
         * @name Horn.Tip#info
         * @param {string} message 提示消息信息
         * @param {Number} ms 提示框自动隐藏的时间以毫秒为单位，若ms不为空，隐藏时间为：2000毫秒(提示框停留时间)+ms(提示框渐变消失时间),否则默认为2000毫秒(提示框停留时间)+500毫秒(提示框渐变消失时间)。
         * @return {void}
         */
		info : function(message,ms){
			this.show(this.TYPES.INFO,message,ms);
		},
        /**
         * @description 显示警告消息
         * @function
         * @name Horn.Tip#warn
         * @param {string} message 提示消息信息
         * @param {Number} ms 提示框自动隐藏的时间以毫秒为单位，若ms不为空，隐藏时间为：2000毫秒(提示框停留时间)+ms(提示框渐变消失时间),否则默认为2000毫秒(提示框停留时间)+500毫秒(提示框渐变消失时间)。
         * @return {void}
         */
		warn : function(message,second){
			this.show(this.TYPES.WARNING,message,second);
		},
        /**
         * @description 显示成功消息
         * @function
         * @name Horn.Tip#success
         * @param {string} message 提示消息信息
         * @param {Number} ms 提示框自动隐藏的时间以毫秒为单位，若ms不为空，隐藏时间为：2000毫秒(提示框停留时间)+ms(提示框渐变消失时间),否则默认为2000毫秒(提示框停留时间)+500毫秒(提示框渐变消失时间)。
         * @return {void}
         */
		success : function(message,second){
			this.show(this.TYPES.SUCCESS,message,second);
		},
        /**
         * @description 显示提示消息
         * @function
         * @name Horn.Tip#show
         * @param type 提示消息类型分为三种:(信息)Horn.Tip.TYPES.INFO,(警告)Horn.Tip.TYPES.WARNING,(成功)Horn.Tip.TYPES.SUCCESS
         * @param message 提示消息信息
         * @param ms 提示框自动隐藏的时间以秒为单位，若ms不为空，隐藏时间为：2000毫秒(提示框停留时间)+ms(提示框渐变消失时间),否则默认为2000毫秒(提示框停留时间)+500毫秒(提示框渐变消失时间)。
         * @return {void}
         * @ignore
         */
		show : function(type , message,second){
			this.clear();
			this.addTip(type , message);
			this.init(second);
		},
        /**
         * @description 显示提示消息
         * @function
         * @name Horn.Tip#shows
         * @param messages 提示消息信息组 [{"type":Horn.Tip.TYPES.SUCCESS,"message":"联合开户成功"}]
         * @param second 提示框自动隐藏的时间以秒为单位，若ms不为空，隐藏时间为：2000毫秒(提示框停留时间)+ms(提示框渐变消失时间),否则默认为2000毫秒(提示框停留时间)+500毫秒(提示框渐变消失时间)。
         * @return {void}
         * @ignore
         */
        shows : function(messages,second){
            this.clear();
            if(messages && messages.length){
                for(var i=0;i<messages.length;i++){
                    this.addTip(messages[i].type , messages[i].message);
                }
            }
            this.init(second);
        }
	});
	/**
	 * 注册提示消息
	 */
	Horn.register(Horn.Tip.init);
})(Horn);

	 
/*
 * -----------------------------------------------------------------------
 * 修订纪录
 * 2014-2-11 		张超		修正window内部控件无法设置值的问题
 * 2014-2-19		张超		修正多个window之间的覆盖问题
 * 2014-4-8			XIE		BUG #6512 窗口大小设置非法值，进行最大和最小值控制，超过最大值使用最大值，小于最小值使用最小值设置，非法值使用默认值处理
 * 2014-4-18        周智星      BUG #6419 [window：弹出窗口]-标题设置问题
 * 2014-4-25		XIE		修复IE7去除滚动特性失效问题
 * 2014-4-25		XIE		增加beforeClose和afterClose回调支持
 * -----------------------------------------------------------------------
 */
/**
 * @name Horn.Window
 * @class
 * 弹出窗口组件<br/>
 * 适用于少量内容的弹出式展示，多用于主业务页面的二级页面，不适合内容较多的页面展示
 */

/**@lends Horn.Window# */

/**
 * 组件的唯一标示
 * @name Horn.Window#<b>id</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 组件的名称
 * @name Horn.Window#<b>name</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 窗口的标题<br/>
 * 标题不宜过长，控制在窗口可展示的范围内，展示一列内容时不要超过8个字符，展示两列时不要超过16个字符，展示三列内容时不要超过25个字符
 * @name Horn.Window#<b>title</b>
 * @type String
 * @default "窗口"
 * @example
 * 无
 */
/**
 * 窗口的宽度<br/>
 * (min:250)小于最小值时使用最小值设置，不设置时使用默认值<br/>
 * 如果设置的宽度大于当前视图（html的window），那么会设置窗口的宽度为当前视图减去30的宽度；
 * <br/>
 * 提示：用来展示一列内容宽度需要250；两列需要500；三列需要750；
 * @name Horn.Window#<b>width</b>
 * @type Number
 * @default 500 
 * @example
 * 无
 */
/**
 * 窗口的高度<br/>
 * (min:150)小于最小值时使用最小值设置，不设置时使用默认值<br/>
 * 如果设置的高度大于当前视图（html的window），那么会设置窗口的高度为当前视图减去30的高度
 * @name Horn.Window#<b>height</b>
 * @type Number
 * @default 500 
 * @example 无
 */
/**
 * 窗口是否可关闭<br/>
 * 
 * @name Horn.Window#<b>closeable</b>
 * @type boolean
 * @default true
 * @example 无
 */
/**
 * 窗口关闭前回调事件<br/>
 * 如果回调函数返回false,则窗口终止关闭动作
 * @name Horn.Window#<b>beforeClose</b>
 * @event
 * @example
 * #@window({"name":"w6","title":"test","beforeClose":"beforeC()"})
    	
    #end
    function beforeC(){
    	alert("关闭之前");
    	return true;
    }
 * 
 */
/**
 * 窗口关闭后回调事件<br/>
 * @name Horn.Window#<b>afterClose</b>
 * @event
 * @example
 *  #@window({"name":"w6","title":"test","afterClose":"afterC()"})
    	
    #end
    function afterC(){
    	alert("关闭之后");
    }
 * 
 */
/**
 * 窗口内容是否支持滚动条<br/>
 * 如果设置此属性为true，当内容的尺寸超出窗口可展示范围后，会在窗口内部出现滚动条；
 * @name Horn.Window#<b>scroll</b>
 * @type boolean
 * @default false
 * @example 无
 * @ignore
 */
/**
 * 窗口的底部按钮栏配置<br/>
 * 
 * @name Horn.Window#<b>buttons</b>
 * @type array
 * @default
 * @example "buttons":[ {"label":"确定","name":"btnOk","event":"todo()"}
 *          ,{"label":"取消","name":"btnCancel","event":"todo2()"} ]
 * @ignore
 */
Horn.emptyFn = function() {
};
(function($) {

	var types = [ 'DOMMouseScroll', 'mousewheel' ];

	if ($.event.fixHooks) {
		for ( var i = types.length; i;) {
			$.event.fixHooks[types[--i]] = $.event.mouseHooks;
		}
	}

	$.event.special.mousewheel = {
		setup : function() {
			if (this.addEventListener) {
				for ( var i = types.length; i;) {
					this.addEventListener(types[--i], handler, false);
				}
			} else {
				this.onmousewheel = handler;
			}
		},

		teardown : function() {
			if (this.removeEventListener) {
				for ( var i = types.length; i;) {
					this.removeEventListener(types[--i], handler, false);
				}
			} else {
				this.onmousewheel = null;
			}
		}
	};

	$.fn.extend({
		mousewheel : function(fn) {
			return fn ? this.bind("mousewheel", fn) : this
					.trigger("mousewheel");
		},

		unmousewheel : function(fn) {
			return this.unbind("mousewheel", fn);
		}
	});

	function handler(event) {
		var orgEvent = event || window.event, args = [].slice
				.call(arguments, 1), delta = 0, deltaX = 0, deltaY = 0;
		event = $.event.fix(orgEvent);
		event.type = "mousewheel";

		// Old school scrollwheel delta
		if (orgEvent.wheelDelta) {
			delta = orgEvent.wheelDelta / 120;
		}
		if (orgEvent.detail) {
			delta = -orgEvent.detail / 3;
		}

		// New school multidimensional scroll (touchpads) deltas
		deltaY = delta;

		// Gecko
		if (orgEvent.axis !== undefined
				&& orgEvent.axis === orgEvent.HORIZONTAL_AXIS) {
			deltaY = 0;
			deltaX = -1 * delta;
		}

		// Webkit
		if (orgEvent.wheelDeltaY !== undefined) {
			deltaY = orgEvent.wheelDeltaY / 120;
		}
		if (orgEvent.wheelDeltaX !== undefined) {
			deltaX = -1 * orgEvent.wheelDeltaX / 120;
		}

		// Add event and delta to the front of the arguments
		args.unshift(event, delta, deltaX, deltaY);

		return ($.event.dispatch || $.event.handle).apply(this, args);
	}

})(jQuery);

Horn.Window = Horn.extend(Horn.Base,{
					COMPONENT_CLASS : "Window",
					defConf : {
						closeable : true,
						backClickCloseable : false,
						title : "窗口",
						width : 500,
						minWidth : 250,
						maxWidth : 1000,
						height : 500,
						minHeight : 150,
						maxHeight : 600,
						scroll : false
					},
					config : {},
					el : null,
					isShow:false,
					backdrop : null,
					wrapper : null,
					content : null,
					header : null,
					buttonBar : null,
					beforeClose : null,
					afterClose:null,
					beforeCloseFn:function(){return true;},
					afterCloseFn:function(){},
					
					init : function(dom) {
						Horn.Window.superclass.init.apply(this, arguments);
						var el = $(dom);
						this.el = el;
						var win = this;
						this.config = {};
						this.config = $.extend(this.config, this.defConf);
						if (this.params) {
							$.extend(this.config, this.params || {});
							if (isNaN(this.config.width)) {
								this.config.width = this.defConf.width;
							} else if (typeof this.config.width == 'string') {
								this.config.width = parseInt(this.config.width);
							}
							if (this.config.width < this.defConf.minWidth) {
								this.config.width = this.defConf.minWidth;
							}
							if (isNaN(this.config.height)) {
								this.config.height = this.defConf.height;
							} else if (typeof this.config.height == 'string') {
								this.config.height = parseInt(this.config.height);
							}
							if (this.config.height < this.defConf.minHeight) {
								this.config.height = this.defConf.minHeight;
							}
							if (typeof this.config.closeable == 'string') {

								if (this.config.closeable == 'true') {
									this.config.closeable = true;
								} else if (this.config.closeable == 'false') {
									this.config.closeable = false;
								} else {
									this.config.closeable = this.defConf.closeable;
								}
							}
							if (typeof this.config.closeable != 'boolean') {
								this.config.closeable = this.defConf.closeable;
							}
							if(this.config.beforeClose){
								this.beforeClose=this.config.beforeClose;
								var beforeCloseObj=Horn.Util.getFunObj(this.beforeClose);
								if($.type(beforeCloseObj.fn) == "function"){
					                this.beforeCloseFn = beforeCloseObj.fn ;
					            }
							}
							if(this.config.afterClose){
								this.afterClose=this.config.afterClose;
								var afterCloseObj=Horn.Util.getFunObj(this.afterClose);
								if($.type(afterCloseObj.fn) == "function"){
					                this.afterCloseFn = afterCloseObj.fn ;
					            }
							}
						}
						this.content = el.children(".h_floatdiv-con");
						this.header = el.children(".h_floatdiv-title");
						this.buttonBar = el.children(".h_btndiv");
						if (this.buttonBar.length == 0) {
							this.buttonBar = undefined;
						}
						if (this.buttonBar || true == this.config.scroll
								|| 'true' == this.config.scroll) {
							this.config.scroll = true;
						}
						this.backdrop = $("<div class='h_floatdiv-backdrop'></div>");
						var content = $('<div></div>');
						this.backdrop.css("width", "100%")
								.css("height", "100%").css("z-index",
								Horn.Window.getNextZIndex());
						this.el.css("z-index", Horn.Window.getNextZIndex());
						content.append(this.backdrop);
						content.append(this.el);
						this.wrapper = content;
						$(document.body).append(content);
						content.hide();
						// 设置大小
						if (this.config.width) {
							el.css("width", this.config.width + "px");
						}
						if (this.config.height) {
							el.css("height", this.config.height + "px");
						}
						var closebtn = this.header.children("a");
						if (this.config.closeable) {
							closebtn.bind("click", function() {
								win.hide();
							});
						}else{
							closebtn.hide();
						}

						if (this.config.autoShow) {
							this.show();
						}

						if (this.config.backClickCloseable) {
							this.backdrop.click(function() {
								win.hide();
							});
						}
						Horn.getUIReady()(el, true);
						$(window).resize(function(){
							if(win.isShow){
								win.resize();
							}
							
						});
					},
					resize:function(){
						var win = $(window), el = this.el, subHeightRange = 0, subWidthRange = 0;

						var tHeight = win.height();
						var tWidth = win.width();
						var wHeight = el.height();
						var wWidth = el.width();
						subHeightRange = tHeight - wHeight;
						subWidthRange = tWidth - wWidth;
						if (subHeightRange < 38) {
							subHeightRange = 38;
							wHeight = tHeight - 38;
						}
						if (subWidthRange < 38) {
							subWidthRange = 38;
							wWidth = tWidth - 38;
						}
						var wTop = subHeightRange / 2 + $(document).scrollTop();
						var wLeft = subWidthRange / 2
								+ $(document).scrollLeft();
						this.backdrop.css({
							top:$(document).scrollTop(),
							left:$(document).scrollLeft(),
							height:$(window).height(),
							width:$(window).width()
						});
						this.el.css({
							top:wTop,
							left:wLeft,
							width:wWidth,
							height:wHeight
						});
					},
					/**
					 * 显示窗口
					 * 
					 * @name Horn.Window#show
					 * @function
					 * @return void
					 */
					show : function(madel) {
						if (Horn.Window.getOpen() < 1) {
							$("body").addClass("h-overflow-hidden");
							$("html").addClass("h-overflow-hidden");
						}
						Horn.Window.getNextOpen();
						this.resize();
						this.wrapper.show();
						this.el.show();
						this.isShow=true;
						if (this.config.scroll) {
							var cHeight = this.el.height() - this.header.outerHeight();
							if (this.buttonBar) {
								cHeight = cHeight
										- this.buttonBar.outerHeight();
							}
							this.content.css({
								padding:0,
								margin:0,
								border:0,
								height:cHeight
							}).addClass("h-overflow-auto");

						} else {
							this.el.mousewheel(function() {
								return false;
							});
						}

					},
					/**
					 * 隐藏窗口
					 * 
					 * @name Horn.Window#hide
					 * @function
					 * @return void
					 */
					hide : function() {
						 if(this.beforeCloseFn.call()){
								if (Horn.Window.getPrevOpen() < 1) {
									$("body").removeClass("h-overflow-hidden");
									$("html").removeClass("h-overflow-hidden");
								}
								this.wrapper.hide();
								this.isShow=false;
								this.afterCloseFn.call();
						 }
						

					},
					/**
					 * 设置窗口标题
					 * 
					 * @name Horn.Window#setTitle
					 * @param {String}title
					 *            标题
					 * @function
					 * @return void
					 */
					setTitle : function(title) {
						this.el.children(".h_floatdiv-title").children("span")
								.text(title);
						//BUG #6419 [window：弹出窗口]-标题设置问题
						this.el.children(".h_floatdiv-title").children("span").attr("title",title);
					}
				});

$.extend(Horn.Window, {
	"DATANAME" : "h_window",
	"MAX_ZINDEX" : 100,
	"OPENED" : 0,
	getNextOpen:function(){
		if(top.Horn&&top.Horn.Window){
			top.Horn.Window.OPENED++;
		}else{
			Horn.Window.OPENED++;
			return Horn.Window.OPENED;
		}
	},
	getPrevOpen:function(){
		if(top.Horn&&top.Horn.Window){
			top.Horn.Window.OPENED--;
			return top.Horn.Window.OPENED;
		}else{
			Horn.Window.OPENED--;
			return Horn.Window.OPENED;
		}
	},
	getOpen:function(){
		if(top.Horn&&top.Horn.Window){
			return top.Horn.Window.OPENED;
		}else{
			return Horn.Window.OPENED;
		}
	},
	getNextZIndex:function(){
		if(top.Horn&&top.Horn.Window){
			top.Horn.Window.MAX_ZINDEX++;
			return top.Horn.Window.MAX_ZINDEX;
		}else{
			Horn.Window.MAX_ZINDEX++;
			return Horn.Window.MAX_ZINDEX;
		}
	},
	"get" : function(name) {
		var arr = Horn.data(Horn.Window.DATANAME);
		var win = arr[name];
		return win;
	}
});
Horn.regUI("div.h_floatdiv", Horn.Window);
	Horn.Util.Format = {
	        /**
	         * Formats the number according to the format string.
	         * <div style="margin-left:40px">examples (123456.789):
	         * <div style="margin-left:10px">
	         * 0 - (123456) show only digits, no precision<br>
	         * 0.00 - (123456.78) show only digits, 2 precision<br>
	         * 0.0000 - (123456.7890) show only digits, 4 precision<br>
	         * 0,000 - (123,456) show comma and digits, no precision<br>
	         * 0,000.00 - (123,456.78) show comma and digits, 2 precision<br>
	         * 0,0.00 - (123,456.78) shortcut method, show comma and digits, 2 precision<br>
	         * To reverse the grouping (,) and decimal (.) for international numbers, add /i to the end.
	         * For example: 0.000,00/i
	         * </div></div>
	         * @param {Number} v The number to format.
	         * @param {String} format The way you would like to format this text.
	         * @return {String} The formatted number.
	         */
	        number: function(v, format) {
	            if(!format){
			        return v;
			    }
	            v = Number(v === null || typeof v == 'boolean' ? NaN : v);
	            if (isNaN(v)){
	                return '';
	            }
			    var comma = ',',
			        dec = '.',
			        i18n = false,
			        neg = v < 0;
			
			    v = Math.abs(v);
			    if(format.substr(format.length - 2) == '/i'){
			        format = format.substr(0, format.length - 2);
			        i18n = true;
			        comma = '.';
			        dec = ',';
			    }
			
			    var hasComma = format.indexOf(comma) != -1, 
			        psplit = (i18n ? format.replace(/[^\d\,]/g, '') : format.replace(/[^\d\.]/g, '')).split(dec);
			
			    if(1 < psplit.length){
			        v = v.toFixed(psplit[1].length);
			    }else if(2 < psplit.length){
			        throw ('NumberFormatException: invalid format, formats should have no more than 1 period: ' + format);
			    }else{
			        v = v.toFixed(0);
			    }
			
			    var fnum = v.toString();
			    if(hasComma){
			        psplit = fnum.split('.');
			
			        var cnum = psplit[0], parr = [], j = cnum.length, m = Math.floor(j / 3), n = cnum.length % 3 || 3;
			
			        for(var i = 0; i < j; i += n){
			            if(i != 0){
			                n = 3;
			            }
			            parr[parr.length] = cnum.substr(i, n);
			            m -= 1;
			        }
			        fnum = parr.join(comma);
			        if(psplit[1]){
			            fnum += dec + psplit[1];
			        }
			    }
			
			    return (neg ? '-' : '') + format.replace(/[\d,?\.?]+/, fnum);
	        }
	};
	
/**
 * 日期格式化，将日期对象解析为指定格式的日期字符串
 */
Date.prototype.format=function(fmt) {         
    var o = {         
    "M+" : this.getMonth()+1, //月份         
    "d+" : this.getDate(), //日         
    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时         
    "H+" : this.getHours(), //小时         
    "m+" : this.getMinutes(), //分         
    "s+" : this.getSeconds(), //秒         
    "q+" : Math.floor((this.getMonth()+3)/3), //季度         
    "S" : this.getMilliseconds() //毫秒         
    };         
    var week = {         
    "0" : "/u65e5",         
    "1" : "/u4e00",         
    "2" : "/u4e8c",         
    "3" : "/u4e09",         
    "4" : "/u56db",         
    "5" : "/u4e94",         
    "6" : "/u516d"        
    };         
    if(/(y+)/.test(fmt)){         
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));         
    } 
    /**
    if(/(E+)/.test(fmt)){         
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);         
    } */        
    for(var k in o){         
        if(new RegExp("("+ k +")").test(fmt)){         
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));         
        }         
    }         
    return fmt;         
};
/*
 * -------------------------------------------------------------
 * 修订记录
 * 2014-2-19	张超	修正formgrid在重新提交时的验证不通过问题。
 * 2014-06-12   STORY #8553 [经纪业务事业部/胡志武][TS:201406060039-JRESPlus]-future 校验存在问题
 * -------------------------------------------------------------
 */
/**
 * 校验
 * @name Horn.Validate
 * @class
 * 表单校验组件
 * @example Horn.Validate.isFormValidate(form)
 */
/**
 * @lends Horn.Validate
 */
Horn.Validate = {
    /**
     * @ignore
     * @constant
     * @description {Sting} 必填字符串
     * @field
     * @default required
     */
    REQUIRED : "required",
    /**
     * @ignore
     * @constant
     * @description 验证属性
     * @field
     * @default check
     */
    CHECK : "check",
    /**
     * @ignore
     * @constant
     * @description 验证规则分隔符,默认为分号
     * @field
     * @default ;
     */
    CHECKSEP : ";",
    /**
     * @ignore
     */
    init : function(dom) {
    	var contain = Horn.getCurrent() ;
    	if(dom){
    		contain = $(dom) ;
    	}
    	else{
    		contain = contain.find("form") ;
    	}
        var _this = this;
        // 初始化表单域
//        var fields =Horn.Field.findFieldCompsIn(contain) ;
//        $(fields).each(
//            function(i, o) {
//                var display = null;
//                var field = o.field;
//                display = field;
//                var type = field.attr("type");
//                if (type == "hidden") {
//                    display = field.next("input");
//                    if(display.length){
//                    	display.bind("change", [ _this, o ],
//                    			Horn.Util.apply(_this.onValid,_this));	
//                    }
//                }
//                if(display.length){
//                    display.bind("blur", [ _this, o ],Horn.Util.apply(_this.onValid,_this));
//                }
//            });
    },
    /**
     * @description 校验指定form对象的有效性
     * @function
     * @name Horn.Validate.isFormValidate
     * @param {object} v 指定form对象(DomElement或Jquery对象)
     */
    isFormValidate : function(v,moreInfo) {
    	if(arguments.length==1){
    		if(typeof arguments[0] == "boolean"){
    			return this.isFormValidate(null, arguments[0]);
    		}
    	}
        var _this = Horn.Validate ;
        var form = null;
        if($(this).length>0 && $(this).prop("tagName")){
            form = $(this);
        }
        else if ($(v).length>0 && $(v).prop("tagName")) {
            form = $(v);
        } else {
            form = Horn.getCurrent().find("form");
        }
        // form grid 的文本框做保护
        var fpanel = form.find("div.h_formgridtitle").nextAll("ul.h_panel") ;
        var inputs = Horn.Field.findFieldsIn(fpanel);
        var fields = Horn.Field.findFieldsIn(form).not(inputs);
        var flag = true;
        var info = [];
        setTimeout(function(){//将所有formgrid里的field组件上的错误清除
        	_this.removeError(inputs) ;
        },100);
        fields.each(function(idx,_field){
        	var field = Horn.getCompByEl(_field);
        	field.validate();
        	if(!field.isValid()) {
        		flag = false;
            	if(moreInfo) {
            		info.push(field.name);
            	}
        	}
        });
        if(flag === false){
        	return moreInfo?info:false;
        }
        return flag;
    },
    /**
     * @description 验证指定对象obj(scope)中组名为groupname的组件(textfield,textarea)的有效性,校验全部通过返回真，否则返回假
     * @function
     * @name Horn.Validate.validateAreaByGroup
     * @param {object} obj 指定对象(DomElement或Jquery对象)
     * @param {String} groupname 组名
     * @return boolean 验证通过为真，否则为假
     * @ignore
     */
    validateAreaByGroup : function($obj,groupname){
    	var fields = Horn.Field.findFieldsIn($obj);
        var flag = true;
        fields.each(function(idx,_field){
        	var field = Horn.getCompByEl(_field);
        	if(field&&field.inGroup(groupname)){
        		field.validate();
	        	if(!field.isValid()){
	        		flag = false;
	        	}
        	}
        });
        return flag;
    },
    /**
     * @ignore
     */
    onValid : function(e) {
        var _this = e.data[0];
        var comp = e.data[1];
        var obj = comp.field;
        var field = obj.prev("input[type='hidden']").size()>0 ? obj.prev() : obj ;
        var rules = _this.getRules.call(_this, field);
		if(comp instanceof Horn.Calendar || comp instanceof Horn.CalendarGroup){
			if (rules && rules.length > 0 && obj.attr("disabled")==undefined){
				var tempRule = [];
				for(var rule in rules){
					if(rules[rule].name==Horn.Validate.REQUIRED){
						tempRule.push(rules[rule]);
					}
				}
				_this.isValide.call(_this, tempRule, comp, field.val());
			}
	        else{
	            _this.removeError.call(_this, comp);
	        }
		}else{
	        if (rules && rules.length > 0 && obj.attr("disabled")==undefined) {
		        _this.isValide.call(_this, rules, comp, field.val());
	        }
	        else{
	            _this.removeError.call(_this, comp);
	        }
		}
    },
    /**
     * 正则校验规则 @ intege 校验规则名称 @ Message 默认返回消息 @ 校验规则+Message 校验规则对应的返回值<br>
     * 使用例子1:<br>属性check设置为"required",当textfield失去焦点或表单提交时，如果内容为空，则提示"当前输入不能为空"<br>
     * #textfield({"id":"userName","label":"名称","name":"name","cols":"1","maxlength":"20","check":"required"})<br>
     * 使用例子2:<br>属性check设置为"required;intege",多个验证规则之间用";"分割，每个验证规则都通过，此组件才算验证通过。<br>
     * 当textfield失去焦点或表单提交时，如果内容为空,则提示验证提示"当前输入不能为空",如果不为空，但内容非整数，则提示"输入的不是整数格式"<br>
     * #textfield({"id":"userAge","label":"年龄","name":"age","cols":"1","check":"required;intege"})<br>
     * ----------正则验证名字开始---------<br>
     * intege 整数<br>
     * intege1 正整数<br>
     * intege2 负整数<br>
     * num 数字<br>
     * num1 正数<br>
     * num2 负数<br>
     * decmal 浮点数<br>
     * decmal1 正浮点数<br>
     * decmal2 负浮点数<br>
     * decmal3 浮点数<br>
     * decmal4 非负浮点数<br>
     * decmal5 非正浮点数<br>
     * email 邮件<br>
     * color 颜色<br>
     * url url<br>
     * chinese 仅中文<br>
     * ascii 仅ACSII字符<br>
     * zipcode 邮编<br>
     * mobile 手机<br>
     * ip4  ip地址<br>
     * notempty 非空<br>
     * picture 图片<br>
     * rar 压缩文件<br>
     * date 日期<br>
     * qq QQ号码<br>
     * tel  电话号码的函数(包括验证国内区号,国际区号,分机号)<br>
     * username  用来用户注册。匹配由数字、26个英文字母或者下划线组成的字符串<br>
     * letter  字母<br>
     * letter_u 大写字母<br>
     * letter_l 小写字母<br>
     * idcard 身份证<br>
     * required  非空<br>
     * ----------正则验证名字结束---------<br>
     * Message : "输入格式不正确"<br>
     * -----------------------------------<br>
     * integeMessage : "输入的不是整数格式"<br>
     * intege1Message : "输入的不是正整数格式"<br>
     * intege2Message : "输入的不是负整数格式"<br>
     * requiredMessage : "当前输入不能为空"<br>
     * emailMessage : "邮件地址不正确"<br>
     * zipcodeMessage : "邮编输入格式不正确"<br>
     * dateMessage : "日期格式不正确"<br>
     * qqMessage : "QQ号码格式不正确"<br>
     * telMessage : "电话号码格式不正确"<br>
     * mobileMessage : "移动电话格式不正确"<br>
     * decmalMessage : "只能输入浮点数格式"<br>
     * decmal1Message : "只能输入正浮点数格式"<br>
     * decmal2Message : "只能输入负浮点数格式"<br>
     * decmal3Message : "只能输入浮点数格式"<br>
     * decmal4Message : "只能输入非负浮点数格式"<br>
     * decmal5Message : "只能输入非正浮点数格式"<br>
     * colorMessage : "只能输入颜色格式"<br>
     * urlMessage : "只能输入url格式"<br>
     * chineseMessage : "只能输入中文格式"<br>
     * asciiMessage : "只能输入ACSII字符格式"<br>
     * ip4Message : "只能输入ip4地址格式"<br>
     * pictureMessage : "只能输入图片格式"<br>
     * rarMessage : "只能输入压缩文件格式"<br>
     * numMessage : "只能输入数字格式"<br>
     * num1Message : "只能输入正数数字格式"<br>
     * num2Message : "只能输入负数数字格式"<br>
     * letterMessage : "只能输入字母格式"<br>
     * letter_uMessage : "只能输入大写字母格式"<br>
     * letter_lMessage : "只能输入小写字母格式"<br>
     * usernameMessage :"只能输入由数字、26个英文字母或者下划线组成的字符串"<br>
     * -----------------------------------<br>
     */
    regexEnum : {
        intege : "^-?[1-9]\\d*$", // 整数
        intege1 : "^[1-9]\\d*$", // 正整数
        intege2 : "^-[1-9]\\d*$", // 负整数
        num : "^([+-]?)\\d*\\.?\\d*$", // 数字
        num1 : "^[1-9]\\d*|0$", // 正数（正整数 + 0）
        num2 : "^-[1-9]\\d*|0$", // 负数（负整数 + 0）
        decmal : "^([+-]?)\\d*\\.\\d+$", // 浮点数
        decmal1 : "^[1-9]\\d*.\\d*|0.\\d*[1-9]\\d*$", // 正浮点数
        decmal2 : "^-([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*)$", // 负浮点数
        decmal3 : "^-?([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*|0?.0+|0)$", // 浮点数
        decmal4 : "^[1-9]\\d*.\\d*|0.\\d*[1-9]\\d*|0?.0+|0$", // 非负浮点数（正浮点数
        // + 0）
        decmal5 : "^(-([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*))|0?.0+|0$", // 非正浮点数（负浮点数
        // + 0）

        email : "^(\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+){0,1}$", // 邮件
        color : "^[a-fA-F0-9]{6}$", // 颜色
        url : "^http[s]?:\\/\\/([\\w-]+\\.)+[\\w-]+([\\w-./?%&=]*)?$", // url
        chinese : "^[\\u4E00-\\u9FA5\\uF900-\\uFA2D]+$", // 仅中文
        ascii : "^[\\x00-\\xFF]+$", // 仅ACSII字符
        zipcode : "^\\d{6}$", // 邮编
        mobile : "^(13|15|18)[0-9]{9}$", // 手机
        ip4 : "^(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)$", // ip地址
        notempty : "^\\S+$", // 非空
        picture : "(.*)\\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$", // 图片
        rar : "(.*)\\.(rar|zip|7zip|tgz)$", // 压缩文件
        date : "^\\d{4}\\d{1,2}\\d{1,2}$", // 日期
        qq : "[1-9][0-9]{4,11}", // QQ号码
        tel : "^(([0\\+]\\d{2,3}-)?(0\\d{2,3})-)?(\\d{7,8})(-(\\d{3,}))?$", // 电话号码的函数(包括验证国内区号,国际区号,分机号)
        username : "^\\w+$", // 用来用户注册。匹配由数字、26个英文字母或者下划线组成的字符串
        letter : "^[A-Za-z]+$", // 字母
        letter_u : "^[A-Z]+$", // 大写字母
        letter_l : "^[a-z]+$", // 小写字母
        required : "^ *\\S[\\S ]*$", // 非空

        Message : "输入格式不正确",
        integeMessage : "输入的不是整数格式",
        intege1Message : "输入的不是正整数格式",
        intege2Message : "输入的不是负整数格式",
        requiredMessage : "当前输入不能为空",
        emailMessage : "邮件地址不正确",
        zipcodeMessage : "邮编输入格式不正确",
        dateMessage : "日期格式不正确",
        qqMessage : "QQ号码格式不正确",
        telMessage : "电话号码格式不正确",
        mobileMessage : "移动电话格式不正确",
        decmalMessage : "只能输入浮点数格式",
        decmal1Message : "只能输入正浮点数格式",
        decmal2Message : "只能输入负浮点数格式",
        decmal3Message : "只能输入浮点数格式",
        decmal4Message : "只能输入非负浮点数格式",
        decmal5Message : "只能输入非正浮点数格式",
        colorMessage : "只能输入颜色格式",
        urlMessage : "只能输入url格式",
        chineseMessage : "只能输入中文格式",
        asciiMessage : "只能输入ACSII字符格式",
        ip4Message : "只能输入ip4地址格式",
        pictureMessage : "只能输入图片格式",
        rarMessage : "只能输入压缩文件格式",

        numMessage : "只能输入数字格式",
        num1Message : "只能输入正数数字格式",
        num2Message : "只能输入负数数字格式",
        letterMessage : "只能输入字母格式",
        letter_uMessage : "只能输入大写字母格式",
        letter_lMessage : "只能输入小写字母格式",
        usernameMessage :"只能输入由数字、26个英文字母或者下划线组成的字符串"
    },
    /**
     * 方法校验规则 @ range 校验方法名称 @ Message 默认返回消息 @ 校验规则+Message 校验规则对应的返回值<br>
     * 使用例子1:<br>属性check设置为"intege;range(10,20)",当textfield失去焦点或表单提交时，如果录入内容为45,不在整数的10~20(10<=x<=20)之间，供示提示"45不在10-20范围内"<br>
     * #textfield({"id":"userAge","label":"年龄","name":"age","cols":"1","check":"intege;range(10,20)"})<br>
     * 使用例子2:<br>自定义函数验证,期望值与输入值不相同时，返回错误提示信息，否则返回true<br>
     *#textfield({"id":"userName","label":"名称","name":"name","cols":"1","check":"required;myCheck()"})<br>
     *function myCheck(){<br>
     *    var value = Horn.getComp("name").getValue();<br>
     *    if(!("hello"==value)){<br>
     *       return "内容必需为hello";<br>
     *    }else{<br>
     *       return true;<br>
     *    }<br>
     *  }<br>
     * 校验参数，min：最小值，max：最大值,value:校验传入的value值<br>
     * range(value, min, max)<br>
     * 校验参数，value：值，refname：与value比较的元素名字,如果value与refname指定的元素的值相等返回真，否则返回假<br>
     * compare(value,refname)<br>
     * 校验参数，value值，minLen最小长度，maxLen最大长度，如果value的长度在minLen和maxLen之间返回真，否则返回假<br>
     * length(value,minLen,maxLen)<br>
     * 校验参数，value值，输入的日期小于当前日期返回真，否则返回假<br>
     * past(value)<br>
     * 校验参数，value值，输入的日期大于当前日期返回真，否则返回假<br>
     * future(value)<br>
     * 校验参数，value值,身份证号合法时返回真，否则返回假<br>
     * idcard(value)<br>
     *
     */
    funcEnum : {
        /**
         * @param 校验参数，min：最小值，max：最大值
         * @value 校验传入的value值
         */
        range : function(value, min, max) {
            if (min !== undefined) {
                if (value < min) {
                    return false;
                }
            }
            if (max !== undefined) {
                if (value > max) {
                    return false;
                }
            }
            return true;
        },
        rangeMessage : '{0}不在{1}-{2}范围内',
        /**
         * @param {String} value校验的值
         * @param {String} refname对比的组件名称
         */
        compare : function(value,refname){
            var field = Horn.Field.getField(refname);
            if(field.val()!=value){
                return false ;
            }
            return true ;
        },
        compareMessage : '校验不匹配',
        /**
         * 长度判断
         * @param {String} value
         * @param {int} minLen
         * @param {int} maxLen
         * @return {Boolean}
         */
        length : function(value,minLen,maxLen){
            if(value){
                if(value.length>maxLen || value.length<minLen){
                    return false ;
                }
            }
            return true ;
        },
        lengthMessage : '输入的长度{1}-{2}字符之间',
        /**
         * 日期判断，对象日期是否在输入日期之后
         * @param {String} value 校验值
         * @return {Boolean}
         */
        past : function(value){
            var d = new Date() ;
            var year = d.getFullYear() ,
            	month = String.leftPad(d.getMonth() + 1 + "",'0',2),
            	day = String.leftPad(d.getDate() + "", 2, '0') ;
            var dateStr = year + '' + month + '' + day ;
            if(value){
                if(value>=dateStr){
                    return false ;
                }
            }
            return true ;
        },
        pastMessage : '输入的日期{0}必须小于当前日期',
        /**
         * 日期判断，对象日期是否在输入日期之前
         * @param {String} value 校验值
         * @return {Boolean}
         */
        future : function(value){
            var d = new Date() ;
            var year = d.getFullYear() ,
	            month = String.leftPad(d.getMonth() + 1 + "", '0',2) ,
	            day = String.leftPad(d.getDate() + "",'0',2) ;
            var dateStr = year + '' + month + '' + day ;
            if(value){
                if(value<=dateStr){
                    return false ;
                }
            }
            return true ;
        },
        futureMessage : '输入的日期{0}必须大于当前日期',
        /**
         * 身份证判断
         * @param {String} value 校验值
         * @return {Boolean}
         */
        idcard :function(value){
            var vcity={ 11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",
                21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",
                33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",
                42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",
                51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",
                63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"
            };
            //身份证验证
            function checkCard(value)
            {
                var card = value;
                //是否为空
                if(card === '')
                {
                    return false;
                }
                //校验长度，类型
                if(isCardNo(card) === false)
                {
                    return false;
                }
                //检查省份
                if(checkProvince(card) === false)
                {
                    return false;
                }
                //校验生日
                if(checkBirthday(card) === false)
                {
                    return false;
                }
                //检验位的检测
                if(checkParity(card) === false)
                {
                    return false;
                }
                return true;
            };
            //检查号码是否符合规范，包括长度，类型
            function isCardNo(card)
            {
                //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
                var reg = /(^\d{15}$)|(^\d{17}(\d|X)$)/;
                if(reg.test(card) === false)
                {
                    return false;
                }
                return true;
            };
            //取身份证前两位,校验省份
            function checkProvince(card)
            {
                var province = card.substr(0,2);
                if(vcity[province] == undefined)
                {
                    return false;
                }
                return true;
            };
            //检查生日是否正确
            function checkBirthday(card)
            {
                var len = card.length;
                //身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
                if(len == '15')
                {
                    var re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/;
                    var arr_data = card.match(re_fifteen);
                    var year = arr_data[2];
                    var month = arr_data[3];
                    var day = arr_data[4];
                    var birthday = new Date('19'+year+'/'+month+'/'+day);
                    return verifyBirthday('19'+year,month,day,birthday);
                }
                //身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
                if(len == '18')
                {
                    var re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
                    var arr_data = card.match(re_eighteen);
                    var year = arr_data[2];
                    var month = arr_data[3];
                    var day = arr_data[4];
                    var birthday = new Date(year+'/'+month+'/'+day);
                    return verifyBirthday(year,month,day,birthday);
                }
                return false;
            };
            //校验日期
            function verifyBirthday(year,month,day,birthday)
            {
                var now = new Date();
                var now_year = now.getFullYear();
                //年月日是否合理
                if(birthday.getFullYear() == year && (birthday.getMonth() + 1) == month && birthday.getDate() == day)
                {
                    //判断年份的范围（0岁到120岁之间)
                    var time = now_year - year;
                    if(time >= 0 && time <= 120)
                    {
                        return true;
                    }
                    return false;
                }
                return false;
            };
            //校验位的检测
            function checkParity(card)
            {
                //15位转18位
                card = changeFivteenToEighteen(card);
                var len = card.length;
                if(len == '18')
                {
                    var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                    var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                    var cardTemp = 0, i, valnum;
                    for(i = 0; i < 17; i ++)
                    {
                        cardTemp += card.substr(i, 1) * arrInt[i];
                    }
                    valnum = arrCh[cardTemp % 11];
                    if (valnum == card.substr(17, 1))
                    {
                        return true;
                    }
                    return false;
                }
                return false;
            };
            //15位转18位身份证号
            function changeFivteenToEighteen(card)
            {
                if(card.length == '15')
                {
                    var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                    var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                    var cardTemp = 0, i;
                    card = card.substr(0, 6) + '19' + card.substr(6, card.length - 6);
                    for(i = 0; i < 17; i ++)
                    {
                        cardTemp += card.substr(i, 1) * arrInt[i];
                    }
                    card += arrCh[cardTemp % 11];
                    return card;
                }
                return card;
            };
            return checkCard(value);
        },
        idcardMessage : '{0}身份证格式不正确',
        Message : '{0}验证未通过'
    },
    /**
     * 字符串根据规则进行应用 @ str 需要操作的字符串 @ params 操作str字符串{}对应的参数
     * @ignore
     */
    applyString : function(format, params) {
        return format.replace(/\{(\d+)\}/g, function(m, i) {
            return params[i];
        });
    },
    /**
     * @ignore
     * @description isValide 校验方法进行校验 @ rules : Array/Function/String @ str 需要操作的字符串
     * @param {String} rules校验规则
     * @param {Object} display 校验对象
     * @param {String} value 校验值
     * 操作str字符串{}对应的参数 @ rules：Array：regtype注册类型，对应正则表达式名称，或校验方法名称，可选；
     *                 regexparam对应正则表达式第二个参数，可选； message 校验失败返回消息； validFun
     *                 自定义校验方法，可选 其他参数查询查询注册方法：funcEnum
     */
    isValide : function(rules, display, value) {
        var _this = this;
        // 检查校验规则
        if (!rules) {
        	Horn.Msg.alert('提示','fun.isValide 方法校验规则为空，请检查');
            return false;
        }
        // 检查校验规则类型
        var ruleTypes = "string,array,function";
        if (ruleTypes.indexOf($.type(rules)) == -1) {
        	Horn.Msg.alert('提示','fun.isValide 方法校验规则类型不正确，应为：' + ruleTypes);
            return false;
        }
        var isValid = true;
        // 如果有输入正则表达式，就进行表达式校验
        // 处理校验规则类型，整理类型
        if ((typeof rules) == "string")
            rules = [ {
                "name" : rules,
                "params" : [ value ]
            } ];
        if ((typeof rules) == "function")
            rules = [ {
                'name' : rules,
                "params" : [ value ]
            } ];
        // 循环校验规则
        for ( var index = 0; index < rules.length; index++) {
            var item = rules[index];
            var name = item['name'];
            if (name === undefined || name === "") {
                return 'name 校验规则为空请检查';
            }
            if(name!="required" && !value){
                continue ;
            }
            var msg = '';
            if (this.regexEnum[name]) {// 正则表达式进行校验
                isValid = (new RegExp(this.regexEnum[name],
                    item['regexparam'])).test(value);
                msg = item['message'] || this.regexEnum[name + 'Message']
                    || this.regexEnum['Message'];
            } else if (this.funcEnum[name]) {// 校验方法进行校验
                isValid = this.funcEnum[name].apply(display, item.params);
                msg = item['message'] || this.funcEnum[name + 'Message']
                    || this.funcEnum['Message'];
            } else if ($.type(window[name]) == "function") { // 自定义方法校验
            	var tArr = item.params.slice(0) ;
                isValid = window[name].apply(display, tArr);
                msg = isValid;
            } else {
            	Horn.Msg.alert('提示',"错误的校验类型");
                return false;
            }
            if (isValid !== true) {
                var params = item["params"];
                msg = ($.type(msg) == "boolean" || !msg) ? msg
                    : _this.applyString.apply(value, [ msg, params ]);
                _this.addError.call(_this, display, msg);
                return msg;
            }
        }
        if(display.isValid != Horn.Field.prototype.isValid){
        	setTimeout(function(){
        		var msg = display.isValid();
        		if(msg !== true){
        			_this.addError.call(_this, display, msg);
        		}else{
        			_this.removeError.call(_this, display, msg);
        		}
        	},1);
        	return;
        }
        _this.removeError.call(_this, display);

        return isValid;
    },
    /**
     * @description 获取组件上绑定的校验规则
     * @param {String} 组件名称
     * @private
     */
    getRules : function(name) {
        var _this = this;
        var field = Horn.Field.getField(name);
        var check = field.attr(this.CHECK);
        if (check) {
            var checks = check.split(this.CHECKSEP);
            var rules = [];
            $.each(checks, function(index, c) {
                var rule = _this.getRule(field, c);
                if (rule) {
                    rules.push(rule);
                }
            });
            return rules;
        }
    },
    /**
     * @description 获取某一项校验规则
     * @param {String} field组件名称
     * @param {String} rule规则名称
     * @private
     */
    getRule : function(field, rule) {
        /**
         * return : {name:校验规则名称,params:参数列表}
         */
        if (rule) {
            var name = rule;
            var value = field.val();
            var params = [ value ];
            if (rule.indexOf("(") > -1) {
                name = rule.substring(0, rule.indexOf("("));
                var ps = rule.substring(rule.indexOf("(") + 1,
                    rule.indexOf(")")).split(",");
                for ( var i = 0; i < ps.length; i++) {
                    if (ps[i]) {
                        params.push(eval("(" + ps[i] + ")"));
                    }
                }
            }
            return {
                name : name,
                params : params
            };
        }
        return null;
    },
    /**
     * @description 显示错误消息
     * @param {mix} field 为horn组件对象或组件的名字
     * @param {String} errorMsg 错误消息
     */
    addError : function(field, errorMsg) {
	        var tmpfield = (typeof field=="string") ? Horn.getComp(field) : field ;
	        function doshow(tmpfield){
		    	if(tmpfield instanceof Horn.Field){
		    		tmpfield.showError(errorMsg);
		    	}else{
		    		Horn.Tip.addTip(errorMsg);
		    	}
    		}
    		if(!tmpfield){
    			Horn.ready(function(){
    				var tmpfield = (typeof field=="string") ? Horn.getComp(field) : field ;
    				doshow(tmpfield);
    			});
    		}else{
    			doshow(tmpfield);
    		}
    		
    },
    /**
     * @description 删除错误消息
     * @param {mix} field 为horn组件对象或组件的名字
     */
    removeError : function(field) {
       	field = (typeof field=="string") ? Horn.getComp(field) : field ;
    	$(field).each(function(i,f){
    		try{
        		f = Horn.getCompByEl(f) || f ;
        		f.removeError();
    		}catch(e){
    			if(window.console) window.console.warn("批量消除错误失败"+f);
    		}
    	});
    }
} ;


/**
 * @name Horn.Form
 * @class
 * FORM表单组件的包装</br>
 */
/**
 * @lends Horn.Form#
 */
/**
 * 组件唯一标识
 * @name Horn.Form#<b>id</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 组件的名字
 * @name Horn.Form#<b>name</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 组件的提交地址
 * @name Horn.Form#<b>url</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 是否提交form的名字
 * @name Horn.Form#<b>postName</b>
 * @type boolean
 * @default false
 * @ignore
 * @example
 * 无
 */
 /**
  * 是否文件上传<br/>
  * 如果设置fileupload=true,则该form会增加enctype="multipart/form-data"的属性项<br/>
  * 后台的action中使用MultipartFile来接收上传的文件。
  * @name Horn.Form#<b>fileupload</b>
  * @type boolean
  * @ignore
  * @default 
  * @example
  * 无
  */
/**
 * 是否使用Ajax的方式提交form
 * @name Horn.Form#<b>ajax</b>
 * @type Object
 * @default 
 * @ignore
 * @example
 * 无
 */
/**
 * 在请求之前调用的方法，return false可阻止form提交
 * @name Horn.Form#<b>beforeSubmit</b>
 * @type function
 * @default 
 * @example
 * #@form({"url":"$!{contextPath}.get('/test/form/submit.htm')","name":"testForm", "beforeSubmit": "beforeSubmit"})
 * #jscode()
 *   function beforeSubmit() {return false;}
 * #end
 */
 /**
  * 组件的事件配置
  * @name Horn.Form#<b>events</b>
  * @type Array
  * @default ""
  * @example
  * "events":[{"event":"onSubmit","function":"onSubmitFn()"}]
  */

Horn.Form = Horn.extend(Horn.Base,{
	COMPONENT_CLASS:"Form",
    form : null,
    /**
     * @ignore
     */
    ajax : false,
    /**
     * @ignore
     */
    ajaxCallback : false,
    /**
     * @ignore
     */
    onSuccessObj : null,
    /**
     * @ignore
     */
    baseParams:null,
    /**
     * @ignore
     */
    init : function(){
        Horn.Form.superclass.init.apply(this,arguments) ;
        this.form = this.el ;
        var ajax = this.form.attr('ajax');
        var _form = this;
        this.baseParams = {};
        //注册beforeSubmit事件
//        var beforeSubmit = this.el.attr('beforeSubmit');
        this.beforeSubmit = this.params.beforeSubmit;
        var _this = this;
        $.each(this.params.events || [], function(i, o){
        	_this[o.event] = o["function"];
        });
		if(this.beforeSubmit){
			var beforeSubmitObj = Horn.Util.getFunObj(this.beforeSubmit);
		    if(beforeSubmitObj && $.type(beforeSubmitObj.fn) == "function"){
	           this.on('beforesubmit',beforeSubmitObj.fn);
	        }
		}
        var submitfn = function(){
        	return _form.fire('beforesubmit');
        };
		var fn = _form.toAjaxForm;
        _form.toAjaxForm = function(){
        	_form.el.unbind('submit',submitfn);
        	fn.call(_form);
        };
        if(!ajax) { 
	        _form.el.submit(submitfn);
        }else{
        	try{
	        	var ajaxObj = Horn.Util.decode(ajax);
	        	if($.isPlainObject(ajaxObj)){
	        		//注册onSuccess事件
			        var onSuccess = ajaxObj.onSuccess;
			        if(onSuccess){
				        var onSuccessObj = Horn.Util.getFunObj(onSuccess);
					    if(onSuccessObj && $.type(onSuccessObj.fn) == "function"){
				           this.on('ajaxsuccess',onSuccessObj.fn);
				        }
			        }
	        	}
        	}catch(e){
        	
        	}
        	_form.toAjaxForm();
        }
        _form.on('beforesubmit',_form.isValid);
        
        this.form.bind('reset',function(){
        	_form.reset(false);
        	return false;
        });
        
        //若存在type为file的form组件，则改变form的媒体类型。
        if(_form.el.find(':file').get(0)){
        	_form.el.attr('enctype','multipart/form-data');
        }
    },
    customEvents : "beforesubmit",
    getEventTarget : function() {
    	return this.el;
    },
    /**
     * @description 调用此方法会将一个同步提交的form转换成ajaxform提交。
     * @name Horn.Form#toAjaxForm
     * @function
     * @ignore
     */
    toAjaxForm : function(){
    	var _form = this;
    	if(this.ajax === true) return;
    	this.ajax = true;
    	this.el.submit(function(){
    		if( _form.fire('beforesubmit') == true ){
    			_form.doPost();
    		}
			return false;
    	});
    } ,
    /**
     * @description 设置form提交时的初始化参数
     * @function
     * @name Horn.Form#setBaseParams
     * @param {JSON} object
     * @ignore
     */
    setBaseParams : function(Object){
    	this.baseParams = Object;
    },
    /**
     * @ignore
     */
    doPost : function(){
    	var values = this.getValues();
    	var url = this.form.attr('action');

		Horn.apply(values,this.baseParams);
		url = (url.indexOf("?") === -1 ? url +"?" : url+"&") + "pagelet=" + (values.pagelet || new Date().getTime());
		function onAjaxComplate(result){
			var data = eval("("+result+")") ;
		    	BigPipe.onArrive(data);
		    	BigPipe.start();
		    	Horn.init();
		}
		$.post(url,values,onAjaxComplate);
    },
    /**
     * @description 实现form提交
     * @function
     * @name Horn.Form#submit
     */
    submit : function(){
        this.form.submit() ;
    },
    /**
     * @description 重置form内部所有非禁用状态表单的值
     * @function
     * @name Horn.Form#reset
     */
    reset:function(flag){
        if(!flag === false){
        	this.form.get(0).reset();
        }
        Horn.Field.findFieldCompsIn(this.form).each(function(){
        	if($.isFunction( this.reset)){
        		this.reset();
        	}
        });
        var labels = this.form.find("div.hc_label[name]") ;
	    labels.each(function(idx,label){
	    	var $lbl = $(label);
	    	var hlbl = Horn.getCompByEl($lbl);
        		hlbl.setValue('');
	    });
    },
    /**
     * @description 清空form内部所有表单的值
     * @function
     * @name Horn.Form#clearValue
     */
    clearValue:function(){
        Horn.Field.findFieldCompsIn(this.form).each(function(){
    		this.clearValue();
        });
        var labels = this.form.find("div.hc_label[name]") ;
	    labels.each(function(idx,label){
	    	var $lbl = $(label);
	    	var hlbl = Horn.getCompByEl($lbl);
        		hlbl.setValue('');
	    });
    },
    /**
     * @description 获取form的值，以名值对的方式返回
     * @function
     * @name Horn.Form#getValues
     * @return Object
     * @example 如
     * var form = Horn.getComp("form") ;
     * form.getValues() ;
     * 结果--
     * {"client_id":"1000012","fund_account":"2000112"}
     */
    getValues : function(){
        var serValues = this.form.serializeArray() ;
        return Horn.Util.arr2Obj(serValues) ;
    },
    /**
     * @description 获得Form中的field，返回的是一组Horn.Field对象。
     * @function
     * @name Horn.Form#getFieldComps
     * @return Horn.Field对象数组
     */
    getFieldComps : function(){
    	return Horn.Field.findFieldCompsIn(this.el);
    },
    /**
     * @description 给form表单元素设置值
     * @function
     * @name Horn.Form#setValues
     * @param {Object}|{Array} value 设置的值，
     * @param {String} prefix 名称前缀，用于设置'client.name'这一类的值，那么前缀必须跟上"."，即为完整值为"client."才能正常使用，
     * 对于没有前缀的表单，prefix会被忽略。
     * @param {Boolean} clear 若未找到是否设置为空，如果只不为false则表示清空
     * @example 如
     * var form = Horn.getComp("form") ;
     * form.setValues({"client_id":"1000122","fund_account":"112222221"}) ;
     */
    setValues : function(v,prefix,clear){
        var values = v ;
        if(!prefix) prefix='';
        if($.isArray(v)){
            values = Horn.Util.arr2Obj(v) ;
        }
        this.getFieldComps().each(function(idx,field){
        	var mutiName = field.mutiName();
        	if(mutiName){
        		var val = {};
        		var i = 0;
        		$(mutiName).each(function(idx,name){
        			val[name] = values[name.replace(new RegExp('^'+prefix+''),'')];
        			if(val[name]) i++;
        		});
        		if( i != 0 ){
	        		field.setValue( val || '' );
        		}else if(!(clear == false) ){
	        		field.setValue( '' );
        		}
        	}else{
        		var val = values[field.name.replace(new RegExp('^'+prefix+''),'')] ;
        		if(val){
	        		field.setValue( val );
        		}else if(!(clear == false)){
	        		field.setValue('');
        		}
        	}
        });
	    var labels = this.form.find("div.hc_label[name|hiddenName]") ;
	    labels.each(function(idx,label){
	    	var $lbl = $(label);
	    	var hlbl = Horn.getCompByEl($lbl);
	    	var val = values[hlbl.name.replace(new RegExp('^'+prefix+''),'')] ;
    		if(val){
        		hlbl.setValue( val );
    		}else if(!(clear == false)){
        		hlbl.setValue('');
    		}
	    });
    },
    /**
     * @description 是否通过验证，可手动调用，用于验证某个form
     * @name Horn.Form#isValid
     * @function
     * @return Boolean
     * @example 
     * 
     */
    isValid:function(){
        return Horn.Validate.isFormValidate(this.form);
    },
    /**
     * @description 序列化表格元素 (类似 '.serialize()' 方法) 返回 JSON 数据结构数据
     * @name Horn.Form#serializeArray
     * @function
     * @return Array
     * @example [{name: 'firstname', value: 'Hello'},
     * {name: 'lastname', value: 'World'},{name: 'alias'}]
     */
    serializeArray : function(){
        return this.form.serializeArray() ;
    },
    /**
     * @description 序列表表格内容为字符串，表单的数据被格式化类似于“key10=3&key11=5&key13=2&key13=3&key14=A&key15=0”的字符串，并自动将中文字符也进行了编码转换
     * @function
     * @name Horn.Form#serialize
     * @return Array
     */
    serialize : function(){
        return this.form.serialize() ;
    },
    /**
     * @description 从form中查找对应的field。
     * @function
     * @name Horn.Form#findField
     * @param {String} name
     * @param {String} alias
     * @return {DomElement}
     * @ignore
     */
    findField : function(name, _alias){
        var alias = _alias||"" ;
        var field = null;
        var form = this.el;
        if (jQuery.type(name) == 'string') {
            var selector = Horn.Field.getSelector(name, alias);
            field = $(selector, form);
            if (!alias) {
                field = field.not(":disabled");
            }
        } else {
            field = $(name, form);
        }
        return field;
    }
}) ;
$.extend(Horn.Form,{
    DATANAME : "h_form" ,
    /**
     * @description 获取指定名字的Form
     * @function
     * @name Horn.Form.get
     * @param {string} name 表单的名字
     * @return {Horn.Form} form
     * @ignore
     */
    get : function(name){
        var arr = Horn.data(Horn.Form.DATANAME) ;
        var f = arr[0] ;
        return f ;
    }
}) ;
Horn.regUI("form",Horn.Form) ;
/*
 * 修改日期         修改人员        修改说明
 * -----------------------------------------------------------------------
 * 
 * 2014-1-28    zhangc   修正错误显示逻辑，removeError之后无法再次显示的问题
 * 2014-2-24	zhangc   修正removeRule之后会变成逗号分隔的问题。
 * 2014-3-3     cnt      支持重置为defValue为空的值(宏设置参数:defValue:"")
 * 2014-3-3    周智星          BUG #6518 【calendar】先进行非空校验的错误提示，然后调用removeRule("qq")，会造成非空校验的错误提示消失
 * 2014-4-30   周智星          BUG #6916 【textfield】【textarea】【password】"check": "required"情况下调用setReadonly(true)会取消掉非空校验 
 * -----------------------------------------------------------------------
 */
/**
 * @name Horn.Field
 * @class
 * 普通文本输入组件<br/>
 * 包装普通文本框、文本域、密码框等对象的基础操作
 */
/**
 * @lends Horn.Field#
 */
	 

/**
 * 组件唯一标识
 * @name Horn.Field#id
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单提交名字
 * @name Horn.Field#name
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单组件的标签名，值过长会造成label显示不全，但是可以通过鼠标悬浮看到完整值
 * @name Horn.Field#label
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * @ignore
 * 组件的别名，名字相同时，加别名区分
 * @name Horn.Field#alias
 * @type String
 * @default ""
 * @ignore
 * @example
 * var comp = Horn.getComp("name","alias")
 */

 /**
  * 表单的初始值，如果没有配置defValue属性，表单重置的时候，将采用value作为重置值
  * @name Horn.Field#value
  * @type String
  * @default ""
  * @example
  * 无
  */

 /**
  * 组件的重置时的值，如果没有配置此值，将以value属性做为重置值。
  * 如果指定了value值，并且defValue设置为空(defValue:"")，则无法重置为空值，请用form组件的clearValue方法清空form内组件的值或调用组件本身的clearValue方法清空值。
  * @name Horn.Field#defValue
  * @type String
  * @default 无
  * @example
  * 无
  */

 /**
  * 组件的是读配置，被设置为只读的组件只能通过API的方式修改表单的值，可以获得焦点，参与表单校验（校验失败会阻止表单提交），并且可以参与表单提交；
  * true表示只读状态，false表示正常状态
  * @name Horn.Field#readonly
  * @type Boolean
  * @default false
  * @example
  * 无
  */

 /**
  * 组件的禁用状态，被设置禁用状态的组件，无法获得焦点，不参与表单校验（不会阻止表单提交），不会参与表单提交并且其所有校验状态都会消失，不可编辑，但是可以通过setValue、reset等API修改表单的值；
  * true表示禁用，false表示正常状态
  * @name Horn.Field#disabled
  * @type Boolean
  * @default false
  * @example
  * 无
  */

/**
 * 组件的跨列数，取值范围由外容器的screen的cols而定
 * @name Horn.Field#cols
 * @type int
 * @default 1
 * @example
 * 无
 */

/**
 * 组件的约束检查选项
 * @name Horn.Field#check
 * @type String
 * @default ""
 * @example
 * 具体见Horn.Validate类的已经支持的正规、函数名
 * "check":"required;"
 */

/**
 * 组件的所属组，可以对相同组内的元素进行约束检查
 * @name Horn.Field#group
 * @type String
 * @default ""
 * @ignore
 * @example
 * 验证指定对象$obj(scope)中组名为groupname的元素有有效性
 * Horn.Validate.validateAreaByGroup($obj,groupname)
 */

/**
 * 内容最大长度，超过长度的文字无法输入，比如“中文abc”，总共的文字数为5，中文、空格、英文字母、标点都只算一个字符。
 * 但是需要特别注意，maxlength属性只能限制键盘输入，或者粘贴等操作，无法限制api设置操作，并且此属性对textarea无效。
 * @name Horn.Field#maxlength
 * @type Number
 * @default 
 * @example
 * 无
 */

 /**
  * 组件的事件配置
  * @name Horn.Field#events
  * @type Array
  * @default ""
  * @example
  * "events":[{"event":"onchange","function":"getValue()"}]
  */

/**
 * 加入一个分组中，可以根据组名进行分组校验，参见validate的validateAreaByGroup(scope, group)方法
 * @function
 * @name Horn.Field#addGroup
 * @param {String} group 组名
 * @ignore
 */
/**
 * 从一个分组中删除
 * @function
 * @name Horn.Field#removeGroup
 * @param {String} group 组名
 * @ignore
 */
/**
 * 判断组件上会否在分组中
 * @function
 * @name Horn.Field#inGroup
 * @param {String} group 组名
 * @ignore
 */

/**
 * 增加校验规则
 * @function
 * @name Horn.Field#addRule
 * @param {String} rule 校验规则字符串
 */
/**
 * 删除校验规则
 * @function
 * @name Horn.Field#removeRule
 * @param {String} rule 校验规则字符串
 */

/**
 * 显示表单，如果表单已经显示，此方法无效果，hide方法与之相对应
 * @function
 * @name Horn.Field#show
 */
/**
 * 隐藏表单，如果表单已经隐藏，此方法无效果，show方法与之对应
 * @function
 * @name Horn.Field#hide
 */

/**
 * 设置label内容
 * @function
 * @name Horn.Field#setLabel
 * @param {String} label 标签内容
 * @ignore
 */
/**
 * 获取label内容
 * @function
 * @name Horn.Field#getLabel
 * @return 标签内容
 * @ignore
 */

/**
 * 设置为必填项，同时增加红色的 *
 * @function
 * @name Horn.Field#setRequired
 * @param {Boolean} required 不传值或者传true表示必选项，传false表示取消必选项
 */
/**
 * 设置字段是否禁用，被设置为禁用的组件，不可以编辑，也不参与表单提交，但是可以通过setValue、reset等API修改表单的值
 * @function
 * @name Horn.Field#setDisabled
 * @param {Boolean} disabled true表示禁用，false表示正常
 */
/**
 * 设置是否只读，设置为只读方式的组件，不可以编辑，但是可以通过setValue、reset等API修改表单的值，并可以可以参与表单提交
 * @function
 * @name Horn.Field#setReadonly
 * @param {Boolean} readonly true表示只读，false表示正常
 */

/**
 * 设置表单的值
 * @function
 * @name Horn.Field#setValue
 * @param {String} value 值
 */
/**
 * 获取表单的值
 * @function
 * @name Horn.Field#getValue
 * @return 表单的提交值
 */
/**
 * 如果设置了defValue的值，重置成的defValue值，否则重置成value值
 * @function
 * @name Horn.Field#reset
 */
/**
 * 清空表单的值，显示值和隐藏值都设置为""
 * @function
 * @name Horn.Field#clearValue
 */

/**
 * 获取由validate方法触发表单校验后的结果，并通过返回值标识校验的结果
 * @function
 * @name Horn.Field#isValid
 * @return {Boolean} true表示校验通过，false表示校验失败
 */

/**
 * 显示验证错误提示
 * @function
 * @name Horn.Field#showError
 * @param {String} errorMsg 错误信息
 * @ignore
 */
/**
 * 删除错误提示
 * @function
 * @name Horn.Field#removeError
 * @ignore
 */

Horn.Field = Horn.extend(Horn.Base,{
	COMPONENT_CLASS:"Field",
    /**
     * text、textarea字段
     * @name Horn.Field#field
     * @field
     * @ignore
     */
    field : null ,
    /**
     * @name Horn.Field#hidden
     * @description  {jQuery} hidden隐藏域字段
     * @field
     * @ignore
     */
    hidden : null,
    /**
     * @name Horn.Field#checkGroup
     * @description  {jQuery} 字段相关的组名/值键值对
     * @field
     * @ignore
     */
    checkGroup : null,
    /**
     * @name Horn.Field#defValue
     * @description  {String} 字段的默认值
     * @field
     * @ignore
     */
    defValue : "",
    /**
     * @name Horn.Field#defHiddenValue
     * @description  {String} 隐藏字段的默认值
     * @field
     * @ignore
     */
    defHiddenValue : "",
    /**
     * @ignore
     */
    init : function(dom){
        Horn.Field.superclass.init.apply(this,arguments);
        if (this.field == undefined) {
        	this.hidden = this.el.children("input[type='hidden']");
            if(this.hidden.length){
                this.field = this.hidden.next("input[type]") ;
            }
            else{
                this.field = this.el.children("input[type]");
                if(this.field.length==0){
                    this.field = this.el.children("textarea");
                }
            }
        }
        this.name = this.field.attr('name')||this.name;
        this.checkGroup = {};
       	var _field = this,
       	checkgroup = this.field.attr('group');
       	if(checkgroup){
       		var groupArr = checkgroup.split(';');
       		$(groupArr).each(function(idx,group){
       			_field.checkGroup[group] = true;
       		});
       	}
       	this.initEvents();
       	this.defHiddenValue = "";
       	this.defValue = "";
       	if(this.hidden.length > 0) {
       		this.defHiddenValue= this.params.defValue || this.hidden.val() || "";
       	}
       	if(this.field.length > 0){
       		this.defValue = this.params.defValue || this.field.val() || "";
       	}
    },
    getEventTarget : function() {
    	this.hidden = this.el.children("input[type='hidden']");
        if(this.hidden.length){
            this.field = this.hidden.next("input[type]") ;
        }
        else{
            this.field = this.el.children("input[type]");
            if(this.field.length==0){
                this.field = this.el.children("textarea");
            }
        }
    	return this.field;
    },
    /**
     * @name Horn.Field#checkRegx
     * @description  {array} 正则检查字符串数组
     * @field
     * @ignore
     */
    checkRegx : null ,
    /**
     * @name Horn.Field#initEvents
     * @description  正则检查字符串数组
     * @function 初始化方法
     * @private 
     * @ignore
     */
    initEvents : function(){
    	var _field = this;
    	_field.checkRegx = [];
    	var checkStr = this.field.attr('checkstr');
    	if(checkStr) {
    		_field.checkRegx = checkStr.split(';');
    	}
    	this.field.blur(function(){
    		Horn.Validate.onValid({data:[Horn.Validate,_field]});
    	});
    	
//    	if(checkStr.indexOf('blacklist')!=-1){
//    		if(checkStr.indexOf(Horn.Validate.REQUIRED) != -1){
//    			this.showError("请等待黑名单检测完成");
//    		}
//    	}
    },
    /**
     * 内容校验
     * @function
     * @ignore
     * @name Horn.Field#validate
     */
    validate : function(){
    	if(!this.skipValid) {
    		this.field.blur();
    	}
    },
    /**
     * 加入一个分组中
     * @function
     * @name Horn.Field#addGroup
     * @param group 组名
     * @ignore
     */
    addGroup : function(group){
       	this.checkGroup[group] = true;
    },
    /**
     * 从一个分组中删除
     * @function
     * @name Horn.Field#removeGroup
     * @param group 组名
     * @ignore
     */
    removeGroup : function(group){
       	this.checkGroup[group] = false;
    },
    /**
     * 是否在一个分组中
     * @function
     * @name Horn.Field#inGroup
     * @param groupName 组名
     * @ignore
     */
    inGroup : function(groupName){
    	return !!this.checkGroup[groupName];
    },
    /**
     * 获取提交的jQuery包装的field
     * @function
     * @name Horn.Field#get
     * @returns jQuery
     * @ignore
     */
    get : function(){
        if(this.hidden && this.hidden.length){
            return this.hidden ;
        }
        return this.field ;
    },
    /**
     * 增加校验规则
     * @function
     * @name Horn.Field#addRule
     * @param {String} rule 校验规则字符串
     * @ignore
     */
    addRule : function(rule) {
        var input = this.get();
        var check = input.attr(Horn.Validate.CHECK);
        if (check) {
            if (check.indexOf(rule) > -1) {
                return;
            }
            check += Horn.Validate.CHECKSEP + rule;
        } else {
            check = rule;
        }
        input.attr(Horn.Validate.CHECK, check);
        if(rule && rule.indexOf(Horn.Validate.REQUIRED) > -1){
            var li = this.el.parent();
            var span = $("span", li);
            var red = $("b.hc_red", span);
            if (!red.length) {
                red = $("<b>", {
                    "class" : "hc_red",
                    "html" : "*"
                });
                span.prepend(red);
            } else {
                red.html("*");
            }
            
        }
        this.removeError();
    },
    /**
     * 删除校验规则
     * @function
     * @name Horn.Field#removeRule
     * @param {String} rule 校验规则字符串
     * @ignore
     */
    removeRule : function(rule) {
        var input = this.get();
        var check = input.attr(Horn.Validate.CHECK);
          //BUG #6518 【calendar】先进行非空校验的错误提示，然后调用removeRule("qq")，会造成非空校验的错误提示消失
        if (check && check.indexOf(rule) > -1) {//如果要去除的在原来的验证规则了就删除，否则不删除
            var checks = check.split(Horn.Validate.CHECKSEP);
            checks = $.grep(checks, function(c, index) {
                return c && c != rule;
            });
            input.attr(Horn.Validate.CHECK, checks.join(';'));
            this.removeError();
            this.setNotRequired();
        }
    },
    /**
     * 是否跳过验证标识
     * @name Horn.Field#skipValid
     * @field
     * @default false
     * @ignore
     */
    skipValid : false,
    /**
     * 显示field字段，包含label部分
     * @function
     * @name Horn.Field#show
     * @ignore
     */
    show : function() {
    	this.skipValid=false;
        var li = this.el.parent();
        if (li.css("display") == "none") {
            li.css("display", "block");
        }
        if (li.css("visibility") == "hidden") {
            li.css("visibility", "visible");
        }
        Horn.enterToTab(Horn.getCurrent());
    },
    
    /**
     * 隐藏label字段，包含label部分
     * @function
     * @name Horn.Field#hide
     * @param {String} mode 取值为display或visibility
     * @ignore
     */
    hide : function(mode) {//display   visibility
    	this.skipValid=true;
        mode =  mode || "display" ;
        var li = this.el.parent();
        if(mode=="display"){
            li.css("display", "none");
        }
        else{
            li.css("visibility", "hidden");
        }
        if(this.err){
        	this.removeError();
        }
        Horn.enterToTab(Horn.getCurrent());
    },
    /**
     * 设置label标签
     * @function
     * @name Horn.Field#setLabel
     * @param {String} label 标签内容
     * @ignore
     */
    setLabel : function(label){
        var li = this.el.parent();
        var span = $("span", li);
        var red = $("b.hc_red", span);
        span.attr("title",label);
        if (!red.length) {
            span.html(label);
        } else {
            span.html('<b class="hc_red">*</b>'+label);
        }
    },
    /**
     * 获取label标签
     * @function
     * @name Horn.Field#getLabel
     * @return 标签的值
     * @ignore
     */
    getLabel : function(){
        var li = this.el.parent();
        var span = $("span", li);
        return span.attr("title");
    },
    /**
     * 设置为必填项，同时增加红色的 *
     * @function
     * @name Horn.Field#setRequired
     * @ignore
     */
    setRequired : function(required) {
    	if (required === false) {
    		this.setNotRequired();
    		return;
    	}
        this.addRule(Horn.Validate.REQUIRED);
    },
    /**
     * 设置为非必填，同时删除红色的 *
     * @function
     * @name Horn.Field#setNotRequired
     * @ignore
     */
    setNotRequired : function() {
        var li = this.el.parent();
        var span = $("span", li);
        var red = $("b.hc_red", span);
        this.removeRule( Horn.Validate.REQUIRED);
        red.html("");
    },
    /**
     * 设置字段是否可用，设置为不可用，则不能提交
     * @function
     * @name Horn.Field#setEnable
     * @param {Boolean} enabled 如果为true设置为可用，设置为false，设置不可用
     * @ignore
     */
    setEnable : function(enabled) {
        var input = this.field;
        var display = input.next("input[type='text']");
        if (enabled) {
            input.removeAttr("disabled");
            display.removeAttr("disabled");
        } else {
            input.attr("disabled", "disabled");
            display.attr("disabled", "disabled");
        }
        Horn.enterToTab(Horn.getCurrent());
    },
    // 方法冗余
    setDisabled : function(disabled) {
    	if (disabled === false) {
    		this.setEnable(true);
            this.disabled = false;
    	} else {
    		//this.setNotRequired();
    		this.setEnable(false);
            this.disabled = true;
    	}
    },
    /**
     * 设置是否可编辑
     * @function
     * @name Horn.Field#setReadonly
     * @param {Boolean} readonly 不可编辑
     * @ignore
     */
    setReadonly : function(readonly) {
    	if (readonly === false) {
    		this.field.removeAttr("readonly");
    		this.readonly = false;
    	} else {
    		//BUG #6916 【textfield】【textarea】【password】"check": "required"情况下调用setReadonly(true)会取消掉非空校验
    		//this.setRequired(false);//为只读时不进行非空校验
    		this.field.attr("readonly", "readonly");
    		this.readonly = true;
    	}
//        this.field.attr("readonly", readOnly);
    },
    /**
     * 设置值
     * @function
     * @name Horn.Field#setValue
     * @param {String} value 值
     * @ignore
     */
    setValue : function(value) {
        this.field.val(value);
        this.hidden.val(value);
        //this.field.blur();
    },
    /**
     * 获取值
     * @function
     * @name Horn.Field#getValue
     * @return 返回field的实际值
     * @ignore
     */
    getValue : function() {
        var input = this.get();
        return input.val();
    },
    /**
     * 如果设置了defValue的值，重置成的defValue值，否则重置成初始值
     * @function
     * @name Horn.Field#reset
     * @param {String} 初始值
     * @ignore
     */
    reset : function(clear) {
    	var defValue = "";
    	if (this.hidden && this.hidden.length > 0) {
    		defValue = clear?"":this.defHiddenValue;
    	} else {
    		defValue = clear?"":this.defValue;
    	}
    	this.setValue(defValue);
    },
    /**
     * 清除值
     * @function
     * @name Horn.Field#clearValue
     * @ignore
     */
    clearValue : function() {
    	this.setValue("");
    },
    /**
     * 给field绑定事件
     * @function
     * @name Horn.Field#bind
     * @param {String} type 事件类型
     * @param {Object} data 事件绑定的数据
     * @param {Function} fn 事件绑定的方法
     * @ignore
     */
    bind : function(type, data, fn) {
        var input = this.get();
        if($.type(data)=="function"){
            input.bind( type, data);
        }
        else{
            input.bind( type, data, fn);
        }
    },
    /**
     * 验证内容是否有效
     * @function
     * @name Horn.Field#isValid
     * @return true or false
     * @ignore
     */
    isValid : function(){
    	return !this.err;
    },
    /**
     * @description {Boolean} 验证情况（是否出现验证失败）
     * @field
     * @name Horn.Field#err
     * @default false
     * @ignore
     */
    err : false,
    /**
     * @description {Boolean} 验证情况（是否出现验证失败）
     * @field
     * @name Horn.Field#err
     * @default null
     * @ignore
     */
    msgDiv : null,
    /**
     * 显示验证错误信息
     * @function
     * @name Horn.Field#showError
     * @param {String} 错误信息
     * @ignore
     */
    showError : function(errorMsg){
    	var field = this.field; 
    	errorMsg = $.type(errorMsg) == "boolean" ? "校验错误" : errorMsg;
    	if(!this.msgDiv){
    		this.msgDiv = $('<span class="hc_verification" style="display:none;"></span>');
    		this.el.after(this.msgDiv);
    	}
        var msg = this.msgDiv;
        msg.html(errorMsg);
        msg.css("display", "none");
        field.addClass('hc_ver-bd');
        field.hover(function(){
        	if(msg) msg.css("display", "inline");
        },function(){
        	if(msg) msg.css("display", "none");
        });
        this.err = true;
    },
    /**
     * 删除错误信息
     * @function
     * @name Horn.Field#removeError
     * @ignore
     */
    removeError : function(){
        this.field.removeClass('hc_ver-bd');
        this.err = false;
    	var msg = this.msgDiv;
    	if(msg) msg.remove();
    	delete this.msgDiv ;
    },
    /**
     * 实现此接口的组件可以返回两个或以上的name，在form中设置值的时候，会向该field提供这些name所对应的值
     * @function
     * @name Horn.Field#mutiName
     * @return {Boolean/Array}
     * @ignore
     */
    mutiName : function(){
		return false;    
    }
}) ;

/**
 * @lends Horn.Field
 */
$.extend(Horn.Field,{
    /**
     * @description 获取包装字段，没有则获取原始jQuery对象
     * @name Horn.Field.get
     * @function
     * @param {String} name
     * @param {String} alias
     * @return {jQuery}
     * @ignore
     */
    get : function(name,alias){
        if (jQuery.type(name) != 'string') {
            var jObj = $(name) ;
            name = jObj.attr("name") ;
            alias = jObj.attr("alias") ;
            if(!name){
            	var hidden = jObj.prev("input[type='hidden'][name]") ;
                name = hidden.attr("name") ;
                alias = hidden.attr("alias") ;
            }
        }
        var field = Horn.getComp(name,alias) ;
        return field ;
    },
    /**
     * @description 增加校验规则
     * @function
     * @name Horn.Field.addRule
     * @param {String} rule 校验规则字符串
     * @param {String} name 名称
     * @param {String} alias　别名
     * @ignore
     * 
     */
    addRule : function(name, rule, alias) {
        var field = this.get(name,alias) ;
        field.addRule(rule) ;
    },
    /**
     * @description 删除校验规则
     * @function
     * @name Horn.Field.removeRule
     * @param {String} rule 校验规则字符串
     * @param {String} name
     * @param {String} alias
     * @ignore
     */
    removeRule : function(name, rule, alias) {
        var field = this.get(name,alias) ;
        field.removeRule(rule) ;
    },
    /**
     * @description 显示field字段，包含label部分
     * @function
     * @name Horn.Field.show
     * @param {String} name
     * @param {String} alias
     * @ignore
     */
    show : function(name, alias) {
        var field = this.get(name,alias) ;
        field.show() ;
    },
    /**
     * @description 隐藏label字段，包含label部分,设置display为none
     * @function
     * @name Horn.Field.hide
     * @param {String} name
     * @param {String} alias
     * @ignore
     */
    hide : function(name, alias) {
        var field = this.get(name,alias) ;
        field.hide("display") ;
    },
    /**
     * @description 隐藏label字段，包含label部分,设置visibility为hidden
     * @function
     * @name Horn.Field.hidden
     * @param {String} name
     * @param {String} alias
     * @ignore
     */
    hidden : function(name, alias) {
        var field = this.get(name,alias) ;
        field.hide("visibility") ;
    },
    /**
     * @description 设置为必填项，同时增加红色的 *
     * @function
     * @name Horn.Field.setRequired
     * @param {String} name
     * @param {String} alias
     * @ignore
     */
    setRequired : function(name,alias) {
        var field = this.get(name,alias) ;
        field.setRequired() ;
    },
    /**
     * @description 设置为非必填，同时删除红色的 *
     * @function
     * @name Horn.Field.setNotRequired
     * @param {String} name
     * @param {String} alias
     * @ignore
     */
    setNotRequired : function(name, alias) {
        var field = this.get(name,alias) ;
        field.setNotRequired() ;
    },
    /**
     * @description 设置字段是否可用，设置为不可用，则不能提交
     * @function
     * @name Horn.Field.setEnable
     * @param {Boolean} enabled 如果为true设置为可用，设置为false，设置不可用
     * @param {String} name
     * @param {String} alias
     * @ignore
     */
    setEnable : function(name, enabled, alias) {
        var field = this.get(name,alias) ;
        field.setEnable(enabled) ;
    },
    /**
     * @description 设置是否可编辑
     * @function
     * @name Horn.Field.setReadonly
     * @param {String} readOnly "readonly" 不可编辑
     * @param {String} name
     * @param {String} alias
     * @ignore
     */
    setReadonly : function(name, readOnly, alias) {
        var field = this.get(name,alias) ;
        field.setReadonly(readOnly) ;
    },
    /**
     * @description 设置label标签
     * @function
     * @name Horn.Field.setLabel
     * @param {String} name 名字
     * @param {String} label 标签内容
     * @param {String} alias 别名
     * @ignore
     */
    setLabel : function(name, label, alias){
        var field = this.get(name,alias);
        field.setLabel(label);
    },
    /**
     * @description 获取label标签
     * @function
     * @name Horn.Field.getLabel
     * @param {String} name 名字
     * @param {String} alias 别名
     * @return 返回label值
     * @ignore
     */
    getLabel : function(name,alias){
        var field = this.get(name,alias);
        return field.getLabel();
    },
    /**
     * @description 设置值
     * @function
     * @name Horn.Field.setValue
     * @param {String} value 值
     * @param {String} name
     * @param {String} alias
     * @ignore
     */
    setValue : function(name, value, alias) {
        var field = this.get(name,alias) ;
        if(field){
            field.setValue(value) ;
        }
        else{
            this.getField(name,alias).val(value) ;
        }
    },
    /**
     * @description 获取值
     * @function
     * @name Horn.Field.getValue
     * @param {String} name
     * @param {String} alias
     * @return 返回field的实际值
     * @ignore
     */
    getValue : function(name, alias,form) {
        var field = this.get(name,alias) ;
        if(field){
            return field.getValue() ;
        }
        else{
            return this.getField(name,alias,form).val() ;
        }
    },
    /**
     * @description 重置成初始值
     * @function
     * @name Horn.Field.reset
     * @param {String} name
     * @param {String} alias
     * @ignore
     */
    reset : function(name, alias) {
        var field = this.get(name,alias) ;
        if(field){
            field.reset() ;
        }
        else{
            this.getField(name,alias).each(function(){
                this.reset() ;
            }) ;
        }
    },
    /**
     * @description 清除值
     * @function
     * @name Horn.Field.clearValue
     * @param {String} name　名称
     * @param {String} alias　别名
     * @ignore
     */
    clearValue : function(name, alias) {
        var field = this.get(name,alias) ;
        if(field){
            field.clearValue() ;
        }
        else{
            this.getField(name,alias).val("") ;
        }
    },
    /**
     * @description 给field绑定事件
     * @function
     * @name Horn.Field.bind
     * @param {String} name
     * @param {String} alias
     * @param {String} type 事件类型
     * @param {Object} data 事件绑定的数据
     * @param {Function} fn 事件绑定的方法
     * @ignore
     */
    bind : function(name, alias, type, data, fn) {
        var field = this.get(name,alias) ;
        field.bind(type, data, fn) ;
    },
    /**
     * @description 获取选择器
     * @function
     * @name Horn.Field.getSelector
     * @param {String} name
     * @param {String} alias
     * @return {String} 选择器字符串
     * @ignore
     */
    getSelector : function(name, alias) {
        var selector = "";
        if (name) {
            selector += "[name='" + name + "']";
        }
        if (alias) {
            selector += "[alias='" + alias + "']";
        }
        return "input" + selector + ",textarea" + selector;
    },
    /**
     * @description 获取jQuery的field对象
     * @function
     * @name Horn.Field.getField
     * @param {String} name
     * @param {String} alias
     * @param {Jquery/DomElement} form
     * @return {Jquery}
     * @ignore
     */
    getField : function(name, alias,form) {
        var current = Horn.getCurrent() ;
        alias = alias||"" ;
        var field = null;
        if(!form){
        	form = current.find("form");
        	 if (jQuery.type(name) == 'string') {
	            var selector = Horn.Field.getSelector(name, alias);
	            field = $(selector, form)|| $(selector);
	            if (!alias) {
	                field = field.not(":disabled");
	            }
	        } else {
	            field = $(name, form);
	        }
	        return field;
        }else{
        	return form.findField(name,alias);
        }
    },
    /**
     * @description 从范围内获取所有Horn.Field子项
     * @function
     * @name Horn.Field.findFieldCompsIn
     * @param {Jquery/DomElement} scope
     * @return {[Array<Horn.Field>]}
     * @ignore
     */
    findFieldCompsIn : function(scope){
    	var fields = [];
    	this.findFieldsIn(scope).each(function(i,f){
    		var field = Horn.getCompByEl($(f));
    		if(field){
    			fields.push(field);
    		}
    	});
    	return $(fields);
    },
    /**
     * @description 从范围内获取Field的子项目
     * @function
     * @name Horn.Field.findFieldsIn
     * @param {Jquery/DomElement} scope
     * @return {Jquery[Array<DomElement>]}
     * @ignore
     */
    findFieldsIn : function(scope){
    	return $(scope).find(this.TYPES.join(','));
    },
    /**
     * @description 根据获取到的input，查找到所在的Horn组件
     * @function
     * @name Horn.Field.findInputComp
     * @param {Jquery/DomElement} 对应的input
     * @return {Horn}
     * @ignore
     */
    findInputComp : function(input){
    	return $(input).parents(this.TYPES.join(',')).first().comp();
    },
    /**
     * @description {Boolean} 验证情况（是否出现验证失败）
     * @field
     * @name Horn.Field#TYPES
     * @private
     */
    TYPES:[],
    /**
     * @description 注册Horn.Field类型的组件
     * @function
     * @name Horn.Field.regFieldType
     * @param {string} type
     * @param {Horn.Field} Clazz
     * @ignore
     */
    regFieldType : function(type,Clazz){
    	Horn.regUI(type,Clazz); 
    	this.TYPES.push(type);
    }
}) ;
Horn.Field.regFieldType("div.hc_textfield",Horn.Field) ;
Horn.Field.regFieldType("div.hc_textarea",Horn.Field) ;

/**
 * @name Horn.HiddenField   
 * @class
 * 隐藏域的包装组件</br>
 */	
/**
 * @lends Horn.HiddenField#
 */

/**
 * 组件唯一标识
 * @name Horn.HiddenField#id
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单提交名字
 * @name Horn.HiddenField#name
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * @ignore
 * 组件的别名，名字相同时，加别名区分
 * @name Horn.HiddenField#alias
 * @type String
 * @default ""
 * @ignore
 * @example
 * var comp = Horn.getComp("name","alias")
 */

 /**
  * 表单的初始值，如果没有配置defValue属性，表单重置的时候，将采用value作为重置值
  * @name Horn.HiddenField#value
  * @type String
  * @default ""
  * @example
  * 无
  */

 /**
  * 组件的重置时的值，如果没有配置此值，将以value属性做为重置值。
  * 如果指定了value值，并且defValue设置为空(defValue:"")，则无法重置为空值，请用form组件的clearValue方法清空form内组件的值或调用组件本身的clearValue方法清空值。
  * @name Horn.HiddenField#defValue
  * @type String
  * @default 无
  * @example
  * 无
  */

 /**
  * 组件的禁用状态，被设置禁用状态的组件，无法获得焦点，不参与表单校验（不会阻止表单提交），不会参与表单提交，但是可以通过API修改表单的值；
  * true表示禁用，false表示正常状态
  * @name Horn.HiddenField#disabled
  * @type Boolean
  * @default false
  * @example
  * 无
  */

/**
 * 设置字段是否禁用，被设置为禁用的组件，不可以编辑，也不参与表单提交，但是可以通过API的方式修改表单的值
 * @function
 * @name Horn.HiddenField#setDisabled
 * @param {Boolean} disabled true表示禁用，false表示正常
 */

/**
 * 设置表单的值
 * @function
 * @name Horn.HiddenField#setValue
 * @param {String} value 值
 */
/**
 * 获取表单的值
 * @function
 * @name Horn.HiddenField#getValue
 * @return 表单的提交值
 */
/**
 * 如果设置了defValue的值，重置成的defValue值，否则重置成value值
 * @function
 * @name Horn.HiddenField#reset
 */
/**
 * 清空表单的值，显示值和隐藏值都设置为""
 * @function
 * @name Horn.HiddenField#clearValue
 */

	Horn.HiddenField = Horn.extend(Horn.Field,{
		COMPONENT_CLASS:"HiddenField",
		init : function(){
			Horn.HiddenField.superclass.init.apply(this,arguments);
			this.field = this.el;
			this.name = this.field.attr("name") ;
            this.alias = this.field.attr("alias") || "" ;
            this.defValue = (this.params.defValue != undefined)?this.params.defValue:this.field.val();
		},
		isValid : function(){
			return true;
		},
		showError : function(){
		},
        /**
         * @description 如果设置了defValue的值，重置成的defValue值，否则重置成初始值
         * @function
         * @name Horn.HiddenField#reset
         * @param {boolean}clear 是否清空，如果为true则清空值
         * @ignore
         */
		reset : function(clear){
			if(clear) {
                this.field.val("");
            }else{
                this.field.val(this.defValue);
            }
		},
		removeError : function(){
		}
	}); 
	Horn.Field.regFieldType("input.hc_hiddenfield",Horn.HiddenField) ;

/*
 * -----------------------------------------------------------------------
 * 修订纪录
 * 2014-2-11 		张超		修正passwordgroup无法设置value的问题
 * -----------------------------------------------------------------------
 */
/**
 * @name Horn.PasswordGroup
 * @class
 * 密码组录入框组件</br>
 */	
/**
 * @lends Horn.PasswordGroup#
 */
/**
 * 组件唯一标识
 * @name Horn.PasswordGroup#<b>id</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 组件的名字
 * @name Horn.PasswordGroup#<b>name</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 组件的别名，名字相同时，加别名区分
 * @name Horn.PasswordGroup#<b>alias</b>
 * @type String
 * @default ""
 * @example
 * var comp = Horn.getComp("name","alias")
 */
 /**
  * 组件的值
  * @name Horn.PasswordGroup#<b>value</b>
  * @type String
  * @default ""
  * @example
  */
  /**
   * 组件的值的最大长度
   * @name Horn.PasswordGroup#<b>maxlength</b>
   * @type String
   * @default ""
   * @example
   */
/**
 * 组件的标签
 * @name Horn.PasswordGroup#<b>label</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 组件的跨列数
 * @name Horn.PasswordGroup#<b>cols</b>
 * @type Int
 * @default ""
 * @example
 * 无
 */
/**
 * 组件的约束检查选项
 * @name Horn.PasswordGroup#<b>check</b>
 * @type String
 * @default ""
 * @example
 * 具体见Horn.Validate类的已经支持的正规、函数名
 * "check":"required;"
 */
/**
 * 组件的所属组，可以对相同组内的元素进行约束检查
 * @name Horn.PasswordGroup#<b>group</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
 /**
  * 组件的事件配置
  * @name Horn.PasswordGroup#<b>events</b>
  * @type Array[Json
  * @default ""
  * @example
  * "events":[{"event":"onchange","function":"getValue()"}]
  */
	Horn.PasswordGroup = Horn.extend(Horn.Field,{
		COMPONENT_CLASS:"PasswordGroup",
		field1 : null,
		field2 : null,
		name1 : null,
		name2 : null,
		defValue1:"",
		defValue2:"",
		init : function(dom){
			var inputs = $(dom).find('input');
			this.field1 = $(inputs[0]);
			this.field2 = $(inputs[1]);
			this.name1 = this.field1.attr('name');
			this.name2 = this.field2.attr('name');
			Horn.PasswordGroup.superclass.init.apply(this,arguments);
			if(this.field1){
				this.defValue1 = (this.params.defValue != undefined)?this.params.defValue:this.field1.val();
				this.defValue2 = (this.params.defValue != undefined)?this.params.defValue:this.field2.val();
			}
		},
	    initEvents : function(){
	    	var _pwdgroup = this;
	    	this.field2.bind('blur',function(){
	    		Horn.Validate.onValid({data:[Horn.Validate,_pwdgroup]});
	    		if(_pwdgroup.isValid()){
		    		var pwd = _pwdgroup.field1.val();
		    		if(_pwdgroup.field2.val() != pwd){
		    			_pwdgroup.showError('校验不匹配！');
		    		}else{
		    			_pwdgroup.removeError();
		    		}
	    		}
	    	});
	    	this.field1.blur(function(){
	    		Horn.Validate.onValid({data:[Horn.Validate,_pwdgroup]});
	    		if(_pwdgroup.isValid()){
		    		var pwd = _pwdgroup.field2.val();
		    		if(_pwdgroup.field1.val() != pwd && pwd){
		    			_pwdgroup.showError('校验不匹配！');
		    		}else{
		    			_pwdgroup.removeError();
		    		}
	    		}
	    	});
	    },
        /**
         * @description 验证输入密码有效性
         * @function
         * @name Horn.PasswordGroup#validate
         */
	    validate : function(){
	    	this.field1.blur();
	    	this.field2.blur();
	    },
        /**
         * @description 设置密码值
         * @function
         * @name Horn.PasswordGroup#setValue
         * @param {string} val 密码值
         */
		setValue : function(val){
			this.field1.val(val);
			this.field2.val(val);
			this.field1.blur();
			this.field2.blur();
		},
        /**
         * @description 获取密码值
         * @function
         * @name Horn.PasswordGroup#getValue
         * @return {string} 密码值
         */
		getValue : function(){
			return this.field1.val();
		},

		/**
		 * @OverRide
		 */
		reset : function(clear){
    		var defValue = clear?"":this.defValue1;
	    	this.setValue(defValue);
		},
		/**
		 * @OverRide
		 */
	    clearValue : function() {
	    	this.setValue("");
	    },
		setEnable : function(enable){
			var _pwdgroup = this;
			if(enable){
				this.field1.removeAttr("disabled");
				this.field2.removeAttr("disabled");
				this.field1.blur();
				this.field2.blur();
			}else{
				this.field1.attr("disabled","disabled");
				this.field2.attr("disabled","disabled");
    			_pwdgroup.removeError();
			}
		}
	});
	Horn.Field.regFieldType("div.hc_passwordgroup",Horn.PasswordGroup);

/*
 * -----------------------------------------------------------------------
 * 修订纪录
 * 2014-2-11 		张超		增加password的组件，增加设置value的功能
 * -----------------------------------------------------------------------
 */
/**
 * @name Horn.Password
 * @class
 * 密码录入框组件</br>
 */	
/**
 * @lends Horn.Password#
 */
/**
 * 组件唯一标识
 * @name Horn.Password#id
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单提交名字
 * @name Horn.Password#name
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单组件的标签名，值过长会造成label显示不全，但是可以通过鼠标悬浮看到完整值
 * @name Horn.Password#label
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * @ignore
 * 组件的别名，名字相同时，加别名区分
 * @name Horn.Password#alias
 * @type String
 * @default ""
 * @ignore
 * @example
 * var comp = Horn.getComp("name","alias")
 */

 /**
  * 表单的初始值，如果没有配置defValue属性，表单重置的时候，将采用value作为重置值
  * @name Horn.Password#value
  * @type String
  * @default ""
  * @example
  * 无
  */

 /**
  * 组件的重置时的值，如果没有配置此值，将以value属性做为重置值。
  * 如果指定了value值，并且defValue设置为空(defValue:"")，则无法重置为空值，请用form组件的clearValue方法清空form内组件的值或调用组件本身的clearValue方法清空值。
  * @name Horn.Password#defValue
  * @type String
  * @default 无
  * @example
  * 无
  */

 /**
  * 组件的是读配置，被设置为只读的组件只能通过API的方式修改表单的值，可以获得焦点，参与表单校验（校验失败会阻止表单提交），并且可以参与表单提交；
  * true表示只读状态，false表示正常状态
  * @name Horn.Password#readonly
  * @type Boolean
  * @default false
  * @example
  * 无
  */

 /**
  * 组件的禁用状态，被设置禁用状态的组件，无法获得焦点，不参与表单校验（不会阻止表单提交），不会参与表单提交，不可编辑，但是可以通过API修改表单的值；
  * true表示禁用，false表示正常状态
  * @name Horn.Password#disabled
  * @type Boolean
  * @default false
  * @example
  * 无
  */

/**
 * 组件的跨列数，取值范围由外容器的screen的cols而定
 * @name Horn.Password#cols
 * @type int
 * @default 1
 * @example
 * 无
 */

/**
 * 组件的约束检查选项
 * @name Horn.Password#check
 * @type String
 * @default ""
 * @example
 * 具体见Horn.Validate类的已经支持的正规、函数名
 * "check":"required;"
 */

/**
 * 组件的所属组，可以对相同组内的元素进行约束检查
 * @name Horn.Password#group
 * @type String
 * @default ""
 * @ignore
 * @example
 * 验证指定对象$obj(scope)中组名为groupname的元素有有效性
 * Horn.Validate.validateAreaByGroup($obj,groupname)
 */

/**
 * 内容最大长度，超过长度的文字无法输入，比如“中文abc”，总共的文字数为5，中文、空格、英文字母、标点都只算一个字符。
 * 但是需要特别注意，maxlength属性只能限制键盘输入，或者粘贴等操作，无法限制api设置操作，并且此属性对textarea无效。
 * @name Horn.Password#maxlength
 * @type Number
 * @default 
 * @example
 * 无
 */

 /**
  * 组件的事件配置
  * @name Horn.Password#events
  * @type Array
  * @default ""
  * @example
  * "events":[{"event":"onchange","function":"getValue()"}]
  */

/**
 * 加入一个分组中，可以根据组名进行分组校验，参见validate的validateAreaByGroup(scope, group)方法
 * @function
 * @name Horn.Password#addGroup
 * @param {String} group 组名
 * @ignore
 */
/**
 * 从一个分组中删除
 * @function
 * @name Horn.Password#removeGroup
 * @param {String} group 组名
 * @ignore
 */
/**
 * 判断组件上会否在分组中
 * @function
 * @name Horn.Password#inGroup
 * @param {String} group 组名
 * @ignore
 */

/**
 * 增加校验规则
 * @function
 * @name Horn.Password#addRule
 * @param {String} rule 校验规则字符串
 */
/**
 * 删除校验规则
 * @function
 * @name Horn.Password#removeRule
 * @param {String} rule 校验规则字符串
 */

/**
 * 显示表单，如果表单已经显示，此方法无效果，hide方法与之相对应
 * @function
 * @name Horn.Password#show
 */
/**
 * 隐藏表单，如果表单已经隐藏，此方法无效果，show方法与之对应
 * @function
 * @name Horn.Password#hide
 */

/**
 * 设置label内容
 * @function
 * @name Horn.Password#setLabel
 * @param {String} label 标签内容
 * @ignore
 */
/**
 * 获取label内容
 * @function
 * @name Horn.Password#getLabel
 * @return 标签内容
 * @ignore
 */

/**
 * 设置为必填项，同时增加红色的 *
 * @function
 * @name Horn.Password#setRequired
 * @param {Boolean} required 不传值或者传true表示必选项，传false表示取消必选项
 */
/**
 * 设置字段是否禁用，被设置为禁用的组件，不可以编辑，也不参与表单提交并且其所有校验状态都会消失，但可以通过API的方式修改表单的值
 * @function
 * @name Horn.Password#setDisabled
 * @param {Boolean} disabled true表示禁用，false表示正常
 */
/**
 * 设置是否只读，设置为只读方式的组件，不可以编辑，但是可以通过setValue、reset等API修改表单的值，并可以可以参与表单提交
 * @function
 * @name Horn.Password#setReadonly
 * @param {Boolean} readonly true表示只读，false表示正常
 */

/**
 * 设置表单的值
 * @function
 * @name Horn.Password#setValue
 * @param {String} value 值
 */
/**
 * 获取表单的值
 * @function
 * @name Horn.Password#getValue
 * @return 表单的提交值
 */
/**
 * 如果设置了defValue的值，重置成的defValue值，否则重置成value值
 * @function
 * @name Horn.Password#reset
 */
/**
 * 清空表单的值，显示值和隐藏值都设置为""
 * @function
 * @name Horn.Password#clearValue
 */

/**
 * 获取由validate方法触发表单校验后的结果，并通过返回值标识校验的结果
 * @function
 * @name Horn.Password#isValid
 * @return {Boolean} true表示校验通过，false表示校验失败
 */
/**
 * 触发校验表单的内容，然后通过调用isValid方法获取校验的结果
 * @function
 * @name Horn.Password#validate
 */

/**
 * 显示验证错误提示
 * @function
 * @name Horn.Password#showError
 * @param {String} errorMsg 错误信息
 * @ignore
 */
/**
 * 删除错误提示
 * @function
 * @name Horn.Password#removeError
 * @ignore
 */


	Horn.Password = Horn.extend(Horn.Field,{
		COMPONENT_CLASS:"Password",
		init : function(dom){
			Horn.Password.superclass.init.apply(this,arguments);
		}
	});
	Horn.Field.regFieldType("div.hc_password",Horn.Password) ;

/*
 * -----------------------------------------------------------------------
 * 修订日期                          修改人                    修改原因
 * 2014-3-11 		谢晶晶		修正注释文档
 * 2014-4-8         周智星                  BUG #6625 [panel]表单组件禁用启用 
 * 2014-4-8         周智星                  BUG #6626 [panel]禁用表单类组件
 * 2014-4-8         周智星                  BUG #6543 panel相关文档缺陷
 * -----------------------------------------------------------------------
 */
/**
 * @name Horn.Panel
 * @class
 * 面板组件</br>
 * 属于容器组件，一般做为单行组件的容器使用
 */
/**@lends Horn.Panel# */
/**
 * 组件的唯一标示
 * @name Horn.Panel#<b>id</b>
 * @type String
 * @default 
 */
/**
 * 组件的名称
 * @name Horn.Panel#<b>name</b>
 * @type String
 * @default 
 */

	Horn.Panel = Horn.extend(Horn.Base,{
		COMPONENT_CLASS:"Panel",
		init:function(){
			 Horn.Panel.superclass.init.apply(this,arguments);
			 var parent = this.el.parent('.hc_extendsearch');
			 var _panel = this; 
			 if(parent) {
				 parent.find('.hc_btn-es-div').each(function(){
					 var div = $(this);
					 if(div.hasClass('hc_minus')){
						 _panel.closebar = div;
						div.click(function(){
							_panel.hide();
							_panel.disable();
							_panel.expanedbar.show();
							div.hide();
						}) ;
					 }else{
						 _panel.expanedbar = div;
						div.click(function(){
							_panel.show();
							_panel.enable();
							_panel.closebar.show();
							div.hide();
						}) ;
					 }
				 });
			 }
		},
        /**
         * 显示<br/>
         * 显示面板容器的内容
         * @name Horn.Panel#show
         * @function
         * @return {void}
         */
		show : function(){
			this.el.show();
		},
        /**
         * 隐藏<br/>
         * 隐藏面板容器及容器内的内容
         * @name Horn.Panel#hide
         * @function
         * @return {void}
         */
		hide : function(){
			this.el.hide();
		},
		/**
         * 设置内部输入组件为可用状态<br/>
         * 对所有表单项起效（文本字段、文本区域、按钮、复选框、单选框和下拉框）
         * @name Horn.Panel#enable
         * @function
         * @return {void}
         */
		enable : function(){
			//this.el.find('input,textarea').not('input[realydisable],textarea[realydisable]').removeAttr('disabled');
			
			//BUG #6625 [panel]表单组件禁用启用
			Horn.Field.findFieldCompsIn(this.el).each(function(i,f){
	    		this.setDisabled(false);
	    	});
			//BUG #6626 [panel]禁用表单类组件
			this.el.find('button,select').removeAttr('disabled');
		},
		/**
         * 设置内部输入组件为不可用状态(disabled)<br/>
         * 对所有表单项起效（文本字段、文本区域、按钮、复选框、单选框和下拉框）
         * @name Horn.Panel#disable
         * @function
         * @return {void}
         */
		disable : function(){
			//this.el.find('input[disabled],textarea[disabled]').attr('realydisable','yes');
			//this.el.find('input,textarea').not('input[realydisable],textarea[realydisable]').attr('disabled','disabled');
			
			//BUG #6625 [panel]表单组件禁用启用
			Horn.Field.findFieldCompsIn(this.el).each(function(i,f){
	    		this.setDisabled(true);
	    	});
			
			//BUG #6626 [panel]禁用表单类组件
			this.el.find('button,select').removeAttr('disabled');
			this.el.find('button,select').attr('disabled','disabled');
		}
	});
	Horn.regUI('ul.h_panel',Horn.Panel);

/*
 * 修改日期         修改人员        修改说明
 * -----------------------------------------------------------------------
 *  2014-4-18    周智星    BUG #6440 【form】各个表单组件的校验提示不统一
 *  2014-4-22    周智星    BUG #6792 【radiogroup】【checkboxgroup】radiogroup、checkboxgroup的validate方法无效
 *  2014-4-29    周智星    addMsg方法性能优化。如果提示框已经存在，就不在创建提示框
 *  2014-4-29    周智星    BUG #6912 【radio_group】在IE7下验证的错误提示信息显示的位置很远 
 *  2014-5-23    吴席林    需求 #8363 {jresplus}[ui]-radioGroup组件配置onchange事件后，各浏览器兼容性有问题，IE无效
 * -----------------------------------------------------------------------
 */
/**
 * @name Horn.RadioGroup   
 * @class
 * 单选框组组件</br>
 */

/**
 * @lends Horn.RadioGroup#
 */

/**
 * 组件的静态字典列表<br/>
 * 数据项不易过多（一行内可以完整显示），否则会导致换行显示影响美观，如果需要显示更多的项，可以考虑使用combox组件
 * @name Horn.RadioGroup#<b>items</b>
 * @type Array[JSON]
 * @default  
 * @example
 * "items":[{"label":"a","value":"a1"},{"label":"b","value":"b1"},{"label":"c","value":"c1"}]
 */

/**
 * 组件的动态字典名字
 * @name Horn.RadioGroup#<b>dictName</b>
 * @type String
 * @default 无
 * @example
 * 无
 */

/**
 * 组件唯一标识
 * @name Horn.RadioGroup#id
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单提交名字
 * @name Horn.RadioGroup#name
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单组件的标签名，值过长会造成label显示不全，但是可以通过鼠标悬浮看到完整值
 * @name Horn.RadioGroup#label
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * @ignore
 * 组件的别名，名字相同时，加别名区分
 * @name Horn.RadioGroup#alias
 * @type String
 * @default ""
 * @ignore
 * @example
 * var comp = Horn.getComp("name","alias")
 */

 /**
  * 表单的初始值，如果没有配置defValue属性，表单重置的时候，将采用value作为重置值
  * @name Horn.RadioGroup#value
  * @type String
  * @default ""
  * @example
  * 无
  */

 /**
  * 组件的重置时的值，如果没有配置此值，将以value属性做为重置值。
  * 如果指定了value值，并且defValue设置为空(defValue:"")，则无法重置为空值，请用form组件的clearValue方法清空form内组件的值或调用组件本身的clearValue方法清空值。
  * @name Horn.RadioGroup#defValue
  * @type String
  * @default 无
  * @example
  * 无
  */

 /**
  * 组件的禁用状态，被设置禁用状态的组件，无法获得焦点，不参与表单校验（不会阻止表单提交），不会参与表单提交并且其所有校验状态都会消失，不可编辑，但是可以通过API修改表单的值；
  * true表示禁用，false表示正常状态
  * @name Horn.RadioGroup#disabled
  * @type Boolean
  * @default false
  * @example
  * 无
  */

/**
 * 组件的跨列数，取值范围由外容器的screen的cols而定
 * @name Horn.RadioGroup#cols
 * @type int
 * @default 1
 * @example
 * 无
 */

/**
 * 组件的约束检查选项
 * @name Horn.RadioGroup#check
 * @type String
 * @default ""
 * @example
 * 具体见Horn.Validate类的已经支持的正规、函数名
 * "check":"required;"
 */

/**
 * 组件的所属组，可以对相同组内的元素进行约束检查
 * @name Horn.RadioGroup#group
 * @type String
 * @default ""
 * @ignore
 * @example
 * 验证指定对象$obj(scope)中组名为groupname的元素有有效性
 * Horn.Validate.validateAreaByGroup($obj,groupname)
 */

/**
 * 事件配置
 * 支持的事件列表：
 * onchange   radiogroup改变值时发生  事件参数： 无    
 * @name Horn.RadioGroup#<b>events</b>
 * @type Array
 * @default 
 * @example
 * "events":[{"event":"onchange","function":"getValue()"}]
 */

/**
 * 加入一个分组中，可以根据组名进行分组校验，参见validate的validateAreaByGroup(scope, group)方法
 * @function
 * @name Horn.RadioGroup#addGroup
 * @param {String} group 组名
 * @ignore
 */
/**
 * 从一个分组中删除
 * @function
 * @name Horn.RadioGroup#removeGroup
 * @param {String} group 组名
 * @ignore
 */
/**
 * 判断组件上会否在分组中
 * @function
 * @name Horn.RadioGroup#inGroup
 * @param {String} group 组名
 * @ignore
 */

/**
 * 增加校验规则
 * @function
 * @name Horn.RadioGroup#addRule
 * @param {String} rule 校验规则字符串
 */
/**
 * 删除校验规则
 * @function
 * @name Horn.RadioGroup#removeRule
 * @param {String} rule 校验规则字符串
 */

/**
 * 显示表单，如果表单已经显示，此方法无效果，hide方法与之相对应
 * @function
 * @name Horn.RadioGroup#show
 */
/**
 * 隐藏表单，如果表单已经隐藏，此方法无效果，show方法与之对应
 * @function
 * @name Horn.RadioGroup#hide
 */

/**
 * 设置label内容
 * @function
 * @name Horn.RadioGroup#setLabel
 * @param {String} label 标签内容
 * @ignore
 */
/**
 * 获取label内容
 * @function
 * @name Horn.RadioGroup#getLabel
 * @return 标签内容
 * @ignore
 */

/**
 * 设置为必填项，同时增加红色的 *
 * @function
 * @name Horn.RadioGroup#setRequired
 * @param {Boolean} required 不传值或者传true表示必选项，传false表示取消必选项
 */
/**
 * 设置字段是否禁用，被设置为禁用的组件，不可以编辑，也不参与表单提交，但是可以通过API的方式修改表单的值
 * @function
 * @name Horn.RadioGroup#setDisabled
 * @param {Boolean} disabled true表示禁用，false表示正常
 */

/**
 * 设置表单的值
 * @function
 * @name Horn.RadioGroup#setValue
 * @param {String} value 值
 */
/**
 * 获取表单的值
 * @function
 * @name Horn.RadioGroup#getValue
 * @return 表单的提交值
 */
/**
 * 如果设置了defValue的值，重置成的defValue值，否则重置成value值
 * @function
 * @name Horn.RadioGroup#reset
 */
/**
 * 清空表单的值，显示值和隐藏值都设置为""
 * @function
 * @name Horn.RadioGroup#clearValue
 */

/**
 * 获取由validate方法触发表单校验后的结果，并通过返回值标识校验的结果
 * @function
 * @name Horn.RadioGroup#isValid
 * @return {Boolean} true表示校验通过，false表示校验失败
 */
/**
 * 触发校验表单的内容，然后通过调用isValid方法获取校验的结果
 * @function
 * @name Horn.RadioGroup#validate
 */



	Horn.RadioGroup = Horn.extend(Horn.Field,{
		COMPONENT_CLASS:"RadioGroup",
	    radios : null ,
	    name : null,
	    alias : null,
	    checkRegx : [],
	    init : function() {
	        Horn.RadioGroup.superclass.init.apply(this,arguments);
	        this.radios = this.el.find("input[type='radio']");
	        this.name = this.el.attr('name');
	        this.alias = this.el.attr('alias')||"";
	        //this.defValue=(this.params.defValue != undefined)?this.params.defValue:this.getValue();
	        if(this.params.check && this.params.check.indexOf("required") > -1){
	        	this.checkRegx =[Horn.Validate.REQUIRED];
	        }
            if(this.params.value) {
            	this.setValue(this.params.value);
            }
//            if(this.params.readonly) {
//            	this.setReadonly(true);
//            }
            if(this.params.disabled) {
            	this.setDisabled(true);
            }
            this.defValue = this.params.defValue || this.params.value || "";
            
	    },
	    getEventTarget : function() {
	    	return this.el.find("input[type='radio']");
	    },
        /**
         * @description 获取单选框的值
         * @function
         * @name Horn.RadioGroup#getValue
         * @return {String} 单选框的值
         * @ignore
         */
	    getValue:function(){
	        return this.radios.filter(":checked").val() || "";
	    },
        /**
         * @description 设置单选框的值
         * @function
         * @name Horn.RadioGroup#setValue
         * @param {String} value 单选框的值
         * @ignore
         */
	    setValue : function(value) {
	    	var radioGroup = this;
	    	var _radios = this.radios;
	    	if (value == "") {
	    		this.radios.removeAttr("checked");
	    		//BUG #6440 【form】各个表单组件的校验提示不统一
	    		//this.isValid();
	    	} else if (this.radios.filter('[value="'+value+'"]').length > 0){
	    		if(this.radios.filter('[value="'+value+'"]').attr("disabled")){
	    			setTimeout(function(){
	    					_radios.attr("disabled","disabled");
	    					_radios.removeAttr("checked");
	    					_radios.filter('[value="'+value+'"]').attr("checked","checked");
	    			},10);
	    		}else{
	    			_radios.removeAttr("checked");
					_radios.each(function(idx,comp){
						if($(comp).val() == value){
							$(comp).attr("checked", "checked");
						}
					})
	    		}
		    	
	    	}
	    },
        /**
         * @description 清空单选框的值
         * @function
         * @name Horn.RadioGroup#clearValue
         * @ignore
         */
        clearValue : function() {
        	this.setValue("");
        },
	    setEnable : function(enabled) {
	    	var _this = this;
	    	this.radios.each(function(idx,comp){
				if (enabled === false) {
					$(this).attr("disabled", "disabled");
					//_this.removeMsg(_this);
					//_this.err = false;
				} else {
					$(this).removeAttr("disabled");
				}
			});
	    },
	    // 方法冗余
	    setDisabled : function(disabled) {
	    	var _this = this;
	    	if(disabled === true){
	    		_this.disabled = true;
	    	}else if(disabled === false){
	    		_this.disabled = false;
	    	}
	    	this.radios.each(function(idx,comp){
				if (disabled === true) {
					$(this).attr("disabled", "disabled");
					//_this.removeMsg(_this);
					//_this.err = false;
				} else {
					$(this).removeAttr("disabled");
				}
			});
//	    	if(disabled === true){
//	    		this.setNotRequired();
//	    	}
	    },
//	    setReadonly : function(readonly) {
//	    	if(readonly === true){
//	    		this.readonly = true;
//	    	}else if(readonly === false){
//	    		this.readonly = false;
//	    	}
//	    	var isDisabled = true;
//	    	this.radios.each(function(idx,comp){
//				if (readonly === true) {
//					if(!$(comp).attr("checked")){
//						$(comp).attr("disabled", "disabled");
//					}else{
//						isDisabled = false;
//					}
//				} else {
//					$(comp).removeAttr("disabled");
//				}
//			});
//	    	if(isDisabled && readonly){
//		    	this.setDisabled(true);
//	    	}
//	    },      
	    /**
         * @ignore
         * @description  内容校验
         * @function
         * @name Horn.CheckboxGroup.validate
         * @ignore
         */
        validate : function(){
            //BUG #6792 【radiogroup】【checkboxgroup】radiogroup、checkboxgroup的validate方法无效
            this.isValid();
        },
		isValid : function(){
	    	var rs = true;
	    	var _this = this;
	        var name = this.name;
	        if(_this.disabled == true){
	        	return true;
	        }
	        if(this.checkRegx.length>0){
	        	var val = Horn.getComp(name).getValue();
	        	if(val==""){
	        		rs = false;
	        		this.addMsg(_this);
	        		$("input[name="+name+"]").click(function(){
	        			_this.el.unbind('mouseover'); 
		        		_this.el.unbind('mouseout'); 
	        			_this.el.removeClass();
		        		_this.el.addClass("hc_radio-group");
	        			$("#radio_"+name).remove();
	        		});
	        		
	        	}else{
	        		this.removeMsg(_this);
	        	}
	        }
			return rs;
		},
		addMsg : function(_this){
			var userAgent = window.navigator.userAgent.toLowerCase();
			/*var msie10 = $.browser.msie && /msie 10\.0/i.test(userAgent);
	        var msie9 = $.browser.msie && /msie 9\.0/i.test(userAgent); 
	        var msie8 = $.browser.msie && /msie 8\.0/i.test(userAgent);*/
	        var msie7 = $.browser.msie && /msie 7\.0/i.test(userAgent);
	        var greaterThanIe7 = true;
	        if($.browser.msie){
		        //文本模式版本
		        if (document.documentMode && document.documentMode>=8){ // IE8文本模式
		        	greaterThanIe7 = true;
		        }else if(document.documentMode && document.documentMode<8){ // IE 5-7文本模式  
		        	greaterThanIe7 = false;
		        }
	        }
			
			var name = _this.name;
			_this.el.removeClass();
    		_this.el.addClass("hc_radio-group hc_ver-bd");
    		_this.el.mouseover(function(){
    			var hcHeight = $(this).css("height");
    			hcHeight = hcHeight.replace("px","");
    			var tmpHeiht = parseInt(hcHeight)+3;
    			//BUG #6912 【radio_group】在IE7下验证的错误提示信息显示的位置很远 
    			if(!greaterThanIe7 || msie7){
    				tmpHeiht = 0;
    			}
    			var msgDiv = '<span class="hc_verification" id="radio_'+name+'" style="margin-top:'+tmpHeiht+'px;">当前的单选框不能为空</span>';
    			var msg = $("#radio_"+name);
    			if(msg.length==0){
    				_this.el.after(msgDiv);
    			}else{//如果提示框已经存在，就不在创建提示框
    				$("#radio_"+name).css("display", "inline");
    			}
    		});
    		_this.el.mouseout(function(){
    			$("#radio_"+name).css("display", "none");
    		});
		},
		removeMsg : function(_this){
			var name = _this.name;
			_this.el.unbind('mouseover'); 
    		_this.el.unbind('mouseout'); 
    		_this.el.removeClass();
    		_this.el.addClass("hc_radio-group");
    		$("#radio_"+name).remove();
		},
	    /**
         * @description 如果设置了defValue的值，重置成的defValue值，否则重置成初始值
         * @function
         * @name Horn.RadioGroup#reset
         */
        reset : function() {
            this.setValue(this.defValue);
        },
        /**
         * 设置为必填项，同时增加红色的 *
         * @function
         * @name Horn.RadioGroup#setRequired
         * @ignore
         */
        setRequired : function(required) {
        	if (required === false) {
        		this.setNotRequired();
        		return;
        	}else if(required === true || required===undefined){
                this.addRule(Horn.Validate.REQUIRED);
        	}
        },
        /**
         * 设置为非必填，同时删除红色的 *
         * @function
         * @name Horn.RadioGroup#setNotRequired
         * @ignore
         */
        setNotRequired : function() {
            this.removeRule( Horn.Validate.REQUIRED);
        },
        /**
         * 删除校验规则,校验规则字符串,只支持required
         * @function
         * @name Horn.RadioGroup#removeRule
         * @param {String} rule 校验规则字符串,只支持required
         * @ignore
         */
        removeRule : function(rule) {
            var _radiogroup = this;
            _radiogroup.el.removeClass('hc_ver-bd');
            this.checkRegx = [];
            var li = this.el.parent();
            var span = $("span", li);
            var red = $("b.hc_red", span);
            red.html("");
            _radiogroup.err = false;
            this.removeMsg(this);
        },
        /**
         * @description 添增验证规则(只支持required)
         * @function
         * @name Horn.RadioGroup#addRule
         */
        addRule : function(rule) {
        	var _radiogroup = this;
        	if(rule && rule.indexOf(Horn.Validate.REQUIRED) > -1){
            	_radiogroup.err = true;
            	this.checkRegx =[Horn.Validate.REQUIRED];
                var li = _radiogroup.el.parent();
                var span = $("span", li);
                var red = $("b.hc_red", span);
                if (!red.length) {
                    red = $("<b>", {
                        "class" : "hc_red",
                        "html" : "*"
                    });
                    span.prepend(red);
                } else {
                    red.html("*");
                }
        	}else{
        		return;
        	}
        }
	});
Horn.Field.regFieldType("div.hc_radio-group",Horn.RadioGroup) ;

/*
 * 修改日期                        修改人员        修改说明
 * -----------------------------------------------------------------------
 * 2014-2-14 		韩寅		     修改注释
 * 2014-4-16        周智星             BUG #6560 【combox】(继承)clearValue() 不会将组件回复到原始状态
 * 2014-4-16        周智星             BUG #6553 【combox】(继承)setValue() 设置无效值，依然会生效，但是getValue返回为""
 * 2014-4-16        周智星             BUG #6440 【form】各个表单组件的校验提示不统一
 * 2014-4-21                     周智星	   BUG #6798 【combox】设置disabled属性为true会造成js错误
 * 2014-04-22		hanyin	   BUG #6719 combo单选时，headItem的值不能在输入框中显示
 * 2014-04-22       周智星              BUG #6804 【combox】在多选模式下，如果setValue("20140205")会生效，并且会把0、1、2、4、5、14、20等全部选中
 * 20140423 		hanyin 		BUG #6809 【combox】多选模式下，value设置有值，通过键盘修改输入框的值，下拉不会选中，焦点移开然后获得焦点依然无法选中
 * 2014-04-25       周智星             BUG #6837 【combox】多选模式下，value设置有值，通过键盘增加输入框的值，所有已经设置的均应被选中
 * 2014-04-25      周智星             BUG #6861 【combox】多选模式下，按回退或者删除键，会把值清空
 * 2014-04-25      周智星            BUG #6839 【combox】在多选模式下无效的值任然可以设置成功
 * 2014-4-29       周智星           BUG #6904 【combox】单选模式下，不应该能输入非法值   BUG #6903 【combox】单选模式下，“请选择”不能删除
 * 2014-4-30       周智星          BUG #6920 【combox】有headItem的单选状态，在输入框输入任何值报js错误
 * 2014-4-30       周智星          BUG #6927 【combox】多选模式下，设置"defValue":"1,0"，然后调用reset()方法会造成显示的值为"1,0"但是提交值变成[01,]
 * 2014-5-4        周智星           BUG #6904 【combox】单选模式下，不应该能输入非法值   BUG #6903 【combox】单选模式下，“请选择”不能删除
 * 2014-06-10      zhangsu   STORY#8487[经纪业务事业部/胡志武][TS:201406040187]-JRESPlus-ui-combox设置 delimiter="" 情况下，提交的值为空
 * -----------------------------------------------------------------------
 */
/**
 * @name Horn.Select
 * @class
 * 下拉选项组件</br>
 * 替代html的select组件，有更加丰富的交互和功能
 */

/**@lends Horn.Select# */

/**
 * 组件的唯一标示
 * @name Horn.Select#<b>id</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 组件的标签
 * @name Horn.Select#<b>label</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单输入域的名称
 * @name Horn.Select#<b>name</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单输入域的别名，用在表单中存在相同name的情况下，可以通过别名来区分
 * @name Horn.Select#<b>alias</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 跨列数
 * @name Horn.Select#<b>cols</b>
 * @type String
 * @default "1"
 * @example
 * 无
 */
/**
 * 在第一展示的时候表单的初始值
 * @name Horn.Select#<b>value</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 验证串
 * @name Horn.Select#<b>check</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 组件的可用状态，被设置为disabled的组件不会参与表单提交，也不能被点击下拉；"true"表示被禁用，"false"表示可用
 * @name Horn.Select#<b>disabled</b>
 * @type String
 * @default "false"
 * @example
 * 无
 */
/**
 * 选项头格式如:{"label":"","value":"请选择"}
 * @name Horn.Select#<b>headItem</b>
 * @type obj
 * @default 无
 * @example
 * 无
 */
/**
 * 静态显示值 格式："items":[{"label":"男", "pLabel":"0", "value":"1"},{"label":"女", "value":"2", "pLabel":"1"}] pLabel为当前节点的父节点编号
 * @name Horn.Select#<b>items</b>
 * @type ArrayObj
 * @default 无
 * @example
 * 无
 */
/**
 * 数据字典名
 * @name Horn.Select#<b>dictName</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 是否多选，true表示多选，false表示单选
 * @name Horn.Select#<b>multiple</b>
 * @type Boolean
 * @default false
 * @example
 * 无
 */
/**
 * 在初始化的默认就把下拉框中的内容全部选中
 * @name Horn.Select#<b>checkAll</b>
 * @type Boolean
 * @default false
 * @example
 * 无
 */
/**
 * 多选时的显示分隔符
 * @name Horn.Select#<b>delimiter</b>
 * @type String
 * @default 
 * @example
 * 无
 */
Horn.Select = Horn.extend(Horn.Field,{
	COMPONENT_CLASS:"Select",
    delimiter : "" ,
    bodyclicktype : "click.select" ,
    select : null ,
    field : null ,
    hidden : null ,
    listEl : null ,
    /**
     * 标识（在标签中使用），是否为多选下拉
     * @name Horn.Select#multipleline
     * @type Boolean
     * @default false
     */
    multipleline : false ,
    name : null,
    alias : null,
    showLabel:true,
    hasHeadItem:false,
    /**
     * @ignore
     */
    init : function(dom){
        Horn.Select.superclass.init.apply(this,arguments) ;
        var _this = this ;
        this.select = this.el;
        this.hidden = this.select.children("input[type='hidden']");
        this.field = this.hidden.next();
        this.name = this.hidden.attr("name") ;
        this.alias = this.hidden.attr("alias") || "" ;
        if(this.field.attr("delimiter")!=undefined){
            this.delimiter = this.field.attr("delimiter") ;
        }
        var headItem = this.params.headItem;
        if(headItem){
        	this.hasHeadItem = true;
        }
        var ref_target = this.field.attr("ref");
        this.listEl = ref_target ? Horn.getCurrent().find(
            "div.hc_hide_div").children(
            "div.hc_checkboxdiv[ref_target='" + ref_target + "']")
            : this.field.next("div.hc_checkboxdiv");
        if(!this.listEl.get(0)){
        	this.listEl = $("div.hc_hide_div").children("div.hc_checkboxdiv[ref_target='" + ref_target + "']");
        }
        this.listEl = this.listEl.first();
        this.multipleline = this.params.multiple;
        if(String(this.params.showLabel) =="false"){
        	this.showLabel = false;
        }
        this.handerHeadItem();
//        this.field.attr('readOnly', true);
        this.field.bind({
            'focus' : Horn.Util.apply(_this.onFocus,_this),
            'keydown':Horn.Util.apply(_this.onKeyDown,_this),
            'keypress':Horn.Util.apply(_this.onKeyPress,_this),
            'keyup':Horn.Util.apply(_this.onKeyUp,_this)
        });
        
        var value = this.params.value || this.hidden.val();
        // BUG #6719 combo单选时，headItem的值不能在输入框中显示
        if (value === "") {
        	this.setValue("", undefined, true);
        } else {
        	this.setValue(value);
        }
        
        //BUG #6554 【combox】(继承)setReadonly(true) 与设置属性readonly=true的表现形式不一致 
        if(this.params.readonly) {
        	this.setReadonly(true);
        }
        if(this.params.disabled) {
        	this.setDisabled(true);
        }
        
        //BUG #6904 【combox】单选模式下，不应该能输入非法值  ；BUG #6903 【combox】单选模式下，“请选择”不能删除
		if (!this.multipleline) {//如果是单选，就把显示输入框设为只读状态
			this.field.attr("readonly", "true");
    		this.readonly = true;
		}
		
		this.DICT = (function(_select){
			if(_select.params.items){
				var staticDict = {};
				$(_select.params.items).each(function(i,item){
					staticDict[item.label] = item.value;
				});
				return staticDict;
			}else{
				return Horn.getDict(_select.params.dictName);
			}
		})(this); 
    } ,
    // 方法冗余 重写disabled方法，combox和select正在提交到后台的是隐藏域,所以disabled时也要把隐藏域disabled掉
    setDisabled : function(disabled) {
    	//BUG #6798 【combox】设置disabled属性为true会造成js错误
    	if (disabled === false) {
    		this.setEnable(true);
            this.disabled = false;
            //Horn.getComp(this.name).setDisabled(false);
    	} else {
    		this.setEnable(false);
            this.disabled = true;
            //Horn.getComp(this.name).setDisabled(true);
    	}
    },
    /**
     * 设置是否可编辑
     * @function
     * @name Horn.Field#setReadonly
     * @param {Boolean} readonly 不可编辑
     * @ignore
     */
    setReadonly : function(readonly) {
    	//BUG #6904 【combox】单选模式下，不应该能输入非法值  ；BUG #6903 【combox】单选模式下，“请选择”不能删除
		if (!this.multipleline) {//如果是单选，就把显示输入框设为只读状态
			this.field.attr("readonly", "true");
    		this.readonly = true;
		}else{
	    	if (readonly === false) {
	    		this.field.removeAttr("readonly");
	    		this.readonly = false;
	    	} else {
	    		this.field.attr("readonly", "true");
	    		this.readonly = true;
	    	}
		}
    },
    /**
     * @ignore
     */
    createHeadItem : function() {
        var headItem = this.params.headItem;
        var multiple = this.params.multiple;
        if(this.hasHeadItem && !multiple){
            var label = headItem.label?headItem.label:"";
            var pLabel = headItem.pLabel?headItem.pLabel:"";
            var value = headItem.value?headItem.value:"";
            var headItemLi = "<li key='"+label+"' pkey='"+pLabel+"' title='"+value+"' headItem='"+this.name+"' ><label>"+value+"</label></li>";
            this.listEl.children("ul").prepend(headItemLi);
        }
    },
    /**
     * @ignore
     */
    handerHeadItem:function(){
    	var cmpName = this.name;
		var ul = this.listEl.children("ul");
   		if(ul.length>0){
   	    	if(this.hasHeadItem){
   	    		var headItemFind= false;
   	    		var headItems = ul.children("li[headItem]");
   	    		if(headItems.length>0){
   	    			headItems.each(function(idx,item){
   	    				var name = $(item).attr('headItem');
   	    				if(cmpName != name){
   	    					$(item).remove();
   	    				}else{
   	    					headItemFind = true;
   	    				}
   	    			});
   	    			if(headItemFind){
   	    				return;
   	    			}else{
   	    				this.createHeadItem();
   	    			}
   	    		}else{
	    			this.createHeadItem();
   	    		}
   	    	}else{
   	    		var headItem = ul.children("li[headItem]");
   	    		if(headItem.length>0){
   	    			headItem.remove();
   	    		}
   	    	}
		}

    },
    /**
     * @description 设置select的值
     * @function
     * @name Horn.Select#setValue
     * @param {String} value
     * @param {Boolean} triggerChange 是否触发值更改事件
     */
    setValue : function(value, triggerChange, notBlur) {
    	this.handerHeadItem();
        var hidden = this.hidden ;
        var oldVal = hidden.val();
        var field = this.field ;
        //BUG #6560 【combox】(继承)clearValue() 不会将组件回复到原始状态
        //if (value === undefined || value === null || value==="") {
        if (value === undefined || value === null) {
        	field.val("");
            hidden.val("");
//            if (!notBlur) {
//                this.field.blur();
//            }
            return false;
        }
        if (value == "") {
    		//BUG #6440 【form】各个表单组件的校验提示不统一
        	hidden.val("");
    	}
        if($.type(value)=="string"){
            value = {"key":value} ;
        }
        var ul = this.listEl.children("ul") ;
        if (this.listEl.length > 0) {
            if (this.multipleline) {
                field.val(value.key);
                hidden.val(value.key);
            } else {
                if(!value.text){
                    var li = ul.children("li[key='" + value.key + "']");
                    value.text = jQuery.trim(li.text());
                	if(!this.showLabel){
                		var span = li.find('span');
                		value.text = value.text.replace(span.text(),"");
                    }
                }
                //BUG #6553 【combox】(继承)setValue() 设置无效值，依然会生效，但是getValue返回为""
                if(value.text!=""){
                    field.val(value.text);
                	hidden.val(value.key);
                }else{
                	//清空操作
                	if(value.key==""){
                        field.val("");
                	}else{//设置不合理值的非法操作
                		return;
                	}

                }
             }
            if (triggerChange && oldVal!=value.key) {
                field.trigger('change', [ value.key ]);
            }
        }
        
        //BUG #6839 【combox】在多选模式下无效的值任然可以设置成功  
        if (this.multipleline) {
        	//重新计算有效值，然后赋值给隐藏域（只针对多选有效）
            var val = this.field.val() ;
            var tmpVal = [];    //story 8487
            var _this = this;
            if(val!="" && val!=null){
	            $("input[type='checkbox']", this.listEl).each(function(index, dom) {
	                var li = $(dom).parent().parent("li[key]");
	                var curVal = li.attr("key");
	                var valArray = val.split(_this.delimiter);
	                var len = valArray.length;
	                for(var i=0; i< len; i++){
	                	var key = valArray[i];
	                     if(curVal==key){
	                    	 tmpVal.push(key);
	                     }
	                }
	            });
	            //BUG #6927 【combox】多选模式下，设置"defValue":"1,0"，然后调用reset()方法会造成显示的值为"1,0"但是提交值变成[01,]
	            //tmpVal = tmpVal.substring(0,tmpVal.length-1);
	            this.hidden.val(tmpVal.join(this.delimiter));
            }
        }
//        if (!notBlur) {
//            this.field.blur();
//        }
    } ,
    /**
     * 获取选中的值
     * @function
     * @name Horn.Select#getValue
     * @return String 返回选中的值
     */
    getValue : function(returnFieldValue){
    	this.handerHeadItem();
    	if(returnFieldValue){
    		var _select = this;
    		var val = this.hidden.val() ;
    		var getVal = function(key){
    			return  _select.DICT[key] || null;
    		};
    		if(this.multipleline){
    			var valArr = val.split(this.delimiter);
    			var rtnVal = [];
    			$(valArr).each(function(i,item){
    				var transVal =getVal(item);
    				if(transVal){
    					rtnVal.push(transVal);
    				}
    			});
    			return rtnVal.join(this.delimiter);
    		}else{
    			return getVal(val);
    		}
    	}
        return this.hidden.val() ;
    },
    /**
     * @ignore
     */
    onFocus : function(e) {
        var curObj = $(e.currentTarget);
        var listDiv = this.listEl;
//        if(this.params.readonly){
//        	return ;
//        } 
        if (listDiv.length > 0 ) {
            this.showList(curObj, listDiv);
        }else{
            var ref_target = this.field.attr("ref");
            this.listEl = ref_target ? this.el.parents('.h_floatdiv').find(
                "div.hc_hide_div").children(
                "div.hc_checkboxdiv[ref_target='" + ref_target + "']")
                : this.field.next("div.hc_checkboxdiv");
            if(this.listEl.length >0 ){
            	this.showList(curObj, this.listEl);
            }    
            this.multipleline = this.listEl.attr("multiple_line") == "true";
        }
    } ,
    /**
     * @ignore
     */
    onKeyDown : function(e){
        var keyCode = e.keyCode;
        var listEl = this.listEl ;
        var ul = listEl.children("ul") ;
        var lis = ul.children("li") ;
        var li = ul.children("li.h_cur") ;
        var listDom = listEl.get(0) ;
        var last = ul.children("li").last().get(0) ;
        if (e.ctrlKey && keyCode === 65 && this.multipleline) {
            var inputs = ul.find("input:not(:checked)") ;
            if(inputs.length==0){
                lis.removeClass("h_cur") ;
                inputs = lis.children("label").children("input") ;
                inputs.each(function(index,input){
                    input.checked = false ;
                }) ;
                this.setValue("") ;
            }
            else{
                inputs.each(function(index,input){
                    input.checked = true ;
                    $(input).parent("label").parent("li").addClass("h_cur") ;
                }) ;
                inputs.last().parent("label").parent("li").triggerHandler("click.li") ;
            }
            Horn.Util.stopPropagation(e);
            return false;
        }
        else if (keyCode === 38) {//up
            //↑
            if(!this.multipleline){
                var prev = li.prev() ;
                if(prev.length){
                    listDom.scrollTop=prev.get(0).offsetTop+(listDom.scrollHeight-listDom.clientHeight) -last.offsetTop ;
                    li.removeClass("h_cur") ;
                    prev.addClass("h_cur") ;
                }
            }
        } else if (keyCode === 40) {//down
            if(!this.multipleline){
                var next = li.next() ;
                if(next.length){
                    listDom.scrollTop=next.get(0).offsetTop+(listDom.scrollHeight-listDom.clientHeight) -last.offsetTop ;
                    li.removeClass("h_cur") ;
                    next.addClass("h_cur") ;
                }
            }
        } else if (keyCode === 46 || keyCode === 8) {//回退或删除
           /* lis.removeClass("h_cur") ;
            var inputs = lis.children("label").children("input") ;
            inputs.each(function(index,input){
                input.checked = false ;
            }) ;
            this.setValue("") ;
            Horn.Util.stopPropagation(e);
            return false;*/
        	//BUG #6861 【combox】多选模式下，按回退或者删除键，会把值清空
        	if (!this.multipleline) {
        		this.setValue("") ;
        	}
        } else if (keyCode === 9) {//tab键
            this.hideList(this.field, listEl);
        } else if (keyCode === 13 || keyCode === 32) { //回车或空格
            if(!this.multipleline){
                li.trigger("click.li") ;
                Horn.Util.stopPropagation(e);
            }
            return false;
        } else {
        }
    } ,
    /**
     * @ignore
     */
    onKeyPress : function(e){
        var keyCode = e.keyCode;
        var text = String.fromCharCode(keyCode) ;
        var newText = "" ;
        var listEl = this.listEl ;
        var ul = listEl.children("ul") ;
        var li = ul.children("li") ;
        if (keyCode>=65 && keyCode<=90){
            newText = text.toLowerCase() ;
        }
        else{
            newText = text.toUpperCase() ;
        }

        var selLi = this.selectLi(text,newText) ;
        var last = li.last().get(0) ;
        var listDom = listEl.get(0) ;
        if (keyCode === 38) {
        } else if (keyCode === 46 || keyCode === 8) {
        } else if (keyCode === 40) {
        } else if (keyCode === 13) {
        } else {
            //其他key值，用于筛选
            if (this.multipleline) {
                var value = this.getValue() ;
                if(value.indexOf(text)==-1){
                    if(selLi){
                        var input = selLi.children("label").children("input") ;
                        if(!input.get(0).checked){
                            input.get(0).checked = true ;
                            //BUG #6837 【combox】多选模式下，value设置有值，通过键盘增加输入框的值，所有已经设置的均应被选中
                            //selLi.trigger("click.li") ;
                        }
                    }
                } else {
                	// 20140423 hanyin BUG #6809 【combox】多选模式下，value设置有值，通过键盘修改输入框的值，下拉不会选中，焦点移开然后获得焦点依然无法选中
                	//selLi.trigger("click.li") ;
                }
            }
            if(selLi){
                listDom.scrollTop=selLi.get(0).offsetTop+(listDom.scrollHeight-listDom.clientHeight) -last.offsetTop ;
            }
        }
        Horn.Util.stopPropagation(e);
    },
    /**
     * @ignore
     */
    onKeyUp : function(e){
        var listEl = this.listEl ;
        var _this = this;
        //只针对多选有效
        if (this.multipleline) {
            var val = this.field.val() ;
            var tmpVal = "";
            $("input[type='checkbox']", listEl).each(function(index, dom) {
                var li = $(dom).parent().parent("li[key]");
                var curVal = li.attr("key");
                $(dom).attr("checked", false);
                //BUG #6804 【combox】在多选模式下，如果setValue("20140205")会生效，并且会把0、1、2、4、5、14、20等全部选中
                var valArray = val.split(",");
                var len = valArray.length;
                for(var i=0; i< len; i++){
                	var key = valArray[i];
                     if(curVal==key){
                    	 tmpVal = tmpVal+valArray[i]+",";
                    	 $(dom).attr("checked", true);
                     }
                }
                //$(dom).attr("checked", val.indexOf(curVal) > -1);
                if ($(dom).attr("checked")) {
                    li.addClass("h_cur");
                } else {
                    li.removeClass("h_cur");
                }
                li.focus() ;
            });
            //BUG #6927 【combox】多选模式下，设置"defValue":"1,0"，然后调用reset()方法会造成显示的值为"1,0"但是提交值变成[01,]
            tmpVal = tmpVal.substring(0,tmpVal.length-1);
            _this.hidden.val(tmpVal);
        }
        
        Horn.Util.stopPropagation(e);
    },
    /**
     * @ignore
     */
    bodyClick : function(e) {
        if(e.target==e.data.inputEl.get(0)){
            $(document).one(this.bodyclicktype, e.data,
                Horn.Util.apply(this.bodyClick,this));
        }
        else{
            var listEl = e.data.listEl;
            var inputEl = e.data.inputEl;
            this.hideList(inputEl, listEl);
        }
    } ,
    /**
     * @ignore
     */
    listClick : function(e) {
        var _this = this ;
        var _li = $(e.currentTarget);
        var listEl = e.data.listEl;
        var value = {} ;
        if (_this.multipleline) {
            var arrVal = new Array();
            $("input[type='checkbox']:checked", listEl).each(function(index, dom) {
                var curVal = $(dom).parent().parent("li[key]").attr("key");
                if (curVal) {
                    arrVal.push(curVal);
                }
            });
            value["key"] = arrVal.join(_this.delimiter) ;
            value["text"] = value["key"] ;
            if ($("input[type='checkbox']", _li).get(0).checked) {
                _li.addClass("h_cur");
            } else {
                _li.removeClass("h_cur");
            }
            e.stopPropagation();
            this.setValue(value,true) ;
        } else {
            _li.addClass("h_cur");
            _li.siblings().removeClass("h_cur");
            this.setValue(_li.attr("key"),true) ;
        }
        this.field.trigger('blur');
    } ,
    /**
     * @ignore
     */
    hideList : function(inputEl, listEl) {
        if (!listEl.data("show_name")) {
            return;
        }
        listEl.hide();
        var listLi = $("li[key]", listEl);
        listLi.unbind('click.li');
        listEl.data("show_name", "");
    } ,
    /**
     * @ignore
     */
    longerList : false,
    changeToLongerList : function(){
    	this.longerList = true;
    },
    /**
     * @ignore
     */
    showList : function(inputEl, listEl) {
    	this.handerHeadItem();
        var _this = this ;
        var hidden = inputEl.prev() ;
        if (listEl.data("show_name")==hidden.attr("name")) {
            return;
        }
        this.hideAllList(listEl);
        // 应用对象
        var data = {
            'inputEl' : inputEl,
            'listEl' : listEl
        };
         
		if(listEl.offsetParent() != inputEl.offsetParent() ){
			listEl.appendTo(inputEl.offsetParent());
		}
        var pos = inputEl.position(),
	       	listOuterHeight = inputEl.outerHeight();
        // 显示位置
        listEl.css("left",pos.left + 'px') ;
        listEl.css("top",(pos.top + listOuterHeight) + 'px') ;
        listEl.css("width",(inputEl.outerWidth() * (this.longerList?2:1) - 2) + 'px') ;
        // 显示
        listEl.css("display","block");
        listEl.data("show_name", hidden.attr("name"));
        // 文档事件处理
        $(document).one(_this.bodyclicktype, data,
            Horn.Util.apply(_this.bodyClick,_this));
        // 列表事件绑定
        var listLi = $("li[key]", listEl);
        listLi.bind("click.li", data, Horn.Util.apply(_this.listClick,_this));
        listLi.removeClass("h_cur");

        // 列表初始化选择的值。
        var val = inputEl.prev().val();
        if (this.multipleline) {
            $("input[type='checkbox']", listEl).each(function(index, dom) {
                var li = $(dom).parent().parent("li[key]");
                var curVal = li.attr("key");
                $(dom).attr("checked", false);
                //BUG #6804 【combox】在多选模式下，如果setValue("20140205")会生效，并且会把0、1、2、4、5、14、20等全部选中
                var valArray = val.split(",");
                for(var i=0; i< valArray.length; i++){
                	var key = valArray[i];
                     if(curVal==key){
                    	 $(dom).attr("checked", true);
                     }
                }
                
                //$(dom).attr("checked", val.indexOf(curVal) > -1);
                if ($(dom).attr("checked")) {
                    li.addClass("h_cur");
                } else {
                    li.removeClass("h_cur");
                }
                li.focus() ;
            });
        } else {
            var li = listEl.children("ul").children("li[key='" + val + "']") ;
            li.addClass("h_cur");
            li.focus() ;
        }
        
        if(this.showLabel){
        	this.listEl.find('span.hce_dictlabel').show();
        }else{
        	this.listEl.find('span.hce_dictlabel').hide();
        }
    } ,
    /**
     * @ignore
     */
    hideAllList : function(listEl) {
        $("div.hc_checkboxdiv").each(function(i, o) {
            if (listEl.get(0) != o) {
                $(o).hide();
                $(o).data("show_name", "");
            }
        });
    },
    /**
     * @ignore
     */
    selectLi : function(text,old){
        var liList = this.listEl.children("ul").children("li") ;
        var selectLi = null ;
        for(var i=0;i<liList.size();i++){
            var li = $(liList.get(i)) ;
            var key = li.attr("key") ;
            //BUG #6920 【combox】有headItem的单选状态，在输入框输入任何值报js错误
            if(key && key.indexOf(text)==0){
                selectLi = li ;
                break ;
            }
        }
        if(selectLi==null && !this.multipleline){
            for(var i=0;i<liList.size();i++){
                var li = $(liList.get(i)) ;
                var key = li.attr("key") ;
                //BUG #6920 【combox】有headItem的单选状态，在输入框输入任何值报js错误
                if(key && key.indexOf(old)==0){
                    selectLi = li ;
                    break ;
                }
            }
        }
        if(selectLi!=null){
            if (!this.multipleline) {
                selectLi.siblings().removeClass("h_cur");
                selectLi.addClass("h_cur");
            }
        }
        return selectLi ;
    },
    bind : function(type,fn){
        this.field.bind(type,[this.hidden],fn) ;
    },
	setEnable : function(enable){
		if(enable){
			this.field.removeAttr("disabled");
			this.hidden.removeAttr("disabled");
		}else{
			this.hidden.attr("disabled","disabled");
			this.field.attr("disabled","disabled");
		}
	}
}) ;
Horn.Field.regFieldType("div.hc_select",Horn.Select) ;
/*
 * 修改日期                        修改人员        修改说明
 * -------------------------------------------------------------------------------------
 * 2014-4-8	 XIE		BUG #6662 [button_group]调用setEnable方法时传入非法enabled值，忽略
 * 2014-4-14 周智星              BUG #6643 [button_panel]setEnable设置一个不存在的name
 * -------------------------------------------------------------------------------------
 */
/**
 * @name Horn.ButtonPanel
 * @class
 * 按钮容器组件
 * 
*/

/**@lends Horn.ButtonPanel# */

/**
 * 组件唯一标识<br/>
 * 支持此属性的按钮容器组件(<b>button_group</b>,<b>button_panel</b>,<b>button_panel_ex</b>)
 * @name Horn.ButtonPanel#<b>id</b>
 * @type String
 * @default
 * @example
 * 无
 */
/**
 * 组件的名字<br/>
 * 支持此属性的按钮容器组件(<b>button_group</b>,<b>button_panel</b>,<b>button_panel_ex</b>)
 * @name Horn.ButtonPanel#<b>name</b>
 * @type String
 * @default
 */
/**
 * 组件所占的显示列数<br/>
 * 默认仅支持1,2,3列<br/>
 * 支持此属性的按钮容器组件(<b>button_group</b>)
 * @name Horn.ButtonPanel#<b>cols</b>
 * @type number
 * @default 1
 */
/**
 * 表单中提交按钮的显示标签<br/>
 * 如果要使用默认属性，不要设置此属性，更不要使用空字符串<br/>
 * 支持此属性的按钮容器组件(<b>button_panel</b>)
 * @name Horn.ButtonPanel#<b>submitLabel</b>
 * @type String
 * @default "提交"
 */
/**
 * 表单中重置按钮的显示标签<br/>
 * 如果要使用默认属性，不要设置此属性，更不要使用空字符串<br/>
 * 支持此属性的按钮容器组件(<b>button_panel</b>)
 * @name Horn.ButtonPanel#<b>resetLabel</b>
 * @type String
 * @default "重置"
 */

/**
 * 按钮组件中的自定义按钮配置<br/>
 * 支持此属性的按钮容器组件(<b>button_group</b>,<b>button_panel</b>,<b>button_panel_ex</b>)<br/>
 * 按钮的数据格式:<br/>
 * {"name":"btn1",//按钮组件名称<br/>
 *  "label":"查询",//按钮显示名称<br/>
 *  "className":"h_btn-cencel",//按钮自定义样式，非必须项<br/>
 *  "event":"lhkh.query()"//按钮被点击时触发的函数执行<br/>
 * }
 * @name Horn.ButtonPanel#<b>buttons</b>
 * @type Array[Json]
 * @default ""
 * @example
 * 名称 标签 样式名 点击事件
 * "buttons":[{"name":"query","label":"查询","className":"h_btn-cencel", "event":"lhkh.query()"}] 
 */

Horn.ButtonPanel = Horn.extend(Horn.Base,{
	COMPONENT_CLASS:"ButtonPanel",
    init:function(){
        Horn.ButtonPanel.superclass.init.apply(this,arguments);
    },
    /**
     * 设置按纽是否可用，设置为不可用，则单击无响应
     * @function
     * @name Horn.ButtonPanel#setEnable
     * @param {string} name 按纽的名字
     * @param {boolean} enabled 如果为true设置为可用，设置为false，设置不可用,此参数不传入时默认为true;
     * @return {void}
     * @example
     * Horn.getComp("buttonPaneName").setEnable("btnName",false);
     */
    setEnable:function(name,enabled){
    	//BUG #6643 [button_panel]setEnable设置一个不存在的name
    	if(typeof enabled !='boolean'){
    		Horn.Tip.info("enabled属性只能是布尔型！");
    		return;
    	}
        var button = this.el.find("button[name="+name+"]");
        if(button.length==0){
        	Horn.Tip.info(name+",不存在！");
        	return;
        }
        if (typeof enabled =='undefined'|| enabled) {
            button.removeClass("h_btn-disabled");
            button.removeAttr("disabled");
        } else {
            button.addClass("h_btn-disabled");
            button.attr("disabled", "disabled");
        }
    }
});
Horn.regUI("div.h_btndiv",Horn.ButtonPanel) ;
Horn.regUI("div.hc_button-group",Horn.ButtonPanel) ;
Horn.fieldReady = function(current){
    Horn.Validate.init();
} ;
Horn.register(Horn.fieldReady);
/*
 * -----------------------------------------------------------------------
 * 修订记录：
 * 2014-2-11     zhangc   修正错误显示逻辑，removeError之后无法再次显示的问题
 * 2014-2-26     zhangc   修正翻译后内容超长溢出的问题。
 * ----------------------------------------------------------------------- 
 */
/**
 * @name Horn.Label   
 * @class
 * 用于显示标签的标签组件</br>
 */	
/**
 * @lends Horn.Label#
 */

/**
 * 组件唯一标识
 * @name Horn.Label#<b>id</b>
 * @type String
 * @default
 */
/**
 * 组件的名字
 * @name Horn.Label#<b>name</b>
 * @type String
 * @default
 */
/**
 * 组件的别名，名字相同时，加别名区分
 * @name Horn.Label#<b>alias</b>
 * @type String
 * @default ""
 * @ignore
 * @example
 * var comp = Horn.getComp("name","alias")
 */
/**
 * 组件的初始值
 * @name Horn.Label#<b>value</b>
 * @type String
 * @default ""
 * @ignore
 * @example
 * 无
 */
/**
 * 标签的显示文本
 * @name Horn.Label#<b>label</b>
 * @type String
 * @default
 */
/**
 * 标签组件布局上所占的列数（1-3）
 * @name Horn.Label#<b>cols</b>
 * @type Int
 * @default 1
 * @example
 * 无
 */
/**
 * 组件的静态字典列表
 * @name Horn.Label#<b>items</b>
 * @type Array[Json
 * @default  
 * @ignore
 * @example
 * "items":[{"label":"a","value":"a1"},{"label":"b","value":"b1"},{"label":"c","value":"c1"}]
 */
/**
 * 组件的动态字典名字
 * @name Horn.Label#<b>dictName</b>
 * @type String
 * @default  
 * @ignore
 * @example
 * 无
 */
/**
 * 组件的隐藏名，如有值，则以此name提交一个当前的值到后台
 * @name Horn.Label#<b>hiddenName</b>
 * @type String
 * @ignore
 * @default  
 * @example
 * 无
 */
/**
 * 组件的标签字段名字
 * @name Horn.Label#<b>labelField</b>
 * @type String
 * @default "label" 
 * @ignore
 * @example
 * 无
 */
/**
 * 组件的值字段名字
 * @name Horn.Label#<b>valueField</b>
 * @type String
 * @default "value" 
 * @ignore
 * @example
 * 无
 */
 /**
  * 组件的多个值时的分割符号,定义了分割符为多选,如果定义的分割为空，则用逗号分割
  * @name Horn.Label#<b>delimiter</b>
  * @type String
  * @default "" 
  * @ignore
  * @example
  * 无
  */
Horn.Label = Horn.extend(Horn.Base,{
	COMPONENT_CLASS:"Label",
	el:null,
	dictName:null,
	staticDict:null,
	mutiValue : null,
	init:function(dom){
		Horn.Label.superclass.init.apply(this,arguments);
		var params = this.params;
		if(params['name'] || params['hiddenName']){
			this.name = params['name'] || params['hiddenName'] ;
		}
//		this.mutiValue = params.multiple ;
		this.mutiValue = $(dom).attr('mutivalue');
		
		this.label = this.el.prev('span');
		this.hidden = this.el.find('input:hidden');
		if(!this.hidden.get(0)){
			this.hidden = this.el.next('input:hidden');
		}
		this.li= this.el.parent();
		
		if(this.hidden) {
			this.el.parent().append(this.hidden);
		}
		
		var dictName = params["dictName"],
			staticDict = params["items"],
			labelName = params['labelField'] || 'label',
			valueName = params['valueField'] || 'value',
			delimiter = params['delimiter'],
			value = this.hidden.get(0)?this.hidden.val():this.el.html()
			;
		if(delimiter==""||this.delimiter){
			this.delimiter =delimiter;
			this.mutiValue = true;//只要定义了分隔符，皆为多选
		}else{
			this.delimiter =",";
		}
		
		if(staticDict){
			var tmpDict = {};
			for(var i=0;i<staticDict.length;i++){
				var obj = staticDict[i];
				tmpDict[obj[labelName]] = obj[valueName];
			}
			staticDict = tmpDict;
		}
		
		if(dictName){
			this.dictName = dictName; 
			staticDict = Horn.getDict(dictName);
		}
		
		this.staticDict = staticDict;
		
		if(value){
			this.setValue(  value );
		}
	},
	 /**
     * @description 设置标签的值
     * @function
     * @ignore
     * @name Horn.Label#setValue
     * @param {String} val 标签的值
     */
	setValue:function(value){
		value = $.trim(value);
		if(this.hidden){
			this.hidden.val(value);
		}
	
		var dictName = this.dictName,
			staticDict = this.staticDict
			;
		
		var getVal = function(val){
			var tmpval = "";
			if(staticDict){
				tmpval = staticDict[val]||val;
			}else if(dictName){
				var li = $('.hc_checkboxdiv[ref_target='+dictName+'_s]').find("li[key="+val+"]");
				tmpval = li.attr('title')||val;
			}else{
				tmpval = val;
			}
			return tmpval;
		};
		var fval = "";
		var overflow = false;
		if(!value) value="";
		if(this.mutiValue){
			var vv = [];
			$(value.split(this.delimiter)).each(function(idx,item){
				var v = getVal(item);
				vv.push(v||item);
			});
			fval = vv.join(this.delimiter||',');//若存在分隔符但分隔符为空，则用逗号代替
			overflow = true;
		}else{
			fval = getVal(value);
		}
	
		this.el.html(fval);
		if(overflow){
			this.el.addClass('hc_texthide');
			this.el.attr('title',fval);
		}
	},
	/**
     * @description 取标签的值
     * @function
     * @ignore
     * @name Horn.Label#getValue
     * @return 标签的值
     */
	getValue:function(){
		if(this.hidden.get(0)){
			return this.hidden.val();
		}
		return this.el.text();
	},
    /**
     * @description 设置标签的名字
     * @function
     * @ignore
     * @name Horn.Label#setLabel
     * @param {string} val 标签的名字
     */
	setLabel:function(val){
		this.label.html(val);
	},
    /**
     * @description 取标签的名字
     * @function
     * @ignore
     * @name Horn.Label#getLabel
     * @return 标签的名字
     */
	getLabel:function(){
		return this.label.html();
	},
	hide:function(){
		this.li.hide();
	},
	show:function(){
		this.li.show();
	}
});

Horn.regUI("div.hc_label",Horn.Label) ;

/**
 * @name Horn.Checkbox
 * @class
 * 复选框组件(从field继承)<br/>
 * 与html原生的checkbox一致
 */
/**
 * @lends Horn.Checkbox#
 */
	 
/**
 * 组件的唯一标示
 * @name Horn.Checkbox#<b>id</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 组件的名称
 * @name Horn.Checkbox#<b>name</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
	 
 /**
 * 所占列数
 * @name Horn.Checkbox#<b>cols</b>
 * @type Number
 * @default 1
 * @example
 * 无
 */
/**
 * 别名
 * @name Horn.Checkbox#<b>alias</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
	 
/**
 * 值
 * @name Horn.Checkbox#<b>value</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
	
/**
 * 是否被选中
 * @name Horn.Checkbox#<b>checked</b>
 * @type Boolean
 * @default false
 * @example
 * 无
 */
/**
 * 标签名
 * @name Horn.Checkbox#<b>label</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
	 
/**
 * 事件配置）
 * @name Horn.Checkbox#<b>events</b>
 * @type Array
 * @default 
 * @example
 * "events":[{"event":"onclick","function":"checkA(this.value)"}]
 */
	
/**
 * 校验规则
 * @name Horn.Checkbox#<b>check</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
	
/**
 * 校验规则组（可以约定校验是按组校验）
 * @name Horn.Checkbox#<b>group</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 是否禁用<br/>
 * 支持（<b>textfield</b>,<b>textarea</b>）
 * @name Horn.Checkbox#<b>disabled</b>
 * @type Boolean
 * @default false
 * @example
 * 无
 */

	Horn.Checkbox = Horn.extend(Horn.Field,{
		COMPONENT_CLASS:"Checkbox",
		checkbox : null,
		init : function(){
			Horn.Checkbox.superclass.init.apply(this,arguments);
			this.checkbox = this.el.find('input:checkbox');
		},
		getEventTarget : function() {
			return this.el.find('input:checkbox');
		},
        /**
         * 设置checkbox的值(若不为true和false则直接设置给提交值)
         * @function
         * @name Horn.Checkbox.setValue
         * @param {Mixed} val 0/1,true/false
         */
		setValue : function(val){
			if(this.checkbox.get(0)){
				this.checkbox.get(0).checked = !!val;
			}
			if(val && $.type( val) !='boolean' ){
				this.setStaticValue(val);
			}
		},
		/**
         * 设置对应的提交值
         * @function
         * @name Horn.Checkbox.setStaticValue
         * @param {String} 预备提交的值
         * @ignore
		 */
		setStaticValue : function(val){
			this.checkbox.val(val);
		},
        /**
         * @description 获取checkbox的值
         * @function
         * @name Horn.Checkbox.getValue
         * @return {int} 0,1
         */
		getValue : function(){
			return this.checkbox.val();
		}
	});
	Horn.Field.regFieldType("div.hc_checkbox",Horn.Checkbox);

﻿/*
 * 修改日期         修改人员        修改说明
 * -----------------------------------------------------------------------
 *  2014-4-18    周智星    BUG #6440 【form】各个表单组件的校验提示不统一
 *  2014-4-22    周智星    BUG #6780 【form】checkboxgroup组件首先调用setValue("")，然后调用form的setValues方法设置有效的值不会触发select和checkboxgroup的校验
 *  2014-4-22    周智星    BUG #6792 【radiogroup】【checkboxgroup】radiogroup、checkboxgroup的validate方法无效
 *  2014-4-29    周智星    BUG #6912 【radio_group】在IE7下验证的错误提示信息显示的位置很远 
 * -----------------------------------------------------------------------
 */
/**
 * @name Horn.CheckboxGroup
 * @class
 * 复选框组组件</br>
 */
/**
 * @lends Horn.CheckboxGroup#
 */

/**
 * 组件的复选框选项<br/>
 * 数据项不易过多（一行内可以完整显示），否则会导致换行显示影响美观，如果需要显示更多的项，可以考虑使用combox组件
 * @name Horn.CheckboxGroup#<b>items</b>
 * @type Array[JSON]
 * @default 无
 * @example
 * "items":[{"text":"游泳","code":"1"},
 	{"text":"网球","code":"2"}]
 */
/**
 * 组件唯一标识
 * @name Horn.CheckboxGroup#id
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单提交名字
 * @name Horn.CheckboxGroup#name
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单组件的标签名，值过长会造成label显示不全，但是可以通过鼠标悬浮看到完整值
 * @name Horn.CheckboxGroup#label
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * @ignore
 * 组件的别名，名字相同时，加别名区分
 * @name Horn.CheckboxGroup#alias
 * @type String
 * @default ""
 * @ignore
 * @example
 * var comp = Horn.getComp("name","alias")
 */

 /**
  * 表单的初始值，如果没有配置defValue属性，表单重置的时候，将采用value作为重置值
  * @name Horn.CheckboxGroup#value
  * @type String
  * @default ""
  * @example
  * 无
  */

 /**
  * 组件的重置时的值，如果没有配置此值，将以value属性做为重置值。
  * 如果指定了value值，并且defValue设置为空(defValue:"")，则无法重置为空值，请用form组件的clearValue方法清空form内组件的值或调用组件本身的clearValue方法清空值。
  * @name Horn.CheckboxGroup#defValue
  * @type String
  * @default 无
  * @example
  * 无
  */

 /**
  * 组件的是读配置，被设置为只读的组件只能通过API的方式修改表单的值，可以获得焦点，参与表单校验（校验失败会阻止表单提交），并且可以参与表单提交；
  * true表示只读状态，false表示正常状态
  * @name Horn.CheckboxGroup#readonly
  * @type Boolean
  * @default false
  * @example
  * 无
  */

 /**
  * 组件的禁用状态，被设置禁用状态的组件，无法获得焦点，不参与表单校验（不会阻止表单提交），不会参与表单提交并且其所有校验状态都会消失，不可编辑，但是可以通过API修改表单的值；
  * true表示禁用，false表示正常状态
  * @name Horn.CheckboxGroup#disabled
  * @type Boolean
  * @default false
  * @example
  * 无
  */

/**
 * 组件的跨列数，取值范围由外容器的screen的cols而定
 * @name Horn.CheckboxGroup#cols
 * @type int
 * @default 1
 * @example
 * 无
 */

/**
 * 组件的约束检查选项(只针对required起效)
 * @name Horn.CheckboxGroup#check
 * @type String
 * @default ""
 * @example
 * 具体见Horn.Validate类的已经支持的正规、函数名
 * "check":"required;"
 */

/**
 * 组件的所属组，可以对相同组内的元素进行约束检查
 * @name Horn.CheckboxGroup#group
 * @type String
 * @default ""
 * @ignore
 * @example
 * 验证指定对象$obj(scope)中组名为groupname的元素有有效性
 * Horn.Validate.validateAreaByGroup($obj,groupname)
 */

/**
 * 加入一个分组中，可以根据组名进行分组校验，参见validate的validateAreaByGroup(scope, group)方法
 * @function
 * @name Horn.CheckboxGroup#addGroup
 * @param {String} group 组名
 * @ignore
 */
/**
 * 从一个分组中删除
 * @function
 * @name Horn.CheckboxGroup#removeGroup
 * @param {String} group 组名
 * @ignore
 */
/**
 * 判断组件上会否在分组中
 * @function
 * @name Horn.CheckboxGroup#inGroup
 * @param {String} group 组名
 * @ignore
 */

/**
 * 增加校验规则(只针对required起效)
 * @function
 * @name Horn.CheckboxGroup#addRule
 * @param {String} rule 校验规则字符串
 */
/**
 * 删除校验规则(只针对required起效)
 * @function
 * @name Horn.CheckboxGroup#removeRule
 * @param {String} rule 校验规则字符串
 */

/**
 * 显示表单，如果表单已经显示，此方法无效果，hide方法与之相对应
 * @function
 * @name Horn.CheckboxGroup#show
 */
/**
 * 隐藏表单，如果表单已经隐藏，此方法无效果，show方法与之对应
 * @function
 * @name Horn.CheckboxGroup#hide
 */

/**
 * 设置label内容
 * @function
 * @name Horn.CheckboxGroup#setLabel
 * @param {String} label 标签内容
 * @ignore
 */
/**
 * 获取label内容
 * @function
 * @name Horn.CheckboxGroup#getLabel
 * @return 标签内容
 * @ignore
 */

/**
 * 设置为必填项，同时增加红色的 *
 * @function
 * @name Horn.CheckboxGroup#setRequired
 * @param {Boolean} required 不传值或者传true表示必选项，传false表示取消必选项
 */
/**
 * 设置字段是否禁用，被设置为禁用的组件，不可以编辑，也不参与表单提交，但是可以通过API的方式修改表单的值
 * @function
 * @name Horn.CheckboxGroup#setDisabled
 * @param {Boolean} disabled true表示禁用，false表示正常
 */
/**
 * 设置是否只读，设置为只读方式的组件，不可以编辑，但是可以通过setValue、reset等API修改表单的值，并可以可以参与表单提交
 * @function
 * @name Horn.CheckboxGroup#setReadonly
 * @param {Boolean} readonly true表示只读，false表示正常
 */

/**
 * 设置表单的值
 * @function
 * @name Horn.CheckboxGroup#setValue
 * @param {String} value 值
 */
/**
 * 获取表单的值
 * @function
 * @name Horn.CheckboxGroup#getValue
 * @return 表单的提交值
 */
/**
 * 如果设置了defValue的值，重置成的defValue值，否则重置成value值
 * @function
 * @name Horn.CheckboxGroup#reset
 */
/**
 * 清空表单的值，显示值和隐藏值都设置为""
 * @function
 * @name Horn.CheckboxGroup#clearValue
 */

/**
 * 获取由validate方法触发表单校验后的结果，并通过返回值标识校验的结果
 * @function
 * @name Horn.CheckboxGroup#isValid
 * @return {Boolean} true表示校验通过，false表示校验失败
 */
/**
 * 触发校验表单的内容，然后通过调用isValid方法获取校验的结果
 * @function
 * @name Horn.CheckboxGroup#validate
 */
;(function(H,$){
	H.CheckboxGroup = H.extend(Horn.Field,{
		COMPONENT_CLASS:"CheckboxGroup",
		checkboxs : null,
		init : function(){
			Horn.CheckboxGroup.superclass.init.apply(this,arguments);
			var _checkboxgroup = this;
			this.name = this.el.attr("name") ;
            this.alias = this.el.attr("alias") || "" ;
            var realcheckboxs = this.el.find('input:checkbox');
            if(realcheckboxs.length>0){
            	var checkgroup = realcheckboxs.first().attr('group');
               	if(checkgroup){
               		var groupArr = checkgroup.split(';');
               		$(groupArr).each(function(idx,group){
               			_checkboxgroup.checkGroup[group] = true;
               		});
               	}
            }
            this.checkboxs = {};
            this.el.find('input:checkbox').each(function(idx,checkbox){
            	var $box = $(checkbox);
            	var val = $box.val();
            	_checkboxgroup.checkboxs[val] = $box;
            });
            
            if(this.params.value) {
            	this.setValue(this.params.value);
            }
            if(this.params.readonly) {
            	this.setReadonly(true);
            }
            if(this.params.disabled) {
            	this.setDisabled(true);
            }
            this.defValue = this.params.defValue || this.params.value || "";
		},
		getEventTarget : function() {
			return this.el.find('input:checkbox');
		},
        /**
         * @description 设置checkbox的值
         * @function
         * @name Horn.CheckboxGroup.setValue
         * @param {string} val 以","分割的字符串或字符组件
         * @ignore
         */
		setValue : function(val){
			var _checkboxgroup = this;
			if(!$.isArray(val)){
				val = val.split(',');
			}
			for (var $box in  _checkboxgroup.checkboxs){
				_checkboxgroup.checkboxs[$box].attr('checked',false);
			}
			$(val).each(function(idx,v){
				var $box = _checkboxgroup.checkboxs[v] ;
				if($box){
					$box.attr('checked',true);
				}
			});
	        //this.validate();
		},
        /**
         * @description 获取checkbox的值
         * @function
         * @name Horn.CheckboxGroup.getValue
         * @return {string} 以逗号分割的字符串
         * @ignore
         */
		getValue : function(){
			var val = '';
			this.el.find('input:checkbox[checked]').each(function(idx,checkbox){
				var value = $(checkbox).attr('value');
				if(value){
					if(idx != 0) val += ',';
					val += value ;
				}
			});
			return val;
		},
	    /**
	     * 如果设置了defValue的值，重置成的defValue值，否则重置成初始值
	     */
	    reset : function() {
	    	this.setValue(this.defValue);
	    },
	    /**
	     * 清除值
	     */
	    clearValue : function() {
	    	this.setValue("");
	    },
	    setEnable : function(enabled) {
	    	var _checkboxgroup = this;
			this.el.find('input:checkbox').each(function(idx,checkbox){
				if (enabled === false) {
					$(checkbox).attr("disabled", "disabled");
					//_checkboxgroup.el.unbind("click");
					//_checkboxgroup.removeRule(Horn.Validate.REQUIRED);
					//_checkboxgroup.removeError();
				} else {
					$(checkbox).removeAttr("disabled");
				}
			});
	    },
	    // 方法冗余
	    setDisabled : function(disabled) {
	    	if (disabled === false) {
	    		this.setEnable(true);
	            this.disabled = false;
	    	} else {
	    		this.setEnable(false);
	            this.disabled = true;
	    	}
	    },
	    /**
	     * 设置是否可编辑
	     */
	    setReadonly : function(readonly) {
	    	var _checkboxgroup = this;
			this.el.find('input:checkbox').each(function(idx,checkbox){
				if (readonly === false) {
					_checkboxgroup.readonly = false;
					$(checkbox).removeAttr("onclick");
                    $(checkbox).bind("click",function(){
                    	setTimeout(function(){
                            var checkedboxs = _checkboxgroup.el.find('input:checkbox[checked]');
                            if(checkedboxs && checkedboxs.size() > 0){
                            	_checkboxgroup.removeError();
                            }else{
                            	_checkboxgroup.showError();
                            }
                    	},10);
                    });
				} else {
					_checkboxgroup.readonly = true;
					if(_checkboxgroup.el.find('input:checkbox[checked]').length==0){
						$(checkbox).unbind("click");
//						_checkboxgroup.removeRule(Horn.Validate.REQUIRED);
//						_checkboxgroup.removeError();
					}
					$(checkbox).get(0).onclick = function(){return false};
				}
			});
	    },
        /**
         * @ignore
         * @description  内容校验
         * @function
         * @name Horn.CheckboxGroup.validate
         * @ignore
         */
        validate : function(){
            if(!this.skipValid && this.checkRegx && this.checkRegx.length > 0) {
                var _checkboxgroup = this;
                if(_checkboxgroup.disabled === true){
                	_checkboxgroup.err = false;
                	return;
                }
                var checkbox = this.el.find('input:checkbox[checked]');
                if(checkbox && checkbox.size() < 1){
                    Horn.Validate.addError(_checkboxgroup, Horn.Validate.regexEnum.requiredMessage);
                }else{
                    Horn.Validate.removeError(_checkboxgroup);
                }
            }
        },
        /**
         * @ignore
         * @name Horn.CheckboxGroup#initEvents
         * @description  正则检查字符串数组 
         * @function 初始化方法
         * @private
         */
        initEvents : function(){
            var _checkboxgroup = this;
            var checkboxs = _checkboxgroup.el.find('input:checkbox[check*=required]');
            if(checkboxs && checkboxs.size()>0){
                this.checkRegx = $(checkboxs[0]).attr("check").split(';');
                checkboxs.each(function(idx,checkbox){
                    $(checkbox).bind("click",function(){
                    	setTimeout(function(){
                            var checkedboxs = _checkboxgroup.el.find('input:checkbox[checked]');
                            if(checkedboxs && checkedboxs.size() > 0){
                            	_checkboxgroup.removeError();
                            }else{
                            	_checkboxgroup.showError();
                            }
                    	},10);
                    })
                })
            }
        },
        /**
         * @ignore
         * @description 显示错误信息
         * @function
         * @name Horn.CheckboxGroup#showError
         */
        showError : function(){
        	var userAgent = window.navigator.userAgent.toLowerCase();
			/*var msie10 = $.browser.msie && /msie 10\.0/i.test(userAgent);
	        var msie9 = $.browser.msie && /msie 9\.0/i.test(userAgent); 
	        var msie8 = $.browser.msie && /msie 8\.0/i.test(userAgent);*/
	        var msie7 = $.browser.msie && /msie 7\.0/i.test(userAgent);
	        var greaterThanIe7 = true;
	        
	        if($.browser.msie){
		        //文本模式版本
		        if (document.documentMode && document.documentMode>=8){ // IE8文本模式
		        	greaterThanIe7 = true;
		        }else if(document.documentMode && document.documentMode<8){ // IE 5-7文本模式  
		        	greaterThanIe7 = false;
		        }
	        }
            var _checkboxgroup = this;
        	if(!this.msgDiv){
        		this.msgDiv = $('<span class="hc_verification" style="display:none;"></span>');
        		this.el.after(this.msgDiv);
        	}
            var msg = this.msgDiv;
            msg.html("当前复选框不能为空");
            msg.css("display", "none");
            _checkboxgroup.el.addClass('hc_ver-bd');
            _checkboxgroup.el.mouseover(function(){
            	if(msg){
            		var hcHeight = $(this).css("height");
        			hcHeight = hcHeight.replace("px","");
        			var tmpHeiht = parseInt(hcHeight)+1;
        			//BUG #6912 【radio_group】在IE7下验证的错误提示信息显示的位置很远 
        			if(!greaterThanIe7 || msie7){
        				tmpHeiht = 0;
        			}
        			msg.css("margin-top",tmpHeiht+"px")
            		msg.css("display", "inline");
            	} 
            })
            _checkboxgroup.el.mouseout(function(){
            	if(msg) msg.css("display", "none");
            })
            _checkboxgroup.err = true;
        },
        /**
         * @ignore
         * @description 删除错误信息
         * @function
         * @name Horn.CheckboxGroup#removeError
         */
        removeError : function(){
            var _checkboxgroup = this;
            _checkboxgroup.el.unbind('mouseover'); 
            _checkboxgroup.el.unbind('mouseout');
            _checkboxgroup.el.removeClass('hc_ver-bd');
            _checkboxgroup.err = false;
        	var msg = this.msgDiv;
        	if(msg) msg.remove();
        	delete this.msgDiv ;
        },
        /**
         * @description 添增验证规则(只支持required)
         * @function
         * @name Horn.CheckboxGroup#addRule
         */
        addRule : function(rule) {
        	if(rule && rule.indexOf(Horn.Validate.REQUIRED) > -1){
                var _checkboxgroup = this;
                var checkboxsWithRequired = _checkboxgroup.el.find('input:checkbox[check*=required]');
                if(checkboxsWithRequired && checkboxsWithRequired.size()>0){
                    return;
                }else{
                    _checkboxgroup.err = true;
                    this.checkRegx = rule.split(';');
                	var checkboxs = _checkboxgroup.el.find('input:checkbox');
                    checkboxs.each(function(idx,checkbox){
                    	var check = $(checkbox).attr(Horn.Validate.CHECK);
                        if (check) {
                            if (check.indexOf(rule) > -1) {
                                return;
                            }
                            check += Horn.Validate.CHECKSEP + rule;
                        } else {
                            check = rule;
                        }
                        $(checkbox).attr(Horn.Validate.CHECK, check);
                        $(checkbox).bind("click",function(){
                        	setTimeout(function(){
                        	var checkedboxs = _checkboxgroup.el.find('input:checkbox[checked]');
                            if(checkedboxs && checkedboxs.size() > 0){
                            	_checkboxgroup.removeError();
                            }else{
                            	_checkboxgroup.showError();
                            }},10);

                        })

                    });
                    var li = _checkboxgroup.el.parent();
                    var span = $("span", li);
                    var red = $("b.hc_red", span);
                    if (!red.length) {
                        red = $("<b>", {
                            "class" : "hc_red",
                            "html" : "*"
                        });
                        span.prepend(red);
                    } else {
                        red.html("*");
                    }
                }
        	}else{
        		return;
        	}
        },
        /**
         * 删除校验规则,校验规则字符串,只支持required
         * @function
         * @name Horn.CheckboxGroup#removeRule
         * @param {String} rule 校验规则字符串,只支持required
         * @ignore
         */
        removeRule : function(rule) {
            var _checkboxgroup = this;
        	var checkboxs = _checkboxgroup.el.find('input:checkbox');
            checkboxs.each(function(idx,checkbox){
            	var check = $(checkbox).attr(Horn.Validate.CHECK);
                if (check && check.indexOf(rule) > -1) {
                    var checks = check.split(Horn.Validate.CHECKSEP);
                    checks = $.grep(checks, function(c, index) {
                        return c && c != rule;
                    });
                    $(checkbox).attr(Horn.Validate.CHECK, checks.join(';'));
                }
                $(checkbox).unbind("click");
            });
            this.checkRegx = [];
            if(rule && rule.indexOf(Horn.Validate.REQUIRED) > -1){
                var li = this.el.parent();
                var span = $("span", li);
                var red = $("b.hc_red", span);
                red.html("");
            }
            _checkboxgroup.removeError();
        },
        /**
         * 设置为必填项，同时增加红色的 *
         * @function
         * @name Horn.CheckboxGroup#setRequired
         * @ignore
         */
        setRequired : function(required) {
        	if (required === false) {
        		this.setNotRequired();
        		return;
        	}else if(required === true || required===undefined){
                this.addRule(Horn.Validate.REQUIRED);
        	}
        },
        /**
         * 设置为非必填，同时删除红色的 *
         * @function
         * @name Horn.CheckboxGroup#setNotRequired
         * @ignore
         */
        setNotRequired : function() {
            this.removeRule( Horn.Validate.REQUIRED);
        }
	});
	H.Field.regFieldType("div.hc_checkbox-group",H.CheckboxGroup);
})(Horn,jQuery);
/**
 * 版本：
 * 系统名称: JRESPLUS
 * 模块名称: JRESPLUS-UI
 * 文件名称: Calendar.js
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：日期组件对应的代码
 * 修改记录:
 * 修改日期       修改人员        修改说明
 * -----------------------------------------------------------------------
 * 2014-04-11     周智星    BUG #6501 【calendar】如果设置了check为date，但是format:'yyyy年MM月dd日'，会造成校验失败(修改了文档说明)
 * 2014-04-16     周智星    BUG #6753 Calendar_setValue()设置了不符合日期格式的数据，也能提交
 * ----------------------------------------------------------------------- 
 */

/**
 * @name Horn.Calendar   
 * @class
 * 包装日期第三方插件的组件</br>
 */
	
/**
 * @lends Horn.Calendar#
 */

/**
 * 组件的配置选项如:日期格式(注意！如果填写了config，就不能再调用date验证规则，例如：#calendar({"label":"日期校验", "name": "test5", "value":"中文", "check": "required;date;", "config":"{format:'yyyy年MM月dd日'}"})；date和config只能选择一个)
 * @name Horn.Calendar#<b>config</b>
 * @type String
 * @default 无
 * @example
 * "config":"{minDate:'2012-12-09', noToday:true, format:'yyyy-MM-dd'}"
 */

/**
 * 组件唯一标识
 * @name Horn.Calendar#id
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单提交名字
 * @name Horn.Calendar#name
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单组件的标签名，值过长会造成label显示不全，但是可以通过鼠标悬浮看到完整值
 * @name Horn.Calendar#label
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * @ignore
 * 组件的别名，名字相同时，加别名区分
 * @name Horn.Calendar#alias
 * @type String
 * @default ""
 * @ignore
 * @example
 * var comp = Horn.getComp("name","alias")
 */

 /**
  * 表单的初始值，如果没有配置defValue属性，表单重置的时候，将采用value作为重置值
  * @name Horn.Calendar#value
  * @type String
  * @default ""
  * @example
  * 无
  */

 /**
  * 组件的重置时的值，如果没有配置此值，将以value属性做为重置值。
  * 如果指定了value值，并且defValue设置为空(defValue:"")，则无法重置为空值，请用form组件的clearValue方法清空form内组件的值或调用组件本身的clearValue方法清空值。
  * @name Horn.Calendar#defValue
  * @type String
  * @default 无
  * @example
  * 无
  */

 /**
  * 组件的是读配置，被设置为只读的组件只能通过API的方式修改表单的值，可以获得焦点，参与表单校验（校验失败会阻止表单提交），并且可以参与表单提交；
  * true表示只读状态，false表示正常状态
  * @name Horn.Calendar#readonly
  * @type Boolean
  * @default false
  * @example
  * 无
  */

 /**
  * 组件的禁用状态，被设置禁用状态的组件，无法获得焦点，不参与表单校验（不会阻止表单提交），不会参与表单提交并且其所有校验状态都会消失，不可编辑，但是可以通过API修改表单的值；
  * true表示禁用，false表示正常状态
  * @name Horn.Calendar#disabled
  * @type Boolean
  * @default false
  * @example
  * 无
  */

/**
 * 组件的跨列数，取值范围由外容器的screen的cols而定
 * @name Horn.Calendar#cols
 * @type int
 * @default 1
 * @example
 * 无
 */

/**
 * 组件的约束检查选项
 * @name Horn.Calendar#check
 * @type String
 * @default ""
 * @example
 * 具体见Horn.Validate类的已经支持的正规、函数名
 * "check":"required;"
 */

/**
 * 组件的所属组，可以对相同组内的元素进行约束检查
 * @name Horn.Calendar#group
 * @type String
 * @default ""
 * @ignore
 * @example
 * 验证指定对象$obj($obj为范围,是jquery对象或原生dom对象)中组名为group1的组件的有效性(group同名的即为同组)
 *	<div id="testCalendar1">
 *		#calendar({"label":"日期1", "name": "test1","group": "group1"})
 *		#calendar({"label":"日期2", "name": "test2","group": "group1"})
 *  </div>
 * function validateGroup1() {
 *		Horn.Validate.validateAreaByGroup($("#testCalendar1"), "group1");
 * }
 */

/**
 * 内容最大长度，超过长度的文字无法输入，比如“中文abc”，总共的文字数为5，中文、空格、英文字母、标点都只算一个字符。
 * 但是需要特别注意，maxlength属性只能限制键盘输入，或者粘贴等操作，无法限制api设置操作，并且此属性对textarea无效。
 * @name Horn.Calendar#maxlength
 * @type Number
 * @default 
 * @ignore
 * @example
 * 无
 */

 /**
  * 组件的事件配置
  * @name Horn.Calendar#events
  * @type Array
  * @default ""
  * @example
  * "events":[{"event":"onchange","function":"getValue()"}]
  */

/**
 * 加入一个分组中，可以根据组名进行分组校验，参见validate的validateAreaByGroup(scope, group)方法
 * @function
 * @name Horn.Calendar#addGroup
 * @param {String} group 组名
 * @ignore
 */
/**
 * 从一个分组中删除
 * @function
 * @name Horn.Calendar#removeGroup
 * @param {String} group 组名
 * @ignore
 */
/**
 * 判断组件上会否在分组中
 * @function
 * @name Horn.Calendar#inGroup
 * @param {String} group 组名
 * @ignore
 */

/**
 * 增加校验规则
 * @function
 * @name Horn.Calendar#addRule
 * @param {String} rule 校验规则字符串
 */
/**
 * 删除校验规则
 * @function
 * @name Horn.Calendar#removeRule
 * @param {String} rule 校验规则字符串
 */

/**
 * 显示表单，如果表单已经显示，此方法无效果，hide方法与之相对应
 * @function
 * @name Horn.Calendar#show
 */
/**
 * 隐藏表单，如果表单已经隐藏，此方法无效果，show方法与之对应
 * @function
 * @name Horn.Calendar#hide
 */

/**
 * 设置label内容
 * @function
 * @name Horn.Calendar#setLabel
 * @param {String} label 标签内容
 * @ignore
 */
/**
 * 获取label内容
 * @function
 * @name Horn.Calendar#getLabel
 * @return 标签内容
 * @ignore
 */

/**
 * 设置为必填项，同时增加红色的 *
 * @function
 * @name Horn.Calendar#setRequired
 * @param {Boolean} required 不传值或者传true表示必选项，传false表示取消必选项
 */
/**
 * 设置字段是否禁用，被设置为禁用的组件，不可以编辑，也不参与表单提交，但是可以通过API的方式修改表单的值
 * @function
 * @name Horn.Calendar#setDisabled
 * @param {Boolean} disabled true表示禁用，false表示正常
 */
/**
 * 设置是否只读，设置为只读方式的组件，不可以编辑，但是可以通过setValue、reset等API修改表单的值，并可以可以参与表单提交
 * @function
 * @name Horn.Calendar#setReadonly
 * @param {Boolean} readonly true表示只读，false表示正常
 */

/**
 * 设置表单的值
 * @function
 * @name Horn.Calendar#setValue
 * @param {String} value 值
 */
/**
 * 获取表单的值
 * @function
 * @name Horn.Calendar#getValue
 * @return 表单的提交值
 */
/**
 * 如果设置了defValue的值，重置成的defValue值，否则重置成value值
 * @function
 * @name Horn.Calendar#reset
 */
/**
 * 清空表单的值，显示值和隐藏值都设置为""
 * @function
 * @name Horn.Calendar#clearValue
 */

/**
 * 触发校验表单的内容，并通过返回值标识校验的结果
 * @function
 * @name Horn.Calendar#isValid
 * @return {Boolean} true表示校验通过，false表示校验失败
 */

Horn.Calendar = Horn.extend(Horn.Field,{
	COMPONENT_CLASS:"Calendar",
    /**
     * @description 默认日期格式
     * @field
     * @name Horn.Calendar.DEFAULT_FORMAT
     * @default yyyy-MM-dd
	 * @ignore
     */
	/**
	 * @ignore
	 */
	init : function(dom){
		Horn.Calendar.superclass.init.apply(this,arguments) ;
		var input = this.el.children("input:text") ;
		var hidden = this.el.children("input:hidden") ;
		this.name = hidden.attr("name") ;
		this.alias = hidden.attr("alias") ;
//        this.onchange = input.attr("onchange");
		
		var config = this.el.attr("config");
		var settings = {};
		if (config != "" && typeof (config) != "undefined") {
			settings = eval('(' + config + ')');
		}
		if(!settings.format){
			settings.format = Horn.Calendar.DEFAULT_FORMAT;
		}
		settings['btnBar'] = false;
		settings['onSetDate'] = function(){
				input.trigger("blur") ;
		};
		settings['real'] = hidden;
		var changeEvent = (input.data("events") || {})["change"];
		if (changeEvent && changeEvent.length > 0) {
			settings['onchange'] = changeEvent[0].handler;
		}
//        if (this.onchange) {
//            var onchangeFn= undefined;
//            var onchangeObj = Horn.Util.getFunObj(this.onchange);
//            settings['onchange'] = function(val){
//                if($.type(onchangeObj.fn) == "function"){
//                    onchangeFn = onchangeObj.fn ;
//                }
//                if(onchangeFn){
//                    onchangeFn.apply(this,val);
//                }
//            };
//        }
    	// 使用第三方插件初始化日历
        this.calobj = input.calendar(settings);
    	
        if(this.params.readonly) {
        	this.setReadonly(true);
        }
        if (this.params.disabled) {
        	this.setDisabled(true);
        }
	},
	getEventTarget : function() {
		return this.el.children("input:text");
	},
    /**
     * @description 设置日期值
     * @function
     * @name Horn.Calendar#setValue
     * @param {String} value 日期值
     * @ignore
     */
	setValue : function(val){
		this.field.val(val);
		this.hidden.val(val);
		//this.field.blur();
	},
    /**
     * @description 如果设置了defValue的值，重置成的defValue值，否则重置成初始值
     * @function
     * @name Horn.Calendar#reset
     * @ignore
     */
    reset : function(clear) {
        this.field.val(clear?"":this.defValue);
        this.hidden.val(clear?"":this.defHiddenValue);
        //this.field.blur();
    },
    /**
     * 触发校验表单的内容，然后通过调用isValid方法获取校验的结果
     * @function
     * @name Horn.Calendar#validate
     */
    validate : function(){
    	var _field = this;
		//if(_field.readonly==true) return;
		if(!_field.calobj.isValid()){
			_field.showError("日期格式不正确");
		}else{
			_field.removeError();
			Horn.Validate.onValid({data:[Horn.Validate,_field]});
		}
    },
    /**
     * 获取由validate方法触发表单校验后的结果，并通过返回值标识校验的结果
     * @function
     * @name Horn.Calendar#isValid
     * @return {Boolean} true表示校验通过，false表示校验失败
     */
	isValid : function(){
    	//BUG #6753 Calendar_setValue()设置了不符合日期格式的数据，也能提交
		return (this.calobj.isValid() && !this.err)?true:false;
	},
    initEvents : function(){
    	var _field = this;
    	_field.checkRegx = [];
    	var checkStr = this.field.attr('checkstr');
    	if(checkStr) {
    		_field.checkRegx = checkStr.split(';');
    	}
    	this.field.blur(function(){
    		setTimeout(function(){
    		//if(_field.readonly==true) return;
    		if(!_field.calobj.isValid()){
    			_field.showError("日期格式不正确");
    		}else{
    			_field.removeError();
    			Horn.Validate.onValid({data:[Horn.Validate,_field]});
    		}
    		},10);
    	});
    },
	setEnable : function(enable){
		if(enable){
			this.field.removeAttr("disabled");
			this.hidden.removeAttr("disabled");
		}else{
			this.field.attr("disabled","disabled");
			this.hidden.attr("disabled","disabled");
		}
	}
}) ;
Horn.apply(Horn.Calendar,{
	DEFAULT_FORMAT : 'yyyy-MM-dd'
});
Horn.Field.regFieldType("div.hc_calendar",Horn.Calendar) ;

/* 
 * 修改记录:
 * 修改日期       修改人员        修改说明
 * -----------------------------------------------------------------------
 * 2014-06-10   zhangsu  STORY #8487[经纪业务事业部/胡志武][TS:201406040187]-JRESPlus-ui-日期组group在disabled的情况下还会校验是否必填
 * 2014-06-30   zhangsu  BUG #7186 calendar_group配上config属性报js错误
 * 2014-07-04   wuxl     BUG #7201#7203#7204#7209#7218#7219#7220#7221#7222#7223
 * ----------------------------------------------------------------------- 
 */
/**
 * @name Horn.CalendarGroup   
 * @class
 * 日期组组件</br> 
 */	
	
/**
 * @lends Horn.CalendarGroup#
 */

/**
 * 组件唯一标识
 * @name Horn.CalendarGroup#<b>id</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 组件的跨列数
 * @name Horn.CalendarGroup#<b>cols</b>
 * @type Int
 * @default ""
 * @example
 * 无
 */
/**
 * 组件的别名，名字相同时，加别名区分
 * @name Horn.CalendarGroup#<b>alias</b>
 * @type String
 * @default ""
 * @example
 * var comp = Horn.getComp("name","alias")
 */
/**
 * 组件的开始日期名称
 * 如果需要获取整个日期组对象也是通过name1属性来获取。
 * 例如：name1=test11  Horn.getComp("test11")获取的是整个日期组对象
 * @name Horn.CalendarGroup#<b>name1</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
 /**
  * 组件的开始日期值
  * @name Horn.CalendarGroup#<b>value1</b>
  * @type String
  * @default ""
  * @example
  */
 /**
  * 如果设置了defValue1的值，重置成的defValue1值，否则重置成初始值
  * @name Horn.CalendarGroup#<b>defValue1</b>
  * @type String
  * @default ""
  * @example
  */
/**
 * 组件的结束日期名称
 * @name Horn.CalendarGroup#<b>name2</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
 /**
  * 组件的结束日期值
  * @name Horn.CalendarGroup#<b>value2</b>
  * @type String
  * @default ""
  * @example
  */
 /**
  * 如果设置了defValue2的值，重置成的defValue2值，否则重置成初始值
  * @name Horn.CalendarGroup#<b>defValue2</b>
  * @type String
  * @default ""
  * @example
  */
/**
 * 组件的显示标签
 * @name Horn.CalendarGroup#<b>label</b>
 * @type String
 * @default ""
 * @example
 */
/**
 * 组件的约束检查选项
 * @name Horn.CalendarGroup#<b>check</b>
 * @type String
 * @default ""
 * @example
 * 具体见Horn.Validate类的已经支持的正规、函数名
 * "check":"required;"
 */

/**
 * 组件的所属组，可以对相同组内的元素进行约束检查
 * @name Horn.CalendarGroup#<b>group</b>
 * @type String
 * @default ""
 * @example
 * 验证指定对象$obj(scope)中组名为groupname的元素有有效性
 * Horn.Validate.validateAreaByGroup($obj,groupname)
 */
 /**
  * 组件的配置选项 如:日期格式（日期格式支持yyyyMMdd、yyyy-MM-dd、yyyy/MM/dd）
  * @name Horn.CalendarGroup#<b>config</b>
  * @type Json 
  * @default {format:'yyyy-MM-dd'}
  * @example
  *"config":{minDate:'2012-12-09', noToday:true, format:'yyyy-MM-dd'}
  */
 /**
  * 组件的是读配置
  * @name Horn.CalendarGroup#<b>readonly</b>
  * @type String
  * @default 非只读
  * @example
  * 无
  */
 /**
  * 组件的禁用配置
  * @name Horn.CalendarGroup#<b>disabled</b>
  * @type String
  * @default 非禁用
  * @example
  * 无
  */
 /**
  * 组件的事件配置
  * @name Horn.CalendarGroup#<b>events</b>
  * @type Array[Json
  * @default ""
  * @example
  * "events":[{"event":"onchange","function":"getValue()"}]
  */
	Horn.CalendarGroup = Horn.extend(Horn.Field,{
		COMPONENT_CLASS:"CalendarGroup",
		cal1 : null,
		cal2 : null,
		hidden1 : null,
		hidden2 : null,
		name1 : null,
		name2 : null,
		calobj1 : null,
		calobj2 : null,
        defValue1 : "",
        defHiddenValue1 : "",
        defValue2 : "",
        defHiddenValue2 : "",
		/**
		 * @ignore
		 */
		init : function(){
			Horn.CalendarGroup.superclass.init.apply(this,arguments);
			this.el.attr("tabIndex",1000);
			var cal1 = $(this.el.find("input:text")[0]) ;
			var cal2 = $(this.el.find("input:text")[1]) ;
			var hidden1 = $(this.el.find("input[type=hidden]")[0]);
			var hidden2 = $(this.el.find("input[type=hidden]")[1]);
			
			this.name1 =  hidden1.attr("name") ;
			this.name2 =  hidden2.attr("name") ;
			this.name = this.name1 ;
			this.alias = hidden1.attr("alias") ;
			var config = this.params["config"] ;
			var settings = {};
			var _this = this ;
            if(hidden1){
                this.defHiddenValue1= (this.params.defValue1 != undefined)?this.params.defValue1:hidden1.val();
            }
            if(hidden2){
                this.defHiddenValue2= (this.params.defValue2 != undefined)?this.params.defValue2:hidden2.val();
            }
            if(cal1){
                this.defValue1=(this.params.defValue1 != undefined)?this.params.defValue1:cal1.val();
            }
            if(cal2){
                this.defValue2=(this.params.defValue2 != undefined)?this.params.defValue2:cal2.val();
            }
            if (config != "" && typeof (config) != "undefined") {
				settings = config;
			}
			if(!settings.format){
				settings.format = Horn.Calendar.DEFAULT_FORMAT;
			}
			var changeEvent = (cal1.data("events") || {})["change"];
			if (changeEvent && changeEvent.length > 0) {
				settings['onchange'] = changeEvent[0].handler;
			}
			this.minDate = this._formatDate(settings["minDate"]);
			this.maxDate = this._formatDate(settings["maxDate"]);
			if(!cal1.attr("readonly")){
				cal1.focus(function(event) {
					var config1 =Horn.apply({},settings);
					var maxDate = _this._formatDate(_this.cal2.val());
					maxDate = !!Date.parse(maxDate) ? maxDate : "";
					if (!_this.compareDate(_this.minDate, maxDate) || !_this.compareDate(maxDate, _this.maxDate)) {
						maxDate = _this.maxDate;
					}
					config1 = Horn.apply(config1,{
						'minDate' : !!Date.parse(_this.minDate) ? _this.minDate.replace(/\//g, "-") : "",
						'maxDate' :  maxDate.replace(/\//g, "-"),
						'real' : hidden1,
						'btnBar' : false,
						'onSetDate' : function(){
							setTimeout(function(){
								cal1.evented = true;
								cal1.blur() ;
							},100);
						}
					});
					_this.calobj1 = cal1.calendar(config1);
					cal1.evented = true;
				});
				cal1.blur(function(){
		    		if(cal1.readonly==true) return;
		    		if(_this.calobj1 && !_this.calobj1.isValid() || _this.calobj1 && !_this.calobj1.isValid()){
		    			_this.showError("日期格式不正确");
		    		} else if (_this.calobj1 && (!_this.compareDate(_this.calobj1.getDate(), _this.maxDate)
		    				|| !_this.compareDate(_this.minDate, _this.calobj1.getDate()))
		    				|| _this.calobj2 && (!_this.compareDate(_this.calobj2.getDate(), _this.maxDate)
				    				|| !_this.compareDate(_this.minDate, _this.calobj2.getDate()))) {
		    			_this.showError("日期不在有效区间");
		    		} else if(_this.calobj1 && _this.calobj1.isValid() && _this.calobj2 && _this.calobj2.isValid() && _this.calobj1.getDate() && _this.calobj2.getDate()){
		    			if(_this.calobj1.getDate() && _this.calobj2.getDate() && _this.calobj1.getDate() > _this.calobj2.getDate()){
			    			_this.showError("开始日期不能大于结束日期");
		    			}
		    		}else{
		    			var rule1 = cal1.attr("check");
		    			if(rule1 && rule1.indexOf(Horn.Validate.REQUIRED) > -1 && (!cal1.val() || !cal2.val())){
			    			_this.showError("当前输入不能为空");
		    			}
		    		}
		    	});
			}
			if(!cal2.attr("readonly")){
				cal2.focus(function(event) {
					var config2 =Horn.apply({},settings);
					var minDate = _this._formatDate(_this.cal1.val());
					minDate = !!Date.parse(minDate) ? minDate : "";
					if (!_this.compareDate(_this.minDate, minDate) || !_this.compareDate(minDate, _this.maxDate)) {
						minDate = _this.minDate;
					}
					config2 = Horn.apply(config2,{
						'maxDate' : !!Date.parse(_this.maxDate) ? _this.maxDate.replace(/\//g, "-") : "",
						'minDate' :   minDate.replace(/\//g, "-"),
						'real' : hidden2,
						'btnBar' : false,
						'onSetDate' : function(){
							setTimeout(function(){
								cal2.evented = true;
								cal2.blur() ;
							},100);
						}
					});
					_this.calobj2 = cal2.calendar(config2);
					cal2.evented = true;
				});
				cal2.blur(function(){
		    		if(cal2.readonly==true) return;
		    		if(_this.calobj2 && !_this.calobj2.isValid() || _this.calobj1 && !_this.calobj1.isValid()){
		    			_this.showError("日期格式不正确");
	
		    		} else if (_this.calobj1 && (!_this.compareDate(_this.calobj1.getDate(), _this.maxDate)
		    				|| !_this.compareDate(_this.minDate, _this.calobj1.getDate()))
		    				|| _this.calobj2 && (!_this.compareDate(_this.calobj2.getDate(), _this.maxDate)
				    				|| !_this.compareDate(_this.minDate, _this.calobj2.getDate()))) {
		    			_this.showError("日期不在有效区间");
		    		} else if(_this.calobj1 && _this.calobj1.isValid() && _this.calobj2 && _this.calobj2.isValid() && _this.calobj1.getDate() && _this.calobj2.getDate()){
		    			if(_this.calobj1.getDate() > _this.calobj2.getDate()){
		    				_this.showError("开始日期不能大于结束日期");
		    			}
		    		} else {
		    			var rule2 = cal2.attr("check");
		    			if(rule2 && rule2.indexOf(Horn.Validate.REQUIRED) > -1  && (!cal2.val() ||!cal1.val())){
		    				_this.showError("当前输入不能为空");
		    			}
		    		}
		    	});
			}
			this.cal1 = cal1;
			this.hidden1 = hidden1;
			this.cal2 = cal2;
			this.hidden2 = hidden2;
			
			if (this.params.disabled) {
	        	this.setEnable(false);
	        }
		},
		getEventTarget : function() {
			return this.el.find("input:text");
		},
		_formatDate : function(d){
			if (d.indexOf("/") == -1 && d.indexOf("-") == -1 && d.length >= 8) {
				return d.substring(0, 4) + "/" + d.substring(4, 6) + "/" + d.substring(6);
			}
//			return d.replace(/\//g, "-");
			return d.replace(/-/g, "/");
		},
		compareDate : function(d1, d2) {
			d1 = this._formatDate(d1);
			d2 = this._formatDate(d2);
			if (!Date.parse(d1) || !Date.parse(d2)) {
				return true;
			}
			return Date.parse(d1) <= Date.parse(d2);
		},
        /**
         * @description 设置日期对的值
         * @function
         * @name Horn.CalendarGroup#setValue
         * @param {json} {name1:value1,name2:value2} 日期值
         */
		setValue : function(obj){
			var _calendarGroup = this;
			this.cal1.val(obj[this.name1]);
			this.hidden1.val(obj[this.name1]);
			this.cal2.val(obj[this.name2]);
			this.hidden2.val(obj[this.name2]);
//			_calendarGroup.cal1.focus();
//			_calendarGroup.cal2.focus();
//			_calendarGroup.el.focus();
		},
		getValue : function(){
			var input = this.get();
			var val = "";
			$.each(input, function(i, o){
				val += "," + $(o).val();
			});
	        return val.indexOf(",") == 0 ? val.substring(1) : val;
		},
        /**
         * @description 返回日期对的名字
         * @function
         * @name Horn.CalendarGroup#mutiName
         * @return {Array} [name1,name2]
         */
		mutiName : function(){
			return [this.name1,this.name2];
		},
		validate : function(){
			var _calendarGroup = this;
			_calendarGroup.cal1.focus();
			_calendarGroup.cal2.focus();
			_calendarGroup.el.focus();
			_calendarGroup.el.blur();
		},
        /**
         * @description 验证日期格式有效性,两个日期输入框均有效才行
         * @function
         * @name Horn.CalendarGroup#isValid
         */
		isValid : function(){
			var valid = true;
			var _calendarGroup = this;
			//如果日期group的disabled为true则不校验 #8487
			if(_calendarGroup.params.disabled && _calendarGroup.params.disabled==true){
				return true;
			}
			if(!this.cal1.evented){
				this.cal1.focus();
			}
			if(!this.cal2.evented){
				this.cal2.focus();
			}
			_calendarGroup.el.focus();
			_calendarGroup.el.blur();
			var rule1 = this.cal1.attr("check");
			if(rule1 && rule1.indexOf(Horn.Validate.REQUIRED) > -1  && !this.cal1.val()){
				_calendarGroup.showError("当前输入不能为空");
				valid = false;
			}
			var rule2 = this.cal2.attr("check");
			if(rule2 && rule2.indexOf(Horn.Validate.REQUIRED) > -1  && !this.cal2.val()){
				_calendarGroup.showError("当前输入不能为空");
				valid = false;
			}
			var date1 = this.calobj1.getDate();
			var date2 = this.calobj2.getDate();
			return valid && this.calobj1.isValid() && this.calobj2.isValid()
				&& this.compareDate(date1, this.maxDate)
				&& this.compareDate(this.minDate, date1)
				&& this.compareDate(date2, this.maxDate)
				&& this.compareDate(this.minDate, date2)
				&& date1 <= date2;
		},
		setEnable : function(enable){
			if(enable){
				this.cal1.removeAttr("disabled");
				this.cal2.removeAttr("disabled");
				this.hidden1.removeAttr("disabled");
				this.hidden2.removeAttr("disabled");
			}else{
				this.cal1.attr("disabled","disabled");
				this.cal2.attr("disabled","disabled");
				this.hidden1.attr("disabled","disabled");
				this.hidden2.attr("disabled","disabled");
			}
		},
        /**
         * @description 如果设置了defValue的值，重置成的defValue值，否则重置成初始值
         * @function
         * @name Horn.CalendarGroup#reset
         */
        reset : function(clear) {
			var _calendarGroup = this;
            this.cal1.val(clear?"":this.defValue1);
            this.hidden1.val(clear?"":this.defHiddenValue1);
            this.cal2.val(clear?"":this.defValue2);
            this.hidden2.val(clear?"":this.defHiddenValue2);
//			_calendarGroup.cal1.focus();
//			_calendarGroup.cal2.focus();
//			_calendarGroup.el.focus();
			
        }
	}) ;
	Horn.Field.regFieldType("div.hc_calendargroup",Horn.CalendarGroup) ;

/*
 * 修改日期                        修改人员        修改说明
 * -----------------------------------------------------------------------
 * 2014-2-11 		张超		增加默认值保存功能
 * 2014-3-3 		张超		filterByLabel增加filter之后设置值（或不设置）的功能。
 * 2014-2-14 		韩寅		修改注释
 * 2014-4-14        周智星      BUG #6552 【combox】(继承)addRule(rule)(原先无校验规则) 错误提示的位置不正确，偏离的位置相当大
 * 2014-4-16        周智星     BUG #6738 combo调用setDisabled（true）后应能通过API方式提交
 * 2014-4-16       	韩寅		BUG #6554 修改注释，描述只读更加准确
 * 2014-4-28        周智星     BUG #6838 combo_设置为只读的任然可以选择更改 设置为只读的任然可以选中后按退格键清除
 * 2014-5-4         周智星     修改combox的readonly属性说明文档
 * -----------------------------------------------------------------------
 */
/**
 * @name Horn.Combox
 * @class
 * 下拉选项组件</br>
 * 替代html的select组件，有更加丰富的交互和功能
 */

/**@lends Horn.Combox# */

/**
 * 仅在单选模式下生效，选项头格式如:{"label":"","value":"请选择 ..."}，其中label可以不配置，但是配置的值一定不能跟combox下拉的有效值重复
 * @name Horn.Combox#<b>headItem</b>
 * @type obj
 * @default 无
 * @example
 * 无
 */
/**
 * 静态显示值 格式："items":[{"text":"葡萄","code":"0"},{"text":"苹果","code":"1"}]
 * @name Horn.Combox#<b>items</b>
 * @type Array
 * @default 无
 * @example
 * 无
 */
/**
 * 数据字典名
 * @name Horn.Combox#<b>dictName</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 是否多选，true表示多选，false表示单选
 * @name Horn.Combox#<b>multiple</b>
 * @type Boolean
 * @default false
 * @example
 * 无
 */
/**
 * 在初始化的默认就把下拉框中的内容全部选中；如果同时设置了selectAll=true和value属性，那么value属性优先生效
 * @name Horn.Combox#<b>selectAll</b>
 * @type Boolean
 * @default false
 * @example
 * 无
 */
/**
 * 多选时的显示分隔符
 * @name Horn.Combox#<b>delimiter</b>
 * @type String
 * @default 
 * @example
 * 无
 */
/**
 * 用于渲染列表中的显示项目使用的item属性，默认为'pLabel'
 * @name Horn.Combox#<b>pKeyField</b>
 * @type String
 * @default "pLabel"
 * @example
 * 无
 * @ignore
 */
/**
 * 用于渲染列表中的显示项目使用的item属性，默认为'label'，非必须，单值不能为空
 * @name Horn.Combox#<b>labelField</b>
 * @type String
 * @default "label"
 * @ignore
 * @example
 * 无
 */
/**
 * 用于渲染列表中的显示项目使用的item属性，默认为'code'，非必须，单值不能为空
 * @name Horn.Combox#<b>codeField</b>
 * @type String
 * @default "code"
 * @example
 * 无
 */
/**
 * 用于渲染列表中显示项目的实际值使用的item属性,默认为'value'，非必须，单值不能为空
 * @name Horn.Combox#<b>valueField</b>
 * @type String
 * @default "value"
 * @ignore
 * @example
 * 无
 */
/**
 * 用于渲染列表中显示项目的实际值使用的item属性,默认为'text'，非必须，单值不能为空
 * @name Horn.Combox#<b>textField</b>
 * @type String
 * @default "text"
 * @example
 * 无
 */
/**
 * 是否在渲染列表项目时显示实际值，默认为true
 * @name Horn.Combox#<b>showLabel</b>
 * @type Boolean
 * @default true
 * @example
 * 无
 */

/**
 * @description 更改引用的数据字典
 * @function
 * @name Horn.Combox#changeDict
 * @param {string} name 字典名
 */
/**
 * @description 仅在单选模式下有效，选中第一个非headItem对应的项
 * @function
 * @name Horn.Combox#selectFirst
 * @returns void
 */
/**
 * @description 根据关联项目过滤下拉列表
 * @function
 * @name Horn.Combox#filterByPLabel
 * @param pLabel 父节点值
 * @returns void
 * @ignore
 */
/**
 * @description 根据参数过滤下拉列表，此方法会自动情况清除上一次过滤效果，效果无法叠加
 * @function
 * @name Horn.Combox#filter
 * @param f String、Array、Function，Function参数为item的key
 * @param flag 默认为false，过滤掉包含在f中，或返回为true的项目，否则过滤掉其他项目
 * @param {Boolean} triggerChange 是否触发值更改事件
 * @returns void
 */
/**
 * @description 清空过滤显示所有的下拉项目
 * @function
 * @name Horn.Combox#clearFliter
 * @returns void
 */
/**
 * @description 隐藏下拉列表所有item
 * @function
 * @name Horn.Combox#clearList
 * @returns void
 */
/**
 * @description 动态增加下拉列表项目
 * @function
 * @name Horn.Combox#addDatas
 * @param data {Json or Array} [{label:'3','value':'测试3'},{label:'4','value':'测试4'}]　
 * @param isClear 是否清空原来的列表项
 * @ignore
 */
/**
 * @description 动态增加下拉列表项目；在isClear=true的情况下，如果设置的items无效，下拉框的内容依然会被清空
 * @function
 * @name Horn.Combox#addItems
 * @param items {Json or Array} [{label:'3','value':'测试3'},{label:'4','value':'测试4'}]　
 * @param isClear 是否清空原来的列表项
 */

/*******************************************************************************/


/**
 * 组件唯一标识
 * @name Horn.Combox#id
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单提交名字
 * @name Horn.Combox#name
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单组件的标签名，值过长会造成label显示不全，但是可以通过鼠标悬浮看到完整值
 * @name Horn.Combox#label
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * @ignore
 * 组件的别名，名字相同时，加别名区分
 * @name Horn.Combox#alias
 * @type String
 * @default ""
 * @ignore
 * @example
 * var comp = Horn.getComp("name","alias")
 */

 /**
  * 表单的初始值，如果没有配置defValue属性，表单重置的时候，将采用value作为重置值
  * @name Horn.Combox#value
  * @type String
  * @default ""
  * @example
  * 无
  */

 /**
  * 组件的重置时的值，如果没有配置此值，将以value属性做为重置值。
  * 如果指定了value值，并且defValue设置为空(defValue:"")，则无法重置为空值，请用form组件的clearValue方法清空form内组件的值或调用组件本身的clearValue方法清空值。
  * @name Horn.Combox#defValue
  * @type String
  * @default 无
  * @example
  * 无
  */

 /**
  * 被设置为只读的组件不能通过键盘输入改变表单的值，可以通过下拉选择改变表单的值，可以获得焦点，是可以参与表单校验（校验失败会阻止表单提交），并且可以参与表单提交；<font color=red>(注！readonly属性仅对多选的情况下有效，单选无效)</font>
  * true表示只读状态，不允许键盘输入，允许通过下拉按钮选择值；false表示正常状态，允许键盘输入，允许通过下拉按钮选择值
  * @name Horn.Combox#readonly
  * @type Boolean
  * @default true
  * @example
  * 无
  */

 /**
  * 组件的禁用状态，被设置禁用状态的组件，无法获得焦点，不参与表单校验（不会阻止表单提交），不会参与表单提交并且其所有校验状态都会消失，不可编辑，但是可以通过API修改表单的值；
  * true表示禁用，false表示正常状态
  * @name Horn.Combox#disabled
  * @type Boolean
  * @default false
  * @example
  * 无
  */

/**
 * 组件的跨列数，取值范围由外容器的screen的cols而定
 * @name Horn.Combox#cols
 * @type int
 * @default 1
 * @example
 * 无
 */

/**
 * 组件的约束检查选项
 * @name Horn.Combox#check
 * @type String
 * @default ""
 * @example
 * 具体见Horn.Validate类的已经支持的正规、函数名
 * "check":"required;"
 */

/**
 * 组件的所属组，可以对相同组内的元素进行约束检查
 * @name Horn.Combox#group
 * @type String
 * @default ""
 * @ignore
 * @example
 * 验证指定对象$obj(scope)中组名为groupname的元素有有效性
 * Horn.Validate.validateAreaByGroup($obj,groupname)
 */

/**
 * 加入一个分组中，可以根据组名进行分组校验，参见validate的validateAreaByGroup(scope, group)方法
 * @function
 * @name Horn.Combox#addGroup
 * @param {String} group 组名
 * @ignore
 */
/**
 * 从一个分组中删除
 * @function
 * @name Horn.Combox#removeGroup
 * @param {String} group 组名
 * @ignore
 */
/**
 * 判断组件上会否在分组中
 * @function
 * @name Horn.Combox#inGroup
 * @param {String} group 组名
 * @ignore
 */

/**
 * 增加校验规则
 * @function
 * @name Horn.Combox#addRule
 * @param {String} rule 校验规则字符串
 */
/**
 * 删除校验规则
 * @function
 * @name Horn.Combox#removeRule
 * @param {String} rule 校验规则字符串
 */

/**
 * 显示表单，如果表单已经显示，此方法无效果，hide方法与之相对应
 * @function
 * @name Horn.Combox#show
 */
/**
 * 隐藏表单，如果表单已经隐藏，此方法无效果，show方法与之对应
 * @function
 * @name Horn.Combox#hide
 */

/**
 * 设置label内容
 * @function
 * @name Horn.Combox#setLabel
 * @param {String} label 标签内容
 * @ignore
 */
/**
 * 获取label内容
 * @function
 * @name Horn.Combox#getLabel
 * @return 标签内容
 * @ignore
 */

/**
 * 设置为必填项，同时增加红色的 *
 * @function
 * @name Horn.Combox#setRequired
 * @param {Boolean} required 不传值或者传true表示必选项，传false表示取消必选项
 */
/**
 * 设置字段是否禁用，被设置为禁用的组件，不可以编辑，也不参与表单提交并且其所有校验状态都会消失，但是可以通过API的方式修改表单的值
 * @function
 * @name Horn.Combox#setDisabled
 * @param {Boolean} disabled true表示禁用，false表示正常
 */
/**
 * 设置是否只读，设置为只读方式的组件，不可以编辑，可以通过下拉选择改变值，可以通过setValue、reset等API修改表单的值，并且可以参与表单提交<font color=red>(注！readonly属性仅对多选的情况下有效，单选无效)</font>
 * @function
 * @name Horn.Combox#setReadonly
 * @param {Boolean} readonly true表示只读，false表示正常
 */

/**
 * 设置表单的值
 * @function
 * @name Horn.Combox#setValue
 * @param {String} value 值
 * @param {Boolean} triggerChange 是否触发值更改事件
 */
/**
 * 获取表单的值
 * @function
 * @name Horn.Combox#getValue
 * @return 表单的提交值
 */
/**
 * 如果设置了defValue的值，重置成的defValue值，否则重置成value值
 * @function
 * @name Horn.Combox#reset
 */
/**
 * 清空表单的值，显示值和隐藏值都设置为""
 * @function
 * @name Horn.Combox#clearValue
 */

/**
 * 获取由validate方法触发表单校验后的结果，并通过返回值标识校验的结果
 * @function
 * @name Horn.Combox#isValid
 * @return {Boolean} true表示校验通过，false表示校验失败
 */
/**
 * 触发校验表单的内容，然后通过调用isValid方法获取校验的结果
 * @function
 * @name Horn.Combox#validate
 */

Horn.Combox = Horn.extend(Horn.Select,{
	COMPONENT_CLASS:"Combox",
	pLabel : "",
	filterFlag : "",
	displayField : null,
	keyAttr : "label",
	pKeyAttr : "pkey",
	valueAttr : "value",
	defaultValue : "",
	defaultText : "",
	showLabel : true,
	/**
	 * @ignore
	 */
	init : function(dom) {
		Horn.Combox.superclass.init.apply(this,arguments) ;
		this.combInit() ;
		//设置可能的多字典切换功能
		var field = this.el.find('input[ref]'),
			keyAttr = this.el.attr('keyfield'),
			pkeyAttr = this.el.attr('pkeyfield'),
			valueAttr = this.el.attr('titlefield')
			;
		if(keyAttr) this.keyAttr = keyAttr;	
		if(pkeyAttr) this.pkeyAttr = pkeyAttr;	
		if(valueAttr) this.valueAttr = valueAttr;


		var dictName = this.params['dictName'];
		if(dictName){
			this.field.attr('ref',dictName.split(',')[0] + (this.multipleline?'_m':'_s') ) ;
		}
		this.displayField = field;
		this.defaultValue = this.params.value || this.hidden.val();
//		this.setValue(this.defaultValue,true);
		
		//BUG #6838 combo_设置为只读的任然可以选择更改 设置为只读的任然可以选中后按退格键清除
		if(this.params.readonly) {
        	this.setReadonly(true);
        }
	},
	/**
	 * @ignore
	 */
	combInit : function(){
		var refname = this.hidden.attr("refname");
		if (refname) {
			this.field.bind("change",Horn.Util.apply(this.onCombChange,this));
		}
	},
	/**
	 * @ignore
	 */
	onCombChange : function(e, val){
		var refname = this.hidden.attr("refname") ;
		var refnames = refname.split(";") ;
		for(var i=0;i<refnames.length;i++){
			var rn = refnames[i] ;
			if (rn) {
				var rns = rn.split(",") ;
				Horn.getComp(rns[0],rns[1]).filterByPLabel(this.hidden.val()) ;
			}
		}
	},
    /**
     * @description 更改引用的数据字典
     * @function
     * @name Horn.Combox#changeDict
     * @param {string} name 字典名
     * @ignore
     */
	changeDict : function(name){
   		this.clearFliter();
		if((this.field.get(0)).getAttribute("multiple")=="true"){
			name+="_m";
		}else{
			name+="_s";
		}
		this.field.attr("ref",name);
		this.listEl = $(
            "div.hc_checkboxdiv[ref_target='" + name + "']");
   		this.multipleline = this.listEl.attr("multiple_line") == "true";
   		this.setValue("");
	},
	/**
     * @description 选中第一项，如果值发生改变，会触发change事件
	 * @function
	 * @name Horn.Combox#selectFirst
	 * @returns void
	 * @ignore
	 */
	selectFirst : function() {
		var lis = this.listEl.children("ul").children("li[key]");
		var key = "";
		var text = "" ;
		for ( var i = 0; i < lis.length; i++) {
			if ($(lis.get(i)).css("display") != "none") {
				key = $(lis.get(i)).attr("key");
				text = jQuery.trim($(lis.get(i)).text());
				break;
			}
		}
		this.setValue({"key":key,"text":text}, true);
	},
	/**
	 * @ignore
	 */
	getPos : function() {
		return {
			left : 0,
			top : 0
		};
	},
	/**
	 * @ignore
	 */
	hideAllList : function() {
		var listEl = this.listEl ;
		$("div.hc_checkboxdiv").each(function(i, o) {
			if (listEl.get(0) != o) {
				$(o).hide();
				$(o).data("show_name", "");
			}
		});
	},
	/**
	 * @ignore
	 */
	showList : function(inputEl, listEl) {
		var hidden = inputEl.prev() ;
		var filter = hidden.data("filter") ;
		if(filter){
			this[filter.name].apply(this,filter.params) ;
		}
		else{
			this.clearFliter(hidden) ;
		}
		Horn.Combox.superclass.showList.apply(this,arguments) ;
	},
	/**
     * @description 根据关联项目过滤下拉列表
     * @function
	 * @name Horn.Combox#filterByPLabel
	 * @param pLabel 父节点值
	 * @returns void
	 * @ignore
	 */
	filterByPLabel : function(pLabel) {
		if(this.pLabel!=pLabel){
			this.reset(true);
			this.pLabel = pLabel ;
			this.hidden.data("filter" ,{
				name : '_filterByPLabel',
				params : arguments 
			}) ;
		}
	},
	/**
	 * @ignore
	 */
	_filterByPLabel : function(pLabel,noSelectfirst) {
		if (!pLabel) {
			return false;
		}
		var ul = this.listEl.children("ul");
		// 先隐藏所有的li
		ul.children("li[key][pKey!='" + pLabel + "']").css("display",
				"none");
		ul.children("li[key][pKey='" + pLabel + "']").css("display",
				"block");
		//若是自己设置的value值，那么在此设置为原始值。
		if(this.defaultValue){
			this.setValue(this.defaultValue);
		}else if(!(noSelectfirst===false)&&(!this.multipleline)){
			this.selectFirst();
		}else{
			this.setValue('');
		}
	},	
	/**
     * @description 根据参数过滤下拉列表，此方法会自动情况清除上一次过滤效果，效果无法叠加
     * @function
	 * @name Horn.Combox#filter
	 * @param f String、Array、Function，Function参数为item的key
	 * @param flag 默认为false，过滤掉包含在f中，或返回为true的项目，否则过滤掉其他项目
	 * @param {Boolean} triggerChange 是否触发值更改事件
	 * @returns void
	 * @ignore
	 */
	filter : function(f, flag,triggerChange) {
		var filter = {
			name : "_filter",
			params : arguments 
		} ;
		var oldFilter = this.hidden.data("filter") ;
		if(filter!=oldFilter){
			this.hidden.data("filter" ,filter) ;
			//BUG #6840 combo_filter以及setValue不会触发onchange事件
			if (triggerChange) {
	            this.field.trigger('change', filter);
	        }
		}
		var val =this.hidden.val();
		var _comb = this;
		if(val){
			//查询是否有这个值的显示li存在
			this._filter(f, flag);
			setTimeout(function(){
				$(val.split(',')).each(function(idx,v){
					if (_comb.listEl.children("ul").children(
							"li[key=" + v + "]").css('display') == "none") {
						_comb.reset(true);
					}
				});
			},200);
		}else{
			//查询是否有这个值的显示li存在
			this._filter(f, flag);
			setTimeout(function(){
				_comb.setValue('');
			},200);
		}
		
	},
	/**
	 * @ignore
	 */
	_filter : function(f, flag) {
		flag = !!flag;
		var d1 = "block", d2 = "none";
		if (flag) {
			d1 = "none";
			d2 = "block";
		}
		// 先隐藏所有的li
		var liList = this.listEl.children("ul").children("li[key]") ;
		liList.css("display", d1);
		var D = ",";
		if ($.type(f) == "string") {
			f += D;
		}
		liList.each(
			function(index, dom) {
				var li = $(dom);
				var key = li.attr("key");
				if ($.type(f) == "function") {
					if (f.call(this, key)) {
						li.css("display", d2);
					}
				} else if ($.type(f) == "array") {
					if (jQuery.inArray(key, f) >= 0) {
						li.css("display", d2);
					}
				} else if ($.type(f) == "string") {
					if (f.indexOf(key + D) > -1) {
						li.css("display", d2);
					}
				}
		});
	},
	/**
     * @description 清空过滤显示所有的下拉项目
     * @function
	 * @name Horn.Combox#clearFliter
	 * @returns void
	 * @ignore
	 */
	clearFliter : function() {
		this.listEl.children("ul").children("li[key]").css("display", "block");
		this.hidden.data('filter',null);
	},
	/**
     * @description 隐藏下拉列表所有item
     * @function
	 * @name Horn.Combox#clearList
	 * @returns void
	 * @ignore
	 */
	clearList : function() {
		this.reset(true);
		this.listEl.children("ul").children("li[key]").remove();
	},
	addItems : function(data, isClear) {
		this.addDatas(data, isClear);
	},
	/**
     * @description 动态增加下拉列表项目
     * @function
	 * @name Horn.Combox#addDatas
     * @param data {Json or Array} [{label:'3','value':'测试3'},{label:'4','value':'测试4'}]　
     * @param isClear 是否清空原来的列表项
     * @ignore
	 */
	addDatas : function(data, isClear) {
		var list = [], listDiv = this.listEl, keyAttr = this.keyAttr, valueAttr = this.valueAttr, showLabel = this.showLabel;
		var hidden = this.hidden ;
		var _this = this ;
		var eventData = {
				inputEl : this.field,
				listEl : listDiv
		};
		if (jQuery.type(data) == "array") {
			list = data;
		} else {
			if (jQuery.isPlainObject(data)) {
				if (jQuery.isEmptyObject(data)) {
					return;
				}
				list.push(data);
			}
		}
		if (isClear === true) {
			this.clearList();
		}
		if (list.length > 0) {
			var ul = listDiv.children("ul");
			var multipleline = (listDiv.attr("multiple_line") == "true");
			$.each(list, function(index, obj) {
				var key = obj[keyAttr], val = obj[valueAttr];
				if (!key) {
					key = obj["code"];
					val = obj["text"];
				}
				if (key) {
					var li = ul
							.children("li[key='"
									+ key
									+ "']");
					if (li.length == 0) {
						var li = $("<li key='"
								+ key
								+ "' title='"
								+ val
								+ "'></li>");
						var label = $("<label></label>");
						label
								.text((showLabel ? key
										+ ":"
										: "")
										+ val);
						if (multipleline) {
							label.prepend('<input type="checkbox" />');
						}
						li.append(label);
						ul.append(li) ;
						if (listDiv.data("show_name") == hidden.attr("name")) {
							li.bind("click.li", eventData, Horn.Util.apply(
									_this.listClick, _this));
						}
					}
				}
			});
		}
	},
    /**
     * @description 显示错误信息
     * @function
     * @name Horn.Combox#showError
     * @ignore
     */
	showError:function(){
		Horn.Combox.superclass.showError.apply(this,arguments) ;
		 var msg = this.msgDiv;
		 //BUG #6552 【combox】(继承)addRule(rule)(原先无校验规则) 错误提示的位置不正确，偏离的位置相当大
	     //msg.css('margin-top','-40px');
	}
}) ;
Horn.Field.regFieldType("div.hc_combox",Horn.Combox);
/**
 * @name Horn.CheckCode
 * @class
 * 验证码<br/>
 * 验证码输入组件从Horn.Field继承
 */
/**@lends Horn.CheckCode*/
	 
/**
 * 唯一标识
 * @name Horn.CheckCode#<b>id</b>
 * @type String
 * @default ""
 * @example
 * 无
 */

/**
 * 名称
 * @name Horn.CheckCode#<b>name</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 显示标签
 * @name Horn.CheckCode#<b>label</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * url
 * @name Horn.CheckCode#<b>url</b>
 * @type String
 * @default "/horn/checkCode/get.htm"
 * @example
 * 无
 */
	Horn.CheckCode = Horn.extend(Horn.Field,{
		COMPONENT_CLASS:"CheckCode",
		img : null,
		src : null,
		first : true,
		init:function(){
			Horn.CheckCode.superclass.init.apply(this,arguments);
			var _checkcode  = this;
			var img = this.img = this.el.find('img');
			img.css('cursor','pointer');
			img.attr('title','点击刷新');
			img.click(function(){
				var src = img.attr('src');
				img.attr('src','');
				if(_checkcode.first){
					_checkcode.src = src;
					_checkcode.first = false;
				}
				img.attr('src',_checkcode.src+"?r="+new Date().getTime());
			});
		},
		isValid : function(){
			return true;
		}
	}); 
	Horn.Field.regFieldType("div.hc_validcode",Horn.CheckCode) ;

/*
 * -----------------------------------------------------------------------
 * 修订纪录
 * 2014-3-11 		韩寅		完善注释为标准的jsdoc
 * -----------------------------------------------------------------------
 */
/**
 * @name Horn.SelectTree
 * @class
 * 树下拉选择组件</br>
 * 带有一个输入框，可以通过下拉树选择
 */
	 
/**@lends Horn.SelectTree# */

/**
 * 组件的唯一标示
 * @name Horn.SelectTree#<b>id</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单提交时的名称
 * @name Horn.SelectTree#<b>name</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单组件跨列数，默认为1
 * @name Horn.SelectTree#<b>cols</b>
 * @type String
 * @default "1"
 * @example
 * 无
 */
/**
 * 表单在首次展现时填充的值
 * @name Horn.SelectTree#<b>value</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单显示的名称
 * @name Horn.SelectTree#<b>label</b>
 * @type Number
 * @default 500
 * @example
 * 无
 */
/**
 * 验证串，比如"required"等
 * @name Horn.SelectTree#<b>check</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 指定绑定的数据词典名称，用于加载数据
 * @name Horn.SelectTree#<b>dictName</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 下拉树是否支持复选功能，可选值"checkbox"、"radio"或""
 * @name Horn.SelectTree#<b>checkbox</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 同级是否能选择多次 可选值"true"、"false"，默认"false"
 * @name Horn.SelectTree#<b>isLevelSelect</b>
 * @type String
 * @default "false"
 * @example
 * 无
 */
/**
 * 根节点的key 默认为"0"表示全部展示，如果不为"0"则表示要展示的单一树
 * @name Horn.SelectTree#<b>root_id</b>
 * @type String
 * @default "0"
 * @example
 * 无
 */
/**
 * 组件请求的数据地址，默认不需要此项，使用框架提供的地址
 * @name Horn.SelectTree#<b>url</b>
 * @type String
 * @default ""
 * @example
 * 无
 */

Horn.SelectTree = Horn.extend(Horn.Field,{
	COMPONENT_CLASS:"SelectTree",
	hidden : null,
	field : null ,
	ref : null,
	listEl : null ,
	/**
	 * @ignore
	 */
	init : function() {
		Horn.SelectTree.superclass.init.apply(this,arguments) ;
		this.field = this.el.children("input[type='text'][ref]");
		this.hidden = this.field.prev();
		this.name = this.hidden.attr("name") ;
		this.ref = this.field.attr("ref");
		this.field.bind({
			"focus" : Horn.Util.apply(this.onFocus,this)
		});
		this.initZTree();
	},
	/**
	 * @ignore
	 */
	initZTree : function() {
		var onchange = this.field.attr("onchange");
		if(onchange){
			//this.field.removeAttr("onchange");
			//var change = Horn.Util.getFunObj(onchange) ;
			//this.field.bind("change",change.params,change.fn) ;
		}
		var current = Horn.getCurrent() ;
		this.listEl = current.find("div.hc_selectbox-tree-div[ref_target='"
		+ this.ref + "']") ;
		if(this.listEl.length == 0){
			var name = this.hidden.attr("name").replace(/\./,"_") ;
			var arrHtml = [] ;
			arrHtml.push("<div class='hc_selectbox-tree-div' ref_target='ztree_" + name + "'>") ;
			arrHtml.push("<div class='hc_selectbox-tree-left'>");
			arrHtml.push("<ul class='ztree' id='ztree_" + name + "'>");
			arrHtml.push("</ul>");
			arrHtml.push("</div>");
			arrHtml.push("<div class='hc_selectbox-tree-right'>");
			arrHtml.push("<ul class='ztree'>");
			arrHtml.push("</ul>");
			arrHtml.push("</div>");
			arrHtml.push("</div>") ;
			var treeDiv = current.find("div.hc_hide_div-tree") ;
			if(treeDiv.length==0){
				treeDiv = $('<div class="hc_hide_div-tree"></div>').appendTo(current) ;
			}
			this.listEl = $(arrHtml.join("")).appendTo(treeDiv) ;
		}
	
		var treeObj = $.fn.zTree.getZTreeObj(this.ref);
		if(treeObj){
			return true ;
		}
		var ztree = this.listEl
				.children("div.hc_selectbox-tree-left")
				.children("ul.ztree");
		var check = this.hidden.attr("checkbox") == "checkbox"
				|| this.hidden.attr("checkbox") == "radio";
		var chkStyle = this.hidden.attr("checkbox") || "checkbox";
		var dictName = this.hidden.attr("dictName");
		var service_name = context_path ;
		var root_id = this.hidden.attr("root_id") || "" ;
		var url = this.field.attr("url") || "/horn/dict/getEntries.htm?format=json" ;
		var setting = {
			treeId : this.ref,
			view : {
				selectedMulti : false,
				showLine : true,
				showIcon : true
			},
			check : {
				enable : check,
				chkStyle : chkStyle,
				autoCheckTrigger : false,
				chkboxType : { "Y": "", "N": "" }
			},
			data : {
				key : {
					name : "name",
					title : "name"
				},
				simpleData : {
					enable : true,
					idKey : "id",
					pIdKey : "pId"
				}
			},
			callback : {
				onCheck : this.onCheck,
				onClick : this.onCheck,
				onAsyncSuccess : function(event, treeid, treeNode, msg) {
				},
				onAsyncError : function(event, treeid, treeNode, xhr,
						textStatus, errorThrown) {
				},
				beforeCheck : this.onBeforeCheck
			},
			async : {
				enable : true,
				dataType : "json",
				type : "get",
				url : getUrl,
				dataFilter : function(treeId, parentNode, responseData) {
					var dicts = responseData["entries"];
					return dicts;
				}
			}
		};
		function getUrl(treeId, treeNode) {
			var l = url.indexOf("?")>-1 ? "&" : "?" ;
			if(treeNode){
				return service_name
				+ url + l + "key="+treeNode.id+"&pageNo=0&dictName="
				+ dictName ;
			}
			return service_name
			+ url + l + "key="+root_id+"&pageNo=0&dictName="
			+ dictName ; 
		}
		var zTreeObj = $.fn.zTree.init(ztree, setting);
		zTreeObj.thisScope = null ;
	},
	/**
	 * @ignore
	 */
	onBeforeCheck : function(treeid, treeNode){
		var treeObj = $.fn.zTree.getZTreeObj(treeid);
		var _this = treeObj.thisScope ;
		return (function(){
			var isLevelSelect = this.hidden.attr("isLevelSelect") == "true";
			var check = this.hidden.attr("checkbox") == "checkbox"
			|| this.hidden.attr("checkbox") == "radio";
			if (check) {
				if (isLevelSelect) {
					if (this.hidden.data("level") != undefined
							&& treeNode["level"] != this.hidden
									.data("level")) {
						return false;
					}
					this.hidden.data("level", treeNode["level"]);
				}
			}
		}).apply(_this,arguments) ;
	},
	/**
	 * @ignore
	 */
	onCheck : function(e, treeId, treeNode) {
		var treeObj = $.fn.zTree.getZTreeObj(treeId);
		var _this = treeObj.thisScope ;
		return (function(){
			var nodes = treeObj.getCheckedNodes();
			var check = this.hidden.attr("checkbox") == "checkbox"
			|| this.hidden.attr("checkbox") == "radio";
			if(nodes.length==0){
				this.hidden.removeData("level") ;
			}
			
			var nodes = new Array();
			if (check) {
				nodes = treeObj.getCheckedNodes();
			} else {
				nodes = treeObj.getSelectedNodes();
			}
			this.showLog.call(this,nodes,treeObj,check);
		}).apply(_this,arguments) ;
		this.field.trigger('blur');
	},
	/**
	 * @ignore
	 */
	showLog : function(nodes,treeObj,check){
		var className = "dark";
		var idArr = [];
		var tIdArrs = [];
		var values = [];
		var labels = [];
		var ztree = this.listEl.children("div.hc_selectbox-tree-left")
		.children("ul.ztree");
		var log = ztree.parent().next("div.hc_selectbox-tree-right")
		.children("ul.ztree");		
		$.each(nodes, function(index, node) {
			var zid = "ztree_node_" + node.tId;
			var value = node.name;
			var label = node.id;
			values.push(value);
			labels.push(label);
			idArr.push(zid);
			tIdArrs.push(node.tId) ;
			log.children("li[zid='" + zid + "']");
			if (log.children("li[zid='" + zid + "']").length == 0) {
				log.append("<li class='" + className + "' zid='" + zid
						+ "'>" + value + "</li>");
			}
		});
		log.children("li").each(function(index, li) {
			var obj = $(li);
			if (jQuery.inArray(obj.attr("zid"), idArr) == -1) {
				obj.remove();
			}
		});
		this.hidden.val(labels.join(","));
		if (check) {
			this.field.val(labels.join(","));
		} else {
			this.field.val(values.join(","));
		}
		this.hidden.attr("tids",tIdArrs.join(",")) ;
		this.field.trigger("change",[this.hidden.val(),this.field.val(),nodes,this.hidden,this.field]) ;
	},
	/**
	 * @ignore
	 */
	clearLog : function(){
		var log = this.listEl.children("div.hc_selectbox-tree-right")
		.children("ul.ztree");
		log.children("li").remove() ;
	},
	/**
	 * @ignore
	 */
	onFocus : function(e) {
		var curObj = $(e.currentTarget);
		var ref_target = curObj.attr('ref');
		var listDiv = $("div.hc_selectbox-tree-div[ref_target='"
				+ ref_target + "']");
		if (listDiv.length > 0) {
			this.showTree(curObj, listDiv);
			var zTree = $.fn.zTree.getZTreeObj(ref_target);
			zTree.thisScope = this ;
			zTree.currentTarget = curObj ;
			var check = this.hidden.attr("checkbox") == "checkbox"
			|| this.hidden.attr("checkbox") == "radio";
			this.clearLog(zTree) ;
			zTree.checkAllNodes(false);
			zTree.selectNode(null, false);
			if(this.hidden.val()){
				tIdArrs = this.hidden.attr("tids") || "" ;
				tIdArrs = tIdArrs.split(",") ;
				var nodes = [] ;
				for(var i=0;i<tIdArrs.length;i++){
					if(tIdArrs[i]){
						var node = zTree.getNodeByTId(tIdArrs[i]);
						nodes.push(node) ;
						if (check) {
							zTree.checkNode(node, true, true, false);
						} else {
							zTree.selectNode(node, false);
						}	
					}
				}
				this.showLog(nodes,zTree,check) ;
			}
		}
	},
	/**
	 * @ignore
	 */
	hideTree : function(inputEl, listEl) {
		if (!listEl.data("show_name")) {
			return;
		}
		listEl.hide();
		listEl.data("show_name", false);
		var ref_target = inputEl.attr('ref');
		var zTree = $.fn.zTree.getZTreeObj(ref_target);
		zTree.thisScope = null ;
		zTree.currentTarget = null ;
	},
	/**
	 * @ignore
	 */
	showTree : function(inputEl, listEl) {
		if (listEl.data("show_name")) {
			return;
		}
		this.hideAllList(listEl);
		// 应用对象
		var data = {
			'inputEl' : inputEl,
			'listEl' : listEl
		};
		var offset = inputEl.offset(), listOuterHeight = inputEl
				.outerHeight();
		// 显示位置
		var listStyle = listEl.get(0).style;
		listStyle.left = (offset.left) + 'px';
		listStyle.top = (offset.top + listOuterHeight) + 'px';
		// listStyle.width = (inputEl.outerWidth() - 2) + 'px';
		// 显示
		listEl.show();
		listEl.data("show_name", true);
		// 当前文本框事件处理
		listEl.bind('click.ztree.list', data, function(e) {
			Horn.Util.stopPropagation(e);
		});
		// 文档事件处理
		$(document).one('click.combo.body', data, Horn.Util.apply(this.bodyClick,this));
	},
	/**
	 * @ignore
	 */
	hideAllList : function(listEl) {
		$("div.hc_selectbox-tree-div").each(function(i, o) {
			if (listEl.get(0) != o) {
				$(o).hide();
				$(o).data("show_name", "");
			}
		});
	},
	/**
	 * @ignore
	 */
	bodyClick : function(e) {
		var inputEl = e.data.inputEl;
		if(e.target==inputEl.get(0)){
			$(document).one('click.combo.body', e.data, Horn.Util.apply(this.bodyClick,this));
		}
		else{
			var listEl = e.data.listEl;
			this.hideTree(inputEl, listEl);	
		}
	},
    /**
     * 设置表单是否可用
     * @name Horn.Window#setEnable
     * @function
     * @param enable true表示启用，false表示禁用
     * @return void
     * @example
     */
	setEnable : function(enable){
		if(enable){
			this.field.removeAttr("disabled");
			this.hidden.removeAttr("disabled");
		}else{
			this.field.attr("disabled","disabled");
			this.hidden.attr("disabled","disabled");
		}
	}
}) ;
Horn.Field.regFieldType("div.hc_select-tree",Horn.SelectTree) ;
/*
 * -----------------------------------------------------------------------
 * 修订纪录
 * 2014-3-11 		韩寅		完善注释为标准的jsdoc
 * -----------------------------------------------------------------------
 */
/**
 * @name Horn.SwitchField
 * @class
 * 可选文本框扩展组件</br>
 * 赋予同一个数据框多种值特性，但是同一时间只能代表一个，功能类似于级联双combo
 */
	 
/**@lends Horn.SwitchField# */

/**
 * 组件的唯一标示
 * @name Horn.SwitchField#<b>id</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单提交时的名称
 * @name Horn.SwitchField#<b>name</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单在首次展现时填充的值
 * @name Horn.SwitchField#<b>value</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单显示的名称
 * @name Horn.SwitchField#<b>label</b>
 * @type Number
 * @default 500
 * @example
 * 无
 */
/**
 * 验证串，比如"required"等
 * @name Horn.SwitchField#<b>check</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 就是label的对应hidden属性名
 * @name Horn.SwitchField#<b>labelName</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 静态显示值 格式：{"label":"0","value":"客户号"}
 * @name Horn.SwitchField#<b>labelitems</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * label选择之后通过此url获取输入框的下拉选项
 * @name Horn.SwitchField#<b>url</b>
 * @type String
 * @default 无
 * @example
 * 无
 */

/**
 * 请求url之前被调用
 * @event
 * @name Horn.SwitchField#beforeSend
 * @example
 */

/**
 * 请求url之后被调用
 * @event
 * @name Horn.SwitchField#complete
 * @example
 */

/**
 * 请求url成功之后被调用
 * @event
 * @name Horn.SwitchField#success
 * @example
 */

/**
 * 请求url出现错误被调用
 * @event
 * @name Horn.SwitchField#error
 * @example
 */

/**
 * label变化的时候被触发
 * @event
 * @name Horn.SwitchField#labelChange
 * @example
 */

Horn.SwitchField = Horn.extend(Horn.Field,{
	COMPONENT_CLASS:"SwitchField",
	LABELLISTSIZE:5,
	li : null ,//对应li标签
	label : null ,//对应普通的labelspan
	div : null ,//输入框div
	field:null, //输入框input
	listEl : null ,//下拉节点div
	exDiv : null ,//扩展验证div
	labellistdiv : null ,
	labelspan : null ,//下拉label对应的span
	labelfield : null ,//下拉label对应的input框
	labellistul : null ,//对应label下拉ul
	labeltext : null ,
	red : null ,
	url : null ,
	events : {} ,
	param : [] ,
	/**
	 * @ignore
	 */
	init : function(dom){
		Horn.SwitchField.superclass.init.apply(this,arguments) ;
		this.initScope(dom) ;
		this.initEvent() ;
	} ,
	/**
	 * @ignore
	 */
	initScope : function(dom){
		var jDom = $(dom) ;
		var field = null ;
		if(jDom.prop("tagName")=="INPUT"){
			field = jDom ;
		}
		else if(jDom.prop("tagName")=="DIV" && jDom.hasClass("hc_switchfield")){
			field = jDom.children("input[type='text']").first() ;
		}
		if(field==null){
			return ;
		}
		this.field = field ;
		this.div = this.field.parent("div.hc_switchfield"); 
		this.label = this.div.prev("span") ;
		this.li = this.el.parent("li") ;
		this.listEl = this.div.children("div.hc_checkboxdiv").first() ;
		this.exDiv = this.div.next("div") ;
		this.labellistdiv = this.li.children("div.hc_switchfieldlabel") ;
		this.labelspan = this.labellistdiv.children("div").first();
		this.labelfield = this.labelspan.find("input[type='hidden']") ;
		this.labellistul = this.labellistdiv.children("ul").first() ;
		
		this.red = this.labelspan.find("b.hc_red").first() ;
		if(this.red.length==0){
			this.labelspan.prepend("<b class='hc_red'></b>") ;
			this.red = this.labelspan.children("b.hc_red").first() ;
		}
		if(this.red.length){
			this.labeltext = this.red.get(0).nextSibling ;
		}
		if(!this.labeltext){
			this.labeltext = this.labelspan.find('span').get(0).firstChild ;
		}
		if(this.labeltext.nodeType!=3){
			this.labelspan.prepend("&nbsp;") ;
			this.labeltext = this.labelspan.find('span').get(0).firstChild ;
		}
		this.url = context_path + this.field.attr("url") ;
		// labelChange\change\beforeSend\complete\dataFilter\error\success\
		var eventNames = ["labelChange","change","beforeSend","complete","dataFilter","error","success"] ;
		for(var i=0;i<eventNames.length;i++){
			var type = eventNames[i] ;
			var attType = this.field.attr(type);
			if(attType){
				this.events[type] = Horn.Util.getFunObj(attType) ;
			}
		}
		this.labellistul.hide();
	} ,
	/**
	 * @ignore
	 */
	initEvent : function(){
		//文本框事件
		this.field.bind(this.getEvent("input"));
		//label下拉事件
		this.labelspan.bind(this.getEvent("labelspan")) ;
		var labelList = this.labelspan.next("ul").children("li") ;
		labelList.bind("click.switchlabel",Horn.Util.apply(this.labelListClick,this)) ;
		var key = this.labelfield.val() ;
		if(this.events["labelChange"]){
			this.field.bind("labelChange", Horn.Util.apply(this.events["labelChange"]["fn"],this));
		}
		this.field.trigger("labelChange", [ key, "" ]);
	} ,
	/**
	 * @ignore
	 */
	labelListClick : function(e){
		var _li = $(e.currentTarget);
		var key = _li.attr("key") ;
		var text = $.trim(_li.text()) ;
		var oldKey = this.labelfield.val() ;
		if(key!=oldKey){
			//修改label显示
			this.labeltext.nodeValue = text ;
			//修改label的title
			this.labelspan.attr("title",text);
			this.labelfield.val(key) ;
			//切换label清空文本框
			this.setValue("",true) ;
			//增加选中样式
			_li.siblings().removeClass("h_cur");
			_li.addClass("h_cur");
			//出发 labelChange 事件
			this.field.trigger("labelChange", [ key, oldKey ]);
			this.labellistul.hide();
		}
	} ,
	/**
	 * @ignore
	 */
	selectFirst : function() {
		var lis = this.listEl.children("ul").first().children("li[key]");
		var key = "";
		for ( var i = 0; i < lis.length; i++) {
			if ($(lis.get(i)).css("display") != "none") {
				key = $(lis.get(i)).attr("key");
				break;
			}
		}
		this.setValue(key, true);
	} ,
    /**
     * @description 设置值
     * @function
     * @name Horn.SwitchField#setValue
     * @param v 值
     * @param triggerChange 是否触发值更改事件
     */
	setValue : function(v, triggerChange) {
		if (v===undefined || v===null) {
			return false;
		}
		var oldValue = this.field.val() ;
		this.field.val(v);
		if (triggerChange && v!=oldValue) {
			this.field.trigger('change', [ v ,oldValue]);
		}
	} ,
	/**
	 * 获取label所选择的值
	 * @function
	 * @name Horn.SwitchField#getLabelValue
	 * @description 获取label所选择的值
	 * @returns String
	 */
	getLabelValue : function(){
		return this.labelfield.val() ;
	} ,
    /**
     * 设置label标签值
     * @function
     * @name Horn.SwitchField#setLabelValue
     * @description 设置label标签值,值必须为已经存在的标签值
     * @returns void
     */
    setLabelValue : function(label){
        var _li=undefined;
        this.labellistul.children("li").each(function(i, li) {
            li = $(li);
            if (li.attr("key")==label) {
               _li = li;
               if(!li.hasClass("h_cur")){
                   li.addClass("h_cur");
               }
            }else{
                 li.removeClass("h_cur");
            }
        });
        var key = label;
        var text = $.trim(_li.text()) ;
        var oldKey = this.labelfield.val() ;
        if(key!=oldKey){
            //修改label显示
            this.labeltext.nodeValue = text ;
            //修改label的title
            this.labelspan.attr("title",text);
            this.labelfield.val(key) ;
            //切换label清空文本框
            this.setValue("",true) ;
            //出发 labelChange 事件
            this.field.trigger("labelChange", [ key, oldKey ]);
        }
    },
	/**
	 * @ignore
	 */
	getEvent : function(type){
		var inputEvent = {
			"focus" : Horn.Util.apply(this.showList,this),
			"blur" : function(e){
			},
			"change" : Horn.Util.apply(function(e,value,oldValue){
				if(!e.currentTarget.value){
					return ;
				}
				var params = [] ;
				params = params.concat(this.param) ;
				params.push({"name":this.field.attr("name"),"value":this.getValue()}) ;
				params.push({"name":this.labelfield.attr("name"),"value":this.getLabelValue()}) ;
				var settings = {
					async : true,     
					data : params,
					timeout : 1000*60,
					context : this,
					dataType : "json",
					type : "POST",
					beforeSend : Horn.Util.apply(this.onBeforeSend,this),
					complete : Horn.Util.apply(this.onComplete,this),
					dataFilter : Horn.Util.apply(this.onDataFilter,this),
					error : Horn.Util.apply(this.onError,this),
					success : Horn.Util.apply(this.onSuccess,this)
				} ;
				$.ajax(this.url,settings) ;
			},this),
			"labelChange" : Horn.Util.apply(function(e, key, oldKey){			
				var list = jQuery.map(this.getCookieList(key),function(n){
					return {"label":n,"value":n} ;
				}) ;
				this.addDatas(list, true) ;
			},this)
		} ;
		if(type=="input") return inputEvent ;
		
		var labelspanEvent = {
			"click" : Horn.Util.apply(function(e){
				this.labellistul.show();
				$(document).one("click",Horn.Util.apply(this.bodyClickForLabel,this));
			},this)
		} ;
		if(type=="labelspan") return labelspanEvent ;
		
	} ,
	/**
	 * @ignore
	 */
	onBeforeSend : function(xhr){
		if(this.events["beforeSend"] && $.type(this.events["beforeSend"]["fn"])=="function"){
			return this.events["beforeSend"]["fn"].apply(this,arguments);	
		}
		return true ;
	} ,
	/**
	 * @ignore
	 */
	onComplete : function(xhr,textStatus){
		if(this.events["complete"] && $.type(this.events["complete"]["fn"])=="function"){
			this.events["complete"]["fn"].apply(this,arguments);	
		}
	} ,
	/**
	 * @ignore
	 */
	onDataFilter : function(data, type){
		if(this.events["dataFilter"] && $.type(this.events["dataFilter"]["fn"])=="function"){
			return this.events["dataFilter"]["fn"].apply(this,arguments);	
		}
		return data ;
	} ,
	/**
	 * @ignore
	 */
	onError : function(xhr, textStatus, errorThrown){
		if(this.events["error"] && $.type(this.events["error"]["fn"])=="function"){
			this.events["error"]["fn"].apply(this,arguments);	
		}
	} , 
	/**
	 * @ignore
	 */
	onSuccess : function(data, textStatus, jqXHR){
		var type = this.labelfield.val() ;
		this.addCookieList(type,this.getValue()) ;
		this.field.trigger("labelChange", [ type, "" ]);
		if(this.events["success"] && $.type(this.events["success"]["fn"])=="function"){
			this.events["success"]["fn"].apply(this,arguments);	
		}
	} , 
	/**
	 * @ignore
	 */
	bodyClick : function(e) {
		if(e.target==this.field.get(0)){
			$(document).one("click",Horn.Util.apply(this.bodyClick,this));
		}
		else{
			this.hideList();	
		}
	} ,
	/**
	 * @ignore
	 */
	bodyClickForLabel : function(e) {
		if(e.target==this.labelspan.get(0) || $(e.target).parent().get(0)  == this.labelspan.get(0)){
			$(document).one("click",Horn.Util.apply(this.bodyClickForLabel,this));
		}
		else{
			this.labellistul.hide();
		}
	} ,
	/**
	 * @ignore
	 */
	listClick : function(e) {
		var _li = $(e.currentTarget);
		var field = this.field ;
		var oldVal = field.val();
		field.val($.trim(_li.text()));
		_li.addClass("h_cur");
		_li.siblings().removeClass("h_cur");
		if (oldVal != field.val()) {
			field.trigger("change", [ field.val(), oldVal ]);
		}
	} ,
	/**
	 * @ignore
	 */
	hideList : function() {
		if (!this.listEl.css("display")=="none") {
			return;
		}
		this.listEl.css("display","none");
		var listLi = this.listEl.children("ul").first().children("li[key]") ;
		listLi.unbind('click.li');
	} ,
	/**
	 * @ignore
	 */
	showList : function() {
		if(this.listEl.css("display")=="block"){
			return ;
		}
		var listLi = this.listEl.children("ul").first().children("li[key]") ;
		var offset = this.field.offset(), listOuterHeight = this.field.outerHeight();
		// 显示位置
		this.listEl.css("left",offset.left + "px") ;
		this.listEl.css("top",(offset.top + listOuterHeight) + "px") ;
		this.listEl.css("width",(this.field.outerWidth() - 2) + "px") ;
		// 显示
		this.listEl.css("display","block");
		// 文档事件处理
		$(document).one("click",Horn.Util.apply(this.bodyClick,this));
		// 列表事件绑定
		listLi.bind('click.li', Horn.Util.apply(this.listClick,this));
		listLi.removeClass("h_cur");
		// 列表初始化选择的值。
		var val = this.field.val();
		this.listEl.children("ul").children("li[key='" + val + "']").addClass("h_cur");
	} ,
	/**
	 * @ignore
	 */
	reset : function() {
		this.setValue("");
	} ,
	/**
	 * @ignore
	 */
	clearList : function() {
		//this.listEl.children("ul").children("li[key]").css("display", "none");
		this.listEl.children("ul").children("li[key]").remove() ;
	} ,
	/**
	 * @ignore
	 */
	addDatas : function(data, isClear) {// data : label;value
		var list = [];
		if (jQuery.type(data) == "array") {
			list = data;
		} else if (jQuery.isPlainObject(data)) {
			if (jQuery.isEmptyObject(data)) {
				return;
			}
			list.push(data);
		}
		if (isClear) {
			this.clearList();
		}
		if (list.length > 0) {
			var ul = this.listEl.children("ul").first();
			$.each(list.reverse(), function(index, obj) {
				if (obj.label) {
					var li = ul.children("li[key='" + obj.label + "']");
					if (li.length == 0) {
						var liHtml = "<li key='" + obj.label + "' title='"
								+ obj.value + "'><label>"
								+ obj.value + "</label></li>";
						ul.prepend(jQuery(liHtml));
					}
					else{
						li.css("display","block") ;
					}
				}
			});
		}
	} ,
	/**
	 * @ignore
	 */
	getLabelFlag : function(v){
		return "sf_" + v ;
	},
	/**
	 * @ignore
	 */
	getCookieList : function(type){
		return [] ;
	} ,
	/**
	 * @ignore
	 */
	addCookieList : function(type,v){
	} ,
	/**
	 * @ignore
	 */
	setCookie : function(name,value){
	} ,
	/**
	 * @ignore
	 */
	getCookie : function(name){
	} ,
	/**
	 * @ignore
	 */
	delCookie : function(name){
	}
}) ;
Horn.Field.regFieldType("div.hc_switchfield",Horn.SwitchField) ;

/*
 * -----------------------------------------------------------------------
 * 修订纪录
 * 2014-3-11 		韩寅		完善注释为标准的jsdoc
 * -----------------------------------------------------------------------
 */
/**
 * @name Horn.ToogleField
 * @class
 * 开关组件</br>
 * 组件具有两种状态，根据值为0还是1，显示不同的状态
 */
	 
/**@lends Horn.ToogleField# */

/**
 * 组件的唯一标示
 * @name Horn.ToogleField#<b>id</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单提交时的名称
 * @name Horn.ToogleField#<b>name</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 别名
 * @name Horn.ToogleField#<b>alias</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 组件的初始值
 * @name Horn.ToogleField#<b>value</b>
 * @type Number
 * @default 0
 * @example
 * 无
 */
/**
 * 表单显示的名称
 * @name Horn.ToogleField#<b>label</b>
 * @type Number
 * @default 500
 * @example
 * 无
 */

/**
 * 是否禁用，可选值true，false<br/>
 * 如果设置为true，组件不能被设置值，值也不会参与提交
 * @name Horn.ToogleField#<b>disabled</b>
 * @type Boolean
 * @default false
 * @example
 * 无
 */
/**
 * 是否只读，可选值true，false<br/>
 * 如果设置为true，组件不能被设置值
 * @name Horn.ToogleField#<b>readonly</b>
 * @type Boolean
 * @default false
 * @example
 * 无
 */

/**
 * 值改变事件
 * @event
 * @name Horn.ToogleField#onchange
 * @example
 * "events":[{"event":"onchange":"function":"valueChange"}]
 * function valueChange(value){
 *   //todo
 * }
 */
	Horn.ToogleField = Horn.extend(Horn.Field,{
		COMPONENT_CLASS:"ToogleField",
		btn : null,
		hidden : null,
		isOn : false, 
		val : 0,
		init:function(){
			Horn.ToogleField.superclass.init.apply(this,arguments);
			this.btn = this.el.find('button');
			this.hidden = this.el.find('input:hidden');
			this.field = this.hidden;
			this.val = this.hidden.val();
			var _tooglefield = this;
			this.btn.click(function(){
				_tooglefield.toogle();
				return false;
			});
			this.name = this.hidden.attr('name') || Horn.id();
			this.alias = this.hidden.attr('alias') || '';
//			if(this.params.events){
//				for(var ind =0;ind< this.params.events.length;ind++){
//					var efn=Horn.Util.getFunObj(this.params.events[ind]["function"]||'');
//					this.on(this.params.events[ind]["event"],efn.fn);
//				}
//			}
		},
		getEventTarget : function() {
			return this.el.find('button');
		},
	    /**
	     * 设置值<br/>
	     * 设置的值只能是1或者0，其他值不会被设置，如果设置的值与原值相同不会触发change事件
	     * @function
	     * @name Horn.ToogleField#setValue
	     * @param {Number} value 值(1或者0)
	     * 
	     */
	    setValue : function(value) {
	    	if(0 != value && 1 != value){
	    		return;
	    	}
	    	if(this.val == value){
	    		return;
	    	}
	    	
	    	this.toogle();
	    },
	    /**
	     * 切换状态<br/>
	     * 切换状态后，值也会改变，如果组件本身是readonly或者disabled时，无法切换
	     * @function
	     * @name Horn.ToogleField#toogle
	     */
		toogle : function(){
			if("readonly" == this.field.attr("readonly")){
	    		return;
	    	}
			if("disabled" == this.field.attr("disabled")){
	    		return;
	    	}
			if(this.val == 0){
				this.btn.removeClass('hc_switch-close');
				this.btn.addClass('hc_switch-open');	
				this.val = 1;
			}else{
				this.btn.removeClass('hc_switch-open');
				this.btn.addClass('hc_switch-close');	
				this.val = 0;
			}
			this.hidden.val(this.val);
//			this.fire('onChange',this.val);
			this.getEventTarget().trigger("change", this.val);
		},
		setEnable : function(enable){
			if(typeof enable != 'boolean'){
				return;
			}
			if(enable){
				this.btn.removeClass('hc_switch-disabled');
				this.field.removeAttr("disabled");
				this.hidden.removeAttr("disabled");
			}else{
				this.btn.addClass('hc_switch-disabled');
				this.field.attr("disabled","disabled");
				this.hidden.attr("disabled","disabled");
			}
		}
	});
	Horn.Field.regFieldType("div.hc_switch",Horn.ToogleField) ;

/*
 * 修改记录
 * =====================================================================
 * 2014-3-14 xie	修正注释
 * =====================================================================
 */
/**
 * @name Horn.FormGrid
 * @class
 * form和grid组合容器组件<br/>
 * 可以实现同时提交多笔数据,支持view模式
 */
/**
 * @lends Horn.FormGrid#
 */

/**
 * FormGrid的唯一标识。
 * @name Horn.FormGrid#<b>id</b>
 * @type String
 * @default ""
 * @example
 * 无
 */

/**
 * FormGrid的名称。
 * @name Horn.FormGrid#<b>name</b>
 * @type String
 * @default ""
 * @example
 * 无
 */

/**
 * FormGrid的标题。
 * @name Horn.FormGrid#<b>title</b>
 * @type String
 * @default ""
 * @example
 * 无
 */

/**
 * 与grid的items配置一致
 * @property cols
 * @name Horn.FormGrid#<b>cols</b>
 * @type Array
 * @default 
 * @example
 * "cols": [{"key":"user.name","name":"姓名"},{"key":"user.age","name":"年龄"}]
 */
	
 
Horn.FormGrid = Horn.extend(Horn.Base,{
	COMPONENT_CLASS:"FormGrid",
	/**
	 * @ignore
	 */
	init : function(dom) {
		Horn.FormGrid.superclass.init.apply(this,arguments) ;
		var _this = this ;
		var title = this.el ;
		var confirm = title.children("a.h_btn-confirm") ;
		var add = confirm.next("a.h_btn-add") ;
		confirm.bind({
			click : function() {
				var c_panels = title.nextAll("ul.h_panel");
				var c_panel = null ;
				for(var i=0;i<c_panels.size();i++){
					var item = $(c_panels.get(i));
					if(item.css("display")=="block" || item.css("display")==""){
						c_panel = item ;
						break ;
					}
				}

				if(c_panel && Horn.Validate.isFormValidate(c_panel)){
					if(!_this.fire('beforechange',c_panel)){
						return false;
					}
					_this.rest_panel.call(_this,title);
					if(!_this.fire('afterchange',panel)){
						return false;
					}
				}
			}
		}) ;
		add.bind({
			click : function() {
				var panel = _this.firstPanel(title);
				if(!_this.fire('beforechange',panel)){
					return false;
				}
				_this.add_panel.call(_this,title);
				if(!_this.fire('afterchange',panel)){
					return false;
				}
			}
		});
		//获取原生的行
		var trs = title.nextAll('.h_formtable').find('tbody').children('tr');

		//解析每行的信息
		trs.each(function(i,item){
			var panel = _this.firstPanel(title);
			var clonePanel = panel.clone(false,true) ;
			clonePanel.attr("index",panel.parent().children("ul.h_panel").size()-1) ;
			//处理formgrid中复制panel时导致的name重复。
			Horn.Field.findFieldsIn(clonePanel).each(function(iii,iiitem){
				var field = $(iiitem);
				if(this.params){
					field.attr('nonamebyparams',true);
					field.name = this.params.name;
				}
			});
			clonePanel.find('input,textarea').each(function(ii,iitem){
				var name = $(iitem).attr('name');
				if(name){
					var nname = name.indexOf('\.')!=-1? name.replace('\.','['+i+']\.') : name+'['+i+']';
					$(iitem).attr('name',nname);
					$(iitem).val($(item).find('span[ref="'+nname+'"]').text().trim());
				}
			});
			panel.after($(clonePanel)) ;
			clonePanel.css("display","none") ;
			Horn.getUIReady()(clonePanel,true) ;
			_this.rest_panel($(title));
			_this.cls_panel(panel);
		});
		_this.rest_panel(title);
		
	},
	/**
	 * @ignore
	 */
	rest_panel : function(obj) {
		var _this = this ;
		var num = -1;
		var c_grid = $(obj).nextAll("div.h_formtable").first().children(
				"table").first();
		c_grid.children("tbody").children("tr").remove();
		var c_panel = this.firstPanel(obj);
		while (c_panel.hasClass("h_panel")) {
			if (num == -1) {
				c_panel.css("display","block") ;
			} else {
				c_panel.css("display","none") ;
				_this.update_name(c_panel, num);
			}
			if (c_panel.css("display") == "none") {
				c_grid.children("tbody").prepend("<tr></tr>").children(
						"tr").first().bind({
					click : function() {
						_this.show_panel.call(_this,obj, $(this));
					}
				});
				c_grid.find("th").each(
						function() {
							if ($(this).attr("ref") == "del") {
								$("<td><a>删除</a></td>").appendTo(
										c_grid.children("tbody")
												.children("tr").first());
							} else {
								var ref = $(this).attr("ref") ;
								var name = ref ;
								if(ref.indexOf(".")>-1){
									name = ref.replace(".",
									"[" + num + "].");
								}
								else{
									name = ref + "[" + num + "]" ;
								}
								var c_input = $("[name='" + name + "']",c_panel);
								if (c_input.attr("type") == "hidden") {
									c_input = c_input.next();
								}
								var inpField = Horn.Field.findInputComp(c_input);
								var value = inpField?inpField.getValue(true): c_input.val();
								$("<td><span ref='"+name+"'>" + value + "</span></td>").appendTo(
										c_grid.children("tbody")
												.children("tr").first());
							}
						});
			}
			num = num + 1;
			c_panel = c_panel.next();
		}
		$(c_grid).children("tbody").children("tr").each(
				function() {
					var c_tr = $(this);
					$(this).children("td").last().children("a").bind(
							{
								click : function() {
									_this.del_panel.call(_this,obj, $(c_tr).nextAll("tr").size());
								}
							});
				});
		$(obj).children("a.h_btn-confirm").hide().next("a.h_btn-add")
				.show();
	},
	/**
	 * @ignore
	 */
	update_name : function(obj, num) {
		$(obj).find("input,textarea").each(function() {
			if ($(this).attr("name")) {
				var name = $(this).attr("name");
				if (name.indexOf("[") < 0) {
					if(name.indexOf(".")>-1){
						name = name.replace(".", "[" + num + "].");
					}
					else{
						name = name + "[" + num + "]";
					}
				} else {
					name = name.substr(0, (name.indexOf("[") + 1))
							+ num + name.substr(name.indexOf("]"));
				}
				$(this).attr("name", name);
			}
		});
	},
	/**
	 * @ignore
	 */
	add_panel : function(obj) {
		var panel = this.firstPanel(obj);
		if(Horn.Validate.isFormValidate(panel)){
			var clonePanel = panel.clone(false,true) ;
			clonePanel.attr("index",panel.parent().children("ul.h_panel").size()-1) ;
			panel.after($(clonePanel)) ;
			clonePanel.css("display","none") ;
			Horn.getUIReady()(clonePanel,true) ;
			this.rest_panel($(obj));
			this.cls_panel(panel);
		}
	},
	firstPanel : function(obj){
		return $(obj).next("ul.h_panel").first() ;
	},
	/**
	 * @ignore
	 */
	cls_panel : function(obj) {
		Horn.Field.findFieldCompsIn(obj).each(function(idx,field){
			field.removeError();
		});
	},
	/**
	 * @ignore
	 */
	del_panel : function(obj, num) {
		var c_num = 0;
		var c_panel = this.firstPanel(obj).next("ul");
		while ($(c_panel).hasClass("h_panel")) {
			if (c_num == num) {
				$(c_panel).remove();
			}
			c_panel = $(c_panel).next();
			c_num = c_num + 1;
		}
		this.rest_panel(obj);
	},
	/**
	 * @ignore
	 */
	show_panel : function(obj, tr) {
		var fPanel = this.firstPanel(obj) ;
		$(tr).parent("tbody").children("tr")
				.removeClass("hc_formtable-cur");
		var num = $(tr).addClass("hc_formtable-cur").nextAll("tr").size();
		fPanel.hide();
		var c_num = 0;
		var c_panel = fPanel.next("ul");
		while ($(c_panel).hasClass("h_panel")) {
			if (c_num == num) {
				$(c_panel).show();
			} else {
				$(c_panel).hide();
			}
			c_panel = $(c_panel).next();
			c_num = c_num + 1;
		}
		$(obj).children("a.h_btn-confirm").show().next("a.h_btn-add")
				.hide();
	},
	/**
	 * 获取formgrid的size
	 */
	size : function(){
		this.el.next('table').children('tbody').children('tr').length;
	}
}) ;
Horn.regUI("div.h_formgridtitle",Horn.FormGrid) ;
/**
 * 版本：
 * 系统名称: JRESPLUS
 * 模块名称: JRESPLUS-UI
 * 文件名称: Grid.js
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：Grid组件对应的代码
 * 修改记录:
 * 修改日期       修改人员        修改说明
 * -----------------------------------------------------------------------
 * 2014-01-21     zhangsu   新增rowSelect属性，使grid支持点击行选中该行
 * 2014-01-21     zhangsu   Grid已选中的行高亮显示(样式h_table-over中颜色修改)
 * 2014-01-22     zhangsu   Grid支持单击事件
 * 2014-01-22     zhangsu   Grid支持双击事件
 * 2014-01-22     zhangsu   Grid列支持hidden属性
 * 2014-01-24     zhangsu   Grid列需要支持常规类型的格式化配置（日期、金额）
 * 2014-02-08     zhangsu   修改this.rowSelect设置后不生效的问题
 * 2014-03-11     zhangsu   当table的布局为fixed时候，需要为th设置默认宽度
 * 2014-03-12     zhangsu   STORY #7776 grid的titleButtons中的按纽需求有禁用、启用功能
 * 2014-04-11     周智星    BUG #6609 【grid】selectModel设置为single 造成页面报js错误并且单选变复选
 * 2014-04-11     周智星    BUG #6610 【grid】"selectModel":"multi"之后会造成复选框变成input输入框，并且应该设置的muti是拼写错误
 * 2014-04-11     周智星    BUG #6612 【grid】rowSelect属性设置true还是表现为false，必须要设置为"true"才行，和文档中描述不一致 （把文档修改为String类型）
 * 2014-04-11     周智星    BUG #6605 【grid】numbercolumn，rowselect，selectmodel的默认值与文档中不符合 （修改文档的默认值）
 * 2014-04-11     周智星    BUG #6613 【grid】多选模式下，先调用selectAll，然后调用unSelectAll之后，需要点击两下才能完成对行的选中
 * 2014-04-11     zhangsu   BUG #6599 【grid】多选模式下，只能通过点击行来选中无法通过前面的checkbox来选中
 * 2014-04-16     zhangsu   修改titlebuttons注释，添加save/query/confirm/refresh/open样式
 * 2014-04-18     zhangsu   BUG #6760 query_table手动全选后调用方法取消全选，列头上的勾还在
 * 2014-04-22     zhangsu   BUG #6797 QueryTable_加载静态数据后静态数据字典的key和value是反的
 * 2014-04-22     zhangsu   列中包含“buttons”操作列属性，“renderer”渲染属性时，该列无tip提示，其他未配置上述属性的列正常显示tip,按单元格中内容显示。
 * 2014-04-28     hanyin   BUG #6894 grid:titleButtons中按钮的属性event不设置时会报js错误
 * 2014-05-05     周智星    BUG #6943 grid：复选，去掉某行的勾，但是列头的全选勾不会去除
 * ----------------------------------------------------------------------- 
 */

/**
 * @lends Horn.Horn.Grid#
 */

/**
 * @description Grid的封装
 * @name Horn.Grid
 * @class
 * 数据列表组件，数据的装载在后台完成
 * @extends Horn.Base
 * @example
 *	<pre>\	#grid({"name":"flowTable","title":"有数据的grid"
    	    ,"numbercolumn":"true","selectModel":"muti"
    		,"items":[{"name":"initDate","text":"发生日期","renderer":"domrender"},
    			{"name":"branchNo", "text":"分支名称（静态字典）","items":[{"label":"杭州总部","value":"8888"},{"label":"b","value":"b1"},{"label":"c","value":"c1"}]},
    			{"name":"branchNo", "dictName":"Branch", "text":"分支名称（动态字典）"},
    			{"name":"scanType", "dictName":"ScanType", "text":"扫描类别"},
    			{"name":"clientId","text":"客户编号"},
    			{"name":"clientName","text":"客户名称"},
    			{"name":"branchNo", "text":"操作","showwhenover":"true","buttons":[{"label":"设置默认","event":"edit"},{"label":"设置默认","event":"edit"}]},
    			{"name":"taskStatus","text":"任务状态"}
    			]
    		,"data":$data
    	})
 *	</pre>
 */

/**
 * @description Grid的唯一标识。
 * @property id
 * @name Horn.Grid#<b>id</b>
 * @type String
 * @default ""
 * @example
 * 无
 */

/**
 * @description Grid的名称。
 * @property name
 * @name Horn.Grid#<b>name</b>
 * @type String
 * @default ""
 * @example
 * 无
 */

/**
 * @description Grid的数据。
 * @property data
 * @name Horn.Grid#<b>data</b>
 * @type Json
 * @default null
 * @example
 * 示例：
 * [{"branchNo":8888,"initDate":"20130101"},
 *   {"branchNo":8888,"initDate":"20130101"},
 *   {"branchNo":8888,"initDate":"20130101"},
 *   {"branchNo":8888,"initDate":"20130101"},
 *   {"branchNo":8888,"initDate":"20130101"},
 *   {"branchNo":8888,"initDate":"20130101"},
 *   {"branchNo":8888,"initDate":"20130101"}]
 */

/**
 * @description Grid列表条目。
 * @property items
 * @name Horn.Grid#<b>items</b>
 * @type Array
 * @default null
 * @example
 * items中的单个列表条目属性：
 *                name        {String}   列数据索引名 即dataIndex
 *                text        {String}   列头名称
 *                align       {String}   列内容文本位置设置，默认分为三种方位：居左：left ，居中：center ，居右：right
 *                headerAlign {String}   列头文本位置设置，默认分为三种方位：居左：left ，居中：center ，居右：right
 *                hidden      {Boolean}  列是否隐藏
 *                width       {String}   列宽度
 *                dataType    {String}   列格式化的类型，目前只支持日期和金额两种类型，日期：dataType="DATE",金额dataType="AMOUNT"
 *                format      {String}   列格式化时的格式 ，需要传入月/日/年的日期才能被格式化
 *                renderer    {String}   列渲染函数
 *                buttons     {Array}    操作列，设置此属性后，属性值会被渲染成多个链接
 *                dictName    {String}   字典条目名称
 *
 * 示例：
 * "items" : [{"name":"initDate","text":"发生日期","align":"left","headerAlign":"right","dataType":"DATE","format":"yyyy-MM-dd","width":"150"},
 *			        {"name":"branchNo", "text":"分支名称（静态字典）","items":[{"label":"杭州总部","value":"8888"},{"label":"b","value":"b1"},{"label":"c","value":"c1"}]},
 *			        {"name":"branchNo", "dictName":"Branch", "text":"分支名称（动态字典）"},
 *			        {"name":"scanType", "dictName":"ScanType", "text":"扫描类别","hidden":true},
 *			        {"name":"scanType2","text":"扫描类别","renderer":"domrender","hidden":false,"width":"350"},
 *			        {"name":"clientId","text":"客户编号","dataType":"AMOUNT","format":"0,000.0"},
 *			        {"name":"clientName","text":"客户名称"},
 *			        {"name":"branchNo", "text":"操作1","buttons":[{"label":"设置默认","event":"edit"}]},
 *			        {"name":"branchNo", "text":"操作2","buttons":[{"label":"noting","event":"edit"}]}
 *			]
 */

/**
 * @description Grid标题栏上的按钮组,当按钮的"event"属性不设置或者设置的方法在当前上下文中不存在时，按钮将被隐藏
 * 默认提供添加、修改、删除、确认、查询、打开、保存、刷新的样式,cls属性分别对应："add","edit","del","confirm","query","open","save","refresh"
 * @property titleButtons
 * @name Horn.Grid#<b>titleButtons</b>
 * @type Array
 * @default null
 * @example
 * 单个按钮属性：
 *	       label   {String}  按钮文本
 *	       cls     {String}  按钮css样式
 *	       event   {String}  按钮点击事件
 *	       disabled {Boolean} 是否禁用/启用按钮
 * 示例：
 * "titleButtons" : [{"label":"添加","cls":"add","event":"add()"}]
 */

/**
 * @description Grid上的事件属性
 * 控件支持的事件列表如下：<br>
 * rowclick  行单击事件    事件参数：rowdata  当前被点击的一行数据<br>
 * rowdblclick  行双击事件 事件参数：rowdata  当前被点击的一行数据<br>
 * 注意：双击事件会触发单击事件，所以在使用双击事件时应注意与单击事件的关系<br>
 * @property events
 * @name Horn.Grid#<b>events</b>
 * @type Json
 * @default null
 * @example
 * 		   "events" :[
 *	         {"event" : "rowclick" , "function" : "testgridrowclick"},
 *	         {"event" : "rowdblclick", "function" : "testgridrowdbclick"}
 *		   ]
 */

/**
 * @description Grid是否配置序号列，默认值为false，启用序号列,设置为true时才显示序列号
 * @property numbercolumn
 * @name Horn.Grid#<b>numbercolumn</b>
 * @type Boolean
 * @default false
 * @example
 * 无
 */

/**
 * @description Grid启用单选/多选选择框 ，默认值为single,(注意，多选框 muti的拼音错了，做了兼容处理，输入multi也可以) ,单选框值为:single
 * 当不配置selectModel或selectModel为""属性时,不显示选择列
 * @property selectModel
 * @name Horn.Grid#<b>selectModel</b>
 * @type String
 * @default 
 * @example
 * 无
 */

/**
 * @description Grid是否启用点击行选中行操作,默认值为false，不启用,设置为true时点击行选中才生效
 * @property rowSelect
 * @name Horn.Grid#<b>rowSelect</b>
 * @type Boolean
 * @default false
 * @example
 * 无
 */

/**
 * @description Grid列内容超出列宽时是否隐藏并加"...",默认值为false，不隐藏根据内容自适应,设置为true时才隐藏
 * @property textOverHidden
 * @name Horn.Grid#<b>textOverHidden</b>
 * @type Boolean
 * @default false
 * @example
 * 无
 */

/**
 * @description 单击行时触发<br/>
 * 注意：双击事件会触发单击事件，所以在使用双击事件时应注意与单击事件的关系
 * @event
 * @name Horn.Grid#<b>rowclick</b>
 * @param data  类型：[Object] 被点击的一行数据。
 * @example
 *
 */

/**
 * @description 双击行时触发<br/>
 * 注意：双击事件会触发单击事件，所以在使用双击事件时应注意与单击事件的关系
 * @event
 * @name Horn.Grid#<b>rowdblclick</b>
 * @param data  类型：[Object] 被点击的一行数据。
 * @example
 *
 */
Horn.Grid = Horn.extend(Horn.Base,{
	COMPONENT_CLASS:"Grid",
	titleEl : null , 
	data : null,
	curData : null,
	curTr : null,
	rowSelect : false,
	keyAttr : "label",
    valueAttr : "value",
	/**
	 * @ignore
	 */
    init : function(dom) {
        Horn.Grid.superclass.init.apply(this,arguments) ;
        this.ths = this.el.find("th");
        var _this = this;
        var data = this.params["data"]||{};
        this.data = data;
        
        //this.mutiSelect = this.params['selectModel']=='muti';
        //BUG #6610 【grid】"selectModel":"multi"之后会造成复选框变成input输入框，并且应该设置的muti是拼写错误
        if(this.params['selectModel']=='muti' || this.params['selectModel']=='multi'){
        	this.mutiSelect = true;
        }
        this.curTr = this.el.find('tr.hc_formtable-cur');
        var datas = this.el.children('table').children('tbody').children('tr');
        
        this.curData = this.data[datas.index(this.curTr) - 1];
        //Grid点击行选中该行的配置支持
        this.rowSelect = Boolean(this.params["rowSelect"]);
        //Grid是否配置列内容超出列宽时是否隐藏并加"..."
        this.textOverHidden = this.params["textOverHidden"]?this.params["textOverHidden"]:false;
       	//关于字典项目的翻译功能。
		this.ths.each(function(index,th){
			var	hidden = th.attributes["hidden"];
			th=$(th);
			var dictName = th.attr("dictName"),
				itemscolNo = th.attr('colno'),
				staticDict;
			var width = th.attr("width");   //设置th列宽度
			var tempStaticDict,buttons;
			if(itemscolNo){
				tempStaticDict = _this.params.items[itemscolNo -1].items;
				buttons = _this.params.items[itemscolNo -1].buttons;
			}
			
			if(hidden!=null && hidden!=undefined && hidden.value == "true"){
				th.hide(); 
			}
			if(dictName){
				staticDict = {};
				//先把dict解析出来，避免重复查找dom
				var lis = $('.hc_checkboxdiv[ref_target='+dictName+'_s]').find("li");
				lis.each(function(idx,li){
					li = $(li);
					var label = li.attr('title');  //title显示值
					var key = li.attr('key');      //key 
					staticDict[key] = label;
				});
			}else if(tempStaticDict){
				staticDict = {};
				$(tempStaticDict).each(function(idx,item){
					
					staticDict[item[_this.keyAttr]] = item[_this.valueAttr];  //bug 6797
				});
			}else if(width){
				th.width(width);
			}
			th.data('staticDict',staticDict);
			th.data('buttons',buttons);
		});
		this.el.find('.h_querytable_select_all').change(function(){
			if(this.checked){
				_this.selectAll();
			}else{
				_this.unSelectAll();
			}
		});
		this.titleEl = this.el.find('div.h_formgridtitle');
		var titleButtons = this.params["titleButtons"];
		this.titleEl.find('a').each(function(idx){
			var button = $(this);
			var ev = button.attr('onclick');
			var _disabled = titleButtons[idx]["disabled"];  //STORY #7776
			if(!ev || !Horn.Util.getFunObj(ev).fn){
				button.hide();
			}
			if(_disabled){
				button.addClass("h_btn-disabled");
				button.removeAttr("onclick");
				button.click(function (event) {
                    event.preventDefault();   // 阻止弹出
                });
			}
		});
		
		this.selecteds = {};   
		this.dictTrans();
		this.initEvents();     //初始化事件
		if(this.textOverHidden){
			this.resetTHWidth();
		}
		this.hiddenColumns();  //初始化隐藏列
		
		   
    },
    customEvents : "rowclick,rowdblclick",
    getEventTarget : function() {
    	return this.el;
    },
    /**
     * 初始化事件
     * @ignore
     */
    initEvents : function(){
    	var _table = this.el.children('table');
    	var _tbody = _table.children('tbody');
    	var _this = this;
        if(this.rowSelect == true){
        	_tbody.children('tr').each(function(i,tr){
    		    var rowidx = i;
    		    var _tr = $(tr),
    		    checkbox = _this.mutiSelect?_tr.find("input:checkbox.h_querytable_select"):_tr.find("input:radio.h_querytable_select")//BUG #6574
    		;
    		_tr.bind('click',function(e) {    //BUG #6599
    			if($.isEmptyObject(_this.selecteds)){
    				_this.selectRow(rowidx, _tr);
    			}else{
    				if(_this.lastSelect&&_this.lastSelect.rowidx != rowidx){
    					 if(!_this.selecteds.hasOwnProperty(rowidx)){
        				    _this.selectRow(rowidx, _tr);
    					 }else{
    						 _this.unSelectRow(rowidx, _tr);
    					 }	 
        			}else{
        				_this.unSelectRow(rowidx, _tr);
        			}
    			}
    		 });
    		
    		/*
    		    _tr.toggle(function(){
    	 	    	_this.selectRow(rowidx,_tr);
    		    },function(){
    		    	_this.unSelectRow(rowidx, _tr);
    		    });
    		    */
            });
        }
    
        // 表格单击,双击事件
        var rowClickObj =undefined;
        var rowDBLClickObj =undefined;
        var rowClickFn=undefined;
        var rowDBLClickFn=undefined;
        var data = this.data;
//        this.rowclick = this.el.attr("rowclick");
//        this.rowdblclick = this.el.attr("rowdblclick");
        $.each(this.params.events || [], function(i, o){
        	_this[o.event.toLowerCase()] = o["function"];
        });
        if (this.rowclick) {
            rowClickObj = Horn.Util.getFunObj(this.rowclick);
            if($.type(rowClickObj.fn) == "function"){
                rowClickFn = rowClickObj.fn ;
            }
        }
        if(this.rowdblclick){
            rowDBLClickObj = Horn.Util.getFunObj(this.rowdblclick);
            if($.type(rowDBLClickObj.fn) == "function"){
                rowDBLClickFn = rowDBLClickObj.fn ;
            }
        }
        if (rowClickFn || rowDBLClickFn) {
            var trs = _tbody.children("tr");
            for ( var i = 0; i < data.length; i++) {
                var tr = $(trs.get(i));
                if(rowClickFn){
                    var params = rowClickObj.params.slice(0);
                    params.push(data[i], data);
                    tr.bind('click',params, function(e) {
                        var p = e.data ;
                        return rowClickObj.fn.apply(this,p);
                    });
                }
                if(rowDBLClickFn){
                    var params = rowDBLClickObj.params.slice(0);
                    params.push(data[i], data);
                    tr.bind('dblclick', params,function(e) {
                        var p = e.data ;
                        return rowDBLClickObj.fn.apply(this,p);
                    });
                }
            }
        }
    },
    /**
     * @description 设置标题
     * @function
     * @name Horn.Grid#<b>setTitle</b>
     * @param {String} title
     */
    setTitle : function(title){
    	this.titleEl.children('span').text(title);
    },
    /**
     * @ignore
     * @description 当某行被引用时会触发此事件。
     * @event
     * @name Horn.Grid#<b>onRowSelect</b>
     * @param {DOMDocument} tr 当前选择的行
     * @param {int} rowidx 行号
     * @param {object} vals 行数据
     */
    onRowSelect:function(){},
    /**
     * 所有被选中值
     * @ignore
     * @type {Array}
     */
    selecteds:null,
    /**
     * @description 选择所有行。
     * @function
     * @name Horn.Grid#<b>selectAll</b>
     */
    selectAll:function(){
    	var _this = this;
    	this.el.find('input:checkbox.h_querytable_select').each(function(idx,checkbox){
    		checkbox.checked = true;
    		if(_this.rowSelect==false){  //6599
    			$(checkbox).trigger('change');
    		}else{
    			_this.selectRow(idx);
    		}
    	});
    	this.el.find('.h_querytable_select_all').attr("checked", true);
    },
    /**
     * @description 清除所有选择行。
     * @function
     * @name Horn.Grid#<b>unSelectAll</b>
     */
    unSelectAll:function(){
    	var _this = this;
    	this.el.find('input:checkbox.h_querytable_select').each(function(idx,checkbox){
    		checkbox.checked = false;
    		if(_this.rowSelect==false){  //6599
    			$(checkbox).trigger('change');
    		}else{
    			_this.unSelectRow(idx);
    		}
    	});
    	this.el.find('.h_querytable_select_all').attr("checked", false);
    	//BUG #6613 【grid】多选模式下，先调用selectAll，然后调用unSelectAll之后，需要点击两下才能完成对行的选中
    	//this.el.find('input:checkbox.h_querytable_select').attr("checked", false);
    	//this.el.find('input:checkbox.h_querytable_select').parent().parent().removeClass("h_table-over");
    	//this.initEvents();     //初始化事件
    },
    /**
     * @description 单选时最后选择的项目
     * @field
     * @name Horn.Grid#lastSelect
     * @default null
     * @ignore
     */
     lastSelect:null,
    /**
     * @description 是否多选
     * @field
     * @name Horn.Grid#mutiSelect
     * @default false
     * @ignore
     */
    mutiSelect:false,
    /**
     * @description 选择某行
     * @function
     * @name Horn.Grid#selectRow
     * @param {int} rowidx
     * @param {JQuery} tr
     * @ignore
     */
    selectRow:function(rowidx,_tr){
    	var _table = this;
    	var tr = _tr;
    	if(!tr){
    		tr = $(this.el.find('tr').has('td').get(rowidx));
    	}
    	var vals = {};
    	var displays = {};
		var ths = this.ths;
		var tds = tr.find('td');
		ths.each(function(thidx,_th){
			var td = tds.get(thidx),
				th = $(_th);
			if(th.attr('name')){
				vals[th.attr('name')] = th.attr('dictName') ? $(td).attr('key') :$(td).text();
				displays[th.attr('name')] = $(td).text();
			}
		});
		_table.onRowSelect.call(tr,tr,rowidx,vals);
		this.selecteds[rowidx] = {val:vals,displays:displays};
		if(!_table.mutiSelect) {
			var last = _table.lastSelect;
			if(last&& last.rowidx != rowidx ){
				//BUG #6609 【grid】selectModel设置为single 造成页面报js错误并且单选变复选
		    	if(this.mutiSelect){//多选
		    		last.tr.find("input:checkbox").get(0).checked = false;
		    	}else{//单选
		    		last.tr.find("input:radio").get(0).checked = false; 
		    	}
				_table.unSelectRow(last.rowidx,last.tr);
			}
			
		}
		_table.lastSelect = {
				rowidx:rowidx,
				tr:tr
			};
		
		//BUG #6609 【grid】selectModel设置为single 造成页面报js错误并且单选变复选
    	if(this.mutiSelect){//多选
    		tr.find("input:checkbox").get(0).checked = true;   //选中checkbox
    	}else{//单选
    		tr.find("input:radio").get(0).checked = true;   //选中radio
    	}
		tr.addClass("h_table-over");//选中行的样式
    },
    /**
     * @description 取消某行的选择
     * TODO 这里尚有些不成熟的地方，需要取消选择项的勾。
     * @function
     * @name Horn.Grid#unSelectRow
     * @param {DOMDocument} rowidx
     * @param {DOMDocument} tr
     * @ignore
     */
    unSelectRow:function(rowidx,_tr){
    	var tr = _tr;
    	if(!tr){
    		tr = $(this.el.find('tr').has('td').get(rowidx));    //BUG #6720
    	}
    	
    	this.selecteds[rowidx] =null;
    	delete this.selecteds[rowidx];
    	tr.removeClass("h_table-over");//取消选中行的样式
    	//BUG #6609 【grid】selectModel设置为single 造成页面报js错误并且单选变复选
    	if(this.mutiSelect){//多选
    		tr.find("input:checkbox").get(0).checked = false;   //取消选中checkbox
    		//BUG #6943 grid：复选，去掉某行的勾，但是列头的全选勾不会去除
    		this.el.find('.h_querytable_select_all').attr("checked", false);
    	}else{//单选
    		tr.find("input:radio").get(0).checked = false;   //取消选中radio
    	}
    },
    /**
     * @description 获取所有的选择项
     * @function
     * @name Horn.Grid#<b>getSelecteds</b>
     * @param {mix} format(可选值有true,1,或者不传参数)<br/>
     *         true    ：返回整行完整数  如：[{"branchNo":"001","Date":"20140320"}{"branchNo":"001","Date":"20140320"}]<br/>
     *         1       : 返回列数据的字段值，如果是字典列,返回字典的value值<br/>
     *         无参数  : 返回列数据的字段值 如果是字典列,返回label值
     * @return {Array} 返回选中的行数据
     */
    getSelecteds:function(format){
    	var selecteds = [];
    	for(var key in this.selecteds){
    		var valObj = this.selecteds[key];
    		if(valObj){
    			var tmpv = valObj.val;
    			if(format === true){
    				tmpv = this.data[key];
    			}else if(format == 1){
    				tmpv = valObj.displays;
    			}
    			selecteds.push(tmpv);
    		}
    	}
    	return selecteds;
    },
     /**
     * @description 设置当前行为传入的行
     * @function
     * @return {void}
     * @name Horn.Grid#changeCurrent
     * @param {DOMDocument} tr 传入的行
     * @ignore
     */
    changeCurrent:function(tr){
    	if(!tr instanceof $){
    		tr = this.el.children('tbody').children('tr')[tr];
    	}
    	if(!this.curtr){
    		this.curtr = this.el.find('tr.hc_formtable-cur');
    	}
    	var rowidx = this.el.children('table').children('tbody').children('tr').index(this.curtr);
    	this.curtr.removeClass('hc_formtable-cur');
    	tr.addClass('hc_formtable-cur');
    	this.curtr = tr;
    	this.curData = this.data[rowidx-1];
    },
     /**
     * @description 获取当前行的数据
     * @function
     * @name Horn.Grid#getCurrentData
     * @return {object}
     * @ignore
     */
    getCurrentData:function(){
    	return this.curData;
    },
    /**
     * 隐藏列
     * @ignore
     */
    hiddenColumns : function(){
    	var trs = this.el.children('table').children('tbody').children('tr');
    	var ths = this.ths;
    	
    	ths.each(function(thidx,thdom){
    		var th = $(thdom);
    		//隐藏列
    		var hidden = thdom.attributes["hidden"];
    		
    		if(hidden!=null && hidden!=undefined && hidden.value =="true"){
    			th.hide(); 
    			//trs each
    	    	trs.each(function(tridx,trdom){
    	    		var tr = $(trdom);
    	    		var tds = tr.find('td');
    	    		for(var tdidx = 0 ; tdidx<tds.length ; tdidx++){
    	    			var td = $(tds[tdidx]);
    	    			if(thidx == tdidx){
    	    				td.hide();
    	    				break;
    	    			}
    	    		}
    	    	});
    		}
    	});
    	
    },
    /**
     * @param dataType   格式化类型(DATE,AMOUNT)
     * @param format     格式
     * @param td         td对象
     * 表格列格式化
     * 列需要支持常规类型的格式化配置（日期、金额）
     * @private
     * @ignore
     */
    formatColumn : function(dataType,format,val){
    	if(dataType == "DATE"){ //日期格式化
    		 if(format == null || format == undefined || format.length == 0)
    			 format = "Y-m-d";
    		 var tempval = new Date(Date.parse(val));
             var a = tempval.format(format);
			 var patt = new RegExp("NaN");
			 if(patt.test(a))
			     return val;
			 else
			     return a;
    	}else if(dataType == "AMOUNT"){  //金额格式化
    		if(format == null || format == undefined || format.length == 0)
   			   format = "0,000.00";
    		return Horn.Util.Format.number(val,format);
    		
    	}
    },
    /**
     * 当table的布局为fixed时候，需要为th设置默认宽度
     * @ignore
     */
    resetTHWidth : function(){
    	var ths = this.ths;
    	var size = ths.size();
    	var _table = this.el.children('table');
    	var width = _table.width();
    	var temp = []; 
    	ths.each(function(idx,thdom){
    		var th  = $(thdom);
    		if(th.hasClass('h_numbercolumn')||th.hasClass('h_querytable_checkboxcolumn')){   //去掉数字、check列
    			th.addClass("h_table_th_extend");
    		}else if(thdom.attributes["hidden"]){   //去掉隐藏列
    			var hidden = thdom.attributes["hidden"];   
        		if(hidden!=null && hidden!=undefined && hidden.value =="true"){	
        			size--;
        		}
    		}else if(th.attr("width")){//去掉已设置width属性的列
    			size--;
    		}else{
    			temp.push(th);
    		}     
    		return true;
    	});
    	var percent = 100/size;
    	for(var i = 0; i<temp.length;i++){
    		temp[i].css("width", percent.toFixed(2)+"%");
    	}
    	i;
    },
    /**
     * 翻译字典 
     * @ignore
     */
    dictTrans:function(){
    	var _table = this,
    		ths = this.ths,
    		trs = this.el.find("tr");
    	
    	trs.each(function(idx,trdom){
    		var tr = $(trdom),
    		checkbox = _table.mutiSelect?tr.find("input:checkbox"):tr.find("input:radio")//BUG #6574
    		;
    		if(checkbox.hasClass('h_querytable_select')) { 
    			if(_table.rowSelect == false){           //BUG #6599
	    			checkbox.change(function(){
		    			if(this.checked){
		    				_table.selectRow(idx-1,tr);
		    			}else{
		    				_table.unSelectRow(idx-1,tr);
		    			}
		    		});
    			}
    			if(checkbox.attr('checked')){
    				setTimeout(function(){
    					_table.selectRow(idx,tr);
    				},3);
    			}
    		}
    		tr.find('td').each(function(tdidx,tddom){
    			var td = $(tddom);
    			var th = $(ths.get(tdidx));
	    		var dictName = th.attr("dictname"),
	    			mutidict = th.attr("multiple"),
	    			staticDict = th.data('staticDict'),
	    			renderer = th.attr('renderer'),
	    			buttons = th.data('buttons'),
	    			showwhenover = th.attr('showwhenover'),
	    			dataType = th.attr('dataType'),
	    			format = th.attr('format')
	    			;
	    		
	    		if( staticDict ){
	    			td.attr('key',td.text());
	    			var text = td.text()||'';
	    			if(mutidict){
    					var textArr = [];
    					$(text.trim().split(',')).each(function(i,item){
    						textArr.push(staticDict[item] || item);
    					});
    					td.text(textArr.join(','));
    					td.attr("title",textArr.join(','));
    				}else{
    					td.text( staticDict[td.text().trim()] || td.text());
    					td.attr("title",staticDict[td.text().trim()] || td.text());
    				}
	    		}else if( dictName ){
	    			td.attr('key',td.text());
	    			var text = td.text();
	    			var dict = Horn.getDict(dictName);
	    			if(dict){
	    				if(mutidict){
	    					var textArr = [];
	    					$(text.split(',')).each(function(i,item){
	    						textArr.push(dict[td.text()]||td.text());
	    					});
	    					td.text(textArr.join(','));
	    					td.attr("title",textArr.join(','));
	    				}else{
	    					td.text(dict[td.text()]||td.text());
	    					td.attr("title",staticDict[td.text().trim()] || td.text());
	    				}
	    			}else{
	    				var li = $('.hc_checkboxdiv[ref_target=' + dictName + '_s]' ).find("li[key="+td.text()+"]");
	    				td.text(li.attr('title')||td.text());
	    			}
	    			
	    			
	    		}else if(buttons){
	    			td.attr("title","");
	    			var btns = buttons;
	    			var span = $("<span></span>");
	    			$(btns).each(function(idxx,btn){
	    				var fn = Horn.Util.getFunObj(btn.event);
	    				//如果没有这个function，则不装入这个button
	    				if(!fn.fn) return;
	    				var a = $("<a href='javascript:void(0)'>"+btn.label+"</a>"),
	    					text = td.text();
	    				a.click(function(){
	    					fn.fn.call(a,{
	    	    				val : text,
	    	    				rowdata : _table.data[idx-1],
	    	    				alldata : _table.data,
	    	    				table : _table,
	    	    				rowidx : idx,
	    	    				tdidx : tdidx,
	    	    				tr : tr,
	    	    				td : td
	    	    			});
	    				});
	    				span.append(a);
	    				if(idxx!=(btns.length-1)){
	    					span.append(' | ');
	    				}
	    			});
	    			if(showwhenover){ 
	    				span.addClass('h_link-default');
	    			}
	    			td.html('');
	    			td.append(span);
	    		}else if(dataType){
	    			var val = td.text();
	    			var newVal = _table.formatColumn(dataType,format,val);
	    			td.text(newVal);
	    			td.attr("title",newVal);
	    		}
	    		if(renderer){
	    			td.attr('key',td.text());
	    			td.attr("title","");
	    			var fn = Horn.Util.getFunObj(renderer),
	    				text = td.text();
    				//如果没有这个function，则不装入这个button
    				if(!fn.fn) return;
	    			var dom = fn.fn.call($(this),{
	    				val : text,
	    				rowdata : _table.data[idx-1],
	    				alldata : _table.data,
	    				table : _table,
	    				rowidx : idx,
	    				tdidx : tdidx,
	    				tr : tr,
	    				td : td
	    			});
	    			if( dom instanceof $ ){
	    				td.html("");
	    				td.append(dom);
	    			}else{
	    				td.html(dom);
	    			}
	    		}
    		});
    	});
    },
    /**
     * @param val 被添加的一行数据
     * 向表格中添加一行数据
     * @ignore
     */
    addRowData : function(val){
    	
    }
}) ;
Horn.regUI("div.h_formtable",Horn.Grid) ;

/*
 * -----------------------------------------------------------------------
 * 修订日期                          修改人                    修改原因
 * 2014-3-11 		谢晶晶		修正注释文档
 * 2014-4-9         周智星                BUG #6653 [tab_panel]tab的title超出title固有宽度，title会被截断，不能显示全部title，也不能调整title宽度，建议优化
 * 2014-4-10        周智星                BUG #6454 [tab_panel:标签页面板]-隐藏一个tab
 * 2014-4-15        周智星                BUG #6731 tabpanel的width与maxTabCn属性未添加宏，只能通过addtab方法起效，建议添加宏，使属性能能用
 * 2014-4-17        周智星                BUG #6765 tab_panel设置的maxTabCn与实际能添加的个数不一致
 * 2014-4-18        周智星                BUG #6774 【tab_panel】调用10次addTab方法，传入相同的name会造成第11次提示“最多只能添加10个标签”并且无法添加新的标签页
 * 2014-4-22        周智星                BUG #6775 【tab_panel】在某种场景下第二个标签页会显示第一个标签页的title
 * 2014-4-22        周智星                BUG #6777 【tab_panel】tab页签在内部出现校验不通过的情况下会造成新增的下一个页签出现校验不通过的提示
 * 2014-4-29        周智星                BUG #6898 [tab_panel]tab的个数超出tabpanel宽度后新打开的标签页不在可视范围
 * 2014-4-30        周智星               BUG #6923 tab_panel在IE7下新增tab后，点击tab会来回跳动
 * 2014-5-4         周智星               修改不是动态新增tab情况下的提示问题（如果不是动态新增标签的，就判断标签页是否大于默认值）
 * 2014-5-4         周智星               新增了是否是动态新增标签相关内容，如果是动态新增的，就不再循环绑定标签的click事件
 * 2014-5-05        周智星                BUG #6940 tabPanel:当tab页数较多、激活不在可视范围内的tab时无法激
 * 2014-06-09       zhangsu     STORY #8440 [研发中心/内部需求][jresplus][ui]-UI中的所有控件，若存在提示信息需要展现，提示方式要统一 
 * -----------------------------------------------------------------------
 */
/**
 * @name Horn.TabPanel
 * @class  Horn.TabPanel
 * 多标签页组件</br>
 * 适用于分组或分类信息的容器，将内容按照分组或分类方式放到不同的标签页区域中，当前可视的仅有一个，其他的页签内容可以通过点击对应的页签激活展示
 */
/** @lends Horn.TabPanel# */
	 
	 
/**
 * 组件的唯一标示<br/>
 * 此属性支持面板组件(<b>tab_panel</b>,<b>tab_panel_content</b>)
 * @name Horn.TabPanel#<b>id</b>
 * @type String
 * @default 
 * @example
 * 无
 */
/**
 * 组件的名称(不能为空，不能重复)<br/>
 * 此属性支持面板组件(<b>tab_panel</b>,<b>tab_panel_content</b>)
 * @name Horn.TabPanel#<b>name</b>
 * @type String
 * @default 
 * @example
 * 无
 */
	 
/**
 * 页签的标题(可选项)<br/>
 * 此属性支持面板组件(<b>tab_panel_content</b>)
 * @name Horn.TabPanel#<b>title</b>
 * @type String
 * @default 
 * @example
 * 无
 */

/**
 * 页签的页面地址(必填项,注意！url仅支持velocity的页面（.htm）,不支持外部地址(如：htttp://www.baidu.com))<br/>
 * 此属性支持面板组件(<b>tab_panel_content</b>)
 * @name Horn.TabPanel#<b>url</b>
 * @type String
 * @default 
 * @example
 * 无
 */	
 /**
 * 页签内容使用延迟加载lazy用于配置延迟加载的url<br/>
 * url只能是系统内的视图请求
 * 此属性支持面板组件(<b>tab_panel_content</b>)
 * @name Horn.TabPanel#<b>lazy</b>
 * @type String
 * @default 
 * @example
 * #@tab_panel_content({"title":"延迟加载的标签","name":"tab1","lazy":"$!{contextPath}/demo/tabpanel/lazy.htm"})
 * #end
 * 或者
 * #tab_panel_content_start({"title":"延迟加载的标签","name":"tab1","lazy":"$!{contextPath}/demo/tabpanel/lazy.htm"})
 * #tab_panel_content_end()
 */

 /**
 * 页签标题宽度(可选项，宽度仅支持像素，如："width":"100"),如果设置了宽度，就获取其值，否则默认<br/>
 * <font color=red>注意点说明：(宏(@tab_panel)和API(addTab(...))都配置width的情况下,优先获取API的值)</font><br>
 * 此属性支持面板组件(<b>tab_panel_content</b>)
 * @name Horn.TabPanel#<b>width</b>
 * @type String
 * @default 
 * @example
 *  #@screen()
 *    #@panel({})
 *   	#textfield({"label":"请输入tab的名称:","name":"tabName"})
 *		#textfield({"label":"请输入tab的标题:","name":"tabTitle"})
 *   #end
 *   #button_panel_ex({"buttons":[{"label":"新增tab页","name":"btnSetTitle","event":"addTab()"}]})
 *   #@tab_panel({"name":"tp","width":"150"}) ##优先获取API配置的width
 *   #end
 *	#end
 *	#jscode()
 *		function addTab(){
 *			Horn.getComp("tp").addTab({"name":tabName,"title":Horn.getComp("tabTitle").getValue(),"width":"150","url":"$!{contextPath}.get('/test/textfield/status_change.htm')"});
 *		}
 *	#end
 */

 /**
 * 最大页签个数(可选项，如："maxTabCn":5),如果设置了宽度，就获取其值，否则默认最多10个标签<br/>
 * <font color=red>注意点说明：(宏(@tab_panel)和API(addTab(...))都配置maxTabCn的情况下,优先获取API的值)</font><br>
 * 此属性支持面板组件(<b>tab_panel_content</b>)
 * @name Horn.TabPanel#<b>maxTabCn</b>
 * @type int
 * @default 
 * @example
 * #@screen()
 *   #@panel({})
 *   	#textfield({"label":"请输入tab的名称:","name":"tabName"})
 *		#textfield({"label":"请输入tab的标题:","name":"tabTitle"})
 *   #end
 *   #button_panel_ex({"buttons":[{"label":"新增tab页","name":"btnSetTitle","event":"addTab()"}]})
 *   #@tab_panel({"name":"tp","maxTabCn":5}) ##优先获取API配置的maxTabCn的值
 *   #end
 *#end
 *#jscode()
 *	function addTab(){
 *		Horn.getComp("tp").addTab({"name":tabName,"title":Horn.getComp("tabTitle").getValue(),"maxTabCn":5,"url":"$!{contextPath}.get('/test/textfield/status_change.htm')"});
 *	}
 *#end
 * 
 */
var tabCount = 0;//标签计算器
var disableCount = 0;//禁用标签计数器
var apiwidth = "";//api自定义的宽度
var defMaxTabCn = "";//动态新增标签的默认最大值为空
var moveLastFlag = false;//是否移动到最后一个
Horn.TabPanel = Horn.extend(Horn.Base,{
	COMPONENT_CLASS:"TabPanel",
	scrollStep : 100,
	maxLength : 9999,
	ul : null ,
	tabUl : null,
	tabUlDiv : null,
	liwidth : null,
	maxTabCn : 10,
	rigthFlag : true,
	/**
	 * @ignore
	 */
	init : function(dom) {
		Horn.TabPanel.superclass.init.apply(this,arguments) ;
		var _this = this ;
		var tab = this.el ; 
		_this.liwidth = tab.attr("liWidth");
		_this.maxTabCn = tab.attr("maxTabCn")!=""?tab.attr("maxTabCn"):_this.maxTabCn;
		var tabCn = 0;
		this.tabUl = tab.children("div.h_tabul").first() ;
		this.tabUlDiv = this.tabUl.children("div.h_tabuldiv").first() ;
		this.ul = this.tabUlDiv.children("ul").first();
		var tempul = tab.children("ul");
		if(defMaxTabCn==""){//不是动态新增的标签，初始化时，就不循环绑定标签click事件
			
			this.ul.append(tempul.children("li[ref]").detach())
				.children("li[ref]").each(function(i,obj) {
					tabCn++;
					$(obj).bind({
						click : function() {
							_this.click.call(_this,$(obj));
						}
					});
				//如果有自定义宽度，就设置标签的宽度为自定义的，否则默认 
				if(apiwidth!=""){//api自定义的宽度(优先获取api自定义宽度)
					$(obj).css("width",apiwidth+"px");
				}else{
					if(_this.liwidth!=""){//宏自定义的宽度
						$(obj).css("width",_this.liwidth+"px");
					}
				}
			});
			
			//默认第一个选中
			this.click(this.ul.children().first());
			
			//标签个数可以自定义，默认最多10个标签
			if(tabCn>_this.maxTabCn){//如果不是动态新增标签的，就判断标签页是否大于默认值
				Horn.Msg.alert("提示","最多只能添加"+_this.maxTabCn+"个标签,请检查！"); //STORY #8440
	        	return;
			}
		}	
		
		tempul.remove();
		this.movetab();
		this.doLayout();
		this.on("tabChange",function(li,panel){
			if(!Horn.Validate.isFormValidate(panel)){
				li.attr('title','该标签页下有未验证通过的内容');
				li.append('<span class="h_tabli-error"></span>');
			}else{
				//BUG #6777 【tab_panel】tab页签在内部出现校验不通过的情况下会造成新增的下一个页签出现校验不通过的提示
				li.find('span').remove();
				var title = li.attr('tipMsg');
				li.attr('title',title);
			}
		});
		var _this=this;
		$(window).resize(function(){
			_this.doLayout();
		});
	},
	/**
	 * @ignore
	 */
	click : function(obj) {
		 if(obj.length==0){
			 return false;
		 }
		var tab = this;
		var _this = this ;
		var a = this.el.find('li.h_cur');
		
		//如果原来的tab没有通过验证，不允许换页签
		if(a.get(0)) {
			var panel = $(obj).parent("ul").parent("div.h_tabuldiv").parent("div.h_tabul")
			.parent("div.h_tabpanel").children(
			"div.h_tabpanel-content[ref_target="
					+ a.attr("ref") + "]") ;
			
			//BUG #6775 【tab_panel】在某种场景下第二个标签页会显示第一个标签页的title
			a.each(function(){
				var title = $(this).attr('tipMsg');
				$(this).attr('title',title);
			});
			
			//BUG #6777 【tab_panel】tab页签在内部出现校验不通过的情况下会造成新增的下一个页签出现校验不通过的提示 (屏蔽当前激活代码)
			//当前已激活的情况下，终止切换。
			/*if( a.attr('ref') == $(obj).attr('ref')){
				return;
			}*/
			
			if(!this.fire('tabChange',a,panel)){
				return ;
			}
			

		}
//		$(obj).prevAll("li").removeClass("h_cur");
//		$(obj).nextAll("li").removeClass("h_cur");
		$(obj).addClass("h_cur").siblings().removeClass("h_cur");
		var panels = $(obj).parent("ul").parent("div.h_tabuldiv").parent("div.h_tabul")
		.parent("div.h_tabpanel")
		.children("div.h_tabpanel-content") ;
		var panel = $(obj).parent("ul").parent("div.h_tabuldiv").parent("div.h_tabul")
		.parent("div.h_tabpanel").children(
		"div.h_tabpanel-content[ref_target="
				+ $(obj).attr("ref") + "]") ;
		panels.each(function(){
			if($(this).css("display")!="none"){
				$(this).css("display","none") ;
			}
		}) ;
		panel.css("display","block") ;
		
		//若使用bigpipe，必须要给容器一个id
        var panelid = panel.attr("id");
        if(!panelid){
        	panelid = Horn.id("tab-panel-content-");
        	panel.attr("id",panelid);
        }
        var url = panel.attr("lazyload");
        if(!panel.attr("loaded") && url){
	        url = (url.indexOf("?") === -1 ? url +"?" : url+"&") + "pagelet=" + panelid ;
	        var _this=this;
	        $.ajax(url,{
	        	type:"get",
	        	error : function(xhr, textStatus, errorThrown) {
	        		_this.renderTab(panel, {
	        			html:"",
	        			id:panelid,
	        			css:[],
	        			js:[],
	        			jsCode:""
	        		});
	        		panel.attr("loaded","true");
	            },
	            success : function(reqData, textStatus, jqXHR) {
	            	_this.renderTab(panel, eval("("+reqData+")"));
	            	panel.attr("loaded","true");
	            }
	        });
        }else{
        	Horn.enterToTab(Horn.getCurrent());
        }
        
        //this.doLayout() ;
        
        //BUG #6898 [tab_panel]tab的个数超出tabpanel宽度后新打开的标签页不在可视范围
        /**
         * 如果ul的长度大于tab长度并且是向右的，就触发右边按钮的click事件
         */
        var ul_w = $(obj).parent("ul").css("width");
        var tab_w = $(obj).parent("ul").parent("div.h_tabuldiv").css("width")
        if(ul_w&&tab_w){
        	ul_w = ul_w.replace("px","");
        	tab_w = tab_w.replace("px","");
        	if(parseInt(ul_w)>parseInt(tab_w)){
        		var lastLiLen = $(obj).nextAll("li").length;
        		//BUG #6923 tab_panel在IE7下新增tab后，点击tab会来回跳动
        		if(_this.rigthFlag&&lastLiLen==0){
        			moveLastFlag = true;
        			_this.tabUl.children("a.h_tabrighta,a.h_tabrightacur").first().triggerHandler("click");
        		}
        	}
        }
        
	},
	/**
	 * 显示对应的tab页
	 * @name Horn.TabPanel#locate 
     * @function
	 * @param (String)name tab页对应的name
	 * @return {void}
	 * @ignore
	 */
	locate : function(name) {
		this.click(this.getTitle(name));
	},
	/**
	 * 显示对应的tab，并且将对应tab内的field设置为可用
	 * @name Horn.TabPanel#enable 
     * @function
	 * @param {string} name tab页对应的name
	 * @return {void}
	 */
	enable : function(name) {
		disableCount--;
		var c_title = this.getTitle(name);
		if ($(c_title).css("display") == "none") {
			$(c_title).css("display","block");
			/*$(c_title).parent("ul").parent("div.h_tabuldiv").parent(
					"div.h_tabul").parent("div.h_tabpanel").children(
					"div.h_tabpanel-content[ref_target=" + name + "]")
					.find("input,textarea").each(function() {
						$(this).removeAttr('disabled');
					});*/
			
			//BUG #6454 [tab_panel:标签页面板]-隐藏一个tab
			$(c_title).parent("ul").parent("div.h_tabuldiv").parent(
			"div.h_tabul").parent("div.h_tabpanel").children(
			"div.h_tabpanel-content[ref_target=" + name + "]").css("display","block");
			this.click($(c_title));
		}
	},
	/**
	 * 隐藏对应的tab，并且将对应tab的field设置为不可用
	 * @name Horn.TabPanel#disable 
     * @function
	 * @param {string} name tab页对应的name
	 * @return {void}
	 */
	disable : function(name) {
		disableCount++;
		var c_title = this.getTitle(name);
		var tabCn = $(c_title).parent("ul").children("li").length;//总标签数
		if(disableCount==tabCn){
			Horn.Msg.alert("提示","至少要有一个标签");
			this.click($(c_title));
			return;
		}
		if ($(c_title).css("display") != "none") {
			$(c_title).css("display","none");
			/**
			$(c_title).parent("ul").parent("div.h_tabuldiv").parent(
					"div.h_tabul").parent("div.h_tabpanel").children(
					"div.h_tabpanel-content[ref_target=" + name + "]")
					.find("input,textarea").each(function() {
						$(this).attr('disabled', 'disabled');
					});
					*/
			
			//BUG #6454 [tab_panel:标签页面板]-隐藏一个tab
			$(c_title).parent("ul").parent("div.h_tabuldiv").parent(
			"div.h_tabul").parent("div.h_tabpanel").children(
			"div.h_tabpanel-content[ref_target=" + name + "]").css("display","none");
			this.click($(c_title).parent("ul").children("li").not("li[ref=" + name + "]")[0]);
		}
	
	},
	/**
	 * tabpanel重新计算布局
	 * @name Horn.TabPanel#doLayout 
     * @function
	 * @return {void}
	 */
	doLayout : function() {
		var that = this;
		var div_tab = that.tabUlDiv ;
		var right = $("a.h_tabrighta,a.h_tabrightacur", div_tab.parent());
		var left = $("a.h_tablefta,a.h_tableftacur", div_tab.parent());
		
		//div_tab.prop('scrollLeft', 0);
		var ul = div_tab.children("ul");
		//ul.css("width", that.maxLength + "px");
		
		var width = 50;
		var panelWidth = that.el.width() ;
		var divTabWidth = panelWidth - left.outerWidth()-right.outerWidth() ;
		var leftWidth=-50;
		var curWidth=0;
		ul.children("li").each(function() {
			var _this = $(this);
			if(_this.hasClass("h_cur")){
				leftWidth+=width;
				curWidth=_this.outerWidth();
			}
			width += _this.outerWidth();
		});
		div_tab.width(divTabWidth);
		ul.width(width);
		var scrollWidth = div_tab.prop("scrollWidth");
		if (divTabWidth < scrollWidth) {
			right.removeClass("h_tabrighta").addClass("h_tabrightacur");
		} else {
			right.removeClass("h_tabrightacur").addClass("h_tabrighta");
		}
		var sleft=div_tab.scrollLeft();
		if(sleft+divTabWidth<leftWidth+curWidth){
			div_tab.scrollLeft(sleft+(leftWidth+curWidth-sleft-divTabWidth));
		}
		if(sleft>leftWidth){
			div_tab.scrollLeft(leftWidth);
		}
		if(div_tab.scrollLeft()>0){
			left.removeClass("h_tablefta").addClass("h_tableftacur");
			
		}else{
			left.removeClass("h_tableftacur").addClass("h_tablefta");
		}
		this.setSize();
    	Horn.enterToTab(Horn.getCurrent());
    	//对于tabpanel这种可变的compment，需要在变化的时候通知iframe变化大小。
    	if(window.doLayout){
    		doLayout();
    	}
	},
	setSize:function(){
		var that = this;
		var div_tab = that.tabUlDiv ;
		var right = $("a.h_tabrighta,a.h_tabrightacur", div_tab.parent());
		var left = $("a.h_tablefta,a.h_tableftacur", div_tab.parent());
		var panelWidth = that.el.width() ;
		var divTabWidth = panelWidth - left.outerWidth()-right.outerWidth() ;
		div_tab.width(divTabWidth);
	},
	/**
	 * @ignore
	 */
	movetab : function() {
		var _this = this ;
		var left = this.tabUl.children("a.h_tablefta");
		if(left.length<1){
			left = this.tabUl.children("a.h_tableftacur");
		}
		var right = this.tabUl.children("a.h_tabrighta");
		if(right.length<1){
			right = this.tabUl.children("a.h_tabrightacur");	
		}
		
		var div_tab = this.tabUlDiv;
		right.bind('click',
		function() {
			_this.rigthFlag = true;
			if (right.hasClass("h_tabrighta")) {
				return;
			}
			var scrollLeft = div_tab.prop('scrollLeft');
			var offsetWidth = div_tab.prop("offsetWidth");
			var scrollWidth = div_tab.prop("scrollWidth");
			div_tab.scrollLeft(scrollLeft+ _this.scrollStep);
			scrollLeft =div_tab.scrollLeft();
			if (scrollLeft > 0) {
				left.removeClass("h_tablefta").addClass("h_tableftacur");
			}
			if (offsetWidth + scrollLeft >= scrollWidth) {
				right.removeClass("h_tabrightacur").addClass("h_tabrighta");
			}
			_this.setSize();
		});
		left.bind('click',
		function() {
			_this.rigthFlag = false;
			if (left.hasClass("h_tablefta")) {
				return;
			}
			var scrollLeft = div_tab.prop('scrollLeft');
			var offsetWidth = div_tab.prop("offsetWidth");
			var scrollWidth = div_tab.prop("scrollWidth");
			div_tab.scrollLeft(scrollLeft- _this.scrollStep);
			scrollLeft = div_tab.scrollLeft();
			if (offsetWidth + scrollLeft < scrollWidth) {
				right.removeClass("h_tabrighta").addClass("h_tabrightacur");
			}
			if (scrollLeft == 0) {
				left.removeClass("h_tableftacur").addClass("h_tablefta");
			}
			_this.setSize();
		});
	},
	/**
	 * @ignore
	 */
    getTitle : function(name) {
        var title = this.ul.children("li[ref='"+name+"']") ;
        return title ;
    },
	/**
	 * 激活一个tab
	 * @name Horn.TabPanel#activate
     * @function
	 * @param {String} name tab页对应的name
	 * @return {void}
	 */
	activate : function(name){
    	
    	//BUG #6940 tabPanel:当tab页数较多、激活不在可视范围内的tab时无法激活 start
    	var _this = this;
		var panel = this.getTitle(name);
		var nextLiLength= $(panel).nextAll("li").length;
        var preLiLength= $(panel).prevAll("li").length;
        var liWidth = _this.liwidth!=""?_this.liwidth:_this.scrollStep;
        var tabWidth = 100;
    	var div_tab = this.tabUlDiv;
		var scrollLeft = div_tab.prop('scrollLeft');
		var tab_w = $(panel).parent("ul").parent("div.h_tabuldiv").css("width")
		if(tab_w){
        	scrollLeft = tab_w.replace("px","");
		}
		scrollLeft = parseInt(scrollLeft);
		liWidth = parseInt(liWidth);
		var offsetWidth = div_tab.prop("offsetWidth");
		var scrollWidth = div_tab.prop("scrollWidth");
		if(nextLiLength==0){//最后一个标签
			tabWidth =scrollLeft+liWidth;
        }else if(preLiLength==0){//第一个标签
        	scrollLeft = 0;
        	tabWidth =scrollLeft-liWidth;;
        }else{
        	if(preLiLength>nextLiLength){
        		tabWidth = scrollLeft+(preLiLength-nextLiLength)/2*liWidth;
        	}else if(nextLiLength>preLiLength){
        		tabWidth = scrollLeft-(nextLiLength+preLiLength)/2*liWidth-100;
        	}else{
        		tabWidth =scrollLeft+liWidth;
        	}
        }
		div_tab.prop('scrollLeft', tabWidth);
		//BUG #6940 tabPanel:当tab页数较多、激活不在可视范围内的tab时无法激活 end
		
		this.click.call(this,panel);
		this.setSize();
	},
    /**
     * @ignore 动态添加tab
     */
    renderTab : function(obj, bp) {
        var ref = obj.attr("ref_target");
        obj.children().remove();
        if((bp.html&&bp.html.length>3)||(bp.jsCode&&bp.jsCode.length>3)){
        	BigPipe.onArrive(bp) ;
            Horn.setCurrent(obj);
            BigPipe.start();
            Horn.init();
        }
        var title = obj.children("div").children("h1").children("span").html();
        $("div.h_tabuldiv").children("ul").children("li[ref=\"" + ref + "\"]").children("a").children("b").text(title);
        this.activate(ref);
    },
    /**
     * 动态添加tab
     * @name Horn.TabPanel#addTab
     * @function
     * @param {json} params {"name":"name","title":"title","url":"url","width":"width","maxTabCn":"maxTabCn","callback":"callback"}
     * @return {string} name tab页对应的name
     */
    addTab : function(params) {
    	
        var _this = this ;
		
        if(params.url){
        	if(params.url==""){
        		Horn.Msg.alert("提示","标签url不能为空！");
            	return;
        	}
        }else{
        	Horn.Msg.alert("提示","标签url必填，请检查！");
        	return;
        }
        //API定义的宽度优先获取
        if(params.width){//API自定义宽度
        	_this.liWidth = params.width;
        }else{
        	if(_this.liwidth!=""){//宏自定义的宽度
        		_this.liWidth = _this.liwidth;
        	}
        }
        apiwidth = _this.liWidth;
        
        //API定义的标签数优先获取
        if(params.maxTabCn && params.maxTabCn>0){//如果有自定义标签的最大数，就获取其值
        	defMaxTabCn = params.maxTabCn;
        }else{
        	if(_this.maxTabCn!=""){//宏有配置，就获取宏的值
        		defMaxTabCn = _this.maxTabCn;
        	}
        }
        
       	//如果这个标题已存在，则仅激活它。
        if(params.name && this.getTitle(params.name).get(0)){
        	this.activate(params.name);
        	return;
        }else{
        	tabCount++;
        }
       
        //BUG #6774 【tab_panel】调用10次addTab方法，传入相同的name会造成第11次提示“最多只能添加10个标签”并且无法添加新的标签页
        if(tabCount>defMaxTabCn){
        	Horn.Msg.alert("提示","最多只能添加"+defMaxTabCn+"个标签");
        	return;
        }
        
        var tabpanel = this.el;
        var ul = this.ul;
        
        var ref = params.name ||( "h_tab-uldiv-" + new Date().getTime() );
        var refID = Horn.id("tab-uldiv-") ;
        if(typeof params.title !='string' ||params.title.trim()<1){
        	params.title="未命名标签";
        }
        //BUG #6775 【tab_panel】在某种场景下第二个标签页会显示第一个标签页的title （添加tipMsg提示）
        ul.append("<li  ref='"+ref+"' style='"+_this.liWidth+"' title='"+params.title+"' tipMsg='"+params.title+"'>"+params.title+"</li>") ;
        var newAppendLi = ul.children("li[ref='" + ref + "']") ;
        tabpanel.append('<DIV style="DISPLAY: block" class="h_tabpanel-content" ref_target="' + ref + '" id="'+refID+'"></DIV>') ;
        var newAppendDiv = tabpanel.children("div[ref_target='" + ref + "']") ;
        var url = params.url ;
        url = (url.indexOf("?") === -1 ? url +"?" : url+"&") + "pagelet=" + refID ;
        var _this=this;
        $.ajax(url,{
        	type:"get",
        	error : function(xhr, textStatus, errorThrown) {
        		_this.renderTab(newAppendDiv, {
        			html:"",
        			id:refID,
        			css:[],
        			js:[],
        			jsCode:""
        		});
                if(params.callback) params.callback();
            },
            success : function(reqData, textStatus, jqXHR) {
            	_this.renderTab(newAppendDiv, eval("("+reqData+")"));
                if(params.callback) params.callback();
            }
        });
        newAppendLi.bind({
            click : function() {
                _this.click.call(_this,newAppendLi);
            }
        });
        
        var tab = this.el ; 
		var tempul = tab.children("ul");
        tempul.remove();
		this.movetab();
		this.doLayout();
		
        return ref;
    },
    /**
     * 关闭tab
     * @name Horn.TabPanel#closeTab
     * @function
     * @param {string} name tab页对应的name
     * @return {void}
     */
    closeTab:function(name){
    	var li = this.ul.children("li[ref='"+name+"']");
    	var tab = this.el.children("div[ref_target='" + name + "']");
    	li.remove();
    	tab.remove();
    	var lastli = this.ul.children('li').last();
    	if(lastli){
    		this.click(lastli.get(0));
    	}
    }
}) ;

$.extend(Horn.TabPanel,{
	"DATANAME" : "h_tabpanel" ,
	/**
	 * 获取tabpanel 提供的静态方法，此方法只针对页面只有tabpanl情况下便捷使用
	 * @name Horn.TabPanel.get
     * @function
     * @param (String)name 名字
     * @return (Object)组件对象
     * @ignore
	 */
	"get" : function(name){
		var arr = Horn.data(Horn.TabPanel.DATANAME) ;
		var tabPanel = arr[0] ;
		return tabPanel ;
	},
	/**
	 * 显示对应的tab页
	 * @name Horn.TabPanel.locate 
     * @function
	 * @param name tab页对应的name
	 * @ignore
	 */
	"locate" : function(obj) {
		Horn.TabPanel.get().locate(obj);
	},
	/**
	 * 显示对应的tab，并且将对应tab的field设置为可用
	 * @name Horn.TabPanel.enable 
     * @function
	 * @param name tab页对应的name
	 * @ignore
	 */
	"enable" : function(obj) {
		Horn.TabPanel.get().enable(obj);
	},
	/**
	 * 隐藏对应的tab，并且将对应tab的field设置为不可用
	 * @name Horn.TabPanel.disable 
     * @function
	 * @param name tab页对应的name
	 * @ignore
	 */
	"disable" : function(obj) {
		Horn.TabPanel.get().disable(obj);
	},
	/**
	 * tabpanel重新计算布局
	 * @name Horn.TabPanel.doLayout 
     * @function
     * @ignore
	 */
	"doLayout" : function() {
		Horn.TabPanel.get().doLayout();
	}
}) ;

Horn.regUI("div.h_tabpanel",Horn.TabPanel) ;
/* 
 * -----------------------------------------------------------------------
 * 修订记录：
 * 2014-01-22     zhangsu          Grid列支持hidden属性
 * 2014-01-22     zhangsu          新增rowSelect属性，使grid支持点击行选中该行
 * 2014-02-08     zhangsu          修改this.rowSelect设置后不生效的问题
 * 2014-2-13      zhangchao09444   修改加载之后会导致页面缺少一半的问题。
 * 2014-2-28      zhangchao09444   修改在querytable重新load的情况下页面加长因而缺失部分的问题。
 * 2014-03-31     zhangsu          BUG #6534 simpleRequest属性配置在初次自动加载数据时未生效
 * 2014-03-31     zhangsu          BUG #6531 query_table中调用selectRow函数报错
 * 2014-04-01     zhangsu          BUG #6533 query_table中simpleReques属性值在代码中仍使用str型，需要调整为布尔型
 * 2014-04-03     zhangsu          BUG #6542 【queryTable】文档错误
 * 2014-04-03     zhangsu          BUG #6567 [query_table]设置无效的requestMethod
 * 2014-04-03     zhangsu          BUG #6545 [query_table]不设置分页未显示所有数据
 * 2014-04-04     zhangsu          BUG #6546 [query_table]设置非法hasPage值时应不分页
 * 2014-04-04     zhangsu          BUG #6544 [query_table]设置非法request_num
 * 2014-04-08     zhangsu          BUG #6574 [queryTable]:单选模式最好选择列是圆圈
 * 2014-04-08     zhangsu          BUG #6595 [query_table]selectRow传参有问题，设计缺陷
 * 2014-04-09     zhangsu          BUG #6598 [query_table]setBaseParams设置的参数不能发送成功
 * 2014-04-09     zhangsu          BUG #6532 通过loadData加载静态数据时，列render属性未生效
 * 2014-04-10     zhangsu          BUG #6562 [query_table]点击多选框不能选中，必须选中数据才能选中
 * 2014-04-11     zhangsu          BUG #6720 queryTable方法selectRow传入行号无法选中
 * 2014-04-14     zhangsu          BUG #6728 query_table属性hasPage不配置时，未使用默认值
 * 2014-04-14     zhangsu          BUG #6730 query_table文档中漏了属性renderer
 * 2014-04-15     zhangsu          BUG #6492 selectModel：“ 行数据选择模式（single/muti 启用单选/多选选择框） ”，这里是“multi”误拼居“muti”了吗？它的默认值是什么？
 * 2014-04-15     zhangsu          BUG #6492   setBaseParams方法怎么没参数呢？
 * 2014-04-16     zhangsu          BUG #6741 query_table中对bindFormName、loadByForm、load的描述错误      
 * 2014-04-16     zhangsu          修改titlebuttons注释，添加save/query/confirm/refresh/open样式   
 * 2014-04-18     zhangsu          BUG #6760 query_table手动全选后调用方法取消全选，列头上的勾还在
 * 2014-04-22     zhangsu          BUG #6797 QueryTable_加载静态数据后静态数据字典的key和value是反的       
 * 2014-04-22     zhangsu          BUG #6797 QueryTable_加载静态数据后静态数据字典的key和value是反的
 * 2014-04-28     周智星                             修改title和   titlebuttons注释                   
 * 2014-04-28     zhangsu          BUG #6887 【query_table】设置hasPage为false  
 * 2014-05-22     zhangsu          STORY #8366 [研发中心/内部需求][jresplus][ui]-queryTable组件的rowSelec属性在文档中未添加说明
 * 2014-05-22     zhangsu          STORY #8380 [研发中心/内部需求]{jresplus}[ui]-queryTable组件url、simpleRequest属性在文档中未说明
 * 2014-05-22     zhangsu          STORY #8381 [研发中心/内部需求][jresplus][ui]-queryTable组件需要在文档中添加事件说明，支持事件列表、事件触发时间或机制、事件传递参数。
 * 2014-05-23     zhangsu          STORY #8367 [研发中心/内部需求][jresplus][ui]-queryTable的position_str属性需要和原先的使用方式兼容 
 * 2014-06-05	  wuxl             STORY #8454 STORY #8454 [研发中心/内部需求][jresplus][ui]-queryTabl,grid当设置"selectModel":"single",取消"rowSelect":"true"的设置，在IE7浏览器下，无法选中单选框
 * 2014-06-19	  wuxl             STORY #8484 queryTable组件的分页栏信息建议加上总页数，总条数(优化：1.解决刷新数据时页面渲染时的晃动;2.点击分页按钮不再跳至页面顶部)
 * 2014-06-26     zhangsu          BUG #7179 querytalbe ：通过data属性加载数据，调用方法 getSelecteds(true)能获得值  
 * ----------------------------------------------------------------------- 
 */



/**
 * @name Horn.QueryTable
 * @class
 * 查询表格<br/>
 * 带查询表单的表格展示
 */
/**
 * @lends Horn.QueryTable#
 */
	 
/**
 * 组件的唯一标示
 * @name Horn.QueryTable#<b>id</b>
 * @type String
 * @default 
 * @example
 * 无
 */
/**
 * 组件的名称
 * @name Horn.QueryTable#<b>name</b>
 * @type String
 * @default 
 * @example
 * 无
 */

/**
 * 组件的请求地址 
 * 当url属性未配置，而bindformname属性设置了,控件会取绑定的表单的action属性值作为请求地址
 * @name Horn.QueryTable#<b>url</b>
 * @type String
 * @default ''
 * @example
 * 无
 */

/**
 * 组件的跨列数
 * 系统默认提供样式h_colspan-1、h_colspan-2、h_colspan-3
 * 对应cols=1,cols=2,cols=3
 * 如果要展现自定义的属性，需要业务自行提供相应样式对应。例如：cols=20 ,h_colspan-20的样式业务中自行提供
 * @name Horn.QueryTable#<b>cols</b>
 * @type Number
 * @default 3
 * @example
 * 无
 */
	 
/**
 * 组件的标题,都不设置title和titleButtons时才不显示标题栏，否则都显示
 * @name Horn.QueryTable#<b>title</b>
 * @type String
 * @default 
 * @example
 * 无
 */
	
/**
 * 每页请求的条数
 * @name Horn.QueryTable#<b>request_num</b>
 * @type Number
 * @default 10
 * @example
 * 无
 */

/**
 * 展示的数据源
 * @name Horn.QueryTable#<b>data</b>
 * @type Array
 * @default 
 * @example
 * 示例：
 * [{"branchNo":8888,"initDate":"20130101"},
 *   {"branchNo":8888,"initDate":"20130101"},
 *   {"branchNo":8888,"initDate":"20130101"},
 *   {"branchNo":8888,"initDate":"20130101"},
 *   {"branchNo":8888,"initDate":"20130101"},
 *   {"branchNo":8888,"initDate":"20130101"},
 *   {"branchNo":8888,"initDate":"20130101"}]
 */
	
/**
 * 是否有分页  注意：hasPage属性将作为后台识别是否提供分页数据的标识。该参数存在于请求参数中
 * @name Horn.QueryTable#<b>hasPage</b>
 * @type Boolean
 * @default false
 * @example
 * 无
 */
/**
 * 请求成功回调函数
 * @name Horn.QueryTable#<b>callback</b>
 * @type function
 * @default 
 * @example
 * 无
 */
	 
/**
 * 定位串，定位串的属性名
 * @name Horn.QueryTable#<b>position_str</b>
 * @type String
 * @default position_str
 * @example
 * 无
 */
	
/**
 * 自定义查询条件，每次请求时该查询条件都会提交到后台
 * @name Horn.QueryTable#<b>baseparams</b>
 * @type json
 * @default 
 * @example
 * 无
 */
	
/**
 * 列配置项
 * @name Horn.QueryTable#<b>items</b>
 * @type Array 
 * @default 
 * @example
 * items中的单个列表条目属性：
 *                name        {String}   列数据索引名 即dataIndex
 *                text        {String}   列头名称
 *                width		  {String}   列头宽度
 *                hidden      {Boolean}  列是否隐藏
 *                renderer    {String}   列渲染函数名
 *                buttons     {Array}    操作列，设置此属性后，属性值会被渲染成多个链接
 *                dictName    {String}   字典条目名称
 *                dealFun     {String}   全局处理函数
 * "items":[{"name":"clientId","text":"客户号","width":"100"},
 *		{"name":"clientName","text":"客户姓名"},{"name":"fundAccount","text":"资产账号"},
 *		{"name":"operatorNo","text":"操作员编号"},{"name":"phone","text":"移动电话"},
 *		{"name":"contact","text":"联系方式"},{"name":"organFlag","text":"机构类型","dealFun":"lhkh.organFlagFn"}]
 */
	
/**
 * 行数据选择模式（single/multi 启用单选/多选选择框）
 * 当不配置selectModel或selectModel为""属性时,不显示选择列
 * @name Horn.QueryTable#<b>selectModel</b>
 * @type String
 * @default 
 * @example
 * 无
 */
	
/**
 * 是否显示序号列索引
 * @name Horn.QueryTable#<b>numbercolumn</b>
 * @type Boolean
 * @default false
 * @example
 * 无
 */
	
/**
 * 是否使用普通参数模式（发送index到后台）,默认值为false,不发送index参数给后台，当设置为true时发送index参数到后台
 * 注意：当simpleRequest=false时,request_num = request_num+1
 *       当simpleRequest=true时,request_num = request_num
 * @name Horn.QueryTable#<b>simpleRequest</b>
 * @type Boolean
 * @default false
 * @example
 * 无
 */
	
/**
 * 都不设置title和titleButtons时才不显示标题栏，否则都显示。标题栏的工具按钮，当按钮的"event"属性不设置时，按钮将被隐藏
 * 默认提供添加、修改、删除、确认、查询、打开、保存、刷新的样式,cls属性分别对应："add","edit","del","confirm","query","open","save","refresh"
 * 
 * @name Horn.QueryTable#<b>titleButtons</b>
 * @type Array 
 * @default 
 * @example
 * "titleButtons":[{"label":"添加","cls":"add","event":"add()"}]
 * 单个按钮属性：
 *	       label   {String}  按钮文本
 *	       cls     {String}  按钮css样式
 *	       event   {String}  按钮点击事件
 *	       disabled {Boolean} 是否禁用/启用按钮
 */
	
/**
 * 事件
 * 控件支持的事件列表如下：<br>
 * rowclick  行单击事件    事件参数：rowdata  当前被点击的一行数据<br>
 * rowdblclick  行双击事件 事件参数：rowdata  当前被点击的一行数据<br>
 * 注意：双击事件会触发单击事件，所以在使用双击事件时应注意与单击事件的关系<br>
 * @name Horn.QueryTable#<b>events</b>
 * @type Array 
 * @default 
 * @example
 * "events":[
 *		{"event":"rowclick","function":"lhkh.tableRowClick(rowdata)"},
 *		{"event":"rowdblclick","function":"lhkh.tableRowDblClick(rowdata)"}]
 */
/**
 * 打开页面时是否自动加载查询,默认为false
 * @name Horn.QueryTable#<b>autoLoad</b>
 * @type Boolean
 * @default false
 */
/**
 * 邦定form表单的名字,邦定此属性后,querytable将表单中的输入参数作为查询条件进行数据查询
 * @name Horn.QueryTable#<b>bindFormName</b>
 * @type String
 */
	 
/**
 * 数据请求方式（get,post）
 * @name Horn.QueryTable#<b>requestMethod</b>
 * @type String
 * @default 默认为"post"
 */

/**
 * @description 是否启用点击行选中行操作,默认值为false，不启用,设置为true时点击行选中才生效
 * @property rowSelect
 * @name Horn.QueryTable#<b>rowSelect</b>
 * @type Boolean
 * @default false
 * @example
 * 无
 */

Horn.QueryTable = Horn.extend(Horn.Base,{
	COMPONENT_CLASS:"QueryTable",
    table : null,
    form : null ,
    dicName : null,
    delimiter:",",
    ths : [],
    simpleRequest:false,
    postData : null,
    rowSelect : false,
    keyAttr : "label",
    valueAttr : "value",
    clickFlag:null,
    /**
     * @ignore
     */
    init : function(dom) {
        Horn.QueryTable.superclass.init.apply(this,arguments) ;
        this.table = $(dom);
        var baseparams = this.params.baseparams || {};
        var bindformname = this.params["bindformname"] ;
        //Grid点击行选中该行的配置支持
        this.rowSelect = Boolean(this.params["rowSelect"]);
        var formData = {} ,
        	data = {
		        request_num : 10, // 每页请求条数
		        index : this.INDEX_PAGE, // 页数
		        positionArr : [], // 保存定位串
		        start_position_str : 0,// 开始请求定位串
		        returndata : null,// 返回数据 list
		        url : '', // 请求路径
		        position_str : 'position_str',// 返回数据定位字段
		        hasPage : false, // 是否有分页
		        baseparams : baseparams,
		        params : {},
		        autoLoad:false,
		        requestMethod:"post"
		        // 参数
		    };
        if(bindformname){
            this.form = Horn.getCurrent().find("form[name='"+bindformname+"']") ;
            formData = Horn.Util.getValues(this.form) ;
        }
        data.request_num = formData["request_num"] || this.params["request_num"] || data.request_num ;
        //BUG #6544
        data.request_num = parseInt(data.request_num)>0 ? parseInt(data.request_num):10;
        data.autoLoad = Boolean(this.params["autoLoad"]) ;
        data.url = this.params["url"] ;
        //BUG #6567 
        if(this.params["requestMethod"] && (this.params["requestMethod"].toLowerCase()=="post"||this.params["requestMethod"].toLowerCase()=="get")){
        	data.requestMethod = this.params["requestMethod"] ;
        }
        if(!data.url && this.form && this.form.length){
            data.url = this.form.attr("action")  ;
        }
        if(data.url && data.url.indexOf("http:")==-1){
            data.url = context_path + data.url;
        }

        data.start_position_str = formData["position_str"] ||
        this.params["start_position_str"] || data.start_position_str ;

        if (this.params["position_str"]) {
            data.position_str = this.params["position_str"];
        }
        //BUG #6545  //BUG #6546
        //BUG #6728
        data.hasPage = Boolean(this.params["hasPage"]!=undefined||this.params["hasPage"]!=null?this.params["hasPage"]:data.hasPage);
        
        data.positionArr.push(data.start_position_str);
        
        this.postData = data;
        var _this = this ;
		this.ths = this.el.find("th");
		//关于普通请求的部分
        if(this.params['simpleRequest'] == true){
        	this.simpleRequest = true;
        }
        
        if(data.url && data.autoLoad == true){
            _this.loadByForm.call(_this);
        }
        //点击事件和双击事件
//        this.rowclick = this.table.attr("rowclick");
//        this.rowdblclick = this.table.attr("rowdblclick");
        $.each(this.params.events || [], function(i, o){
        	_this[o.event.toLowerCase()] = o["function"];
        });
        
        this.mutiSelect = this.params['selectModel']=='muti'||this.params['selectModel']=='multi'||this.params['selectModel'] ==''|| this.params['selectModel']==undefined;
       	//关于字典项目的翻译功能。
		this.ths.each(function(index,th){
			var hidden = th.attributes["hidden"];
			th=$(th);
			var dictName = th.attr("dictName"),
				itemscolNo = th.attr('colno'),
				staticDict=undefined;
			var tempStaticDict=undefined,buttons=undefined;
			if(itemscolNo){
				tempStaticDict = _this.params.items[itemscolNo -1].items;
				buttons = _this.params.items[itemscolNo -1].buttons;
			}
			
			if(hidden!=null && hidden!=undefined && hidden.value == true.toString()){
				th.hide(); 
			}
			if(dictName){
				staticDict = {};
				//先把dict解析出来，避免重复查找dom
				var lis = $('.hc_checkboxdiv[ref_target='+dictName+'_s]').find("li");
				lis.each(function(idx,li){
					li = $(li);
					var label = li.attr('title');
					var key = li.attr('key');
					staticDict[key] = label;
				});
			}else if(tempStaticDict){
				staticDict = {};
				$(tempStaticDict).each(function(idx,item){
					
					staticDict[item[_this.keyAttr]] = item[_this.valueAttr];  //bug 6797
				});
			}
			th.data('staticDict',staticDict);
			th.data('buttons',buttons);
		});

		this.titleEl = this.el.parent().parent().find('div.h_formgridtitle');
		var titleButtons = this.params["titleButtons"];
		this.titleEl.find('a').each(function(idx){
			var button = $(this);
			var ev = button.attr('onclick');
			var _disabled = titleButtons[idx]["disabled"];  //STORY #7776
			if(!Horn.Util.getFunObj(ev).fn){
				button.hide();
			}
			if(_disabled){
				button.addClass("h_btn-disabled");
				button.removeAttr("onclick");
				button.click(function (event) {
                    event.preventDefault();   // 阻止弹出
                });
			}
		});
		
		this.selecteds = [];
		if(this.params.data){     //如果querytable是通过data属性来加载数据（同grid的方式）zhangsu
			  this.dictTrans();
			  this.initEvents();
			  this.hiddenColumns();
			  this.lastList = this.params.data;
		}
		 
        		
		this.el.find('.h_querytable_select_all').change(function(){
			if(this.checked){
				_this.selectAll();
			}else{
				_this.unSelectAll();
			}
		});
    },
    customEvents : "rowclick,rowdblclick",
    getEventTarget : function() {
    	return this.el;
    },
    
    /**
     * @private
     * @ignore
     */
    stateTest : function(){
    	var _this = this;
		var checkAll = true;
		_this.el.find('input:checkbox.h_querytable_select').each(function(idx,checkbox){
    		if(!$(checkbox).attr("checked")){
    			checkAll = false;
    		}
    	});
		if(checkAll){
			_this.el.find('.h_querytable_select_all').attr("checked", true);
		}else{
			_this.el.find('.h_querytable_select_all').attr("checked", false);
		}
    },
    /**
     * @private
     * @ignore
     */
    initEvents : function(){
    	var _table = this.el;
    	var _tbody = _table.children('tbody');
    	var _this = this;
    	var isCheckbox = _this.el.find('.h_querytable_select_all').length>0?true:false;
	    if(isCheckbox){
			this.el.find('.h_querytable_select').change(function(){
				_this.stateTest();
			});
	    }	
        if(this.rowSelect == true){
        	_tbody.children('tr').each(function(i,tr){
    		    var rowidx = i;
    		    var _tr = $(tr),
    		    checkbox = _this.mutiSelect?_tr.find("input:checkbox.h_querytable_select"):_tr.find("input:radio.h_querytable_select")//BUG #6574
    		;
    		var _clickFlag=this.clickFlag;
    		_tr.bind('click',function(e) {    //BUG #6562
    			clearTimeout(_clickFlag);
    			_clickFlag=setTimeout(function(){
    				if($.isEmptyObject(_this.selecteds)){
        				_this.selectRow(rowidx, _tr);
        			}else{
        				if(!_this.selecteds.hasOwnProperty(rowidx)){
        				    _this.selectRow(rowidx, _tr);
    					 }else{
    						 _this.unSelectRow(rowidx, _tr);
    					 }
//        				if(_this.lastSelect&&_this.lastSelect.rowidx != rowidx){
//        					 if(!_this.selecteds.hasOwnProperty(rowidx)){
//            				    _this.selectRow(rowidx, _tr);
//        					 }else{
//        						 _this.unSelectRow(rowidx, _tr);
//        					 }	 
//            			}else{
//            				_this.unSelectRow(rowidx, _tr);
//            			}
        			}
    				if(isCheckbox){
            			_this.stateTest();
    				}
    			},10);
    			
    		 });
    		
    		/*
    		    _tr.toggle(function(){
    		    	_this.selectRow(rowidx,_tr);
    		    },function(){
    		    	_this.unSelectRow(rowidx, _tr);
    		    });
    		    */
            });
        }
    },
    /**
     * @private
     * @ignore
     */
    hiddenColumns : function(){
    	var trs = this.el.children('tbody').children('tr');
    	var ths = this.ths;
    	
    	ths.each(function(thidx,thdom){
    		var th = $(thdom);
    		//隐藏列
    		var hidden = thdom.attributes["hidden"];
    		if(hidden!=null && hidden!=undefined && hidden.value == true.toString() ){
    			th.hide(); 
    			//trs each
    	    	trs.each(function(tridx,trdom){
    	    		var tr = $(trdom);
    	    		var tds = tr.find('td');
    	    		for(var tdidx = 0 ; tdidx<tds.length ; tdidx++){
    	    			var td = $(tds[tdidx]);
    	    			if(thidx == tdidx){
    	    				td.hide();
    	    				break;
    	    			}
    	    		}
    	    	});
    		}
    	});
    	
    },
    /**
     * @description 根据form中的查询条件参数查询数据，需要配置属性bindFormName才能生效,内部会将绑定表单的数据做为查询条件通过load进行处理
     * @function
     * @name Horn.QueryTable#loadByForm
     */
    loadByForm : function(){
        var params = {} ;
        if(this.form && this.form.length){
            params = this.form.serializeArray() ;
        }
        this.load(params) ;
    },
    /**
     * @description 设置QueryTable向后台发送请求时的用户自定义参数，被设置的参数会做为基础查询条件，但是当调用loadByForm或者load时使用的查询参数会覆盖baseparam中的已有查询参数<br/>
     * 说明：<br/>
     * 如果baseparams={"name":"zhansan","age":1}<br/>
     * 使用load或者loadByForm的参数为{"name":"lisi","addr":"123"}<br/>
     * 最终应用的请求参数为{"name":"lisi","age":1,"addr":"123"}
     * @function
     * @name Horn.QueryTable#setBaseParams
     * @params {Json}  params 自定义参数
     */
    setBaseParams:function(params){
    	 if(params){
    		 this.postData.baseparams=params;
    	 }else{
    		 this.postData.baseparams={};
    	 }
    	 
//        Horn.apply(this.postData.baseparams,params) ;
    },
    /**
     * @description 根据传入的参数查询数据,此方法调用会影响已存在的查询条件（如loadbyForm产生的查询条件，但不影响baseparams）原有的查询条件会被覆盖，且如果为空会清空原来的查询条件；
     * @function
     * @name Horn.QueryTable#load
     * @param {Json} params   传入的查询条件参数 (可选) 
     */
    load : function(params){
        var data = this.postData ;
        if(params){
            if($.type(params)=="array"){
                data.params = Horn.Util.arr2Obj(params) ;
             // Horn.apply(data.params,data.baseparams) ;  BUG #6598
            }
            else{
                data.params = params ;
            }
        }
        else{
            data.params = {} ;
        }
        this.goPage(this.INDEX_PAGE);
    },
    INDEX_PAGE:1,
    /**
     * @description 下一页,基于已有的查询条件查询下一页
     * @function
     * @name Horn.QueryTable#nextpage 
     */
    nextpage : function() {
        this.goPage(this.postData.index +1 );
    },
    /**
     * @description 上一页,基于已有的查询条件查询上一页
     * @function
     * @name Horn.QueryTable#prevpage
     */
    prevpage : function() {
        this.goPage(this.postData.index -1);
    },
    /**
     * @description 第一页,基于已有的查询条件查询第一页
     * @function
     * @name Horn.QueryTable#firstpage
     */
    firstpage : function() {
        this.goPage(this.INDEX_PAGE);
    },
    /**
     * @description 刷新页面,基于已有的查询条件刷新当前页
     * @function
     * @name Horn.QueryTable#refreshpage
     */
    refreshpage : function() {
        this.ajaxRequest();
    },
    /**
     * @ignore
     * @description 跳到指定页,基于已有的查询条件查询指定页
     * @function
     * @name Horn.QueryTable#goPage
     * @param {int} page
     */
    goPage : function(page){
    	if(page < this.INDEX_PAGE ) page = this.INDEX_PAGE;
    	this.postData.index = page;
    	this.ajaxRequest(this.el);
    },
    /**
     * @ignore
     */
    ajaxRequest : function() {
        var _this = this,
	        table = this.el,
	        data = this.postData,
	        positionArr = data.positionArr,
	        tbody = table.children("tbody") ,
	        params = data.params;
        //BUG #6598
       // Horn.apply(params,data.baseparams) ;
        //BUG #6876
        params=$.extend({},data.baseparams,params);
        
        //BUG #6545
        params["hasPage"] = data.hasPage;
        // 重新设置定位串
		if (params != null ) {
				//params[data.position_str] = positionArr[data.index]|| data.start_position_str;
			params["position_str"] = positionArr[data.index]|| data.start_position_str;	//STORY #8367
			params.request_num = data.request_num
						+ (this.simpleRequest ? 0 : 1);
		}
		if (this.simpleRequest) {
			params.index = data.index;
		}
		var colLength = this.ths.length;
		//BUG #6729 ,不分页的时候不需要这些参数
		if(params["hasPage"]==false){
			//delete params.request_num;
		}
        $.ajax(data.url,
            {
                async : true,
                beforeSend : function(xhr) {
                    tbody.html("<tr><td colSpan='"
                        + colLength
                        + "'><p class='h_loading'>正在加载</p></td></tr>");
                },
                type : data.requestMethod,
                data : Horn.Util.obj2Arr(params) ,
                dataType : "json",
                error : function(xhr, textStatus, errorThrown) {
                    var status = xhr.status;
                    tbody.html(
                        "<tr><td colSpan='" + colLength
                            + "'><p>请求失败</p><p>错误状态："
                            + status + "；错误信息："
                            + textStatus
                            + "</p></td></tr>");
                },
                success : function(reqData, textStatus, jqXHR) {
                    _this.callback.call(_this, _this.doDataFilter(reqData));
                    _this.doCallBack(reqData);
                    _this.lastSelect = null;
                    _this.selecteds = {};
                }
            });

    },
    doDataFilter:function(reqData){
        var table = this.table;
        var datafilter = table.attr("datafilter");
        if(datafilter){
            var datafilterOjb = Horn.Util.getFunObj(datafilter);
            if(datafilterOjb && $.type(datafilterOjb.fn) == "function"){
                reqData = datafilterOjb.fn.call(this,reqData);
            }
        }
        return reqData;
    },
    doCallBack:function(reqData){
        var table = this.table;
        var callback = table.attr("callback");
        if(callback){
            var callBackOjb = Horn.Util.getFunObj(callback);
            if(callBackOjb && $.type(callBackOjb.fn) == "function"){
                callBackOjb.fn.call(this,reqData);
            }
        }
        $('.h_screen').height('auto');
        setTimeout(function(){
        	if(window.doLayout){
        		window.doLayout();
        	}
        },1000);
        this.dictTrans();
    },
    /**
     * @ignore
     */
    callback : function(reqData) {
//        if(!reqData){
//            reqData=[] ;
//        }
    	reqData = reqData || {total:0,rows:[]};
    	if ($.type(reqData) == "array") {
    		reqData = {rows:reqData};
    	}
    	var list = reqData.rows;
        var table = this.table;
        var _this = this;
        var htmlArr = [];
//        var returndata = reqData;
        var ths = this.ths;
        var colLength = ths.length;
        var isSuccess = false;
        var data = this.postData;
//        var list = reqData;
        this.lastList = list;
        this.selecteds=[];
        this.lastSelect={};
        this.el.find('.h_querytable_select_all').attr("checked", false);
        table.css("height", "auto");
        if (list && list.length > 0) {
            data.list = list.slice(0,data.request_num);
            isSuccess = true;
            for ( var i = 0; i < list.length; i++) {
                var itemData = list[i];
                htmlArr.push("<tr>");
                ths.each(function(index, o) {
                    var th = $(o);
                    if(th.hasClass("h_numbercolumn")){
                    	htmlArr.push("<td>"+(i+1)+"</td>");
                    	return;
                    }else if(th.hasClass("h_querytable_checkboxcolumn")){
                    	htmlArr.push("<td><input type=\"checkbox\" class=\"h_querytable_select\"/></td>");
                    	return;
                    }else if(th.hasClass("h_querytable_radioboxcolumn")){//BUG #6574
                    	htmlArr.push("<td><input type=\"radio\" class=\"h_querytable_select\" name=\"_querytable_row_checker\"/></td>");//STORY #8454 
                    	return;
                    }
                    
                    var name = th.attr("name");
                    var dealFun = th.attr("dealFun");
                    htmlArr.push("<td>");
                    if (dealFun) {
                        var dFun = eval("(window." + dealFun + ")") ;
                        if($.type(dFun) == "function"){
                            // 提供个性化处理元素数据的js方法
                            htmlArr.push(dFun(itemData[name],itemData, list,i,index));
                        }
                    } else {
                        htmlArr.push(itemData[name]);
                    }
                    htmlArr.push("</td>");
                });
                htmlArr.push("</tr>");
                if (i == data.request_num - 1) {
                    // 当页已满
                    data.positionArr[data.index + 1] = itemData[data.position_str];
                    break;
                }
            }
        } else if (reqData.errorInfo) {
            data.list = [];
            htmlArr.push("<tr><td colspan='" + colLength + "'>");
            htmlArr.push("<p>" + reqData.errorInfo + "</p>");
            htmlArr.push("</td></tr>");
        } else {
            data.list = [];
            htmlArr.push("<tr><td colspan='" + colLength + "'>");
            htmlArr.push("<p>没有查询到数据</p>");
            htmlArr.push("</td></tr>");
        }
        var tbody = table.children("tbody");
        tbody.html(htmlArr.join(""));
        // 增加效果
        if (isSuccess) {
            // 默认样式
            tbody.children("tr:odd").addClass("h_table-odd");
            /*** 鼠标滑动事件
            tbody.children("tr").hover(function() {
                $(this).addClass("h_table-over");
            }, function() {
                $(this).removeClass("h_table-over");
            });*/
            // 表格单击,双击事件
            var rowClickObj =undefined;
            var rowDBLClickObj =undefined;
            var rowClickFn=undefined;
            var rowDBLClickFn=undefined;
            if (this.rowclick) {
                rowClickObj = Horn.Util.getFunObj(this.rowclick);
                if($.type(rowClickObj.fn) == "function"){
                    rowClickFn = rowClickObj.fn ;
                }
            }
            if(this.rowdblclick){
                rowDBLClickObj = Horn.Util.getFunObj(this.rowdblclick);
                if($.type(rowDBLClickObj.fn) == "function"){
                    rowDBLClickFn = rowDBLClickObj.fn ;
                }
            }
            if (rowClickFn || rowDBLClickFn) {
                var trs = tbody.children("tr");
                var _clickFlag=this.clickFlag;
                for ( var i = 0; i < data.list.length; i++) {
                    var tr = $(trs.get(i));
                    if(rowClickFn){
                        var params = rowClickObj.params.slice(0);
                        params.push(data.list[i], data.list);
                        tr.bind('click',params, function(e) {
                            var p = e.data ;
                            var _this=this;
                            clearTimeout(_clickFlag);
                            _clickFlag=setTimeout(function(){
                            	return rowClickObj.fn.apply(_this,p);
                            },300);
                           // return rowClickObj.fn.apply(this,p);
                        });
                    }
                    if(rowDBLClickFn){
                        var params = rowDBLClickObj.params.slice(0);
                        params.push(data.list[i], data.list);
                        
                        tr.bind('dblclick', params,function(e) {
                        	clearTimeout(_clickFlag);
                            var p = e.data ;
                            return rowDBLClickObj.fn.apply(this,p);
                        });
                    }
                }
            }
          //增加rowselect hidden
            this.initEvents();
    		this.hiddenColumns();
        }
        
        table.css("height", table.css("height"));
        
        if (data.hasPage) {
            // 开始生成分页链接
            var pageArr = [];
            if (data.index > _this.INDEX_PAGE) {
                pageArr.push("<a href='javascript:void(0)' class='h_page-first'>首页</a>");
                pageArr.push("<a href='javascript:void(0)' class='h_page-pgLast'>上一页</a>");
            } else {
                pageArr.push("<a href='javascript:void(0)' class='h_page-dis'>首页</a>");
                pageArr.push("<a href='javascript:void(0)' class='h_page-dis'>上一页</a>");
            }
            if (isSuccess) {
                pageArr.push("<a href='javascript:void(0)' class='h_page-refresh'>刷新</a>");
            } else {
                pageArr.push("<a href='javascript:void(0)' class='h_page-dis'>刷新</a>");
            }
            if(this.simpleRequest){
            	if (list != null && (list.length +1) > data.request_num) {
	                pageArr.push("<a href='javascript:void(0)' class='h_page-pgNext'>下一页</a>");
	            } else {
	                pageArr.push("<a href='javascript:void(0)' class='h_page-dis'>下一页</a>");
            	}
            }else{
	            if (list != null && list.length > data.request_num) {
	                pageArr.push("<a href='javascript:void(0)' class='h_page-pgNext'>下一页</a>");
	            } else {
	                pageArr.push("<a href='javascript:void(0)' class='h_page-dis'>下一页</a>");
            	}
            }
            var total_num = reqData.total;
            if (total_num != undefined) {
            	var pagesnum = Math.ceil(parseInt(total_num) / parseInt(data.request_num));
            	pageArr.push("<span>共"+pagesnum+"页，"+total_num+"条记录</span>")
            }
            var page = table.next("div.h_querytable_pages").html(pageArr.join(""));
//            table.next("div.h_pages").html(pageArr.join(""));
            // 增加事件
//            var page = table.next("div.h_pages");
            
            
            page.children("a.h_page-first").click(function(e) {
                return _this.firstpage.call(_this, table, e);
            });
            page.children("a.h_page-pgLast").click(function(e) {
                return _this.prevpage.call(_this, table, e);
            });
            page.children("a.h_page-pgNext").click(function(e) {
                return _this.nextpage.call(_this, table, e);
            });
            page.children("a.h_page-refresh").click(function(e) {
                return _this.refreshpage.call(_this, table, e);
            });
        }
    },
    /**
     * @ignore 
     * @description 加载数据集中的数据
     * 将该数据集中的数据展现在表格中，不发送请求
     * @function
     * @name Horn.QueryTable#loadData
     * @param {Array} reqData 数据集
     */
    loadData:function(reqData){
        this.callback(reqData);
        this.doCallBack(reqData);   //BUG #6532
    },
    /**
     * @ignore
     * @description 当某行被引用时会触发此事件。
     * @event
     * @name Horn.QueryTable#onRowSelect
     * @param {DOMDocument} tr 当前选择的行
     * @param {int} rowidx 行号
     * @param {object} vals 行数据
     */
    onRowSelect:function(){},
    /**
     * 所有被选中值
     * @ignore
     * @type {Array}
     */
    selecteds:null,
    /**
     * @description 选择所有行。
     * @function
     * @name Horn.QueryTable#selectAll
     */
    selectAll:function(){
    	var _this = this;
    	this.el.find('input:checkbox.h_querytable_select').each(function(idx,checkbox){
    		checkbox.checked = true;
    		if(_this.rowSelect==false){
    			$(checkbox).trigger('change');
    		}else{
    			_this.selectRow(idx);
    		}
    	});
    	this.el.find('.h_querytable_select_all').attr("checked", true);
    },
    /**
     * @ignore
     * @description 清除选择。
     * @function
     * @name Horn.QueryTable#unSelectAll
     */
    unSelectAll:function(){
    	var _this = this;
    	this.el.find('input:checkbox.h_querytable_select').each(function(idx,checkbox){
    		checkbox.checked = false;
    		if(_this.rowSelect==false){
    			$(checkbox).trigger('change');
    		}else{
    			_this.unSelectRow(idx);
    		}
    		   
    	});
    	this.el.find('.h_querytable_select_all').attr("checked", false);
    },
    /**
     * @ignore
     * @description 单选时最后选择的项目
     * @field
     * @name Horn.QueryTable#lastSelect
     * @default null
     */
    lastSelect:null,
    /**
     * @ignore
     * @description 是否多选
     * @field
     * @name Horn.QueryTable#mutiSelect
     * @default false
     */
    mutiSelect:false,
    /**
     * @description 选择某行
     * @function
     * @name Horn.QueryTable#selectRow
     * @param {int} rowidx  行索引
     * @param {JQuery} tr (可选)
     * @ignore
     */
    selectRow:function(rowidx,_tr){
    	var _table = this;
    	var tr = _tr;
    	if(!tr){
    		tr = $(this.el.find('tr').has('td').get(rowidx));    //BUG #6720
    	}
    	if(tr.length==0){
    		Horn.debug("querytable["+this.name+"]","选择的行"+rowidx+"不存在");
    		return false;
    	}
    	var vals = {};
		var ths = this.ths;
		var tds = tr.find('td');
		ths.each(function(thidx,_th){
			var td = tds.get(thidx),
				th = $(_th);
			vals[th.attr('name')] = th.attr('dictName') ? $(td).attr('key') :$(td).text();
		});
		_table.onRowSelect.call(tr,tr,rowidx,vals);
		this.selecteds[rowidx] = vals;
		if(!_table.mutiSelect) {
			var last = _table.lastSelect;
			if(last && last.rowidx !==undefined && last.rowidx != rowidx ){
				if(last.tr.find("input:radio").length>0){
					last.tr.find("input:radio").get(0).checked = false;//BUG #6574
				}
				_table.unSelectRow(last.rowidx,last.tr);
			}
			if(tr.find("input:radio").length>0){
				tr.find("input:radio").get(0).checked = true;   //选中radio//BUG #6574
			}
			
		}else{
			if(tr.find("input:checkbox").length>0){
				tr.find("input:checkbox").get(0).checked = true;   //选中checkbox
			}
			
		}
		_table.lastSelect = {
				rowidx:rowidx,
				tr:tr
			};
		tr.addClass("h_table-over");//选中行的样式
    },
    /**
     * @description 取消某行的选择
     * TODO 这里尚有些不成熟的地方，需要取消选择项的勾。
     * @function
     * @name Horn.QueryTable#unSelectRow
     * @param {DOMDocument} rowidx
     * @param {DOMDocument} tr 
     * @ignore
     */
    unSelectRow:function(rowidx,_tr){
    	var tr = _tr;
    	if(!tr){
    		tr = $(this.el.find('tr').has('td').get(rowidx));    //BUG #6720
    	}
    	this.selecteds[rowidx] =null;
    	delete this.selecteds[rowidx];
    	tr.removeClass("h_table-over");//取消选中行的样式
    	if(this.mutiSelect){
    		if(tr.find("input:checkbox").length>0){
    			tr.find("input:checkbox").get(0).checked = false;   //取消选中checkbox
    		}
    	}else{
    		if(tr.find("input:radio").length>0){
    			tr.find("input:radio").get(0).checked = false;     //取消单选radio//BUG #6574
    		}
    	}
    	//所有的选择项都取消后应该设置选择所有的checkbox为false
    	var _isNull=true;
    	for(var _name in this.selecteds){
    		_isNull=false;
    		break;
    	}
    	if(_isNull){
    		this.el.find('.h_querytable_select_all').attr("checked", false);
    	}
    },
    /**
     * @description 获取所有的选择项
     * @function
     * @name Horn.QueryTable#getSelecteds
     * @param {boolean} asSrcData(请求返回的原始数据)，如果为true，则返回的是原始数据，如果不传或为false，则是表格内显示的数据；
     * @return {Array} 返回选中的行数据
     */
    getSelecteds:function(asSrcData){
    	var selecteds = [];
    	if($.type(this.selecteds)=="array"){
    		for(var i=0;i<this.selecteds.length;i++){
        		var val = this.selecteds[i];
        		if(val){
        			selecteds.push(asSrcData?this.lastList[i]:val);
        		}
        	}
    	}else{
    		for(var key in this.selecteds){
        		var val = this.selecteds[key];
        		if(val){
        			selecteds.push(asSrcData?this.lastList[key]:val);
        		}
        	}
    	}
    	return selecteds;
    },
    /**
     * @ignore
     * 翻译字典 
     */
    dictTrans:function(){
    	var _table = this,
    		ths = this.ths,
    		trs = this.el.find("tr");
    	trs.each(function(idx,trdom){
    		var tr = $(trdom),
    			checkbox = _table.mutiSelect?tr.find("input:checkbox"):tr.find("input:radio")//BUG #6574
    		;
    		if(checkbox.hasClass('h_querytable_select')) { 
    			if(_table.rowSelect == false){           //BUG #6562 
	    			checkbox.change(function(){
		    			if(this.checked){
		    				_table.selectRow(idx-1,tr);
		    			}else{
		    				_table.unSelectRow(idx-1,tr);
		    			}
		    		});
    			}	
    		}
    		tr.find('td').each(function(tdidx,tddom){
    			var td = $(tddom);
    			var th = $(ths.get(tdidx));
	    		var dictName = th.attr("dictname"),
	    			renderer = th.attr('renderer'),
	    			buttons = th.data('buttons'),
	    			staticDict = th.data('staticDict');
	    		if( staticDict ){
                    td.attr("key",td.text());
	    			td.text( staticDict[td.text()] || td.text());
	    		}else if( dictName ){
	    			td.attr('key',td.text());
	    			var li = $('.hc_checkboxdiv[ref_target=' + dictName + '_s]' ).find("li[key="+td.text()+"]");
	    			td.text(li.attr('title')||td.text());
	    		}else if(buttons){
	    			var btns = buttons;
	    			var span = $("<span></span>");
	    			$(btns).each(function(idxx,btn){
	    				var fn = Horn.Util.getFunObj(btn.event);
	    				//如果没有这个function，则不装入这个button
	    				if(!fn.fn) return;
	    				var a = $("<a href='javascript:void(0)'>"+btn.label+"</a>");
	    				var text = td.text();
	    				a.click(function(){
	    					fn.fn.call(a,{
	    	    				val : text,
//	    	    				rowdata : _table.data[idx-1],
//	    	    				alldata : _table.data,
//	    	    				table : _table,
	    	    				rowidx : idx,
	    	    				tdidx : tdidx,
	    	    				tr : tr,
	    	    				td : td
	    	    			});
	    				});
	    				span.append(a);
	    				if(idxx!=(btns.length-1)){
	    					span.append(' | ');
	    				}
	    			});
//	    			if(showwhenover){ 
//	    				span.addClass('h_link-default');
//	    			}
	    			td.html('');
	    			td.append(span);
	    		}
	    		if(renderer){
	    			td.attr('key',td.text());
	    			var text = td.text();
	    			var fn = Horn.Util.getFunObj(renderer);
    				//如果没有这个function，则不装入这个button
    				if(!fn.fn) return;
	    			var dom = fn.fn.call($(this),{
	    				val : text,
//	    				rowdata : _table.data[idx-1],
//	    				alldata : _table.data,
//	    				table : _table,
	    				rowidx : idx,
	    				tdidx : tdidx,
	    				tr : tr,
	    				td : td
	    			});
	    			if( dom instanceof $ ){
	    				td.html("");
	    				td.append(dom);
	    			}else{
	    				td.html(dom);
	    			}
	    		}
    		});
    	});
    }
}) ;
/**
 * @lends Horn.QueryTable
 */
$.extend(Horn.QueryTable,{
	DATANAME : "QUERYTABLE",
	/**
	 * @ignore
	 * @description 根据名字获取页面table控件
     * @function
	 * @name Horn.QueryTable.get
	 */
	get : function(name){
		var table = null ;
		if(name){
			table = Horn.getComp(name);
		}
		else{
			table = Horn.data(Horn.QueryTable.DATANAME)[0] ;
		}
		return table ;
	}
}) ;
Horn.regUI("table.h_querytable",Horn.QueryTable) ;

/**
 * @name Horn.MessageBox
 * @class
 * 消息对话框的封装
 * @extends Horn.Base
 */
	
/**
 * @lends Horn.MessageBox#
 */

/**
 * @description 设置窗口标题
 * @property msgTitle
 * @name msgTitle
 * @type String
 * @default ""
 * @example
 * 无
 */

/**
 * @description 设置内容
 * @property msgText
 * @name msgText
 * @type String
 * @default ""
 * @example
 * 无
 */

/**
 * @description 设置宽度
 * @property width
 * @name width
 * @type num
 * @default 50%
 * @example
 * 无
 */

/**
 * @description 设置高度
 * @property height
 * @name height
 * @type num
 * @default 50%
 * @example
 * 无
 */

/**
 * @description 设置对话框类型
 * @property msgType
 * @name msgType
 * @type String
 * @default
 * @example
 * 无
 * @ignore
 */

var Horn = Horn || {};
;(function(H){

	var createMessageBox = function(params){
		var msgHtml = '<div class="h_floatdiv h_floatdiv-extend"  id="h_msg_floatdiv">'+
			         '<div class="h_floatdiv-title"><span></span></div>'+
			         '<div class="h_floatdiv-con" >'+
			            '<div class="hc_prompt msg-type-icon">'+
			              '<h2 class="hc_prompt-title"></h2>'+
			              '<div class="hc_prompt-detail"></div>'+
			            '</div>'+
			         '</div>'+
			         '<div class="h_btndiv h_btn-right"></div>'+
			       '</div>';
		var temp = $(msgHtml);
		
		if(params.msgTitle){
			temp.find('.h_floatdiv-title span').html(params.msgTitle);
			temp.find('.h_floatdiv-title').attr("title",params.msgTitle);
		}
		if(params.msgText){
			temp.find('.hc_prompt-detail').html(params.msgText);
		}
		if(params.width){
			temp.css("width",params.width+"px");
		}
		if(params.height){
			temp.css("height",params.height+"px");
		}else{
			temp.css("height","auto");
		}
		if(params.msgType){
			temp.find('.msg-type-icon').removeClass('msg-type-icon').addClass(params.msgType);
		}
		
		/**
		 * 展现确定按钮
		 */
	    var OK = "<button type=\"button\" id=\"buttonOK\" class=\"h_btn-submit\">确定</button>";
		/**
		 * 展现取消按钮
		 */
		var CANCEL ="<button type=\"button\" id=\"buttonCancel\" class=\"h_btn-cencel\">取消</button>";
		/**
		 * 展现确定取消按钮
		 */
		var OKCANCEL = OK + CANCEL;
		if(params.msgType && params.msgType == Horn.Msg.CONFIRM){
	    	temp.find('.h_btndiv').html(OKCANCEL);
	    }else{
	    	temp.find('.h_btndiv').html(OK);
	    }
		
   	var	currentMessageBox = $('<div></div>').append('<div class="h_floatdiv-backdrop" id="h_msg_bg"></div>').append(temp.clone());
   	var currentOkBtn=currentMessageBox.find(".h_btn-submit");
   	if(currentOkBtn.length>0){
   		currentOkBtn.unbind("click");
   		currentOkBtn.bind("click",function(){
   			currentMessageBox.remove();
   			if(Horn.Window.getPrevOpen()<1){
					$("body").removeClass("h-overflow-hidden");
					$("html").removeClass("h-overflow-hidden");
				}
   			if(params.onOK){
   				params.onOK();	
   			}
   		});	
   	}
   	var currentCancelBtn=currentMessageBox.find(".h_btn-cencel");
   	if(currentCancelBtn.length>0){
   		currentCancelBtn.unbind("click");
   		currentCancelBtn.bind("click",function(){
   			currentMessageBox.remove();
   			if(Horn.Window.getPrevOpen()<1){
					$("body").removeClass("h-overflow-hidden");
					$("html").removeClass("h-overflow-hidden");
				}
   			if(params.onCancel){
					params.onCancel();
				}
   		});	
   	}
   	currentMessageBox.find(".h_floatdiv-backdrop").css("z-index",Horn.Window.getNextZIndex());
   	currentMessageBox.find(".h_floatdiv-extend").css("z-index",Horn.Window.getNextZIndex());
		if(Horn.Window.getOpen()<1){
			$("body").addClass("h-overflow-hidden");
			$("html").addClass("h-overflow-hidden");
		}
		Horn.Window.getNextOpen();
		$('body').prepend(currentMessageBox);
		fixSize(currentMessageBox.find(".h_floatdiv-extend"));
		$(window).resize(function(){
			if(currentMessageBox&&!currentMessageBox.is(":hidden")){
				fixSize(currentMessageBox.find(".h_floatdiv-extend"));
			}
		});
		currentMessageBox.mousewheel(function() {
			return false;
		});
	};

	
	var fixSize = function(currentMessage){
		var win = $(window), el = currentMessage,subHeightRange = 0, subWidthRange = 0;
		var tHeight = win.height();
		var tWidth = win.width();
		var wHeight = el.height();
		var wWidth = el.width();
		subHeightRange = tHeight - wHeight;
		subWidthRange = tWidth - wWidth;
		var wTop = subHeightRange / 2 + $(document).scrollTop();
		var wLeft = subWidthRange / 2 + $(document).scrollLeft();
		el.css("top", wTop + "px");
		el.css("left", wLeft + "px");
	};     
	var _show = function(settings){
		this.params = {width:350};
		Horn.apply(this.params,settings);
		createMessageBox(this.params);
	};
	H.Msg = {
			/**
			 * info提示的样式
			 * @ignore
			 */
			INFO : "hc_prompt-succeed",
			/**
			 * 警告提示的样式
			 * @ignore
			 */
			WARNING : "hc_prompt-warn",
			/**
			 * 出错提示的样式
			 * @ignore
			 */
			ERROR :"hc_prompt-wrong",
			/**
			 * 确认提示的样式
			 * @ignore
			 */
			CONFIRM : "hc_prompt-present",
		
			/**
			 * 根据自定义配置展现对话框
			 * @name Horn.MessageBox#show
			 * @function
			 * @params settings 
			 * @ignore
			 * @example
			 *	msgTitle {String} 对话框标题
			 *	msgText {String} 对话框文本内容 
			 *	width {num} 对话框宽度
			 *	height {num}对话框高度
			 *	msgType () 对话框类型 分为info提示：Horn.Msg.INFO; 警告提示：Horn.Msg.WARNING; 出错提示：Horn.Msg.ERROR; 确认提示：Horn.Msg.CONFIR
			 */
			show :function(settings){
				_show(settings);
			},
			/**
			 * 只带确定按钮的提示窗，用于操作成功后的提示
			 * @name Horn.MessageBox#alert
			 * @function
			 * @param {String} title 显示标题<b>建议不要超过20个字符，否则影响正常展示</b>
			 * @param {String} text 显示信息<b>建议不要超过80个字符，否则影响正常展示</b>
			 * @param {Function} fn 回调函数
			 */
			alert : function(title,text,fn){
				var settings = {
						"msgTitle" :title,
						"msgText" :text,
						"onOK" : fn,
						"msgType" : this.INFO
				};
				_show(settings);
			},
			/**
			 * 只带确定按钮的警告提示窗
			 * @name Horn.MessageBox#warning
			 * @function
			 * @param {String} title 显示标题<b>建议不要超过20个字符，否则影响正常展示</b>
			 * @param {String} text 显示信息<b>建议不要超过80个字符，否则影响正常展示</b>
			 * @param {Function} fn 回调函数
			 */
			warning : function(title,text,fn){
				var settings = {
						"msgTitle" :title,
						"msgText" :text,
						"onOK" : fn,
						"msgType" : this.WARNING
				};
				_show(settings);
			},
			wraning : function(title,text,fn){
				var settings = {
						"msgTitle" :title,
						"msgText" :text,
						"onOK" : fn,
						"msgType" : this.WARNING
				};
				_show(settings);
			},
			/**
			 * 只带确定按钮的错误提示窗
			 * @name Horn.MessageBox#error
			 * @function
			 * @param {String} title 显示标题<b>建议不要超过20个字符，否则影响正常展示</b>
			 * @param {String} text 显示信息<b>建议不要超过80个字符，否则影响正常展示</b>
			 * @param {Function} fn 回调函数
			 */
			error : function(title,text,fn){
				var settings = {
						"msgTitle" :title,
						"msgText" :text,
						"onOK" : fn,
						"msgType" : this.ERROR
				};
				_show(settings);
			},
			/**
			 * 带确定、取消按钮的确认对话框
			 * @name Horn.MessageBox#confirm
			 * @function
			 * @param {String} title 显示标题<b>建议不要超过20个字符，否则影响正常展示</b>
			 * @param {String} text 显示信息<b>建议不要超过80个字符，否则影响正常展示</b>
			 * @param {Function} okFn ok回调函数
			 * @param {Function} cancelFn 取消回调函数
			 */
			confirm : function(title,text,okfn,cancelfn){
				var settings = {
						"msgTitle" :title,
						"msgText" :text,
						"onOK" : okfn,
						"onCancel" : cancelfn,
						"msgType" : this.CONFIRM
				};
				_show(settings);
			}
	};
	
})(Horn);
/**
 * @name Horn.Canvas
 * @class
 * canvas容器<br/>
 * 可以放置其它的容器如：panel等等
 */
/**
 * @lends Horn.Canvas#
 */
	 
/**
 * 组件的唯一标示
 * @name Horn.Canvas#<b>id</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 组件的名称
 * @name Horn.Canvas#<b>name</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 标题
 * @name Horn.Canvas#<b>title</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
	 
/**
 * 状态（折叠collapse或展开expand）
 * @name Horn.Canvas#<b>state</b>
 * @type String
 * @default "expand"
 * @example
 * 无
 */
	
/**
 * 状态切换时触发的回调
 * @name Horn.Canvas#<b>toggle</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
Horn.Canvas = Horn.extend(Horn.Base,{
	COMPONENT_CLASS:"Canvas",
    name:"",
    canvas:null,
    canvas_content:null,
    canvas_title:null,
    canvas_title_icon:null,
    init : function(){
        Horn.Canvas.superclass.init.apply(this,arguments) ;
        var _this = this;
        this.canvas = this.el;
        this.name = this.canvas.attr("name");
        this.canvas_title = this.canvas.children().first();
        this.canvas_title_icon = this.canvas_title.children().first();
        this.canvas_content = this.canvas_title.next();
        var toggleObj;
        var toggle = this.canvas.attr("toggle");
        if (toggle) {
            toggleObj = Horn.Util.getFunObj(toggle);
            if($.type(toggleObj.fn) == "function"){
                this.toggleFnObj = toggleObj;
            }
        }
        this.canvas_title_icon.bind({
            click : function() {
                if ($(this).hasClass("hc_open")) {
                    _this.collapse();
                } else {
                    _this.expand();
                }
            }
        });
    },
    /**
     * 触发状态切换
     * @name Horn.Canvas#toggle
     * @function
     * @param {String} 传递数据
     * @ignore
     */
    toggle:function(state){
    	var toggleFnObj = this.toggleFnObj;
        if(!state){
        	if ($(this.canvas_title_icon).hasClass("hc_open")) {
                this.collapse();
            } else {
                this.expand();
            }
        }
        if(toggleFnObj){
    		var toggleFn = toggleFnObj.fn;
            var params = toggleFnObj.params.slice(0);
            params.push(state);
            toggleFn.apply(this,params);
        }
    },
    /**
     * @name Horn.Canvas#onExpand
     * @event
     * @description 当展开时执行
     * @ignore
     */
    onExpand:function(){
    
    },
    /**
     * 展开
     * @name Horn.Canvas#expand
     * @function
     */
    expand : function() {
        var content = this.canvas_content;
        if (content.css("display") == "none") {
            content.css("display", "block");
        }
        if (content.css("visibility") == "hidden") {
            content.css("visibility", "visible");
        }
	    $(this.canvas_title_icon).removeClass("hc_close");
	    $(this.canvas_title_icon).addClass("hc_open");
	    this.toggle("expand");
    },
    /**
     * 收起
     * @name Horn.Canvas#collapse
     * @function collapse(mode),mode的取值为display,visibility
     * @param 收起方式display则隐藏显示,visibility不可见但占位置
     */
    collapse : function(_mode) {//display   visibility
        var content = this.canvas_content;
        var mode = "display" || _mode ;
        if(mode=="display"){
            content.css("display", "none");
        }
        else{
            content.css("visibility", "hidden");
        }
        $(this.canvas_title_icon).removeClass("hc_open");
        $(this.canvas_title_icon).addClass("hc_close");
        this.toggle("collapse");
    }
}) ;
/**
 * 将canvas弹出和隐藏的方法 
 */
$.extend(Horn.Canvas,{
    /**
     * @description  canvas弹出
     * @function
     * @name Horn.Canvas.expand
     * @param {dom} obj 弹出的对象
     * @ignore
     */
	expand:function(obj){
		obj.expand();
	},
	/**
     * @description  canvas隐藏
     * @function
     * @name Horn.Canvas.collapse
     * @param {dom} obj 隐藏的对象
     * @param {string} mode 取值display或visibility
     * @ignore
     */
	collapse:function(obj,mode){
		obj.collapse(mode);
	}
});
Horn.regUI("div.hc_canvas",Horn.Canvas);
/*
 * -----------------------------------------------------------------------
 * 修订纪录
 * 2014-3-11 		谢晶晶		修正注释文档
 * -----------------------------------------------------------------------
 */
/**
 * @name Horn.ZtreePanel
 * @class
 * ztree封装组件</br>
 * 基于ztree进行封装简单树形展示组件，没有复杂的功能仅做为展示使用
 */
/**
 * @lends Horn.ZtreePanel#
 */
	 
 /**
 * 组件的唯一标示
 * @name Horn.ZtreePanel#<b>id</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 组件的名称
 * @name Horn.ZtreePanel#<b>name</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
	 
/**
 * 静态数据
 * @name Horn.ZtreePanel#<b>data</b>
 * @type String
 * @default 
 * @example
 * '[{"id":"1","name":"root"},{"id":"21","name":"sub11","pId":"1"},{"id":"22","name":"sub12","pId":"1"}]'
 */
	
/**
 * 选择模式"checkbox","radio"
 * @name Horn.ZtreePanel#<b>checkMode</b>
 * @type String 
 * @default 
 * @example
 * 无
 */
	
/**
 * 展开第一个
 * @name Horn.ZtreePanel#<b>expandFirst</b>
 * @type Boolean
 * @default false
 * @example
 * 无
 */

/**
 * 重新渲染的回调函数
 * @name Horn.ZtreePanel#<b>reRenderFn</b>
 * @type String
 * @default 
 * @example
 * reRender="nodeRender"
 * function nodeRender(srcNode,newDom){
 * 	newDom.before("<span>*</span>")
 * }
 */
	
/**
 * 节点被点击后触发的函数
 * @name Horn.ZtreePanel#<b>nodeclick</b>
 * @type String
 * @default 
 * @example
 * 如："nodeclick"="onNodeClick"
 * 有：function onNodeClick(event, treeId, treeNode, clickFlag){}
 */
	
/**
 * 节点点击前触发的函数,return false则取消点击事件执行
 * @name Horn.ZtreePanel#<b>beforenodeclick</b>
 * @type String
 * @default 
 * @example
 * 无
 */
Horn.ZtreePanel = Horn.extend(Horn.Base,{
	COMPONENT_CLASS:"ZtreePanel",
    /**
     * 引用的dom对象
     * @field
     * @name Horn.ZtreePanel#el
     * @type {HTMLDomDocument}
     * @ignore
     */
	el:null,
    /**
     * 异步调用时使用的url，用于进行动态加载节点
     * @field
     * @name Horn.ZtreePanel#url
     * @type {string}
     * @ignore
     */
	url:null,
    /**
     * 异步调用时使用的params
     * @field
     * @name Horn.ZtreePanel#params
     * @type {Object}
     * @ignore
     */
	params:null,
    /**
     * 静态载入时使用的Data,或用作初始化使用
     * @field
     * @name Horn.ZtreePanel#treedata
     * @type {Object}
     * @ignore
     */
	treedata:null,

	beforeClick : function(){
		return true;
	},
	onClick : function(){
		
	},
	check : false,
	chkStyle : 'checkbox',
	init : function(dom) {
		Horn.ZtreePanel.superclass.init.apply(this,arguments) ;
		this.treeEl = this.el.find('.ztree');
		var _tree = this;
		if(this.el.attr('treeclick')) {
			var fn = this.el.attr('treeclick');
			if(fn){
				fn = window[fn];
			}
			this.onClick = fn;
		}
		if(this.el.attr('beforetreeclick')) {
			var fn = this.el.attr('beforetreeclick');
			if(fn){
				fn = window[fn];
			}
			this.beforeClick = fn;
		}
		if(this.el.attr('reRenderFn')) {
			var fn = this.el.attr('reRenderFn');
			if(fn){
				fn = window[fn];
			}
			this.reRender = fn;
		}
		
       	var setting = {
			data: {
				simpleData: {
					enable: true
				}
			},
			view: {
				nameIsHTML: true,
				showLine: false,
				showIcon: true,
				showTitle : true,
				selectedMulti: true,
				dblClickExpand: true,
				addDiyDom: function(treeId, treeNode){
					var IDMark_A = "_a";
					var aObj = $("#" + treeNode.tId + IDMark_A);
					_tree.reRender(treeNode,aObj);
				}
			},
			callback: {
				beforeClick: this.beforeClick,
				onClick : this.onClick
			}
		};
		var checkMode = this.el.attr('checkMode');
		if(checkMode){
			setting.check = {
				enable : true,
				chkStyle : checkMode
			};
		}
       	var data =  this.el.attr("items");
		if(data){
			data = $.parseJSON(data);
		}else{
			data = [];
		}
		var treeObj = this.treeEl;
		var treeid = this.treeEl.attr('id');
		if(!treeid){
			treeid = Horn.id();
			this.treeEl.attr('id',treeid);
		}
		$.fn.zTree.init(treeObj, setting, data);
		this.treedata = data;
		this.treeObj = $.fn.zTree.getZTreeObj(treeid);
		if(this.el.attr('expandfirst')){
			this.treeObj.expandAll(true);
		}
	},
    /**
     * 指定渲染函数
     * @name Horn.ZtreePanel#reRender
     * @function
     * @param {HTMLDomDocument} srcNode 源树节点
     * @param {HTMLDomDocument} treeNodeObj　目标树节点
     * @ignore
     */
	reRender : function(srcNode,treeNodeObj){
	},
    /**
     * 获取树
     * @name Horn.ZtreePanel#getTreeObj
     * @function
     * @return {ztree object} treeObj
     */
	getTreeObj:function(){
		return this.treeObj;
	},
    /**
     * 获取选中的节点
     * @name Horn.ZtreePanel#getCheckedNodes
     * @function
     * @return {ztree.getCheckedNodes}
     */
	getCheckedNodes:function(){
		return this.treeObj.getCheckedNodes();
	}
});

Horn.regUI("div.h_ztree",Horn.ZtreePanel);
/*
 * -----------------------------------------------------------------------
 * 修订纪录
 * 2014-3-11 		韩寅		完善注释为标准的jsdoc
 * -----------------------------------------------------------------------
 */
/**
 * @name Horn.ImagerPanel
 * @class
 * 图片查看组件</br>
 * 一个简单的图片展示控件，暂仅作bate版本。
 */
	 
/**@lends Horn.ImagerPanel# */

/**
 * 组件的唯一标示
 * @name Horn.ImagerPanel#<b>id</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 组件的名称
 * @name Horn.ImagerPanel#<b>name</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 图片的宽度
 * @name Horn.ImagerPanel#<b>width</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 图片的高度
 * @name Horn.ImagerPanel#<b>height</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 图片是否自适应（超出则出现滚动条）
 * @name Horn.ImagerPanel#<b>imageautoresize</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 图片地址列表
 * @name Horn.ImagerPanel#<b>items</b>
 * @type Array
 * @default 无
 * @example
 * 无
 */
/**
 * 如果图片未找到时使用的替代图片
 * @name Horn.ImagerPanel#<b>notfound</b>
 * @type String
 * @default ""
 * @example
 * 无
 */

	Horn.ImagerPanel = Horn.extend(Horn.Base,{
		COMPONENT_CLASS:"ImagerPanel",
		/**
		 * 引用的dom对象
		 * @type {HTMLDomDocument}
		 */
		el:null,
		images:[],
		NOTFOUND_IMG:"",
		nextText:"点击显示下一张",
		shown:{no:0,img:null},
		init : function(dom) {
			Horn.ImagerPanel.superclass.init.apply(this,arguments) ;
			this.initImages();
		},
		initImages:function(){
			var images = this.el.children('img')
				,_imager = this
				,width = this.el.attr('xwidth')|| this.el.width()||500
				,height = this.el.attr('xheight')|| this.el.height()||400
				;
			_imager.el.css('width',width);
			_imager.el.css('height',height);
			_imager.el.css('overflow','auto');
			images.each(function(idx,img){
				img = $(img);
				img.attr('title',this.nextText);
				_imager.images.push(img);
				if(img.hasClass("h_img_show")){
					_imager.shown = {
						no:idx,
						img:img
					};
				}
			});
			images.click(function(){
				_imager.next();
			});
			images.error(function(){
				this.src = _imager.el.attr('notfound')|| Horn.ImagerPanel.NOTFOUND_IMG;
			});
			
		},
		/**
         * @description  显示指定的图片
         * @function
         * @name Horn.ImagerPanel#showImg
         * @param no 第几张
         */
		showImg : function(no){
			if((no+1)> this.images.length || no<0) {
				no=0;
			}
			var now = this.shown.img;
			var next = this.images[no];
			if(now) {
				now.removeClass('h_img_show');
			}
			if(next){
				next.addClass('h_img_show');
			}
			this.shown={
				no:no,
				img:next
			};
		},
		 /**
         * @description  显示下一张图片
         * @function
         * @name Horn.ImagerPanel#next
         */
		next : function(){
			this.showImg(this.shown.no+1);
		},
		 /**
         * @description  显示上一张图片
         * @function
         * @name Horn.ImagerPanel#prev
         */
		prev : function(){
			this.showImg(this.shown.no-1);
		},
        /**
         * @description  设置图片
         * @function
         * @name Horn.ImagerPanel#setImages
         * @param {array} imgarr 图片url地址数组
         */
		setImages : function(imgarr){
			$(this.images).each(function(idx,item){
			 	item.remove();
			});
			var _imager = this;
			$(imgarr).each(function(idx,imgStr){
				_imager.el.append('<img '+ ( idx==0?'class="h_img_show"':'')+' src="'+imgStr+'" />');
			});
			this.initImages();
		}
	});
	$.extend(Horn.ImagerPanel,{
        /**
         * @description  图片未找到时，默认替代图片
         * @field
         * @name Horn.ImagerPanel.NOTFOUND_IMG
         * @default ""
         */
			NOTFOUND_IMG:""
		});
	Horn.regUI("div.h_imager",Horn.ImagerPanel);

/**
 * @description 图片查看箱
 * @class
 * @name Horn.ImageBox
 * @extends Horn.Base
 * @example
 * \#imagebox({"name":"aa","width":"400","height":"400",
 * "win_w":"900","win_h":"600",
 * "items":['http://localhost:8082/JresAPI/images/demo/i1.jpg','http://localhost:8082/JresAPI/images/demo/Koala.jpg','http://localhost:8082/JresAPI/images/demo/i6.jpg']})
 */
/**
 * @lends Horn.ImageBox#
 */
var Horn = Horn ||{};
;(function(H,$){
	/*!	SWFObject v2.2 <http://code.google.com/p/swfobject/> 
	is released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/

var swfobject = function() {
	
	var UNDEF = "undefined",
		OBJECT = "object",
		SHOCKWAVE_FLASH = "Shockwave Flash",
		SHOCKWAVE_FLASH_AX = "ShockwaveFlash.ShockwaveFlash",
		FLASH_MIME_TYPE = "application/x-shockwave-flash",
		EXPRESS_INSTALL_ID = "SWFObjectExprInst",
		ON_READY_STATE_CHANGE = "onreadystatechange",
		
		win = window,
		doc = document,
		nav = navigator,
		
		plugin = false,
		domLoadFnArr = [main],
		regObjArr = [],
		objIdArr = [],
		listenersArr = [],
		storedAltContent,
		storedAltContentId,
		storedCallbackFn,
		storedCallbackObj,
		isDomLoaded = false,
		isExpressInstallActive = false,
		dynamicStylesheet,
		dynamicStylesheetMedia,
		autoHideShow = true,
	
	/* Centralized function for browser feature detection
		- User agent string detection is only used when no good alternative is possible
		- Is executed directly for optimal performance
	*/	
	ua = function() {
		var w3cdom = typeof doc.getElementById != UNDEF && typeof doc.getElementsByTagName != UNDEF && typeof doc.createElement != UNDEF,
			u = nav.userAgent.toLowerCase(),
			p = nav.platform.toLowerCase(),
			windows = p ? /win/.test(p) : /win/.test(u),
			mac = p ? /mac/.test(p) : /mac/.test(u),
			webkit = /webkit/.test(u) ? parseFloat(u.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : false, // returns either the webkit version or false if not webkit
			ie = !+"\v1", // feature detection based on Andrea Giammarchi's solution: http://webreflection.blogspot.com/2009/01/32-bytes-to-know-if-your-browser-is-ie.html
			playerVersion = [0,0,0],
			d = null;
		if (typeof nav.plugins != UNDEF && typeof nav.plugins[SHOCKWAVE_FLASH] == OBJECT) {
			d = nav.plugins[SHOCKWAVE_FLASH].description;
			if (d && !(typeof nav.mimeTypes != UNDEF && nav.mimeTypes[FLASH_MIME_TYPE] && !nav.mimeTypes[FLASH_MIME_TYPE].enabledPlugin)) { // navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin indicates whether plug-ins are enabled or disabled in Safari 3+
				plugin = true;
				ie = false; // cascaded feature detection for Internet Explorer
				d = d.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
				playerVersion[0] = parseInt(d.replace(/^(.*)\..*$/, "$1"), 10);
				playerVersion[1] = parseInt(d.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
				playerVersion[2] = /[a-zA-Z]/.test(d) ? parseInt(d.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0;
			}
		}
		else if (typeof win.ActiveXObject != UNDEF) {
			try {
				var a = new ActiveXObject(SHOCKWAVE_FLASH_AX);
				if (a) { // a will return null when ActiveX is disabled
					d = a.GetVariable("$version");
					if (d) {
						ie = true; // cascaded feature detection for Internet Explorer
						d = d.split(" ")[1].split(",");
						playerVersion = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
					}
				}
			}
			catch(e) {}
		}
		return { w3:w3cdom, pv:playerVersion, wk:webkit, ie:ie, win:windows, mac:mac };
	}(),
	
	/* Cross-browser onDomLoad
		- Will fire an event as soon as the DOM of a web page is loaded
		- Internet Explorer workaround based on Diego Perini's solution: http://javascript.nwbox.com/IEContentLoaded/
		- Regular onload serves as fallback
	*/ 
	onDomLoad = function() {
		if (!ua.w3) { return; }
		if ((typeof doc.readyState != UNDEF && doc.readyState == "complete") || (typeof doc.readyState == UNDEF && (doc.getElementsByTagName("body")[0] || doc.body))) { // function is fired after onload, e.g. when script is inserted dynamically 
			callDomLoadFunctions();
		}
		if (!isDomLoaded) {
			if (typeof doc.addEventListener != UNDEF) {
				doc.addEventListener("DOMContentLoaded", callDomLoadFunctions, false);
			}		
			if (ua.ie && ua.win) {
				doc.attachEvent(ON_READY_STATE_CHANGE, function() {
					if (doc.readyState == "complete") {
						doc.detachEvent(ON_READY_STATE_CHANGE, arguments.callee);
						callDomLoadFunctions();
					}
				});
				if (win == top) { // if not inside an iframe
					(function(){
						if (isDomLoaded) { return; }
						try {
							doc.documentElement.doScroll("left");
						}
						catch(e) {
							setTimeout(arguments.callee, 0);
							return;
						}
						callDomLoadFunctions();
					})();
				}
			}
			if (ua.wk) {
				(function(){
					if (isDomLoaded) { return; }
					if (!/loaded|complete/.test(doc.readyState)) {
						setTimeout(arguments.callee, 0);
						return;
					}
					callDomLoadFunctions();
				})();
			}
			addLoadEvent(callDomLoadFunctions);
		}
	}();
	
	function callDomLoadFunctions() {
		if (isDomLoaded) { return; }
		try { // test if we can really add/remove elements to/from the DOM; we don't want to fire it too early
			var t = doc.getElementsByTagName("body")[0].appendChild(createElement("span"));
			t.parentNode.removeChild(t);
		}
		catch (e) { return; }
		isDomLoaded = true;
		var dl = domLoadFnArr.length;
		for (var i = 0; i < dl; i++) {
			domLoadFnArr[i]();
		}
	}
	
	function addDomLoadEvent(fn) {
		if (isDomLoaded) {
			fn();
		}
		else { 
			domLoadFnArr[domLoadFnArr.length] = fn; // Array.push() is only available in IE5.5+
		}
	}
	
	/* Cross-browser onload
		- Based on James Edwards' solution: http://brothercake.com/site/resources/scripts/onload/
		- Will fire an event as soon as a web page including all of its assets are loaded 
	 */
	function addLoadEvent(fn) {
		if (typeof win.addEventListener != UNDEF) {
			win.addEventListener("load", fn, false);
		}
		else if (typeof doc.addEventListener != UNDEF) {
			doc.addEventListener("load", fn, false);
		}
		else if (typeof win.attachEvent != UNDEF) {
			addListener(win, "onload", fn);
		}
		else if (typeof win.onload == "function") {
			var fnOld = win.onload;
			win.onload = function() {
				fnOld();
				fn();
			};
		}
		else {
			win.onload = fn;
		}
	}
	
	/* Main function
		- Will preferably execute onDomLoad, otherwise onload (as a fallback)
	*/
	function main() { 
		if (plugin) {
			testPlayerVersion();
		}
		else {
			matchVersions();
		}
	}
	
	/* Detect the Flash Player version for non-Internet Explorer browsers
		- Detecting the plug-in version via the object element is more precise than using the plugins collection item's description:
		  a. Both release and build numbers can be detected
		  b. Avoid wrong descriptions by corrupt installers provided by Adobe
		  c. Avoid wrong descriptions by multiple Flash Player entries in the plugin Array, caused by incorrect browser imports
		- Disadvantage of this method is that it depends on the availability of the DOM, while the plugins collection is immediately available
	*/
	function testPlayerVersion() {
		var b = doc.getElementsByTagName("body")[0];
		var o = createElement(OBJECT);
		o.setAttribute("type", FLASH_MIME_TYPE);
		var t = b.appendChild(o);
		if (t) {
			var counter = 0;
			(function(){
				if (typeof t.GetVariable != UNDEF) {
					var d = t.GetVariable("$version");
					if (d) {
						d = d.split(" ")[1].split(",");
						ua.pv = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
					}
				}
				else if (counter < 10) {
					counter++;
					setTimeout(arguments.callee, 10);
					return;
				}
				b.removeChild(o);
				t = null;
				matchVersions();
			})();
		}
		else {
			matchVersions();
		}
	}
	
	/* Perform Flash Player and SWF version matching; static publishing only
	*/
	function matchVersions() {
		var rl = regObjArr.length;
		if (rl > 0) {
			for (var i = 0; i < rl; i++) { // for each registered object element
				var id = regObjArr[i].id;
				var cb = regObjArr[i].callbackFn;
				var cbObj = {success:false, id:id};
				if (ua.pv[0] > 0) {
					var obj = getElementById(id);
					if (obj) {
						if (hasPlayerVersion(regObjArr[i].swfVersion) && !(ua.wk && ua.wk < 312)) { // Flash Player version >= published SWF version: Houston, we have a match!
							setVisibility(id, true);
							if (cb) {
								cbObj.success = true;
								cbObj.ref = getObjectById(id);
								cb(cbObj);
							}
						}
						else if (regObjArr[i].expressInstall && canExpressInstall()) { // show the Adobe Express Install dialog if set by the web page author and if supported
							var att = {};
							att.data = regObjArr[i].expressInstall;
							att.width = obj.getAttribute("width") || "0";
							att.height = obj.getAttribute("height") || "0";
							if (obj.getAttribute("class")) { att.styleclass = obj.getAttribute("class"); }
							if (obj.getAttribute("align")) { att.align = obj.getAttribute("align"); }
							// parse HTML object param element's name-value pairs
							var par = {};
							var p = obj.getElementsByTagName("param");
							var pl = p.length;
							for (var j = 0; j < pl; j++) {
								if (p[j].getAttribute("name").toLowerCase() != "movie") {
									par[p[j].getAttribute("name")] = p[j].getAttribute("value");
								}
							}
							showExpressInstall(att, par, id, cb);
						}
						else { // Flash Player and SWF version mismatch or an older Webkit engine that ignores the HTML object element's nested param elements: display alternative content instead of SWF
							displayAltContent(obj);
							if (cb) { cb(cbObj); }
						}
					}
				}
				else {	// if no Flash Player is installed or the fp version cannot be detected we let the HTML object element do its job (either show a SWF or alternative content)
					setVisibility(id, true);
					if (cb) {
						var o = getObjectById(id); // test whether there is an HTML object element or not
						if (o && typeof o.SetVariable != UNDEF) { 
							cbObj.success = true;
							cbObj.ref = o;
						}
						cb(cbObj);
					}
				}
			}
		}
	}
	
	function getObjectById(objectIdStr) {
		var r = null;
		var o = getElementById(objectIdStr);
		if (o && o.nodeName == "OBJECT") {
			if (typeof o.SetVariable != UNDEF) {
				r = o;
			}
			else {
				var n = o.getElementsByTagName(OBJECT)[0];
				if (n) {
					r = n;
				}
			}
		}
		return r;
	}
	
	/* Requirements for Adobe Express Install
		- only one instance can be active at a time
		- fp 6.0.65 or higher
		- Win/Mac OS only
		- no Webkit engines older than version 312
	*/
	function canExpressInstall() {
		return !isExpressInstallActive && hasPlayerVersion("6.0.65") && (ua.win || ua.mac) && !(ua.wk && ua.wk < 312);
	}
	
	/* Show the Adobe Express Install dialog
		- Reference: http://www.adobe.com/cfusion/knowledgebase/index.cfm?id=6a253b75
	*/
	function showExpressInstall(att, par, replaceElemIdStr, callbackFn) {
		isExpressInstallActive = true;
		storedCallbackFn = callbackFn || null;
		storedCallbackObj = {success:false, id:replaceElemIdStr};
		var obj = getElementById(replaceElemIdStr);
		if (obj) {
			if (obj.nodeName == "OBJECT") { // static publishing
				storedAltContent = abstractAltContent(obj);
				storedAltContentId = null;
			}
			else { // dynamic publishing
				storedAltContent = obj;
				storedAltContentId = replaceElemIdStr;
			}
			att.id = EXPRESS_INSTALL_ID;
			if (typeof att.width == UNDEF || (!/%$/.test(att.width) && parseInt(att.width, 10) < 310)) { att.width = "310"; }
			if (typeof att.height == UNDEF || (!/%$/.test(att.height) && parseInt(att.height, 10) < 137)) { att.height = "137"; }
			doc.title = doc.title.slice(0, 47) + " - Flash Player Installation";
			var pt = ua.ie && ua.win ? "ActiveX" : "PlugIn",
				fv = "MMredirectURL=" + encodeURI(window.location).toString().replace(/&/g,"%26") + "&MMplayerType=" + pt + "&MMdoctitle=" + doc.title;
			if (typeof par.flashvars != UNDEF) {
				par.flashvars += "&" + fv;
			}
			else {
				par.flashvars = fv;
			}
			// IE only: when a SWF is loading (AND: not available in cache) wait for the readyState of the object element to become 4 before removing it,
			// because you cannot properly cancel a loading SWF file without breaking browser load references, also obj.onreadystatechange doesn't work
			if (ua.ie && ua.win && obj.readyState != 4) {
				var newObj = createElement("div");
				replaceElemIdStr += "SWFObjectNew";
				newObj.setAttribute("id", replaceElemIdStr);
				obj.parentNode.insertBefore(newObj, obj); // insert placeholder div that will be replaced by the object element that loads expressinstall.swf
				obj.style.display = "none";
				(function(){
					if (obj.readyState == 4) {
						obj.parentNode.removeChild(obj);
					}
					else {
						setTimeout(arguments.callee, 10);
					}
				})();
			}
			createSWF(att, par, replaceElemIdStr);
		}
	}
	
	/* Functions to abstract and display alternative content
	*/
	function displayAltContent(obj) {
		if (ua.ie && ua.win && obj.readyState != 4) {
			// IE only: when a SWF is loading (AND: not available in cache) wait for the readyState of the object element to become 4 before removing it,
			// because you cannot properly cancel a loading SWF file without breaking browser load references, also obj.onreadystatechange doesn't work
			var el = createElement("div");
			obj.parentNode.insertBefore(el, obj); // insert placeholder div that will be replaced by the alternative content
			el.parentNode.replaceChild(abstractAltContent(obj), el);
			obj.style.display = "none";
			(function(){
				if (obj.readyState == 4) {
					obj.parentNode.removeChild(obj);
				}
				else {
					setTimeout(arguments.callee, 10);
				}
			})();
		}
		else {
			obj.parentNode.replaceChild(abstractAltContent(obj), obj);
		}
	} 

	function abstractAltContent(obj) {
		var ac = createElement("div");
		if (ua.win && ua.ie) {
			ac.innerHTML = obj.innerHTML;
		}
		else {
			var nestedObj = obj.getElementsByTagName(OBJECT)[0];
			if (nestedObj) {
				var c = nestedObj.childNodes;
				if (c) {
					var cl = c.length;
					for (var i = 0; i < cl; i++) {
						if (!(c[i].nodeType == 1 && c[i].nodeName == "PARAM") && !(c[i].nodeType == 8)) {
							ac.appendChild(c[i].cloneNode(true));
						}
					}
				}
			}
		}
		return ac;
	}
	
	/* Cross-browser dynamic SWF creation
	*/
	function createSWF(attObj, parObj, id) {
		var r, el = getElementById(id);
		if (ua.wk && ua.wk < 312) { return r; }
		if (el) {
			if (typeof attObj.id == UNDEF) { // if no 'id' is defined for the object element, it will inherit the 'id' from the alternative content
				attObj.id = id;
			}
			if (ua.ie && ua.win) { // Internet Explorer + the HTML object element + W3C DOM methods do not combine: fall back to outerHTML
				var att = "";
				for (var i in attObj) {
					if (attObj[i] != Object.prototype[i]) { // filter out prototype additions from other potential libraries
						if (i.toLowerCase() == "data") {
							parObj.movie = attObj[i];
						}
						else if (i.toLowerCase() == "styleclass") { // 'class' is an ECMA4 reserved keyword
							att += ' class="' + attObj[i] + '"';
						}
						else if (i.toLowerCase() != "classid") {
							att += ' ' + i + '="' + attObj[i] + '"';
						}
					}
				}
				var par = "";
				for (var j in parObj) {
					if (parObj[j] != Object.prototype[j]) { // filter out prototype additions from other potential libraries
						par += '<param name="' + j + '" value="' + parObj[j] + '" />';
					}
				}
				el.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + att + '>' + par + '</object>';
				objIdArr[objIdArr.length] = attObj.id; // stored to fix object 'leaks' on unload (dynamic publishing only)
				r = getElementById(attObj.id);	
			}
			else { // well-behaving browsers
				var o = createElement(OBJECT);
				o.setAttribute("type", FLASH_MIME_TYPE);
				for (var m in attObj) {
					if (attObj[m] != Object.prototype[m]) { // filter out prototype additions from other potential libraries
						if (m.toLowerCase() == "styleclass") { // 'class' is an ECMA4 reserved keyword
							o.setAttribute("class", attObj[m]);
						}
						else if (m.toLowerCase() != "classid") { // filter out IE specific attribute
							o.setAttribute(m, attObj[m]);
						}
					}
				}
				for (var n in parObj) {
					if (parObj[n] != Object.prototype[n] && n.toLowerCase() != "movie") { // filter out prototype additions from other potential libraries and IE specific param element
						createObjParam(o, n, parObj[n]);
					}
				}
				el.parentNode.replaceChild(o, el);
				r = o;
			}
		}
		return r;
	}
	
	function createObjParam(el, pName, pValue) {
		var p = createElement("param");
		p.setAttribute("name", pName);	
		p.setAttribute("value", pValue);
		el.appendChild(p);
	}
	
	/* Cross-browser SWF removal
		- Especially needed to safely and completely remove a SWF in Internet Explorer
	*/
	function removeSWF(id) {
		var obj = getElementById(id);
		if (obj && obj.nodeName == "OBJECT") {
			if (ua.ie && ua.win) {
				obj.style.display = "none";
				(function(){
					if (obj.readyState == 4) {
						removeObjectInIE(id);
					}
					else {
						setTimeout(arguments.callee, 10);
					}
				})();
			}
			else {
				obj.parentNode.removeChild(obj);
			}
		}
	}
	
	function removeObjectInIE(id) {
		var obj = getElementById(id);
		if (obj) {
			for (var i in obj) {
				if (typeof obj[i] == "function") {
					obj[i] = null;
				}
			}
			obj.parentNode.removeChild(obj);
		}
	}
	
	/* Functions to optimize JavaScript compression
	*/
	function getElementById(id) {
		var el = null;
		try {
			el = doc.getElementById(id);
		}
		catch (e) {}
		return el;
	}
	
	function createElement(el) {
		return doc.createElement(el);
	}
	
	/* Updated attachEvent function for Internet Explorer
		- Stores attachEvent information in an Array, so on unload the detachEvent functions can be called to avoid memory leaks
	*/	
	function addListener(target, eventType, fn) {
		target.attachEvent(eventType, fn);
		listenersArr[listenersArr.length] = [target, eventType, fn];
	}
	
	/* Flash Player and SWF content version matching
	*/
	function hasPlayerVersion(rv) {
		var pv = ua.pv, v = rv.split(".");
		v[0] = parseInt(v[0], 10);
		v[1] = parseInt(v[1], 10) || 0; // supports short notation, e.g. "9" instead of "9.0.0"
		v[2] = parseInt(v[2], 10) || 0;
		return (pv[0] > v[0] || (pv[0] == v[0] && pv[1] > v[1]) || (pv[0] == v[0] && pv[1] == v[1] && pv[2] >= v[2])) ? true : false;
	}
	
	/* Cross-browser dynamic CSS creation
		- Based on Bobby van der Sluis' solution: http://www.bobbyvandersluis.com/articles/dynamicCSS.php
	*/	
	function createCSS(sel, decl, media, newStyle) {
		if (ua.ie && ua.mac) { return; }
		var h = doc.getElementsByTagName("head")[0];
		if (!h) { return; } // to also support badly authored HTML pages that lack a head element
		var m = (media && typeof media == "string") ? media : "screen";
		if (newStyle) {
			dynamicStylesheet = null;
			dynamicStylesheetMedia = null;
		}
		if (!dynamicStylesheet || dynamicStylesheetMedia != m) { 
			// create dynamic stylesheet + get a global reference to it
			var s = createElement("style");
			s.setAttribute("type", "text/css");
			s.setAttribute("media", m);
			dynamicStylesheet = h.appendChild(s);
			if (ua.ie && ua.win && typeof doc.styleSheets != UNDEF && doc.styleSheets.length > 0) {
				dynamicStylesheet = doc.styleSheets[doc.styleSheets.length - 1];
			}
			dynamicStylesheetMedia = m;
		}
		// add style rule
		if (ua.ie && ua.win) {
			if (dynamicStylesheet && typeof dynamicStylesheet.addRule == OBJECT) {
				dynamicStylesheet.addRule(sel, decl);
			}
		}
		else {
			if (dynamicStylesheet && typeof doc.createTextNode != UNDEF) {
				dynamicStylesheet.appendChild(doc.createTextNode(sel + " {" + decl + "}"));
			}
		}
	}
	
	function setVisibility(id, isVisible) {
		if (!autoHideShow) { return; }
		var v = isVisible ? "visible" : "hidden";
		if (isDomLoaded && getElementById(id)) {
			getElementById(id).style.visibility = v;
		}
		else {
			createCSS("#" + id, "visibility:" + v);
		}
	}

	/* Filter to avoid XSS attacks
	*/
	function urlEncodeIfNecessary(s) {
		var regex = /[\\\"<>\.;]/;
		var hasBadChars = regex.exec(s) != null;
		return hasBadChars && typeof encodeURIComponent != UNDEF ? encodeURIComponent(s) : s;
	}
	
	/* Release memory to avoid memory leaks caused by closures, fix hanging audio/video threads and force open sockets/NetConnections to disconnect (Internet Explorer only)
	*/
	var cleanup = function() {
		if (ua.ie && ua.win) {
			window.attachEvent("onunload", function() {
				// remove listeners to avoid memory leaks
				var ll = listenersArr.length;
				for (var i = 0; i < ll; i++) {
					listenersArr[i][0].detachEvent(listenersArr[i][1], listenersArr[i][2]);
				}
				// cleanup dynamically embedded objects to fix audio/video threads and force open sockets and NetConnections to disconnect
				var il = objIdArr.length;
				for (var j = 0; j < il; j++) {
					removeSWF(objIdArr[j]);
				}
				// cleanup library's main closures to avoid memory leaks
				for (var k in ua) {
					ua[k] = null;
				}
				ua = null;
				for (var l in swfobject) {
					swfobject[l] = null;
				}
				swfobject = null;
			});
		}
	}();
	
	return {
		/* Public API
			- Reference: http://code.google.com/p/swfobject/wiki/documentation
		*/ 
		registerObject: function(objectIdStr, swfVersionStr, xiSwfUrlStr, callbackFn) {
			if (ua.w3 && objectIdStr && swfVersionStr) {
				var regObj = {};
				regObj.id = objectIdStr;
				regObj.swfVersion = swfVersionStr;
				regObj.expressInstall = xiSwfUrlStr;
				regObj.callbackFn = callbackFn;
				regObjArr[regObjArr.length] = regObj;
				setVisibility(objectIdStr, false);
			}
			else if (callbackFn) {
				callbackFn({success:false, id:objectIdStr});
			}
		},
		
		getObjectById: function(objectIdStr) {
			if (ua.w3) {
				return getObjectById(objectIdStr);
			}
		},
		
		embedSWF: function(swfUrlStr, replaceElemIdStr, widthStr, heightStr, swfVersionStr, xiSwfUrlStr, flashvarsObj, parObj, attObj, callbackFn) {
			var callbackObj = {success:false, id:replaceElemIdStr};
			if (ua.w3 && !(ua.wk && ua.wk < 312) && swfUrlStr && replaceElemIdStr && widthStr && heightStr && swfVersionStr) {
				setVisibility(replaceElemIdStr, false);
				addDomLoadEvent(function() {
					widthStr += ""; // auto-convert to string
					heightStr += "";
					var att = {};
					if (attObj && typeof attObj === OBJECT) {
						for (var i in attObj) { // copy object to avoid the use of references, because web authors often reuse attObj for multiple SWFs
							att[i] = attObj[i];
						}
					}
					att.data = swfUrlStr;
					att.width = widthStr;
					att.height = heightStr;
					var par = {}; 
					if (parObj && typeof parObj === OBJECT) {
						for (var j in parObj) { // copy object to avoid the use of references, because web authors often reuse parObj for multiple SWFs
							par[j] = parObj[j];
						}
					}
					if (flashvarsObj && typeof flashvarsObj === OBJECT) {
						for (var k in flashvarsObj) { // copy object to avoid the use of references, because web authors often reuse flashvarsObj for multiple SWFs
							if (typeof par.flashvars != UNDEF) {
								par.flashvars += "&" + k + "=" + flashvarsObj[k];
							}
							else {
								par.flashvars = k + "=" + flashvarsObj[k];
							}
						}
					}
					if (hasPlayerVersion(swfVersionStr)) { // create SWF
						var obj = createSWF(att, par, replaceElemIdStr);
						if (att.id == replaceElemIdStr) {
							setVisibility(replaceElemIdStr, true);
						}
						callbackObj.success = true;
						callbackObj.ref = obj;
					}
					else if (xiSwfUrlStr && canExpressInstall()) { // show Adobe Express Install
						att.data = xiSwfUrlStr;
						showExpressInstall(att, par, replaceElemIdStr, callbackFn);
						return;
					}
					else { // show alternative content
						setVisibility(replaceElemIdStr, true);
					}
					if (callbackFn) { callbackFn(callbackObj); }
				});
			}
			else if (callbackFn) { callbackFn(callbackObj);	}
		},
		
		switchOffAutoHideShow: function() {
			autoHideShow = false;
		},
		
		ua: ua,
		
		getFlashPlayerVersion: function() {
			return { major:ua.pv[0], minor:ua.pv[1], release:ua.pv[2] };
		},
		
		hasFlashPlayerVersion: hasPlayerVersion,
		
		createSWF: function(attObj, parObj, replaceElemIdStr) {
			if (ua.w3) {
				return createSWF(attObj, parObj, replaceElemIdStr);
			}
			else {
				return undefined;
			}
		},
		
		showExpressInstall: function(att, par, replaceElemIdStr, callbackFn) {
			if (ua.w3 && canExpressInstall()) {
				showExpressInstall(att, par, replaceElemIdStr, callbackFn);
			}
		},
		
		removeSWF: function(objElemIdStr) {
			if (ua.w3) {
				removeSWF(objElemIdStr);
			}
		},
		
		createCSS: function(selStr, declStr, mediaStr, newStyleBoolean) {
			if (ua.w3) {
				createCSS(selStr, declStr, mediaStr, newStyleBoolean);
			}
		},
		
		addDomLoadEvent: addDomLoadEvent,
		
		addLoadEvent: addLoadEvent,
		
		getQueryParamValue: function(param) {
			var q = doc.location.search || doc.location.hash;
			if (q) {
				if (/\?/.test(q)) { q = q.split("?")[1]; } // strip question mark
				if (param == null) {
					return urlEncodeIfNecessary(q);
				}
				var pairs = q.split("&");
				for (var i = 0; i < pairs.length; i++) {
					if (pairs[i].substring(0, pairs[i].indexOf("=")) == param) {
						return urlEncodeIfNecessary(pairs[i].substring((pairs[i].indexOf("=") + 1)));
					}
				}
			}
			return "";
		},
		
		// For internal usage only
		expressInstallCallback: function() {
			if (isExpressInstallActive) {
				var obj = getElementById(EXPRESS_INSTALL_ID);
				if (obj && storedAltContent) {
					obj.parentNode.replaceChild(storedAltContent, obj);
					if (storedAltContentId) {
						setVisibility(storedAltContentId, true);
						if (ua.ie && ua.win) { storedAltContent.style.display = "block"; }
					}
					if (storedCallbackFn) { storedCallbackFn(storedCallbackObj); }
				}
				isExpressInstallActive = false;
			} 
		}
	};
}();

	H.ImageBox = H.extend(H.Base,{
		COMPONENT_CLASS:"ImageBox",
		el:null,
		toolbar : null,
		pageBtn : null,
		zoomBox : null,
		maxImg : null,
		images : [],
		totalPage : 1,
		curPage : 1,
		backdrop : null,
		init : function(dom) {
			H.ImageBox.superclass.init.apply(this,arguments) ;
			var _imageBox = this;
			_imageBox.toolbar = this.el.find('.hc_image-tool');
			_imageBox.pageBtn = this.el.find('.hc_image-page');
			_imageBox.zoomBox = this.el.find('.hc_image-zoombox');
			_imageBox.maxImg = this.zoomBox.find('.hc_maxImg');
			_imageBox.image = this.el.find('.hc_miniimg');
			_imageBox.zoomBox.hide();
			_imageBox.toolbar.hide();
			_imageBox.pageBtn.hide();
			var width = this.el.attr('hwidth');
			var height = this.el.attr('hheight');
			this.el.width(width||200);
			this.el.height(height||200);
			
			this.image.width((width||200)-8);
			this.image.height((height||200)-8);
			
			this.pageBtn.css('margin-top',(height-this.pageBtn.height())/2 + 'px');
			_imageBox.initImages();
			function mouseover(){
				_imageBox.toolbar.show();
				_imageBox.pageBtn.width(_imageBox.image.width() + 8);
				_imageBox.pageBtn.show();
			}
			function mouseout(e){
				_imageBox.pageBtn.hide();
				_imageBox.toolbar.hide();
			}
			//注册鼠标移过图片的效果
			_imageBox.image.hover(mouseover,mouseout);
			_imageBox.pageBtn.hover(mouseover,mouseout);
			_imageBox.toolbar.hover(mouseover,mouseout);
			
			
			//当点击图片时弹出放大窗口
			_imageBox.image.click(function(){
				_imageBox.showZoomBox();
			});
			_imageBox.pageBtn.click(function(){
				_imageBox.showZoomBox();
			});
			//点击放大窗口的左右旋转的按钮旋转。
			_imageBox.zoomBox.find('.hc_image-zoomtool a').each(function(i,a){
				$(a).click(function(){
					_imageBox.rotate(i==0?'left':'right');
				});				
			});
			_imageBox.zoomBox.find('.hc_image-zoomtool-close').each(function(i,a){
				$(a).click(function(){
					_imageBox.closeZomBox();
				});				
			});
			//注册下一张和上一张的事件
			_imageBox.pageBtn.find('.hc_image-pagepre').click(function(){
				_imageBox.prev();
				return false;
			});
			_imageBox.pageBtn.find('.hc_image-pagenext').click(function(){
				_imageBox.next();
				return false;
			});
			//遮罩层。
			var backdrop = $("<div class='h_floatdiv-backdrop'></div>").hide();
			$(document.body).append(backdrop);
			this.backdrop = backdrop;
			this.backdrop.click(function(){
				_imageBox.closeZoomBox();			
			});
		},
		initImages : function(){
			var _imageBox = this; 
			_imageBox.images =[];
			_imageBox.image.find('a').each(function(idx,a){
				var $a = $(a);
				if(idx !=0 ) $a.hide();
				var $img = $a.children('img');
				$a.height(_imageBox.image.height()-20);
				$img.css('max-height',(_imageBox.image.height()-20)+'px');
				$img.css('max-width',_imageBox.image.width()+'px');
				_imageBox.images.push($a);
			});
			_imageBox.totalPage = _imageBox.images.length;
			_imageBox.curPage = 1;
			this.image.find('.hc_image-page-cur').text(this.images.length==0 ? 0 :1);
			this.image.find('.hc_image-page-count').text(this.images.length);
		},
        /**
         * @description  显示下一张图片
         * @function
         * @name Horn.ImageBox#next
         */
		next : function(){
			var page = this.curPage;
			if(page==this.totalPage){
				page = 1;
			}else{
				page++;
			}
			this.goPage(page);
		},
        /**
         * @description  显示上一张图片
         * @function
         * @name Horn.ImageBox#prev
         */
		prev : function(){
			var page = this.curPage;
			if(page==1) {
				page = this.totalPage;
			}else{
				page--;
			}
			this.goPage(page);
		},
        /**
         * @description  显示指定的图片
         * @function
         * @name Horn.ImageBox#goPage
         * @param {int} p 指定的序号
         */
		goPage : function(p){
			var _imageBox = this;
			_imageBox.images[this.curPage-1].fadeOut("fast",function(){
				_imageBox.images[p-1].fadeIn("fast");
			});
			this.curPage = p;
			this.image.find('.hc_image-page-cur').text(p);
		},
		 /**
         * @description  放大窗口居中
         * @function
         * @name Horn.ImageBox#makeZoomBoxCenter
         */
		makeZoomBoxCenter : function(){
			var $zb = this.zoomBox;
			var $win = $(window);
			var coorX = ($win.width() - $zb.width()) / 2;
			var coorY = ($win.height() - $zb.height()) / 2;
			coorX = $win.scrollLeft() + (coorX);
			coorY = $win.scrollTop() + (coorY);
			$zb
       		.css("position",'absolute')
       		.css("float",'left')
			.css("top",( $win.height()- $zb.height() ) / 2 + $win.scrollTop()+"px")
       		.css("left",( $win.width()- $zb.width() ) / 2 + $win.scrollLeft()+"px")
       		.css("z-index",100)
       		;
		},
		 /**
         * @description  显示放大窗口
         * @function
         * @name Horn.ImageBox#showZoomBox
         * @param width 宽度
         * @param height 高度
         */
		showZoomBox : function(width,height){
			var win = Horn.getComp(this.name+'win');
			win.show();
			var	width = win.el.attr("h_width"),
       		 height = win.el.attr("h_height");
			var imagepaths = [];
			$(this.images).each(function(idx,item){
				imagepaths.push(item.find('img').attr('src'));
			});
			$('#'+this.name+"winViewPic").remove();
			win.el.find('.h_floatdiv-con').append($('<div id="'+this.name+"winViewPic"+'"></div>'));
			 var swfVersionStr = "10.0.0";
	            var xiSwfUrlStr = "playerProductInstall.swf";
	            var flashvars = {};
	            flashvars["imagePaths"]= imagepaths.join(',').replace(/&/g,"#");
	            var params = {};
	            params.quality = "high";
	            params.bgcolor = "#ffffff";
	            params.allowscriptaccess = "sameDomain";
	            params.allowfullscreen = "true";
	            var attributes = {};
	            attributes.id =  this.name+"winViewPic";
	            attributes.name =  this.name+"winViewPic";
	            attributes.align = "middle";
	            swfobject.embedSWF(
	            		context_path+"/components/hc_extendcon/img/ViewPic.swf", this.name+"winViewPic", 
	                width-5, height-40, 
	                swfVersionStr, xiSwfUrlStr, 
	                flashvars, params, attributes);
				swfobject.createCSS("#"+this.name+"winViewPic", "display:block;text-align:left;");
		},
        /**
         * @description  闭关放大窗口
         * @function
         * @name Horn.ImageBox#closeZoomBox
         */
		closeZoomBox : function(animate){
			this.zoomBox.hide();
			this.backdrop.hide();
		},
		setImages : function(imgarr){
			$(this.images).each(function(idx,item){
			 	item.remove();
			});
			var _imageBox = this;
			$(imgarr).each(function(idx,imgStr){
				_imageBox.image.append('<a href="#" class="image-artzoom"><img src="'+imgStr+'"/></a>');
			});
			this.initImages();
		}
	});
	
	$.extend(Horn.ImageBox,{
		boxWin :null,
		getImageBoxWin : function(params){
			params = params || {}; 
			if(!this.boxWin){
				Horn.getCurrent().append('<div id="__horn_image_win" class="h_floatdiv h_screen-content-3" name="__horn_image_win" h_height="'+(params.height||650)+'" h_width="'+(params.width||800)+'" style="display:none">'
						+'<div class="h_floatdiv-title"><span>查看图片</span> <a href="#">X</a></div>'
						+'<div class="h_floatdiv-con">'
						+'<div id="__horn_image_win"></div>'
						+'</div>'
					+'</div>');
				Horn.init();
				this.boxWin = Horn.getCompByEl($('#__horn_image_win'));
				return this.boxWin;
			}
			return this.boxWin;
		},
		showImages : function(params){
			var title = params.title || "查看图片" ;
			var images = params.images || "";
			var win = this.getImageBoxWin(params);
			win.show();
			win.setTitle(title);
			var	width = win.el.attr("h_width"),
      		 height = win.el.attr("h_height");
			$('#winViewPic').remove();
			win.el.find('.h_floatdiv-con').append($('<div id="winViewPic"></div>'));
			 var swfVersionStr = "10.0.0";
	            var xiSwfUrlStr = "playerProductInstall.swf";
	            var flashvars = {};
	            flashvars["imagePaths"]= images.replace(/&/g,"#");
	            var params = {};
	            params.quality = "high";
	            params.bgcolor = "#ffffff";
	            params.allowscriptaccess = "sameDomain";
	            params.allowfullscreen = "true";
	            var attributes = {};
	            attributes.id =  "winViewPic";
	            attributes.name =  "winViewPic";
	            attributes.align = "middle";
	            swfobject.embedSWF(
	            		context_path+"/components/hc_extendcon/img/ViewPic.swf", "winViewPic", 
	                width-5, height-40, 
	                swfVersionStr, xiSwfUrlStr, 
	                flashvars, params, attributes);
				swfobject.createCSS("#winViewPic", "display:block;text-align:left;");
		}
	});
	H.regUI("div.hc_image",H.ImageBox);
})(Horn,jQuery);
/*
 * -----------------------------------------------------------------------
 * 修订纪录
 * 2014-2-14 		韩寅		修改注释
 * -----------------------------------------------------------------------
 */
/**
 * @name Horn.SearchPanel
 * @class
 * 固定表单查询</br>
 * 内置form，包含有且仅有一个输入框和一个提交按钮，可以通过点击按钮做表单提交
 */

/**@lends Horn.SearchPanel# */

/**
 * 组件的唯一标示
 * @name Horn.SearchPanel#<b>id</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单输入域的名称
 * @name Horn.SearchPanel#<b>name</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单提交的url地址
 * @name Horn.SearchPanel#<b>url</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 在输入框为空，并且没有获得焦点的情况下，输入框显示的提示信息
 * @name Horn.SearchPanel#<b>text</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
	Horn.SearchPanel = Horn.extend(Horn.Base,{
		COMPONENT_CLASS:"SearchPanel",
		field : null,
		btn : null,
		text : "请输入号码",
		init:function(){
			Horn.SearchPanel.superclass.init.apply(this,arguments);
			var el = this.el;
			var field = this.field = el.find("input:text");
			var btn = this.btn = el.find("input:submit");
			var _panel = this;
			_panel.text = this.field.val();
			_panel.field.focus(function(){
				if(_panel.text == field.val() ){ 
					field.val("");
				}
				field.addClass("h_search-txt-up");
				field.removeClass("h_search-txt");
			});
			_panel.field.blur(function(){
				if("" == field.val() ) {
					field.removeClass("h_search-txt-up");
					field.addClass("h_search-txt");
					field.val(_panel.text);
				}
			});
			setTimeout(function(){
				_panel.field.unbind('keydown');
			},100);
			btn.click(function(){
				if(_panel.text == field.val()) field.val("");
			});
		}
	});
	Horn.regUI("div.h_search",Horn.SearchPanel);

/**
 * 版本：
 * 系统名称: JRESPLUS
 * 模块名称: JRESPLUS-UI
 * 文件名称: PageBar.js
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：PageBar组件对应的代码
 * 修改记录:
 * 修改日期       修改人员        修改说明
 *  -----------------------------------------------------------------------
 *  2014-01-28    zhangsu    Grid分页支持动态设置每页显示条数
 *  2014-02-10    zhangsu    Grid分页增加分页页数判断
 *  2014-02-13    zhangsu    跳转到第几页做范围限制，只能在当前页码范围内调整
 *  2014-02-13    zhangsu    点击尾页不会跳转到尾页 
 *  2014-02-14    zhangsu    如果总条数为0，将动态设置跳转页和页码input框disabled，跳转按钮disabled
 *  2014-03-12    zhangsu    STORY #7836 grid分页grid的查询条件带不过去
 *  2013-4-10     周智星      BUG #6642 【page_bar】bindFormName设置了不能再页面第一次加载的时候生效，但是事实上第一次加载的时候form内的表单是有值的
 *  2014-4-21     周智星		  BUG #6639 【page_bar】异常测试----pageNo设置为不在页数内的值出现奇特情况
 *  -----------------------------------------------------------------------
 */
/**
 * @description PageBar实现
 * @author huzw@hundsun.com
 * @name Horn.PageBar
 * @class
 * 分页栏组件，结合grid一起使用
 * @extends Horn.Base
 * @since version 0.1
 * @example
 * \#page_bar($page)
 * \#page_bar({"pageNo":1,"pageSize":20,"pages":})
 */
/**
 * @lends Horn.PageBar#
 */

/**
 * @description PageBar的唯一标识。
 * @property id
 * @name Horn.PageBar#<b>id</b>
 * @type String
 * @default ""
 * @example
 * 无
 */

/**
 * @description PageBar的名称。
 * @property name
 * @name Horn.PageBar#<b>name</b>
 * @type String
 * @default ""
 * @example
 * 无
 */

/**
 * @ignore
 * @description PageBar页面跳转的地址。默认为当前页面地址，可提供其他页面的分页跳转
 * @property url
 * @name Horn.PageBar#<b>url</b>
 * @type String
 * @default 当前页面地址
 * @example
 * 无
 */

/**
 * @ignore
 * @description PageBar 当前页码，一般由分页组件Page提供
 * @property pageNo
 * @name Horn.PageBar#<b>pageNo</b>
 * @type int
 * @default 1
 * @example
 * 无
 */

/**
 * @ignore
 * @description PageBar 总页码数，一般由分页组件Page提供
 * @property pages
 * @name Horn.PageBar#<b>pages</b>
 * @type int
 * @default 
 * @example
 * 无
 */

/**
 * @ignore
 * @description PageBar 页面大小，每页显示条目数，一般由分页组件Page提供
 * @property pageSize
 * @name Horn.PageBar#<b>pageSize</b>
 * @type int
 * @default 
 * @example
 * 无
 */

/**
 * @ignore
 * @description PageBar 总条目数，一般由分页组件Page提供
 * @property count
 * @name Horn.PageBar#<b>count</b>
 * @type int
 * @default 
 * @example
 * 无
 */

/**
 * @description PageBar 绑定的查询表单名称,用于分页时将查询条件的参数传入(特别说明！参数传入仅针对点击分页栏里的事件触发时生效，对第一次加载页面无效)<br>
 * 需要注意点：绑定form是$("form").submit()方式提交的，所以java类里的action的method必须去除,例如：<br>
 * "@RequestMapping(value = "/test/grid/testGrid.htm")<br>
 *	public void testGrid(Page page,String key1, ModelMap mm) {<br>
 * }"
 * @property bindFormName
 * @name Horn.PageBar#<b>bindFormName</b>
 * @type String
 * @default 
 * @example
 * #page_bar($page {"bindFormName":"addForm1"})
 */

/**
 * @description PageBar 的显示位置，默认不配置是居中显示，设置值为"left",居左显示，设置值为"right",居右显示,设置为"center",居中显示
 * @property align
 * @name Horn.PageBar#<b>align</b>
 * @type String
 * @default 
 * @example
 * 无
 */
	Horn.PageBar = Horn.extend(Horn.Base,{
		COMPONENT_CLASS:"PageBar",
		/**
         * @description 可能会使用的跳转对象名称
		 * @deprecated 暂时未使用
		 * @ignore
		 */
		targetName : null,
		/**
		 *
         * @description 可能会使用的跳转对象
		 * @deprecated 暂时未使用
		 * @ignore
		 */
		target : null,
        /**
         * @description 页面跳转地址
         * @field
         * @name Horn.PageBar#url
         * @default null
         * @ignore
         */
		url : null,
		/**
		 * @ignore
		 */
		init:function(dom){
			Horn.PageBar.superclass.init.apply(this,arguments) ;
			this.targetName = this.el.attr('target');
			this.url = this.el.attr('url');
			if(!this.url) this.url = window.location.href;
			this.initPageParams();   //点击尾页不会跳转到尾页 ,此方法需要放在initEvent之前
			this.initEvent();
			
		},
		/**
		 *
         * @description 从dom对象中获取到所需要的参数
		 * @private
		 * @function
		 */
		initPageParams : function(){
			var formName = "";
        	if(this.el.attr("bindformname") && this.el.attr("bindformname").length > 0){
        		formName = this.el.attr("bindformname") ;
        	}
			var el = this.el;
			this.page = el.attr("pageNo") || this.page; 
			this.pageSize = el.attr("pageSize") || this.pageSize; 
			this.pageCount = el.attr("pageCount") || this.pageCount; 
			this.pages = el.attr("pages") || this.pages;
			if(this.pageCount <=0||this.pages<=0){     //如果总条数为0，将动态设置跳转页和页码input框disabled，跳转按钮disabled	
				$('#'+formName+'_topageid').attr("disabled","disabled"); 
				$('#'+formName+'_topagesize').attr("disabled","disabled"); 
				$('#'+formName+'_pagebtn-go').attr("disabled","disabled");

			}else{
				$('#'+formName+'_topageid').removeAttr("disabled"); 
				$('#'+formName+'_topagesize').removeAttr("disabled"); 
				$('#'+formName+'_pagebtn-go').removeAttr("disabled");
			}
		},
		/**
		 * 为每个按钮绑定点击事件
		 * @private
		 * @function
		 */
		initEvent : function(){
			var _pageBar = this;
			var formName = "";
        	if(this.el.attr("bindformname") && this.el.attr("bindformname").length > 0){
        		formName = this.el.attr("bindformname") ;
        	}
			this.el.children('a').each(function(idx,it){
				var item = $(it),
					func = function(item,f,arg){
						item.click(function(){
							if(item.hasClass('h_page-dis')){
								return;
							}
							if(item.hasClass('h_pagebtn-next') || item.hasClass('h_pagebtn-prev')){
								item.addClass("h_page-dis");
							}
							f.call(_pageBar,arg);
						});
					};
					
				if(!item.hasClass('h_page-dis')){
					if(item.hasClass('h_pagebtn-index')){
						func(item,_pageBar.goPage,_pageBar.INDEX_PAGE);
					}else if(item.hasClass('h_pagebtn-end')){      //尾页点击
						func(item,_pageBar.goPage,parseInt(_pageBar.pages));
					}else if(item.hasClass('h_pagebtn-next')){
						func(item,_pageBar.nextpage);
					}else if(item.hasClass('h_pagebtn-prev')){
						func (item,_pageBar.prevpage);
					}else if(item.hasClass('h_page-num')){
						func (item,_pageBar.goPage,parseInt(item.text()));
					}else if(item.hasClass('h_pagebtn-go')){       //Grid分页支持动态设置每页显示条数
						
	                    item.bind('click',function(e){
	                    	var _topageid = document.getElementById(formName+"_topageid").value;
							var _topagesize = document.getElementById(formName+"_topagesize").value;
							var params = [];
		                    params.push(parseInt(_topageid),parseInt(_topagesize));
	                        return _pageBar.goPage.apply(_pageBar,params);
	                    });
					}
				 }
			});
		},
		/**
         * @description 从参数中获取到对象
		 * @function
         * @name Horn.PageBar#getTarget
         * @ignore
		 */
		getTarget:function(){
			return this.target || Horn.getComp(this.targetName);
		},
		/**
		 * 首页页码
		 * @property
		 * @ignore
		 */
        INDEX_PAGE:1,
        /**
         * 当前页码
		 * @property
		 * @ignore
         */
		page : 1,
		/**
		 * 页面大小
		 * @property
		 * @ignore
		 */
		pageSize : 20,
		/**
		 * 总条数
		 * @property
		 * @ignore
		 */
		pageCount : 0,
		/**
		 * 总页数
		 * @property
		 * @ignore
		 */
		pages : 1,
		/**
		 * 下一页
		 * @function
		 * @name Horn.PageBar#<b>nextpage</b>
		 */
        nextpage : function() {
            this.goPage(parseInt(this.page) +1 );
        },
        /**
         * 上一页
         * @function
         * @name Horn.PageBar#<b>prevpage</b>
         */
        prevpage : function() {
            this.goPage(parseInt(this.page) -1);
        },
        /**
         * 跳转到首页
         * @function
         * @name Horn.PageBar#<b>firstpage</b>
         */
        firstpage : function() {
            this.goPage(this.INDEX_PAGE);
        },
        /*
        refreshpage : function() {
            this.ajaxRequest();
        },*/
        /**
         * 跳转到页面
         * @param {Number} 跳转到页码
         * @function
         * @ignore
         */
        goPage : function(page,pageSize){
        	var bindformname = "";
        	if(this.el.attr("bindformname") && this.el.attr("bindformname").length > 0){
			    bindformname = this.el.attr("bindformname") ;
        	}
        	if(page < this.INDEX_PAGE ){
        		page = this.INDEX_PAGE;
        	}
        	if(page > this.pages){
        		page = this.pages;
        	}
        	if(pageSize > this.pageCount) {
        		pageSize = this.pageCount;
        	}
        	$("#"+bindformname+"_topageid").val(page);
        	if(pageSize < 0||pageSize==null||pageSize==undefined) pageSize = this.pageSize;
        	this.page = page;
        	this.pageSize = pageSize;
			this.doJump();
        },
        
        /**
         * 开始跳转
         * @private
         * @ignore
         */
		doJump : function(){
			/*
			 * pageBar如果绑定了form，就以post方式进行提交查询，否则get方式进行查询
			 * BUG #6642 【page_bar】bindFormName设置了不能再页面第一次加载的时候生效，但是事实上第一次加载的时候form内的表单是有值的
			 */
			if(this.el.attr("bindformname") && this.el.attr("bindformname").length > 0){
					
				    var bindformname = this.el.attr("bindformname") ;
		            this.form = Horn.getCurrent().find("form[name='"+bindformname+"']") ;
		            var pageParamStr = '<input type="hidden" name="index" value="'+this.page+'"><input type="hidden" name="pageNo" value="'+this.page+'"><input type="hidden" name="pageSize" value="'+this.pageSize+'"><input type="hidden" name="count" value="'+this.pageCount+'"><input type="hidden" name="pages" value="'+this.pages+'">';
		            this.form.append(pageParamStr);
		            this.form.attr("action",this.url);
		            this.form.submit();
		            
		            //绑定的form表单的参数
					/*var formData = {};
					formData = Horn.Util.getValues(this.form) ;
		            for(var key in formData){
		            	if(key != "sourceurl")
						  addParam(key,formData[key]);
					}*/
		            
		    }else{
		    	var url = this.url;
				function addParam(name,val){
					var reg = new RegExp("([?|&])"+name+"=[^&]*");
					if(reg.test(url)){
						url=url.replace(reg,'$'+'1'+name+'='+val);
					}else{
						url += (url.indexOf('?') != -1 ? '&' : '?') + name+'='+val;
					}
				}
				addParam("index",this.page);
				addParam("pageNo",this.page);
				addParam("pageSize",this.pageSize);
				addParam("count",this.pageCount);
				addParam("pages",this.pages);
		    	Horn.Util.jump(url);
		    }
		}
	});
	Horn.regUI("div.h_pages",Horn.PageBar) ;

