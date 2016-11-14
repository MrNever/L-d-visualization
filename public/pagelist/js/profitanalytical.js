/**
 * Created by Mr_hu on 2015/5/28.
 */
var startDate="2015-01-01",endDate="2015-03-31"
$(document.body).ready(function(){
    var ranges = [];
    for (var i = Date.parse(new Date(startDate)); i < Date.parse(new Date(endDate)); i = i + (5 * 24 * 60 * 3600)) {
        ranges.push(i);
    }
    var picker = $("#slideryear1").range_picker({
        //是否显示分割线
        show_seperator: false,
        //是否启用动画
        animate: false,
        //初始化开始区间值
        from: startDate,
        //初始化结束区间值
        to: endDate,
        axis_width: 184,
        //选取块宽度
        picker_width: 14,
        //各区间值
        ranges: ranges,
        onChange: function (from_to) {
            $(".sliderlabelpanel>.label_left").html(new Date(from_to[0]).dateformat("yyyy-MM-dd"));
            $(".sliderlabelpanel>.label_right").html(new Date(from_to[1]).dateformat("yyyy-MM-dd"));
            startDate = new Date(from_to[0]).dateformat("yyyy-MM-dd");
            endDate = new Date(from_to[1]).dateformat("yyyy-MM-dd");
        },
        onSelect: function (index, from_to) {
            highchartshowmanager(alldata)
            columnchartshowmanager(alldata)
            lineandbullonshowmanager(alldata)
        },
        afterInit: function () {
            var picker = this;
            var ranges = picker.options.ranges;
            $(".sliderlabelpanel>.label_left").html(new Date(ranges[0]).dateformat("yyyy-MM-dd"));
            $(".sliderlabelpanel>.label_right").html(new Date(ranges[ranges.length - 1]).dateformat("yyyy-MM-dd"));
        }
    });
    LoadData()
})
var alldata=null;
function LoadData(){
    //d3.csv("../data/profitanalytical.csv",function(csv){
        var csv=profitanalytical
        alldata=csv
        highchartshowmanager(alldata);
        columnchartshowmanager(alldata)
        lineandbullonshowmanager(alldata)
  //  })
}

function highchartshowmanager(_alldata){
//region 1.合并一天内多个时间段的是数据
    var tempjamhistorydata=[];
    var temphistorykeys=[];//时间
    var tempindex=null;
    for(var i=0;i<_alldata.length;i++){
        tempindex=temphistorykeys.indexOf(_alldata[i]["日期"]);
        if(tempindex>-1){
            tempjamhistorydata[tempindex]["基本有机化工板块"]=parseInt(tempjamhistorydata[tempindex]["基本有机化工板块"])+parseInt(_alldata[i]["基本有机化工板块"]);
            tempjamhistorydata[tempindex]["合成树脂板块"]=parseInt(tempjamhistorydata[tempindex]["合成树脂板块"])+parseInt(_alldata[i]["合成树脂板块"]);
            tempjamhistorydata[tempindex]["合成橡胶板块"]=parseInt(tempjamhistorydata[tempindex]["合成橡胶板块"])+parseInt(_alldata[i]["合成橡胶板块"]);
            tempjamhistorydata[tempindex]["合纤原料板块"]=parseInt(tempjamhistorydata[tempindex]["合纤原料板块"])+parseInt(_alldata[i]["合纤原料板块"]);
            tempjamhistorydata[tempindex]["精细化工板块"]=parseInt(tempjamhistorydata[tempindex]["精细化工板块"])+parseInt(_alldata[i]["精细化工板块"]);
        }else{
            temphistorykeys.push(_alldata[i]["日期"]);
            tempjamhistorydata.push(_alldata[i]);
        }
    }
    chartdatamam=tempjamhistorydata
    //endregion


    var groupdata={
        basicchemical:[],//基本有机化工板块
        plasthetics:[],//合成树脂板块
        synthal:[],//合成橡胶板块
        Syntheticfibermaterials:[],//合纤原料板块
        industrychemicals:[]//精细化工板块
    };
    var groupkes=[];

    var tempindex=-1;
    for(var i=0;i<tempjamhistorydata.length;i++){
        if(tempjamhistorydata[i]["日期"]>=startDate && tempjamhistorydata[i]["日期"]<=endDate){
                tempindex=groupkes.indexOf(tempjamhistorydata[i]["日期"]);
                if(tempindex>-1){
                    groupdata.basicchemical[tempindex].items.push([tempjamhistorydata[i]["日期"],tempjamhistorydata[i]["基本有机化工板块"]]);
                    groupdata.plasthetics[tempindex].items.push([tempjamhistorydata[i]["日期"],tempjamhistorydata[i]["合成树脂板块"]]);
                    groupdata.synthal[tempindex].items.push([tempjamhistorydata[i]["日期"],tempjamhistorydata[i]["合成橡胶板块"]]);
                    groupdata.Syntheticfibermaterials[tempindex].items.push([tempjamhistorydata[i]["日期"],tempjamhistorydata[i]["合纤原料板块"]]);
                    groupdata.industrychemicals[tempindex].items.push([tempjamhistorydata[i]["日期"],tempjamhistorydata[i]["精细化工板块"]]);
                }else{
                    groupkes.push(tempjamhistorydata[i]["日期"]);
                    groupdata.basicchemical.push({group:tempjamhistorydata[i]["日期"],items:[[tempjamhistorydata[i]["日期"],tempjamhistorydata[i]["基本有机化工板块"]]]});
                    groupdata.plasthetics.push({group:tempjamhistorydata[i]["日期"],items:[[tempjamhistorydata[i]["日期"],tempjamhistorydata[i]["合成树脂板块"]]]});
                    groupdata.synthal.push({group:tempjamhistorydata[i]["日期"],items:[[tempjamhistorydata[i]["日期"],tempjamhistorydata[i]["合成橡胶板块"]]]});
                    groupdata.Syntheticfibermaterials.push({group:tempjamhistorydata[i]["日期"],items:[[tempjamhistorydata[i]["日期"],tempjamhistorydata[i]["合纤原料板块"]]]});
                    groupdata.industrychemicals.push({group:tempjamhistorydata[i]["日期"],items:[[tempjamhistorydata[i]["日期"],tempjamhistorydata[i]["精细化工板块"]]]});
                }

        }
    }
    highchartshow(groupdata)
}

