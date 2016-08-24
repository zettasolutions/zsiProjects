var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;


zsi.ready(function(){
    displayRecords();
});

function displayRecords(){   
    var cb = bs({name:"cbFilter1",type:"checkbox"});
    $("#grid").dataBind({
         url   : execURL + "adjustments_ref_sel"
        ,width          : 450
	    ,height         : 400
        ,blankRowsLimit :5
        ,dataRows       :[
    		 { text: cb             , width:25  , style:"text-align:left;"   
    		     ,onRender : function(d){
                                return     bs({name:"adjmt_id",type:"hidden",value: svn(d,"adjmt_id") })
                                        +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }             
    		 }	 
    		,{ text:"Adjustment Desc"     , width:300   , style:"text-align:left;" ,type:"input"  ,name:"adjmt_desc"}	 
    		,{ text:"Posted"              , width:100   , style:"text-align:left;" ,type:"input"  ,name:"posted"}	 

	    ]
        ,onComplete: function(){
            $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
        }
    });    
}

$("#btnSave").click(function () {
    $("#grid").jsonSubmit({
              procedure  : "adjustments_ref_upd"
              ,optionalItems : ["adjmt_id"]
              ,onComplete : function (data) {
                  $("#grid").clearGrid();
                  if(data.isSuccess===true) zsi.form.showAlert("alert");
                  displayRecords();
             }
        });    
});


$("#btnDelete").click(function(){
    zsi.form.deleteData({
         code       : "ref-0004"
        ,onComplete : function(data){
                        displayRecords();
                      }
    });   

});      

    
                                                                    