import AStarSolver, { Factory } from "./AStarSolver";

describe("Problem", () => {
    describe("hash", () => {
        it("hashes only neccessary items", () => {
            const solver = new AStarSolver([0, 1, 2], 1)
            const state = {
                time: 0,
                weight: 0,
                positionIndex: 0,
                factoryState: [-1, 0, 2],
                prev: null
            };
            expect(solver.hash(state)).toEqual('0/-1,0,2');
        });
    });

    describe("makeNewState", () => {
        it("works for time, position and factories", () => {
            const problem = new AStarSolver([0, 3, 7, 10], 2)
            const state = {
                time: 1,
                positionIndex: 1,
                factoryState: [Factory.DONE, Factory.INITIAL, 1, 3]
            };
            expect(problem.makeNewState(state, 2, -1)).toEqual(
                expect.objectContaining({
                    time: 3,
                    positionIndex: 0,
                    factoryState: [Factory.DONE, Factory.INITIAL, 0, 1]
                })
            );
        });
    });

    describe("insertIntoQueue", () => {
        it("adds new states", () => {
            const problem = new AStarSolver([0], 1)
            const initialSize = problem.queue.size()
            const state = {
                time: 0,
                positionIndex: 1,
                factoryState: [Factory.DONE]
            }
            problem.insertIntoQueue(state)
            expect(problem.queue.size()).toEqual(initialSize + 1)
        })
        it("adds better states (without removing worse)", () => {
            const problem = new AStarSolver([0], 1)
            const initialSize = problem.queue.size()
            const worseState = {
                time: 2,
                positionIndex: 0,
                factoryState: [Factory.DONE]
            }
            problem.insertIntoQueue(worseState)
            expect(problem.queue.size()).toEqual(initialSize + 1)

            const betterState = { ...worseState, time: 1 }
            problem.insertIntoQueue(betterState)
            expect(problem.queue.size()).toEqual(initialSize + 2)
        })
        it("skips worse states", () => {
            const problem = new AStarSolver([0], 1)
            const initialSize = problem.queue.size()
            const betterState = {
                time: 1,
                positionIndex: 0,
                factoryState: [Factory.DONE]
            }
            problem.insertIntoQueue(betterState)
            expect(problem.queue.size()).toEqual(initialSize + 1)

            const worseState = { ...betterState, time: 2 }
            problem.insertIntoQueue(worseState)
            expect(problem.queue.size()).toEqual(initialSize + 1)
        })
    });

    describe("heuristic", () => {
        it("works when everything is picked up", () => {
            const problem = new AStarSolver([0, 3, 7], 2)
            const state = {
                positionIndex: 0,
                factoryState: [Factory.DONE, Factory.DONE, Factory.DONE]
            };
            expect(problem.heuristic(state)).toEqual(7);
        });

        it("works when right side is done", () => {
            const problem = new AStarSolver([0, 3, 7, 10], 1)
            const state = {
                positionIndex: 2,
                factoryState: [Factory.INITIAL, Factory.DONE, Factory.DONE, Factory.DONE]
            };
            expect(problem.heuristic(state)).toEqual(17);
        });

        it("works when left side is done", () => {
            const problem = new AStarSolver([0, 3, 7, 10], 1)
            const state = {
                positionIndex: 1,
                factoryState: [Factory.DONE, Factory.DONE, Factory.DONE, Factory.INITIAL]
            };
            expect(problem.heuristic(state)).toEqual(7);
        });

        it("works when everything is in line", () => {
            const problem = new AStarSolver([0, 3, 7, 10], 0)
            const state = {
                positionIndex: 0,
                factoryState: [Factory.DONE, Factory.INITIAL, Factory.INITIAL, Factory.DONE]
            };
            expect(problem.heuristic(state)).toEqual(10);
        });

        it("works when exit is on the right", () => {
            const problem = new AStarSolver([0, 3, 7, 10], 3)
            const state = {
                positionIndex: 1,
                factoryState: [Factory.INITIAL, Factory.DONE, Factory.INITIAL, Factory.DONE]
            };
            expect(problem.heuristic(state)).toEqual(3 + 10);
        });
    });

    describe("solve", () => {
        it("solves simple cases", () => {
            const arr = [0, 1, 2]
            const cases = [
                { proc: 0, total: 2 },
                { proc: 1, total: 5 },
                { proc: 2, total: 6 },
                { proc: 3, total: 6 },
                { proc: 4, total: 6 },
                { proc: 5, total: 7 },
            ]
            for (const { proc: processingTime, total: totalTime } of cases) {
                const solver = new AStarSolver(arr, processingTime)
                const path = solver.solve()
                expect(Math.max(...Object.keys(path))).toEqual(totalTime)
            }
        })
    });
});
