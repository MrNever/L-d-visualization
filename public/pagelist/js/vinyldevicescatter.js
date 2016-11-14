/**
 * Created by wanli on 2015/4/28.
 */
$(document.body).ready(function(ev){
    InitControl();
    jqmeterShow(10,2,"vinyl_leftcontent",300,25);
    LoadData();
})

var starttime="2015-04-15 00:00:03.000",endtime="2015-04-22 20:46:07.000";

var  yseries="进料量";
var allData={
    history_zh:null,//综合能耗
    class:null,//种类对照
    jll:null,//进料量
    cot:null,//COT温度
    rlylb:null//燃料原料比
};
var seriescolors=["#20a880","#9729ae","#36aab4","#a63535","#ad6738","#37a035","#42a3a0","#f17889","#f7ed80","#2bf1ae","#f49b3d ","#2ecce9","#aa69ec","#3bed86","#3bc61b","#1a6a73 "];

//1.初始化显示
function InitControl(){
    //时间范围筛选
    var ranges=[];
    var _starttimenumber=TimeConvert(starttime);
    var _endtimenumber=TimeConvert(endtime);
    var _step=(_endtimenumber-_starttimenumber)/10;
    for(var i=0;i<10;i++){
        ranges.push(_starttimenumber+parseInt(i*_step));
    }
    var tempstarttime=ranges[0];
    var tempendtime=ranges[ranges.length-1];
    var picker = $("#slideryear").range_picker({
        //是否显示分割线
        show_seperator:false,
        //是否启用动画
        animate:false,
        //初始化开始区间值
        from:tempstarttime,
        //初始化结束区间值
        to:tempendtime,
        axis_width:200,
        //选取块宽度
        picker_width:14,
        //各区间值
        ranges:ranges,
        onChange:function(from_to){
            starttime=new Date(from_to[0]).dateformat("yyyy-MM-dd hh:mm:ss.S");
            endtime=new Date(from_to[1]).dateformat("yyyy-MM-dd hh:mm:ss.S");
            $(".sliderlabelpanel>.label_left").html(new Date(from_to[0]).dateformat("MM-dd hh:mm:ss"));
            $(".sliderlabelpanel>.label_right").html(new Date(from_to[1]).dateformat("MM-dd hh:mm:ss"));
        },
        onSelect:function(index,from_to){
//                $(".sliderlabelpanel>.label_left").html(from_to[0]);
//                $(".sliderlabelpanel>.label_right").html(from_to[1]);
            RefreshHistoryShow(allData);
            RefreshDevicInfo(allData);
        },
        afterInit:function(){
            var picker = this;
            var ranges = picker.options.ranges;
            $(".sliderlabelpanel>.label_left").html(new Date(ranges[0]).dateformat("MM-dd hh:mm:ss"));
            $(".sliderlabelpanel>.label_right").html(new Date(ranges[ranges.length-1]).dateformat("MM-dd hh:mm:ss"));
        }
    });

    //能耗项
    var yseriesNames=["进料量","COT温度","燃料原料比"];
    var _yseriesliststr="";
    for(var i=0;i<yseriesNames.length;i++){
        if(i===0){
            _yseriesliststr+="<div><div><input type='radio' class='radioitem' name='radiomoyseires' checked value='"+yseriesNames[i]+"'></div><div>"+yseriesNames[i]+"</div></div>";
        }else{
            _yseriesliststr+="<div><div><input type='radio' class='radioitem' name='radiomoyseires' value='"+yseriesNames[i]+"'></div><div>"+yseriesNames[i]+"</div></div>";
        }
    }
    $("#yserieslist").html(_yseriesliststr);

    $("input[name='radiomoyseires']").change(function(ev) {
        yseries=ev.target.value;
        RefreshHistoryShow(allData);
    });

    var TagList=["BA105","BA106","BA107","BA108","BA109","BA110","BA111","BA112","BA113","BA114","BA115","BA1101","BA1102","BA1103","BA1104"];
    InitDeviceTagList(TagList);
}
//初始化装置列表项
function InitDeviceTagList(_TagList){
    CheckedDeviceTags=[];
    //devicelist
    var _deviceliststr="<div><div><input type='checkbox' class='checkboxitem'  value=''></div><div>全部</div></div>";
    for(var i=0;i<_TagList.length;i++){
        if(i<3){
            _deviceliststr+="<div><div><input type='checkbox' class='checkboxitem' checked='checked' value='"+_TagList[i]+"'></div><div>"+_TagList[i]+"</div></div>";
            CheckedDeviceTags.push(_TagList[i]);
        }else{
            _deviceliststr+="<div><div><input type='checkbox' class='checkboxitem' value='"+_TagList[i]+"'></div><div>"+_TagList[i]+"</div></div>";
        }
    }
    $("#devicelist").html(_deviceliststr);
    $("#devicelist").find(".checkboxitem").change(function(ev){
        if(this.value==="" && $(this).parent().parent().children().eq(1).html()==="全部"){
            if(this.checked){
                $("#devicelist").find(".checkboxitem").attr("checked","checked");
            }else{
                $("#devicelist").find(".checkboxitem").removeAttr("checked");
            }
        }
        if($("#devicelist").find(".checkboxitem:checked").length>0){
            CheckedDeviceTags=[];
            $("#devicelist").find(".checkboxitem:checked").each(function(i,ev){
                if(ev.value!==""){
                    CheckedDeviceTags.push(ev.value);
                }
            });
            RefreshHistoryShow(allData);
        }

    })

}