//区域图形
function highchartshow(groupdata){
    var allseries=[];
    var colors=['#83cded', '#f6c091', '#9adc9a', '#e89696', '#b895d9'];
    var seriesdata=[
        {name:"基本有机化工板块",data:[],yAxis:0,color:"#4baad3",lineColor:"#3098c5"},
        {name:"合成树脂板块",data:[],yAxis:1,color:"#f9aa65",lineColor:"#f29c51"},
        {name:"合成橡胶板块",data:[],yAxis:2,color:"#74bc74",lineColor:"#38ba38"},
        {name:"合纤原料板块",data:[],yAxis:3,color:"#e56f6f",lineColor:"#dc5a5a"},
        {name:"精细化工板块",data:[],yAxis:4,color:"#a16cd1",lineColor:"#8b4bc6"}
    ];
    var additems=[];
    for(var i=0;i<seriesdata.length;i++){
       additems.push({name:seriesdata[i].name,data:[],yAxis:seriesdata[i].yAxis,color:colors[i],lineColor:seriesdata[i].lineColor});
    }
    var strlegenditems="<div class='legenditems'>";
    for(var i=0;i<additems.length;i++){
        seriesdata.push(additems[i]);
        strlegenditems+="<div class='legenditem'><div class='itemcolor' style='background-color: "+additems[i].lineColor+"'></div><div class='itemname'>"+additems[i].name+"</div></div>"
    }
    strlegenditems+="</div>";

    for(var i=0;i<groupdata.basicchemical.length;i++){
        seriesdata[0].data.push({x:i,y:groupdata.basicchemical[i].items[0][1]});
        seriesdata[5].data.push({x:i,y:groupdata.basicchemical[i].items[0][1]*1.25});
    }
    for(var i=0;i<groupdata.plasthetics.length;i++){
        seriesdata[1].data.push({x:i,y:groupdata.plasthetics[i].items[0][1]});
        seriesdata[6].data.push({x:i,y:groupdata.plasthetics[i].items[0][1]*1.25});
    }
    for(var i=0;i<groupdata.synthal.length;i++){
        seriesdata[2].data.push({x:i,y:groupdata.synthal[i].items[0][1]});
        seriesdata[7].data.push({x:i,y:groupdata.synthal[i].items[0][1]*1.25});
    }
    for(var i=0;i<groupdata.Syntheticfibermaterials.length;i++){
        seriesdata[3].data.push({x:i,y:groupdata.Syntheticfibermaterials[i].items[0][1]});
        seriesdata[8].data.push({x:i,y:groupdata.Syntheticfibermaterials[i].items[0][1]*1.25});
    }
    for(var i=0;i<groupdata.industrychemicals.length;i++){
        seriesdata[4].data.push({x:i,y:groupdata.industrychemicals[i].items[0][1]});
        seriesdata[9].data.push({x:i,y:groupdata.industrychemicals[i].items[0][1]*1.25});
    }

    $('#container').highcharts({
        chart: {
            type: 'area',
            marginRight:150,
            plotBorderWidth:1
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
                enabled: false  //是否显示x轴刻度值
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
                enabled:false,
                align: 'left',
                x: -5,
                formatter: function() {
                    return this.value;
                }
            },
            opposite:false,
            title: {
                offset:50,
                rotation:-0,
                text:seriesdata[0].name
            },
            offset: 0,
            top: '0%',
            height:'20%',
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
                enabled:false
            },
            opposite:false,
           // reversed: true,
            title: {
                offset:50,
                rotation:-0,
                text: seriesdata[1].name
            },
            offset: 0,
            top: '20%',
            height:'20%',
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
                enabled:false,
                align: 'right',
                x: -5
            },
            opposite:false,
           // reversed: true,
            title: {
                offset:50,
                rotation:-0,
                text: seriesdata[2].name
            },
            offset: 0,
            top: '40%',
            height:'20%',
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
                enabled:false,
                align: 'right',
                x: -5
            },
            opposite:false,
            //reversed: true,
            title: {
                offset:50,
                rotation:-0,
                text: seriesdata[3].name
            },
            offset: 0,
            top: '60%',
            height:'20%',
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
                enabled:false,
                align: 'right',
                x: -5
            },
            opposite:false,
           // reversed: true,
            title: {
                margin:-10,
                offset:50,
                rotation:-0,
                text: seriesdata[4].name
            },
            offset: 0,
            top: '80%',
            height:'20%',
            lineWidth: 2
        }

        ],
        legend: {
            enabled:false,
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: 35,
            y:-9,
            width:150,
            MinHeight:230,
            itemStyle: {
                color: '#666666'
            }
        },
        credits: {
            enabled: false
        },
        tooltip: {
            //shared: true
        },
        plotOptions: {
            area: {
                stacking: 'normal',
                lineWidth: 1,
                marker: {
                    enabled:false
                }
            }
        },
        series:seriesdata
    });
    var chartwidth=$(".content_left").width()-10;
    $('#container').css("width",chartwidth);
    $("#container").find("text").css("font-family","微软雅黑");
    $("#container").find("text").css("fill","#666666");
    $("#container").find("text").css("color","#666666");
    $('#container').find(".legenditems").remove()
    $('#container').append(strlegenditems);

}
window.onload=function(){
    var charttooltip=$("#container").find(".highcharts-tooltip").find("text").find("tspan");
    var slicedata=charttooltip.slice(0,15)
    $("#container").find(".highcharts-tooltip").find("text").html(slicedata)
}

