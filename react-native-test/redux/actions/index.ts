import { COUNTER_CHANGE, TURNS_CHANGE, PAIR_CHANGE, BEST_SCORE } from '../constants';

export function setNoOfTurns(noOfTurns: number) {
    return {
        type: TURNS_CHANGE,
        payload: noOfTurns
    }
}

export function setPairCount(pairCount: number) {
    return {
        type: PAIR_CHANGE,
        payload: pairCount
    }
}

export function setBestScore(bestScore: number) {
    return {
        type: BEST_SCORE,
        payload: bestScore
    }
}
