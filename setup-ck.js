$('document').ready(function() {
		alert("test");
    //Creating the 64 squares and adding them to the DOM
    var squareCount = 10*15;
    for (var i = 0;i<squareCount;i++) {
        //this line creates a new div with the class 'square'
        //and appends it to the div with id 'board'
        $('div#board').append($('<div/>').addClass('square'));
    }
);