/**
 * Created by Mr_hu on 2015/4/24.
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
    //            $("#FilterColor").val(color.toHexString());
    //            $("#colorbg").val(color.toHexString());
    //        }
    //    });
    //$("#FilterColor").spectrum({
    //    color: "#f00"
    //});
    $("#option1").change(function(ev){
        var valueop=$("#option1").val();
        optiondata=[];
        for(var i=0;i<TreeData.length;i++){
            if(TreeData[i]["公司名称"]==valueop){
                optiondata.push(TreeData[i]);
            }
        }
        $("#contentleft").find("div").remove();
        alarmtreemap();
    });
    $("#option2").change(function(ev){
        var valueop=$("#option2").val();
        optiondata=[];
        for(var i=0;i<TreeData.length;i++){
            if(TreeData[i]["日现金流"]>=valueop){
                optiondata.push(TreeData[i]);
            }
        }
        $("#contentleft_mo1").find("div").remove();
        alarmtreemap();
    })
    alarmtreemap();
})

  var optiondata=[];
  var TreeData=null;
  var root=null;
  var NumberRangeMin=-10000000000000000;
  var node=null;
  var treemap=null
  function alarmtreemap(){
          margin = {top: 40, right: 10, bottom: 10, left: 10},
          width = $("#contentleft_mo1").width(),
          height=600;
         // height = $(document).height();

      var color = d3.scale.category20c();

      treemap = d3.layout.treemap()
          .size([width, height])
          .sticky(true)
          .value(function(d) { return d.size; });

      var div = d3.select("#contentleft_mo1")

      d3.csv("../data/3cashflow.csv", function(csv) {
          TreeData=csv;
          if(optiondata.length>0){
              TreeData=optiondata;
          }
          var convertdata=dataConvert(TreeData,"日现金流");
          rangenumber("colorbg",convertdata.minmaxinfo,FilterConditionChanged);
          NumberRangeMin=convertdata.minmaxinfo.min;
          root=convertdata.treedata;
          node = div.datum(root).selectAll(".node")
              .data(treemap.nodes)
              .enter().append("div")
              .attr("class", "node")
              .call(position)
              .style("background", function(d) {
                  //return d.children ? color(d.name) : null;
                  if(d.size>=0){return "#ef5b9c"}else{return "#7fb80e"}
              })
              .html(function(d) {
                  //return d.children ? null : d.name;
                  if(d.children==null){
                      return d.name+"<br>"+ d.size;
                  }
              }).attr("title",function(d){
                  if(d.children==null){
                      return d.name+" ("+ d.size+")";
                  }
              });

          //d3.selectAll("input").on("change", function change() {
          //    var value = this.value === "count"
          //        ? function() { return 1; }
          //        : function(d) { return d.size; };
          //
          //    node
          //        .data(treemap.value(value).nodes)
          //        .transition()
          //        .duration(1500)
          //        .call(position);
          //});
      });

   }

function position() {
    this.style("left", function(d) { return d.x + "px"; })
        .style("top", function(d) { return d.y + "px"; })
        .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
        .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
}

function dataConvert(_dataset,_ColName){
    var convertdata={
        treedata:{
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
    for(var i=0;i<_dataset.length;i++){
        if(_dataset[i]["日期"]===_dataset[i]["日期"]){
            tempindex=temprootnames.indexOf(_dataset[i]["公司名称"]);
            if(tempindex>-1){
                convertdata.treedata.children[tempindex].children.push({name:_dataset[i]["名称"],size: parseFloat(_dataset[i][_ColName])});
            }else{
                temprootnames.push(_dataset[i]["公司名称"]);
                convertdata.treedata.children.push({name:_dataset[i]["公司名称"],children:[{name:_dataset[i]["名称"],size: parseFloat(_dataset[i][_ColName])}]});
            }

            if(convertdata.minmaxinfo.min==null){
                convertdata.minmaxinfo.min=parseFloat(_dataset[i][_ColName]);
            }else{
                if(parseFloat(_dataset[i][_ColName])<convertdata.minmaxinfo.min){
                    convertdata.minmaxinfo.min=parseFloat(_dataset[i][_ColName]);
                }
            }
            if(convertdata.minmaxinfo.max==null){
                convertdata.minmaxinfo.max=parseFloat(_dataset[i][_ColName]);
            }else{
                if(parseFloat(_dataset[i][_ColName])>convertdata.minmaxinfo.max){
                    convertdata.minmaxinfo.max=parseFloat(_dataset[i][_ColName]);
                }
            }
        }
    }
    //最小值替换
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


function rangenumber(_rangenumberid,_minmaxinfo,_dragendcallfun){
    //数值范围处理
    var backgroundcolorarr={
        startcolor:"#ef5b9c",
        endvalue:100,
        endcolor:"#7fb80e"
    }
    if(_minmaxinfo.min>=0){
        backgroundcolorarr.startcolor="#ef5b9c";
    }
    if(_minmaxinfo.max<0){
        backgroundcolorarr.endcolor="#7fb80e";
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
        _dragendcallfun();
    }
}

var input1=null;
var input2=null;
var input3=null;
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
            if(d.size>=0){return "#7fb80e"}else{return "#ef5b9c"}
        })
        .duration(1500)
        .call(position);
}

var DataFilterfunc=function(d) {
    if(d.size>=NumberRangeMin){
        return Math.abs(d.size);
    }
};