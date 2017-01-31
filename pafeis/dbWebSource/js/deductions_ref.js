 var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;
zsi.ready(function(){
   displayRecords();
});
$("#btnSave").click(function () {
    $("#grid").jsonSubmit({
        procedure: "deductions_ref_upd"
        ,onComplete: function (data) {
            $("#grid").clearGrid(); 
            displayRecords();
        }
    });
    
});

$("#btnDelete").click(function(){
    zsi.form.deleteData({
         code       : "ref-0007"
        ,onComplete : function(data){
                        displayRecords();
                      }
    });   

});     
    
function displayRecords(){   
    var cb = bs({name:"cbFilter1",type:"checkbox"});
         $("#grid").dataBind({
	     url            : execURL + "deductions_ref_sel"
	    ,width          : 1100
	    ,height         : $(document).height() - 250
	    //,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
                 {text  : cb                                                        , type  : "hidden"        , width    : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                   return     bs({name:"deduction_ref_id", type:"hidden", value: svn (d,"deduction_ref_id")})
                                                    +  bs({name:"cb", type:"checkbox"});
                            }
            }	 
        		,{text  : "Code"                , name  : "deduction_code"         , type  : "input"       , width : 245       , style : "text-align:left;"}
        		,{text  : "Deduction"           , name  : "deduction_desc"         , type  : "input"       , width : 300       , style : "text-align:left;"}
        		,{text  : "Percentage %"       , name  : "deduction_pct"           , type  : "input"       , width : 250       , style : "text-align:left;"}
        		,{text  : "Default Amount"      , name  : "default_amt"            , type  : "input"       , width : 250       , style : "text-align:left;"}
        
	    ]
    });    
}
