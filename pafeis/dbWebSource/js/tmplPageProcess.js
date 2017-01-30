function initPageProcessTemplate(page_id){
    g_page_id = page_id;
    displayPageProcessRecords(page_id);
}

$("#ppBtnSave").click(function () {
   $("#pageProcessGrid").jsonSubmit({
            procedure: "page_processes_upd"
            , optionalItems: ["page_id", "is_active", "is_default"]
            , onComplete: function (data) {
                $("#pageProcessGrid").clearGrid();
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                displayPageProcessRecords(g_page_id);
            }
    });
});

    
function displayPageProcessRecords(id){
     var cb = bs({name:"cbFilter2",type:"checkbox"});
     $("#pageProcessGrid").dataBind({
	     url            : execURL + "page_processes_sel @page_id=" + id
	    ,width          : 850
	    ,height         : $(document).height() - 250
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
                 {text  : cb                                                           , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"page_process_id",type:"hidden",value: svn (d,"page_process_id")})
                		                        + bs({name:"page_id",type:"hidden",value: id})
                                                +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
            }	 
        		,{text  : "Sequence No."        , name  : "seq_no"              , type  : "input"       , width : 150       , style : "text-align:left;"}
        		,{text  : "Description"         , name  : "process_desc"        , type  : "input"       , width : 200       , style : "text-align:left;"}
        		,{text  : "Role"                , name  : "role_id"             , type  : "select"      , width : 200       , style : "text-align:left;"}
        		,{text  : "Active?"             , name  : "is_active"           , type  : "yesno"       , width : 80        , style : "text-align:left;"}
        		,{text  : "Default?"            , name  : "is_default"          , type  : "yesno"       , width : 80        , style : "text-align:left;"}
        		,{text  : "Action"              , width : 80                    , style : "text-align:center;"      
        		    ,onRender  : 
                        function(d){return "<a href='javascript:showModalPageProcessAction(" + svn(d,"page_process_id") + ",\"" +  svn(d,"process_desc")  + "\"," +  svn(d,"page_id") + ");'>" 
                        + svn(d,"countPageProcessActions") + "</a>"; 
                    }
                }
	    ]   
    	     ,onComplete: function(){
                $("#cbFilter2").setCheckEvent("#pageProcessGrid input[name='cb']");
                $("select[name='role_id']").dataBind("roles");
                markMandatory();
        }  
    });    
}
   

$("#ppBtnDelete").click(function(){
    zsi.form.deleteData({
         code       : "sys-0003"
        ,onComplete : function(data){
                        displayPageProcessRecords(g_page_id);
                      }
    });       
});

function showModalPageProcessAction(id, title, page_id){
    $("body").append(tmplDialog(contextModalProcessAction));
    page_process_id = id;
    var m = $("#" + modalProcessAction);
    $("#" + modalProcessAction + " .modal-title").text("Process Action for » " + title);
    m.modal("show");
    m.find('.modal-body').html(tmplPageProcessAction);
    initPageProcessActionTemplate(page_process_id, page_id);
} 

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
