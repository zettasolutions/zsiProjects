var list = [
                 {"paytypecode": "00111"  ,"paytypedesc":"salary" }
                ,{"paytypecode": "00222"  ,"paytypedesc":"salary" }
                ,{"paytypecode": "00333"  ,"paytypedesc":"salary" }
                ,{"paytypecode": "00444"  ,"paytypedesc":"salary" }
                ,{"paytypecode": "00555"  ,"paytypedesc":"salary" }
                ,{"paytypecode": "00666"  ,"paytypedesc":"salary" }
           ];

zsi.ready = function(){
    displayData();
    
};
function displayData(){
    var cb = bs({name: "cbfilter" ,type: "checkbox" });
    $("#grid").dataBind({
        
         rows                 :    list
        //  sql                 :   ""
        // ,blankRowsLimit      : 5
        ,dataRows             :    [
                                    {text: cb, width: 25}
                                    
                                    ,{text:  "Pay Type Code"     ,name:  "paytypecode"      ,width: 250     ,style:"text-align:left;"}
                                    ,{text:  "Pay Type Desc"     ,name:  "paytypedesc"      ,width: 250     ,style:"text-align:left;"}
                                  ]
                                  
            ,onComplete: function(){
                $("#cbfilter").setCheckEvent("#grid input[name='cb]");
            }
    })
} 

  