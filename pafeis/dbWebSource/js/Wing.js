var bs = zsi.bs.ctrl;
var svn = zsi.setValIfNull;
var tblSquadron     = "tableSquadron";
var tblWarehouse    = "tableWarehouse";

zsi.ready(function(){
    displayRecords();
    getTemplate();
});


$("#btnSave").click(function () {
   $("#grid").jsonSubmit({
             procedure: "wings_upd"
            , onComplete: function (data) {
                $("#grid").clearGrid();
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                displayRecords();
            }
    });
});

function getTemplate(){
        $.get(base_url + "templates/bsDialogBox.txt",function(d){
        var template = Handlebars.compile(d);     
        
        var contextSquadron = { id:"modalWindowSquadron"
                        , title: "Squadron"
                        , sizeAttr: "fullWidth"
                        , footer: '<div class="pull-left"><button type="button" onclick="submitItemsSquadron();" class="btn btn-primary">'
                        + '<span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Save</button>'
                                + '<button type="button" onclick="manageSquadronInactive();" class="btn btn-primary"><span class="glyphicon glyphicon-ban-circle">'
                                + '</span>&nbsp;Inactive</button>'
                                //+ '<button type="button" onclick="NewSpecsProperty();" class="btn btn-primary btn-sm" id="btnNew"><span class="glyphicon glyphicon-plus"></span> New</button>'  

                        , body:            
                        '<div id="' + tblSquadron + '" class="zGrid"></div>'
                             
        };
        html= template(contextSquadron);     
        $("body").append(html);
        
        var contextWarehouse = { id:"modalWindowWarehouse"
                        , title: "Warehouse"
                        , sizeAttr: "fullWidth"
                        , footer: '<div class="pull-left"><button type="button" onclick="submitItemsWarehouse();" class="btn btn-primary">'
                        + '<span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Save</button>'
                                + '<button type="button" onclick="manageWarehouseInactive();" class="btn btn-primary"><span class="glyphicon glyphicon-ban-circle">'
                                + '</span>&nbsp;Inactive</button>'
                                //+ '<button type="button" onclick="NewSpecsProperty();" class="btn btn-primary btn-sm" id="btnNew"><span class="glyphicon glyphicon-plus"></span> New</button>'  

                        , body:            
                        '<div id="' + tblWarehouse + '" class="zGrid"></div>'
                             
        };
        var htmlWarehouse= template(contextWarehouse);     
        $("body").append(htmlWarehouse);
        
    });    
} 
function manageItemSquadron(id,name){
         wing_id=id;
         wing_name=name;
         displayRecordsSquadron(id);
         $("#modalWindowSquadronLabel .modal-title").text("Squadron for » " + name);
         $('#modalWindowSquadron').modal({ show: true, keyboard: false, backdrop: 'static' });
         $('#modalWindowSquadron');//.setCloseModalConfirm();
        // $("#modalWindowSquadron .modal-body").css("height","450px");
}

function manageItemWarehouse(id,title){
         wing_id=id;
         displayRecordsWarehouse(id);
         $("#modalWindowWarehouseLabel .modal-title").text("Warehouse for » " + title);
         $('#modalWindowWarehouse').modal({ show: true, keyboard: false, backdrop: 'static' });
         $('#modalWindowWarehouse');//.setCloseModalConfirm();
         //$("#modalWindowWarehouse .modal-body").css("height","450px");
} 
function submitItemsSquadron(){
          $("#frm_modalWindowSquadron").jsonSubmit({
             procedure      : "squadrons_upd"
            ,optionalItems : ["wing_id","is_active"]
            ,onComplete     : function (data) {
               if(data.isSuccess===true) zsi.form.showAlert("alert");
               $("#grid").trigger("refresh");
                displayRecordsSquadron(wing_id);
                
            }
        });
}
function submitItemsWarehouse(){
          $("#frm_modalWindowWarehouse").jsonSubmit({
             procedure      : "warehouses_upd"
            ,optionalItems : ["is_active"]
            ,onComplete     : function (data) {
               if(data.isSuccess===true) zsi.form.showAlert("alert");
               $("#grid").trigger("refresh");
                displayRecordsWarehouse();
                
            }
        });
}

