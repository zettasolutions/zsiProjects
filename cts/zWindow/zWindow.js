/*MIT License

Copyright (c) 2018 Vincent L. Solon

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.*/

zsi.__zDrag = {
    "drag"              : false
    ,"self"             : null
    ,"selfStyle"        : null
    ,"dragLimit"        : {}
    ,"subtrahend"       : {}
    ,"width"            : 0
    ,"height"           : 0
};

zsi.__zResize = {
    "resize"        : false
    ,"self"         : null
    ,"selfStyle"    : null
    ,"resizeLimit"  : {}
};

$.fn.zResize = function(option) {
    if (this.length) {
        if (this[0].zResizeInit) return this;
        
        // Default initialization
		var _default = [{
		    "limitResize" : true
			,"minWidth" : 100
			,"minHeight" : 100
		}];
		
		// Merge the default options and user options
		var _settings   = $.extend( true , _default , option )[0];
        
        var _$self      = this
            ,_self      = _$self[0]
            ,_selfStyle = _self.style
            
            ,_parent    = _$self.parent()[0]
            ,_parentCompStyle = window.getComputedStyle(_parent)
            
            ,_noResize  = false
            ,_zResize   = zsi.__zResize
        ;
        
        _$self.append(
            '<div class="resizer resizer-h top left right" resize="top"></div>'
            + '<div class="resizer resizer-h bottom left right" resize="bottom"></div>'
            + '<div class="resizer resizer-w left top bottom" resize="left"></div>'
            + '<div class="resizer resizer-w right top bottom" resize="right"></div>'
            + '<div class="resizer resizer-wha top right" resize="top-right"></div>'
            + '<div class="resizer resizer-wha bottom left" resize="bottom-left"></div>'
            + '<div class="resizer resizer-whb top left" resize="top-left"></div>'
            + '<div class="resizer resizer-whb bottom right" resize="bottom-right"></div>'
        );
        
        _self.setAttribute("zresize", true);
        
        // RESIZE SECTION
        _$self.find(".resizer").mousedown(function(e) {
            _noResize = (_$self.attr("zresize") === "true" ? false : true );
            if (_noResize) return false;
            
            var _selfPos        = _selfStyle.position;
            _zResize.self        = _self;
            _zResize.selfStyle   = _selfStyle;
            
            _zResize.resizer     = e.target.attributes.resize.value;
            _zResize.pageX       = e.pageX;
            _zResize.pageY       = e.pageY;
            _zResize.top         = _self.offsetTop - (_selfPos === "relative" ? parseInt(_parentCompStyle["padding-top"].replace(/px/i,"")) : 0);
            _zResize.left        = _self.offsetLeft - (_selfPos === "relative" ? parseInt(_parentCompStyle["padding-left"].replace(/px/i,"")) : 0);
            _zResize.width       = _self.offsetWidth;
            _zResize.height      = _self.offsetHeight;
            
            _zResize.resizeLimit = {
                "status"        : (_settings.limitResize === true ? true : false)
                ,"bottom"       : ( _selfPos === "fixed" ? window.innerHeight : _parent.scrollHeight )
                ,"right"        : ( _selfPos === "fixed" ? window.innerWidth : _parent.scrollWidth )
                ,"width"        : _settings.minWidth
                ,"height"       : _settings.minHeight
                ,"minLeft"      : ((_zResize.left + _zResize.width) - _settings.minWidth) + "px"
                ,"maxLWidth"    : (_zResize.left + _zResize.width) + "px"
                ,"minTop"       : ((_zResize.top + _zResize.height) - _settings.minHeight) + "px"
                ,"maxTHeight"   : (_zResize.top + _zResize.height) + "px"
            };
            
            // To prevent NaN
            _zResize.resizeLimit.maxRWidth = (_zResize.resizeLimit.right - _zResize.left) + "px";
            _zResize.resizeLimit.maxBHeight = (_zResize.resizeLimit.bottom - _zResize.top) + "px";
            
            _zResize.resize = true;
            _self.className += " active";
            
            if (typeof _self.onResizeStart === "function") {
                _self.onResizeStart();
            }
            
            // Prevent browser mouse down/up bug
            e.preventDefault();
            return false;
        });
        
        _self.zResizeInit = true;
        return _$self;
    }
};

