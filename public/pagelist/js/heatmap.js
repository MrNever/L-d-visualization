/**
 * Created by Mr_hu on 2015/5/12.
 */
$(document.body).ready(function(){
    InitControl();
  //  loaddata();
})
var startDate="2014-01-01",endDate="2014-03-01"
//控件初始化
var mandata=null
function InitControl(){
    var ranges = [];
    for (var i = Date.parse(new Date(startDate)); i < Date.parse(new Date(endDate)); i = i + (5 * 24 * 60 * 3600)) {
        ranges.push(i);
    }
    var picker = $("#slideryear").range_picker({
        //是否显示分割线
        show_seperator: false,
        //是否启用动画
        animate: false,
        //初始化开始区间值
        from: startDate,
        //初始化结束区间值
        to: endDate,
        axis_width: 180,
        //选取块宽度
        picker_width: 14,
        //各区间值
        ranges: ranges,
        onChange: function (from_to) {
            startDate = new Date(from_to[0]).dateformat("yyyy-MM-dd");
            endDate = new Date(from_to[1]).dateformat("yyyy-MM-dd");
            $(".sliderlabelpanel>.label_left").html(new Date(from_to[0]).dateformat("yyyy-MM-dd"));
            $(".sliderlabelpanel>.label_right").html(new Date(from_to[1]).dateformat("yyyy-MM-dd"));

        },
        onSelect: function (index, from_to) {
            heatmapdatamanager();
        },
        afterInit: function () {
            var picker = this;
            var ranges = picker.options.ranges;
            $(".sliderlabelpanel>.label_left").html(new Date(ranges[0]).dateformat("yyyy-MM-dd"));
            $(".sliderlabelpanel>.label_right").html(new Date(ranges[ranges.length - 1]).dateformat("yyyy-MM-dd"));
        }
    });
   $("#selectoption").change(function(ev){
       //if(this.value=="全部"){
       //     rowLabelcount=["ECBA105","ECBA106","ECBA107","ECBA108","ECBA109","ECBA110","ECBA111","ECBA112","ECBA113","ECBA114","ECBA115","ECBA1101",
       //        "ECBA1102","ECBA1103","ECBA1104","WGT1201","WGT201","WGT501","WGT551","WGT351","WGT601","TIC10545","TIC10645","TIC10745","TIC10845",
       //        "TIC10945","TIC11045","TIC11145","TIC112","TIC11301","TIC11401","TIC11545","TC110101","TC110201","TC110301","TC110401","FI10520",
       //        "FI10620","FI10720","FI11020"
       //    ]
       //     hrow=[49,11,30,4,18,6,12,20,19,33,32,26,44,35,38,3,23,41,22,10,2,15,16,36,8,25,29,7,27,34,48,31,45,43,14,9,39,1,37,47];
       //     hcol=[6,5,41,12,42,21,58,56,14,16,43,15,17,46,47,48,54,49,37,38,25,22,7,8,2,45,9,20,24,44,23,19,13,40,11,1,39,53,10,52,3,26,27,60,50,51,59,18,31,32,30,4,55,28,29,57,36,34,33,35];
       //    rownumber=40;
       //    $("#chart").find("svg").remove();
       //    heatmap();
       //}
        if(this.value=="裂解炉能耗") {
            rowLabelcount = ["ECBA105", "ECBA106", "ECBA107", "ECBA108", "ECBA109", "ECBA110", "ECBA111", "ECBA112", "ECBA113", "ECBA114", "ECBA115", "ECBA1101",
                "ECBA1102", "ECBA1103", "ECBA1104","ECBA1105","ECBA1106","ECBA1107","ECBA1108","ECBA1201","ECBA1202","ECBA1203","ECBA1204","ECBA1205","ECBA1206",
                "ECBA1207","ECBA1208","ECBA1301","ECBA1302","ECBA1303","ECBA1304","ECBA1305","ECBA1306","ECBA1307","ECBA1308","ECBA1309","ECBA1401","ECBA1402","ECBA1403","ECBA1404"]
            hrow = hrow = [49, 11, 30, 4, 18, 6, 12, 20, 19, 33, 32, 26, 44, 35, 38, 3, 23, 41, 22, 10, 2, 15, 16, 36, 8, 25, 29, 7, 27, 34, 48, 31, 45, 43, 14, 9, 39, 1, 37, 47];
            rownumber = 40;
                $("#chart").find("svg").remove();
                heatmap();
        }
       if(this.value=="裂解炉COT"){
           rowLabelcount=["TIC10545","TIC10645","TIC10745","TIC10845","TIC10945","TIC11045","TIC11145","TIC112","TIC11301","TIC11401","TIC11545","TC110101","TC110201","TC110301","TC110401",
               "TIC105","TIC106","TIC107","TIC108","TIC109","TIC110","TIC111","TIC1121","TIC113012","TIC114","TIC11545","TC110","TC111","TC11031","TC1101","TIC100","TIC210","TIC311",
               "TIC190","TIC1901","TIC1903","TC1801","TC1802","TC15011","TC15012"]
           rownumber=40;
           $("#chart").find("svg").remove();
           heatmap();
       }
       if(this.value=="压缩机能耗"){
           rowLabelcount=["WGT1201","WGT201","WGT501","WGT551","WGT351","WGT601","GB1201","WGT11","WGT21","WGT51","WGT31","WGT3251","WGT6401","GB1112","WGT01","WGT02","WGT505","WGT0012","WGT0013","WGT0014","GB0015",
               "WGT3301","WGT3302","WGT3303","WGT3304","WGT3305","WGT3306","GB3307","WGT226","GB227","WGT001","WGT1201","WGT1301","WGT1401","WGT1501","WGT1601","GB1701","WGT1020","GB1302","WGT1001"]
           rownumber=40;
           $("#chart").find("svg").remove();
           heatmap();
       }
       if(this.value=="进料量"){
           rowLabelcount=["FI10520","FI10620","FI10720","FI11020","FI114","FI11520","FI111","FI112","FI113","FI114",
               "FI110","FI115","FI116","FI117","FI118","FI1101","FI1102","FI1103","FI1104","FI1105",
               "FI1106","FI1107","FI1108","FI1109","FI1201","FI1202","FI1203","FI1204","FI1205","FI1204",
               "FI1207","FI10620","FI1208","FI1209","FI114","FI1301","FI1302","FI1303","FI1130","FI1140"]
           rownumber=40;
           $("#chart").find("svg").remove();
           heatmap();
       }
            //heatmap();
   })

    heatmap();
}
var heatmapdata=null
function loaddata(){
    d3.csv("../data/treemap_Bubble.csv", function(csv) {
        heatmapdata=csv;
        heatmapdatamanager(heatmapdata);
    });
}
var colLabeldate = ['01-01','01-02','01-03','01-04','01-05','01-06','01-07','01-08','01-09','01-10','01-11','01-12','01-13','01-14','01-15','01-16','01-17','01-18','01-19','01-20','01-21','01-22','01-23','01-24','01-25','01-26','01-27','01-28','01-29','01-30','01-31','02-01','02-02','02-03','02-04','02-05','02-06','02-07','02-08','02-09','02-10','02-11','02-12','02-13','02-14','02-15','02-16','02-17','02-18','02-19','02-20','02-21','02-22','02-23','02-24','02-25','02-26','02-27','02-28','03-01']; // change to contrast name
var coldatatwo=['01-01','01-02','01-03','01-04','01-05','01-06','01-07','01-08','01-09','01-10','01-11','01-12','01-13','01-14','01-15','01-16','01-17','01-18','01-19','01-20','01-21','01-22','01-23','01-24','01-25','01-26','01-27','01-28','01-29','01-30','01-31','02-01','02-02','02-03','02-04','02-05','02-06','02-07','02-08','02-09','02-10','02-11','02-12','02-13','02-14','02-15','02-16','02-17','02-18','02-19','02-20','02-21','02-22','02-23','02-24','02-25','02-26','02-27','02-28','03-01']
var colnumber=60;
var rownumber=40;
var hrow=[49,11,30,4,18,6,12,20,19,33,32,26,44,35,38,3,23,41,22,10,2,15,16,36,8,25,29,7,27,34,48,31,45,43,14,9,39,1,37,47];
var hcol=[6,5,41,12,42,21,58,56,14,16,43,15,17,46,47,48,54,49,37,38,25,22,7,8,2,45,9,20,24,44,23,19,13,40,11,1,39,53,10,52,3,26,27,60,50,51,59,18,31,32,30,4,55,28,29,57,36,34,33,35];
var colLabels
function heatmapdatamanager(){
    var groupdata=[];
    var startdatevalue=null;
    var enddatevalue=null;
    var textvalue=$("#chart").find("svg").find("g")[2]
    var counttextvalue=$(textvalue).find("text")
    var textvalue=[];
    if(textvalue.length<60){
        textvalue=coldatatwo;
    }else{
        for(var i=0;i<counttextvalue.length;i++){
            textvalue.push($(counttextvalue[i]).text())
        }
    }

    for(var i=0;i<textvalue.length;i++){
        var begindate=startDate.substr(5);
        if(textvalue[i]==begindate){
            startdatevalue=i
        }
    }
    for(var i=0;i<textvalue.length;i++){
        var latedate=endDate.substr(5);
        if(textvalue[i]==latedate){
            enddatevalue=i
        }
    }
    var managerdate=textvalue.slice(startdatevalue,enddatevalue+1)
    colLabeldate=managerdate;
    if(colLabeldate.length>0){
        colnumber=colLabeldate.length
    }
    $("#chart").find("svg").remove();
    heatmap();
}
//heatmap显示
var rowLabelcount=["ECBA105", "ECBA106", "ECBA107", "ECBA108", "ECBA109", "ECBA110", "ECBA111", "ECBA112", "ECBA113", "ECBA114", "ECBA115", "ECBA1101",
    "ECBA1102", "ECBA1103", "ECBA1104","ECBA1105","ECBA1106","ECBA1107","ECBA1108","ECBA1201","ECBA1202","ECBA1203","ECBA1204","ECBA1205","ECBA1206",
    "ECBA1207","ECBA1208","ECBA1301","ECBA1302","ECBA1303","ECBA1304","ECBA1305","ECBA1306","ECBA1307","ECBA1308","ECBA1309","ECBA1401","ECBA1402","ECBA1403","ECBA1404"]
