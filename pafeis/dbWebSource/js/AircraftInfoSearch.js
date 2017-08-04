var  bs = zsi.bs.ctrl
    ,svn = zsi.setValIfNull
    ,wingFilter = null
    ,squadronFilter = null
    ,typeFilter = null
    ,statusFilter = null
    ,searchFilter = ""
    ,g_organization_id = null
    ,g_squadron_id = null;

zsi.ready(function(){
    //setSearch();
    setInputs();
    //getUserInfo(function(){
        loadWing();
        loadSquadron();
        loadAircraftType();
        loadStatus();
    //});
});

function setInputs(){
    $wingFilter = $("#wing_filter");
    $squadronFilter = $("#squadron_filter");
    $typeFilter = $("#type_filter");
    $statusFilter = $("#status_filter");
    $searchFilter = $("#search_filter");
}

function getUserInfo(callBack){
    $.get(procURL + "user_info_sel", function(d) {
        if (d.rows !== null && d.rows.length > 0) {
            g_organization_id = d.rows[0].organization_id;
        }
        if(callBack) callBack();
    });
}

function loadWing(){
    $wingFilter.dataBind({
        url: procURL + "dd_organizations_sel @organization_type_code='Wing',@squadron_type=''" 
        , text: "organization_name"
        , value: "organization_id"
        , onComplete: function(){
            $wingFilter.unbind();
            $wingFilter.change(function(){
                g_organization_id = (this.value!=="" ? this.value: null);
                loadSquadron();
                loadAircraftType();
            });
        }
    });
}

function loadSquadron(){
    $squadronFilter.dataBind({
        url: procURL + "dd_organizations_sel @organization_id="+ g_organization_id +",@squadron_type='Aircraft'" 
        , text: "organization_name"
        , value: "organization_id"
        , onComplete: function(){
            $squadronFilter.unbind();
            $squadronFilter.change(function(){
                g_squadron_id = (this.value!=="" ? this.value: null);
                loadAircraftType();
            });
        }
    });
}

function loadAircraftType(){
    $typeFilter.dataBind({
        url: procURL + "dd_aircraft_types_sel @wing_id="+ g_organization_id +",@squadron_id="+ g_squadron_id 
        , text: "aircraft_type"
        , value: "aircraft_type_id"
    });
}

function loadStatus(){
    $statusFilter.dataBind("aircraftStatuses");
}

function setSearch(){
    new zsi.search({
        tableCode: "ref-0024"
        ,colNames : ["aircraft_name"] 
        ,displayNames : ["Search"]  
        ,searchColumn :"aircraft_name"
        ,input:"input[name=search_filter]"
        ,url : execURL + "searchData"
        //,condition :"'is_active=''Y'''"
        ,onSelectedItem: function(currentObject,data,i){ 
            currentObject.value=data.logon;
            var tr  = currentObject.parentNode.parentNode;
            $(tr).find("#aircraft_info_id_filter").val(data.aircraft_info_id);
            displayRecords();
        }
    });        
}

$("#btnGo").click(function(){
    squadronFilter = ($squadronFilter.val()!==""? $squadronFilter.val() : null);
    typeFilter = ($typeFilter.val()!==""? $typeFilter.val() : null);
    statusFilter = ($statusFilter.val()!==""? $statusFilter.val() : null);
    searchFilter = $.trim($searchFilter.val());
    displayRecords();
});

function displayRecords(){  
    var rownum=0;
    $("#grid").dataBind({
	     url   : execURL + "aircraft_info_search_sel @squadron_id="+ squadronFilter +",@aircraft_type_id="+ typeFilter +",@status_id="+ statusFilter +",@search='"+ searchFilter +"'" 
        ,width      : $(document).width() - 25
	    ,height     : $(document).height() - 200
        ,dataRows   : [
                {  
     		     text  : "" 
     		    ,width : 25     
     		    ,style : "text-align:center;"     
     		    ,onRender : function(){
     		        rownum++;
     		        return rownum;
     		    }
     		 }
     		 ,{  
     		     text  : "Aircraft Code"      
     		    ,name  : "aircraft_code"
     		    ,width : 150     
     		    ,style : "text-align:left;"      
     		 }
     		 ,{  
     		     text  : "Aircraft Name"      
     		    ,name  : "aircraft_name"
     		    ,width : 200     
     		    ,style : "text-align:left;"      
     		 }
     		 ,{  
     		     text  : "Aircraft Time"      
     		    ,name  : "aircraft_time"
     		    ,width : 150     
     		    ,style : "text-align:center;"   
     		    ,onRender : function(d){
     		        return formatCurrency(svn(d, "aircraft_time"));
     		    }
     		 }
     		 ,{  
     		     text  : "Remaining Time To Inspection"      
     		    ,name  : "service_time"
     		    ,width : 150     
     		    ,style : "text-align:center;"    
     		    ,onRender : function(d){
     		        return formatCurrency(svn(d, "service_time"));
     		    }
     		 }
     		 ,{  
     		     text  : "Aircraft Type"      
     		    ,name  : "aircraft_type"
     		    ,width : 150     
     		    ,style : "text-align:left;"      
     		 }
     		 ,{  
     		     text  : "Squadron"      
     		    ,name  : "squadron"
     		    ,width : 200     
     		    ,style : "text-align:left;"      
     		 }
     		 ,{  
     		     text  : "Supply Source"      
     		    ,name  : "supply_source"
     		    ,width : 200     
     		    ,style : "text-align:centerleft;"      
     		 }
     		 ,{  
     		     text  : "Dealer"      
     		    ,name  : "dealer"
     		    ,width : 200    
     		    ,style : "text-align:left;"      
     		 }
     		 ,{  
     		     text  : "Status"      
     		    ,name  : "status_name"
     		    ,width : 150     
     		    ,style : "text-align:left;"      
     		 }
	    ]
	    ,onComplete: function(){
	        $("#grid").removeClass("hide");
	    }
    });    
}

function formatCurrency(number){
    var result = "";
    if(number!==""){
        result = parseFloat(number).toFixed(2).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }
    return result;
}  
 