var bs                      = zsi.bs.ctrl
    , tblName               = "tblusers"
    , modalImageUser        = "modalWindowImageUser"
    , AddNewUsermodalWindow = "modalWindowAddNewUser"
    , tblAddNewUser         = "tableAddNewUser"
    , tblAddNewRecp         = "tableAddNewRecp"
    , cuser_id
    , svn                   = zsi.setValIfNull
    , isNew                 = false
    , recipients            = []
    , gTw
    , gSearchOption         = "" 
    , gSearchValue          = "" 
    , gFilterOption         = ""
    , gFilterValue          = ""
    , gRoleId               = ""
;

$(document).ready(function(){
    setSearch();
    //setInputs();
    displayRecords("");
    //getTemplate();
    gTw = new zsi.easyJsTemplateWriter();
});

$("#btnClear").click(function(){
    setSearch();
    isNew = false;
    displayRecords("");
});

$("#btnGo").click(function(){
    gSearchOption = $("#search_option").val();
    gSearchValue = $.trim($("#search_value").val());
    gFilterOption = $("#filter_option").val();
    gFilterValue = $.trim($("#filter_value").val());
    gRoleId = $.trim($("#roles_filter").val());
    displayRecords("");
});

// function markUserMandatory(){
//     zsi.form.markMandatory({       
//       "groupNames":[
//             {
//                  "names" : ["logon","last_name","first_name","role_id"]
//                 ,"type":"M"
//             }
//       ]      
//       ,"groupTitles":[ 
//              {"titles" : ["Logon","Last Name","First Name","Role"]}
//       ]
//     });    
// }

$("#btnSave").click(function () {
    //if( zsi.form.checkMandatory()!==true) return false;
 //   var res = isRequiredInputFound("#grid");
//    if(!res.result){
        $("#grid").jsonSubmit({
             procedure  : "users_upd"
             ,optionalItems: ["is_admin", "is_active"]
             //,notInclude: "#input"
            ,onComplete : function (data) {
                if(data.isSuccess===true){
                    zsi.form.showAlert("alert");
//                    isNew = false;
                    displayRecords("");
                }
            }
        });
    // } else {
    //     alert("Enter " + res.inputName);
    // }
});

$("#btnNactive").click(function () {
    $(".modal-title").text("InActive User's");
    $('#modalWindow').modal({ show: true, keyboard: false, backdrop: 'static' });
    if (modalWindow===0) {
        modalWindow=1;
        $("#modalWindow").on("hide.bs.modal", function () {
                if (confirm("You are about to close this window. Continue?")) return true;
                return false;
        });
    }    
    displayInactiveUsers();
});

$("#btnAdd").click(function () {
    $(".modal-title").text("Add New User's");
    $('#AddNewUsermodalWindow').modal({ show: true, keyboard: false, backdrop: 'static' });
    if (AddNewUsermodalWindow===0) {
        AddNewUsermodalWindow=1;
        $("#AddNewUsermodalWindow").on("hide.bs.modal", function () {
                if (confirm("You are about to close this window. Continue?")) return true;
                return false;
        });
    }    
    displayAddNewUser();
});

$("#btnSendEmail").click(function () {
    if(recipients.length === 0){
        alert("Please add recipients first");
    }else{
        rep             = ($.unique(recipients.map(function(e){return e._logon}))).join(';');
        window.location.href = "mailto:" + rep;
    }
});

