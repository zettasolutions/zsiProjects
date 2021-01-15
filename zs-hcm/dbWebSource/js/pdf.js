$(document).ready(function(){
   // console.log("dtr",getDataItems);
   
});

var dtr;
zsi.ready = function(){
    setTimeout(function(){
       displayPDF();
    },1000);
}

function displayPDF(){
    $("#ifrmWindow").height($(window).height() - 50);
    
    var doc = new jsPDF();
    doc.text("From HTML", 14, 16);
    var elem = document.getElementById("tablePDF");
    var res = doc.autoTableHtmlToJson(elem);
    doc.autoTable(res.columns, res.data, {startY: 20});   
    document.getElementById("ifrmWindow").src = doc.output('datauristring');
}
    