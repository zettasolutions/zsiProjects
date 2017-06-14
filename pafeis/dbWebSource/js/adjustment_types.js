var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull
    ,debitCredit = [
        {text:"Debit",value:"D"}
        ,{text:"Credit",value:"C"}
       ]
    ;



zsi.ready(function(){
    displayRecords();
 
});

function deleteData(){
    zsi.form.deleteData({
         code       : "ref-0017"
        ,onComplete : function(data){
                $("#grid").trigger('refresh');
                displayInactive();
        }
    }); 
} 
/*
function submitData(){    
  $("#frm_modalWindow").jsonSubmit({
            procedure  : "adjustment_types_upd"
            ,onComplete : function (data) {
                 if(data.isSuccess===true) zsi.form.showAlert("alert");
                 $("#grid").trigger('refresh');

            }
    });        
}
*/

$("#btnSave").click(function () {
   $("#grid").jsonSubmit({
            procedure: "adjustment_types_upd"
            //, optionalItems: ["is_active"]
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
	     url            : execURL + "adjustment_types_sel"
	    ,width          : $(document).width() - 35
	    ,height         : $(document).height() - 250
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
                 {text  : cb                                                           , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"adjustment_type_id",type:"hidden",value: svn (d,"adjustment_type_id")})
                                                      +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
            }	 
        		,{text  : "Adjustment Type"             , name  : "adjustment_type"                 , type  : "input"           , width : 250       , style : "text-align:left;"}
        		,{text  : "Debit Credit"                , name  : "debit_credit"                    , type  : "select"		    , width : 250       , style : "text-align:left;"}
        	
	    ] 
    	     ,onComplete: function(){
                $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
                $("select[name='debit_credit']").fillSelect({data: debitCredit});
        }  
    });    
}
     