/**
 * Created by  markeluo on 2015/5/1.
 */
$(document.body).ready(function(){
    InitControl();
    LoadData();
})

//region 1.控件初始化
var diagnose_startdate="2014-11-01",diagnose_enddate="2015-04-02";
var treemapcolorcolumn="平均报警率";
var treemapsizecolumn="报警数";
var treemapcolor=["#ed93a6","#a31f28"];
var topncolumn="报警数";
var topnNodeid=3;

var sliderarray={
    alarmsum:{min:null,max:null},//报警数量最小、最大值
    alarmmeddlesum:{min:null,max:null},//操作干预报警数量
    mean_alarm:{min:null,max:null},//均值报警率
    max_alarm:{min:null,max:null},//峰值报警率
    disturb_alarm:{min:null,max:null}//扰动率
}
function InitControl(){
    var ranges=[];
    for(var i=TimeConvert(diagnose_startdate);i<TimeConvert(diagnose_enddate);i=i+(5*24*60*3600)){
        ranges.push(i);
    }
    var picker = $("#slideryear").range_picker({
        //是否显示分割线
        show_seperator:false,
        //是否启用动画
        animate:false,
        //初始化开始区间值
        from:diagnose_startdate,
        //初始化结束区间值
        to:diagnose_enddate,
        axis_width:200,
        //选取块宽度
        picker_width:14,
        //各区间值
        ranges:ranges,
        onChange:function(from_to){
            this.sel.parent().parent().find(".sliderlabelpanel>.label_left").html(new Date(from_to[0]).dateformat("yyyy-MM-dd"));
            this.sel.parent().parent().find(".sliderlabelpanel>.label_right").html(new Date(from_to[1]).dateformat("yyyy-MM-dd"));
            diagnose_startdate=new Date(from_to[0]).dateformat("yyyy-MM-dd");
            diagnose_enddate=new Date(from_to[1]).dateformat("yyyy-MM-dd");
        },
        onSelect:function(index,from_to){
            ReloadChart();
        },
        afterInit:function(){
            var picker = this;
            var ranges = picker.options.ranges;
            this.sel.parent().parent().find(".sliderlabelpanel>.label_left").html(new Date(ranges[0]).dateformat("yyyy-MM-dd"));
            this.sel.parent().parent().find(".sliderlabelpanel>.label_right").html(new Date(ranges[ranges.length-1]).dateformat("yyyy-MM-dd"));
        }
    });
    InitSlider("slider_alarmcount",0,100,10);//报警数量
    InitSlider("slider_alarmmeddlecount",0,100,10);//操作干预报警数量
    InitSlider("slider_mean",0,100,10);//平均报警率
    InitSlider("slider_max",0,100,10);//峰值报警率
    InitSlider("slider_disturb",0,100,10);//扰动率

    $("#alarmcount_size_select").change(function(ev){
        treemapsizecolumn=this.value;//当前选中值
        RefereshTreeMap();
    });
    $("#alarmcount_color_select").change(function(ev){
        //filtertype=this.value;//当前选中值
        treemapcolorcolumn=this.value;//当前选中值
        RefereshTreeMap();
        updaterangebar();
    });
    $("#alarmcount_topn_select").change(function(ev){
        topncolumn=this.value;//当前选中值
        LoadTopN(tempdevicekeys);
    })

    TreeLoad();//加载树
}
function InitSlider(_contairid,_startvalue,_endvalue,_step){
    var ranges=[];
    var stepvalue=(_endvalue-_startvalue)/_step;
    if((stepvalue+"").indexOf(".")>-1){
        stepvalue=parseFloat(stepvalue.toFixed(2));
    }
    for(var i=_startvalue;i<=_endvalue;i=i+stepvalue){
        ranges.push(i);
    }
    if(ranges[ranges.length-1]===_endvalue){}else{
        ranges.push(_endvalue);
    }
    $("#"+_contairid).remove();
    var tempslider=$("<span id='"+_contairid+"'  class='daisy-range-picker slider_number'></span>");
    $("#"+_contairid+"_panel").append(tempslider);
    tempslider.range_picker({
        //是否显示分割线
        show_seperator:true,
        //是否启用动画
        animate:false,
        //初始化开始区间值
        from:_startvalue,
        //初始化结束区间值
        to:_endvalue,
        axis_width:200,
        //选取块宽度
        picker_width:14,
        //各区间值
        ranges:ranges,
        onChange:function(from_to){
            this.sel.parent().parent().find(".sliderlabelpanel>.label_left").html(from_to[0]);
            this.sel.parent().parent().find(".sliderlabelpanel>.label_right").html(from_to[1]);
        },
        onSelect:function(index,from_to){
            switch(this.sel[0].id){
                case "slider_alarmcount":
                    sliderarray.alarmsum={min:from_to[0],max:from_to[1]};
                    break;
                case "slider_alarmmeddlecount":
                    sliderarray.alarmmeddlesum={min:from_to[0],max:ranges[ranges.length-1]};
                    break;
                case "slider_mean":
                    sliderarray.mean_alarm={min:from_to[0],max:from_to[1]};
                    break;
                case "slider_max":
                    sliderarray.max_alarm={min:from_to[0],max:from_to[1]};
                    break;
                case "slider_disturb":
                    sliderarray.disturb_alarm={min:from_to[0],max:from_to[1]};
                    break;
            }
            if(sliderarray.alarmmeddlesum.max==ranges[ranges.length-1]){
                var labelvalue= $(".label_right")[2]
                sliderarray.alarmmeddlesum.max=$(labelvalue).html();
            }
            RefereshTreeMap();
        },
        afterInit:function(){
            var picker = this;
            var ranges = picker.options.ranges;
            this.sel.parent().parent().find(".sliderlabelpanel>.label_left").html(ranges[0]);
            this.sel.parent().parent().find(".sliderlabelpanel>.label_right").html(ranges[ranges.length-1]);
        }
    });
}
function UpdateAllSlider(){
    if(sliderarray.alarmsum.min!=null && sliderarray.alarmsum.max){
        InitSlider("slider_alarmcount",sliderarray.alarmsum.min,sliderarray.alarmsum.max,10);
    }
    if(sliderarray.alarmmeddlesum.min!=null && sliderarray.alarmmeddlesum.max){
        InitSlider("slider_alarmmeddlecount",sliderarray.alarmmeddlesum.min,sliderarray.alarmmeddlesum.max,10);
    }
    if(sliderarray.mean_alarm.min!=null && sliderarray.mean_alarm.max){
        InitSlider("slider_mean",sliderarray.mean_alarm.min,sliderarray.mean_alarm.max,10);
    }
    if(sliderarray.max_alarm.min!=null && sliderarray.max_alarm.max){
        InitSlider("slider_max",sliderarray.max_alarm.min,sliderarray.max_alarm.max,10);
    }
    if(sliderarray.disturb_alarm.min!=null && sliderarray.disturb_alarm.max){
        InitSlider("slider_disturb",sliderarray.disturb_alarm.min,sliderarray.disturb_alarm.max,10);
    }
}
//endregion

