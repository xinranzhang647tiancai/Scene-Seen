$(function () {

    ceshis();
    ceshis1();
    ceshis2();
    ceshis3();

function ceshis() {
    var myChart = echarts.init(document.getElementById('chart1'));

    // 电影票房数据（与饼图中的电影列表保持一致）
    var moviesBoxOfficeData = [
        { name: '流浪地球2', boxOffice: 49.94, rating: 9.5 },
        { name: '八角笼中', boxOffice: 22.3, rating: 9.3 },
        { name: '满江红', boxOffice: 45.4, rating: 9.2 },
        { name: '深海', boxOffice: 9.1, rating: 9.1 },
        { name: '封神第一部', boxOffice: 26.3, rating: 9.0 },
        { name: '熊出没·伴我熊芯', boxOffice: 14.8, rating: 8.9 },
        { name: '宇宙探索编辑部', boxOffice: 8.7, rating: 8.8 },
        { name: '无名', boxOffice: 9.3, rating: 8.7 },
        { name: '南京照相馆', boxOffice: 25.1, rating: 8.7 },
        { name: '消失的她', boxOffice: 35.2, rating: 8.5 },
        { name: '捕风追影', boxOffice: 12.6, rating: 7.3 },
        { name: '浪浪山小妖怪', boxOffice: 16.2, rating: 7.2 },
        { name: '东极岛', boxOffice: 8.9, rating: 7.0 }
    ];

    // 提取电影名称、票房和评分数据
    var movieNames = moviesBoxOfficeData.map(item => item.name);
    var boxOfficeData = moviesBoxOfficeData.map(item => item.boxOffice);
    var ratingData = moviesBoxOfficeData.map(item => item.rating);

    // 用于循环滚动的数据索引
    var currentStartIndex = 0;
    var visibleCount = 6; // 一次显示6个电影
    var animationDuration = 2000; // 动画持续时间

    // 添加浮动解释文字的数据
    var floatingTexts = [
        { text: '票房数据实时更新', x: 0.15, y: 0.15, rotate: 0 },
        { text: '柱状图越高表示票房越高', x: 0.7, y: 0.3, rotate: 3 },
        { text: '折线表示观众评分', x: 0.2, y: 0.8, rotate: -2 },
        { text: '数据每3秒自动刷新', x: 0.65, y: 0.85, rotate: 1 }
    ];

    // 创建获取当前可见数据的函数
    function getCurrentVisibleData() {
        var visibleNames = [];
        var visibleBoxOffice = [];
        var visibleRating = [];
        
        for (var i = 0; i < visibleCount; i++) {
            var index = (currentStartIndex + i) % movieNames.length;
            visibleNames.push(movieNames[index]);
            visibleBoxOffice.push(boxOfficeData[index]);
            visibleRating.push(ratingData[index]);
        }
        
        return { names: visibleNames, boxOffice: visibleBoxOffice, rating: visibleRating };
    }
    
    // 更新浮动文字位置的函数
    function updateFloatingTexts() {
        floatingTexts.forEach(text => {
            // 轻微移动文字位置，创建浮动效果
            text.x = Math.max(0.05, Math.min(0.95, text.x + (Math.random() - 0.5) * 0.02));
            text.y = Math.max(0.05, Math.min(0.95, text.y + (Math.random() - 0.5) * 0.02));
            // 轻微旋转
            text.rotate = Math.max(-5, Math.min(5, text.rotate + (Math.random() - 0.5) * 1));
        });
    }

    // 设置图表配置
    function getOption() {
        var currentData = getCurrentVisibleData();
        
        // 更新浮动文字位置
        updateFloatingTexts();
        
        // 创建graphic元素数组
        var graphicElements = floatingTexts.map(text => ({
            type: 'text',
            left: text.x * 100 + '%',
            top: text.y * 100 + '%',
            style: {
                text: text.text,
                fill: '#00e5ff',
                fontSize: 16,
                fontWeight: 'bold',
                rotate: text.rotate,
                // 添加文字阴影效果增强科技感
                textShadowBlur: 15,
                textShadowColor: 'rgba(0, 229, 255, 0.8)',
                textShadowOffsetX: 2,
                textShadowOffsetY: 2
            },
            // 添加动画效果
            animation: true,
            animationDuration: 2000,
            animationEasing: 'cubicInOut',
            animationDelay: Math.random() * 1000,
            animationLoop: true
        }));
        
        return {
            title: {
                text: '',
                textStyle: {
                    color: '#ffffff',
                    fontSize: 14
                },
                left: 'center',
                top: '5%'
            },
            tooltip: {
                show: true,  // 设置为true，确保始终显示tooltip
                trigger: 'axis',
            // 添加graphic配置
            graphic: graphicElements,
                axisPointer: {
                    type: 'shadow',
                    show: true  // 确保坐标轴指示器显示
                },
                formatter: function(params) {
                    var movieName = params[0].name;
                    var boxOffice = params[0].value;
                    var rating = params[1].value;
                    return movieName + '<br/>票房: ' + boxOffice + ' 亿元<br/>评分: ' + rating;
                },
                alwaysShowContent: true,  // 始终显示tooltip内容
                enterable: true  // 允许鼠标进入tooltip区域
            },
            toolbox: {
                show: true,
                feature: {
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    magicType: { show: true, type: ['line', 'bar'] },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            grid: {
                left: '1%',
                right: '10%',
                bottom: '15%',
                top: '25%',
                containLabel: true
            },
            legend: {
                data: ['票房(亿元)', '评分'],
                textStyle: {
                    color: '#fff'
                },
                bottom: '2%'
            },
            xAxis: [{
                type: 'category',
                data: currentData.names,
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#ebf8ac'
                    },
                    rotate: 30, // 旋转角度避免名称重叠
                    interval: 0
                },
                axisLine: {
                    lineStyle: {
                        color: '#01FCE3'
                    }
                },
                splitLine: {
                    show: false
                }
            }],
            yAxis: [{
                type: 'value',
                name: '票房',
                min: 0,
                max: Math.max(...boxOfficeData) * 1.1, // 设置最大值为最大票房的1.1倍
                axisLabel: {
                    formatter: '{value} 亿元',
                    textStyle: {
                        color: '#2EC7C9'
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#01FCE3'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(1, 252, 227, 0.2)'
                    }
                }
            }, { 
                type: 'value',
                name: '评分',
                min: 0,
                max: 10,
                axisLabel: {
                    formatter: '{value}',
                    textStyle: {
                        color: '#2EC7C9'
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#01FCE3'
                    }
                },
                splitLine: {
                    show: false
                }
            }],
            series: [
                {
                    name: '票房(亿元)',
                    type: 'bar',
                    data: currentData.boxOffice,
                    itemStyle: {
                        normal: {
                            barBorderRadius: 5,
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#00FFE3'
                            }, { 
                                offset: 1,
                                color: '#4693EC'
                            }])
                        }
                    }
                }, { 
                    name: '评分',
                    type: 'line',
                    yAxisIndex: 1,
                    data: currentData.rating,
                    lineStyle: {
                        normal: {
                            width: 3,
                            color: '#F7AD3E'
                        }
                    },
                    symbol: 'circle',
                    symbolSize: 8,
                    itemStyle: {
                        normal: {
                            color: '#F7AD3E',
                            borderWidth: 2,
                            borderColor: '#fff'
                        }
                    },
                    smooth: false,  // 禁用平滑曲线，使折线更有棱角
                    step: false,    // 不使用阶梯线
                    connectNulls: false  // 不连接空值
                }
            ]
        };
    }

    // 初始渲染图表
    myChart.setOption(getOption());

    // 实现循环滚动效果
    function scrollChart() {
        currentStartIndex = (currentStartIndex + 1) % movieNames.length;
        myChart.setOption(getOption(), true);
        // 滚动后强制显示tooltip以展示最新数据
        myChart.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: 0
        });
    }

    // 设置定时器，每隔一段时间滚动一次
    setInterval(scrollChart, 3000);

    // 窗口大小变化时重新渲染图表
    window.addEventListener("resize", function() {
        myChart.resize();
    });
};

    function ceshis1() {
        var myChart = echarts.init(document.getElementById('chart2'));

        // 获取电影数据（确保使用的是统一的数据源）
        var movies = window.doubanData && window.doubanData.mockMovies || [
            { name: "满江红", rating: 9.2, type: "历史", trend: [65, 72, 78, 85, 90, 92, 93] },
            { name: "流浪地球2", rating: 9.5, type: "科幻", trend: [70, 75, 82, 88, 93, 95, 96] },
            { name: "无名", rating: 8.7, type: "悬疑", trend: [62, 68, 73, 78, 82, 85, 87] },
            { name: "熊出没·伴我熊芯", rating: 8.9, type: "动画", trend: [60, 65, 70, 76, 82, 85, 89] },
            { name: "深海", rating: 9.1, type: "奇幻", trend: [68, 73, 79, 84, 88, 90, 91] },
            // 新添加的电影
            { name: "宇宙探索编辑部", rating: 8.8, type: "科幻", trend: [65, 70, 75, 80, 84, 86, 88] },
            { name: "消失的她", rating: 8.5, type: "悬疑", trend: [60, 66, 72, 77, 81, 83, 85] },
            { name: "封神第一部", rating: 9.0, type: "奇幻", trend: [68, 74, 80, 85, 88, 89, 90] },
            { name: "八角笼中", rating: 9.3, type: "剧情", trend: [70, 76, 82, 88, 91, 92, 93] },
            { name: "捕风追影", rating: 8.1, type: "动作", trend: [58, 63, 68, 73, 77, 80, 81] },
            { name: "浪浪山小妖怪", rating: 8.5, type: "动画", trend: [60, 65, 71, 76, 80, 83, 85] },
            { name: "东极岛", rating: 7.0, type: "冒险", trend: [55, 58, 62, 65, 67, 69, 70] },
            { name: "坏蛋联盟2", rating: 7.9, type: "喜剧", trend: [56, 61, 66, 71, 75, 78, 79] },
            { name: "南京照相馆", rating: 8.7, type: "历史", trend: [62, 67, 72, 78, 82, 85, 87] }
        ];

        // 为电影分配合理的场次数据
        var ydata = movies.map(function(movie) {
            // 假设评分越高，场次越多
            var baseSessions = 50; // 基础场次
            var sessionMultiplier = movie.rating / 10; // 根据评分调整
            var sessions = Math.round(baseSessions * sessionMultiplier);
            
            return {
                name: movie.name,
                value: sessions,
                rating: movie.rating,
                type: movie.type
            };
        });

        // 设置玫瑰图颜色
        var color = ["#8d7fec", "#5085f2", "#e75fc3", "#f87be2", "#f2719a", "#fca4bb", "#f59a8f", "#fdb301", "#57e7ec", "#cf9ef1"];
        
        // 创建豆瓣电影搜索URL函数
        function getDoubanMovieUrl(movieName) {
            return 'https://search.douban.com/movie/subject_search?search_text=' + encodeURIComponent(movieName);
        }

        // 替换为南丁格尔玫瑰图配置
        option = {
            tooltip: {
                show: true,
                trigger: 'item',
                backgroundColor: 'rgba(33, 112, 147, 0.8)',
                textStyle: {
                    color: '#ffffff'
                },
                formatter: function(params) {
                    return params.name + ': ' + params.value + '场 (' + params.percent + '%)<br>评分: ' + params.data.rating + '<br>类型: ' + params.data.type;
                }
            },
            color: color,
            legend: {
            show: false,
            orient: "vertical",
            x: "left",
            top: "center",
            left: "70%",
            bottom: "0%",
            data: ydata.map(function(item) { return item.name; }),
            itemWidth: 8,
            itemHeight: 8,
            textStyle: {
                color: '#fff',
                cursor: 'pointer',
                fontSize: 10
            },
            formatter: function(name) {
                return '' + name
            }
        },
            series: [
                {
                    name: 'Nightingale Chart',
                    type: 'pie',
                emphasis: {
                    focus: 'series'
                },
                    radius: [60, 144], // 等比例放大，从[50, 120]调整到[60, 144]
                center: ['50%', '50%'], // 再向下移动0.2厘米，从48%调整到50%
                roseType: 'area', // 设置为南丁格尔玫瑰图
                    itemStyle: {
                        borderRadius: 8,
                        borderColor: '#ffffff',
                        borderWidth: 1,
                        shadowBlur: 10,  // 添加阴影效果
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    },
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false, // 将show设置为false，完全隐藏高亮时的标签
                            formatter: '{b}: {c}场 ({d}%)',
                            textStyle: {
                                color: '#fff',
                                fontSize: 10
                            }
                        }
                    },
                    // 添加labelLine配置，确保不显示标签线
                    labelLine: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false // 将show设置为false，完全隐藏高亮时的标签线
                        }
                    },
                    animationType: 'scale', // 设置入场动画类型
                    animationEasing: 'elasticOut', // 设置动画缓动效果
                    animationDelay: function(idx) {
                        // 设置每个扇区的入场延迟时间，形成依次出现的效果
                        return idx * 100;
                    },
                    data: ydata
                }
            ]
        };
        
        myChart.setOption(option);
        
        // 为玫瑰图添加点击事件，跳转到豆瓣官网
        myChart.on('click', function(params) {
            if (params.componentType === 'series' || params.componentType === 'legend') {
                var movieName = params.name;
                var doubanUrl = getDoubanMovieUrl(movieName);
                // 在新窗口打开豆瓣电影搜索页面
                window.open(doubanUrl, '_blank');
            }
        });
        
        // 添加悬停时的突出效果
        myChart.on('mouseover', function(params) {
            if (params.componentType === 'series' && params.dataIndex !== undefined) {
                // 高亮当前扇区，其他扇区透明度降低
                var emphasisIndex = params.dataIndex;
                myChart.setOption({
                    series: [{
                        type: 'pie',
                        data: ydata.map(function(item, index) {
                            return {
                                name: item.name,
                                value: item.value,
                                rating: item.rating,
                                type: item.type,
                                itemStyle: {
                                    opacity: index === emphasisIndex ? 1 : 0.5
                                }
                            };
                        })
                    }]
                });
            }
        });
        
        // 鼠标移出时恢复原始状态
        myChart.on('mouseout', function() {
            myChart.setOption({
                series: [{
                    type: 'pie',
                    data: ydata
                }]
            });
        });
        
        // 添加轮播高亮效果
        var currentIndex = -1;
        setInterval(function() {
            var dataLen = ydata.length;
            // 取消上一个高亮的扇区
            myChart.dispatchAction({
                type: 'downplay',
                seriesIndex: 0,
                dataIndex: currentIndex
            });
            currentIndex = (currentIndex + 1) % dataLen;
            // 高亮当前扇区
            myChart.dispatchAction({
                type: 'highlight',
                seriesIndex: 0,
                dataIndex: currentIndex
            });
            // 显示提示框
            myChart.dispatchAction({
                type: 'showTip',
                seriesIndex: 0,
                dataIndex: currentIndex
            });
        }, 3000);
        
        window.addEventListener("resize",function(){
            myChart.resize();
        });
    }
    function ceshis2() {
        // 初始化左上角雷达图
        var myChart = echarts.init(document.getElementById('audienceChart'));

        // 获取所有电影名称（从全局数据中获取，如果不存在则使用默认数据）
        var allMovies = window.doubanData && window.doubanData.mockMovies || [
            { name: "满江红", rating: 9.2, type: "历史" },
            { name: "流浪地球2", rating: 9.5, type: "科幻" },
            { name: "无名", rating: 8.7, type: "悬疑" },
            { name: "深海", rating: 9.1, type: "奇幻" },
            { name: "宇宙探索编辑部", rating: 8.8, type: "科幻" },
            { name: "消失的她", rating: 8.5, type: "悬疑" },
            { name: "封神第一部", rating: 9.0, type: "奇幻" },
            { name: "八角笼中", rating: 9.3, type: "剧情" },
            { name: "南京照相馆", rating: 8.7, type: "历史" }
        ];

        // 生成随机电影函数
        function getRandomMovie() {
            const randomIndex = Math.floor(Math.random() * allMovies.length);
            return allMovies[randomIndex].name;
        }

        // 初始随机选择一部电影
        let currentMovie = getRandomMovie();

        // 为不同类型的电影爱好者创建雷达图数据
        const createRadarOption = (movieName) => {
        return {
            backgroundColor: 'transparent',
            title: {
                text: movieName,
                textStyle: {
                    color: '#ffffff',
                    fontSize: 14,  // 减小字体大小
                    fontWeight: 'bold'
                },
                left: 'center',
                top: '5px'  // 向上移动标题
            },
            radar: {
                indicator: [
                    { name: '观影频率', max: 100 },
                    { name: '续集期待', max: 100 },
                    { name: '推荐意愿', max: 100 },
                    { name: '影评参与', max: 100 },
                    { name: '社交分享', max: 100 },
                    { name: '付费意愿', max: 100 }
                ],
                radius: '65%',  // 减小雷达图半径
                splitArea: {
                    areaStyle: {
                        color: ['rgba(250, 250, 250, 0.03)', 'rgba(250, 250, 250, 0.05)']
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(211, 211, 211, 0.3)'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(211, 211, 211, 0.3)'
                    }
                },
                name: {
                    textStyle: {
                        color: '#ffffff',
                        fontSize: 10  // 减小指标名称字体大小
                    }
                }
            },
            series: [
                {
                    name: '电影类型受众分析',
                    type: 'radar',
                    data: [
                        {
                            value: [90, 85, 88, 70, 65, 80],
                            name: '科幻爱好者',
                            areaStyle: {
                                color: 'rgba(255, 99, 132, 0.3)'
                            },
                            lineStyle: {
                                color: '#ff6384'
                            },
                            itemStyle: {
                                color: '#ff6384'
                            }
                        },
                        {
                            value: [75, 65, 70, 85, 80, 75],
                            name: '剧情片爱好者',
                            areaStyle: {
                                color: 'rgba(75, 192, 192, 0.3)'
                            },
                            lineStyle: {
                                color: '#4bc0c0'
                            },
                            itemStyle: {
                                color: '#4bc0c0'
                            }
                        },
                        {
                            value: [85, 70, 90, 65, 85, 70],
                            name: '喜剧片爱好者',
                            areaStyle: {
                                color: 'rgba(255, 205, 86, 0.3)'
                            },
                            lineStyle: {
                                color: '#ffcd56'
                            },
                            itemStyle: {
                                color: '#ffcd56'
                            }
                        }
                    ]
                }
            ],
            legend: {
                data: ['科幻爱好者', '剧情片爱好者', '喜剧片爱好者'],
                textStyle: {
                    color: '#fff',
                    fontSize: 10  // 减小图例字体大小
                },
                bottom: -10,
                left: 'center',  // 居中显示图例
                orient: 'horizontal' // 水平排列图例
            }
        };
    };

        // 设置初始图表
        myChart.setOption(createRadarOption(currentMovie));

         // 添加浮动效果和动态刷新电影名称的功能
        let currentIndex = 0; // 从第一个点开始
        const seriesIndex = 0; // 固定选择第一个系列
        const dataLen = 6; // 雷达图指标数量

        setInterval(() => {
            // 随机选择一部新电影
            currentMovie = getRandomMovie();
            
            // 更新图表标题，仅显示电影名称并保持位置
            myChart.setOption({
                title: {
                        text: currentMovie,
                        left: '50%', // 水平居中
                        top: '11px', // 垂直位置
                        textAlign: 'center'
                    }
            });
            
            // 移除之前的高亮
            myChart.dispatchAction({
                type: 'downplay',
                seriesIndex: seriesIndex,
                dataIndex: currentIndex
            });
            
            // 循环高亮下一个数据点
            currentIndex = (currentIndex + 1) % dataLen;
            
            // 高亮当前数据点
            myChart.dispatchAction({
                type: 'highlight',
                seriesIndex: seriesIndex,
                dataIndex: currentIndex
            });
            
            // 显示提示框
            myChart.dispatchAction({
                type: 'showTip',
                seriesIndex: seriesIndex,
                dataIndex: currentIndex
            });
        }, 6000); // 每6秒更新一次，使动画效果更缓慢

        // 响应窗口大小变化
        window.addEventListener("resize", function() {
            myChart.resize();
        });
    }
    function ceshis3() {
        var myChart = echarts.init(document.getElementById('chart4'));

        // 存储图表实例到全局
        window.chart4 = myChart;
        
        // 获取豆瓣数据，如果不存在则使用默认数据
        var chartData = window.doubanChartData || {
            categories: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            series: [
                { name: 'Line 1', type: 'line', stack: 'Total', smooth: true, lineStyle: { width: 0 }, showSymbol: false, areaStyle: { opacity: 0.8, color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgb(128, 255, 165)' }, { offset: 1, color: 'rgb(1, 191, 236)' }]) }, emphasis: { focus: 'series' }, data: [140, 232, 101, 264, 90, 340, 250] },
                { name: 'Line 2', type: 'line', stack: 'Total', smooth: true, lineStyle: { width: 0 }, showSymbol: false, areaStyle: { opacity: 0.8, color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgb(0, 221, 255)' }, { offset: 1, color: 'rgb(77, 119, 255)' }]) }, emphasis: { focus: 'series' }, data: [120, 282, 111, 234, 220, 340, 310] },
                { name: 'Line 3', type: 'line', stack: 'Total', smooth: true, lineStyle: { width: 0 }, showSymbol: false, areaStyle: { opacity: 0.8, color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgb(55, 162, 255)' }, { offset: 1, color: 'rgb(116, 21, 219)' }]) }, emphasis: { focus: 'series' }, data: [320, 132, 201, 334, 190, 130, 220] },
                { name: 'Line 4', type: 'line', stack: 'Total', smooth: true, lineStyle: { width: 0 }, showSymbol: false, areaStyle: { opacity: 0.8, color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgb(255, 0, 135)' }, { offset: 1, color: 'rgb(135, 0, 157)' }]) }, emphasis: { focus: 'series' }, data: [220, 402, 231, 134, 190, 230, 120] },
                { name: 'Line 5', type: 'line', stack: 'Total', smooth: true, lineStyle: { width: 0 }, showSymbol: false, areaStyle: { opacity: 0.8, color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgb(255, 191, 0)' }, { offset: 1, color: 'rgb(224, 62, 76)' }]) }, emphasis: { focus: 'series' }, data: [220, 302, 181, 234, 210, 290, 150] }
            ]
        };

        option = {
            color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
            title: {
                text: '最近热播',
                textStyle: {
                    color: '#ffffff'
                }
            },
            tooltip: {
                show: false,
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            legend: {
                data: chartData.series.map(function(s) { return s.name; }),
                textStyle: {
                    color: '#ffffff'
                }
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top: '15%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: chartData.categories,
                    axisLabel: {
                        color: '#ffffff'
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#01FCE3'
                        }
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        color: '#ffffff'
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#01FCE3'
                        }
                    }
                }
            ],
            series: chartData.series
        };

        // 使用刚指定的配置项和数据显示图表
        myChart.setOption(option);
        window.addEventListener("resize", function(){
            myChart.resize();
        });
    }


    function ceshis5() {
        var myChart = echarts.init(document.getElementById('chart_1'));


        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize",function(){
            myChart.resize();
        });
    }


});
// 添加电影评分排行榜函数
function initMovieRatingRanking() {
    // 创建排行榜容器
    var rankingContainer = document.querySelector('.center-right .right-top');
    if (!rankingContainer) {
        console.log('未找到排行榜容器');
        return;
    }
    
    // 获取电影数据（从票房数据中获取，确保与页面显示一致）
    var moviesData = [
        { name: '流浪地球2', boxOffice: 49.94, rating: 9.5 },
        { name: '八角笼中', boxOffice: 22.3, rating: 9.3 },
        { name: '满江红', boxOffice: 45.4, rating: 9.2 },
        { name: '深海', boxOffice: 9.1, rating: 9.1 },
        { name: '封神第一部', boxOffice: 26.3, rating: 9.0 },
        { name: '熊出没·伴我熊芯', boxOffice: 14.8, rating: 8.9 },
        { name: '宇宙探索编辑部', boxOffice: 8.7, rating: 8.8 },
        { name: '无名', boxOffice: 9.3, rating: 8.7 },
        { name: '南京照相馆', boxOffice: 25.1, rating: 8.7 },
        { name: '消失的她', boxOffice: 35.2, rating: 8.5 },
        { name: '捕风追影', boxOffice: 12.6, rating: 7.3 },
        { name: '浪浪山小妖怪', boxOffice: 16.2, rating: 7.2 },
        { name: '东极岛', boxOffice: 8.9, rating: 7.0 }
    ];
    
    // 按照评分从高到低排序
    moviesData.sort(function(a, b) {
        return b.rating - a.rating;
    });
    
    // 创建排行榜列表
    var scrollContainer = document.createElement('div');
    scrollContainer.className = 'rating-scroll-container';
    
    var rankingList = document.createElement('ul');
    rankingList.className = 'rating-ranking-list';
    
    // 添加排行榜项
    moviesData.forEach(function(movie, index) {
        var listItem = document.createElement('li');
        listItem.className = 'movie-ranking-item';
        
        // 排名数字
        var rankNumber = document.createElement('span');
        rankNumber.className = 'rank-number';
        rankNumber.textContent = (index + 1) + '.';
        
        // 电影名称
        var movieName = document.createElement('span');
        movieName.className = 'movie-name';
        movieName.textContent = movie.name;
        
        // 电影评分
        var movieRating = document.createElement('span');
        movieRating.className = 'movie-rating';
        movieRating.textContent = movie.rating.toFixed(1);
        
        // 组装元素
        listItem.appendChild(rankNumber);
        listItem.appendChild(movieName);
        listItem.appendChild(movieRating);
        rankingList.appendChild(listItem);
    });
    
    scrollContainer.appendChild(rankingList);
    rankingContainer.appendChild(scrollContainer);
    
    // 实现自动滚动效果
    var itemHeight = 41; // 每个排行榜项的高度（36px高度 + 5px margin-bottom）
    var visibleItems = 5; // 可见的排行榜项数量
    var totalHeight = rankingList.children.length * itemHeight;
    var maxScroll = totalHeight - (visibleItems * itemHeight);
    var currentPosition = 0;
    var scrollSpeed = 0.3; // 滚动速度
    
    function scrollAnimation() {
        currentPosition += scrollSpeed;
        if (currentPosition >= maxScroll) {
            // 重置到顶部
            currentPosition = 0;
            // 重置transform
            rankingList.style.transform = 'translateY(0)';
            // 克隆第一个元素添加到末尾，实现无缝滚动
            var firstItem = rankingList.firstElementChild.cloneNode(true);
            rankingList.appendChild(firstItem);
            // 重新计算总高度
            totalHeight = rankingList.children.length * itemHeight;
            maxScroll = totalHeight - (visibleItems * itemHeight);
        } else {
            rankingList.style.transform = 'translateY(-' + currentPosition + 'px)';
        }
        
        window.animationFrameId = requestAnimationFrame(scrollAnimation);
    }
    
    // 开始滚动动画
    scrollAnimation();
    
    // 添加鼠标悬停时暂停滚动效果
    scrollContainer.addEventListener('mouseenter', function() {
        cancelAnimationFrame(window.animationFrameId);
    });
    
    scrollContainer.addEventListener('mouseleave', function() {
        window.animationFrameId = requestAnimationFrame(scrollAnimation);
    });
}

$(document).ready(function() {
    // 等待doubanData初始化完成
    setTimeout(function() {
        ceshis();
        ceshis1();
        ceshis2();
        ceshis3();
        // 初始化电影评分排行榜
        initMovieRatingRanking();
    }, 500);

function ceshis() {
    var myChart = echarts.init(document.getElementById('chart1'));

    // 电影票房数据（与饼图中的电影列表保持一致）
    var moviesBoxOfficeData = [
        { name: '流浪地球2', boxOffice: 49.94, rating: 9.5 },
        { name: '八角笼中', boxOffice: 22.3, rating: 9.3 },
        { name: '满江红', boxOffice: 45.4, rating: 9.2 },
        { name: '深海', boxOffice: 9.1, rating: 9.1 },
        { name: '封神第一部', boxOffice: 26.3, rating: 9.0 },
        { name: '熊出没·伴我熊芯', boxOffice: 14.8, rating: 8.9 },
        { name: '宇宙探索编辑部', boxOffice: 8.7, rating: 8.8 },
        { name: '无名', boxOffice: 9.3, rating: 8.7 },
        { name: '南京照相馆', boxOffice: 25.1, rating: 8.7 },
        { name: '消失的她', boxOffice: 35.2, rating: 8.5 },
        { name: '捕风追影', boxOffice: 12.6, rating: 7.3 },
        { name: '浪浪山小妖怪', boxOffice: 16.2, rating: 7.2 },
        { name: '东极岛', boxOffice: 8.9, rating: 7.0 }
    ];

    // 提取电影名称、票房和评分数据
    var movieNames = moviesBoxOfficeData.map(item => item.name);
    var boxOfficeData = moviesBoxOfficeData.map(item => item.boxOffice);
    var ratingData = moviesBoxOfficeData.map(item => item.rating);

    // 用于循环滚动的数据索引
    var currentStartIndex = 0;
    var visibleCount = 6; // 一次显示6个电影
    var animationDuration = 2000; // 动画持续时间

    // 创建获取当前可见数据的函数
    function getCurrentVisibleData() {
        var visibleNames = [];
        var visibleBoxOffice = [];
        var visibleRating = [];
        
        for (var i = 0; i < visibleCount; i++) {
            var index = (currentStartIndex + i) % movieNames.length;
            visibleNames.push(movieNames[index]);
            visibleBoxOffice.push(boxOfficeData[index]);
            visibleRating.push(ratingData[index]);
        }
        
        return { names: visibleNames, boxOffice: visibleBoxOffice, rating: visibleRating };
    }

    // 设置图表配置
    function getOption() {
        var currentData = getCurrentVisibleData();
        
        return {
            title: {
                text: '',
                textStyle: {
                    color: '#ffffff',
                    fontSize: 14
                },
                left: 'center',
                top: '5%'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function(params) {
                    var movieName = params[0].name;
                    var boxOffice = params[0].value;
                    var rating = params[1].value;
                    return movieName + '<br/>票房: ' + boxOffice + ' 亿元<br/>评分: ' + rating;
                }
            },
            toolbox: {
                show: true,
                feature: {
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    magicType: { show: true, type: ['line', 'bar'] },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            grid: {
                left: '5%',
                right: '4%',
                bottom: '15%',
                top: '20%',
                containLabel: true
            },
            legend: {
                data: ['票房(亿元)', '评分'],
                textStyle: {
                    color: '#fff'
                },
                bottom: '2%'
            },
            xAxis: [{
                type: 'category',
                data: currentData.names,
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#ebf8ac'
                    },
                    rotate: 30, // 旋转角度避免名称重叠
                    interval: 0
                },
                axisLine: {
                    lineStyle: {
                        color: '#01FCE3'
                    }
                },
                splitLine: {
                    show: false
                }
            }],
            yAxis: [{
                type: 'value',
                name: '票房',
                min: 0,
                max: Math.max(...boxOfficeData) * 1.1, // 设置最大值为最大票房的1.1倍
                axisLabel: {
                    formatter: '{value} 亿元',
                    textStyle: {
                        color: '#2EC7C9'
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#01FCE3'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(1, 252, 227, 0.2)'
                    }
                }
            }, { 
                type: 'value',
                name: '评分',
                min: 0,
                max: 10,
                axisLabel: {
                    formatter: '{value}',
                    textStyle: {
                        color: '#2EC7C9'
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#01FCE3'
                    }
                },
                splitLine: {
                    show: false
                }
            }],
            series: [
                {
                    name: '票房(亿元)',
                    type: 'bar',
                    data: currentData.boxOffice,
                    itemStyle: {
                        normal: {
                            barBorderRadius: 5,
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#00FFE3'
                            }, { 
                                offset: 1,
                                color: '#4693EC'
                            }])
                        }
                    }
                }, { 
                    name: '评分',
                    type: 'line',
                    yAxisIndex: 1,
                    data: currentData.rating,
                    lineStyle: {
                        normal: {
                            width: 3,
                            color: '#F7AD3E'
                        }
                    },
                    symbol: 'circle',
                    symbolSize: 8,
                    itemStyle: {
                        normal: {
                            color: '#F7AD3E',
                            borderWidth: 2,
                            borderColor: '#fff'
                        }
                    },
                    smooth: false,  // 禁用平滑曲线，使折线更有棱角
                    step: false,    // 不使用阶梯线
                    connectNulls: false  // 不连接空值
                }
            ]
        };
    }

    // 初始渲染图表
    myChart.setOption(getOption());

    // 实现循环滚动效果
    function scrollChart() {
        currentStartIndex = (currentStartIndex + 1) % movieNames.length;
        myChart.setOption(getOption(), true);
    }

    // 设置定时器，每隔一段时间滚动一次
    setInterval(scrollChart, 3000);

    // 窗口大小变化时重新渲染图表
    window.addEventListener("resize", function() {
        myChart.resize();
    });
};

    function ceshis1() {
        var myChart = echarts.init(document.getElementById('chart2'));

        // 获取电影数据（确保使用的是统一的数据源）
        var movies = window.doubanData && window.doubanData.mockMovies || [
            { name: "满江红", rating: 9.2, type: "历史", trend: [65, 72, 78, 85, 90, 92, 93] },
            { name: "流浪地球2", rating: 9.5, type: "科幻", trend: [70, 75, 82, 88, 93, 95, 96] },
            { name: "无名", rating: 8.7, type: "悬疑", trend: [62, 68, 73, 78, 82, 85, 87] },
            { name: "熊出没·伴我熊芯", rating: 8.9, type: "动画", trend: [60, 65, 70, 76, 82, 85, 89] },
            { name: "深海", rating: 9.1, type: "奇幻", trend: [68, 73, 79, 84, 88, 90, 91] },
            // 新添加的电影
            { name: "宇宙探索编辑部", rating: 8.8, type: "科幻", trend: [65, 70, 75, 80, 84, 86, 88] },
            { name: "消失的她", rating: 8.5, type: "悬疑", trend: [60, 66, 72, 77, 81, 83, 85] },
            { name: "封神第一部", rating: 9.0, type: "奇幻", trend: [68, 74, 80, 85, 88, 89, 90] },
            { name: "八角笼中", rating: 9.3, type: "剧情", trend: [70, 76, 82, 88, 91, 92, 93] },
            { name: "捕风追影", rating: 8.1, type: "动作", trend: [58, 63, 68, 73, 77, 80, 81] },
            { name: "浪浪山小妖怪", rating: 8.5, type: "动画", trend: [60, 65, 71, 76, 80, 83, 85] },
            { name: "东极岛", rating: 7.0, type: "冒险", trend: [55, 58, 62, 65, 67, 69, 70] },
            { name: "坏蛋联盟2", rating: 7.9, type: "喜剧", trend: [56, 61, 66, 71, 75, 78, 79] },
            { name: "南京照相馆", rating: 8.7, type: "历史", trend: [62, 67, 72, 78, 82, 85, 87] }
        ];

        // 为电影分配合理的场次数据
        var ydata = movies.map(function(movie) {
            // 假设评分越高，场次越多
            var baseSessions = 50; // 基础场次
            var sessionMultiplier = movie.rating / 10; // 根据评分调整
            var sessions = Math.round(baseSessions * sessionMultiplier);
            
            return {
                name: movie.name,
                value: sessions,
                rating: movie.rating,
                type: movie.type
            };
        });

        // 设置玫瑰图颜色
        var color = ["#8d7fec", "#5085f2", "#e75fc3", "#f87be2", "#f2719a", "#fca4bb", "#f59a8f", "#fdb301", "#57e7ec", "#cf9ef1"];
        
        // 创建豆瓣电影搜索URL函数
        function getDoubanMovieUrl(movieName) {
            return 'https://search.douban.com/movie/subject_search?search_text=' + encodeURIComponent(movieName);
        }

        // 替换为南丁格尔玫瑰图配置
        option = {
            tooltip: {
                show: true,
                trigger: 'item',
                backgroundColor: 'rgba(33, 112, 147, 0.8)',
                textStyle: {
                    color: '#ffffff'
                },
                formatter: function(params) {
                    return params.name + ': ' + params.value + '场 (' + params.percent + '%)<br>评分: ' + params.data.rating + '<br>类型: ' + params.data.type;
                }
            },
            color: color,
            legend: {
                show: false,
                orient: "vertical",
                x: "left",
                top: "center",
                left: "70%",
                bottom: "0%",
                data: ydata.map(function(item) { return item.name; }),
                itemWidth: 8,
                itemHeight: 8,
                textStyle: {
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: 12
                },
                formatter: function(name) {
                    return '' + name
                }
            },
            series: [
                {
                    name: 'Nightingale Chart',
                    type: 'pie',
                    radius: [60, 144], // 等比例放大，从[50, 120]调整到[60, 144]
                    center: ['50%', '50%'], // 再向下移动0.2厘米，从48%调整到50%
                    roseType: 'area', // 设置为南丁格尔玫瑰图
                    itemStyle: {
                        borderRadius: 8,
                        borderColor: '#ffffff',
                        borderWidth: 1,
                        shadowBlur: 10,  // 添加阴影效果
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    },
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false, // 将show设置为false，完全隐藏高亮时的标签
                            formatter: '{b}: {c}场 ({d}%)',
                            textStyle: {
                                color: '#fff',
                                fontSize: 10
                            },
                            position: 'inside' // 确保标签在内部显示
                        }
                    },
                    // 添加labelLine配置，确保不显示标签线
                    labelLine: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false // 将show设置为false，完全隐藏高亮时的标签线
                        }
                    },
                    animationType: 'scale', // 设置入场动画类型
                    animationEasing: 'elasticOut', // 设置动画缓动效果
                    animationDelay: function(idx) {
                        // 设置每个扇区的入场延迟时间，形成依次出现的效果
                        return idx * 100;
                    },
                    data: ydata
                }
            ]
        };
        
        myChart.setOption(option);
        
        // 为玫瑰图添加点击事件，跳转到豆瓣官网
        myChart.on('click', function(params) {
            if (params.componentType === 'series' || params.componentType === 'legend') {
                var movieName = params.name;
                var doubanUrl = getDoubanMovieUrl(movieName);
                // 在新窗口打开豆瓣电影搜索页面
                window.open(doubanUrl, '_blank');
            }
        });
        
        // 添加悬停时的突出效果
        myChart.on('mouseover', function(params) {
            if (params.componentType === 'series' && params.dataIndex !== undefined) {
                // 高亮当前扇区，其他扇区透明度降低
                var emphasisIndex = params.dataIndex;
                myChart.setOption({
                    series: [{
                        type: 'pie',
                        data: ydata.map(function(item, index) {
                            return {
                                name: item.name,
                                value: item.value,
                                rating: item.rating,
                                type: item.type,
                                itemStyle: {
                                    opacity: index === emphasisIndex ? 1 : 0.5
                                }
                            };
                        })
                    }]
                });
            }
        });
        
        // 鼠标移出时恢复原始状态
        myChart.on('mouseout', function() {
            myChart.setOption({
                series: [{
                    type: 'pie',
                    data: ydata
                }]
            });
        });
        
        // 添加轮播高亮效果
        var currentIndex = -1;
        setInterval(function() {
            var dataLen = ydata.length;
            // 取消上一个高亮的扇区
            myChart.dispatchAction({
                type: 'downplay',
                seriesIndex: 0,
                dataIndex: currentIndex
            });
            currentIndex = (currentIndex + 1) % dataLen;
            // 高亮当前扇区
            myChart.dispatchAction({
                type: 'highlight',
                seriesIndex: 0,
                dataIndex: currentIndex
            });
            // 显示提示框
            myChart.dispatchAction({
                type: 'showTip',
                seriesIndex: 0,
                dataIndex: currentIndex
            });
        }, 3000);
        
        window.addEventListener("resize",function(){
            myChart.resize();
        });
    }
    function ceshis2() {
        // 初始化左上角雷达图
        var myChart = echarts.init(document.getElementById('audienceChart'));

        // 获取所有电影名称（从全局数据中获取，如果不存在则使用默认数据）
        var allMovies = window.doubanData && window.doubanData.mockMovies || [
            { name: "满江红", rating: 9.2, type: "历史" },
            { name: "流浪地球2", rating: 9.5, type: "科幻" },
            { name: "无名", rating: 8.7, type: "悬疑" },
            { name: "深海", rating: 9.1, type: "奇幻" },
            { name: "宇宙探索编辑部", rating: 8.8, type: "科幻" },
            { name: "消失的她", rating: 8.5, type: "悬疑" },
            { name: "封神第一部", rating: 9.0, type: "奇幻" },
            { name: "八角笼中", rating: 9.3, type: "剧情" },
            { name: "南京照相馆", rating: 8.7, type: "历史" }
        ];

        // 生成随机电影函数
        function getRandomMovie() {
            const randomIndex = Math.floor(Math.random() * allMovies.length);
            return allMovies[randomIndex].name;
        }

        // 初始随机选择一部电影
        let currentMovie = getRandomMovie();

        // 为不同类型的电影创建对应的雷达图数据
        const movieRadarDataMap = {
            "科幻": {
                "科幻爱好者": [95, 90, 92, 75, 70, 85],
                "剧情片爱好者": [70, 60, 65, 80, 75, 70],
                "喜剧片爱好者": [80, 65, 85, 60, 80, 65]
            },
            "历史": {
                "科幻爱好者": [65, 55, 60, 85, 80, 65],
                "剧情片爱好者": [90, 80, 85, 90, 85, 80],
                "喜剧片爱好者": [70, 60, 75, 70, 75, 65]
            },
            "悬疑": {
                "科幻爱好者": [80, 75, 85, 85, 80, 75],
                "剧情片爱好者": [85, 75, 80, 90, 85, 80],
                "喜剧片爱好者": [75, 65, 80, 75, 80, 70]
            },
            "奇幻": {
                "科幻爱好者": [90, 85, 90, 75, 75, 80],
                "剧情片爱好者": [80, 70, 75, 85, 80, 75],
                "喜剧片爱好者": [85, 70, 85, 65, 80, 70]
            },
            "剧情": {
                "科幻爱好者": [75, 65, 70, 90, 85, 75],
                "剧情片爱好者": [95, 85, 90, 95, 90, 85],
                "喜剧片爱好者": [80, 70, 85, 75, 85, 75]
            }
        };

        // 获取电影类型的函数
        function getMovieType(movieName) {
            // 从allMovies数组中查找对应的电影类型
            for (let i = 0; i < allMovies.length; i++) {
                if (allMovies[i].name === movieName) {
                    return allMovies[i].type;
                }
            }
            // 默认返回科幻类型
            return "科幻";
        }

        // 为不同类型的电影创建雷达图数据
        const createRadarOption = (movieName) => {
            const movieType = getMovieType(movieName);
            const radarData = movieRadarDataMap[movieType] || movieRadarDataMap["科幻"];
            
            return {
                backgroundColor: 'transparent',
                title: {
                    text: movieName,
                    textStyle: {
                        color: '#ffffff',
                        fontSize: 14,
                        fontWeight: 'bold'
                    },
                    left: 'center',
                    top: '5px'
                },
                radar: {
                    indicator: [
                        { name: '观影频率', max: 100 },
                        { name: '续集期待', max: 100 },
                        { name: '推荐意愿', max: 100 },
                        { name: '影评参与', max: 100 },
                        { name: '社交分享', max: 100 },
                        { name: '付费意愿', max: 100 }
                    ],
                    radius: '65%',
                    splitArea: {
                        areaStyle: {
                            color: ['rgba(250, 250, 250, 0.03)', 'rgba(250, 250, 250, 0.05)']
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(211, 211, 211, 0.3)'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(211, 211, 211, 0.3)'
                        }
                    },
                    name: {
                        textStyle: {
                            color: '#ffffff',
                            fontSize: 10
                        }
                    }
                },
                series: [
                    {
                        name: '电影类型受众分析',
                        type: 'radar',
                        data: [
                            {
                                value: radarData["科幻爱好者"],
                                name: '科幻爱好者',
                                areaStyle: {
                                    color: 'rgba(255, 99, 132, 0.3)'
                                },
                                lineStyle: {
                                    color: '#ff6384'
                                },
                                itemStyle: {
                                    color: '#ff6384'
                                }
                            },
                            {
                                value: radarData["剧情片爱好者"],
                                name: '剧情片爱好者',
                                areaStyle: {
                                    color: 'rgba(75, 192, 192, 0.3)'
                                },
                                lineStyle: {
                                    color: '#4bc0c0'
                                },
                                itemStyle: {
                                    color: '#4bc0c0'
                                }
                            },
                            {
                                value: radarData["喜剧片爱好者"],
                                name: '喜剧片爱好者',
                                areaStyle: {
                                    color: 'rgba(255, 205, 86, 0.3)'
                                },
                                lineStyle: {
                                    color: '#ffcd56'
                                },
                                itemStyle: {
                                    color: '#ffcd56'
                                }
                            }
                        ]
                    }
                ],
                legend: {
                    data: ['科幻爱好者', '剧情片爱好者', '喜剧片爱好者'],
                    textStyle: {
                        color: '#fff',
                        fontSize: 10
                    },
                    bottom: -10,
                    left: 'center',
                    orient: 'horizontal'
                }
            };
        };

        // 设置初始图表
        myChart.setOption(createRadarOption(currentMovie));

        // 添加浮动效果，每3秒按顺序移动一次高亮点
        let currentIndex = 0; // 从第一个点开始
        const seriesIndex = 0; // 固定选择第一个系列
        const dataLen = 6; // 雷达图指标数量

        // 添加电影名称滚动效果，每3秒切换一次电影
        let movieIndex = 0; // 从第一个电影开始
        const moviesLen = allMovies.length;

        setInterval(() => {
            // 移除之前的高亮
            myChart.dispatchAction({
                type: 'downplay',
                seriesIndex: seriesIndex,
                dataIndex: currentIndex
            });
            
            // 循环高亮下一个数据点（按顺序移动）
            currentIndex = (currentIndex + 1) % dataLen;
            
            // 每3次数据点移动，切换一次电影名称（即每9秒切换一次电影）
            // 如果要改为每3秒切换一次电影，可以将条件改为 if (currentIndex === 0)
            if (currentIndex === 0) {
                // 切换到下一个电影
                movieIndex = (movieIndex + 1) % moviesLen;
                currentMovie = allMovies[movieIndex].name;
                
                // 更新图表标题（电影名称）
                myChart.setOption({
                    title: {
                        text: currentMovie
                    }
                });
            }
            
            // 高亮当前数据点
            myChart.dispatchAction({
                type: 'highlight',
                seriesIndex: seriesIndex,
                dataIndex: currentIndex
            });
            
            // 显示提示框
            myChart.dispatchAction({
                type: 'showTip',
                seriesIndex: seriesIndex,
                dataIndex: currentIndex
            });
        }, 3000); // 每3秒更新一次

        // 响应窗口大小变化
        window.addEventListener("resize", function() {
            myChart.resize();
        });
    }
    function ceshis3() {
        var myChart = echarts.init(document.getElementById('chart4'));

        // 存储图表实例到全局
        window.chart4 = myChart;
        
        // 获取豆瓣数据，如果不存在则使用默认数据
        var chartData = window.doubanChartData || {
            categories: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            series: [
                { name: 'Line 1', type: 'line', stack: 'Total', smooth: true, lineStyle: { width: 0 }, showSymbol: false, areaStyle: { opacity: 0.8, color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgb(128, 255, 165)' }, { offset: 1, color: 'rgb(1, 191, 236)' }]) }, emphasis: { focus: 'series' }, data: [140, 232, 101, 264, 90, 340, 250] },
                { name: 'Line 2', type: 'line', stack: 'Total', smooth: true, lineStyle: { width: 0 }, showSymbol: false, areaStyle: { opacity: 0.8, color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgb(0, 221, 255)' }, { offset: 1, color: 'rgb(77, 119, 255)' }]) }, emphasis: { focus: 'series' }, data: [120, 282, 111, 234, 220, 340, 310] },
                { name: 'Line 3', type: 'line', stack: 'Total', smooth: true, lineStyle: { width: 0 }, showSymbol: false, areaStyle: { opacity: 0.8, color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgb(55, 162, 255)' }, { offset: 1, color: 'rgb(116, 21, 219)' }]) }, emphasis: { focus: 'series' }, data: [320, 132, 201, 334, 190, 130, 220] },
                { name: 'Line 4', type: 'line', stack: 'Total', smooth: true, lineStyle: { width: 0 }, showSymbol: false, areaStyle: { opacity: 0.8, color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgb(255, 0, 135)' }, { offset: 1, color: 'rgb(135, 0, 157)' }]) }, emphasis: { focus: 'series' }, data: [220, 402, 231, 134, 190, 230, 120] },
                { name: 'Line 5', type: 'line', stack: 'Total', smooth: true, lineStyle: { width: 0 }, showSymbol: false, areaStyle: { opacity: 0.8, color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgb(255, 191, 0)' }, { offset: 1, color: 'rgb(224, 62, 76)' }]) }, emphasis: { focus: 'series' }, data: [220, 302, 181, 234, 210, 290, 150] }
            ]
        };

        option = {
            color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
            title: {
                text: '最近热播',
                textStyle: {
                    color: '#ffffff'
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            legend: {
                data: chartData.series.map(function(s) { return s.name; }),
                textStyle: {
                    color: '#ffffff'
                }
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top: '15%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: chartData.categories,
                    axisLabel: {
                        color: '#ffffff'
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#01FCE3'
                        }
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        color: '#ffffff'
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#01FCE3'
                        }
                    }
                }
            ],
            series: chartData.series
        };

        // 使用刚指定的配置项和数据显示图表
        myChart.setOption(option);
        window.addEventListener("resize", function(){
            myChart.resize();
        });
    }


    function ceshis5() {
        var myChart = echarts.init(document.getElementById('chart_1'));


        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize",function(){
            myChart.resize();
        });
    }


});