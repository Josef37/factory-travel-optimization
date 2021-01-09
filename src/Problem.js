import _ from "lodash";
import Heap from "heap";

export default class Problem {
    constructor(arr, processingTime) {
        const n = arr.length;
        Object.assign(this, { n, arr, processingTime });
        const firstNode = {
            time: 0,
            weight: 0,
            index: 0,
            processing: Array(this.n).fill(Infinity),
            pickedUp: Array(this.n).fill(false),
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
            if (state.processing[state.index] > this.processingTime) {
                state.processing[state.index] = this.processingTime;
            }
            // Pick stuff up at current position.
            if (state.processing[state.index] <= 0) {
                state.pickedUp[state.index] = true;
            }

            if (this.isDone(state)) {
                const getPath = (state) => {
                    if (!state) return {};
                    return {
                        ...getPath(state.prev),
                        [state.time]: this.arr[state.index]
                    };
                };
                console.log("iterations", this.iterationCount, state);

                return getPath(state);
            }

            // Wait
            if (state.processing[state.index] > 0) {
                const dt = state.processing[state.index];
                const stateWait = this.makeNewState(state, dt);
                this.insertIntoQueue(stateWait);
            }
            // Move left
            if (0 < state.index) {
                const dt = this.arr[state.index] - this.arr[state.index - 1];
                const stateLeft = this.makeNewState(state, dt, -1);
                this.insertIntoQueue(stateLeft);
            }
            // Move right
            if (state.index < this.n - 1) {
                const dt = this.arr[state.index + 1] - this.arr[state.index];
                const stateRight = this.makeNewState(state, dt, 1);
                this.insertIntoQueue(stateRight);
            }

            this.iterationCount++;
        }
    }

    isDone(state) {
        return (
            state.pickedUp.every((v) => v === true) && state.index === this.n - 1
        );
    }

    hash(state) {
        return `${state.index}/${state.processing.toString()}/${state.pickedUp.toString()}`
    }

    makeNewState(oldState, dt, di = 0) {
        const state = this.clone(oldState);
        state.time += dt;
        state.index += di;
        state.processing = state.processing.map((t) => Math.max(0, t - dt));
        state.prev = oldState;
        state.weight = state.time + this.heuristic(state);
        return state;
    }

    clone(state) {
        return {
            time: state.time,
            index: state.index,
            processing: state.processing.slice(),
            pickedUp: state.pickedUp.slice()
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
        const leftIndex = state.pickedUp.indexOf(false);
        const rightIndex = state.pickedUp.lastIndexOf(false);

        if (leftIndex === -1 && rightIndex === -1) {
            return Math.abs(this.arr[this.n - 1] - this.arr[state.index]);
        } else if (leftIndex === -1 || rightIndex === -1) {
            const index = leftIndex + rightIndex + 1;
            let minWayToGo = 0;
            minWayToGo += Math.abs(this.arr[index] - this.arr[state.index]);
            minWayToGo += Math.abs(this.arr[this.n - 1] - this.arr[index]);
            return minWayToGo;
        } else {
            let minWayToGo = 0;
            minWayToGo += Math.abs(this.arr[leftIndex] - this.arr[state.index]);
            minWayToGo += Math.abs(this.arr[leftIndex] - this.arr[rightIndex]);
            minWayToGo += Math.abs(this.arr[this.n - 1] - this.arr[rightIndex]);
            return minWayToGo;
        }
    }
}
