import _ from "lodash";
import Heap from "heap";

export const Factory = {
    INITIAL: -1,
    DONE: -2
}

export default class Problem {
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
        // Wait
        if (state.factoryState[state.positionIndex] > 0) {
            const dt = state.factoryState[state.positionIndex];
            const stateWait = this.makeNewState(state, dt);
            this.insertIntoQueue(stateWait);
        }
        // Move left
        if (0 < state.positionIndex) {
            const dt = this.arr[state.positionIndex] - this.arr[state.positionIndex - 1];
            const stateLeft = this.makeNewState(state, dt, -1);
            this.insertIntoQueue(stateLeft);
        }
        // Move right
        if (state.positionIndex < this.n - 1) {
            const dt = this.arr[state.positionIndex + 1] - this.arr[state.positionIndex];
            const stateRight = this.makeNewState(state, dt, 1);
            this.insertIntoQueue(stateRight);
        }
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

    makeNewState(oldState, dt, di = 0) {
        const state = this.clone(oldState);
        state.time += dt;
        state.positionIndex += di;
        state.factoryState = state.factoryState.map((t) => t < 0 ? t : Math.max(0, t - dt));
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
        const rightIndex = _.findLastIndex(state.factoryState, s => s !== Factory.DONE)

        if (leftIndex === -1 && rightIndex === -1) {
            return Math.abs(this.arr[this.n - 1] - this.arr[state.positionIndex]);
        } else if (leftIndex === -1 || rightIndex === -1) {
            const index = leftIndex + rightIndex + 1;
            let minWayToGo = 0;
            minWayToGo += Math.abs(this.arr[index] - this.arr[state.positionIndex]);
            minWayToGo += Math.abs(this.arr[this.n - 1] - this.arr[index]);
            return minWayToGo;
        } else {
            let minWayToGo = 0;
            minWayToGo += Math.abs(this.arr[leftIndex] - this.arr[state.positionIndex]);
            minWayToGo += Math.abs(this.arr[leftIndex] - this.arr[rightIndex]);
            minWayToGo += Math.abs(this.arr[this.n - 1] - this.arr[rightIndex]);
            return minWayToGo;
        }
    }
}