function columnchartshowmanager(columndata){
    var tempjamhistorydata=[];
    var temphistorykeys=[];//时间
    var tempindex=null;
    for(var i=0;i<columndata.length;i++){
        tempindex=temphistorykeys.indexOf(columndata[i]["日期"]);
        if(tempindex>-1){
            tempjamhistorydata[tempindex]["主要产品产量"]=parseInt(tempjamhistorydata[tempindex]["主要产品产量"])+parseInt(columndata[i]["主要产品产量"]);
        }else{
            temphistorykeys.push(columndata[i]["日期"]);
            tempjamhistorydata.push(columndata[i]);
        }
    }

    var columnchartshowdata=[];
    var groupkes=[];
    var tempindex=-1;
    for(var i=0;i<tempjamhistorydata.length;i++){
        if(tempjamhistorydata[i]["日期"]>=startDate && tempjamhistorydata[i]["日期"]<=endDate) {
            tempindex = groupkes.indexOf(tempjamhistorydata[i]["日期"]);
            if (tempindex > -1) {
                columnchartshowdata[tempindex].items.push([tempjamhistorydata[i]["日期"], tempjamhistorydata[i]["主要产品产量"]])
            } else {
                groupkes.push(tempjamhistorydata[i]["日期"])
                columnchartshowdata.push({
                    name: "主要产品产量",
                    items: [[tempjamhistorydata[i]["日期"], tempjamhistorydata[i]["主要产品产量"]]]
                })
            }
        }
    }
    var seriesdata=[{name:"主要产品产量",data:[],color:"#4bacd3"}]
    for(var i=0;i<columnchartshowdata.length;i++){
        seriesdata[0].data.push([columnchartshowdata[i].items[0][0],columnchartshowdata[i].items[0][1]]);
    }
    //var seriesdatacount=[];
    //for(var i=0;i<seriesdata.length;i++){
    //    seriesdatacount.push({name:seriesdata[i].name,data:seriesdata[i].data,color:"#4bacd3"});
    //}
    columnchartshow(seriesdata)
}

