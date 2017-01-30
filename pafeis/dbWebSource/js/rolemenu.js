 var bs = zsi.bs.ctrl;

$(document).ready(function(){
    displayRecords();
    
});

 $("#btnSave").click(function () {
    $("#frm").jsonSubmit({
             procedure: "role_menus_upd"
            
            ,onComplete: function (data) {
                displayRecords();
            }
    });
     
});
    
function displayRecords(){   
    var rownum=0;
    $("#grid").loadData({
         url   : execURL + "role_menus_sel"
        ,td_body: [ 
            function(d){
                return     bs({name:"role_menu_id",type:"hidden",value: d.role_menu_id})
                        +  bs({name:"cb",type:"checkbox"});
            }            
            ,function(d){ return bs({name:"role_id",value: d.role_id,type:"select"}); }
            ,function(d){ return bs({name:"menu_id",value: d.menu_id,type:"select"}); }
            ,function(d){ return bs({name:"is_new",value: d.is_new,type:"yesno"}); }
            ,function(d){ return bs({name:"is_write",value: d.is_write,type:"yesno"}); }
            ,function(d){ return bs({name:"is_delete",value: d.is_delete,type:"yesno"}); }
        ]
        ,onComplete: function(){
            displayBlankRows();
        }
    });    
}


function displayBlankRows(){       
    var inputCls = "form-control input-sm";
    $("#grid").loadData({
         td_body: [ 
            function(){
                return     bs({name:"role_id",type:"hidden"})
                        +  bs({name:"cb",type:"checkbox"});
            }            
            ,function(){ return bs({name:"role_id",type:"select"}); }
            ,function(){ return bs({name:"menu_id",type:"select"}); }
            ,function(){ return bs({name:"is_new",type:"yesno"}); }
            ,function(){ return bs({name:"is_write",type:"yesno"}); }
            ,function(){ return bs({name:"is_delete",type:"yesno"}); }
        ]
         ,onComplete: function(){
             $("select[name='role_id']").dataBind( "roles");
             $("select[name='menu_id']").dataBind( "menus");
            }        
        
    });    
    
   
}       