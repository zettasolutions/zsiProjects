zsi.ready = function(){
    //displayDeliveryProof();
    displayDeliveryProof();
};

function displayDeliveryProof(){
    var _option = [
                     {text:"FM1DA"    ,value:"FM1DA"}
                    ,{text:"FM4VA"    ,value:"FM4VA"}
                ]
    var _data = [
                     {s_no:"1"       ,r_location:"FM1DA"     ,gpirs_order_no:"3697232"      ,gpirs_order_line_no:"1"     ,part_no:"LX6T-14401-XRAB"     ,qty:"1"     ,pod_attached:"YES"        ,packing_slip_attached:"YES"}
                    ,{s_no:"2"       ,r_location:"FM1DA"     ,gpirs_order_no:"3702774"      ,gpirs_order_line_no:"1"     ,part_no:"LX6T-14401-XAVB"     ,qty:"1"     ,pod_attached:"YES"        ,packing_slip_attached:"YES"}
                    ,{s_no:"3"       ,r_location:"FM1DA"     ,gpirs_order_no:"3702778"      ,gpirs_order_line_no:"1"     ,part_no:"LX6T-14401-XALB"     ,qty:"3"     ,pod_attached:"YES"        ,packing_slip_attached:"YES"}
                    ,{s_no:"4"       ,r_location:"FM1DA"     ,gpirs_order_no:"3704045"      ,gpirs_order_line_no:"1"     ,part_no:"LX6T-14401-XBBB"     ,qty:"1"     ,pod_attached:"YES"        ,packing_slip_attached:"YES"}
                    ,{s_no:"5"       ,r_location:"FM1DA"     ,gpirs_order_no:"3704046"      ,gpirs_order_line_no:"1"     ,part_no:"LX6T-14401-XLAB"     ,qty:"2"     ,pod_attached:"YES"        ,packing_slip_attached:"YES"}
            ]
     //var rownum=0;
     $("#proofOfDelivery").dataBind({
	     rows           : _data
	    ,height         : $(document).height() - 500
	    ,selectorIndex  : 1
	    ,startGroupId   : 0
        ,blankRowsLimit : 5
        ,dataRows       : [
                             { id:  1  ,groupId: 0      , text  : ""                        }	 
            		        ,{ id:  2  ,groupId: 0      , text  : "Receiving Location"      }	 
    		                ,{ id:  3  ,groupId: 0      , text  : ""                        }	 
    		                ,{ id:  4  ,groupId: 0      , text  : ""                        }	 
    		                ,{ id:  5  ,groupId: 0      , text  : ""                        }
    		                ,{ id:  6  ,groupId: 0      , text  : ""                        }	 
    		                ,{ id:  7  ,groupId: 0      , text  : "POD Attached"            }
    		                ,{ id:  8  ,groupId: 0      , text  : "Packing Slip Attached"   }	 
    		                
    		                ,{  id          : 100
                                , groupId   : 1    		      
                                , text      : "S. No"     
            		            , name      : "s_no"  
            		            , type      : "input"           
            		            , width     : 150      
            		            , style     : "text-align:center;" 

            		        }
            		       
            		        ,{  id          : 102
                                , groupId   : 2    		      
                                , text      : "<div class='centr'>(FM1DA / FM4VA)</div>"     
            		            , name      : "r_location"  
            		            , type      : "select"           
            		            , width     : 140      
            		            , style     : "text-align:center;"  

            		        }
            		        ,{  id          : 103
                                , groupId   : 3    		      
                                , text      : "GPIRS Order No"     
            		            , name      : "gpirs_order_no"  
            		            , type      : "input"           
            		            , width     : 150      
            		            , style     : "text-align:center;" 

            		        }
            		        ,{  id          : 104
                                , groupId   : 4    		      
                                , text      : "GPIRS Order Line No"     
            		            , name      : "gpirs_order_line_no"  
            		            , type      : "input"           
            		            , width     : 150      
            		            , style     : "text-align:center;" 

            		        }
            		        ,{  id          : 105
                                , groupId   : 5    		      
                                , text      : "Part No"     
            		            , name      : "part_no"  
            		            , type      : "input"           
            		            , width     : 150      
            		            , style     : "text-align:center;" 

            		        }
            		        ,{  id          : 106
                                , groupId   : 6    		      
                                , text      : "Qty"     
            		            , name      : "qty"  
            		            , type      : "input"           
            		            , width     : 150      
            		            , style     : "text-align:center;" 

            		        }
            		        ,{  id          : 107
                                , groupId   : 7    		      
                                , text      : "<div class='centr'>(Yes / No)</div>"     
            		            , name      : "pod_attached"  
            		            , type      : "yesno"
            		            , defaultValue : "Y"
            		            , width     : 140
            		            , style     : "text-align:center;"  

            		        }
            		        ,{  id          : 108
                                , groupId   : 8    		      
                                , text      : "<div class='centr'>(Yes / No)</div>"     
            		            , name      : "packing_slip_attached"  
            		            , type      : "yesno"
            		            , defaultValue : "Y"
            		            , width     : 150      
            		            , style     : "text-align:center;"  
            		        }
            		        
	                    ]
	                    ,onComplete : function(){
	                        this.find("select[name='r_location']").fillSelect({data : _option });
	                    }
    });    
}
// function displayWireGaugeReferences(menuId,specsId){
//      var rownum=0;
//      $("#gridWireGaugeReferences").dataBind({
// 	     url            : execURL + "wire_gauge_references_sel"
// 	    //,width          : $("#gridWireGaugeReferences").closest(".modal-body").width() 
// 	    ,height         : $(document).height() - 300
// 	    ,selectorIndex  : 1
// 	    ,startGroupId   : 0
//         ,blankRowsLimit : 5
//         ,dataRows       : [
//                             {  id:  1  ,groupId: 0      , text  : "Wire Gauge"          }	 
//             		        ,{ id:  2  ,groupId: 0      , text  : "JASO"                }	 
//     		                ,{ id:  3  ,groupId: 0      , text  : "ISO"                 }	 
//     		                ,{ id:  4  ,groupId: 0      , text  : "SAE"                 }	 
//     		                ,{ id:  5  ,groupId: 0      , text  : "Combined"   }	 
    		                
