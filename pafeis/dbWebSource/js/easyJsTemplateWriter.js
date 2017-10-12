if(typeof zsi==='undefined') zsi={};
zsi.easyJsTemplateWriter = function(sn){
    //sn="selectorName"
    if(!sn) { 
        console.error("selector name is required.");
        return;
    }
    var _self = this;
    var _target  = $(sn);
    var _$lt = $("#localTemplates");
    if(_target.length===0) {console.error("selector name not found.");return;}
    
    this.templates = [];
    this.lastObj;
    
    var _isLocalStorageSupport = function(){
        if(typeof(Storage) !== "undefined") return true; else return false;
    }
    ,_write = function(o){
        if(_self.lastObj){
            if(o.parent) _target = $(o.parent);   
        }else 
            _self.lastObj = $(o.html);
            
        _target.append(o.html);  
    }
    ,_loadTemplates = function(jObject){
        $.each(jObject.find("li"),function(){
                var _o = $(this);
                var _ctrl = {
                     name       : _o.attr("name")        
                    ,html       : _o.html()
                    ,template   : Handlebars.compile(_o.html())
                };
                _self.templates.push(_ctrl);
                _self[_o.attr("name")] = function(){
                    var a = arguments;
                    var _r =  _ctrl.template(a[0])
                              .replace(/(\w+\s?=\s?\"\")|(\w+\s?=\s?\'\')/g,"") //replace empty values
                              .replace(/(\n)/g,""); //replace lines
                    var _o = {html:_r};
                    if (a[1]) _o.parent=a[1];
                    _write(_o);
                    return this;
                };
        });        
        
    };
    
    if( _isLocalStorageSupport() ) _loadTemplates($(localStorage.getItem("publicTemplates")));
    if(_$lt.length > 0) _loadTemplates(_$lt);

    //if(o.onReady){ this.onReady = o.onReady; this.onReady();} 

    return this;
};  

 
	
       