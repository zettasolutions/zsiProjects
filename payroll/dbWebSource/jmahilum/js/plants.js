 var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;

zsi.ready(function(){
    displayRecords();
  
});


$("#btnSave").click(function () {
   $("#grid").jsonSubmit({
             procedure: "plants_upd"
            ,optionalItems: ["is_active"]
            , onComplete: function (data) {
               // $("#grid").clearGrid();
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                displayRecords();
            }
    });
});
    
function displayRecords(){
    //type : "input" is optional in line 37, 38s
     var cb = bs({name:"cbFilter1",type:"checkbox"});
     $("#grid").dataBind({
	    url             : execURL + "plants_sel"
	    ,width          : $(document).width() - 300
	    ,height         : $(document).height() - 300
	   // ,selectorType   : "checkbox"
        ,blankRowsLimit : 5
        ,isPaging       : false
        ,dataRows       : [
                            { text  : cb , width : 25   , style : "text-align:left;" 
                                , onRender  :  function(d)
                                    { return     bs({name:"plant_id",type:"hidden",value: svn (d,"plant_id")}) 
                                    +   bs({name:"is_edited"            ,type:"hidden"  ,value: svn(d,"is_edited")}) 
                                    + (d !==null ? bs({name:"cb",type:"checkbox"}) : "" ); }
                                    
                       
                                    
                            }	 
            		        ,{text  : "Plant Code"          , name  : "plant_code"                  , type  : "input"         , width : 200       , style : "text-align:left;"}
            		        ,{text  : "Plant Name"          , name  : "plant_name"                  , type  : "input"         , width : 300       , style : "text-align:left;"}
            		        ,{text  : "Plant Address"       , name  : "plant_address"               , type  : "input"         , width : 300       , style : "text-align:left;"}
            		        ,{text  : "Active?"             , width : 60            , style : "text-align:center;"          ,defaultValue:"Y"
                                   ,onRender : function(d){ return bs({name:"is_active" ,type:"yesno"   ,value: svn(d,"is_active")    })
                                                                  +  bs({name:"is_edited",type:"hidden"});
                                 }
                            }
	                    ]
    	    ,onComplete: function(){
                $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
        }  
    });    
}

$("#btnDelete").click(function(){
    zsi.form.deleteData({
         code       : ""
        ,onComplete : function(data){
                        displayRecords();
                      }
    });       
});

          