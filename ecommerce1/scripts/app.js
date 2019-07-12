$(document).ready(function(){
    $("#flip").click(function(){
      $("#panel").slideToggle("slow");
    });
    $(".color-selection,.size-selection,.item-thumbnails").setClickSelectionEvent();
    $(".ratings").setClickRatingsEvent();
    $(".btn-quantity").setPlusMinusEvent();
});

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
