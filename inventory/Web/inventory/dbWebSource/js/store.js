 var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;


zsi.ready(function(){
  
   /* $(".zPanel").css({
            height:$(window).height()-179
        });*/
     
    displayRecords();
  
});

$("#btnSave").click(function () {
    $("#grid").jsonSubmit({
              procedure  : "stores_upd"
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
	     url            : procURL + "stores_sel"
	    ,width          : 400
	    ,height         : 506
	    //,selectorType   : "checkbox"
        ,blankRowsLimit:5
       // ,isPaging : false
        ,dataRows : [
    	
    		   {text  : cb                                 , width : 25        , style : "text-align:left;"       
            		    , onRender      :  function(d){ 
                		              return bs({name:"store_id"   ,value: svn (d,"store_id")    ,type:"hidden"})
                		                 +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                    }
                }	 
            	,{ text:"Store Name"                           , width:365       , style:"text-align:center;"        , type:"input"          ,name:"store_name"}
	    ]
    });    
}

        