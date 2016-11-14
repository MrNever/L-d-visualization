/**
 * Created by wanli on 2015/5/5.
 */
onmessage=function(_evt){
    var alldata=_evt.data;//获得数据
    alldata=DataManager(alldata);
    postMessage(alldata);//将获取到的数据发送回主线程
}
function DataManager(_data){

    var _alldata=FilterByUnit(_data.units,_data.filterdata);
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

    return filterdata;
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