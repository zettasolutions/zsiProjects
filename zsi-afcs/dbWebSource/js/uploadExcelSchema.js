 var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;
zsi.ready=function(){
    $(".page-title").html("Excel Upload Schema");
    displayRecords();
  
};

$("#btnSave").click(function () {
   $("#grid").jsonSubmit({
             procedure: "excel_upload_upd"
            ,onComplete: function (data) {
                $("#grid").clearGrid();
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                displayRecords();
            }
    });
});



 function displayRecords(){   
      var cb = app.bs({name:"cbFilter1",type:"checkbox"});
     $("#grid").dataBind({
	     url            : app.execURL + "excel_upload_sel"
	    ,width          : $(".panel-content").width()- 05
	    ,height         : $(window).height() - 240
        ,selectorType   : "checkbox"
        ,blankRowsLimit:5
       // ,isPaging : false
        ,dataRows : [
    	
    		   {text  : cb                      , width : 25        , style : "text-align:left;"       
            		    , onRender      :  function(d){ 
                		              return app.bs({name:"id"              ,type:"hidden"      ,value: svn (d,"id")})
                		                     + app.bs({name:"is_edited"     ,type:"hidden"     ,value: svn(d,"is_edited")})  
                		                     +  (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "" );
                    }
                }	
            	,{ text:"Temporary Table"       , width:300          , style:"text-align:center;"        , type:"input"          ,name:"temp_table"}
            	,{ text:"Excel Column Range"    , width:180          , style:"text-align:center;"        , type:"input"          ,name:"excel_column_range"}
            	,{ text:"Load Name"             , width:230          , style:"text-align:center;"        , type:"input"          ,name:"load_name"}
            	,{ text:"Seq #"                 , width:150          , style:"text-align:center;"        , type:"input"          ,name:"seq_no"}
            	,{ text:"Redirect Page"         , width:170          , style:"text-align:center;"        , type:"input"          ,name:"redirect_page"}
            	,{ text:"Insert Procedure"      , width:300          , style:"text-align:center;"        , type:"input"          ,name:"insert_proc"}
	    ]
	    ,onComplete : function(){
	        this.find("[name='cbFilter1']").setCheckEvent("#grid input[name='cb']");
	    } 
    });    
}
$("#btnDelete").click(function(){
    zsi.form.deleteData({
         code       : "ref-0012"
        ,onComplete : function(data){
                        displayRecords();
                      }
    });      
});                 