var      bs             = zsi.bs.ctrl
        ,svn            =  zsi.setValIfNull
        ,gMdlProgParts  = "modalProgramParts"
        ,gtw            = null
;

zsi.ready = function(){
    gtw = new zsi.easyJsTemplateWriter();
    displayRecords();
    getTemplates();
};


function getTemplates(){
    new zsi.easyJsTemplateWriter("body")
    .bsModalBox({
          id        : gMdlProgParts
        , sizeAttr  : "modal-lg"
        , title     : "Program Parts"
        , body      : gtw.new().modalBodyProgParts({grid:"gridProgParts",onClickSaveProgramParts:"submitProgParts();"}).html()  
    });
}

$("#btnSave").click(function () {
   $("#grid").jsonSubmit({
             procedure: ""
            ,optionalItems: ["is_active"]
            , onComplete: function (data) {
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                displayRecords();
            }
    });
});

function displayRecords(){
     var cb = bs({name:"cbFilter1",type:"checkbox"});
     $("#grid").dataBind({
 	     url            : execURL + "oem_sel"
	    ,width          : $(document).width() - 370
	    ,height         : $(document).height() - 200
        ,blankRowsLimit : 5
        ,isPaging       : false
        ,dataRows       : [
                            { text  : cb , width : 25   , style : "text-align:left;" 
                                , onRender  :  function(d)
                                    { return     bs({name:"oem_id",type:"hidden",value: svn (d,"oem_id")}) 
                                    +   bs({name:"is_edited"            ,type:"hidden"  ,value: svn(d,"is_edited")}) 
                                    + (d !==null ? bs({name:"cb",type:"checkbox"}) : "" ); }
                            }	 
            		        ,{text  : "OEM Shortname"       , name  : "oem_sname"                 ,type  : "input"         ,width : 200       , style : "text-align:left;"}
            		        ,{text  : "OEM Name"            , name  : "oem_name"                  ,type  : "input"         ,width : 300       , style : "text-align:left;"}
            		        ,{text  : "Active?"             , width : 60            , style : "text-align:center;"          ,defaultValue:"Y"
                                   ,onRender : function(d){ return bs({name:"is_active" ,type:"yesno"   ,value: svn(d,"is_active")    })
                                                                  +  bs({name:"is_edited",type:"hidden"});
                                 }
                            }
                            ,{text : "Program"              ,name : "tmp1"                          ,type : "input"          ,width : 90        ,style : "text-align:center"
                                    ,onRender : function(d){
                                            return "<a href='javascript:void(0)' title='OEM > "+ svn (d,"oem_name") +"' onclick='showModal(\""+ "Programs" + "\" ,"+ svn (d,"oem_id") +",\""+ svn (d,"oem_name") +"\")'><i class='fas fa-link link'></i></a>";
                                    }
                             }
                            ,{text : "Build Phase"          ,name : "tmp2"                          ,type : "input"          ,width : 100       ,style : "text-align:center"
                                    ,onRender : function(d){
                                            return "<a href='javascript:void(0)' title='OEM > "+ svn (d,"oem_name") +"' onclick='showModal(\""+ "Build Phase" + "\","+ svn (d,"oem_id") +",\""+ svn (d,"oem_name") +"\")'><i class='fas fa-link link'></i></a>";
                                    }
                            }
	                    ]
    	    ,onComplete: function(){
                $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
        }  
    });    
}

$("#btnDelete").click(function(){
    zsi.form.deleteData({
         code       : ""
        ,onComplete : function(data){
                        displayRecords();
                      }
    });       
});

function showModal(tabName, id,name) {
    var _$body = $("#frm_modalOEM").find(".modal-body");
    
    g$mdl = $("#modalOEM");
    g$mdl.find(".modal-title").text("OEM » " + name ) ;
    g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
    
    if(tabName === "Programs") _$body.find("#nav-tab").find("[aria-controls='nav-p']").trigger("click");
    else _$body.find("#nav-tab").find("[aria-controls='nav-bp']").trigger("click");

    displayProgram(id);
    displayBuildPhase(id);
}

function showModalParts(oemId,progId,name) {
    g$mdl = $("#" + gMdlProgParts);
    g$mdl.find(".modal-title").text("Parts » " + name ) ;
    g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
    displayProgramParts(oemId,progId);
}


