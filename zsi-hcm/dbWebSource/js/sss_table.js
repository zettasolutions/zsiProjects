(function(){
    var bs = zsi.bs.ctrl;
    var svn =  zsi.setValIfNull;
    
    zsi.ready = function(){
        $(".page-title").html("SSS");
        displaySSS();
    };
    
    $("#btnSave").click(function () {
        $("#sssGrid").jsonSubmit({
             procedure  : "sss_table_upd"
            ,onComplete : function (data) {
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                displaySSS();
            }
        });
    });
    $("#btnDelete").click(function(){
        $("#sssGrid").deleteData({
    		tableCode: "ref-0004"  
    		,onComplete : function(d){
    			displaySSS();
    		}
    	 }); 
    });
    
    function displaySSS(){
    var cb = app.bs({name:"cbFilter1",type:"checkbox"}); 
    $("#sssGrid").dataBind({
         sqlCode        : "S158"
	    ,width          : $(".zContainer").width()
	    ,height         : $(window).height() - 236
        ,blankRowsLimit : 5
        ,dataRows   : [
                 {text: cb                      ,width:25           ,style:"text-align:center"
                     ,onRender : function(d){
                         return   app.bs({name:"id",type:"hidden",value: svn (d,"id")}) 
                                + app.bs({name:"is_edited"            ,type:"hidden"  ,value: svn(d,"is_edited")}) 
                                + (d !== null ? bs({name:"cb",type:"checkbox"}) : "" );
                     }
                 }
                ,{text:"Salary Range (From)"        ,type:"input"       ,name:"salary_fr"               ,width:150        ,style:"text-align:center"}
                ,{text:"Salary Range (To)"          ,type:"input"       ,name:"salary_to"               ,width:150        ,style:"text-align:center"}
                ,{text:"MSC         "               ,type:"input"       ,name:"msc"                     ,width:150        ,style:"text-align:center"}
                ,{text:"SSC_ER"                     ,type:"input"       ,name:"ssc_er"                  ,width:160        ,style:"text-align:center"}
                ,{text:"SSC_EE"                     ,type:"input"       ,name:"ssc_ee"                  ,width:150        ,style:"text-align:center"}
                ,{text:"ECC_ER"                     ,type:"input"       ,name:"ecc_er"                  ,width:150        ,style:"text-align:center"}
                
              ]
              ,onComplete: function(){
                this.find("[name='cbFilter1']").setCheckEvent("#sssGrid input[name='cb']");
              }  
        });
    
    }     
})();      