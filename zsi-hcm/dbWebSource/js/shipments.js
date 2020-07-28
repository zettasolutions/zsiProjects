var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;

zsi.ready = function(){
    
    displayShipment();
};


function displayShipment(){

var _data   =   [   
                     {shipment_id : "1234"    ,po_numbers : "1234"     ,date_shipped : "15/Jul/2019"    ,shipper : "DHL"    ,tracking_number : "1234"    ,ship_to : ""    ,truck_number : ""}
                    ,{shipment_id : "1234"    ,po_numbers : "1234"     ,date_shipped : "15/Jul/2019"    ,shipper : "DHL"    ,tracking_number : "1234"    ,ship_to : ""    ,truck_number : ""}
                    ,{shipment_id : "1234"    ,po_numbers : "1234"     ,date_shipped : "15/Jul/2019"    ,shipper : "DHL"    ,tracking_number : "1234"    ,ship_to : ""    ,truck_number : ""}
                    ,{shipment_id : "1234"    ,po_numbers : "1234"     ,date_shipped : "15/Jul/2019"    ,shipper : "DHL"    ,tracking_number : "1234"    ,ship_to : ""    ,truck_number : ""}
                  
                ]
    $("#shipment").dataBind({
        rows            :   _data
        ,width          : $(document).width() - 150
        // ,height         : $(document).outerHeight()
        //,blankRowsLimit :5
        ,dataRows       : [
             { text: "Shipment ID"      ,width : 100        ,style:"text-align:center",
                 onRender : function (d){
                    return '<a href="javascript:void(0)">' + svn(d,"shipment_id") + '</a>';                
                 }
             }
            ,{ text: "PO Numbers"       ,width : 100        ,style:"text-align:center",
                onRender : function (d){
                    return '<a href="javascript:void(0)">' + svn(d,"po_numbers") + '</a>';
                }
            }
            ,{ text: "Date Shipped"     ,name:"date_shipped"            ,width : 100        ,style:"text-align:center"}
            ,{ text: "Shipper"          ,name:"shipper"                 ,width : 100        ,style:"text-align:center"}
            ,{ text: "Tracking Number"  ,name:"tracking_number"         ,width : 150        ,style:"text-align:center"}
            ,{ text: "Ship To"          ,name:"ship_to"                 ,width : 100        ,style:"text-align:center"}
            ,{ text: "Truck Number"     ,name:"truck_number"            ,width : 100        ,style:"text-align:center"}
        ]
        
    });
}


// $("#gridCriteria-" + tabCode).dataBind({
//          rows           : _newdata1
//         ,width          : $(document).outerWidth() - 10
//         ,height         : $(document).outerHeight() - 350
//         ,blankRowsLimit : bRows
//         ,dataRows       :[
//     		 { text: "Seq. No."   , width:65 , style:"text-align:left;" 
//     		    ,onRender : function(d){
//     		        return bs({name:"criteria_id"          ,type:"hidden"  ,value: svn(d,"criteria_id")})
//                          + bs({name:"is_edited",type:"hidden" })
//                          + (svn(d,"criteria_id") === "" ? bs({name:"seq_no" ,type:"hidden",value: svn(d,"seq_no")}):  bs({name:"seq_no" ,value: svn(d,"seq_no")}));  		        
//     		    }
//     		 }
//     		,{ text:"Trend Menu"    , width:170    , style:"text-align:center;"   
// 	            ,onRender   :   function(d){ 
//                     var _trendMenuSelect = bs({name:"trend_menu_id"   ,type:"select"  ,value: menuId})
//                     var _trendMenuHide   = bs({name:"trend_menu_id"   ,type:"hidden"  ,value: menuId})
//                     return _trendMenuSelect;
//     	        }
// 		    }
//     		,{ text:"Criteria Title"   , width:400 , style:"text-align:left;" ,  type:"input"  ,  name:"criteria_title"	
//     		   ,onRender: function(d){
//     		       var _link = "<a href='javascript:void(0);' class='btn btn-sm position-absolute p-1' onclick='displayTrendToolSubMenu2(\""+ svn(d,"menu_type") +"\",\""+ svn(d,"criteria_id") +"\",\""+ svn(d,"menu_name") + "\",\"" +  svn(d,"criteria_title")  + "\");'  ><i class='fas fa-chart-bar'></i> </a>";
    		       
