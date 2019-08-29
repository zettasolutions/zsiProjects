var  bs = zsi.bs.ctrl
    ,svn =  zsi.setValIfNull
    ,type = [
         { text: "GPIRS", value: "GPIRS" }
        ,{ text: "GPR", value: "GPR" }
    ]

    ,customer = [
         { text: "Ford", value: "Ford" }
        ,{ text: "BMW", value: "BMW" }
        ,{ text: "Cheverolet", value: "Cheverolet" }
        ,{ text: "Honda", value: "Honda" }
    ]
    ,program = [
         { text: "Powerpack", value: "Powerpack" }
        ,{ text: "2021 C727", value: "2021 C727" }
    ]
    ,stat = [
         { text: "Partially Shipped", value: "Powerpack" }
        ,{ text: "Waiting for Plant Input", value: "Waiting for Plant Input" }
    ]
    
;
zsi.ready = function(){
     displayCustomerOrder();
};



function displayCustomerOrder(){   
    var rownum=0;
    $("#gridCustOrder").dataBind({
         rows           : ""
        ,width          : $(window).width() - 25
	    //,height         : 450
        //,blankRowsLimit : 10
        ,dataRows       : [
    		 { text: "PO Order"   , width:225 , style:"text-align:center;" 
    		     ,onRender : function(d){return bs({name:"customer_id" ,type:"hidden",value: svn(d,"customer_id")})
    		                                +   bs({name:"po_order" , value: svn(d,"po_order")}) }
    		 }
    		,{ text:"Customer"      , width:180 , style:"text-align:center;" ,  type:"select"  ,  name:"customer"}
    		,{ text:"Type"          , width:180 , style:"text-align:center;" ,  type:"select"  ,  name:"type"}	 	 
    		,{ text:"Program"       , width:180 , style:"text-align:center;" ,  type:"select"  ,  name:"program"}	 	 
    		,{ text:"Parts"         , width:180 , style:"text-align:center;" ,  type:"input"   ,  name:"parts"}	 	 
    		,{ text:"Ship To"       , width:180 , style:"text-align:center;" ,  type:"input"   ,  name:"ship_to"}	 	 
    		,{ text:"Created On"    , width:180 , style:"text-align:center;" ,  type:"input"   ,  name:"created_on"}	   
    		,{ text:"Status"        , width:180 , style:"text-align:center;" ,  type:"select"  ,  name:"status"}	 	 
	    ]
	    ,onComplete: function(o){
	        this.find("select[name='type']").fillSelect({data : type});
            this.find("select[name='customer']").fillSelect({data : customer});
            this.find("select[name='program']").fillSelect({data : program});         
            this.find("select[name='status']").fillSelect({data : stat});         

	    }

    });    
}

                                                                                                                 