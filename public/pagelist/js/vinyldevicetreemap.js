/**
 * Created by wanli on 2015/4/24.
 */
//DOME加载完毕
$(document.body).ready(function(){
    InitControl();//控件初始化
    LoadDataRefreshTreeMap();
});
var startDate="2005-01-01",endDate="2015-12-31",vytype="能耗_天",vydimension="单元";
var groupcolors=[{name:"裂解",color:"#247ba5"},{name:"急冷",color:"#daa03e"},{name:"压缩",color:"#c84957"},
    {name:"分离",color:"#3eb3a9"},{name:"蒸汽",color:"#b0469a"},{name:"水",color:"#368d43"},
    {name:"燃料气",color:"#675caf"},{name:"电",color:"#4ea392"}]
//1.控件初始化
function InitControl(){
    //时间范围筛选
    var ranges=[];
    var _starttimenumber=TimeConvert(startDate);
    var _endtimenumber=TimeConvert(endDate);
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
            startDate=new Date(from_to[0]).dateformat("yyyy-MM-dd");
            endDate=new Date(from_to[1]).dateformat("yyyy-MM-dd");
            $(".sliderlabelpanel>.label_left").html(new Date(from_to[0]).dateformat("yyyy-MM-dd"));
            $(".sliderlabelpanel>.label_right").html(new Date(from_to[1]).dateformat("yyyy-MM-dd"));
        },
        onSelect:function(index,from_to){
            RefreshTreeMap(vytype,vydimension);
        },
        afterInit:function(){
            var picker = this;
            var ranges = picker.options.ranges;
            $(".sliderlabelpanel>.label_left").html(new Date(ranges[0]).dateformat("yyyy-MM-dd"));
            $(".sliderlabelpanel>.label_right").html(new Date(ranges[ranges.length-1]).dateformat("yyyy-MM-dd"));
        }
    });



    $("#vydimensiontype").change(function(ev){
        vydimension=$(this).val();
        RefreshTreeMap(vytype,vydimension);
        UpdatedimensionItems(vydimension);//更新显示项
    })
    $("#timesizetype").change(function(ev){
        var tempvalue=$(this).val();
        switch(tempvalue){
            case "M":
                vytype="能耗_分钟";
                break;
            case "H":
                vytype="能耗_小时";
                break;
            case "D":
                vytype="能耗_天";
                break;
            default :
                break;
        }
        RefreshTreeMap(vytype,vydimension);
    });
    UpdatedimensionItems(vydimension);
}


function UpdatedimensionItems(_type){
    var Items="";
    var allitems=null;
    if(_type==""){
        allitems=["裂解","急冷","压缩","分离","水","燃料气","电"];
    }else{
        if(_type=="单元"){
            allitems=["裂解","急冷","压缩","分离"];
        }else{
            allitems=["蒸汽","水","燃料气","电"];
        }
    }
    for(var i=0;i<allitems.length;i++){
        Items+="<div class='cheitems_item'><div class='item_ico' style='background-color: "+GetColorBygname(allitems[i])+"'></div>"+allitems[i]+"</div>";
    }
    $("#checkitems").html(Items);
}