$.fn.zDrag = function(option) {
    if (this.length) {
        if (this[0].zDragInit) return this;
        
        // Default initialization
    	var _default = [{
    		"position" : "absolute" // "absolute" || "fixed"
    		,"target" : this // "any children jquery node"
    		,"limitDrag" : true
    	}];
    	
    	// Merge the default options and user options
		var _settings = $.extend( true , _default , option )[0];
		
		var _$self              = this
		    ,_self              = _$self[0]
            ,_selfStyle         = _self.style
            
            ,_parent            = _$self.parent()[0]
            
            ,_noDrag            = false
            ,_zDrag             = zsi.__zDrag
        ;
        
        _selfStyle.position = _settings.position;
        _self.setAttribute("zdrag", true);
        
        // DRAG SECTION
        _settings.target.mousedown(function(e) {
            _noDrag = (_$self.attr("zdrag") === "true" ? false : true );
            if (_noDrag) return false;
            
            var _selfPos        = _selfStyle.position;
            _zDrag.self         = _self;
            _zDrag.selfStyle    = _selfStyle;
            
            _zDrag.subtrahend = {
                "y" : ( _selfPos === "absolute" ? (e.pageY + _parent.scrollTop) - _self.offsetTop : e.offsetY )
                , "x" : ( _selfPos === "absolute" ? (e.pageX + _parent.scrollLeft) - _self.offsetLeft : e.offsetX )
            };
            
            if (_settings.limitDrag === true) {
                _zDrag.dragLimit = {
                    "status" : true
                    ,"bottom" : ( _selfPos === "fixed" ? window.innerHeight : _parent.scrollHeight )
                    ,"right" : ( _selfPos === "fixed" ? window.innerWidth : _parent.scrollWidth )
                };
                
                _zDrag.height = _self.offsetHeight;
                _zDrag.width = _self.offsetWidth;
            } else {
                _zDrag.parent = _parent;
            }
            
            _zDrag.drag = true;
            _self.className += " active";
            
            if (typeof _self.onDragStart === "function") {
                _self.onDragStart();
            }
            
            // Prevent browser mouse down/up bug
            e.preventDefault();
            return false;
        });
        
        _self.zDragInit = true;
        return _$self;
    }
};

