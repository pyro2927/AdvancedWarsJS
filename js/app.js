// setting our sizes
var width = 46;
var border = 2;

// setup our models
var Unit = Backbone.Model.extend({
    // setup our default values
    defaults: {
        name: "Unit",
        movement: 4,
        x: 0,
        y: 0,
        color: ""
    }
});

// setup our view
var UnitView = Backbone.View.extend({
    tagName: "div",
    className: "piece",
    render : function(){
        this.$el.addClass(this.model.get("color"));
        return this;
    },
    move : function(){
        this.$el.css({'top':  (this.model.get("y") * (width+border))+'px', 'left': (this.model.get("x") * (width+border))+'px'});
    },
    initialize : function(options) {
        this.move = _.bind(this.move, this);
        this.model.bind('change:x', this.move);
        this.model.bind('change:y', this.move);
    }
});

// full roster of units
var Units = Backbone.Collection.extend({
    model: Unit
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

// create an instance of team
var orangeTeam = new Team({color: "orange"});
// add a unit to our team
var unit1 = new Unit({name: "Unit 1", x: 0, y: 0,});
orangeTeam.units.add(unit1);
var unit1View = new UnitView({
    model: unit1
});

$('div#pieces').append(unit1View.render().el);

console.log("Server up and running!");