/**
 * Created by Mr_hu on 2015/4/29.
 */
$(document.body).ready(function(){
    InitControl();
});
var startdate="2014-11-02",enddate="2015-04-02",dimtype="device",filtertype="峰值报警率",calendfiltertype="峰值报警率";
function InitControl(){
    var ranges=[];
    for(var i=TimeConvert(startdate);i<TimeConvert(enddate);i=i+(5*24*60*3600)){
        ranges.push(i);
    }
    var picker = $("#slideryear").range_picker({
        //是否显示分割线
        show_seperator:false,
        //是否启用动画
        animate:false,
        //初始化开始区间值
        from:startdate,
        //初始化结束区间值
        to:enddate,
        axis_width:180,
        //选取块宽度
        picker_width:14,
        //各区间值
        ranges:ranges,
        onChange:function(from_to){
            $(".sliderlabelpanel>.label_left").html(new Date(from_to[0]).dateformat("yyyy-MM-dd"));
            $(".sliderlabelpanel>.label_right").html(new Date(from_to[1]).dateformat("yyyy-MM-dd"));
            startdate=new Date(from_to[0]).dateformat("yyyy-MM-dd");
            enddate=new Date(from_to[1]).dateformat("yyyy-MM-dd");
        },
        onSelect:function(index,from_to){
            areachart(searesdata);
            calendarview(searesdata);
            alarmsacttor(searesdata);
            AlarmKPIUpdate();
        },
        afterInit:function(){
            var picker = this;
            var ranges = picker.options.ranges;
            $(".sliderlabelpanel>.label_left").html(new Date(ranges[0]).dateformat("yyyy-MM-dd"));
            $(".sliderlabelpanel>.label_right").html(new Date(ranges[ranges.length-1]).dateformat("yyyy-MM-dd"));
        }
    });
    $("#dimfilter").change(function(ev){
        dimtype=this.value;
        areachart(searesdata);
        AlarmKPIUpdate();
    })
    $("#filter").change(function(ev){
        filtertype=this.value;//当前选中值
        areachart(searesdata);
    });
    $("#ratings_select").change(function(ev){
        calendfiltertype=this.value;//当前选中值
        $("#allendarwithalarmnumright").find("svg").remove();
        calendarview(searesdata);
        alarmanalytitlechange();//显示Title
    });
    $("#alarm_typeselect").change(function(ev){
        alarmsacttortype=this.value;//当前选中值
        alarmsacttor(searesdata);
        alarmanalytitlechange();//显示Title
    });

    jqmeterShow(10,2,"contentleft",300,25);
    LoadAlarmData(function(_data){
        jqmeterShow(10,10,"contentleft",300,25);
        setTimeout(function() {
            jqmeterHide("contentleft");

            searesdata = _data.historydata;
            vareadata= _data.vareadata;

            areachart(searesdata);
            calendarview(searesdata);
            alarmsacttor(searesdata);
            AlarmKPIUpdate();
        },500);
    })

    alarmanalytitlechange();//显示Title
}

//历史区域图
var searesdata=[];
var vareadata=null;
function areachart(_data){
    var seriesdata=GetAlarmHistoryData(_data,filtertype,startdate,enddate,dimtype,vareadata);
    var allseries=[];
    var colors=['#4baad3', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4','#2f7ed8', '#0d233a'];
    for(var i=0;i<seriesdata.analarm.length;i++){
        allseries.push({name:seriesdata.analarm[i].group,data:seriesdata.analarm[i].items,color:colors[i]});
    }
    if(seriesdata.meddle!=null){
        for(var i=0;i<seriesdata.meddle.length;i++){
            allseries.push({name:seriesdata.meddle[i].group+"(操作干预)",data:seriesdata.meddle[i].items,yAxis:1,color:colors[i]})
        }
    }
    $('#container').highcharts({
        chart: {
            type: 'area'
        },
        title:{
            text:'',
            style: {
                color: '#FF00FF',
                fontWeight: 'bold'
            }
        },

        xAxis: {
            labels: {
                enabled:true  //是否显示x轴刻度值
            },
            tickWidth:0,
            //tickmarkPlacement: 'on',
            title: {
                enabled: false
            }
        },
        yAxis: [{
            lineColor:"#dcdcdc",
            lineWidth:1,
            tickColor:"#dcdcdc",
            tickWidth:1,
            tickLength:10,
            gridLineWidth:1,
            tickPosition:"inside",
            labels: {
                align: 'right',
                x: -5,
                formatter: function() {
                    return this.value;
                }
            },
            opposite:false,
            title: {
                text:filtertype
            },
            offset: 0,
            top: '0%',
            height:'50%',
            lineWidth: 2
        },{
            lineColor:"#dcdcdc",
            lineWidth:1,
            tickColor:"#dcdcdc",
            tickWidth:1,
            tickLength:10,
            gridLineWidth:1,
            tickPosition:"inside",
            labels: {
                align: 'right',
                x: -5
            },
            opposite:false,
            reversed: true,
            title: {
                text: "操作干预历史趋势"
            },
            offset: 0,
            top: '50%',
            height:'50%',
            lineWidth: 2
        }
        ],
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: 35,
            y:-9,
            width:200,
            MinHeight:230,
            itemStyle: {
                color: '#666666'
            }
        },
        credits: {
            enabled: false
        },
        tooltip: {
            shared: true
        },
        plotOptions: {
            area: {
                stacking: 'normal',
                lineColor: '#666666',
                lineWidth: 1,
                marker: {
                    enabled:false
                }
            }
        },
        series:allseries
    });
    $("#container").find("text").css("font-family","微软雅黑");
    $("#container").find("text").css("fill","#666666");
    $("#container").find("text").css("color","#666666");
}


