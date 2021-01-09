import _ from "lodash";
import ChartJs from "chart.js";

export default class Chart {
    constructor(chartjsContext) {
        this.chart = new ChartJs(chartjsContext, {
            type: "line",
            data: {
                datasets: [
                    {
                        data: [],
                        label: "Path",
                        borderColor: "#a2b5af",
                        fill: false,
                        lineTension: 0,
                        pointStyle: "cross",
                        pointRadius: 8,
                        pointHoverRadius: 8,
                        pointBorderWidth: 2,
                        pointHoverBorderWidth: 2,
                        pointBorderColor: "#297d65",
                        hitRadius: 18
                    }
                ]
            },
            options: {
                animation: false,
                scales: {
                    xAxes: [{ type: "linear" }],
                    yAxes: [{ type: "linear" }]
                }
            }
        });
    }

    plotPath(path) {
        const data = _.map(path, (index, time) => ({
            x: Number(time),
            y: Number(index)
        }));

        this.chart.data.datasets[0].data = data;
        this.chart.update();
    }
}
