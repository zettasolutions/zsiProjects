$(document).ready(function(){ // on document ready

    // onload - randomizing photos
    $('#gallery div').each(function() { 
        var iRL = Math.floor(Math.random() * 500);
        var iRT = Math.floor(Math.random() * 350);
        var iMT = Math.floor(Math.random() * 100 - 50);
        $(this).animate({
            left: iRL, 
            top: iRT, 
            rotate: iMT + 'deg',
        }, 2000); 
    }); 

    var bPrevClick = false; // preventing clicking will solve problem with fancybox
    $('#gallery div').draggable({ // making photos draggable
        containment: 'parent',
        start: function(e,ui) {
            bPrevClick = true;
        },
        stop: function(e, ui) {
            setTimeout(function() {
                bPrevClick = false;
            }, 50);
        }
    });
    $('#gallery div a').bind('click',function(e) {
        if (bPrevClick) {
            e.preventDefault();
            e.stopImmediatePropagation();
        }
    });

    $('#gallery div').mousedown(function(e) { // on mouse down
        var iMZ = 0;
        $('#gallery div').each(function() { // searching for max zIndex
            var z = parseInt($(this).css('zIndex'))
            iMZ = (z > iMZ) ? z : iMZ;
        });
        $(e.target).closest('#gallery div').css({ // we will UP actice image
            zIndex: iMZ + 1
        });
    });

    $('a.fancybox').fancybox({ // fancybox initizlization
        zoomSpeedIn: 500, // zoom IN speed
        zoomSpeedOut: 500, // zoom OUT speed
        overlayShow: false // using overlay
    });
});