/**
 * Created by Mr_hu on 2015/4/28.
 */
$(document.body).ready(function(){
    var rightwidth=$("#box").width()-180;
    $("#contentleft").css("width",$("#box").width()-200);
    $("#contentright").css("margin-left",rightwidth);
    $("#contentleft").css("height","600px");
    //颜色拾取器
    //    $("#FilterColor").spectrum({
    //        showInput: true,
    //        showPalette: true,
    //        palette: [
    //            ['black', 'white'],
    //            ['blanchedalmond', 'rgb(255, 128, 0);'],
    //            ['hsv 100 70 50', 'red'],
    //            ['yellow', 'green'],
    //            ['blue', 'violet']
    //        ],
    //        cancelText: "取消",
    //        chooseText: "选择",
    //        change: function (color) {
    //            if(rangenumberstartcolor=="#a00707"){
    //                rangenumberstartcolor=color.toHexString();
    //                return;
    //            }
    //            if(rangenumberstartcolor!=color.toHexString()){
    //                rangenumberendcolor=color.toHexString();
    //            }
    //        }
    //
    //    }
    //    );
    $("#option1").change(function(ev){
        var valueop=$("#option1").val();
        RestData=[];
        if(valueop=="中石化青岛炼化"){
            alarmtreemapmargin = {top: 40, right: 10, bottom: 10, left: 10};
            alarmtreemapwidth = $("#contentleft_mo1").width();
            alarmtreemapheigth = $("#contentleft_mo1").height();
            d3selectdiv = d3.select("#contentleft_mo1");
            RestData=optiondata1;
            $("#contentleft_mo1").find("div").remove();
            rangenumber("colorbg",optiondata1.minmaxinfo,FilterConditionChanged);
            alarmtreemap();
        }
        if(valueop=="中石化连云港炼化"){
            alarmtreemapmargin = {top: 40, right: 10, bottom: 10, left: 10};
            alarmtreemapwidth = $("#contentleft_mo2").width();
            alarmtreemapheigth = $("#contentleft_mo2").height();
            d3selectdiv = d3.select("#contentleft_mo2");
            RestData=optiondata2;
            $("#contentleft_mo2").find("div").remove();
            rangenumber("colorbg",optiondata2.minmaxinfo,FilterConditionChanged);
            alarmtreemap();
        }
        if(valueop=="中石化海南炼化"){
            alarmtreemapmargin = {top: 40, right: 10, bottom: 10, left: 10};
            alarmtreemapwidth = $("#contentleft_mo3").width();
            alarmtreemapheigth = $("#contentleft_mo3").height();
            d3selectdiv = d3.select("#contentleft_mo3");
            RestData=optiondata3;
            $("#contentleft_mo3").find("div").remove();
            rangenumber("colorbg",optiondata3.minmaxinfo,FilterConditionChanged);
            alarmtreemap();
        }


    });
    $("#option2").change(function(ev){
        var valueop=$("#option2").val();
        RestData=[];

        $("#contentleft_mo1").find("div").remove();
        alarmtreemap();
    });
    d3.csv("../data/3cashflow.csv", function(csv) {
        TreeData = csv;
        if ($("#label_2").html() == "中石化连云港炼化") {
            RestData = [];
            alarmtreemapmargin = {top: 40, right: 10, bottom: 10, left: 10};
            alarmtreemapwidth = $("#contentleft_mo2").width();
            alarmtreemapheigth = $("#contentleft_mo2").height();
            d3selectdiv = d3.select("#contentleft_mo2")
            for (var i = 0; i < TreeData.length; i++) {
                if (TreeData[i]["公司名称"] == "中石化连云港炼化") {
                    RestData.push(TreeData[i]);
                }
            }
            HandleData(RestData, "中石化连云港炼化");
            RestData = convertdata;
            optiondata2=convertdata;
        }
        alarmtreemap();
    })
    d3.csv("../data/3cashflow.csv", function(csv) {
        TreeData = csv;
        if ($("#label_3").html() == "中石化海南炼化") {
            RestData = [];
            alarmtreemapmargin = {top: 40, right: 10, bottom: 10, left: 10};
            alarmtreemapwidth = $("#contentleft_mo3").width();
            alarmtreemapheigth = $("#contentleft_mo3").height();
            d3selectdiv = d3.select("#contentleft_mo3")
            for (var i = 0; i < TreeData.length; i++) {
                if (TreeData[i]["公司名称"] == "中石化海南炼化") {
                    RestData.push(TreeData[i]);
                }
            }
            HandleData(RestData, "中石化海南炼化");
            RestData = convertdata;
            optiondata3=convertdata;
        }
        alarmtreemap();
    });
    d3.csv("../data/3cashflow.csv", function(csv) {
        TreeData = csv;
        if ($("#label_1").html() == "中石化青岛炼化") {
            RestData = [];
            alarmtreemapmargin = {top: 40, right: 10, bottom: 10, left: 10};
            alarmtreemapwidth = $("#contentleft_mo1").width();
            alarmtreemapheigth = $("#contentleft_mo1").height();
            d3selectdiv = d3.select("#contentleft_mo1");
            for (var i = 0; i < TreeData.length; i++) {
                if (TreeData[i]["公司名称"] == "中石化青岛炼化") {
                    RestData.push(TreeData[i]);
                }
            }
            HandleData(RestData, "中石化青岛炼化");
            RestData = convertdata;
            optiondata1=convertdata;
           // rangenumber("colorbg",optiondata1.minmaxinfo,FilterConditionChanged);

        }
        alarmtreemap();
    })
    //alarmtreemap();
});
var optiondata1=null;
var optiondata2=null;
var optiondata3=null;
var rangenumberstartcolor="#a00707";
var rangenumberendcolor="#07a02b"
var TreeData=null;
var RestData=[];
var d3selectdiv=null;
var alarmtreemapmargin=null;
var alarmtreemapwidth=null;
var alarmtreemapheigth=null;
var node=null;
var treemap=null
function alarmtreemap(){
    var margin = alarmtreemapmargin,
        width = alarmtreemapwidth,
        height=alarmtreemapheigth;

    var color = d3.scale.category20c();

    treemap = d3.layout.treemap()
        .size([width, height])
        .sticky(true)
        .value(function(d) { return d.size; });

    //var div = d3selectdiv
    //    .style("position", "relative")
    //    .style("width", (width + margin.left + margin.right) + "px")
    //    .style("height", (height + margin.top + margin.bottom) + "px")
    //    .style("left", margin.left + "px")
    //    .style("top", margin.top + "px");
    var div = d3selectdiv
        .style("position", "relative")
        .style("width", width + "px")
        .style("height", height + "px")
        //.style("left", margin.left + "px")
        //.style("top", margin.top + "px");

    //d3.csv("../data/3cashflow.csv", function(root) {
     //   TreeData=root
        if(RestData!=null){
            root=RestData.treedataview;
        }
       node = div.datum(root).selectAll(".node")
            .data(treemap.nodes)
            .enter().append("div")
            .attr("class", "node")
            .call(position)
            .style("background", function(d) {if(d.size>=0){return "#07a02b"}else{return "#a00707"}})
            .text(function(d) { return d.children ? null : d.name; });

        d3.selectAll("input").on("change", function change() {
            var value = this.value === "count"
                ? function() { return 1; }
                : function(d) { return d.size; };

            node
                .data(treemap.value(value).nodes)
                .transition()
                .duration(1500)
                .call(position);
        });
}

