  var editor =null
      responseLoaded = false
  
 ;
$(window).bind('keydown', function(e) {
    var isCtrlS = (e.ctrlKey && e.which == 83);
    if(isCtrlS){
        submit(false);
        e.preventDefault();
        return false;
    }

});

$(document).ready(function(){
    initAceEditor();
});

function initAceEditor(){
    $("#editor").css({height:  400 });
    ace.require("ace/ext/language_tools");
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/html");
    editor.setAutoScrollEditorIntoView(true);

    editor.setOptions({
           enableBasicAutocompletion: true,
           enableSnippets: true,
           enableLiveAutocompletion: false,
           fontSize: "10pt"
    });

}
  
function submit() {
    var _source = editor.getSession().getValue();
    $("#source").val(_source);
    zsi.collectData({
             procedure  : "oracle_compile_scripts_upd"
            ,parameters : {
                 developer    : $("#developer").val() 
                ,source       : $("#source").val() 
                ,server_user  : $("#server_user").val() 
        }
        ,onComplete : function(d) {
              if(d.isSuccess===true) zsi.form.showAlert("alert");      
              responseLoaded=false;
              checkResponse();

        }
    });    

}  

function checkResponse(){
    $.post( execURL + "oracle_compile_scripts_response_sel @developer='" + $("#developer").val()  + "'"
    ,function(data){
        if(data.isSuccess){
            var row = data.rows[0];
            if(row.source==="" && row.response){
                var $r=$("#response");
                var _rc = "response status #" + row.response_counter + "\r\n";
                $r.val(_rc + row.response);
                responseLoaded=true;
            }
        }
        if(!responseLoaded) checkResponse();        
    });
} 