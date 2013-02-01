var MenuItem = Backbone.Model.extend({
	
});
var MenuItemView = Backbone.View.extend({

});
var MenuList = Backbone.Collection.extend({
	model: MenuItem
});
var MenuView = Backbone.View.extend({
	model: MenuList,
	tagName: "div",
  	className: "square",
	render : function(){
        this.$el.addClass("unitmenu");
        // TODO: add in each $el of our collection items
        return this;
    }
})
var menu = new MenuList({name: "Move", name: "Fire", name: "Cancel"});