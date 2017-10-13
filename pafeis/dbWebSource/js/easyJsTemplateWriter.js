if(typeof zsi==='undefined') zsi={};
zsi.easyJsTemplateWriter = function(sn){
    //sn="selectorName"
    var _tmp    = "tmpHtml"
        ,_$b     = $("body")
        ,_isTmp  = false
        ,_lastTarget = null 
    ;
    
    if(!sn) { 
        _isTmp  = true;
        sn      = "#" + _tmp;
        if(_$b.find(sn).length === 0) _$b.append("<div id='" + _tmp + "'/>");
    }
    var _self = this;
    this.target  = $(sn);
    var _$lt = $("#localTemplates");
    if(_self.target.length===0) {console.error("selector name not found.");return;}
    
    this.templates = [];
    this.lastObj;
    this.html = function(){
        return $(sn).html();
    };
    this.in = function(){
        _lastTarget  = _self.target;
        _self.target = _self.lastObj;
        return _self;
    };
    this.out = function(){
        _self.target = _lastTarget;
        return _self;
    };

    if(_isTmp){
        this.new = function(){
            var _$sn= $(sn);
            _$sn.empty();
            _self.target = _$sn;
            _self.lastObj = null;
            return _self;
        };
    }
    
    var _isLocalStorageSupport = function(){
        if(typeof(Storage) !== "undefined") return true; else return false;
    }
    ,_write = function(o){
        var _new = $(o.html);
        if(_self.lastObj){
            if(o.parent) _self.target = $(o.parent);   
        }else 
            _self.lastObj = _new;
            
        _self.target.append(_new);  
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

 
	
            