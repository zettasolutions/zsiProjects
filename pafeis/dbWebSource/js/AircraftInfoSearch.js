var  bs = zsi.bs.ctrl
    ,svn = zsi.setValIfNull;

zsi.ready(function(){
    //setSearch();
});

function setSearch(){
    new zsi.search({
        tableCode: "ref-0024"
        ,colNames : ["aircraft_name"] 
        ,displayNames : ["Search"]  
        ,searchColumn :"aircraft_name"
        ,input:"input[name=aircraft_filter]"
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
    displayRecords($("#aircraft_filter").val());
});

function displayRecords(filter){  
    var rownum=0;
    $("#grid").dataBind({
	     url   : execURL + "aircraft_info_search_sel @search='"+ filter +"'" 
        ,width      : $(document).width() - 25
	    ,height     : $(document).height() - 250
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

     