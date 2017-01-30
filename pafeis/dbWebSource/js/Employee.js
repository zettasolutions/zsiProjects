var bs = zsi.bs.ctrl;
var tblName     = "employees";
var svn =  zsi.setValIfNull;
var modalImageEmployee      = "modalWindowImageEmployee";

zsi.ready(function(){
    displayRecords();
    getTemplate();
    markMandatory();
});

$("#btnSave").click(function () {
    if( zsi.form.checkMandatory()!==true) return false;
    $("#grid").jsonSubmit({
             procedure: "employees_upd"
            , optionalItems: ["is_active"]
            , onComplete: function (data) {
                $("#grid").clearGrid();
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                displayRecords();
            }
            
    });
});

function markMandatory(){
    zsi.form.markMandatory({       
      "groupNames":[
            {
                 "names" : ["last_name","first_name"]
                ,"type":"M"
            }             
      ]      
      ,"groupTitles":[ 
             {"titles" :["Last Name","First Name"]}
      ]
   });
}

function displayRecords(){
     var cb = bs({name:"cbFilter1",type:"checkbox"});
     $("#grid").dataBind({
	     url            : execURL + "employees_sel"
	    ,width          : $(document).width() - 35
	    ,height         : 400
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
                { text  : cb, width : 25, style : "text-align:left;"
                    , onRender      :  function(d) {
                        return     bs({name:"user_id",type:"hidden",value: svn (d,"user_id")})
                                 + bs({name:"is_edited",type:"hidden"}) 
                                 +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                    }
                }
                
                , { text : "Image"             , width:45      , style:"text-align:center;"
                    ,onRender : function(d){ 
                        var mouseMoveEvent= "onmouseover='mouseover(\"" +  svn(d,"img_filename") + "\");' onmouseout='mouseout();'";
                        var html = "<a href='javascript:void(0);' " + mouseMoveEvent + " class='btn btn-sm'  onclick='showModalUploadImage(\""+ svn(d,"img_filename") 
                                        +"\");'  ><span class='glyphicon glyphicon-picture'></span> </a>";
                        return (d!==null ? html : "");
                    }
                }
                , {text  : "Id No."             , name  : "id_no"               , type  : "input"        , width : 100          , style : "text-align:left;"}
                , {text  : "Last Name"          , name  : "last_name"           , type  : "input"        , width : 200          , style : "text-align:left;"}
                , {text  : "First Name"         , name  : "first_name"          , type  : "input"        , width : 200          , style : "text-align:left;"}
                , {text  : "Middle Name"        , name  : "middle_name"         , type  : "input"        , width : 200           , style : "text-align:left;"}
                , {text  : "Name Suffix"        , name  : "name_suffix"         , type  : "input"        , width : 100           , style : "text-align:left;"}
                , {text  : "Civil Status"       , name  : "civil_status"        , type  : "select"       , width : 100           , style : "text-align:left;"}
                , {text  : "Contact No."        , name  : "contact_nos"         , type  : "input"        , width : 100          , style : "text-align:left;"}
                , {text  : "Email"              , name  : "email_add"           , type  : "input"        , width : 200          , style : "text-align:left;"}
                , {text  : "Gender"             , width : 80                    , style : "text-align:left;"
                    , onRender : function(d){ 
                        var male_selected = '';
                        var female_selected = '';
                        if (d !== null) {
                            male_selected = (d.gender.toUpperCase().trim() == "M") ? 'selected' : '';
                            female_selected = (d.gender.toUpperCase().trim() == "F") ? 'selected' : '';
                        }
                        return "<select id='gender' class='form-control' name='gender'>" +
                                "<option></option>" +
                                "<option value='M' " + male_selected + ">Male</option>" +
                                "<option value='F' " + female_selected + ">Female</option>" +
                            "</select>";
                    }
                }
                , {text  : "Organization"       , name:"organization_id"        , type  : "select"       , width : 150          , style : "text-align:left;"          }
                //, {text  : "Wing"               , name  : "wing_id"             , type  : "select"       , width : 150          , style : "text-align:left;"}
                , {text  : "Warehouse"          , name  : "warehouse_id"        , type  : "select"       , width : 150          , style : "text-align:left;"  }
                , {text  : "Rank"               , name  : "rank_id"             , type  : "select"       , width : 150          , style : "text-align:left;"}
                , {text  : "Position"           , name  : "position_id"         , type  : "select"       , width : 200         , style : "text-align:left;"}
                , {text  : "Active?"            , name  : "is_active"           , type  : "yesno"        , width : 80           , style : "text-align:left;"   ,defaultValue:"Y"                 }
        		, {text  : "Upload Image"       , width : 100                   , style:"text-align:center;" 
    		    , onRender : function(d){ 
    		        var h = "<a href='javascript:void(0);'  onclick='showModalUploadEmployeeImage(" + svn(d,"user_id") +",\"" 
                               + svn(d,"last_name") + ", " + svn(d,"first_name") + " " + svn(d,"middle_name") + "\");'  ><span class='glyphicon glyphicon-upload' style='font-size:12pt;' ></span> </a>";
    		        return (d!==null ? h : "");
        		}
    		}	 	 	
	    ]   
    	     , onComplete: function(){
    	         $("select, input").on("keyup change", function(){
                    var $zRow = $(this).closest(".zRow");
                    $zRow.find("#is_edited").val("Y");
                });
                $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
                
                $("select[name='organization_id']").each(function(){
                    var $zRow = $(this).closest(".zRow");
                    if(this.hasAttribute("selectedvalue")) {
                        var id = $(this).attr("selectedvalue");
                        $zRow.find("select[name='warehouse_id']").dataBind({
                            url: execURL + "warehouses_sel @squadron_id=" + id
                            , text: "warehouse_location"
                            , value: "warehouse_id"
                        });  
                    }
                 });
                 
                 $("select[name='organization_id']").dataBind({
                    url: procURL + "organizations_dd_sel "
                    , text: "organization_name"
                    , value: "organization_id"
                    , onComplete : function(){
                        $("select[name='organization_id']").change(function(){
                            var $zRow = $(this).closest(".zRow");
                            if(this.value) {
                                $zRow.find("select[name='warehouse_id']").dataBind({
                                    url: execURL + "warehouses_sel @squadron_id=" + this.value
                                    , text: "warehouse_location"
                                    , value: "warehouse_id"
                                });  
                            }else{
                                $zRow.find("select[name='warehouse_id']").empty();
                            }
                        });
                    }
                });  
                
              
                
                $("select[name='rank_id']").dataBind( "rank");
                $("select[name='position_id']").dataBind( "position");
                $("select[name='civil_status']").dataBind( "civil_statuses");
                $("select[name='status_id']").dataBind( "status");
                markMandatory();
        }  
    });    
}
    
