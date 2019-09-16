import React from 'react';
import logo from './logo.svg';
import './App.css';
import ReactEcharts from "echarts-for-react";


export default class App extends React.Component {
    getOptions = () => {
        fetch(`http://127.0.0.1:8002/getResult`, {
            method: 'GET',
            mode: "cors",
            headers:{
                'Accept':'application/json,text/plain,*/*'
            }
        }).then(response => response.text())
            .then(
                data => {
                    var json=JSON.parse(data);
                    delete  json['0'];
                    var jsondata=[];
                    for (var key in json) {
                        jsondata.push({value:json[key], name:key})
                    }
                    this.setState(
                        {
                            //折线图
                            option: {
                                xAxis: {data:Object.keys(json) },
                                series: [{data: Object.values(json)}
                                ]
                            }
                            //饼状图
                            // option: {
                            //     series:[{
                            //         data:jsondata.sort(function (a, b) { return a.value - b.value; })
                            //     }]
                            // }
                        }
                    );

                }
            );

    };

    constructor(props) {
        super(props);
        this.state = {
            //折线图
            option: {
                title: {
                    text: '人员年龄分布',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                },
                xAxis: {
                    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: '人数',
                        type: 'line',
                        data: [1000, 2000, 1500, 3000, 2000, 1200, 800]
                    }
                ]
            }
            //饼状图
            // option: {
            //     backgroundColor: '#2c343c',
            //
            //     title: {
            //         text: 'Customized Pie',
            //         left: 'center',
            //         top: 20,
            //         textStyle: {
            //             color: '#ccc'
            //         }
            //     },
            //
            //     tooltip: {
            //         trigger: 'item',
            //         formatter: "{a} <br/>{b} : {c} ({d}%)"
            //     },
            //
            //     visualMap: {
            //         show: false,
            //         min: 80,
            //         max: 600,
            //         inRange: {
            //             colorLightness: [0, 1]
            //         }
            //     },
            //     series: [
            //         {
            //             name: '访问来源',
            //             type: 'pie',
            //             radius: '55%',
            //             center: ['50%', '50%'],
            //             data: [
            //                 {value: 335, name: '直接访问'},
            //                 {value: 310, name: '邮件营销'},
            //                 {value: 274, name: '联盟广告'},
            //                 {value: 235, name: '视频广告'},
            //                 {value: 400, name: '搜索引擎'}
            //             ].sort(function (a, b) {
            //                 return a.value - b.value;
            //             }),
            //             roseType: 'radius',
            //             label: {
            //                 normal: {
            //                     textStyle: {
            //                         color: 'rgba(255, 255, 255, 0.3)'
            //                     }
            //                 }
            //             },
            //             labelLine: {
            //                 normal: {
            //                     lineStyle: {
            //                         color: 'rgba(255, 255, 255, 0.3)'
            //                     },
            //                     smooth: 0.2,
            //                     length: 10,
            //                     length2: 20
            //                 }
            //             },
            //             itemStyle: {
            //                 normal: {
            //                     color: '#c23531',
            //                     shadowBlur: 200,
            //                     shadowColor: 'rgba(0, 0, 0, 0.5)'
            //                 }
            //             },
            //
            //             animationType: 'scale',
            //             animationEasing: 'elasticOut',
            //             animationDelay: function (idx) {
            //                 return Math.random() * 200;
            //             }
            //         }
            //     ]
            // }
        };
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.getOptions(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }


    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <p>
                        Edit <code>src/App.js</code> and save to reload.
                    </p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>

                </header>
                <div title="折线图表之一">
                    <ReactEcharts option={this.state.option} theme="Imooc" style={{height: '400px'}}/>
                </div>
            </div>

        );
    }
}