//    ["ECBA105","ECBA106","ECBA107","ECBA108","ECBA109","ECBA110","ECBA111","ECBA112","ECBA113","ECBA114","ECBA115","ECBA1101",
//    "ECBA1102","ECBA1103","ECBA1104","WGT1201","WGT201","WGT501","WGT551","WGT351","WGT601","TIC10545","TIC10645","TIC10745","TIC10845",
//    "TIC10945","TIC11045","TIC11145","TIC112","TIC11301","TIC11401","TIC11545","TC110101","TC110201","TC110301","TC110401","FI10520",
//    "FI10620","FI10720","FI11020"
//]
var countdata=null
function heatmap(){
    var margin = { top: 40, right: 0, bottom: 50, left: 80 },
        cellSize=12;
    col_number=colnumber;
    row_number=rownumber;
    width = cellSize*col_number, // - margin.left - margin.right,
        height = cellSize*row_number , // - margin.top - margin.bottom,
        //gridSize = Math.floor(width / 24),
        legendElementWidth = cellSize*2.5,
        colorBuckets = 9,
        colors=["#fff9c9","#89eb88","#ffafbe","#f69a54","#c75151"]
        //colors=['#1A693B','#4F8D6B','#9EC2B3','#D2E6E3','#FFFFFF','#E6D3E1','#D19EB9','#B14F7C','#9B1A53']
      //  colors = ['#005824','#1A693B','#347B53','#4F8D6B','#699F83','#83B09B','#9EC2B3','#B8D4CB','#D2E6E3','#EDF8FB','#FFFFFF','#F1EEF6','#E6D3E1','#DBB9CD','#D19EB9','#C684A4','#BB6990','#B14F7C','#A63467','#9B1A53','#91003F'];
         hcrow=hrow;
         hccol=hcol;
      // hcrow = [49,11,30,4,18,6,12,20,19,33,32,26,44,35,38,3,23,41,22,10,2,15,16,36,8,25,29,7,27,34,48,31,45,43,14,9,39,1,37,47], // change to gene name or probe id
       // hccol = [6,5,41,12,42,21,58,56,14,16,43,15,17,46,47,48,54,49,37,38,25,22,7,8,2,45,9,20,24,44,23,19,13,40,11,1,39,53,10,52,3,26,27,60,50,51,59,18,31,32,30,4,55,28,29,57,36,34,33,35], // change to gene name or probe id
        rowLabel=rowLabelcount
        colLabel=colLabeldate
        //colLabel = ['01-01','01-02','01-03','01-04','01-05','01-06','01-07','01-08','01-09','01-10','01-11','01-12','01-13','01-14','01-15','01-16','01-17','01-18','01-19','01-20','01-21','01-22','01-23','01-24','01-25','01-26','01-27','01-28','01-29','01-30','01-31','02-01','02-02','02-03','02-04','02-05','02-06','02-07','02-08','02-09','02-10','02-11','02-12','02-13','02-14','02-15','02-16','02-17','02-18','02-19','02-20','02-21','02-22','02-23','02-24','02-25','02-26','02-27','02-28','03-01']; // change to contrast name

    //d3.tsv("../data/heatmapdata.tsv",
        //function(d) {
        //    return {
        //        row:   +d.row_x,
        //        col:   +d.row_y,
        //        value: +d.value
        //    };
        //},
        //function(error, data) {
          var data=heatmapdataone;
            var colorScale = d3.scale.quantile()
                .domain([0, 7])
                .range(colors);
            countdata=data
            if(mandata!=null){
                data=mandata
            }

            var svg = d3.select("#chart").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            var rowSortOrder=false;
            var colSortOrder=false;
            var rowLabels = svg.append("g")
                    .selectAll(".rowLabelg")
                    .data(rowLabel)
                    .enter()
                    .append("text")
                    .text(function (d) { return d; })
                    .attr("x", 0)
                    .attr("y", function (d, i) {
                        return hccol.indexOf(i+1) * cellSize;
                      //  return i * cellSize;
                    })
                    .style("text-anchor", "end")
                    .attr("transform", "translate(-6," + cellSize / 1.5 + ")")
                    .attr("class", function (d,i) { return "rowLabel mono r"+i;} )
                    .on("mouseover", function(d) {d3.select(this).classed("text-hover",true);})
                    .on("mouseout" , function(d) {d3.select(this).classed("text-hover",false);})
                    .on("click", function(d,i) {rowSortOrder=!rowSortOrder; sortbylabel("r",i,rowSortOrder);d3.select("#order").property("selectedIndex", 0).node().focus();;})
                ;
             colLabels = svg.append("g")
                    .selectAll(".colLabelg")
                    .data(colLabel)
                    .enter()
                    .append("text")
                    .text(function (d) { return d; })
                    .attr("x", 0)
                    .attr("y", function (d, i) { return hccol.indexOf(i+1) * cellSize; })
                    .style("text-anchor", "left")
                    .attr("transform", "translate("+cellSize/2 + ",-6) rotate (-90)")
                    .attr("class",  function (d,i) { return "colLabel mono c"+i;} )
                    .on("mouseover", function(d) {d3.select(this).classed("text-hover",true);})
                    .on("mouseout" , function(d) {d3.select(this).classed("text-hover",false);})
                    .on("click", function(d,i) {colSortOrder=!colSortOrder;  sortbylabel("c",i,colSortOrder);d3.select("#order").property("selectedIndex", 4).node().focus();;})
                ;

            var heatMap = svg.append("g").attr("class","g3")
                    .selectAll(".cellg")
                    .data(data,function(d){return d.row+":"+d.col;})
                    .enter()
                    .append("rect")
                    .attr("x", function(d) {  return (d.col - 1) * cellSize; })
                    .attr("y", function(d) {  return (d.row - 1) * cellSize; })
                    .attr("class", function(d){return "cell cell-border cr"+(d.row-1)+" cc"+(d.col-1);})
                    .attr("width", cellSize)
                    .attr("height", cellSize)
                    .style("fill", function(d) { return colorScale(d.value); })

                    .on("mouseover", function(d){
                        //highlight text
                        d3.select(this).classed("cell-hover",true);
                        d3.selectAll(".rowLabel").classed("text-highlight",function(r,ri){ return ri==(d.row-1);});
                        d3.selectAll(".colLabel").classed("text-highlight",function(c,ci){ return ci==(d.col-1);});

                        //Update the tooltip position and value
                        d3.select("#tooltip")
                            .style("left", (d3.event.pageX+10) + "px")
                            .style("top", (d3.event.pageY-10) + "px")
                            .select("#value")
                            .text("位号:"+rowLabel[d.row-1]+",日期："+colLabel[d.col-1]+"\n\nx:"+d.col+",y:"+d.row+"\r\n值:"+ d.value);
                        //Show the tooltip
                        d3.select("#tooltip").classed("hidden", false);
                    })
                    .on("mouseout", function(){
                        d3.select(this).classed("cell-hover",false);
                        d3.selectAll(".rowLabel").classed("text-highlight",false);
                        d3.selectAll(".colLabel").classed("text-highlight",false);
                        d3.select("#tooltip").classed("hidden", true);
                    })
                ;

            var legend = svg.selectAll(".legend")
                .data([1,2,4,5,7])
                .enter().append("g")
                .attr("class", "legend")
                .on("click",function(d){
                    var fillcolor=$(this).find("rect").css("fill")
                    var rect=$(".g3").find("rect")
                    for(var i=0;i<rect.length;i++){
                        if($(rect[i]).css("fill")==fillcolor){
                            //$(rect[i]).addClass("fillstrockcolor");
                            $(rect[i]).css("stroke","rgb(88, 86, 189)")
                            $(rect[i]).css("stroke-width","1.5px")
                        }else{
                            $(rect[i]).css("stroke","")
                            $(rect[i]).fadeOut('slow')
                           // $(rect[i]).animated({opacity:1},'slow')
                            $(rect[i]).css("stroke-width","")
                        }
                    }
                })
            ;
            legend.append("rect")
                .attr("x", function(d, i) { return legendElementWidth * i; })
                .attr("y", height+(cellSize*2))
                .attr("width", legendElementWidth)
                .attr("height", cellSize)
                .style("fill", function(d, i) { return colors[i]; });

            legend.append("text")
                .attr("class", "mono")
                .text(function(d) { return d; })
                .attr("width", legendElementWidth)
                .attr("x", function(d, i) { return legendElementWidth * i; })
                .attr("y", height + (cellSize*4));

// Change ordering of cells

            function sortbylabel(rORc,i,sortOrder){
                var t = svg.transition().duration(3000);
                var log2r=[];
                var sorted; // sorted is zero-based index
                d3.selectAll(".c"+rORc+i)
                    .filter(function(ce){
                        log2r.push(ce.value);
                    })
                ;
                if(rORc=="r"){ // sort log2ratio of a gene
                    sorted=d3.range(col_number).sort(function(a,b){ if(sortOrder){ return log2r[b]-log2r[a];}else{ return log2r[a]-log2r[b];}});
                    t.selectAll(".cell")
                        .attr("x", function(d) { return sorted.indexOf(d.col-1) * cellSize; })
                    ;
                    t.selectAll(".colLabel")
                        .attr("y", function (d, i) { return sorted.indexOf(i) * cellSize; })
                    ;
                }else{ // sort log2ratio of a contrast
                    sorted=d3.range(row_number).sort(function(a,b){if(sortOrder){ return log2r[b]-log2r[a];}else{ return log2r[a]-log2r[b];}});
                    t.selectAll(".cell")
                        .attr("y", function(d) { return sorted.indexOf(d.row-1) * cellSize; })
                    ;
                    t.selectAll(".rowLabel")
                        .attr("y", function (d, i) { return sorted.indexOf(i) * cellSize; })
                    ;
                }
            }

            d3.select("#order").on("change",function(){
                order(this.value);
            });

            function order(value){
                if(value=="hclust"){
                    var t = svg.transition().duration(3000);
                    t.selectAll(".cell")
                        .attr("x", function(d) { return hccol.indexOf(d.col) * cellSize; })
                        .attr("y", function(d) { return hcrow.indexOf(d.row) * cellSize; })
                    ;

                    t.selectAll(".rowLabel")
                        .attr("y", function (d, i) { return hcrow.indexOf(i+1) * cellSize; })
                    ;

                    t.selectAll(".colLabel")
                        .attr("y", function (d, i) { return hccol.indexOf(i+1) * cellSize; })
                    ;

                }else if (value=="probecontrast"){
                    var t = svg.transition().duration(3000);
                    t.selectAll(".cell")
                        .attr("x", function(d) { return (d.col - 1) * cellSize; })
                        .attr("y", function(d) { return (d.row - 1) * cellSize; })
                    ;

                    t.selectAll(".rowLabel")
                        .attr("y", function (d, i) { return i * cellSize; })
                    ;

                    t.selectAll(".colLabel")
                        .attr("y", function (d, i) { return i * cellSize; })
                    ;

                }else if (value=="probe"){
                    var t = svg.transition().duration(3000);
                    t.selectAll(".cell")
                        .attr("y", function(d) { return (d.row - 1) * cellSize; })
                    ;

                    t.selectAll(".rowLabel")
                        .attr("y", function (d, i) { return i * cellSize; })
                    ;
                }else if (value=="contrast"){
                    var t = svg.transition().duration(3000);
                    t.selectAll(".cell")
                        .attr("x", function(d) { return (d.col - 1) * cellSize; })
                      //  .attr("y", function(d) { return (d.row - 1) * cellSize; })
                    ;
                    t.selectAll(".rowLabel")//rowLabels 左轴
                        .attr("y", function (d, i) { return i * cellSize; })
                    ;

                    t.selectAll(".colLabel")//上轴
                        .attr("y", function (d, i) { return i * cellSize; })
                    ;
                    //t.selectAll(".colLabel")
                    //    .attr("y", function (d, i) { return i * cellSize; })
                    //;
                }
            }
            //
            var sa=d3.select(".g3")
                .on("mousedown", function() {
                    if( !d3.event.altKey) {
                        d3.selectAll(".cell-selected").classed("cell-selected",false);
                        d3.selectAll(".rowLabel").classed("text-selected",false);
                        d3.selectAll(".colLabel").classed("text-selected",false);
                    }
                    var p = d3.mouse(this);
                    sa.append("rect")
                        .attr({
                            rx      : 0,
                            ry      : 0,
                            class   : "selection",
                            x       : p[0],
                            y       : p[1],
                            width   : 1,
                            height  : 1
                        })
                })
                .on("mousemove", function() {
                    var s = sa.select("rect.selection");

                    if(!s.empty()) {
                        var p = d3.mouse(this),
                            d = {
                                x       : parseInt(s.attr("x"), 10),
                                y       : parseInt(s.attr("y"), 10),
                                width   : parseInt(s.attr("width"), 10),
                                height  : parseInt(s.attr("height"), 10)
                            },
                            move = {
                                x : p[0] - d.x,
                                y : p[1] - d.y
                            }
                            ;

                        if(move.x < 1 || (move.x*2<d.width)) {
                            d.x = p[0];
                            d.width -= move.x;
                        } else {
                            d.width = move.x;
                        }

                        if(move.y < 1 || (move.y*2<d.height)) {
                            d.y = p[1];
                            d.height -= move.y;
                        } else {
                            d.height = move.y;
                        }
                        s.attr(d);

                        // deselect all temporary selected state objects
                        d3.selectAll('.cell-selection.cell-selected').classed("cell-selected", false);
                        d3.selectAll(".text-selection.text-selected").classed("text-selected",false);

                        d3.selectAll('.cell').filter(function(cell_d, i) {
                            if(
                                !d3.select(this).classed("cell-selected") &&
                                    // inner circle inside selection frame
                                (this.x.baseVal.value)+cellSize >= d.x && (this.x.baseVal.value)<=d.x+d.width &&
                                (this.y.baseVal.value)+cellSize >= d.y && (this.y.baseVal.value)<=d.y+d.height
                            ) {

                                d3.select(this)
                                    .classed("cell-selection", true)
                                    .classed("cell-selected", true);

                                d3.select(".r"+(cell_d.row-1))
                                    .classed("text-selection",true)
                                    .classed("text-selected",true);

                                d3.select(".c"+(cell_d.col-1))
                                    .classed("text-selection",true)
                                    .classed("text-selected",true);
                            }
                        });
                    }
                })
                .on("mouseup", function() {
                    // remove selection frame
                    sa.selectAll("rect.selection").remove();

                    // remove temporary selection marker class
                    d3.selectAll('.cell-selection').classed("cell-selection", false);
                    d3.selectAll(".text-selection").classed("text-selection",false);
                })
                .on("mouseout", function() {
                    if(d3.event.relatedTarget.tagName=='html') {
                        // remove selection frame
                        sa.selectAll("rect.selection").remove();
                        // remove temporary selection marker class
                        d3.selectAll('.cell-selection').classed("cell-selection", false);
                        d3.selectAll(".rowLabel").classed("text-selected",false);
                        d3.selectAll(".colLabel").classed("text-selected",false);
                    }
                });

            var timeout = setTimeout(function() {
                order("contrast");
                d3.select("#order").property("selectedIndex", 2).node().focus();
            }, 10);
    //    });
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