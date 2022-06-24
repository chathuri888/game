
import { COUNTER_CHANGE, TURNS_CHANGE, PAIR_CHANGE, BEST_SCORE } from '../constants';
const initialState = {
    noOfTurns: 0,
    pairCount: 0,
    bestScore: 0,
};
const countReducer = (state = initialState, action) => {
    switch (action.type) {

        case TURNS_CHANGE:
            return {
                ...state,
                noOfTurns: action.payload
            };
        case PAIR_CHANGE:
            return {
                ...state,
                pairCount: action.payload
            };
        case BEST_SCORE:
            return {
                ...state,
                bestScore: action.payload
            };
        default:
            return state;
    }
}
export default countReducer;

