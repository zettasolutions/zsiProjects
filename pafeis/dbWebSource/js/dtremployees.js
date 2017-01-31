 var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;


zsi.ready(function(){
    displayRecords();
   
  
});




 function displayRecords(){   
      var cb = bs({name:"cbFilter1",type:"checkbox"});
     $("#grid").dataBind({
	     url            : procURL + "dtr_employees_sel" 
	    ,width          : 900
	    ,height         : 506
	    //,selectorType   : "checkbox"
       // ,isPaging : false
        ,dataRows : [
    	
    		   {text  : " "                                 , width : 25        , style : "text-align:left;"       
            		    , onRender      :  function(d){ 
                		              return bs({name:"dtr_id"   ,value: svn (d,"dtr_id")    ,type:"hidden"})
                		                  +  bs({name:"user_id"   ,value: svn (d,"user_id")    ,type:"hidden"})
                		                  +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                    }
                }	 
            	,{ text:"Full Name"                       , width:400             , style:"text-align:left;"                    ,name:"full_name"}
            	,{ text:"Time in"                        , width:220             , style:"text-align:left;"                    ,name:"time_in"
                    	    ,onRender:function(d){
                    	        return d.time_in.toDateTime();
                    	    }
                    	}
            	,{ text:"Time out"                      , width:220             , style:"text-align:left;"                    ,name:"time_out"
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









             