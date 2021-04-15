

// Chart.plugins.register(ChartDataLabels);
// Chart.helpers.merge(Chart.defaults.global.plugins.datalabels, {
//     color: '#111111',
//     font: {size: 9,},
//     anchor: 'end',
//     clamp: true,
//     align: 'top',
//     offset: -3,
// });

Chart.defaults.font.family = "'Quicksand', sans-serif !important;";

const months = ['Jan','Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul','Aug','Sep','Oct','Nov','Dec'];


window.onloadFuncs.push(async () => {
    let data = await d3.json('data/monthyear_aggregated_tracetogether_reactions.json');
    let headlines = await d3.json('data/tracetogether_reactions.json');

    let scatterChartHeadlines = new Chart(
        document.getElementById('scatterChartHeadlines'), {
            plugins: [ChartDataLabels],
            type: 'scatter',
            data : {
                datasets: [{
                    label: 'Headlines',
                    data: headlines.map(d => ({y: d.date, x: d.count, title: d.title, key_title: d.key_title})),
                    borderColor: headlines.map(d => d.key_title ? 'palevioletred' : 'mediumaquamarine'),
                    backgroundColor: headlines.map(d => d.key_title ? 'palevioletred' : 'mediumaquamarine'),
                }]
            },
            options: {
                aspectRatio: 1,
                display: 'auto',
                layout: {
                    padding: {
                        right: 400,
                    }
                },
                scales: {
                    y: {
                        type: 'timeseries',
                        reverse: true,
                        offset: true,
                        time: {
                            unit: 'month',
                            stepSize: 1,
                        },
                        title: {
                            display: true,
                            text: 'Date of Publication',
                        },
                    },
                    x: {
                        display: false,
                        title: {
                            display: true,
                            text: 'No. of Articles',
                        },
                        type: 'linear',
                        grid: {
                            display: false,
                        },
                    }
                },
                plugins: {
                    datalabels: {
                        anchor: 'center',
                        align: 'right',
                        offset: 120,
                        clip: false,
                        formatter: (value, context) => {
                          return context.dataset.data[context.dataIndex].key_title;
                        }
                    },
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            title: (context) => {
                                t = context[0].raw.y.split('-');
                                return `${parseInt(t[2])} ${months[parseInt(t[1])-1]} ${t[0]}`
                            },
                            label: function(context) {
                                let data = context.dataset.data[context.dataIndex];
                                let title = data.title;
                                let t = data.y.split('-');
                                return `${parseInt(t[2])} ${months[parseInt(t[1])-1]} ${t[0]}: ${title < 120 ? title : title.slice(0,101) + '...'}`;
                            }
                        }
                    }
                }
            }
        }
    )

    let lineChartArticles = new Chart(
        document.getElementById('lineChartArticles'), {
            type: 'line',
            data: {
                datasets: [{
                    label: 'No. of Articles',
                    data: data.map(d => ({x: d.monthyear, y: Number(d.n)})),
                    borderColor: 'mediumaquamarine',
                    backgroundColor: 'mediumaquamarine',
                    fill: false,
                    tension: 0.3,
                }],
            },
            options: {
                aspectRatio: 1.8,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'month'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'No. of Articles Published Per Month',
                    },
                    legend: {
                        display: false
                    },
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
                    backgroundColor: 'deepskyblue',
                    fill: false,
                    tension: 0.3,
                },{
                    label: 'Likes',
                    data: data.map(d => ({x: d.monthyear, y: Number(d.like)})),
                    borderColor: 'royalblue',
                    backgroundColor: 'royalblue',
                    fill: false,
                    tension: 0.3,
                }],
            },
            options: {
                aspectRatio: 1.5,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'month'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Total No. of Likes and Comments Per Month'
                    },
                    legend: {
                        labels: {
                            boxWidth: 10,
                            boxHeight: 10,
                        }
                    },
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
        }
    )

    let barChartSentiments = new Chart(
        document.getElementById('barChartSentiments'), {
            type: 'bar',
            data: {
                labels: ['Like','Love','Haha','Care','Wow','Sad','Angry'],
                datasets: [{
                    label: 'Reactions',
                    data: [52230,6598,6261,498,1326,516,2433],
                    backgroundColor: ['royalblue','purple','mediumorchid','palevioletred','orange','tomato','crimson'],
                }],
            },
            options: {
                scales: {
                    y: {
                        display: true,
                        type: 'logarithmic',
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Total No. of Reactions',
                    },
                    legend: {
                        display: false
                    },
                },
            }
        }
    )

    let lineChartSentiments = new Chart(
        document.getElementById('lineChartSentiments'), {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Love',
                    data: data.map(d => ({x: d.monthyear, y: Number(d.love)})),
                    borderColor: 'purple',
                    backgroundColor: 'purple',
                    tension: 0.3,
                },{
                    label: 'Haha',
                    data: data.map(d => ({x: d.monthyear, y: Number(d.haha)})),
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
            options: {
                aspectRatio: 1.5,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'month'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'No. of Reactions Per Month'
                    },
                    legend: {
                        labels: {
                            boxWidth: 10,
                            boxHeight: 10,
                        }
                    },
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
        }
    )

    let lineChartPosSentiments = new Chart(
        document.getElementById('lineChartPosSentiments'), {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Love',
                    data: data.map(d => ({x: d.monthyear, y: Number(d.love)})),
                    borderColor: 'purple',
                    backgroundColor: 'purple',
                    tension: 0.3,
                },{
                    label: 'Haha',
                    data: data.map(d => ({x: d.monthyear, y: Number(d.haha)})),
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
            options: {
                aspectRatio: 1.8,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'month'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'No. of Reactions Per Month'
                    },
                    legend: {
                        labels: {
                            boxWidth: 10,
                            boxHeight: 10,
                        }
                    },
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
            options: {
                aspectRatio: 1.8,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'month'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'No. of Reactions Per Month'
                    },
                    legend: {
                        labels: {
                            boxWidth: 10,
                            boxHeight: 10,
                        }
                    },
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
            options: {
                aspectRatio: 1.8,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'month'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'No. of Reactions Per Month'
                    },
                    legend: {
                        labels: {
                            boxWidth: 10,
                            boxHeight: 10,
                        }
                    },
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
        }
    )

    let options = [
        {name: 'Comments', value: 'n_comments', color: 'mediumaquamarine'},
        {name: 'Likes', value: 'like', color: 'royalblue'},
        {name: 'Love Reactions', value: 'love', color: 'purple'},
        {name: 'Haha Reactions', value: 'haha', color: 'mediumorchid'},
        {name: 'Care Reactions', value: 'care', color: 'palevioletred'},
        {name: 'Wow Reactions', value: 'wow', color: 'orange'},
        {name: 'Sad Reactions', value: 'sad', color: 'tomato'},
        {name: 'Angry Reactions', value: 'angry', color: 'crimson'}
    ]

    d3.select('#selectMenu')
        .selectAll('myOptions')
        .data(options)
        .enter()
        .append('option')
        .text(d => d.name)
        .attr('value', d => d.value);

    let scatterChartAllHeadlines = new Chart(
        document.getElementById('scatterChartAllHeadlines'), {
            type: 'scatter',
            data : {
                datasets: [{
                    label: 'Headlines',
                    data: headlines.map(d => ({x: d.date, y: d.n_comments, title: d.title})),
                    borderColor: 'mediumaquamarine',
                    backgroundColor: 'mediumaquamarine',
                }]
            },
            options: {
                aspectRatio: 2,
                display: 'auto',
                scales: {
                    x: {
                        type: 'time',
                        offset: true,
                        time: {
                            unit: 'month',
                            stepSize: 1,
                        },
                        title: {
                            display: true,
                            text: 'Date of Publication',
                        },
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'No. of Comments',
                        },
                        type: 'logarithmic',
                        min: 0.5,
                        grid: {
                            display: true,
                        },
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            title: (context) => {
                                t = context[0].raw.x.split('-');
                                return `${parseInt(t[2])} ${months[parseInt(t[1])-1]} ${t[0]}`
                            },
                            label: function(context) {
                                let data = context.dataset.data[context.dataIndex];
                                let title = data.title;
                                let t = data.x.split('-');
                                return `${parseInt(t[2])} ${months[parseInt(t[1])-1]} ${t[0]}: ${title < 120 ? title : title.slice(0,101) + '...'}`;
                            }
                        }
                    }
                }
            }
        }
    );

    d3.select('#selectMenu').on('change', d => {
        let selectedOption = d3.select('#selectMenu').property('value');
        let selectedName = options.filter(x => x.value == selectedOption)[0].name;
        let selectedColor = options.filter(x => x.value == selectedOption)[0].color;
        scatterChartAllHeadlines.data.datasets[0].data =  headlines.map(d => ({x: d.date, y: d[selectedOption], title: d.title}));
        scatterChartAllHeadlines.data.datasets[0].borderColor = selectedColor;
        scatterChartAllHeadlines.data.datasets[0].backgroundColor = selectedColor;
        scatterChartAllHeadlines.options.scales.y.title.text = 'No. of ' + selectedName;
        scatterChartAllHeadlines.update();
    })
});
