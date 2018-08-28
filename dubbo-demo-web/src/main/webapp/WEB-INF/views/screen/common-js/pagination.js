/**
 * 分页
 */
var objByGroup = [];
var fixedGroup = [];
function pagination(grid,indentWidth){
	var totalWidth = 0;
	var fixedWidth = 0;
	 var groupIndex1 = [];//默认的第一组
	 objByGroup.push(groupIndex1);
	 var operColWidth = 0;
	//如果存在操作行，则将操作行长度计算到页面中
	 if(grid.findColumn(columns.length-1).get('operationCol')){
		 operColWidth = grid.findColumn(columns.length-1).get('width');
	 }
	  
	 for(var i=0; i< columns.length;i++){
		 if(grid.findColumn(i).get('operationCol') == 'operationCol'){
			 //如果是操作列不做任何操作
			 continue;
		 }
		 if(grid.findColumn(i).get('fixed')){
			 //如果是固定列
			 fixedWidth += grid.findColumn(i).get('width');
			 fixedGroup.push(i);
		 }else{
			 totalWidth += grid.findColumn(i).get('width');
			 
			 if(totalWidth + fixedWidth + operColWidth +30> $('body').width()-(indentWidth?indentWidth:0)){
				 //清零
				 totalWidth = grid.findColumn(i).get('width');
				 //加入一组新的group
				 var groupIndex = [];
				 groupIndex.push(i);
				 objByGroup.push(groupIndex);
			 }else{
				 //加入group
				 objByGroup[objByGroup.length-1].push(i);
			 }
		 }
	 }
	 
	 if(objByGroup.length > 1){
		 createTableSpan();//创建span
		 
		 for(var i in objByGroup){
			 createButton(i,objByGroup.length);//创建button
		 }
		 showData(0);//显示数据
	 }
}


function showData(t){
	 if(t instanceof Object){
		 t = parseInt($(this).attr('groupId').toString());
	 }
	 toggleActive(t);
	 for(var i=0; i< columns.length;i++){
		 if($.inArray(i, objByGroup[t]) != -1 || $.inArray(i,fixedGroup) != -1){
			 grid.findColumn(i).set('visible',true);
		 }else{
			 grid.findColumn(i).set('visible',false);
		 }
	 }
	 //如果是操作行，则设置为显示
	 if(grid.findColumn(columns.length-1).get('operationCol')){
		 grid.findColumn(columns.length-1).set('visible',true);
	 }
	
}

//转换选择的
function toggleActive(i){
	$('.tablePanel .tableButton').each(function(){
		if(parseInt($(this).attr('groupId').toString()) == i){
			$(this).find('.display-tableButton').addClass('active');
		}else{
			$(this).find('.display-tableButton').removeClass('active');
		}
	});
}

function createTableSpan(){
	$('.bui-grid-bbar').prepend('<span class="tablePanel"></span>');
}
function createButton(i,countSize){
	$('.tablePanel').append('<span class="tableButton" groupId="'+i+'"><span class="display-tableButton"></span></span>');
}
$('.tableButton').live('click',showData);