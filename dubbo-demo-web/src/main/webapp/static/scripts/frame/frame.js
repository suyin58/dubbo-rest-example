var Horn = Horn || {};
/**
 * 鎻愪緵椤甸潰妗嗘灦閮ㄥ垎鐨勪氦浜�
 */
Horn.Frame = {
	params : {},
	/** 浠ヤ笅寮�瀹氫箟Frame鐨勬帴鍙ｅ嚱鏁�*/
	switchMenu : function() {
	},
	openMenu : function() {
	},
	lock:function(){
		Horn.Frame.locked=true;
		Horn.Frame.lockFun();
	},
	unlock:function(){
		Horn.Frame.locked=false;
	},
	lockFun:function(){
		
	},
	expandHead:function(){
		$(".h-header").removeClass("h-header-collapsed");
	},
	collapsHead:function(){
		$(".h-header").addClass("h-header-collapsed");
	},
	expandMenu:function(){
		$(".h-menu").removeClass("h-menu-collapsed");
		$(".h-screen").css({marginLeft:"190px"});
		this.menuExpanded=true;
		this.menu.current.resize();
	},
	collapsMenu:function(){
		$(".h-menu").addClass("h-menu-collapsed");
		$(".h-screen").css({marginLeft:"45px"});
		$("li.active",$(".h-menu")).removeClass("active").children("ul").hide();
		this.menuExpanded=false;
		this.menu.current.resize();
	},
	menuExpanded:true,
	pc:true,
	locked:false,
	stopBubble:function (e){
	    if (e && e.stopPropagation)
	        e.stopPropagation();
	    else
	        window.event.cancelBubble=true;
	}

};
(function($) {
	function getParam(target) {
		if (target) {
			if (Horn.Frame.params) {
				var paramsId = target.attr("paramcacheid");
				return Horn.Frame.params[paramsId];
			}
		}
		return undefined;
	}
	function initNav() {
		var sel = "div.h-nav",wrapSel=".h-nav-con",prevSel=".h-nav-prev",nextSel=".h-nav-next";
		var target = $(sel);
		if(target.length==0){
			return;
		}
		var param = getParam(target);
		var wrapEl = target.children(wrapSel);
		var prevEl = target.children(prevSel);
		var nextEl = target.children(nextSel);
		var contentEl = wrapEl.children("ul");
		var size = 5;
		var maxSize = 8;
		var minSize = 3;
		var itemWidth = 120;
		if (param) {
			if (typeof param.size == 'number') {
				if (param.size <= maxSize || param.size >= minSize) {
					size = param.size;
				}
			}
		}
		Horn.Frame.navigation = {
			target : target,
			wrap : wrapEl,
			prev : prevEl,
			next : nextEl,
			content : contentEl,
			params : param,
			start:1,
			end:size,
			size : size,
			itemWidth : itemWidth,
			expand:true,
			nav:{}
		};
		setNavState();
		initNavEvent();

	}
	function setNavState() {
		var nav = Horn.Frame.navigation;
		var wrapWidth = nav.itemWidth * nav.size;
		
		nav.wrap.css("width", wrapWidth + "px");
		
		if (nav.params.items) {
			nav.items = nav.params.items;
		}
		var total = nav.items.length;
		var contentWidth=nav.itemWidth * nav.items.length;
		nav.content.css("width",contentWidth+"px");
		nav.currentIndex=1;
		for ( var i = 0; i < total; i++) {
			var navId=nav.items[i].id;
			var navEl=nav.content.children("li:eq(" + i + ")");
			Horn.Frame.navigation.nav[navId]={
			   target:navEl,
			   id:navId
			};
			if (nav.items[i].selected == true) {
				nav.currentIndex = i + 1;
			}
		}
		nav.content.children("li:eq(" +( nav.currentIndex-1)+ ")").addClass("selected");
		nav.total = total;
		nav.end = nav.size;
		if (nav.currentIndex > nav.size) {
			var difNum = nav.currentIndex - nav.size;
			nav.start = nav.start + difNum;
			nav.end = nav.end + difNum;
			nav.content.css("left", "-" + difNum * nav.itemWidth + "px");
		}
		showNavPrevNext();
	}
	function showNavPrevNext() {
		var nav = Horn.Frame.navigation;
		var dif = nav.end - nav.size;
		if (dif == 0) {
			nav.content.css("left", "0px");
			nav.prev.hide();
		} else {
			nav.content.css("left", "-" + dif * nav.itemWidth + "px");
		}
		if (nav.end > nav.size) {
			nav.prev.show();
		}
		if (nav.end == nav.total) {
			nav.next.hide();
		}
		if (nav.end < nav.total) {
			nav.next.show();
		}
	}
	function initNavEvent() {
		var nav = Horn.Frame.navigation;
		nav.prev.click(function() {
			if (nav.start == 1) {
				return;
			}
			nav.start = nav.start - 1;
			nav.end = nav.end - 1;
			showNavPrevNext();
		});
		nav.next.click(function() {
			if (nav.end == nav.total) {
				return;
			}
			nav.start = nav.start + 1;
			nav.end = nav.end + 1;
			showNavPrevNext();
		});
		nav.target.hover(function(){
			if(nav.expand==false){
				nav.target.children(".h-nav-con").show();
			}
		},function(){
			if(nav.expand==false){
				nav.target.children(".h-nav-con").hide();
			}
		});
		Horn.Frame.switchMenu = function(menuId) {
			if(Horn.Frame.locked){
				return;
			}
			navSelect(menuId);
			Horn.Frame.menu.switchMenu(menuId);
		};

	}
	function navSelect(navId) {
		var nav=Horn.Frame.navigation.nav[navId].target;
		if (nav.hasClass("selected")) {
			return;
		}
		Horn.Frame.navigation.content.find("li").removeClass("selected");
		nav.addClass("selected");
	}
	function initTool() {
		var target=$("div.h-toolbar");
		if(target.length==0){
			return;
		}
		Horn.Frame.tool={
		    target:target,
		    expand:true
		};
		$("div.h-toolbar ul li").hover(function() {
			$(this).children("ol").show();
		}, function() {
			$(this).children("ol").hide();
		});
		Horn.Frame.tool.target.hover(function(){
			if(Horn.Frame.tool.expand==false){
				Horn.Frame.tool.target.children("ul").show();
			}
			
		},function(){
			if(Horn.Frame.tool.expand==false){
				Horn.Frame.tool.target.children("ul").hide();
			}
			
		});

	}
	function initMenu() {
		var sel = "div.h-menu";
		var target = $(sel);
		if(target.length==0){
			return;
		}
		var param = getParam(target);
		Horn.Frame.menu = {
			target : target,
			params : param,
			menus:{},
			current:{},
			switchMenu:function(menuId){
				if(this.current.id ==menuId){
					return;
				}
				if(this.menus[menuId]){
					this.menus[menuId].render();
					this.current=this.menus[menuId];
				}
			}
		};
		
		target.children("div.h-menu-con").each(function(){
			initMenuItem(this);
		});
		$(window).resize(function(){
			for(var mId in Horn.Frame.menu.menus){
				if(mId=Horn.Frame.menu.current.id){
					Horn.Frame.menu.menus[mId].resize();
				}
			}
		});
	}
	function initMenuItem(target){
		var wrapEl=$(target);
		var headEl=wrapEl.children(".h-menu-header");
		var prevEl=wrapEl.children(".h-menu-prev");
		var nextEl=wrapEl.children(".h-menu-next");
		var bodyEl=wrapEl.children(".h-menu-body");
		var scrollEl=wrapEl.children(".h-menu-scroll");
		var scrollBarEl=scrollEl.children("i");
		var contentEl=bodyEl.children("ul");
		var menuId=wrapEl.attr("menuId");
		$(">i",headEl).click(function(){
			if(Horn.Frame.menuExpanded){
				Horn.Frame.collapsMenu();
			}else{
				Horn.Frame.expandMenu();
			}
			Horn.Frame.screen.resize();
		});
		Horn.Frame.menu.menus[menuId]={
				id:menuId,
				rendered:false,
				wrap:wrapEl,
				head:headEl,
				prev:prevEl,
				next:nextEl,
				body:bodyEl,
				content:contentEl,
				scroll:scrollEl,
				scrollBar:scrollBarEl,
				render:function(){
					this.wrap.siblings().hide();
					this.wrap.show();
					this.resize();
				},
				resize:function(){
					this.wrap.css("height",Horn.Frame.menu.target.css("height"));
					var headHeight=this.head.outerHeight(),
						bodyHeight=0,
						contentHeight=0,
						wrapHeight=this.wrap.innerHeight();
					$(">li",this.content).each(function(){
						contentHeight+=$(this).outerHeight();
					});
					bodyHeight=wrapHeight-headHeight;
					this.body.css({
						height:bodyHeight,
						overflow:"hidden"
					});
					this.scroll.css({height:bodyHeight});
					
					if(bodyHeight<contentHeight){
						this.scroll.show();
						var scrollRate=bodyHeight/contentHeight;
						this.scrollBar.css({
							height:scrollRate*bodyHeight,
							top:scrollRate*this.content.scrollTop()
						});
					}else{
						this.scroll.hide();
					}
						
						
						
					
				},
				initEvent:function(){
					var _this=this;
					function scrollMove(range,flag){
						var _flag=1;
						if(flag==-1){
							_flag=-1;
						}
						var bodyHeight=_this.scroll.height();
						var contentHeight=_this.content.height();
						var scrollRate=bodyHeight/contentHeight;
						var moveRange=range/scrollRate;
						var contentTop=_this.body.scrollTop();
						var scrollTop=parseInt(_this.scrollBar.css("top"));
						contentTop+=moveRange*_flag;
						scrollTop+=range*_flag;
						if(contentTop<0){
							contentTop==0;
							scrollTop==0;
						}
						if(scrollTop<0){
							scrollTop=0;
						}
						if(scrollTop+_this.scrollBar.height()>bodyHeight){
							scrollTop=bodyHeight-_this.scrollBar.height();
						}
						var maxHeight=contentHeight-bodyHeight;
						if(contentTop>maxHeight){
							contentTop=maxHeight;
						}
						_this.scrollBar.css({top:scrollTop});
						_this.body.scrollTop(contentTop);
					}
					this.body.mousewheel(function(event,delta){
						scrollMove(50,-(delta));
					});
					
					this.scroll.unbind();
					this.scrollBar.unbind();
					this.scroll.mousewheel(function(event,delta){
						scrollMove(50,-(delta));
					});
					this.scroll.click(function(e){
						var barTop=_this.scrollBar.offset().top;
						var barHeight=_this.scrollBar.height();
						var eventY=e.pageY;
						var flag=eventY>barTop+barHeight?1:-1;
						var range=0;
						if(flag==1){
							range=eventY-barTop-barHeight;
						}else{
							range=barTop-eventY;
						}
						scrollMove(range,flag);
					});
					this.scrollBar.bind("mousedown",function(e){
						var y=e.pageY;
						var scrollTop=parseInt(_this.scrollBar.css("top"));
						var maxLen=_this.scroll.height()-_this.scrollBar.height();
						var bodyMaxLen=_this.content.height()-_this.body.height();
						$(document).bind("mousemove",function(e){
							var tmpTop=e.pageY-y+scrollTop;
							var newTop=tmpTop<0?0:(tmpTop>maxLen?maxLen:tmpTop);
							var bodyNewTop=newTop/maxLen*bodyMaxLen;
							_this.scrollBar.css({top:newTop});
							_this.body.scrollTop(bodyNewTop);
							return;
						});
						$(document).bind("mouseup",function(e){
							$(this).unbind("mousemove");
						});
					}).click(function(){
						return false;
					});
					function getTopDiff(target){
						var wrapHeight = $(window).height();
						var menuHeight=$(target).outerHeight();
						return wrapHeight-menuHeight;
					}
					this.content.children("li").each(function(){
						var $this=$(this);
						$this.click(function(event){
							Horn.Frame.stopBubble(event);
							if (Horn.Frame.menu.target.hasClass("h-menu-collapsed")) {
								return;
							}
							if($(this).hasClass("active")){
								$(this).removeClass('active').children('ul').hide();
							}else{
								$(this).addClass("active").siblings().removeClass("active");
								$(this).children("ul").show();
								$(this).siblings().children("ul").hide();
							}
							_this.resize();
						});
						$this.find("li").each(function(){
							$(this).click(function(event){
								Horn.Frame.stopBubble(event);
								if($(this).hasClass("active")){
									$(this).removeClass("active");
									$(this).children("ul").hide();
								}else{
									$(this).addClass("active");
									$(this).children("ul").show();
								}
							});
						});
						$this.hover(function(){
							if (Horn.Frame.menu.target.hasClass("h-menu-collapsed")) {
								if($(this).children("ul.h-menu-float").length>0){
									$(this).children("ul.h-menu-float").show();
								}else{
									var menuId=$(this).attr("menuid");
									$("ul.h-menu-float").hide();
									var sub=$("ul[parentMenu='"+menuId+"']").show();
									var top=$(this).offset().top;
									var topDiff=getTopDiff(sub);
									if(top>topDiff){
										top=topDiff;
									}
									var wrapTop=Horn.Frame.menu.target.offset().top;
									top=top-wrapTop;
									sub.css({
										position:'absolute',
										top:top,
										left:($(this).outerWidth()+$(this).offset().left)
									}).hover(function(){
										
									},function(){
										$(this).hide();
									});
									
								}
								
							}
							
						},function(){
							if (Horn.Frame.menu.target.hasClass("h-menu-collapsed")) {
								if($(this).children("ul.h-menu-float").length>0){
									$(this).children("ul.h-menu-float").hide();
								}else{
									var menuId=$(this).attr("menuid");
		                            Horn.Frame.menu.delayFunc=setTimeout(function(){
		                            	$("ul[parentMenu='"+menuId+"']").hide();
		                            },500);
								}
							}
						});
						$("ul.h-menu-float>li").each(function(){
							$(this).hover(function(){
								clearTimeout(Horn.Frame.menu.delayFunc);
								var sub=$(this).children("ul.h-menu-float").show();
								if(sub.length>0){
									var topRange=getTopDiff(sub);
									var subPosTop=sub.position().top;
									var top=$(this).offset().top;
									var posTop=$(this).position().top;
									if(top>topRange){
										subPosTop=posTop-(top-topRange);
									}else{
										subPosTop=posTop;
									}
									
									sub.css({
										top:subPosTop,
										left:($(this).outerWidth()+2)
									});
								}
								
							},function(){
								$(this).children("ul.h-menu-float").hide();
							});
							$(this).click(function(){
								$(this).children("ul.h-menu-float").hide();
							});
						});
					});
				}
		
		};
		Horn.Frame.menu.menus[menuId].initEvent();
		if(!Horn.Frame.menu.current.id){
			Horn.Frame.menu.current=Horn.Frame.menu.menus[menuId];
			Horn.Frame.menu.current.render();
		}
	}
	function initScreen() {
		var sel = "div.h-screen";
		var target = $(sel);
		if(target.length==0){
			return;
		}
		var param = getParam(target);
		var limit=12;
		if(param&&param.limit){
			if(!isNaN(param.limit)){
				limit=parseInt(param.limit);
			}
		}
		var tabEl=target.children("div.h-screen-tab");
		var tabContentEl=tabEl.children("div.h-screen-tab-con");
		var bodyEl=target.children("div.h-screen-con");
		var contentEl=$("div.h-screen-tab-con").children("ul");
		var prevEl=$("div.h-screen-tab-prev");
		var nextEl=$("div.h-screen-tab-next");
		var zoomEl=$("div.h-screen-tab-zoom");
		var setEl=$("div.h-screen-tab-set");
		Horn.Frame.openMenu=function(menuId,url,title,icon){
			if(Horn.Frame.locked){
				return;
			}
			var tab=$(".h-screen-tab-con ul li[tabId='"+menuId+"']");
			if(tab.length<1){
				Horn.Frame.screen.create({
					id:menuId,
					title:title,
					url:url,
					icon:icon
				});
			}
			Horn.Frame.screen.active(menuId);
			
		};
		
		Horn.Frame.loadMenu=function(menuId,url,title,icon){
			if(Horn.Frame.locked){
				return;
			}
			var tab=$(".h-screen-tab-con ul li[tabId='"+menuId+"']");
			if(tab.length>=1) {
				Horn.Frame.screen.close(menuId);
			}
			Horn.Frame.screen.create({
				id:menuId,
				title:title,
				url:url,
				icon:icon
			});
			Horn.Frame.screen.active(menuId);
		};
		function getTabLeft(tab){
			var w = 0;
			var b = true;
			$('>li', contentEl).each(function(){
				if ($(this).attr("tabId") == tab.attr("tabId")) {
					b = false;
				}
				if (b == true) {
					w += $(this).outerWidth(true);
				}
			});
			return w;
		}
		function getMaxScrollWidth() {
			var tabsWidth = 0;
			$('>li', contentEl).each(function(){
				tabsWidth += $(this).outerWidth(true);
			});
			var wrapWidth = tabContentEl.width();
			return tabsWidth - wrapWidth ;
		}
		Horn.Frame.screen={
				target:target,
				params:param,
				itemWidth:156,
				tab:tabEl,
				tabContent:tabContentEl,
				body:bodyEl,
				content:contentEl,
				prev:prevEl,
				next:nextEl,
				zoom:zoomEl,
				set:setEl,
				limitSize:limit,
				tabs:{},
				current:undefined,
				isHomePage:function(id){
					if(id=='_homePage'){
						return true;
					}
					return false;
				},
				isLimit:function(){
					return $(".h-screen-tab-con ul li").length<this.limitSize;
				},
				closeCurrent:function(){
					if(!this.current){
						return;
					}
					if(this.isHomePage(this.current.id)){
						return;
					}
					var i = $(".h-screen-tab-con ul li").index(this.current.target);
					$(".h-screen-tab-con ul li").eq(i).remove();
					$(".h-screen-con iframe").eq(i).remove();
					$('li:last', this.content).trigger('click');
				},
				closeAll:function(){
					$('li:first', this.content).trigger("click");
					$('li:first', this.content).siblings().remove();
					$("iframe:first",this.body).siblings().remove();
					for(var key in Horn.Frame.screen.tabs){
						if(this.isHomePage(key)){
							continue;
						}
						Horn.Frame.screen.tabs[key]=undefined;
					}
				},
				closeOther:function(){
					$('li:first', this.content).siblings().not(".active").remove();
					$('iframe:first', this.body).siblings().filter(":hidden").remove();
					for(var key in Horn.Frame.screen.tabs){
						if(this.isHomePage(key)||key==this.current.id){
							continue;
						}
						Horn.Frame.screen.tabs[key]=undefined;
					}
					this.resize();
				},
				close:function(id){
					if(this.current.id==id){
						this.closeCurrent();
					}else{
						if(this.isHomePage(id)){
							return;
						}
						var tab=$("li[tabId='"+id+"']",this.content);
						if(!tab){
							return;
						}
						tab.remove();
						$("iframe[tabId='"+id+"']",this.body).remove();
						Horn.Frame.screen.tabs[id]=undefined;
					}
					this.resize();
					
				},
				resize:function(){
					//褰撳墠鏍囩鎺у埗鍦ㄥ彲瑙嗚寖鍥�
					this.target.css("width",$(window).width()-parseInt(this.target.css("margin-left"))+"px");
					var tabWidth=this.target.innerWidth()-this.prev.outerWidth(true)-this.next.outerWidth(true)-this.zoom.outerWidth(true)-this.set.outerWidth(true);
					this.tabContent.css("width",tabWidth+"px");
					var currentTab=Horn.Frame.screen.current.target;
					var leftPos=getTabLeft(currentTab);
					var left = leftPos - this.tabContent.scrollLeft();
					var right = left + currentTab.outerWidth();
					if (left < 0 || right > tabWidth) {
						var pos = Math.min(
								leftPos - (tabWidth-currentTab.width()) / 2,
								getMaxScrollWidth()
						);
						this.tabContent.animate({scrollLeft:pos});
					}
				},
				initTab:function(tab){
					var title=$(tab).attr("title");
					var url=$(tab).attr("url");
					var id=$(tab).attr("tabId");
					Horn.Frame.screen.tabs[id]={
							id:id,
							target:$(tab),
							active:false,
							title:title,
							url:url
					};
					if(this.isHomePage(id)){
						Horn.Frame.screen.current=Horn.Frame.screen.tabs[id];
					}
					tab.mouseover(function(){
						tab.children(".h-tab-close").show();
					});
					tab.mouseout(function(){
						if(tab.hasClass("active")){
							tab.children(".h-tab-close").show();
						}else{
							tab.children(".h-tab-close").hide();
						}
						
					});
					tab.click(function(event){
						Horn.Frame.stopBubble(event);
						if(tab.hasClass("active")){
							return;
						}
						
						tab.addClass("active").siblings().removeClass("active");
						tab.children(".h-tab-close").show();
						tab.siblings().children(".h-tab-close").hide();
						var i = $(".h-screen-tab-con ul li").index(tab);
					    if(i>=0){
					    	var tabBody=$(".h-screen-con iframe").eq(i);
					    	if(tabBody.length>0){
					    		tabBody.show().siblings().hide();
					    		var tabSrc=tabBody.attr("src");
					    		if(typeof tabSrc !='string'||tabSrc==""){
					    			tabBody.attr("src",tab.attr("url"));
					    		}
					    	}
					        
					    }
					    Horn.Frame.screen.current=Horn.Frame.screen.tabs[id];
					    Horn.Frame.screen.resize();
					});
					$(".h-tab-close",tab).click(function(event){
						Horn.Frame.stopBubble(event);
						Horn.Frame.screen.close(id);
						
					});
				},
				init:function(){
					var _this=this;
					this.prev.click(function(){
						var left=parseInt(_this.tabContent.scrollLeft());
						if(left<1){
							return;
						}
						if(left<_this.itemWidth){
							_this.tabContent.scrollLeft(0);
						}else{
							_this.tabContent.scrollLeft(left-_this.itemWidth);
						}
						
					});
					this.next.click(function(){
						var count=_this.content.find("li").length;
						if(count<2){
							return;
						}
						var left=parseInt(_this.tabContent.scrollLeft());
						var maxWidth=getMaxScrollWidth();
						if(left<maxWidth){
							if(maxWidth-left>_this.itemWidth){
								_this.tabContent.scrollLeft(left+_this.itemWidth);
							}else{
								_this.tabContent.scrollLeft(maxWidth);
							}
						}
					});
					this.zoom.click(function(){
						if($(this).hasClass("h-screen-tab-narrow")){
							$(this).removeClass("h-screen-tab-narrow");
							Horn.Frame.expandMenu();
							Horn.Frame.expandHead();
						}else{
							$(this).addClass("h-screen-tab-narrow");
							Horn.Frame.collapsMenu();
							Horn.Frame.collapsHead();
						}
						setSize();
						Horn.Frame.screen.resize();
					});
					this.set.click(function(){
						if($(this).children("ul").is(":hidden")){
							$(this).children("ul").show();
						}else{
							$(this).children("ul").hide();
						}
					});
					$(".h-screen-tab-set ul li a").click(function(event){
						$(this).parent().parent().hide();
						event.stopPropagation();
					});
					$(".h-set-close span").click(function(event){
						$(this).parent().parent().hide();
						event.stopPropagation();
					});
					this.content.children("li").each(function(){
						Horn.Frame.screen.initTab($(this));
					});
					//$('li:first', this.content).trigger('click');
					Horn.Frame.screen.resize();
					$(window).resize(function(){
						if(response()==false){
							Horn.Frame.screen.resize();
						}
						
					});
				},
				create:function(conf){
					if(Horn.Frame.screen.isLimit()){
						if(typeof conf != 'object'){
							return ;
						}
						if(typeof conf.url =='undefined'||typeof conf.title == 'undefined'){
							return ;
						}
						//娓叉煋鏍囩
						var tabHtml="<li";
						if(conf.id){
							tabHtml+=" tabId=\""+conf.id+"\"";
						}
						if(conf.url){
							tabHtml+=" url=\""+conf.url+"\"";
						}
						tabHtml+=" url=\""+conf.url+"\" title=\""+conf.title+"\">";
						if(conf.icon){
							tabHtml+="<i class=\"h-i-"+conf.icon+"\"></i>";
						}
						tabHtml+="<span>"+conf.title+"</span><span class=\"h-tab-close\"></span></li>";
						var tab=$(tabHtml);
						var tabNum=$(">li",this.content).length;
						var tabWidth=$("li:first",this.content).outerWidth();
						this.content.css("width",tabWidth*(tabNum+1)+"px");
						tab.appendTo(this.content);
						Horn.Frame.screen.initTab(tab);
						//娓叉煋鍐呭
						var tabBodyHtml="<iframe tabId=\""+conf.id+"\" style=\"display:none;\" frameborder=\"0\" width=\"100%\" height=\"100%\" scrolling=\"auto\" ></iframe>";
						
						Horn.Frame.screen.body.append($(tabBodyHtml));
					}else{
						if(Horn.Tip){
							Horn.Tip.info("最多只能打开"+Horn.Frame.screen.limitSize+"个工作视图,可以尝试关闭不必要的视图后再进行该操作.");
						}else{
							alert("最多只能打开"+Horn.Frame.screen.limitSize+"个工作视图,可以尝试关闭不必要的视图后再进行该操作.");
						}
					}
				},
				active:function(tabId){
					if(typeof tabId !='string'||tabId==""){
						return;
					}
					var currentTab=Horn.Frame.screen.tabs[tabId];
					if(typeof currentTab !='object'){
						return;
					}
					if(currentTab.target.hasClass("active")){
						return;
					}
					currentTab.target.trigger('click');
					currentTab.active=true;
					
				}
		};
		Horn.Frame.screen.init();
	}
	function setSize() {
		$(".layout").layout();
	}
	function response(){
		var winWidth=$(window).width();
		if(Horn.Frame.tool){
			if(winWidth<1000){
				if(Horn.Frame.tool.expand){
					Horn.Frame.tool.expand=false;
					$("div.h-toolbar").addClass("h-toolbar-collapsed");
				}
			}else{
				if(!Horn.Frame.tool.expand){
					Horn.Frame.tool.expand=true;
					$("div.h-toolbar").removeClass("h-toolbar-collapsed");
					$("div.h-toolbar").children("ul").show();
				}
			}
		}
		if(Horn.Frame.navigation){
			if(winWidth<700){
				if(Horn.Frame.navigation.expand){
					Horn.Frame.navigation.expand=false;
					$("div.h-nav").addClass("h-nav-collapsed");
				}
			}else{
				if(!Horn.Frame.navigation.expand){
					Horn.Frame.navigation.expand=true;
					$("div.h-nav").removeClass("h-nav-collapsed");
					$("div.h-nav").children("div.h-nav-con").show();
				}
			}
		}
		
		if(winWidth<760&&Horn.Frame.pc){
			Horn.Frame.screen.zoom.addClass("h-screen-tab-narrow");
			Horn.Frame.screen.zoom.hide();
			Horn.Frame.collapsMenu();
			Horn.Frame.collapsHead();
			setSize();
			Horn.Frame.screen.resize();
			Horn.Frame.pc=false;
			return true;
		}else{
			if(Horn.Frame.pc == false){
				Horn.Frame.pc=true;
				Horn.Frame.screen.zoom.show();
			}
		}
		return false;
	}
	function init() {
		setSize();
		initNav();
		initTool();
		initMenu();
		initScreen();
		response();
	}
	$(function(){
		init();
	});
})(jQuery);
(function($) {
	function init(container) {
		var cc = $(container);
		var lCss = {};
		if (cc[0].tagName == 'BODY') {
			$('html').css({
				height : '100%',
				overflow : 'hidden'
			});
			lCss = $.extend({
				height : '100%',
				overflow : 'hidden',
				border : 'none'
			}, lCss || {});
		}
		var fit = cc.attr("fit");
		function setSize() {
			if (fit == "true") {
				var p = cc.parent();
				lCss.height = p.height();
			} else {
				lCss.height = cc.attr("height") ? cc.attr("height") : "auto";
			}
			// 璁剧疆甯冨眬瀹瑰櫒
			cc.css(lCss);
			// 鑾峰彇鎵�湁鍖哄煙
			function getRegion() {
				var region = {
						north:[],
						center:undefined,
						south:[]
				};
				$(">div[region]", container).each(function() {
					var $this = $(this);
					var dir = $this.attr("region");
					if(dir=='north'){
						region.north.push($this);
					}
					if(dir=='south'){
						region.south.push($this);
					}
					if(dir='center'){
						region.center=$this;
					}
				});
				return region;
			}
			// 鏋勯�鍚勪釜鍖哄煙鐨勬牱寮�
			var regions = getRegion();
			if(regions.center){
				// 鍑嗗center鍖哄煙鏍峰紡
				var cCss = {
					height : cc.height()
				};
				// 鎺掗櫎north鍖哄煙
				for(var i=0;i<regions.north.length;i++){
					var attrHeight = regions.north[i].attr("height");
					var nH = attrHeight ? Number(attrHeight) : regions.north[i].height();
					cCss.height -= nH;// center鍖哄煙楂樺害鍑忓皯
				}
				// 鎺掗櫎south鍖哄煙
				for(var i=0;i<regions.south.length;i++){
					var attrHeight = regions.south.attr("height");
					var sH = attrHeight ? Number(attrHeight) : regions.south.height();
					cCss.height -= sH;
				}
				regions.center.css(cCss);
			}
			
		}
		setSize();
		if (fit == "true") {
			$(window).resize(function() {
				setSize(cc);
			});
		}
	}
	$.fn.layout = function() {
		return this.each(function() {
			init(this);
		});
	};
})(jQuery);