$("#btnAddRecp").click(function(){
    var leng    = recipients.length,
        rec     = $("input[name=cb]:checked").getCheckBoxesValues();
        
        $.each(rec, function(index, row){
            console.log(row);
            elem        = $("#user_id").val(row).closest(".zRow"),
            logon       = elem.find("#logon").get(0).value,
            ln          = elem.find("#last_name").get(0).value,
            fn          = elem.find("#first_name").get(0).value,
            mn          = elem.find("#middle_ini").get(0).value,
            pn          = elem.find("#position").get(0).value,
            role        = elem.find("#role_id").closest(".zCell").find("#text").get(0).innerText,
            region      = elem.find("#region_id").closest(".zCell").find("#text").get(0).innerText,
            lead        = elem.find("#lead_unit_id").closest(".zCell").find("#text").get(0).innerText,
            contact     = elem.find("#contact_nos").get(0).value; 
            
            if(!recipients.isExists({keyName: "_userid", value: row}))
            recipients.push({
                _userid:    row,
                _logon:     logon,
                _ln:        ln,
                _fn:        fn,
                _mn:        mn,
                _pn:        pn,
                _role:      role,
                _region:    region,
                _lead:      lead,
                _contact:   contact
            });
        });
    
    alert((recipients.length - leng)+" recipients added");
});

function viewRecipients(){
    var _html   = "";
    
    $("#"+tblAddNewRecp+ ".modal-title").text("View Recipients");
    
    $.each(recipients, function(index, row){
        _html += gTw.new().div({class: "zRow"})
            .in()
                .div({class: "zCell text-center" })
                    .in()
                        .input({type: "hidden", value: row._userid, name: "user_id"})
                        .input({type: "checkbox", name: "recp_cb"})
                    .out()
                .div({class: "zCell text-center",   value: (row._logon      ? row._logon     : ""),   style: "width: 125px"       })
                .div({class: "zCell text-center",   value: (row._ln         ? row._ln        : ""),   style: "width: 125px"       })
                .div({class: "zCell text-center",   value: (row._fn         ? row._fn        : ""),   style: "width: 125px"       })
                .div({class: "zCell text-center",   value: (row._mn         ? row._mn        : ""),   style: "width: 125px"       })
                .div({class: "zCell text-center",   value: (row._pn         ? row._pn        : ""),   style: "width: 125px"       })
                .div({class: "zCell text-center",   value: (row._role       ? row._role      : ""),   style: "width: 125px"       })
                .div({class: "zCell text-center",   value: (row._region     ? row._region    : ""),   style: "width: 125px"       })
                .div({class: "zCell text-center",   value: (row._lead       ? row._lead      : ""),   style: "width: 125px"       })
                .div({class: "zCell text-center",   value: (row._contact    ? row._contact   : ""),   style: "width: 125px"       })
            .html();
            
    });
                            
    recipients.length === 0 ? _html = gTw.new().div({class: "fullWidth text-center", style: "font-size: 15px", value: "No Recipient"}).html() : "";
    $("#modalSendEmail").modal("hide");
    $("#AddNewRecpmodalWindow")
        .modal({ show: true, keyboard: false, backdrop: 'static' })
        .find(".zRows").html("").append(_html);
    $("#cbRecpFilter").setCheckEvent("#tableAddNewRecp input[name='cb']");   
}

function removeRecipient(){
    var selected = $("input[name=recp_cb]:checked").getCheckBoxesValues();
    $.each(selected, function(index, row){
        recipients.splice(recipients.findIndex(x => x._userid==row),1);
        $("#AddNewRecpmodalWindow").find("input[name=user_id][value="+row+"]").closest(".zRow").remove();
    });
    alert(selected.length+" recipients removed");
}

function clearGrid(){
    $("#" + tblName).clearGrid();
    }
function clearGrid(){
    $("#" + tblAddNewUser).clearGrid();
    }
