if(typeof zsi==='undefined') zsi={};
zsi.easyJsTemplateWriter = function(sn){
    //sn="selectorName"
    if(!sn) sn = $("<div/>"); 
    var _self = this;
    this.target  = $(sn);
    var _$lt = $("#localTemplates");
    if(_self.target.length===0) {console.error("selector name not found.");return;}
    
    this.templates = [];
    this.lastObj;
    
    _replaceTagElements = function ($o){
        console.log($o);
        $o.find("[class^='tag-']").replaceWith(function(){
            var _cls = $(this).attr("class");
            var _tag = _cls.match(/tag-(\w+)/g,"")[0].substr(4);
            return $("<" + _tag + "/>", {html: $(this).html()})
                .attr("class",_cls)
                .attr("style",$(this).attr("style"))
                .removeClass("tag-" + _tag) ;
        });        
    };
    
    this.html = function(isNoEmpty){
        var _$o = $(sn);
        //replace tag-li, and other tag-table elements
        _replaceTagElements(_$o);
        var _r =_$o.html();
        if( ! isNoEmpty) _$o.empty(); 
        return _r;
    };
    this.in = function(){
        _self.target = _self.lastObj;
        return this;
    };
    this.out = function(){
        _self.target = _self.target.parent();
        return this;
    };
    this.new = function(){
        var _$sn= $(sn);
        _$sn.empty();
        _self.target = _$sn;
        _self.lastObj = null;
        return this;
    };
    
    var _isLocalStorageSupport = function(){
        if(typeof(Storage) !== "undefined") return true; else return false;
    }
    ,_write = function(o){
        var _new = $(o.html);
        if(o.parent){
            self.target = $(o.parent);   
        }
        _self.target.append(_new);  
        _self.lastObj = _new;
        
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

    return this;
};  

 
	
                    