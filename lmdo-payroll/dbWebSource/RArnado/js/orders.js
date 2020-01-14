var orders =  (function(){
    var _public = {};
    var  bs                     = zsi.bs.ctrl
        ,svn                    = zsi.setValIfNull 
        //,orderId                = zsi.getUrlParamValue("order_id")    
        ,hashParams             = app.getCurrentHashParams(["order_id"])
        ,gOrderPartId           = null
        ,g_today_date           = new Date() + ""
        ,gData                  = ""
        ,gOrder_id              = null
        ,gOrderPartsData        = ""
        ,gtw                    = null
        ,gMdlLaunchManager      = "modalWindowLaunchManager"
        ,gMdlProgMngr           = "modalWindowProgramManager"
        ,gMdlCarLeader          = "modalWindowCarLeader"
        ,gMdlWarehouseContact   = "modalWindowWarehouseContact"
        ,gMdlEngrMngr           = "modalWindowEngineeringManager"
        ,gMdlAddComments        = "modalWindowAddComments"
        ,gMdlShowComments       = "modalWindowShowComments"
        ,gMdlAddAttachment      = "modalWindowAddAttachment"
        ,gMdlDetails            = "modalWindowOrderPartDetails"
        ,gMdlOrderDetails       = "modalWindowOrderDetails"
        ,gTeams                 = []
        ,gCommentId             = []
    ;
    
    zsi.ready = function(){  
        $(".page-title").html("Orders");
        gtw = new zsi.easyJsTemplateWriter();
        displayOrders(); 
        setInputs();      
        runDatePicker();
        getTemplates(); 
        $(".hides").hide();
        $('[data-toggle="tooltip"]').tooltip();
        
        //$("#btnAddList").attr("disabled", true);
        var _$tblOrder = $("#tableOrder"); 
        var _$panel = $(".panel");
         
        // _$tblOrder.find("#customer_id").dataBind({
        //      sqlCode    :"D212"   //customers_sel
        //     ,text       :"customer_code"
        //     ,value      :"customer_id"
        //     ,onChange: function(){
        //         _$tblOrder.find("#contact_id").dataBind({
        //              sqlCode    : "C154"
        //             ,parameters : {customer_id : this.val()}
        //             ,text       : "contact_name"
        //             ,value      : "customer_contact_sp_id"
        //         });  
        //     } 
        //     ,onComplete: function(){
        //         // _$tblOrder.find("#contact_id").dataBind({
        //         //      sqlCode    : "C154"
        //         //     ,parameters : {customer_id : this.val()}
        //         //     ,text       : "contact_name"
        //         //     ,value      : "customer_contact_sp_id"
        //         // });  
        //     } 
            
        // }); 

        _$tblOrder.find("#oem_id").dataBind({
             sqlCode    : "D194"
            ,text       : "oem_name"
            ,value      : "oem_id"
            ,onChange   : function(d){ 
                if(this.val() == 5) {
                        $('.hides').show();
                } else {
                        $('.hides').hide();
                }
                
                _$tblOrder.find("#customer_id").dataBind({
                     sqlCode    :"D212"   //customers_sel
                    ,parameters : {oem_id : this.val()} 
                    ,text       :"customer_code"
                    ,value      :"customer_id"
                    ,onChange: function(){
                        _$tblOrder.find("#contact_id").dataBind({
                             sqlCode    : "C154"
                            ,parameters : {customer_id : this.val()}
                            ,text       : "contact_name"
                            ,value      : "customer_contact_sp_id"
                        });  
                    }
                }); 
                
                _$tblOrder.find("#program_id").dataBind({
                     sqlCode    : "O159"
                    ,parameters : {oem_id : d.data[d.index - 1].oem_id} 
                    ,text       : "program_code"
                    ,value      : "program_id" 
                    ,onChange   : function(d){
                        var _$engrMngrId = _$tblOrder.find("#engr_manager_id");
                        var _managerId =d.data[d.index - 1].engr_manager_id;
                        
                        _$engrMngrId.attr("selectedvalue", _managerId );
                        
                        _$engrMngrId.dataBind({
                             sqlCode    : "D179"
                            ,parameters : {oem_id : d.data[d.index - 1].oem_id}
                            ,text       : "engr_manager"
                            ,value      : "engr_manager_id"
                        });
    
                        var  _info                 = d.data[d.index - 1]
                            ,_carleaders           = _info.car_leaders
                            ,_progMngrs            = _info.program_managers
                            ,_launchMngrs          = _info.launch_managers
                            ,_warehouseContacts    = _info.warehouse_contacts 
                        ;
            
                        var _aPM  = _info.program_manager_ids.split(',');
                        var _aPMn = _info.program_managers.split(',');
    
    
                        var _aCL = _info.car_leader_ids.split(',');
                        var _aCLn = _info.car_leaders.split(',');
                        
                        var _aLM  = _info.launch_manager_ids.split(',');
                        var _aLMn = _info.launch_managers.split(',');
                        
                        var _aWC  = _info.warehouse_contact_ids.split(',');
    
                        
                         _aPM.forEach(function(v,i){
                                gTeams.push( { id: v,name: _aPMn[i], type:"PM" } );    
                         });
    
                         _aCL.forEach(function(v,i){
                                gTeams.push( { id: v,name: _aCLn[i], type:"CL"  } );    
                         });
                         
                         _aLM.forEach(function(v,i){
                                gTeams.push( { id: v,name: _aLMn[i], type:"LM"  } );    
                         });
    
                         _aWC.forEach(function(v,i){
                                gTeams.push( { id: v,name: v , type:"WC" } );    
                         });
    
    
                        $("#program_managers").text(_progMngrs);
                        $("#car_leaders").text(_carleaders);
                        $("#launch_managers").text(_launchMngrs);
                        $("#warehouse_contacts").text(_warehouseContacts);
    
                        $("#program_manager_ids").val(_info.program_manager_ids);
                        $("#car_leader_ids").val(_info.car_leader_ids);
                        $("#launch_manager_ids").val(_info.launch_manager_ids);
                        $("#warehouse_contact_ids").val(_info.warehouse_contact_ids );
                        $("#engr_manager_ids").val(_info.engr_manager_id );
                        
                    }        
                });
            }
        });
        
        _$tblOrder.find("#order_type_id").dataBind({
             sqlCode    : "O204"
            ,text       : "order_type"
            ,value      : "order_type_id"
        });
    };
    
    function displayList(type, _$ul){
        var _data =   gTeams.filter( function(x) { return x.type=== type });
            var _h = "";
            $.each(_data ,function(i,v){
                _h += '<li class="list-group-item" id='+ v.id + ' type='+ type +'>' + v.name
                    +    '<i class="fas fa-minus-circle" aria-hidden="true" id='+ v.id + ' onClick="orders.removeList('  + v.id  + ',\'' + type + '\', this)" style="float: right; cursor:pointer;"></i>'
                    +  '</li>';
            });       
    
           _$ul.html(_h);
    
    }   
    
    function displayComments(){
        var _$ul = $("#frm_modalWindowShowComments #commentsListGroup").find("#commentsListItem");
        $.get(app.procURL + "order_comment_sel @order_id=" + gOrder_id, function(d){
            var _h = "";
            $.each(d.rows ,function(i,v){
                gCommentId.push(v.comment_id);
                _h += '<li class="list-group-item" id='+ v.comment_id +'>' + v.comment.concat(" (Created by: "+v.created_by + " " + v.created_date +")  ") 
                    +    '<i class="fas fa-minus-circle" aria-hidden="true" id='+ v.comment_id + ' onClick="orders.removeComment('  + v.comment_id  + ', this)" style="float: right; cursor:pointer;"></i>'
                    +  '</li>';
            });       
                
           _$ul.html(_h);

        });
    }
    
    _public.removeList = function(id,type,obj){
        var _index =  gTeams.findIndex( function(x) { return x.id == id } );
        gTeams.splice(_index,1);
        $(obj).parent().remove();
        updateHidden(type);
    };

    _public.removeComment = function(id,obj){
        var _$li = $(obj).closest("li");
        var _$commentId = _$li.attr("id");
        
        for( var i = 0; i < gCommentId.length; i++){ 
           if ( gCommentId[i] === _$commentId) {
             gCommentId.splice(i, 1); 
           }
        }
        
        _$li.remove();
        
    };
    
    _public.showList = function (type,v) {
        var  _$mdl       = ""
            ,_name       = ""
        ;
        var _$target = null;
                    
        switch(type){
            case "PM":
                _$mdl = $("#" + gMdlProgMngr);
                _name = "Program Manager";
                _$target = $("#frm_modalWindowProgramManager #progMngrsListGroup").find("#progMngrsListItemGroup");
                
                break;
            case "CL":
                _$mdl = $("#" + gMdlCarLeader);
                _name = "Car Leader";
                _$target = $("#frm_modalWindowCarLeader #carLeaderListGroup").find("#carLeaderListItemGroup");

                break;
            case "LM":
                _$mdl = $("#" + gMdlLaunchManager);
                _name = "Launch Manager";
                _$target= $("#frm_modalWindowLaunchManager #launchManagerListGroup").find("#launchManagerListItemGroup");
                break;
            case "WC":
                _$mdl = $("#" + gMdlWarehouseContact);
                _name = "Warehouse Contacts";
                _$target= $("#frm_modalWindowWarehouseContact #warehouseContactsListGroup").find("#warehouseContactsItemGroup");
                break;
            default:break;
        }
        
      displayList(type,_$target);


        _$mdl.find(".modal-title").text(_name +"(s)") ;
        _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
    
    };

    _public.addComments = function(el){
        _$mdl = $("#" + gMdlAddComments);
        _$mdl.find(".modal-title").text("Add Comment(s)") ;
        _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
    
        var _$frm = $("#frm_modalWindowAddComments");
        _$frm.find("#comment").on("keyup change", function(){ 
            _$frm.find("#is_edited").val("Y");
        });   
        _$frm.find("#order_id").val(gOrder_id);

    };
    
    _public.showComments = function(el){
        _$mdl = $("#" + gMdlShowComments);
        _$mdl.find(".modal-title").text("Show Comment(s)") ;
        _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        displayComments();
    };

    _public.addComments = function(el){
        _$mdl = $("#" + gMdlAddComments);
        _$mdl.find(".modal-title").text("Add Comment(s)") ;
        _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
    
        var _$frm = $("#frm_modalWindowAddComments");
        _$frm.find("#comment").on("keyup change", function(){ 
            _$frm.find("#is_edited").val("Y");
        });   
        _$frm.find("#order_id").val(gOrder_id);

    };
    
    _public.showDetails = function(name,orderPartId){
        _$mdl = $("#" + gMdlDetails);
        _$mdl.find(".modal-title").text("Order Part Details for » " + name) ;
        _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        displayOrderPartsDetails("",orderPartId);
    };
    
    _public.showOrderDetails = function(o){
        _$mdl = $("#" + gMdlOrderDetails);
        _$mdl.find(".modal-title").text("Order Details for » " + o.oemName + " » " + o.custName);
        _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        displayOrderDetails(o);
    };
    
    _public.addAttachments = function(){

        var $mdl = $('#' + gMdlAddAttachment);
        
        $mdl.find(".modal-title").text("Attachment");
        $mdl.modal("show");
        $mdl.find("form").attr("enctype","multipart/form-data");
        
        
        $.get(base_url + 'page/name/tmplImageUpload'
            ,function(data){
                $mdl.find('.modal-body').html(data);
                $("#frm_" + gMdlAddAttachment).find("#prefixKey").val("order_id-" + gOrder_id +   ".");
                initChangeEvent();
            }
        );     

    };
    
    function initChangeEvent(){
        $("input[name='file_thumbnail']").change(function(){
            fileNameThumbNail= this.files[0].name;
            var fileSize1 =  this.files[0].size / 1000.00 //to kilobytes
            if(fileSize1 > 100){ 
                alert("Please make sure that file size must not exceed 100 KB.");
                this.value="";
            }
        });
    }
 
    submitComment = function (){
        $("#frm_modalWindowAddComments").jsonSubmit({
             procedure: "order_comment_upd"
            ,onComplete: function (data) {
                if(data.isSuccess===true) zsi.form.showAlert("alert");  
            }
        }); 
    };
    
    submitAttachment = function(){
        var frm = $("#frm_" + gMdlAddAttachment);
        var fileOrg=frm.find("#file").get(0);
        var prefixKey =frm.find("#prefixKey").val(); 
    
        if( fileOrg.files.length<1 ) { 
             alert("Please select image.");
            return;
        }
        
        var formData = new FormData( frm.get(0));
        $.ajax({
            url: base_url + 'file/UploadImage',  //server script to process data
            type: 'POST',
    
            //Ajax events
            success: completeHandler = function(data) {
                if(data.isSuccess){
                    //submit filename to server
                    $.get(base_url  + "sql/exec?p=dbo.image_file_project_specs_upd @project_specs_id=" + project_specs_id
                                    + ",@img_filename='" + prefixKey +  fileOrg.files[0].name + "'"
                    ,function(data){
                        zsi.form.showAlert("alert");
                      //  displayProjectSpecsImages();
                        $('#' + gMdlAddAttachment).modal('toggle');
                    });
    
                        
                }else
                    alert(data.errMsg);
                
            },
            error: errorHandler = function() {
                console.log("error");
            },
            // Form data
            data: formData,
            //Options to tell JQuery not to process data or worry about content-type
            cache: false,
            contentType: false,
            processData: false
        }, 'json');        
    };

    function updateHidden(type){
        var _getVal =  function(attrType){
            return gTeams.filter( function(x) { return x.type===type }).map( x => {return x[attrType] }).join(",");

        }; 
        var _names = _getVal("name");
        var _ids = _getVal("id");

        switch(type){
            case "PM": 
                    $("#program_managers").text(_names );
                    $("#program_manager_ids").val(_ids );
                    
                break;
            case "CL": 
                    $("#car_leaders").text(_names );
                    $("#car_leader_ids").val(_ids );
                break;
            case "LM": 
                    $("#launch_managers").text(_names );
                    $("#launch_manager_ids").val(_ids );
                break;
            case "WC": 
                    $("#warehouse_contacts").text(_names );
                    $("#warehouse_contact_ids").val(_ids );
                break;
            default:break;
        }
        
    }
    
    runDatePicker = function(){ 
        $("#po_issue_date").datepicker({}).datepicker("setDate", "0");    
        $("#mrd").datepicker({}).datepicker("setDate", "0");    
    };

    $("#btnEditPM").click(function(){
        $(this).parent().find("#program_managers").trigger('onclick');
    });  
    $("#btnEditCL").click(function(){
        $(this).parent().find("#car_leaders").trigger('onclick');
    });
    $("#btnEditLM").click(function(){
        $(this).parent().find("#launch_managers").trigger('onclick');
    }); 
    $("#btnEditWC").click(function(){
        $(this).parent().find("#warehouse_contacts").trigger('onclick');
    }); 
    $("#btnEditEM").click(function(){
        $(this).parent().find("#engineering_managers").trigger('onclick');
    }); 

    function getTemplates(){
        new zsi.easyJsTemplateWriter("body")
        .bsModalBox({
              id        : gMdlProgMngr
            , sizeAttr  : "modal-md"
            , title     : "Program Manager(s)"
            , body      : gtw.new().modalBodyProgramManagers({progMngrsListGroup:"progMngrList"}).html()  
        }) 
        .bsModalBox({
              id        : gMdlCarLeader
            , sizeAttr  : "modal-md"
            , title     : "Car Leader(s)"
            , body      : gtw.new().modalBodyCarLeaders({carLeaderListGroup:"carLeaderList"}).html()  
        })
        .bsModalBox({
              id        : gMdlLaunchManager
            , sizeAttr  : "modal-md"
            , title     : "Launch Manager(s)"
            , body      : gtw.new().modalBodyLaunchManager({launchManagerListGroup:"launchManagerList"}).html()  
        }) 
        .bsModalBox({
              id        : gMdlWarehouseContact
            , sizeAttr  : "modal-md"
            , title     : "Warehouse Contact(s)"
            , body      : gtw.new().modalBodyWarehouseContact({warehouseContactsListGroup:"warehouseContactList"}).html()  
        })
        .bsModalBox({
              id        : gMdlEngrMngr
            , sizeAttr  : "modal-md"
            , title     : "Enginnering Manager(s)"
            , body      : gtw.new().modalBodyEngineeringManager({engrMngrListGroup:"engrMngrList"}).html()  
        })
        .bsModalBox({
              id        : gMdlAddComments
            , sizeAttr  : "modal-lg"
            , title     : "Add Comment(s)"
            , body      : gtw.new().modalBodyAddComments({comments:"comments"}).html()
            , footer    :'<div class="pull-left"><button type="button" onclick="orders.submitComment();" class="btn btn-primary"><i class="far fa-save"></i> Save</button></div>'
        })
        .bsModalBox({
              id        : gMdlShowComments
            , sizeAttr  : "modal-lg"
            , title     : "Add Comment(s)"
            , body      : gtw.new().modalBodyShowComments({commentsListGroup:"comments"}).html()
        })
        .bsModalBox({
              id        : gMdlAddAttachment
            , sizeAttr  : "modal-lg"
            , title     : "Add Comment(s)"
            , body      : gtw.new().modalBodyAddAttachment({attachment:"attachment"}).html()
            , footer    :'<div class="pull-left"><button type="button" onclick="orders.submitAttachment();" class="btn btn-primary"><i class="far fa-save"></i> Save</button></div>'
        })
        .bsModalBox({
              id        : gMdlDetails
            , sizeAttr  : "modal-full"
            , title     : "Order Part Details"
            , body      : gtw.new().modalBodyOrderPartDetails({grid:"orderPartDetailGrid"}).html()
            , footer    :'<div class="pull-left"><button type="button" onclick="orders.submitOrderPartDetails();" class="btn btn-primary"><i class="far fa-save"></i> Save</button></div>'
        })
        .bsModalBox({
              id        : gMdlOrderDetails
            , sizeAttr  : "modal-full"
            , title     : "Order Details"
            , body      : gtw.new().modalBodyOrderDetails({grid:"orderPartGrid"}).html()
            , footer    :'<div class="pull-left"><button type="button" onclick="orders.submitOrderPartDetails();" class="btn btn-primary"><i class="far fa-save"></i> Save</button></div>'
        }); 
        
    }

    $("#btnSaveOrders").click(function () {
        $("#tableOrder").jsonSubmit({
             procedure: "orders_upd"
            ,notInclude: "#oem_id"
            ,onComplete: function (data) {
                var _$tbl = $("#tableOrder");
                var _oemId = _$tbl.find("#oem_id").val();
                var _oemName = _$tbl.find("#oem_id :selected").text();
                var _progId = _$tbl.find("#program_id").val();
                var _progName = _$tbl.find("#program_id :selected").text();
                var _custId = _$tbl.find("#customer_id").val();
                var _custName = _$tbl.find("#customer_id :selected").text();
                var _retvalue = data.returnValue;
                if(data.isSuccess===true){ 
                    zsi.form.showAlert("alert");
                
                    displayOrders(_retvalue); 
                    //$(".search_list").show();
                    _$tbl.find(".hideComment").show();
                    
                    orders.showOrderDetails({
                        oemId : _oemId,
                        oemName : _oemName,
                        progId : _progId,
                        progName : _progName,
                        custId : _custId,
                        custName : _custName,
                        retValue : _retvalue
                    });
                    //setSearch(_customerId,_progId,_retvalue);
                }
            }
        }); 
        
        $("#searchGroup").show();
       
    });
    

    function setSearch(cId,pId,oId){
        var _tblCode = (cId ? "ref-00021" : "ref-00011");
        var _cId = (cId ? cId : "");
        var _pId = (pId ? pId : "");

        var _params = (_cId ?  "'customer_id=" + _cId + " and program_id=" + _pId + "'"  :  "'program_id=" + _pId + "'");
        var _filterId =  $("#searchOrderParts");
        new zsi.search({
            tableCode: _tblCode
            ,colNames : ["oem_part_no"] 
            ,displayNames : ["Description"]  
            ,searchColumn :"oem_part_no"
            ,input:"input[name=searchOrderParts]"
            ,url : app.execURL + "searchData "
            ,condition: _params
            ,isLikeAll: "Y"
            ,onSelectedItem: function(currentObject,data,i){ 
                if(data){
                    //$("#btnAddList").removeAttr("disabled", true);
                    $("#oem_program_part_id").val(data.oem_program_part_id);
                    $("#order_search_id").val(oId);
                    
                    currentObject.value=data.oem_part_no;
                    var tr  = currentObject.parentNode.parentNode;
                    $(tr).find("#searchOrderParts").val(data.oem_part_no);
                   // gOrderPartId = data.oem_program_part_id;
                }else{
                    //$("#btnAddList").attr("disabled",true);
                }
                $("#searchOrderParts").on("change",function(){
                    if($(this).val() !== data){
                        //$("#btnAddList").attr("disabled",true);
                        /*$(".form-grid").hide();*/
                    }else{
                        //$("#btnAddList").removeAttr("disabled", true);
                        $(".form-grid").show();
                    }
                });
                
            }
        });        
    } 
      
    function setInputs(){
        searchOrderParts = $("input[name=searchOrderParts]");
    } 
        
    function displayOrders(id){
        var _$tbl = $("#tableOrder").find("#panel-1");  
       
        if(id) 
            gOrder_id = id;
        else if(hashParams.orderId)
            gOrder_id = hashParams.orderId;

        $.get(app.procURL + "orders_sel " + (gOrder_id !== null ? "@order_id=" + gOrder_id : "") 
        , function (d){
            var _d = d.rows[0];

            if(! isUD(_d)){
                _$tbl.find("#order_id").val(_d.order_id);
                _$tbl.find("#is_edited").val( _d.is_edited );
                _$tbl.find("#program_manager_ids").val( _d.program_manager_ids );
                _$tbl.find("#car_leader_ids").val( _d.car_leader_ids );
                _$tbl.find("#launch_manager_ids").val( _d.launch_manager_ids );
                _$tbl.find("#warehouse_contact_ids").val( _d.warehouse_contact_ids );
                _$tbl.find("#customer_id").attr("selectedvalue",_d.customer_id);
                _$tbl.find("#contact_id").attr("selectedvalue",_d.contact_id);
                _$tbl.find("#program_id").attr("selectedvalue",_d.program_id);
                _$tbl.find("#engr_manager_id").attr("selectedvalue",_d.engr_manager_id );
                _$tbl.find("#po_no").val(_d.po_no);
                _$tbl.find("#po_issue_date").val(_d.po_issue_date.toDateFormat());
                _$tbl.find("#rev_no").val(_d.rev_no); 
                _$tbl.find("#order_type_id").attr("selectedvalue",_d.order_type_id);
                _$tbl.find("#rate_row").val( _d.rate_row );
                //setSearch(_d.customer_id);

            }
            
        });  
        
        
        _$tbl.find("select, input").on("keyup change", function(){ 
            _$tbl.find("#is_edited").val("Y");
        });   

    }
    
    function displayOrderParts(oId,oemId){ 
        var cb = app.bs({name:"cbFilter1",type:"checkbox"}); 
        var _dataRows = [];

        if(oemId == 5){ 
            _dataRows.push(
                {text: "Line No."  ,width : 200   ,style : "text-align:left"
                    ,onRender  :  function(d){ return app.bs({name:"order_part_id"      ,type:"hidden"      ,value: svn (d,"order_part_id")}) 
                                    + app.bs({name:"is_edited"                          ,type:"hidden"      ,value: svn(d,"is_edited")})
                                    + app.bs({name:"line_no"                            ,type:"input"       ,value: svn(d,"line_no")});
                    }
                
                }
                ,{text:"Build Phase"            ,type:"input"          ,name:"build_phasee"             ,width:200       ,style:"text-align:left"}
            );
        }else {
            _dataRows.push(
                {text: "Build Phase"  ,width : 200   ,style : "text-align:left"
                    ,onRender  :  function(d){ return app.bs({name:"order_part_id"      ,type:"hidden"      ,value: svn(d,"order_part_id")}) 
                                    + app.bs({name:"is_edited"                          ,type:"hidden"      ,value: svn(d,"is_edited")})
                                    + app.bs({name:"line_no"                            ,type:"hidden"      ,value: svn(d,"line_no")})
                                    + svn(d,"build_phase");
                    }
                
                }
            );
        }
        _dataRows.push(
            {text:"Model Year"             ,width:200       ,style:"text-align:left"
                 ,onRender: function(d){ return svn(d,"model_year")}
            }
            ,{text:"Harness Family"         ,width:200       ,style:"text-align:left"
                 ,onRender: function(d){ return svn(d,"harness_family")}
                
            }
            ,{text:"Customer MRD"           ,type:"input"          ,name:"customer_mrd"             ,width:200       ,style:"text-align:left"}
           
            ,{text:"Description"            ,width:200       ,style:"text-align:left"
                ,onRender: function(d){ return svn(d,"program_desc")}
            }
            ,{text:"OEM Part No."           ,width:200       ,style:"text-align:left"
                ,onRender: function(d){ return svn(d,"oem_part_no")}
            } 
            ,{text:"Customer Part No."      ,width:200       ,style:"text-align:left"
                ,onRender: function(d){ return svn(d,"customer_part_no")}
            } 
            ,{text:"Order Part Qty"         ,width:200       ,style:"text-align:left"
                ,onRender: function(d){ return svn(d,"order_part_qty")} 
            }   
            ,{text:"Details"                ,width:100       ,style:"text-align:center"
                ,onRender: function(d){  
                    var _link =  '<i class="fas fa-plus" aria-hidden="true" onclick="orders.showDetails(\''+ svn(d,"oem_part_no") +'\',\''+ svn(d,"order_part_id")+ '\')"></i>';
                    return (d !== null ? _link : "");
                    
                } 
                    
            }   
            
        );

        $("#orderPartGrid").dataBind({
             url                : app.procURL + "order_parts_sel @order_id=" + oId 
            ,height             : $(window).height()
            ,width              : $(".panel-container").width() - 45 
            ,blankRowsLimit     : 5
            ,dataRows           : _dataRows
            ,onComplete: function(o){
                
            }
                
        });
    }  
     
    function displayOrderPartsDetails(bRows,id){ 
        console.log("id",id)
        var cb = app.bs({name:"cbFilter1",type:"checkbox"}); 
        var _$tbl =  $("#tableOrder"); 
        $(window).resize(function() {
            var width = $(window).width();
            if (width < 800){ 
              $("#grid").css("style","width: 100% !impotant"); 
              _$tbl.find(".input-group").css("style","width: 100% !impotant"); 
            }
        }); 
         
        $("#orderPartDetailGrid").dataBind({
                 url                : app.procURL + "order_part_details_sel @order_part_id=" + id
                ,height             : $(window).height()
                ,width              : $("#frm_modalWindowOrderPartDetails").width() - 20 
                ,blankRowsLimit     : (bRows === "" ? 10 : bRows)
                ,dataRows           : [
                        {text:"Site"        ,width:300              ,style : "text-align:left"
                            ,onRender  :  function(d){ return app.bs({name:"order_part_dtl_id"   ,type:"hidden"      ,value: svn (d,"id")}) 
                                            + app.bs({name:"is_edited"                           ,type:"hidden"      ,value: svn(d,"is_edited")})
                                            + app.bs({name:"order_part_id"                       ,type:"hidden"      ,value: id})
                                            + app.bs({name:"site_id"                             ,type:"select"       ,value: svn(d,"site_id")})
                                            
                            }
                        
                        } 
                        ,{text:"Lear Promise Date "            ,type:"input"           ,name:"lear_promise_date"             ,width:300       ,style:"text-align:left"}
                        ,{text:"Promised Qty"                  ,type:"input"           ,name:"promised_qty"                  ,width:200       ,style:"text-align:left"} 
                        ,{text:"Customer Required Date"        ,type:"input"           ,name:"customer_required_date"        ,width:300       ,style:"text-align:left"} 
                        ,{text:"Required Qty"                  ,type:"input"           ,name:"required_qty"                  ,width:250       ,style:"text-align:left"}   
                    ] 
                    
                ,onComplete: function(o){ 
                    this.find("[name='lear_promise_date']").datepicker().attr("readonly",true); 
                    this.find("[name='customer_required_date']").datepicker().attr("readonly",true); 
                    this.find("[name='site_id']").dataBind({
                         sqlCode    : "C146"
                        ,text       : "site_address"
                        ,value      : "site_id"
                    });
    
                    this.data("id",id);
                } 
                 
        });
    }  
    
    function displayOrderDetails(o){
        $("#frm_modalWindowOrderDetails").find("#mrd").datepicker().attr("readonly",true);
        var _$searchGroup = $("#" + gMdlOrderDetails).find("#searchGroup"); 
        _$searchGroup.find("#build_phase_id").dataBind({
             sqlCode    :"D210"   //customers_sel
            ,parameters : {program_id : o.progId} 
            ,text       :"build_phase_abbrv"
            ,value      :"build_phase_id"
        }); 
        
        _$searchGroup.find("#model_year").dataBind({
             sqlCode    :"D211"   //customers_sel
            ,parameters : {program_id : o.progId} 
            ,text       :"model_year_name"
            ,value      :"model_year"
        }); 
        
        setSearch(o.custId, o.progId, o.retValue);
    }  
     
    _public.enterBlankRows = function(){
        var bRows = $("#frm_modalWindowOrderPartDetails").find("#no_rows").val();
        displayOrderPartsDetails(bRows,$("#orderPartDetailGrid").data("id"));
    };
    

    $("#btnAddList").click(function(){ 
        //$("#btnAddList").attr("disabled", true);
        $(".form-grid").show();
        var _search = $("#searchOrderParts").val();   
        $.post( app.procURL + "order_parts_ins "
            + "@oem_program_part_id='"  + $("#oem_program_part_id").val() + "'"
            + ",@customer_program_id='" + $("#customer_program_id").val() + "'"
            + ",@mrd='"                 + $("#mrd").val() + "'" 
            + ",@order_qty='"           + $("#order_qty").val() + "'" 
            + ",@order_id='"            + gOrder_id + "'" 
            ,function(data){   
            if(data.isSuccess===true) zsi.form.showAlert("alert");      
            var _$tbl = $("#tableOrder");
            var _orderId    = _$tbl.find("#order_id").val();
            console
            //var _progPartId = _$tbl.find("#oem_program_part_id").val();
            //var _custProgId = _$tbl.find("#customer_program_id").val();
            var _oemId      = _$tbl.find("#oem_id :selected").val()
            displayOrderParts(gOrder_id,_oemId); 
        });
    });
    
    $("#btnReset").click(function(){
      /*  $("#searchGroup").hide();  
        $(".form-grid").hide();*/
        var _$tbl = $("#tableOrder");
        _$tbl.find('input[type=text], input[type=hidden], select').val('');
        _$tbl.find('select').attr('selectedvalue','').val('');  
    
    
        //orders.showOrderDetails({});
    });
    
    _public.submitOrderPartDetails = function(){
        var _$grid = $("#orderPartDetailGrid");
        _$grid.jsonSubmit({
             procedure: "order_part_details_upd"
            ,optionalItems: ["is_active"] 
            ,onComplete: function (data) {
                displayOrderPartsDetails("",_$grid.data("id")); 
            }
        });
    }
    

    return _public;

})();  










 
                                                                                                       