//region 2.加载数据与筛选处理
var alldata=null;
function LoadDataRefreshTreeMap(){
   // d3.csv("../data/vinyldevicetreemap.csv", function(csv) {
    var csv=vinyldevicetreemap;
        alldata=csv;

        RefreshTreeMap(vytype,vydimension);
   // });
}
//数据筛选处理
function DataFilterByCondition(_type,_dimension){
    var filterdata=[];//{year:2001,items:[{name:'',children:[{name:'',size:11}]}]}}
    var yearstritems=[];

    //先按年度分组
    var tempyear="",tempindex=-1;
    for(var i=0;i<alldata.length;i++){
        if(alldata[i]["date"]>=startDate && alldata[i]["date"]<=endDate){
            tempyear=alldata[i]["date"].substr(0,4);
            tempindex=yearstritems.indexOf(tempyear);
            if(_dimension==""){
                if(tempindex>-1){
                    filterdata[tempindex].items.push({name:alldata[i]["维度项"],childrenname:alldata[i]["装置"],size:parseInt(alldata[i][_type])});
                }else{
                    yearstritems.push(tempyear);
                    filterdata.push({year:tempyear,items:[{name:alldata[i]["维度项"],childrenname:alldata[i]["装置"],size:parseInt(alldata[i][_type])}]});
                }
            }else{
                if(_dimension==alldata[i]["维度"]){
                    if(tempindex>-1){
                        filterdata[tempindex].items.push({name:alldata[i]["维度项"],childrenname:alldata[i]["装置"],size:parseInt(alldata[i][_type])});
                    }else{
                        yearstritems.push(tempyear);
                        filterdata.push({year:tempyear,items:[{name:alldata[i]["维度项"],childrenname:alldata[i]["装置"],size:parseInt(alldata[i][_type])}]});
                    }
                }
            }
        }
    }
    //按维度项分组
    for(var i=0;i<filterdata.length;i++){
        filterdata[i].items=YearDataGroupManager(filterdata[i].items);
    }
    return filterdata;
}
//年度数据分组处理
function YearDataGroupManager(_yearData){
    //item:{name,childrenname,size}
    var items=[];//{name:'',children:[{name:'',size:11}]}
    var groupnames=[];

    var tempindex=-1;
    for(var i=0;i<_yearData.length;i++){
        tempindex=groupnames.indexOf(_yearData[i]["name"]);
        if(tempindex>-1){
            items[tempindex].children.push({name:_yearData[i]["childrenname"],size:_yearData[i]["size"],groupname:_yearData[i]["name"]});
        }else{
            items.push({name:_yearData[i]["name"],children:[{name:_yearData[i]["childrenname"],size:_yearData[i]["size"],groupname:_yearData[i]["name"]}]});
            groupnames.push(_yearData[i]["name"]);
        }
    }
    return items;
}
function GetColorBygname(_name){
    var color="#ffffff";
    for(var i=0;i<groupcolors.length;i++){
        if(groupcolors[i].name==_name){
            color=groupcolors[i].color;
            break;
        }
    }
    return color;
}
//endregion

//region 3.更新TreeMAP显示
function RefreshTreeMap(_type,_dimension){
    var filterdata=DataFilterByCondition(_type,_dimension);
    var treedata=null;

    var mappenel=$("#lefttreemap").html("");
    var tempid="";
    var tempsubpanel=null;
    var stepheight=parseInt(mappenel.height()/filterdata.length-10);
    for(var i=0;i<filterdata.length;i++){
        tempid="lefttreemap_sub"+(i+1);

        treedata={"name": "root","children":filterdata[i].items};
        tempsubpanel=$("<div style='height: "+stepheight+"px'><div class='subleft' style='line-height: "+stepheight+"px'>"+filterdata[i].year+"</div><div class='submap' id='"+tempid+"' style='height:"+stepheight+"px'></div></div>");
        mappenel.append(tempsubpanel);
        mappenel.append("<div class='spacerow'></div>");

        LoadTreeMap(treedata,tempid);
    }
}
var margin,width,height=null;
var treemap=null;
var div=null;
function LoadTreeMap(_treedata,_targetid){
    margin = {top: 40, right: 10, bottom: 10, left: 10};
    width =$("#"+_targetid).width();
    height =$("#"+_targetid).height();

    var color = d3.scale.category20c();

    treemap = d3.layout.treemap()
        .size([width, height])
        .sticky(true)
        .value(function(d) { return Math.abs(d.size); })
        .sort(function(a,b){return a.value- b.value});

    div = d3.select("#"+_targetid);
    var TreeMapNode= div.datum(_treedata).selectAll(".node")
        .data(treemap.nodes)
        .enter().append("div")
        .attr("class", "node")
        .call(position)
        .style("background", function(d) {
            //return d.children ? color(d.name) : null;
            return GetColorBygname(d.groupname);
        })
        .html(function(d) {
            //return d.children ? null : d.name;
            return "";
        }).attr("title",function(d){
            if(d.children==null){
                return d.name+" ("+ d.size+")";
            }
        });

}
function position() {
    this.style("left", function(d) { return d.x + "px"; })
        .style("top", function(d) { return d.y + "px"; })
        .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
        .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
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
//endregion