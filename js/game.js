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