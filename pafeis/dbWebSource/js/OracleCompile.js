  var editor =null;
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
    $("#source").val(editor.getSession().getValue());
       $.post( execURL + "oracle_compile_scripts_upd"
        + " @developer='" + $("#developer").val()  + "'"
        + ",@source='"   +$("#source").val() + "'"
        + ",@server_user='"   +$("#server_user").val() + "'"
        ,function(data){
              if(data.isSuccess===true) zsi.form.showAlert("alert");      
              
        }
    );

}