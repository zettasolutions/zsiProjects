var  bs = zsi.bs.ctrl
    ,svn =  zsi.setValIfNull
    ,tblIT = "tblItemTypes"
    ,tblIC = "tblItemCodes"
    ,tblInactiveICat = "tblInactiveItemCategory"
    ,tblInactiveIT = "tblInactiveItemTypes"
    ,tblInactiveIC = "tblInactiveItemCodes"
    ,item_cat_id = null
    ,ITid = null
    ,catName = ""
    ,item_type_id = null
    ,item_title = ""
;



zsi.ready(function(){
    getTemplate();
    displayRecords();
});

      var contextItemTypes = { id:"modalWindowItemTypes"
                        , title: "Types"
                        , sizeAttr: "fullWidth"
                        , footer: '<div class="pull-left" id="btnItemTypes">'
                                    +'<button type="button" onclick="submitItemsTypes();" class="btn btn-primary"><span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Save</button>'
                                    +'<button type="button" onclick="showInactiveItemTypes();" class="btn btn-primary"><span class="glyphicon glyphicon-ban-circle"></span>&nbsp;Inactive</button>'
                                  +'</div>'
                                  +'<div class="pull-left hide" id="btnItemCodes">'
                                    +'<button type="button" onclick="submitItemsCodes();" class="btn btn-primary"><span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Save</button>'
                                    +'<button type="button" onclick="showInactiveItemCodes();" class="btn btn-primary"><span class="glyphicon glyphicon-ban-circle"></span>&nbsp;Inactive</button>'
                                  +'</div>'
                        , body:            
                        '<div id="' + tblIT + '" class="zGrid"></div>'
                             
        };

      var contextItemCodes = { id:"modalWindowItemCodes"
                        , title: "Item Codes"
                        , sizeAttr: "fullWidth"
                        , footer: '<div class="pull-left"><button type="button" onclick="submitItemsCodes();" class="btn btn-primary">'
                        + '<span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Save</button>'
                                + '<button type="button" onclick="showInactiveItemCodes();" class="btn btn-primary"><span class="glyphicon glyphicon-ban-circle">'
                                + '</span>&nbsp;Inactive</button>'

                        , body:            
                        '<div id="' + tblIC + '" class="zGrid"></div>'
                             
        };


      var contextInactiveItemCategory = { id:"modalWindowInactiveItemCategory"
                        , title: "Inactive Item Categories"
                        , sizeAttr: "modal-md"
                        , footer: '<div class="pull-left"><button type="button" onclick="submitInactiveItemCategory();" class="btn btn-primary">'
                        + '<span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Save</button>'
                                + '<button type="button" onclick="deleteItemCategory();" class="btn btn-primary"><span class="glyphicon glyphicon-trash">'
                                + '</span>&nbsp;Delete</button>'

                        , body:            
                        '<div id="' + tblInactiveICat + '" class="zGrid"></div>'
                             
        };
        
      var contextInactiveItemTypes = { id:"modalWindowInactiveItemTypes"
                        , title: "Inactive Item Types"
                        , sizeAttr: "modal-lg"
                        , footer: '<div class="pull-left"><button type="button" onclick="submitInactiveItemTypes();" class="btn btn-primary">'
                        + '<span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Save</button>'
                                + '<button type="button" onclick="deleteItemTypes();" class="btn btn-primary"><span class="glyphicon glyphicon-trash">'
                                + '</span>&nbsp;Delete</button>'

                        , body:            
                        '<div id="' + tblInactiveIT + '" class="zGrid"></div>'
                             
        };        

      var contextInactiveItemCodes = { id:"modalWindowInactiveItemCodes"
                        , title: "Inactive Item Types"
                        , sizeAttr: "fullWidth"
                        , footer: '<div class="pull-left"><button type="button" onclick="submitInactiveItemCodes();" class="btn btn-primary">'
                        + '<span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Save</button>'
                                + '<button type="button" onclick="deleteItemCodes();" class="btn btn-primary"><span class="glyphicon glyphicon-trash">'
                                + '</span>&nbsp;Delete</button>'

                        , body:            
                        '<div id="' + tblInactiveIC + '" class="zGrid"></div>'
                             
        };   