window.onmousemove = function(e) {
    var _objDrag = zsi.__zDrag;
    var _objResize = zsi.__zResize;
    
    if (_objDrag.drag) {
        var _self        = _objDrag.self
            ,_selfStyle  = _objDrag.selfStyle
            ,_subtrahend = _objDrag.subtrahend
            ,_dragLimit  = _objDrag.dragLimit
            ,_minuendY
            ,_minuendX
        ;
        
        if (_selfStyle.position === "absolute") {
            _minuendY = e.pageY;
            _minuendX = e.pageX;
        } else {
            _minuendY = e.clientY;
            _minuendX = e.clientX;
        }
        
        if (_dragLimit.status === true) {
            var _dlBottom     = _dragLimit.bottom
                ,_dlRight      = _dragLimit.right
                ,_width        = _objDrag.width
                ,_height       = _objDrag.height
                ,_currentY     = _minuendY - _subtrahend.y
                ,_currentX     = _minuendX - _subtrahend.x
                ,_newY         = 0
                ,_newX         = 0
            ;
            
            if (_dlBottom < _currentY + _height) { _newY = _dlBottom - _height; }
            else { _newY = _currentY; }
            
            if (_dlRight < _currentX + _width) { _newX = _dlRight - _width; }
            else { _newX = _currentX; }
            
            _selfStyle.top = ( _currentY > 0 || _newY > 0 ? _newY + "px" : "0px" );
            _selfStyle.left = ( _currentX > 0 || _newX > 0 ? _newX + "px" : "0px" );
        } else {
            var _parent = _objDrag.parent;
            _selfStyle.top   = (_minuendY + _parent.scrollTop) - _subtrahend.y + "px";
            _selfStyle.left  = (_minuendX + _parent.scrollLeft) - _subtrahend.x + "px";
        }
        
        if (typeof _self.onDrag === "function") {
            _self.onDrag();
        }
        
        return false;
    }
    
    if (_objResize.resize) {
        var _self           = _objResize.self
            ,_selfStyle     = _objResize.selfStyle
            ,_resizeLimit   = _objResize.resizeLimit
            ,_rlWidth       = _resizeLimit.width
            ,_rlHeight      = _resizeLimit.height
            ,_rlRight       = _resizeLimit.right
            ,_rlBottom      = _resizeLimit.bottom
            ,_rlStatus      = _resizeLimit.status
            
            ,_resizer       = _objResize.resizer
            ,_lastPageX     = _objResize.pageX
            ,_lastPageY     = _objResize.pageY
            ,_lastTop       = _objResize.top
            ,_lastLeft      = _objResize.left
            ,_lastWidth     = _objResize.width
            ,_lastHeight    = _objResize.height
            
            ,_pageX         = e.pageX
            ,_pageY         = e.pageY
            ,_newWidth      = 0
            ,_newHeight     = 0
            ,_pageXA        = _lastPageX - _pageX
            ,_pageXB        = _pageX - _lastPageX
            ,_pageYA        = _lastPageY - _pageY
            ,_pageYB        = _pageY - _lastPageY
        ;
        
        if (_resizer === "left" || _resizer === "top-left" || _resizer === "bottom-left")
        {
            _newWidth = (_pageX > _lastPageX ? _lastWidth + _pageXA : _lastWidth - _pageXB);
            
            var _offsetX = _lastLeft - _pageXA
                ,_evalA = _newWidth > _rlWidth
                ,_evalB = (_rlStatus ? _offsetX > 0 : true)
            ;
            
            if (_evalA && _evalB) {
                _selfStyle.width = _newWidth + "px";
                _selfStyle.left = _offsetX + "px";
            } else if ( ( !_evalA ) && _evalB ) {
                _selfStyle.width = _rlWidth + "px";
                _selfStyle.left = _resizeLimit.minLeft;
            } else if ( _evalA && ( !_evalB ) ) {
                _selfStyle.width = _resizeLimit.maxLWidth;
                _selfStyle.left = "0px";
            }
        }
        
        if (_resizer === "right" || _resizer === "bottom-right" || _resizer === "top-right")
        {
            _newWidth = (_pageX > _lastPageX ? _lastWidth + _pageXB : _lastWidth - _pageXA);
            
            var _evalA = _newWidth > _rlWidth
                ,_evalB = (_rlStatus ? _rlRight > _newWidth + _lastLeft : true)
            ;
            
            if (_evalA && _evalB) {
                _selfStyle.width = _newWidth + "px";
            } else if ( ( !_evalA ) && _evalB ) {
                _selfStyle.width = _rlWidth + "px";
            } else if ( _evalA && ( !_evalB ) ) {
                _selfStyle.width = _resizeLimit.maxRWidth;
            }
        }
        
        if (_resizer === "top" || _resizer === "top-left" || _resizer === "top-right")
        {
            _newHeight = (_pageY > _lastPageY ? _lastHeight + _pageYA : _lastHeight - _pageYB);
            
            var _offsetY = _lastTop - _pageYA
                ,_evalA = _newHeight > _rlHeight
                ,_evalB = (_rlStatus ? _offsetY > 0 : true)
            ;
            
            if (_evalA && _evalB) {
                _selfStyle.height = _newHeight + "px";
                _selfStyle.top = _offsetY + "px";
            } else if ( ( !_evalA ) && _evalB ) {
                _selfStyle.height = _rlHeight + "px";
                _selfStyle.top = _resizeLimit.minTop;
            } else if ( _evalA && ( !_evalB ) ) {
                _selfStyle.height = _resizeLimit.maxTHeight;
                _selfStyle.top = "0px";
            }
        }
        
        if (_resizer === "bottom" || _resizer === "bottom-left" || _resizer === "bottom-right")
        {
            _newHeight = (_pageY > _lastPageY ? _lastHeight + _pageYB : _lastHeight - _pageYA);
            
            var _evalA = _newHeight > _rlHeight
                ,_evalB = (_rlStatus ? _rlBottom > _newHeight + _lastTop : true )
            ;
            
            if (_evalA && _evalB) {
                _selfStyle.height = _newHeight + "px";
            } else if ( ( !_evalA ) && _evalB ) {
                _selfStyle.height = _rlHeight + "px";
            } else if ( _evalA && ( !_evalB ) ) {
                _selfStyle.height = _resizeLimit.maxBHeight;
            }
        }
        
        if (typeof _self.onResize === "function") {
            _self.onResize();
        }
        
        return false;
    }
};

