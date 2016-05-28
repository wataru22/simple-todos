/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'meteor/practicalmeteor:chai';

import { Tasks } from './tasks.js';

if (Meteor.isServer) {
  describe('Tasks', () => {
    describe('methods', () => {
      const userId = Random.id();
      let taskId;

      beforeEach(() => {
        Tasks.remove({});
        // insert test task
        taskId = Tasks.insert({
          text: 'test task',
          createdAt: new Date(),
          owner: userId,
          username: 'tmeasday',
        });
      });

      it('can set check on task', () => {
      	const setCheck = Meteor.server.method_handlers['tasks.setChecked'];

      	const invocation  = { userId };

      	// set check
      	setCheck.apply(invocation, [taskId, true]);

      	assert.equal(Tasks.find({ checked: true }).count(), 1);

      	// remove check
      	setCheck.apply(invocation, [taskId, false]);

      	assert.equal(Tasks.find({ checked: true }).count(), 0);
      });

      it('can delete owned task', () => {
      	// Find the internal implementation of the task method so we can
        // test it in isolation
        const deleteTask = Meteor.server.method_handlers['tasks.remove'];

        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId };

        // Run the method with `this` set to the fake invocation
        deleteTask.apply(invocation, [taskId]);

        // Verify that the method does what we expected
        assert.equal(Tasks.find().count(), 0);
      });
    });
  });
}