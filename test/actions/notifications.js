import expect from 'expect';
import reducer from '../../src/code/reducers/';
import { startSession } from '../../src/code/actions';
import { GUIDE_MESSAGE_RECEIVED } from '../../src/code/modules/notifications';
import urlParams from '../../src/code/utilities/url-params';
import GuideProtocol from '../../src/code/utilities/guide-protocol';
import actionTypes from '../../src/code/action-types';

describe('Notification actions', () => {

  before( () => urlParams.showITS = "true" );

  after( () => delete urlParams.showITS );

  describe('the reducer', () => {

    let defaultState = reducer(undefined, {});
    let nextState;

      let messageData = JSON.stringify(
        {
          message: {
            id: 'ITS.CHALLENGE.INTRO.2',
            text: 'Ok! Let\'s get to work on Mission {{mission}} Challenge {{challenge}}.',
            args: {
              level: 0,
              mission: 0,
              challenge: 2
            }
          },
          time: 1484069330265
        }
      );

    describe('on receiving GUIDE message', () => {

      it('should add to the notifications', () => {

        nextState = reducer(defaultState, {
          type: GUIDE_MESSAGE_RECEIVED,
          data: GuideProtocol.TutorDialog.fromJson(messageData)
        });

        expect(nextState).toEqual(defaultState.merge({
          notifications: {
            messages: [{
              text: "Ok! Let's get to work on Mission 0 Challenge 2."
            }],
            closeButton: null
          }
        }));
      });

      it('should concatenate the notifications', () => {

        let secondMessageData = JSON.stringify(
          {
            message: {
              id: 'ITS.CHALLENGE.INTRO.3',
              text: 'Second message.',
              args: {}
            },
            time: 1484069330265
          }
        );

        let lastState = reducer(nextState, {
          type: GUIDE_MESSAGE_RECEIVED,
          data: GuideProtocol.TutorDialog.fromJson(secondMessageData)
        });

        expect(lastState).toEqual(defaultState.merge({
          notifications: {
            messages: [{
              text: "Ok! Let's get to work on Mission 0 Challenge 2. Second message."
            }],
            closeButton: null
          }
        }));
      });
    });

    describe('on receiving modal dialog messages', () => {

      it('should add to the notifications with the correct close button action', () => {

        nextState = reducer(defaultState, {
          type: actionTypes.NOTIFICATION_SHOWN,
          message: "Sample message",
          showAward: false,
          closeButton: "sampleAction"
        });

        expect(nextState.notifications.messages).toEqual([{text: "Sample message"}]);
        expect(nextState.notifications.closeButton).toEqual("sampleAction");
      });
    });

    describe('on receiving other actions', () => {

      nextState = reducer(defaultState, {
        type: GUIDE_MESSAGE_RECEIVED,
        data: GuideProtocol.TutorDialog.fromJson(messageData)
      });

      it('should clear the notifications', () => {
        let lastState = reducer(nextState, startSession("123"));

        expect(lastState).toEqual(defaultState.merge({
          notifications: {messages: [], closeButton: null}
        }));
      });
    });
  });
});