//region 2.加载&处理数据
var alldata=null;//obj:{unitdata:单元区域结构数据,devicelist:装置列表,pointapi:点位每日API,deviceapi:设备每日API,pointlist:点位列表}
function LoadData(){
    jqmeterShow(10,3,"content_left_div",300,25);
    AlarmDiagnosisDataLoad(function(_data){
        alldata=_data;
        ReloadChart();
    })
}
//刷新报警Treemap显示
var maprootdata=null;
var filterpointapidata=null;
var filterdeviceapidata=null;
var tempdevicekeys=null;
function ReloadChart(){
    alldata.diagnose_startdate=diagnose_startdate;
    alldata.diagnose_enddate=diagnose_enddate;
    alldata.sliderarray=sliderarray;

   // var worker =new Worker("../js/alarmdiagnose_worker.js"); //创建一个Worker对象并向它传递将在新线程中执行的脚本的URL
    //worker.postMessage(alldata);     //向worker发送数据
    //var maprootdata=null;
    //var filterpointapidata=null;
    //var filterdeviceapidata=null;
    //var tempdevicekeys=null;

    filterpointapidata=DateFilterByDate(alldata.pointapi,"日期",alldata.diagnose_startdate,alldata.diagnose_enddate);
    var temdata=[];
    var tempkeys=[];
    var tempindex=null;
    for(var i=0;i<filterpointapidata.length;i++){
        tempindex=tempkeys.indexOf(filterpointapidata[i]["位号"]);
        if(tempindex>-1){
            temdata[tempindex]["报警数"]=parseInt(temdata[tempindex]["报警数"])+parseInt(filterpointapidata[i]["报警数"]);
            temdata[tempindex]["操作干预报警数"]=parseInt(temdata[tempindex]["操作干预报警数"])+parseInt(filterpointapidata[i]["操作干预报警数"]);
        }else{
            tempkeys.push(filterpointapidata[i]["位号"]);
            temdata.push(filterpointapidata[i]);
        }
    }
    filterpointapidata=temdata;

    filterdeviceapidata=DateFilterByDate(alldata.deviceapi,"日期",alldata.diagnose_startdate,alldata.diagnose_enddate);

    var temdevicedata=[];
    tempkeys=[];
    tempindex=null;
    for(var i=0;i<filterdeviceapidata.length;i++){
        tempindex=tempkeys.indexOf(filterdeviceapidata[i]["装置ID"]);
        if(tempindex>-1){
            temdevicedata[tempindex]["平均报警率"]=parseFloat(((parseInt(temdevicedata[tempindex]["平均报警率"])+parseInt(filterdeviceapidata[i]["平均报警率"]))/2).toFixed(2));
            temdevicedata[tempindex]["峰值报警率"]=parseFloat(((parseInt(temdevicedata[tempindex]["峰值报警率"])+parseInt(filterdeviceapidata[i]["峰值报警率"]))/2).toFixed(2));
            temdevicedata[tempindex]["扰动率"]=parseFloat(((parseInt(temdevicedata[tempindex]["扰动率"])+parseInt(filterdeviceapidata[i]["扰动率"]))/2).toFixed(2));
            temdevicedata[tempindex]["报警数"]=parseInt(temdevicedata[tempindex]["报警数"])+parseInt(filterdeviceapidata[i]["报警数"]);
        }else{
            tempkeys.push(filterdeviceapidata[i]["装置ID"]);
            temdevicedata.push(filterdeviceapidata[i]);
        }
    }
    filterdeviceapidata=temdevicedata;

    var rootnodes=[];
    for(var i=0;i<alldata.unitdata[0].items[0].items.length;i++){
        rootnodes.push({
            name:alldata.unitdata[0].items[0].items[i].name,
            children:GetChildrenDeviceAlarmdata(alldata.unitdata[0].items[0].items[i],filterdeviceapidata,tempkeys,filterpointapidata,alldata.sliderarray)
        });
    }
    maprootdata={
        children:rootnodes,
        name: "root"
    }

    var _returndata={
        maprootdata:maprootdata,
        filterpointapidata:filterpointapidata,
        filterdeviceapidata:filterdeviceapidata,
        tempdevicekeys:tempkeys,
        sliderarray:alldata.sliderarray
    }
   // return _returndata;
  //  worker.onmessage =function(evt){     //接收worker传过来的数据函数
        jqmeterShow(10,10,"content_left_div",300,25);
        //console.log(evt.data);              //输出worker发送来的数据
        maprootdata=_returndata.maprootdata;
        filterpointapidata=_returndata.filterpointapidata;
        tempdevicekeys=_returndata.tempdevicekeys;
        sliderarray=_returndata.sliderarray;

        setTimeout(function(){
            jqmeterHide("content_left_div");
            UpdateAllSlider();//更新所有的Slidder筛选
            updaterangebar();//更新MAP的颜色bar
            LoadTreeMap(CloneObj(maprootdata));
            LoadBar(filterpointapidata);
            LoadTopN(tempdevicekeys);
        }, 500);
   // }
}
//加载treemap
function LoadTreeMap(_treedata){
    var _targetid="kpitreemap"
    $("#"+_targetid).html("");

    margin = {top: 40, right: 10, bottom: 10, left: 10};
    width =$("#"+_targetid).width();
    height =$("#"+_targetid).height();

    var color = d3.scale.category20c();

    treemap = d3.layout.treemap()
        .size([width, height])
        .sticky(true)
        .value(function(d) { return d[treemapsizecolumn] })
        .sort(function(a,b){return a.value- b.value});

    div = d3.select("#"+_targetid);
    var TreeMapNode= div.datum(_treedata).selectAll(".node")
        .data(treemap.nodes)
        .enter().append("div")
        .attr("class", "node")
        .call(position)
        .style("background", function(d) {
            //return d.children ? color(d.name) : null;
            return colorapply(d);
        })
        .html(function(d) {
            //return d.children ? null : d.name;
            if(d.children==null){
                //return d.name+" ("+ d[treemapsizecolumn]+")";
                return d.name;
            }else{
                return "";
            }
        }).attr("title",function(d){
            if(d.children==null){
                return d.name+" ("+ d[treemapsizecolumn]+")";
            }
        });

}
//加载堆积百分比图
function LoadBar(filterpointapidata){
    var bardata=LoadPost_PointAlarmNumber(alldata,filterpointapidata);

    var seriesItems=["%with<1","%with1-10","%with11-20","%with21-30","%with31-50","%with51-100","%with>100"];
    var colors=["#228b22","#00cd00","#008b8b","#ffff00","#ffd700","#f4b51b","#ff4500"];
    var SeriesData=[];
    var xItems=[];
    for(var j=0;j<bardata.length;j++){
        xItems.push(bardata[j]["岗位描述"]);
    }

    for(var i=0;i<seriesItems.length;i++){
        SeriesData.push({name:seriesItems[i],data:[],color:colors[i]});
        for(var j=0;j<bardata.length;j++){
            SeriesData[i].data.push(bardata[j][seriesItems[i]]);
        }
    }
    $('#alarmnumber_bar').highcharts({
        chart:{
            backgroundColor:"",
            type:"column"
        },
        credits:{enabled:false},
        xAxis:{
            categories: xItems,
            labels:{
                rotation:-20,
                style:{
                    color:"#666666",
                    fontFamily:"微软雅黑",
                    fontWeight: 'none',
                    fontSize:6
                }
            }
        },
        yAxis:{
            labels:{
                style:{
                    color:"#666666",
                    fontFamily:"微软雅黑",
                    fontWeight: 'none',
                    fontSize:6
                }
            },
            gridLineWidth:1,
            lineWidth:1,
            lineColor:"#dcdcdc",
            tickColor:"#dcdcdc",
            tickWidth:2,
            tickLength:5,
            title:{text:""}
        },
        title:{
            text:""
        },
        tooltip:{
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y:,.0f}</b> ({point.percentage:.1f}%)<br/>',
            shared: true
        },
        plotOptions: {
            column: {
                stacking: 'percent',
                lineColor: '#ffffff',
                lineWidth: 1,
                marker: {
                    lineWidth: 1,
                    lineColor: '#ffffff'
                }
            }
        },
        legend:{

            backgroundColor:"",
            borderColor:"#dcdcdc",
            borderRadius:5,
            borderWidth:1,
            itemStyle:{
                color:"#666666",
                fontFamily:"微软雅黑",
                fontWeight: 'none',
                fontSize:6
            },
            verticalAlign:"bottom",
            align:"center"
        },
        series: SeriesData
    });
}
function LoadTopN(_devicekpikes){
    var treedata=LoadTopNTreeData(topnNodeid,filterpointapidata,topncolumn,10);
    var topncolors=["#b03601","#dc4a04","#f26a17","#fd8c3c","#fcac69","#f0c294","#2976b5","#49c1d3","#3cbba8","#2be15f","#2b8e26"];
    var items=treedata;

    var seiresdata=[{name:"TopN"+topncolumn,data:[]}];
    var xAxisItems=[];
    for(var i=0;i<items.length;i++){
        xAxisItems.push(items[i].name);
        seiresdata[0].data.push({x:i,y:items[i].TopNvalue,color:topncolors[i%topncolors.length]});
    }
    $('#alarmtopn_bar').highcharts({
        chart:{
            backgroundColor:"",
            type:"bar"
        },
        credits:{enabled:false},
        xAxis:{
            categories: xAxisItems,
            labels:{
                style:{
                    color:"#666666",
                    fontFamily:"微软雅黑",
                    fontWeight: 'none',
                    fontSize:6
                }
            }
        },
        yAxis:{
            labels:{
                style:{
                    color:"#666666",
                    fontFamily:"微软雅黑",
                    fontWeight: 'none',
                    fontSize:6
                }
            },
            gridLineWidth:1,
            lineWidth:1,
            lineColor:"#dcdcdc",
            tickColor:"#dcdcdc",
            tickWidth:2,
            tickLength:5,
            title:{text:""}
        },
        title:{
            text:""
        },
        legend:{
            enabled:false,
            backgroundColor:"",
            borderColor:"#dcdcdc",
            borderRadius:5,
            borderWidth:1,
            itemStyle:{
                color:"#666666",
                fontFamily:"微软雅黑",
                fontWeight: 'none',
                fontSize:6
            },
            verticalAlign:"bottom",
            align:"center"
        },
        series: seiresdata
    });

}

