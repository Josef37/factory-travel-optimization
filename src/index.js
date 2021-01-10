import _ from "lodash";
import DijkstraSolver from "./solvers/DijkstraSolver";
import AStarSolver from "./solvers/AStarSolver";
import StrategySolver from "./solvers/StrategySolver";
import Chart from "./chart";
import { timed } from "./utils";

const solvers = {
    dijkstra: DijkstraSolver,
    aStar: AStarSolver,
    strategy: StrategySolver,
}

function solveAndPlot(solverName, arr, processingTime) {
    const Solver = solvers[solverName]
    const solver = new Solver(arr, processingTime);
    const path = timed(solver.solve.bind(solver));
    chart.plotPath(path);
}

function plotFromInputs() {
    const solverName = solverNameInput.value

    const arrRaw = arrInput.value
        .split(/\D+/)
        .filter((item) => item.length)
        .map((item) => Number(item));
    const arr = _.sortedUniq(_.sortBy(arrRaw));

    let processingTime = Math.max(0, processingTimeInput.value);
    processingTimeInput.value = processingTime;

    console.log(`solver: ${solverName}, arr: ${arr}, processingTime: ${processingTime}`)
    solveAndPlot(solverName, arr, processingTime);
}

const chart = new Chart("chart");
const solverNameInput = document.querySelector("#solverName")
const arrInput = document.querySelector("#arr");
const processingTimeInput = document.querySelector("#processingTime");
document.querySelector("#inputs").addEventListener("change", plotFromInputs);

plotFromInputs()
