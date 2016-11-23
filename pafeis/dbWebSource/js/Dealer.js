  var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;



zsi.ready(function(){
    displayRecords();
});


$("#btnSave").click(function () {
  //  console.log("test");
   $("#grid").jsonSubmit({
            procedure: "dealers_upd"
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
	     url            : execURL + "dealers_sel"
	    ,width          : $(document).width() - 35
	    ,height         : $(document).height() - 250
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
                 {text  : cb                                                           , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"dealer_id",type:"hidden",value: svn (d,"dealer_id")})
                                                      +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
            }	 
        		,{text  : "Name"                , name  : "dealer_name"                 , type  : "input"         , width : 200       , style : "text-align:left;"}
        		,{text  : "Address"             , name  : "full_address"                , type  : "input"         , width : 200       , style : "text-align:left;"}
        		,{text  : "Contact No."         , name  : "contact_no"                  , type  : "input"         , width : 200       , style : "text-align:left;"}
        		,{text  : "Email"               , name  : "email_address"               , type  : "input"         , width : 200       , style : "text-align:left;"}        		
        		,{text  : "Contact Person"      , name  : "contact_person"              , type  : "input"         , width : 200       , style : "text-align:left;"}        		
        		,{text  :"Local?"               , name  : "is_local"                    , type  : "yesno"         , width:55          , style : "text-align:left;"   ,defaultValue:"Y"                 }
        		,{text  :"Active?"              , name  : "is_active"                   , type  : "yesno"         , width:55          , style : "text-align:left;"   ,defaultValue:"Y"                 }
	    ] 
    	     ,onComplete: function(){
                $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
        }  
    });    
}
    

$("#btnDelete").click(function(){
    zsi.form.deleteData({
         code       : "ref-0004"
        ,onComplete : function(data){
                        displayRecords();
                      }
    });       
});
    
                                         