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
    ,g_parent_item_cat_id = null
    ,g_monitoring_type_name = ""
    ,g_link_value = 0
    ,g_column_name = ""
    ,g_keyword = ""
    ,g_item_cat_name = ""
    ,g_modal_name = ""
;

zsi.ready(function(){
    getTemplate();
    displayRecords();
});

var contextItemTypes = { 
      id:"modalWindowItemTypes"
    , title: "Types"
    , sizeAttr: "fullWidth"
    , footer: '<div class="pull-left" id="btnItemTypes">'
                +'<button type="button" onclick="submitItemsTypes();" class="btn btn-primary"><span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Save</button>'
                +'<button type="button" onclick="showInactiveItemTypes();" class="btn btn-primary"><span class="glyphicon glyphicon-ban-circle"></span>&nbsp;Inactive</button>'
              +'</div>'
              +'<div class="pull-left hide" id="btnItemCodes">'
                +'<button type="button" onclick="submitItemsCodes();" class="btn btn-primary"><span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Save</button>'
                +'<button type="button" onclick="showInactiveItemCodes();" class="btn btn-primary"><span class="glyphicon glyphicon-ban-circle"></span>&nbsp;Inactive</button>'
                +'<button type="button" onclick="addNewItemCodes();" class="btn btn-primary"><span class="glyphicon glyphicon-plus"></span>&nbsp;New</button>'
                +'<button type="button" onclick="showUploadFile();" class="btn btn-primary"><span class="glyphicon glyphicon-upload"></span>&nbsp;Upload File</button>'
              +'</div>'
    , body: '<div class="modalGrid zContainer1"><div id="' + tblIT + '" class="zGrid"></div></div>'
};

var contextItemCodes = { 
      id:"modalWindowItemCodes"
    , title: "Item Codes"
    , sizeAttr: "fullWidth"
    , footer: '<div class="pull-left"><button type="button" onclick="submitItemsCodes();" class="btn btn-primary">'
            + '<span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Save</button>'
            + '<button type="button" onclick="showInactiveItemCodes();" class="btn btn-primary"><span class="glyphicon glyphicon-ban-circle">'
            + '</span>&nbsp;Inactive</button></div>'
    , body: '<div class="modalGrid zContainer1"><div id="' + tblIC + '" class="zGrid"></div></div>'
};

var contextNewItemCodes = { 
      id:"modalWindowNewItemCodes"
    , title: "New Item Codes"
    , sizeAttr: "fullWidth"
    , footer: '<div class="pull-left"><button type="button" onclick="submitNewItemCodes();" class="btn btn-primary">'
            + '<span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Save</button></div>'
    , body: '<div class="modalGrid zContainer1"><div id="tblNewItemCodes" class="zGrid"></div></div>'
};

var contextInactiveItemCategory = { 
      id:"modalWindowInactiveItemCategory"
    , title: "Inactive Item Categories"
    , sizeAttr: "modal-md"
    , footer: '<div class="pull-left"><button type="button" onclick="submitInactiveItemCategory();" class="btn btn-primary">'
            + '<span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Save</button>'
            + '<button type="button" onclick="deleteItemCategory();" class="btn btn-primary"><span class="glyphicon glyphicon-trash">'
            + '</span>&nbsp;Delete</button></div>'
    , body: '<div class="modalGrid zContainer1"><div id="' + tblInactiveICat + '" class="zGrid"></div></div>'
};

var contextInactiveItemTypes = { 
      id:"modalWindowInactiveItemTypes"
    , title: "Inactive Item Types"
    , sizeAttr: "modal-lg"
    , footer: '<div class="pull-left"><button type="button" onclick="submitInactiveItemTypes();" class="btn btn-primary">'
            + '<span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Save</button>'
            + '<button type="button" onclick="deleteItemTypes();" class="btn btn-primary"><span class="glyphicon glyphicon-trash">'
            + '</span>&nbsp;Delete</button></div>'
    , body: '<div class="modalGrid zContainer1"><div id="' + tblInactiveIT + '" class="zGrid"></div></div>'
};        

var contextInactiveItemCodes = { 
      id:"modalWindowInactiveItemCodes"
    , title: "Inactive Item Types"
    , sizeAttr: "modal-lg"
    , footer: '<div class="pull-left"><button type="button" onclick="submitInactiveItemCodes();" class="btn btn-primary">'
            + '<span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Save</button>'
            + '<button type="button" onclick="deleteItemCodes();" class="btn btn-primary"><span class="glyphicon glyphicon-trash">'
            + '</span>&nbsp;Delete</button></div>'
    , body: '<div class="modalGrid zContainer1"><div id="' + tblInactiveIC + '" class="zGrid"></div></div>'
};

