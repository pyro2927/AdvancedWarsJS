var selectedPiece = null;

// setup a dispatcher to pass messages back and forth between models/views
var dispatcher = _.clone(Backbone.Events);

// create a new game
var game = new Game;
// reference our board
var board = game.board;
var squareCount = 10 * 15;
for (var i = 0;i < squareCount;i++) {
  //this line creates a new div with the class 'square'
  //and appends it to the div with id 'board'
  var square = new BoardSpace({"x": i % board.get("width"), "y": parseInt(i / board.get("width")) });
  board.spaces.add(square);
  var squareView = new BoardSpaceView({
    model: square
  });
}

// create an instance of team
var orangeTeam = new Team({color: "orange"});
game.players.add(orangeTeam);
// add some units to our team
var unit1 = new Unit({name: "Unit 1", x: 0, y: 0});
orangeTeam.units.add(unit1);
var unit1View = new UnitView({
    model: unit1
});

// create a second unit
var unit2 = new Unit({name: "Unit 2", x: 2, y: 5});
orangeTeam.units.add(unit2);
var unit2View = new UnitView({
    model: unit2
});

// create a blue team
var blueTeam = new Team({color: "blue"});
game.players.add(blueTeam);
var blueUnit = new Unit({name: "mech", x:4, y: 1});
blueTeam.units.add(blueUnit);
new UnitView({model: blueUnit});

console.log("Server up and running!");