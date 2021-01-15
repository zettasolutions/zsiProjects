
zsi.ready = function(){
    //displayPrograms();
    displayContacts();
}
function displayPrograms(){
    var _data   =     [
                         { field1 : ""      ,field2 : ""    ,field3 : ""    ,field4 : ""    ,field5 : ""    ,field6 : ""    ,field7 : ""    ,field8 : ""}
                        ,{ field1 : ""      ,field2 : ""    ,field3 : ""    ,field4 : ""    ,field5 : ""    ,field6 : ""    ,field7 : ""    ,field8 : ""}
                        ,{ field1 : ""      ,field2 : ""    ,field3 : ""    ,field4 : ""    ,field5 : ""    ,field6 : ""    ,field7 : ""    ,field8 : ""}
                    ]
    $("#programs").dataBind({
         rows       : _data
        ,width      : $(document).width() - 150
        ,dataRows   : [
             { text: ""     ,name : "field1"      ,width : 200    }
            ,{ text: ""     ,name : "field2"      ,width : 200    }
            ,{ text: ""     ,name : "field3"      ,width : 200    }
            ,{ text: ""     ,name : "field4"      ,width : 200    }
            ,{ text: ""     ,name : "field5"      ,width : 200    }
            ,{ text: ""     ,name : "field6"      ,width : 200    }
            ,{ text: ""     ,name : "field7"      ,width : 200    }
            ,{ text: ""     ,name : "field8"      ,width : 200    }
        ]
    });
}
function displayContacts(){
    var tdata = "";
    var _data = [
                     { name : "Buckowski"       ,position : "Pgm Coordinator"   ,email : "jbuckowski@lear.com" }
                    ,{ name : "Delgadillo"      ,position : "Car Leader"        ,email : "" }
                    ,{ name : "Veronica"        ,position : "Car Leader"        ,email : "" }
                    ,{ name : "Fouts"           ,position : "Progrma Manager"   ,email : "" }
                    ,{ name : "Rivera"          ,position : "Launch Manager"    ,email : "" }
                    ,{ name : "Morgan"          ,position : "Program Manager"   ,email : "" }
                    ,{ name : "Jawad"           ,position : "Eng Manager"       ,email : "" }
                    ,{ name : "Torres"          ,position : "Warehouse Contact" ,email : "" }
                    ,{ name : "Victor"          ,position : "Warehouse Contact" ,email : "" }
                ]
        
        _data.forEach(function(a){
          tdata =   "<tr>";
          tdata +=      "<td>"+ a.name      +"</td>";
          tdata +=      "<td>"+ a.position  +"</td>";
          tdata +=      "<td>"+ a.email     +"</td>";
          tdata +=  "</tr>";
          $("#tblContacts tbody").append(tdata);
        });
        
 }