function getTemplate(callback){
    $.get(base_url + "templates/bsDialogBox.txt",function(d){
        var template = Handlebars.compile(d); 
        
        $("body").append(template(contextItemTypes));
        $("body").append(template(contextItemCodes));
        $("body").append(template(contextInactiveItemCategory));
        $("body").append(template(contextInactiveItemTypes));
        $("body").append(template(contextInactiveItemCodes));
        
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
               displayRecordsItemTypes(item_cat_id, ITid, catName);
                
            }
        });
}
function submitInactiveItemTypes(){
          $("#modalWindowInactiveItemTypes").jsonSubmit({
             procedure      : "item_types_upd"
            ,optionalItems  : ["item_cat_id","monitoring_type_id","is_active"]
            ,onComplete     : function (data) {
               if(data.isSuccess===true) zsi.form.showAlert("alert");
               displayInactiveItemTypes();
               displayRecordsItemTypes(item_cat_id);
                
            }
        });
}

function submitItemsCodes(){
         // $("#frm_modalWindowItemCodes").jsonSubmit({
         $("#frm_modalWindowItemTypes").jsonSubmit({
             procedure      : "item_codes_upd"
            ,optionalItems  : ["item_type_id","is_active"]
            ,onComplete     : function (data) {
               if(data.isSuccess===true) zsi.form.showAlert("alert");
               displayRecordsItemTypes(item_cat_id);
               displayRecordsItemCodes(item_type_id);
                
            }
        });
}
function submitInactiveItemCodes(){
          $("#frm_modalWindowInactiveItemCodes").jsonSubmit({
             procedure      : "item_codes_upd"
            ,optionalItems  : ["item_type_id","is_active"]
            ,notIncluded  : ["#item_code"]
            ,onComplete     : function (data) {
               if(data.isSuccess===true) zsi.form.showAlert("alert");
                 displayRecordsItemCodes(item_type_id);
                 displayInactiveItemCodes();
            }
        });
}

function manageItemTypes(id,title, ITid){
        item_cat_id=id;
        ITid = ITid;
        catName="";
        $.get(execURL + "item_categories_sel @item_cat_id="+ ITid
            ,function(data){
 
             if (data.rows!==null)  {
                
                catName = data.rows[0].item_cat_name;
                 
             }
            
            displayRecordsItemTypes(id,ITid,catName);
            $("#btnItemTypes").removeClass("hide");
            $("#btnItemCodes").addClass("hide");
            $("#modalWindowItemTypes .modal-title").text("Types for » " + title);
            $('#modalWindowItemTypes').modal({ show: true, keyboard: false, backdrop: 'static' });
            $('#modalWindowItemTypes');//.setCloseModalConfirm();
            $("#modalWindowItemTypes .modal-body").css("height","450px");
    });
        
}
    
function manageItemCodes(id,title){
        item_type_id=id;
        item_title = title;
        var backBtn = "<a href='javascript:void(0);' class='btn-lg' onclick='manageItemTypes("+ item_cat_id +",\""+ catName +"\","+ ITid +");'><span class='glyphicon glyphicon-circle-arrow-left'></span></a>";
        
        displayRecordsItemCodes(id);
        $("#btnItemTypes").addClass("hide");
        $("#btnItemCodes").removeClass("hide");
        $("#modalWindowItemTypes .modal-title").html(backBtn + " Types for » " + title);
        $('#modalWindowItemTypes').modal({ show: true, keyboard: false, backdrop: 'static' });
        $('#modalWindowItemTypes');//.setCloseModalConfirm();
        $("#modalWindowItemTypes .modal-body").css("height","450px");
        /*$("#frm_modalWindowItemCodes .modal-title").text("Item Codes for » " + title);
        $('#modalWindowItemCodes').modal({ show: true, keyboard: false, backdrop: 'static' });
        $('#modalWindowItemCodes');//.setCloseModalConfirm();
        $("#modalWindowItemCodes .modal-body").css("height","450px");*/
}

