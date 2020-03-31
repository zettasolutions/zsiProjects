  var db=(function(){
        var      bs             = zsi.bs.ctrl
                ,svn            = zsi.setValIfNull 
                ,bsButton       = zsi.bs.button 
                ,_pub           = {}
                ,gProgId        = null
                ,gProgCode      = ""
                ,gOEMId         = null
                ,gOEMName       = ""
                ,gOrderListData = []
                ,gOrderQty      = null
                ,gSumTotal      = 0 
                ,gIsSearch      = false
                ,gSearchCol     = ""
                ,gSearchVal     = "";
                /**/
        String.prototype.formatAMPM = function() {
            var _date=new Date();
            var hours = _date.getHours();
            var minutes = _date.getMinutes();
            var ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0'+minutes : minutes;
            var strTime = hours + ':' + minutes + ' ' + ampm;
            return _date.getMonth()+1 + "/" + _date.getDate() + "/" + _date.getFullYear() + " " + strTime;
        },
        zsi.ready = function(){  
            console.log("db");
            $(".page-title").html("Dashboard"); 
            var _$filterOem  = $("#filterCulomns").find("[name='oem_id']");  
            $("#filterCulomns").find("#searchPo").attr("disabled",true);
            $("#filterCulomns").find("#btnSearchPO").attr("disabled",true); 
            _$filterOem.dataBind({
                sqlCode     : "D194" //dd_user_oems_sel
                //,parameters : {user_id : userId}
                ,text       : "oem_name"
                ,value      : "oem_id" 
            });
            
            $("#dd_search_id").fillSelect({
                data: [
                     { text: "PO No.", value: "po_no" }
                    ,{ text: "Harness P/N", value: "oem_part_no" }
                    ,{ text: "Customer", value: "customer" }
                    ,{ text: "Site Code", value: "site_code" }
                ]
                ,onChange : function(){   
                    setSearch($(this).val()); 
                }
                ,onComplete : function(){
                    $(this).filter(function(){ return $.trim($(this).text()) == "PO No." }).attr('selected', true);
                    $("option:nth-child(2)", this).attr("selected", true); 
                    if($(this).children("option:selected"). val() == "po_no"){
                        $("#searchPo").attr("placeholder", $(this).val().replace(/_/g," "));
                        $("#filterCulomns").find("#searchPo").removeAttr("disabled",true) ;  
                    } 
                   
                }
            });
             setSearch();
            displayOrders();
            validation1();
            validation2(); 
        },
        //return PUBLIC functions
        _pub.getGlobals = function() {
            return {
                program_id : gProgId,
                program_code : gProgCode,
                oem_id : gOEMId,
                oem_name :gOEMName,
                is_search : gIsSearch,
                search_col : gSearchCol,
                search_val : gSearchVal
            };
        },
        _pub.displayModal = function(page){
            $.get(app.getPageURL(page), function(html){
                if($("script[src*='"+ page +"']").length){
                    $("script[src*='"+ page +"'], div#" + page).remove();
                }
                $("#js-page-content").append(html);
                //if(zsi.ready) zsi.ready();
            });
        },
        _pub.showModalPop1 = function(progId,oemId,oemName,progCode) {
            gProgId = progId;
            gProgCode = progCode;
            gOEMId = oemId;
            gOEMName = oemName;
            gIsSearch = false;
            gSearchCol = "";
            gSearchVal = "";
            
            db.displayModal("dashboardpop1",gProgId);
        }; 
        _pub.showRedBorder = function(obj,event){  
            var _$form = $("#frm_modalWindowRedBorder").find(".modal-body");  
                g$mdl = $("#modalWindowRedBorder"); 
                g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });  
                _$form.css('height', '450px'); 
                _$form.find("#order_part_id").val();
                _$form.find("#red_border_id").val();
                _$form.find("#red_border_no").val();
                _$form.find("#red_border_date").datepicker({ 
                      pickTime  : false
                    , autoclose : true
                    , todayHighlight: true
                });
                _$form.find("#comment").val();
        };
        
        //return functions: 
        function displayOrders(oemId,progId){ 
            var _dataRows = [
                {text: "OEM"     ,type:"input"      ,name:"oem_name"    ,width : 400       ,style : "text-align:center" ,sortColNo: 1 }
                ,{text: "Program"                                       ,width : 400       ,style : "text-align:center" ,sortColNo: 2
                    ,onRender : function(d){ 
                        var _link = "<a href='javascript:void(0)' class='pl-1' onclick='db.showModalPop1(\""+ app.svn (d,"program_id") +"\",\""+ app.svn (d,"oem_id") +"\",\""+ app.svn (d,"oem_name") +"\",\""+ app.svn (d,"program_code") +"\")'>"+ app.svn (d,"program_code") +"</a>";
                        return (d !== null ? _link : ""); 
                    }
                } 
            ]; 
            if (app.userInfo.role_id !== 5) {//shipment. program Coordinator
                _dataRows.push(
                    {text: "Program Coordinator"  ,type:"input"    ,width : 200       ,style : "text-align:center" ,sortColNo: 3
                        ,onRender: function(d){ 
                            return bs({name:"program_coordinator"    ,value: app.svn(d,"program_coordinator") ,style : "text-align:center"}); 
                        }
                    });
            }
            
            _dataRows.push(
                {text: "Manage Program"            ,width : 100             ,style : "text-align:center"
                     ,onRender : function(d){  
                         var params = ['#p','oem', app.svn(d,"oem_id"), app.svn(d,"program_id") ].join("/") ; 
                         return (d !== null ? '<a href="' + params + '">'+ '<i class="fas fa-link link"></i>' + "</a>" : "");
                     }
                }
                ,{text: "Created Date"              ,width : 150      ,style : "text-align:center"    
                    ,onRender: function(d){ 
                        return bs({name:"created_date"    ,value: app.svn(d,"created_date").split(" ")[0] ,style : "text-align:center"}); 
                    }
                }
                ,{text: "Updated Date"     ,width : 150      ,style : "text-align:center"    
                    ,onRender: function(d){ return bs({name:"updated_date"    ,value: app.svn(d,"updated_date").toShortDate() ,style : "text-align:center"});}
                }   
            );
            
            $("#gridOrders").dataBind({ 
                 sqlCode           : "U243" //user_programs_sel
                ,parameters        : {program_id: progId ,oem_id: oemId}
                ,width             : $(".zContainer").width()
                ,height            : $(window).height() - 300
                ,dataRows          : _dataRows 
                ,onComplete : function(d){
                    var _zRow = this.find(".zRow"); 
                    _zRow.find("input[type='text']").attr('readonly',true);    
                }
            });
        }   
        function getFilters(){
           var  _$filter    = $("#frm_modalMoreInfo").find(".modal-body") 
                ,_$fbpId    = _$filter.find("#filter_build_phase_id").val()
                ,_$fstId    = _$filter.find("#filter_order_status_id").val()
                ,_$fcId     = _$filter.find("#filter_customer_id").val()
                ,_$fplant   = _$filter.find("#filter_plants").val() 
            ; 
            return {
                 bpId       : _$fbpId
                ,statusId   : _$fstId
                ,customerId : _$fcId 
            };
        } 
        function showOrdersLists(searchCol,searchVal){  
            gProgId = null;
            gProgCode = "";
            gOEMId = null;
            gOEMName = "";
            gIsSearch = true;
            gSearchCol = searchCol;
            gSearchVal = searchVal;

            db.displayModal("dashboardpop1");
        }
        function setSearch(searchCol){
            if(isUD(searchCol)) searchCol = "po_no"; 
            $("#btnSearchPO").click(function(){ 
                var _searchVal = $.trim($("#searchPo").val()); 
                if(_searchVal!==""){
                    zsi.getData({
                         sqlCode : "O181" //order_list_sel
                        ,parameters: {search_col: searchCol,search_val:_searchVal} 
                        ,onComplete : function(d) {
                            if(d.rows.length > 0){
                                showOrdersLists(searchCol,_searchVal);
                            }
                        }
                    });
                }
            }); 
         } 
        function validation1(){
             var _$filter = $("#filterCulomns"); 
            _$filter.find("#dd_search_id").change(function(){  
                if($(this).val() !==""){  
                    _$filter.find("#searchPo").attr("placeholder", ($(this).val() ==="oem_part_no" ? "Harness P/N" : $(this).val().replace(/_/g," ") ));
                    _$filter.find("#searchPo").removeAttr("disabled");  
                }else{ 
                    _$filter.find("#searchPo").attr("disabled",true) ; 
                    _$filter.find("#searchPo").val("").attr("placeholder", "Enter Keyword"); 
                    _$filter.find("#btnSearchPO").attr("disabled",true) ; 
                } 
            });  
        } 
        function validation2(){ 
            var _$filter = $("#filterCulomns"); 
            $("#searchPo").keyup(function(){  
                if($(this).val() !==""){
                    _$filter.find("#btnSearchPO").removeAttr("disabled"); 
                }else{
                    _$filter.find("#btnSearchPO").attr("disabled",true) ; 
                }
            });
        }   
        
        //jquery event functions:
        $("#btnGo").on("click",function(){ 
            var _$filter = $("#filterCulomns") 
                ,_$oemId = _$filter.find("[name='oem_id']").val() 
                ,_$progId= _$filter.find("[name='program_id']").val() 
            ; 
            displayOrders(_$oemId,_$progId); 
        }); 
        $("#btnClear").on("click",function(){  
            var _$filterCulomns = $("#filterCulomns");    
            _$filterCulomns.find('#dd_search_id').val(" ");  
            _$filterCulomns.find("#searchPo").val(' ').attr("disabled",true);  
            _$filterCulomns.find("#oem_id").val(' '); 
            
            displayOrders();
        }); 
        $("#btnSaveRedBorder").click(function () { 
            var _$grid  = $("#frm_modalWindowRedBorder");   
            _$grid.jsonSubmit({
                 procedure: "red_border_upd"
                ,optionalItems: ["is_active"] 
                ,onComplete: function (data) {
                    if(data.isSuccess===true) zsi.form.showAlert("alert");  
                    $("#modalBodyRedBorder").trigger("refresh") ;
                }
            });
        });
        
       
         
    return _pub;
})();           
           
           
           
                                                                                                                    
                                                                                                                                                                                                                           