function displayProgram(id){
    $("#grid-P").dataBind({
         url            : execURL + "oem_programs_sel @oem_id=" + id
        ,width          : $("#frm_modalOEM").width() - 65
        ,height         : 360
        ,blankRowsLimit : 5
        ,dataRows       : [
             {text: "Program Code"      ,width : 100   ,style : "text-align:left"
                ,onRender  :  function(d){ return bs({name:"program_id" ,type:"hidden"      ,value: svn (d,"program_id")}) 
                                + bs({name:"is_edited"                  ,type:"hidden"      ,value: svn(d,"is_edited")}) 
                                + bs({name:"oem_id"                     ,type:"hidden"      ,value: id })
                                + bs({name:"program_code"               ,type:"input"       ,value: svn(d,"program_code") }); 
                }

            }
            ,{text: "Program Name"      ,name : "program_name"          ,type : "input"     ,width : 250  ,style : "text-align:left"}
            ,{text: "Program Manager"   ,name : "program_manager_id"    ,type : "select"    ,width : 200  ,style : "text-align:left"}
            ,{text: "Launch Manager"    ,name : "launch_manager_id"     ,type : "select"    ,width : 200  ,style : "text-align:left"}
            ,{text: "Engineer Manager"  ,name : "engr_manager_id"       ,type : "select"    ,width : 200  ,style : "text-align:left"}
            ,{text: "Last Update"       ,name : "last_update"           ,type : "input"     ,width : 200  ,style : "text-align:left"}
            ,{text: "Is Active?"        ,name : "is_active"             ,type : "yesno"     ,width : 85   ,style : "text-align:left" ,defaultValue: "Y"}
            ,{text: "Parts"                                             ,type : "input"     ,width : 90   ,style : "text-align:center"
                    ,onRender : function(d){
                            var _link =  "<a href='javascript:void(0)' title='PROGRAM > "+ svn (d,"program_code") +"' onclick='showModalParts("+ svn (d,"oem_id") +",\""+ svn (d,"program_id") +"\",\""+ svn (d,"program_name") +"\")'><i class='fas fa-link link'></i></a>";
                            return (d !== null ? _link : "");
                    }
             }

        ]
        ,onComplete: function(o){
            this.data("id",id);
        }
    });
}  

function displayBuildPhase(id){
    $("#grid-BP").dataBind({
         url            : execURL + "oem_build_phases_sel @oem_id=" + id
        ,width          : $("#modalBuildPhase").width()- 265
        ,height         : 360
        ,blankRowsLimit : 5
        ,dataRows       : [
            {text: "Build Phase Abbrv"         ,type : "input"  ,width : 120    ,style : "text-align:left"
                ,onRender  :  function(d)  
                    { return   bs({name:"oem_build_phase_id"    ,type:"hidden"  ,value: svn(d,"oem_build_phase_id")})
                             + bs({name:"is_edited"             ,type:"hidden"  ,value: svn(d,"is_edited")}) 
                             + bs({name:"oem_id"                ,type:"hidden"  ,value: id })
                             + bs({name:"build_phase_abbrv"     ,value: svn(d,"build_phase_abbrv")});
                    }
            }
            ,{text: "Build Phase Name"         ,name: "build_phase_name"        ,type: "input"  ,width : 200   ,style : "text-align:left"}
            ,{text: "Is Active?"               ,name:"is_active"                ,type:"yesno"   ,width : 85    ,style : "text-align:center;"  ,defaultValue:"Y"}
        ]
        ,onComplete: function(o){
            this.data("id",id);
        }
    });
}  

function displayProgramParts(oemId,progId){
    $("#gridProgParts").dataBind({
         url            : execURL + "oem_program_bp_parts_sel @program_id=" + progId
        ,width          : $("#frm_modalProgramParts").width() - 65
        ,height         : 360
        ,blankRowsLimit : 5
        ,dataRows       : [
             {text: "Build Phase"      ,width : 250   ,style : "text-align:left"
                ,onRender  :  function(d){ return bs({name:"oem_program_part_id" ,type:"hidden"      ,value: svn (d,"oem_program_part_id")}) 
                                + bs({name:"is_edited"                           ,type:"hidden"      ,value: svn(d,"is_edited")}) 
                                + bs({name:"program_id"                          ,type:"hidden"      ,value: progId })
                                + bs({name:"build_phase_id"                      ,type:"select"      ,value: svn(d,"build_phase_id") }); 
                }

            }
            ,{text: "Part Desc"      ,name : "part_desc"                         ,type : "input"     ,width : 160  ,style : "text-align:left"}
            ,{text: "Part Number"    ,name : "oem_part_number"                   ,type : "input"     ,width : 200  ,style : "text-align:left"}

        ]
        ,onComplete: function(o){
            this.data("oemId",oemId);
            this.data("progId",progId);
            
            this.find("select[name='build_phase_id']").dataBind({
                 sqlCode : "O148"
                ,parameters:{oem_id : oemId}
                ,text: "build_phase_name"
                ,value: "oem_id"
            });
        }
    });
}  

function submitProgParts(){
    var _$grid = $("#gridProgParts");
        _$grid.jsonSubmit({
             procedure: "oem_program_bp_parts_upd"
            ,onComplete: function (data) {
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                displayProgramParts(_$grid.data("oemId"),_$grid.data("progId"));
            }
        });
} 

function submitDataPrograms(){
    var _$grid = $("#grid-P");
        _$grid.jsonSubmit({
             procedure: "oem_programs_upd"
            ,optionalItems: ["is_active"]
            ,onComplete: function (data) {
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                displayBuildPhase(_$grid.data("id"));
            }
        });
} 

function submitDataBuildPhase(){
    var _$grid = $("#grid-BP");
        _$grid.jsonSubmit({
             procedure: "oem_build_phases_upd"
            ,optionalItems: ["is_active"]
            ,onComplete: function (data) {
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                displayBuildPhase(_$grid.data("id"));
            }
        });
}   



      