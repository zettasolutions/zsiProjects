var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;


zsi.ready(function(){
  
   displayRecords();
  
});

$("#btnSave").click(function () {
    $("#grid").jsonSubmit({
              procedure  : "conv_units_upd"
             ,onComplete : function (data) {
                  $("#grid").clearGrid();
                  if(data.isSuccess===true) zsi.form.showAlert("alert");
                  displayRecords();
             }
        });    
});



 function displayRecords(){
      var cb = bs({name:"cbFilter1",type:"checkbox"});
     $("#grid").dataBind({
	     url            : execURL + "conv_units_sel"
	    ,width          : 490
	    ,height         : 506
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,dataRows : [
    		
            	 {text  : cb                                 , width : 25        , style : "text-align:left;"       
            		    , onRender      :  function(d){ 
                		              return bs({name:"conv_id"   ,value: svn (d,"conv_id")    ,type:"hidden"})
                		                                +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                    }
                }	 
            	,{ text:"Convert From"     , width:150        , style:"text-align:center;"        , type:"select"          ,name:"from_unit_id"}
            	,{ text:"Convert To"       , width:150        , style:"text-align:center;"        , type:"select"          ,name:"conv_unit_id"}
                ,{ text:"Convert Qty"      , width:150        , style:"text-align:center;"        , type:"input"           ,name:"conv_unit_qty"}
	    ]
	    ,onComplete: function(){
            $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
            $("select[name='from_unit_id']").dataBind( "units");
            $("select[name='conv_unit_id']").dataBind( "units");
	    }
    });    
}

$("#btnDelete").click(function(){
    zsi.form.deleteData({
         code       : "ref-0006"
        ,onComplete : function(data){
                        displayRecords();
                      }
    });   

});   
           