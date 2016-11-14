/**
 * Created by Mr_hu on 2015/4/21.
 */
$(document.body).ready(function(){
    var stardiv=$("#top").find("div")[0];
        $(stardiv).addClass("checked");
    $("#top").find("div").bind("click", function () {
        $("#top>div").removeClass("checked");
        $(this).addClass("checked");
        var selvalue = $(this).html();
        outvaluedata=selvalue;
        kpiRefresh()
    });
    var rightwidth=$("#box").width()-170;
    $("#contentleft").css("width",$("#box").width()-190);
    $("#contentleft").css("height","550px");
    $("#contentright").css("margin-left",rightwidth);
    var paneltemp=$("#datepicker01").Zebra_DatePicker({
        format:"Y",
        //format:"Y-m",
        direction: ["2006", "2010"],
        onSelect:function(date){
            FilterDateValue1=date;
           // LoadChainTable(FilterDataByDate(TreeMapData,FilterDateValue));//进度完成分析
            RefreshView();
        },
        onClear:function(){
            FilterDateValue1="2006";
        }
    }).val("2006");
    var paneltemp1=$("#datepicker02").Zebra_DatePicker({
        format:"Y",
        //format:"Y-m",
        direction: ["2006", "2010"],
        onSelect:function(date){
            FilterDateValue=date;
            RefreshView()
            // LoadChainTable(FilterDataByDate(TreeMapData,FilterDateValue));//进度完成分析
        },
        onClear:function(){
            FilterDateValue="2010";
        }
    }).val("2010");
    $("input[name='radiomo']").change(function(ev) {
        CashTypeColName=ev.target.value;
        RadiokpiRfresh();
    });
    timemp();

});

    var outvaluedata=null;
    var ViewData=null ;
    var starttimedata=2006;
    var endtimedata=2010;
    var radiodata=[];
    var data=null;
    function timemp(){
         //width = 960,
        var width=$("#box").width()-200,
            height = 136,
            cellSize = 14; // cell size

        var day = d3.time.format("%w"),
            week = d3.time.format("%U"),
            percent = d3.format(".1%"),
            format = d3.time.format("%Y-%m-%d");

        var color = d3.scale.quantize()
            .domain([-.05, .05])
            .range(d3.range(11).map(function(d) {
                return "q" + d + "-11";
            }));
        var enddate=parseInt(endtimedata)+1;
        var svg = d3.select("#contentleft").selectAll("svg")
            .data(d3.range(starttimedata,enddate))
            .enter().append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("class", "RdYlGn")
            .append("g")
            .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");

        svg.append("text")
            .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
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

        d3.csv("../data/calendarview.csv", function(csv) {
            ViewData=csv;
            if(radiodata.length>0){
               csv=radiodata;
            }
            //if(radiodata.length==0){
            //    for(var i=0; i<csv.length;i++){
            //        if(csv[i]["Unit"]!=null){
            //           delete csv[i]["Unit"];
            //            radiodata.push(csv[i]);
            //        }
            //    }
            //    if(radiodata.length>0){
            //        csv=radiodata;
            //    }
            //}
            data = d3.nest()
                .key(function(d) { return d.Date; })
                .rollup(function(d) { return (d[0].Close - d[0].Open) / d[0].Open; })
                .map(csv);

            rect.filter(function(d) { return d in data; })
                .attr("class", function(d) {
                    return "day " + color(data[d]);
                })
                .select("title")
                .text(function(d) { return d + ": " + percent(data[d]); });
        });
        $("#contentleft").find("svg").css("margin-top","-30px");

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
    function RefreshView(){
        starttimedata=$("#datepicker01").val();
        endtimedata=$("#datepicker02").val();
        $("#contentleft").find("svg").remove();
        timemp()
    }
    function kpiRefresh(){
        var outdata=outvaluedata;
        radiodata=[];
        if(outdata=="评价等级"){
                for(var i=0;i<ViewData.length;i++) {
                    radiodata.push(ViewData[i]);
                }
            }
        if(outdata=="峰值报警率"){
            for(var i=0;i<ViewData.length;i++) {
               if(ViewData[i]["KPI2"]=="峰值报警率") {
                    radiodata.push({Date: ViewData[i]["Date"], Open: ViewData[i]["Open"], Close: ViewData[i]["Close"]})
                }
            }
        }
        if(outdata=="平均报警率"){
            for(var i=0;i<ViewData.length;i++) {
                if(ViewData[i]["KPI2"]=="平均报警率") {
                    radiodata.push({Date: ViewData[i]["Date"], Open: ViewData[i]["Open"], Close: ViewData[i]["Close"]})
                }
            }
        }
        if(outdata=="扰动率"){
            for(var i=0;i<ViewData.length;i++) {
                if(ViewData[i]["KPI2"]=="扰动率") {
                    radiodata.push({Date: ViewData[i]["Date"], Open: ViewData[i]["Open"], Close: ViewData[i]["Close"]})
                }
            }
        }
            //if(ViewData[i]["KPI2"]=="峰值报警率"){
            //    radiodata.push({Date:ViewData[i]["Date"],Open:ViewData[i]["Open"],Close:ViewData[i]["Close"]})
            //}
            //if(ViewData[i]["KPI2"]=="平均报警率"){
            //    radiodata.push({Date:ViewData[i]["Date"],Open:ViewData[i]["Open"],Close:ViewData[i]["Close"]})
            //}
            //if(ViewData[i]["KPI2"]=="扰动率"){
            //    radiodata.push({Date:ViewData[i]["Date"],Open:ViewData[i]["Open"],Close:ViewData[i]["Close"]})
            //}

        $("#contentleft").find("svg").remove();
        timemp();
    }

    function RadiokpiRfresh(){
        radiodata=[];
        var labelcount=$("#radindex").find("label");
        for(var i=0;i<ViewData.length;i++){
            if(ViewData[i]["Unit"]=="分离单元"){
                radiodata.push(ViewData[i]);
            }else if($(labelcount[2]).attr("class").substr(6)=="focus on"){
                if(ViewData[i]["Unit"]=="新区单元"){
                    radiodata.push(ViewData[i]);
                }

            }
        }
      //  var checked=$("#radindex").find("#rad[value='裂解单元']").attr("checked")
        if($(labelcount[0]).attr("class").substr(6)=="focus on"){
            radiodata=ViewData;
        }

        $("#contentleft").find("svg").remove();
        timemp();
    }
    window.onload = function () {
        var label = $("#radindex").find("label");
        if ($(label[0]).attr("for") == "rad") {
            $(label[0]).css("position", "absolute");
        }
        if ($(label[1]).attr("for") == "rad2") {
            $(label[1]).css("position", "absolute");
        }
        if ($(label[2]).attr("for") == "rad3") {
            $(label[2]).css("position", "absolute");
        }
        var plab = $("#radindex").find("p")
        $(plab).addClass("rad2");
    }