function colorapply(nodeinfo){
    var returncolor="none";
    if(nodeinfo[treemapcolorcolumn]!=null){
        var value1= 0,value2=0;
        switch(treemapcolorcolumn){
            case "平均报警率":
                value1=(nodeinfo[treemapcolorcolumn]-sliderarray.mean_alarm.min);
                value2=(sliderarray.mean_alarm.max-nodeinfo[treemapcolorcolumn]);
                break;
            case "峰值报警率":
                value1=(nodeinfo[treemapcolorcolumn]-sliderarray.max_alarm.min);
                value2=(sliderarray.max_alarm.max-nodeinfo[treemapcolorcolumn]);
                break;
            case "扰动率":
                value1=(nodeinfo[treemapcolorcolumn]-sliderarray.disturb_alarm.min);
                value2=(sliderarray.disturb_alarm.max-nodeinfo[treemapcolorcolumn]);
                break;
        }
        returncolor= colorGradient(treemapcolor[0],treemapcolor[1],value1,value2);
    }else{
        returncolor="none";
    }
    return returncolor;
}
function updaterangebar(){
    var min,max=null;
    switch(treemapcolorcolumn){
        case "平均报警率":
            min=sliderarray.mean_alarm.min;
            max=sliderarray.mean_alarm.max;
            break;
        case "峰值报警率":
            min=sliderarray.max_alarm.min;
            max=sliderarray.max_alarm.max;
            break;
        case "扰动率":
            min=sliderarray.disturb_alarm.min;
            max=sliderarray.disturb_alarm.max;
            break;
    }
    $("#alarmcount_color_bar").find(".numberleft").html(min);
    $("#alarmcount_color_bar").find(".numberright").html(max);
    $("#alarmcount_color_bar").find(".numbercenter").css({
        "background":"-webkit-gradient(linear, 0 0, 100% 0, from("+treemapcolor[0]+"), to("+treemapcolor[1]+"))"
    });
}
function position() {
    this.style("left", function(d) { return d.x + "px"; })
        .style("top", function(d) { return d.y + "px"; })
        .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
        .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
}
function RefereshTreeMap(){
    var temprootdata=CloneObj(maprootdata);
    filterdatabysub(temprootdata.children);
    LoadTreeMap(temprootdata);
}
function filterdatabysub(_items){
    for(var i=0;i<_items.length;i++){
        if(_items[i]["平均报警率"]!=null){
            if(_items[i]["平均报警率"]>=sliderarray.mean_alarm.min && _items[i]["平均报警率"]<=sliderarray.mean_alarm.max){
                if(_items[i]["峰值报警率"]>=sliderarray.max_alarm.min && _items[i]["峰值报警率"]<=sliderarray.max_alarm.max){
                    if(_items[i]["扰动率"]>=sliderarray.disturb_alarm.min && _items[i]["扰动率"]<=sliderarray.disturb_alarm.max){
                        if(_items[i].children!=null){
                            filterdatabysub(_items[i].children);
                        }
                    }else{
                        _items.splice(i,1);
                        i--;
                    }
                }else{
                    _items.splice(i,1);
                    i--;
                }
            }else{
                _items.splice(i,1);
                i--;
            }
        }else{
            if(_items[i]["报警数"]!=null){
                if(_items[i]["报警数"]>=sliderarray.alarmsum.min && _items[i]["报警数"]<=sliderarray.alarmsum.max){
                    if(_items[i]["操作干预报警数"]>=sliderarray.alarmmeddlesum.min && _items[i]["操作干预报警数"]<=sliderarray.alarmmeddlesum.max){
                        if(_items[i].children!=null){
                            filterdatabysub(_items[i].children);
                        }
                    }else{
                        _items.splice(i,1);
                        i--;
                    }
                }else{
                    _items.splice(i,1);
                    i--;
                }
            }else{
                if(_items[i].children!=null){
                    filterdatabysub(_items[i].children);
                }
            }
        }
    }
}
//endregion