$("#btnInactive").click(function(){
     $(".modal-title").text("Inactive Item Category");
     $('#modalWindowInactiveItemCategory').modal({ show: true, keyboard: false, backdrop: 'static' });
     $("#modalWindowInactiveItemCategory .modal-body").css("width","100%");
     displayInactiveItemCategory();
});

function showInactiveItemTypes(){
         displayInactiveItemTypes();
         $("#modalWindowInactiveItemTypes .modal-title").text("Inactive Item Types");
         $('#modalWindowInactiveItemTypes').modal({ show: true, keyboard: false, backdrop: 'static' });

}

function showInactiveItemCodes(){
         displayInactiveItemCodes();
         $("#modalWindowInactiveItemCodes .modal-title").text("Inactive Item Codes");
         $('#modalWindowInactiveItemCodes').modal({ show: true, keyboard: false, backdrop: 'static' });

}

function submitInactiveItemCategory(){
          $("#frm_modalWindowInactiveItemCategory").jsonSubmit({
             procedure      : "item_categories_upd"
            ,optionalItems  : ["is_active"]
            ,onComplete     : function (data) {
               if(data.isSuccess===true) zsi.form.showAlert("alert");
               $("#grid").trigger("refresh");
               displayInactiveItemCategory();
                
            }
        });
}
function deleteItemCategory(){
    zsi.form.deleteData({
         code       : "ref-0005"
        ,onComplete : function(data){
                        displayInactiveItemCategory();
                      }
    }); 
}

function deleteItemTypes(){
    zsi.form.deleteData({
         code       : "ref-0008"
        ,onComplete : function(data){
                        displayInactiveItemTypes();
                      }
    }); 
}

function deleteItemCodes(){
    zsi.form.deleteData({
         code       : "ref-0010"
        ,onComplete : function(data){
                        displayInactiveItemCodes();
                      }
    }); 
}

