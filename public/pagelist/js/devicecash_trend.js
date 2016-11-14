/**
 * Created by wanli on 2015/4/21.
 */
//页面加载
var OldData=null;
$(document.body).ready(function(){
    d3.csv("../data/cashtrend.csv", function(csv) {
        OldData=DataGroupManager(csv,"名称");

        Refreshtrend();
    });
});
//数据分组处理
function DataGroupManager(_Data,_GroupColumn){
    var groupdata=[];//item:{group:"组名称",items:[],cashsum:0}
    var groupnames=[];
    var groupindex=-1;
    for(var i=0;i<_Data.length;i++){
        groupindex=groupnames.indexOf(_Data[i][_GroupColumn]);
        if(groupindex>-1){
            groupdata[groupindex].items.push(_Data[i]);
        }else{
            groupnames.push(_Data[i][_GroupColumn]);
            groupdata.push({group:_Data[i][_GroupColumn],items:[_Data[i]]});
        }
    }
    return groupdata;
}


var fill,w,h,words,max,scale,complete,keyword,tags,fontSize,maxLength,fetcher,statusText=null;
var layout,vis,svg,background=null;
function Refreshtrend(){
    fill = d3.scale.category20b();
    w = $("#cloudchart").width();
    h = $("#cloudchart").height();

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

    svg = d3.select("#cloudchart").append("svg").attr("width", w).attr("height", h);

    background = svg.append("g"),
    vis = svg.append("g").attr("transform", "translate(" + [w >> 1, h >> 1] + ")");
    tags=[];
    for(var i=0;i<OldData.length;i++){
        tags.push({key:OldData[i].group,value:Math.abs(parseInt(OldData[i].items[0]["日现金流"]))});
    }
    generate();
    DeviceChange(OldData[0].group);//默认显示第一个装置
}

