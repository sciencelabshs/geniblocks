import expect from 'expect';
import reducer from '../../src/code/reducers/';
import * as actions from '../../src/code/actions';

const types = actions.actionTypes;

function assertMatchingPhenotype(actionPhenotype, targetCharacteristics) {
  Object.keys(actionPhenotype).forEach((trait) => {
    expect(actionPhenotype[trait]).toEqual(targetCharacteristics[trait]);
  });
}

const correctCharacteristics = {
        armor: "Five armor",
        color:"Steel",
        forelimbs:"Forelimbs",
        health: "Healthy",
        hindlimbs: "No hindlimbs",
        horns: "Horns",
        liveliness: "Alive",
        "nose spike": "No nose spike",
        tail: "Long tail",
        wings: "No wings"
      },
      correctAlleles = "a:T,b:T,a:M,b:M,a:w,b:w,a:h,b:h,a:C,b:C,a:B,b:B,a:Fl,b:Fl,a:hl,b:hl,a:A1,b:A1,a:D,a:Bog,a:rh",
      userAlleles = "a:T,b:T,a:M,b:M,a:W,b:W,a:h,b:h,a:C,b:C,a:B,b:B,a:Fl,b:Fl,a:hl,b:hl,a:A1,b:A1,a:D,a:Bog,a:rh",
      initialAlleles = "a:T,b:T,a:M,b:M,a:W,b:w,a:h,b:h,a:C,b:C,a:B,b:B,a:Fl,b:Fl,a:hl,b:hl,a:A1,b:A1,a:D,a:Bog,a:rh",
      motherAlleles = "a:T,b:T,a:M,b:M,a:W,b:w,a:h,b:h,a:C,b:C,a:B,b:B,a:Fl,b:Fl,a:hl,b:hl,a:A1,b:A1,a:D,a:Bog,a:rh",
      fatherAlleles = "a:T,b:T,a:M,b:M,a:W,b:w,a:h,b:h,a:C,b:C,a:B,b:B,a:Fl,b:Fl,a:hl,b:hl,a:A1,b:A1,a:D,a:Bog,a:rh",
      getState = () => ({
        routeSpec: {level: 0,mission: 0, challenge: 0},
        drakes: [
          {
            alleleString: correctAlleles,
            sex: 0
          },
          {
            alleleString: userAlleles,
            sex: 0
          },
          {
            alleleString: motherAlleles,
            sex: 1
          },
          {
            alleleString: fatherAlleles,
            sex: 0
          }
        ],
        initialDrakes: [
          {},
          {
            alleleString: initialAlleles
          }
        ],
        trial: 0, trials: [{}], numTrials: 1,
        authoring: {challenges: {"test": {visibleGenes: "wings, arms"}}, "application": {"levels": [{"missions": [{"challenges": [{"id": "test"}]}]}]}}
      });


