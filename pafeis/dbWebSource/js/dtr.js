var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;

Date.prototype.addHours = function(h) {    
   this.setTime(this.getTime() + (h*60*60*1000)); 
   return this;   
}

Date.prototype.getUTCDateTime = function(){
    var now = new Date(this); 
    return new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
};

function getCurrentDateTime(_date,serverUTCDiff){
    var localUtcDiff = Math.abs( (new Date() - new Date().getUTCDateTime() ) /1000/60/60 ) ;
    console.log(localUtcDiff);
    return new Date(_date).addHours( localUtcDiff +  Math.abs(serverUTCDiff) ).toString().toShortDateTime();

}


zsi.ready(function(){
    displayRecords();
    setInterval('updateClock()', 1000);

});


function updateClock ( )
 	{
 	var currentTime = new Date ( );
  	var currentHours = currentTime.getHours ( );
  	var currentMinutes = currentTime.getMinutes ( );
  	var currentSeconds = currentTime.getSeconds ( );
      	currentMinutes = ( currentMinutes < 10 ? "0" : "" ) + currentMinutes;
      	currentSeconds = ( currentSeconds < 10 ? "0" : "" ) + currentSeconds;

  	var timeOfDay = ( currentHours < 12 ) ? "AM" : "PM";
      	currentHours = ( currentHours > 12 ) ? currentHours - 12 : currentHours;
      	currentHours = ( currentHours == 0 ) ? 12 : currentHours;

  	var currentTimeString = currentHours + ":" + currentMinutes + ":" + currentSeconds + " " + timeOfDay;
       	$("#clock").html(currentTimeString);
   	  	
}


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
     $("#grid").dataBind({
	     url            : procURL + "dtr_sel" 
	    ,width          : 850
	    ,height         : 506
        ,dataRows : [
    	
    		   {text  : " "                                 , width : 25        , style : "text-align:left;"       
            		    , onRender      :  function(d){ 
                		              return bs({name:"dtr_id"   ,value: svn (d,"dtr_id")    ,type:"hidden"})
                		                  +  bs({name:"employee_id"   ,value: svn (d,"employee_id")    ,type:"hidden"});
                    }
                }	 
            	,{ text:"Time in"                       , width:400             , style:"text-align:left;"                    ,name:"time_in"
                    	    ,onRender:function(d){
                    	         return getCurrentDateTime(d.time_in,d.utc_diff);
                    	   
                    	    }
                    	}
            	,{ text:"Time out"                      , width:400             , style:"text-align:left;"                    ,name:"time_out"
                    	     ,onRender:function(d){
                    	        return getCurrentDateTime(d.time_out,d.utc_diff);
        
                    	    }
                    	}
	    ]
    });    
}


 




                