//     		                ,{  id          : 100
//                                 , groupId   : 1    		      
//                                 , text      : ""     
//             		            , name      : "wire_gauge"  
//             		            , type      : "input"           
//             		            , width     : 150      
//             		            , style     : "text-align:left;" 

//             		        }
            		       
//             		        ,{  id          : 102
//                                 , groupId   : 2    		      
//                                 , text      : "<div class='centr'>Lower Diameter</div>"     
//             		            , name      : "jaso_lower_limit"  
//             		            , type      : "input"           
//             		            , width     : 140      
//             		            , style     : "text-align:center;"  
//             		            , onRender  :   function(d){ 
//     		                        return  bs({name:"jaso_lower_limit"      , class : "numeric text-center",   type    : "input"          ,   value: svn(d,"jaso_lower_limit")});
//     		                        }
            		            
//             		        }
//             		        ,{  id          : 103
//                                 , groupId   : 2    		      
//                                 , text      : "<div class='centr'>Upper Diameter</div>"     
//             		            , name      : "jaso_upper_limit"  
//             		            , type      : "input"           
//             		            , width     : 140      
//             		            , style     : "text-align:center;"  
//             		            , onRender  :   function(d){ 
//     		                        return  bs({name:"jaso_upper_limit"      , class : "numeric text-center",   type    : "input"          ,   value: svn(d,"jaso_upper_limit")});
//     		                        }
            		            
//             		        }
//             		        ,{  id          : 104
//                                 , groupId   : 3    		      
//                                 , text      : "<div class='centr'>Lower Diameter</div>"     
//             		            , width     : 140      
//             		            , style     : "text-align:center;"  
//             		            , onRender  :   function(d){ 
//             	                    return  bs({name:"iso_lower_limit"      , class : "numeric text-center",   type    : "input"          ,   value: svn(d,"iso_lower_limit")});
//     		                        } 
//             		        }
//             		        ,{  id          : 105
//                                 , groupId   : 3  		      
//                                 , text      : "<div class='centr'>Upper Diameter</div>"     
//             		            , type      : "input"           
//             		            , width     : 140      
//             		            , style     : "text-align:center;"  
//             		            , onRender  :   function(d){ 
//     		                        return  bs({name:"iso_upper_limit"      , class : "numeric text-center",   type    : "input"          ,   value: svn(d,"iso_upper_limit")});
//     		                       } 
//             		        }
//             		        ,{  id          : 102
//                                 , groupId   : 4    		      
//                                 , text      : "<div class='centr'>Lower Diameter</div>"     
//             		            , name      : "sae_lower_limit"  
//             		            , type      : "input"           
//             		            , width     : 140      
//             		            , style     : "text-align:center;"  
//             		            , onRender  :   function(d){ 
//     		                        return  bs({name:"jsae_lower_limit"      , class : "numeric text-center",   type    : "input"          ,   value: svn(d,"sae_lower_limit")});
//     		                        }
            		            
//             		        }
//             		        ,{  id          : 103
//                                 , groupId   : 4    		      
//                                 , text      : "<div class='centr'>Upper Diameter</div>"     
//             		            , name      : "sae_upper_limit"  
//             		            , type      : "input"           
//             		            , width     : 140      
//             		            , style     : "text-align:center;"  
//             		            , onRender  :   function(d){ 
//     		                        return  bs({name:"sae_upper_limit"      , class : "numeric text-center",   type    : "input"          ,   value: svn(d,"sae_upper_limit")});
//     		                        }
            		            
//             		        }
//     		                ,{  id          : 106
//                                 , groupId   : 5    		      
//                                 , text      : "<div class='centr'>Lower Diameter</div>"     
//             		            , width     : 140      
//             		            , style     : "text-align:center;"  
//             		            , onRender  :   function(d){ 
//     		                        return  bs({name:"combined_lower_limit"      , class : "numeric text-center",   type    : "input"          ,   value: svn(d,"combined_lower_limit")});
//     		                        } 
//             		        }
//             		        ,{  id          : 107
//                                 , groupId   : 5  		      
//                                 , text      : "<div class='centr'>Upper Diameter</div>"     
//             		            , type      : "input"           
//             		            , width     : 140      
//             		            , style     : "text-align:center;"  
//             		            , onRender  :   function(d){ 
//     		                        return  bs({name:"combined_upper_limit"      , class : "numeric text-center",   type    : "input"          ,   value: svn(d,"combined_upper_limit")})
//     		                                + bs({name:"is_edited" , type:"hidden" , value: svn(d,"is_edited")}) ;
//     		                       } 
//             		        }
// 	                    ]
//     	    ,onComplete: function(){
//         	    $("input, select").on("change keyup ", function(){
//                         $(this).closest(".zRow").find("#is_edited").val("Y");
//                 });       
//                 $("select[name='color_id']").dataBind({
//                     url: execURL + "color_references_sel"
//                         ,text   : "color_name"
//                         ,value  : "color_id"
//                 });    
//                 $("input[name='iso_lower_limit']").keyup(function(){
                    
//                 });
//                 $("input[name='iso_upper_limit']").keyup(function(){
                    
//                 });
//                 zsi.initInputTypesAndFormats();
//         }  
//     });    
// }
  