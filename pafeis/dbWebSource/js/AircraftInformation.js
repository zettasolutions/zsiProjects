var  bs = zsi.bs.ctrl
    ,svn =  zsi.setValIfNull
    ,tblCP = "tblComponents"
;
    


zsi.ready(function(){
    displayRecords();
    getTemplate();
});

      var contextComponents = { id:"modalWindowComponents"
                        , title: "Components"
                        , sizeAttr: "modal-lg"
                        , footer: '<div class="pull-left"><button type="button" onclick="submitComponents();" class="btn btn-primary">'
                        + '<span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Save</button>'

                        , body:            
                        '<div id="' + tblCP + '" class="zGrid"></div>'
                             
      };
      
function getTemplate(callback){
    $.get(base_url + "templates/bsDialogBox.txt",function(d){
        var template = Handlebars.compile(d); 
        
        $("body").append(template(contextComponents));
       
        if(callback) callback();
    });    
}  
        
$("#btnSave").click(function () {
    console.log("test");
   $("#grid").jsonSubmit({
             procedure: "aircraft_info_upd"
            , onComplete: function (data) {
                $("#grid").clearGrid();
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                displayRecords();
            }
    });
});

function manageComponents(id,title){
        aircraft_info_id=id;
        displayRecordsComponents(id);
        $("#frm_modalWindowComponents .modal-title").text("Components for » " + title);
        $('#modalWindowComponents').modal({ show: true, keyboard: false, backdrop: 'static' });
        $('#modalWindowComponents');//.setCloseModalConfirm();
        $("#modalWindowComponents .modal-body").css("height","450px");
}
    
function displayRecords(){
     var cb = bs({name:"cbFilter1",type:"checkbox"});
     $("#grid").dataBind({
	     url            : execURL + "aircraft_info_sel"
	    ,width          : $(document).width() -50
	    ,height         : $(document).height() - 250
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
                 {text  : cb                                                           , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"aircraft_info_id",type:"hidden",value: svn (d,"aircraft_info_id")})
                                                      +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
            }	 
        		,{text  : "Code"                        , name  : "aircraft_code"               , type  : "input"         , width : 100       , style : "text-align:left;"}
        		,{text  : "Name"                        , name  : "aircraft_name"               , type  : "input"         , width : 170       , style : "text-align:left;"}
        		,{text  : "Type"                        , name  : "aircraft_type_id"            , type  : "select"        , width : 150       , style : "text-align:left;"}
        		,{text  : "Squadron"                    , name  : "squadron_id"                 , type  : "select"        , width : 220       , style : "text-align:left;"}
        		,{text  : "Aircraft Time"               , name  : "aircraft_time"               , type : "input"          , width : 130       , style : "text-align:left;"}
        		,{text  : "Aircraft Source"             , name  : "aircraft_source_id"          , type : "select"         , width : 180       , style : "text-align:left;"}
        		,{text  : "Aircraft Dealer"             , name  : "aircraft_dealer_id"          , type : "select"         , width : 180       , style : "text-align:left;"}
        		,{text  : "Status"                      , name  : "status_id"                   , type : "select"         , width : 150       , style : "text-align:left;"}
        		,{text  : "# of Components"             , width : 150                           , style : "text-align:center;"      
                    ,onRender  :  
                        function(d){return "<a href='javascript:manageComponents(" + svn(d,"aircraft_info_id") + ",\"" +  svn(d,"aircraft_name")  + "\");'>" + svn(d,"countItems") + "</a>"; 
                    }
                }

	    ]
    	     ,onComplete: function(){
                $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
                $("select[name='aircraft_type_id']").dataBind( "aircraft_type");
                $("select[name='squadron_id']").dataBind( "squadron");
                $("select[name='aircraft_source_id']").dataBind( "supply_source");
                $("select[name='aircraft_dealer_id']").dataBind( "dealer");
                $("select[name='status_id']").dataBind( "status");
        }  
    });    
}
    
function displayRecordsComponents(id){
     $("#" + tblCP).dataBind({
	     url            : execURL + "items_sel @aircraft_info_id=" + id
	    ,width          : 850
	    ,height         : 400
        ,blankRowsLimit : 5
        ,dataRows       : [
        		 {text  : "Part No."                 , name  : "part_no"                , type  : "input"         , width : 100        , style : "text-align:left;"}
        		,{text  : "National Stock No."       , name  : "national_stock_no"      , type  : "input"         , width : 160       , style : "text-align:left;"}
        		,{text  : "Item Name"                , name  : "item_name"              , type  : "input"         , width : 150       , style : "text-align:left;"}
        		,{text  : "Serial No."               , name  : "serial_no"              , type  : "input"         , width : 200       , style : "text-align:left;"}
        		,{text  : "Manufacturer Name"        , name  : "manufacturer_name"      , type  : "input"         , width : 200       , style : "text-align:left;"}
 	    ] 
    });    
}    

$("#btnDelete").click(function(){
    zsi.form.deleteData({
         code       : "sys-0008"
        ,onComplete : function(data){
                        displayRecords();
                      }
    });       
});
    
                                           