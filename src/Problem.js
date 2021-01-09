import _ from "lodash";
import Heap from "heap";

const Factory = {
    INITIAL: -1,
    DONE: -2
}

export default class Problem {
    constructor(arr, processingTime) {
        const n = arr.length;
        Object.assign(this, { n, arr, processingTime });
        const firstNode = {
            time: 0,
            weight: 0,
            positionIndex: 0,
            factoryState: Array(this.n).fill(Factory.INITIAL),
            prev: null
        };
        this.queue = new Heap((node1, node2) => node1.weight - node2.weight)
        this.queue.push(firstNode)
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

            // Start processing at current position.
            if (state.factoryState[state.positionIndex] === Factory.INITIAL) {
                state.factoryState[state.positionIndex] = this.processingTime;
            }
            // Pick stuff up at current position.
            if (state.factoryState[state.positionIndex] === 0) {
                state.factoryState[state.positionIndex] = Factory.DONE
            }

            if (this.isDone(state)) {
                const getPath = (state) => {
                    if (!state) return {};
                    return {
                        ...getPath(state.prev),
                        [state.time]: this.arr[state.positionIndex]
                    };
                };
                console.log("iterations", this.iterationCount, state);

                return getPath(state);
            }

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

            this.iterationCount++;
        }
    }

    isDone(state) {
        return state.positionIndex === this.n - 1
            && state.factoryState.every(s => s === Factory.DONE)
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