function initChangeEvent(){
    $("input[name='file_thumbnail']").change(function(){
        fileNameThumbNail= this.files[0].name;
        var fileSize1 =  this.files[0].size / 1000.00; //to kilobytes
        if(fileSize1 > 100){ 
            alert("Please make sure that file size must not exceed 100 KB.");
            this.value="";
        }
    });
    
    $("input[name='file']").change(function(){
        fileNameOrg=this.files[0].name;
        var fileSize2 =  this.files[0].size / 1000.00; //to kilobytes
        if(fileSize2 > 800){ //1mb
            alert("It is recommended that file size must not exceed 800 KB.");
            this.value="";
        }
    });
}
function submitItems(){    
  $("#frm_modalWindow").jsonSubmit({
             procedure  : "users_upd"
             ,optionalItems: ["is_active","is_contact"]
             ,onComplete : function (data) {
                 if(data.isSuccess===true) zsi.form.showAlert("alert");
                 displayRecords();
                 displayInactiveUsers();
            }
    });        
    $('#modalWindow').modal('hide');
}
function saveNewUser(){
    if( zsi.form.checkMandatory()!==true) return false;
    var res = isRequiredInputFound("#tableAddNewUser");
    if(!res.result){
        $("#tableAddNewUser").jsonSubmit({
                 procedure  : "users_upd"
                 ,optionalItems: ["is_active","is_contact"]
                 ,onComplete : function (data) {
                     if(data.isSuccess===true){
                        zsi.form.showAlert("alert");
                        isNew = false;
                        displayRecords();
                        displayAddNewUser();
                     }
                }
        });        
        $('#AddNewUsermodalWindow').modal('hide');
    } else {
        alert("Enter " + res.inputName);
    }
}
/*
function isRequiredInputFound(form){
    var result = false;
    var inputName = "";
    $(form).find("input[name='is_edited']").each(function(e){
        if($.trim(this.value) === "Y"){
            var $zRow = $(this).closest(".zRow");
            var logon = $zRow.find("input#logon").val();
            var lastName = $zRow.find("input#last_name").val();
            var firstName = $zRow.find("input#first_name").val();
            var roleID = $zRow.find("input#role_id").val();
            
            if ($.trim(logon) === ""){
                result = true;
                inputName = "Logon";
            }
            if ($.trim(lastName) === ""){
                result = true;
                inputName = "Last Name";
            }
            if ($.trim(firstName) === ""){
                result = true;
                inputName = "First Name";
            }
            if ($.trim(roleID) === ""){
                result = true;
                inputName = "Role";
            }
        }
    });

    return {result, inputName};
}
*/
function setSearch(){
    gSearchOption = "";
    gSearchValue = "";
    gFilterOption = "";
    gFilterValue = "";
    gRoleId = "";
    
    $(".search-filter").val("");
    $("select#search_option").val("logon");
    $("select#filter_option").val("region_id");
    $("select#filter_value").dataBind("regions");
    $("select#roles_filter").dataBind("roles");
    
    $("select#filter_option").change(function(){
        var filterValue = "";
        if(this.value){
            if(this.value === "region_id") {
                filterValue = "regions";
            } else if(this.value === "lead_unit_id") {
                filterValue = "lead_units";
            }
            
            $("select#filter_value").dataBind(""+ filterValue +"");
        }
    });

    /*var ofilterId =  $("#logon_id_filter");
    zsi.search({
        tableCode: "adm-0002"
        ,colNames : ["empl_name"] 
        ,displayNames : ["Lastname, Firstname"]  
        ,searchColumn :"empl_name"
        ,input:"#logon_name_filter"
        ,url : execURL + "searchData"
        ,condition :"'is_active=''Y'' and not role_id is null'"
        ,onSelectedItem: function(currentObject,data,i){ 
            currentObject.value=data.empl_name;
            var tr  = currentObject.parentNode.parentNode;
            $(tr).find("#logon_id_filter").val(data.user_id);
             displayRecords(logon_id_filter.val());
           // displayRecords(data.user_id);
        }
        ,onChange:function(text){
            if(text==="") {
                ofilterId.val("");
                displayRecords("");
            }
       }
       
    });   */     
}
function setInputs(){
    logon_id_filter = $("#logon_id_filter");
}   

// function getTemplate(){
//     $.get(base_url + "templates/bsDialogBox.txt",function(d){
//         var template = Handlebars.compile(d);     
                        
//         var context = { id:"modalWindow"
                       
