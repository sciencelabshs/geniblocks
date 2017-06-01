import Immutable from 'seamless-immutable';
import actionTypes from '../action-types';
import { GUIDE_ALERT_RECEIVED, GUIDE_MESSAGE_RECEIVED } from '../modules/notifications';

const initialState = Immutable({
  show: false,
  message: null,
  explanation: null,
  leftButton: null,
  rightButton: null
});

const defaultRightButton = {
  label: "~BUTTON.OK",
  action: "dismissModalDialog"
};

export default function modalDialog(state = initialState, action) {
  switch (action.type) {
    case actionTypes.MODAL_DIALOG_SHOWN:
      if (action.showAward || (action.rightButton && action.rightButton.action === "advanceTrial")) {
        return state.merge({
          show: true,
          message: action.message,
          explanation: action.explanation,
          rightButton: action.rightButton || defaultRightButton,
          leftButton: action.leftButton,
          showAward: action.showAward,
          top: action.top
        });
      } else {
        return state;
      }
    case actionTypes.MODAL_DIALOG_DISMISSED:
      return initialState;
    // actions which don't close the dialog, i.e. that can occur
    // while a dialog is being shown
    case actionTypes.BASKET_SELECTION_CHANGED:
    case actionTypes.DRAKE_SELECTION_CHANGED:
    case GUIDE_ALERT_RECEIVED:
    case GUIDE_MESSAGE_RECEIVED:
      return state;
    // Assume for now that all other actions also close dialog
    default:
      return initialState;
  }
}
