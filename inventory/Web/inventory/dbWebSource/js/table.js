var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;

zsi.ready(function(){
    displayRecords();
    
    
});


 $("#btnSave").click(function () {
         $("#frm").jsonSubmit({
              procedure: "tables_upd"
               ,optionalItems: ["table_name","table_key_name"]
            , onComplete: function (data) {
                displayRecords();
            }
        });
        
      
});


function displayRecords(){
    var cb = bs({name:"cbFilter1",type:"checkbox"});
          $("#grid").dataBind({
	     url            : execURL + "tables_sel"
	    ,width          : $(document).width() - 480
	    ,height         : $(document).height() - 250
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
                 {text  : " "                                                         , type  : "hidden"            , width    : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                   return     bs({name:"table_id",type:"hidden",value: svn (d,"table_id")})
                                                    +  bs({name:"cb",type:"checkbox"});
                            }
            }	 
        		,{text  : "Code"                    , name  : "table_code"            , type  : "input"             , width : 200       , style : "text-align:left;"}
        		,{text  : "Table Name"              , name  : "table_name"            , type  : "select"            , width : 300       , style : "text-align:left;"}
        		,{text  : "Primary Key"             , name  : "table_key_name"        , type  : "select"            , width : 250       , style : "text-align:left;"}
        	
	    ]
	     ,onComplete: function(){
             var objTable =$("select[name='table_name']");
           objTable.change(function(){
               
                var tr= this.parentNode.parentNode ;
                    if(this.value!=="")
                        $(tr).find("#table_key_name").dataBind({ url :execURL + "table_column_options_sel '" + this.value + "'"});  
               
           });
           
             objTable.dataBind({ 
                 url : execURL + "table_options_sel"
                 ,onComplete : function(){
                    $ddl = $("select[name='table_name']");
                    $.each($ddl,function(){
                        var tr= this.parentNode.parentNode ;
                        if(this.value!=="")
                        $(tr).find("#table_key_name").dataBind({ url : execURL + "table_column_options_sel '" + this.value + "'"});
                    });
                       
                        
                 }
             });

       }
    });    
    
   
}
   
    
 
    
  /*  var rownum=0;
    $("#grid").loadData({
         url    : execURL + "tables_sel"
        ,td_body: [ 
            function(d){
                return     bs({name:"table_id",type:"hidden",value: d.table_id})
                        +  bs({name:"cb",type:"checkbox"});
            }            
            ,function(d){ return bs({name:"table_code",value: d.table_code }); }
            ,function(d){ return bs({name:"table_name",value: d.table_name,type:"select" }); }
            ,function(d){ return bs({name:"table_key_name",value: d.table_key_name,type:"select"}); }

        ]
        ,onComplete: function(){
            displayBlankRows();
        }
    });    
}*/

/*function displayBlankRows(){       
    var inputCls = "form-control input-sm";
    $("#grid").loadData({
         td_body: [ 
            function(){
                return     bs({name:"table_id",type:"hidden"})
                        +  bs({name:"cb",type:"checkbox"});
            }            
            ,function(){ return bs({name:"table_code" }); }
            ,function(){ return bs({name:"table_name",type:"select" }); }
            ,function(){ return bs({name:"table_key_name",type:"select",value:""}); }

        ]
       ,onComplete: function(){
           var objTable =$("select[name='table_name']");
           objTable.change(function(){
               
                var tr= this.parentNode.parentNode ;
                    if(this.value!=="")
                        $(tr).find("#table_key_name").dataBind( execURL + "table_column_options_sel '" + this.value + "'");  
               
           });
           
           
             objTable.dataBind({ 
                 url : execURL + "table_options_sel"
                 ,onComplete : function(){
                    $ddl = $("select[name='table_name']");
                    $.each($ddl,function(){
                        var tr= this.parentNode.parentNode ;
                        if(this.value!=="")
                        $(tr).find("#table_key_name").dataBind( execURL + "table_column_options_sel '" + this.value + "'");
                    });
                       
                        
                 }
             });

       }
    });    
    
   
}*/

$("#btnDelete").click(function(){
    zsi.form.deleteData({
         code       : "sys-0009"
        ,onComplete : function(data){
                        displayRecords();
                      }
    });   

});     
                                      