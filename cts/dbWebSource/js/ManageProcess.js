zsi.ready(function(){
    var  _gridWidth =  $("#main-content").width() - 40
        ,_gridHeight = $("#main-content").height() - 150
        ,_$mcProcess = $("#menu-content-process")
        ,_$mcProcessStatuses = $("#menu-content-processstatuses").hide()    
    ;
    
    if (gUser.is_admin === "Y") {
        $("#button-div1, #button-div2").html('<button type="button" class="col-12 col-md-auto btn btn-primary btn-sm" id="btnSave"><span class="fa fa-save"></span> Save</button>');
    }
    
    displayProcesses();
    
    function displayProcesses() {
        /*Enting - Please don't move this outside from function to prevent variable collision*/
        	/* The JSON keys must be in the same order in TT */
            var _$grid = $("#grid-manage-process");
        	_$grid.dataBind({
        		url 			: procURL + 'processes_sel'
        		,blankRowsLimit : 10
        		,width 			: _gridWidth
        		,height 		: _gridHeight
        		,dataRows 		: [
        							{ text : 'Seq #' , width : 50 , style : 'text-align:center;' 
        								, onRender : function(d) {
        				                    return 	bs({ name : "process_id" , type : "hidden" , value : svn(d,"process_id") })
        				                    		+ bs({ name : "is_edited" , type : "hidden" })
        				                    		+ bs({ name : "seq_no" , type : "input" , value : svn(d,"seq_no") });
        				                }
        							}
        							,{ text : 'Title' , name : 'process_title' , width : 200 , type : 'input' , style : 'text-align:left;' }
        							,{ text : 'Icon' , name : 'icon' , width : 70 , type : 'input' , style : 'text-align:left;' }
        							,{ text : 'Description' , name : 'process_desc' , type : 'input' , width : 200 , style : 'text-align:left;' }
        							,{ text : 'Category' , name : 'category_id' , type : 'select' , width : 100 , style : 'text-align:left;' }
        							,{ text : 'Type' , name : 'type_id' , type : 'select' , width : 100 , style : 'text-align:left;' }
        							,{ text : 'Is Active?' , name : 'is_active' , type : 'yesno' , width : 100 , style : 'text-align:left;' , defaultValue : 'Y' }
                                    ,{ text : 'Actions' , width : 100 , style : 'text-align:center;'
                                        ,onRender : function(d) {
                                            return (d !== null && svn(d,"process_id") !== '' ? '<div class="add-status">'+ d.countProcessStatuses +'</div>' : '');
                                        }
                                    }
        						  ]
        		,onComplete : function(o) {
                    _$grid.off('click', '.add-status').on('click', '.add-status', function() {
                        var _$self = $(this);
                        var _rowData = o.data.rows[_$self.closest('.zRow').index()];
                        displayProcessStatuses(_rowData);
                    });
                    
                    $(this).find('.add-status').css({'cursor': 'pointer'});
        		}
        	});
        
            _$mcProcess.off('click', '#btnSave').on('click', '#btnSave', function() {
                _$grid.jsonSubmit({
                     procedure  : "processes_upd"
                    ,onComplete : function(data) {
                        if (data.isSuccess === true) zsi.form.showAlert("savedWindow");
                        displayProcesses();
                    }
                });
            });
        }
        
    function displayProcessStatuses(rowData) {
        _$mcProcess.hide();
        _$mcProcessStatuses.show();
        $("#processTitle").text(rowData.process_title);
    
        /* The JSON keys must be in the same order in TT */
        var _$grid = $("#grid-manage-processstatuses");
        _$grid.dataBind({
            url             : procURL + 'process_statuses_sel @process_id=' + rowData.process_id
            ,blankRowsLimit : 10
            ,width          : _gridWidth
            ,height         : _gridHeight - 100
            ,dataRows       : [
                                { text : 'Seq #' , width : 50 , style : 'text-align:center;' 
                                    , onRender : function(d) {
                                        return  bs({ name : "process_status_id" , type : "hidden" , value : svn (d,"process_status_id") })
                                                + bs({ name : "process_id" , type : "hidden" , value : svn (d,"process_id") })
                                                + bs({ name : "is_edited" , type : "hidden" })
                                                + bs({ name : "seq_no" , type : "input" , value : svn (d,"seq_no") });
                                    }
                                }
                                ,{ text : "Status" , name : "status_id" , width:150 , type:"select" , style:"text-align:left;" }
                                ,{ text : 'Button Text' , name : 'button_text' , width : 100 , type : 'input' , style : 'text-align:left;' }
                                ,{ text : 'Next Process' , name : 'next_process_id' , width : 150 , type : 'select' , style : 'text-align:left;' }
                                ,{ text : 'Is Active' , name : 'is_active' , type : 'yesno' , width : 100 , style : 'text-align:left;' , defaultValue : 'Y' }
                              ]
            ,onComplete : function() {
                _$grid.find("select[name='status_id']").dataBind({
                    url: getOptionsURL("status")
                });
                _$grid.find("select[name='next_process_id']").dataBind({
                    url: getOptionsURL("process")
                });
                _$grid.find("input[name='process_id']").val(rowData.process_id);
            }
        });
    
        _$mcProcessStatuses.off('click', '#btnBack').on('click', '#btnBack', function() {
            _$mcProcessStatuses.hide();
            _$mcProcess.show();
        });
    
        _$mcProcessStatuses.off('click', '#btnSave').on('click', '#btnSave', function() {
            _$grid.jsonSubmit({
                 procedure  : "process_statuses_upd"
                ,onComplete : function(data) {
                    if (data.isSuccess === true) zsi.form.showAlert("savedWindow");
                    displayProcessStatuses(rowData);
                }
            });
        });
    }
});

   