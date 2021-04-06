
window.onloadFuncs.push(() => {
    var $target = $('.wrapper');
inView('.colordiv').on('enter', function(el){
    var color = $(el).attr('data-background-color');
    $target.css('background-color', color );
});
});