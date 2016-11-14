/**
 * Created by wanli on 2015/4/23.
 */
var startDate,endDate,wordType="pepoword",wordTypevalue="peponum";
var alldata=null;
$(document.body).ready(function(){
    InitControl();
    LoadData();//加载数据
})
//1.初始化控件事件处理
function InitControl(){
    startDate="2001-01-01";
    endDate="2001-10-31";
    //日期选择
    $("#datepicker01").Zebra_DatePicker({
        format:"Y-m-d",
        //format:"Y-m",
        direction: ["2001-01-01", "2012-10-31"],
        onSelect:function(date){
            startDate=date;
            var wordgroupdata=DataManager(alldata)
            Refreshtrend(wordgroupdata);
            RefreshWordChart(wordgroupdata);
            RefreshHistoryChart(wordgroupdata,wordgroupdata[0].key);
        },
        onClear:function(){

        }
    }).val(startDate).width(120);
    $("#datepicker02").Zebra_DatePicker({
        format:"Y-m-d",
        //format:"Y-m",
        direction: ["2001-01-01", "2012-10-31"],
        onSelect:function(date){
            endDate=date;

            var wordgroupdata=DataManager(alldata)
            Refreshtrend(wordgroupdata);
            RefreshWordChart(wordgroupdata);
            RefreshHistoryChart(wordgroupdata,wordgroupdata[0].key);
        },
        onClear:function(){

        }
    }).val(endDate).width(120);

    $(".riskmenu_tab_item").bind("click",function(ev){
        $(".riskmenu_tab_item").removeClass("riskmenu_tab_selected");
        $(this).addClass("riskmenu_tab_selected");
        wordType=$(this).data("namekey");
        wordTypevalue=$(this).data("valuekey");

        var wordgroupdata=DataManager(alldata)
        Refreshtrend(wordgroupdata);
        RefreshWordChart(wordgroupdata);
        RefreshHistoryChart(wordgroupdata,wordgroupdata[0].key);
    })
}

//region 2.数据加载&处理
function LoadData(){
    d3.csv("../data/risklibrary_cloud.csv", function(csv) {
        alldata=csv;
        var wordgroupdata=DataManager(alldata)
        Refreshtrend(wordgroupdata);
        RefreshWordChart(wordgroupdata);
        RefreshHistoryChart(wordgroupdata,wordgroupdata[0].key);
    });
}
function DataManager(_data){
    var TagItems=[];//{key,value,items}
    var TagNames=[];
    var tempdindex=-1;
    for(var i=0;i<_data.length;i++){
        if(_data[i]["date"]>=startDate && _data[i]["date"]<=endDate){
            tempdindex=TagNames.indexOf(_data[i][wordType]);
            if(tempdindex>-1){
                TagItems[tempdindex].value+=parseInt(_data[i][wordTypevalue]);
                TagItems[tempdindex].items.push(_data[i])
            }else{
                TagNames.push(alldata[i][wordType]);
                TagItems.push({key:alldata[i][wordType],value:1,items:[_data[i]]});
            }
        }
    }
    return TagItems;
}
function DataSortByValue_TopNumber(_data,_TopNum){
    _data.sort(function(x, y){return y[1]-x[1];});
    var returnItems=[];
    for(var i=0;i<_TopNum&& i<_data.length;i++){
        returnItems.push(_data[i]);
    }
    return returnItems;
}
//endregion

//region 3.绘制词云图
var fill,w,h,words,max,scale,complete,keyword,tags,fontSize,maxLength,fetcher,statusText=null;
var layout,vis,svg,background=null;
function Refreshtrend(_tags){
    $("#riskcloudword").html("");

    fill = d3.scale.category20b();
    w = $("#riskcloudword").width();
    h = $("#riskcloudword").height();

    words = [],max,scale = 1,complete = 0,
        keyword = "",
        tags,
        fontSize,
        maxLength = 30,
        fetcher,
        statusText ="";

    layout = d3.layout.cloud()
        .timeInterval(10)
        .size([w, h])
        .fontSize(function(d) { return fontSize(+d.value); })
        .text(function(d) { return d.key; })
        .on("end", draw);

    svg = d3.select("#riskcloudword").append("svg").attr("width", w).attr("height", h);

    background = svg.append("g"),
        vis = svg.append("g").attr("transform", "translate(" + [w >> 1, h >> 1] + ")");

    tags=[];//item:{key:"名称",value:"值"}
    for(var i=0;i<_tags.length;i++){
        tags.push({key:_tags[i].key,value:_tags[i].value});
    }

    generate();
}
var fontfamily="黑体",spiralvalue="archimedean",fontsizecaltype="log",maxlength=1000;
function generate() {
    layout
        .font(fontfamily)
        .spiral(spiralvalue);
    fontSize = d3.scale[fontsizecaltype]().range([8, 18]);
    if (tags.length){
        fontSize.domain([+tags[tags.length - 1].value || 1, +tags[0].value]);
    }
    complete = 0;

    words = [];
    layout.stop().words(tags.slice(0, max = Math.min(tags.length, +maxlength))).start();
}
function draw(data, bounds) {
    scale = bounds ? Math.min(
        w / Math.abs(bounds[1].x - w / 2),
        w / Math.abs(bounds[0].x - w / 2),
        h / Math.abs(bounds[1].y - h / 2),
        h / Math.abs(bounds[0].y - h / 2)) / 2 : 1;
    words = data;
    var text = vis.selectAll("text")
        .data(words, function(d) { return d.text.toLowerCase(); });

    text.transition()
        .duration(1000)
        .attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; })
        .style("font-size", function(d) { return d.size + "px"; });
    text.enter().append("text")
        .attr("text-anchor", "middle")
        .attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; })
        .style("font-size", "1px")
        .transition()
        .duration(1000)
        .style("font-size", function(d) { return d.size + "px"; });
    text.style("font-family", function(d) { return d.font; })
        .style("cursor","pointer")
        .style("fill", function(d) {
            return fill(d.text.toLowerCase());
        })
        .text(function(d) { return d.text; });
    var exitGroup = background.append("g")
        .attr("transform", vis.attr("transform"));
    var exitGroupNode = exitGroup.node();
    text.exit().each(function() {
        exitGroupNode.appendChild(this);
    });
    exitGroup.transition()
        .duration(1000)
        .style("opacity", 1e-6)
        .remove();
    vis.transition()
        .delay(1000)
        .duration(750)
        .attr("transform", "translate(" + [w >> 1, h >> 1] + ")scale(" + scale + ")");

    vis.selectAll("text").on("click",function(ev){
        //ev:{"text":"1#乙二醇-环氧乙烷","font":,"rotate","size","padding","width":,"height":,"xoff":,"yoff":,"x1":,"y1":,"x0":,"y0":,"x":,"y"}
        RefreshHistoryChart(DataManager(alldata),ev.text);
    });
}
//endregion


