/**
 * Created by wanli on 2015/4/29.
 */

//region 报警数据处理方法方法

/*初始化加载报警数据
* _callbackfun:加载完成后回调函数*/
function LoadAlarmData(_callbackfun){
    var temphistorydata,jamhistorydata,vareainfo=null;
    var requistcount=3;
    //d3.csv("../data/alarm_history.csv", function(csv) {
        var csv1=alarm_history;
        temphistorydata=csv1;
        requistcount--;
        if(requistcount<=0){
            DataLoadEnd(temphistorydata,jamhistorydata,vareainfo,_callbackfun);
        }
  //  });
  //  d3.csv("../data/alarm_jam_history.csv", function(csv) {
        var csv2=alarm_jam_history;
        jamhistorydata=csv2;
       // console.log(JSON.stringify(jamhistorydata))
        requistcount--;
        if(requistcount<=0){
            DataLoadEnd(temphistorydata,jamhistorydata,vareainfo,_callbackfun);
        }
   // });
   // d3.csv("../data/alarm_vareainfo.csv", function(csv) {
        var csv3=alarm_vareainfo;
        vareainfo=csv3;
        requistcount--;
        if(requistcount<=0){
            DataLoadEnd(temphistorydata,jamhistorydata,vareainfo,_callbackfun);
        }
  //  })
}

/*加载完成处理*/
function DataLoadEnd(_historydata,_jamhistorydata,_vareainfo,_callback){
    //region 1.维护装置信息集合数组
    var tempvareakeys=[];
    for(var i=0;i<_vareainfo.length;i++){
        tempvareakeys.push(_vareainfo[i]["设备ID"]);
    }
    //endregion

    //region 2.合并一天内多个时间段的报警数量
    var tempjamhistorydata=[];
    var temphistorykeys=[];//时间
    var tempindex=null;
    for(var i=0;i<_jamhistorydata.length;i++){
        tempindex=temphistorykeys.indexOf(_jamhistorydata[i]["时间"]);
        if(tempindex>-1){
            tempjamhistorydata[tempindex]["报警数"]=parseInt(tempjamhistorydata[tempindex]["报警数"])+parseInt(_jamhistorydata[i]["报警数"]);
        }else{
            temphistorykeys.push(_jamhistorydata[i]["时间"]);
            tempjamhistorydata.push(_jamhistorydata[i]);
        }
    }
    //endregion

    //region 3.补充完整报警KPI历史数据，补充上装置名称、每天的干预报警数量
    tempindex=null;
    for(var i=0;i<_historydata.length;i++){
        tempindex=tempvareakeys.indexOf(_historydata[i]["设备ID"]);
        if(tempindex>-1){
            _historydata[i]["设备名称"]=_vareainfo[tempindex]["设备名称"];
        }else{
            _historydata[i]["设备名称"]="";//对照表中不存在对应的设备名称
        }

        tempindex=temphistorykeys.indexOf(_historydata[i]["时间"]);
        if(tempindex>-1){
            _historydata[i]["操作干预报警数"]=tempjamhistorydata[tempindex]["报警数"];
        }else{
            _historydata[i]["操作干预报警数"]=0;//操作干预报警数中不存在当天的操作干预报警数据
        }
        _historydata[i]["平均报警率"]=parseFloat(_historydata[i]["平均报警率"]);
        _historydata[i]["峰值报警率"]=parseFloat(_historydata[i]["峰值报警率"]);
        _historydata[i]["报警数"]=parseInt(_historydata[i]["报警数"]);
        _historydata[i]["扰动率"]=parseFloat(_historydata[i]["扰动率"]);
        _historydata[i]["低值报警率"]=parseFloat(_historydata[i]["低值报警率"]);
        _historydata[i]["泛滥报警"]=parseInt(_historydata[i]["泛滥报警"]);
        _historydata[i]["泛滥时间"]=parseInt(_historydata[i]["泛滥时间"]);
    }
    //endregion
    tempvareakeys=tempjamhistorydata=temphistorykeys=tempindex=null;
    var  tempdata={
        historydata:_historydata,
        vareadata:_vareainfo
    }
    _callback(tempdata);
}


/*获取各个岗位的 分组数据
 * _alldata:完整的数据集
 * _startdate：开始日期，格式:yyyy-MM-dd
 * _enddate:结束日期，格式:yyyy-MM-dd
 * */
