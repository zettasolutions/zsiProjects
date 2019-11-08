(function(){
    var bs = zsi.bs.ctrl;
    var svn =  zsi.setValIfNull;

zsi.ready = function(){
    $(".page-title").html("Regions");
    displayRecords();
  
};


$("#btnSave").click(function () {
   $("#grid").jsonSubmit({
             procedure: "regions_upd"
             ,optionalItems: ["is_active"]
             ,onComplete: function (data) {
            //    $("#grid").clearGrid();
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                displayRecords();
            }
    });
});
    
function displayRecords(){
    //type : "input" is optional in line 37, 38s
     var cb = app.bs({name:"cbFilter1",type:"checkbox"});
     $("#grid").dataBind({
	    url             : app.execURL + "regions_sel"
	    ,width          : $(".zContainer").width()
	    ,height         : $(document).height() - 300
	   // ,selectorType   : "checkbox"
        ,blankRowsLimit : 5
        ,isPaging       : false
        ,dataRows       : [
                            { text  : cb , width : 25   , style : "text-center" 
                                , onRender  :  function(d)
                                    { return     app.bs({name:"region_id",type:"hidden"  ,value: svn (d,"region_id")})
                                    +   bs({name:"is_edited"             ,type:"hidden"  ,value: svn (d,"is_edited")})  
                                    + (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "" ); }
                            }	 
            		        ,{text  : "Region Code"          , name  : "region_code"                  , type  : "input"         , width : 200       , style : "text-align:left;"}
            		        ,{text  : "Region Name"          , name  : "region_name"                  , type  : "input"         , width : 300       , style : "text-align:left;"}
            		        ,{text  : "Active?"             , width : 60            , style : "text-align:center;"          ,defaultValue:"Y"
                                   ,onRender : function(d){ return app.bs({name:"is_active" ,type:"yesno"   ,value: svn(d,"is_active")    });
                                                                  
                                 }
                            }
	                    ]
    	    ,onComplete: function(){
                $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
        }  
    });    
}

$("#btnDelete").click(function(){
    zsi.form.deleteData({
         code       : "ref-"
        ,onComplete : function(data){
                        displayRecords();
                      }
    });       
});
})();
               