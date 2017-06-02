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
                        , title: "Dealer"
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
         code       : "ref-0017"
        ,onComplete : function(data){
                $("#grid").trigger('refresh');
                displayInactive();
        }
    }); 
} 

function submitData(){    
  $("#frm_modalWindow").jsonSubmit({
            procedure  : "dealers_upd"
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
    $(".modal-title").text("Inactive Dealer");
    $('#modalWindow').modal({ show: true, keyboard: false, backdrop: 'static' });
    //$('#modalWindow').setCloseModalConfirm(); 
    displayInactive();
}); 


$("#btnSave").click(function () {
  //  console.log("test");
   $("#grid").jsonSubmit({
            procedure: "dealers_upd"
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
	     url            : execURL + "dealers_sel"
	    ,width          : $(document).width() - 35
	    ,height         : $(document).height() - 250
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
                 {text  : cb                                                           , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"dealer_id",type:"hidden",value: svn (d,"dealer_id")})
                                                      +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
            }	 
        		,{text  : "Dealer Name"         , name  : "dealer_name"                 , type  : "input"         , width : 250       , style : "text-align:left;"}
        		,{text  : "Address"             , name  : "full_address"                , type  : "input"         , width : 260       , style : "text-align:left;"}
        		,{text  : "Contact No."         , name  : "contact_no"                  , type  : "input"         , width : 200       , style : "text-align:left;"}
        		,{text  : "Email Address"       , name  : "email_address"               , type  : "input"         , width : 200       , style : "text-align:left;"}        		
        		,{text  : "Contact Person"      , name  : "contact_person"              , type  : "input"         , width : 210       , style : "text-align:left;"}        		
        		,{text  : "Local?"               , name  : "is_local"                    , type  : "yesno"        , width:75          , style : "text-align:center;"   ,defaultValue:"Y"                 }
        		,{text  : "Active?"              , name  : "is_active"                   , type  : "yesno"        , width:75          , style : "text-align:center;"   ,defaultValue:"Y"                 }
	    ] 
    	     ,onComplete: function(){
                $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
        }  
    });    
}
    
function displayInactive(){
     var cb = bs({name:"cbFilter2",type:"checkbox"});
     $("#inActiveRecords").dataBind({
	     url            : execURL + "dealers_sel @is_active='N'"
	    ,width          : $(document).width() - 35
	    ,height         : $(document).height() - 250
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
                 {text  : cb                                                           , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"dealer_id",type:"hidden",value: svn (d,"dealer_id")})
                                                      +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
            }	 
        		,{text  : "Dealer Name"         , name  : "dealer_name"                 , type  : "input"         , width : 250       , style : "text-align:left;"}
        		,{text  : "Address"             , name  : "full_address"                , type  : "input"         , width : 260       , style : "text-align:left;"}
        		,{text  : "Contact No."         , name  : "contact_no"                  , type  : "input"         , width : 200       , style : "text-align:left;"}
        		,{text  : "Email Address"       , name  : "email_address"               , type  : "input"         , width : 200       , style : "text-align:left;"}        		
        		,{text  : "Contact Person"      , name  : "contact_person"              , type  : "input"         , width : 210       , style : "text-align:left;"}        		
        		,{text  : "Local?"               , name  : "is_local"                    , type  : "yesno"        , width:75          , style : "text-align:center;"   ,defaultValue:"Y"                 }
        		,{text  : "Active?"              , name  : "is_active"                   , type  : "yesno"        , width:75          , style : "text-align:center;"   ,defaultValue:"Y"                 }
	    ] 
    	     ,onComplete: function(){
                $("#cbFilter2").setCheckEvent("#inActiveRecords input[name='cb']");
        }  
    });    
}
                                               