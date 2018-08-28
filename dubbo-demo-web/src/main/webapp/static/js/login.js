	function logining(){
	   $("#btnLogin").attr("disabled","true");
	   $("#btnLogin").removeClass("btnLogin");
	   $("#btnLogin").html("<font style='font-weight:800;'>登录中...</font>");
	}	
    
    function logined(loginedName){
	   $("#btnLogin").removeAttr("disabled");
	   $("#btnLogin").addClass("btnLogin");
	   $("#btnLogin").html("<font style='font-weight:800;'>"+loginedName+"</font>");
	}
    
    