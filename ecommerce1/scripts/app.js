$(document).ready(function(){
    $("#flip").click(function(){
      $("#panel").slideToggle("slow");
    });
    $(".color-selection,.size-selection,.item-thumbnails").setClickSelectionEvent();
    $(".ratings").setClickRatingsEvent();
    $(".btn-quantity").setPlusMinusEvent();

    $(".price-range").setPriceEvent();
});

$.fn.setPriceEvent = function(o){
  var _$self = this;
  _$self.isMouseDown = false;
  _$self.currentKnowb = null;
  _$self.grayRange = $(".gray-range");
  _$self.colorRange = $(".color-range");
  _$self.lowerBound = $(".lbound");
  _$self.upperBound = $(".ubound");
  _$self.offsetLeft =_$self.offset().left;
  _$self.knobOffsetLeft = 0; 
  this.find(".knob").unbind("mousedown").on('mousedown', function (e) {    
      _$self.isMouseDown =true;
      _$self.currentKnowb = $(e.target);    
  });
  
  this.unbind('mousemove').on('mousemove', function (e) {
    if( ! _$self.isMouseDown) return this;
      var _offsetLeft =  _$self.offset().left + 8;
      
      if( e.clientX > _$self.grayRange.offset().left ){ 
        var remainingVal =  parseInt(_$self.grayRange.css("width"))  -  parseInt($(e.target).css("left"));
        if(remainingVal > 0 )  _$self.currentKnowb.css({left:e.clientX -  _offsetLeft  });
      }
      if( $(e.target).hasClass("l-knob" )){ 
        var _colorRangeL1,_colorRangeL2;
        var _colorRangeWidth = parseInt( _$self.colorRange.css("width") );  
        _colorRangeL1= parseInt( _$self.colorRange.css("left") );
        _$self.colorRange.css({left:  parseInt( $(e.target).css("left")) + 8 })
        _colorRangeL2 = parseInt( _$self.colorRange.css("left") );
        _$self.colorRange.css({width:  _colorRangeWidth + (_colorRangeL1 - _colorRangeL2) })

        _$self.lowerBound.html( parseInt( $(e.target).css("left")) + 8  );
      }
  
      if( $(e.target).hasClass("r-knob" )){ 
        _$self.colorRange.css({width:  parseInt($(e.target).css("left")) - parseInt( _$self.find(".l-knob").css("left"))      })

        _$self.upperBound.html( parseInt( $(e.target).css("left")) + 8  );
      }    

  }).unbind('mouseup').on('mouseup', function (e) {
    _$self.isMouseDown = false;
  });    
 
};

$.fn.setPlusMinusEvent = function(){
  this.setVoidZero();
  this.each(function(){
    var _$self = $(this);
    var _$qty = _$self.find("#txtquantity");
    _$self.find("#btn-minus").click(function(){
      var _val = parseInt(_$qty.val());
      if(_val > 1) _$qty.val(  parseInt(_$qty.val()) -  1);
    });
    _$self.find("#btn-plus").click(function(){
      var _val = parseInt(isNaN(_$qty.val()) ? 0 : _$qty.val() );
      _$qty.val(  _val +  1);
    });        
  });
}

$.fn.setClickRatingsEvent = function(){
  this.setVoidZero();
  this.each(function(){
      var _items = $(this).find(".item");
      _items.click(function(event){
        var _index = $(event.target).index() + 1;
        _items.removeClass("active");
        for(var x = 0 ; x < _index;x++ ){
            $(_items.get(x)).addClass("active");
        }
      });
  })
}

$.fn.setClickSelectionEvent=function(){  
  this.setVoidZero();
  this.each(function(){
    var _self = $(this);
    _self.find(".item").click(function(event){
      _self.find(".item").removeClass("active");
      $(this).addClass("active");
    });
  });
}

$.fn.setVoidZero= function(){
  this.find("a").attr("href","javascript:void(0);");
}
