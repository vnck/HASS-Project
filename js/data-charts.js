

// Chart.plugins.register(ChartDataLabels);
// Chart.helpers.merge(Chart.defaults.global.plugins.datalabels, {
//     color: '#111111',
//     font: {size: 9,},
//     anchor: 'end',
//     clamp: true,
//     align: 'top',
//     offset: -3,
// });

const months = ['Jan','Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul','Aug','Sep','Oct','Nov','Dec'];

const timeseries_options = {
    scales: {
        x: {
            type: 'time',
            time: {
                unit: 'month'
            }
        }
    },
    plugins: {
        tooltip: {
            callbacks: {
                title: (context) => {
                    t = context[0].raw.x.split('-');
                    return `${months[parseInt(t[1])-1]} ${t[0]}`
                }
            }
        }
    },
}

window.onloadFuncs.push(async () => {
    let data = await d3.json('data/monthyear_aggregated_tracetogether_reactions.json');

    let lineChartArticles = new Chart(
        document.getElementById('lineChartArticles'), {
            type: 'line',
            data: {
                datasets: [{
                    label: 'No. of Articles',
                    data: data.map(d => ({x: d.monthyear, y: Number(d.n)})),
                    borderColor: 'mediumaquamarine',
                    fill: false,
                    tension: 0.3,
                }],
            },
            options: timeseries_options
        }
    )

    let lineChartLikesAndComments = new Chart(
        document.getElementById('lineChartLikesAndComments'), {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Comments',
                    data: data.map(d => ({x: d.monthyear, y: Number(d.n_comments)})),
                    borderColor: 'deepskyblue',
                    fill: false,
                    tension: 0.3,
                },{
                    label: 'Likes',
                    data: data.map(d => ({x: d.monthyear, y: Number(d.like)})),
                    borderColor: 'royalblue',
                    fill: false,
                    tension: 0.3,
                }],
            },
            options: timeseries_options
        }
    )

    let barChartSentiments = new Chart(
        document.getElementById('barChartSentiments'), {
            type: 'bar',
            data: {
                labels: ['Like','Haha','Love','Care','Wow','Sad','Angry'],
                datasets: [{
                    label: 'Reactions',
                    data: [52230,6261,6598,498,1326,516,2433],
                    backgroundColor: ['royalblue','purple','mediumorchid','palevioletred','orange','tomato','crimson'],
                }],
            },
            options: {
                scales: {
                    y: {
                        display: true,
                        type: 'logarithmic',
                    }
                }
            }
        }
    )

    let lineChartSentiments = new Chart(
        document.getElementById('lineChartSentiments'), {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Like',
                    data: data.map(d => ({x: d.monthyear, y: Number(d.like)})),
                    borderColor: 'royalblue',
                    backgroundColor: 'royalblue',
                    tension: 0.3,
                },{
                    label: 'Haha',
                    data: data.map(d => ({x: d.monthyear, y: Number(d.haha)})),
                    borderColor: 'purple',
                    backgroundColor: 'purple',
                    tension: 0.3,
                },{
                    label: 'Love',
                    data: data.map(d => ({x: d.monthyear, y: Number(d.love)})),
                    borderColor: 'mediumorchid',
                    backgroundColor: 'mediumorchid',
                    tension: 0.3,
                },{
                    label: 'Care',
                    data: data.map(d => ({x: d.monthyear, y: Number(d.care)})),
                    borderColor: 'palevioletred',
                    backgroundColor: 'palevioletred',
                    tension: 0.3,
                },{
                    label: 'Wow',
                    data: data.map(d => ({x: d.monthyear, y: Number(d.wow)})),
                    borderColor: 'orange',
                    backgroundColor: 'orange',
                    tension: 0.3,
                },{
                    label: 'Sad',
                    data: data.map(d => ({x: d.monthyear, y: Number(d.sad)})),
                    borderColor: 'tomato',
                    backgroundColor: 'tomato',
                    tension: 0.3,
                },{
                    label: 'Angry',
                    data: data.map(d => ({x: d.monthyear, y: Number(d.angry)})),
                    borderColor: 'crimson',
                    backgroundColor: 'crimson',
                    tension: 0.3,
                }],
            },
            options: timeseries_options
        }
    )

    let lineChartPosSentiments = new Chart(
        document.getElementById('lineChartPosSentiments'), {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Haha',
                    data: data.map(d => ({x: d.monthyear, y: Number(d.haha)})),
                    borderColor: 'purple',
                    backgroundColor: 'purple',
                    tension: 0.3,
                },{
                    label: 'Love',
                    data: data.map(d => ({x: d.monthyear, y: Number(d.love)})),
                    borderColor: 'mediumorchid',
                    backgroundColor: 'mediumorchid',
                    tension: 0.3,
                },{
                    label: 'Care',
                    data: data.map(d => ({x: d.monthyear, y: Number(d.care)})),
                    borderColor: 'palevioletred',
                    backgroundColor: 'palevioletred',
                    tension: 0.3,
                }],
            },
            options: timeseries_options
        }
    )

    let lineChartNegSentiments = new Chart(
        document.getElementById('lineChartNegSentiments'), {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Wow',
                    data: data.map(d => ({x: d.monthyear, y: Number(d.wow)})),
                    borderColor: 'orange',
                    backgroundColor: 'orange',
                    tension: 0.3,
                },{
                    label: 'Sad',
                    data: data.map(d => ({x: d.monthyear, y: Number(d.sad)})),
                    borderColor: 'tomato',
                    backgroundColor: 'tomato',
                    tension: 0.3,
                },{
                    label: 'Angry',
                    data: data.map(d => ({x: d.monthyear, y: Number(d.angry)})),
                    borderColor: 'crimson',
                    backgroundColor: 'crimson',
                    tension: 0.3,
                }],
            },
            options: timeseries_options
        }
    )

    let lineChartWowSentiments = new Chart(
        document.getElementById('lineChartWowSentiments'), {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Wow',
                    data: data.map(d => ({x: d.monthyear, y: Number(d.wow)})),
                    borderColor: 'orange',
                    backgroundColor: 'orange',
                    tension: 0.3,
                }],
            },
            options: timeseries_options
        }
    )
});