//region 4.右侧热词数据值图形展示
function RefreshWordChart(_data){

    var SeriesData=[{name:"热词频率值",data:[],color:"#0cc7a2"}];
    var xcategories=[];
    if(_data!=null && _data.length>0){
        for(var i=0;i<_data.length;i++){
            SeriesData[0].data.push([_data[i].key,parseInt(_data[i].value)]);
        }
        SeriesData[0].data=DataSortByValue_TopNumber(SeriesData[0].data,10);
        for(var i=0;i<SeriesData[0].data.length;i++){
            xcategories.push(SeriesData[0].data[i][0]);
        }
    }
    $('#riskwordchart').highcharts({
        chart:{
            backgroundColor:"",
            type:"bar",
            plotBackgroundColor:"#ffffff"
        },
        credits:{enabled:false},
        xAxis:{
            categories: xcategories,
            labels:{
                style:{
                    color:"#666666",
                    fontFamily:"微软雅黑"
                },
                step:0
            }
        },
        yAxis:{
            labels:{
                style:{
                    color:"#666666"
                }
            },
            lineWidth:1,
            lineColor:"#666666",
            tickColor:"#666666",
            tickInterval:5,
            tickLength:5,
            title:{
                text:"次数(万次)",
                style:{
                    color:"#666666",
                    fontFamily:"微软雅黑"
                }
            }
        },
        title:{
            text:""
        },
        tooltip:{
            crosshairs:true,
            shared:true
        },
        legend:{
            enabled:false,
            backgroundColor:"",
            borderColor:"#dcdcdc",
            borderRadius:5,
            borderWidth:1,
            itemStyle:{
                color:"#ffffff",
                fontFamily:"微软雅黑"
            }
        },
        series: SeriesData
    });
}
//endregion
function RefreshHistoryChart(_groupdata,_word){
    //{name:"热词频率值",data:[],color:"#0cc7a2"}
    var SeriesData=[];
    if(_groupdata!=null && _groupdata.length>0){
        var selindex=-1;
        for(var i=0;i<_groupdata.length;i++){
            if(_word==_groupdata[i].key){
                selindex=i;
                break;
            }
        }
        if(selindex>-1){
            SeriesData.push({name:_groupdata[i].key,color:"#0cc7a2",data:[]});
            for(var j=0;j<_groupdata[selindex].items.length;j++){
                SeriesData[0].data.push([TimeConvert(_groupdata[selindex].items[j]["date"]),parseInt(_groupdata[selindex].items[j][wordTypevalue])])
            }
        }
    }
    $('#riskhistorychart').highcharts({
        chart:{
            backgroundColor:"#ffffff",
            type:"line",
            plotBackgroundColor:"#ffffff"
        },
        credits:{enabled:false},
        xAxis:{
            type: 'datetime',
            labels:{
                style:{
                    color:"#666666",
                    fontFamily:"微软雅黑"
                },
                formatter:function(){
                    return Highcharts.dateFormat('%Y-%m-%d',this.value);
                }
            }
        },
        yAxis:{
            labels:{
                style:{
                    color:"#666666"
                }
            },
            lineWidth:1,
            lineColor:"#dcdcdc",
            tickColor:"#666666",
            tickInterval:5,
            tickLength:5,
            title:{
                text:"次数(万次)",
                style:{
                    color:"#666666",
                    fontFamily:"微软雅黑"
                }
            }
        },
        title:{
            text:""
        },
        tooltip:{
            crosshairs:true,
            shared:true,
            formatter:function(){
                return Highcharts.dateFormat('%Y-%m-%d',this.x)+
                    "<br><strong style='color: "+this.points[0].point.color+">"+this.points[0].series.name+"</strong>"+": "+this.y;
            }
        },
        legend:{
            backgroundColor:"",
            borderColor:"#666666",
            borderRadius:5,
            borderWidth:1,
            itemStyle:{
                color:"#035347",
                fontFamily:"微软雅黑"
            }
        },
        plotOptions:{
            line:{
                lineWidth:0.5,
                marker:{
                    radius:2
                }
            }
        },
        series: SeriesData
    });
}
//将"yyyy-MM-dd hh:mm:ss" 字符串转换为DateTime类型返回，主要兼容Safari浏览器
function TimeConvert(_oldtimestr) {
    if (_oldtimestr.indexOf("-") > 0) {
        _oldtimestr = _oldtimestr.replace("-", "/").replace("-", "/");
    }
    if(_oldtimestr.indexOf(".")>-1){
        _oldtimestr=_oldtimestr.substr(0,_oldtimestr.indexOf("."));
    }
    return Date.parse(_oldtimestr);
}