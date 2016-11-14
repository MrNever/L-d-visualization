/**
 * Created by wanli on 2015/5/12.
 */
function addAxesAndLegend (svg, xAxis, yAxis, margin, chartWidth, chartHeight) {
    var legendWidth  = 200,
        legendHeight = 100;

    // clipping to make sure nothing appears behind legend
    svg.append('clipPath')
        .attr('id', 'axes-clip')
        .append('polygon')
        .attr('points', (-margin.left)                 + ',' + (-margin.top)                 + ' ' +
        (chartWidth - legendWidth - 1) + ',' + (-margin.top)                 + ' ' +
        (chartWidth - legendWidth - 1) + ',' + legendHeight                  + ' ' +
        (chartWidth + margin.right)    + ',' + legendHeight                  + ' ' +
        (chartWidth + margin.right)    + ',' + (chartHeight + margin.bottom) + ' ' +
        (-margin.left)                 + ',' + (chartHeight + margin.bottom));

    var axes = svg.append('g')
        .attr('clip-path', 'url(#axes-clip)');

    axes.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + chartHeight + ')')
        .call(xAxis);

    axes.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text('温度 (℃)');

    var legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', 'translate(' + (chartWidth - legendWidth) + ', 0)');

    legend.append('rect')
        .attr('class', 'legend-bg')
        .attr('width',  legendWidth)
        .attr('height', legendHeight);

    legend.append('rect')
        .attr('class', 'outer')
        .attr('width',  75)
        .attr('height', 20)
        .attr('x', 10)
        .attr('y', 10);

    legend.append('text')
        .attr('x', 115)
        .attr('y', 25)
        .text('5% - 95%');
        //.text('边界范围');

    legend.append('rect')
        .attr('class', 'inner')
        .attr('width',  75)
        .attr('height', 20)
        .attr('x', 10)
        .attr('y', 40);

    legend.append('text')
        .attr('x', 115)
        .attr('y', 55)
        .text('25% - 75%');
        //.text('正常波动范围');

    legend.append('path')
        .attr('class', 'median-line')
        .attr('d', 'M10,80L85,80');

    legend.append('text')
        .attr('x', 115)
        .attr('y', 85)
        .text('Median');
}

function drawPaths (svg, data, x, y) {
    var upperOuterArea = d3.svg.area()
        .interpolate('basis')
        .x (function (d) {
        return x(d.date) || 1;
    })
        .y0(function (d) { return y(d.pct95); })
        .y1(function (d) { return y(d.pct75); });

    var upperInnerArea = d3.svg.area()
        .interpolate('basis')
        .x (function (d) {
        return x(d.date) || 1;
    })
        .y0(function (d) { return y(d.pct75); })
        .y1(function (d) { return y(d.pct50); });

    var medianLine = d3.svg.line()
        .interpolate('basis')
        .x(function (d) {
            return x(d.date);
        })
        .y(function (d) { return y(d.pct50); });

    var lowerInnerArea = d3.svg.area()
        .interpolate('basis')
        .x (function (d) {
        return x(d.date) || 1;
    })
        .y0(function (d) { return y(d.pct50); })
        .y1(function (d) { return y(d.pct25); });

    var lowerOuterArea = d3.svg.area()
        .interpolate('basis')
        .x (function (d) {
        return x(d.date) || 1;
    })
        .y0(function (d) { return y(d.pct25); })
        .y1(function (d) { return y(d.pct05); });

    svg.datum(data);

    svg.append('path')
        .attr('class', 'area upper outer')
        .attr('d', upperOuterArea)
        .attr('clip-path', 'url(#rect-clip)');

    svg.append('path')
        .attr('class', 'area lower outer')
        .attr('d', lowerOuterArea)
        .attr('clip-path', 'url(#rect-clip)');

    svg.append('path')
        .attr('class', 'area upper inner')
        .attr('d', upperInnerArea)
        .attr('clip-path', 'url(#rect-clip)');

    svg.append('path')
        .attr('class', 'area lower inner')
        .attr('d', lowerInnerArea)
        .attr('clip-path', 'url(#rect-clip)');

    svg.append('path')
        .attr('class', 'median-line')
        .attr('d', medianLine)
        .attr('clip-path', 'url(#rect-clip)');
}