var contextFileUpload = { 
      id:"modalWindowFileUpload"
    , title: "File Upload"
    , sizeAttr: "modal-xs"
    , footer: ''
    , body: '<form enctype="multipart/form-data" id="frmUploadFile">'+
                '<div class="form-horizontal">'+
                    '<div class="form-group"> '+ 
                        '<label class="col-xs-3  control-label">Select File</label>'+
                        '<div class=" col-xs-3">'+
                            '<input type="hidden" id="tmpData" name="tmpData" class="form-control input-sm">'+
                            '<input type="file" class="browse btn btn-primary" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" name="file">'+
                        '</div>'+
                    '</div>'+
                    '<div class="form-group">'+ 
                        '<div class="col-xs-offset-3">'+
                            '<button type="button" onclick="excelFileUpload();" class="btn btn-primary" id="btnUploadFile" style="margin-left: 5px">'+
                                '<span class="glyphicon glyphicon-upload"></span> Upload'+
                            '</button>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</form>'
};

function getTemplate(callback){
    $.get(base_url + "templates/bsDialogBox.txt",function(d){
        var template = Handlebars.compile(d); 
        
        $("body").append(template(contextItemTypes));
        $("body").append(template(contextItemCodes));
        $("body").append(template(contextNewItemCodes));
        $("body").append(template(contextInactiveItemCategory));
        $("body").append(template(contextInactiveItemTypes));
        $("body").append(template(contextInactiveItemCodes));
        $("body").append(template(contextFileUpload));
        
        if(callback) callback();
    });    
}  

$("#btnSave").click(function () {
   $("#grid").jsonSubmit({
          procedure: "item_categories_upd"
        , optionalItems: ["is_active","with_serial"]
        , onComplete: function (data) {
            if(data.isSuccess===true) zsi.form.showAlert("alert");
            
            displayRecords();
        }
    });
});

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

function submitItemsTypes(){
    $("#frm_modalWindowItemTypes").jsonSubmit({
         procedure      : "item_types_upd"
        ,optionalItems  : ["item_cat_id","is_active","monitoring_type_id"]
        ,onComplete     : function (data) {
           if(data.isSuccess===true) zsi.form.showAlert("alert");
           
           displayRecordsItemTypes(item_cat_id, g_parent_item_cat_id, catName);
           displayRecords();
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
           displayRecordsItemTypes(item_cat_id, g_parent_item_cat_id, catName);
           displayRecords();
        }
    });
}

function submitItemsCodes(){
    $("#frm_modalWindowItemTypes").jsonSubmit({
         procedure      : "item_codes_upd"
        ,optionalItems  : ["item_type_id","is_active"]
        ,onComplete     : function (data) {
            if(data.isSuccess===true) zsi.form.showAlert("alert");

            if(g_modal_name==="ITEM-CODE"){
                displayRecordsItemCodes(item_type_id, g_monitoring_type_name, g_link_value);
            }else if(g_modal_name==="ITEM-CODE-CATEGORY"){
                displayItemCodesByCategory(item_cat_id, g_link_value);
            }
            $("#frm_modalWindowItemTypes").trigger("refresh");
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
           
            displayInactiveItemCodes();
            if(g_modal_name==="ITEM-CODE"){
                displayRecordsItemCodes(item_type_id, g_monitoring_type_name, g_link_value);
            }
            else if(g_modal_name==="ITEM-CODE-CATEGORY"){
                displayItemCodesByCategory(item_cat_id, g_link_value);
            }
        }
    });
}

function submitNewItemCodes(){
    $("#frm_modalWindowNewItemCodes").jsonSubmit({
         procedure      : "item_codes_upd"
        ,optionalItems  : ["item_cat_id","item_type_id","is_active"]
        ,onComplete     : function (data) {
           if(data.isSuccess===true) zsi.form.showAlert("alert");

            displayNewItemCodes(item_type_id);
            if(g_modal_name==="ITEM-CODE"){
                displayRecordsItemCodes(item_type_id, g_monitoring_type_name, g_link_value);
            }
            else if(g_modal_name==="ITEM-CODE-CATEGORY"){
                displayItemCodesByCategory(item_cat_id, g_link_value);
            }
            $("#frm_modalWindowNewItemCodes").trigger("refresh");
        }
    });
}

function manageItemTypes(id,title, ITid){
    item_cat_id=id;
    g_parent_item_cat_id = ITid;
    catName="";
        
    $.get(execURL + "item_categories_sel @item_cat_id="+ g_parent_item_cat_id
    ,function(data){
        if (data.rows!==null){
            catName = data.rows[0].item_cat_name;
        }
        
        displayRecordsItemTypes(id, g_parent_item_cat_id, catName);
        $("#btnItemTypes").removeClass("hide");
        $("#btnItemCodes").addClass("hide");
        $("#modalWindowItemTypes .modal-title").text("Types for » " + title);
        $('#modalWindowItemTypes').modal({ show: true, keyboard: false, backdrop: 'static' });
        //$('#modalWindowItemTypes').setCloseModalConfirm();
    });
}
    