function displayRecords(){
     $("#grid").dataBind({
	     url            : execURL + "item_categories_sel"
	    ,width          : $(document).width() - 440
	    ,height         : $(document).height() - 250
        ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
        		 {text  : "Seq #"                , name  : "item_cat_code"                                     , width : 65        , style : "text-align:left;"
        		    , onRender      :  function(d){ 
                		                    return      bs({name:"item_cat_id",type:"hidden",value: svn (d,"item_cat_id")})
                		                            +   bs({name:"is_edited",type:"hidden"})
                		                            +   bs({name:"seq_no",value: svn (d,"seq_no")});
                            }        		    
        		},
        		{text  : "Code"                , name  : "item_cat_code"                                     , width : 80        , style : "text-align:left;"
        		    , onRender      :  function(d){ 
                		                    return  bs({name:"item_cat_code",value: svn (d,"item_cat_code")});
                            }        		    
        		}
        		,{text  : "Name"                , name  : "item_cat_name"           , type  : "input"         , width : 300       , style : "text-align:left;"}
        		,{text  : "Parent Item"         , name  : "parent_item_cat_id"      , type  : "select"        , width : 200       , style : "text-align:left;"}
        		,{text  : "Active?"             , name  : "is_active"               , type  : "yesno"         , width : 60        , style : "text-align:left;"   ,defaultValue:"Y"}
        		
        		,{text  : "Item Types"          , width : 100                       , style : "text-align:center;"      
                    ,onRender  :  
                        function(d){
                            var catId = (svn(d,"parent_item_cat_id")? svn(d,"parent_item_cat_id"):0);
                            return "<a href='javascript:manageItemTypes(" + svn(d,"item_cat_id") + ",\"" +  svn(d,"item_cat_name")  + "\"," + catId + ");'>" + svn(d,"countItemTypes") + "</a>"; 
                    }
                }
                	,{text  : "With Serial?"             , name  : "with_serial"     , type  : "yesno"         , width : 90        , style : "text-align:left;"   ,defaultValue:"Y"}

	    ] 
	    ,onComplete: function(){
               $("select[name='parent_item_cat_id']").dataBind( "item_category");
               setEditedRow();
        }  
    });    
}
function setEditedRow(){
    $("input, select").on("change keyup paste", function(){
        $(this).closest(".zRow").find("#is_edited").val("Y");
    });  
}
function displayInactiveItemCategory(){
     var cb = bs({name:"cbFilter1",type:"checkbox"});
     $("#" + tblInactiveICat).dataBind({
	     url            : procURL + "item_categories_sel @is_active='N'"
	    ,width          : 500
	    ,height         : $(document).height() - 250
	    ,selectorType   : "checkbox"
      //  ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
                 {text  : cb                                                                                 , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"item_cat_id",type:"hidden",value: svn (d,"item_cat_id")})
                                                      +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
            }	 
        		,{text  : "Code"                , name  : "item_cat_code"          , type  : "input"         , width : 65        , style : "text-align:left;"}
        		,{text  : "Name"                , name  : "item_cat_name"          , type  : "input"         , width : 300       , style : "text-align:left;"}
        		,{text  : "Active?"             , name  : "is_active"              , type  : "yesno"         , width : 55        , style : "text-align:left;"  }

	    ] 
    	     ,onComplete: function(){
                $("#cbFilter1").setCheckEvent("#" + tblInactiveICat + " input[name='cb']");
        }  
    });   
}
function displayRecordsItemTypes(id, ITid, name){
    var _dataRows =  [
 
        		 {text  : "Monitoring Type"                , name  : "monitoring_type_id"                 , width : 150        , style : "text-align:left;"
        		    , onRender      :  function(d){ 
                		                    return    bs({name:"item_type_id",type:"hidden",value: svn (d,"item_type_id")})
                		                           +  bs({name:"is_edited",type:"hidden"})
                		                           +  bs({name:"item_cat_id",type:"hidden",value: id})
                		                           +  bs({name:"monitoring_type_id",type:"select",value: svn (d,"monitoring_type_id")});
                            }        		    
        		}
        		,{text  : "Type Code"           , name  : "item_type_code"              , type  : "input"           , width : 85        , style : "text-align:left;"}
        		,{text  : "Type Name"                                                   , type  : "input"           , width : 400       , style : "text-align:left;"
        		    , onRender      : function(d){
        		                            return  bs({name:"item_type_name",type:"input",value: svn (d,"item_type_name")})
        		                                +   (ITid===0 ? bs({name:"parent_item_type_id",type:"hidden",value: svn (d,"parent_item_type_id")}) : "");
        		        
        		    }  
        		}];
        		
        		if(ITid!==0){
        		    	_dataRows.push({
        		    	    text  : name     , name  : "parent_item_type_id"      , type  : "select"         , width : 200       , style : "text-align:left;"
        		    
        		        });
        		}
        		
        		
        		_dataRows.push({text  : "Unit of Measure"     , name  : "unit_of_measure_id"      , type  : "select"          , width : 200       , style : "text-align:left;"
        		    
        		}
        		,{text  : "Is Active?"          , name  : "is_active"               , type  : "yesno"           , width : 75        , style : "text-align:center;"  ,defaultValue:"Y"}
        		,{text  : "Item Codes"                                                                          , width : 80        , style : "text-align:center;"      
                    ,onRender  :  
                        function(d){return "<a href='javascript:manageItemCodes(" + svn(d,"item_type_id") + ",\"" +  svn(d,"item_type_name")  + "\");'>" + svn(d,"countItemCodes") + "</a>"; 
                    }
                }

	    ) ;
    
     $("#" + tblIT).dataBind({
	     url            : execURL + "item_types_sel @item_cat_id=" + id
	    ,width          : 1225
	    ,height         : 400
        ,blankRowsLimit : 5
        ,dataRows       : _dataRows
        
    	     ,onComplete: function(){
                $("select[name='monitoring_type_id']").dataBind( "monitoring_type");
             
               	if(ITid!==0){
                $("select[name='parent_item_type_id']").dataBind({
                            url : execURL + "dd_item_types_sel @item_cat_id=" + ITid 
                            ,text: "item_type_name"
                            ,value: "item_type_id"
                        });
               	}
                $("select[name='unit_of_measure_id']").dataBind( "unit_of_measure");
                setEditedRow();
        }  
    });    
}    


