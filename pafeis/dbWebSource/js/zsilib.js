var  ud='undefined'
    ,zsi= {
         __getTableObject           : function(o){
            var arr = zsi.__tableObjectsHistory;
        	var r={};
        	if( o.attr("id") ){
                for(var x=0;x<arr.length;x++){
                   if(arr[x].tableName.toLowerCase()===o.attr("id").toLowerCase()  ){
                       r=arr[x];
                       break;
                   }
                }
        	}
            return r.value;
        }
        ,__initFormAdjust           : function(){
           /*adjustment form with search*/
           var searchIcon=$(".form-group .glyphicon-search");
           if(searchIcon.length>0){
              $(document.body).css("margin-left","10px");
              $(document.body).css("margin-right","10px");
           }
        }
        ,__initTabNavigation        : function(){
           $(".nav-tabs li").each(function(){
              $(this).click(function(){
                 $(".nav-tabs li").removeClass("active");
                 $(this).addClass("active" );
                  var l_a=$(this).children("a")[0];
                  $("#p_tab").val(l_a.id);          
                  var l_clsTabPagesName =".tab-pages";
                  var l_tab = $( l_clsTabPagesName + " #" + l_a.id);
        
                  l_tab.parent().children().each(function(){
                    $(this).removeClass("active");
                  });
                  l_tab.addClass("active" );
                  
              });
        
           });
        }
        ,__monitorAjaxResponse      : function(){
            $(document).ajaxStart(function(){});      
            $( document ).ajaxSend(function(event,request,settings) {
                if(typeof zsi_request_count === ud) zsi_request_count=0;
                
                var eAW = zsi.config.excludeAjaxWatch;    
                for(var x=0; x<eAW.length;x++){
                    if(zsi.strExist(settings.url, eAW[x] ) ) return;
                }
                zsi_request_count++;
                zsi.ShowHideProgressWindow(true);
            });
        
           $(document).ajaxComplete(function(event,request,settings) {
              if(typeof zsi_request_count !== ud){
                 zsi_request_count--;
                 if(zsi_request_count<=0){
                    //console.log("no remaining request");
                    CloseProgressWindow();
                 }
              }
           });   
        
           $(document).ajaxSuccess(function(event,request,settings){
              //console.log("zsi.Ajax.Request Status=Success, url: "+ settings.url);
           });      
           
           $(document).ajaxError(function(event, request, settings ){  
              var error_url = (typeof zsi.config.errorUpdateURL!== ud? zsi.config.errorUpdateURL:"")  ;
              var noErrURLMsg = "No error URL found. Error not submitted.";
              var retryLimit=0;
              var errorObject = {};
              errorObject.event =event;
              errorObject.request =request;
              errorObject.settings =settings;
              
              CloseProgressWindow();
        
              if(error_url){
                  if( zsi.strExist(settings.url,error_url) ){
                     console.log("url: " + settings.url);         
                     return false;
                  }
              }
              if(typeof zsi.config.sqlConsoleName !== ud){
                  if( zsi.strExist(settings.url,zsi.config.sqlConsoleName) ){return false;}
              }
              
              if(request.responseText===""){
                 console.log("zsi.Ajax.Request Status = %cNo Data (warning!) %c, url: " + settings.url, "color:orange;", "color:#000;");  
                if(error_url==="")
                    console.log(noErrURLMsg);
                else
                     $.post( 
                         error_url
                        ,{
                            p : "error_logs_upd @error_type='W' @error_msg='No Response Data' @page_url='" + escape(settings.url) + "'"
                        } 
                        ,function() {
                            console.log( "Warning submited." );
                        }
                    );             
              }
              else{
                 console.log("zsi.Ajax.Request Status = Failed %c, url: " + settings.url, "color:red;", "color:#000;");
                 console.log(errorObject);              
                 
                 if(!settings.retryCounter ) settings.retryCounter=0;
                 settings.retryCounter++;
        
                 if(settings.retryCounter<=retryLimit){                
                    setTimeout(function(){
                       console.log("retry#:" + settings.retryCounter);                 
                       $.ajax(settings);
                    },1000);
                 }
                 if(settings.retryCounter>retryLimit){
                    console.log("retry limit is reached");
                    
                    if(error_url===""){
                        console.log(noErrURLMsg);
                        zsi.ShowErrorWindow();
                    }
                    else
                        $.post( 
                             error_url
                            ,{
                                p : "error_logs_upd @error_type='E',@error_msg='" +  escape(request.responseText) + "',@page_url='"  +  escape(settings.url) + "'"   
                            }  
                            ,function() {
                                console.log( "Error submited." );
                                zsi.ShowErrorWindow();                       
                            }
                        );                
                    
                 }
              }
           });         
           
           function CloseProgressWindow(){
              setTimeout(function(){
                 if(typeof zsi_request_count!==ud){
                    if(zsi_request_count<=0){
                       zsi.ShowHideProgressWindow(false);
                       zsi_request_count=0;
                    }
                 }
              },100);      
           }
        }
        ,__setExtendedJqFunctions   : function(){
            $.loadData              = function(o){
                if(typeof zsi.config.getDataURL===ud){
                    alert("zsi.config.getDataURL is not defined in AppStart JS.");
                    return;
                }
                var params ={
                   dataType : "json"
                  ,cache    : false
                  ,success: o.onComplete
                    
                };
                params.type = (typeof o.type === ud ?"POST":"GET");
                params.url = zsi.config.getDataURL ;
                if(typeof o.data!==ud) params.data = JSON.stringify(o.data);
                $.ajax(params);
            };
            $.fn.addClickHighlight  = function(){
                var $tr = this.find("tbody > tr");
                $tr.unbind("click");
                $tr.click(function(){
                   $tr.removeClass("active");
                   $(this).addClass("active"); 
                });    
                return this;
            };
            $.fn.center             = function(){
                this.css("position","fixed");
                this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + $(window).scrollTop()) + "px");
                this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + $(window).scrollLeft()) + "px");
                return this;
            };
            $.fn.centerWidth        = function(){
                this.css("position","fixed");
                this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + $(window).scrollLeft()) + "px");
                return this;
            };
            $.fn.checkValueExists   = function(o,isNotExistShow){
                var self  =  this;
                if(typeof self.tmr === ud) self.tmr = null;
                if( typeof isNotExistShow === ud )  isNotExistShow=false;
                this.keyup(function(){
                  var l_obj=this;
                  if($.trim(this.value)===""){
                     showPopup(l_obj,false);                  
                     return false;
                  }
                  var l_value=$.trim(this.value);
                  if(zsi.timer) clearTimeout(zsi.timer);
                  zsi.timer = setTimeout(function(){              
                     $(l_obj).addClass("loadIconR" );
                     $.getJSON(base_url + "sql/exec?p=" + (typeof o.procedureName !== ud ? o.procedureName : "checkValueExists") +  " @code='" + o.code + "',@colName='" +  o.colName + "',@keyword='" +  l_value + "'"
                        , function(data) {
                              $(l_obj).removeClass("loadIconR" );
                              if(data.rows[0].isExists.toUpperCase() ===(isNotExistShow?"N":"Y")) {
                                 showPopup(l_obj,true);                  
                              }
                              else{
                                 showPopup(l_obj,false);                  
                              }
                          }
                     );
            
                  }, 1000);         
               
               });
               
               function showPopup(o,isShow){
                  if(isShow){
                    $(o).popover({
                        placement   : 'right'
                        ,content    :  (isNotExistShow ? "Data does not exist." : "Data already exist.")
                    });
                    $(o).popover('show');
                    $(o).addClass("has-error");
                    if(zsi.search) zsi.search.Panel.show(false);
                  }
                  else{
                     $(o).removeClass("has-error");
                     $(o).popover('destroy');
                  }

               }
            };
            $.fn.clearGrid          = function(){
                var _panel = ".zGridPanel";
                if(this.find(_panel).length >0)
                    this.find(_panel + " .zRows #table").html("");
                else 
                    $(this).children('tbody').html('');
            };
            $.fn.clearSelect        = function() {
                this.html("");
            };
            $.fn.createZoomCtrl     = function(){
                this.zmVal  = 1;
                var self = this;
                var _onZoom = function(isIn){
                    var inVal = 0.1;
                    var getVal  =   function(){
                        if(isIn)
                            self.zmVal =  self.zmVal + inVal;
                        else 
                            self.zmVal =  self.zmVal - inVal;
                        return self.zmVal;
                    };
                    self.css({transform : "scale(" + getVal() + ")"});
                };
                var $p = this.parent();
                $p.append(
                    "<div class=\"zoomCtrl\">"
                        +"<button id=\"zoomIn\" type=\"button\" class=\"btn btn-default btn-sm\" >"
                           +"<span class=\"glyphicon glyphicon-zoom-in\" aria-hidden=\"true\"> </span>"
                        +"</button>"
                        
                        +"<button id=\"zoomOut\" type=\"button\" class=\"btn btn-default btn-sm\" >"
                           +"<span class=\"glyphicon glyphicon-zoom-out\" aria-hidden=\"true\"></span>"
                        +"</button>"
                    +"</div>"
                );
                
                var x =  $p.find("#zoomIn,#zoomOut").click( function(){
                    if(this.id.toLowerCase() === "zoomin") _onZoom(true); else _onZoom(false);
                });
            };
            $.fn.dataBind           = function(){
                var a = arguments;
                var p=a[0];
                if(this.hasClass("zGrid")) return $(this).dataBindGrid(p);

                //dropdownlist
                if(typeof a[0] ==="string"){
                     p={}; p.url = zsi.config.baseURL + "selectoption/code/" + a[0]; 
                    if(typeof a[1] !==ud) p.onComplete = a[1];
                }
                var obj=this;
               $.getJSON(p.url, function( _data ) {
                    var _params ={
                           data             : _data.rows
                          ,selectedValue    : p.selectedValue
                          ,isRequired       : p.required
                          , onComplete      : p.onComplete
                    };
                    if(typeof p.text !== ud && typeof p.value !== ud ){
                        _params.text  = p.text;
                        _params.value = p.value;
                    }
                    obj.fillSelect(_params);
                    if(p.isUniqueOptions===true)  obj.setUniqueOptions();
               });
               return this;
            };

            $.fn.dataBind2 = function(){
                var _curHid,_curSpan;
                var _ctrlId= this.attr("name") + "_ddl";
                var _jCtrlId = "#" + _ctrlId;
                $("body").append('<select id="' + _ctrlId + '" class="zDDList" size="15" ></select>');
                var a = arguments;
                var p=a[0];
                //dropdownlist
                if(typeof a[0] ==="string"){
                     p={}; p.url = zsi.config.baseURL + "selectoption/code/" + a[0]; 
                    if(typeof a[1] !==ud) p.onComplete = a[1];
                }
                var obj=this;
                $.getJSON(p.url, function( _data ) {
                    var _params ={
                           data             : _data.rows
                          ,selectedValue    : p.selectedValue
                          ,isRequired       : p.required
                          , onComplete      : p.onComplete
                    };
                    if(typeof p.text !== ud && typeof p.value !== ud ){
                        _params.text  = p.text;
                        _params.value = p.value;
                    }
                    $(_jCtrlId).fillSelect(_params);
                    //if(p.isUniqueOptions===true)  obj.setUniqueOptions();
                    
                });
                this.parent().find(".zDdlBtn").click(function(){
                    var _p = $(this).parent();
                    _curHid =  _p.find(":hidden");
                    _curSpan = _p.find("#text");
                    _select =   $(_jCtrlId);
                    _select.val(_curHid.val())
                    .css({
                        display:"block"
                        ,top:_p.offset().top + _p.innerHeight()
                        ,left:_p.offset().left
                    }).focus();
            
                    var _option = _select.find('[value="' + _curHid.val() + '"]');
                    if(_option.length > 0){
                        var _optionTop = _option.offset().top;
                        var _selectTop = _select.offset().top;
                        _select.scrollTop(_select.scrollTop() + (_optionTop - _selectTop));
                    }
                    else _select.scrollTop(0); 
                });  
            
                $(_jCtrlId).click(function(){
                    var _self = $(this);
                    _curHid.val( _self.val() );
                    _curSpan.html( _self.find("option:selected").text() );
                    _self.css({display:"none"});
                }).keyup(function(e){
                	var k = (e.keyCode ? e.keyCode : e.which);
                	if(k == '13'){
                	     $(this).css({display:"none"});
                	}
                });
                
                this.closest(".zGrid").on('wheel mouseup', function(e){
                    var _e = $(".zDDList");
                    if (!_e.is(e.target) && _e.has(e.target).length === 0) {
                        _e.hide();
                    }
                });  
               return this;
            }; 

            $.fn.deleteData         = function(o){
                var ids = "";
                var cb = this.find("input[name='cb']:checked");
                var data = cb.getCheckBoxesValues();
                for (var x = 0; x < data.length; x++) {
                    if (ids !== "") ids += "/";
                    ids += data[x];
                }
                if (ids !== "") {
                    if (confirm("Are you sure you want to delete selected items?")) {
                        $.post(base_url + "sql/exec?p=deleteData @pkey_ids='" + ids + "',@table_code='" + o.code + "'", function (d) {
                            o.onComplete(d);
                        }).fail(function (d) {
                            alert("Sorry, the curent transaction is not successfull.");
                        });
                    }
            
                }
            };
            $.fn.expandCollapse     = function(o){
                this.click(function(){ 
                    //console.log(_afterInitFunc);
                    var obj =this;
                    var span = $(this).find("span");
                    var spanCls ="";
                    
                    if(span.attr("class").indexOf("down") >-1)
                         span.removeClass("glyphicon glyphicon-collapse-down").addClass("glyphicon glyphicon-collapse-up");
                    else
                         span.removeClass("glyphicon glyphicon-collapse-up").addClass("glyphicon glyphicon-collapse-down");
                
                    var tr = $(this.parentNode.parentNode);
                    if(typeof tr.attr("extrarow") === ud ) {
                
                            tr.attr("extrarow","1");
                            tr.after("<tr class='trOpen extraRow " + tr.attr("class") + "'> <td colspan='" + tr.find("td").length + "'> "  + o.onInit(obj) +  " </td></tr>");
                            o.onAfterInit(tr.next());
                            
                    }else{
                       // contentFunc(obj); 
                        var trNext = tr.next();
                        if(trNext.attr("class").indexOf("trOpen")>-1) 
                            trNext.removeClass("trOpen").addClass("trClose");
                        else
                            trNext.removeClass("trClose").addClass("trOpen");
                    }
                   
                });
                
                return this;
            };
            $.fn.fillSelect         = function(o){
                var $ddl = this;
                if(typeof o.isRequired ===ud)  o.isRequired=false;
                if(typeof o.selectedValue ===ud)  o.selectedValue="";
                this.clearSelect();
                
               if(o.isRequired===false){
                   $ddl.append('<option></option>');
               }
               $.each(o.data, function(index, optionData) {
                    var _value2 = (typeof this.value2===ud ? "": " value2=\"" +  this.value2 + "\"");
                    var _text ="",_value = "";
                    if(typeof o.text !== ud && typeof o.value !== ud ){
                        _value = this[o.value];
                        _text = this[o.text];            
                    }else{
                        _value = this.value;
                        _text = this.text;
                    }
                    
                    $ddl.append("<option " + _value2 + " value=\""  + _value +  "\">"  + _text + " </option>");
               });    
                   
               setTimeout(function(){              
                    $.each($ddl,function(){
                        var _selectedValue  = $(this).attr("selectedvalue");
                        $.each($(this).find("option"),function(){
                            var _r=false;
                            if(_selectedValue)
                                _r=(this.value === _selectedValue); 
                            else
                                _r=(this.value === o.selectedValue); 
                            if(_r) $(this).prop("selected",true);            
                        });             
                    }); 
                    if(o.onComplete) o.onComplete(o.data);
               }, 10);   
               return this;
            };
            $.fn.getCheckBoxesValues= function(){
                var arrayItems = [];
                if(this){
                    $.each(this,function(){
                        arrayItems.push( $(this.parentNode).children("input[type=hidden]").val() );
                    });
                }
                return arrayItems;    
            };
            $.fn.jsonSubmit         = function(o) {
                var p = {
                    type: 'POST'
                  , url: (typeof o.url!==ud?o.url:base_url + "data/update")
                  , data: JSON.stringify(  this.find(".left").length > 0 ? this.toJSON2(o) :this.toJSON(o) )
                  , contentType: 'application/json'
                };
            
                if (typeof o.onError !== 'undefined') p.error = o.onError;
                if (typeof o.onComplete !== 'undefined') p.success = o.onComplete;
                $.ajax(p);
            };
            $.fn.loadData           = function(o){
                var __obj = this;
                zsi.__setTableObjectsHistory(__obj,o);
                
                var isOnEC= (typeof o.onEachComplete !== ud);
                if (isOnEC){    
                    var strFunc = o.onEachComplete.toString();
                  args = strFunc
                  .replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s))/mg,'')
                  .match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1]
                  .split(/,/);
                  var cbName="callback Function";
                  if(args.length < 1) console.warn("you must implement these parameters: tr,data");
                }
            
                if (typeof o.sortIndexes !== ud && zsi.__getTableObject(__obj).isInitiated===false){
                    var indexes=o.sortIndexes;
                    var ths  = __obj.find("thead th");
                    if(ths.length ===0) console.log("No THead found.");
                    var arrowUp ="<span class='arrow-up'></span>"
                    var arrowDown ="<span class='arrow-down'></span>"
                    var arrows =arrowUp + arrowDown;
                    for(var x=0; x< indexes.length;x++){
                        var th =  ths[indexes[x]];
                        $(th).append("<span class='zSort'>"
                                + "<a href='javascript:void(0);'>"
                                    + "<span class='sPane'>" + arrows + "</span>"
                                + "</a>"
                                + "</span>");
                    }
                    var aObj =  __obj.find(".zSort a");
                    var url = o.url; 
                    
                    aObj.click(function(){
                        var i = aObj.index(this);
                        zsi.table.sort.colNo =indexes[i]
                        
                        var val = this.text; 
                        $(".sPane").html(arrows);
                        
                        var className = $(this).attr("class");
                        
                        if(typeof className ===ud) { 
                            aObj.removeAttr("class");
            
                            $(this).addClass("asc")
                            $(this).find(".sPane").html(arrowUp)
                        }else{
                            if(className.indexOf("asc") > -1){
                                $(this).removeClass("asc")
                                $(this).addClass("desc")
                                $(this).find(".sPane").html(arrowDown)
                                zsi.table.sort.orderNo=1;
                            }
                            else{
                                $(this).removeClass("desc")
                                $(this).addClass("asc")
                                $(this).find(".sPane").html(arrowUp)
                                zsi.table.sort.orderNo=0;
                            }
                        }
                        
                        zsi.table.__sortParameters =  "@col_no=" + zsi.table.sort.colNo + ",@order_no=" + zsi.table.sort.orderNo; 
                        
                        o.url = (url.indexOf("@") < 0? url + " " : url +"," )  + zsi.table.__sortParameters  + (zsi.table.__pageParameters===""?"":"," + zsi.table.__pageParameters);
                        __obj.loadData(o);
                    });
                }
                
            
                var l_grid = __obj;
                var num_rows=0;
                var ctr = 0;   
                var trItem= function(data){
                    var r = "";
                    
                    r +="<tr rowObj class='"  + zsi.getOddEven() + "'>";
                        for(var x=0;x<o.td_body.length;x++){
                            var _prop='';
                            if (typeof o.td_properties !== ud){
                                if (typeof o.td_properties[x] !== ud) _prop = o.td_properties[x]; 
                            } 
                            
                            var _content = "", _attr = "", _style = "", _class = "";
                            if(data) data.td = {};
                            
                            if(o.td_body[x])
                                _content = o.td_body[x](data);
                            else
                                console.log("%cArray item is not a function under td_body[]", "color:red;");                    
                            
                            if(data){
                                _attr  = (typeof data.td.attr  === ud ? "" : data.td.attr);
                                _style = (typeof data.td.style === ud ? "" : style = " style=\"" + data.td.style + "\" ");
                                _class = (typeof data.td.class === ud ? "" : style = " class=\"" + data.td.class + "\" ");
                            }
                            r +="<td " + _prop + _attr + _style + _class + " >" + _content + "</td>";                                                         
                        }
                    r +="</tr>";                           
            
                    l_grid.append(r);
                    var tr=$("tr[rowObj]");tr.removeAttr("rowObj"); 
                    if (isOnEC){
                        o.onEachComplete(tr,data);
                    }
                }
                if(typeof o.isNew !== ud){
                    if(o.isNew==true) l_grid.clearGrid();  
                } 
                
                if(o.url || o.data){
                  if( l_grid.find("thead").length > 0)  l_grid.clearGrid(); 
                    var params ={
                       dataType: "json"
                      ,cache: false
                      ,success: function(data){
                                    num_rows = data.rows.length;
                                    
                                    if(typeof o.td_body !==ud ){
                                        $.each(data.rows, function () {
                                            trItem(this)
                                        });
                                    }
                                    
                                    __obj.find("#recordsNum").html(num_rows);
            
                                    if(typeof zsi.page.__pageNo===ud ||  zsi.page.__pageNo===null){
                                       zsi.page.__pageNo=1;
                                       zsi.__setPageCtrl(o,o.url,data,__obj);
                                    }
                                    //set table initiated.
                                    zsi.__getTableObject(__obj).isInitiated=true;
                                    
                                    //add tr click event.
                                    __obj.addClickHighlight();
                                    
                                    if(o.onComplete) o.onComplete(data);
            
                            }          
                    }
                    
                    if(typeof o.data!==ud)  {
                        if(typeof zsi.config.getDataURL===ud){
                            alert("zsi.config.getDataURL is not defined in AppStart JS.");
                            return;
                        }
                        params.url = zsi.config.getDataURL ;
                        params.data = JSON.stringify(o.data);
                        params.type = "POST";
                    }
                    else params.url = o.url
            
                    __obj.bind('refresh',function() {
                        if(zsi.tmr) clearTimeout(zsi.tmr);
                        zsi.tmr =setTimeout(function(){              
                            __obj.loadData(o);
                        }, 1);   
                    });
            
                    $.ajax(params);
                }
                else if(typeof o.rows !== ud){
                    if(typeof o.td_body !==ud ){
                        $.each(o.rows, function () {
                            trItem(this)
                        });
                    }
                    if(o.onComplete) o.onComplete(data);
                    __obj.addClickHighlight();        
                }    
                else{
                    if(typeof o.limit === ud) o.limit=5;
                    for(var y=0;y<o.limit;y++){
                        trItem();
                    }
                    if (typeof o.onEachComplete === ud) if(o.onComplete) o.onComplete();
                    //add tr click event.
                    __obj.addClickHighlight();
            
                }
                
            };
            $.fn.loadData2          = function(o){
                this.arrowUp ="<span class=\"arrow-up\"></span>",
                this.arrowDown ="<span class=\"arrow-down\"></span>",
                this.arrows = this.arrowUp + this.arrowDown;   
                this.setPageCtrl = function(o,url,data,pTable){
                    var tr = data.returnValue;
                  
                    var opt ="";
                    for(var x=1;x<=tr;x++){
                        opt += "<option value='" + x + "'>" + x + "</option>";
                    }
                    var $pageNo = pTable.find("#pageNo").html(opt);
                    pTable.find("#recordsNum").html(data.rows.length);
                    pTable.find("#of").html("of " + tr);

                     
                    $pageNo.change(function(){
                        __obj.pageParams = ",@pno=" + this.value ;
                        if(__obj.params.url) __obj.params.url  = __obj.url + __obj.pageParams +  (typeof __obj.sortParams !== ud ? __obj.sortParams : "" );    
                        __obj.loadData2(__obj.params);
                    });
                }
                                    
                var __obj       = this
                    ,num_rows   = 0
                    ,ctr        = 0  
                    ,_gridWidth = 0
                    ,_ch        =o.columnHeaders
                    ,_headers
                    ,_tbl
                    ,_styles    = []
                    ,trItem     = function(data){
                        var r       = "";
                        
                        r +="<div rowObj class='zRow "  + zsi.getOddEven() + "'>";
                            for(var x=0;x<o.renderCells.length;x++){
                                var _content = "", _attr = "", _style = "", _class = "",_nd= (data===null ? " no-data ":"");
                                if(data) data.td = {};
                                
                                if(o.renderCells[x])
                                    _content = o.renderCells[x](data);
                                else
                                    console.log("%cArray item is not a function under renderCells[]", "color:red;");                    
                                
                                if(data){
                                    _attr  = (typeof data.td.attr  === ud ? "" : " " + data.td.attr);
                                    _class = (typeof data.td.class === ud ? "" : " " + data.td.class );
                                    _style = (typeof data.td.style === ud ? "" : " style=\"" + data.td.style + "\"" );
                                }
                          
                                r +="<div class=\"zCell" + _nd +  _class + "\"  " + _attr  + " style=\"width:" + (_styles[x].width ) +  "px;"  + _styles[x].style + "\" >" + _content + "</div>";                                                         
                            }
                        r +="</div>";                           
                
                        _tbl.append(r);
                        var tr=$("div[rowObj]");tr.removeAttr("rowObj"); 
                        if (isOnEC){
                            o.onEachComplete(tr,data);
                        }
                    }
                    ,setRowClickEvent = function(){
                        
                        var $rows = __obj.find(".zRow");
                        $rows.click(function(){
                            $rows.removeClass("active");
                            $(this).addClass("active");
                        });
                    }
                    ,renderColumnHeaders = function(d, id){
                        var  hasChild = function (d,id){
                            for(var x=0; x<d.length;x++ ){
                                if(d[x].groupId===id) return true;
                            }
                            return false;
                        };
                        var loadChild = function (d,id){
                            var h=""; 
                            for(var x=0; x<d.length;x++ ){
                                if(typeof d[x].groupId === ud ||  d[x].groupId==id ) { 
                                    var _hasSort = (typeof d[x].sortColNo !== ud ? true:false);
                                    
                                    var _minusSortWidth  = ( _hasSort ? 15:0);
                                    
                                    var _style = "",_styleTitle=""; 
            
                                    if(typeof _ch[x].width !==ud){
                                        _style = "style=\"width:" +  _ch[x].width  + "px;"  + _ch[x].style + "\"";
                                        _styleTitle = "style=\"width:" +  (_ch[x].width -  _minusSortWidth) + "px;"  + _ch[x].style + "\"";
                                    }
                                    
                                    h+= "<div class='item' " + _style + ">";
                                    h+= "<div  class='title " + ( _hasSort ? "hasSort":"") + "' " + _styleTitle + " >" + d[x].text +  "</div>"; 
                                    if(typeof d[x].groupId !== ud ) 
                                        h+= renderColumnHeaders(d,d[x].id) ;
                                    h+=renderSortHeader(d[x].sortColNo);
                                    h+= "</div>";
                                   
                                }
                            }
                            return h;
                        };
                        
            
                        return loadChild(d,id);
            
                    }
                    ,renderSortHeader = function(sortColNo){
             
                        if(typeof sortColNo !== ud )
                            return  "<div class=\"zSort\">"
                                    + "<a href=\"javascript:void(0);\" sortColNo=\"" + sortColNo + "\" >"
                                        + "<span class=\"sPane\">" + __obj.arrows + "</span>"
                                    + "</a>"
                                    + "</div>";
                        else return "";
                    }
                ;
            
                $.each(o.columnHeaders,function(){
                    if(this.groupId > 0 || typeof this.groupId ===ud){ 
                        _styles.push(this);
                    }
                });
            
            
                if(typeof this.isInitiated === ud){
                    var _footer =  "<div class=\"zPageFooter\"><div class='pagestatus'>Number of records in a current page : <i id='recordsNum'> 0 </i></div>"
                                +  "<div class='pagectrl'><label id='page'> Page </label> <select id='pageNo'></select>"
                                +  "<label id='of'> of 0 </label></div></div>";
                    this.params = o;
                    this.url = o.url;
                    this.isInitiated = true;
                    this.html(
                             "<div class=\"right\">"
                            +"<div class=\"zHeaders\"></div>"
                            +"<div class=\"zRows\">"
                                +"<div id=\"table\"  ></div>"
                            +"</div>"
                            +"<div class=\"zFooter\"></div>"                
                            +"</div>"  + (typeof o.isPaging !==ud ?  (o.isPaging===true ? _footer :"") :"")
                    );
                    this.css("overflow","hidden");
                    
                    if (typeof o.columnHeight  === ud) o.columnHeight = "30";
                    //this.find(".zHeaders").css("height",o.columnHeight );
                    _tbl = this.find("#table");
                    
                    
                    _headers = __obj.find(".zHeaders");
                    var _top =  "top:" + ((o.columnHeight / 2)-8) + "px;";
                    
                    for(i=0; i <_styles.length;i++){
                        _gridWidth += _styles[i].width;
                    }
                    if(typeof o.startGroupId === ud) o.startGroupId=0;
                    _headers.html(renderColumnHeaders(_ch,o.startGroupId));
                    _headers.append("<div>&nbsp;</div");
                    _headers.find(".item .zSort a").click(function(){
                        var  $a = $(this)
                            ,_colNo = $a.attr("sortColNo")
                            ,_orderNo =0
                            ,_oldClass = $a.attr("class")
                        ;
                        __obj.left=_tbl.offset().left;
                        __obj.find(".sPane").html(__obj.arrows);
                        
                        __obj.find(".zSort a").removeAttr("class");
                        $a.addClass(_oldClass);
                        
                        if(typeof $a.attr("class") === ud) $a.addClass("desc");
                        var className = $a.attr("class");
                        if(className.indexOf("asc") > -1){
                            $a.removeClass("asc");
                            $a.addClass("desc");
                            $a.find(".sPane").html(__obj.arrowDown);
                            _orderNo=1;
                        }
                        else{
                            $a.removeClass("desc");
                            $a.addClass("asc");
                            $a.find(".sPane").html(__obj.arrowUp);
                            _orderNo=0;
                        }
                        __obj.sortParams = ",@col_no=" + _colNo + ",@order_no=" + _orderNo;
                        if(__obj.params.url) __obj.params.url  = __obj.url + __obj.sortParams +  (typeof __obj.pageParams !== ud ? __obj.pageParams : "" );
                        
                        if(o.onSortClick) 
                            o.onSortClick(_colNo,_orderNo);
                        else 
                            __obj.loadData2(__obj.params);
                        
                    });
                    _headers.css("width",(_gridWidth + 20 ) + "px");
                    _tbl.css("width",(_gridWidth + 1 )  + "px");
            
                }
                else{
                    _tbl = this.find("#table");
                }
                
                var isOnEC= (typeof o.onEachComplete !== ud);
                if (isOnEC){    
                    var strFunc = o.onEachComplete.toString();
                  args = strFunc
                  .replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s))/mg,'')
                  .match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1]
                  .split(/,/);
                  var cbName="callback Function";
                  if(args.length < 1) console.warn("you must implement these parameters: tr,data");
                }
            
                if(typeof o.isNew !== ud){
                    if(o.isNew===true) _tbl.html("");  
                } 
                
                if(o.url || o.data){
                    
                    _tbl.html(""); 
                    var params ={
                       dataType: "json"
                      ,cache: false
                      ,success: function(data){
                                    var _ch,i,_trs;
                                    num_rows = data.rows.length;
                                    
                                    if(typeof o.renderCells !==ud ){
                                        $.each(data.rows, function () {
                                            trItem(this);
                                        });
                                        setRowClickEvent();
                                    }
                                    
                                    if(typeof o.blankRowsLimit !==ud ){
                                        for(var x=0; x < o.blankRowsLimit;x++){    
                                            trItem(null);
                                            setRowClickEvent();
                                        }
                                    }                                    

                                    _tbl.parent().scroll(function() {
                                        var _left = _tbl.offset().left ;
                                        var _headers = _tbl.closest(".right").find(".zHeaders");
                                        _headers.offset({left:_left});
                                    }); 
                                    
                                    //call onComplete callback.
                                    if(o.onComplete) o.onComplete(data);
                                    
                                    __obj.find("#recordsNum").html(num_rows);

                                    if(typeof __obj.pageParams === ud ) __obj.setPageCtrl(o,o.url,data,__obj);    

                                    //add tr click event.
                                    __obj.addClickHighlight();
                                    if(__obj.left) _tbl.parent().scrollLeft(Math.abs(__obj.left - 13));
            
                            }          
                    };
                    
                    if(typeof o.data!==ud)  {
                        if(typeof zsi.config.getDataURL===ud){
                            alert("zsi.config.getDataURL is not defined in AppStart JS.");
                            return;
                        }
                        params.url = zsi.config.getDataURL ;
                        params.data = JSON.stringify(o.data);
                        params.type = "POST";
                    }
                    else params.url = o.url
            
                    __obj.bind('refresh',function() {
                        if(zsi.tmr) clearTimeout(zsi.tmr);
                        zsi.tmr =setTimeout(function(){              
                            __obj.loadData(o);
                        }, 1);   
                    });
            
                    $.ajax(params);
                }
                else if(typeof o.rows !== ud){
                    if(typeof o.renderCells !==ud ){
                        $.each(o.rows, function () {
                            trItem(this)
                        });
                        setRowClickEvent();
                    }
                    if(o.onComplete) o.onComplete(data);
                    __obj.addClickHighlight();        
                }  
                else{
                    if(typeof o.limit === ud) o.limit=5;
                    for(var y=0;y<o.limit;y++){
                        trItem();
                    }
                    if (typeof o.onEachComplete === ud) if(o.onComplete) o.onComplete();
                    //add tr click event.
                    __obj.addClickHighlight();
            
                }
                
            };
            $.fn.dataBindGrid       = function(o){
                this.arrowUp ="<span class=\"arrow-up\"></span>",
                this.arrowDown ="<span class=\"arrow-down\"></span>",
                this.arrows = this.arrowUp + this.arrowDown;   
                this.clsPanelR = ".right";
                this.clsPanelL = ".left";
                this.setPageCtrl = function(o,url,data,pTable){
                    var tr = data.returnValue;
                  
                    var opt ="";
                    for(var x=1;x<=tr;x++){
                        opt += "<option value='" + x + "'>" + x + "</option>";
                    }
                    var $pageNo = pTable.find("#pageNo").html(opt);
                    pTable.find("#recordsNum").html(data.rows.length);
                    pTable.find("#of").html("of " + tr);

                     
                    $pageNo.change(function(){
                        __obj.pageParams = ",@pno=" + this.value ;
                        if(__obj.params.url) __obj.params.url  = __obj.url +  __obj.pageParams +  (typeof __obj.sortParams !== ud   ?  __obj.sortParams : "" );    
                        __obj.dataBindGrid(__obj.params);
                    });
                }
                                    
                var __obj               = this
                    ,__o                = o
                    ,num_rows           = 0
                    ,ctr                = 0  
                    ,_gridWidth         = 0
                    ,_gridWidthLeft     = 0
                    ,_gridWidthRight    = 0
                    ,_ch                = o.dataRows
                    ,_chRight           = []
                    ,_chLeft            = []                    
                    ,_headers
                    ,_tbl
                    ,_tableRight
                    //,dataRows
                    ,_styles            = []
                    ,_isGroup           = false
                    ,bs                 = zsi.bs.ctrl
                    ,svn                = zsi.setValIfNull
                    ,clearTables        = function(){
                         __obj.find("div[id='table']").html("");
                    }
                    ,createColumnHeader = function(o){
                        if(o.headers.length===0) return;
                        o.headers.html(getdataRows(o.dataTable,o.startGroupId));
                        if(_isGroup) o.headers.append("<div>&nbsp;</div");
                        o.headers.find(".item .zSort a").click(function(){
                            var  $a = $(this)
                                ,_colNo = $a.attr("sortColNo")
                                ,_orderNo =0
                                ,_oldClass = $a.attr("class")
                            ;
                            __obj.left=_tableRight.offset().left - _gridWidthLeft;
                            __obj.find(".sPane").html(__obj.arrows);
                            
                            __obj.find(".zSort a").removeAttr("class");
                            $a.addClass(_oldClass);
                            
                            if(typeof $a.attr("class") === ud) $a.addClass("desc");
                            var className = $a.attr("class");
                            if(className.indexOf("asc") > -1){
                                $a.removeClass("asc");
                                $a.addClass("desc");
                                $a.find(".sPane").html(__obj.arrowDown);
                                _orderNo=1;
                            }
                            else{
                                $a.removeClass("desc");
                                $a.addClass("asc");
                                $a.find(".sPane").html(__obj.arrowUp);
                                _orderNo=0;
                            }
                            __obj.sortParams = ",@col_no=" + _colNo + ",@order_no=" + _orderNo;
                            if(__obj.params.url) __obj.params.url  = __obj.url +  __obj.sortParams +  (typeof __obj.pageParams !== ud ?  __obj.pageParams : "" );
                            
                            if(o.onSortClick) 
                                o.onSortClick(_colNo,_orderNo);
                            else 
                                __obj.dataBindGrid(__obj.params);
                            
                        });
                        if(_isGroup || o.width > __o.width ) o.headers.css("width",(o.width + 20 ) + "px");
                        o.table.css("width",(o.width + 1 )  + "px");
                    }
                    ,trItem             = function(o){
                        
                        var _dt =  (o.panelType ==="R"? _chRight : _chLeft ); 
                        var _table =  (o.panelType ==="R"? __obj.find(__obj.clsPanelR).find("#table") : __obj.find(__obj.clsPanelL).find("#table") ); 
                        
                        var r       = "";
                        
                        r +="<div rowObj class='zRow "  + o.rowClass + "'>";
                            for(var x=0;x<_dt.length;x++){
                                var _content = "", _attr = "", _style = "", _class = "",_nd= (o.data===null ? " no-data ":"");
                                var _info = _dt[x]; 
                                if(o.data) o.data.td = {};
                                
                                if(_info.onRender)
                                    _content = _info.onRender(o.data);
                                else{
                                    if(typeof _info.type === ud)
    		                            _content = "<span class='text'>" + svn(o.data,_info.name)  + "</span>";
    		                        else{ 
    		                            
    		                            if(_info.textValue!==ud){
                                            _content = bs({    name      : _info.name  
                                                                ,type      : _info.type  
                                                                ,value     : svn(o.data ,_info.name ,_info.defaultValue ) 
                                                                ,textValue : svn(o.data  ,_info.textValue) 
                                                        });
    		                            }
    		                            else  _content = bs({name:_info.name  ,type:_info.type  ,value: svn(o.data  ,_info.name  ,_info.defaultValue )});
    		                        }
    		                         
    		                        if(x===0 || x ===__o.selectorIndex ){
    		                          if(typeof __o.selectorType !==ud) 
    		                                _content += (o.data !==null ? bs({name: (__o.selectorType ==="checkbox" ? "cb" :  (__o.selectorType==="radio" ? "rad" : "ctrl" )  ),type:__o.selectorType}) : "" );
    		                        }
                                }
                                
                                if(o.data){
                                    _attr  = (typeof o.data.td.attr  === ud ? "" : " " + o.data.td.attr);
                                    _class = (typeof o.data.td.class === ud ? "" : " " + o.data.td.class );
                                    _style = (typeof o.data.td.style === ud ? "" : " style=\"" + o.data.td.style + "\"" );
                                }
                                _class +=  (typeof _info.class !== ud ? " " +  _info.class : "");
                                

                                if( (typeof _info.groupId !== ud ?_info.groupId : 0)  > 0 || _info.onRender || _isGroup === false)
                                    r +="<div class=\"zCell" + _nd +  _class + "\"  " + _attr  + " style=\"width:" + (_dt[x].width ) +  "px;"  + _dt[x].style + "\" >" + _content + "</div>";
                            }
                        r +="</div>";                           
                
                        _table.append(r);

                        var tr=$("div[rowObj]");tr.removeAttr("rowObj"); 
                        if (isOnEC){
                            o.onEachComplete(tr,data);
                        }
                    }
                    ,setRowClickEvent   = function(){
                        
                        var $rows = __obj.find(".zRow");
                        $rows.click(function(){
                            var _i = $(this).index();
                            $rows.removeClass("active");
                             __obj.find(".zRow:nth-child("  + (_i + 1) +  ")").addClass("active");
                            //$(this).addClass("active");
                        });
                    }
                    ,setScrollBars      = function(){
                        _tableRight.parent().scroll(function() {
                            var _left = _tableRight.offset().left;
                            var _top = _tableRight.offset().top;
                            var _headers = _tableRight.closest(".right").find(".zHeaders");
                            var _tblLeft = $(this).closest(".right").prev().find("#table");
                            _headers.offset({left:_left});
                            _tblLeft.offset({top:_top});
                        });                         
                    }
                    ,getdataRows= function(d, id){
                        var  hasChild = function (d,id){
                            for(var x=0; x<d.length;x++ ){
                                if(d[x].groupId===id) return true;
                            }
                            return false;
                        };
                        var loadChild = function (d,id){
                            var h=""; 
                            for(var x=0; x<d.length;x++ ){
                                if(typeof d[x].groupId === ud ||  d[x].groupId==id ) {
                                    var _hasSort = (typeof d[x].sortColNo !== ud ? true:false);
                                    var _minusSortWidth  = ( _hasSort ? 15:0);
                                    var _style = "",_styleTitle="";
                                    var _level = (typeof d[x].groupId !==ud ? " group" + d[x].groupId : "" );
                                    var _class = (typeof d[x].class !==ud ? " " + d[x].class : "" );
                                    var _id = (typeof d[x].id !==ud ? "id=\"" + d[x].id + "\"" : "" );
                                    var _titleId = (typeof d[x].id !==ud ? "id=\"title" + d[x].id + "\"" : "" );
                                    var _groupItem = (_isGroup ? " groupItem" : "" );
                                    if(typeof d[x].width !==ud){
                                        _style = "style=\"width:" +  d[x].width  + "px;"  + d[x].style + "\"";
                                        _styleTitle = "style=\"width:" +  (d[x].width -  _minusSortWidth) + "px;"  + d[x].style + "\"";
                                    }
                                    
                                    h+= "<div " + _id + " class='item" + _groupItem + _level + _class + "' " + _style + ">";
                                    h+= "<div " + _titleId + " class='title" + ( _hasSort ? " hasSort":"") + "' " + _styleTitle + " ><span class=\"text\">" + d[x].text +  "</span></div>"; 
                                    if(typeof d[x].groupId !== ud ) 
                                        h+= getdataRows(d,d[x].id) ;
                                    h+=getSortHeader(d[x].sortColNo);
                                    h+= "</div>";
                                   
                                }
                            }
                            return h;
                        };
                        
            
                        return loadChild(d,id);
            
                    }
                    ,getSortHeader   = function(sortColNo){
             
                        if(typeof sortColNo !== ud )
                            return  "<div class=\"zSort\">"
                                    + "<a href=\"javascript:void(0);\" sortColNo=\"" + sortColNo + "\" >"
                                        + "<span class=\"sPane\">" + __obj.arrows + "</span>"
                                    + "</a>"
                                    + "</div>";
                        else return "";
                    }
                    ,isFreezeItem       = function(o){
                        return  ( ((typeof o.isFreeze === ud) ||  o.isFreeze ===false) ? false:true ); 
                    }
                    ,createBlankRows =  function(o){
                        if(typeof o.blankRowsLimit !==ud ){
                            for(var x=0; x < o.blankRowsLimit;x++){
                                var _cls = zsi.getOddEven();
                                trItem({data:null,panelType:"L",rowClass:_cls}); 
                                trItem({data:null,panelType:"R",rowClass:_cls});
                            }
                        } 
                    }
                ;
            
                $.each(o.dataRows,function(){
                    if(this.groupId > 0 || typeof this.groupId ===ud){ 
                        if(typeof this.groupId !==ud){ if(_isGroup===false) {_isGroup=true;}}
                        _styles.push(this);
                    }
                    
                    if( isFreezeItem(this) )
                        _chLeft.push(this);
                    else
                        _chRight.push(this);
                });
                


                if(typeof this.isInitiated === ud){
                    var _footer =  "<div class=\"zPageFooter\"><div class='pagestatus'>Number of records in a current page : <i id='recordsNum'> 0 </i></div>"
                                +  "<div class='pagectrl'><label id='page'> Page </label> <select id='pageNo'></select>"
                                +  "<label id='of'> of 0 </label></div></div>";
                    this.params = o;
                    this.url = o.url;
                    this.isInitiated = true;
                    this.html(
                             "<div class=\"zGridPanel left\">"
                                +"<div class=\"zHeaders\"></div>"
                                    +"<div class=\"zRows\">"
                                        +"<div id=\"table\"  ></div>"
                                    +"</div>"
                                    +"<div class=\"zFooter\"></div>"                
                                +"</div>"
                             +"</div>"
                             +"<div class=\"zGridPanel right\">"
                                +"<div class=\"zHeaders\"></div>"
                                    +"<div class=\"zRows\">"
                                        +"<div id=\"table\"  ></div>"
                                    +"</div>"
                                    +"<div class=\"zFooter\"></div>"                
                                +"</div>"
                             +"</div>"
                            
                            + (typeof o.isPaging !==ud ?  (o.isPaging===true ? _footer :"") :"")
                    );
                    
                    o.isAsync = (typeof o.isAsync !== ud ? o.isAsync : false);
                    __obj.curPageNo = (o.isAsync ===true?1:0);
                    
                    var _panelRight = this.find(__obj.clsPanelR);
                    var _panelLeft = this.find(__obj.clsPanelL);
                    
                    var _top =  "top:" + ((o.columnHeight / 2)-8) + "px;";
                    
                    for(i=0; i <_styles.length;i++){
                        _gridWidth += _styles[i].width;
                        
                        if(isFreezeItem(_styles[i]))   
                            _gridWidthLeft += _styles[i].width;
                        else
                            _gridWidthRight += _styles[i].width;
                    }
                    if(typeof o.startGroupId === ud) o.startGroupId=0;
                    
                    _tableRight =  _panelRight.find("#table");
                    _tableLeft  =  _panelLeft.find("#table");
                    this.css("overflow","hidden").css("width", o.width + "px");
                    __obj.find(".zRows").css("height", o.height + "px");
                    _panelLeft.css("width", _gridWidthLeft + "px");
                    _panelRight.css("width", (o.width - _gridWidthLeft -4  )  + "px");
                   
                    createColumnHeader({ 
                          headers       : _panelLeft.find(".zHeaders")
                         ,table         : _tableLeft
                         ,dataTable     : _chLeft
                         ,width         : _gridWidthLeft
                         ,startGroupId  : o.startGroupId
                    });
                     
                    createColumnHeader({
                          headers    : _panelRight.find(".zHeaders")
                         ,table      : _tableRight
                         ,dataTable  : _chRight
                         ,width      : _gridWidthRight
                         ,startGroupId  : o.startGroupId
                    });
                    
                    
                }
                else{
                    _panelLeft = this.find(".left").find("#table");
                    _tableRight = this.find(".right").find("#table");
                }
                
                //console.log(this.isInitiated );
                
                var isOnEC= (typeof o.onEachComplete !== ud);
                if (isOnEC){    
                    var strFunc = o.onEachComplete.toString();
                  args = strFunc
                  .replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s))/mg,'')
                  .match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1]
                  .split(/,/);
                  var cbName="callback Function";
                  if(args.length < 1) console.warn("you must implement these parameters: tr,data");
                }
            
                if(typeof o.isNew !== ud){
                    if(o.isNew===true) clearTables();
                } 
                
                if(o.url || o.data){
                    if( (o.isAsync && __obj.curPageNo === 1) ||  ! o.isAsync ) clearTables();
                    var params ={
                       dataType: "json"
                      ,cache: false
                      ,success: function(data){
                                    var _noOfPage   = (data.returnValue > 0 ? data.returnValue : 0);
                                    var _ch,i,_trs;
                                    num_rows = data.rows.length;
                                    
                                    $.each(data.rows, function () {
                                        var _cls = zsi.getOddEven();
                                        trItem({data:this,panelType:"L",rowClass:_cls}); 
                                        trItem({data:this,panelType:"R",rowClass:_cls});
                                    });
                                    
                                    if(o.isAsync && __obj.curPageNo < _noOfPage ){
                                            //fire onAsyncComplete
                                            data.pageNo = __obj.curPageNo
                                            if(o.onAsyncComplete) o.onAsyncComplete(data);
                                            //loop page numbers
                                             __obj.curPageNo++;
                                            __obj.pageParams = ",@pno=" + __obj.curPageNo ;
                                            if(__obj.params.url) __obj.params.url  = __obj.url + __obj.pageParams +  (typeof __obj.sortParams !== ud ?  __obj.sortParams : "" );    
                                            setScrollBars();
                                            __obj.dataBindGrid(__obj.params);
                                    }
                                    else{
                                        //curPageNo=0;
                                        createBlankRows(o);
                                        setRowClickEvent();                                  
                                        setScrollBars();
                                        __obj.find("#recordsNum").html(num_rows);
                                        
                                         if(typeof __obj.isPageInitiated === ud){
                                            __obj.setPageCtrl(o,o.url,data,__obj);    
                                            __obj.isPageInitiated=true;
                                         }

                                        //add tr click event.
                                        __obj.addClickHighlight();
                                        if(__obj.left) _tableRight.parent().scrollLeft(Math.abs(__obj.left ));
                                        
                                        if(o.isAsync && o.onAsyncComplete) {
                                            data.pageNo = __obj.curPageNo
                                            o.onAsyncComplete(data);
                                        }
                                        if(o.onComplete) o.onComplete(data);
                                    }
            
                            }          
                    };
                    
                    if(typeof o.data!==ud)  {
                        if(typeof zsi.config.getDataURL===ud){
                            alert("zsi.config.getDataURL is not defined in AppStart JS.");
                            return;
                        }
                        params.url = zsi.config.getDataURL ;
                        params.data = JSON.stringify(o.data);
                        params.type = "POST";
                    }
                    else params.url = o.url
            
                    __obj.bind('refresh',function() {
                        if(zsi.tmr) clearTimeout(zsi.tmr);
                        zsi.tmr =setTimeout(function(){              
                            __obj.dataBindGrid(o);
                        }, 1);   
                    });
            
                    $.ajax(params);
                }
                else if(typeof o.rows !== ud){
                    $.each(o.rows, function () {
                        var _cls = zsi.getOddEven();
                        trItem({data:this,panelType:"L",rowClass:_cls}); 
                        trItem({data:this,panelType:"R",rowClass:_cls});                            
                    });
                    
                    createBlankRows(o);
                    setRowClickEvent();
                    setScrollBars();
                    __obj.addClickHighlight();
                    if(o.onComplete) o.onComplete();
                    __obj.addClickHighlight();        
                }  
                else{
                    if(typeof o.limit === ud) o.limit=5;
                    for(var y=0;y<o.limit;y++){
                        var _cls = zsi.getOddEven();
                        trItem({data:null,panelType:"L",rowClass:_cls}); 
                        trItem({data:null,panelType:"R",rowClass:_cls});       
                    }
                    if (typeof o.onEachComplete === ud) if(o.onComplete) o.onComplete();
                    //add tr click event.
                    __obj.addClickHighlight();
            
                }
                
            };
            $.fn.loadMonths         = function(){
                var _select  = this[0];
                _select.add(new Option(" ", ""),null);
                var monthNames = [ "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December" ];
                for(var x=0;x<12;x++){
                  var l_option = new Option(monthNames[x], x+1);
                  _select.add(l_option, null);
                }
            };
            $.fn.serializeExclude   = function(p_arr_exclude) {
              var _arr =  this.serializeArray();
               var str = '';
               $.each(_arr, function(i,data){
                  if ($.inArray(data['name'].toLowerCase(), p_arr_exclude)==-1) {
                     str += (str == '') ? data['name'] + '=' + data['value'] : '&' + data['name'] + '=' + data['value'];
                  }
               });
               return str;  
            };
            $.fn.setEventOnTRClickForSelection = function(tdIndex){
               this.find("tbody  > tr > td:not(:nth-child(1))").each(function(){
                  var tr = this.parentNode;
                  var box = $(tr).css("cursor","pointer").find("input[type='radio'],input[type='checkbox']");
                  this.onclick =function(){
                    if(box.attr("type") ==="checkbox" )
                        box.prop("checked", !box.prop("checked") );
                    else
                        box.prop("checked", true );
                    box.change();
                  };
              });   
            };    
            $.fn.setCheckEvent      = function(selector) {
                var o = this;
                if(o.length===0){
                    console.log(o.selector + " not found.");        
                    return;
                }
                
                var cb;
                if(typeof selector!==ud)
                    cb = $(selector);
                else    
                    cb=this.parent().parent().parent().parent().find("input[name='cb']");
            
                this.prop('checked',false);    
                
                o.change(function(){
                    if(this.checked)
                        cb.prop('checked',true).change();
                    else        
                        cb.prop('checked',false).change();
                });
            
                if( cb.length > 0 ) {
                    var checkAll = function(){
                         var countEmpty=0;
                         cb.each(function(){
                            if(!this.checked) countEmpty++;   
                         });
                         if(countEmpty===0) o.prop('checked',true);        
                    }
                        cb.change(function(){
                            if(this.checked===false) 
                                o.prop('checked',false);
                            else  
                                checkAll();
                        });
                    checkAll();
                }
            };
            $.fn.setCloseModalConfirm=function(){
                var event = $._data(this.get(0), 'events' ); 
                if(typeof event === ud || typeof event.hide ===ud){ //check if event functions exists.
                    this.on("hide.bs.modal", function (e) {
                        if( e.target.tagName.toUpperCase() !== "INPUT" ) {
                            if (confirm("You are about to close this window. Continue?")) {
                                return true;
                            }
                        }
                        return false;
                    });
                }
            };
            $.fn.setIdIfChecked     = function(id,primaryId){
                 $(this).find("input[name='cb']").change(function(){
                        var td  = this.parentNode;
                        var obj = $(td).find("#" + primaryId);
                        if(this.checked) 
                            obj.val(id);
                        else
                            obj.val('');
                });
            };
            $.fn.setUniqueOptions   = function(){
                var optionData=[];
                var obj = this;
                var options = $(obj).children("option");
                //functions
                var addSelectedData=function(o,data){
                    var isFound=false;
                    for(var x=0;x<data.length;x++){
                        if(data[x].value==o.value) {
                            isFound=true; 
                            break;
                        }
                    }
                    if(isFound===false){
                        data.push({value:o.value, text:o.text});
                    }
                }
                var getSelectedData=function(){
                    selectedData=[];
            
                   obj.each(function(){
                        if(this.value!=="")  {
                            addSelectedData({value:this.value, text:this.options[this.selectedIndex].text },selectedData);                
                        }
                    });
                    return selectedData;
                }
                var fillUnselectedData=function(selectedData){
                    var newData=[];
                    for(var x=0;x<optionData.length;x++){
                        var isFound=false;
                        for(var i=0;i<selectedData.length;i++){
                            if(optionData[x].value===selectedData[i].value) {
                                isFound=true;
                                break;
                            }  
                        }
                       if(isFound===false) addSelectedData(optionData[x],newData);
                    }
                    
                    obj.each(function(){
                        var ddl = this;
                        if(this.value===""){
                            $(this).clearSelect(); 
                             this.add(new Option("", ""), null);
                             $.each(newData, function() {
                                var l_option = new Option(unescape(this.text), this.value);
                                ddl.add(l_option, null);
                            });
                        }else{
                            //set new data
                            var selOpt = {value:this.value, text: this.options[this.selectedIndex].text};
                             $(this).clearSelect(); 
                             ddl.add(new Option("",""), null);
                             ddl.add(new Option(selOpt.text,selOpt.value), null);
                             $.each(newData, function() {
                                var l_option = new Option(unescape(this.text), this.value);
                                ddl.add(l_option, null);
                            });
                            $(this).val(selOpt.value);
                          
                        }
                    });
                     
                }
                
                options.each(function(){
                    if(this.value!=="") optionData.push({value :this.value, text: this.innerHTML});
                });
                
                this.change(function(){
                    fire();
                });
                function fire(){
                    var data = getSelectedData();
                    fillUnselectedData(data);
                }
                fire();
                return this;
            };
            $.fn.showPopup          = function(o){
                var _popUpName = (typeof o.id !== ud ? o.id : "popup");
                var _popUpId = "#" + _popUpName;
                this.find(_popUpId).remove();
                this.append('<div id="' + _popUpName + '" class="zPopup overlay">'
                                	+ '<div class="panel">'
                                	+   '<div class="header">'
                                    +		'<h2>'  + (o.title ? o.title :"")  + '</h2>'
                                    +		'<a class="close" href="javascript:void(0);" id="close">&times;</a>'
                                	+	'</div>'
                                	+	'<div class="content"><div class="body">' + o.body + '</div></div>'
                                	+ '</div>'
                                    +'</div>');
            
                $p = this.find(_popUpId);
                $p.css({
                     "visibility"   : "visible"
                    ,"opacity"      : 1
                    ,"z-index"      : zsi.getHighestZindex() + 1
                });           
                $p.find("#close").click(function(e){
                    $p.remove();
                    if(typeof o.onClose !== ud ) o.onClose();
                });
                return this;
            };
            $.fn.toJSON             = function(o) { //for multiple data only
                if (typeof o === ud) o={};
                var isExistOptionalItems = function (o, name) {
                    if (typeof o.optionalItems !== ud) {
                        if (o.optionalItems.indexOf(name) !== -1) return true;
                    }
                    return false;
                }
                
                var  evalCountArr = function(arr){
                    var arrNames = [];
                    alert("insufficient parameters.");
                    $.each(arr, function(){
                          if ( ! arrNames.isExists( {keyName:"name", value: this.name }) )
                                arrNames.push({name:this.name});
                    } );    
                    
                    console.log("parameters found: " + arrNames.length);
                    $.each(arrNames, function(){
                          var indexes =  arr.findIndexes( {keyName:"name", value: this.name });
                          console.log( this.name  + ":" + indexes.length);
                    } );
                
                }
                
                var arr = this.find('input, textarea, select').not(':checkbox').not((typeof o.notInclude !== ud?o.notInclude:"")).serializeArray();
                var json = [];
                var ctr = 0;
                //get objectNames
                var objNames = [];
                for (var x = 0; x < arr.length; x++) {
                    if (objNames.indexOf(arr[x].name) == -1) objNames.push(arr[x].name);
                }
                //start creating json
                for (x = 0; x < arr.length; x++) {
                    var item = {};
                    var isEmptyRows = [];
                    for (var y = 0; y < objNames.length; y++) {
                        var obj = arr[x + y];
                        if (typeof obj === ud) {
                            evalCountArr(arr);
                        }
                        var pName = arr[x + y].name;
                        item[pName] = arr[x + y].value || null;
                        if (!isExistOptionalItems(o, pName))
                            isEmptyRows.push(arr[x + y].value === "");
                    }
                    //detect empty rows
                    var countEmpty = 0;
                    for (var i = 0; i < isEmptyRows.length; i++) {
                        if (isEmptyRows[i]) countEmpty++;
                    }
                    if (countEmpty !== isEmptyRows.length)
                        json.push(item);
            
                    x = x + (objNames.length - 1);
                }
                if(typeof o.procedure !==ud) json={procedure: o.procedure, rows: json}; 
                return json;
            };
            $.fn.toJSON2            = function(o) { //for multiple data only
                if (typeof o === ud) o={};
                var isExistOptionalItems = function (o, name) {
                    if (typeof o.optionalItems !== ud) {
                        if (o.optionalItems.indexOf(name) !== -1) return true;
                    }
                    return false;
                }                
                var json = [];
                var ctr = 0;
                var _obj =this;
                $.each( this.find(".left .zRow"),function(i){
                    var $rowLeft  =  $(this);
                    var $rowRight = _obj.find(".right .zRow:eq(" + i + ")");
                    var arrLeft = $rowLeft.find('input, textarea, select').not(':checkbox').not((typeof o.notInclude !== ud?o.notInclude:"")).serializeArray();
                    var arrRight = $rowRight.find('input, textarea, select').not(':checkbox').not((typeof o.notInclude !== ud?o.notInclude:"")).serializeArray();
                    var info = {};
                    $.each(arrLeft,function(){
                        info[this.name] = (this.value ===""? null: this.value);
                    });
                    $.each(arrRight,function(){
                        info[this.name]= (this.value ===""? null: this.value);
                    });
                    if(Object.keys(info).length > 0 ) json.push(info);
                });
    
                //check error
                var _properties     = Object.keys(json[0]);
                var _brProperties   = Object.keys(json[json.length-1]);
                if(_properties.length!==_brProperties.length){
                    var _notExistInBlankRows = [],_notExistInRows=[];
                    console.log("Count Properties( Upper Bound Rows = " + _properties.length +  " : Lower Bound Rows = " + _brProperties.length + ")"  );
                    for(var x=0;x<_brProperties.length;x++){
                        if(_properties.indexOf(_brProperties[x]) < 0) _notExistInRows.push( _brProperties[x]);
                    };
                    for(var x=0;x<_properties.length;x++){
                        if(_brProperties.indexOf(_properties[x]) < 0) _notExistInBlankRows.push( _properties[x]);
                    };
                    if(_notExistInRows.length > 0)          console.log({notExistInRows     :_notExistInRows});
                    if(_notExistInBlankRows.length > 0 )    console.log({notExistInBlankRows:_notExistInBlankRows});
                }//end check error

                //exclude empty data 
                var _keys = Object.keys(json[0]);
                var _finalData = [];
                $.each(json,function(){
                    var info = this;
                    var ctr = 0;
                    for(var i=0;i < _keys.length;i++){
                         if (!isExistOptionalItems(o,  _keys[i])){    
                           if(info[_keys[i]]=== null  || info[_keys[i]]=== "") ctr +=1;
                         }
                    }
                    if(ctr!== (_keys.length -  (typeof o.optionalItems !== ud ? o.optionalItems.length : 0))) _finalData.push(this);
                });
                json=_finalData;
                if(typeof o.procedure !==ud) json={procedure: o.procedure, rows: json}; 
                if(typeof o.parentId !==ud) json.parentId= o.parentId
                return json;
            };            
        }            
        ,__setPageCtrl              : function(o,url,data,pTable){
            var tr = data.returnValue;
          
            var opt ="";
            for(var x=1;x<=tr;x++){
                opt += "<option value='" + x + "'>" + x + "</option>";
            }
            
            var h = "<div class='pagestatus'>Number of records in a current page : <i id='recordsNum'> " + data.rows.length + " </i></div>";
            h +="<div class='pagectrl'><label id='page'> Page </label> <select id='pageNo'>" + opt + "</select>";
            h +="<label id='of'> of " + tr + " </label></div>";
            
        
            pTable.find(".pageholder").html(h);
            
            var select = pTable.find(".pagectrl #pageNo");
        
            select.change(function(){
                zsi.table.__pageParameters = "@pno=" + this.value;
                o.url = url + (url.indexOf("@") >-1 ? ",":"" ) + (zsi.table.__sortParameters===""?"":zsi.table.__sortParameters +",")  + zsi.table.__pageParameters;
                pTable.loadData(o);
            });
            
        }
        ,__setPrototypes            : function(){
            // Date Prototypes 
            Date.prototype.isValid = function () {
                return this.getTime() === this.getTime();
            };  
            Date.prototype.toShortDate = function () {
                var m =  (this.getMonth()+1) + "";
                var d = this.getDate() + "";
                m = (m.length==1? "0"+m:m);
                d = (d.length==1? "0" +d:d);
                return m + '/' + d + '/' +  this.getFullYear();
            };  
            
            Date.prototype.toShortDateTime = function () {
              var h = this.getHours();
              var m = this.getMinutes();
              var ampm = h >= 12 ? 'PM' : 'AM';
              h = h % 12;
              h = h ? h : 12; // the hour '0' should be '12'
              m = m < 10 ? '0'+m : m;
              var strTime = h + ':' + m + ' ' + ampm;
              return this.getMonth()+1 + "/" + this.getDate() + "/" + this.getFullYear() + " " + strTime;
            };
            
            //String Prototypes : 
            String.prototype.toShortDate = function () {
                var nd = new Date(this);
                var m =  (nd.getMonth()+1) + "";
                var d = nd.getDate() + "";
                m = (m.length==1? "0"+m:m);
                d = (d.length==1? "0" +d:d);
                return (isNaN(m) ? "" :  m + '/' + d + '/' +  nd.getFullYear() );
            };              
            String.prototype.toDateFormat = function () {
                var val="";
                if(this.indexOf("-") >-1 ){
                    aDate = this.substr(0,10).split("-");
                    val = aDate[1] + "/" + aDate[2] + "/" + aDate[0];
                }else{
                    var _date = Date.parse(this);
                    if(isNaN(_date)===false )  val = (new Date(_date).toShortDate()) + "";
                }
                 return val;
            }; 
            String.prototype.toMoney = function(){
                var res = "";
                if(isNaN(this)===false) res = parseFloat(this).toMoney();
                return res;
            };
            String.prototype.toJSON = function(){
                var ret = null;
                if(this !=="") ret= $.parseJSON(this);
                return ret; 
            };
            String.prototype.nl2br = function(){
                return this.replace(/\n/g, "<br />");
            };
            
            //Array Prototypes : 
            Array.prototype.findIndexes = function(o){
                var r =[];
                $.each(this,function(i) {
                      if ( this[o.keyName] === o.value ) {
                          r.push(i);
                          return true;
                      }
                });
                return r;
            };
            
            Array.prototype.isExists = function(o){
                var r =false;
                $.each(this,function(){
                     if ( this[o.keyName] === o.value ) {
                         r = true;
                         return false;
                     }
                });
                return r;
            };
            
            Array.prototype.createNewCopy = function(){
                return $.extend(true,{}, this);
            };
            
            Array.prototype.removeAttr = function(name){
                    $.each(this,function(){
                        delete this[name]; 
                    });
                
            };
            
            //Number Prototypes : 
            Number.prototype.toMoney = function(){
                return this.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
            };

             
        }
        ,__setTableObjectsHistory   : function(objTable, o){
            var arr = zsi.__tableObjectsHistory;
            var isFound=false;
            if(objTable.length!==0){
                for(var x=0;x<arr.length;x++){
                   if(arr[x].tableName.toLowerCase()===objTable.attr("id").toLowerCase()  ){
                       isFound=true;
                       break;
                   }
                }
            
                if(!isFound) {
                    o.isInitiated = false;
                    arr.push({tableName:objTable.attr("id"),value:o});
                }
            }else{
                console.log("table not defined. url:" + o.url);
            }
        }
        ,__tableObjectsHistory      : []
        ,bs                         : {
             ctrl                   : function(o){
                var l_tag="input";
                var l_id = (typeof o.id !== ud ? o.id : o.name);
                var l_name =' name="' + o.name + '" id="' + l_id + '"';
            
                var l_type          = ' type="text"';
                var l_class         = ' class="form-control '  +  (typeof o.class!==ud ? o.class : '') + '" ';
                var l_endTag        ="";
                var l_value         ="";
                var l_in_value      ="";
                var l_selected_value="";
                var l_checked       ="";
                var l_style= (typeof o.style===ud?"":" style=\"" + o.style + "\"");
            
                var yesno = function(p){
                    var v ='N';
                    var str ='';
                    var cls = 'class="form-control"';
                    
                    if (typeof p.class !==ud) cls = 'class="' + p.class + '"';
                    str +='<select name="' + p.name + '" id="' + p.name + '" ' + cls +   '>';
                    if (typeof p.value !==ud) v = p.value;
                    if(typeof p.mandatory !==ud){
                        if(p.mandatory.toLowerCase()=='n') str += '<option value=""></option>';
                    }
                    str += '<option ' + (v=='Y' ? 'selected':'' ) +  ' value="Y">Yes</option>';
                    str += '<option ' + ( (v=='N' || v=='')  ? 'selected':'' ) +  ' value="N">No</option>';
                    str += '</select>';
                    return str;
                }    
            
                
                if(typeof o.value!==ud) l_value=' value="' + o.value + '"';
                if(typeof o.checked!==ud) {
                    if(o.checked) l_checked =' checked ';
                }
                
                
                if(typeof o.type!==ud){
                    var t = o.type.toLowerCase();
                    
                    if(t=='yesno') return yesno(o);
                    
                    if(t=='ddl') {
                        return "<input type='hidden' " + l_name + " " + l_value +  "><span id='text'>" + o.textValue + "</span> <div class='zDdlBtn' ><span class='caret'></span></div>";
                    }

                    
                    l_type=' type="' + o.type + '"';
            
                    if(t=="hidden") l_class='';
                    
                    if( ! (t=="hidden" || t=="input" || t=="checkbox" || t=="password"  || t=="email" || t=="radio") ) l_tag=t;        
                    
                    if(t=='select' || t =='textarea'){
                        l_type="";
                        l_endTag='</' + l_tag + '>';
                        if(t=='select'){
                            l_in_value ="<option></option>"
                            if(typeof o.value!==ud){
                                l_value="";
                                l_selected_value = (o.value !==""?" selectedvalue='" + o.value + "'" :"");
                            }
                        }
                        if(o.type =='textarea' && typeof o.value!==ud){
                            l_value="";
                            l_in_value=o.value;
                        }
                    }else if(t=="input") l_type=' type="text"';
                    
                }
               return '<' + l_tag + l_name + l_type + l_checked + l_class + l_value + l_selected_value + l_style +'>' + l_in_value + l_endTag;
            }    
            ,button                 : function(p){
                var l_icon ='';
                var l_class =' class="btn btn-primary btn-sm"';
                var l_type =' type="button"';
                var l_onclick='';
                
                if(typeof p.type !== ud) l_type = ' type="' + p.type + '"';
                if(typeof p.class !== ud) l_class = ' class="' + p.class + '"';
                if(typeof p.onclick !== ud) l_onclick = ' onclick="' + p.onclick + '"';
                switch(p.name.toLowerCase()){
                    case 'search': l_icon='search';break;
                    case 'add': 
                    case 'new': l_icon='plus-sign';break;
                    case 'delete': l_icon='trash';break;
                    case 'close': l_icon='off';break;
                    case 'save': l_icon='floppy-disk';break;
                    case 'reset': l_icon='retweet';break;
                    case 'login': l_icon='log-in';break;
                    default:break;
                }
                
                var l_span ='<span class="glyphicon glyphicon-' + l_icon + '"></span>';
                var result = '<button id="btn' + p.name + '" ' + l_class +  l_type + l_onclick + '>' + l_span + ' ' + p.text + '</button>';
                return result;
            }
        }
        ,calendar                   : {}
        ,config                     : {}
        ,control                    : {}
        ,form                       : {
             __checkMandatory : function(oGroupN, oGroupT,groupIndex){
            var e = oGroupN.names;
            var d = oGroupT.titles;
            var l_irecords=[];
            var l_firstArrObj;
            
            zsi.form.__objMandatoryGroupIndexValues[groupIndex]="N";
               for(var x=0;x<e.length;x++){
                  var l_obj = document.getElementsByName(e[x]);
                 if(l_obj.length > 1){
                     /* collect row-index if the row has a value */
                     var l_index=0;
                     for(var i=0;i<l_obj.length;i++){
                        if(l_obj[i].type!="hidden"){
                           if(!l_firstArrObj) l_firstArrObj = l_obj[i];
                           if($.trim(l_obj[i].value)!=="") {
                             l_irecords[l_index]=i;
                             l_index++;
                             zsi.form.__objMandatoryGroupIndexValues[groupIndex]="Y";
                           }
                        }
                     }
            
                 }else{ /* single */
                     if(l_obj[0]){
                        if(l_obj[0].value===ud || $.trim(l_obj[0].value)===""){
                           l_obj[0].focus();
                           alert("Enter " + d[x] + ".");
                           return false;
                        }
                     }
                 }
            
               }
              /* multiple */
               if(oGroupN.type=="M"){
                  if(oGroupN.required_one){
                     if(oGroupN.required_one=="Y"){
                        if(l_irecords.length===0){
                           alert("Please enter at least 1 record.");
                           if(l_firstArrObj) l_firstArrObj.focus();
                           return false;
                        }
                     }
                  }
                  for(var x=0;x<e.length;x++){
                     var l_obj = document.getElementsByName(e[x]);
                     if(l_obj.length > 1){
                        //console.log(l_irecords.length);
                        for(var i=0;i<l_irecords.length;i++){
                           if(l_obj[l_irecords[i]].type!="hidden"){
                              if($.trim(l_obj[l_irecords[i]].value)==="") {
                                l_obj[l_irecords[i]].focus();
                                alert("Enter " + d[x] + ".");
                                return false;
                              }
                           }
                        }
                     }
                  }
               }
            
               return true;
             }
            ,__objMandatory:null
            ,__objMandatoryGroupIndexValues:[]
            ,checkNumber : function(e) {
               var keynum;
               var keychar;
               var numcheck;
               var allowedStr =''
            
               for (i=1;i<arguments.length;i++) {
                  allowedStr+=arguments[i];
               }
               if (window.event) {
                  //IE
                  keynum = e.keyCode;
               } else if (e.which) {
                  //Netscape,Firefox,Opera
                  keynum = e.which;
                  if (keynum==8) return true; //backspace
                  if (String.charCodeAt(keynum)=="91") return true;
               } else return true;
            
               keychar = String.fromCharCode(keynum);
            
               if (allowedStr.indexOf(keychar)!=-1) return true;
                  numcheck = /\d/;
                  return numcheck.test(keychar);
            }
            ,isValidNumberFormat : function(o) {
               var regex = /(?=.)^\$?(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+)?(\.[0-9]{1,4})?$/;
               var val = o.value;
               if (val!=="") {
                  var ok = regex.test(val);
                   if (ok) 
                     return true;
                   else 
                     return false;
               }
            }
            ,checkNumberFormat : function(o){
               if(!zsi.form.isValidNumberFormat(o)){
                     alert("Please enter a valid number format.");
                     setTimeout(function(){o.focus()}, 0);
               }
            }
            ,checkMandatory : function(){
               var l_om = zsi.form.__objMandatory;
               if(typeof l_om === ud) return true;
               for(var x=0;x < l_om.groupNames.length;x++){  /*loop per group objects*/
                  if (!zsi.form.__checkMandatory( l_om.groupNames[x], l_om.groupTitles[x], x ))
                     return false;
               }
               /*check  required one indexes */
               if(l_om.required_one_indexes){
                  var roi=l_om.required_one_indexes;
                  var mgiv = zsi.form.__objMandatoryGroupIndexValues;
                  var countNoRecords=0;
                  for(var x=0;x < roi.length;x++){
                     for(var y=0;y < mgiv.length;y++){
                        if(roi[x]==y){
                           if(mgiv[y]=="N") countNoRecords++;
                        }
                     }
                  }
                  if(roi.length == countNoRecords){
                     alert("Please enter at least one record.");
                     return false;
                  }
               }
               return true;
            }
            ,markMandatory : function(om){
                //clear colored box;
                $("input,select,textarea").not("[type=hidden]").each(function(){
                  //  $(this).css("border","solid 1px #ccc");
                });
                zsi.form.__objMandatory=om;
                for(var x=0;x<om.groupNames.length;x++){
                   if(om.groupNames[x].names.length!=om.groupTitles[x].titles.length){
                      alert("Error!, parameters are not equal.");
                      return false;
                   }
                }
                var e;
            
               for(var gn=0;gn< om.groupNames.length;gn++){  /*loop per groupNames*/
                  e = om.groupNames[gn].names;
            
                  var border ="solid 1px #F3961C";
                  for(var x=0;x< e.length;x++){
                     var elements = document.getElementsByName(e[x]);
                     if(elements.length == 1){ /* single */
                        var o=$("#" + e[x]);
                         changeborder(o[0]);
                        o.on('change keyup blur', function() {
                           changeborder(this);
                        });
            
                     }else{ /* multiple */
                     $("*[name='" +  e[x] + "'][type!=hidden]").each(function(){
                         changeborder(this);
                        $(this).on('change keyup blur', function() {
                           if($(this).val()!=""){
                              $("*[name='" +  this.name + "'][type!=hidden]").each(function(){
                                 changeborder(this)
                              });
                           }
                           else{
                              /* check input elements if there's a value */
                              $("*[name='" +  this.name + "'][type!=hidden]").each(function(){
                                  changeborder(this);
                              });

                           }
                        });
            
                     });
            
                     }
                  }
               } /* end of group loop */
            
               function changeborder(o){
                  jo = $(o);
                  if(typeof jo.val() === ud || jo.val()===""){
                     jo.addClass("mandatory");
                  }else{
                     jo.removeClass("mandatory");
                  }
               }
            }
            ,checkDate : function(e, d){
             var l_format_msg=" must be in [mm/dd/yyyy] format.";
                for(var x=0;x<e.length;x++){
                   var l_obj = document.getElementsByName(e[x]);
            
                  if(l_obj.length > 1){
                      /* multiple */
                      var l_index=0;
                      for(var i=0;i<l_obj.length;i++){
                         if(l_obj[i].type!="hidden"){
                            if($.trim(l_obj[i].value)!=""){
                               if( isValidDate(l_obj[i].value)!=true){
                                  alert(d[x] + l_format_msg);
                                  l_obj[i].focus();
                                  return false;
                               }
                            }
                         }
                      }
            
                  }
                  else{ /* single */
                     if(l_obj[0]){
                        if($.trim(l_obj[0].value)!=""){
                           if( isValidDate(l_obj[0].value)!=true){
                             alert(d[x] + l_format_msg);
                             l_obj[0].focus();
                             return false;
                           }
                        }
                     }
            
                  }
            
                }
            
                return true;
              }
            ,setCriteria : function(p_inputName,p_desc, p_result){
               var input = $(p_inputName);
               if (input.prop("tagName")=="SELECT"){
                  if(input.find(":selected").text()){
                     if (p_result!="") p_result += ", ";
                     p_result += p_desc + ": " +  input.find(":selected").text();
                  }
               }
               else{
                  if(input.val()){
                     if (p_result!="") p_result += ", ";         
                     p_result += p_desc + ":" + input.val(); 
                  }
               }
               return p_result;
            }
            ,showAlert : function(p_class){   
               var box = $("." + p_class);         
               box.center();
               box.show();         
               setTimeout(function(){
                  box.hide("slow");
            
               }, 500);
            }
            ,displayLOV : function(p){
                var td_data = [];
                var td_prop;
                
                if(typeof p.show_checkbox===ud) p.show_checkbox=true;
                td_data.push(function(d){
                            var isNew = (typeof d ==="ud"?true:false);
                            var inputs= '<input name="p_' + p.params[0] + '[]"  type="hidden"  value="' + (isNew!==true?d[p.params[0]]:"") + '">' 
                                 + '<input name="p_' + p.params[1] + '[]" type="hidden" value="' + (isNew!==true?d[p.params[1]]:"") + '" >'    
                                 + '<input name="p_isCheck[]" type="hidden" value="' +  (isNew!==true?((d[p.params[0]])? 1:0):"")  + '" >';
                            if(p.show_checkbox==true)  
                                inputs +='<input name="p_cb[]" onclick="clickCB(this);" class="" type="checkbox" ' + (isNew!==true?((d[p.params[0]])? 'checked':''):"") + '>'
                            return inputs;     
                });
                
                td_data = td_data.concat(p.column_data);        
                var params  ={ table : p.table, td_body:td_data}; 
                if(typeof p.url!==ud) params.url=p.url;
                if(typeof p.limit!==ud) params.limit=p.limit;
                if(typeof p.onComplete!==ud) params.onComplete=p.onComplete;
                if(typeof p.isNew!==ud) params.isNew=p.isNew;
                if(typeof p.td_properties!==ud) params.td_properties = p.td_properties;    
                $(params.table).loadData(params)
                
                clickCB = function(o){
                    var td = o.parentNode;
                    if(o.checked==false) {
                        $(td).children("input[name='p_isCheck[]']").val(0);
                    }else{
                        $(td).children("input[name='p_isCheck[]']").val(1);
                    }
                }   
                  
            }
            ,deleteData : function (o) {
                var ids = "";
                var data = zsi.table.getCheckBoxesValues("input[name='cb']:checked");
                for (var x = 0; x < data.length; x++) {
                    if (ids !== "") ids += "/";
                    ids += data[x];
                }
                if (ids !== "") {
                    if (confirm("Are you sure you want to delete selected items?")) {
                        $.post(base_url + "sql/exec?p=deleteData @pkey_ids='" + ids + "',@table_code='" + o.code + "'", function (d) {
                            o.onComplete(d);
                        }).fail(function (d) {
                            alert("Sorry, the curent transaction is not successfull.");
                        });
                    }
            
                }
            }
        }
        ,getHighestZindex           : function(){
            var _selector = "*";
            var _a = arguments;
            if(typeof _a[0] !== ud)  _selector = _a[0];          
            var highest = -999;
            $(_selector).each(function() {
                var current = parseInt($(this).css("z-index"), 10);
                if(current && highest < current) highest = current;
            });
            return highest;
        }
        ,getOddEven                 : function(){
            var _o="odd";
            if(typeof zsi.__oe ===ud) zsi.__oe=_o;
            zsi.__oe = (zsi.__oe ===_o?"even": _o);
            return zsi.__oe;
        }
        ,getTableLayoutsObjects     : function(code,callBack){
            var removeEmptyValues=function(info){
                var _r={};
                 var _keys = Object.keys(info);
                 for(var x=0;x<_keys.length;x++){
                     var _fn = _keys[x];
                     if(info[_fn] !== ""  ){
                         _r[_fn]  = info[_fn] ;
                     } 
                 } 
                 return _r;
            };
        
             $.get(base_url +"sql/proc?p=table_layout_sel @code='" + code + "'", function(data){
        
                    if(data.rows.length >0 ){
                        var _info = data.rows[0];
                        var _layoutInfo = removeEmptyValues(_info);
                            _layoutInfo.onComplete = new Function("d",  _layoutInfo.onComplete );

                        $.get(base_url +"sql/proc?p=table_layout_cols_sel @tableLayoutId='" + _layoutInfo.tableLayoutId + "'", function(data){
                                if(data.rows.length >0 ){
                                     var _rows = [];
                                     $.each( data.rows,function(){
                                           if(this.onRender) this.onRender = new Function("d",  this.onRender);
                                          _rows.push( removeEmptyValues(this) );
                                     });
                                     _layoutInfo.dataRows = _rows;
                                    callBack(_layoutInfo);
                                } else callBack(null);
                        });
                    }
             });
        
        }
        ,getUrlParamValue           : function(variable) {
        	var source = window.location.href; 
        	variable = variable.toLowerCase();
        	var qLoc =  source.indexOf("?");
        	if (qLoc >-1){
        			var param = source.split("?");
        		var result = param[1];  //right parameters  
        		if (result.indexOf("&") > -1){ 
        	 
        			var vars = result.split("&");
        			for (var i=0;i<vars.length;i++) {
        				var pair = vars[i].split("=");
        				if (pair[0].toLowerCase() == variable.toLowerCase()) {
        	
        					return pair[1];
        				}
        			}
        		}
        		else{
        			var pair = result.split("=");
        			if (pair[0].toLowerCase() == variable.toLowerCase()) {
        				return pair[1];
        			}
        	
        	
        		}
        	
        	}
        	return "";
        }
        /*initialize configuration settings*/
        ,init                       : function(o){
            zsi.config =o;
            zsi.__monitorAjaxResponse();    
        }            
        ,initDatePicker             : function(){
           var inputDate =$('input[id*=date]').not("input[type='hidden']");
        
           inputDate.attr("placeholder","mm/dd/yyyy");
           inputDate.keyup(function(){      
                 if(this.value.length==2 || this.value.length==5 ) this.value += "/";
           });
           
           if(inputDate.length > 0){
              inputDate.datepicker({
                  format: 'mm/dd/yyyy'
                  ,autoclose:true
                  ,daysOfWeekDisabled: [0,6]
              }).on('show', function(e){
                  var l_dp     = $('.datepicker');
                   l_dp.css("z-index",zsi.getHighestZindex() + 1);
              });
           }
        }            
        ,json                       : {
            groupByColumnIndex      : function(data,column_index){
               var _result ={};
               var _group=[];
            
                  $.each(data.rows, function () {
                        var _value = this.data[column_index];
                      if ($.inArray(_value, _group)==-1) {
                        _group.push(_value);
                        _result[_value]= [] 
                     }
                     _result[_value].push(this.data);
            
               });
               return _result;
            }  
        }
        ,page                       : {
            __object : null
            ,__PageNo : null
            ,__tURL   : null
            ,clearPaging            : function(){
                zsi.page.__pageNo=null;    
            }
            ,DisplayRecordPage      : function(p_page_no,p_rows,p_numrec){
               var l_max_rows       =25;
               var l_last_page    = Math.ceil(p_rows/l_max_rows);
               var l_record_from    = (l_max_rows * (p_page_no-1)) + 1;
               var l_record_to      = parseInt(l_record_from) + parseInt(p_numrec) - 1;
               var l_select         = $("select[name=p_page_no]");
               l_select.clearSelect();
               for(var x=0;x<l_last_page;x++){
                  var l_option;
                   if (p_page_no==x+1){
                         l_select.append("<option selected value='" +  (x+1) + "'>"+ (x+1) +"</option>");
                    }
                    else{
                         l_select.append("<option value='" +  (x+1) + "'>"+ (x+1) +"</option>");
                    }
               }
            
               $("#of").html(' of ' + l_last_page );
               $(".pagestatus").html("Showing records from <i>" + l_record_from + "</i> to <i>" + l_record_to + "</i>");
            
            }                 

        }
        ,url                        : {
            getQueryValue          : function (source,keyname) {
               source = source.toString().toLowerCase(); 
               keyname = keyname.toLowerCase();
               var qLoc =  source.indexOf("?");   
               if(qLoc>-1) source=source.substr(qLoc+1);
               if (source.indexOf("&") > -1){ 
                  var vars = source.split("&");
                  for (var i=0;i<vars.length;i++) {
                     var pair = vars[i].split("=");
                     if (pair[0] == keyname) {
            
                        return pair[1];
                     }
                  }
               }
               else{
                  var pair = source.split("=");
                  if (pair[0] == keyname) {
                     return pair[1];
                  }      
               }   
               return ""
            }
            ,removeQueryItem        : function (source,keyname) {
               source = source.toString().toLowerCase(); 
               keyname = keyname + "".toLowerCase();
               var qLoc =  source.indexOf("?");   
               if(qLoc>-1) source=source.substr(qLoc+1);
               var result = "";
            
               if (source.indexOf("&") > -1){ 
                  var pairs = source.split("&");
                  for (var i=0;i<pairs.length;i++) {
                      var l_keyname = pairs[i].split("=")[0];         
                     if(l_keyname !=keyname){ 
                        if(result)  result +="&"; 
                        result += pairs[i];
                     }
                  }
               }
               return result;
            }
        }
        ,table                      : {
             __pageParameters       : ""
            ,__sortParameters       : ""
            ,getCheckBoxesValues    : function(){
                var args = arguments;
                var result=null;
                var _hidden= "input[type=hidden]";
                var chkBoxName;
                switch(args.length) {
                    case 1: /* return type : Array */
                        var arrayItems = [];
                        var i=0;
                        chkBoxName=args[0];
                        $(chkBoxName).each(function(){
                           arrayItems[i]=$(this.parentNode).children(_hidden).val();
                           i++;
                        });
                        result = arrayItems;
                        break;
            
                    case 3: /* return type : string */
                        var params="";
                        chkBoxName=args[0];
                        var parameterValue         =args[1];
                        var separatorValue         =args[2];
                        
                        $(chkBoxName).each(function(){
                            var _value =   $(this.parentNode).children(_hidden).val();
                            if(_value == ud) _value = this.value; /* patch for no hidden field*/
                            if(params!=="") params = params + separatorValue;
                            params = params + parameterValue + _value;
                        });
                        result = params;
                        break;
            
                    default: break;
                }
               return result;
            }
            ,setCheckBox            : function(obj, cbValue){
               var _hidden= "input[type=hidden]";
                  var _input =   $(obj.parentNode).children(_hidden);
                  if(_input.attr("type")!='hidden') { alert(_hidden + " not found"); return;}
            
                   if(obj.checked){
                        _input.val(cbValue);
                  }
                  else{
                        _input.val("");
                  }
            }
            ,sort:{
                 colNo:1
                ,orderNo:0
            }
        }
        ,tmr                        : null
        ,toDate                     : function(data) {

          return data;
        }
        ,setValIfNull               : function(data,colName,defaultValue){
            var _d = (typeof defaultValue !== ud ? defaultValue : "" );   
            return (data ? (typeof data[colName]  !== ud ? data[colName] :  _d ) : _d);
        }
        ,ShowHideProgressWindow     : function (isShow){
            var pw = $(".progressWindow");
           if(isShow){
              pw.centerWidth();
              pw.css("display","block");
           }
           else{
              pw.hide();      
           }
         }
        ,ShowErrorWindow            : function(){
            var pw = $(".errorWindow");
            pw.centerWidth();
            pw.css("display","block");
            pw.css("z-index",zsi.getHighestZindex() + 1);
            setTimeout(function(){
                    pw.hide("slow");      
            },5000);   
         }
        ,initInputTypesAndFormats   : function(){
           $(".numeric").keypress(function(event){
              return zsi.form.checkNumber(event,'.,');
           });
            
           $(".format-decimal").blur(function(){
              var obj= this;
              zsi.form.checkNumberFormat(this);
           });
        }
        ,strExist                   : function(source,value){
          var _result=false;
          var i = source.toLowerCase().indexOf(value.toLowerCase());
          if (i>-1) _result=true;
          return _result;
        }
    }
    ,isValidDate = function(l_date){
        var comp = l_date.split('/');
        var m = parseInt(comp[0], 10);
        var d = parseInt(comp[1], 10);
        var y = parseInt(comp[2], 10);
        var date = new Date(y,m-1,d);
        if (date.getFullYear() == y && date.getMonth() + 1 == m && date.getDate() == d) {
          return true;
        }
        else {
          return false;
        }
    }
;  

zsi.__setPrototypes();
zsi.__setExtendedJqFunctions();
/* Page Initialization */
$(document).ready(function(){
    zsi.initDatePicker();
    zsi.__initTabNavigation();
    zsi.__initFormAdjust();
    zsi.initInputTypesAndFormats();
});
                                                                     