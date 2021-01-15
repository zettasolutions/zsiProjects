if(typeof zsi==='undefined') zsi={};
zsi.easyJsTemplateWriter = (function(sn){
    //sn="selectorName"
    if(!sn) sn = $("<div/>");  
    var _self           = this
        ,_pTemplates    = localStorage.getItem("publicTemplates")
        ,_$localTmpl    = $("[id='localTemplates'],[name='localTemplates']")
    ;
    
    if(typeof ___etwTemplates == 'undefined') ___etwTemplates = [];
    this.target  = (typeof sn ==="string" ? $(sn) : sn); 
    if(_self.target.length===0) {console.error("selector name not found.");return;}
    this.lastObj=this.target;
    
    _replaceTagElements = function ($o){
        var _r = $o;
        var _cls = $o.attr("class");
        if(_cls && _cls.indexOf("tag-") > -1 ){
            var _attrs =  $o.get(0).attributes;
            $o.replaceWith(function(){
                var _tag = _cls.match(/tag-(\w+)/g,"")[0].substr(4);
                _r =  $("<" + _tag + "/>", {html: $(this).removeClass("tag-" + _tag).html() });
                var _newAttrs =  {};
                for(var j=0; j<_attrs.length; j+=1){
                    var _attr = _attrs[j];
                    if(_attr.nodeName,_attr.nodeName !=="=\"\"") _newAttrs[_attr.nodeName]=_attr.nodeValue;
                }
                _r.attr( _newAttrs);
                return _r;
    
            });
        }
        return _r;
    };

    this.html = function(isNoEmpty){
        var _$o = $(sn);
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

    this.custom = function(fn){
        this.__fn = fn;
        this.__fn();
        return this;
    };
    
    var _isLocalStorageSupport = function(){
        if(typeof(Storage) !== "undefined") return true; else return false;
    }
    ,_write = function(o){
        o.html = o.html.replace(/srcx/g,"src"); //replace temporary attribute
        var _new = $(o.html);
        //replace tag-li, and other tag-table elements
        _new = _replaceTagElements(_new);
        if(o.parent){
            _self.target = (typeof o.parent === "string" ? $(o.parent) : sn);  
        }
        _self.target.append(_new);  
        _self.lastObj = _new;
    }
    ,_loadTemplates = function(jObject){
        $.each(jObject,function(){
            $.each($(this).children(),function(){
                    var _o = $(this);
                    var _name =  _o.attr("name");
                    var _ctrl = {
                         name       :   _name 
                        ,html       : _o.html()
                        ,template   : Handlebars.compile(_o.html())
                    };
                    if ( ___etwTemplates.filter(function(x){ x.name ===_name}).length === 0)  ___etwTemplates.push(_ctrl);
            });
        });
    };
    
    _loadTemplates($(_pTemplates));
    if(_$localTmpl.length > 0 ){
        _loadTemplates(_$localTmpl);
        _$localTmpl.remove();

    }
    ___etwTemplates.forEach(function(v,i){
            _self[v.name] = function(){
                var a = arguments;
                var _r =  v.template(a[0])
                          .replace(/(\w+\s?=\s?\"\")|(\w+\s?=\s?\'\')/g,"") //replace empty values
                          .replace(/(\n)/g,""); //replace lines
                var _o = {html:_r};
                if (a[1]) _o.parent=a[1];
                _write(_o);
                return this;
            };        
        
    });
    
    return this;
});  
               