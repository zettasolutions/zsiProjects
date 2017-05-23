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


zsi.createPdfReport = function(o){
    if( isUD(o.detailData) ) {
        o.masterColumn = o.columnHeader;
        o.masterData = o.data;
    }
    
    var  rowHeight   = o.rowHeight
        ,cml         = o.cellMargin.left //cell margin left
        ,mt          = 10 //minus top
        ,doc         = new jsPDF("p", "pt", "A4")
        ,left        = o.margin.left
        ,row         = o.margin.top
        ,h1          = o.masterColumn //header 1
        ,i           = 0
        ,setBoxColor = function(r,g,b){
            doc.setDrawColor(186, 184, 184);
            doc.setFillColor(r,g,b);
        }
    ;
    
    doc.setFontSize(10);
    //print master column header 
    for(var x=0;x<h1.length;x++){
        h1[x].left = left;
        //print box
        setBoxColor(138, 191, 252);
        doc.rect(left, row-mt, h1[x].width,rowHeight, 'FD'); 
        //print title 
        doc.text(left + cml, row, h1[x].title);
        left +=h1[x].width;
    }
    
    //print master  data
    var md = o.masterData;
    for(var y=0;y<md.length;y++){
        row +=rowHeight;
        for(i=0;i<h1.length;i++){
            //print box
            setBoxColor(207, 226, 247)
            doc.rect(h1[i].left, row-mt, h1[i].width,rowHeight, 'FD');    
            //print text
            doc.text(h1[i].left  + cml, row, md[ y ][ h1[i].name ] + "");
        }

        //print detail data or sub table
        var dLeft = 60;
        var h2    = o.detailColumn; //header2
        var dd    = o.detailData;
        var ndd   = []; //new detail data 

        if( ! isUD(dd) ){
            for(i=0;i<dd.length;i++){
                 if(md[y][o.MasterKey] === dd[i][o.MasterKey]  )  ndd.push(dd[i]);
            }      
    
            if(ndd.length >0 ){ 
                row +=rowHeight;
                //print detail column header
                for(var dx=0;dx<h2.length;dx++){
                    h2[dx].left = dLeft;
                    //print box
                    setBoxColor(198, 204, 211);
                    doc.rect(dLeft, row-10, h2[dx].width,rowHeight, 'FD'); 
                    //print title
                    doc.text(dLeft  + cml, row, h2[dx].title);
                    dLeft +=h2[dx].width;
                }
                
                //print detail data
                for(var dy=0;dy<ndd.length;dy++){
                    row +=rowHeight;
                    for(i=0;i<h1.length;i++){
                        //display box
                        setBoxColor(255, 255, 255);
                        doc.rect(h2[i].left, row-mt, h2[i].width,rowHeight, 'FD'); 
                        //display text
                         doc.text(h2[i].left  + cml, row, ndd[ dy ][ h2[i].name ] + "");
                    }
                }        
            }
        }//end of isUndefined
    }
 
    document.getElementById("output").src = doc.output('datauristring');
};