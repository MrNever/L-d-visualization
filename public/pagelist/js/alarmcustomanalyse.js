/**
 * Created by Mr_hu on 2015/5/1.
 */
$(document.body).ready(function(){
    jqmeterShow(10,5,"content_leftdiv",300,25);
    //d3.csv("../data/point_alarmdata2.csv", function(csv) {
        var csv=point_alarmdata2;
        temphistorydata=csv;
        //console.log(JSON.stringify(temphistorydata))
        //chartdata(temphistorydata);
        for(var i=0;i<temphistorydata.length;i++){
            temphistorydata[i]["报警数"]=parseInt(temphistorydata[i]["报警数"]);
            temphistorydata[i]["操作干预报警数"]=parseInt(temphistorydata[i]["操作干预报警数"]);
        }
        InitControl(temphistorydata);
        tablechart(temphistorydata);
  //  })
    $("#unitmanager").click(function () {
        var inputAll = $(".selectoption").find("input[type='checkbox']");

        if (document.getElementById("unitmanager").checked) {
            for (var i = 0; i < inputAll.length; i++) {
                var e = inputAll[i];
                e.checked = true
            }
        } else {
            for (var i = 0; i < inputAll.length; i++) {
                var e = inputAll[i];
                e.checked = false
            }
        }
        selecunits=[];
        $(".selectoption").find(".checkitem:checked").each(function(i,item){
            selecunits.push(item.value);
        });

        RefreshData(_Datefilterdata);
    })

    $("#pointmanager").click(function () {
        var inputAll = $(".pointdata").find("input[type='checkbox']");

        if (document.getElementById("pointmanager").checked) {
            for (var i = 0; i < inputAll.length; i++) {
                var e = inputAll[i];
                e.checked = true
            }
        } else {
            for (var i = 0; i < inputAll.length; i++) {
                var e = inputAll[i];
                e.checked = false
            }
        }
        Refreshpointdata(_Datefilterdata);
    })

    //$("#btnQuery").bind("click",function(ev){
    //    RefreshSelect(DataFiltermanager(evt.data,$("#txtsearchtext").val()));
    //});
    //$("#clearInput").bind('click',function(ev){
    //    $("#txtsearchtext").val("")
    //    RefreshSelect(evt.data);
    //})
    //$("#txtsearchtext").bind('click',function(ev){
    //    $("#clearInput").css("visibility","visible");
    //})
    //$(".selectoption").find(".checkitem").change(function(ev){
    //    checkboxmanager(temphistorydata);
    //});

})

var temphistorydata;
var startdate="2014-11-01";
var enddate="2015-04-02";
var alarmnumcolumn="报警数";
var groupkes=[{id:4,name:"裂解单元"},{id:5,name:"分离单元"},{id:6,name:"新区单元"}];
var selecunits=["4","5","6"];
var selectedpoints=[];
var _tempjamhistorydata=null;//完整数据
var _Datefilterdata=null;//筛选后数据

