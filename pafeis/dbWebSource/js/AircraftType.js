var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;


zsi.ready(function(){
    displayRecords();
    getTemplate();
});

var context = { 
    id:"modalWindow"
    , sizeAttr: "modal-lg"
    , title: "Aircraft Type"
    , footer:  ' <div class="pull-left"><button type="button" onclick="submitData();" class="btn btn-primary"><span class="glyphicon glyphicon-floppy-disk"></span> Save</button>'
            +  ' <button type="button" onclick="deleteData();" class="btn btn-primary"><span class="glyphicon glyphicon-trash"></span> Delete</button></div>'
    , body: '<div id="inActiveRecords" class="zGrid" ></div>'
};

var contextAssemblyAndComponents = { 
    id:"modalAssemblyAndComponents"
    , title: "Components"
    , sizeAttr: "modal-lg"
    , footer: '<div class="pull-left"><button type="button" onclick="SubmitItems();" class="btn btn-primary">'
            + '<span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Save</button>'
            + '<button type="button" onclick="DeleteItems();" class="btn btn-primary"><span class="glyphicon glyphicon-trash"></span> Delete</button>'
    , body: '<div id="tblAssemblyAndComponents" class="zGrid"></div>'
};

function getTemplate(){
    $.get(base_url + "templates/bsDialogBox.txt",function(d){
        var template = Handlebars.compile(d);   
        $("body").append(template(context));
        $("body").append(template(contextAssemblyAndComponents));
    });    
}

function deleteData(){
    zsi.form.deleteData({
         code       : "ref-0039"
        ,onComplete : function(data){
                $("#grid").trigger('refresh');
                displayInactive();
        }
    }); 
} 

function submitData(){    
  $("#frm_modalWindow").jsonSubmit({
            procedure  : "aircraft_type_upd"
            ,optionalItems: ["is_active"]
            //,notInclude: "#employee_name"
            ,onComplete : function (data) {
                 if(data.isSuccess===true) zsi.form.showAlert("alert");
                 $("#grid").trigger('refresh');
                 displayInactive();
            }
    });        
}

$("#btnInactive").click(function () {
    $(".modal-title").text("Inactive Aircraft Type");
    $('#modalWindow').modal({ show: true, keyboard: false, backdrop: 'static' });
    //$('#modalWindow').setCloseModalConfirm(); 
    displayInactive();
}); 

$("#btnSave").click(function () {
   $("#grid").jsonSubmit({
             procedure: "aircraft_type_upd"
            ,optionalItems: ["is_active"]
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
	     url            : execURL + "aircraft_type_sel"
	    ,width          : $(document).width() - 35
	    ,height         : $(document).height() - 250
        ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,dataRows : [
		   { text  : cb                      , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
            		              return bs({name:"aircraft_type_id"   ,value: svn (d,"aircraft_type_id")    ,type:"hidden"})
            		                 +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                }
            }	 
        	,{ text:"Aircraft Type"             , width:180             , style:"text-align:center;"        , type:"input"          ,name:"aircraft_type"}
        	,{ text:"Manufacturer"              , width:180             , style:"text-align:center;"        , type:"select"         ,name:"manufacturer_id"}
        	,{ text:"Origin"                    , width:200             , style:"text-align:center;"        , type:"select"         ,name:"origin_id"}
        	,{ text:"Aircraft Class"            , width:150             , style:"text-align:center;"        , type:"select"         ,name:"aircraft_class_id"}
        	,{ text:"Aircraft Role"             , width:200             , style:"text-align:center;"        , type:"select"         ,name:"aircraft_role_id"}
        	,{ text:"Introduced Year"           , width:120             , style:"text-align:center;"        , type:"input"          ,name:"introduced_year"}
        	,{ text:"In Service"                , width:120              , style:"text-align:center;"        , type:"input"          ,name:"in_service"}
        	,{ text:"Note"                      , width:220            , style:"text-align:center;"        , type:"input"          ,name:"note"}
        	,{ text:"Active?"                   , width:70              , style:"text-align:center;"        , type:"yesno"          ,name:"is_active"  ,defaultValue:"Y"}
        	,{ text:"# of Assembly / Components"             , width : 120           , style : "text-align:center;"      
                ,onRender:  
                    function(d){return "<a href='javascript:manageAssembly(" + svn(d,"aircraft_type_id") + ",\"" +  svn(d,"aircraft_type")  + "\");'>" + svn(d,"countAssembly") + "</a>"; 
                }
            }
	    ]
        ,onComplete: function(){
            $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
            $("select[name='manufacturer_id']").dataBind( "manufacturer");
            $("select[name='origin_id']").dataBind("origin");
            $("select[name='aircraft_class_id']").dataBind( "aircraft_class");
            $("select[name='aircraft_role_id']").dataBind( "aircraft_role");
        }
    });    
}

