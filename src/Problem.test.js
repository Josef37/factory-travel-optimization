import Problem from "./Problem";

describe("Problem", () => {
    describe("hash", () => {
        it("hashes only neccessary items", () => {
            const problem = new Problem([0, 1, 2], 1)
            const state = {
                time: 0,
                weight: 0,
                positionIndex: 0,
                factoryState: [-1, 0, 2],
                prev: null
            };
            expect(problem.hash(state)).toEqual('0/-1,0,2');
        });
    });

    describe("makeNewState", () => {
        it("works", () => {
            const problem = new Problem([0, 3, 7, 10], 2)
            const state = {
                time: 1,
                positionIndex: 1,
                factoryState: [0, 1, 3, Infinity]
            };
            expect(problem.makeNewState(state, 2, -1)).toEqual(
                expect.objectContaining({
                    time: 3,
                    positionIndex: 0,
                    factoryState: [0, 0, 1, Infinity]
                })
            );
        });
    });

    describe("insertIntoQueue", () => { });

    describe("heuristic", () => {
        it("works when everything is picked up", () => {
            const problem = new Problem([0, 3, 7], 2)
            const state = {
                positionIndex: 0,
                factoryState: [-2, -2, -2]
            };
            expect(problem.heuristic(state)).toEqual(7);
        });

        it("works when right side is done", () => {
            const problem = new Problem([0, 3, 7, 10], 1)
            const state = {
                positionIndex: 2,
                factoryState: [-1, -2, -2, -2]
            };
            expect(problem.heuristic(state)).toEqual(17);
        });

        it("works when left side is done", () => {
            const problem = new Problem([0, 3, 7, 10], 1)
            const state = {
                positionIndex: 1,
                factoryState: [-2, -2, -2, -1]
            };
            expect(problem.heuristic(state)).toEqual(7);
        });

        it("works when everything is in line", () => {
            const problem = new Problem([0, 3, 7, 10], 0)
            const state = {
                positionIndex: 0,
                factoryState: [-2, -1, -1, -2]
            };
            expect(problem.heuristic(state)).toEqual(10);
        });

        it("works when exit is on the right", () => {
            const problem = new Problem([0, 3, 7, 10], 3)
            const state = {
                positionIndex: 1,
                factoryState: [-1, -2, -1, -2]
            };
            expect(problem.heuristic(state)).toEqual(3 + 10);
        });
    });

    describe("solve", () => { });
});
