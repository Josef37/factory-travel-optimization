import AStarSolver, { Direction, Factory } from "./AStarSolver";

export default class StrategySolver extends AStarSolver {
    getPossibleDirections(state) {
        const currentFactoryState = state.factoryState[state.positionIndex]
        const leftFactoryState = state.factoryState[state.positionIndex - 1]
        const rightFactoryState = state.factoryState[state.positionIndex + 1]

        let canLeft = leftFactoryState !== undefined && leftFactoryState !== Factory.DONE
        if (canLeft && state.direction === Direction.LEFT) {
            return {
                [Direction.WAIT]: false,
                [Direction.LEFT]: true,
                [Direction.RIGHT]: false,
            }
        }

        let canWait = currentFactoryState !== Factory.DONE &&
            (leftFactoryState === undefined || leftFactoryState === Factory.DONE)
        if (canWait && state.direction === Direction.LEFT) {
            return {
                [Direction.WAIT]: true,
                [Direction.LEFT]: false,
                [Direction.RIGHT]: false,
            }
        }

        let canRight = rightFactoryState !== undefined &&
            (rightFactoryState === Factory.INITIAL || currentFactoryState === Factory.DONE)
        return {
            [Direction.WAIT]: canWait,
            [Direction.LEFT]: canLeft,
            [Direction.RIGHT]: canRight,
        }
    }
}