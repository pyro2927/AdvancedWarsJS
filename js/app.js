// setting our sizes
var width = 46;
var border = 2;

var selectedPiece = null;


function prepSelectedForMovement(){
    board.showMovableArea(selectedPiece);
    removeMenu();
}
function removeMenu(){
    $(".unitmenu").remove();
}
function cancelMenu(){
    removeMenu();
    selectedPiece = null;
}

// setup our models
var Unit = Backbone.Model.extend({
    // setup our default values
    defaults: {
        name: "Unit",
        movement: 3,
        x: 0,
        y: 0,
        color: "",
        health: 10,
        range: 1
    },
    cssPosition : function(optionalInset){
        if (optionalInset == null)
            optionalInset = 0;
        return {'top':  (optionalInset + this.get("y") * (width+border))+'px', 'left': (optionalInset + this.get("x") * (width+border))+'px'};
    }
});

var BoardSpace = Backbone.Model.extend({
    // setup our default values
    defaults: {
        type: "grass",
        highlighted: false,
        x: 0,
        y: 0
    },
    initialize : function(options) {
        this.unit = null;
    }
});

// setup our view
var UnitView = Backbone.View.extend({
    tagName: "div",
    className: "piece",
    events:{
        "click" : "showMenu"
    },
    render : function(){
        // add class so we show up as the correct color
        this.$el.addClass(this.model.get("color"));
        // show our health
        var html = this.model.get("health")
        this.el.innerHTML = html;
        // set initial placement
        this.move();
        return this;
    },
    move : function(){
        this.$el.css(this.model.cssPosition());
    },
    initialize : function(options) {
        this.move = _.bind(this.move, this);
        this.model.bind('change:x', this.move);
        this.model.bind('change:y', this.move);
        // add it to our pieces div
        $('div#pieces').append(this.render().el);
    },
    showMenu : function(){
        // make sure we only show our menu if no other piece is selected
        if (selectedPiece != null) {
            return;
        }
        selectedPiece = this.model;

        //setup our menu
        var menu = $('<div/>').addClass("unitmenu");
        menu.css(this.model.cssPosition(20));
        // figure out our menu options
        var options = ["Move", "Fire", "Cancel"];
        var selectors = ["prepSelectedForMovement()", "", "cancelMenu()"];
        var menuHtml = "";
        $.each(options, function(i, option){
            menuHtml += "<a href='#' onclick='" + selectors[i] + ";' id='" + option + "'>" + option + "</a><br/>";
        });
        menu.html(menuHtml);
        $('div#pieces').append(menu);
    }
});

// board piece view
var BoardSpaceView = Backbone.View.extend({
    tagName: "div",
    className: "square",
    events:{
        "click" : "movePieceToMe"
    },
    render : function(){
        this.$el.addClass(this.model.get("type"));
        return this;
    },
    initialize : function(options) {
        // add piece to our board
        $('div#board').append(this.render().el);
        this.update = _.bind(this.update, this);
        this.model.bind('change:highlighted', this.update);
    },
    update : function(){
        if (this.model.get("highlighted") == true) {
            this.$el.addClass("movable");
        } else {
            this.$el.removeClass("movable");
        }
    },
    movePieceToMe : function(){
        // make sure we are allowed to be moved to
        if (this.model.get("highlighted") == true) {
            board.moveSelectedPieceTo(this);
        }
    }
});

// full roster of units
var Units = Backbone.Collection.extend({
    model: Unit
});

// board - a collection of board spaces
var BoardSpaces = Backbone.Collection.extend({
    model: BoardSpace,
    spaceAt : function (x,y){
        // TODO: get correct space (statically assuming 15 pixels wide now)
        return this.at(x + y * 15);
    }
});

var Board = Backbone.Model.extend({
    defaults: {
        width: 15
    },
    initialize : function(){
        this.spaces = new BoardSpaces;
    },
    clearMovable : function(){
        // clear our current movables
        _.each(this.spaces.models, function(space){ space.set("highlighted", false) } );
    },
    showMovableArea : function(unitModel){
        this.clearMovable();
        // otherwise we can set highlighted movement areas
        selectedPiece = unitModel;
        var unitX = unitModel.get("x");
        var unitY = unitModel.get("y");
        // loop over our spaces, see which ones we can highlight
        _.each(this.spaces.models, function(space){
            if (Math.abs(unitX - space.get("x")) + Math.abs(unitY - space.get("y")) <= unitModel.get("movement")){
                space.set("highlighted", true);
            }
        });
    },
    moveSelectedPieceTo : function (boardSpaceView){
        selectedPiece.set("x", boardSpaceView.model.get("x"));
        selectedPiece.set("y", boardSpaceView.model.get("y"));
        this.clearMovable();
        // mark our unit as being in this space
        boardSpaceView.model.unit = selectedPiece;
        var enemies = this.enemiesInRangeOfUnit(selectedPiece);
        selectedPiece = null;
    },
    enemiesInRangeOfUnit : function(unitModel){
        var enemies = [];
        var unitX = unitModel.get("x");
        var unitY = unitModel.get("y");
        var range = unitModel.get("range");
        // add all enemies in range of our unit to this array
        _.each(this.spaces.models, function(boardSpace){
            if (boardSpace.unit != null && boardSpace.unit.get("color") != unitModel.get("color") && Math.abs(unitX - boardSpace.get("x")) + Math.abs(unitY - boardSpace.get("y")) <= range){
                enemies.push(boardSpace.unit);
                alert(boardSpace.unit.get("name"));
            }
        });
        return enemies;
    }
});

// team, each team has a color
var Team = Backbone.Model.extend({
    defaults:{
        color: ""
    },
    initialize : function(){
        this.units = new Units;
        // make sure we set the color on any pieces we add
        this.units.bind('add', function(unit){
            unit.set("color", this.get("color"));
        }, this); // make sure we pass out reference to this
    }
});

// create a set of players
var Teams = Backbone.Collection.extend({
    model: Team
});

// create a game model to hold everything
var Game = Backbone.Model.extend({
    initialize : function(){
        this.players = new Teams;
        this.board = new Board;
    }
});

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