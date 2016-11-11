var  bs = zsi.bs.ctrl
    ,svn =  zsi.setValIfNull
    ,tblIT = "tblItemTypes"
    ,tblIC = "tblItemCodes"
;



zsi.ready(function(){
    getTemplate();
    displayRecords();
});

      var contextItemTypes = { id:"modalWindowItemTypes"
                        , title: "Item Types"
                        , sizeAttr: "modal-lg"
                        , footer: '<div class="pull-left"><button type="button" onclick="submitItemsTypes();" class="btn btn-primary">'
                        + '<span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Save</button>'
                                + '<button type="button" onclick="manageInactiveItemTypes();" class="btn btn-primary"><span class="glyphicon glyphicon-ban-circle">'
                                + '</span>&nbsp;Inactive</button>'

                        , body:            
                        '<div id="' + tblIT + '" class="zGrid"></div>'
                             
        };

      var contextItemCodes = { id:"modalWindowItemCodes"
                        , title: "Item Codes"
                        , sizeAttr: "modal-lg"
                        , footer: '<div class="pull-left"><button type="button" onclick="submitItemsCodes();" class="btn btn-primary">'
                        + '<span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Save</button>'
                                + '<button type="button" onclick="manageInactiveItemCodes();" class="btn btn-primary"><span class="glyphicon glyphicon-ban-circle">'
                                + '</span>&nbsp;Inactive</button>'

                        , body:            
                        '<div id="' + tblIC + '" class="zGrid"></div>'
                             
        };


function getTemplate(callback){
    $.get(base_url + "templates/bsDialogBox.txt",function(d){
        var template = Handlebars.compile(d); 
        
        $("body").append(template(contextItemTypes));
        $("body").append(template(contextItemCodes));
        
        if(callback) callback();
    });    
}  
$("#btnSave").click(function () {
   $("#grid").jsonSubmit({
             procedure: "item_categories_upd"
            , optionalItems: ["is_active"]
            , onComplete: function (data) {
                $("#grid").clearGrid();
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                displayRecords();
            }
    });
});

function submitItemsTypes(){
          $("#frm_modalWindowItemTypes").jsonSubmit({
             procedure      : "item_types_upd"
            ,optionalItems  : ["item_cat_id","monitoring_type_id","is_active"]
            ,onComplete     : function (data) {
               if(data.isSuccess===true) zsi.form.showAlert("alert");
               $("#grid").trigger("refresh");
               displayRecordsItemTypes(item_cat_id);
                
            }
        });
}

function submitItemsCodes(){
          $("#frm_modalWindowItemCodes").jsonSubmit({
             procedure      : "item_codes_upd"
            ,optionalItems  : ["item_type_id","is_active"]
            ,onComplete     : function (data) {
               if(data.isSuccess===true) zsi.form.showAlert("alert");
               displayRecordsItemTypes(item_cat_id);
               displayRecordsItemCodes(item_type_id);
                
            }
        });
}

function manageItemTypes(id,title){
        item_cat_id=id;
        displayRecordsItemTypes(id);
        $("#frm_modalWindowItemTypes .modal-title").text("Item Types for » " + title);
        $('#modalWindowItemTypes').modal({ show: true, keyboard: false, backdrop: 'static' });
        $('#modalWindowItemTypes');//.setCloseModalConfirm();
        $("#modalWindowItemTypes .modal-body").css("height","450px");
}
    
function manageItemCodes(id,title){
        item_type_id=id;
        displayRecordsItemCodes(id);
        $("#frm_modalWindowItemCodes .modal-title").text("Item Codes for » " + title);
        $('#modalWindowItemCodes').modal({ show: true, keyboard: false, backdrop: 'static' });
        $('#modalWindowItemCodes');//.setCloseModalConfirm();
        $("#modalWindowItemCodes .modal-body").css("height","450px");
}


