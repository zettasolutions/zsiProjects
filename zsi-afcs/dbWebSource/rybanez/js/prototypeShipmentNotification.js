var psn = (function(){
    var  _public            = {}
        ,bs                 = zsi.bs.ctrl
        ,svn                = zsi.setValIfNull 
        ,gtw                = null
        ,gMdlAddComments    = "modalWindowAddComments"
        ,gComments          = ""
        ,gPSNForm           = $("#formPSN")
        ,gProgId            = ""
        ,gSiteId            = ""
        ,g$tblPSN           = $("#tablePSN")
    ;
    zsi.ready = function(){
        $(".page-title").html("Generate PSN"); 
        $(".panel-container").css("min-height", $(window).height() - 160);
        gtw = new zsi.easyJsTemplateWriter();

        var _$frm = $("#formPSN")
            ,_showPSNDetails = function(){
                if(gProgId!=="" && gSiteId){
                    displayPSNDetails();
                }
            };
            
        _$frm.find("#program_id").dataBind({
             sqlCode    : "D234" //dd_programs_by_user_sel
            ,text       : "program_code"
            ,value      : "oem_program_id"
            ,onChange   : function(){
                gProgId = this.val();
                _showPSNDetails();
                $("#shipToId").text("");
                _$frm.find("#site_id").dataBind({
                     sqlCode    : "D264" //dd_order_sites_sel
                    ,parameters : {program_id : (gProgId ? gProgId : "")}
                    ,text       : "site_code"
                    ,value      : "site_id"
                    ,onComplete : function(){
                        $("option:first-child",this).val("");
                    }
                    ,onChange   : function(d){
                        var _this = this;
                        console.log("_this",_this.val());
                        var  _info              = d.data[d.index - 1]
                            ,_bldg_no           = (isUD(_info) ? "" : _info.bldg_no)
                            ,_street_address    = (isUD(_info) ? "" : _info.street_address)
                            ,_city              = (isUD(_info) ? "" : _info.city)
                            ,_state             = (isUD(_info) ? "" : _info.state)
                            ,_zip_code          = (isUD(_info) ? "" : _info.zip_code)
                            ,_country           = (isUD(_info) ? "" : _info.country)
                            ,_address           = (isUD(_info) ? "" : (_bldg_no + " " + _street_address +","+" "+_city +","+" "+_state +" "+ _zip_code+","+" "+ _country));
                        $("#shipToId").text(_address);
                        gSiteId = this.val();
                        _showPSNDetails();
                    }
                    
                    
                });
            }
        });
          
        _$frm.find("input[name*='date']").not("#send_update_to").datepicker({
             pickTime  : false
           , autoclose : true
           , todayHighlight: true
           , zIndexOffset: 500
        });
        _$frm.find("#psn_comment").summernote({
            height: 200,
            tabsize: 2,
            code: ''
            ,toolbar: [
                // [groupName, [list of button]]
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['font', ['strikethrough', 'superscript', 'subscript']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']]
              ]
        });
        _$frm.find("select, input").on("keyup change", function(){ 
            _$frm.find("#is_edited").val("Y");
        });
        
        markPSNMandatory();
    };

    //Private Functions
    function displayPSNDetails(){
        $("#gridPSNDetails").dataBind({ 
             sqlCode        : "O273"
            ,parameters     : {program_id : gProgId, site_id: gSiteId}
            ,width              : $(window).width()  
            ,height             : 200
            ,blankRowsLimit     : 0
            ,dataRows           : [
                {text:"Part Number"         ,width:130      ,style:"text-align:left" 
                    ,onRender: function(d){ 
                        return app.bs({type:"hidden", name:"order_part_dtl_id"       ,value: svn(d,"order_part_dtl_id")})
                            + app.bs({type:"hidden", name:"order_part_id"       ,value: svn(d,"order_part_id")})
                            + app.bs({type:"hidden", name:"is_mfg_to_cust"})
                            + app.bs({type:"hidden", name:"mfg_actual_ship_date"})
                            + svn(d,"oem_part_no");
                    }
                } 
                ,{text:"Quantity"          ,width:120     ,style:"text-align:left"
                    ,onRender: function(d){ 
                        return svn(d,"shipment_qty");
                    }
                }
                ,{text:"P.O Number"         ,width:130     ,style:"text-align:left"
                    ,onRender: function(d){ 
                        return svn(d,"po_no");
                    }
                }
                ,{text:"No. of Cartons"                   ,width:120     ,style:"text-align:left"
                    ,onRender: function(d){ 
                        return app.bs({type:"input",  name:"no_cartons"       ,value: svn(d,"no_cartons")});
                    }
                }
                ,{text:"Box Dimension(in)"                       ,width:120     ,style:"text-align:left"
                    ,onRender: function(d){ 
                        return app.bs({type:"input", name:"box_dimension"       ,value: svn(d,"box_dimension")});
                    }
                }
                ,{text:"Weight LB"                    ,width:120     ,style:"text-align:left"
                    ,onRender: function(d){ 
                        return app.bs({name:"weight_lb"       ,value: svn(d,"weight_lb")});
                    }
                }  
                ,{text:"Serial Number"         ,width:130     ,style:"text-align:left"
                    ,onRender: function(d){ 
                        return app.bs({type:"input"     ,name:"serial_no"   ,value: svn(d,"serial_no")});
                    }
                }
                ,{text:"Delivery Carrier"         ,width:160     ,style:"text-align:left"
                    ,onRender: function(d){ 
                        return app.bs({type:"input"     ,name:"delivery_carrier" ,value: svn(d,"delivery_carrier")});
                    }
                }
                ,{text:"Shipper No."         ,width:120     ,style:"text-align:left"
                    ,onRender: function(d){ 
                        return app.bs({type:"input"     ,name:"shipper_number"   ,value: svn(d,"shipper_number")});
                    }
                }
                ,{text:"Customer MRD"                  ,width:120     ,style:"text-align:left"
                    ,onRender: function(d){ 
                        return app.bs({type:"hidden", name:"shipment_date"})
                            + app.bs({type:"hidden", name:"shipment_by"})
                            + app.bs({type:"hidden", name:"psn_id"})
                            + svn(d,"customer_required_date").toShortDate();
                    }
                }
            ]
            ,onComplete: function(d){ 
                var _d = d.data.rows;
                this.find("input[name*='date']").datepicker({
                     pickTime  : false
                   , autoclose : true
                   , todayHighlight: true
                });
                markPSNDetailMandatory();
                if(_d.length > 0){
                    $("#btnSavePSN").show();
                }else{
                    $("#btnSavePSN").hide();
                }
            }
        }); 
    }
    function displayPSN(){
        var _accordId = "accrdPSNComments";
       // var g$tblPSN = $("#tablePSN");
        var _d = "";
        var _getPSNComments = function(cb){
                $.get(app.procURL + "psn_sel"
                ,function(data){
                     _d = data.rows[0];
                    if(cb) cb(data.rows);
                });
            }
            ,_setAccordionCard = function(){
                var _h = "";
                _h = gtw.new().accordionCard({ 
                           id       : _accordId
                          ,index    : ""
                          ,icon     : "comment-alt"
                          ,date     : ""
                          ,title    : gComments
                          ,content  : gComments
                      }).html(); 
                return _h;
            }
            ,displayPSNComments = function(){
                _getPSNComments(function(data){
                    var _$div = $("#psnComments")
                        ,_h = gtw.new().accordion({ 
                                 id         : _accordId
                                ,title      :"Comments"
                                ,onclick    :"psn.showModalPSNComments()" 
                                ,cards      : _setAccordionCard()
                            }).html();
                        
                    _$div.html(_h);  
                    
                    if(gComments.length > 0){
                        _$div.find(".panel-container").addClass("show");
                    }
                });
            };        
        
        displayPSNComments();

    }  
    function getTemplates(){
        new zsi.easyJsTemplateWriter("body")
        .bsModalBox({
              id        : gMdlAddComments
            , sizeAttr  : "modal-md"
            , title     : "Add Comment(s)"
            , body      : gtw.new().modalBodyAddComments({}).html()
            , footer    :'<div class="pull-left"><button type="button" onclick="psn.addComment();" class="btn btn-primary"><i class="far fa-plus"></i> Add Comment</button></div>'
        });
        
    } 
    function markPSNMandatory(){
        $("#formPSN").markMandatory({       
          "groupNames":[
                {"names" : ["program_id","date_shipped","site_id"]}    
          ]      
          ,"groupTitles":[ 
                 {"titles" : ["Program","Date Shipped","Site"]}
          ]
        });    
    } 
    function markPSNDetailMandatory(){
        $("#gridPSNDetails").markMandatory({       
          "groupNames":[
                {
                     "names" : ["site_code","street_address","city","state","zip_code","country"]
                    ,"type":"M"
                }    
          ]      
          ,"groupTitles":[ 
                 {"titles" : ["Site Code","Street Address","City","State","ZIP Cod","Country"]}
          ]
        });    
    } 
    
    //Public Functions
    _public.addComment = function(){ 
        var _$frm       = $("#frm_modalWindowAddComments"); 
        var _comment    = _$frm.find("#comment").val();
        gComments       = _comment;
        g$tblPSN.find("#psn_comment").val(gComments.replace(/<\/?[^>]+(>|$)/g, ""));
        displayPSN();
    };
    _public.showModalPSNComments = function(psnId){
        var _psnId = (psnId ? psnId : "");
        var _$mdl = $("#" + gMdlAddComments);
        _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        _$mdl.find(".modal-title").text("Add Comment » " );
        _$mdl.find(".modal-md").css("max-width", "500px");
        _$mdl.find("#psn_id").val(_psnId);
        _$mdl.find("#comment").val("");
        _$mdl.find("#comment").summernote({
            toolbar: [
                // [groupName, [list of button]]
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['font', ['strikethrough', 'superscript', 'subscript']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']]
              ]
        });
    };
    
    //Buttons
    $("#btnSavePSN").click(function () {
        var  _$frm = $("#formPSN")
            ,_$grid = $("#gridPSNDetails");
            
        if( _$frm.checkMandatory()!==true) return false;
        if( _$grid.checkMandatory()!==true) return false;
        
        _$frm.jsonSubmit({
             procedure: "psn_upd"
            ,isSingleEntry: true
            ,onComplete: function (data) {
                g$tblPSN.find("#psn_id").val(data.returnValue);
                $("#psnDetailsContainer").css("display", "block");
                displayPSNDetails(data.returnValue);
            }        
        });
    });
    $("#btnSavePSNDetails").click(function () {
       $("#gridPSNDetails").jsonSubmit({
                 procedure: "psn_details_upd"
                ,onComplete: function (data) {
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    displayPSNDetails($("#gridPSNDetails").data("psnId"));
                }
        });
    });
    $("#btnReset").click(function () {
        gProgId = "";
        gSiteId = "";
        var _$frm = $("#formPSN");
        _$frm.find("input,select, textarea").val("");
        $("#shipToId").text("");
        _$frm.find("#psn_comment").summernote("code", "");
    });
    
    return _public;
})();






                