//                         , title: "Users"
//                         , footer:  ' <div class="pull-left"><button type="button" onclick="submitItems();" class="btn btn-primary"><span class="glyphicon glyphicon-floppy-disk"></span> Save</button></div>'
//                         , body: 
                         
//                         '<div><div id="' + tblName + '" class="zGrid"></div></div>'
//                       };
        
//         var html    = template(context);     
//         $("body").append(html);
        
//         var contextImageWindow = { 
//                           id    : modalImageUser
//                         , title : "Categories "
//                         , footer: '<div class="pull-left"><button type="button" onclick="userImageUpload();" class="btn btn-primary"><span class="glyphicon glyphicon-upload"></span> Upload</button>'
//                                   + '</div>' 
//                     };
        
//         var htmlImageWindow    = template(contextImageWindow);     
//         $("body").append(htmlImageWindow);
        
//         var contextSendEmail = { 
//                           id    : "modalSendEmail"
//                         , title : "Send Email "
//                         , footer: '<div class="pull-left"><button type="button" onclick="sendEmail();" class="btn btn-primary"><span class="glyphicon glyphicon-send"></span> Send</button>'
//                                   + '<button type="button" onclick="closeModalSendEmail();" class="btn btn-primary"><span class="glyphicon glyphicon-remove-circle"></span> Close</button>'
//                                   + '<button type="button" class="btn btn-primary btn-sm" onclick="viewRecipients()"><span class="glyphicon glyphicon-search"></span> View Recipients</button>'
//                                   + '</div>' 
//                         , body:'<div class="form-group">'
//                                     + '<label for="recipient">Recipient</label>'
//                                     + '<input type="hidden" id="user_id" name="user_id" >'
//                                     + '<input type="input" class="form-control input-sm" id="recipient" name="recipient" disabled>'
//                                   + '</div>'
//                                   + '<div class="form-group">'
//                                     + '<label for="subject">Subject</label>'
//                                     + '<input type="input" class="form-control input-sm" id="subject" name="subject">'
//                                   + '</div>'
//                                     + '<label for="body">Body</label>'
//                                     + '<textarea class="form-control" rows="10" id="body" name="body"></textarea>'
//                     };
        
//         var htmlSendEmail   = template(contextSendEmail);     
//         $("body").append(htmlSendEmail);
        
//         var contextAddNewUser = { 
//                           id    : "AddNewUsermodalWindow"
//                         , title : "AddNewUser"
//                         , footer:  ' <div class="pull-left"><button type="button" onclick="saveNewUser();" class="btn btn-primary"><span class="glyphicon glyphicon-floppy-disk"></span> Save</button></div>'
//                         , sizeAttr:"fullWidth"         
//                         , body: '<div><div id="' + tblAddNewUser + '" class="zGrid"></div></div>'
                     
//                     };
        
//         var htmlAddNewUser   = template(contextAddNewUser);     
//         $("body").append(htmlAddNewUser);
        
