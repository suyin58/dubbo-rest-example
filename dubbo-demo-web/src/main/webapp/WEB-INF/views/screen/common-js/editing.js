editing = new BUI.Grid.Plugins.DialogEditing({
        contentId : 'content',
        triggerCls : 'btn-edit',
        editor : {
        	      	success : function(){
        	              var edtor = this,
        	              form = edtor.get('form'),
        	                 editType = editing.get('editType');//add 或者 edit
        	               	 if(editType == 'add'){ //可以根据编辑类型决定url
        	               		 url = addUrl;
        	               	 }else{
        	               		 url = updateUrl;
        	                 }
        	               //检验
        	               form.valid();
        	               if(form.isValid()){
        	                  form.ajaxSubmit({ //表单异步提交
        	                   url : url,
        	                   type: "POST",
        	                    success : function(data){
        	                      if(data.exception){
        	                    	  BUI.Message.Alert(data.exception);
        	                      }else{
        	                    	  if(editType == 'add'){
        	                    		editing.cancel();
              	                        BUI.Message.Alert("新增成功");              	                        
              	                        store.load();
              	                     }else{
              	                    	editing.cancel();
              	                    	BUI.Message.Alert("修改成功");
              	                        store.load();
              	                     }
        	                      }                             
        	                    },
        	                    error : function(){
        	                      alert("系统异常");
        	                    }
        	               });
        	          }
        	       }
        	    }
     
});

