zsi.ready(function() {
    /* The JSON keys must be in the same order in TT */
    var _processData;
    
    if (gUser.is_admin === 'Y') {
        $('#button-div').html('<button type="button" class="col-12 col-md-auto btn btn-primary btn-sm" id="btnSave"><span class="fa fa-save"></span> Save</button>');
    }
    
    $.get(procURL + 'roles_sel', function(d) {
        var _rolesData = d.rows;
        if ( ! _rolesData.length) {
            for (var i=0; i < 5; i++) {
                _rolesData.push({
                    "role_id" : 0
                    ,"is_edited" : 'N'
                    ,"role_name" : ''
                });
            }
        }
        if (_rolesData.length) {
            $.get(procURL + 'processes_sel', function(_d) {
                _processData = _d.rows;
                if (_processData.length) {
                    $.get(procURL + 'role_processes_sel', function(__d) {
                        var _rpData = __d.rows;
                        var _newData = [];
                        var _dataRows = [{ text : 'Role' , width : 200 , style : 'text-align:left;' 
                                            , onRender : function(d) {
                                                return  bs({ name : "role_id" , type : "hidden" , value : svn (d,"role_id") })
                                                        + bs({ name : "is_edited" , type : "hidden" })
                                                        + bs({ name : "role_name" , type : "input" , value : svn (d,"role_name") });
                                            }
                                        }];
                        
                        _rolesData.forEach(function(v,i) {
                            var _temp = { "role_id" : v.role_id , "role_name" : v.role_name };
                            _processData.forEach(function(_v,_i) {
                                if (_v.is_default !== 'Y') {
                                    _temp["process_id" + _i] = _v.process_id;
                                    _temp["process_title" + _i] = _v.process_title;
                                    
                                    var _grep = $.grep(_rpData, function(x) { return x.role_id === v.role_id && x.process_id === _v.process_id; });
                                    _temp["role_process_id" + _i] = (_grep.length ? _grep[0].role_process_id : 0);
                                    
                                    if (i === 0) {
                                        _dataRows.push({
                                            text : _v.process_title , width : 170 , style : 'text-align:center;' , index : _i
                                            , onRender : function(d) {
                                                if (typeof d === 'object' && d.role_id !== 0) {
                                                    var _rp_id = d["role_process_id" + this.index];
                                                    return '<input type="hidden" name="role_process_id" value="' + _rp_id + '" >'
                                                    + '<input type="checkbox" name="process_id" value="' + (d["process_id" + this.index]) + '" '+(_rp_id !== 0 ? 'checked="checked"' : '')+' >';
                                                }
                                                else { 
                                                    return '<input type="hidden" name="role_process_id" value="0">'
                                                    + '<input type="checkbox" name="process_id" value="' + (d["process_id" + this.index]) + '" disabled="disabled" >';
                                                }
                                            }
                                        });
                                    }
                                }
                            });
                            _newData.push(_temp);
                        });
                        
                        var _newDataSample = JSON.parse(JSON.stringify(_newData)); // Use this to copy array without reference
                        _newDataSample[0].role_id = 0;
                        _newDataSample[0].role_name = '';
                        _processData.forEach(function(v,i) {
                            _newDataSample[0]['role_process_id' + i] = 0;
                        });
                        for (var i=0; i < 5; i++) {
                            _newData.push(_newDataSample[0]);
                        }
                        
                        var _$grid = $("#grid-manage-roles");
                        _$grid.dataBind({
                            rows            : _newData
                            ,width          : $("#main-content").width() - 40
                            ,height         : $("#main-content").height() - 150
                            ,dataRows       : _dataRows
                            ,onComplete     : function() {
                                _$grid.find('input[name=role_name]').keyup(function() {
                                    var _$self = $(this);
                                    var _$cbs = _$self.closest('.zRow').find('input[type=checkbox]');
                                    if (_$self.val() === '') {
                                        _$cbs.attr('disabled','disabled');
                                    } else {
                                        _$cbs.removeAttr('disabled');
                                    }
                                });
                                
                                if (gUser.is_admin === 'Y') {
                                    $("#menu-content-roles").off('click', '#btnSave').on('click', '#btnSave', function() {
                                    // 1st step - Update/Save Role
                                    var _json = [];
                                    _$grid.find('.zCell:nth-child(1)').filter(function() { return $(this).children('input[name=role_name]').val() !== ''; }).each(function() {
                                        var _$self = $(this);
                                        var _role_id = _$self.children('input[name=role_id]').val();
                                        var _is_edited = _$self.children('input[name=is_edited]').val();
                                        var _role_name = _$self.children('input[name=role_name]').val();
                                        _json.push({
                                            "role_id" : (_role_id !== '0' ? _role_id : null)
                                            ,"is_edited" : (_is_edited === 'Y' ? _is_edited : 'N')
                                            ,"role_name" : _role_name
                                        });
                                    });
                                        
                                    $.ajax({
                                        type: 'POST'
                                      , url: base_url + "data/update"
                                      , data: JSON.stringify( { procedure: "roles_upd" , rows: _json } )
                                      , contentType: 'application/json'
                                      , success : function() {
                                            // 2nd step - Update/Save role_processes
                                            $.get(procURL + 'roles_sel', function(___d) {
                                                var _newRolesData = ___d.rows;
                                                var __json = [];
                                                
                                                _$grid.find('.zRow').each(function() {
                                                    // Note - the input arrangement will matter from the grid
                                                    var _$self = $(this);
                                                    var _$zCells = _$self.children();
                                                    var _$firstZCell = _$zCells.eq(0).children();
                                                    var _role_name = _$firstZCell.eq(2).val();
                                                    
                                                    if (_role_name !== '') {
                                                        var _grep = $.grep(_newRolesData, function(x) { return x.role_name === _role_name; });
                                                        
                                                        _$zCells.each(function(i) {
                                                            if ( i !== 0) {
                                                                var _$p_id = $(this).find('input[name=process_id]');
                                                                var _rp_id = $(this).find('input[name=role_process_id]').val();
                                                                __json.push({
                                                                    "role_process_id" : (_rp_id !== '0' ? _rp_id : null)
                                                                    ,"role_id" : _grep[0].role_id
                                                                    ,"is_edited" : 'Y'
                                                                    ,"is_deleted" : (_$p_id.prop('checked') ? 'N' : 'Y')
                                                                    ,"process_id" : (_$p_id.prop('checked') ? _$p_id.val() : null)
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                                                    
                                                $.ajax({
                                                    type: 'POST'
                                                  , url: base_url + "data/update"
                                                  , data: JSON.stringify( { procedure: "role_processes_upd" , rows: __json } )
                                                  , contentType: 'application/json'
                                                  , success : function() {
                                                      displayRoles();
                                                  }
                                                });
                                            });
                                        }
                                    });
                                });
                                }
                            }
                        });
                    });
                }
            });
        }
    });
});     