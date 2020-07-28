zsi.ready = function(){
    displayRecords();
};

function displayRecords(){
    $("#grid").dataBind({
         rows           : ""
        ,width          : $(window).width() - 25
        ,dataRows       : [
    		 { text:"Part Number"         , width:225 , style:"text-align:center;" ,  type:"input"   ,  name:"part_no"      }
    		,{ text:"Quantity"            , width:180 , style:"text-align:center;" ,  type:"input"   ,  name:"quantity"     }
    		,{ text:"P.O Number"          , width:180 , style:"text-align:center;" ,  type:"input"   ,  name:"po_number"    }	 	 
    		,{ text:"Serial Number"       , width:180 , style:"text-align:center;" ,  type:"input"   ,  name:"serial_number"}
    		,{ text:"Number of Cartons"   , width:180 , style:"text-align:center;" ,  type:"input"   ,  name:"no_cartons"   }
    		,{ text:"Box Dimension (in)"  , width:180 , style:"text-align:center;" ,  type:"input"   ,  name:"box_dimension"}
    		,{ text:"Weight LB"           , width:180 , style:"text-align:center;" ,  type:"input"   ,  name:"weight"       }
    		,{ text:"Customer MRD"        , width:180 , style:"text-align:center;" ,  type:"input"   ,  name:"customer_mrd" }
    		,{ text:""                    , width:180 , style:"text-align:center;" 
    		    ,onRender : function(){
    		      return '<span class="fas fa-minus-circle" style="color:red;"></span>' ;  
    		    }
    		}
	    ]
    });    
    
}   