import AStarSolver from "./AStarSolver";

export default class DijkstraSolver extends AStarSolver {
    heuristic(state) {
        return 0
    }
}