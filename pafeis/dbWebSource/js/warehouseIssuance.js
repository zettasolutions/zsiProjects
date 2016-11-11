var  bs = zsi.bs.ctrl
    ,svn =  zsi.setValIfNull
    ,tblID = "tblIssuanceDetails"
;



zsi.ready(function(){
    getTemplate();
    displayRecords();
});

      var contextIssuanceDetails = { id:"modalWindowIssuanceDetails"
                        , title: "Item Types"
                        , sizeAttr: "modal-lg"
                        , footer: '<div class="pull-left"><button type="button" onclick="submitItemsTypes();" class="btn btn-primary">'
                        + '<span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Save</button>'
                                + '<button type="button" onclick="manageInactiveItemTypes();" class="btn btn-primary"><span class="glyphicon glyphicon-ban-circle">'
                                + '</span>&nbsp;Inactive</button>'

                        , body:            
                        '<div id="' + tblID + '" class="zGrid"></div>'
                             
        };


function getTemplate(callback){
    $.get(base_url + "templates/bsDialogBox.txt",function(d){
        var template = Handlebars.compile(d); 
        
        $("body").append(template(contextIssuanceDetails));

        if(callback) callback();
    });    
}  
$("#btnSave").click(function () {
   $("#grid").jsonSubmit({
             procedure: "item_categories_upd"
            , optionalItems: ["is_active"]
            , onComplete: function (data) {
                $("#grid").clearGrid();
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                displayRecords();
            }
    });
});

function submitItemsTypes(){
          $("#frm_modalWindowItemTypes").jsonSubmit({
             procedure      : "item_types_upd"
            ,optionalItems  : ["item_cat_id","monitoring_type_id","is_active"]
            ,onComplete     : function (data) {
               if(data.isSuccess===true) zsi.form.showAlert("alert");
               $("#grid").trigger("refresh");
               displayRecordsItemTypes(item_cat_id);
                
            }
        });
}

function submitItemsCodes(){
          $("#frm_modalWindowItemCodes").jsonSubmit({
             procedure      : "item_codes_upd"
            ,optionalItems  : ["item_type_id","is_active"]
            ,onComplete     : function (data) {
               if(data.isSuccess===true) zsi.form.showAlert("alert");
               displayRecordsItemTypes(item_cat_id);
               displayRecordsItemCodes(item_type_id);
                
            }
        });
}

function manageIssuanceDetails(id,title){
        issuance_id=id;
        displayRecordsIssuanceDetails(id);
        $("#frm_modalWindowItemTypes .modal-title").text("Item Types for » " + title);
        $('#modalWindowItemTypes').modal({ show: true, keyboard: false, backdrop: 'static' });
        $('#modalWindowItemTypes');//.setCloseModalConfirm();
        $("#modalWindowItemTypes .modal-body").css("height","450px");
}
    

function displayRecords(){
     var cb = bs({name:"cbFilter1",type:"checkbox"});
     $("#grid").dataBind({
	     url            : execURL + "issuances_sel"
	    ,width          : $(document).width() - 35
	    ,height         : $(document).height() - 250
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
                 {text  : cb                                                           , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"issuance_id",type:"hidden",value: svn (d,"issuance_id")})
                                                      +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
            }	 
        		,{text  : "Issuance No."          , name  : "issuance_no"          , type  : "input"             , width : 50        , style : "text-align:left;"}
        		,{text  : "Authority"             , name  : "authority_id"         , type  : "select"            , width : 200       , style : "text-align:left;"}
        		,{text  : "Issued to"             , name  : "issued_to_id"         , type  : "select"            , width:55          , style : "text-align:left;"   ,defaultValue:"Y"}
        		,{text  : "Issuance Details"          , width : 80                 , style : "text-align:center;"      
                    ,onRender  :  
                        function(d){return "<a href='javascript:manageIssuanceDetails(" + svn(d,"issuance_id") + ",\"" +  svn(d,"issuance_no")  + "\");'>" + svn(d,"countIssuanceDetails") + "</a>"; 
                    }
                }

	    ] 
    	     ,onComplete: function(){
                $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
        }  
    });    
}

function displayRecordsIssuanceDetails(id){
     var cb = bs({name:"cbFilter2",type:"checkbox"});
     $("#" + tblID).dataBind({
	     url            : execURL + "issuance_details_sel @issuance_id=" + id
	    ,width          : 750
	    ,height         : 400
	    ,selectorType   : "checkbox"
        ,blankRowsLimit : 5
        ,dataRows       : [
            
                 {text  : cb     , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"issuance_detail_id",type:"hidden",value: svn (d,"issuance_detail_id")})
                		                            +  bs({name:"issuance_id",type:"hidden",value: id})
                                                    +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
            }	 
        		,{text  : "Item"                , name  : "item_id"                 , type  : "select"       , width : 160       , style : "text-align:left;"}
        		,{text  : "Aircraft"            , name  : "aircraft_id"             , type  : "select"       , width : 200       , style : "text-align:left;"}
        		,{text  : "Unit of Measurement" , name  : "unit_of_measure_id"      , type  : "select"       , width : 200       , style : "text-align:left;"}
        		,{text  : "Quantiy"             , name  : "quantity"                , type  : "yesno"        , width : 75        , style : "text-align:center;"  ,defaultValue:"Y"}

	    ] 
    	     ,onComplete: function(){
                $("#cbFilter2").setCheckEvent("#" + tblID + " input[name='cb']");
                $("select[name='monitoring_type_id']").dataBind( "monitoring_type");
        }  
    });    
}    

function displayRecordsItemCodes(id){
     var cb = bs({name:"cbFilter3",type:"checkbox"});
     $("#" + tblIC).dataBind({
	     url            : execURL + "item_codes_sel @item_type_id=" + id
	    ,width          : 750
	    ,height         : 400
	    ,selectorType   : "checkbox"
        ,blankRowsLimit : 5
        ,dataRows       : [
            
                 {text  : cb     , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"item_code_id",type:"hidden",value: svn (d,"item_code_id")})
                		                            +  bs({name:"item_type_id",type:"hidden",value: id})
                                                    +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
            }	 
        		,{text  : "Part No."            , name  : "part_no"               , type  : "input"         , width : 65       , style : "text-align:left;"}
        		,{text  : "National Stock No."  , name  : "national_stock_no"     , type  : "input"         , width : 150       , style : "text-align:left;"}
        		,{text  : "Item Name"           , name  : "item_name"             , type  : "input"         , width : 400      , style : "text-align:left;"}
        		,{text  : "Is Active?"          , width : 100                      , type  : "yesno"         , style : "text-align:center;"  ,defaultValue:"Y"}
	    ] 
    	     ,onComplete: function(){
                $("#cbFilter3").setCheckEvent("#" + tblIC + " input[name='cb']");
        }  
    });    
}    


$("#btnDelete").click(function(){
    zsi.form.deleteData({
         code       : "ref-0005"
        ,onComplete : function(data){
                        displayRecords();
                      }
    });       
});
    
                                              