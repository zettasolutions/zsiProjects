if(typeof zsi==='undefined') zsi={};
zsi.htmlFastWriter = function(p_target){
    var _self = this;
    this.templates = [];
    this.lastObj;
    var _write = function(h){
        if(_self.lastObj)
            _self.lastObj.append(h);  
        else 
            _self.lastObj = $(h);
    };
    
    //loadLocalTemplates
    $.each($("#hbTemplates").find(".item"),function(){
            var _o = $(this);
            var _ctrl = {
                 name       : _o.attr("name")        
                ,html       : _o.html()
                ,template   : Handlebars.compile(_o.html())
            };
            _self.templates.push(_ctrl);
            _self[_o.attr("name")] = function(data){
                var _r =  _ctrl.template(data)
                          .replace(/(\w+\s?=\s?\"\")|(\w+\s?=\s?\'\')/g,"") //replace empty values
                          .replace(/(\n)/g,""); //replace lines
                _write(_r);
                return this;
            };
    });
    
    //load URL Templates
    this.loadUrlTemplates  =   function(o){
        if(o.onComplete) o.onComplete();
    };

    return this;
};  

 
	
   