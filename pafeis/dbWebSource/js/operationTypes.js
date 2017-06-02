var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;



zsi.ready(function(){
    displayRecords();
    getTemplate();
});

function getTemplate(){
    $.get(base_url + "templates/bsDialogBox.txt",function(d){
        var template = Handlebars.compile(d);     

        var context = { id:"modalWindow"
                        , sizeAttr: "modal-md"
                        , title: "Operation Types"
                        , footer:  ' <div class="pull-left"><button type="button" onclick="submitData();" class="btn btn-primary"><span class="glyphicon glyphicon-floppy-disk"></span> Save</button>'
                                +  ' <button type="button" onclick="deleteData();" class="btn btn-primary"><span class="glyphicon glyphicon-trash"></span> Delete</button></div>'
                        , body: '<div id="inActiveRecords" class="zGrid" ></div>'
                      };
        var html    = template(context);     
        $("body").append(html);
    });    
}

function deleteData(){
    zsi.form.deleteData({
         code       : "ref-0040"
        ,onComplete : function(data){
                $("#grid").trigger('refresh');
                displayInactive();
        }
    }); 
} 

function submitData(){    
  $("#frm_modalWindow").jsonSubmit({
            procedure  : "operation_types_upd"
            ,optionalItems: ["is_active"]
            //,notInclude: "#employee_name"
            ,onComplete : function (data) {
                 if(data.isSuccess===true) zsi.form.showAlert("alert");
                 $("#grid").trigger('refresh');
                 displayInactive();
            }
    });        
}

$("#btnInactive").click(function () {
    $(".modal-title").text("Inactive Operation Types");
    $('#modalWindow').modal({ show: true, keyboard: false, backdrop: 'static' });
    //$('#modalWindow').setCloseModalConfirm(); 
    displayInactive();
}); 

$("#btnSave").click(function () {
  //  console.log("test");
   $("#grid").jsonSubmit({
             procedure: "operation_types_upd"
            , optionalItems: ["is_active"]
            , onComplete: function (data) {
                $("#grid").clearGrid();
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                displayRecords();
            }
    });
});
    
function displayRecords(){
     var cb = bs({name:"cbFilter1",type:"checkbox"});
     $("#grid").dataBind({
	     url            : execURL + "operation_types_sel"
	    ,width          : 570
	    ,height         : 400
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
                 {text  : cb                                                           , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"operation_type_id",type:"hidden",value: svn (d,"operation_type_id")})
                                                      +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
            }	 
        		,{text  : "Code"        , name  : "operation_type_code"     , type  : "input"         , width : 150       , style : "text-align:left;"}
        		,{text  : "Name"        , name  : "operation_type_name"     , type  : "input"         , width : 300       , style : "text-align:left;"}
        		,{text  : "Active?"     , name  : "is_active"               , type  : "yesno"         , width :60          , style : "text-align:left;"   ,defaultValue:"Y"                 }
	    ] 
    	     ,onComplete: function(){
                $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
        }  
    });    
}

function displayInactive(){
     var cb = bs({name:"cbFilter2",type:"checkbox"});
     $("#inActiveRecords").dataBind({
	     url            : execURL + "operation_types_sel @is_active='N'"
	    ,width          : 550
	    ,height         : 400
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
                 {text  : cb                                                           , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"operation_type_id",type:"hidden",value: svn (d,"operation_type_id")})
                                                      +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
            }	 
        		,{text  : "Code"        , name  : "operation_type_code"     , type  : "input"         , width : 150       , style : "text-align:left;"}
        		,{text  : "Name"        , name  : "operation_type_name"     , type  : "input"         , width : 300       , style : "text-align:left;"}
        		,{text  : "Active?"     , name  : "is_active"               , type  : "yesno"         , width :60          , style : "text-align:left;"   ,defaultValue:"Y"                 }
	    ] 
    	     ,onComplete: function(){
                $("#cbFilter2").setCheckEvent("#inActiveRecords input[name='cb']");
        }  
    });    
}
    

    
                                              