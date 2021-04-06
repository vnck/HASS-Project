window.onload = () => {
    var $target = $('.wrapper');
inView('.container').on('enter', function(el){
    var color = $(el).attr('data-background-color');
    $target.css('background-color', color );
    console.log('detected!');
});
}