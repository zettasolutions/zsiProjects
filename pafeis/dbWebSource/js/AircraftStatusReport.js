var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;


zsi.ready(function(){
    displayRecords();
});


$("select[name='aircraftStatusReport_filter']").dataBind({
    url: execURL + "dd_aircraft_organizations_sel" 
    , text: "organization_name"
    , value: "organization_id"
});

$("#btnGo").click(function(){
   displayRecords();
});

function displayRecords(){
    var oId      = $("#aircraftStatusReport_filter").val();
     $("#grid").dataBind({
	     url            : execURL + "aircraft_status_report_sel @organization_id=" + (oId ? oId : null)
	    ,width          : $(document).width() - 35
	    ,height         : $(document).height() - 250
        ,isPaging : false
        ,dataRows : [
    		 {text:"Wing"                      , name:"wing"                    , width:200         , style:"text-align:left;"   }	 
    		,{text:"Squadron"                  , name:"squadron"                , width:200         , style:"text-align:left;"   }	  
    		,{text:"Organization Code"         , name:"organization_code"       , width:200         , style:"text-align:left;"   }	 
    		,{text:"Aircraft Code"             , name:"aircraft_code"           , width:150         , style:"text-align:center;" }	 
            ,{text:"Aircraft Type"             , name:"aircraft_type"           , width:200         , style:"text-align:left;"   }
    		,{text:"Aircraft Name"             , name:"aircraft_name"           , width:150         , style:"text-align:left;"   }
    		,{text: "Aircraft Time"            , name:"aircraft_time"           , width:200         , style:"text-align:left;"   }
    		,{text: "Status"                   , name:"status_name"             , width:200         , style:"text-align:left;"   }
	    ]
	    
    });    
}




   