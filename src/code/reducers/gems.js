import actionTypes from '../action-types';
import { getGemFromChallengeErrors } from './helpers/gems-helper';

const initialState = [];

/**
 * gems is the list of all gems the user has been awarded.
 */
export default function gems(state = initialState, challengeErrors, routeSpec, action) {
  switch(action.type) {
    case actionTypes.CHALLENGE_COMPLETED:
    case actionTypes.CHALLENGE_RETRIED: {
        let { level: currLevel, mission: currMission, challenge: currChallenge } = routeSpec;
        //XXX: Ultra-hack to make sure there are no undefined levels
        for (let level = 0; level <= 10; level++) {
          if (!state[level]) {
            state = state.setIn([level], []);
          }
          for (let mission = 0; mission <= 10; mission++) {
            if (!state[level][mission]) {
              state = state.setIn([level, mission], []);
            }
            for (let challenge = 0; challenge <= 10; challenge++) {
              if (isNaN(state[level][mission][challenge])) {
                state = state.setIn([level, mission, challenge], null);
              }
            }
          }
        }
        
        let gem = getGemFromChallengeErrors(challengeErrors);
        state = state.setIn([currLevel, currMission, currChallenge], gem);

        return state;
      }
    case actionTypes.LOAD_SAVED_STATE: {
      if (action.gems && action.gems.length > 0) {
        return action.gems;
      } else {
        return state;
      }
    }
    default:
      return state;
  }
}
