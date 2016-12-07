 var bs = zsi.bs.ctrl;
var tblName     = "tblusers";
var svn =  zsi.setValIfNull;
var modalImageUser      = "modalWindowImageUser";

zsi.ready(function(){
      $(".zPanel").css({
            height:$(window).height()-210
        });     
    setInputs();
    setSearch();
    displayRecords(logon_id_filter.val());
    getTemplate();
});
function markUserMandatory(){
    zsi.form.markMandatory({       
      "groupNames":[
            {
                 "names" : ["logon","last_name","first_name"]
                ,"type":"M"
            }             
          
      ]      
      ,"groupTitles":[ 
             {"titles" : ["Logon","Last Name","First Name"]}
      ]
    });    
}
function setSearch(){
    var ofilterId =  $("#logon_id_filter");
    
    new zsi.search({
        tableCode: "adm-0002"
        ,colNames : ["logon"] 
        ,displayNames : ["Logon"]  
        ,searchColumn :"logon"
        ,input:"input[name=logon_name_filter]"
        ,url : execURL + "searchData"
        ,condition :"'is_active=''Y'''"
        ,onSelectedItem: function(currentObject,data,i){ 
            currentObject.value=data.logon;
            var tr  = currentObject.parentNode.parentNode;
            $(tr).find("#logon_id_filter").val(data.user_id);
            displayRecords( data.user_id);
        }
       ,onChange:function(text){
          if(text===""){ 
              ofilterId.val("");
              displayRecords("");
          }
  
       }
       
    });        
}
function setInputs(){
    logon_id_filter = $("#logon_id_filter");
}   
$("#btnSave").click(function () {
    if( zsi.form.checkMandatory()!==true) return false;
    
    $("#frm").jsonSubmit({
             procedure  : "users_upd"
             ,optionalItems: ["is_active"]
            ,onComplete : function (data) {
                 if(data.isSuccess===true) zsi.form.showAlert("alert");
                 displayRecords( $("#logon_id_filter").val());
            }
    });
     
});

