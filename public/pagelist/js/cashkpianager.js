/**
 * Created by wanli on 2015/4/15.
环比数据
 */

var ChainArray=[];
var SelChainType=null;
var ShowColumns=null;
var _GroupData=null;
var _FilterRangeValue=-9999999999999999999999;
function LoadChainTable(_Data){
    ChainArray=[
        {thiscell:"日现金流",firstcell:"上月日现金流",chaincell:"日现金流环比值",min:null,max:null,sum:0,num:0,mean:0},
        {thiscell:"累计现金流",firstcell:"上月累计现金流",chaincell:"累计现金流环比值",min:null,max:null,sum:0,num:0,mean:0},
        {thiscell:"预计现金流",firstcell:"上月预计现金流",chaincell:"预计现金流环比值",min:null,max:null,sum:0,num:0,mean:0}
    ]

    SelChainType="日现金流";
    ShowColumns=["日现金流","累计现金流","预计现金流"];
    _GroupData=DataGroupCalChain(ChainArray,_Data,"小板块");

    RefreshTable(_GroupData);

    ChainTypeChanged();
}
//更新表格显示
function RefreshTable(_GroupData){
    _GroupData=FilterKPITabelData(_GroupData);

    var thead="<tr><td class='chaintable_cel1'>板块</td><td class='chaintable_cel2'>装置</td><td>日现金流</td><td>累计现金流</td><td>预计现金流</td></tr>";
    var tbody="";
    var tempminmax=null;
    for(var i=0;i<_GroupData.length;i++){
            for(var j=0;j<_GroupData[i].items.length;j++){
                if(j==0){
                    tbody+="<tr>" +
                    "<td rowspan='"+_GroupData[i].items.length+"'>"+_GroupData[i].group+"</td>" +
                    "<td>"+_GroupData[i].items[j]["名称"]+"</td>" +
                    "<td>"+DrawProgressBar(_GroupData[i].items[j],"日现金流","日现金流环比值")+"</td>" +
                    "<td>"+DrawProgressBar(_GroupData[i].items[j],"累计现金流","累计现金流环比值")+"</td>" +
                    "<td>"+DrawProgressBar(_GroupData[i].items[j],"预计现金流","预计现金流环比值")+"</td></tr>";
                }else{
                    tbody+="<tr><td>"+_GroupData[i].items[j]["名称"]+
                    "</td><td>"+DrawProgressBar(_GroupData[i].items[j],"日现金流","日现金流环比值")+
                    "</td><td>"+DrawProgressBar(_GroupData[i].items[j],"累计现金流","累计现金流环比值")+
                    "</td><td>"+DrawProgressBar(_GroupData[i].items[j],"预计现金流","预计现金流环比值")+"</td></tr>";
                }
            }
    }
    var TableHTML="<table class='chaintable'>"+thead+tbody+"</table>";
    $("#content_2").find(".content_bar").html(TableHTML);
    DrawSplitLine();//绘制分割线
}
function DrawSplitLine(){
    var addtrhtml="<tr class='footer'><td></td><td></td><td>"+DrawProgressSplitLine("日现金流","日现金流环比值")+
        "</td><td>"+DrawProgressSplitLine("累计现金流","累计现金流环比值")+
        "</td><td>"+DrawProgressSplitLine("预计现金流","预计现金流环比值")+"</td></tr>";
    $("#content_2").find(".content_bar>table").append(addtrhtml);

    //环比值线
    $(".content_bar").find(".splitline").remove();//移除已有的所有线
    var tabposition={left:$(".chaintable").offset().left,top:$(".chaintable").offset().top,width:$(".chaintable").width(),height:$(".chaintable").height()};
    var temposition=null;
    var temptr=null;
    for(var i=2;i<=4;i++){
        temposition={left:$(".footer").find("td").eq(i).find("p").offset().left,top:$(".footer").find("td").eq(i).find("p").offset().top,width:$(".footer").find("td").eq(i).find("p").width(),height:$(".footer").find("td").eq(i).find("p").height()};
        temptr=$("<div class='splitline'></div>").css({
            left:(temposition.left-tabposition.left+temposition.width)+"px",
            top:"0px",
            height:tabposition.height+"px"
        });
        $(".content_bar").append(temptr);
    }
}

//获取区间最小最大值
function Cal_DataGroupMinMax(_chaincelname,_ChainArray){
    var intervalInfo={min:null,max:null,interval:null,mean:null};
    for(var i=0;i<_ChainArray.length;i++){
        if(_ChainArray[i].thiscell==_chaincelname){
            intervalInfo.min=_ChainArray[i].min;
            intervalInfo.max=_ChainArray[i].max;
            intervalInfo.mean=_ChainArray[i].mean;
            intervalInfo.interval=_ChainArray[i].max-intervalInfo.min;
            break;
        }
    }
    return intervalInfo;
}

