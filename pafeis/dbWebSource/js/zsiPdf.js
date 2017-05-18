  zsi.generatePdfReport = function(o){
    
    var imgToBase64 = function (url, callback) {
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
    
    var generateDoc = function(imgData){

        var totalPagesExp = "{total_pages_count_string}";
        $.post(execURL + o.sqlParameter,function(dbData){
            var doc = new jsPDF();
            //var doc = new jsPDF('p', 'mm', [297, 300]);       
        var pageContent = function (data) {
                // HEADER
                doc.setFontSize(14);
                doc.setTextColor(40);
                doc.setFontStyle('normal');
                if (imgData) {
                    doc.addImage(imgData, 'JPEG', data.settings.margin.left,  data.settings.margin.top -17, 10, 10);
                }
                doc.text(o.reportTitle, data.settings.margin.left, data.settings.margin.top - 2);
        
                // FOOTER
                var str = "Page " + data.pageCount;
                if (typeof doc.putTotalPages === 'function') {
                    str = str + " of " + totalPagesExp;
                }
                doc.setFontSize(10);
                doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 10);
        };
        
        doc.autoTableSetDefaults({
             margin: {top: 25,left:8,right:8,bottom:15}
            ,addPageContent: pageContent
        });
        
        
        doc.autoTable(
                      o.columnData
                    , dbData.rows
                    ,{
                        styles: {
                            font: 'courier'
                            ,fontSize: 8
                            ,lineHeight: 20
                        }
                    }
        
            );
         if (typeof doc.putTotalPages === 'function') {
            doc.putTotalPages(totalPagesExp);
        }
            
        if(o.isDisplay)
            document.getElementById("output").src = doc.output('datauristring');
        else 
            doc.save(o.reportTitle + '.pdf');
        
        
        });   
    }

    imgToBase64(o.logoURL, generateDoc);
} 