function GetAlarmGroupData(_alldata,_startdate,_enddate){
    var groupdata=[];
    var groupkes=[];
    var tempindex=-1;
    for(var i=0;i<_alldata.length;i++){
        if(_alldata[i]["时间"]>=_startdate && _alldata[i]["时间"]<=_enddate){
            tempindex=groupkes.indexOf(_alldata[i]["设备名称"]);
            if(tempindex>-1){
                groupdata[tempindex].items.push(_alldata[i]);
            }else{
                groupkes.push(_alldata[i]["设备名称"]);
                groupdata.push({group:_alldata[i]["设备名称"],items:[_alldata[i]]});
            }
        }
    }
    groupkes=null;
    return groupdata;
}

/*获取各个岗位的报警历史曲线 分组数据
* _alldata:完整的数据集
* _alarmtype:选择的报警类型(平均报警率,峰值报警率,报警数,扰动率)
* _startdate：开始日期，格式:yyyy-MM-dd
* _enddate:结束日期，格式:yyyy-MM-dd
*
* 返回值：
* {
* analarm:正常设备分组历史曲线数据,
* meddle:操作干预设备分组历史曲线数据
* }
* */
function GetAlarmHistoryData(_alldata,_alarmtype,_startdate,_enddate,_dimtype,_vareadata){
    var deviceitems=[];
    var iparentIDs=["2"];
    switch(_dimtype){
        case "device":
            iparentIDs=["2"];
            break;
        case "unit":
            iparentIDs=["3"];
            break;
        case "post":
            iparentIDs=["4","5","6"];
            break;
        default:
            break;
    }
    for(var i=0;i<_vareadata.length;i++){
        if(iparentIDs.indexOf(_vareadata[i]["IPAREID"])>-1){
            deviceitems.push(_vareadata[i]["设备ID"]);
        }
    }

    var groupdata={
        analarm:[],//历史值,item:{group:"设备XX",items:[{x:'2001-01-01',y:21},....]}
        meddle:[]//操作干预历史值,item:{group:"设备XX",items:[{x:'2001-01-01',y:21},....]}
    };
    var groupkes=[];

    var tempindex=-1;
    for(var i=0;i<_alldata.length;i++){
        if(_alldata[i]["时间"]>=_startdate && _alldata[i]["时间"]<=_enddate){
            if(deviceitems.indexOf(_alldata[i]["设备ID"])>-1){
                tempindex=groupkes.indexOf(_alldata[i]["设备名称"]);
                if(tempindex>-1){
                    groupdata.analarm[tempindex].items.push([_alldata[i]["时间"],_alldata[i][_alarmtype]]);
                    groupdata.meddle[tempindex].items.push([_alldata[i]["时间"],_alldata[i]["操作干预报警数"]]);
                }else{
                    groupkes.push(_alldata[i]["设备名称"]);
                    groupdata.analarm.push({group:_alldata[i]["设备名称"],items:[[_alldata[i]["时间"],_alldata[i][_alarmtype]]]});
                    groupdata.meddle.push({group:_alldata[i]["设备名称"],items:[[_alldata[i]["时间"],_alldata[i]["操作干预报警数"]]]});
                }
            }
        }
    }
    groupkes=null;
    return groupdata;
}

/*获取日期控件所需的数据
 * _alldata:完整的数据集
 * _startdate：开始日期，格式:yyyy-MM-dd
 * _enddate:结束日期，格式:yyyy-MM-dd
 *
 * 返回值：
 * _alldata 筛选排序后剩余项
 * */