//region 2.更新历史记录Chart显示
function LoadData(){
    var datacount=5;
    //d3.csv("../data/tce_history.csv", function(csv) {
        var csv1=tce_history
        allData.history_zh=csv1;
        datacount--;
        if(datacount<=0){LoadDataEndManager();}
  //  });
    //d3.csv("../data/vinyldevicescatter_class.csv", function(csv) {
    var csv2=vinyldevicescatter_class
        var tempdata=[];
        var tempclassIds=[];
        var tempindex=null;
        for(var i=0;i<csv2.length;i++){
            //ytag,ycid,ycname
            tempindex=tempclassIds.indexOf(csv2[i]["ycid"]);
            if(tempindex>-1){
                tempdata[tempindex].tags.push(csv2[i]["ytag"]);
            }else{
                tempclassIds.push(csv2[i]["ycid"]);
                tempdata.push({id:csv2[i]["ycid"],name:csv2[i]["ycname"],tags:[csv2[i]["ytag"]]});
            }
        }
        allData.class=tempdata;
        datacount--;
        if(datacount<=0){LoadDataEndManager();}
   // });
  //  d3.csv("../data/vinyldevicescatter_cot.csv", function(csv) {
    var csv3=vinyldevicescatter_cot
        allData.cot=csv3;
        datacount--;
        if(datacount<=0){LoadDataEndManager();}
   // });
   // d3.csv("../data/vinyldevicescatter_jll.csv", function(csv) {
    var csv4=vinyldevicescatter_jll;
        allData.jll=csv4;
        datacount--;
        if(datacount<=0){LoadDataEndManager();}
  //  });
  //  d3.csv("../data/vinyldevicescatter_rlylb.csv", function(csv) {
    var csv5=vinyldevicescatter_rlylb
        allData.rlylb=csv5;
        datacount--;
        if(datacount<=0){LoadDataEndManager();}
   // });
}
function LoadDataEndManager(){
    jqmeterShow(10,10,"vinyl_leftcontent",300,25);
    setTimeout(function(){
        jqmeterHide("vinyl_leftcontent");

        RefreshHistoryShow(allData);//综合能耗
        RefreshDevicInfo(allData);//进料量
    }, 500);
}
function FilterDataBydate(_Data){
    var returnData=[];
    if(_Data!=null && _Data.length>0){
        for(var i=0;i<_Data.length;i++){
            if(_Data[i]["date"]>=(starttime) && _Data[i]["date"]<=(endtime)){
                returnData.push(_Data[i]);
            }
        }
    }
    return returnData;
}
function RefreshHistoryShow(_data){
    var _tempdata=FilterDataBydate(CloneObj(_data.history_zh));
    var _tempydata=null;
    switch(yseries){
        case "进料量":
            _tempydata=FilterDataBydate(CloneObj(_data.jll));//进料量
            break;
        case "COT温度":
            _tempydata=FilterDataBydate(CloneObj(_data.cot));//进料量
            break;
        case "燃料原料比":
            _tempydata=FilterDataBydate(CloneObj(_data.rlylb));//燃料原料比
            break;
    }

    var dataseires={
        zh_history:[],
        yseries:[]
    };

    for(var i=0;i<_tempdata.length;i++){
        dataseires.zh_history.push([TimeConvert(_tempdata[i]["date"]),parseFloat(_tempdata[i].nvalue)]);
    }

    var minyvalue=null;
    if(CheckedDeviceTags!=null){
        for(var i=0;i<CheckedDeviceTags.length;i++){
            dataseires.yseries.push({name:CheckedDeviceTags[i]+yseries,color:seriescolors[i],data:[],yAxis:1});
        }

        var _ypdata=null;
        for(var j=0;j<CheckedDeviceTags.length;j++){
            _ypdata=[];
            for(var i=0;i<_tempydata.length;i++){
                _ypdata.push([TimeConvert(_tempydata[i]["date"]),parseFloat(_tempydata[i][CheckedDeviceTags[j]])]);
                if(minyvalue==null){minyvalue=_ypdata[_ypdata.length-1][1]}
                if(_ypdata[_ypdata.length-1][1]<minyvalue){minyvalue=_ypdata[_ypdata.length-1][1]}
            }
            dataseires.yseries[j].data=_ypdata;
        }
    }
    dataseires.yseries.splice(0, 0,{name:"设备综合能耗",type:"column",color:"#75baff",data:dataseires.zh_history,yAxis:0});

    $('#vinyl_historychart').highcharts({
        chart:{
            backgroundColor:""
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
//                        return Highcharts.dateFormat('%Y-%m-%d',this.value);
                    return Highcharts.dateFormat('%d %H:%m:%S',this.value);
                }
            }
        },
        yAxis:[{
            labels:{
                style:{
                    color:"#666666"
                }
            },
            title:{
                text:"",
                style:{
                    color:"#666666",
                    fontFamily:"微软雅黑"
                }
            },
            gridLineWidth:0,
            lineWidth:1,
            lineColor:"#dcdcdc",
            tickColor:"#dcdcdc",
            tickWidth:2,
            tickLength:5
        },{
            labels:{
                style:{
                    color:"#666666"
                }
            },
            gridLineWidth:0,
            title:{
                text:"",
                style:{
                    color:"#666666",
                    fontFamily:"微软雅黑"
                }
            },
            lineWidth:1,
            lineColor:"#dcdcdc",
            tickColor:"#dcdcdc",
            tickWidth:2,
            tickLength:5,
            min:minyvalue,
            opposite: true
        }],
        title:{
            text:""
        },
        tooltip:{
            crosshairs:true,
            shared:true,
            xDateFormat: '%Y-%m-%d %H:%M:%S'
        },
        plotOptions:{
            line:{lineWidth:1,marker:{radius:0,states:{hover:{radius:2,lineWidth:null,lineWidthPlus:0}}}}
        },
        legend:{
            backgroundColor:"",
            borderColor:"#dcdcdc",
            borderRadius:5,
            borderWidth:1,
            itemStyle:{
                color:"#666666",
                fontFamily:"微软雅黑"
            },
            verticalAlign:"bottom",
            align:"center"
        },
        series: dataseires.yseries
    });
}
//endregion

