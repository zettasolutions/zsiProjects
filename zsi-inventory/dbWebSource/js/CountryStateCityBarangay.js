(function(){
        
    var  bs         = zsi.bs.ctrl
        ,svn        = zsi.setValIfNull
        ,gCountryId = null
        ,gStateId   = null
        ,gActiveTab = ""
    ;
    
    zsi.ready = function(){
        $(".page-title").html("Countries, States, Cities and Barangays Reference");
        displayCountries();
        displaySelects();
        gActiveTab = "country";
        
        $("#countryId").select2();
        $("#stateId").select2();
        $('a[data-toggle="tab"]').on('shown.bs.tab', function(e){
            var target = $(e.target).attr("href"); 
            switch(target){
                case "#nav-countries":
                    gActiveTab = "country";
                    $("#searchVal").val("");
                    $("#countryDiv").addClass("hide");
                    $("#stateDiv").addClass("hide");
                    $("#dummyDiv").removeClass("hide");
                    break;
                case "#nav-states":
                    gActiveTab = "state";
                    $("#searchVal").val("");
                    $("#countryDiv").removeClass("hide");
                    $("#stateDiv").addClass("hide");
                    $("#dummyDiv").addClass("hide");
                    break;
                case "#nav-cities":
                    gActiveTab = "city";
                    $("#searchVal").val("");
                    $("#countryDiv").addClass("hide");
                    $("#stateDiv").removeClass("hide");
                    $("#dummyDiv").addClass("hide");
                    break;
                case "#nav-barangays":
                    gActiveTab = "barangay";
                    $("#searchVal").val("");
                    $("#countryDiv").addClass("hide");
                    $("#stateDiv").removeClass("hide");
                    $("#dummyDiv").addClass("hide");
                    break;
              default:break;
            } 
        });
    
    };
    
    function displaySelects(){
        $("#countryId").dataBind({
             sqlCode    : "C228" //country_sel
            ,text       : "country_name"
            ,value      : "country_id" 
            ,required   : true
            ,onChange   : function(){ 
                gCountryId = this.val();  
            }
        });
        
        $("#stateId").dataBind({
             sqlCode    : "S230" //states_sel
            ,text       : "state_name"
            ,value      : "state_id" 
            ,required   : true
            ,onChange   : function(){ 
                gStateId = this.val();  
            }
        });
    }
    
    function displayCountries(searchVal){  
        var cb = app.bs({name:"cbFilter1",type:"checkbox"}); 
        $("#gridCountries").dataBind({
             sqlCode        : "C228" //countries_sel
            ,parameters     : {search_val:(searchVal ? searchVal : "")}
            ,height         : $(window).height() - 273 
            ,blankRowsLimit : 5
            ,dataRows   : [
                     {text: cb                                  ,width:25                   ,style:"text-align:left"
                         ,onRender : function(d){
                             return app.bs({name:"country_id"               ,type:"hidden"              ,value: app.svn(d,"country_id")}) 
                                +   bs({name:"is_edited"            ,type:"hidden"              ,value: app.svn(d,"is_edited")})
                                + (d !== null ? app.bs({name:"cb"   ,type:"checkbox"}) : "" );
                         }
                     }
                    ,{text:"Country Code"           ,type:"input"       ,name:"country_code"              ,width:100          ,style:"text-align:left"}
                    ,{text:"Country Name"           ,type:"input"       ,name:"country_name"              ,width:200          ,style:"text-align:left"}
                    ,{text:"Country Sname"          ,type:"input"       ,name:"country_sname"             ,width:250          ,style:"text-align:left"}
                    
                    
                  ]
                  ,onComplete : function(o){
                    var _dRows = o.data.rows;
                    var _this  = this;
        	        var _zRow  = _this.find(".zRow");
        	        if(_dRows.length < 1){
        	            $("#nav-tab").find("[aria-controls='nav-states']").hide();
        	            $("#nav-tab").find("[aria-controls='nav-cities']").hide();
        	            $("#nav-tab").find("[aria-controls='nav-barangays']").hide();
        	        }
        	        _zRow.unbind().click(function(){
        	            var _self=this;
        	            setTimeout(function(){ 
            	            var _i      = $(_self).index();
            	            var _data   = _dRows[_i];
            	            var _countryId  = _data.country_id;
            	            gCountryId = _countryId;
            	            console.log("_countryId",_countryId);
            	            displaySelects();
            	            $("#nav-tab").find("[aria-controls='nav-states']").show();
            	            setTimeout(function(){
            	                $("#countryId").val(_countryId).trigger('change');
            	            }, 200);
                            displayStates(_countryId);

        	            }, 200);
        	        });
        	        _this.on('dragstart', function () {
                        return false;
                    });  
                    $("#cbFilter1").setCheckEvent("#gridCountries input[name='cb']");
                  } 
        });
    } 
    function displayStates(country_id,searchVal){  
        var cb = app.bs({name:"cbFilter2",type:"checkbox"}); 
        $("#gridStates").dataBind({
             sqlCode        : "S230" //states_sel
            ,parameters     : {country_id: country_id,search_val:(searchVal ? searchVal : "")}
            ,height         : $(window).height() - 273 
            ,blankRowsLimit : 5
            ,dataRows   : [
                     {text: cb                                  ,width:25                   ,style:"text-align:left"
                         ,onRender : function(d){
                             return app.bs({name:"state_id"               ,type:"hidden"              ,value: app.svn(d,"state_id")}) 
                                +   bs({name:"is_edited"            ,type:"hidden"              ,value: app.svn(d,"is_edited")})
                                + (d !== null ? app.bs({name:"cb"   ,type:"checkbox"}) : "" );
                         }
                     }
                    ,{text:"State Code"         ,type:"input"       ,name:"state_code"              ,width:100          ,style:"text-align:left"}
                    ,{text:"State Name"         ,type:"input"       ,name:"state_name"              ,width:200          ,style:"text-align:left"}
                    ,{text:"State Sname"                                                            ,width:200          ,style:"text-align:left"
                        ,onRender  :  function(d){ 
                                   return app.bs({name:"state_sname"            ,type:"input"      ,value: app.svn(d,"state_sname")})
                                        + app.bs({name:"country_id"             ,type:"hidden"     ,value: country_id});
                                        
                        }
                    }
                    
                    
                    
                  ]
                  ,onComplete : function(o){
                    var _dRows = o.data.rows;
                    var _this  = this;
        	        var _zRow  = _this.find(".zRow");
        	        if(_dRows.length < 1){
        	            $("#nav-tab").find("[aria-controls='nav-cities']").hide();
        	            $("#nav-tab").find("[aria-controls='nav-barangays']").hide();
        	        }
        	        _zRow.unbind().click(function(){
        	            var _self=this;
        	            setTimeout(function(){ 
            	            var _i      = $(_self).index();
            	            var _data   = _dRows[_i];
            	            var _stateId  = _data.state_id;
            	            gStateId = _stateId;
            	            displaySelects();
            	            $("#nav-tab").find("[aria-controls='nav-cities']").show();
            	            $("#nav-tab").find("[aria-controls='nav-barangays']").show();
            	            setTimeout(function(){
            	                $("#stateId").val(_stateId).trigger('change');
            	            }, 200);
                            displayCities(_stateId);
                            displayBarangays(_stateId);
        	            }, 200);
        	        });
        	        _this.on('dragstart', function () {
                        return false;
                    });
                    $("#cbFilter2").setCheckEvent("#gridStates input[name='cb']");
                  } 
        });
    } 
    function displayCities(state_id,searchVal){  
        var cb = app.bs({name:"cbFilter3",type:"checkbox"}); 
        $("#gridCities").dataBind({
             sqlCode        : "C226" //cities_sel
            ,parameters     : {state_id: state_id,search_val:(searchVal ? searchVal : "")}
            ,height         : $(window).height() - 273 
            ,blankRowsLimit : 5
            ,dataRows   : [
                     {text: cb                                  ,width:25                   ,style:"text-align:left"
                         ,onRender : function(d){
                             return app.bs({name:"city_id"               ,type:"hidden"              ,value: app.svn(d,"city_id")}) 
                                +   bs({name:"is_edited"            ,type:"hidden"              ,value: app.svn(d,"is_edited")})
                                + (d !== null ? app.bs({name:"cb"   ,type:"checkbox"}) : "" );
                         }
                     }
                    ,{text:"City Code"       ,type:"input"       ,name:"city_code"              ,width:100          ,style:"text-align:left"}
                    ,{text:"City Name"       ,type:"input"       ,name:"city_name"              ,width:200          ,style:"text-align:left"}
                    ,{text:"City Sname"                                                         ,width:400          ,style:"text-align:left"
                        ,onRender  :  function(d){ 
                                   return app.bs({name:"city_sname"             ,type:"input"      ,value: app.svn(d,"city_sname")})
                                        + app.bs({name:"state_id"               ,type:"hidden"     ,value: state_id});
                                        
                        }
                    }
                    
                    
                  ]
                  ,onComplete : function(o){
                    $("#cbFilter3").setCheckEvent("#gridCities input[name='cb']");
                  } 
        });
    } 
    function displayBarangays(state_id,searchVal){  
        var cb = app.bs({name:"cbFilter4",type:"checkbox"}); 
        $("#gridBarangays").dataBind({
             sqlCode        : "B232" //barangays_sel
            ,parameters     : {state_id: state_id,search_val:(searchVal ? searchVal : "")}
            ,height         : $(window).height() - 273 
            ,blankRowsLimit : 5
            ,dataRows   : [
                     {text: cb                                  ,width:25                   ,style:"text-align:left"
                         ,onRender : function(d){
                             return app.bs({name:"barangay_id"               ,type:"hidden"              ,value: app.svn(d,"barangay_id")}) 
                                +   bs({name:"is_edited"            ,type:"hidden"              ,value: app.svn(d,"is_edited")})
                                + (d !== null ? app.bs({name:"cb"   ,type:"checkbox"}) : "" );
                         }
                     }
                    ,{text:"Barangay Code"       ,type:"input"       ,name:"barangay_code"              ,width:100          ,style:"text-align:left"}
                    ,{text:"Barangay Name"       ,type:"input"       ,name:"barangay_name"              ,width:200          ,style:"text-align:left"}
                    ,{text:"Barangay SName"                                                             ,width:400          ,style:"text-align:left"
                        ,onRender  :  function(d){ 
                                   return app.bs({name:"barangay_sname"         ,type:"input"      ,value: app.svn(d,"barangay_sname")})
                                        + app.bs({name:"state_id"               ,type:"hidden"     ,value: state_id});
                                        
                        }
                    }
                    
                    
                  ]
                  ,onComplete : function(o){
                    $("#cbFilter4").setCheckEvent("#gridBarangays input[name='cb']");
                  } 
        });
    } 
    
    $("#btnSaveCountries").click(function(){ 
        $("#gridCountries").jsonSubmit({
             procedure: "countries_upd"
           // ,optionalItems: ["is_active"] 
            ,onComplete: function (data) { 
               if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                displayCountries();
            } 
        }); 
    });

    $("#btnSaveStates").click(function(){ 
        $("#gridStates").jsonSubmit({
             procedure: "states_upd"
            //,optionalItems: ["is_active"] 
            ,onComplete: function (data) { 
               if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                displayStates(gCountryId);
            } 
        }); 
    });
    
    $("#btnSaveCities").click(function(){ 
        $("#gridCities").jsonSubmit({
             procedure: "cities_upd"
            //,optionalItems: ["is_active"] 
            ,onComplete: function (data) { 
               if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                displayCities(gStateId);
            } 
        }); 
    });
    $("#btnSaveBarangays").click(function(){ 
        $("#gridBarangays").jsonSubmit({
             procedure: "barangays_upd"
            //,optionalItems: ["is_active"] 
            ,onComplete: function (data) { 
               if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                displayBarangays(gStateId);
            } 
        }); 
    });
    
    $("#btnDeleteCountries").click(function(){
        zsi.form.deleteData({ 
                code:"ref-00013"
               ,onComplete:function(data){
                     displayCountries();
               }
        });
    });
    
    $("#btnDeleteStates").click(function(){
        zsi.form.deleteData({ 
                code:"ref-00016"
               ,onComplete:function(data){
                     displayStates(gCountryId);
               }
        });
    });
    
    $("#btnDeleteCities").click(function(){
        zsi.form.deleteData({ 
                code:"ref-00015"
               ,onComplete:function(data){
                     displayCities(gStateId);
               }
        });
    });
    $("#btnDeleteBarangays").click(function(){
        zsi.form.deleteData({ 
                code:"ref-00014"
               ,onComplete:function(data){
                     displayBarangays(gStateId);
               }
        });
    });
    
    $("#btnFilterCountry").click(function(){ 
        displayStates(gCountryId);
    });
    
    $("#btnFilterState").click(function(){ 
        displayCities(gStateId);
        displayBarangays(gStateId);
    });
    
    $("#btnSearchVal").click(function(){ 
        var _searchVal = $.trim($("#searchVal").val()); 
        if(gActiveTab === "country") displayCountries(_searchVal);
        else if(gActiveTab === "state") displayStates(gCountryId,_searchVal);
        else if(gActiveTab === "city") displayCities(gStateId,_searchVal);
        else displayBarangays(gStateId,_searchVal);
        console.log("sadsadas")
        
    }); 
   $("#searchVal").on('keypress',function(e){
        var _searchVal = $.trim($("#searchVal").val()); 
        if(e.which == 13) {
            if(gActiveTab === "country") displayCountries(_searchVal);
            else if(gActiveTab === "state") displayStates(gCountryId,_searchVal);
            else if(gActiveTab === "city") displayCities(gStateId,_searchVal);
            else displayBarangays(gStateId,_searchVal);
        }
    });

    $("#searchVal").keyup(function(){
        if($(this).val() === "") {
            if(gActiveTab === "country") displayCountries();
            else if(gActiveTab === "state") displayStates(gCountryId);
            else if(gActiveTab === "city") displayCities(gStateId);
            else displayBarangays(gStateId);
        }
    });
    
    $("#btnResetVal").click(function(){
        $("#searchVal").val("");
        if(gActiveTab === "country") displayCountries();
        else if(gActiveTab === "state") displayStates(gCountryId);
        else if(gActiveTab === "city") displayCities(gStateId);
        else displayBarangays(gStateId);
        $("#nav-tab").find("[aria-controls='nav-assets']").hide();
    });
})();        