//         var contextAddNewRecp = { 
//                           id    : "AddNewRecpmodalWindow"
//                         , title : "Recipients List"
//                         , footer:  ' <div class="pull-left"><button type="button" onclick="removeRecipient();" class="btn btn-primary"><span class="glyphicon glyphicon-remove"></span> Remove Recipient</button></div>'
//                         , sizeAttr:"fullWidth"         
//                         , body: '<div>'
//                                     +'<div id="' + tblAddNewRecp + '" class="zGrid">'
//                                         +'<div class="zGridPanel right">'
//                                             +'<div class="zHeaders">'
//                                                 +'<div class="item" style="width:25px;"><input id="cbRecpFilter" type="checkbox"></input></div>'
//                                                 +'<div class="item" style="width:125px;text-align:center;"><div class="title" style="text-align:center;"><span class="text">Corplear logon </span></div><div class="cr"></div></div>'
//                                                 +'<div class="item" style="width:125px;text-align:center;"><div class="title" style="text-align:center;"><span class="text">Last Name </span></div><div class="cr"></div></div>'
//                                                 +'<div class="item" style="width:125px;text-align:center;"><div class="title" style="text-align:center;"><span class="text">First Name </span></div><div class="cr"></div></div>'
//                                                 +'<div class="item" style="width:125px;text-align:center;"><div class="title" style="text-align:center;"><span class="text">Middle Initial </span></div><div class="cr"></div></div>'
//                                                 +'<div class="item" style="width:125px;text-align:center;"><div class="title" style="text-align:center;"><span class="text">Position </span></div><div class="cr"></div></div>'
//                                                 +'<div class="item" style="width:125px;text-align:center;"><div class="title" style="text-align:center;"><span class="text">Role </span></div><div class="cr"></div></div>'
//                                                 +'<div class="item" style="width:125px;text-align:center;"><div class="title" style="text-align:center;"><span class="text">Region </span></div><div class="cr"></div></div>'
//                                                 +'<div class="item" style="width:125px;text-align:center;"><div class="title" style="text-align:center;"><span class="text">Lead Unit </span></div><div class="cr"></div></div>'
//                                                 +'<div class="item" style="width:125px;text-align:center;"><div class="title" style="text-align:center;"><span class="text">Contact No. </span></div><div class="cr"></div></div>'
//                                             +'</div>'
//                                             +'<div class="zRows">'
                                                
//                                             +'</div>'
//                                         +'</div>'
//                                     +'</div>'
//                                 +'</div>'
                     
//                     };
        
//         var htmlAddNewRecp   = template(contextAddNewRecp);     
//         $("body").append(htmlAddNewRecp);
//         $("textarea").jqte({
//             source:     false,
//             title:      false,
//             fsize:      false,
//             formats:    false,
//             rule:       false,
//             link:       false,
//             unlink:     false,
//             strike:     false,
//             colors:     false
//         });
        
