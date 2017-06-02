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
                        , sizeAttr: "fullWidth"
                        , title: "Aircraft Type"
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
         code       : "ref-0039"
        ,onComplete : function(data){
                $("#grid").trigger('refresh');
                displayInactive();
        }
    }); 
} 

function submitData(){    
  $("#frm_modalWindow").jsonSubmit({
            procedure  : "aircraft_type_upd"
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
    $(".modal-title").text("Inactive Aircraft Type");
    $('#modalWindow').modal({ show: true, keyboard: false, backdrop: 'static' });
    //$('#modalWindow').setCloseModalConfirm(); 
    displayInactive();
}); 

$("#btnSave").click(function () {
   $("#grid").jsonSubmit({
             procedure: "aircraft_type_upd"
            ,optionalItems: ["is_active"]
            ,onComplete: function (data) {
                $("#grid").clearGrid();
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                displayRecords();
            }
    });
});

function displayRecords(){   
      var cb = bs({name:"cbFilter1",type:"checkbox"});
     $("#grid").dataBind({
	     url            : execURL + "aircraft_type_sel"
	    ,width          : $(document).width() - 35
	    ,height         : $(document).height() - 250
        ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,dataRows : [
    	
    		   { text  : cb                      , width : 25        , style : "text-align:left;"       
            		    , onRender      :  function(d){ 
                		              return bs({name:"aircraft_type_id"   ,value: svn (d,"aircraft_type_id")    ,type:"hidden"})
                		                 +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                    }
                }	 
            	,{ text:"Aircraft Type"             , width:180             , style:"text-align:center;"        , type:"input"          ,name:"aircraft_type"}
            	,{ text:"Manufacturer"              , width:180             , style:"text-align:center;"        , type:"select"         ,name:"manufacturer_id"}
            	,{ text:"Origin"                    , width:200             , style:"text-align:center;"        , type:"select"         ,name:"origin_id"}
            	,{ text:"Aircraft Class"            , width:150             , style:"text-align:center;"        , type:"select"         ,name:"aircraft_class_id"}
            	,{ text:"Aircraft Role"             , width:200             , style:"text-align:center;"        , type:"select"         ,name:"aircraft_role_id"}
            	,{ text:"Introduced Year"           , width:120             , style:"text-align:center;"        , type:"input"          ,name:"introduced_year"}
            	,{ text:"In Service"                , width:120              , style:"text-align:center;"        , type:"input"          ,name:"in_service"}
            	,{ text:"Note"                      , width:220            , style:"text-align:center;"        , type:"input"          ,name:"note"}
            	,{ text:"Active?"                   , width:70              , style:"text-align:center;"        , type:"yesno"          ,name:"is_active"  ,defaultValue:"Y"}
	    ]
	      ,onComplete: function(){
                    $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
                    $("select[name='manufacturer_id']").dataBind( "manufacturer");
                    $("select[name='origin_id']").dataBind("origin");
                    $("select[name='aircraft_class_id']").dataBind( "aircraft_class");
                    $("select[name='aircraft_role_id']").dataBind( "aircraft_role");
            }
    });    
}

function displayInactive(){   
      var cb = bs({name:"cbFilter2",type:"checkbox"});
     $("#inActiveRecords").dataBind({
	     url            : execURL + "aircraft_type_sel @is_active='N'"
	    ,width          : $(document).width() - 35
	    ,height         : $(document).height() - 250
        ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,dataRows : [
    	
    		   { text  : cb                      , width : 25        , style : "text-align:left;"       
            		    , onRender      :  function(d){ 
                		              return bs({name:"aircraft_type_id"   ,value: svn (d,"aircraft_type_id")    ,type:"hidden"})
                		                 +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                    }
                }	 
            	,{ text:"Aircraft Type"             , width:180             , style:"text-align:center;"        , type:"input"          ,name:"aircraft_type"}
            	,{ text:"Manufacturer"              , width:180             , style:"text-align:center;"        , type:"select"         ,name:"manufacturer_id"}
            	,{ text:"Origin"                    , width:200             , style:"text-align:center;"        , type:"select"         ,name:"origin_id"}
            	,{ text:"Aircraft Class"            , width:150             , style:"text-align:center;"        , type:"select"         ,name:"aircraft_class_id"}
            	,{ text:"Aircraft Role"             , width:200             , style:"text-align:center;"        , type:"select"         ,name:"aircraft_role_id"}
            	,{ text:"Introduced Year"           , width:120             , style:"text-align:center;"        , type:"input"          ,name:"introduced_year"}
            	,{ text:"In Service"                , width:120              , style:"text-align:center;"        , type:"input"          ,name:"in_service"}
            	,{ text:"Note"                      , width:220            , style:"text-align:center;"        , type:"input"          ,name:"note"}
            	,{ text:"Active?"                   , width:70              , style:"text-align:center;"        , type:"yesno"          ,name:"is_active"  ,defaultValue:"Y"}
	    ]
	      ,onComplete: function(){
                    $("#cbFilter2").setCheckEvent("#inActiveRecords input[name='cb']");
                    $("select[name='manufacturer_id']").dataBind( "manufacturer");
                    $("select[name='origin_id']").dataBind("origin");
                    $("select[name='aircraft_class_id']").dataBind( "aircraft_class");
                    $("select[name='aircraft_role_id']").dataBind( "aircraft_role");
            }
    });    
}
