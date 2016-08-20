 var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;


zsi.ready(function(){
     $("select[name='store_id']").dataBind("stores");
    
   /* $(".zPanel").css({
            height:$(window).height()-179
        });*/
     
    displayRecords();
  
});

$("#btnGo").click(function(){
    console.log( $("#store_id").val())
    $("#store_id").val();
 
});

$("#btnSave").click(function () {
    $("#grid").jsonSubmit({
              procedure  : "supplies_upd"
               ,optionalItems : ["unit_id","supply_type_id"]
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
	     url            : procURL + "supplies_sel" 
	    ,width          : 1200
	    ,height         : 506
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
       // ,isPaging : false
        ,dataRows : [
        		 {text  : cb                                 , width : 25        , style : "text-align:left;"       
            		    , onRender      :  function(d){ 
                		              return bs({name:"supply_id"   ,value: svn (d,"supply_id")    ,type:"hidden"})
                		                 +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                    }
                }	 
            	,{ text:"Seq#"                           , width:107        , style:"text-align:center;"        , type:"input"          ,name:"seq_no"}
                ,{ text:"Code"                           , width:107        , style:"text-align:center;"        , type:"input"          ,name:"supply_code" }
                ,{ text:"Description"                    , width:240        , style:"text-align:center;"        , type:"input"          ,name:"supply_desc" }
                ,{ text:"Unit"                           , width:107        , style:"text-align:center;"        , type:"select"         ,name:"unit_id" }
                ,{ text:"Unit Price"                     , width:107        , style:"text-align:center;"        , type:"input"          ,name:"supply_srp" }
                ,{ text:"Unit Cost"                      , width:107        , style:"text-align:center;"        , type:"input"          ,name:"supply_cost" }
                ,{ text:"Weight Per Serving (g)"         , width:180        , style:"text-align:center;"        , type:"input"          ,name:"weight_serve" }
                ,{ text:"Type"                           , width:107        , style:"text-align:center;"        , type:"select"         ,name:"supply_type_id" }
                ,{ text:"Item Brands"                    , width:107        , style:"text-align:center;"       
                         , onRender      :  function(d){ 
        		              return '<a href="javascript:manageItems('+  svn(d,"supply_id") +');">Manage</a>'; 
                    }
                }
                                            
   ]
   
        ,onComplete: function(){
         $("select[name='unit_id']").dataBind("units");
         $("select[name='supply_type_id']").dataBind("supply_types");
            
        }
    });    
}

             