//柱状图形
function columnchartshow(columndata){
    $('#container2').highcharts({
        chart: {
            type:'column'
        },
        title:{
            text:columndata[0].name,
            style: {
                fontWeight: 'bold'
            }
        },

        xAxis: {
            labels: {
                enabled: false  //是否显示x轴刻度值
            },
            tickWidth:0,
            //tickmarkPlacement: 'on',
            title: {
                enabled: false
            }
        },
        yAxis: {
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
                text:""
            },
            //offset: 0,
            //top: '0%',
            //height:'50%',
            lineWidth: 1
        },
        legend: {
            enabled: false
            //layout: 'vertical',
            //align: 'right',
            //verticalAlign: 'top',
            //x: 35,
            //y:-9,
            //width:200,
            //MinHeight:230,
            //itemStyle: {
            //    color: '#666666'
            //}
        },
        credits: {
            enabled: false
        },
        tooltip: {
            shared: true
        },
        //plotOptions: {
        //    area: {
        //        stacking: 'normal',
        //        lineColor: '#666666',
        //        lineWidth: 1,
        //        marker: {
        //            enabled:false
        //        }
        //    }
        //},
        series:columndata
    });
    var chart2width=$(".container3").width();
    $('#container2').css("width",chart2width)
    $("#container2").find("text").css("font-family","微软雅黑");
    $("#container2").find("text").css("fill","#666666");
    $("#container2").find("text").css("color","#666666");
}

