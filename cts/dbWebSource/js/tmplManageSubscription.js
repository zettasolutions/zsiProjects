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
    setSearch();
    displayRecords();
    getTemplate();
    if (gUser.is_admin === "Y") {
        $("#button-div").html('<button type="button" class="btn btn-primary btn-sm col-12 col-md-auto mb-1 mb-md-0" id="btnSave"><i class="fa fa-save"></i> Save</button>' );
    }    
    
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

    function setSearch(){
        new zsi.search({
            tableCode: "ref-0006"
            ,colNames : ["client_name"] 
            ,displayNames : ["Client Name"]  
            ,searchColumn :"client_name"
            ,input:"input[name=company_name]"
            ,url : execURL + "searchData"
            ,onSelectedItem: function(currentObject,data,i){ 
                currentObject.value=data.client_name;
                $("#client_id").val(data.client_Id);
                displayRecords(data.client_Id);
           }
        });        
    }

   $("input[name=company_name]").on("keyup change", function(){
        if(this.value === ""){
            displayRecords();
        }
   });
    function displayRecords(cId){   
        var cb = bs({name:"cbFilter1",type:"checkbox"});
        $("#grid").dataBind({
    	     url            : procURL + "subscriptions_sel @client_id=" + (cId ? cId : null)  
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
    	         zsi.initDatePicker();
    	         $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
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