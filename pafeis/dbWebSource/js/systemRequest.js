var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;



zsi.ready(function(){
    displayRecords();
    
});





$("#btnSave").click(function () {
   $("#grid").jsonSubmit({
             procedure: "sys_requests_upd"
            ,optionalItems: ["is_active"] 
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
	     url            : execURL + "sys_requests_sel"
	    ,width          : 1200
	    ,height         : $(document).height() - 250
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
                 {text  : cb                                                           , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"ticket_id",type:"hidden",value: svn (d,"ticket_id")})
                		                              // +  bs({name:"is_edited",type:"hidden"}) 
                                                      +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
                 }	 
        		,{text  : "Ticket Date:"             , name  : "ticket_date"              , type  : "input"           , width : 200       , style : "text-align:left;"}
        		,{text  : "Request By"               , name  : "requested_by"             , type  : "select"          , width : 410       , style : "text-align:left;"}
        		,{text  : "Request Desc"             , name  : "request_desc"             , type  : "input"           , width : 100       , style : "text-align:left;"}
         		,{text  : "Request Typr"             , name  : "request_type_id"          , type  : "input"           , width : 100       , style : "text-align:left;"}
	            ,{text  : "Status"                   , name  : "status_id"                , type  : "input"           , width : 100       , style : "text-align:left;"}
	            
	            
	            
	            
            	    ]
    	     ,onComplete: function(){
               // $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
                $("select[name='requested_by']").dataBind( "pages");
                //$("select, input").on("keyup change", function(){
                  //  var $zRow = $(this).closest(".zRow");
                  //  $zRow.find("#is_edited").val("Y");
                //});  
        }  
    });    
}


                                             