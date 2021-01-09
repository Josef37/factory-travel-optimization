import _ from "lodash";
import Problem from "./Problem";
import Chart from "./chart";
import { timed } from "./utils";

function solveAndPlot(arr, processingTime) {
    const problem = new Problem(arr, processingTime);
    const path = timed(problem.solve.bind(problem));
    chart.plotPath(path);
}

function plotFromInputs() {
    const arrRaw = arrInput.value
        .split(/\D+/)
        .filter((item) => item.length)
        .map((item) => Number(item));

    const arr = _.sortedUniq(_.sortBy(arrRaw));

    let processingTime = Math.max(0, processingTimeInput.value);
    processingTimeInput.value = processingTime;

    console.log(`arr: ${arr}, processingTime: ${processingTime}`)
    solveAndPlot(arr, processingTime);
}

const chart = new Chart("chart");
const arrInput = document.querySelector("#arr");
const processingTimeInput = document.querySelector("#processingTime");
document.querySelector("#inputs").addEventListener("change", plotFromInputs);

plotFromInputs()
