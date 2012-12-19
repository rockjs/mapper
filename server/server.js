Meteor.publish( "boardData", function() {
  return BoardData.find({});
});
