var bs = zsi.bs.ctrl
    ,svn =  zsi.setValIfNull
    ,g_tab_name = "C" //Set Default Tab Name
    ,g_ms_id = null
;

zsi.ready(function(){
    setCurrentTab();
    displayRecords();
        
    $("#category-tab").click(function () {
        g_tab_name = "C"; 
        displayRecords();
    });
    
    $("#type-tab").click(function () {
        g_tab_name = "T";
        displayRecords();
    });
    
    $("#detail-tab").click(function () {
        g_tab_name = "D";
        displayRecords();
    });
});

// Set the current tab when the page loads.
function setCurrentTab(){
    var $tabs = $("#tabPanel > div");
    var $navTabs = $("ul.nav-tabs > li");
    $tabs.removeClass("active");
    $navTabs.removeClass("active");
    // Set supplier delivery tab as current tab.
    $($tabs.get(0)).addClass("active"); 
    $($navTabs.get(0)).addClass("active");
}

// Add a click event for the li elements.
$("ul.nav-tabs >li").click(function(){
    var i = $(this).index();
    createCookie("receiving_tab_index",i,1);
    $("#tabPanel > div").each(function(){
        var obj =  $(this);
        var cur_div_index = obj.index();
        obj.removeClass("active");
        if(i===cur_div_index)
           obj.addClass("active");
    });
});

// Display the grid for the aircraft issuance.
function displayRecords(){
      var cb = bs({name:"cbFilter" + g_tab_name ,type:"checkbox"});
    $("#grid" + g_tab_name).dataBind({
         url            : procURL + "mission_symbols_sel @ms_classification_code='" + g_tab_name + "',@ms_id="+ g_ms_id 
        ,width          : $(document).width() - 35
        ,height         : $(document).height() - 250
        ,blankRowsLimit: 5
        ,selectorType   : "checkbox"
        ,isPaging : false
        ,dataRows : [
            
            {text : cb    ,width : 25   ,style : "text-align:left;"       
            		,onRender : function(d){ 
                        return  bs({name:"ms_id",type:"hidden",value: svn (d,"ms_id")})
                            + bs({name:"is_edited",type:"hidden" })
                            + (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                }
            }	 
            ,{text  : "Code"             ,name : "ms_code"           ,type : "input"     ,width : 100     ,style : "text-align:left;"}
            ,{text  : "Description"                                                      ,width : 500     ,style : "text-align:left;"
                    ,onRender: function(d){ return bs({name:"ms_description" ,value: svn (d,"ms_description")})
                                                +  bs({name:"ms_classification_code"  ,type:"hidden"}) ;
                
                }
            }

        ]   
        ,onComplete: function(){
            $("#cbFilter" + g_tab_name).setCheckEvent("#grid" + g_tab_name + " input[name='cb']");
	        $("select, input").on("keyup change", function(){
                var $zRow = $(this).closest(".zRow");
                $zRow.find("#is_edited").val("Y");
                $zRow.find("#ms_classification_code").val(g_tab_name);
            });
        }
    });    
}

$(".btnSave").click(function(){
    $("#grid" + g_tab_name).jsonSubmit({
        procedure: "mission_symbols_upd"
        ,onComplete: function (data) {
            $("#grid" + g_tab_name).clearGrid();
            if(data.isSuccess===true) zsi.form.showAlert("alert");
            displayRecords();
        }
    });
});


$(".btnDelete").click(function(){
    zsi.form.deleteData({
         code       : "ref-0038"
        ,onComplete : function(data){
            displayRecords();
        }
    });       
});
    