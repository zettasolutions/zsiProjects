var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;



zsi.ready(function(){
    displayRecords();
});


$("#btnSave").click(function () {
  //  console.log("test");
   $("#grid").jsonSubmit({
             procedure: "supply_sources_upd"
            , optionalItems: ["is_active"]
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
	     url            : execURL + "supply_sources_sel"
	    ,width          : $(document).width() - 35
	    ,height         : $(document).height() - 250
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
                 {text  : cb                                                           , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"supply_source_id",type:"hidden",value: svn (d,"supply_source_id")})
                                                      +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
            }	 
        		,{text  : "Supplier Name"       , name  : "supply_source_name"          , type  : "input"         , width : 250       , style : "text-align:left;"}
        		,{text  : "Address"             , name  : "full_address"                , type  : "input"         , width : 240       , style : "text-align:left;"}
        		,{text  : "Contact No."         , name  : "contact_no"                  , type  : "input"         , width : 180       , style : "text-align:left;"}
        		,{text  : "Email Address"       , name  : "email_address"               , type  : "input"         , width : 200       , style : "text-align:left;"}        		
        		,{text  : "Contact Person"      , name  : "contact_person"              , type  : "input"         , width : 200       , style : "text-align:left;"}        		
        		,{text  :"Local?"               , name  : "is_local"                    , type  : "yesno"         , width:65          , style : "text-align:left;"   ,defaultValue:"Y"                 }
        		,{text  :"Active?"              , name  : "is_active"                   , type  : "yesno"         , width:65          , style : "text-align:left;"   ,defaultValue:"Y"                 }
	    ] 
    	     ,onComplete: function(){
                $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
        }  
    });    
}
    

$("#btnDelete").click(function(){
    zsi.form.deleteData({
         code       : "ref-0018"
        ,onComplete : function(data){
                        displayRecords();
                      }
    });       
});
    
                                           