$("#btnDelete").click(function(){
    zsi.form.deleteData({
         code       : "sys-0008"
        ,onComplete : function(data){
                        displayRecords();
                      }
    });       
});

function showModalUploadEmployeeImage(UserId, title){
    user_id = UserId;
    var m=$('#' + modalImageEmployee);
    m.find(".modal-title").text("Image for » " + title);
    m.modal("show");
    m.find("form").attr("enctype","multipart/form-data");
    $.get(base_url + 'page/name/tmplImageUpload'
        ,function(data){
            m.find('.modal-body').html(data);
            $("#frm_" + modalImageEmployee).find("#prefixKey").val("user.");
           initChangeEvent();
        }
    ); 
}

function initChangeEvent(){
    $("input[name='file_thumbnail']").change(function(){
        fileNameThumbNail= this.files[0].name;
        var fileSize1 =  this.files[0].size / 1000.00 //to kilobytes
        if(fileSize1 > 100){ 
            alert("Please make sure that file size must not exceed 100 KB.");
            this.value="";
        }
    });
    
    $("input[name='file']").change(function(){
        fileNameOrg=this.files[0].name;
        var fileSize2 =  this.files[0].size / 1000.00 //to kilobytes
        if(fileSize2 > 800){ //1mb
            alert("It is recommended that file size must not exceed 800 KB.");
            this.value="";
        }
    });
}

function getTemplate(){
    $.get(base_url + "templates/bsDialogBox.txt",function(d){
        var template = Handlebars.compile(d);     
        var context = { id:"modalWindow"
                        , title: "Employees"
                        , footer:  ' <div class="pull-left"><button type="button" onclick="submitItems();" class="btn btn-primary"><span class="glyphicon glyphicon-floppy-disk"></span> Save</button></div>'
                        , body:'<div ><div id="' + tblName + '" class="zGrid"></div></div>'
                      };
        
        var html    = template(context);     
        $("body").append(html);
        var contextImageWindow = { 
                          id    : modalImageEmployee
                        , title : "Categories "
                        , footer: '<div class="pull-left"><button type="button" onclick="employeeImageUpload();" class="btn btn-primary"><span class="glyphicon glyphicon-upload"></span> Upload</button>'
                                   + '</div>' 
                    };
        var htmlImageWindow    = template(contextImageWindow);     
        $("body").append(htmlImageWindow);
    }); 
}    

function employeeImageUpload(){
    var frm = $("#frm_" + modalImageEmployee);
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
            if(data.isSuccess) {
                //submit filename to server
                $.get(execURL  + "dbo.image_file_users_upd @user_id=" + user_id
                                + ",@img_filename='user." +  fileOrg.files[0].name + "'"
                ,function(data){
                    zsi.form.showAlert("alert");
                    $('#' + modalImageEmployee).modal('toggle');
                    //refresh latest records:
                    displayRecords("");
                });

                    
            } else {
                alert(data.errMsg);
            }
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

function showModalUploadImage(filename){
        var m=$('#modalWindow');
        m.modal("show");
        var img = "<img src='"  + base_url + "file/viewImage?fileName=" +  filename + "'>";
        m.find('.modal-body').html(img); 
}

function mouseover(fileName){
 $("#user-box").css("display","block");
 var $img = $("#user-box img");
 $img.attr("src",base_url + "file/viewImage?fileName=" +  fileName + "&isThumbNail=n");
 
 if(fileName!=="") 
    $img.attr("style","margin-left:0px;");
else
    $img.attr("style","margin-left:-106px;");
}

function mouseout(){
    $("#user-box").css("display","none");
}                          