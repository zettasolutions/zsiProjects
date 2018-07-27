$(document).ready(function() {
    var _$activeMenu = $("#menu-nav .menu.active");
    var _$mc = $("#main-content");
    var _$grid = $("#grid-request");
    var _$gr = $("#grid-request-div");
    var _$rd = $("#request-details-div");
    var _files = [];
    
    // Note that this process-id is for the list not in form
    _$grid.dataBind({
    	url 			: procURL + 'requests_sel @status_id=' + _$activeMenu.attr("data-status-id") + ',@process_id=' + _$activeMenu.attr("data-process-id")
    	,width 			: _$mc.width() - 50
    	,height 		: _$mc.height() - 150
    	,dataRows 		: [
    	                    { text : 'Request #' , width : 90 , style : 'text-align:center;' 
    							, onRender : function(d) {
    			                    return 	d.request_no;
    			                }
    						}
    						,{ text : 'Title' , name : 'process_title' , width : 200 , style : 'text-align:left;' }
    						,{ text : 'Priority Level' , name : 'priority_level' , width : 200 , style : 'text-align:left;' }
    						,{ text : 'Status' , name : 'status_name' , width : 200 , style : 'text-align:left;' }
    					  ]
    	,onComplete     : function(o) {
    	    this
    	    .off("click", ".zRow")
    	    .on("click", ".zRow", function() {
    	        var _rowData = o.data.rows[$(this).index()];
    	        _$gr.hide();
    	        _$rd.show();
    	        
    	        _$rd.find("#request_id").val(_rowData.request_id);
    	        _$rd.find("#request_no").val(_rowData.request_no);
    	        _$rd.find("#client_id").val(_rowData.client_id);
    	        _$rd.find("#process_id").val(_rowData.process_id);
    	        _$rd.find("#app_id").val(_rowData.app_id);
    	        _$rd.find("#priority_level").val(_rowData.priority_level);
    	        _$rd.find("#process_title").val(_rowData.process_title);
    	        _$rd.find("#request_desc").val(_rowData.request_desc);
    	        _$rd.find("#remarks").val(_rowData.remarks);
    	        _$rd.find("#status_name").val(_rowData.status_name);
    	        
    	        // Create and display dynamic buttons
                $.get(procURL + 'request_processes_statuses_sel @request_id='+ _rowData.request_id +',@process_id='+ _rowData.process_id +'', function(d) {
                    var _html = '';
                    d.rows.forEach(function(v) {
                        _html   += '<button type="button" class="btn btn-primary mr-1 btn-next-process" id="btn' + v.process_status_id + '" '
                                + 'data-process-status-id="'+ v.process_status_id +'" '
                                + 'data-process-id="'+ v.process_id +'" '
                                + 'data-status-id="'+ v.status_id +'" '
                                + 'data-next-process-id="'+ v.next_process_id +'" '
                                + 'data-client-id="'+ v.client_id +'">'
                                + v.button_text + '</button>';
                    });
                    $("#button-div").html(_html);
                });
                
                $.get(procURL + 'request_attachments_sel @request_id='+_rowData.request_id+',@client_id='+gUser.client_id, function(d) {
                    _files = d.rows;
                    displayAttachments();
                });
                
                // Dynamic button click event listener
                $("#button-div")
                .off("click","button.btn-next-process")
                .on("click","button.btn-next-process", function() {
                    var _$self = $(this);
                    
                    if ( ! validate()) {
                        return false;
                    } else {
                        $.post( procURL + "request_upd"
                            + " @request_id="          + $("#request_id").val() + ""
                            + ",@client_id="           + _$self.attr("data-client-id") + ""
                            + ",@app_id="              + $("#app_id").val() + ""
                            + ",@request_desc='"        + $("#request_desc").val() + "'"
                            + ",@priority_level="      + '' + ""
                            + ",@process_id="          + _$self.attr("data-process-id") + ""
                            + ",@process_status_id="   + _$self.attr("data-process-status-id") + ""
                            + ",@status_id="           + _$self.attr("data-status-id") + ""
                            + ",@next_process_id="     + _$self.attr("data-next-process-id") + ""
                            + ",@remarks='"             + $("#remarks").val() + "'"
                            ,function(data){
                                if(data.isSuccess===true) { 
                                    zsi.form.showAlert("progressWindow");
                                    
                                    $("#attachments-grid").find('.zRow').each(function() {
                                        var _$zRow = $(this);
                                        
                                        $.post( procURL + "request_attachments_upd"
                                        + " @request_attachment_id=" + _$zRow.find("#request_attachment_id").val() + ""
                                        + ",@request_id=" + $("#request_id").val() + ""
                                        + ",@client_id=" + _$self.attr("data-client-id") + ""
                                        + ",@attachment_name='" + _$zRow.find("#attachment_name").val() + "'"
                                        + ",@file_name='" + _$zRow.find("#file_name").val() + "'");
                                    });
                                }
                            }
                        ); 
                    }
                });
    	    });
    	}
    });
    
    // Trigger the hidden input type="file" when the "+"" button is clicked
    $(".add-attachment").click(function() {
        $(this).prev().click();
    });
    
    $("#attachments").change(function() {
        var __files = this.files;
        for (var i = 0, length = __files.length; i < length; i++) {
            var __info = __files[i];
            _files.push({ 
                request_attachment_id : null
                ,attachment_name : ''
                ,file_name : __info.name 
            });
        }
        displayAttachments();
    });
    
    // Display client apps in dropdown
    $.get(procURL + 'dd_client_apps_sel', function(d) {
        var _data = d.rows;
        var _html = '<option></option>';
        _data.forEach(function(v) {
            _html += '<option value="'+v.app_id+'">'+v.app_name+'</option>';
        });
        
        $("#app_id").html(_html);
    });
    
    // Check validation
    function validate() {
        var _sucess = true;
        $(".validate").each(function() {
            var _$self = $(this);
            if (this.value === "") {
                _sucess = false;
                _$self.siblings(".invalid-feedback").text("This field is required").show();
                _$self.addClass("error");
            } else {
                _$self.siblings(".invalid-feedback").hide();
                _$self.removeClass("error");
            }
        });
        return _sucess;
    }
    
    function displayAttachments(callBack) {
        $("#attachments-grid").dataBind({
            rows : _files
            ,width: 700
            ,height: 100
            ,dataRows : [
                            { text : "Name" , width : 300 , style : "text-align:left;"
                                ,onRender : function(d) {
                                    return bs({ name : 'request_attachment_id' , type : 'hidden' , value : svn(d,'request_attachment_id') })
                                        + bs({ name : 'file_name' , type : 'hidden' , value : svn(d,'file_name') })
                                        + bs({ name : 'attachment_name' , type : 'input' , value : svn(d,'attachment_name') });
                                }
                            }
                            ,{ text : "Filename" , width : 300 , style : "text-align:left;" , name : "file_name" }
                            ,{ text : "Action" , width : 80 , style : "text-align:center;"
                                ,onRender : function(d) {
                                    return '<a href="#" class="remove-attachment"><i class="fas fa-trash"></i></a>';
                                }
                            }
                        ]
            ,onComplete : function(d) {
                if (typeof callBack === 'function') callBack(d);
                
                this.off('click', '.remove-attachment')
                .on('click', '.remove-attachment', function() {
                    var _$self = $(this);
                    var _$zRow = _$self.closest(".zRow");
                    console.log(_$zRow.index(), _$zRow.remove());
                });
            }
        });
    }
});    