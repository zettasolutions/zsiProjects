var position = (function(){
    var      bs                 = zsi.bs.ctrl
            ,svn                = zsi.setValIfNull
            ,gtw                = null
            ,_public            = {}
            ,gMdlOtherIncome    = "modalWindowOtherIncome"
    ;
    
    zsi.ready = function() {
        gtw = new zsi.easyJsTemplateWriter();
        $(".page-title").html("Positions");
        displayPositions();
        getTemplates();
    };

    function getTemplates(){
        new zsi.easyJsTemplateWriter("body")
        .bsModalBox({
              id        : gMdlOtherIncome
            , sizeAttr  : "modal-lg"
            , title     : "Other Income"
            , body      : gtw.new().modalBodyOtherIncome({grid:"gridOtherIncome",onClickSaveOtherIncome:"submitOtherIncome();"}).html()  
        });
    }
    
    $("#btnSavePosition").click(function () {
       $("#gridPosition").jsonSubmit({
                 procedure  : "positions_upd"
                ,onComplete: function (data) {
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    $("#gridPosition").trigger("refresh");
                }
        });
    });
    $("#btnDeletePosition").click(function(){
        zsi.form.deleteData({
             code       : "ref-00018"
            ,onComplete : function(data){
                $("#gridPosition").trigger("refresh");
              }
        });       
    });
    
     function displayPositions(){
        var cb = app.bs({name:"cbFilter",type:"checkbox"});
        $("#gridPosition").dataBind({
             sqlCode        : "P201" //positions_sel
            ,blankRowsLimit : 5
            ,width          : $(".panel-container").width() 
            ,height         : $(document).height() - 260
            ,dataRows       : [
                { text  : cb , width : 25   , style : "text-center" 
                    , onRender  :  function(d)
                        { return  app.bs({name:"position_id"                    ,type:"hidden"       ,value: app.svn(d,"position_id")})
                                + app.bs({name:"is_edited"                      ,type:"hidden"       ,value: app.svn(d,"is_edited")})
                                + (d !==null ? app.bs({name:"cb"                ,type:"checkbox"}) : "" ); }
                }
                ,{text: "Position Title"            ,name:"position_title"      ,type:"input"        ,width : 150   ,style : "text-align:left;"}
                ,{text: "Position Description"      ,name:"position_desc"       ,type:"input"        ,width : 200   ,style : "text-align:left;"}
                ,{text: "Work Description"          ,name:"work_desc"           ,type:"input"        ,width : 200   ,style : "text-align:left;"}
                ,{text: "Level No."                 ,name:"level_no"            ,type:"input"        ,width : 65    ,style : "text-align:left;"}
                ,{text: "Other Income"                                          ,type:"input"        ,width : 90    ,style : "text-align:center"
                    ,onRender : function(d){
                            var _link = "<a href='javascript:void(0)' ' onclick='position.showModalOI("+ app.svn (d,"position_id") +",\""+ app.svn (d,"position_title") +"\")'><i class='fas fa-link link'></i></a>";
                            return (d !== null ? _link : "");
                        
                    }
                }
                
            ]
            ,onComplete: function(){
                var _zRow = this.find(".zRow");
                this.find("#cbFilter").setCheckEvent("#gridPosition input[name='cb']");
            }
        });
    } 


     function displayOtherIncome(posId){
        var cb = app.bs({name:"cbFilter",type:"checkbox"});
        $("#gridOtherIncome").dataBind({
             sqlCode        : "E208" //emp_pos_other_income_sel
            ,parameters     : {position_id : posId}
            ,blankRowsLimit : 5
            ,width          : $(".panel-container").width() 
            ,height         : $(document).height() - 260
            ,dataRows       : [
                { text  : cb , width : 25   , style : "text-center" 
                    , onRender  :  function(d)
                        { return  app.bs({name:"emp_pos_other_income_id"        ,type:"hidden"       ,value: app.svn(d,"emp_pos_other_income_id")})
                                + app.bs({name:"is_edited"                      ,type:"hidden"       ,value: app.svn(d,"is_edited")})
                                + app.bs({name:"employee_id"                    ,type:"hidden"       ,value: app.svn(d,"employee_id")})
                                + app.bs({name:"position_id"                    ,type:"hidden"       ,value: posId })
                                + (d !==null ? app.bs({name:"cb"                ,type:"checkbox"}) : "" ); }
                }
                ,{text: "Other Income"          ,name:"other_income_id"         ,type:"select"       ,width : 150   ,style : "text-align:left;"}
                ,{text: "Amount"                                                                     ,width : 95    ,style : "text-align:right;"
                    ,onRender: function(d){
                        return (d !== null ? bs({name: "amount"   ,type: "input"  ,value: parseFloat(app.svn(d,"amount")).toFixed(2) }) : bs({name: "amount"   ,type: "input"  ,value: app.svn(d,"amount") }) );
                    }
                }
    
            ]
            ,onComplete: function(){
                var _zRow = this.find(".zRow");
                this.find("#cbFilter").setCheckEvent("#gridOtherIncome input[name='cb']");
                this.find("select[name='other_income_id']").dataBind({
                     sqlCode : "O198" //other_income_sel 
                    ,text: "other_income_desc"
                    ,value: "other_income_id" 
                });
                this.data("posId",posId);
                this.find("input[name='amount']").css({"text-align":"right", "margin-left": "-5px"});
                this.find(".zHeaders .item:last(child) .text").css({
                    "text-align": "right"
                    ,"width": "100%"
                    ,"margin-right": "4px"
                });

            }
        });
    } 

    _public.showModalOI  = function(posId,pTitle) {
        var g$mdl = $("#" + gMdlOtherIncome);
        g$mdl.find(".modal-title").html(" Other Income » " + pTitle);
        g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        displayOtherIncome(posId);
    };
    
    _public.submitOtherIncome = function(){
        var _$grid = $("#gridOtherIncome");
            _$grid.jsonSubmit({
                 procedure: "emp_pos_other_income_upd"
                ,onComplete: function (data) {
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    displayOtherIncome(_$grid.data("posId"));
                }
            });
    }; 
            
    _public.deleteOtherIncome = function(){
        zsi.form.deleteData({
             code       : "ref-00019"
            ,onComplete : function(data){
                $("#gridOtherIncome").trigger("refresh");
              }
        });       
    };
    
    
    
    
    return _public;
})();          