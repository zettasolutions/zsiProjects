String.prototype.toDate = function () {
    if(!isValidDate(this)) return "";
    var _date=new Date( Date.parse(this) );
    var m =  (_date.getMonth()+1) + "";
    var d = _date.getDate() + "";
    m = (m.length==1? "0"+m:m);
    d = (d.length==1? "0" +d:d);
    return  _date.getFullYear() + '-'  + m + '-' + d;
};  
 
zsi.ready(function(){
    displayRecords();
    if (gUser.is_admin === "Y") {
        $("#button-div").html('<button type="button" class="btn btn-primary btn-sm col-12 col-md-auto mb-1 mb-md-0" id="btnSave"><i class="fa fa-save"></i> Save</button>' );
    }    
    
    $("select[name='company_filter']").dataBind({
        url: procURL + "dd_subscribe_client_sel" 
        , text : "client_name"
        , value: "client_id"
        , onComplete: function() {
            $("#company_filter").change(function(){
                if(this.value){
                    displayRecords();
                } 
            });
        }
    });

    function displayRecords(){   
        var cId = $("#company_filter").val();
        var cb = bs({name:"cbFilter1",type:"checkbox"});
        $("#grid").dataBind({
    	     url            : procURL + "subscriptions_sel @app_client_id=" + (cId ? cId : null)  
    	    ,width          : $("#main-content").width() - 40
    	    ,height         : $("#main-content").height() - 150
    	    ,selectorType   : "checkbox"
            ,blankRowsLimit : 5
            ,dataRows : [
                    { text : cb , type : "hidden" , width : 25 , style : "text-align:left;"       
            		    , onRender : function(d) {
                    	    return bs({name:"subscription_id",type:"hidden",value: svn(d,"subscription_id")})
                    	        + bs({name:"is_edited",type:"hidden",value: svn(d,"is_edited")})
                    	        + bs({name:"app_id",type:"hidden",value: svn(d,"app_id")})
                    	        + (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                        }
                    }
                    ,{text  : "Application Name"    , width : 300    , style : "text-align:left;"
                        ,onRender : function(d){ return svn(d,"app_name")}
                    }
                    ,{text  : "Subscription Date"       , type : "input"    , width : 150    , style : "text-align:left;"
                        ,onRender : function(d){ 
                            return "<input name='subscription_date' type='date' value='"  +  svn(d,"subscription_date").toDate() +"' class='form-control' style='padding:0'>";
                        }
                    }
                    ,{text  : "No. of Months"           , name : "no_months"            , type : "input"     , width : 150    , style : "text-align:left;"}
                    ,{text  : "Expiry Date"             , width : 150    , style : "text-align:left;"
                         ,onRender : function(d){ return svn(d,"expiry_date").toDateFormat()}
                    }
             		,{text  : "Is Active?"              , name  : "is_active"           , type  : "yesno"    , width : 80     , style : "text-align:left;"  ,defaultValue:"Y"}
    	    ]
    	     ,onComplete: function(o){
    	         _dRows = o.data.rows;
    	         console.log(_dRows);
    	         zsi.initDatePicker();
    	         $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
    	         //$("#grid input[name='subscription_date']").val(_dRows[0].subscription_date);
    	    }  
        });    
    }

    $("#btnSave").click(function() {
        $("#grid").jsonSubmit({
            procedure: "subscriptions_upd"
            ,optionalItems: ["is_active"]
            ,notInclude: "#expiry_date"
            ,onComplete: function (data) {
                $("#grid").clearGrid(); 
                displayRecords();
            }
        });
    });
});