//region  3.更新装置信息显示
var devicedata=null,
    TagGroupData=null,
    DayItems=null;
var CheckedDeviceTags=[];
function RefreshDevicInfo(_data){
    var tempdata=FilterDataBydate(CloneObj(_data.jll));//进料量
    var tempdata=DeviceDataGroupManager(tempdata);
    TagGroupData=tempdata.data;
    DayItems=tempdata.days;

    FilterUpdate();//刷新KPI显示
}
function FilterUpdate(){
    //RefreshDeviceKPI(TagGroupData);//刷新KPI显示
    RefreshDeviceSacctor(TagGroupData,DayItems);
}
//装置分组数据处理
function DeviceDataGroupManager(_data){
    var _groupdata=[];
    var _groupnames=["BA105","BA106","BA107","BA108","BA109","BA110","BA111","BA112","BA113","BA114","BA115","BA1101","BA1102","BA1103","BA1104"];

    var tempdays=[];
    var tempdayvalues=[];

    var tempindex=null;
    for(var i=0;i<_groupnames.length;i++){
        tempdays=[];
        tempdayvalues=[];
        _groupdata.push({group:_groupnames[i],items:[]});
        for(var j=0;j<_data.length;j++){
            _groupdata[i].items.push({date:_data[j]["date"].substr(0,10),value:parseFloat(_data[j][_groupnames[i]])});
        }

        for(var j=0;j<_groupdata[i].items.length;j++){
            tempindex=tempdays.indexOf(_groupdata[i].items[j].date);
            if(tempindex>-1){
                tempdayvalues[tempindex].value+=_groupdata[i].items[j].value;
                tempdayvalues[tempindex].number++;
                tempdayvalues[tempindex].tolvalue=parseFloat(((tempdayvalues[tempindex].value/tempdayvalues[tempindex].number)*24).toFixed(3));

            }else{
                tempdays.push(_groupdata[i].items[j].date);
                tempdayvalues.push({day:_groupdata[i].items[j].date,daynum:tempdays.length,value:_groupdata[i].items[j].value,number:1,tolvalue:(_groupdata[i].items[j].value)*24,group:_groupnames[i]});
            }
        }
        _groupdata[i].items=tempdayvalues;
    }

    return {
        data:_groupdata,
        days:tempdays
    };
}

