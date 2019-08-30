(function() {
    'use strict';
    
    document.addEventListener('click', function(e) {
        var _target = e.target,
            _zformClass,
            _input
        ;
        
        if (!_target) return;
        _target = _target.closest('div.zform-group');
        if (!_target || !_target.matches('div.zform-group')) return;
        
        _zformClass = _target.classList;
        _zformClass.add('active');
        _zformClass.add('focused');
        
        _input = _target.querySelector('input,select,textarea');
        _input.focus();
        
        if (_input.getAttribute('zinit') === null) {
            _input.setAttribute('zinit','true');
            
            _input.removeEventListener('blur',function(){},false);
            _input.addEventListener('blur', function() {
                var __classList = this.parentNode.classList;
                
                if (this.value === '') __classList.remove('active');
                __classList.remove('focused');
            }, false);
        }
            
        e.preventDefault();
    }, false);
    
    document.addEventListener('keyup', function(e) {
        if (e.keyCode === 9) {
            var _input = document.querySelector("input:focus,select:focus,textarea:focus"),
                _zform,
                _zformClass
            ;
            
            if (!_input) return;
            _zform = _input.closest('div.zform-group');
            if (!_zform || !_zform.matches('div.zform-group')) return;
            
            _zformClass = _zform.classList;
            _zformClass.add('active');
            _zformClass.add('focused');
            
            _input.focus();
            
            if (_input.getAttribute('zinit') === null) {
                _input.setAttribute('zinit','true');
                
                _input.removeEventListener('blur',function(){},false);
                _input.addEventListener('blur', function() {
                    var __classList = this.parentNode.classList;
                    
                    if (this.value === '') __classList.remove('active');
                    __classList.remove('focused');
                }, false);
            }
        }
    }, false);
    
    var nodes = document.querySelectorAll('div.zform-group input,div.zform-group select,div.zform-group textarea');
    for (var i = 0, length = nodes.length; i < length; i++) {
        var _node = nodes[i];
        if (_node.value !== '') _node.parentNode.classList.add('active');
    }
})();