//日历视图
function calendarview(_data){
    var calendarcolumn=calendfiltertype;
    var CalendarData= CalendarDataDescSort(_data,startdate,enddate)

    var stordata=[];
    for(var i=CalendarData.length;i<CalendarData.length;i--){
        stordata.push(CalendarData[i])
    }
    var width=610,
        height = 80,
        cellSize =10.5; // cell size

    var day = d3.time.format("%w"),
        week = d3.time.format("%U"),
        percent = d3.format(".1%"),
        format = d3.time.format("%Y-%m-%d");

    var color = d3.scale.quantize()
        .domain([-.05, .05])
        .range(d3.range(11).map(function(d) {
            return "q" + d + "-11";
        }));
   // var enddate=parseInt(endtimedata)+1;
    var tempstartdate=parseInt(startdate.substr(0,4));
    var tempenddate=parseInt(enddate.substr(0,4))+1;
    var svg = d3.select("#allendarwithalarmnumright").selectAll("svg")
        .data(d3.range(tempstartdate,tempenddate))
        .enter().append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "RdYlGn")
        .append("g")
        .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");

    svg.append("text")
        .attr("transform", "translate(-6," + cellSize * 3 + ")rotate(-90)")
        .style("text-anchor", "middle")
        .text(function(d) { return d; });

    var rect = svg.selectAll(".day")
        .data(function(d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
        .enter().append("rect")
        .attr("class", "day")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", function(d) { return week(d) * cellSize; })
        .attr("y", function(d) { return day(d) * cellSize; })
        .datum(format);

    rect.append("title")
        .text(function(d) { return d; });

    svg.selectAll(".month")
        .data(function(d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
        .enter().append("path")
        .attr("class", "month")
        .attr("d", monthPath);

        var data = d3.nest()
            .key(function(d) { return d["时间"]; })
            .rollup(function(d) { return d[calendarcolumn]; })//(d[0].Close - d[0].Open) /
            .map(CalendarData);

        rect.filter(function(d) {
                return d in data;
            })
            //.attr("class", function(d) {
            //    return "day " + color(data[d]);
            //})
            .attr("style", function(d) {
                var obj=null;
                for(var i=0;i<CalendarData.length;i++){
                    if(CalendarData[i]["时间"]==d){
                        obj=CalendarData[i];
                        break
                    }
                }
                if(obj!=null){
                    return  "fill:"+GetClendarcellColorInfo(calendarcolumn,obj).color;
                }else{
                    return "fill: "+ "#ffffff";
                }
            })
            .select("title")
            .text(function(d) {
                var obj=null;
                for(var i=0;i<CalendarData.length;i++){
                    if(CalendarData[i]["时间"]==d){
                        obj=CalendarData[i];
                        break
                    }
                }
                if(obj!=null){
                    return d + ": " + GetClendarcellColorInfo(calendarcolumn,obj).name;
                   // return  "fill:"+GetClendarcellColorInfo(calendarcolumn,obj).color;
                }else{
                    return d;
                }
            });
    //});
    $("#allendarwithalarmnumright").find("text").css("font-family","微软雅黑");
    $("#allendarwithalarmnumright").find("text").css("fill","#666666");
    $("#allendarwithalarmnumright").find("text").css("color","#666666");

    function monthPath(t0) {
        var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
            d0 = +day(t0), w0 = +week(t0),
            d1 = +day(t1), w1 = +week(t1);
        return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
            + "H" + w0 * cellSize + "V" + 7 * cellSize
            + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
            + "H" + (w1 + 1) * cellSize + "V" + 0
            + "H" + (w0 + 1) * cellSize + "Z";
    }

    //d3.select(self.frameElement).style("height", "2px");

}


//散点图处理
var circleitems=[],
    circlesizelist=[];
var alarmsacttortype="报警数",alarmsacttornode="3";
var minmaxvalue=null;
function alarmsacttor(_alldata) {
    var managerdata=SacttorManager(_alldata,startdate,enddate,alarmsacttornode,alarmsacttortype);
    var data=managerdata.groupdata;
    minmaxvalue=managerdata.minmax;

    //{groupdata:tempgroup,minmax:min_maxvalue}

    var margin = {top: 0, right: 20, bottom: 0, left: 10},
        width = ($("#alarmsacttor").width()-margin.left - margin.right),
        height = ($("#alarmsacttor").height()-margin.top - margin.bottom);

    var start_date= 1,
        end_date =10;

    var c = d3.scale.category20c();

    var x = d3.scale.linear()
        .range([0, width]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("top");

    var formatdates = d3.format("00");
    xAxis.tickFormat(formatdates);
    $("#alarmsacttor").html("");

    var svg = d3.select("#alarmsacttor").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("margin-left", margin.left + "px")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    x.domain([start_date, end_date]);
    var xScale = d3.scale.linear()
        .domain([start_date, end_date])
        .range([0, width]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + 0 + ")")
        .call(xAxis);

    circleitems=[];
    circlesizelist=[];
    for (var j = 0; j < data.length; j++) {
        var g = svg.append("g").attr("class","journal");
        var circles = g.selectAll("circle")
            .data(data[j].items)
            .enter()
            .append("circle");

        var text = g.selectAll("text")
            .data(data[j].items)
            .enter()
            .append("text");

        var rScale = d3.scale.linear()
            .domain([minmaxvalue.min,minmaxvalue.max ])
            .range([2, 8]);

        circles
            .attr("cx", function(d, i) {
                return xScale(parseInt(d["index"]));
            })
            .attr("cy", j*20+20)
            .attr("r", function(d) {
                var tempsize=parseInt(rScale(d[alarmsacttortype]));
                UpdateCircleSize(tempsize,d[alarmsacttortype]);
                return tempsize;
            })
            .style("cursor","pointer")
            .style("fill", function(d) {
                var value1=(d[alarmsacttortype]-minmaxvalue.min);
                var value2=(minmaxvalue.max-d[alarmsacttortype]);
                return colorGradient("#ed93a6","#a31f28",value1,value2);
                //return "#a31f28";
            }).on("mouseover", mouseover)
            .on("mouseout", mouseout);

        text
            .attr("y", j*20+25)
            .attr("x",function(d, i) {
                return xScale(parseInt(d["index"]));
            })
            .attr("class","value")
            .text(function(d){
                //return d[1];
                return  d[alarmsacttortype];
            })
            .style("fill", function(d) {
                //return c(j);
                var value1=(d[alarmsacttortype]-minmaxvalue.min);
                var value2=(minmaxvalue.max-d[alarmsacttortype]);
                return colorGradient("#ed93a6","#a31f28",value1,value2);
            })
            .style("display","none");

        g.append("text")
            .attr("y", j*20+25)
            .attr("x",width+20)
            .attr("class","label")
            .text(data[j].group)
            .style("fill", function(d) {
                //return c(j);
                return "#666666";
            });
    };
    $(".x").remove()

    function mouseover(d) {
        var alarmanalydiv="<div id='alarmanalytooltips' class='alarmanalytooltips'></div>";
        if($("#alarmanalytooltips").length>0){}else{
            alarmanalydiv=$(alarmanalydiv).appendTo($(document.body));
        }
        $("#alarmanalytooltips").css({
            left:$(this).offset().left+"px",
            top:$(this).offset().top+"px"
        }).html(d["时间"]+"    "+alarmsacttortype+":"+d[alarmsacttortype]).show();

    }

    function mouseout(d) {
        $("#alarmanalytooltips").hide();
    }

    //更新点大小数值参照
    ReferenceCircleSizeChange(minmaxvalue);
}

function MultInterval(){

}
function AlarmKPIUpdate(){
    var kpidata=CalKPI(searesdata,startdate,enddate,dimtype,vareadata);
    //{meavalue:平均报警率,meanchain:平均报警率环比值,maxvalue:峰值报警率,maxchain:峰值报警率环比,minvalue:低值报警率,minchain:0,sumvalue:报警总数,sumchain:0}
    if(kpidata!=null){
        var tempcolor="#a31f28";
        var tempimg="../images/alarmnum_up.png";
        var strhtml="";
        if(kpidata.meanchain<=0){
            tempcolor="#ed93a6";
            tempimg="../images/alarmnum_down.png";
        }
        strhtml+="<div><div class='group'>平均报警率</div><div style='color:"+tempcolor+"'>"+kpidata.meavalue+"</div><div>环比："+kpidata.meanchain
        +"% <img src='"+tempimg+"'/></div></div>";

        tempcolor="#a31f28";
        tempimg="../images/alarmnum_up.png";
        if(kpidata.maxchain<=0){
            tempcolor="#ed93a6";
            tempimg="../images/alarmnum_down.png";
        }
        strhtml+="<div><div class='group'>峰值报警率</div><div style='color:"+tempcolor+"'>"+kpidata.maxvalue+"</div><div>环比："+kpidata.maxchain+"% <img src='"+tempimg+"'/></div></div>";
        tempcolor="#a31f28";
        tempimg="../images/alarmnum_up.png";
        if(kpidata.minchain<=0){
            tempcolor="#ed93a6";
            tempimg="../images/alarmnum_down.png";
        }
        strhtml+="<div><div class='group'>低值报警率</div><div style='color:"+tempcolor+"'>"+kpidata.minvalue+"</div><div>环比："+kpidata.minchain+"% <img src='"+tempimg+"'/></div></div>";
        tempcolor="#a31f28";
        tempimg="../images/alarmnum_up.png";
        if(kpidata.sumchain<=0){
            tempcolor="#a31f28";
            tempimg="../images/alarmnum_down.png";
        }
        strhtml+="<div><div class='group'>报警总数</div><div style='color: "+tempcolor+"'>"+kpidata.sumvalue+"</div><div>环比："+kpidata.sumchain+"% <img src='"+tempimg+"'/></div></div>";
        $("#alarmkpiarea").html(strhtml);
    }
}
function UpdateCircleSize(size,_value){
    var tempindex=circlesizelist.indexOf(size);
    //circleitems=[];circlesizelist=[];
    if(tempindex>-1){
        circleitems[tempindex].items.push(_value);
        circleitems[tempindex].meavalue=GetMeanValue(circleitems[tempindex].items);
    }else{
        circlesizelist.push(size);
        circleitems.push({size:size,meavalue:_value,items:[_value]})
    }
}
function ReferenceCircleSizeChange(_minmax){
    //circleitems:{size,meavalue,items}
    var tempSizediv="";
    circleitems.sort(function(a,b){return a.size- b.size;});
    var tempdivsize= 0,temptop=0;
    var tempcolor="";
    for(var i=0;i<circleitems.length;i++){
        tempcolor=GetpointColor(circleitems[i].meavalue);
        tempdivsize=circleitems[i].size*2;
        temptop=(17-tempdivsize)/2;
        tempSizediv+="<div class='circleitem'><div class='circle_panel'><div class='circle' style='width:"+tempdivsize+"px;height:"+tempdivsize+"px;border-radius:"+circleitems[i].size+"px;margin-top:"+temptop+"px;background-color:"+tempcolor+"'></div></div><div class='circletext'>"+circleitems[i].meavalue+"</div></div>";
    }
    tempSizediv="<div class='devicecirclepanel'>"+tempSizediv+"</div>";
    $("#sacttorkpipanel").find(".devicecirclepanel").remove();
    $("#sacttorkpipanel").append(tempSizediv);

    var colorrangepanel="<div class='devicerangecolor'><div class='colorrange'></div><div class='rangeitems'><div class='leftitem'>"+_minmax.min+"</div><div class='rightitem'>"+_minmax.max+"</div></div></div>"

    $("#sacttorkpipanel").find(".devicerangecolor").remove();
    $("#sacttorkpipanel").append(colorrangepanel);
}
function GetpointColor(_value){
    var value1=(_value-minmaxvalue.min);
    var value2=(minmaxvalue.max-_value);
    return colorGradient("#ed93a6","#a31f28",value1,value2);
}
function GetMeanValue(_ArrayItems){
    var meanvalue=null;
    if(_ArrayItems!=null && _ArrayItems.length>0){
        var total=0;
        for(var i=0;i<_ArrayItems.length;i++){
            total+=_ArrayItems[i];
        }
        meanvalue=parseInt(total/_ArrayItems.length);
    }
    return meanvalue;
}
function TimeConvert(_oldtimestr) {
    if (_oldtimestr.indexOf("-") > 0) {
        _oldtimestr = _oldtimestr.replace("-", "/").replace("-", "/");
    }
    if(_oldtimestr.indexOf(".")>-1){
        _oldtimestr=_oldtimestr.substr(0,_oldtimestr.indexOf("."));
    }
    return Date.parse(_oldtimestr);
}
function alarmanalytitlechange(){
    $("#canadartitle").html("综合评价等级___"+calendfiltertype+"等级");
    $("#socttortitle").html("报警统计___"+alarmsacttortype+"量");
}