import AStarSolver, { Direction, Factory } from "./AStarSolver"
import StrategySolver from "./StrategySolver"

describe("StrategySolver", () => {
    describe("getPossibleDirections", () => {
        it("continues left after moving left", () => {
            const solver = new StrategySolver([0, 1, 2], 5)

            const state = {
                direction: Direction.LEFT,
                positionIndex: 1,
                factoryState: [2, 3, 4]
            }
            expect(solver.getPossibleDirections(state)).toEqual({
                [Direction.WAIT]: false,
                [Direction.LEFT]: true,
                [Direction.RIGHT]: false,
            })
        })

        it("waits after moving to the leftmost undone factory", () => {
            const solver = new StrategySolver([0, 1, 2], 5)

            const state1 = {
                direction: Direction.LEFT,
                positionIndex: 1,
                factoryState: [Factory.DONE, 3, 4]
            }
            expect(solver.getPossibleDirections(state1)).toEqual({
                [Direction.WAIT]: true,
                [Direction.LEFT]: false,
                [Direction.RIGHT]: false,
            })

            const state2 = {
                direction: Direction.LEFT,
                positionIndex: 0,
                factoryState: [2, 3, 4]
            }
            expect(solver.getPossibleDirections(state2)).toEqual({
                [Direction.WAIT]: true,
                [Direction.LEFT]: false,
                [Direction.RIGHT]: false,
            })
        })

        it("continues right or turns around after moving right (not leftmost undone)", () => {
            const solver = new StrategySolver([0, 1, 2], 5)

            const state1 = {
                direction: Direction.RIGHT,
                positionIndex: 1,
                factoryState: [Factory.DONE, 5, Factory.INITIAL]
            }
            expect(solver.getPossibleDirections(state1)).toEqual({
                [Direction.WAIT]: true,
                [Direction.LEFT]: false,
                [Direction.RIGHT]: true,
            })

            const state2 = {
                direction: Direction.RIGHT,
                positionIndex: 1,
                factoryState: [4, 5, Factory.INITIAL]
            }
            expect(solver.getPossibleDirections(state2)).toEqual({
                [Direction.WAIT]: false,
                [Direction.LEFT]: true,
                [Direction.RIGHT]: true,
            })
        })

        it("can move right when moving to untouched factories or everything not right is done", () => {
            const solver = new StrategySolver([0, 1, 2], 5)

            const state1 = {
                positionIndex: 0,
                factoryState: [Factory.DONE, Factory.INITIAL, Factory.INITIAL]
            }
            expect(solver.getPossibleDirections(state1)).toEqual({
                [Direction.WAIT]: false,
                [Direction.LEFT]: false,
                [Direction.RIGHT]: true,
            })

            const state2 = {
                positionIndex: 1,
                factoryState: [Factory.DONE, 5, Factory.INITIAL]
            }
            expect(solver.getPossibleDirections(state2)).toEqual({
                [Direction.WAIT]: true,
                [Direction.LEFT]: false,
                [Direction.RIGHT]: true,
            })

            const state3 = {
                positionIndex: 0,
                factoryState: [Factory.DONE, 1, Factory.INITIAL],
                direction: Direction.LEFT
            }
            expect(solver.getPossibleDirections(state3)).toEqual({
                [Direction.WAIT]: false,
                [Direction.LEFT]: false,
                [Direction.RIGHT]: true,
            })
        })
    })

    describe("equal to Solution", () => {
        it("solves simple cases equally", () => {
            const arr = [0, 1, 2]
            for (const processingTime of [0, 1, 2]) {
                const solver1 = new AStarSolver(arr, processingTime)
                const solver2 = new StrategySolver(arr, processingTime)
                const path1 = solver1.solve()
                const path2 = solver2.solve()
                expect(path1).toEqual(path2)
            }
        })
    })
})