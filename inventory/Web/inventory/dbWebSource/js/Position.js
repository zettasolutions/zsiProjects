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
              procedure  : "position_upd"
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
	     url            : procURL + "position_sel"
	    ,width          : 800
	    ,height         : 506
	    //,selectorType   : "checkbox"
        ,blankRowsLimit:5
       // ,isPaging : false
        ,dataRows : [
    	
    		   {text  : cb                                 , width : 25        , style : "text-align:left;"       
            		    , onRender      :  function(d){ 
                		              return bs({name:"position_id"   ,value: svn (d,"position_id")    ,type:"hidden"})
                		                 +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                    }
                }	 
            	,{ text:"Position"                          , width:300       , style:"text-align:center;"        , type:"input"          ,name:"position_name"}
            	,{ text:"Job Description"                   , width:300       , style:"text-align:center;"        , type:"input"          ,name:"job_description"}
            	,{ text:"Active?"                           , width:100       , style:"text-align:center;"        , type:"yesno"          ,name:"is_active"}
	    ]
    });    
}

          