//region 右侧设置选项面板中的区域->单元->岗位选择Tree加载
function TreeLoad(){
    //初始化数据
    var _nodesdata={
        showcheck:false,
        data:[
            {
                "id" : "3",
                "text" : "乙烯装置",
                "value" : "3",
                "showcheck":false,
                complete : true,
                "isexpand" : true,
                "checkstate" : 0,
                "hasChildren" : true,
                ChildNodes:[
                    {
                        "id" : "4",
                        "text" : "裂解单元",
                        "value" : "4",
                        "showcheck":false,
                        complete : true,
                        "isexpand" : false,
                        "checkstate" : 0,
                        "hasChildren" : true,
                        ChildNodes:[
                            {
                                "id" : "7",
                                "text" : "裂解单元裂解炉岗位",
                                "value" : "7",
                                "showcheck":false,
                                complete : true,
                                "isexpand" : false,
                                "checkstate" : 0,
                                "hasChildren":false
                            },
                            {
                                "id" : "8",
                                "text" : "裂解单元急冷岗位",
                                "value" : "8",
                                "showcheck":false,
                                complete : true,
                                "isexpand" : false,
                                "checkstate" : 0,
                                "hasChildren":false
                            }
                        ]
                    },
                    {
                        "id" : "5",
                        "text" : "分离单元",
                        "value" : "5",
                        "showcheck":false,
                        complete : true,
                        "isexpand" : false,
                        "checkstate" : 0,
                        "hasChildren" :true,
                        ChildNodes:[
                            {
                                "id" : "9",
                                "text" : "分离单元分离岗位",
                                "value" : "9",
                                "showcheck":false,
                                complete : true,
                                "isexpand" : false,
                                "checkstate" : 0,
                                "hasChildren":false
                            },
                            {
                                "id" : "10",
                                "text" : "分离单元压缩岗位",
                                "value" : "10",
                                "showcheck":false,
                                complete : true,
                                "isexpand" : false,
                                "checkstate" : 0,
                                "hasChildren":false
                            }
                        ]
                    },
                    {
                        "id" : "6",
                        "text" : "新区单元",
                        "value" : "6",
                        "showcheck":false,
                        complete : true,
                        "isexpand" : false,
                        "checkstate" : 0,
                        "hasChildren" :true,
                        ChildNodes:[
                            {
                                "id" : "11",
                                "text" : "新区单元裂解炉岗位",
                                "value" : "11",
                                "showcheck":false,
                                complete : true,
                                "isexpand" : false,
                                "checkstate" : 0,
                                "hasChildren":false
                            },
                            {
                                "id" : "12",
                                "text" : "新区单元急冷压缩岗位",
                                "value" : "12",
                                "showcheck":false,
                                complete : true,
                                "isexpand" : false,
                                "checkstate" : 0,
                                "hasChildren":false
                            }
                        ]
                    }
                ]
            }]
    };

    $("#unittree").html("").treeview(_nodesdata);
    $("#unittree").bind("click",function(ev){
        var selnode=$("#unittree").getCurrentNode();
        if(selnode!=null){
            $("#unittree").find(".bbit-tree-node-anchor>span").css({"background-color":"#ffffff"});
            $("#unittree").find(".bbit-tree-ec-icon").css({"background-color":"#ffffff"});
            $(ev.target).css({"background-color":"#dcdcdc"});

            topnNodeid=selnode.value;
            LoadTopN(tempdevicekeys);
        }
    });
}
//endregion
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








