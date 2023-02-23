$(".inp").on('input',function(){

    var x = document.getElementsByClassName('numofitems');
    x = parseFloat(x);

    var y = document.getElementsByClassName('price');
    y = parseFloat(y);

    document.getElementById('total').value= x +y;

});