function position() {
    this.style("left", function(d) { return d.x + "px"; })
        .style("top", function(d) { return d.y + "px"; })
        .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
        .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
}

var convertdata;
function HandleData(datavalue,companyname){
    convertdata={
        treedataview:{
            "name": "root",
            "children": []
        },
        minmaxinfo:{
            min:null,
            max:null
        }
    }
    var temprootnames=[];
    var tempindex=-1;
    for(var i=0;i<datavalue.length;i++){
        if(datavalue[i]["公司名称"]==companyname){
            tempindex=temprootnames.indexOf(datavalue[i]["公司名称"]);
            if(tempindex>-1){
                convertdata.treedataview.children[tempindex].children.push({name:datavalue[i]["名称"],size: parseFloat(datavalue[i]["日现金流"])});
            }else{
                temprootnames.push(datavalue[i]["公司名称"]);
                convertdata.treedataview.children.push({name:datavalue[i]["公司名称"],children:[{name:datavalue[i]["名称"],size: parseFloat(datavalue[i]["日现金流"])}]});
            }
        }
        if(convertdata.minmaxinfo.min==null){
            convertdata.minmaxinfo.min=parseFloat(datavalue[i]["日现金流"]);
        }else{
            if(parseFloat(datavalue[i]["日现金流"])<convertdata.minmaxinfo.min){
                convertdata.minmaxinfo.min=parseFloat(datavalue[i]["日现金流"]);
            }
        }
        if(convertdata.minmaxinfo.max==null){
            convertdata.minmaxinfo.max=parseFloat(datavalue[i]["日现金流"]);
        }else {
            if (parseFloat(datavalue[i]["日现金流"]) > convertdata.minmaxinfo.max) {
                convertdata.minmaxinfo.max = parseFloat(datavalue[i]["日现金流"]);
            }
        }
    }
    return convertdata;
}

