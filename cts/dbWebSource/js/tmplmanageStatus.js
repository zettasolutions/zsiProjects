zsi.ready(function(){
    if (gUser.is_admin === "Y") {
        $("#button-div").html(' <button type="button" class="col-12 col-md-auto btn btn-primary btn-sm" id="btnSave"><span class="fa fa-save"></span> Save</button>' );
    }
    
    displayStatuses();
    function displayStatuses(){   
        /* The JSON keys must be in the same order in TT */
        var _$grid = $("#grid-manage-status");
        _$grid.dataBind({
             url            : procURL + 'statuses_sel'
            ,blankRowsLimit : 10
            ,width          : $("#main-content").width() - 40
            ,height         : $("#main-content").height() - 150
            ,dataRows       : [
                                { text : 'Seq No.' , width : 70 , style : 'text-align:center;' 
                                    , onRender : function(d) {
                                        return    bs({ name : "status_id"   , type : "hidden"   , value : svn (d,"status_id") })
                                                + bs({ name : "is_edited"   , type : "hidden" })
                                                + bs({ name : "is_edit"     , type : "hidden"   , value : svn (d,"is_edit") })
                                                + bs({ name : "seq_no"      , type : "input"    , value : svn (d,"seq_no") });
                                    }
                                }
                                ,{ text : 'Code'        , name : 'status_code'  , width : 200 , type : 'input' , style : 'text-align:left;' }
                                ,{ text : 'Name'        , name : 'status_name'  , width : 200 , type : 'input' , style : 'text-align:left;' }
                                ,{ text : 'Color'       , name : 'status_color' , width : 200 , type : 'input' , style : 'text-align:left;' }
                                ,{ text : 'Icon'        , name : 'icon'         , width : 100 , type : 'input' , style : 'text-align:left;' }
                                ,{ text : 'Is Active?'  , name : 'is_active'    , width : 200 , type : 'yesno' , style : 'text-align:left;' , defaultValue : 'Y' }
                              ]
        });
    
        $("#menu-content-status").off('click', '#btnSave').on('click', '#btnSave', function() {
            _$grid.jsonSubmit({
                 procedure  : "statuses_upd"
                ,onComplete : function(data) {
                    if (data.isSuccess === true) zsi.form.showAlert("savedWindow");
                    displayStatuses();
                }
            });
        });
    }
});