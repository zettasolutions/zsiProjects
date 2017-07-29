var  bs = zsi.bs.ctrl
    ,svn = zsi.setValIfNull;

zsi.ready(function(){
    //setSearch();
    loadSquadron();
    loadAircraftType();
    loadStatus();
});

function loadSquadron(){
    var $select = $("#squadron_filter");
    $select.dataBind({
        url: procURL + "dd_aircraft_organizations_sel" 
        , text: "organization_name"
        , value: "organization_id"
    });
}

function loadAircraftType(){
    var $select = $("#type_filter");
    $select.dataBind("aircraft_type");
}

function loadStatus(){
    var $select = $("#status_filter");
    $select.dataBind("aircraftStatuses");
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
            displayRecords(data.aircraft_info_id);
        }
    });        
}

$("#btnGo").click(function(){
    var squadronFilter = $("#squadron_filter").val();
    var typeFilter = $("#type_filter").val();
    var statusFilter = $("#status_filter").val();
    var searchFilter = $("#search_filter").val();
    displayRecords(searchFilter);
});

function displayRecords(filter){  
    var rownum=0;
    $("#grid").dataBind({
	     url   : execURL + "aircraft_info_search_sel @search='"+ filter +"'" 
        ,width      : $(document).width() - 25
	    ,height     : $(document).height() - 200
        ,dataRows   : [
     		 {  
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
     		    ,style : "text-align:left;"      
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

       