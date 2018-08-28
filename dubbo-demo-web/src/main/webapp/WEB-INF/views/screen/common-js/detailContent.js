 function createDetailHtml(title,arrays){
		$('#detailContent').html('<h1 style="margin-bottom: 50px;margin-left: 30%;">'+title+'</h1><div class="return"><a href="javascript:void(0);"></a></div>');
		var groudIdStore = new Array();
		if(arrays && arrays.length > 0){
           var colums = 0;//列数
           var commonData = true;
           var columnObj = {};
           for(var i in arrays){
        	   if(arrays[i]['type'] =='table'){
        		    if(arrays[i]['title']){
        			    createTablePanel('title'); 
        		    }
	 			  	//说明为table类型
	 			  	if(arrays[i]['dataType'] == 'header' ){
	 			  		createTableHeader(arrays[i]['row']);
	 			  	}else{
	 			  		createTableContent(arrays[i]['row']);
	 			  	}
	 			  	
	   		   }
        	   if(arrays[i]['groupId'] || arrays[i]['groupId'] == 0){
        		   commonData = false;
        		   //如果存在groupId 则说明是需要分组的数据
        		   if(notContain(groudIdStore,arrays[i]['groupId'])){
        			   //如果groudID不存在Store里面则添加进去
        			   groudIdStore.push(arrays[i]['groupId']);
        			   columnObj[arrays[i]['groupId']] = 0;
        			   //创建一个新的panel
        			   createPanel('panel'+arrays[i]['groupId']);
        		   }
        		   //如果已经存在,则在指定panel中新增一个控件
        		   columnObj[arrays[i]['groupId']]= checkCols("panel"+arrays[i]['groupId'],arrays[i],columnObj[arrays[i]['groupId']]);
        		   if(columnObj[arrays[i]['groupId']] % 3 == 0){
        			   if(columnObj[arrays[i]['groupId']] == 3){
        				   $("#"+"panel"+(arrays[i]['groupId'])).children('div').not('.panel-header').wrapAll("<div class='row detail-row'> </div>");
        			   }else if(columnObj[arrays[i]['groupId']] != 0){
        				   $("#"+"panel"+(arrays[i]['groupId'])+" div:last").prevUntil('.detail-row').andSelf().wrapAll("<div class='row detail-row'> </div>");
        			   }
        		   }
        	   }else{
        		   colums = checkCols('detailContent',arrays[i],colums);
                   if(colums % 3 == 0){
                     	if(colums == 3){
                            $('#detailContent').children('div').wrapAll("<div class='row detail-row'> </div>");
	   	                }else{
	   	                   $('#detailContent div:last').prevUntil('.detail-row').andSelf().wrapAll("<div class='row detail-row'> </div>");
	   	                }
                   }
        	   }
           }
           
           if(commonData){//普通数据
        	   $('#detailContent').children('div:not(".detail-row")').wrapAll("<div class='row detail-row'> </div>");
           }else{
        	   //有groupId的数据 
        	   for(var i = 0 ; i < groudIdStore.length;i++){
        		   $("#"+"panel"+(groudIdStore[i])).children('div:not(".detail-row")').not('.panel-header').wrapAll("<div class='row detail-row'> </div>");
        	   }
           }
         
        }
}

 function checkCols(id,item,colums){
	 if(item['cols']){
         colums += new Number(item['cols']);
     }else{
         //未传入行数       
         colums ++;                  
     }
     for(var name in item){
         if( name && name != 'cols' && name != 'groupId' && name != 'groupTitle'){
      	   createContent('#'+id,name,item[name],item['cols']);
         }else if(name == 'groupTitle'){
        	 createContentTitle('#'+id,item[name]);
        	 colums--;//减去title的列
         }                                      
     }
     return colums;
 }
 
 function createContentTitle(id,title){
	 $(id).prepend('<div class="panel-header clearfix"><h3 class="pull-left">'+title+'</h3> </div>');
 }
 function createPanel(id){
	 $('#detailContent').append('<div id="'+id+'" class="panel"></div>');
 }
 
function createTablePanel(title){
	$('#detailContent').append('<div class="panel table" id="table"><div class="panel-header clearfix"><h3 class="pull-left">'+title+'</h3> </div><div class="row detail-row"><table class="bui-grid-table" cellspacing="0" cellpadding="0"  style="text-align : center;"></table></div></div>')
}

function createTableHeader(rows){
	var content = '<tr>';
	for(var i in rows){
		content = content+ ('<th>'+rows[i]+'</th>');
	}
	content = content + '</tr>';
	$('.bui-grid-table').append(content);
}

function createTableContent(rows){
	var content = '<tr>';
	for(var i in rows){
		content = content+ ('<td>'+rows[i]+'</td>');
	}
	content = content + '</tr>';
	$('.bui-grid-table').append(content);
}

 function notContain(array, item){
	 var notContain = true;
	 for(var i in array){
		 if(item == array[i]){
			 notContain = false;
		 }
	 }
	 return notContain;
 }
 
 
function createContent(id,name, value,cols){
     if(cols){
          cols = new Number(cols);
          $(id).append("<div class='span"+(8*cols)+"' style='word-wrap:break-word'><label>"+name+"：</label><span class='detail-text'>"+value+"</span></div>");
     }else{
          $(id).append("<div class='span8' style='word-wrap:break-word'><label>"+name+"：</label><span class='detail-text'>"+value+"</span></div>");
     }                  
}

$('.return').live('click',function(){
	if ($('#editContent').length >0 && ($('#editContent').attr('class') !== 'hide')){
		$('#editClose').trigger('click');
	}else if ($('#submitContent').length >0 && ($('#submitContent').attr('class') !== 'hide')){
		$('#backSubmitBtn').trigger('click');
	} else if ($('#detailContent').length >0 && ($('#detailContent').attr('class') !== 'hide')) {
		$('#detailContent').addClass("hide");
		$('#editContent').addClass('hide');
		$('#listContent').removeClass("hide");
		$(window).scrollTop(scrollTop);
	}
});
$('.return').live('mouseenter',function(){
	$(this).append('<p style="width:55px;position:absolute;top:55px;">返回(Esc)</p>');
});
$('.return').live('mouseleave',function(){
	$(this).children('p').remove();
});
$(document).on('keyup',function(e){
	if(e.keyCode === 27 && ($('#listContent').attr('class') === 'hide') ){
		if($('.returnSubmit').size() > 0){
			$('.returnSubmit').trigger('click');
		}else{
			$('.return').trigger('click');
		}
	}
});
