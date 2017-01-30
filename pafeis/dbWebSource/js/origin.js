var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;



zsi.ready(function(){
    displayRecords();
});


$("#btnSave").click(function () {
  //  console.log("test");
   $("#grid").jsonSubmit({
             procedure: "origin_upd"
            ,optionalItems: ["is_active"]
            ,onComplete: function (data) {
                $("#grid").clearGrid();
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                displayRecords();
            }
    });
});
    
function displayRecords(){
     var cb = bs({name:"cbFilter1",type:"checkbox"});
     $("#grid").dataBind({
	     url            : execURL + "origin_sel"
	    ,width          : $(document).width() - 35
	    ,height         : $(document).height() - 250
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
                 {text  : cb                                                           , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"origin_id",type:"hidden",value: svn (d,"origin_id")})
                                                      +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
                }	 
        		,{text  : "Origin Code"   , name  : "origin_code"   , type  : "input"         , width : 200       , style : "text-align:left;"}
        		,{text  : "Origin Name"   , name  : "origin_name"   , type  : "input"         , width : 200       , style : "text-align:left;"}
        		,{text  : "Active?"       , name  : "is_active"     , type  : "yesno"         , width : 75        , style : "text-align:left;"   ,defaultValue:"Y"}
	    ] 
    	     ,onComplete: function(){
                $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
        }  
    });     
}
    

$("#btnDelete").click(function(){
    zsi.form.deleteData({
         code       : "ref-0009"
        ,onComplete : function(data){
                        displayRecords();
                      }
    });       
});
    
                                         