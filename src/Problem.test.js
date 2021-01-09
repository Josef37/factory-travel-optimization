import Problem from "./Problem";

describe("Problem", () => {
    describe("hash", () => {
        it("hashes only neccessary items", () => {
            const problem = new Problem([0, 1, 2], 1, 3);
            const state = {
                time: 0,
                weight: 0,
                index: 0,
                processing: [Infinity, 0, 2],
                pickedUp: [true, true, false],
                prev: null
            };
            expect(problem.hash(state)).toEqual(
                '{"index":0,"processing":[null,0,2],"pickedUp":[true,true,false]}'
            );
        });
    });

    describe("makeNewState", () => {
        it("works", () => {
            const problem = new Problem([0, 3, 7, 10], 2, 3);
            const state = {
                time: 1,
                index: 1,
                processing: [0, 1, 3, Infinity],
                pickedUp: [true, false, false, false]
            };
            expect(problem.makeNewState(state, 2, -1)).toEqual(
                expect.objectContaining({
                    time: 3,
                    index: 0,
                    processing: [0, 0, 1, Infinity],
                    pickedUp: [true, false, false, false]
                })
            );
        });
    });

    describe("insertIntoQueue", () => { });

    describe("heuristic", () => {
        it("works when everything is picked up", () => {
            const problem = new Problem([0, 3, 7], 2, 3);
            const state = {
                index: 0,
                pickedUp: [true, true, true]
            };
            expect(problem.heuristic(state)).toEqual(7);
        });

        it("works when right side is done", () => {
            const problem = new Problem([0, 3, 7, 10], 1, 3);
            const state = {
                index: 2,
                pickedUp: [false, true, true, true]
            };
            expect(problem.heuristic(state)).toEqual(10);
        });

        it("works when left side is done", () => {
            const problem = new Problem([0, 3, 7, 10], 1, 3);
            const state = {
                index: 1,
                pickedUp: [true, true, true, false]
            };
            expect(problem.heuristic(state)).toEqual(14);
        });

        it("works when everything is in line", () => {
            const problem = new Problem([0, 3, 7, 10], 0, 3);
            const state = {
                index: 3,
                pickedUp: [true, false, false, true]
            };
            expect(problem.heuristic(state)).toEqual(10);
        });

        it("works when exit in position are inside", () => {
            const problem = new Problem([0, 3, 7, 10], 2, 3);
            const state = {
                index: 1,
                pickedUp: [false, false, false, false]
            };
            expect(problem.heuristic(state)).toEqual(3 + 10 + 3);
        });

        it("works when exit is on the right", () => {
            const problem = new Problem([0, 3, 7, 10], 3, 3);
            const state = {
                index: 1,
                pickedUp: [false, true, false, true]
            };
            expect(problem.heuristic(state)).toEqual(3 + 10);
        });
    });

    describe("solve", () => { });
});
