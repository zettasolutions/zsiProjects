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
              procedure  : "units_upd"
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
	     url            : procURL + "units_sel"
	    ,width          : 435
	    ,height         : 506
	    //,selectorType   : "checkbox"
        ,blankRowsLimit:5
       // ,isPaging : false
        ,dataRows : [
    		
            	 {text  : cb                                 , width : 25        , style : "text-align:left;"       
            		    , onRender      :  function(d){ 
                		              return bs({name:"unit_id"   ,value: svn (d,"unit_id")    ,type:"hidden"});
                    }
                }	 
            	,{ text:"Code"                           , width:200        , style:"text-align:center;"        , type:"input"          ,name:"unit_sdesc"}
                ,{ text:"Description"                    , width:200        , style:"text-align:center;"        , type:"input"          ,name:"unit_desc"}
	    ]
    });    
}

        