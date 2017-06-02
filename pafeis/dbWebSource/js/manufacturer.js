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
                        , title: "Manufacturer"
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
         code       : "ref-0016"
        ,onComplete : function(data){
                $("#grid").trigger('refresh');
                displayInactive();
        }
    }); 
} 

function submitData(){    
  $("#frm_modalWindow").jsonSubmit({
            procedure  : "manufacturers_upd"
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
    $(".modal-title").text("Inactive Manufacturer");
    $('#modalWindow').modal({ show: true, keyboard: false, backdrop: 'static' });
    //$('#modalWindow').setCloseModalConfirm(); 
    displayInactive();
}); 

$("#btnSave").click(function () {
  //  console.log("test");
   $("#grid").jsonSubmit({
             procedure: "manufacturers_upd"
            ,optionalItems: ["is_local","is_active"]
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
	     url            : execURL + "manufacturers_sel"
	    ,width          : $(document).width() - 35
	    ,height         : $(document).height() - 250
        ,selectorType   : "checkbox"
        ,blankRowsLimit:5
       // ,isPaging : false
        ,dataRows : [
    	
    		   {text  : cb                      , width : 25        , style : "text-align:left;"       
            		    , onRender      :  function(d){ 
                		              return bs({name:"manufacturer_id"   ,value: svn (d,"manufacturer_id")    ,type:"hidden"})
                		                 +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                    }
                }	 
            	,{ text:"Manufacturer Name"     , width:250          , style:"text-align:center;"        , type:"input"          ,name:"manufacturer_name"}
            	,{ text:"Full Address"          , width:260          , style:"text-align:center;"        , type:"input"          ,name:"full_address"}
            	,{ text:"Contact No."           , width:200          , style:"text-align:center;"        , type:"input"          ,name:"contact_no"}
            	,{ text:"Email Address"         , width:200          , style:"text-align:center;"        , type:"input"          ,name:"email_address"}
            	,{ text:"Contact Person"        , width:210          , style:"text-align:center;"        , type:"input"          ,name:"contact_person"}
            	,{ text:"Local?"                , width:75           , style:"text-align:center;"        , type:"yesno"          ,name:"is_local"   ,defaultValue:"Y"}
            	,{ text:"Active"                , width:75           , style:"text-align:center;"        , type:"yesno"          ,name:"is_active"  ,defaultValue:"Y"}
	    ]
	      ,onComplete: function(){
                    $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
            }
    });    
}

function displayInactive(){   
      var cb = bs({name:"cbFilter2",type:"checkbox"});
     $("#inActiveRecords").dataBind({
	     url            : execURL + "manufacturers_sel @is_active='N'"
	    ,width          : $(document).width() - 35
	    ,height         : $(document).height() - 250
        ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,dataRows : [
    	
    		   {text  : cb                      , width : 25        , style : "text-align:left;"       
            		    , onRender      :  function(d){ 
                		              return bs({name:"manufacturer_id"   ,value: svn (d,"manufacturer_id")    ,type:"hidden"})
                		                 +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                    }
                }	 
            	,{ text:"Manufacturer Name"     , width:250          , style:"text-align:center;"        , type:"input"          ,name:"manufacturer_name"}
            	,{ text:"Full Address"          , width:260          , style:"text-align:center;"        , type:"input"          ,name:"full_address"}
            	,{ text:"Contact No."           , width:200          , style:"text-align:center;"        , type:"input"          ,name:"contact_no"}
            	,{ text:"Email Address"         , width:200          , style:"text-align:center;"        , type:"input"          ,name:"email_address"}
            	,{ text:"Contact Person"        , width:210          , style:"text-align:center;"        , type:"input"          ,name:"contact_person"}
            	,{ text:"Local?"                , width:75           , style:"text-align:center;"        , type:"yesno"          ,name:"is_local"   ,defaultValue:"Y"}
            	,{ text:"Active"                , width:75           , style:"text-align:center;"        , type:"yesno"          ,name:"is_active"  ,defaultValue:"Y"}
	    ]
	      ,onComplete: function(){
                    $("#cbFilter2").setCheckEvent("#inActiveRecords input[name='cb']");
            }
    });    
}
        