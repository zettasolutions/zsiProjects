 var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;
var store_id = null;
var tblName     = "tblsupply_brands";

zsi.ready(function(){
displayStore();
getTemplate();

});

function getTemplate(){
    $.get(base_url + "templates/bsDialogBox.txt",function(d){
        var template = Handlebars.compile(d);     

        var context = { id:"modalWindow"
                        , title: "Supplies"
                         ,sizeAttr: "modal-lg"
                        , footer:  ' <div class="pull-left"><button type="button" onclick="submitItems();" class="btn btn-primary"><span class="glyphicon glyphicon-floppy-disk"></span> Save</button></div>'
                        , body: '<div><div id="' + tblName + '" class="zGrid" ></div></div>'
                      };
        var html    = template(context);     
        $("body").append(html);
    });    
}

function submitItems(){    
  $("#frm_modalWindow").jsonSubmit({
            procedure  : "supply_brands_upd"
            ,optionalItems: ["brand_id","conv_id","store_id"]
           // ,notInclude: "#country_name"
            ,onComplete : function (data) {
                 if(data.isSuccess===true) zsi.form.showAlert("alert");
                  $("#" + tblName).trigger('refresh');
                //displaySupplyBrands();
            }
    });        
}





function displayStore(){
     var $store =  $("select[name='store_id']")
         $store.dataBind("stores");
         $store.change(function(){
        store_id = this.value;
    });
    
    
}

$("#btnGo").click(function(){
  
   displayRecords();
});

$("#btnSave").click(function () {
    $("#grid").jsonSubmit({
              procedure  : "supplies_upd"
               ,optionalItems : ["unit_id","supply_type_id","store_id"]
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
	     url            : procURL + "supplies_sel @store_id=" + store_id
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
        		              return '<a href="javascript:manageItems('+  svn(d,"supply_id") +');">Manage</a>'
        		              + bs({name:"store_id"   ,value: store_id    ,type:"hidden"});
                    }
                }
                                            
   ]
   
        ,onComplete: function(){
         $("select[name='unit_id']").dataBind("units");
         $("select[name='supply_type_id']").dataBind("supply_types");
            
        }
    });    
}

function displaySupplyBrands(){   
     var cb = bs({name:"cbFilter1",type:"checkbox"});
        $("#" + tblName).dataBind({
	     url            : procURL + "supply_brands_sel @store_id=" + store_id
	    ,width          : 860
	    ,height         : 400
	    ,selectorType   : ""
       ,blankRowsLimit:5
        //,isPaging : false
        ,dataRows : [
    		
    	   
        		{text  : cb                                   , width  : 50       , style    : "text-align:left;"  
                		   , onRender      :  function(d){ 
                		              return bs({name:"supply_brand_id"   ,value: svn (d,"supply_brand_id")    ,type:"hidden"})
                		                  +  bs({name:"supply_id"        ,value: svn (d,"supply_id")    ,type:"hidden"})
                                           +  bs({name:"store_id"   ,value: store_id    ,type:"hidden"});
                            }
        		}
        		
        		,{text  : "Brand"         , name  : "brand_id"              , type  : "select"       , width : 200       , style : "text-align:center;"}	 
        		,{text  : "Unit"          , name  : "conv_id"               , type  : "select"       , width : 200       , style : "text-align:center;"}	 
	            ,{text  : "Unit Cost"     , name  : "supply_cost"           , type  : "input"        , width : 404       , style : "text-align:center;"}
	             
	    ]
	    
	            ,onComplete: function(){
         $("select[name='brand_id']").dataBind("supplyBrand");
           $("select[name='conv_id']").dataBind("supplyUnits");
            
        }
    });    
}



function manageItems(){
       
                   //parent//           //child//
        // $("#frm_modalWindow .modal-title").text("Sub Properties for  » " + title);
         $('#modalWindow').modal({ show: true, keyboard: false, backdrop: 'static' });
         //$('#modalWindow');//.setCloseModalConfirm();
        // $('#modalWindowSpecProperty').setCloseModalConfirm();
        displaySupplyBrands();
    
}

                 