//     });    
// }
function manageItem(id,title){
     cuser_id = id;
    
    displayOemRegion(id);
    
     $("#frm_modalWindowOemRegion .modal-title").text("OEM Region for » " + title);
    $('#modalWindowOemRegion').modal({ show: true, keyboard: false, backdrop: 'static' });
    if (modalWindowOemRegion===0) {
        modalWindowOemRegion=1;
        $("#modalWindowOemRegion").on("hide.bs.modal", function () {
                if (confirm("You are about to close this window. Continue?")) return true;
                return false;
        });
    }
}
function clearGrid(){
    $("#" + tblName2).clearGrid();
}   
function submitItemsUserOR(){
    $("#frm_modalWindowOemRegion").jsonSubmit({
         procedure      : "user_oem_region_upd"
      ,optionalItems  : ["user_oem_region_id,user_id"]
        ,onComplete     : function (data) {
            if(data.isSuccess===true)
            $("#" + tblName2).clearGrid();
             displayOemRegion(cuser_id);
             zsi.form.showAlert("alert");
            $("#grid").trigger('refresh');
        }
    });
}
//modal window//
/*function displayInactiveUsers(){   
    $("#" + tblName).dataBind({
        url   : procURL + "users_sel @is_active='N'" 
 	    ,width          : 495
	    ,height         : 400
        ,dataRows       : [
    		{text  : "Corplear logon "     , width : 200       , style : "text-align:center;"
                ,onRender :function(d){
                                return     bs({name:"user_id",type:"hidden",value: d.user_id})
                                         + bs({name:"is_edited",type:"hidden"})
                                         + bs({name:"logon",type:"hidden",value: d.logon}) 
                                         + bs({name:"last_name",type:"hidden",value: d.last_name}) 
                                         + bs({name:"first_name",type:"hidden",value: d.first_name}) 
                                         + bs({name:"middle_ini",type:"hidden",value: d.middle_ini})
                                         + bs({name:"position",type:"hidden",value: d.position})
                                         + bs({name:"role_id",value: d.role_id,type:"hidden"})   
                                         + bs({name:"region_id",value: d.region_id,type:"hidden"})
                                         + bs({name:"lead_unit_id",value: d.lead_unit_id,type:"hidden"})
                                         + bs({name:"contact_nos",value: d.contact_nos,type:"hidden"})
                                         + bs({name:"is_contact",value: d.is_contact,type:"hidden"})   
                                         + d.logon;                          
                            } 
    		}
    	   ,{text  : "User "     , width : 200       , style : "text-align:center;"
    	        ,onRender :function(d){ return d.user_name; }
    	   }
           ,{text  : "Active?"  , width : 70    , style : "text-align:center;"  ,type:"yesno"  ,name:"is_active"    ,defaultValue:"Y"}
        ]
        ,onComplete: function(){
            setEditedRow();
        }
    });  
}

function displayAddNewUser(){   
    var cb = bs({name:"cbFilter1",type:"checkbox"});
    $("#" + tblAddNewUser).dataBind({
        // url    : execURL + "users_sel"
 	    width          : $(document).width()-35
	    ,height         : $(document).height()-540 
	    ,selectorType   : "checkbox"
        ,blankRowsLimit : 5
        ,dataRows       : [
    		{text  : cb     , width : 25       , style : "text-align:center;"
                ,onRender : function(d){ return bs({name:"user_id",type:"hidden",value: svn(d,"user_id")})
                                             +  bs({name:"is_edited",type:"hidden"})
                                             +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                }
       		}
    		
    		,{text  : "Corplear logon "     , width : 130       , style : "text-align:center;"       ,type:"input"       ,name:"logon"}
    		,{text  : "Last Name"           , width : 120       , style : "text-align:center;"       ,type:"input"       ,name:"last_name"}
            ,{text  : "First Name"          , width : 100       , style : "text-align:center;"       ,type:"input"       ,name:"first_name"}
            ,{text  : "M.I."                , width : 70        , style : "text-align:center;"       ,type:"input"       ,name:"middle_ini"}
            ,{text  : "Position"            , width : 120       , style : "text-align:center;"       ,type:"input"       ,name:"position"}
            ,{text  : "Role"                , width : 100       , style : "text-align:center;"       ,type:"ddl"         ,name:"role_id"        ,displayText:"role_name"}
            ,{text  : "Region"              , width : 100       , style : "text-align:center;"       ,type:"ddl"         ,name:"region_id"      ,displayText:"Region"}
            ,{text  : "Lead Unit"           , width : 100       , style : "text-align:center;"       ,type:"ddl"         ,name:"lead_unit_id"   ,displayText:"Country"}
            ,{text  : "Contact Number"      , width : 120       , style : "text-align:center;"       ,type:"input"       ,name:"contact_nos"}
            ,{text  : "Contact?"            , width : 60        , style : "text-align:center;"       ,type:"yesno"       ,name:"is_contact"     ,defaultValue:"Y"}
            ,{text  : "Active?"             , width : 60        , style : "text-align:center;"       ,type:"yesno"       ,name:"is_active"      ,defaultValue:"Y"}
            
        ]
        ,onComplete: function(){

            //$("#" + tblAddNewUser).tableHeadFixer();
            $("#cbFilter1").setCheckEvent("#" + tblAddNewUser + "input[name='cb']");

            //$("select[name='plant_id']").dataBind("plants");
            $("[name='role_id']").dataBind2("roles");
            $("select[name='oem_id']").dataBind("oem");

            $("[name='region_id']").dataBind2("regions");
            
            $("[name='lead_unit_id']").dataBind2({
                url : base_url + "selectoption/code/lead_units"
                ,onClick: function(cell,hid,select){
                    var $zRow = cell.parent();
                    var region_id = $zRow.find("#region_id").val();

                    if(region_id){
                        select.dataBind({
                             url: base_url + "selectoption/code/lead_units, 'region_id="+ region_id +"'"
                            ,selectedValue : hid.val()
                        });
                    }else{
                        select.fillSelect({ 
                            data : []
                        });
                    }
                }
            });

            markUserMandatory();
            setEditedRow();
            $(".no-data input[name='logon']").checkValueExists({code:"adm-0002",colName:"logon"
               ,isNotExistShow :  false
               ,message : "data already exists"
            });
        }
    });    
}
*/
function displayRecords(user_id){   
    var cb = bs({name:"cbFilter1",type:"checkbox"});
    $("#grid").dataBind({
         url    : execURL + "users_sel @searchOption='"+ gSearchOption +"',@searchValue='"+ gSearchValue +"',@role_id='"+ gRoleId +"'"
         //url    : procURL + "users_sel @user_id=" + (typeof user_id !==ud ? user_id : "") + (isNew ? ",@is_new='Y'" : "")
 	    ,width          : $(document).width()-15
	    ,height         : $(document).height()-255 
	    ,selectorType   : "checkbox"
       // ,blankRowsLimit : 5
        ,rowsPerPage    : 1000
        ,isPaging : true
        ,dataRows       : [
    // 		{text  : cb     , width : 25       , style : "text-align:center;"
    //             ,onRender : function(d){ return bs({name:"user_id",type:"hidden",value: svn(d,"user_id")})
    //                                          +  bs({name:"is_edited",type:"hidden"})
    //                                          +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
    //             }
    //   		}
    // 		,{text  : ""     , width : 25       , style : "text-align:center;"
    //             ,onRender :function(d){ 
    //                         var mouseMoveEvent= "onmouseover='mouseover(\"" +  svn(d,"img_filename") + "\");' onmouseout='mouseout();'";
    //                           return (d !==null ? "<a href='javascript:void(0);' " + mouseMoveEvent + " class='btn btn-sm'  onclick='showModalUploadImage(\""+ svn(d,"img_filename") +"\");'  ><span class='glyphicon glyphicon-picture' ></span> </a>" : "") ;
    //                           }
    // 		}
    		{text  : "Corplear logon "      , width : 155           , style : "text-align:center;"     ,sortColNo:3
    		           ,onRender : function(d){ 
    		               return    bs({name:"user_id",type:"hidden",value: svn(d,"user_id")})
                                   + bs({name:"logon",type:"input",value: svn(d,"logon")});
    		           }
    		}
            ,{text  : "First Name"          , width : 150           , style : "text-align:left;"            ,type:"input"       ,name:"first_name" ,sortColNo:4}
            ,{text  : "Middle Initial"      , width : 130           , style : "text-align:center;"          ,type:"input"       ,name:"middle_name" }
            ,{text  : "Last Name"           , width : 150           , style : "text-align:left;"            ,type:"input"       ,name:"last_name" ,sortColNo:6}
            ,{text  : "Name Suffix"         , width : 100           , style : "text-align:center;"          ,type:"input"       ,name:"name_suffix" }
            ,{text  : "Role"                , width : 130           , style : "text-align:center;"          ,type:"select"      ,name:"role_id"        ,displayText:"role_name"}
            ,{text  : "Admin?"              , width : 60            , style : "text-align:center;"          ,type:"yesno"       ,name:"is_admin"}
            ,{text  : "Active?"             , width : 60            , style : "text-align:center;"          ,defaultValue:"Y"
                   ,onRender : function(d){ return bs({name:"is_active" ,type:"yesno"   ,value: svn(d,"is_active")    })
                                                  +  bs({name:"is_edited",type:"hidden"});
                 }
            }
            // ,{text  : "Upload Image"        , width : 100           , style : "text-align:center;"
            //     ,onRender : function(d){ return (d !==null ? "<a href='javascript:void(0);'  onclick='showModalUploadUserImage(" + svn(d,"user_id") +",\"" + svn(d,"user_name") + "\");'  ><span class='glyphicon glyphicon-upload' style='font-size:12pt;' ></span> </a>": ""); }   
            // }
        ]
        ,onComplete: function(){
             $("input, select").on("change keyup ", function(){
                        $(this).closest(".zRow").find("#is_edited").val("Y");
                });       

          //  $("#grid").tableHeadFixer();
          //  $("#cbFilter1").setCheckEvent("#grid input[name='cb']");

            //$("select[name='plant_id']").dataBind("plants");
            $("[name='role_id']").dataBind("roles");
            // $("select[name='oem_id']").dataBind("oem");

            // $("[name='region_id']").dataBind2("regions");
            
            // $("[name='lead_unit_id']").dataBind2({
            //     url : base_url + "selectoption/code/lead_units"
            //     ,onClick: function(cell,hid,select){
            //         var $zRow = cell.parent();
            //         var region_id = $zRow.find("#region_id").val();

            //         if(region_id){
            //             select.dataBind({
            //                  url: base_url + "selectoption/code/lead_units, 'region_id="+ region_id +"'"
            //                 ,selectedValue : hid.val()
            //             });
            //         }else{
            //             select.fillSelect({ 
            //                 data : []
            //             });
            //         }
            //     }
            // });
//            markUserMandatory();
            setEditedRow();
            $(".no-data input[name='logon']").checkValueExists({code:"adm-0002",colName:"logon"
               ,isNotExistShow :  false
               ,message : "data already exists"
            });
        }
    });    
}

