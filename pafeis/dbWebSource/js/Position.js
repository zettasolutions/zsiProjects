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
              procedure  : "positions_upd"
              ,optionalItems : ["is_active"]
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
	     url            : execURL + "positions_sel"
	    ,width          : 800
	    ,height         : 400
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
       // ,isPaging : false
        ,dataRows : [
    	
    		   {text  : cb                                 , width : 25        , style : "text-align:left;"       
            		    , onRender      :  function(d){ 
                		              return bs({name:"position_id"   ,value: svn (d,"position_id")    ,type:"hidden"})
                		                 +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                    }
                }	 
            	,{ text:"Code"                              , width:300       , style:"text-align:center;"        , type:"input"          ,name:"position_code"}
            	,{ text:"Position"                          , width:300       , style:"text-align:center;"        , type:"input"          ,name:"position"}
            	,{ text:"Active?"                           , width:100       , style:"text-align:center;"        , type:"yesno"          ,name:"is_active" ,defaultValue : "Y" }
	    ]
	     ,onComplete: function(){
                $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
               // $("select[name='wing_commander_id']").dataBind( "employee");
           
        }  
    });    
} 