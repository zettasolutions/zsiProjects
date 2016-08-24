 var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;


zsi.ready(function(){
    displayRecords();
   
  
});

$("#TimeIn").click(function () {
    $.post( 
         procURL + "dtr_upd @loginType='I'"
        ,function (data) {
                  $("#grid").clearGrid();
                  if(data.isSuccess===true) zsi.form.showAlert("alert");
                  displayRecords();
             }
        );    
});

$("#timeOut").click(function () {
    $.post( 
         procURL + "dtr_upd @loginType='O'"
        ,function (data) {
                  $("#grid").clearGrid();
                  if(data.isSuccess===true) zsi.form.showAlert("alert");
                  displayRecords();
             }
        );    
});


 function displayRecords(){   
     // var cb = bs({name:"cbFilter1",type:"checkbox"});
     $("#grid").dataBind({
	     url            : procURL + "dtr_sel" 
	    ,width          : 833
	    ,height         : 506
	    //,selectorType   : "checkbox"
        //,blankRowsLimit:5
       // ,isPaging : false
        ,dataRows : [
    	
    		   {text  : " "                                 , width : 25        , style : "text-align:left;"       
            		    , onRender      :  function(d){ 
                		              return bs({name:"dtr_id"   ,value: svn (d,"dtr_id")    ,type:"hidden"})
                		                  +  bs({name:"employee_id"   ,value: svn (d,"employee_id")    ,type:"hidden"})
                		                  //+  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                    }
                }	 
            	,{ text:"Time in"                       , width:400             , style:"text-align:left;"                    ,name:"time_in"
                    	    ,onRender:function(d){
                    	        return d.time_in.toDateTime();
                    	    }
                    	}
            	,{ text:"Time out"                      , width:400             , style:"text-align:left;"                    ,name:"time_out"
                    	     ,onRender:function(d){
                    	        return d.time_out.toDateTime();
                    	    }
                    	}
	    ]
    });    
}



String.prototype.toDateTime = function(){
  var date  =  new Date(this);    
  if( ! date.isValid())  return "";
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return this.toDateFormat() + " " + strTime + " : " + getWeekDay(date.getDay());
    
};


function getWeekDay(dayNo) {
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayNo];
}






         