function displayInactive(){   
      var cb = bs({name:"cbFilter2",type:"checkbox"});
     $("#inActiveRecords").dataBind({
	     url            : execURL + "aircraft_type_sel @is_active='N'"
	    ,width          : $(document).width() - 35
	    ,height         : $(document).height() - 250
        ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,dataRows : [
		    { text  : cb                      , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
            		              return bs({name:"aircraft_type_id"   ,value: svn (d,"aircraft_type_id")    ,type:"hidden"})
            		                 +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                }
            }	 
        	,{ text:"Aircraft Type"             , width:180             , style:"text-align:center;"        , type:"input"          ,name:"aircraft_type"}
        	,{ text:"Manufacturer"              , width:180             , style:"text-align:center;"        , type:"select"         ,name:"manufacturer_id"}
        	,{ text:"Origin"                    , width:200             , style:"text-align:center;"        , type:"select"         ,name:"origin_id"}
        	,{ text:"Aircraft Class"            , width:150             , style:"text-align:center;"        , type:"select"         ,name:"aircraft_class_id"}
        	,{ text:"Aircraft Role"             , width:200             , style:"text-align:center;"        , type:"select"         ,name:"aircraft_role_id"}
        	,{ text:"Introduced Year"           , width:120             , style:"text-align:center;"        , type:"input"          ,name:"introduced_year"}
        	,{ text:"In Service"                , width:120              , style:"text-align:center;"        , type:"input"          ,name:"in_service"}
        	,{ text:"Note"                      , width:220            , style:"text-align:center;"        , type:"input"          ,name:"note"}
        	,{ text:"Active?"                   , width:70              , style:"text-align:center;"        , type:"yesno"          ,name:"is_active"  ,defaultValue:"Y"}
	    ]
        ,onComplete: function(){
            $("#cbFilter2").setCheckEvent("#inActiveRecords input[name='cb']");
            $("select[name='manufacturer_id']").dataBind( "manufacturer");
            $("select[name='origin_id']").dataBind("origin");
            $("select[name='aircraft_class_id']").dataBind( "aircraft_class");
            $("select[name='aircraft_role_id']").dataBind( "aircraft_role");
        }
    });    
}

function manageAssembly(id,title){
    g_aircraft_type_id=id;
    g_aircraft_type=title;
    g_table_name = "ASSEMBLY";
    $("#modalAssemblyAndComponents .modal-title").html("Assembly / Components for » " + title);
    $('#modalAssemblyAndComponents').modal({ show: true, keyboard: false, backdrop: 'static' });
    $("#modalAssemblyAndComponents .modal-body").css("height","450px");
    $("#tblAssemblyAndComponents").empty();
    displayAssembly(id);
}
    