function displayRecords(){
     var cb = bs({name:"cbFilter1",type:"checkbox"});
     $("#grid").dataBind({
	     url            : execURL + "item_categories_sel"
	    ,width          : 550
	    ,height         : $(document).height() - 250
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
                 {text  : cb                                                           , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"item_cat_id",type:"hidden",value: svn (d,"item_cat_id")})
                                                      +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
            }	 
        		,{text  : "Code"                , name  : "item_cat_code"          , type  : "input"         , width : 150       , style : "text-align:left;"}
        		,{text  : "Name"                , name  : "item_cat_name"          , type  : "input"         , width : 200       , style : "text-align:left;"}
        		,{text  : "Active?"             , name  : "is_active"              , type  : "yesno"         , width:55          , style : "text-align:left;"   ,defaultValue:"Y"}
        		,{text  : "Item Types"          , width : 80                       , style : "text-align:center;"      
                    ,onRender  :  
                        function(d){return "<a href='javascript:manageItemTypes(" + svn(d,"item_cat_id") + ",\"" +  svn(d,"item_cat_name")  + "\");'>" + svn(d,"countItemTypes") + "</a>"; 
                    }
                }

	    ] 
    	     ,onComplete: function(){
                $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
        }  
    });    
}

function displayRecordsItemTypes(id){
     var cb = bs({name:"cbFilter2",type:"checkbox"});
     $("#" + tblIT).dataBind({
	     url            : execURL + "item_types_sel @item_cat_id=" + id
	    ,width          : 750
	    ,height         : 400
	    ,selectorType   : "checkbox"
        ,blankRowsLimit : 5
        ,dataRows       : [
            
                 {text  : cb     , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"item_type_id",type:"hidden",value: svn (d,"item_type_id")})
                		                            +  bs({name:"item_cat_id",type:"hidden",value: id})
                                                    +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
            }	 
        		,{text  : "Monitoring Type Id"  , name  : "monitoring_type_id"     , type  : "select"        , width : 160       , style : "text-align:left;"}
        		,{text  : "Item Type Code"      , name  : "item_type_code"         , type  : "input"         , width : 200       , style : "text-align:left;"}
        		,{text  : "Item Type Name"      , name  : "item_type_name"         , type  : "input"         , width : 200       , style : "text-align:left;"}
        		,{text  : "Is Active?"          , width : 75                       , type  : "yesno"         , style : "text-align:center;"  ,defaultValue:"Y"}
        		,{text  : "Item Codes"          , width : 80                       , style : "text-align:center;"      
                    ,onRender  :  
                        function(d){return "<a href='javascript:manageItemCodes(" + svn(d,"item_type_id") + ",\"" +  svn(d,"item_type_name")  + "\");'>" + svn(d,"countItemCodes") + "</a>"; 
                    }
                }

	    ] 
    	     ,onComplete: function(){
                $("#cbFilter2").setCheckEvent("#" + tblIT + " input[name='cb']");
                $("select[name='monitoring_type_id']").dataBind( "monitoring_type");
        }  
    });    
}    

function displayRecordsItemCodes(id){
     var cb = bs({name:"cbFilter3",type:"checkbox"});
     $("#" + tblIC).dataBind({
	     url            : execURL + "item_codes_sel @item_type_id=" + id
	    ,width          : 750
	    ,height         : 400
	    ,selectorType   : "checkbox"
        ,blankRowsLimit : 5
        ,dataRows       : [
            
                 {text  : cb     , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"item_code_id",type:"hidden",value: svn (d,"item_code_id")})
                		                            +  bs({name:"item_type_id",type:"hidden",value: id})
                                                    +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
            }	 
        		,{text  : "Part No."            , name  : "part_no"               , type  : "input"         , width : 65       , style : "text-align:left;"}
        		,{text  : "National Stock No."  , name  : "national_stock_no"     , type  : "input"         , width : 150       , style : "text-align:left;"}
        		,{text  : "Item Name"           , name  : "item_name"             , type  : "input"         , width : 400      , style : "text-align:left;"}
        		,{text  : "Is Active?"          , width : 100                      , type  : "yesno"         , style : "text-align:center;"  ,defaultValue:"Y"}
	    ] 
    	     ,onComplete: function(){
                $("#cbFilter3").setCheckEvent("#" + tblIC + " input[name='cb']");
        }  
    });    
}    


$("#btnDelete").click(function(){
    zsi.form.deleteData({
         code       : "ref-0005"
        ,onComplete : function(data){
                        displayRecords();
                      }
    });       
});
    
                                              