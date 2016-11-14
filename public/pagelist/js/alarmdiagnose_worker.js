/**
 * Created by wanli on 2015/5/4.
 */
onmessage=function(_evt){
    var alldata=_evt.data;//获得数据
    alldata=DataManager(alldata);
    postMessage(alldata);//将获取到的数据发送回主线程
}
function DataManager(alldata){
    var maprootdata=null;
    var filterpointapidata=null;
    var filterdeviceapidata=null;
    var tempdevicekeys=null;

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
    return _returndata;
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
//endregion