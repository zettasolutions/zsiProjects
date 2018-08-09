zsi.ready(function(){
    var  _gridWidth =  $("#main-content").width() - 40
        ,_gridHeight = $("#main-content").height() - 150
        ,_$mcApplication = $("#menu-content-applications")
        ,_$mcSubscription = $("#menu-content-subscription").hide()    
    ;    
    displayApplicationRecords();
    markMandatory();
    getTemplate();
    
    if (gUser.is_admin === "Y") {
        $("#button-div1").html('<button type="button" class="btn btn-primary btn-sm col-12 col-md-auto mb-1 mb-md-0" id="btnSaveApplication"><i class="fa fa-save"></i> Save</button> <button type="button" class="btn btn-primary btn-sm col-12 col-md-auto" id="btnDelete"><i class="fa fa-trash-alt"></i> Delete</button>' );
        $("#button-div2").html('<button type="button" class="btn btn-primary btn-sm col-12 col-md-auto mb-1 mb-md-0" id="btnSaveSubscription"><i class="fa fa-save"></i> Save</button> <button type="button" data-toggle="modal" data-target="#modalAdd" class="btn btn-primary btn-sm col-12 col-md-auto mb-1 mb-md-0" id="btnAdd"><i class="fas fa-user-plus"></i> Register Client </button>' );
    }
    
    String.prototype.toDate = function () {
        if(!isValidDate(this)) return "";
        var _date=new Date( Date.parse(this) );
        var m =  (_date.getMonth()+1) + "";
        var d = _date.getDate() + "";
        m = (m.length==1? "0"+m:m);
        d = (d.length==1? "0" +d:d);
        return  _date.getFullYear() + '-'  + m + '-' + d;
    };  


    function getTemplate() {
        $.get(base_url + "templates/bsDialogBox.txt",function(d){
            var template = Handlebars.compile(d);
            $("#main-content > .col-12").append(template( { 
                  id    : 'modalAdd'
                , title : 'Client Registration'
                , body  :    '<div id="register_new" class="row">'
                            +    '</div>'
                            +'</div>'
                })
            );   
        });
        
        $.get(base_url + 'page/name/clientRegistration'
            ,function(data){
                $('#modalAdd').find('.modal-body').html(data);
            }
        ); 
    }    
    
    function displayApplicationRecords() {
        var cb = bs({name:"cbFilter1",type:"checkbox"});
        var _$grid = $("#gridApplication");
        _$grid.dataBind({
             url            : procURL + "applications_sel"
            ,width          : _gridWidth
            ,height         : _gridHeight
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
            	,{ text  : "Application Name"           , name  : "app_name"     , type  : "input"         , width : 250       , style : "text-align:left;" }
            	,{ text  : "Application Description"    , name  : "app_desc"     , type  : "input"         , width : 450       , style : "text-align:left;" }
            	,{ text  : "Support Type"               , name  : "type_id"      , type  : "select"        , width : 200       , style : "text-align:left;" }
            	,{ text  : "Is Active?"                 , name  : "is_active"    , type  : "yesno"         , width:75          , style : "text-align:left;"   ,defaultValue:"Y"                 }
                ,{ text  : 'Subcriptions'               , width : 120            , style : 'text-align:center;'
                    ,onRender : function(d) {
                        return (d !== null && svn(d,"app_id") !== '' ? '<div class="add-status "><span class="badge badge-dark">'+ d.countAppSubscribers +'</span></div>' : '');
                    }
                }
            ]
            ,onComplete: function(o){
                markMandatory();
                $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
                
                $("select[name='type_id']").dataBind({
                    url: procURL + "dd_types_sel "
                    , text: "type_desc"
                    , value: "type_id"
                    , required :false
                });  
                
                _$grid.off('click', '.add-status').on('click', '.add-status', function() {
                    var _$self = $(this);
                    var _rowData = o.data.rows[_$self.closest('.zRow').index()];
                    displaySubscriptionRecords(_rowData);
                });
            }
        });

        _$mcApplication.off('click', '#btnSaveApplication').on('click', '#btnSaveApplication', function() {
            _$grid.jsonSubmit({
                 procedure      : "applications_upd"
                ,optionalItems  : ["is_active"]
                ,onComplete     : function(data) {
                    if (data.isSuccess === true) zsi.form.showAlert("savedWindow");
                    displayApplicationRecords();
                }
            });
        });

        _$mcApplication.off('click', '#btnDelete').on('click', '#btnDelete', function() {
            zsi.form.deleteData({
                 code       : "ref-0005"
                ,onComplete : function(data){
                                displayApplicationRecords();
                            }
            });      
        });

    }


    function displaySubscriptionRecords(rowData){   
        var cb = bs({name:"cbFilter1",type:"checkbox"});
        _$mcApplication.hide();
        _$mcSubscription.show();
        $("#processTitle").text(rowData.app_desc);
        var _$grid = $("#gridSubscription");
        _$grid.dataBind({
    	     url            : procURL + "subscriptions_sel @app_id=" + rowData.app_id  
    	    ,width          : $("#main-content").width() - 40
    	    ,height         : $("#main-content").height() - 150
    	    ,selectorType   : "checkbox"
            ,blankRowsLimit : 5
            ,dataRows : [
                   {text  : "Client Name"    , width : 300    , style : "text-align:left;"
                        ,onRender : function(d){ 
                    	    return bs({name:"subscription_id"   ,type:"hidden"  ,value: svn(d,"subscription_id")})
                    	         + bs({name:"is_edited"         ,type:"hidden"  ,value: svn(d,"is_edited")})
                    	         + bs({name:"app_id"            ,type:"hidden"  ,value: rowData.app_id})                            
                                 + bs({name:"client_id"         ,type:"select"  ,value: svn(d,"client_id")});
                        }
                    }
                    ,{text  : "Start Date"       , type : "input"    , width : 150    , style : "text-align:left;"
                        ,onRender : function(d){ 
                            return "<input name='subscription_date' type='date' value='"  +  svn(d,"subscription_date").toDate() +"' class='form-control' style='padding:0'>";
                        }
                    }
                    ,{text  : "No. of Months"    , name : "no_months"   , type : "input"    , width : 150    , style : "text-align:left;" ,class : "numeric"}
                    ,{text  : "Expiry Date"      , width : 150          , style : "text-align:left;"
                         ,onRender : function(d){ return "<input id='expiry_date' name='expiry_date' type='text' value='"  +  svn(d,"expiry_date").toDateFormat() +"' class='form-control' style='padding:0' readonly>";
                         }
                    }
             		,{text  : "Is Active?"       , name  : "is_active"  , type  : "yesno"   , width : 80     , style : "text-align:left;"  ,defaultValue:"Y"}
    	    ]
    	     ,onComplete: function(o){
    	        zsi.initDatePicker();
    	        zsi.initInputTypesAndFormats();
    	        
    	        $("select[name='client_id']").dataBind({
                    url: procURL + "dd_subscribe_client_sel "
                    , text: "client_name"
                    , value: "client_id"
                    , required :false
                });  
 
                 _$mcSubscription.off('click', '#btnBack').on('click', '#btnBack', function() {
                    _$mcSubscription.hide();
                    _$mcApplication.show();
                });
    	        
    	        var _$zRow = $(this).closest(".zRow");
                var _noMonths = parseInt(_$zRow.find("[name='no_months']").val());
                var _sDate = _$zRow.find("[name='subscription_date']").val();
                var _eDate = new Date(_sDate); // pass start date here
    
                _eDate.setMonth(_eDate.getMonth() + _noMonths);
                _$zRow.find("[name='expiry_date']").val( (_eDate.getMonth() + 1)+ '/' + _eDate.getDate() + '/' + _eDate.getFullYear() );
                
                $(this).find("input[name=no_months]").on("keyup", function(){
                    var __$zRow = $(this).closest(".zRow");
                    var _this = this.value;
                    if ( _this === "" ){
                    __$zRow.find("[name='expiry_date']").val("");
                    }else if(__$zRow.find("[name='subscription_date']").val() === ""){
                        __$zRow.find("[name='expiry_date']").val("");
                    }else{
                        var __this = parseInt(_this);
                        var __sDate =  __$zRow.find("[name='subscription_date']").val();
                        var __eDate = new Date(__sDate); // pass start date here
                        __eDate.setMonth(__eDate.getMonth() + __this);
                        __$zRow.find("[name='expiry_date']").val( (__eDate.getMonth() + 1)+ '/' + __eDate.getDate() + '/' + __eDate.getFullYear() );
                    }
                });
                
                $(this).find("input[name=subscription_date]").on("change", function(){
                    var __$zRow = $(this).closest(".zRow");
                    var _this = this.value;
                    if(_this === ""){
                         __$zRow.find("[name='expiry_date']").val("");
                    }else if(__$zRow.find("[name='no_months']").val() === ""){
                        __$zRow.find("[name='expiry_date']").val("");
                    }else{
                        var _nMonth =  parseInt(__$zRow.find("[name='no_months']").val());
                        var __eDate = new Date(_this); // pass start date here
                        __eDate.setMonth(__eDate.getMonth() + _nMonth);
                        __$zRow.find("[name='expiry_date']").val( (__eDate.getMonth() + 1)+ '/' + __eDate.getDate() + '/' + __eDate.getFullYear() );                        
                    }
                });

 
    	    }  
        });  

        _$mcSubscription.off('click', '#btnSaveSubscription').on('click', '#btnSaveSubscription', function() {
            _$grid.jsonSubmit({
                 procedure      : "subscriptions_upd"
                ,optionalItems  : ["is_active"]
                ,notInclude     : "#expiry_date"
                ,onComplete     : function(data) {
                    if (data.isSuccess === true) zsi.form.showAlert("savedWindow");
                    displaySubscriptionRecords(rowData);
                    displayApplicationRecords();
                }
            });
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
    

});        