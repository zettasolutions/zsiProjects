(function(){
    var bs = zsi.bs.ctrl;
    var svn =  zsi.setValIfNull;

    zsi.ready = function(){
         $(".page-title").html("Phil Health");
         displayPhilHealth();
    };
     
    
    $("#btnSave").click(function () {
       $("#philHealth").jsonSubmit({
                 procedure: "philhealth_table_upd"
                ,onComplete: function (data) {
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    displayPhilHealth();
                }
        });
    });
    
    $("#btnDelete").click(function(){
        
         $("#philHealth").deleteData({
    		tableCode: "ref-0001"   
    		,onComplete : function(d){
    		 displayPhilHealth();
    		}
    	 });   
    });
    
    function displayPhilHealth(){
        var _cb = app.bs({name:"cbFilter1",type:"checkbox"});
        $("#philHealth").dataBind({
             sqlCode        : "P156"
            ,height         : $(window).height() - 236
            ,blankRowsLimit : 5
            ,dataRows   : [
                {text: _cb                                                                          ,width:25           ,style:"text-align:left"
                 ,onRender : function(d){
                         return app.bs({name:"philhealth_id"               ,type:"hidden"      ,value: app.svn(d,"philhealth_id")})  
                              + app.bs({name:"is_edited"                ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                              + (d !== null ? app.bs({name:"cb"         ,type:"checkbox"}) : "" );
                     }
                 }
                ,{text:"Salary Range (From)"        ,type:"input"       ,name:"salary_fr"               ,width:150        ,style:"text-align:center"}
                ,{text:"Salary Range (To)"          ,type:"input"       ,name:"salary_to"               ,width:150        ,style:"text-align:center"}
                ,{text:"Salary Base"                ,type:"input"       ,name:"salary_base"             ,width:150        ,style:"text-align:center"}
                ,{text:"Total Monthly Premium"      ,type:"input"       ,name:"total_monthly_premium"   ,width:160        ,style:"text-align:center"}
                ,{text:"Employee Share"             ,type:"input"       ,name:"ee_share"                ,width:150        ,style:"text-align:center"}
                ,{text:"Employer Share"             ,type:"input"       ,name:"er_share"                ,width:150        ,style:"text-align:center"}
                
            ]
            ,onComplete: function(){
                var _this = this;
                 _this.find("[name='cbFilter1']").setCheckEvent("#philHealth input[name='cb']"); 
            }
        });
    }
     
})();
 
 
 
 
 
 
 
 
 
               