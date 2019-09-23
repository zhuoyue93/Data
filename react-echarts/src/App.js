import React from 'react';
import './App.css';
import  "echarts/map/js/china";
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
                    console.log(json);
                    delete  json['0'];
                    var jsondata=[];
                    for (var key in json) {
                        var areaname=key;
                        switch (key) {
                            case "1002HR100000000005OD":areaname="北京";break;
                            case "10021310000000000NYN":areaname="山西";break;
                            case "1002HR100000000003MV":areaname="福建";break;
                        }
                        jsondata.push({value:json[key], name:areaname})
                    }
                    console.log(jsondata);
                    this.setState(
                        {
                            //折线图
                            // option: {
                            //     xAxis: {data:Object.keys(json) },
                            //     series: [{data: Object.values(json)}
                            //     ]
                            // }
                            //饼状图
                            // option: {
                            //     series:[{
                            //         data:jsondata.sort(function (a, b) { return a.value - b.value; })
                            //     }]
                            // }
                            //地图
                            option: {
                                series: [{data: jsondata
                                }
                                ]
                            }
                        }
                    );

                }
            );

    };

    constructor(props) {
        super(props);
        this.state = {
            //折线图
            // option: {
            //     title: {
            //         text: '人员年龄分布',
            //         x: 'center'
            //     },
            //     tooltip: {
            //         trigger: 'axis',
            //     },
            //     xAxis: {
            //         data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            //     },
            //     yAxis: {
            //         type: 'value'
            //     },
            //     series: [
            //         {
            //             name: '人数',
            //             type: 'line',
            //             data: [1000, 2000, 1500, 3000, 2000, 1200, 800]
            //         }
            //     ]
            // }
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
            //地图
            option : {
                title: {
                    text: 'USA Population Estimates (2012)',
                    subtext: 'Data from www.census.gov',
                    sublink: 'http://www.census.gov/popest/data/datasets.html',
                    left: 'right'
                },
                tooltip: {
                    trigger: 'item',
                    showDelay: 0,
                    transitionDuration: 0.2,
                    formatter: function (params) {
                        var value = (params.value + '').split('.');
                        value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,');
                        return params.seriesName + '<br/>' + params.name + ': ' + value;
                    }
                },
                visualMap: {
                    left: 'right',
                    min: 50,
                    max: 500000,
                    inRange: {
                        color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
                    },
                    text:['High','Low'],           // 文本，默认为数值文本
                    calculable: true
                },
                toolbox: {
                    show: true,
                    //orient: 'vertical',
                    left: 'left',
                    top: 'top',
                    feature: {
                        dataView: {readOnly: false},
                        restore: {},
                        saveAsImage: {}
                    }
                },
                series: [
                    {
                        name: 'USA PopEstimates',
                        type: 'map',
                        roam: true,
                        map: 'china',
                        itemStyle:{
                            emphasis:{label:{show:true}}
                        },
                        // 文本位置修正
                        textFixed: {
                            Alaska: [20, -20]
                        },
                        data:[
                            {name: '河南', value: 4822023}

                        ]
                    }
                ]
            }
        };
    }

    /*1秒定时刷新*/
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
                <div title="折线图表之一">
                    <ReactEcharts option={this.state.option} theme="Imooc" style={{height: '400px'}}/>
                </div>
            </div>

        );
    }
}