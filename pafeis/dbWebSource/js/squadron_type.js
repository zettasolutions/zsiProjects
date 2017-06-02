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
                        , sizeAttr: "modal-lg"
                        , title: "Squadron Type"
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
         code       : "ref-0042"
        ,onComplete : function(data){
                $("#grid").trigger('refresh');
                displayInactive();
        }
    }); 
} 

function submitData(){    
  $("#frm_modalWindow").jsonSubmit({
            procedure  : "squadron_types_upd"
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
    $(".modal-title").text("Inactive Squadron Type");
    $('#modalWindow').modal({ show: true, keyboard: false, backdrop: 'static' });
    //$('#modalWindow').setCloseModalConfirm(); 
    displayInactive();
}); 

$("#btnSave").click(function () {
   $("#grid").jsonSubmit({
             procedure: "squadron_types_upd"
            ,optionalItems: ["is_active"] 
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
	     url            : execURL + "squadron_types_sel"
	    ,width          : 650
	    ,height         : $(document).height() - 250
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
                 {text  : cb                                                           , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"squadron_type_id",type:"hidden",value: svn (d,"squadron_type_id")})
                		                               +  bs({name:"is_edited",type:"hidden"}) 
                                                      +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
                 }	 
        		,{text  : "Squadron Type"           , name  : "squadron_type"          , type  : "input"           , width : 200       , style : "text-align:left;"}
        		,{text  : "Dashboard Page"           , name  : "page_id"               , type  : "select"           , width : 300       , style : "text-align:left;"}
         		,{text  : "Active"                   , name  : "is_active"             , type:"yesno"          , width:75          , style:"text-align:center;"   ,defaultValue:"Y"}
	            
            	    ]
    	     ,onComplete: function(){
                $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
                $("select[name='page_id']").dataBind( "pages");
                $("select, input").on("keyup change", function(){
                    var $zRow = $(this).closest(".zRow");
                    $zRow.find("#is_edited").val("Y");
                });  
        }  
    });    
}

function displayInactive(){
     var cb = bs({name:"cbFilter2",type:"checkbox"});
     $("#inActiveRecords").dataBind({
	     url            : execURL + "squadron_types_sel @is_active='N'"
	    ,width          : 650
	    ,height         : $(document).height() - 250
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
                 {text  : cb                                                           , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"squadron_type_id",type:"hidden",value: svn (d,"squadron_type_id")})
                		                               +  bs({name:"is_edited",type:"hidden"}) 
                                                      +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
                 }	 
        		,{text  : "Squadron Type"           , name  : "squadron_type"          , type  : "input"           , width : 200       , style : "text-align:left;"}
        		,{text  : "Dashboard Page"           , name  : "page_id"               , type  : "select"           , width : 300       , style : "text-align:left;"}
         		,{text  : "Active"                   , name  : "is_active"             , type:"yesno"          , width:75          , style:"text-align:center;"   ,defaultValue:"Y"}
	            
            	    ]
    	     ,onComplete: function(){
                $("#cbFilter2").setCheckEvent("#inActiveRecords input[name='cb']");
                $("select[name='page_id']").dataBind( "pages");
                $("select, input").on("keyup change", function(){
                    var $zRow = $(this).closest(".zRow");
                    $zRow.find("#is_edited").val("Y");
                });  
        }  
    });    
}
    


    
                                          