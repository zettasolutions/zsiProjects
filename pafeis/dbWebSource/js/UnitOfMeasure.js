  var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;
zsi.ready(function(){
    displayRecords();
});


$("#btnSave").click(function () {
  //  console.log("test");
   $("#grid").jsonSubmit({
             procedure: "unit_of_measure_upd"
            , optionalItems: ["is_active"]
            , onComplete: function (data) {
                $("#grid").clearGrid();
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                displayRecords();
            }
    });
});
    
function displayRecords(){
     var cb = bs({name:"cbFilter1",type:"checkbox"});
     $("#grid").dataBind({
	     url            : execURL + "unit_of_measure_sel"
	    ,width          : 600
	    ,height         : 400
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        //,isPaging : false
        ,dataRows : [
                 {text  : cb                                                           , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"unit_of_measure_id",type:"hidden",value: svn (d,"unit_of_measure_id")})
                                                      +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
            }	 
        		,{text  : "Code"                , name  : "unit_of_measure_code"        , type  : "input"         , width : 150       , style : "text-align:left;"}
        		,{text  : "Name"                , name  : "unit_of_measure_name"        , type  : "input"         , width : 320       , style : "text-align:left;"}
        		,{text  :"Active?"              , name  : "is_active"                   , type  : "yesno"         , width:75          , style : "text-align:left;"   ,defaultValue:"Y"                 }
	    ] 
    	     ,onComplete: function(){
                $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
        }  
    });    
}
    

$("#btnDelete").click(function(){
    zsi.form.deleteData({
         code       : "ref-0011"
        ,onComplete : function(data){
                        displayRecords();
                      }
    });       
});
    
                                           