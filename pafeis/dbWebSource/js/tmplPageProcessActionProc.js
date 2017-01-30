function initPageProcessActionProcTemplate(page_id){
    g_page_id = page_id;
    displayPageProcessActionProcRecords(page_id);
}

$("#ppapBtnSave").click(function () {
   $("#pageProcessActionProcGrid").jsonSubmit({
            procedure: "page_process_action_procs_upd"
            , optionalItems: ["page_id"]
            , onComplete: function (data) {
                $("#pageProcessActionProcGrid").clearGrid();
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                displayPageProcessActionProcRecords(g_page_id);
            }
    });
});
    
function displayPageProcessActionProcRecords(id){
     var cb = bs({name:"cbFilter4",type:"checkbox"});
     $("#pageProcessActionProcGrid").dataBind({
	     url            : execURL + "page_process_action_procs_sel @page_process_action_id=" + id
	     //,optionalItems: ["class_container"]
	    ,width          : 550
	    //,height         : $(document).height() - 250
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
                 {text  : cb                                                           , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"page_process_action_proc_id",type:"hidden",value: svn (d,"page_process_action_proc_id")})
                		                        + bs({name:"page_process_action_id",type:"hidden",value: id})
                                                +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
            }	 
                ,{text  : "Sequence No."            , name  : "seq_no"              , type  : "input"       , width : 100       , style : "text-align:left;"}
        		,{text  : "Procedure Name"          , name  : "proc_name"           , type  : "input"       , width : 200       , style : "text-align:left;"}
        		,{text  : "Class Container"         , name  : "class_container"     , type  : "select"      , width : 200       , style : "text-align:left;"
        		    , onRender : function(d){ 
                        var list_selected = '';
                        var header_selected = '';
                        var detail_selected = '';
                        if (d !== null) {
                            list_selected = (d.class_container.trim() == "list") ? 'selected' : '';
                            header_selected = (d.class_container.trim() == "header") ? 'selected' : '';
                            detail_selected = (d.class_container.trim() == "detail") ? 'selected' : '';
                        }
                    
                        return "<select id='class_container' class='form-control' name='class_container'>" +
                                "<option></option>" +
                                "<option value='list' " + list_selected  + ">List</option>" +
                                "<option value='header' " + header_selected + ">Header</option>" +
                                "<option value='detail' " + detail_selected + ">Detail</option>" +
                            "</select>";
                        
                        
                    }
        		}
	    ]   
    	     ,onComplete: function(){
                $("#cbFilter4").setCheckEvent("#pageProcessActionGrid input[name='cb']");
        }  
    });    
}
   

$("#ppapBtnDelete").click(function(){
    zsi.form.deleteData({
         code       : "sys-0005"
        ,onComplete : function(data){
                        displayPageProcessActionProcRecords(g_page_id);
                      }
    });       
});


              