grid.on('dblclick',function(ev){
	if(ev.domTarget.className == 'bui-grid-cell-text' || ev.domTarget.className  == 'bui-grid-radio'
		|| ev.domTarget.className  == 'bui-grid-cell-text-format' || ev.domTarget.className == 'bui-grid-cell bui-grid-cell-empty'){
		modifyFunction();	
	}			
});