function DateFilterByDate(_DataList,_DateColumn,_Start,_End){
    var tempdata=[];
    for(var i=0;i<_DataList.length;i++){
        if(_DataList[i][_DateColumn]>=_Start && _DataList[i][_DateColumn]<=_End){
            tempdata.push(_DataList[i]);
        }
    }
    return tempdata;
}
//加载设备报警信息
function GetChildrenDeviceAlarmdata(_unitiem,_unitdeviceapi,_devicekeys,_pointapidata,_sliderarray){
    var tempdata=[];

    var devicelistlist=[];
    var tempindex=null;
    for(var i=0;i<_unitiem.items.length;i++){
        tempindex=_devicekeys.indexOf(_unitiem.items[i].id);
        tempdata.push({
            name:_unitiem.items[i].name,
            children:[],
            "平均报警率":_unitdeviceapi[tempindex]["平均报警率"],
            "峰值报警率":_unitdeviceapi[tempindex]["峰值报警率"],
            "扰动率":_unitdeviceapi[tempindex]["扰动率"]
        });

        //region 判断并替换最小&最大值
        if( _sliderarray.mean_alarm.min==null){
            _sliderarray.mean_alarm.min=_unitdeviceapi[tempindex]["平均报警率"];
        }else{
            if(_unitdeviceapi[tempindex]["平均报警率"]<_sliderarray.mean_alarm.min){
                _sliderarray.mean_alarm.min=_unitdeviceapi[tempindex]["平均报警率"];
            }
        }
        if( _sliderarray.mean_alarm.max==null){
            _sliderarray.mean_alarm.max=_unitdeviceapi[tempindex]["平均报警率"];
        }else{
            if(_unitdeviceapi[tempindex]["平均报警率"]>_sliderarray.mean_alarm.max){
                _sliderarray.mean_alarm.max=_unitdeviceapi[tempindex]["平均报警率"];
            }
        }

        if( _sliderarray.max_alarm.min==null){
            _sliderarray.max_alarm.min=_unitdeviceapi[tempindex]["峰值报警率"];
        }else{
            if(_unitdeviceapi[tempindex]["峰值报警率"]<_sliderarray.max_alarm.min){
                _sliderarray.max_alarm.min=_unitdeviceapi[tempindex]["峰值报警率"];
            }
        }
        if( _sliderarray.max_alarm.max==null){
            _sliderarray.max_alarm.max=_unitdeviceapi[tempindex]["峰值报警率"];
        }else{
            if(_unitdeviceapi[tempindex]["峰值报警率"]>_sliderarray.max_alarm.max){
                _sliderarray.max_alarm.max=_unitdeviceapi[tempindex]["峰值报警率"];
            }
        }

        if( _sliderarray.disturb_alarm.min==null){
            _sliderarray.disturb_alarm.min=_unitdeviceapi[tempindex]["扰动率"];
        }else{
            if(_unitdeviceapi[tempindex]["扰动率"]<_sliderarray.disturb_alarm.min){
                _sliderarray.disturb_alarm.min=_unitdeviceapi[tempindex]["扰动率"];
            }
        }
        if( _sliderarray.disturb_alarm.max==null){
            _sliderarray.disturb_alarm.max=_unitdeviceapi[tempindex]["扰动率"];
        }else{
            if(_unitdeviceapi[tempindex]["扰动率"]>_sliderarray.disturb_alarm.max){
                _sliderarray.disturb_alarm.max=_unitdeviceapi[tempindex]["扰动率"];
            }
        }
        //endregion

        LoadDeviceChildren(tempdata[tempdata.length-1].children,_unitiem.items[i].id,_pointapidata,_sliderarray);
    }
    return tempdata;
}
function LoadDeviceChildren(_nodes,_parid,_pointapi,_sliderarray){
    var tempobjs=[];
    var tempobjkeys=[];
    var tempindex=-1;

    var tempobj=null;

    for(var j=0;j<_pointapi.length;j++){
        if(_pointapi[j]["岗位ID"]==_parid){
            tempindex=tempobjkeys.indexOf(_pointapi[j]["设备ID"]);
            if(tempindex>-1){
                tempobjs[tempindex]["报警数"]+=parseInt(_pointapi[j]["报警数"]);
                tempobjs[tempindex]["操作干预报警数"]+=parseInt(_pointapi[j]["操作干预报警数"]);

                tempobj=tempobjs[tempindex];
            }else{
                tempobjkeys.push(_pointapi[j]["设备ID"]);
                tempobj={
                    name:_pointapi[j]["设备描述"],
                    "报警数":parseInt(_pointapi[j]["报警数"]),
                    "操作干预报警数":parseInt(_pointapi[j]["操作干预报警数"]),
                    group:_parid
                }
                tempobjs.push(tempobj);

            }
            //region 判断并替换最小&最大值
            if( _sliderarray.alarmsum.min==null){
                _sliderarray.alarmsum.min=tempobj["报警数"];
            }else{
                if(tempobj["报警数"]<_sliderarray.alarmsum.min){
                    _sliderarray.alarmsum.min=tempobj["报警数"];
                }
            }
            if( _sliderarray.alarmsum.max==null){
                _sliderarray.alarmsum.max=tempobj["报警数"];
            }else{
                if(tempobj["报警数"]>_sliderarray.alarmsum.max){
                    _sliderarray.alarmsum.max=tempobj["报警数"];
                }
            }

            if( _sliderarray.alarmmeddlesum.min==null){
                _sliderarray.alarmmeddlesum.min=tempobj["操作干预报警数"];
            }else{
                if(tempobj["操作干预报警数"]<_sliderarray.alarmmeddlesum.min){
                    _sliderarray.alarmmeddlesum.min=tempobj["操作干预报警数"];
                }
            }
            if( _sliderarray.alarmmeddlesum.max==null){
                _sliderarray.alarmmeddlesum.max=tempobj["操作干预报警数"];
            }else{
                if(tempobj["操作干预报警数"]>_sliderarray.alarmmeddlesum.max){
                    _sliderarray.alarmmeddlesum.max=tempobj["操作干预报警数"];
                }
            }
        }
    }
    for(var i=0;i<tempobjs.length;i++){
        _nodes.push(tempobjs[i]);
    }
}