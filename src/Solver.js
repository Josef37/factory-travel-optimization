import _ from "lodash";
import Heap from "heap";

export const Factory = {
    INITIAL: -1,
    DONE: -2,
}

export const Direction = {
    LEFT: "LEFT",
    WAIT: "WAIT",
    RIGHT: "RIGHT",
}

export default class Solver {
    constructor(arr, processingTime) {
        const n = arr.length;
        Object.assign(this, { n, arr, processingTime });
        const firstState = {
            time: 0,
            weight: 0,
            positionIndex: 0,
            factoryState: Array(this.n).fill(Factory.INITIAL),
            prev: null
        };
        this.queue = new Heap((node1, node2) => node1.weight - node2.weight)
        this.queue.push(firstState)
        this.visited = new Set();
        this.values = {};
        this.iterationCount = 0;
    }

    solve() {
        while (!this.queue.empty()) {
            const state = this.queue.pop();

            const stateHash = this.hash(state);
            if (this.visited.has(stateHash)) {
                continue;
            }
            this.visited.add(stateHash);

            this.startProduction(state);
            this.pickUpProduct(state);

            if (this.isDone(state)) {
                console.log("iterations", this.iterationCount, state);
                return this.getPath(state);
            }

            this.exploreAllSubsequentStates(state);

            this.iterationCount++;
        }
    }

    startProduction(state) {
        if (state.factoryState[state.positionIndex] === Factory.INITIAL) {
            state.factoryState[state.positionIndex] = this.processingTime;
        }
    }

    pickUpProduct(state) {
        if (state.factoryState[state.positionIndex] === 0) {
            state.factoryState[state.positionIndex] = Factory.DONE;
        }
    }

    exploreAllSubsequentStates(state) {
        const directions = this.getPossibleDirections(state)
        if (directions[Direction.WAIT]) {
            this.wait(state);
        }
        if (directions[Direction.LEFT]) {
            this.moveLeft(state);
        }
        if (directions[Direction.RIGHT]) {
            this.moveRight(state);
        }
    }

    getPossibleDirections(state) {
        return {
            [Direction.WAIT]: this.canWait(state),
            [Direction.LEFT]: this.canMoveLeft(state),
            [Direction.RIGHT]: this.canMoveRight(state),
        }
    }

    canWait(state) {
        const factoryState = state.factoryState[state.positionIndex]
        return factoryState > 0 || factoryState === Factory.INITIAL
    }
    wait(state) {
        const dt = state.factoryState[state.positionIndex];
        const stateWait = this.makeNewState(state, dt);
        stateWait.direction = Direction.WAIT;
        this.insertIntoQueue(stateWait);
    }

    canMoveLeft(state) {
        return 0 < state.positionIndex;
    }
    moveLeft(state) {
        const dt = this.arr[state.positionIndex] - this.arr[state.positionIndex - 1];
        const stateLeft = this.makeNewState(state, dt, -1);
        stateLeft.direction = Direction.LEFT;
        this.insertIntoQueue(stateLeft);
    }

    canMoveRight(state) {
        return state.positionIndex < this.n - 1;
    }
    moveRight(state) {
        const dt = this.arr[state.positionIndex + 1] - this.arr[state.positionIndex];
        const stateRight = this.makeNewState(state, dt, 1);
        stateRight.direction = Direction.RIGHT;
        this.insertIntoQueue(stateRight);
    }

    isDone(state) {
        return state.positionIndex === this.n - 1
            && state.factoryState.every(s => s === Factory.DONE)
    }

    getPath(state) {
        if (!state) return {};
        return {
            ...this.getPath(state.prev),
            [state.time]: this.arr[state.positionIndex]
        };
    }

    hash(state) {
        return `${state.positionIndex}/${state.factoryState.toString()}`
    }

    makeNewState(oldState, deltaTime, deltaIndex = 0) {
        const state = this.clone(oldState);
        state.time += deltaTime;
        state.positionIndex += deltaIndex;
        state.factoryState = state.factoryState.map(t => t < 0 ? t : Math.max(0, t - deltaTime));
        state.prev = oldState;
        state.weight = state.time + this.heuristic(state);
        return state;
    }

    clone(state) {
        return {
            time: state.time,
            positionIndex: state.positionIndex,
            factoryState: state.factoryState.slice(0),
        }
    }

    insertIntoQueue(state) {
        const stateHash = this.hash(state);
        if (stateHash in this.values && this.values[stateHash] <= state.time) {
            return;
        }
        this.values[stateHash] = state.time;
        this.queue.push(state)
    }

    heuristic(state) {
        const leftIndex = _.findIndex(state.factoryState, s => s !== Factory.DONE)

        if (leftIndex === -1) {
            return Math.abs(this.arr[this.n - 1] - this.arr[state.positionIndex]);
        } else {
            let minWayToGo = 0;
            minWayToGo += Math.abs(this.arr[leftIndex] - this.arr[state.positionIndex]);
            minWayToGo += Math.abs(this.arr[this.n - 1] - this.arr[leftIndex]);
            return minWayToGo;
        }
    }
}
