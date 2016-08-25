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
        ,displayNames : ["Corplear Logon"]  
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

$("#btnNactive").click(function () {
    
    //$('#modalWindow').modal("show");
     $(".modal-title").text("Inactive Users");
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
            { text:"Corplear logon "   , width:220    , style:"text-align:center;"   
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
    var cb = bs({name:"cbFilter1",type:"checkbox"});
    
    
    $("#grid").dataBind({
	     url   : procURL + "users_sel @filter_user_id=" + user_id
        ,width          : $(document).width()-40
	    ,height         : 619
	    ,selectorType   : "checkbox"
        ,blankRowsLimit :2
        ,isPaging : true
        ,dataRows       :[
     		 { text: cb                 , width:25      , style:"text-align:left;"        
     		     ,onRender : function(d){
                                return     bs({name:"user_id",type:"hidden",value: svn(d,"user_id")})
                                        +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }             
     		 }	 
    		,{ text:"image"             , width:45      , style:"text-align:center;" 
    		    ,onRender : function(d){ 
                        var mouseMoveEvent= "onmouseover='mouseover(\"" +  svn(d,"img_filename") + "\");' onmouseout='mouseout();'";
                          return "<a href='javascript:void(0);' " + mouseMoveEvent + " class='btn btn-sm'  onclick='showModalUploadImage(\""+ svn(d,"img_filename") 
                                +"\");'  ><span class='glyphicon glyphicon-picture'></span> </a>";
                          }
    		}	 
    		,{ text:"Corplear logon"    , width:120     , style:"text-align:center;"      ,type:"input"      ,name:"logon"        ,                                 }	 
    		,{ text:"Last Name"         , width:90      , style:"text-align:left;"        ,type:"input"      ,name:"last_name"    ,sortColNo:2                      }	 	 
    		,{ text:"First Name"        , width:90      , style:"text-align:left;"        ,type:"input"      ,name:"first_name"   ,sortColNo:3                      }	 	 
    		,{ text:"M.I."              , width:40      , style:"text-align:left;"        ,type:"input"      ,name:"middle_ini"   ,sortColNo:4                      }	 
    		,{ text:"Requestor?"        , width:100     , style:"text-align:right;"       ,type:"yesno"      ,name:"is_requestor" ,defaultValue:"Y"   , sortColNo:5 }	 	 
    		,{ text:"Plant Id"          , width:120     , style:"text-align:center;"      ,type:"select"     ,name:"plant_id"     ,sortColNo:6                      }	 	 
    		,{ text:"Role Id"           , width:100     , style:"text-align:left;"        ,type:"select"     ,name:"role_id"      ,                                 }	 	 
    		,{ text:"Position"          , width:125     , style:"text-align:center;"      ,type:"input"      ,name:"position"     ,                                 }	 	 
		    ,{ text:"Contact No."       , width:120     , style:"text-align:center;"      ,type:"input"      ,name:"contact_nos"  ,                                 }	     		
    		,{ text:"Contact?"          , width:70      , style:"text-align:left;"        ,type:"yesno"      ,name:"is_contact"   ,defaultValue:"Y"                 }	 	 
    		,{ text:"Active?"           , width:55      , style:"text-align:left;"        ,type:"yesno"      ,name:"is_active"    ,defaultValue:"Y"                 }
    		,{ text:"Upload Image"      , width:100     , style:"text-align:center;" 
    		    ,onRender : function(d){ return "<a href='javascript:void(0);'  onclick='showModalUploadUserImage(" + svn(d,"user_id") +",\"" 
    		                                   + svn(d,"user_name") + "\");'  ><span class='glyphicon glyphicon-upload' style='font-size:12pt;' ></span> </a>"; }
    		}	 	 	
	    ]

         ,onComplete: function(){
            $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
            
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

$("#btnDelete").click(function(){
    zsi.form.deleteData({
         code       : "adm-0002"
        ,onComplete : function(data){
                        displayRecords("");
                      }
    });   

}); 
  