function chartdata(temphistorydata){
    _tempjamhistorydata=temphistorydata;
    _Datefilterdata=[];

    for(var i=0;i<_tempjamhistorydata.length;i++){
        if(_tempjamhistorydata[i]["日期"]>=startdate && _tempjamhistorydata[i]["日期"]<=enddate){
            _Datefilterdata.push(_tempjamhistorydata[i]);
        }
    }
    RefreshData(_Datefilterdata);
}
function RefreshData(_data){
    var msdata={
        units:selecunits,
        filterdata:_data
    }

    //var worker=new Worker("../js/alarmcustomanalyse_worker.js");
    //worker.postMessage(msdata);     //向worker发送数据

    var _alldata=FilterByUnit(msdata.units,msdata.filterdata);
    ////endregion
    var filterdata=[];
    var temphistorykeys=[];//位号+时间
    var tempindex=null;

    for(var i=0;i<_alldata.length;i++){
        tempindex=temphistorykeys.indexOf(_alldata[i]["位号"]);
        if(tempindex>-1){
            filterdata[tempindex].items.push(_alldata[i]);
        }else{
            temphistorykeys.push(_alldata[i]["位号"]);
            filterdata.push({point_tag:_alldata[i]["位号"],items:[_alldata[i]]})
        }
    }
    temphistorykeys=tempindex=null;

    var strpoint_html="";
    for(var i=0;i<filterdata.length;i++){
        strpoint_html+="<div style='display: -webkit-box;'><div><input type='checkbox' checked='checked' class='checkitem' value="+filterdata[i].point_tag+" style='width: 20px;height: 20px;-webkit-box:-webkit-box-orient'></div><div style='margin-top: 4px;'>"+filterdata[i].point_tag+"</div></div>"
    }

  //  return filterdata;

    //worker.onmessage =function(evt) {     //接收worker传过来的数据函数
            RefreshSelect(filterdata);//更新下拉列表显示
        $("#btnQuery").bind("click",function(ev){
            RefreshSelect(DataFiltermanager(filterdata,$("#txtsearchtext").val()));
        });
        $("#clearInput").bind('click',function(ev){
            $("#txtsearchtext").val("")
            RefreshSelect(filterdata);
        })
        $("#txtsearchtext").bind('click',function(ev){
            $("#clearInput").css("visibility","visible");
        })
  //  }

}
function FilterByUnit(_units,_alldata){
    var unitdata=[];
    var indexitem=null;
    if(_units!=null && _units.length>0){
        for(var i=0;i<_alldata.length;i++){
            indexitem=_units.indexOf(_alldata[i]["单元ID"])
            if(indexitem>-1){
                unitdata.push(_alldata[i])
            }
        }
    }
    return unitdata;
}
//点位处理
function Refreshpointdata(_historydata){
   // _historydata=pointdatamanager(_historydata,BubbleDeviceList);
    var filterdata=[];//item{point_tag:,items:[]}
    var tabdata=[];
    var higchartdata=[];

    var temphistorykeys=[];//位号+时间
    var tempindex=null;
    var tempkey=null;

    for(var i=0;i<_historydata.length;i++){
        tempkey=_historydata[i]["位号"];
        tempindex=temphistorykeys.indexOf(tempkey);
        if(tempindex>-1){
            filterdata[tempindex].items.push(_historydata[i]);
        }else{
            temphistorykeys.push(tempkey);
            filterdata.push({point_tag:tempkey,items:[_historydata[i]]})
        }
    }

    ////endregion

    tempindex=null;
    tempkey=null;
   var checkedcount=$(".pointdata").find(".checkitem:checked");

    for(var i=0;i<checkedcount.length;i++){
        tempindex=temphistorykeys.indexOf(checkedcount[i].value);
        if(tempindex>-1){
            for(var j=0;j<filterdata[tempindex].items.length;j++){
                tabdata.push(filterdata[tempindex].items[j]);
            }
            higchartdata.push(filterdata[tempindex]);
        }
    }
    if(tabdata.length<=0){
        tabdata.push("日期","点位号","点位描述","操作干预报警数","报警数","岗位名称","设备描述","单元名称","装置名称")
    }

    jqmeterShow(10,10,"content_leftdiv",300,25);
    setTimeout(function(ev){
        tablechart(tabdata);
        ////endregion
        highcharts(higchartdata);//更新曲线图形
        jqmeterHide("content_leftdiv");
    },1000);
}

function FilterByUnit(_units,_alldata){
    var unitdata=[];
    var indexitem=null;
    if(_units!=null && _units.length>0){
        for(var i=0;i<_alldata.length;i++){
            indexitem=_units.indexOf(_alldata[i]["单元ID"])
            if(indexitem>-1){
                unitdata.push(_alldata[i])
            }
        }
    }
    return unitdata;
}

//初始化单元选择控件
function selectInit(){
    //groupkes=null;
    var strhtml="";
    for(var i=0;i<groupkes.length;i++){
        strhtml+="<div style='display: -webkit-box;'><div><input type='checkbox' checked='checked' class='checkitem' value="+groupkes[i].id+" style='width: 20px;height: 20px;-webkit-box;-webkit-box-orient'></div><div style='margin-top: 4px;'>"+groupkes[i].name+"</div></div>"
    }
    $(".selectoption").html(strhtml).find(".checkitem").change(function(ev){
        selecunits=[];
        $(".selectoption").find(".checkitem:checked").each(function(i,item){
            selecunits.push(item.value);
        });
        RefreshData(_Datefilterdata);
    })
}
function RefreshSelect(_pointgroupdata){
    var pinthtml="";
    $(".pointdata").find("div").remove();
    for(var i=0;i<_pointgroupdata.length;i++){
        pinthtml+="<div style='display: -webkit-box;'><div><input type='checkbox' checked='checked' class='checkitem' value="+_pointgroupdata[i].point_tag+" style='width: 20px;height: 20px;-webkit-box:-webkit-box-orient'></div><div style='margin-top: 4px;'>"+_pointgroupdata[i].point_tag+"</div></div>"
    }
    $(".pointdata").html(pinthtml).find(".checkitem").change(function(ev){
        Refreshpointdata(_Datefilterdata);
    });

    Refreshpointdata(_Datefilterdata);
}

