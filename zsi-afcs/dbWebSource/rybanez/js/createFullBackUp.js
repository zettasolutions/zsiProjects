
$("#btnCreateBackup").click(function(){
    
    $.post(app.procURL + "createFullBackup",function(){
        alert("Backup successfully created.");
    });    
}); 