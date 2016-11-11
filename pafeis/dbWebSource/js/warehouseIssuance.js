var  bs = zsi.bs.ctrl
    ,svn =  zsi.setValIfNull
;



zsi.ready(function(){
    displayRecords();
    displayRecordsIssuanceDetails();
    $("select[name='authority_id']").dataBind("wing");
    
    $("select[name='authority_id']").change(function(){  
        if(this.value)
            $("select[name='issued_to_id']").dataBind("squadron @wing_id=" + this.value);
        else
            alert("Please select authority.");
    });
    
   // $("select[name='issued_by']").dataBind("wing");
    
    setCurrentTab();
});

function setCurrentTab(){
    var projectTabIndex = readCookie("project_tab_index");
    if(typeof projectTabIndex === ud) projectTabIndex=0;
    var $tabs = $("#tabPanel > div");
    var $navTabs = $("ul.nav-tabs > li");
    $tabs.removeClass("active");
    $navTabs.removeClass("active");
    $($tabs.get(projectTabIndex)).addClass("active");
    $($navTabs.get(projectTabIndex)).addClass("active");
}

$("ul.nav-tabs >li").click(function(){
     
    var cur_li_Index = $(this).index();
    
    createCookie("project_tab_index",cur_li_Index,1);
    $("#tabPanel > div").each(function(){
        var obj =  $(this);
        var cur_div_index = obj.index();
        obj.removeClass("active");
        if(cur_li_Index===cur_div_index)
           obj.addClass("active");
    });
 });


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

$("#issued_date").datepicker()
    .on("show", function(e) {
        issuedDate = ($(this).val()? $(this).val():"");
    }).on("changeDate", function(e) {
        issuedDate = $(this).val();
    }).on("hide", function(e) {
        $(this).val(issuedDate);
});

function displayRecords(){ 
    
    $.get( execURL + "issuances_sel " 
    ,function(data){
       // var i = data.rows[0];
        if(data.rows.lenght > 0){
            $("#issuance_no").val(  data.rows[0].issuance_no );
            $("#authority_id").val(  data.rows[0].authority_id );
            $("#issued_to_id").val(  data.rows[0].issued_to_id );
            $("#issued_by").val(  data.rows[0].issued_by );
            $("#issued_date").val(  data.rows[0].issued_date.toDateFormat() );
            $("#issuance_directive_id").val(  data.rows[0].issuance_directive_id );
            $("#page_process_action_id").val(  data.rows[0].page_process_action_id );
            $("#remarks").val(  data.rows[0].remarks );

        }

    });

}


function displayRecordsIssuanceDetails(){
     var cb = bs({name:"cbFilter2",type:"checkbox"});
     $("#grid").dataBind({
	     url            : execURL + "issuance_details_sel " 
	    ,width          : $(document).width() - 120
	    ,height         : 400
	    ,selectorType   : "checkbox"
        ,blankRowsLimit : 5
        ,dataRows       : [
            
                 {text  : cb     , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"issuance_detail_id",type:"hidden",value: svn (d,"issuance_detail_id")})
                		                            +  bs({name:"issuance_id",type:"hidden",value: issuance_id})
                                                    +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
            }	 
        		,{text  : "Item"                , name  : "item_id"                 , type  : "select"       , width : 260       , style : "text-align:left;"}
        		,{text  : "Aircraft"            , name  : "aircraft_id"             , type  : "select"       , width : 200       , style : "text-align:left;"}
        		,{text  : "Unit of Measurement" , name  : "unit_of_measure_id"      , type  : "select"       , width : 350       , style : "text-align:left;"}
        		,{text  : "Quantity"            , name  : "quantity"                , type  : "input"        , width : 75        , style : "text-align:center;" }
        		,{text  : "Remarks"             , name  : "remarks"                 , type  : "input"        , width : 450       , style : "text-align:center;" }

	    ] 
    	     ,onComplete: function(){
                $("#cbFilter2").setCheckEvent("#grid input[name='cb']");
                $("select[name='item_id']").dataBind("squadron");
        }  
    });    
}    


$("#btnDelete").click(function(){
    zsi.form.deleteData({
         code       : "ref-0006"
        ,onComplete : function(data){
                        displayRecords();
                      }
    });       
});
    
                                                  