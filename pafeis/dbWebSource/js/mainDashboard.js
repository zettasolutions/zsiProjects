 var bs  = zsi.bs.ctrl
    ,svn =  zsi.setValIfNull
    ,g_user_id = null;

zsi.ready(function(){
    $(".pageTitle").html('<select name="dd_dashboard" id="dd_dashboard" class="hide"> </select>');
    
    getUserInfo(function(){
        $("#dd_dashboard").dataBind({
            url: procURL + "dd_dashboard_sel"
            , text: "page_title"
            , value: "page_name"
            , required :true
            , onComplete: function(data){
                console.log(data);
                if(data.length > 0){
                    $("#dd_dashboard").removeClass("hide");
                    var pageName = $("#dd_dashboard option:selected" ).val();
                    location.replace(base_url + "page/name/" + pageName);
                }
            }
        });
    });
});

function getUserInfo(callBack){
    $.get(procURL + "user_info_sel", function(d) {
        if (d.rows !== null && d.rows.length > 0) {
            g_user_id = d.rows[0].user_id;
        }
        if(callBack) callBack();
    });
}
  