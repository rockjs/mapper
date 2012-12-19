Meteor.subscribe( "boardData" );

Template.board.rendered = function() {
	if ( this.hasBoxes ) { 
		return;
	}
	this.hasBoxes = true;

	var board = this.find(".container"),
		x = 0, y;
	for (; x < 50 ; x++ ) for( y=0; y < 50; y++ ) {
		var test = Meteor.render(function() {
			return Template.square({ x: x, y: y });
		});
		board.appendChild( test );
	}
};

Template.square.style = function() {
	var data = BoardData.findOne({ x: this.x, y: this.y });
	return "left: " + this.x + "em; top:" + this.y + "em";
};

Template.square.selected = function() {
	var selected = BoardData.findOne({ x: this.x, y: this.y });
	return selected ? "selected" : "";
};
Template.square.title = function() {
	var selected = BoardData.findOne({ x: this.x, y: this.y });
	return (selected && selected.title) || "";
};

Template.square.events({
	"click .square": function() {
		var obj = { x: this.x, y: this.y };
		if ( BoardData.findOne(obj) ) {
			BoardData.remove(obj);
		} else {
			BoardData.insert(obj);
		}
	}
});