var searesdata=null
function highcharts(_temphistorydata){
    searesdata=[]
    for(var i=0;i<_temphistorydata.length;i++){
        searesdata.push({name:_temphistorydata[i].point_tag,data:[],color:getgroupcolor(_temphistorydata[i].items[0])});
        for(var j=0;j<_temphistorydata[i].items.length;j++){
            searesdata[searesdata.length-1].data.push([_temphistorydata[i].items[j]["日期"],parseInt(_temphistorydata[i].items[j][alarmnumcolumn])]);
        }
    }
    var topnumber=100;
    if(searesdata.length>topnumber){
        searesdata.splice(topnumber,(searesdata.length-topnumber));
    }

    $('#container').highcharts({
        global: {
            useUTC: false
        },
        chart: {
            type: 'spline',
            plotBorderColor: '#346691',
            plotBorderWidth: 1
      //      inverted: true
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: false
                },
                lineWidth:1
            }
        },
        title: {
            text: ''
        },
        //subtitle: {
        //    text: 'Source: WorldClimate.com',
        //    x: -20
        //},
        xAxis: {
        },
        yAxis: {
            min:0,
            title: {
                text: '报警数量'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        credits: {
            enabled: false
        },
        tooltip: {
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series:searesdata
    });
}
function getgroupcolor(_rowdata){
    var returncolor="#4baad3";
    var colors=['#4baad3','#50B432', '#ED561B'];
    for(var i=0;i<groupkes.length;i++){
        if(_rowdata["单元ID"]==groupkes[i].id){
            returncolor=colors[i];
            break;
        }
    }
    return returncolor;
}

function tablechart(temphistorydata){
   //   var csv=temphistorydata;
    var csv=[];
    for(var i=0;i<temphistorydata.length;i++){
       csv.push({日期:temphistorydata[i]["日期"],点位号:temphistorydata[i]["位号"],点位描述:temphistorydata[i]["位号描述"],操作干预报警数:temphistorydata[i]["操作干预报警数"],报警数:temphistorydata[i]["报警数"],岗位名称:temphistorydata[i]["岗位名称"],设备描述:temphistorydata[i]["设备描述"],单元名称:temphistorydata[i]["单元名称"],装置名称:temphistorydata[i]["装置名称"]})
      //  csv.push(temphistorydata[i])
    }

    var dimensions = new Filter();
    var highlighter = new Selector();
    dimensions.set({data: csv });
    var columns = _(csv[0]).keys();
    columns = _(columns).without("id","单元ID","岗位ID","设备ID","装置ID");
    var slicky = new grid({
        model: dimensions,
        selector: highlighter,
        width: 980,
        columns: columns
    });
    slicky.update();
    //$('#myGrid').resizable({
    //    handles: 's'
    //});
    function addslashes( str ) {
        return (str+'')
            .replace(/\"/g, "\"\"")        // escape double quotes
            .replace(/\0/g, "\\0");        // replace nulls with 0
    };
    $(".slick-header").find("div").css("background","#d3d7d4")
}


function InitControl(temphistorydata,tempjamhistorydata) {
    var ranges = [];
    for (var i = TimeConvert(startdate); i < TimeConvert(enddate); i = i + (5 * 24 * 60 * 3600)) {
        ranges.push(i);
    }
    var picker = $("#slideryear").range_picker({
        //是否显示分割线
        show_seperator: false,
        //是否启用动画
        animate: false,
        //初始化开始区间值
        from: startdate,
        //初始化结束区间值
        to: enddate,
        axis_width: 200,
        //选取块宽度
        picker_width: 14,
        //各区间值
        ranges: ranges,
        onChange: function (from_to) {
            $(".sliderlabelpanel>.label_left").html(new Date(from_to[0]).dateformat("yyyy-MM-dd"));
            $(".sliderlabelpanel>.label_right").html(new Date(from_to[1]).dateformat("yyyy-MM-dd"));
            startdate = new Date(from_to[0]).dateformat("yyyy-MM-dd");
            enddate = new Date(from_to[1]).dateformat("yyyy-MM-dd");
        },
        onSelect: function (index, from_to) {
            chartdata(temphistorydata);
            //LoadAlarmData(areachart);
            //AlarmKPIUpdate();
            //alarmsacttor(searesdata);
        },
        afterInit: function () {
            var picker = this;
            var ranges = picker.options.ranges;
            $(".sliderlabelpanel>.label_left").html(new Date(ranges[0]).dateformat("yyyy-MM-dd"));
            $(".sliderlabelpanel>.label_right").html(new Date(ranges[ranges.length - 1]).dateformat("yyyy-MM-dd"));
        }
    });
    selectInit();//初始化筛选
    chartdata(temphistorydata);

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

function DataFiltermanager(data,_text){
    var tempdata=[];
    for(var i=0;i<data.length;i++){
        for(var item in data[i]){
            if(data[i][item]!=null && (data[i][item]+"").indexOf(_text)>-1){
                tempdata.push(data[i]);
                break;
            }
        }
    }
    return tempdata;
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