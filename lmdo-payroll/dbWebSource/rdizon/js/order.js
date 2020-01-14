 zsi.ready = function(){
    $("#customer").fillSelect({
        data:[
             { text: "Ford", value: "Ford" }
            ,{ text: "BMW", value: "BMW" }
            ,{ text: "Cheverolet", value: "Cheverolet" }
            ,{ text: "Honda", value: "Honda" }
        ]
    });
    
    $("#type").fillSelect({
        data:[
             { text: "GPIRS", value: "GPIRS" }
            ,{ text: "GPR", value: "GPR" }
        ]
    });
    
    $("#program").fillSelect({
        data: [
             { text: "Powerpack", value: "Powerpack" }
            ,{ text: "2021 C727", value: "2021 C727" }
        ]
    });
    
    $("#build_phase").fillSelect({
        data: [
             { text: "TT", value: "TT" }
            ,{ text: "TTR", value: "TTR" }
        ]
    });
    
    $("#plant").fillSelect({
        data: [
             { text: "Aztecas", value: "Aztecas" }
            ,{ text: "PETC", value: "PETC" }
        ]
    });
    
    $("#warehouse").fillSelect({
        data: [
             { text: "El Paso", value: "el paso" }
            ,{ text: "UAE", value: "UAE" }
        ]
    });
    
    displayRecords();
};

function displayRecords(){
    $("#gridNewOrder").dataBind({
         rows           : ""
        ,width          : $(window).width() - 25
        ,dataRows       : [
    		 { text:"Quantity"              , width:225 , style:"text-align:center;" ,  type:"input"   ,  name:"quantity" }
    		,{ text:"Customer MRD"          , width:180 , style:"text-align:center;" ,  type:"input"   ,  name:"customer_mrd"}
    		,{ text:"Plant Target Date"     , width:180 , style:"text-align:center;" ,  type:"input"   ,  name:"target_date"}	 	 
    		,{ text:"Ship To"               , width:180 , style:"text-align:center;" ,  type:"input"   ,  name:"ship_to"}
    		,{ text:""                      , width:180 , style:"text-align:center;" 
    		    ,onRender : function(){
    		      return '<span class="fas fa-minus-circle" style="color:red;"></span>' ;  
    		    }
    		}
	    ]
    });    
    
} 