$.fn.clearValue = function(){
   this.html("<option></option>"); 
};

function showModalUploadUserImage(UserId,title){
    user_id = UserId;
    var m=$('#' + modalImageUser);
    
    m.find(".modal-title").text("Image User for » " + title);
    m.modal("show");
    m.find("form").attr("enctype","multipart/form-data");
    
    $.get(base_url + 'page/name/tmplImageUpload'
        ,function(data){
            m.find('.modal-body').html(data);
            $("#frm_" + modalImageUser).find("#prefixKey").val("user.");
            initChangeEvent();
        }
    ); 
}

function userImageUpload(){
    var frm = $("#frm_" + modalImageUser);
    var fileOrg=frm.find("#file").get(0);

    if( fileOrg.files.length<1 ) { 
         alert("Please select image.");
        return;
    }
    var formData = new FormData( frm.get(0));
    $.ajax({
        url: base_url + 'file/UploadImage',  //server script to process data
        type: 'POST',

        //Ajax events
        success: completeHandler = function(data) {
            if(data.isSuccess){
                //submit filename to server
                $.get(base_url  + "sql/exec?p=dbo.image_file_users_upd @user_id=" + user_id
                                + ",@img_filename='user." +  fileOrg.files[0].name + "'"
                ,function(data){
                    zsi.form.showAlert("alert");
                    //$("#userImgBox").attr("src",  base_url + "file/viewImage?fileName=user." + fileOrg.files[0].name + "&isthumbnail=n" );
                    $('#' + modalImageUser).modal('toggle');
                    
                    //refresh latest records:
                    displayRecords();
                });

                    
            }else
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

function mouseover(filename){
 $("#user-box").css("display","block");
 $("#user-box img").attr("src",base_url + "file/viewImage?fileName=" +  filename + "&isThumbNail=n");
}

function mouseout(){
    $("#user-box").css("display","none");
}

function showModalUploadImage(filename){
    var m=$('#modalWindow');
    
    m.modal("show");
    var img = "<img src='"  + base_url + "file/viewImage?fileName=" +  filename + "'>";
    m.find('.modal-body').html(img); 
}

function closeModalSendEmail(){
    $('#modalSendEmail').modal("hide");
}

$("#btnDelete").click(function(){
    zsi.form.deleteData({
         code       : "adm-0002"
        ,onComplete : function(data){
            displayRecords();
        }
    });   
});      

function setEditedRow(){
    $("input, select").on("change keyup paste", function(){
        $(this).closest(".zRow").find("#is_edited").val("Y");
    });  
    
    $(".zDdlBtn").on("click", function(){
        $(this).closest(".zRow").find("#is_edited").val("Y");
    });
}       