function displayRecordsItemTypes2(id){
     $("#" + tblIT).dataBind({
	     url            : execURL + "item_types_sel @item_cat_id=" + id
	    ,width          : 1225
	    ,height         : 400
        ,blankRowsLimit : 5
        ,dataRows       : [
            
 
        		 {text  : "Monitoring Type"                , name  : "monitoring_type_id"                 , width : 150        , style : "text-align:left;"
        		    , onRender      :  function(d){ 
                		                    return    bs({name:"item_type_id",type:"hidden",value: svn (d,"item_type_id")})
                		                           +  bs({name:"is_edited",type:"hidden"})
                		                           +  bs({name:"item_cat_id",type:"hidden",value: id})
                		                           +  bs({name:"monitoring_type_id",type:"select",value: svn (d,"monitoring_type_id")});
                            }        		    
        		}
        		,{text  : "Type Code"           , name  : "item_type_code"          , type  : "input"           , width : 85        , style : "text-align:left;"}
        		,{text  : "Type Name"           , name  : "item_type_name"          , type  : "input"           , width : 400       , style : "text-align:left;"}
        		,{text  : "Parent Item Type"    , name  : "parent_item_type_id"     , type  : "select"          , width : 200       , style : "text-align:left;"}
        		,{text  : "Unit of Measure"     , name  : "unit_of_measure_id"      , type  : "select"          , width : 200       , style : "text-align:left;"}
        		,{text  : "Is Active?"          , name  : "is_active"               , type  : "yesno"           , width : 75        , style : "text-align:center;"  ,defaultValue:"Y"}
        		,{text  : "Item Codes"                                                                          , width : 80        , style : "text-align:center;"      
                    ,onRender  :  
                        function(d){return "<a href='javascript:manageItemCodes(" + svn(d,"item_type_id") + ",\"" +  svn(d,"item_type_name")  + "\");'>" + svn(d,"countItemCodes") + "</a>"; 
                    }
                }

	    ] 
    	     ,onComplete: function(){
                $("select[name='monitoring_type_id']").dataBind( "monitoring_type");
                $("select[name='parent_item_type_id']").dataBind( "item_type");
                $("select[name='unit_of_measure_id']").dataBind( "unit_of_measure");
                setEditedRow();
        }  
    });    
}    

