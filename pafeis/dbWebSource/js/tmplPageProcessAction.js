var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;
var g_page_process_id;
var g_page_id;
var modalProcessActionProc = "modalWindowProcessActionProc";

zsi.ready(function(){
    getTemplate();
});

var contextModalProcessActionProc = { id : modalProcessActionProc
    , sizeAttr: "pageProcessActionProcWidth"
};

function getTemplate(callback){
    $.get(base_url + "templates/bsDialogBox.txt",function(d){
        var template = Handlebars.compile(d); 
        $("body").append(template(contextModalProcessActionProc));
        if(callback) callback();
    });    
}  

function initPageProcessActionTemplate(page_process_id, page_id){
    g_page_process_id = page_process_id;
    g_page_id = page_id;
    displayPageProcessActionRecords(page_process_id);
}

$("#ppaBtnSave").click(function () {
   $("#pageProcessActionGrid").jsonSubmit({
            procedure: "page_process_actions_upd"
            , optionalItems: ["page_process_id", "status_id", "next_process_id","is_end_process"]
            , onComplete: function (data) {
                $("#pageProcessActionGrid").clearGrid();
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                displayPageProcessActionRecords(g_page_process_id);
            }
    });
});

    
function displayPageProcessActionRecords(id){
     var cb = bs({ name: "cbFilter3", type: "checkbox" });
     $("#pageProcessActionGrid").dataBind({
	     url            : execURL + "page_process_actions_sel @page_process_id=" + id
	    ,width          : 750
	    //,height         : $(document).height() - 250
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
                 {text  : cb                                                           , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"page_process_action_id",type:"hidden",value: svn (d,"page_process_action_id")})
                		                             + bs({name:"page_process_id",type:"hidden",value: id})
                                                     + (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
            }	 
                ,{text  : "Sequence No."            , name  : "seq_no"              , type  : "input"       , width : 100       , style : "text-align:left;"}
        		,{text  : "Action Description"      , name  : "action_desc"         , type  : "input"       , width : 200       , style : "text-align:left;"}
        		,{text  : "Status"                  , name  : "status_id"           , type  : "select"      , width : 100       , style : "text-align:left;"   ,defaultValue:"Y"                 }
        		,{text  : "Next Process"            , name  : "next_process_id"     , type  : "select"      , width : 200       , style : "text-align:left;"}
        		,{text  : "End Process?"            , name  : "is_end_process"      , type  : "yesno"       , width :100        , style : "text-align:left;"}
        		,{text  : "Procedure"               , width : 80                    , style : "text-align:center;"      
        		    ,onRender  : 
                        function(d){return "<a href='javascript:showModalPageProcessActionProc(" + svn(d,"page_process_action_id") + ",\"" +  svn(d,"action_desc")  + "\");'>" 
                        + svn(d,"countPageProcessActionProcs") + "</a>"; 
                    }
                }
	    ]   
    	     ,onComplete: function(data){
                $("#cbFilter3").setCheckEvent("#pageProcessActionGrid input[name='cb']");
                $("select[name='status_id']").dataBind( "status");
                $("select[name='next_process_id']").dataBind({
                    url: procURL + "page_process_action_next_sel @page_id=" 
                        + g_page_id + ",@page_process_id=" + g_page_process_id
                    , text: "process_desc"
                    , value: "page_process_id"
                });  
        }  
    });    
}
   

$("#ppaBtnDelete").click(function(){
    zsi.form.deleteData({
         code       : "sys-0004"
        ,onComplete : function(data){
                        displayPageProcessActionRecords(g_page_process_id);
                      }
    });       
});

function showModalPageProcessActionProc(id, title){
    page_id = id;
    var m = $("#" + modalProcessActionProc);
    $("#" + modalProcessActionProc + " .modal-title").text("Procedure for » " + title);
    m.modal("show");

    $.get(base_url + 'page/name/tmplPageProcessActionProc'
        , function(data){
            m.find('.modal-body').html(data);
            initPageProcessActionProcTemplate(page_id);
       }
    );  
} 
        