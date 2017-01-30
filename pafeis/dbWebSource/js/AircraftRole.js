var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;
zsi.ready(function(){
    displayRecords();
  
});

$("#btnSave").click(function () {
  //  console.log("test");
   $("#grid").jsonSubmit({
             procedure: "aircraft_role_upd"
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
	     url            : execURL + "aircraft_role_sel"
	    ,width          : $(document).width() - 35
	    ,height         : $(document).height() - 250
        ,selectorType   : "checkbox"
        ,blankRowsLimit:5
       // ,isPaging : false
        ,dataRows : [
    	
    		   {text  : cb                      , width : 25        , style : "text-align:left;"       
            		    , onRender      :  function(d){ 
                		              return bs({name:"aircraft_role_id"   ,value: svn (d,"aircraft_role_id")    ,type:"hidden"})
                		                 +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                    }
                }	 
            	,{ text:"Aircraft Role"         , width:300          , style:"text-align:center;"        , type:"input"          ,name:"aircraft_role"}
            	,{ text:"Active"                , width:75           , style:"text-align:center;"        , type:"yesno"         ,name:"is_active"  ,defaultValue:"Y"}
	    ]
	      ,onComplete: function(){
                    $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
            }
    });    
}
$("#btnDelete").click(function(){
    zsi.form.deleteData({
         code       : "ref-0015"
        ,onComplete : function(data){
                        displayRecords();
                      }
    });      
});             