//数据分组_环比计算处理
function DataGroupCalChain(_CelArray,_Data,_groupname){
    var groupData=[];//item:{group:"基本有机化工原料",items:[]}
    var groupNames=[];
    if(_CelArray!=null && _CelArray.length>0){
        var TempThisNub=null;
        var TempFirstNub=null;
        var ChainValue=null;
        var tempindex=-1;

        for(var i=0;i<_Data.length;i++){
            for(var j=0;j<_CelArray.length;j++){
                TempThisNub=parseFloat(_Data[i][_CelArray[j].thiscell]);
                TempFirstNub=parseFloat(_Data[i][_CelArray[j].firstcell]);
                if(TempFirstNub==0){
                    _Data[i][_CelArray[j].chaincell]=null;
                }else{
                    if((TempThisNub-TempFirstNub)==0){
                        _Data[i][_CelArray[j].chaincell]=0;
                    }else{
                        ChainValue=(TempThisNub-TempFirstNub)/Math.abs(TempFirstNub)*100;
                        _Data[i][_CelArray[j].chaincell]=ChainValue.toFixed(1);
                    }
                }
                _CelArray[j].sum+=TempFirstNub;
                _CelArray[j].num++;
                _CelArray[j].mean=_CelArray[j].sum/_CelArray[j].num;

                if(_Data[i][_CelArray[j].chaincell]!=null){
                    if(_CelArray[j].min==null){
                        _CelArray[j].min=TempThisNub;
                    }else{
                        if(TempThisNub<_CelArray[j].min){
                            _CelArray[j].min=TempThisNub;
                        }
                    }

                    if(_CelArray[j].max==null){
                        _CelArray[j].max=TempThisNub;
                    }else{
                        if(TempThisNub>_CelArray[j].max){
                            _CelArray[j].max=TempThisNub;
                        }
                    }
                }
            }
            tempindex=groupNames.indexOf(_Data[i][_groupname])
            if(tempindex>-1){
                groupData[tempindex].items.push(_Data[i]);
            }else{
                groupNames.push(_Data[i][_groupname]);
                groupData.push({group:_Data[i][_groupname],items:[_Data[i]]});
            }
        }
    }
    return groupData;
}
function DrawProgressBar(_ItemData,_CellName,_ChainName){
    var CellWidth=($("#content_2").find(".content_left").width()-270)/ShowColumns.length-80;
    var IntervalInfo=Cal_DataGroupMinMax(_CellName,ChainArray);
    var phtml="";

    var CellValueSteppx=(CellWidth/IntervalInfo.interval)*Math.abs(_ItemData[_CellName]);
    var chainvalue=_ItemData[_CellName]-IntervalInfo.mean;
    if(chainvalue==0){
        phtml="<p class='progressbar' style='width: "+CellValueSteppx+"px;background-color:yellow'></p>"+Math.abs(_ItemData[_CellName]);
    }else{
        if(chainvalue>0){
            phtml="<p class='progressbar' style='width: "+CellValueSteppx+"px;background-color:#98df8a'></p>"+Math.abs(_ItemData[_CellName]);
        }else{
            phtml="<p class='progressbar' style='width: "+CellValueSteppx+"px;background-color:#e98585'></p>"+Math.abs(_ItemData[_CellName]);
        }
    }
    return phtml;
}
function DrawProgressSplitLine(_CellName,_ChainName){
    var CellWidth=($("#content_2").find(".content_left").width()-270)/ShowColumns.length-80;
    var IntervalInfo=Cal_DataGroupMinMax(_CellName,ChainArray);
    var phtml="";

    var CellValueSteppx=(CellWidth/IntervalInfo.interval)*Math.abs(IntervalInfo.mean);
    phtml="<p class='progressbar' style='width: "+CellValueSteppx+"px;'></p>"+Math.abs(IntervalInfo.mean);
    return phtml;
}
function ChainTypeChangeManager(){
    $("#content_2").find("input[name='radiomo2']").change(function(ev){
        SelChainType=$("#content_2").find("input[name='radiomo2']:checked").val();
        _FilterRangeValue=-9999999999999999999999;
        ChainTypeChanged();
        RefreshTable(_GroupData);
    })
}
ChainTypeChangeManager();
function ChainTypeChanged(){
    var TypeMinmaxInfo=null;
    for(var i=0;i<ChainArray.length;i++){
        if(ChainArray[i].thiscell==SelChainType){
            TypeMinmaxInfo=ChainArray[i];
            break;
        }
    }
    rangenumber("numberrange2","content_2",TypeMinmaxInfo,function(ev){
        var KPIRangeValue=$("#numberrange2").data("rangevalue");
        _FilterRangeValue=KPIRangeValue;
        RefreshTable(_GroupData);
    });//现金流范围筛选
}
function FilterKPITabelData(_GroupData){
    var clonegroupdata=null;
    clonegroupdata=CloneObj(_GroupData);
    for(var i=0;i<clonegroupdata.length;i++){
        for(var j=0;j<clonegroupdata[i].items.length;j++){
            if(parseFloat(clonegroupdata[i].items[j][SelChainType])>=_FilterRangeValue){}else{
                clonegroupdata[i].items.splice(j,1);
                j--;
            }
        }
        if(clonegroupdata[i].items.length>0){}else{
            clonegroupdata.splice(i,1);
            i--;
        }
    }
    return clonegroupdata;
}

function CloneObj (obj) {
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