//     		        if(d){
//     		            return (d.pcriteria_id !=="" ? _link : "")
//     		                + '<input class="form-control text-left pl-4" type="text" name="criteria_title" id="criteria_title" maxlength="105" value="'+ d.criteria_title +'" style="'+ (!d.pcriteria_id ? 'font-weight:bold;' : '') +'">';
//     		        } else return '<input class="form-control text-left" type="text" name="criteria_title" id="criteria_title" maxlength="105">';   
//     		    }
//     		}	 	 
    		
//     		,{ text:"Group Criteria"    , width:150    , style:"text-align:center;"    
// 		            ,onRender   :   function(d){ 
// 		                    return bs({name:"pcriteria_id", type:"select", value: svn(d,"pcriteria_id")});
// 		          }
// 		    }
//     		,{ text:"Active?"    , width:60  , style:"text-align:left;" ,  type:"yesno"  ,  name:"is_active"  ,  defaultValue   : "Y"}
//     		,{ text:"CC" ,width:30 , style:"text-align:center;"
// 		        ,onRender   :   function(d){
// 		            var _pcriteriaId = svn(d,"pcriteria_id");
// 		            var _link = "<a href='javascript:void(0);' class='btn btn-sm' data-toggle='tooltip' data-placement='left' title='Criteria Columns'  onclick='showModalCriteriaColumns(\""+ svn(d,"criteria_id") +"\",\""+ specsId +"\",\"" +  svn(d,"criteria_title")  + "\");'  ><i class='fas fa-link'></i> </a>";
// 		            return ((d !==null && _pcriteriaId !== "") ? _link : "" );
// 		        }
//     		}
//     		,{ text:"Graph" ,width:50 , style:"text-align:center;"
// 		        ,onRender   :   function(d){
// 		            var _pcriteriaId = svn(d,"pcriteria_id");
// 		            var _link = "<a href='javascript:void(0);' class='btn btn-sm' data-toggle='tooltip' data-placement='left' title='Criteria Graph' onclick='showModalCriteriaGraphs(\""+ svn(d,"criteria_id") +"\",\""+ specsId +"\",\"" +  svn(d,"criteria_title")  + "\");'  ><i class='fas fa-link'></i> </a>";
// 		            return (d !==null && _pcriteriaId !== "" ? _link : "" );
// 		        }
//     		}
//     		,{ text:"Image 1"      , width:60     , style:"text-align:center;" 
//     		    ,onRender : function(d){ 
//     		        this.addClass(gClsMma);
//                     var _mouseMoveEvent = "onmouseover='mouseoverCriteria(\"" + svn(d,"image1_id") +  "\");' onmouseout='mouseout();'";
//     		        var _image1       = "<a href='javascript:void(0);' " + _mouseMoveEvent + " class='btn btn-sm;'  onclick='showModalUploadCriteriaImage(" + svn(d,"criteria_id") + ",\"" + svn(d,"image1_id") + "\",\"image1_id\",\"" + svn(d,"criteria_title") + "\");' ><span class='fas fa-file-upload' style='font-size:12pt;' ></span> </a>";
//     		       return ((d != null) ? _image1 : "");
//     		    }
//     		}	 	 
    		
//     		,{ text:"Image 2"      , width:60     , style:"text-align:center;" 
//     		    ,onRender : function(d){ 
//     		        this.addClass(gClsMma);
//                     var _mouseMoveEvent = "onmouseover='mouseover(\"" + svn(d,"image2_id") +  "\");' onmouseout='mouseout();'";
//     		        var _image2         = "<a href='javascript:void(0);' " + _mouseMoveEvent + " class='btn btn-sm;'  onclick='showModalUploadCriteriaImage(" + svn(d,"criteria_id") + ",\"" + svn(d,"image2_id") + "\",\"image2_id\",\"" + svn(d,"criteria_title") + "\");' ><span class='fas fa-file-upload' style='font-size:12pt;' ></span> </a>";
//     		        return (d !== null ? _image2 : "");
//     		    }
//     		}
//     		,{ text:"Status"    ,width:115     , style:"text-align:center;"
//     		    ,onRender : function(d){
    		     
// 		            if (svn(d,"criteria_id") === "") {
//     		            return  bs({name:"status_code"   ,type:"select" ,value: "N"});
//     		        }
//     		        else{
//     		            return  bs({name:"status_code"  ,type:"select"  ,value: svn(d,"status_code")});
//     		        } 

//     		    }
        		  
//     		}
// 	    ]



  