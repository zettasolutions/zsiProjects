var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;
zsi.ready(function(){
    displayRecords();
  
});

$("#btnSave").click(function () {
  //  console.log("test");
   $("#grid").jsonSubmit({
             procedure: "manufacturers_upd"
            ,optionalItems: ["is_local","is_active"]
            ,onComplete: function (data) {
                $("#grid").clearGrid();
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                displayRecords();
            }
    });
});



 function displayRecords(){   
      var cb = bs({name:"cbFilter1",type:"checkbox"});
     $("#grid").dataBind({
	     url            : execURL + "manufacturers_sel"
	    ,width          : $(document).width()-35
	    ,height         : 450
        ,selectorType   : "checkbox"
        ,blankRowsLimit:5
       // ,isPaging : false
        ,dataRows : [
    	
    		   {text  : cb                      , width : 25        , style : "text-align:left;"       
            		    , onRender      :  function(d){ 
                		              return bs({name:"manufacturers_id"   ,value: svn (d,"manufacturers_id")    ,type:"hidden"})
                		                 +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                    }
                }	 
            	,{ text:"Manufacturer Name"     , width:180          , style:"text-align:center;"        , type:"input"          ,name:"manufacturer_name"}
            	,{ text:"Full Address"          , width:230          , style:"text-align:center;"        , type:"input"          ,name:"full_address"}
            	,{ text:"Contact No."           , width:100          , style:"text-align:center;"        , type:"input"          ,name:"contact_no"}
            	,{ text:"Email Address"         , width:150          , style:"text-align:center;"        , type:"input"          ,name:"email_address"}
            	,{ text:"Contact Person"        , width:120          , style:"text-align:center;"        , type:"input"          ,name:"contact_person"}
            	,{ text:"Local?"                , width:60           , style:"text-align:center;"        , type:"yesno"          ,name:"is_local"   ,defaultValue:"Y"}
            	,{ text:"Active"                , width:60           , style:"text-align:center;"        , type:"yesno"          ,name:"is_active"  ,defaultValue:"Y"}
	    ]
	      ,onComplete: function(){
                    $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
            }
    });    
}
$("#btnDelete").click(function(){
    zsi.form.deleteData({
         code       : "ref-0008"
        ,onComplete : function(data){
                        displayRecords();
                      }
    });      
});       