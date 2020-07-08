var products = (function(){
    var _pub                = {};
    
    zsi.ready = function(){
        $(".page-title").html("Products"); 
        displayProducts();
        
    };
   
    function displayProducts(){
        var cb = app.bs({name:"cbFilter1",type:"checkbox"}); 
        $("#gridProducts").dataBind({
             sqlCode        : "P1289" //products_sel
            ,height         : $(window).height() - 236
            ,blankRowsLimit : 5
            ,dataRows       : [
                {text: cb                       ,width:25       ,style:"text-align:left"
                    ,onRender : function(d){
                        return app.bs({name:"product_id"          ,type:"hidden"              ,value: app.svn(d,"product_id")}) 
                            + app.bs({name:"is_edited"        ,type:"hidden"              ,value: app.svn(d,"is_edited")})
                            + (d !== null ? app.bs({name:"cb" ,type:"checkbox" }) : "" );
                    }
                 }
                ,{text: "Product Code"                  ,width : 150    ,name:"product_code"            ,type:"input"        ,style : "text-align:center;"}
                ,{text: "Product Name"                  ,width : 200    ,name:"product_name"            ,type:"input"        ,style : "text-align:left;"}
                ,{text: "Product Description"           ,width : 250    ,name:"product_desc"            ,type:"input"        ,style : "text-align:left;"}
                ,{text: "Product SRP"                   ,width : 100    ,style : "text-align:right !important;"
                    ,onRender : function(d){
                        return app.bs({name:"product_srp"          ,type:"input"              ,value: commaSeparateNumber(app.svn(d,"product_srp"))     ,style : "text-align:right;padding-right:0.3rem"}); 
                    }
                }
                ,{text: "Product Down Payment"          ,width : 130    ,style : "text-align:right !important;"
                    ,onRender : function(d){
                        return app.bs({name:"product_dp"          ,type:"input"              ,value: commaSeparateNumber(app.svn(d,"product_dp"))       ,style : "text-align:right;padding-right:0.3rem"}); 
                    }
                }
                ,{text: "Device Brand"                  ,width : 150    ,name:"device_brand_id"         ,type:"select"        ,style : "text-align:center;"}
                ,{text: "Device Type"                   ,width : 150    ,name:"device_type_id"          ,type:"select"        ,style : "text-align:center;"}
            ]
            ,onComplete: function(o){
                gPlansData = o.data.rows;
                var _$this = this;
                var _$row = _$this.find(".zRow");
                _$this.find("[name='cbFilter1']").setCheckEvent("#gridProducts input[name='cb']");
                $("[name='product_srp'],[name='product_dp']").maskMoney();
                _$row.find('[name="device_brand_id"]').dataBind({
                     sqlCode     : "D271" //dd_device_brands_sel
                    ,text        : "device_brand_name"
                    ,value       : "device_brand_id"
                });
                
                _$row.find('[name="device_type_id"]').dataBind({
                     sqlCode     : "D267" //dd_device_types_sel
                    ,text        : "device_type"
                    ,value       : "device_type_id"
                });
                
                $(":input").inputmask();
                _$row.find('[name="product_srp"],[name="product_dp"]').attr({
                     "data-inputmask"   : "'mask': '000,000,000'" 
                    ,"im-insert"        : "true"
                });
                
                //zsi.initInputTypesAndFormats();
            }
        });
    }
    
   function commaSeparateNumber(n){
        var _res = "";
        if($.isNumeric(n)){
            var _num = parseFloat(n).toFixed(2).toString().split(".");
            _res = _num[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (!isUD(_num[1]) ? "." + _num[1] : "");
        }
        return _res;
    }
  
    $("#btnSaveProducts").click(function(){ 
        var _$grid = $("#gridProducts");
        var _$productSrp = _$grid.find("input[name='product_srp']");
        var _$productDp = _$grid.find("input[name='product_dp']");
            _$productSrp.each(function(){
                this.value = this.value.replace(/,/g, "");
            });
            _$productDp.each(function(){
                this.value = this.value.replace(/,/g, "");
            });
        
        _$grid.jsonSubmit({
             procedure: "products_upd" 
            ,onComplete: function (data) { 
               if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                displayProducts();
            } 
        }); 
    });
    
    $("#btnDeleteProducts").click(function(){
        zsi.form.deleteData({ 
            code:"ref-0010" 
           ,onComplete:function(data){
                 displayProducts();
           }
        });
    });
    
    return _pub;
})();                                       