describe('submitDrake action', () => {
  describe('when the drake is submitted correctly', () => {
    const correct = true,
          dispatch = expect.createSpy();

    actions.submitDrake(0, 1, correct)(dispatch, getState);

    it('should call dispatch with the correct _submitDrake action', () => {
      var submitDrakeAction = dispatch.calls[0].arguments[0];
      expect(submitDrakeAction).toEqual({
        type: types.DRAKE_SUBMITTED,
        species: "Drake",
        challengeCriteria: {
          phenotype: submitDrakeAction.challengeCriteria.phenotype,  // we check valid phenotype below
          sex: 0
        },
        userSelections: {
          alleles: userAlleles,
          sex: 0
        },
        correct: true,
        incrementMoves: false,
        meta: {
          "itsLog": {
            "actor": "USER",
            "action": "SUBMITTED",
            "target": "ORGANISM"
          }
        }
      });
      assertMatchingPhenotype(submitDrakeAction.challengeCriteria.phenotype, correctCharacteristics);
    });

    it('should call dispatch with the correct message action', () => {
      // must call thunk function ourselves
      dispatch.calls[1].arguments[0](dispatch, getState);

      // thunk function dispatches the MODAL_DIALOG_SHOWN action
      expect(dispatch).toHaveBeenCalledWith({
        type: types.MODAL_DIALOG_SHOWN,
        leftButton: {
          action: "retryCurrentChallenge"
        },
        rightButton: {
          action: "continueFromVictory"
        },
        showAward: true
      });
    });

  });

  describe('when the drake is submitted incorrectly', () => {
    const correct = false,
          dispatch = expect.createSpy();

    actions.submitDrake(0, 1, correct)(dispatch, getState);

    it('should call dispatch with the correct _submitDrake action', () => {
      var submitDrakeAction = dispatch.calls[0].arguments[0];
      expect(submitDrakeAction).toEqual({
        type: types.DRAKE_SUBMITTED,
        species: "Drake",
        challengeCriteria: {
          phenotype: submitDrakeAction.challengeCriteria.phenotype,  // we check valid phenotype below
          sex: 0
        },
        userSelections: {
          alleles: userAlleles,
          sex: 0
        },
        correct: false,
        incrementMoves: true,
        meta: {
          "itsLog": {
            "actor": "USER",
            "action": "SUBMITTED",
            "target": "ORGANISM"
          }
        }
      });
      assertMatchingPhenotype(submitDrakeAction.challengeCriteria.phenotype, correctCharacteristics);
    });

    it('should call dispatch with the correct message action', () => {
      // MODAL_DIALOG_SHOWN action
      expect(dispatch.calls[1].arguments[0]).toEqual({
        type: types.NOTIFICATIONS_SHOWN,
        messages: [{
          text: "~ALERT.TITLE.INCORRECT_DRAKE"
        }],
        closeButton: {
          label: "~BUTTON.TRY_AGAIN",
          action: "dismissModalDialog"
        },
      });
    });

  });

  describe('when the drake is submitted as an offspring', () => {
    const correct = true,
          dispatch = expect.createSpy();

    actions.submitDrake(0, 1, correct, null, 2, 3)(dispatch, getState);

    it('should call dispatch with the correct _submitDrake action', () => {
      var submitDrakeAction = dispatch.calls[0].arguments[0];
      expect(submitDrakeAction).toEqual({
        type: types.DRAKE_SUBMITTED,
        species: "Drake",
        challengeCriteria: {
          phenotype: submitDrakeAction.challengeCriteria.phenotype,
          sex: 0
        },
        userSelections: {
          motherAlleles: motherAlleles,
          fatherAlleles: fatherAlleles,
          offspringAlleles: userAlleles,
          offspringSex: 0
        },
        correct: true,
        incrementMoves: false,
        meta: {
          "itsLog": {
            "actor": "USER",
            "action": "SUBMITTED",
            "target": "OFFSPRING"
          }
        }
      });
    });

  });

  describe('the reducer', () => {
    it('should update the challengeErrors and challengeComplete property correctly when drake is incorrect', () => {
      let defaultState = reducer(undefined, {});
      let initialState = defaultState.merge({
        routeSpec: {level: 0,mission: 0, challenge: 0},
        trial: 1,
        trials: [{}, {}],
        moves: 0,
        goalMoves: 1,
        challengeErrors: 0
      });

      let nextState = reducer(initialState, {
        type: types.DRAKE_SUBMITTED,
        correctPhenotype: [],
        submittedPhenotype: [],
        correct: false,
        incrementMoves: true
      });

      expect(nextState).toEqual(initialState.merge({
        trialSuccess: false,
        moves: 1,
        challengeErrors: 0
      }));
    });

    it('should update the currentGem and challengeComplete property correctly when drake is incorrect', () => {
      let defaultState = reducer(undefined, {});
      let initialState = defaultState.merge({
        routeSpec: {level: 0,mission: 0, challenge: 0},
        trial: 1,
        trials: [{}, {}],
        moves: 1,
        goalMoves: 1,
        challengeErrors: 0
      });

      let nextState = reducer(initialState, {
        type: types.DRAKE_SUBMITTED,
        correctPhenotype: [],
        submittedPhenotype: [],
        correct: false,
        incrementMoves: true
      });

      expect(nextState).toEqual(initialState.merge({
        trialSuccess: false,
        moves: 2,
        challengeErrors: 1
      }));
    });

    it('should not update challengeErrors when drake is incorrect but goalMoves < 0', () => {
      let defaultState = reducer(undefined, {});
      let initialState = defaultState.merge({
        routeSpec: {level: 0,mission: 0, challenge: 0},
        trial: 1,
        trials: [{}, {}],
        moves: 1,
        goalMoves: -1,
        challengeErrors: 0
      });

      let nextState = reducer(initialState, {
        type: types.DRAKE_SUBMITTED,
        correctPhenotype: [],
        submittedPhenotype: [],
        correct: false,
        incrementMoves: true
      });

      expect(nextState).toEqual(initialState.merge({
        trialSuccess: false,
        moves: 2,
        challengeErrors: 0
      }));
    });

    describe.skip('when drake is correct', () => {
      let defaultState = reducer(undefined, {});
      let initialState = defaultState.merge({
        routeSpec: {level: 0,mission: 0, challenge: 0},
        trial: 1,
        trials: [{}, {}],
        gems: [],
        goalMoves: 3,
        moves: 3
      });
      let submitAction = {
        type: types.DRAKE_SUBMITTED,
        correctPhenotype: [],
        submittedPhenotype: [],
        correct: true,
        incrementMoves: true
      };

      it('should update the trialSuccess and challengeComplete property correctly when there are no more trials', () => {

        // NEEDS THE REST OF THE ACTIONS TO MAKE GEMS UPDATE
        let nextState = reducer(initialState, submitAction);

        expect(nextState).toEqual(initialState.merge({
          trialSuccess: true,
          moves: 4,
          gems: [
            [
              [
                0
              ]
            ]
          ]
        }));
      });
    });
  });
});
