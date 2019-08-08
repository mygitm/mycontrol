function createCardSourceInit(id,cData) {
        var ccs = echarts.init(document.getElementById(id));
        ccsOption = {
            title: {
                text: '建卡渠道'
            },
            tooltip : {
                show: true,
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient : 'horizontal',
                y : 'bottom',
                data:cData
            },
            color: [ '#00ff00','#e67300'],
            series : [
                {
                    name:'建卡渠道',
                    type:'pie',
                    radius : 60,
                    center : ['50%', '40%'],
                    hoverAnimation:false,
                    itemStyle : {
                        normal : {
                            label : {
                                position : 'inner',
                                formatter : function (params) {
                                    return (params.percent - 0).toFixed(0) + '%'
                                }
                            },
                            labelLine : {
                                show : false
                            }
                        },
                        emphasis : {
                            label : {
                                show : true,
                                formatter : "{b}\n{d}%"
                            }
                        }

                    },
                    data:cData
                }
            ]
        };
        ccs.setOption(ccsOption);
    };

function createCardDetailInit (id,xData,yData) {
    var ccn = echarts.init(document.getElementById(id));
    ccnOption = {
        tooltip : {
            trigger: 'axis'
        },
        grid:{
            x:50,
            y:60,
            x2:50,
            y2:60,
        },
        xAxis: {
            type: 'category',
            axisLabel: {
                interval:0,
                rotate:40
            },
            data: xData
        },
        yAxis: {
            name : '单位 (张)',
            type: 'value'
        },
        series: [{
            name:'建卡数',
            data: yData,
            type: 'line'
        }]
    };
    ccn.setOption(ccnOption);
};

function createCardGenderInit(id,gData){
    var gender = echarts.init(document.getElementById(id));
    genderOption = {
        title : {
            text: '性别比',
            backgroundColor: '#3E9DE8',
            textStyle: {
                fontWeight: 'normal',              //标题颜色
                color: '#1b1b1b',
            }
        },
        tooltip : {
            show: true,
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        color: [ '#d2a679','#007f80','#00ff00','#e67300'],
        legend: {
            orient : 'pie',
            x : '72%',
            y:'35%',
            data:gData
        },
        series : [
            {
                name:'性别比',
                type:'pie',
                center : ['50%', '50%'],
                radius : ['45%', '70%'],
                itemStyle : {
                    normal : {
                        label : {
                            position : 'inner',
                            formatter : function (params) {
                                return (params.percent - 0).toFixed(0) + '%'
                            }
                        },
                        labelLine : {
                            show : false
                        }
                    },
                    emphasis : {
                        label : {
                            show : true,
                            formatter : "{b}\n{d}%"
                        }
                    }

                },
                data:gData
            }
        ]
    };
    gender.setOption(genderOption);
};

function swipeCardDetailInit(id,xData,yData){
    var swipeCardNum = echarts.init(document.getElementById(id));
    swipeCardOption = {
        tooltip : {
            trigger: 'axis'
        },
        grid:{
            x:50,
            y:60,
            x2:50,
            y2:55,
        },
        xAxis: {
            type: 'category',
            axisLabel: {
                interval:0,
                rotate:40
            },
            data: xData
        },
        yAxis: {
            name : '单位 (次)',
            type: 'value'
        },
        series: [{
            name:'刷卡数',
            data: yData,
            type: 'line'
        }]
    };
    swipeCardNum.setOption(swipeCardOption);
};

function ageRateInit(id,xData,yData){
    var age = echarts.init(document.getElementById(id));
    ageOption = {
        title : {
            text: '年龄比',
            backgroundColor: '#3E9DE8',
            textStyle: {
                fontWeight: 'normal',              //标题颜色
                color: '#1b1b1b',
            }
        },
        color: [ '#cc99ff'],
        grid: {
            x: '0%',
            y: '10%'
        },
        tooltip: {
            trigger: 'item',
            formatter:'{b}:{c}%'
        },
        xAxis: [
            {
                type: 'category',
                data: xData
            }
        ],
        yAxis: [
            {
                type: 'value',
                show: false
            }
        ],
        series: [
            {
                name: '年龄比',
                type: 'bar',
                barWidth : 20,
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: 'top',
                            formatter: '{c}%'
                        }
                    }
                },
                data: yData,
            }
        ]
    };
    age.setOption(ageOption);
};

function swipCardRadarInit(id,indicatorData,vData){
    var swipCardRadar = echarts.init(document.getElementById(id));
    radarOption = {
        title: {
            text: '刷卡环节雷达图'
        },
        tooltip: {
            trigger: 'item',
        },
        color: [ '#00cccc'],
        radar: [
            {
                indicator: indicatorData,
                radius: 50
            }
        ],
        series: [
            {
                type: 'radar',
                tooltip: {
                    trigger: 'item',
                    position: ['70%', '1%']
                },
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                data: [
                    {
                        value: vData,
                        name: '刷卡环节'
                    }
                ]
            }
        ]
    };
    swipCardRadar.setOption(radarOption);
};

function activityCardRateInit(id,Data){
    var dashboard = echarts.init(document.getElementById(id));
    dashboardOption = {
        backgroundColor: '#1b1b1b',
        title : {
            text: '活卡率',
            backgroundColor: '#fff',
            textStyle: {
                fontWeight: 'normal',              //标题颜色
                color: '#1b1b1b',
            }
        },
        tooltip : {
            formatter: "{b} : {c}%"
        },
        series: [
            {
                name: '活卡率',
                type: 'gauge',
                detail: {formatter:'{value}%'},
                radius: '100%',
                center : ['50%', '60%'],
                axisLine: {            // 坐标轴线
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: [[0.09, 'lime'],[0.82, '#1e90ff'],[1, '#ff4500']],
                        width: 3,
                        shadowColor : '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                axisLabel: {            // 坐标轴小标记
                    textStyle: {       // 属性lineStyle控制线条样式
                        fontWeight: 'bolder',
                        color: '#fff',
                        shadowColor : '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                axisTick: {            // 坐标轴小标记
                    length :15,        // 属性length控制线长
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: 'auto',
                        shadowColor : '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                splitLine: {           // 分隔线
                    length :25,         // 属性length控制线长
                    lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        width:3,
                        color: '#fff',
                        shadowColor : '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                pointer: {           // 分隔线
                    shadowColor : '#fff', //默认透明
                    shadowBlur: 5
                },
                title : {
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder',
                        fontSize: 20,
                        fontStyle: 'italic',
                        color: '#fff',
                        shadowColor : '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                data: Data
            }
        ]
    };
    dashboard.setOption(dashboardOption);
};

//选中与取消选中
function selectedAction(id,unSeleteId1,unSeleteId2) {
    $('#'+id).linkbutton({
        selected: true
    });
    $('#'+unSeleteId1).linkbutton({
        selected: false
    });
    $('#'+unSeleteId2).linkbutton({
        selected: false
    });
};
//折线图ajax请求函数
function lineChartAjax(id,url,date,type) {
    $.ajax({
        type: "POST",
        url: url,
        data:date,
        dataType:"json",
        success: function (result) {
            if(result.retCode==1) {
                console.info(result.data);
                if(type=="create"){
                    createCardDetailInit(id,result.data.name,result.data.value);
                }else{
                    swipeCardDetailInit(id,result.data.name,result.data.value);
                }
            }else{
                $.messager.alert('结果','请求失败！'+result.retMsg);
            }

        }
    });
};
