var bs = zsi.bs.ctrl
    ,svn = zsi.setValIfNull
    ,g_user_id = null
;

zsi.ready(function(){
    displayRecords();
    if (gUser.is_admin === "Y") {
        $("#button-div").html('<button type="button" class="btn btn-primary btn-sm col-12 col-md-auto mb-1 mb-md-0" id="btnSave"><i class="fa fa-save"></i> Save</button> <button type="button" class="btn btn-primary btn-sm col-12 col-md-auto" id="btnDelete"><i class="fa fa-trash-alt"></i> Delete</button>' );
    }
});

function displayRecords(){   
    var cb = bs({name:"cbFilter1",type:"checkbox"});
    $("#grid").dataBind({
	     url            : procURL + "categories_sel"
	    ,width          : $("#main-content").width() - 40
	    ,height         : $("#main-content").height() - 150
	    ,selectorType   : "checkbox"
        ,blankRowsLimit : 5
        ,dataRows : [
                { text : cb , type : "hidden" , width : 25 , style : "text-align:left;"       
        		    , onRender : function(d) {
                	    return bs({name:"category_id",type:"hidden",value: svn(d,"category_id")})
                	        + bs({name:"is_edited",type:"hidden",value: svn(d,"is_edited")})
                            + (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                    }
                }
                ,{text  : "Category Desc"   , name  : "category_desc"       , type  : "input"   , width : 300    , style : "text-align:left;"}
         		,{text  : "Is Active"       , name  : "is_active"           , type  : "yesno"   , width : 80    , style : "text-align:left;"  ,defaultValue:"Y"}
	    ]
	     ,onComplete: function(){
	         $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
        }  
    });    
}

$("#btnSave").click(function() {
    $("#grid").jsonSubmit({
        procedure: "categories_upd"
        , optionalItems: ["is_active"]
        ,onComplete: function (data) {
            $("#grid").clearGrid(); 
            displayRecords();
        }
    });
});

$("#btnDelete").click(function(){
    zsi.form.deleteData({
         code       : "ref-0003"
        ,onComplete : function(data){
                        displayRecords();
                    }
    });      
});
