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
        dispatcher.on("select:piece", this.showMenu);
    },
    showMenu : function (unitModel){
        alert(unitModel.get("name"));
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