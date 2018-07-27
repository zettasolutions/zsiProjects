zsi.ready(function(){
    displayApplicationRecords();
    markMandatory();
    
    if (gUser.is_admin === "Y") {
        $("#button-div").html('<button type="button" class="btn btn-primary btn-sm col-12 col-md-auto mb-1 mb-md-0" id="btnSave"><i class="fa fa-save"></i> Save</button> <button type="button" class="btn btn-primary btn-sm col-12 col-md-auto" id="btnDelete"><i class="fa fa-trash-alt"></i> Delete</button>' );
    }
    
    function displayApplicationRecords() {
        var cb = bs({name:"cbFilter1",type:"checkbox"});
        $("#grid").dataBind({
             url            : procURL + "applications_sel"
            ,width          : $("#main-content").width() - 40
            ,height         : $("#main-content").height() - 150
            ,selectorType   : "checkbox"
            ,blankRowsLimit : 5
            ,dataRows : [
                { text  : cb        , width : 25        , style : "text-align:left;"
            	    ,onRender : function(d) {
                        return      bs({name:"app_id",type:"hidden",value: svn (d,"app_id")})
                                  + bs({name:"is_edited",type:"hidden"})
                                  + (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                    }
                }
            	,{ text  : "Application Name"                , name  : "app_name"     , type  : "input"         , width : 250       , style : "text-align:left;" }
            	,{ text  : "Application Description"         , name  : "app_desc"     , type  : "input"         , width : 450       , style : "text-align:left;" }
            	,{ text  : "Active?"                         , name  : "is_active"    , type  : "yesno"         , width:75          , style : "text-align:left;"   ,defaultValue:"Y"                 }
            ]
            ,onComplete: function(){
                markMandatory();
                $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
            }
        });
    }
    
    function markMandatory(){
        zsi.form.markMandatory({       
            "groupNames":[
                {
                    "names" : ["app_name","app_desc"]
                    ,"type":"M"
                }
            ]      
            ,"groupTitles":[ 
                {"titles" : ["Application Name","Application Description"]}
            ]
        });
    }
    
     $("#btnSave").click(function () {
        if( zsi.form.checkMandatory()!==true) return false; 
        $("#grid").jsonSubmit({
                 procedure: "applications_upd"
                , optionalItems: ["is_active"]
                , onComplete: function (data) {
                    $("#grid").clearGrid();
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    displayApplicationRecords();
                }
        });
    });
    
    $("#btnDelete").click(function(){
        zsi.form.deleteData({
             code       : "ref-0005"
            ,onComplete : function(data){
                            displayApplicationRecords();
                        }
        });      
    });
});