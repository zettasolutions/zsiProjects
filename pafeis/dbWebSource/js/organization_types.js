var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;



zsi.ready(function(){
    displayRecords();
});


$("#btnSave").click(function () {
    //console.log("test");
   $("#grid").jsonSubmit({
             procedure: "organization_types_upd"
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
	     url            : execURL + "organization_types_sel"
	    ,width          : $(document).width() - 35
	    ,height         : $(document).height() - 250
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
                 {text  : cb                                                           , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"organization_type_id",type:"hidden",value: svn (d,"organization_type_id")})
                                                      +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
            }	 
                
        		,{text  : "Level No."                   , name  : "level_no"                    , type  : "input"           , width : 100       , style : "text-align:left;"}
        		,{text  : "Organization Type Code"      , name  : "organization_type_code"      , type  : "input"           , width : 200       , style : "text-align:left;"}
        		,{text  : "Organization Type Name"      , name  : "organization_type_name"      , type  : "input"           , width : 200       , style : "text-align:left;"}
        		,{text  : "Active"                       , name  : "is_active"                   , type:"yesno"              , width:60          , style:"text-align:center;",defaultValue:"Y"}
	    ]
    	     ,onComplete: function(){
                $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
                
        }  
    });    
}
    

$("#btnDelete").click(function(){
    zsi.form.deleteData({
         code       : "sys-0008"
        ,onComplete : function(data){
                        displayRecords();
                      }
    });       
});
    
                                      