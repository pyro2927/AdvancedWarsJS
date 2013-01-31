//global variables for one square
var width = 46;
var border = 2;
var selectedPiece = null;

// HARDCODE MOVEMENT DISTANCE
var DISTANCE = 4;

var teams = [".orange", ".blue"];
var selectedTeamIndex = 0;

function getPixels(x,y) {
  //ok... so takes an x,y position, returns
  //pixels from the left, right
  return {'top':  (y * (width+border) + 1)+'px','left': (x * (width+border) + 1)+'px'};    
}

function clearMovable(){
	// clear all movement squares
	$(".movable").each(function(){
		$(this).removeClass("movable");
		$(this).unbind('click');
	});
}

function movePieceToCoordinates($piece, x, y, keepEnabled){
	$piece.css(getPixels(x,y));
	selectedPiece = null;
	clearMovable();

	// disable this piece after we've moved it
	$piece.unbind('click');
	// add our alpha
	if (arguments.length < 3 || !keepEnabled) {
		$piece.addClass("disabled");
	}
}

function getCoordsOfObject(object) {
	var pos = object.position();
    //returns an x and a y
    //given a top and left pixels
    return {
        'x': parseInt(pos.left / (width + border)),
        'y': parseInt(pos.top / (width + border))
    };
}

function movePieceToSpace(space){
	var cor = getCoordsOfObject(space);
	movePieceToCoordinates(selectedPiece, cor.x, cor.y);
}

function showMovableAreaForPiece(piece){
	var coords = getCoordsOfObject(piece);
	// iterate our squares and show which ones are movable
	$('.square').each(function(){
		var squareCoords = getCoordsOfObject($(this));
		if (Math.abs(coords.x - squareCoords.x) + Math.abs(coords.y - squareCoords.y) <= DISTANCE){
			$(this).addClass("movable");
			$(this).click( function(){
  			movePieceToSpace($(this));
  		} );
		}
	});
}

function selectPieceAndShowMovable(piece){
	clearMovable();
	if (selectedPiece != null && selectedPiece.get(0) === piece.get(0)) {
		selectedPiece = null;
		return;
	}
	selectedPiece = piece;
	showMovableAreaForPiece(piece);
}

function endTurn(){
	// disable the current team's pieces
	$(teams[selectedTeamIndex]).unbind("click");
	// bump to next team
	selectedTeamIndex = ++selectedTeamIndex % teams.length;
	// allow next teams pieces to be moved
  $(teams[selectedTeamIndex]).click( function(){
  	selectPieceAndShowMovable($(this));
  });
  $("#turn").text(teams[selectedTeamIndex] + "'s turn");
  // re-enable the other players pieces
  $(".disabled").removeClass("disabled");
}

$('document').ready(function() {
  var squareCount = 10*15;
  for (var i = 0;i<squareCount;i++) {
      //this line creates a new div with the class 'square'
      //and appends it to the div with id 'board'
      $('div#board').append($('<div/>').addClass('square').addClass("grass"));
  }
});