var fontfamily="黑体",spiralvalue="archimedean",fontsizecaltype="log",maxlength=1000;
function generate() {
    layout
        .font(fontfamily)
        .spiral(spiralvalue);
    fontSize = d3.scale[fontsizecaltype]().range([10, 18]);
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
        .style("font-size", function(d) {
            return d.size + "px";
        });
    text.style("font-family", function(d) { return d.font; })
        .style("cursor","pointer")
        .style("fill", function(d) {
            var tempvalue=getdevicevalue(d.text,"日现金流");
            if(tempvalue>0){
               return "#0cc7a2";
            }else{
                return "#d45e58";
            }
            //return fill(d.text.toLowerCase());
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
        DeviceChange(ev.text);
    });
}
//
function getdevicevalue(_devicename,_cashcol){
    var tempvalue=0;
    for(var i=0;i<OldData.length;i++){
        if(_devicename==OldData[i].group){
            for(var j=0;j<OldData[i].items.length;j++){
                tempvalue+=OldData[i].items[j][_cashcol];
            }
            break;
        }
    }
    return tempvalue;
}
//获取装置信息
function getdeviceinfo(_devicename){
    var rowdata=null;
    for(var i=0;i<OldData.length;i++){
        if(_devicename==OldData[i].group){
            rowdata=OldData[i].items;
            break;
        }
    }
    return rowdata;
}
function DeviceChange(_deviceName){
    var _deviceitems=getdeviceinfo(_deviceName);
    KPICompare(_deviceitems[0]);
    DrawLineChart(_deviceitems);
}
//装置环比信息KPI
function KPICompare(_deviceinfo){
    $("#cashkpi").html("");

    var KPIItems=[
        {v1:"日现金流",value1:parseInt(_deviceinfo["日现金流"]),v2:"上月日现金流",value2:parseInt(_deviceinfo["上月日现金流"])},
        {v1:"累计现金流",value1:parseInt(_deviceinfo["累计现金流"]),v2:"上月累计现金流",value2:parseInt(_deviceinfo["上月累计现金流"])},
        {v1:"预计现金流",value1:parseInt(_deviceinfo["预计现金流"]),v2:"上月预计现金流",value2:parseInt(_deviceinfo["上月预计现金流"])}
    ]
    $("#cashkpi").append("<div id='kpicompare_item1' class='rowpanel'></div>");
    $("#cashkpi").append("<div id='kpicompare_item2' class='rowpanel'></div>");
    $("#cashkpi").append("<div id='kpicompare_item3' class='rowpanel'></div>");
    for(var i=1;i<=KPIItems.length;i++){
        DrawCashBar(KPIItems[i-1].value1,KPIItems[i-1].value2,"kpicompare_item"+i,KPIItems[i-1].v1,KPIItems[i-1].v2);
    }

}
function DrawCashBar(_value,_firstvalue,_Panelid,_valuename,_firstname){
    var differencevalue=_value-_firstvalue;
    var sumvalue=0;
    if(differencevalue>0){
        sumvalue=differencevalue+_value;
    }else{
        sumvalue=Math.abs(differencevalue)+_firstvalue;
    }

    var Panel=$("#"+_Panelid);
    var TextPanel=$("<div class='textpanel'></div>");
    var BarPanel=$("<div class='Barpanel'></div>");
    Panel.append(TextPanel);
    Panel.append(BarPanel);

    var steppx=(BarPanel.width()-200)/sumvalue;

    var leftbarwidth=steppx*Math.abs(_value);
    var leftpanel=$("<div class='panelbar'></div>");
    var lefttext=$("<div>"+_valuename+"：</br>"+_value+"万元</div>")
    BarPanel.append(leftpanel);
    TextPanel.append(lefttext);

    var backgroundcolor="#d45e58";
    if(differencevalue>=0 && _value>=0){
        backgroundcolor="#0cc7a2";
        lefttext.css({
            "color":backgroundcolor,
            "border-left":"solid 1px "+backgroundcolor
        })
    }else{
        if(_value>=0){
            lefttext.css({
                "color":backgroundcolor,
                "border-left":"solid 1px "+backgroundcolor
            })
        }else{
            lefttext.css({
                "position":"absolute",
                "color":backgroundcolor,
                "border-left":"solid 1px "+backgroundcolor,
                "left":(Panel.offset().left+10)+"px"
            })
        }
    }

    leftpanel.css({
        "width":leftbarwidth+"px",
        "height":"20px",
        "background-color":backgroundcolor
    });

    var centerpanel=$("<div class='centerpanelbar'></div>")
    var centertext=$("<div class='centertext'>"+_firstname+"：</br>"+_firstvalue+"万元</div>")
    BarPanel.append(centerpanel);
    TextPanel.append(centertext);
    centerpanel.css({
        "left":(Math.abs(_firstvalue)*steppx)+Panel.offset().left+"px"
    })
    centertext.css({
        "left":(Math.abs(_firstvalue)*steppx)+Panel.offset().left+"px"
    })

    var rightpanelleftvalue=0;
    if(differencevalue>=0 && _value>=0){
        rightpanelleftvalue=steppx*Math.abs(_value)+150;
    }else{
        rightpanelleftvalue=steppx*Math.abs(_firstvalue)+150;
    }
    var rightbarwidth=steppx*Math.abs(differencevalue);
    var rightpanel=$("<div class='rightpanelbar'></div>");
    var righttext=$("<div>差：</br>"+differencevalue+"万元</div>");
    BarPanel.append(rightpanel);
    TextPanel.append(righttext);

    backgroundcolor="#d45e58";
    if(differencevalue>=0 && _value>=0){
        backgroundcolor="#0cc7a2";
        righttext.css({
            "color":backgroundcolor,
            "position":"absolute",
            "left":rightpanelleftvalue+Panel.offset().left+"px",
            "border-left":"solid 1px "+backgroundcolor
        })
    }else{
        righttext.css({
            "position":"absolute",
            "color":backgroundcolor,
            "position":"absolute",
            "border-right":"solid 1px "+backgroundcolor,
            "left":(rightpanelleftvalue+Panel.offset().left+rightbarwidth-righttext.width()-2)+"px"
        })
    }

    rightpanel.css({
        "width":rightbarwidth+"px",
        "height":"20px",
        "background-color":backgroundcolor,
        "left":rightpanelleftvalue+Panel.offset().left+"px"
    });

}
function DrawLineChart(_Deviceitems){
    var SeriesData=[{name:"日现金流",data:[],color:"#12a771"},{name:"上月日现金流",color:"#b54f3e",data:[]}];
    if(_Deviceitems!=null && _Deviceitems.length>0){
        for(var i=0;i<_Deviceitems.length;i++){
            for(var j=0;j<SeriesData.length;j++){
                SeriesData[j].data.push([i+1+"日",parseInt(_Deviceitems[i][SeriesData[j].name])]);
            }
        }
    }
    $('#monthchart').highcharts({
        chart:{
            backgroundColor:""
        },
        credits:{enabled:false},
        xAxis:{
            labels:{
                style:{
                    color:"#666666",
                    fontFamily:"微软雅黑"
                },
                formatter:function(){
                    return this.value+1+"日";
                }
            }
        },
        yAxis:{
            labels:{
                style:{
                    color:"#666666"
                }
            },
            title:{
                text:"现金流(万元)",
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
            backgroundColor:"",
            borderColor:"#dcdcdc",
            borderRadius:5,
            borderWidth:1,
            itemStyle:{
                color:"#666666",
                fontFamily:"微软雅黑"
            }
        },
        series: SeriesData
    });
}