function manageItemCodes(a,id,title,count){
    var $zRow  = $(a).closest(".zRow");
    var _mTypeName = $zRow.find("#monitoring_type_id option:selected").text();
    
    g_monitoring_type_name = _mTypeName;
    g_link_value = count;
    item_type_id=id;
    item_title = title;
    g_modal_name = "ITEM-CODE";
    var backBtn = "<a href='javascript:void(0);' class='btn-lg' onclick='manageItemTypes("+ item_cat_id +",\""+ catName +"\","+ ITid +");'><span class='glyphicon glyphicon-circle-arrow-left'></span></a>";
    var headerFilter = "<div class='pull-right form-inline margin-right'>" +
                              '<div class="form-group margin-right">'+
                                '<span class="modal-title">Select Column</span>'+
                                '<select class="form-control input-sm" id="column_name" name="column_name">'+
                                    '<option value=""></option>'+
                                    '<option value="part_no">Part No.</option>'+
                                    '<option value="national_stock_no">National Stock No.</option>'+
                                    '<option value="item_name">Nomenclature Name</option>'+
                                '</select>'+
                              '</div>'+
                              '<div class="form-group margin-right">'+
                                '<span class="modal-title" for="keyword">Keyword</span>'+
                                '<input type="text" class="form-control input-sm " id="keyword" name="keyword">&nbsp;'+
                              '</div>'+
                              '<button type="button" onclick="searchItemCodes()" class="btn btn-primary btn-sm" tite="Search"><span class="glyphicon glyphicon-filter"></span></button>'+
                              '&nbsp;<button type="button" onclick="Clear()" class="btn btn-primary btn-sm" tite="Clear">clear</button>'+
                        "</div>";
    
    displayRecordsItemCodes(id, _mTypeName, count);
    $("#btnItemTypes").addClass("hide");
    $("#btnItemCodes").removeClass("hide");
    $("#modalWindowItemTypes .modal-title").html(backBtn + " Types for » " + title + headerFilter);
    $('#modalWindowItemTypes').modal({ show: true, keyboard: false, backdrop: 'static' });
    $('#modalWindowItemTypes');//.setCloseModalConfirm();
}

function manageItemCodesByCategory(id, count, title){
    item_cat_id=id;
    g_link_value = count;
    g_item_cat_name = title;
    g_modal_name = "ITEM-CODE-CATEGORY";
    var headerFilter = "<div class='pull-right form-inline margin-right'>" +
                              '<div class="form-group margin-right">'+
                                '<span class="modal-title">Select Column </span>'+
                                '<select class="form-control input-sm" id="column_name" name="column_name">'+
                                    '<option value=""></option>'+
                                    '<option value="part_no">Part No.</option>'+
                                    '<option value="national_stock_no">National Stock No.</option>'+
                                    '<option value="item_name">Nomenclature Name</option>'+
                                '</select>'+
                              '</div>'+
                              '<div class="form-group margin-right">'+
                                '<span class="modal-title" for="keyword">Keyword </span>'+
                                '<input type="text" class="form-control input-sm " id="keyword" name="keyword">&nbsp;'+
                              '</div>'+
                              '<button type="button" onclick="searchItemCodes()" class="btn btn-primary btn-sm" tite="Search"><span class="glyphicon glyphicon-filter"></span></button>'+
                              '&nbsp;<button type="button" onclick="Clear()" class="btn btn-primary btn-sm" tite="Clear">clear</button>'+
                        "</div>";
    
    displayItemCodesByCategory(item_cat_id, g_link_value);
    $("#btnItemTypes").addClass("hide");
    $("#btnItemCodes").removeClass("hide");
    $("#modalWindowItemTypes .modal-title").html(title + headerFilter);
    $('#modalWindowItemTypes').modal({ show: true, keyboard: false, backdrop: 'static' });
}

$("#btnInactive").click(function(){
    $("#modalWindowInactiveItemCategory .modal-title").text("Inactive Item Category");
    $('#modalWindowInactiveItemCategory').modal({ show: true, keyboard: false, backdrop: 'static' });
    displayInactiveItemCategory();
});

function addNewItemCodes(){
    $("#modalWindowNewItemCodes .modal-title").text("New Item Codes » " + g_item_cat_name);
    $('#modalWindowNewItemCodes').modal({ show: true, keyboard: false, backdrop: 'static' });
    displayNewItemCodes(item_type_id);
}

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

