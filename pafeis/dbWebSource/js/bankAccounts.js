  var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;


zsi.ready(function(){
   
    
   /* $(".zPanel").css({
            height:$(window).height()-179
        });*/
     
    displayRecords();
  
});



$("#btnSave").click(function () {
    $("#grid").jsonSubmit({
              procedure  : "bank_ref_upd"
               ,optionalItems : ["active"]
             ,onComplete : function (data) {
                  $("#grid").clearGrid();
                  if(data.isSuccess===true) zsi.form.showAlert("alert");
                  displayRecords();
             }
        });    
});



 function displayRecords(){   
      var cb = bs({name:"cbFilter1",type:"checkbox"});
     $("#grid").dataBind({
	     url            : procURL + "bank_ref_sel" 
	    ,width          : 1200
	    ,height         : 506
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
       // ,isPaging : false
        ,dataRows : [
        		 {text  : cb                                 , width : 25        , style : "text-align:left;"       
            		    , onRender      :  function(d){ 
                		              return bs({name:"bank_ref_id"   ,value: svn (d,"bank_ref_id")    ,type:"hidden"})
                		                 +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                    }
                }	 
            	,{ text:"Acct. No"                     , width:200        , style:"text-align:center;"        , type:"input"          ,name:"bank_acctno"}
                ,{ text:"Acct. Name"                   , width:200        , style:"text-align:center;"        , type:"input"          ,name:"bank_acctname" }
                ,{ text:"Bank Name"                    , width:200        , style:"text-align:center;"        , type:"input"          ,name:"bank_name" }
                ,{ text:"Acct. Amount"                    , width:200        , style:"text-align:center;"        , type:"input"          ,name:"acct_amount" }
                ,{ text:"% Deposit Share"              , width:200        , style:"text-align:center;"        , type:"input"         ,name:"depo_pct_share" }
                ,{ text:"Priority#"                    , width:200        , style:"text-align:center;"        , type:"input"          ,name:"priority_no" }
                ,{ text:"Active?"                      , width:107        , style:"text-align:center;"        , type:"yesno"          ,name:"active" }
               
                                            
   ]
   
        ,onComplete: function(){
       
        }
    });    
}

              