function addMarker (marker, svg, chartHeight, x) {
    var radius = 32,
        xPos = x(marker.date) - radius - 3,
        yPosStart = chartHeight - radius - 3,
        yPosEnd = (marker.type === 'Client' ? 80 : 160) + radius - 3;

    var markerG = svg.append('g')
        .attr('class', 'marker '+marker.type.toLowerCase())
        .attr('transform', 'translate(' + xPos + ', ' + yPosStart + ')')
        .attr('opacity', 0);

    markerG.transition()
        .duration(1000)
        .attr('transform', 'translate(' + xPos + ', ' + yPosEnd + ')')
        .attr('opacity', 1);

    markerG.append('path')
        .attr('d', 'M' + radius + ',' + (chartHeight-yPosStart) + 'L' + radius + ',' + (chartHeight-yPosStart))
        .transition()
        .duration(1000)
        .attr('d', 'M' + radius + ',' + (chartHeight-yPosEnd) + 'L' + radius + ',' + (radius*2));

    var tempcolor="#01652f";
    switch(marker.type){
        case "GY":
            break;
        case "SB":
            tempcolor="#ff9900";
            break;
        case  "CZ":
            tempcolor="#990000";
            break;
        case "GKQH":
            tempcolor="#66ccff";
            break;
        default:
            break;
    }

    markerG.append('circle')
        .attr('class', 'marker-bg')
        .attr('cx', radius)
        .attr('cy', radius)
        .attr('fill',tempcolor)
        .attr('r', radius).
        attr("cno",marker.no)
        .on("click",exceptiontoltip_mousemove);

    //markerG.append('text')
    //    .attr('x', radius)
    //    .attr('y', radius*0.9)
    //    .text(marker.type);

    markerG.append('text')
        .attr('x', radius)
        .attr('y', radius*1)
        .text(marker.version);
}
function exceptiontoltip_mousemove(_data){
    var toltipPanelID="exceptiontoltipPanel";
    if($("#"+toltipPanelID).length>0){
        $("#"+toltipPanelID).remove();
    }
    var thismarkerno=$(this).attr("cno");
    var markerinfo=null;
    for(var i=0;i<markerData.length;i++){
        if(markerData[i].no==thismarkerno){
            markerinfo=markerData[i];
            break;
        }
    }

    if(markerinfo!=null){
        var tempcolor="#01652f";
        switch(markerinfo.type){
            case "GY":
                break;
            case "SB":
                tempcolor="#ff9900";
                break;
            case  "CZ":
                tempcolor="#990000";
                break;
            case "GKQH":
                tempcolor="#66ccff";
                break;
            default:
                break;
        }

        var strhtml=$("<div id='"+toltipPanelID+"' class='exceptooltipsty'>" +
        "<div class='title' style='background-color: "+tempcolor+"'>"+markerinfo.title+"</div>" +
        "<div class='time' >异常时间:&nbsp;&nbsp;&nbsp;&nbsp;"+markerinfo.date+"</div>" +
        "<div class='detailtitle' >异常描述:</div>" +
        "<div class='detail'>"+markerinfo.detail+"</div>" +
        "</div>");
        strhtml.hide();
        $(document.body).append(strhtml);
        strhtml.css({
            left:($(this).offset().left+10)+"px",
            top:($(this).offset().top-10)+"px"
        })
        strhtml.show(200);
    }

    event.stopPropagation();
}
function exceptiontoltip_mouseout(_data){
    var toltipPanelID="exceptiontoltipPanel";
    if($("#"+toltipPanelID).length>0){
        $("#"+toltipPanelID).hide(200);
    }
}

function startTransitions (svg, chartWidth, chartHeight, rectClip, markers, x) {
    rectClip.transition()
        .duration(1000*markers.length)
        .attr('width', chartWidth);

    markers.forEach(function (marker, i) {
        setTimeout(function () {
            addMarker(marker, svg, chartHeight, x);
        }, 1000 + 500*i);
    });
}

function makeChart (data, markers) {
    var margin = { top: 20, right: 20, bottom: 40, left: 40 };
    var svgWidth  = $("#exceptionchart").width(),
        svgHeight = $("#exceptionchart").height()-30,
        chartWidth  = svgWidth  - margin.left - margin.right,
        chartHeight = svgHeight - margin.top  - margin.bottom;

    var x = d3.time.scale().range([0, chartWidth])
            .domain(d3.extent(data, function (d) {
                return d.date;
            })),

        y = d3.scale.linear().range([chartHeight, 0])
            .domain([830,920]);

    var xAxis = d3.svg.axis().scale(x).orient('bottom')
            .innerTickSize(-chartHeight).outerTickSize(0).tickPadding(10),
        yAxis = d3.svg.axis().scale(y).orient('left')
            .innerTickSize(-chartWidth).outerTickSize(0).tickPadding(10);

    var svg = d3.select('#exceptionchart').append('svg')
        .attr('width',  svgWidth)
        .attr('height', svgHeight)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // clipping to start chart hidden and slide it in later
    var rectClip = svg.append('clipPath')
        .attr('id', 'rect-clip')
        .append('rect')
        .attr('width', 0)
        .attr('height', chartHeight);

    addAxesAndLegend(svg, xAxis, yAxis, margin, chartWidth, chartHeight);
    drawPaths(svg, data, x, y);
    startTransitions(svg, chartWidth, chartHeight, rectClip, markers, x);
}

