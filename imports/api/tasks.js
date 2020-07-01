import { Meteor } from 'meteor/meteor';

//import { Mongo } from 'meteor/mongo';
import { Mongo, MongoInternals } from 'meteor/mongo';

import { check, Match } from 'meteor/check';

//export const Tasks = new Mongo.Collection('tasks');
export const Tasks = new Mongo.Collection('boxes');




//var works_db = new MongoInternals.RemoteCollectionDriver("mongodb://works:zheldjf@192.168.10.135:27017/works?authSource=works");
//export const works_db_collection = new Mongo.Collection("boxes", { _driver: works_db });

/*
var works_db = new MongoInternals.RemoteCollectionDriver(
  "mongodb://localhost:27017/db", 
  {
    oplogUrl: "mongodb://works:zheldjf@192.168.10.135:27017/works?authSource=works"
  });
var works_db_collection = new Mongo.Collection("Coll", {_driver: driver});
*/

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('tasks', function tasksPublication() {

    console.log(`-------1`);
    //console.log(Tasks.find({$or: [{ private: { $ne: true } },{ owner: this.userId },],}));
    console.log(`-------2`);

    return Tasks.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId },
      ],
    });
  });


  /*
  Meteor.publish('tasks2', function tasksPublication2() {

    console.log(`-------3`);
    //console.log(Tasks.find( { private: { $ne: true } }, ));
    console.log(`-------4`);

    return works_db_collection.find();
  });
  */

}


Meteor.methods({
  'tasks.insert'(text) {
    check(text, String);

    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Tasks.insert({
      text,
      createdAt: new Date(),
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
    });
  },
  'tasks.remove'(taskId) {
    check(taskId, Match.OneOf(String, Mongo.ObjectID));

    const task = Tasks.findOne(taskId);
    if (task.private && task.owner !== this.userId) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }

    Tasks.remove(taskId);
  },
  'tasks.setChecked'(taskId, setChecked) {
    check(taskId, Match.OneOf(String, Mongo.ObjectID));
    check(setChecked, Boolean);

    const task = Tasks.findOne(taskId);
    if (task.private && task.owner !== this.userId) {
      // If the task is private, make sure only the owner can check it off
      throw new Meteor.Error('not-authorized');
    }

    Tasks.update(taskId, { $set: { checked: setChecked } });
  },
  'tasks.setPrivate'(taskId, setToPrivate) {
    check(taskId, Match.OneOf(String, Mongo.ObjectID));
    check(setToPrivate, Boolean);

    const task = Tasks.findOne(taskId);

    // Make sure only the task owner can make a task private
    if (task.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Tasks.update(taskId, { $set: { private: setToPrivate } });
  },
});
