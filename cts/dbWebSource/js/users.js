zsi.ready(function() {
    /*Enting - Please don't move this outside from function to prevent variable collision*/
    var bs = zsi.bs.ctrl;
    var svn = zsi.setValIfNull;
    
    var _gridWidth =  $("#main-content").width() - 40;
    var _gridHeight = $("#main-content").height() - 150;
    var _$mcUsers = $("#menu-content-users");
    var _$mcUserRoles = $("#menu-content-userroles").hide();
    
    displayUsers();
    
    function displayUsers() {   
        var _rownum = 0;
        var _$grid = $("#grid-manage-users");
        
        if (gUser.is_admin === 'Y') {
            $("#button-div").html('<button type="button" class="col-12 col-md-auto btn btn-primary btn-sm" id="btnSave"><span class="fa fa-save"></span> Save</button>');
        }
        
        _$grid.dataBind({
    	     url            : procURL + "users_sel"
            ,width          : _gridWidth
    	    ,height         : _gridHeight
            ,blankRowsLimit : 5
            ,dataRows       :[
                { text : "#" , width : 25 , style : "text-align:center;"
                    , onRender : function(d) {
                        _rownum++; 
                        return (d!==null ? _rownum : "")
                            +  bs({name:"app_user_id",type:"hidden",value: svn (d,"app_user_id")})
                            +  bs({name:"is_edited",type:"hidden"})
                            +  bs({name:"client_id",type:"hidden",value: svn (d,"client_id")});
                    }    		     
         		}
        		,{ text : "Last Name"   , width : 150 , style : "text-align:left;" , type : "input" , name : "last_name" }
        		,{ text : "First Name"  , width : 150 , style : "text-align:left;" , type : "input" , name : "first_name" }
        		,{ text : "Middle Name" , width : 150 , style : "text-align:left;" , type : "input" , name : "middle_name" }
        		,{ text : "Suffix"      , width : 100 , style : "text-align:left;" , type : "input" , name : "name_suffix" }
        		,{ text : "Email"       , width : 200 , style : "text-align:left;" , type : "input" , name : "email_add" }
        		,{ text : "Landline"    , width : 80  , style : "text-align:left;" , type : "input" , name : "landline_no" }
        		,{ text : "Mobile #1"   , width : 100 , style : "text-align:left;" , type : "input" , name : "mobile_no1" }
        		,{ text : "Mobile #2"   , width : 100 , style : "text-align:left;"
        		    ,onRender : function(d) {
                        return bs({name:"mobile_no2",type:"input",value: svn (d,"mobile_no2")})
                            +  bs({name:"logon",type:"hidden",value: svn (d,"logon")})
                            +  bs({name:"password",type:"hidden",value: svn (d,"password")})
                            +  bs({name:"is_developer",type:"hidden",value: svn (d,"is_developer")});
                    }
        		}
        		,{ text : "Is Add?"     , width : 80  , style : "text-align:left;" , type : "yesno" , name : "is_add" }
        		,{ text : "Is Admin?"   , width : 80  , style : "text-align:left;" , type : "yesno" , name : "is_admin" }
        		,{ text : "Is Active?"  , width : 80  , style : "text-align:left;" , type : "yesno" , name : "is_active" }
        		,{ text : 'Roles' , width : 100 , style : 'text-align:center;'
                    ,onRender : function(d) {
                        return (d !== null && svn(d,"user_id") !== '' && gUser.is_admin === 'Y' ? '<div class="add-roles">'+ d.countUserRoles +'</div>' : '');
                    }
                }
    	    ]
            ,onComplete: function(o){
                var _this = $(this);

                _$grid.off('click', '.add-roles').on('click', '.add-roles', function() {
                    var _$self = $(this);
                    var _rowData = o.data.rows[_$self.closest('.zRow').index()];
                    displayUserRoles(_rowData);
                });
            }
        });
        
        _$mcUsers.off('click', '#btnSave').on('click', '#btnSave', function() {
            _$grid.jsonSubmit({
                 procedure  : "users_upd"
                ,onComplete : function (data) {
                    if(data.isSuccess===true) zsi.form.showAlert("progressWindow");
                    displayUsers();
                }
            });
        });
    }
    
    function displayUserRoles(rowData) {
        _$mcUsers.hide();
        _$mcUserRoles.show();
        $("#processTitle").text(rowData.first_name + " " + rowData.middle_name + " " + rowData.last_name);
        
        if (gUser.is_admin === 'Y') {
            $("#button-div2").html('<button type="button" class="col-12 col-md-auto btn btn-primary btn-sm" id="btnSave"><span class="fa fa-save"></span> Save</button>');
        }
    
        /* The JSON keys must be in the same order in TT */
        var _$grid = $("#grid-manage-userroles");
        _$grid.dataBind({
            url             : procURL + 'user_roles_sel @app_user_id=' + rowData.app_user_id
            ,width          : _gridWidth
            ,height         : _gridHeight
            ,dataRows       : [
                                { text : '' , width : 50 , style : 'text-align:left;' 
                                    , onRender : function(d) {
                                        return bs({ name : "user_role_id" , type : "hidden" , value : svn (d,"user_role_id") })
                                            +  bs({ name : "app_user_id" , type : "hidden" , value : rowData.app_user_id })
                                            +  bs({ name : "role_id" , type : "hidden" , value : svn (d,"role_id") })
                                            +  '<input type="checkbox" '+(d.user_role_id === '' ? '' : 'checked="checked"')+' >';
                                    }
                                }
                                ,{ text : "Role"  , width : 200  , style : "text-align:left;" , name : "role_name" }
                              ]
            ,onComplete : function() {
               
            }
        });
    
        _$mcUserRoles.off('click', '#btnBack').on('click', '#btnBack', function() {
            _$mcUserRoles.hide();
            _$mcUsers.show();
        });
    
        _$mcUserRoles.off('click', '#btnSave').on('click', '#btnSave', function() {
            var _json = [];
                                                    
            _$grid.find('.zRow').each(function() {
                // Note - the input arrangement will matter from the grid
                var _$self = $(this);
                var _$firstZCell = _$self.children().eq(0).children();
                var _user_role_id = _$firstZCell.eq(0).val();
                var _role_id = _$firstZCell.eq(2).val();
                var _is_notDeleted = _$firstZCell.eq(3).prop('checked');
                
                _json.push({
                    "user_role_id" : (_user_role_id !== '' ? _user_role_id : null)
                    ,"is_deleted" : (_is_notDeleted ? 'N' : 'Y')
                    ,"app_user_id" : (_is_notDeleted ? rowData.app_user_id : null)
                    ,"role_id" : _role_id
                });
            });
                
            $.ajax({
                type: 'POST'
              , url: base_url + "data/update"
              , data: JSON.stringify( { procedure: "user_roles_upd" , rows: _json } )
              , contentType: 'application/json'
              , success : function() {
                  displayUserRoles(rowData);
              }
            });
        });
    }
});       