function showUploadFile(){
    $("#modalWindowFileUpload .modal-title").text("Upload File");
    $('#modalWindowFileUpload').modal({ show: true, keyboard: false, backdrop: 'static' });
    $("#frm_modalWindowFileUpload").attr("enctype","multipart/form-data");
    
    $.get(execURL + "excel_upload_sel @load_name='Item Codes'", function(data){
        $("#tmpData").val('');
        if(data.rows.length > 0){
            $("#tmpData").val(data.rows[0].value);
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

function setEditedRow(){
    $("input, select").on("change keyup paste", function(){
        $(this).closest(".zRow").find("#is_edited").val("Y");
    });  
}

function displayRecords(){
     $("#grid").dataBind({
	     url            : procURL + "item_categories_sel"
	    ,width          : $(document).width() - 35
	    ,height         : $(document).height() - 250
        ,blankRowsLimit:5
        ,isPaging : true
        ,dataRows : [
		    {text  : "Seq #"                , width : 65                        , style : "text-align:left;"
    		    , onRender : function(d){ 
                    return      bs({name:"item_cat_id",type:"hidden",value: svn (d,"item_cat_id")})
                            +   bs({name:"is_edited",type:"hidden"})
                            +   bs({name:"seq_no",value: svn (d,"seq_no")});
                }        		    
    		}
    		,{text  : "Code"                , name  : "item_cat_code"           , type  : "input"         , width : 80        , style : "text-align:left;"}
    		,{text  : "Name"                , name  : "item_cat_name"           , type  : "input"         , width : 300       , style : "text-align:left;"}
    		,{text  : "Parent Item"         , name  : "parent_item_cat_id"      , type  : "select"        , width : 200       , style : "text-align:left;"}
    		,{text  : "Active?"             , name  : "is_active"               , type  : "yesno"         , width : 60        , style : "text-align:left;"   ,defaultValue:"Y"}
    		
    		,{text  : "Nomenclature Types"          , width : 150                       , style : "text-align:center;"      
                ,onRender : function(d){
                    var catId = (svn(d,"parent_item_cat_id")? svn(d,"parent_item_cat_id"):0);
                    return "<a href='javascript:manageItemTypes(" + svn(d,"item_cat_id") + ",\"" +  svn(d,"item_cat_name")  + "\"," + catId + ");'>" + svn(d,"countItemTypes") + "</a>"; 
                }
            }
            ,{text  : "Nomenclatures"          , width : 120                       , style : "text-align:center;"      
                ,onRender : function(d){
                    var catId = (svn(d,"parent_item_cat_id")? svn(d,"parent_item_cat_id"):0);
                    return "<a href='javascript:manageItemCodesByCategory(" + svn(d,"item_cat_id") + ","+ svn(d,"countItemCodesByCat") +",\"" +  svn(d,"item_cat_name")  + "\");'>" + svn(d,"countItemCodesByCat") + "</a>"; 
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

function displayInactiveItemCategory(){
     var cb = bs({name:"cbFilter1",type:"checkbox"});
     $("#" + tblInactiveICat).dataBind({
	     url            : procURL + "item_categories_sel @is_active='N'"
	    ,width          : 500
	    ,height         : $(document).height() - 250
	    ,selectorType   : "checkbox"
        ,isPaging : false
        ,dataRows : [
            {text  : cb                     , width : 25        , style : "text-align:left;"       
    		    ,onRender      :  function(d){ 
                    return      bs({name:"item_cat_id",type:"hidden",value: svn (d,"item_cat_id")})
                            +   bs({name:"is_edited",type:"hidden"})
                            +   bs({name:"seq_no",type:"hidden",value: svn (d,"seq_no")})
                            +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                }
            }	 
    		,{text  : "Code"                , name  : "item_cat_code"          , type  : "input"         , width : 65        , style : "text-align:left;"}
    		,{text  : "Name"                , width : 300       , style : "text-align:left;"
    		    ,onRender      :  function(d){ 
                    return      bs({name:"item_cat_name",type:"input",value: svn(d,"item_cat_name")})
                            +   bs({name:"parent_item_cat_id",type:"hidden",value: svn(d,"parent_item_cat_id")});
                }
    		}
    		,{text  : "Active?"             , width : 55        , style : "text-align:left;"
    		    ,onRender      :  function(d){ 
                    return      bs({name:"is_active",type:"yesno",value: svn(d,"is_active")})
                            +   bs({name:"with_serial",type:"hidden",value: svn(d,"with_serial")});
                }
    		}
	    ] 
        ,onComplete: function(){
            $("#cbFilter1").setCheckEvent("#" + tblInactiveICat + " input[name='cb']");
        }  
    });   
}

function displayRecordsItemTypes(id, parent_item_cat_id, name){
    var _dataRows =  [
		{text  : "Type Code"           , width : 85        , style : "text-align:left;"
		    , onRender      :  function(d){ 
                return    bs({name:"item_type_id",type:"hidden",value: svn (d,"item_type_id")})
                       +  bs({name:"is_edited",type:"hidden"})
                       +  bs({name:"item_cat_id",type:"hidden",value: id})
                       +  bs({name:"item_type_code",type:"input",value: svn (d,"item_type_code")});
            }   
		}
		,{text  : "Type Name"                          , type  : "input"      ,sortColNo: 4    , width : 400       , style : "text-align:left;"
		    , onRender      : function(d){
                return  bs({name:"item_type_name",type:"input",value: svn (d,"item_type_name")})
                    +   (parent_item_cat_id===0 ? bs({name:"parent_item_type_id",type:"hidden",value: svn (d,"parent_item_type_id")}) : "");
		    }  
	    }
	];
		
	if(parent_item_cat_id > 0){
    	_dataRows.push({
    	    text  : name     , name  : "parent_item_type_id"      , type  : "select"         , width : 200       , style : "text-align:left;"
        });
	}
		
	_dataRows.push(
	     //{text  : "Unit of Measure"     , name  : "unit_of_measure_id"      , type  : "select"          , width : 200       , style : "text-align:left;"}
		{text  : "Is Active?"          , name  : "is_active"               , type  : "yesno"           , width : 75        , style : "text-align:center;"  ,defaultValue:"Y"}
		,{text  : "Nomenclature Codes"  , width : 150                       , style : "text-align:center;"      
            ,onRender  : function(d){return "<a  href='javascript:void(0);' onclick='manageItemCodes(this," + svn(d,"item_type_id") + ",\"" 
                +  svn(d,"item_type_name")  + "\","+ svn(d,"countItemCodes") +");'>" 
                +  svn(d,"countItemCodes") + "</a>"; 
            }
        }
    );
    
    $("#" + tblIT).dataBind({
	     url            : procURL + "item_types_sel @item_cat_id=" + id
	    ,width          : $(document).width() -50
	    ,height         : $(document).height() -255
	    ,isPaging       : true
        ,blankRowsLimit : 5
        ,dataRows       : _dataRows
	    ,onComplete: function(){
            //$("select[name='monitoring_type_id']").dataBind( "monitoring_type");
            //$("select[name='unit_of_measure_id']").dataBind( "unit_of_measure");
            
           	if(ITid && ITid!==0){
                $("select[name='parent_item_type_id']").dataBind({
                    url : execURL + "dd_item_types_sel @item_cat_id=" + ITid 
                    ,text: "item_type_name"
                    ,value: "item_type_id"
                });
           	}
            $(".no-data input[name='item_type_code']").checkValueExists({code:"ref-0008",colName:"item_type_code"});
            $(".no-data input[name='item_type_name']").checkValueExists({code:"ref-0008",colName:"item_type_name"});
            setEditedRow();
        }  
    });    
}

function displayInactiveItemTypes(){
     var cb = bs({name:"cbFilter2",type:"checkbox"});
     $("#" + tblInactiveIT).dataBind({
	     url            : execURL + "item_types_sel @is_active='N'"
	    ,width          : $(document).width() -500
	    ,height         : $(document).height() -250
	    ,selectorType   : "checkbox"
        ,dataRows       : [
             {text  : cb                , width : 25                        , style : "text-align:left;"       
    		    , onRender      :  function(d){ 
                    return     bs({name:"item_type_id",type:"hidden",value: svn (d,"item_type_id")})
                            +  bs({name:"is_edited",type:"hidden"})
                            +  bs({name:"item_cat_id",type:"hidden",value: svn (d,"item_cat_id")})
                            +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                }
            }	 
    		//,{text  : "Monitoring Type"  , name  : "monitoring_type_id"     , type  : "select"        , width : 160       , style : "text-align:left;"}
    		,{text  : "Type Code"        , name  : "item_type_code"         , type  : "input"         , width : 85        , style : "text-align:left;"}
    		,{text  : "Type Name"        , width : 360                      , style : "text-align:left;"
    		    , onRender      :  function(d){ 
                    return     bs({name:"item_type_name",type:"input",value: svn (d,"item_type_name")})
                            +  bs({name:"parent_item_type_id",type:"hidden",value: svn (d,"parent_item_type_id")});
                }
    		}
    		//,{text  : "Unit of Measure " , name  : "unit_of_measure_id"     , type  : "select"        , width : 150       , style : "text-align:left;"}
    		,{text  : "Is Active?"       , name  : "is_active"              , type  : "yesno"         , width : 75        , style : "text-align:center;" }
	    ] 
	    ,onComplete: function(){
            $("#cbFilter2").setCheckEvent("#" + tblInactiveIT + " input[name='cb']");
            //$("select[name='monitoring_type_id']").dataBind( "monitoring_type");
            //$("select[name='unit_of_measure_id']").dataBind( "unit_of_measure");
            setEditedRow();
        }  
    });    
}    

function displayRecordsItemCodes(id,monitoring_type_name, count){
    var columnName = (g_column_name ? ",@col_name='"+ g_column_name +"'" : "");
    var keyword = (g_keyword ? ",@keyword='"+ g_keyword +"'" : "");
    $("#" + tblIT).dataBind({
	     url            : procURL + "item_codes_sel @item_type_id=" + id +",@link_value=" + count + columnName + keyword
	    ,width          : $(document).width() -50
	    ,height         : $(document).height() -255
	    ,selectorType   : "checkbox"
        ,blankRowsLimit : 0
        ,isPaging       : true
        ,dataRows       : [
    		{text  : "Type"            , width : 125               , style : "text-align:left;"
    		    , onRender      :  function(d){ 
                    return     bs({name:"item_code_id",type:"hidden",value: svn(d,"item_code_id")})
                            +  bs({name:"is_edited",type:"hidden"})
                            +  bs({name:"item_cat_id",type:"hidden",value: item_cat_id})
                            +  bs({name:"item_type_id",type:"select",value: id});
    		    }
    		}
    		,{text  : "Part No."            , name  : "part_no"                 , type  : "input"         , width : 200         , style : "text-align:left;"    ,sortColNo: 1 }
    		,{text  : "National Stock No."  , name  : "national_stock_no"       , type  : "input"         , width : 160         , style : "text-align:left;"    ,sortColNo: 2 }
    		,{text  : "Nomenclature Name"   , name  : "item_name"               , type  : "input"         , width : 360         , style : "text-align:left;"    ,sortColNo: 3 }
    		
    		,{text  : "Reorder Qty"         , name  : "reorder_level"           , type  : "input"         , width : 100         , style : "text-align:left;"}
    		,{text  : "Unit of Measure"     , name  : "unit_of_measure_id"      , type  : "select"        , width : 110         , style : "text-align:center;"}
    		,{text  : "Critical Level " + "(" + monitoring_type_name + ")"      , name  : "critical_level", type  : "input"     , width : 200                   , style : "text-align:center;"}
    		,{text  : "Monitoring Type"     , name  : "monitoring_type_id"      , type  : "select"        , width : 130         , style : "text-align:left;"}
    		,{text  : "Is Repairable?"      , name  : "is_repairable"           , type  : "yesno"         , width : 100         , style : "text-align:center;"  ,defaultValue:"N"}
    		,{text  : "Is Active?"          , name  : "is_active"               , type  : "yesno"         , width : 90          , style : "text-align:center;"  ,defaultValue:"Y"}
	    ] 
        ,onComplete: function(){
            $(".no-data input[name='part_no']").checkValueExists({code:"ref-0010",colName:"part_no"});
            $(".no-data input[name='national_stock_no']").checkValueExists({code:"ref-0010",colName:"national_stock_no"});
            $("select[name='monitoring_type_id']").dataBind( "monitoring_type");
            $("select[name='unit_of_measure_id']").dataBind( "unit_of_measure");
            $("select[name='item_type_id']").dataBind({
                url : execURL + "dd_item_types_sel" 
                ,text: "item_type_name"
                ,value: "item_type_id"
            });
            setEditedRow();
            
            $("#column_name").change(function(){
                if(!this.value){
                   $("#keyword").val("");
                }
            });
        }
    });    
}    

function displayInactiveItemCodes(){
     var cb = bs({name:"cbFilter3",type:"checkbox"});
     $("#" + tblInactiveIC).dataBind({
	     url            : execURL + "item_codes_sel @is_active=N" 
	    ,width          : $(document).width() -500
	    ,height         : $(document).height() -255
	    ,selectorType   : "checkbox"
        ,dataRows       : [
            {text  : cb                         , width : 25                    , style : "text-align:left;"       
    		    , onRender      :  function(d){ 
                    return     bs({name:"item_code_id",type:"hidden",value: svn (d,"item_code_id")})
                            +  bs({name:"is_edited",type:"hidden"})
                            +  bs({name:"item_cat_id",type:"hidden",value: svn (d,"item_cat_id")})
                            +  bs({name:"item_type_id",type:"hidden",value: svn (d,"item_type_id")})
                            +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                }
            } 
    		,{text  : "Part No."                , name  : "part_no"             , type  : "input"       , width : 200     , style : "text-align:left;"}
    		,{text  : "National Stock No."      , name  : "national_stock_no"   , type  : "input"       , width : 160     , style : "text-align:left;"}
    		,{text  : "Nomenclature Name"       , width : 350                   , style : "text-align:left;"
    		    , onRender      :  function(d){ 
                    return     bs({name:"item_name",type:"input",value: svn(d,"item_name")})     
                            +  bs({name:"critical_level",type:"hidden",value: svn(d,"critical_level")})
                            +  bs({name:"reorder_level",type:"hidden",value: svn(d,"reorder_level")});
                }
    		}
    		,{text  : "Is Active?"              , name  : "is_active"           , type  : "yesno"       , width : 100     , style : "text-align:center;"}
	    ] 
        ,onComplete: function(){
            $("#cbFilter3").setCheckEvent("#" + tblInactiveIC + " input[name='cb']");
            setEditedRow();
        }  
    });    
}    

function displayNewItemCodes(item_type_id){
    $("#tblNewItemCodes").dataBind({
	     width          : $(document).width() -50
	    ,height         : 250
        ,blankRowsLimit : 10
        ,dataRows       : [
    		{text  : "Type"                    , width : 125                        , style : "text-align:left;"    
    		    , onRender      :  function(d){ 
                    return     bs({name:"item_code_id",type:"hidden"})
                            +  bs({name:"is_edited",type:"hidden"})
                            +  bs({name:"item_cat_id",type:"hidden",value: item_cat_id })
                            +  bs({name:"item_type_id",type:"select",value: (g_modal_name==="ITEM-CODE" ? item_type_id : svn(d,"item_type_id")) });
    		    }
    		}
    		,{text  : "Part No."            , name  : "part_no"                 , type  : "input"           , width : 200         , style : "text-align:left;"}
    		,{text  : "National Stock No."  , name  : "national_stock_no"       , type  : "input"           , width : 160         , style : "text-align:left;"}
    		,{text  : "Nomenclature Name"   , name  : "item_name"               , type  : "input"           , width : 360         , style : "text-align:left;"}
    		
    		,{text  : "Reorder Qty"         , name  : "reorder_level"           , type  : "input"           , width : 100         , style : "text-align:left;"}
    		,{text  : "Unit of Measure"     , name  : "unit_of_measure_id"      , type  : "select"          , width : 110         , style : "text-align:center;"}
    		,{text  : "Critical Level " + "(" + g_monitoring_type_name + ")"    , name  : "critical_level"  , type  : "input"     , width : 200                   , style : "text-align:center;"}
    		,{text  : "Monitoring Type"     , name  : "monitoring_type_id"      , type  : "select"          , width : 130         , style : "text-align:left;"}
    		,{text  : "Is Repairable?"      , name  : "is_repairable"           , type  : "yesno"         , width : 100          , style : "text-align:center;"  ,defaultValue:"N"}
    		,{text  : "Is Active?"          , name  : "is_active"               , type  : "yesno"           , width : 90          , style : "text-align:center;"  ,defaultValue:"Y"}
	    ] 
        ,onComplete: function(){
            $(".no-data input[name='part_no']").checkValueExists({code:"ref-0010",colName:"part_no"});
            $(".no-data input[name='national_stock_no']").checkValueExists({code:"ref-0010",colName:"national_stock_no"});
            $("select[name='monitoring_type_id']").dataBind( "monitoring_type");
            $("select[name='unit_of_measure_id']").dataBind( "unit_of_measure");
            $("select[name='item_type_id']").dataBind({
                url : execURL + "dd_item_types_sel" 
                ,text: "item_type_name"
                ,value: "item_type_id"
            });
        }
    });    
}

function displayItemCodesByCategory(item_cat_id, count){
    var columnName = (g_column_name ? ",@col_name='"+ g_column_name +"'" : "");
    var keyword = (g_keyword ? ",@keyword='"+ g_keyword +"'" : "");
    $("#" + tblIT).dataBind({
	     url            : procURL + "item_codes_sel @item_cat_id=" + item_cat_id +",@link_value="+ count + columnName + keyword
	    ,width          : $(document).width() -50
	    ,height         : $(document).height() -255
	    ,selectorType   : "checkbox"
        ,blankRowsLimit : 0
        ,isPaging       : true
        ,dataRows       : [
    		{text  : "Item Category"            , width : 125               , style : "text-align:left;"
    		    , onRender      :  function(d){ 
                    return     bs({name:"item_code_id",type:"hidden",value: svn(d,"item_code_id")})
                            +  bs({name:"is_edited",type:"hidden"})
                            +  bs({name:"item_cat_id",type:"select",value: svn(d,"item_cat_id")});
                            
    		    }
    		}
    		,{text  : "Type"                , name  : "item_type_id"            , type  : "select"        , width : 125         , style : "text-align:left;" }
    		,{text  : "Part No."            , name  : "part_no"                 , type  : "input"         , width : 200         , style : "text-align:left;"    ,sortColNo: 1 }
    		,{text  : "National Stock No."  , name  : "national_stock_no"       , type  : "input"         , width : 160         , style : "text-align:left;"    ,sortColNo: 2 }
    		,{text  : "Nomenclature Name"   , name  : "item_name"               , type  : "input"         , width : 360         , style : "text-align:left;"    ,sortColNo: 3 }
    		,{text  : "Reorder Qty"         , name  : "reorder_level"           , type  : "input"         , width : 100         , style : "text-align:left;"}
    		,{text  : "Unit of Measure"     , name  : "unit_of_measure_id"      , type  : "select"        , width : 110         , style : "text-align:center;"}
    		,{text  : "Critical Level"      , name  : "critical_level"          , type  : "input"         , width : 200         , style : "text-align:center;"}
    		,{text  : "Monitoring Type"     , name  : "monitoring_type_id"      , type  : "select"        , width : 130         , style : "text-align:left;"}
    		,{text  : "Is Repairable?"      , name  : "is_repairable"           , type  : "yesno"         , width : 100         , style : "text-align:center;"  ,defaultValue:"N"}
    		,{text  : "Is Active?"          , name  : "is_active"               , type  : "yesno"         , width : 90          , style : "text-align:center;"  ,defaultValue:"Y"}
	    ] 
        ,onComplete: function(){
            $(".no-data input[name='part_no']").checkValueExists({code:"ref-0010",colName:"part_no"});
            $(".no-data input[name='national_stock_no']").checkValueExists({code:"ref-0010",colName:"national_stock_no"});
            $("select[name='item_cat_id']").dataBind( "item_category");
            $("select[name='monitoring_type_id']").dataBind( "monitoring_type");
            $("select[name='unit_of_measure_id']").dataBind( "unit_of_measure");
            $("select[name='item_type_id']").dataBind({
                url : execURL + "dd_item_types_sel" 
                ,text: "item_type_name"
                ,value: "item_type_id"
            });
            setEditedRow();
            
            $("#column_name").change(function(){
                if(!this.value){
                   $("#keyword").val("");
                }
            });
        }
    });    
} 

function searchItemCodes(){
    g_column_name = $("#column_name").val();
    g_keyword = $("#keyword").val();
    
    if(g_modal_name==="ITEM-CODE"){
        displayRecordsItemCodes(item_type_id, g_monitoring_type_name, g_link_value);
    }
    else if(g_modal_name==="ITEM-CODE-CATEGORY"){
        displayItemCodesByCategory(item_cat_id, g_link_value);
    }
}

function Clear(){
    g_column_name = "";
    g_keyword = "";
    $("#column_name").val('');
    $("#keyword").val('');
    
    if(g_modal_name==="ITEM-CODE"){
        displayRecordsItemCodes(item_type_id, g_monitoring_type_name, g_link_value);
    }
    else if(g_modal_name==="ITEM-CODE-CATEGORY"){
        displayItemCodesByCategory(item_cat_id, g_link_value);
    }
}

function excelFileUpload(){
    var frm      = $("#frm_modalWindowFileUpload");
    var formData = new FormData(frm.get(0));
    var files    = frm.find("input[name='file']").get(0).files;

    if(files.length===0){
        alert("Please select excel file.");
        return;    
    }
    
    //disable button and file upload.
    frm.find("input[name='file']").attr("disabled","disabled");
    $("btnUploadFile").hide();
    $("#loadingStatus").html("<div class='loadingImg'></div> Uploading...");

    $.ajax({
        url: base_url + 'file/templateUpload',  //server script to process data
        type: 'POST',
        //Ajax events
        success: completeHandler = function(data) {
            if(data.isSuccess){
                alert("Data has been successfully uploaded.");
                if(g_modal_name==="ITEM-CODE"){
                    displayRecordsItemCodes(item_type_id, g_monitoring_type_name, g_link_value);
                }
                else if(g_modal_name==="ITEM-CODE-CATEGORY"){
                    displayItemCodesByCategory(item_cat_id, g_link_value);
                }
                frm.find("input[name='file']").attr("disabled",false);
            }
            else
                alert(data.errMsg);
        },
        error: errorHandler = function() {
            console.log("error");
        },
        // Form data
        data: formData,
        //Options to tell JQuery not to process data or worry about content-type
        cache: false,
        contentType: false,
        processData: false
    }, 'json');        
}               
            