window.onmouseup = function(e) {
    var _objDrag    = zsi.__zDrag
        ,_objResize = zsi.__zResize
        ,_resize    = _objResize.resize
        ,_drag      = _objDrag.drag
    ;
    
    if (_drag || _resize) {
        var _self = (_drag ? _objDrag.self : _objResize.self);
        
        $(".last-active, .active").removeClass("last-active active");
        _self.className = _self.className.replace(/ active/gi,"") + " last-active";
        
        if (_drag && typeof _self.onDragEnd === "function") {
            _self.onDragEnd();
        }
        
        if (_resize && typeof _self.onResizeEnd === "function") {
            _self.onResizeEnd();
        }
        
        _objDrag.drag = false;
        _objResize.resize = false;
        return false;
    }
};

$.fn.zWindow = function(option) {
    if (this.length) {
        // Default initialization
		var _default    = [{
		    "position" : "absolute" // "absolute" || "fixed"
    		,"limitDrag" : true
    		,"limitResize" : true
			,"minWidth" : 200
			,"minHeight" : 100
			,"width" : 200
			,"height" : 200
			,"header" : ""
			,"body" : ""
		}];
		
		// Merge the default options and user options
		var _settings   = $.extend( true , _default , option )[0];
        
        var _$self      = this
            ,_self      = _$self[0]
            
            ,_$zWindow
            ,_zWindow
            ,_zWindowStyle
            
            ,_storage   = {}
        ;
        
        _$self.append(
            '<div id="' + _settings.id + '" class="zWindow" style="width:'+_settings.width+'px;height:'+_settings.height+'px;">'
            +   '<div class="zw-header">'
            +       '<div class="zw-title">' + _settings.header + '</div>'
            +       '<div class="zw-toolbar">'
            //+           '<div class="zw-button zw-pin"><svg viewBox="0 0 384 512"><path d="M298.028 214.267L285.793 96H328c13.255 0 24-10.745 24-24V24c0-13.255-10.745-24-24-24H56C42.745 0 32 10.745 32 24v48c0 13.255 10.745 24 24 24h42.207L85.972 214.267C37.465 236.82 0 277.261 0 328c0 13.255 10.745 24 24 24h136v104.007c0 1.242.289 2.467.845 3.578l24 48c2.941 5.882 11.364 5.893 14.311 0l24-48a8.008 8.008 0 0 0 .845-3.578V352h136c13.255 0 24-10.745 24-24-.001-51.183-37.983-91.42-85.973-113.733z"/></svg></div>'
            //+           '<div class="zw-button zw-unpin"><svg viewBox="0 0 384 512" style="transform:rotateZ(-45deg);"><path d="M298.028 214.267L285.793 96H328c13.255 0 24-10.745 24-24V24c0-13.255-10.745-24-24-24H56C42.745 0 32 10.745 32 24v48c0 13.255 10.745 24 24 24h42.207L85.972 214.267C37.465 236.82 0 277.261 0 328c0 13.255 10.745 24 24 24h136v104.007c0 1.242.289 2.467.845 3.578l24 48c2.941 5.882 11.364 5.893 14.311 0l24-48a8.008 8.008 0 0 0 .845-3.578V352h136c13.255 0 24-10.745 24-24-.001-51.183-37.983-91.42-85.973-113.733z"/></svg></div>'
            +           '<div class="zw-button zw-max"><svg viewBox="0 0 512 512" style="top:4px;left:4px;right:4px;"><path d="M464 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm0 394c0 3.3-2.7 6-6 6H54c-3.3 0-6-2.7-6-6V192h416v234z"/></svg></div>'
            +           '<div class="zw-button zw-restore"><svg viewBox="0 0 512 512" style="top:4px;left:4px;right:4px;"><path d="M464 0H144c-26.5 0-48 21.5-48 48v48H48c-26.5 0-48 21.5-48 48v320c0 26.5 21.5 48 48 48h320c26.5 0 48-21.5 48-48v-48h48c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48zm-96 464H48V256h320v208zm96-96h-48V144c0-26.5-21.5-48-48-48H144V48h320v320z"/></svg></div>'
            +           '<div class="zw-button zw-close"><svg viewBox="0 0 352 512" style="top:3px;left:5px;right:5px;"><path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"/></svg></div>'
            +       '</div>'
            +   '</div>'
            +   '<div class="zw-body">' + _settings.body + '</div>'
            +'</div>'
        );
        
        _$zWindow = $("#" + _settings.id)
                        .zDrag([{
                            "position" : _settings.position
                            ,"target" : $("#" + _settings.id + " > .zw-header > .zw-title")
                            ,"limitDrag" : _settings.limitDrag
                        }])
                        .zResize([{
                            "position" : _settings.position
                            ,"limitResize" : _settings.limitResize
                            ,"minWidth" : _settings.minWidth
                            ,"minHeight" : _settings.minHeight
                        }]);
        _zWindow = _$zWindow[0];
        _zWindowStyle = _zWindow.style;
        
        // TOOLBAR SECTION
        _$zWindow.find(".zw-button").click(function(e) {
            switch (this.className.replace(/zw-button /gi,"")) {
                case "zw-max" : {
                    store("maxed");
                    //_zWindowStyle.position = (_settings.maximizeTo === "body" ? "fixed" : "absolute" );
                    break;
                }
                case "zw-restore" : {
                    restore("maxed");
                    break;
                }
                case "zw-close" : {
                    _$zWindow.remove();
                    break;
                }
            }
            
            function store(type) {
                _storage = {
                    "top" : _zWindowStyle.top
                    ,"left" : _zWindowStyle.left
                    ,"width" : _zWindowStyle.width
                    ,"height" : _zWindowStyle.height
                    //,"position" : _zWindowStyle.position
                };
                
                _zWindow.setAttribute("zdrag", false);
                _zWindow.setAttribute("zresize", false);
                _$zWindow.addClass(type);
            }
            
            function restore(type) {
                _zWindowStyle.top = _storage.top;
                _zWindowStyle.left = _storage.left;
                _zWindowStyle.width = _storage.width;
                _zWindowStyle.height = _storage.height;
                //_zWindowStyle.position = _storage.position;
                
                _zWindow.setAttribute("zdrag", true);
                _zWindow.setAttribute("zresize", true);
                _$zWindow.removeClass(type);
            }
        });
        
        return _$zWindow;
    }
};