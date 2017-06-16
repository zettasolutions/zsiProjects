var bs  = zsi.bs.ctrl;
var svn = zsi.setValIfNull;
var g_organization_id = null;

zsi.ready(function(){
    $.get(procURL + "user_info_sel", function(d) {
        g_organization_id = null;
        if (d.rows !== null && d.rows.length > 0) {
            g_user_id = d.rows[0].user_id;
            g_organization_id = d.rows[0].organization_id;
        }
        displayRecords();
    });
});


$("#btnSave").click(function () {
   $("#grid").jsonSubmit({
             procedure: "flight_operation_pilots_upd"
            //,optionalItems: ["is_active"] 
            , onComplete: function (data) {
                $("#grid").clearGrid();
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                displayRecords();
            }
    });
});
    
$("#btnDel").click(function () {
    zsi.form.deleteData({
         code       : "ref-0043"
        ,onComplete : function(data){
                $("#grid").trigger('refresh');
        }
    }); 
});
    
    
function displayRecords(){
     var cb = bs({name:"cbFilter1",type:"checkbox"});
     $("#grid").dataBind({
	     url            : procURL + "flight_operation_pilots_sel"
	    ,width          : $(document).width() - 35
	    ,height         : $(document).height() - 250
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
                 {text  : cb                                                           , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return       bs({name:"flight_operation_pilot_id",type:"hidden",value: svn (d,"flight_operation_pilot_id")})
                		                              +  bs({name:"is_edited",type:"hidden"}) 
                		                              +  bs({name:"flight_operation_id",type:"hidden",value: svn (d,"flight_operation_id")})
                                                      +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
            }	 
                
        		,{text  : "Pilot"          , width : 250        , style : "text-align:left;"
        		    ,onRender : function(d){ return  bs({name:"pilot_id",type:"select"  ,value: svn (d,"pilot_id")}) }
        		}
        		,{text  : "Duty"           , name  : "duty"           , type  : "input"           , width : 250        , style : "text-align:left;"}
	    ]
    	     ,onComplete: function(){
                $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
    	        $("select, input").on("keyup change", function(){
                    var $zRow = $(this).closest(".zRow");
                    $zRow.find("#is_edited").val("Y");
                });            
                $("select[name='pilot_id']").dataBind({
                     url: procURL + "dd_pilots_sel @squadron_id=" + g_organization_id
                    , text: "userFullName"
                    , value: "user_id"
                });
            }  
    });    
}
    

                                        