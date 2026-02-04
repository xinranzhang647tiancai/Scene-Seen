// 豆瓣热门电影数据获取和处理
var doubanData = {
    // 模拟数据，实际项目中会从API获取
    mockMovies: [
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
        // 根据截图添加的五部电影
        { name: "捕风追影", rating: 8.1, type: "动作", trend: [58, 63, 68, 73, 77, 80, 81] },
        { name: "浪浪山小妖怪", rating: 8.5, type: "动画", trend: [60, 65, 71, 76, 80, 83, 85] },
        { name: "东极岛", rating: 7.0, type: "冒险", trend: [55, 58, 62, 65, 67, 69, 70] }, // 暂无评分，设置默认值
        { name: "坏蛋联盟2", rating: 7.9, type: "喜剧", trend: [56, 61, 66, 71, 75, 78, 79] },
        { name: "南京照相馆", rating: 8.7, type: "历史", trend: [62, 67, 72, 78, 82, 85, 87] }
    ],
    
    // 获取热门电影数据
    getHotMovies: function() {
        // 由于浏览器跨域限制，实际环境中需要设置代理服务器
        // 这里使用模拟数据
        console.log("获取豆瓣热门电影数据");
        return this.mockMovies;
    },
    
    // 格式化数据为ECharts所需格式
    formatDataForCharts: function(movies) {
        var categories = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
        var series = [];
        var colors = ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'];
        
        movies.forEach(function(movie, index) {
            if (index < 5) { // 只取前5部电影
                series.push({
                    name: movie.name,
                    type: 'line',
                    stack: 'Total',
                    smooth: true,
                    lineStyle: {
                        width: 0
                    },
                    showSymbol: false,
                    areaStyle: {
                        opacity: 0.8,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: colors[index]
                            },
                            {
                                offset: 1,
                                color: this.getGradientColor(colors[index])
                            }
                        ])
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    data: movie.trend,
                    // 添加评分信息到tooltip
                    rating: movie.rating,
                    movieType: movie.type
                });
            }
        }, this);
        
        return { categories: categories, series: series };
    },
    
    // 根据主色计算渐变结束颜色
    getGradientColor: function(color) {
        // 简单的颜色处理
        if (color === '#80FFA5') return 'rgb(1, 191, 236)';
        if (color === '#00DDFF') return 'rgb(77, 119, 255)';
        if (color === '#37A2FF') return 'rgb(116, 21, 219)';
        if (color === '#FF0087') return 'rgb(135, 0, 157)';
        if (color === '#FFBF00') return 'rgb(224, 62, 76)';
        return 'rgba(0, 0, 0, 0.2)';
    },
    
    // 更新排行榜数据
    updateRanking: function(movies) {
        var rankingHtml = '';
        movies.slice(0, 10).forEach(function(movie, index) {
            rankingHtml += '<li>\n                <div class="fontInner clearfix">\n                    <span>\n                        <b>' + (index + 1) + '</b>\n                    </span>\n                    <span>' + movie.name + '</span>\n                    <span>' + movie.rating + '</span>\n                </div>\n            </li>';
        });
        
        if (document.getElementById('FontScroll')) {
            var ul = document.getElementById('FontScroll').getElementsByTagName('ul')[0];
            if (ul) {
                ul.innerHTML = rankingHtml;
            }
        }
    },
    
    // 更新基本信息区域
    updateBasicInfo: function(movies) {
        // 只保留空字符串赋值，移除统计内容
        var infoHtml = '';
        
        if (document.querySelector('.top-list')) {
            document.querySelector('.top-list').innerHTML = infoHtml;
        }
        // 删除第二个infoHtml变量定义及其赋值
        
        // 初始化受众群体分布图表
        this.initAudienceChart();
    },
    
    // 初始化受众群体分布图表
    initAudienceChart: function() {
        try {
            // 确保页面上已经加载了echarts.js
            if (typeof echarts === 'undefined') {
                console.error('ECharts is not loaded!');
                // 尝试动态加载echarts.js
                if (!document.getElementById('echartsScript')) {
                    var script = document.createElement('script');
                    script.id = 'echartsScript';
                    script.src = 'https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js';
                    script.onload = function() {
                        console.log('ECharts loaded dynamically');
                        // 加载完成后再次尝试初始化图表
                        doubanData.initAudienceChart();
                    };
                    document.head.appendChild(script);
                }
                return;
            }
            
            // 获取图表容器元素
            var chartContainer = document.getElementById('audienceChart');
            if (!chartContainer) {
                console.error('Chart container element not found!');
                // 尝试创建一个图表容器
                var container = document.createElement('div');
                container.id = 'audienceChart';
                container.style.width = '100%';
                container.style.height = '300px';
                var targetElement = document.querySelector('.left-top');
                if (targetElement) {
                    targetElement.appendChild(container);
                    chartContainer = container;
                } else {
                    return;
                }
            }
            
            // 创建图表实例
            var myChart = echarts.init(chartContainer);
            
            // 准备受众分析数据
            var audienceData = [
                { value: 35, name: '18-25岁' },
                { value: 40, name: '26-35岁' },
                { value: 15, name: '36-45岁' },
                { value: 10, name: '45岁以上' }
            ];
            
            // 雷达图基础数据
            var baseRadarData = [
                { name: '科幻爱好者', baseValue: [90, 75, 70, 80, 95, 85] },
                { name: '剧情片爱好者', baseValue: [60, 95, 85, 80, 65, 75] },
                { name: '喜剧片爱好者', baseValue: [75, 60, 70, 85, 90, 60] }
            ];
            
            // 创建波动数据生成函数，使波动更不规律
            function generateFluctuatedData() {
                return baseRadarData.map(item => {
                    const fluctuatedValue = item.baseValue.map(value => {
                        // 根据当前值大小调整波动范围，使波动更不规律
                        let fluctuationRange = 20;
                        
                        // 为不同数据点设置不同的波动范围
                        if (value > 70) {
                            fluctuationRange = 15 + Math.random() * 15; // 高值时波动范围15-30%
                        } else if (value < 30) {
                            fluctuationRange = 10 + Math.random() * 20; // 低值时波动范围10-30%
                        } else {
                            fluctuationRange = 5 + Math.random() * 25;  // 中间值时波动范围5-30%
                        }
                        
                        // 生成随机波动值，增加更多随机性
                        let fluctuation;
                        if (Math.random() > 0.7) {
                            // 30%的概率产生较大波动
                            fluctuation = (Math.random() - 0.5) * fluctuationRange * 1.5;
                        } else if (Math.random() < 0.2) {
                            // 20%的概率产生较小波动
                            fluctuation = (Math.random() - 0.5) * fluctuationRange * 0.5;
                        } else {
                            // 50%的概率产生中等波动
                            fluctuation = (Math.random() - 0.5) * fluctuationRange;
                        }
                        
                        // 确保数值在0-100之间
                        return Math.max(0, Math.min(100, value + fluctuation));
                    });
                    return {
                        name: item.name,
                        value: fluctuatedValue
                    };
                });
            }
            
            // 初始波动数据
            var fluctuatedRadarData = generateFluctuatedData();
            
            // 设置图表配置并添加动态效果
            const option = {
                backgroundColor: 'transparent',
                // 添加全局动画
                animation: true,
                animationDuration: 800,  // 加快初始动画速度
                animationEasing: 'elasticOut',
                animationDelay: function(idx) {
                    // 不同系列不同延迟，创造错开的动画效果
                    return idx * 200;
                },
                
                // 确保图例配置正确且不会被遮挡
                legend: {
                    orient: 'horizontal',
                    bottom: 0, // 调整图例位置
                    left: 'center',
                    data: ['科幻爱好者', '剧情片爱好者', '喜剧片爱好者'],
                    textStyle: {
                        color: '#fff',
                        fontSize: 12
                    },
                    // 图例交互效果
                    emphasis: {
                        textStyle: {
                            color: '#59ebe8',
                            textShadowBlur: 10,
                            textShadowColor: 'rgba(89, 235, 232, 0.5)'
                        }
                    }
                },
                tooltip: {
                    trigger: 'item',
                    backgroundColor: 'rgba(3, 76, 106, 0.8)',
                    borderColor: '#59ebe8',
                    textStyle: {
                        color: '#fff'
                    },
                    // 显示格式化的提示框
                    formatter: function(params) {
                        if (params.seriesType === 'radar') {
                            return params.name + '<br/>' + params.indicator + ': ' + params.value.toFixed(1) + '%';
                        } else if (params.seriesType === 'pie') {
                            return params.name + ': ' + params.value + '%';
                        }
                        return params.name;
                    }
                },
                radar: {
                    indicator: [
                        { name: '观影频率', max: 100 },
                        { name: '付费意愿', max: 100 },
                        { name: '社交分享', max: 100 },
                        { name: '影评参与', max: 100 },
                        { name: '推荐意愿', max: 100 },
                        { name: '续集期待', max: 100 }
                    ],
                    shape: 'circle',
                    splitNumber: 5,
                    axisName: {
                        color: 'rgb(238, 197, 102)'
                    },
                    splitLine: {
                        lineStyle: {
                            color: [
                                'rgba(238, 197, 102, 0.1)',
                                'rgba(238, 197, 102, 0.2)',
                                'rgba(238, 197, 102, 0.4)',
                                'rgba(238, 197, 102, 0.6)',
                                'rgba(238, 197, 102, 0.8)',
                                'rgba(238, 197, 102, 1)'
                            ].reverse()
                        }
                    },
                    splitArea: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(238, 197, 102, 0.5)'
                        }
                    }
                },
                series: [
                    { // 保留雷达图系列
                        name: '受众类型',
                        type: 'radar',
                        data: fluctuatedRadarData,
                        // 雷达图入场动画
                        animationDuration: 1000,
                        animationEasing: 'elasticOut',
                        // 更新动画配置
                        animationDurationUpdate: 800,
                        animationEasingUpdate: 'elasticOut',
                        animationDelayUpdate: function(idx) {
                            return idx * 100;
                        },
                        lineStyle: {
                            width: 4,  // 增加线宽使其更醒目
                            opacity: 1,  // 提高不透明度
                            type: 'solid',
                            // 增强线条阴影效果
                            shadowBlur: 8,
                            shadowColor: 'rgba(255, 255, 255, 0.8)',
                            shadowOffsetX: 0,
                            shadowOffsetY: 0,
                            // 线的动态效果
                            emphasis: {
                                width: 6,
                                color: '#59ebe8',
                                shadowBlur: 20,
                                shadowColor: 'rgba(89, 235, 232, 0.9)'
                            }
                        },
                        itemStyle: {
                            color: function(params) {
                                const colorList = ['#F9713C', '#B3E4A1', 'rgb(238, 197, 102)'];
                                return colorList[params.dataIndex];
                            },
                            // 增强点的立体效果
                            shadowBlur: 15,
                            shadowColor: 'rgba(255, 255, 255, 0.7)',
                            shadowOffsetX: 0,
                            shadowOffsetY: 0,
                            borderWidth: 2,
                            borderType: 'solid',
                            borderColor: '#fff'
                        },
                        areaStyle: {
                            opacity: 0.4,  // 提高区域填充不透明度，使其更明显
                            // 增加渐变填充效果
                            color: function(params) {
                                const colorList = [
                                    new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                        { offset: 0, color: 'rgba(249, 113, 60, 0.8)' },
                                        { offset: 1, color: 'rgba(249, 113, 60, 0.2)' }
                                    ]),
                                    new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                        { offset: 0, color: 'rgba(179, 228, 161, 0.8)' },
                                        { offset: 1, color: 'rgba(179, 228, 161, 0.2)' }
                                    ]),
                                    new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                        { offset: 0, color: 'rgba(238, 197, 102, 0.8)' },
                                        { offset: 1, color: 'rgba(238, 197, 102, 0.2)' }
                                    ])
                                ];
                                return colorList[params.dataIndex];
                            },
                            // 区域动态效果
                            emphasis: {
                                opacity: 0.7
                            }
                        },
                        // 增强点的效果
                        symbolSize: 12,  // 增大点的尺寸
                        symbol: 'circle',  // 使用圆形点
                        emphasis: {
                            symbolSize: 18,
                            itemStyle: {
                                shadowBlur: 20,
                                shadowColor: 'rgba(0, 0, 0, 0.9)',
                                borderWidth: 3,
                                borderColor: '#fff'
                            }
                        }
                    }
                ]
            };
            
            // 设置图表配置并渲染
            myChart.setOption(option);
            
            // 监听窗口大小变化，调整图表尺寸
            window.addEventListener('resize', function() {
                myChart.resize();
            });
            
            // 添加交互效果：点击图例切换显示
            myChart.on('legendselectchanged', function(params) {
                myChart.dispatchAction({
                    type: 'showTip',
                    seriesIndex: 0,
                    name: params.name
                });
            });
            
            // 添加周期性动画效果 - 稍快的不规则更新
            let animationInterval;
            
            function updateChartWithIrregularInterval() {
                // 生成新的波动数据
                fluctuatedRadarData = generateFluctuatedData();
                
                // 更新图表数据
                myChart.setOption({
                    series: [
                        {
                            data: fluctuatedRadarData,
                            // 调整动画持续时间，使动画过渡更快
                            animationDurationUpdate: 800 + Math.random() * 600,
                            animationEasingUpdate: ['elasticOut', 'cubicOut', 'quadraticOut'][Math.floor(Math.random() * 3)]
                        }
                    ]
                });
                
                // 计算下一次更新的时间间隔（1.5-3秒之间的随机值）
                const nextInterval = 1500 + Math.random() * 1500;
                
                // 设置下一次更新
                animationInterval = setTimeout(updateChartWithIrregularInterval, nextInterval);
            }
            
            // 启动不规则间隔的更新
            updateChartWithIrregularInterval();
            
            // 清理函数
            window.addEventListener('beforeunload', function() {
                clearTimeout(animationInterval);
            });
            
            console.log('Audience chart initialized successfully with enhanced dynamic effects');
        } catch (error) {
            console.error('Failed to initialize audience chart:', error);
        }
    },
    
    // 更新图表数据
    updateCharts: function() {
        try {
            var movies = this.getHotMovies();
            var chartData = this.formatDataForCharts(movies);
            
            // 存储格式化后的数据，供echarts.js使用
            window.doubanChartData = chartData;
            
            // 如果ceshis3函数已定义，调用它
            if (window.ceshis3 && typeof window.ceshis3 === 'function') {
                window.ceshis3();
            }
            
            // 注释掉更新排行榜的代码，防止排行榜被自动重新填充
            // 更新排行榜
            this.updateRanking(movies);
            
            // 更新基本信息
            this.updateBasicInfo(movies);
            
            console.log("数据更新成功，时间：" + new Date().toLocaleTimeString());
        } catch (error) {
            console.error("数据更新失败：", error);
        }
    }
};

// 页面加载完成后初始化数据
window.addEventListener('load', function() {
    // 立即更新一次数据
    doubanData.updateCharts();
    
    // 设置定时器，每分钟更新一次数据
    setInterval(function() {
        doubanData.updateCharts();
    }, 60000); // 60000毫秒 = 1分钟
});