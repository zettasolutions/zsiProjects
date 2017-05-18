 zsi.generatePdfReport = function(o){
    var __imgData = null
    ,totalPagesExp = "{total_pages_count_string}"
    ,imgToBase64 = function (url, callback) {
        if (!window.FileReader) {
            callback(null);
            return;
        }
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function() {
            var reader = new FileReader();
            reader.onloadend = function() {
                callback(reader.result.replace('text/xml', 'image/jpeg'));
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.send();
    }
    ,getData = function(imgData){
        __imgData = imgData;
        if(o.data) 
            createReport(o.data);
        else 
            $.post(execURL + o.sqlParameter,createReport);   
        
    }
    ,createReport = function(dbData){
        //var doc = new jsPDF();
        //var doc = new jsPDF('p', 'mm', [335, 210]);   
        var doc = new jsPDF("p", "pt", "A4");
        var pageContent = function (data) {
                // HEADER
                doc.setFontSize(14);
                doc.setTextColor(40);
                doc.setFontStyle('normal');
            
                if(data.pageCount === 1){
                   var extraHeight = 65;
                    if (__imgData) {
                        doc.addImage(__imgData, 'JPEG', data.settings.margin.left,  data.settings.margin.top - extraHeight, 50, 50);
                    }
                    doc.text(o.reportTitle, data.settings.margin.left, data.settings.margin.top - 5);
                    data.settings.margin.top -= extraHeight;
                }
                
                // FOOTER
                var str = "Page " + data.pageCount;
                if (typeof doc.putTotalPages === 'function') {
                    str = str + " of " + totalPagesExp;
                }
                doc.setFontSize(10);
                doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 30);
        };
        
     
        doc.autoTable(
                      o.columnData
                    , dbData.rows
                    ,{
                        //tableLineWidth : 0.75
                        //showHeader:"firstPage"
                         tableWidth: 'wrap'
                        ,margin: {top: 85,left:20,right:20,bottom:30}
                        ,styles: {
                            font: 'courier'
                            ,fontSize: 8
                            ,lineWidth: 0.25
                            ,cellPadding: 3
                        }
                        ,addPageContent: pageContent
                    }
        
            );
         if (typeof doc.putTotalPages === 'function') {
            doc.putTotalPages(totalPagesExp);
        }
           
         
        if(o.isDisplay)
            document.getElementById("output").src = doc.output('datauristring');
        else 
            doc.save(o.reportTitle + '.pdf');
        
        
        }
        
    imgToBase64(o.logoURL, getData);
};            