//var parseDate  = d3.time.format('%Y-%m-%d %H:%m:%S').parse;
var parseDate  = d3.time.format('%Y/%m/%d %H:%M').parse;
var markerData=[
    {
        "no":"10001",
        "date": "2015/4/15 1:00",
        "type": "GY",
        "version": "工艺异常",
        "title":"DA-203塔碱洗异常情况",
        "detail":"中段碱碱洗明显异常，多日大量补碱，最高浓度不超过10%；12月25日强碱段碱洗明显异常，开始大量补碱。补碱量提高到2140kg/h。12月30日上，GA-203A/B泵双泵运转，碱洗效果逐渐恢复正常。"
    },
    {
        "no":"10002",
        "date": "2015/4/15 6:10",
        "type": "SB",
        "version": "设备异常",
        "title":"裂解炉烧焦阀内漏",
        "detail":"BA-109烧焦后投用，烧焦阀内漏，烧焦罐放空管有较多蒸汽放空，现场手动关烧焦阀并关闭取样器防焦蒸汽观察烧焦罐放空情况，最终烧焦罐略有蒸汽放空（由于天气凉，其他烧焦罐放空管没有蒸汽冒出，全都冷凝成水），到下午BA-109烧焦阀不再漏。因为，烧焦阀不再过蒸汽后，烧焦阀阀体凉逐渐凉下来，漏的QO逐渐冷凝并将烧焦阀密封面漏的地方封住。"
    },
    {
        "no":"10003",
        "date": "2015/4/15 10:30",
        "type": "CZ",
        "version": "操作异常",
        "title":"SL-I型裂解炉单组COT剧烈波动",
        "detail":"BA-113投料后第4组炉出口温度剧烈波动——约±25℃，其中DS注入量波动大——约±500kg/h，两者的波动同步。经过原料调节阀、稀释蒸汽的一次、二次注器调节阀的手动控制，进一步将所有稀释蒸汽调节阀手动控制，但是稀释蒸汽仍然流量波动大。后经检查是第四组进料的保护蒸汽没有关闭，关闭该保护蒸汽后，BA-113号炉第四组COT不再波动"
    },
    {
        "no":"10004",
        "date": "2015/4/15 21:30",
        "type": "GKQH",
        "version": "工况切换",
        "title":"裂解炉燃料结构发生变化",
        "detail":"BA1102裂解炉燃料结构发生变化"
    }
];

//d3.csv('../data/exceptiontiming.csv', function (rawData) {
//    var data = rawData.map(function (d) {
//        return {
//            date:  parseDate(d.date),
//            pct05: d.pct05 ,
//            pct25: d.pct25 ,
//            pct50: d.pct50 ,
//            pct75: d.pct75 ,
//            pct95: d.pct95
//        };
//    });
//
//    var markers = markerData.map(function (marker) {
//        return {
//            "no":marker.no,
//            date: parseDate(marker.date),
//            type: marker.type,
//            version: marker.version,
//            detail:marker.detail,
//            title:marker.title
//        };
//    });
//    makeChart(data, markers);
//    LoadExceptionLegend();
//
//    $(document.body).bind("click",function(){
//        exceptiontoltip_mouseout(null);
//    });
//});
$(document.body).ready(function(){
    var rawData=exceptiontiming;
    var data = rawData.map(function (d) {
        return {
            date:  parseDate(d.date),
            pct05: d.pct05 ,
            pct25: d.pct25 ,
            pct50: d.pct50 ,
            pct75: d.pct75 ,
            pct95: d.pct95
        };
    });

    var markers = markerData.map(function (marker) {
        return {
            "no":marker.no,
            date: parseDate(marker.date),
            type: marker.type,
            version: marker.version,
            detail:marker.detail,
            title:marker.title
        };
    });
    makeChart(data, markers);
    LoadExceptionLegend();

    $(document.body).bind("click",function(){
        exceptiontoltip_mouseout(null);
    });
})
function LoadExceptionLegend(){
    var ExceptionLegendPenelID="ExceptionLegend";
    if($("#"+ExceptionLegendPenelID).length>0){
        $("#"+ExceptionLegendPenelID).remove();
    }
    var items=[
        {name:"工艺异常",color:"#01652f"},
        {name:"设备异常",color:"#ff9900"},
        {name:"操作异常",color:"#990000"},
        {name:"工况切换",color:"#66ccff"}
    ];
    var strexception="";
    for(var i=0;i<items.length;i++){
        strexception+="<div class='lengenditem'><div class='radios' style='background-color: "+items[i].color+"'></div><div class='title'>"+items[i].name+"</div></div>"
    }
    strexception="<div id='"+ExceptionLegendPenelID+"' class='legendpanel'>"+strexception+"</div>";
    $(".content_rightdiv").append(strexception);
}