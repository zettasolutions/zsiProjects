var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;
zsi.ready(function(){
   displayRecords();
});
$("#btnSave").click(function () {
    $("#grid").jsonSubmit({
        procedure: "suppliers_upd"
        ,onComplete: function (data) {
            $("#grid").clearGrid(); 
            displayRecords();
        }
    });
    
});
    
function displayRecords(){   
    var cb = bs({name:"cbFilter1",type:"checkbox"});
         $("#grid").dataBind({
	     url            : execURL + "suppliers_sel"
	    ,width          : 1243
	    ,height         : $(document).height() - 250
	    //,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
                 {text  : cb                                                        , type  : "hidden"        , width    : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                   return     bs({name:"supplier_id",type:"hidden",value: svn (d,"supplier_id")})
                                                    +  bs({name:"cb",type:"checkbox"});
                            }
            }	 
        		,{text  : "Supplier Name"         , name  : "supplier_name"         , type  : "input"       , width : 245       , style : "text-align:left;"}
        		,{text  : "Contact Name"          , name  : "contact_name"          , type  : "input"       , width : 300       , style : "text-align:left;"}
        		,{text  : "Contact No."           , name  : "contact_no"            , type  : "input"       , width : 250       , style : "text-align:left;"}
        		,{text  : "Active?"               , name  : "is_active"             , type  : "yesno"       , width : 250       , style : "text-align:left;"}
        
	    ]
    });    
}
/*$("#btnDelete").click(function(){
    zsi.form.deleteData({
         code       : "sys-0002"
        ,onComplete : function(data){
                        displayRecords();
                      }
    });      
});*/