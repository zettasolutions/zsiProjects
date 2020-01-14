var  svn            = zsi.setValIfNull
    ,bs             = zsi.bs.ctrl
    ,bsButton       = zsi.bs.button
    ,gMdlQtyOnPO    = "modalBodyQtyOnPO"
    ,gtw            = null
    ,gTotal         = 0
;

zsi.ready = function(){
    gtw = new zsi.easyJsTemplateWriter();
    getTemplates();  
    $("#qty_po").val(0);
};

function getTemplates(){
    new zsi.easyJsTemplateWriter("body")
    .bsModalBox({
          id        : gMdlQtyOnPO
        , sizeAttr  : "modal-xl"
        , title     : "Quantiy on P.O"
        , body      : gtw.new().modalBodyQtyOnPO({grid:"gridQty",onClickSaveQty:"submitDataQty();"}).html()  
    });
}

$("#qty_po").click(function(){
    showModalQtyOnPO();
});

function editOrder(){
    $("#nav-o").find(".inputText").css("border", "inset").removeAttr("readonly");
}

function editCustomer(){
    $("#nav-c").find(".inputText").css("border", "inset").removeAttr("readonly");
}

function editManufacturing(){
    $("#nav-m").find(".inputText").css("border", "inset").removeAttr("readonly");
}

function editWarehouse(){
    $("#nav-w").find(".inputText").css("border", "inset").removeAttr("readonly");
}

function editQty(){
    $("#frm_modalBodyQtyOnPO").find(".inputText").css("border", "inset").removeAttr("readonly");
}
function showModalQtyOnPO() {
    g$mdl = $("#" + gMdlQtyOnPO); 
    g$mdl.find(".modal-title").text("Customer » " + "FORD" ) ;
    g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
    displatQtyOnPO();
    
}  

function displatQtyOnPO(){
     var _data   = [
      { promise_date: '08-08-2019' ,qty_promise:''  , requested_date: "08-08-2019"  ,qty_requested:'15' },
      { promise_date: '08-08-2019' ,qty_promise:''  , requested_date: "08-08-2019"  ,qty_requested:'15' },
      { promise_date: '08-08-2019' ,qty_promise:''  , requested_date: "08-08-2019"  ,qty_requested:'20' },
    ]; 

    $("#gridQty").dataBind({
         rows       : _data
        ,width      : 620
	    ,height     : 400
        ,dataRows   :[
    		  {text: "Lear Promise Date"            ,name: "promise_date"   , width: 250     , style: "text-align:left;" }
    		 ,{text: "Quantity"                     ,name: "qty_promise"    , width: 75      , style: "text-align:left;" }
    		 ,{text: "Customer Requested Date"      ,name: "requested_date" , width: 200     , style: "text-align:left;" }
    		 ,{text: "Quantity"                     , width: 75      , style: "text-align:left;" 
    		     ,onRender: function(d){
    		         return bs({name: "qty_requested", value: d.qty_requested});
    		     }
    		 }
	    ]
	    ,onComplete: function(o){
            var arr = this.find("input[name='qty_requested']");
            var tot=0;
            for(var i=0;i<arr.length;i++){
                if(parseInt(arr[i].value))
                tot += parseInt(arr[i].value);
            }
            gTotal = tot;
            $("#qty_po").val(gTotal);
        }
    });        
} 