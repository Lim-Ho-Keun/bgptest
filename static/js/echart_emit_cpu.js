// EChart

// var myChart = echarts.init(document.getElementById('echart_cpu'));
var chartDom = document.getElementById('echart_cpu');
var myChart = echarts.init(chartDom);

myChart.setOption({
    title: {
        text: 'Multi-core CPU usage vs. time'
    },
    tooltip: {},
    // legend: {
    //     data: ['CPU']
    // },
    xAxis: {
        data: [],  //x axis
        name: 'Time (min)',
        nameLocation: 'middle',
        nameGap: 25
    },
    yAxis: {
        name: 'CPU usage (%)',
        nameLocation: 'middle',
        nameGap: 35
    },
    series: [{
        name: 'CPU',
        data: [],  //y values
        type: 'bar'
    }],

    visualMap: [
        {
            show: true,
            type: 'continuous',
            seriesIndex: 0,
            min: 0,
            max: 100
        }
    ]
});


// var t_cpu = ["","","","","","","","","","", "","","","","","","","","","",
//             "","","","","","","","","","", "","","","","","","","","",""],
//     cpu = [0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,
//             0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0]


var t_cpu = Array(100).fill(""),
    cpu = Array(100).fill(0)

// console.log("before t (chart):", t_cpu);
// console.log("before cpu (chart):", cpu);

// callback function
var update_mychart = function (res) {

    // hide animation
    myChart.hideLoading();

    // prepare data
    // t_cpu.push(res.data_cpu[0]);  //push() add new item to an array
    // cpu.push(parseFloat(res.data_cpu[1]));

    // push new array to the end of the array, returns the new length
    // const count_chart =  Array.prototype.push.apply(t_cpu, res.data_cpu[0]);
    Array.prototype.push.apply(t_cpu, res.data_cpu[0]);
    Array.prototype.push.apply(cpu, res.data_cpu[1]);
    console.log("push t (chart):", t_cpu);
    console.log("push cpu (chart):", cpu);
    if (t_cpu.length >= 100) {
        // t_cpu.shift();
        // cpu.shift();
        // remove the first 10 elements
        t_cpu.splice(0, 10);
        cpu.splice(0, 10);
    }

    // fill the data
    myChart.setOption({
        xAxis: {
            data: t_cpu
        },
        series: [{
            name: 'CPU', // related to the data name in legend
            data: cpu
        }]

    });

};

// initial load the animation
myChart.showLoading();


// establish socket connection, wait for the server push data, use the callback function update chart
$(document).ready(function () {
    namespace = '/test_conn';
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port + namespace);

    socket.on('server_response_echart_cpu', function (res) {
        console.log("CPU (server):", res.data_cpu[1]);
        console.log("CPU t (server):", res.data_cpu[0]);
        console.log("Count (server):", res.count);
        update_mychart(res);
        // repeat with the interval of 10 seconds
        // let timerId = setInterval(() => console.clear(), 10*1000);
        // let timerId = setTimeout(function reset_console() {
        //   console.clear();
        //   timerId = setTimeout(reset_console, 2*1000); // (*)
        // }, 10*1000);
    });

});


// timer = 5;
// timer = setTimeout(function() {
//     console.clear()}, timer * 1000)