function RefreshDeviceKPI(_groupdata){
    var strkpilist="";
    for(var i=0;i<_groupdata.length;i++){
        strkpilist+="<div><div class='groupname'>"+_groupdata[i].group+"</div><div class='value'>"+_groupdata[i].sumvalue+"</div></div>"
    }
    $("#vinyl_kpilist").html(strkpilist);
}

var circleitems=[];
var circlesizelist=[];
var classcolors=[];//item:{name,color}
var classcolorArray=["#f49b3d","#a63535","#f17889","#20a880","#1a6a73","#9729ae"];
function RefreshDeviceSacctor(data,_days){
    classcolors=[];

    var margin = {top: 0, right: 200, bottom: 0, left: 20},
        width = ($("#vinyl_sacctor").width()-margin.left - margin.right),
        height = ($("#vinyl_sacctor").height()-margin.top - margin.bottom);

    var start_date=1,
        end_date =_days.length;

    var c = d3.scale.category20c();

    var x = d3.scale.linear()
        .range([0, width]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("top");

    var formatdates = d3.format("");
    xAxis.tickFormat(formatdates);
    $("#vinyl_sacctor").html("");

    var svg = d3.select("#vinyl_sacctor").append("svg")
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
    var minmaxvalue={min:null,max:null};
    var tempdata=CloneObj(data);
    for(var i=0;i<tempdata.length;i++){
        tempdata[i].items.sort(function(a,b){
            return a.tolvalue> b.tolvalue?1:-1
        })
        if(minmaxvalue.min==null){
            minmaxvalue.min=tempdata[i].items[0].tolvalue
        }else{
            if(tempdata[i].items[0].tolvalue<minmaxvalue.min){
                minmaxvalue.min=tempdata[i].items[0].tolvalue
            }
        }
        if(minmaxvalue.max==null){
            minmaxvalue.max=tempdata[i].items[tempdata[i].items.length-1].tolvalue
        }else{
            if(tempdata[i].items[tempdata[i].items.length-1].tolvalue>minmaxvalue.max){
                minmaxvalue.max=tempdata[i].items[tempdata[i].items.length-1].tolvalue
            }
        }
    }
    tempdata=null;

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
            .domain([minmaxvalue.min, minmaxvalue.max])
            .range([1, 8]);

        circles
            .attr("cx", function(d, i) {
                return xScale(d.daynum);
            })
            .attr("cy", j*20+20)
            .attr("r", function(d) {
                var tempsize=parseInt(rScale(d.tolvalue));
                UpdateCircleSize(tempsize,d.tolvalue);
                return  tempsize;
            })
            .style("fill", function(d) {
                //return c(j);
               return GetColor(d);
            });

        text
            .attr("y", j*20+25)
            .attr("x",function(d, i) {
                return xScale(d.daynum);
                //var tempNumber=xScale(d.daynum);
                //if(checkRate(tempNumber)){
                //    return tempNumber;
                //}
            })
            .attr("class","value")
            .text(function(d){
                //return d[1];
              return d.tolvalue;
            })
            .style("fill", function(d) {
                //return c(j);
                return GetColor(d);
            })
            .style("display","none");

        g.append("text")
            .attr("y", j*20+25)
            .attr("x",width+20)
            .attr("class","label")
            .text(data[j]['group'])
            .style("fill", function(d) {
                //return c(j);
                return "#666666";
            })
            .on("mouseover", mouseover)
            .on("mouseout", mouseout);
    };
    $(".x").remove()

    function mouseover(p) {
        var g = d3.select(this).node().parentNode;
        d3.select(g).selectAll("circle").style("display","none");
        d3.select(g).selectAll("text.value").style("display","block");
    }

    function mouseout(p) {
        var g = d3.select(this).node().parentNode;
        d3.select(g).selectAll("circle").style("display","block");
        d3.select(g).selectAll("text.value").style("display","none");
    }
    //更新点大小数值参照
    ReferenceCircleSizeChange();
    RefreshClassColor();//更新颜色对照表
}
function GetColor(_tagobj){
    var tempcolor=null;
    var strclassname="";
    if(allData.class!=null){
        for(var i=0;i<allData.class.length;i++){
            for(var j=0;j<allData.class[i].tags.length;j++){
                if(allData.class[i].tags[j]==_tagobj.group){
                    tempcolor=classcolorArray[i];
                    strclassname=allData.class[i].name;
                    break;
                }
            }
            if(tempcolor!=null){
                break;
            }
        }
    }
    if(tempcolor==null){
        tempcolor="#20a880";
    }
    var bolIsExt=false;
    for(var i=0;i<classcolors.length;i++){
        if(classcolors[i].color==tempcolor){
            bolIsExt=true;
            break;
        }
    }
    if(!bolIsExt){
        classcolors.push({name:strclassname,color:tempcolor});
    }

    return tempcolor;
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
function ReferenceCircleSizeChange(){
    //circleitems:{size,meavalue,items}
    var tempSizediv="";
    circleitems.sort(function(a,b){return a.size- b.size;});
    var tempdivsize= 0,temptop=0;
    for(var i=0;i<circleitems.length;i++){
        tempdivsize=circleitems[i].size*2;
        temptop=(17-tempdivsize)/2;
        tempSizediv+="<div class='circleitem'><div class='circletext'>"+circleitems[i].meavalue+"</div><div class='circle_panel'><div class='circle' style='width:"+tempdivsize+"px;height:"+tempdivsize+"px;border-radius:"+circleitems[i].size+"px;margin-top:"+temptop+"px;'></div></div></div>";
    }
    tempSizediv="<div class='devicecirclepanel'>"+tempSizediv+"</div>";
    $("#vinyl_sacctor").find(".devicecirclepanel").remove();
    $("#vinyl_sacctor").append(tempSizediv);
}
function RefreshClassColor(){
    var strhtml="";
    for(var i=0;i<classcolors.length;i++){
        strhtml+="<div class='colorlegend_item'><div class='item_color'  style='background-color: "+classcolors[i].color+"'></div><div class='text'>"+classcolors[i].name+"</div></div>"
    }
    strhtml=$("<div class='sacctor_color_legend'>"+strhtml+"</div>");
    $("#vinyl_sacctor").find(".sacctor_color_legend").remove();
    $("#vinyl_sacctor").append(strhtml);
}
//endregion

Date.prototype.dateformat = function(format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(),    //day
        "h+": this.getHours(),   //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
    return format;
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
//对象克隆
function CloneObj(obj) {
    var o;
    switch(typeof obj){
        case 'undefined': break;
        case 'string'   : o = obj + '';break;
        case 'number'   : o = obj - 0;break;
        case 'boolean'  : o = obj;break;
        case 'object'   :
            if(obj === null){
                o = null;
            }else{
                if(obj instanceof Array){
                    o = [];
                    for(var i = 0, len = obj.length; i < len; i++){
                        o.push(CloneObj(obj[i]));
                    }
                }else{
                    o = {};
                    for(var k in obj){
                        o[k] = CloneObj(obj[k]);
                    }
                }
            }
            break;
        default:
            o = obj;break;
    }
    return o;
}