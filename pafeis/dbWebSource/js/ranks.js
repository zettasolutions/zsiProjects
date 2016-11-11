var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;



zsi.ready(function(){
    displayRecords();
});


$("#btnSave").click(function () {
    //console.log("test");
   $("#grid").jsonSubmit({
             procedure: "ranks_upd"
            ,optionalItems: ["is_active"] 
            , onComplete: function (data) {
                $("#grid").clearGrid();
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                displayRecords();
            }
    });
});
    
function displayRecords(){
     var cb = bs({name:"cbFilter1",type:"checkbox"});
     $("#grid").dataBind({
	     url            : execURL + "ranks_sel"
	    ,width          : $(document).width() - 35
	    ,height         : $(document).height() - 250
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
                 {text  : cb                                                           , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"rank_id",type:"hidden",value: svn (d,"rank_id")})
                                                      +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
            }	 
                
        		,{text  : "Rank Code"           , name  : "rank_code"           , type  : "input"           , width : 100       , style : "text-align:left;"}
        		,{text  : "Rank Desc"           , name  : "rank_desc"           , type  : "input"           , width : 200       , style : "text-align:left;"}
        		,{text  : "Rank Level"          , name  : "rank_level"          , type  : "input"           , width : 200       , style : "text-align:left;"}
        		,{text : "Active"               , name  : "is_active"               , type:"yesno"              , width:60          , style:"text-align:center;"        ,defaultValue:"Y"}
	    ]
    	     ,onComplete: function(){
                $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
                //$("select[name='squadron_id']").dataBind( "squadron");
                //$("select[name='aircraft_type_id']").dataBind( "aircraft_type");
                //$("select[name='aircraft_source_id']").dataBind( "aircraft_source");
                //$("select[name='aircraft_dealer_id']").dataBind( "aircraft_dealer");
                //$("select[name='status_id']").dataBind( "status");
        }  
    });    
}
    

$("#btnDelete").click(function(){
    zsi.form.deleteData({
         code       : "sys-0008"
        ,onComplete : function(data){
                        displayRecords();
                      }
    });       
});
    
                                     