function CalendarDataDescSort(_alldata,_startdate,_enddate){
    var tempData=[];
    var datekeys=[];
    var tempindex=-1;
    for(var i=0;i<_alldata.length;i++){
        if(_alldata[i]["时间"]>=_startdate && _alldata[i]["时间"]<=_enddate){
            tempindex=datekeys.indexOf(_alldata[i]["时间"]);
            if(tempindex>-1){
                tempData[tempindex]["平均报警率"]=parseFloat(((_alldata[i]["平均报警率"]+tempData[tempindex]["平均报警率"])/2).toFixed(2));
                tempData[tempindex]["峰值报警率"]=parseFloat(((_alldata[i]["峰值报警率"]+tempData[tempindex]["峰值报警率"])/2).toFixed(2));
                tempData[tempindex]["低值报警率"]=parseFloat(((_alldata[i]["低值报警率"]+tempData[tempindex]["低值报警率"])/2).toFixed(2));
                tempData[tempindex]["扰动率"]=parseFloat(((_alldata[i]["扰动率"]+tempData[tempindex]["扰动率"])/2).toFixed(2));
                tempData[tempindex]["报警数"]=parseInt((_alldata[i]["报警数"]+tempData[tempindex]["报警数"])/2);
            }
            else
            {
                datekeys.push(_alldata[i]["时间"]);
                tempData.push(_alldata[i]);
            }
        }
    }
    tempData.sort(function(a,b){
        if (a["时间"] > b["时间"]) {
            return -1;
        } else if (a["时间"] < b["时间"]) {
            return 1;
        } else {
            return 0;
        }
    });
    return tempData;
}
/*获取日期块的颜色和名称
* _type:当前选中的类型（峰值报警率、平均报警率、扰动率）
* _rowobj:行数据(包含所有字段)
*
* 返回值：{name:级别名称,color:颜色值}
* */
function GetClendarcellColorInfo(_type,_rowobj){
    var typevalue=_rowobj[_type];
    var tempcolorinfo={color:"#89eb88",name:"可预测的"};
    switch(_type){
        case "平均报警率":
            tempcolorinfo=mean_color(typevalue);
            break;
        case "峰值报警率":
            tempcolorinfo=max_color(typevalue);
            break;
        case "扰动率":
            tempcolorinfo=dynamic_color(typevalue);
            break;
        default :
            break;
    }
    return tempcolorinfo;
}

/*散点数据获取
* _alldata:所有数据
* _startdate:开始日期
* _enddate:结束日期
* */
function SacttorManager(_alldata,_startdate,_enddate,_alarmsacttornode,_type){
    var tempData=[];//item:{group:"名称",items:[]}
    var tempgroup=[];
    var min_maxvalue= {min:null,max:null}

    for(var i=0;i<_alldata.length;i++){
        if(_alldata[i]["时间"]>=_startdate && _alldata[i]["时间"]<=_enddate && _alldata[i]["设备ID"]==_alarmsacttornode){
            tempData.push({"时间":_alldata[i]["时间"],"报警数":_alldata[i]["报警数"],"操作干预报警数":_alldata[i]["操作干预报警数"]});
            if(min_maxvalue.min==null){
                min_maxvalue.min=_alldata[i][_type];
                min_maxvalue.max=_alldata[i][_type]
            };
            if(_alldata[i][_type]<min_maxvalue.min){
                min_maxvalue.min=_alldata[i][_type];
            }
            if(_alldata[i][_type]>min_maxvalue.max){
                min_maxvalue.max=_alldata[i][_type];
            }
        }
    }

    var temprow=0;
    for(var i=0;i<tempData.length;i++){
        if(tempgroup[temprow]!=null){
            if(tempgroup[temprow].items.length<10){
                tempData[i].index=tempgroup[temprow].items.length+1;
                tempgroup[temprow].items.push(tempData[i]);
            }else{
                temprow++;
                tempData[i].index=1;
                tempgroup.push({group:temprow,items:[tempData[i]]});
            }
        }else{
            tempData[i].index=1;
            tempgroup.push({group:temprow,items:[tempData[i]]});
        }
    }
    return {groupdata:tempgroup,minmax:min_maxvalue};
}


function mean_color(_mean){
    var tempcolor={color:"#89eb88",name:"可预测的"};
    if(_mean<=1){
        tempcolor={color:"#89eb88",name:"可预测的"};
    }
    if(_mean>1 && _mean<=10){
        tempcolor.color="#fff9c9";
        tempcolor.name="鲁棒的";
    }
    //if(_mean<=10 && _max>100 && _max<=1000){
    //    tempcolor="#f69a54";
    //}
    if(_mean>10 && _mean<=100){
        tempcolor.color="#ffafbe";
        tempcolor.name="反应性的";
    }
    if(_mean>100){
        tempcolor.color="#c75151";
        tempcolor.name="超负荷的";
    }
    return tempcolor;
}
function max_color(_max){
    var tempcolor={color:"#89eb88",name:"可预测的"};
    if(_max<=10){
        tempcolor={color:"#89eb88",name:"可预测的"};
    }
    if(_max>10 && _max<=100){
        tempcolor={color:"#fff9c9",name:"鲁棒的"};
    }
    if(_max>100 && _max<=1000){
        tempcolor={color:"#f69a54",name:"稳定的"};
    }
    if(_max>1000){
        tempcolor={color:"#ffafbe",name:"反应性的"};
    }
    return tempcolor;
}
function dynamic_color(_dynamic){
    var tempcolor={color:"#89eb88",name:"可预测的"};
    if(_dynamic<=1){
        tempcolor={color:"#89eb88",name:"可预测的"};
    }
    if(_dynamic>1 && _dynamic<=5){
        tempcolor={color:"#fff9c9",name:"鲁棒的"};
    }
    if(_dynamic>5 && _dynamic<=25){
        tempcolor={color:"#f69a54",name:"稳定的"};
    }
    if(_dynamic>25 && _dynamic<=50){
        tempcolor={color:"#ffafbe",name:"反应性的"};
    }
    if(_dynamic>50){
        tempcolor={color:"#c75151",name:"超负荷的"};
    }
    return tempcolor;
}

