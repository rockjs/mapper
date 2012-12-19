Meteor.subscribe( "boardData" );

Template.board.rendered = function() {
	if ( this.hasBoxes ) { 
		return;
	}
	this.hasBoxes = true;

	var board = this.find(".container"),
		x = 0, y;
	for (; x < 20 ; x++ ) for( y=0; y < 20; y++ ) {
		var test = Meteor.render(function() {
			return Template.square({ x: x, y: y });
		});
		board.appendChild( test );
	}
};

Meteor.startup(function() {
	jQuery( document ).tooltip();
});

Template.square.style = function() {
	var data = BoardData.findOne({ x: this.x, y: this.y });
	var style = _.extend({
		left: this.x+"em",
		top: this.y+"em"
	}, data && data.style );
	return _.reduce(style, function( memo, value, key ) {
		return memo + key + ":" + value + ";";
	}, "");
};

Template.square.title = function() {
	var square = BoardData.findOne({ x: this.x, y: this.y });
	return (square && square.title) || "";
};

Template.square.rendered = function() {
	var selected = Session.get("selectedsquare");
	if( selected && selected.x === this.data.x && selected.y === this.data.y ) {
		jQuery(this.find(".square")).addClass("selected");
	}
};
Template.square.events({
	"click .square": function() {
		var obj = { x: this.x, y: this.y };
		Session.set( "selectedsquare", obj );
		if ( !BoardData.findOne( obj ) ) {
			BoardData.insert( obj );
		}
		jQuery(".square.selected").removeClass("selected");
		jQuery(event.target).addClass("selected");
	}
});

Template.sidebar.square = function() {
	var square = Session.get("selectedsquare");
	var data = square && BoardData.findOne( square );
	return data;
};

Template.sidebar.events({
	"change input.title": function() {
		var square = Session.get( "selectedsquare" );
		BoardData.update( square, { $set: { title: event.target.value } } );
	},
	"change input.bgcolor": function() {
		var square = Session.get( "selectedsquare" );
		BoardData.update( square, { $set: { "style.background": event.target.checked ? "yellow" : null } } );
	}
});