$(function(){
    $('.single-slider').jRange({
        from: -50,
        to: 295,
        step: 1,
        scale: [-50,295],
        format: '%s',
        width: 150,
        showLabels: true,
        showScale: true
    });

    $("#input1").click(function(){
        NumberRangeMin=$("#single-slider1").val();
        DataFilterfunc =function(d) {
            if(d.size>=NumberRangeMin){
                return Math.abs(d.size);
            }
        };
        node.data(treemap.value(DataFilterfunc).nodes)
            .transition()
            .style("background", function(d) {
                //return d.children ? color(d.name) : null;
                if(d.size>=0){return "#7fb80e"}else{return "#ef5b9c"}
            })
            .duration(1500)
            .call(position);
    });
    $("#input2").click(function(){
        NumberRangeMin=$("#single-slider2").val();
        DataFilterfunc =function(d) {
            if(d.size>=NumberRangeMin){
                return Math.abs(d.size);
            }
        };
        node.data(treemap.value(DataFilterfunc).nodes)
            .transition()
            .style("background", function(d) {
                //return d.children ? color(d.name) : null;
                if(d.size>=0){return "#7fb80e"}else{return "#ef5b9c"}
            })
            .duration(1500)
            .call(position);
    });
    $("#input3").click(function(){
        NumberRangeMin=$("#single-slider3").val();
        DataFilterfunc =function(d) {
            if(d.size>=NumberRangeMin){
                return Math.abs(d.size);
            }
        };
        node.data(treemap.value(DataFilterfunc).nodes)
            .transition()
            .style("background", function(d) {
                //return d.children ? color(d.name) : null;
                if(d.size>=0){return "#7fb80e"}else{return "#ef5b9c"}
            })
            .duration(1500)
            .call(position);
    });
});

function rangenumber(_rangenumberid,_minmaxinfo,_fill){
    //数值范围处理
    var backgroundcolorarr={
        startcolor:rangenumberstartcolor,
        endvalue:100,
        endcolor:rangenumberendcolor
    }
    if(_minmaxinfo.min>=0){
        backgroundcolorarr.startcolor=rangenumberendcolor;
    }
    if(_minmaxinfo.max<0){
        backgroundcolorarr.endcolor=rangenumberstartcolor;
    }
    if(_minmaxinfo.min<0 && _minmaxinfo.max>0){
        backgroundcolorarr.endvalue=parseInt((0-_minmaxinfo.min)/(_minmaxinfo.max-_minmaxinfo.min)*100) ;
        if(backgroundcolorarr.endvalue<=0){
            backgroundcolorarr.endvalue=1;
        }
    }
    var backgroundcolor="-webkit-gradient(linear, 0 0,"+backgroundcolorarr.endvalue+"% 0, from("+backgroundcolorarr.startcolor+"), to("+backgroundcolorarr.endcolor+"))";
    var stepvalue=(_minmaxinfo.max-_minmaxinfo.min)/$("#"+_rangenumberid).width();

    $("#"+_rangenumberid).css({background:backgroundcolor}).data("bfb",backgroundcolorarr.endvalue);

    //文字信息显示
    var position={top: 0, left: 0}
    var rangenumberlabel=$("#"+_rangenumberid+"_label");
    if(rangenumberlabel.length>0){
        rangenumberlabel.remove();
    }
    var divhtml="<div id='"+_rangenumberid+"_label' class='rangenumberlabel'><div class='left'>"+_minmaxinfo.min+"</div><div class='center'></div><div class='right'>"+_minmaxinfo.max+"<div/></div>";
    $(divhtml).appendTo($("#sizecolor")).css({
        "left":position.left+"px",
        "top":(position.top+18)+"px"
        //"width":$("#"+_rangenumberid).width()-46+"px"
    }).show();
    $(".rangenumberlabel").find(".left").css({"float":"left"});
    $(".rangenumberlabel").find(".center").css({"float":"left","width":"100px"})
    $(".rangenumberlabel").find(".right").css({"float":"right"})

    var elementobj=document.getElementById(_rangenumberid);
    var rangehammer=new Hammer(elementobj);
    rangehammer.ondrag=function(ev){
        var bfb=parseInt($("#"+ev.originalEvent.currentTarget.id).data("bfb"));
        var tempvallue="";
        if(ev.originalEvent.offsetX<=1){
            tempvallue=parseFloat(_minmaxinfo.min);
        }else{
            if(bfb!=100){
                tempvallue=ev.originalEvent.offsetX-(bfb/100*$("#"+ev.originalEvent.currentTarget.id).width());
                tempvallue=parseFloat(tempvallue*stepvalue).toFixed(2);
            }else{
                tempvallue=parseFloat(ev.originalEvent.offsetX*stepvalue).toFixed(2);
            }
        }
        $("#"+ev.originalEvent.currentTarget.id).data("rangevalue",tempvallue);
        $("#"+ev.originalEvent.currentTarget.id+"_label").find(".center").html( tempvallue);
        $("#"+ev.originalEvent.currentTarget.id).html("<div class='numberrangetick'></div>").find("div").css({
            "margin-left":(ev.originalEvent.offsetX-2)+"px"
        }).show();
    };
    rangehammer.ondragend=function(ev){
        _fill();
    }
}
function FilterConditionChanged(){
    NumberRangeMin=$("#colorbg").data("rangevalue");

    var valuefunc =null;
    DataFilterfunc =function(d) {
        if(d.size>=NumberRangeMin) {
            if (d.size >= 0) {
                return d.size;
            } else {
                return 0;
            }
        }
    };


    node.data(treemap.value(DataFilterfunc).nodes)
        .transition()
        .style("background", function(d) {
            //return d.children ? color(d.name) : null;
            if(d.size>=0){return "#07a02b"}else{return "#a00707"}
        })
        .duration(1500)
        .call(position);
}

var DataFilterfunc=function(d) {
    if(d.size>=NumberRangeMin){
        return Math.abs(d.size);
    }
};