/**/
function CalKPI(_alldata,_startdate,_enddate,_dimtype,_vareadata){
    var deviceitems=[];
    var iparentIDs=["2"];
    switch(_dimtype){
        case "device":
            iparentIDs=["2"];
            break;
        case "unit":
            iparentIDs=["3"];
            break;
        case "post":
            iparentIDs=["4","5","6"];
            break;
        default:
            break;
    }
    for(var i=0;i<_vareadata.length;i++){
        if(iparentIDs.indexOf(_vareadata[i]["IPAREID"])>-1){
            deviceitems.push(_vareadata[i]["设备ID"]);
        }
    }

    var tempvalue={meavalue:0,meanchain:0,maxvalue:0,maxchain:0,minvalue:0,minchain:0,sumvalue:0,sumchain:0};
    var caltempvalue={meavalue:0,meancount:0,maxvalue:0,maxcount:0,minvalue:0,mincount:0,sumvalue:0,sumcount:0}
    for(var i=0;i<_alldata.length;i++){
        if(deviceitems.indexOf(_alldata[i]["设备ID"])>-1) {
            if (_alldata[i]["时间"] >= _startdate && _alldata[i]["时间"] <= _enddate) {
                caltempvalue.meavalue += _alldata[i]["平均报警率"];
                caltempvalue.meancount++;

                caltempvalue.maxvalue += _alldata[i]["峰值报警率"];
                caltempvalue.maxcount++;

                caltempvalue.minvalue += _alldata[i]["低值报警率"];
                caltempvalue.mincount++;

                caltempvalue.sumvalue += _alldata[i]["报警数"];
                caltempvalue.sumcount++;
            }
        }
    }
    //计算均值
    tempvalue.meavalue=caltempvalue.meavalue=parseFloat(caltempvalue.meavalue/caltempvalue.meancount).toFixed(2);
    tempvalue.maxvalue=caltempvalue.maxvalue=parseFloat(caltempvalue.maxvalue/caltempvalue.maxcount).toFixed(2);
    tempvalue.minvalue=caltempvalue.minvalue=parseFloat(caltempvalue.minvalue/caltempvalue.mincount).toFixed(2);
    tempvalue.sumvalue=caltempvalue.sumvalue;


    //环比值获取
    var mdate=Math.abs(new Date(_enddate)-new Date(_startdate));
    var newstart=new Date(new Date(_startdate) -mdate).dateformat("yyyy-MM-dd");

    var hbcaltempvalue={meavalue:0,meancount:0,maxvalue:0,maxcount:0,minvalue:0,mincount:0,sumvalue:0,sumcount:0}
    for(var i=0;i<_alldata.length;i++){
        if(_alldata[i]["时间"]>=newstart && _alldata[i]["时间"]<_startdate){
            hbcaltempvalue.meavalue+=_alldata[i]["平均报警率"];
            hbcaltempvalue.meancount++;

            hbcaltempvalue.maxvalue+=_alldata[i]["峰值报警率"];
            hbcaltempvalue.maxcount++;

            hbcaltempvalue.minvalue+=_alldata[i]["低值报警率"];
            hbcaltempvalue.mincount++;

            hbcaltempvalue.sumvalue+=_alldata[i]["报警数"];
            hbcaltempvalue.sumcount++;
        }
    }
    //计算环比值
    if(hbcaltempvalue.meavalue!=0){
        tempvalue.meanchain=hbcaltempvalue.meavalue=parseFloat(hbcaltempvalue.meavalue/hbcaltempvalue.meancount).toFixed(2);
        tempvalue.meanchain=parseFloat(((tempvalue.meavalue-tempvalue.meanchain)/tempvalue.meanchain*100).toFixed(1));
    }

    if(hbcaltempvalue.maxvalue!=0) {
        tempvalue.maxchain = hbcaltempvalue.maxvalue = parseFloat(hbcaltempvalue.maxvalue / hbcaltempvalue.maxcount).toFixed(2);
        tempvalue.maxchain = parseFloat(((tempvalue.maxvalue - tempvalue.maxchain) / tempvalue.maxchain * 100).toFixed(1));
    }
    if(hbcaltempvalue.minvalue!=0) {
        tempvalue.minchain = hbcaltempvalue.minvalue = parseFloat(hbcaltempvalue.minvalue / hbcaltempvalue.mincount).toFixed(2);
        tempvalue.minchain = parseFloat(((tempvalue.minvalue - tempvalue.minchain) / tempvalue.minchain * 100).toFixed(1));
    }
    if(hbcaltempvalue.sumvalue!=0) {
        tempvalue.sumchain = hbcaltempvalue.sumvalue;
        tempvalue.sumchain = parseFloat(((tempvalue.sumvalue - tempvalue.sumchain) / tempvalue.sumchain * 100).toFixed(1));
    }

    return tempvalue;
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
//endregion

//region 2.报警分析_报警诊断数据处理
var requistcount=3;
function AlarmDiagnosisDataLoad(_callback){
        var UnitTree=[],//区域单元组织结构树
            point_alarmdata=null,//点位每日API信息
            unitdevice_dayapi=null;//装置每日KPI
  // // d3.csv("../data/position_listdata.csv", function(_csv) {
  //  var csv1=position_listdata;
  //      UnitTree=csv1;
  //      requistcount--;
  //      if(requistcount<=0){
  //          LoadEndCallback(_callback,UnitTree,point_alarmdata,unitdevice_dayapi);
  //      }
  ////  });
  // // d3.csv("../data/point_alarmdata.csv", function(_csv) {
  //  var csv2=point_alarmdata;
  //      point_alarmdata=csv2;
  //      requistcount--;
  //      if(requistcount<=0){
  //          LoadEndCallback(_callback,UnitTree,point_alarmdata,unitdevice_dayapi);
  //      }
  ////  });
  // // d3.csv("../data/device_everydaykpi.csv", function(_csv) {
  //  var csv3=device_everydaykpi;
  //      unitdevice_dayapi=csv3;
  //     // console.log(JSON.stringify(unitdevice_dayapi))
  //      requistcount--;
  //      if(requistcount<=0){
  //          LoadEndCallback(_callback,UnitTree,point_alarmdata,unitdevice_dayapi);
  //      }
  // // });
    var csv1=position_listdata;
    UnitTree=csv1;
    var csv2=point_alarmdatap;
    point_alarmdata=csv2;
    var csv3=device_everydaykpi;
    unitdevice_dayapi=csv3;
    LoadEndCallback(_callback,UnitTree,point_alarmdata,unitdevice_dayapi);


}
//加载数据完成
function LoadEndCallback(_callback,_unitdata,_pointapi,_deviceapi){
    var ALLdata={
        unitdata:[],
        pointapi:_pointapi,
        deviceapi:_deviceapi
    }
    ALLdata.unitdata=Loadsubunit(ALLdata.unitdata,0,_unitdata);

    _callback(ALLdata);
}
//加载子区域与岗位
function Loadsubunit(_unitTree,_Ipareid,_list){
    for(var i=0;i<_list.length;i++){
        if(_list[i]["IPAREID"]==_Ipareid){
            _unitTree.push({id:_list[i]["岗位ID"],name:_list[i]["岗位描述"],items:[]});
        }
    }
    if(_unitTree!=null && _unitTree.length>0){
        for(var i=0;i<_unitTree.length;i++){
            Loadsubunit(_unitTree[i].items,_unitTree[i].id,_list);
        }
    }
    return _unitTree;
}

//日期范围筛选
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
function GetChildrenDeviceAlarmdata(_unitiem,_unitdeviceapi,_devicekeys,_pointapidata){
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
        if( sliderarray.mean_alarm.min==null){
            sliderarray.mean_alarm.min=_unitdeviceapi[tempindex]["平均报警率"];
        }else{
            if(_unitdeviceapi[tempindex]["平均报警率"]<sliderarray.mean_alarm.min){
                sliderarray.mean_alarm.min=_unitdeviceapi[tempindex]["平均报警率"];
            }
        }
        if( sliderarray.mean_alarm.max==null){
            sliderarray.mean_alarm.max=_unitdeviceapi[tempindex]["平均报警率"];
        }else{
            if(_unitdeviceapi[tempindex]["平均报警率"]>sliderarray.mean_alarm.max){
                sliderarray.mean_alarm.max=_unitdeviceapi[tempindex]["平均报警率"];
            }
        }

        if( sliderarray.max_alarm.min==null){
            sliderarray.max_alarm.min=_unitdeviceapi[tempindex]["峰值报警率"];
        }else{
            if(_unitdeviceapi[tempindex]["峰值报警率"]<sliderarray.max_alarm.min){
                sliderarray.max_alarm.min=_unitdeviceapi[tempindex]["峰值报警率"];
            }
        }
        if( sliderarray.max_alarm.max==null){
            sliderarray.max_alarm.max=_unitdeviceapi[tempindex]["峰值报警率"];
        }else{
            if(_unitdeviceapi[tempindex]["峰值报警率"]>sliderarray.max_alarm.max){
                sliderarray.max_alarm.max=_unitdeviceapi[tempindex]["峰值报警率"];
            }
        }

        if( sliderarray.disturb_alarm.min==null){
            sliderarray.disturb_alarm.min=_unitdeviceapi[tempindex]["扰动率"];
        }else{
            if(_unitdeviceapi[tempindex]["扰动率"]<sliderarray.disturb_alarm.min){
                sliderarray.disturb_alarm.min=_unitdeviceapi[tempindex]["扰动率"];
            }
        }
        if( sliderarray.disturb_alarm.max==null){
            sliderarray.disturb_alarm.max=_unitdeviceapi[tempindex]["扰动率"];
        }else{
            if(_unitdeviceapi[tempindex]["扰动率"]>sliderarray.disturb_alarm.max){
                sliderarray.disturb_alarm.max=_unitdeviceapi[tempindex]["扰动率"];
            }
        }
        //endregion

        LoadDeviceChildren(tempdata[tempdata.length-1].children,_unitiem.items[i].id,_pointapidata);
    }
    return tempdata;
}
function LoadDeviceChildren(_nodes,_parid,_pointapi){
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
            if( sliderarray.alarmsum.min==null){
                sliderarray.alarmsum.min=tempobj["报警数"];
            }else{
                if(tempobj["报警数"]<sliderarray.alarmsum.min){
                    sliderarray.alarmsum.min=tempobj["报警数"];
                }
            }
            if( sliderarray.alarmsum.max==null){
                sliderarray.alarmsum.max=tempobj["报警数"];
            }else{
                if(tempobj["报警数"]>sliderarray.alarmsum.max){
                    sliderarray.alarmsum.max=tempobj["报警数"];
                }
            }

            if( sliderarray.alarmmeddlesum.min==null){
                sliderarray.alarmmeddlesum.min=tempobj["操作干预报警数"];
            }else{
                if(tempobj["操作干预报警数"]<sliderarray.alarmmeddlesum.min){
                    sliderarray.alarmmeddlesum.min=tempobj["操作干预报警数"];
                }
            }
            if( sliderarray.alarmmeddlesum.max==null){
                sliderarray.alarmmeddlesum.max=tempobj["操作干预报警数"];
            }else{
                if(tempobj["操作干预报警数"]>sliderarray.alarmmeddlesum.max){
                    sliderarray.alarmmeddlesum.max=tempobj["操作干预报警数"];
                }
            }
        }
    }
    for(var i=0;i<tempobjs.length;i++){
        _nodes.push(tempobjs[i]);
    }
}
//endregion

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
function LoadPost_PointAlarmNumber(_alldata,_pointapidata){
    //unitdata:单元区域结构数据,devicelist:装置列表,pointapi:点位每日API,deviceapi:设备每日API,pointlist:点位列表
    var groupdata=[];
    var groupkeys=[];
    var tempindex=null;

    var tempid=null;

    //计算岗位下不同报警数量范围的点位个数
    for(var i=0;i<_pointapidata.length;i++){
        var tempobj={};
        tempid=_pointapidata[i]["岗位ID"];
        if(tempid!=null && tempid!=""){
            tempindex=groupkeys.indexOf(tempid);
            if(tempindex>-1){
                tempobj=groupdata[tempindex];
                if(_pointapidata[i]["报警数"]==null || _pointapidata[i]["报警数"]<1){
                    tempobj["%with<1"]++;
                }
                if(_pointapidata[i]["报警数"]>=1 && _pointapidata[i]["报警数"]<10){
                    tempobj["%with1-10"]++;
                    continue;
                }
                if(_pointapidata[i]["报警数"]>=11 && _pointapidata[i]["报警数"]<20){
                    tempobj["%with11-20"]++;
                    continue;
                }
                if(_pointapidata[i]["报警数"]>=21 && _pointapidata[i]["报警数"]<30){
                    tempobj["%with21-30"]++;
                    continue;
                }
                if(_pointapidata[i]["报警数"]>=31 && _pointapidata[i]["报警数"]<50){
                    tempobj["%with31-50"]++;
                    continue;
                }
                if(_pointapidata[i]["报警数"]>=51 && _pointapidata[i]["报警数"]<=100){
                    tempobj["%with51-100"]++;
                    continue;
                }
                if(_pointapidata[i]["报警数"]>100){
                    tempobj["%with>100"]++;
                    continue;
                }
            }else{
                groupkeys.push(tempid);
                tempobj={
                    "岗位ID":_pointapidata[i]["岗位ID"],
                    "岗位描述":_pointapidata[i]["岗位名称"],
                    items:{deviceitems:[],points:[]},
                    "%with<1":0,
                    "%with1-10":0,
                    "%with11-20":0,
                    "%with21-30":0,
                    "%with31-50":0,
                    "%with51-100":0,
                    "%with>100":0
                };
                if(_pointapidata[i]["报警数"]==null || _pointapidata[i]["报警数"]<1){
                    tempobj["%with<1"]++;
                }else{
                    if(_pointapidata[i]["报警数"]>=1 && _pointapidata[i]["报警数"]<10){
                        tempobj["%with1-10"]++;
                    }else{
                        if(_pointapidata[i]["报警数"]>=11 && _pointapidata[i]["报警数"]<20){
                            tempobj["%with11-20"]++;
                        }else{
                            if(_pointapidata[i]["报警数"]>=21 && _pointapidata[i]["报警数"]<30){
                                tempobj["%with21-30"]++;
                            }else{
                                if(_pointapidata[i]["报警数"]>=31 && _pointapidata[i]["报警数"]<50){
                                    tempobj["%with31-50"]++;
                                }else{
                                    if(_pointapidata[i]["报警数"]>=51 && _pointapidata[i]["报警数"]<=100){
                                        tempobj["%with51-100"]++;
                                    }else{
                                        if(_pointapidata[i]["报警数"]>100){
                                            tempobj["%with>100"]++;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                groupdata.push(tempobj)
            }
        }
    }
    return groupdata;
}
function LoadTopNTreeData(topnNodeid,_devicekpidata,_topNcolumn,_topNumber){
    topnNodeid=parseInt(topnNodeid);

    var items=[];
    if(topnNodeid<=3){
        for(var i=0;i<_devicekpidata.length;i++){
            items.push({name:_devicekpidata[i]["位号"],TopNvalue:_devicekpidata[i][_topNcolumn]});
        }
    }else{
        if(topnNodeid>3 && topnNodeid<=6){
            for(var i=0;i<_devicekpidata.length;i++){
                if(_devicekpidata[i]["单元ID"]==topnNodeid){
                    items.push({name:_devicekpidata[i]["位号"],TopNvalue:_devicekpidata[i][_topNcolumn]});
                }
            }
        }else{
            if(topnNodeid>6 && topnNodeid<=12){
                for(var i=0;i<_devicekpidata.length;i++){
                    if(_devicekpidata[i]["岗位ID"]==topnNodeid){
                        items.push({name:_devicekpidata[i]["位号"],TopNvalue:_devicekpidata[i][_topNcolumn]});
                    }
                }
            }
        }
    }
    items.sort(function(a,b){return b.TopNvalue- a.TopNvalue});
    items.splice(_topNumber,(items.length-_topNumber));

    return items;
}

