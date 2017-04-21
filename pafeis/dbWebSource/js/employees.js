var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;
var tblName     = "tblInactiveEmp";

zsi.ready(function(){
   displayRecords();
   getTemplate();
});

$("#btnSave").click(function () {
    $("#grid").jsonSubmit({
        procedure: "employees_upd"
         ,optionalItems : ["is_active"]
        ,onComplete: function (data) {
            $("#grid").clearGrid(); 
            displayRecords();
        }
    });
});

$("#btnInactive").click(function () {
    $(".modal-title").text("Inactive Employees");
    $('#modalWindow').modal({ show: true, keyboard: false, backdrop: 'static' });
    //$('#modalWindow').setCloseModalConfirm(); 
    displayInactiveEmp();
});
    
function getTemplate(){
    $.get(base_url + "templates/bsDialogBox.txt",function(d){
        var template = Handlebars.compile(d);     

        var context = { id:"modalWindow"
                        , sizeAttr: "fullWidth"
                        , title: "Employees"
                        , footer:  ' <div class="pull-left"><button type="button" onclick="submitItems();" class="btn btn-primary"><span class="glyphicon glyphicon-floppy-disk"></span> Save</button></div>'
                        , body: '<div id="' + tblName + '" class="zGrid" ></div>'
                      };
        var html    = template(context);     
        $("body").append(html);
    });    
}

function submitItems(){    
  $("#frm_modalWindow").jsonSubmit({
            procedure  : "employees_upd"
            ,optionalItems: ["is_active"]
            //,notInclude: "#employee_name"
            ,onComplete : function (data) {
                 if(data.isSuccess===true) zsi.form.showAlert("alert");
                 $("#grid").trigger('refresh');
                 displayInactiveEmp();
            }
    });        
}

function displayRecords(){   
    var cb = bs({name:"cbFilter1",type:"checkbox"});
         $("#grid").dataBind({
	     url            : execURL + "employees_sel"
	    ,width          : 1230
	    ,height         : $(document).height() - 350
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
       // ,isPaging : true
        ,dataRows : [
            
                     {text  : cb                                 , width : 25        , style : "text-align:left;"       
            		    , onRender      :  function(d){ 
                		              return bs({name:"emp_id"   ,value: svn (d,"emp_id")    ,type:"hidden"})
                		                 +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                    }
                }
                ,{text  : "ID #"                                , width : 40        , style : "text-align:left;"       
            		    , onRender      :  function(d){ 
                		              return bs({name:"emp_id"   ,value: svn (d,"emp_id")})}}
        		,{text  : "Employee Name"         , name  : "employee_name"         , type  : "input"       , width : 300       , style : "text-align:left;"}
        		,{text  : "Position"              , name  : "position"              , type  : "input"       , width : 250       , style : "text-align:left;"}
        		,{text  : "Daily Rate"            , name  : "d_rate"                , type  : "input"       , width : 125       , style : "text-align:left;"}
        		,{text  : "Area"                  , name  : "area"                  , type  : "input"       , width : 150       , style : "text-align:left;"}
        		,{text  : "Store Location"        , name  : "store_loc"             , type  : "input"       , width : 230       , style : "text-align:left;"}
        		,{text  : "Active?"               , name  : "is_active"             , type  : "yesno"       , width : 90        , style : "text-align:left;" ,defaultValue: "Y"}
        
	    ]
    	     ,onComplete: function(data){
                $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
        }  
    });    
}
function displayInactiveEmp(){   
        $("#" + tblName).dataBind({
	     url            : execURL + "employees_sel @is_active='N'" 
	    ,width          : 1200
	    ,height         : 400
	    ,selectorType   : ""
        ,blankRowsLimit:5
        //,isPaging : false
        ,dataRows : [
    		
    	   
        		{text  : "ID #"                                , width : 40        , style : "text-align:left;"       
            		    , onRender      :  function(d){ 
                		              return bs({name:"emp_id"   ,value: svn (d,"emp_id")})}}
        		,{text  : "Employee Name"         , name  : "employee_name"         , type  : "input"       , width : 300       , style : "text-align:left;"}
        		,{text  : "Position"              , name  : "position"              , type  : "input"       , width : 250       , style : "text-align:left;"}
        		,{text  : "Daily Rate"            , name  : "d_rate"                , type  : "input"       , width : 135       , style : "text-align:left;"}
        		,{text  : "Area"                  , name  : "area"                  , type  : "input"       , width : 130       , style : "text-align:left;"}
        		,{text  : "Store Location"        , name  : "store_loc"             , type  : "input"       , width : 230       , style : "text-align:left;"}
        		,{text  : "Active?"               , name  : "is_active"             , type  : "yesno"       , width : 90        , style : "text-align:left;" ,defaultValue: "N"}
        
	    ]
    });    
}
    