function displayAssembly(aircraft_type_id){
    var cb = bs({name:"cbFilter2",type:"checkbox"});
    $("#tblAssemblyAndComponents").dataBind({
	     url            : execURL + "aircraft_type_nomenclatures_sel @aircraft_type_id=" + aircraft_type_id
	    ,width          : $(document).width() - 430
	    ,height         : 395
        ,blankRowsLimit : 5
        ,dataRows       : [
    		 {text  : cb        , width : 25        , style : "text-align:left;"  
    		     ,onRender  :  function(d){
    		         return     bs({name:"aircraft_type_nomenclature_id",type:"hidden",value: svn (d,"aircraft_type_nomenclature_id")})
    		                  + bs({name:"aircraft_type_id",type:"hidden",value: aircraft_type_id})
    		                  + bs({name:"is_edited",type:"hidden"})
                              + bs({name:"item_code_id",type:"hidden",value: svn (d,"item_code_id")})
                              + bs({name:"aircraft_type_nomenclature_pid",type:"hidden",value: svn (d,"aircraft_type_nomenclature_pid")})
                              + (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                }
    		 }
    		,{text  : "Part No."                 , name  : "part_no"                , type  : "input"         , width : 200       , style : "text-align:left;"}
    		,{text  : "National Stock No."       , name  : "national_stock_no"      , type  : "input"         , width : 200       , style : "text-align:left;"}
    		,{text  : "Nomenclature"             , name  : "item_name"              , type  : "input"         , width : 320       , style : "text-align:left;"}
    		,{text  : "# of Components"           , width : 130                 , style : "text-align:center;"
    		    ,onRender : function(d){
                    return "<a href='javascript:manageComponent(" + svn(d,"aircraft_type_nomenclature_id") + ");'>" + svn(d,"countSubComponents") + "</a>"; 
                }
    		}
 	    ] 
 	    ,onComplete: function(){
 	        $("#cbFilter2").setCheckEvent("#tblAssemblyAndComponents input[name='cb']");
 	        setSearch("A");
 	        $("select, input").on("keyup change", function(){
                var $zRow = $(this).closest(".zRow");
                    $zRow.find("#is_edited").val("Y");
            });
 	    }
    });    
} 

function manageComponent(aircraft_type_nomenclature_id){
    g_aircraft_type_nomenclature_pid = aircraft_type_nomenclature_id;
    g_table_name = "COMPONENT";
    var backBtn = "<a title='Go Back' href='javascript:void(0);' class='btn-lg' onclick='manageAssembly("+ g_aircraft_type_id +",\""+ g_aircraft_type +"\");'><span class='glyphicon glyphicon-circle-arrow-left' style='color:#fff'></span></a>";
    $("#modalAssemblyAndComponents .modal-title").html(backBtn + " Component for » " + g_aircraft_type);
    $('#modalAssemblyAndComponents').modal({ show: true, keyboard: false, backdrop: 'static' });
    $("#modalAssemblyAndComponents .modal-body").css("height","450px");
    $("#tblAssemblyAndComponents").empty();
    displayComponents(aircraft_type_nomenclature_id);
}

function displayComponents(aircraft_type_nomenclature_id){
    var cb = bs({name:"cbFilter3",type:"checkbox"});
    $("#tblAssemblyAndComponents").dataBind({
	     url            : execURL + "aircraft_type_nomenclatures_sel @aircraft_type_nomenclature_id=" + aircraft_type_nomenclature_id
	    ,width          : $(document).width() - 490
	    ,height         : 395
        ,blankRowsLimit : 5
        ,dataRows       : [
            {text  : cb        , width : 25        , style : "text-align:left;"  
    		     ,onRender  :  function(d){
    		         return     bs({name:"aircraft_type_nomenclature_id",type:"hidden",value: svn (d,"aircraft_type_nomenclature_id")})
    		                  + bs({name:"aircraft_type_id",type:"hidden",value: g_aircraft_type_id})
    		                  + bs({name:"is_edited",type:"hidden"})
                              + bs({name:"item_code_id",type:"hidden",value: svn (d,"item_code_id")})
                              + bs({name:"aircraft_type_nomenclature_pid",type:"hidden",value: aircraft_type_nomenclature_id})
                              + (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                }
    		 }
    		,{text  : "Part No."                 , name  : "part_no"                , type  : "input"         , width : 200       , style : "text-align:left;"}
    		,{text  : "National Stock No."       , name  : "national_stock_no"      , type  : "input"         , width : 200       , style : "text-align:left;"}
    		,{text  : "Nomenclature"             , name  : "item_name"              , type  : "input"         , width : 430       , style : "text-align:left;"}
 	    ]
 	    ,onComplete: function(){
 	        $("#cbFilter3").setCheckEvent("#tblAssemblyAndComponents input[name='cb']");
 	        setSearch("C");
 	        $("select, input").on("keyup change", function(){
                var $zRow = $(this).closest(".zRow");
                    $zRow.find("#is_edited").val("Y");
            });
 	    }
    });    
}

function SubmitItems(){
    $("#tblAssemblyAndComponents").jsonSubmit({
          procedure: "aircraft_type_nomenclatures_upd"
        , optionalItems  : ["aircraft_type_nomenclature_id","aircraft_type_id","aircraft_type_nomenclature_pid"]
        , notInclude  : "#part_no,#national_stock_no,#item_name"
        , onComplete: function (data) {
            if(data.isSuccess===true){ 
                zsi.form.showAlert("alert");
            
                if(g_table_name==="ASSEMBLY"){
                    displayAssembly(g_aircraft_type_id);
                }else if(g_table_name==="COMPONENT"){
                    displayComponents(g_aircraft_type_nomenclature_pid);
                }
                displayRecords();
            }
        }
    });
}

function DeleteItems(){
     $("#tblAssemblyAndComponents").deleteData({
        code       : "ref-0050"
        ,onComplete : function(data){
            if(g_table_name==="ASSEMBLY"){
                displayAssembly(g_aircraft_type_id);
            }else if(g_table_name==="COMPONENT"){
                displayComponents(g_aircraft_type_nomenclature_pid);
            }   
            displayRecords();
        }
    });  
}

function setSearch(code){
    new zsi.search({
        tableCode: "ref-0023"
        , colNames: ["part_no","item_code_id","item_name","national_stock_no"] 
        , displayNames: ["Part No."]
        , searchColumn:"part_no"
        , input: "input[name=part_no]"
        , url: execURL + "searchData"
        , condition: "'item_cat_code IN(''A'',''C'')'"
        , onSelectedItem: function(currentObject, data, i){
            currentObject.value = data.part_no;
            
            var $zRow = $(currentObject).closest(".zRow");
            
            $zRow.find("#item_code_id").val(data.item_code_id);
            $zRow.find("#national_stock_no").val(data.national_stock_no);
            $zRow.find("#item_name").val(data.item_name);
        }
    });
    
    new zsi.search({
        tableCode: "ref-0023"
        , colNames: ["national_stock_no","item_code_id","item_name","part_no"] 
        , displayNames: ["Nat'l Stock No."]
        , searchColumn:"national_stock_no"
        , input: "input[name=national_stock_no]"
        , url: execURL + "searchData"
        , condition: "'item_cat_code IN(''A'',''C'')'"
        , onSelectedItem: function(currentObject, data, i){
            currentObject.value = data.national_stock_no;
            
            var $zRow = $(currentObject).closest(".zRow");
            
            $zRow.find("#item_code_id").val(data.item_code_id);
            $zRow.find("#part_no").val(data.part_no);
            $zRow.find("#item_name").val(data.item_name);
        }
    });
    
    new zsi.search({
        tableCode: "ref-0023"
        , colNames: ["item_name","item_code_id","part_no","national_stock_no"] 
        , displayNames: ["Item Name"]
        , searchColumn:"item_name"
        , input: "input[name=item_name]"
        , url: execURL + "searchData"
        , condition: "'item_cat_code IN(''A'',''C'')'"
        , onSelectedItem: function(currentObject, data, i){
            currentObject.value = data.item_name;
            
            var $zRow = $(currentObject).closest(".zRow");
            
            $zRow.find("#item_code_id").val(data.item_code_id);
            $zRow.find("#part_no").val(data.part_no);
            $zRow.find("#national_stock_no").val(data.national_stock_no);
        }
    });
}

function excelFileUpload(){
    var frm      = $("#frmUploadFile");
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
     