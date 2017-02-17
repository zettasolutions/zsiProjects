var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;
var tblName     = "tblASRD";
var modalWindow = 0;
var aircraft_type_id =null;
zsi.ready(function(){
    displayRecords();
    getTemplate();
});

function getTemplate(){
    $.get(base_url + "templates/bsDialogBox.txt",function(d){
        var template = Handlebars.compile(d);     
        
        var context = { id:"modalWindow"
                        , title: "" 
                        , sizeAttr: "modal-lg"
                        //, footer:  ' <div class="pull-left"><button type="button" onclick="submitItems();" class="btn btn-primary"><span class="glyphicon glyphicon-floppy-disk"></span> Save</button></div>'
                        , body:'<div><div id="' + tblName + '" class="zGrid"></div></div>'
                      };
        var html    = template(context);     
        $("body").append(html);

    });    
}
$("#btnGo").click(function(){
   displayRecords($("#AircraftStatusReport_filter").val());
});
function displayRecords(){
     var cb = bs({name:"cbFilter1",type:"checkbox"});
     $("#grid").dataBind({
	     url            : execURL + "aircraft_status_report_sel"
	    ,width          : $(document).width() - 35
	    ,height         : $(document).height() - 250
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
        		{text  : "Aircraft Type"           , name  : "aircraft_type"            , width : 200         , style : "text-align:left;"
        		       
        		}
        		,{text  : "Count"                  , width : 100       , style : "text-align:center;"
        		        ,onRender : function(d){
                            return "<a href='javascript:manageAircraftStatusReport(" + svn(d,"aircraft_type_id") +");'>" + svn(d,"countStatus") + "</a>"; 
                    }
        		}
        		,{text  : "Status Name"            , name  : "status_name"              , width : 200       , style : "text-align:left;"}
	    ]   
    	     ,onComplete: function(){
              
        }  
    });    
}

function manageAircraftStatusReport(id){
    aircraft_type_id =id;
    displayAircraftStatusReportDetails(id);
    $(".modal-title").text("Aircraft Status Report Details");
    $('#modalWindow').modal("show");
    if (modalWindow===0) {
        modalWindow=1;
        $("#modalWindow").on("hide.bs.modal", function () {
                if (confirm("You are about to close this window. Continue?")) return true;
                return false;
        });
    }    
}

function displayAircraftStatusReportDetails(id){   
    $("#" + tblName).dataBind({
         url   : execURL + "aircraft_status_report_details_sel @aircraft_type_id=" + id 
        ,width          : 560
	    ,height         : 400
	    
        ,dataRows       :[
    		 	 
    		 { text:"Organization Code"         , width:200 , style:"text-align:left;"          ,name:"organization_code"  }	 
    		,{ text:"Aircraft Code"             , width:150 , style:"text-align:center;"        ,name:"aircraft_code"     }	 
    		,{ text:"Aircraft Name"             , width:150  , style:"text-align:left;"         ,name:"aircraft_name"   }	 	 
    		
 	    ]
       ,onComplete : function(){
           
        }
    });    
}
 