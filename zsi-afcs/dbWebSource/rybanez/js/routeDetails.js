 var route = (function(){
    var _pub            = {};
    
    zsi.ready = function(){
        $(".page-title").html("Route Details");
        displayRouteDetails();
        
    };
    
    
    function displayRouteDetails(id){
        $("#gridRouteDetails").dataBind({
             sqlCode        : "R1221" //route_details_sel
            ,height         : $(window).height() - 240         
            ,dataRows       : [
                {text: "Route No."                 ,width : 60   ,style : "text-align:left;"
                    ,onRender  :  function(d)  
                        { return   app.bs({name:"route_detail_id"         ,type:"hidden"      ,value: app.svn(d,"route_detail_id")})
                                 + app.bs({name:"route_id"                ,type:"hidden"      ,value: app.svn(d,"route_id")}) 
                                 + app.bs({name:"route_no"                ,type:"input"      ,value: app.svn(d,"route_no")}) ;
                                 
                        }
                }
                ,{text: "Location"                      ,name:"location"               ,type:"input"       ,width : 250   ,style : "text-align:left;"}
                ,{text: "Distance Kilometer"            ,name:"distance_km"             ,type:"input"       ,width : 110   ,style : "text-align:left;"}
                ,{text: "Sequence No."                  ,name:"seq_no"               ,type:"input"       ,width : 80    ,style : "text-align:left;" ,defaultValue:"Y"}
            ]
            ,onComplete: function(o){
            }
        });
    }
    
    return _pub;
})();          