function clearGrid(){
    $("#" + tblName).clearGrid();
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
function submitItems(){    
  $("#frm_modalWindow").jsonSubmit({
             procedure  : "users_upd"
             ,optionalItems: ["is_active"]
            ,onComplete : function (data) {
                 if(data.isSuccess===true) zsi.form.showAlert("alert");
                 displayRecords($("#logon_id_filter").val());
                 displayInactiveUsers();
            }
    });    
}

function getTemplate(){
    $.get(base_url + "templates/bsDialogBox.txt",function(d){
        var template = Handlebars.compile(d);     
                        
        var context = { id:"modalWindow"
                       
                        , title: "Users"
                        , footer:  ' <div class="pull-left"><button type="button" onclick="submitItems();" class="btn btn-primary"><span class="glyphicon glyphicon-floppy-disk"></span> Save</button></div>'
                        , body:'<div ><div id="' + tblName + '" class="zGrid"></div></div>'
                      };
        
        var html    = template(context);     
        $("body").append(html);
        
        var contextImageWindow = { 
                          id    : modalImageUser
                        , title : "Categories "
                        , footer: '<div class="pull-left"><button type="button" onclick="userImageUpload();" class="btn btn-primary"><span class="glyphicon glyphicon-upload"></span> Upload</button>'
                                   + '</div>' 
                    };
        
        var htmlImageWindow    = template(contextImageWindow);     
        $("body").append(htmlImageWindow);
        
    });    
}
//modal window//
function displayInactiveUsers(){   
    $("#" + tblName).dataBind({
        url   : procURL + "users_sel @is_active='N'" 
        ,width          : 551
	    ,height         : 400
        ,dataRows       :[
            { text:"Logon "   , width:220    , style:"text-align:center;"   
                 ,onRender : function(d){
                                return     bs({name:"user_id"       ,type:"hidden"  ,value: d.user_id})
                                         + bs({name:"logon"         ,type:"hidden"  ,value: d.logon}) 
                                         + bs({name:"last_name"     ,type:"hidden"  ,value: d.last_name}) 
                                         + bs({name:"first_name"    ,type:"hidden"  ,value: d.first_name}) 
                                         + bs({name:"middle_ini"    ,type:"hidden"  ,value: d.middle_ini})
                                         + bs({name:"is_requestor"  ,type:"hidden"  ,value: d.is_active})
                                         + bs({name:"plant_id"      ,type:"hidden"  ,value: d.plant_id})
                                         + bs({name:"role_id"       ,type:"hidden"  ,value: d.role_id})   
                                         + bs({name:"position"      ,type:"hidden"  ,value: d.position})
                                         + bs({name:"contact_nos"   ,type:"hidden"  ,value: d.contact_nos})
                                         + bs({name:"is_contact"    ,type:"hidden"  ,value: d.is_contact})  
                                         + d.logon;                          
                                
                            }             
             }	 
    		,{ text:"Users "            , width:230    , style:"text-align:center;"
                ,onRender : function(d){ return d.user_name; }
    		}	 
    		,{ text:"Active?"           , width:80     , style:"text-align:center;"   ,type:"yesno"   ,name:"is_active"   ,defaultValue:"Y" }	 
    	
            ]

    });  
}

function displayRecords(user_id){   
    var rownum=0;
    $("#grid").dataBind({
	     url   : procURL + "users2_sel @filter_user_id=" + user_id
        ,width          : '990'
	    ,height         : '400'
	    ,selectorType   : "checkbox"
        ,blankRowsLimit :5
        ,isPaging : true
        ,dataRows       :[
     		 { text:"User"          , width:270     , style:"text-align:center;"      ,type:"select"     ,name:"user_id"    }	 
    		,{ text:"Role"          , width:150     , style:"text-align:left;"        ,type:"select"     ,name:"role_id"    }
    		,{ text:"Logon"          , width:100     , style:"text-align:left;"
    		    ,onRender: function(d){
    		        return "<input type='hidden' name='password' value='" + svn(d, "password") + "'>" + svn(d, "logon");
    		    }
    		}
    		,{ text:"Rank"          , width:130     , style:"text-align:left;"
    		    ,onRender: function(d){
    		        return svn(d, "rankDesc");
    		    }
    		}
    		,{ text:"Position"      , width:150     , style:"text-align:left;"
    		    ,onRender: function(d){
    		        return svn(d, "position");
    		    }
    		}
    		,{ text:"Organization"  , width:150     , style:"text-align:left;"
    		    ,onRender: function(d){
    		        return svn(d, "organizationName");
    		    }
    		}
	    ]

        ,onComplete: function(){
           
            $("select[name='user_id']").dataBind({
                  url: base_url + "selectoption/code/notUsers"
                , isUniqueOptions:true
                , onComplete: function(){
                    $("select[name='user_id']").setUniqueOptions();
                }
            });  
            
             $("select[name='user_id']").change(function(){
                var o = $(this);
                var selVal =o.attr("selectedvalue");
                var zRow = o.parent().parent();
               
                if(typeof selVal==ud){
                    $.get(execURL + "select dbo.createUserLogon(" + o.val() + ") as username",function(data){
                        $.get(base_url + "account/getnewpassword?pwd=" +   data.rows[0].username,function(data){
                            zRow.find("[name='password']").val(data);
                        });
                   });
                }
             });

            $("select[name='plant_id']").dataBind( "plants");
            $("select[name='role_id']").dataBind({
                url:  getOptionsURL("roles")
                ,onComplete:function(){
                    $("select[name='role_id']").change();
                }
            });
            markUserMandatory();
            $(".no-data input[name='logon']").checkValueExists({code:"adm-0002",colName:"logon"});
     
        }
        /*
        ,onSortClick : function(colNo,orderNo){
            console.log(colNo);
            console.log(orderNo);
        }
        */
        
    });    
}

function setToNullIfChecked(id){
    $("#" + tblName + " input[name='cb']").change(function(){
            var td  = this.parentNode;
            var p_user_id = $(td).find("#user_id");
            if(this.checked) 
                p_user_id.val(id);
            else
                p_user_id.val('');
    });
}

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
                $.get(execURL  + "dbo.image_file_users_upd @user_id=" + user_id
                                + ",@img_filename='user." +  fileOrg.files[0].name + "'"
                ,function(data){
                    zsi.form.showAlert("alert");
                    //$("#userImgBox").attr("src",  base_url + "file/viewImage?fileName=user." + fileOrg.files[0].name + "&isthumbnail=n" );
                    $('#' + modalImageUser).modal('toggle');
                    
                    //refresh latest records:
                    displayRecords("");
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

function showModalUploadImage(filename){

        var m=$('#modalWindow');
        
        m.modal("show");
        var img = "<img src='"  + base_url + "file/viewImage?fileName=" +  filename + "'>";
        m.find('.modal-body').html(img); 
}

                 