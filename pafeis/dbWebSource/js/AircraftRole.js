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
                        , sizeAttr: "modal-xs"
                        , title: "Aircraft Role"
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
         code       : "ref-0015"
        ,onComplete : function(data){
                $("#grid").trigger('refresh');
                displayInactive();
        }
    }); 
} 

function submitData(){    
  $("#frm_modalWindow").jsonSubmit({
            procedure  : "aircraft_role_upd"
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
    $(".modal-title").text("Inactive Aircraft Role");
    $('#modalWindow').modal({ show: true, keyboard: false, backdrop: 'static' });
    //$('#modalWindow').setCloseModalConfirm(); 
    displayInactive();
}); 

$("#btnSave").click(function () {
  //  console.log("test");
   $("#grid").jsonSubmit({
             procedure: "aircraft_role_upd"
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
	     url            : execURL + "aircraft_role_sel"
	    ,width          : $(document).width() - 35
	    ,height         : $(document).height() - 250
        ,selectorType   : "checkbox"
        ,blankRowsLimit:5
       // ,isPaging : false
        ,dataRows : [
    	
    		   {text  : cb                      , width : 25        , style : "text-align:left;"       
            		    , onRender      :  function(d){ 
                		              return bs({name:"aircraft_role_id"   ,value: svn (d,"aircraft_role_id")    ,type:"hidden"})
                		                 +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                    }
                }	 
            	,{ text:"Aircraft Role"         , width:300          , style:"text-align:center;"        , type:"input"          ,name:"aircraft_role"}
            	,{ text:"Active"                , width:75           , style:"text-align:center;"        , type:"yesno"         ,name:"is_active"  ,defaultValue:"Y"}
	    ]
	      ,onComplete: function(){
                    $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
            }
    });    
}
$("#btnDelete").click(function(){
    zsi.form.deleteData({
         code       : "ref-0015"
        ,onComplete : function(data){
                        displayRecords();
                      }
    });      
});        

function displayInactive(){   
      var cb = bs({name:"cbFilter2",type:"checkbox"});
     $("#inActiveRecords").dataBind({
	     url            : execURL + "aircraft_role_sel @is_active='N'"
	    ,width          : 500
	    ,height         : $(document).height() - 250
        ,selectorType   : "checkbox"
        ,blankRowsLimit:5
       // ,isPaging : false
        ,dataRows : [
    	
    		   {text  : cb                      , width : 25        , style : "text-align:left;"       
            		    , onRender      :  function(d){ 
                		              return bs({name:"aircraft_role_id"   ,value: svn (d,"aircraft_role_id")    ,type:"hidden"})
                		                 +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                    }
                }	 
            	,{ text:"Aircraft Role"         , width:300          , style:"text-align:center;"        , type:"input"          ,name:"aircraft_role"}
            	,{ text:"Active"                , width:75           , style:"text-align:center;"        , type:"yesno"         ,name:"is_active"  ,defaultValue:"Y"}
	    ]
	      ,onComplete: function(){
                    $("#cbFilter2").setCheckEvent("#inActiveRecords input[name='cb']");
            }
    });    
}
       