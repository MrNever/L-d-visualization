/**
 * Created by wanli on 2015/4/20.
 */
//region 3.现金流分析 处理

var BubbleType=$("#content_3").find("input[name='radiomo3']:checked").val();
var BubbleDot=null;
var BublleSvg=null;
var BubbleData=null;
var OldData=null;
var BubbleDeviceList=null;
$(document.body).ready(function(){
    var margin = {top: 40, right: 10, bottom: 10, left: 10},
        width =$(".content_left").width(),
        height =$(document).height()-$(".menu").height()-100;

    var div =$(".content").find(".content_left").css({
        width:(width + margin.left + margin.right) + "px",
        height:(height + margin.top + margin.bottom) + "px"
    })

    d3.csv("../data/cashtrend.csv", function(csv) {
        OldData=csv;
        LoadBubble(FilterDataByYear(OldData,"2001"));//现金流分析处理
    });
});
function FilterDataByYear(_data,_year){
    var tempdata=[];
    for(var i=0;i<_data.length;i++){
        if(_data[i]["年份"]==_year){
            tempdata.push(_data[i]);
        }
    }
    return tempdata;
}
function LoadBubble(_Data,_IsFilter){
    if(!_IsFilter){
        BubbleData=_Data;

        //3.1.加载装置列表
        var _deviceliststr="";
        BubbleDeviceList=[];
        for(var i=0;i<BubbleData.length;i++){
            BubbleDeviceList.push(BubbleData[i]["名称"]);
            _deviceliststr+="<div><div><input type='checkbox' class='checkboxitem' checked='checked' value='"+BubbleData[i]["名称"]+"'></div><div>"+BubbleData[i]["名称"]+"</div></div>"
        }
        $("#content_3").find(".devicelist").html(_deviceliststr);
    }

// Chart dimensions.
    var margin = {top: 19.5, right: 20.5, bottom: 19.5, left: 45.5},
        width = $("#content_3").find(".content_left").width() - margin.right,
        height = $("#content_3").find(".content_left").height() - margin.top - margin.bottom;

// Various scales. These domains make assumptions of data, naturally.
    var xScale = d3.scale.linear().domain([-150, 1000]).range([0, width-50]),
        yScale = d3.scale.linear().domain([-50, 300]).range([height, 0]),
        radiusScale = d3.scale.sqrt().domain([-50, 300]).range([0, 40]);
    switch(BubbleType){
        case "累计现金流":
            yScale = d3.scale.linear().domain([-300, 2000]).range([height, 0]);
            radiusScale = d3.scale.sqrt().domain([-300, 2000]).range([0, 40]);
            break;
        case "预计现金流":
            yScale = d3.scale.linear().domain([-300, 2000]).range([height, 0]);
            radiusScale = d3.scale.sqrt().domain([-300, 2000]).range([0, 40]);
            break;
        default :
            break;
    }

    // The x & y axes.
    var xAxis = d3.svg.axis().orient("bottom").scale(xScale).ticks(12, d3.format(",d")),
        yAxis = d3.svg.axis().scale(yScale).orient("left");

    // Create the SVG container and set the origin.
    if(BublleSvg!=null){
        BublleSvg.remove();
        d3.select("#content_3").select(".content_left>svg").remove();
    }
    var svg = d3.select("#content_3").select(".content_left").append("svg")
        .attr("width", width)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    BublleSvg=svg;

    // Add the x-axis.
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the y-axis.
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    // Add an x-axis label.
    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width-50)
        .attr("y", height - 6)
        .text("环比%");

    // Add a y-axis label.
    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 6)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("现金流");

    // Add the year label; the value is set on transition.
    var label = svg.append("text")
        .attr("class", "year label")
        .attr("text-anchor", "end")
        .attr("y", height - 24)
        .attr("x", width)
        .text("2001");//

    // A bisector since many nation's data is sparsely-defined.
    var bisect = d3.bisector(function(d) { return d[0]; });

    // Add a dot per nation. Initialize the data at 1800, and set the colors.
    BubbleDot= svg.append("g")
        .attr("class", "dots")
        .selectAll(".dot")
        .data(_Data)
        .enter().append("circle")
        .attr("class", "dot")
        .style("fill", function(d) { return color(d); })
        .call(position)
        .sort(order);

    // Add a title.
    BubbleDot.append("title").text(function(d) { return d["名称"]+"("+d[BubbleType]+")"; });

    // Add an overlay for the year label.
    var box = label.node().getBBox();
    var overlay = svg.append("rect")
        .attr("class", "overlay")
        .attr("x", box.x)
        .attr("y", box.y)
        .attr("width", box.width)
        .attr("height", box.height)
        .on("mouseover", enableInteraction);


    // Positions the dots based on data.
    function position(_dot) {
        _dot .attr("cx", function(d) { return xScale(x(d)); })
            .attr("cy", function(d) { return yScale(y(d)); })
            .attr("r", function(d) { return radiusScale(radius(d)); });
    }

    // Defines a sort order so that the smallest dots are drawn on top.
    function order(a, b) {
        return radius(b) - radius(a);
    }

    if(!_IsFilter){
        BubbleTypeManager();
    }

    function enableInteraction() {
        var yearScale = d3.scale.linear()
            .domain([2001, 2011])
            .range([box.x + 10, box.x + box.width - 10])
            .clamp(true);

        // Cancel the current transition, if any.
        svg.transition().duration(0);

        overlay
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .on("mousemove", mousemove)
            .on("touchmove", mousemove);

        function mouseover() {
            label.classed("active", true);
        }

        function mouseout() {
            label.classed("active", false);
        }

        function mousemove() {
            displayYear(yearScale.invert(d3.mouse(this)[0]));
        }
    }
    function displayYear(year) {
        var tempdata=FilterDataByYear(OldData,parseInt(year)+"");
        BubbleDot.data(tempdata, key).call(position).sort(order);
        label.text(Math.round(year));
    }
}
function BubbleTypeManager(){
    $("#content_3").find("input[name='radiomo3']").change(function(ev){
        BubbleType=$("#content_3").find("input[name='radiomo3']:checked").val();
        LoadBubble(DataManager(BubbleData,BubbleDeviceList),true);
    })
    $("#content_3").find("input[type='checkbox']").change(function(ev){
        BubbleDeviceList=[];
        $("#content_3").find(".checkboxitem:checked").each(function(i){
            BubbleDeviceList.push(this.value);
        });
        LoadBubble(DataManager(BubbleData,BubbleDeviceList),true);
    })
}
function x(d) {
    return parseInt( d["环比上月"]);
}//环比上月
function y(d) { return parseInt(d[BubbleType]); }
function radius(d) {
    return Math.abs(parseInt(d[BubbleType]));
}//年-人口
function color(d) {
    if(d[BubbleType]>=0){
        return "#48c09a";
    }else{
        return "#ec5c5c";
    }
}//正负效益
function key(d) { return d["名称"] }//装置名称
function DataManager(_Data,_FilterDevices){
    var tempData=[];
    if(_Data!=null && _Data.length>0){
        for(var i=0;i<_Data.length;i++){
            if(_FilterDevices.indexOf(_Data[i]["名称"])>-1){
                tempData.push(_Data[i]);
            }
        }
    }
    return tempData;
}
//endregion