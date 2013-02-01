// setting our sizes
var width = 46;
var border = 2;

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

// setup our view
var UnitView = Backbone.View.extend({
    tagName: "div",
    className: "piece",
    events:{
        "click" : "selectMe"
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
    selectMe : function(){
        dispatcher.trigger("select:piece", this.model);
    }
});

// full roster of units
var Units = Backbone.Collection.extend({
    model: Unit
});