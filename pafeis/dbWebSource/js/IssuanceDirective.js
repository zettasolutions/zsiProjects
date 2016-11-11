 var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;
var tblIDdetails     = "tableIDdetails";

zsi.ready(function(){
    displayRecords();
    getTemplate();
});
$("#btnSave").click(function () {
    //console.log("test");
   $("#grid").jsonSubmit({
             procedure: "issuance_directive_upd"
            //,optionalItems: ["is_active"] 
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
        
        var contextIDdetails = { id:"modalWindowIDdetails"
                        , title: "Issuance Directive Details"
                        , sizeAttr: "fullWidth"
                        , footer: '<div class="pull-left"><button type="button" onclick="submitItemsIDdetails();" class="btn btn-primary">'
                        + '<span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Save</button>'
                                + '<button type="button" onclick="manageSquadronInactive();" class="btn btn-primary"><span class="glyphicon glyphicon-ban-circle">'
                                + '</span>&nbsp;Inactive</button>'
                                //+ '<button type="button" onclick="NewSpecsProperty();" class="btn btn-primary btn-sm" id="btnNew"><span class="glyphicon glyphicon-plus"></span> New</button>'  

                        , body:            
                        '<div id="' + tblIDdetails + '" class="zGrid"></div>'
                             
        };
        html= template(contextIDdetails);     
        $("body").append(html);
    });    
} 

function manageItemIDdetails(id,name){
         issuance_directive_id=id;
         issuance_directive_no=name;
         displayRecordsSquadron(id);
         $("#modalWindowIDdetailsLabel .modal-title").text("Issuance Directive for » " + name);
         $('#modalWindowIDdetails').modal({ show: true, keyboard: false, backdrop: 'static' });
         $('#modalWindowIDdetails');//.setCloseModalConfirm();
        // $("#modalWindowSquadron .modal-body").css("height","450px");
}

function displayRecords(){
     var cb = bs({name:"cbFilter1",type:"checkbox"});
     $("#grid").dataBind({
	     url            : execURL + "issuance_directive_sel"
	    ,width          : $(document).width() - 35
	    ,height         : $(document).height() - 250
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
                 {text  : cb                                                           , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"issuance_directive_id",type:"hidden",value: svn (d,"issuance_directive_id")})
                                                      +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
                 }	 
        		,{text  : "Issuance No."                    , name  : "issuance_directive_no"               , type  : "input"           , width : 100       , style : "text-align:left;"}
        		,{text  : "Issued From"                     , name  : "issued_directive_from_id"            , type  : "select"          , width : 100       , style : "text-align:left;"}
        		,{text  : "Issued To"                       , name  : "issued_directive_to_id"              , type  : "select"          , width : 130       , style : "text-align:left;"}
        		,{text  : "Upload Ref."                     , name  : "attached_filename"                   , type  : "input"           , width : 150       , style : "text-align:left;"}
        		,{text  : "Process"                         , width : 200       , style : "text-align:left;"
        		        ,onRender   : function(d){ return bs({name:"process_id",type:"select",value: svn(d,"process_id")})
                                   + bs({name:"action_id",type:"hidden", value: svn (d,"action_id")});
                        }  
        		}
        		,{text  : "Details"      , width : 70                                     , style : "text-align:center;"      
        		    ,onRender  : 
                        function(d){return "<a href='javascript:manageItemIDdetails(" + svn(d,"issuance_directive_id") + ",\"" +  svn(d,"issuance_directive_no")  + "\");'>" 
                        + svn(d,"countIssuanceDirectiveDetail") + "</a>"; 
                    }
                }
	    ]
    	     ,onComplete: function(){
                $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
                //$("select[name='squadron_id']").dataBind( "squadron");
                
        }  
    });    
}
function displayRecordsIDdetails(id){
    //alert(id);
     var cb = bs({name:"cbFilterIDdetails",type:"checkbox"});
     $("#" + tblIDdetails).dataBind({
	     url            : execURL + "issuance_directive_detail_sel " + id
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
        		,{text  : "Active?"             , name  : "is_active"                   , type  : "yesno"         , width : 55        , style : "text-align:left;"   ,defaultValue:"Y"                 }	    ]
    	     ,onComplete: function(){
                $("#cbFilterIDdetails").setCheckEvent("#" + tblIDdetails + " input[name='cb']");
                //$("select[name='squadron_commander_id']").dataBind( "employee");
                //$("select[name='squadron_type_id']").dataBind( "squadronTypes");
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