function lineandbullonshowmanager(lineandbullonsdata){
    var tempjamhistorydata=[];
    var temphistorykeys=[];//时间
    var tempindex=null;
    for(var i=0;i<lineandbullonsdata.length;i++){
        tempindex=temphistorykeys.indexOf(lineandbullonsdata[i]["日期"]);
        if(tempindex>-1){
            tempjamhistorydata[tempindex]["现金流"]=parseInt(tempjamhistorydata[tempindex]["现金流"])+parseInt(lineandbullonsdata[i]["现金流"]);
            tempjamhistorydata[tempindex]["边际效益"]=parseInt(tempjamhistorydata[tempindex]["边际效益"])+parseInt(lineandbullonsdata[i]["边际效益"]);
        }else{
            temphistorykeys.push(lineandbullonsdata[i]["日期"]);
            tempjamhistorydata.push(lineandbullonsdata[i]);
        }
    }

    var lineandbullonsgroup={
        tomoney:[],
        sideeffect:[]
    }
    var linegroupkes=[];
    var tempindexline=-1;
    for(var i=0;i<tempjamhistorydata.length;i++){
        if(tempjamhistorydata[i]["日期"]>=startDate && tempjamhistorydata[i]["日期"]<=endDate){
            tempindexline=linegroupkes.indexOf(tempjamhistorydata[i]["日期"]);
            if(tempindexline>-1){
                lineandbullonsgroup.tomoney[tempindexline].items.push([tempjamhistorydata[i]["日期"],tempjamhistorydata[i]["现金流"]]);
                lineandbullonsgroup.sideeffect[tempindexline].items.push([tempjamhistorydata[i]["日期"],tempjamhistorydata[i]["边际效益"]]);
            }else{
                linegroupkes.push(tempjamhistorydata[i]["日期"]);
                lineandbullonsgroup.tomoney.push({group:"现金流",items:[[parseInt(tempjamhistorydata[i]["x"]),parseInt(tempjamhistorydata[i]["y"]),tempjamhistorydata[i]["现金流"]]]});
                lineandbullonsgroup.sideeffect.push({group:"边际效益",items:[[tempjamhistorydata[i]["日期"],tempjamhistorydata[i]["边际效益"]]]});
            }

        }
    }
    var serieslinedata=[{type:"bubble",name:'现金流',data:[],color:'#75c175'},
        {type:"bubble",name:'现金流',data:[],color:'#6ca6ce'},
        {type:"bubble",name:'现金流',data:[],color:'#b99bd4'},
        {type:"bubble",name:'现金流',data:[],color:'#ff902e'},
        {type:"spline",name:'边际效益',data:[],color:'#75c175'},
        {type:"spline",name:'边际效益',data:[],color:'#6ca6ce'},
        {type:"spline",name:'边际效益',data:[],color:'#b99bd4'},
        {type:"spline",name:'边际效益',data:[],color:'#ff902e'}]

    var seriesbollondata1=lineandbullonsgroup.tomoney
    var slicedata1=seriesbollondata1.slice(0,5);
    for(var j=0;j<slicedata1.length;j++){
        serieslinedata[0].data.push([slicedata1[j].items[0][0],slicedata1[j].items[0][1],slicedata1[j].items[0][2]]);
    }

    var seriesbollondata2=lineandbullonsgroup.tomoney
    var slicedata2=seriesbollondata2.slice(10,15);
    for(var i=0;i<slicedata2.length;i++){
        serieslinedata[1].data.push([slicedata2[i].items[0][0],slicedata2[i].items[0][1],slicedata2[i].items[0][2]]);
    }
    var seriesbollondata3=lineandbullonsgroup.tomoney
    var slicedat3=seriesbollondata3.slice(20,25);
    for(var i=0;i<slicedat3.length;i++){
        serieslinedata[2].data.push([slicedat3[i].items[0][0],slicedat3[i].items[0][1],slicedat3[i].items[0][2]]);
    }
    var seriesbollondata4=lineandbullonsgroup.tomoney
    var slicedata4=seriesbollondata4.slice(40,45);
    for(var i=0;i<slicedata4.length;i++){
        serieslinedata[3].data.push([slicedata4[i].items[0][0],slicedata4[i].items[0][1],slicedata4[i].items[0][2]]);
    }


    var serieslinedata1=lineandbullonsgroup.sideeffect;
    var linedata1=serieslinedata1.slice(0,5)
    for(var i=0;i<linedata1.length;i++){
        serieslinedata[4].data.push([linedata1[i].items[0][0],linedata1[i].items[0][1]]);
    }

    var serieslinedata2=lineandbullonsgroup.sideeffect;
    var linedata2=serieslinedata2.slice(30,35)
    for(var i=0;i<linedata2.length;i++){
        serieslinedata[5].data.push([linedata2[i].items[0][0],linedata2[i].items[0][1]]);
    }

    var serieslinedata3=lineandbullonsgroup.sideeffect;
    var linedata3=serieslinedata3.slice(20,25)
    for(var i=0;i<linedata3.length;i++){
        serieslinedata[6].data.push([linedata3[i].items[0][0],linedata3[i].items[0][1]]);
    }

    var serieslinedata4=lineandbullonsgroup.sideeffect;
    var linedata4=serieslinedata4.slice(40,45)
    for(var i=0;i<linedata4.length;i++){
        serieslinedata[7].data.push([linedata4[i].items[0][0],linedata4[i].items[0][1]]);
    }






    //for(var i=0;i<lineandbullonsgroup.tomoney.length;i++){
    //    serieslinedata[0].data.push([lineandbullonsgroup.tomoney[i].items[0][0],lineandbullonsgroup.tomoney[i].items[0][1],lineandbullonsgroup.tomoney[i].items[0][2]]);
    //}
    //for(var i=0;i<lineandbullonsgroup.sideeffect.length;i++){
    //    serieslinedata[1].data.push([lineandbullonsgroup.sideeffect[i].items[0][0],lineandbullonsgroup.sideeffect[i].items[0][1]]);
    //}

    //console.log(JSON.stringify(serieslinedata[0].data));
    lineandbullonshow(serieslinedata);
}
//气泡与折线综合图形
function lineandbullonshow(lineandbullondata){
    $('#container3').highcharts({
        chart: {
        },
        yAxis: {
            min: 0
        },
        title:{
            text:"现金流 VS 边际效益",
            style: {
                fontWeight: 'bold'
            }
        },
        yAxis: {
            min:0,
            title: {
                text: ''
            }
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: false
                }
            }
        },
        series:lineandbullondata
    });
    //var chart3width=$(".content_left").width()/2-7;
    //$('#container3').css("width",chart3width)
    $("#container3").find("text").css("font-family","微软雅黑");
    $("#container3").find("text").css("fill","#666666");
    $("#container3").find("text").css("color","#666666");
}

Date.prototype.dateformat = function(formatter)
{
    if(!formatter || formatter == "")
    {
        formatter = "yyyy-MM-dd";
    }
    var year = this.getFullYear().toString();
    var month = (this.getMonth() + 1).toString();
    var day = this.getDate().toString();
    var yearMarker = formatter.replace(/[^y|Y]/g,'');
    if(yearMarker.length == 2)
    {
        year = year.substring(2,4);
    }
    var monthMarker = formatter.replace(/[^m|M]/g,'');
    if(monthMarker.length > 1)
    {
        if(month.length == 1)
        {
            month = "0" + month;
        }
    }
    var dayMarker = formatter.replace(/[^d]/g,'');
    if(dayMarker.length > 1)
    {
        if(day.length == 1)
        {
            day = "0" + day;
        }
    }
    return formatter.replace(yearMarker,year).replace(monthMarker,month).replace(dayMarker,day);
}