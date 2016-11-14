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
        //var paneltemp=$("#datepicker01").Zebra_DatePicker({
        //    format:"Y",
        //    //format:"Y-m",
        //    direction: ["2006", "2010"],
        //    onSelect:function(date){
        //        FilterDateValue1=date;
        //        // LoadChainTable(FilterDataByDate(TreeMapData,FilterDateValue));//进度完成分析
        //        RefreshView()
        //    },
        //    onClear:function(){
        //        FilterDateValue1="2006";
        //    }
        //}).val("2006");
        //var paneltemp1=$("#datepicker02").Zebra_DatePicker({
        //    format:"Y",
        //    //format:"Y-m",
        //    direction: ["2006", "2010"],
        //    onSelect:function(date){
        //        FilterDateValue=date;
        //        RefreshView()
        //        // LoadChainTable(FilterDataByDate(TreeMapData,FilterDateValue));//进度完成分析
        //    },
        //    onClear:function(){
        //        FilterDateValue="2010";
        //    }
        //}).val("2010");


        var ranges = [];//var parsedate=(parseInt(FilterDateValue)+1).toString();
        for (var i = Date.parse(new Date(FilterDateValue1)); i < Date.parse(new Date(FilterDateValue)); i = i + (5 * 24 * 60 * 3600)) {
            ranges.push(i);
        }
        var tempstarttime=ranges[0];
        var tempendtime=ranges[ranges.length-1];
        var picker = $("#slideryear").range_picker({
            //是否显示分割线
            show_seperator: false,
            //是否启用动画
            animate: false,
            //初始化开始区间值
            from: tempstarttime,
            //初始化结束区间值
            to: tempendtime,
            axis_width: 194,
            //选取块宽度
            picker_width: 12,
            //各区间值
            ranges: ranges,
            onChange: function (from_to) {
                FilterDateValue1 = new Date(from_to[0]).dateformat("yyyy");
                FilterDateValue = new Date(from_to[1]).dateformat("yyyy");
                $(".sliderlabelpanel>.label_left").html(new Date(from_to[0]).dateformat("yyyy"));
                $(".sliderlabelpanel>.label_right").html(new Date(from_to[1]).dateformat("yyyy"));

            },
            onSelect: function (index, from_to) {
                RefreshView()
            },
            afterInit: function () {
                var picker = this;
                var ranges = picker.options.ranges;
                $(".sliderlabelpanel>.label_left").html(new Date(ranges[0]).dateformat("yyyy"));
                $(".sliderlabelpanel>.label_right").html(new Date(ranges[ranges.length - 1]).dateformat("yyyy"));
            }
        });






       // var rightwidth=$("#box").width()-170
       // $("#contentleft").css("width",$("#box").width()-190);
      //  $("#contentleft").css("height","550px");
      //  $("#contentright").css("margin-left",rightwidth);
        $("input[name='radiomo']").change(function(ev) {
            CashTypeColName=ev.target.value;
            RadiokpiRfresh();
        });
        timemp();
    });


    var FilterDateValue1="2011",FilterDateValue="2015"

   var outvaluedata=null;
    var ViewData=null ;
    var starttimedata=2011;
    var endtimedata=2015;
    var radiodata=[];
    function timemp(){
        var width = $(".content_button").width(),
            height = 102,
            cellSize = 12; // cell size

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
            .data(d3.range(starttimedata, enddate))
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

      //  d3.json("../data/calendarview.json", function(csv) {
            var csv=calendarview;
            ViewData=csv;
            if(radiodata.length>0){
                csv=radiodata;
            }
            var data = d3.nest()
                .key(function(d) { return d.Date; })
                .rollup(function(d) { return (d[0].Close - d[0].Open) / d[0].Open; })
                .map(csv);

            rect.filter(function(d) { return d in data; })
                .attr("style", function(d) {//#c75151 #f69a54 #ffafbe #fff9c9 #89eb88
                    if(data[d]<=120){
                        return "fill:" + "#89eb88";
                    }
                    if(data[d]>120 && data[d]<=180){
                        return "fill:" + "#fff9c9";
                    }
                    if(data[d]>180 && data[d]<=240){
                        return "fill:" + "#ffafbe";
                    }
                    if(data[d]>240 && data[d]<=300){
                        return "fill:" + "#f69a54";
                    }
                    if(data[d]>300){
                        return "fill:" + "#c75151";
                    }
                    //return "day " + color(data[d]);
                })
                .select("title")
                .text(function(d) {
                    if(data[d]<0){data[d]=0}
                    return d + ": " + data[d].toFixed(1);
                });
    //    });
      //  $("#contentleft").find("svg").css("margin-top","-30px");
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

       // d3.select(self.frameElement).style("height", "495px");



    }
    function RefreshView(){
        starttimedata=FilterDateValue1;
        endtimedata=FilterDateValue;
        $("#contentleft").find("svg").remove()
        timemp()
    }
    function kpiRefresh(){
        //var kpidata=outvaluedata;
        var outdata=outvaluedata;
        radiodata=[];
        if(outdata=="VOC"){
            for(var i=0;i<ViewData.length;i++) {
                radiodata.push(ViewData[i]);
            }
        }
        if(outdata=="H2S"){
            for(var i=0;i<ViewData.length;i++) {
                if(ViewData[i]["KPI"]=="H2S") {
                    radiodata.push({Date: ViewData[i]["Date"], Open: ViewData[i]["Open"], Close: ViewData[i]["Close"]})
                }
            }
        }
        if(outdata=="SO2"){
            for(var i=0;i<ViewData.length;i++) {
                if(ViewData[i]["KPI"]=="SO2") {
                    radiodata.push({Date: ViewData[i]["Date"], Open: ViewData[i]["Open"], Close: ViewData[i]["Close"]})
                }
            }
        }
        //for(var i=0;i<ViewData.length;i++){
        //    if(ViewData[i]["KPI"]==outvaluedata){
        //        radiodata.push(ViewData[i]);
        //    }
        //}
        $("#contentleft").find("svg").remove();
        timemp();
    }

    function RadiokpiRfresh(){
        radiodata=[];
        var labelcount=$("#radindex").find("label");
        for(var i=0;i<ViewData.length;i++){
            if(ViewData[i]["Survey"]=="运保中心"){
                radiodata.push(ViewData[i]);
            }else if($(labelcount[2]).attr("class").substr(6)=="focus on"){
                if(ViewData[i]["Survey"]=="凤凰亭"){
                    radiodata.push(ViewData[i]);
                }
            }else if($(labelcount[3]).attr("class").substr(6)=="focus on"){
                if(ViewData[i]["Survey"]=="牛口峪"){
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
            //$(label[1]).css("top", "107px");
            //$(label[1]).css("left", "40px")
        }
        if ($(label[1]).attr("for") == "rad2") {
            $(label[1]).css("position", "absolute");
            //$(label[1]).css("top", "107px");
            //$(label[1]).css("left", "40px")
        }
        if ($(label[2]).attr("for") == "rad3") {
            $(label[2]).css("position", "absolute");
            //$(label[2]).css("top", "135px");
            //$(label[2]).css("left", "40px")
        }
        if ($(label[3]).attr("for") == "rad4") {
            $(label[3]).css("position", "absolute");
            //$(label[2]).css("top", "135px");
            //$(label[2]).css("left", "40px")
        }
        var plab = $("#radindex").find("p")
        $(plab).addClass("rad2");
    }


    Date.prototype.dateformat = function(formatter)
    {
        if(!formatter || formatter == "")
        {
            formatter = "yyyy";
        }
        var year = this.getFullYear().toString();
        //var month = (this.getMonth() + 1).toString();
        //var day = this.getDate().toString();
        var yearMarker = formatter.replace(/[^y|Y]/g,'');
        if(yearMarker.length == 2)
        {
            year = year.substring(2,4);
        }
        //var monthMarker = formatter.replace(/[^m|M]/g,'');
        //if(monthMarker.length > 1)
        //{
        //    if(month.length == 1)
        //    {
        //        month = "0" + month;
        //    }
        //}
        //var dayMarker = formatter.replace(/[^d]/g,'');
        //if(dayMarker.length > 1)
        //{
        //    if(day.length == 1)
        //    {
        //        day = "0" + day;
        //    }
        //}
        return formatter.replace(yearMarker,year);//.replace(monthMarker,month).replace(dayMarker,day);
    }