function displayInactiveItemTypes(){
     var cb = bs({name:"cbFilter2",type:"checkbox"});
     $("#" + tblInactiveIT).dataBind({
	     url            : execURL + "item_types_sel @is_active='N'"
	    ,width          : 950
	    ,height         : 400
	    ,selectorType   : "checkbox"
      //  ,blankRowsLimit : 5
        ,dataRows       : [
            
                 {text  : cb     , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"item_type_id",type:"hidden",value: svn (d,"item_type_id")})
                		                            +  bs({name:"item_cat_id",type:"hidden",value: svn (d,"item_cat_id")})
                                                    +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
            }	 
        		,{text  : "Monitoring Type"  , name  : "monitoring_type_id"     , type  : "select"        , width : 160       , style : "text-align:left;"}
        		,{text  : "Type Code"        , name  : "item_type_code"         , type  : "input"         , width : 85        , style : "text-align:left;"}
        		,{text  : "Type Name"        , name  : "item_type_name"         , type  : "input"         , width : 400       , style : "text-align:left;"}
        		,{text  : "Unit of Measure " , name  : "unit_of_measure_id"     , type  : "select"        , width : 150       , style : "text-align:left;"}
        		,{text  : "Is Active?"       , name  : "is_active"     , type  : "yesno"         , width : 75        , style : "text-align:center;" }

	    ] 
    	     ,onComplete: function(){
                $("#cbFilter2").setCheckEvent("#" + tblInactiveIT + " input[name='cb']");
                $("select[name='monitoring_type_id']").dataBind( "monitoring_type");
        }  
    });    
}    

function displayRecordsItemCodes(id){
     //$("#" + tblIC).dataBind({
     $("#" + tblIT).dataBind({
	     url            : execURL + "item_codes_sel @item_type_id=" + id
	    ,width          : 1275
	    ,height         : 400
	    ,selectorType   : "checkbox"
        ,blankRowsLimit : 5
        ,dataRows       : [
            
	 
        		{text  : "Item Code"            , width : 200       , style : "text-align:left;"
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"item_code_id",type:"hidden",value: svn (d,"item_code_id")})
                		                            +  bs({name:"item_type_id",type:"hidden",value: id})
                		                            +  svn(d, "item_code"); 
        		    }
        		    
        		}
        		,{text  : "Part No."            , name  : "part_no"                 , type  : "input"         , width : 200       , style : "text-align:left;"}
        		,{text  : "National Stock No."  , name  : "national_stock_no"       , type  : "input"         , width : 150      , style : "text-align:left;"}
        		,{text  : "Item Name"           , name  : "item_name"               , type  : "input"         , width : 400      , style : "text-align:left;"}
        		,{text  : "Critical Level"      , name  : "critical_level"          , type  : "input"         , width : 100      , style : "text-align:left;"}
        		,{text  : "Reorder Level"       , name  : "reorder_level"           , type  : "input"         , width : 100      , style : "text-align:left;"}
        		,{text  : "Is Active?"          , name  : "is_active"               , type  : "yesno"         , width : 100      , style : "text-align:center;"  ,defaultValue:"Y"}
        	
	    ] 

    });    
}    

function displayInactiveItemCodes(){
     var cb = bs({name:"cbFilter3",type:"checkbox"});
     $("#" + tblInactiveIC).dataBind({
	     url            : execURL + "item_codes_sel @is_active='N'" 
	    ,width          : 1206
	    ,height         : 400
	    ,selectorType   : "checkbox"
     //   ,blankRowsLimit : 5
        ,dataRows       : [
            
                 {text  : cb     , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"item_code_id",type:"hidden",value: svn (d,"item_code_id")})
                		                            +  bs({name:"item_type_id",type:"hidden",value: svn (d,"item_type_id")})
                                                    +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
            }	 
                
        		,{text  : "Part No."                , name  : "part_no"               , type  : "input"         , width : 400       , style : "text-align:left;"}
        		,{text  : "National Stock No."      , name  : "national_stock_no"     , type  : "input"         , width : 150       , style : "text-align:left;"}
        		,{text  : "Item Category"           , name  : "item_name"         , type  : "input"         , width : 400      , style : "text-align:left;"}
        		,{text  : "Critical Level"          , name  : "critical_level"        , type  : "input"         , width : 100      , style : "text-align:left;"}
        		,{text  : "Is Active?"              , width : 100                     , type  : "yesno"         , style : "text-align:center;"  }
	    ] 
    	     ,onComplete: function(){
                $("#cbFilter3").setCheckEvent("#" + tblInactiveIC + " input[name='cb']");
        }  
    });    
}    


    
                                                                     