function displayRecords(){
     var cb = bs({name:"cbFilter1",type:"checkbox"});
     $("#grid").dataBind({
	     url            : execURL + "wings_sel"
	    ,width          : $(document).width() - 35
	    ,height         : 200
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
                 {text  : cb                                                           , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"wing_id",type:"hidden",value: svn (d,"wing_id")})
                                                      +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
            }	 
        		,{text  : "Code"                , name  : "wing_code"              , type  : "input"         , width : 100      , style : "text-align:left;"}
        		,{text  : "Name"                , name  : "wing_name"              , type  : "input"         , width : 200      , style : "text-align:left;"}
        		,{text  : "Address"             , name  : "wing_full_address"      , type  : "input"         , width : 200      , style : "text-align:left;"}
        		,{text  : "Commander"           , name  : "wing_commander_id"      , type  : "select"        , width : 267      , style : "text-align:left;"}
        		,{text  : "Active?"             , name  : "is_active"              , type  : "yesno"         , width : 55       , style : "text-align:left;"   
        		    ,defaultValue : "Y" }
        		,{text  : "Squadron"            , width: 80                         , style : "text-align:center;"      
        		    ,onRender  : 
                        function(d){return "<a href='javascript:manageItemSquadron(" + svn(d,"wing_id") + ",\"" +  svn(d,"wing_name")  + "\");'>" 
                        + svn(d,"countSquadrons") + "</a>"; 
                    }
                }
        		
	    ] 
    	     ,onComplete: function(){
                $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
               // $("select[name='wing_commander_id']").dataBind( "employee");
                $("select[name='wing_commander_id']").dataBind({
                 url   : execURL + "squadron_commander_sel"
                ,text : "userFullName"
                ,value : "user_id"   
               });
        }  
    });    
}

function displayRecordsSquadron(id){
    //alert(id);
     var cb = bs({name:"cbFilterSquadron",type:"checkbox"});
     $("#" + tblSquadron).dataBind({
	     url            : execURL + "squadrons_sel " + id
	    ,width          : $(document).width() - 35
	    ,height         : 300
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
                 {text  : cb                                                           , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return      bs({name:"squadron_id",type:"hidden",value: svn (d,"squadron_id")})
                		                              + bs({name:"wing_id",type:"hidden",value: id }) 
                                                      +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
            }	 
        		,{text  : "Squadron Type"       , name  : "squadron_type_id"            , type  : "select"        , width : 150       , style : "text-align:left;"}
        		,{text  : "Squadron Code"       , name  : "squadron_code"               , type  : "input"         , width : 120       , style : "text-align:left;"}
        		,{text  : "Squadron Name"       , name  : "squadron_name"               , type  : "input"         , width : 150       , style : "text-align:left;"}
        		,{text  : "Commander"           , name  : "squadron_commander_id"       , type  : "select"        , width : 230       , style : "text-align:left;"}
        		,{text  : "Address"             , name  : "squadron_full_address"       , type  : "input"         , width : 180       , style : "text-align:left;"}
        		,{text  : "Active?"             , name  : "is_active"                   , type  : "yesno"         , width : 55        , style : "text-align:left;"   ,defaultValue:"Y"                 }
        		
       	
	    ]
    	     ,onComplete: function(){
    	        // console.log("xxx");
                $("#cbFilterSquadron").setCheckEvent("#" + tblSquadron + " input[name='cb']");
               // $("select[name='wing_id']").dataBind( "wing");
               
               $("select[name='squadron_commander_id']").dataBind({
                 url   : execURL + "squadron_commander_sel"
                ,text : "userFullName"
                ,value : "user_id"   
               });
               
              $("select[name='squadron_type_id']").dataBind( "squadronTypes");
        }  
    });    
}
function displayRecordsWarehouse(id){
    //alert(id);
     var cb = bs({name:"cbFilterWarehouse",type:"checkbox"});
     $("#" + tblWarehouse).dataBind({
	     url            : execURL + "warehouses_sel " + id
	    ,width          : $(document).width() - 35
	    ,height         : 450
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
                 { text  : cb                                                           , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"warehouse_id",type:"hidden",value: svn (d,"warehouse_id")})
                		                               + bs({name:"wing_id",type:"hidden",value: id }) 
                                                       + (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
            }
        		,{text  : "Warehouse Code"       , name  : "warehouse_code"               , type  : "input"         , width : 150       , style : "text-align:left;"}
        		,{text  : "Warehouse Name"       , name  : "warehouse_name"               , type  : "input"         , width : 200       , style : "text-align:left;"}
        		,{text  : "Address"              , name  : "warehouse_full_address"       , type  : "input"         , width : 200       , style : "text-align:left;"}
        		,{text  : "Active?"              , name  : "is_active"                    , type  : "yesno"         , width : 55          , style : "text-align:left;"   ,defaultValue:"Y" }
	    ]
    	     ,onComplete: function(){
    	         //console.log("xxx");
                $("#cbFilterWarehouse").setCheckEvent("#" + tblWarehouse + " input[name='cb']");
                //$("select[name='wing_id']").dataBind( "wing");
              
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
    
                                                    