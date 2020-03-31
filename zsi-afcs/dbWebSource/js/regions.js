(function(){
    var bs = zsi.bs.ctrl;
    var svn =  zsi.setValIfNull;

zsi.ready = function(){
    $(".page-title").html("Regions");
    displayRecords();
    
  
};


$("#btnSave").click(function () {
   $("#grid").jsonSubmit({
             procedure: "regions_upd"
             ,optionalItems: ["is_active"]
             ,onComplete: function (data) {
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                displayRecords();
            }
    });
});
$("#btnSaveInactiveRegions").click(function () {
   $("#gridInactiveRegions").jsonSubmit({
             procedure: "regions_upd"
             ,optionalItems: ["is_active"]
             ,onComplete: function (data) {
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                displayRecords();
                displayInactiveRegions();
                $('#modalInactiveRegions').modal('toggle');
            }
    });
});
$("#btnInactiveRegions").click(function () {
    $(".modal-title").text("Inactive Region(s)");
    $('#modalInactiveRegions').modal({ show: true, keyboard: false, backdrop: 'static' });
    displayInactiveRegions();
    
});    
function displayRecords(searchVal){
     $("#grid").dataBind({
	     sqlCode        : "R152" //regions_sel
	    ,parameters     : {search_val: (searchVal ? searchVal : "")}
	    ,width          : $(".zContainer").width()
	    ,height         : $(window).height() - 260
        ,blankRowsLimit : 5
        ,isPaging       : false
        ,dataRows       : [	 
                            {text  : "Region Id"                                , width : 55       , style : "text-align:center;"
            		            , onRender  :  function(d)
                                    { return app.bs({name:"region_id"           ,type:"input"      ,value: app.svn (d,"region_id")})
                                            +app.bs({name:"is_edited"           ,type:"hidden"     ,value: app.svn (d,"is_edited")})
                                            +app.bs({name:"region_code"         ,type:"hidden"     ,value: app.svn (d,"region_code")}); 
                                        
                                    }
            		        }
            		        ,{text  : "Region Name"          , name  : "region_name"                  , type  : "input"          , width : 300       , style : "text-align:left;"   ,sortColNo : 0}
            		        ,{text  : "Active?"              , name  : "is_active"                    , type  : "yesno"          , width : 50        , style : "text-align:center;"  ,defaultValue:"Y"}
	                    ]
    	    ,onComplete: function(){
                this.find(".zRow").find("input[name='region_id']").attr('readonly',true);
                this.find(".zRow").find("input[name='region_name']").addClass('autoCaps');
                this.on('dragstart', function () {
                    return false;
                });
                
        }  
    });    
}

function displayInactiveRegions(){
     var cb = app.bs({name:"cbFilter1",type:"checkbox"});
     $("#gridInactiveRegions").dataBind({
	     url             : app.execURL + "regions_sel @is_active=N"
	    ,width          : $(".modal-body").width()
	    ,height         : 360
        ,blankRowsLimit : 5
        ,isPaging       : false
        ,dataRows       : [
                            { text  : cb , width : 25   , style : "text-align:center" 
                                , onRender  :  function(d)
                                    { return (d !==null ? app.bs({name:"cb"     ,type:"checkbox"}) : "" ); }
                            }
                            ,{text  : "Region Id"                               , width : 55       , style : "text-align:center;"
            		            , onRender  :  function(d)
                                    { return app.bs({name:"region_id"           ,type:"input"              ,value: app.svn (d,"region_id")})
                                            +app.bs({name:"is_edited"           ,type:"hidden"             ,value: app.svn (d,"is_edited")})
                                            +app.bs({name:"region_code"         ,type:"hidden"             ,value: app.svn (d,"region_code")}); 
                                        
                                    }
            		        }
            		        ,{text  : "Region Name"          , name  : "region_name"                  , type  : "input"             , width : 300       , style : "text-align:left;"}
            		        ,{text  : "Active?"              , name  : "is_active"                    , type  : "yesno"             , width : 50        , style : "text-align:center;"  ,defaultValue:"N"}
	                    ]
    	    ,onComplete: function(){
                $("[name='cbFilter1']").setCheckEvent("#gridInactiveRegions input[name='cb']");
                this.find(".zRow").find("input[name='region_id']").attr('readonly',true);
                this.find(".zRow").find("input[name='region_name']").addClass('autoCaps');
                this.on('dragstart', function () {
                    return false;
                });
        }  
    });    
}

$("#btnSearchVal").click(function(){ 
    var _searchVal = $.trim($("#searchVal").val()); 
    displayRecords(_searchVal);
}); 
$("#searchVal").on('keypress',function(e) {
    var _searchVal = $.trim($("#searchVal").val()); 
    if(e.which == 13) {
        displayRecords(_searchVal);
    }
});
$("#searchVal").keyup(function(){
    if($(this).val() === "") {
        displayRecords();
    }
});
$("#btnResetVal").click(function(){
    displayRecords();
});

$("#btnDelete").click(function(){
    zsi.form.deleteData({
         code       : "ref-00017"
        ,onComplete : function(data){
        displayInactiveRegions();
        $('#modalInactiveRegions').modal('toggle');
      }
    });       
});
})();
                                        