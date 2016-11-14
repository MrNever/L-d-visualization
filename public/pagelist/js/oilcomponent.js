/**
 * Created by Mr_hu on 2015/4/22.
 */
var oildata=null;
function oilmap(){
    //d3.csv("../data/oilcomponent.csv",function(csv){
        var csv=oilcomponent;
        oildata=csv;
        if(newoilcheckdata.length>0){
            csv=newoilcheckdata;
        }
        if(newoilcheckdata==null){
            newoilcheckdata=[];
        }
        if(newoilcheckdata.length<=0){
            newoilcheckdata=[];
         //   csv=newoilcheckdata;
        }
        if(countrydata.length<=0){
            csv=countrydata
        }
        //if(newoilcheckdata.length<=0){
        //    for(var i=0;i<oildata.length;i++){
        //        //if(oildata[i]["原油编号"]=="ABO"&&oildata[i]["原油编号"]=="ABO"){
        //          //  if($("#radindex2").find(".checkitem[value='ABO']").attr("checked")=="checked"){
        //                newoilcheckdata.push(oildata[i]);
        //           // }
        //      //  }
        //
        //    }
        //    csv=newoilcheckdata;
        //    remove();
        //}
        var dimensions = new Filter();
        var highlighter = new Selector();

        dimensions.set({data: csv });

        var columns = _(csv[0]).keys();
        //var axes = _(columns).without('API度', '原油类别');


        var foodgroups = ["石蜡基", "中间基", "环烷基"];
        var colors = {
            "石蜡基" : '#ff7f0e',
            "中间基" : '#8552a1',
            "环烷基" : '#4bacd3'
        }

        _(foodgroups).each(function(group) {
            $('#legend').append("<div class='item'><div class='color' style='background: " + colors[group] + "';></div><div class='key'>" + group + "</div></div>");
        });

        var pc = parallel(dimensions, colors);
        var pie = piegroups(csv, foodgroups, colors, '原油类别');
        var totals = pietotals(
            ['in', 'out'],
            [_(csv).size(), 0]
        );

        var slicky = new grid({
            model: dimensions,
            selector: highlighter,
            width: $('.content_left').width(),
            columns: columns
        });

        // vertical full screen
        var parallel_height = $(window).height() - 64 - 12 - 120 - 320;
        if (parallel_height < 120) parallel_height = 120;  // min height
        if (parallel_height > 340) parallel_height = 340;  // max height
        $('#parallel').css({
            height: parallel_height + 'px',
            width: $("#contentleft").css("width")
        });

        slicky.update();
        pc.render();

        dimensions.bind('change:filtered', function() {
            var data = dimensions.get('data');
            var filtered = dimensions.get('filtered');
            var data_size = _(data).size();
            var filtered_size = _(filtered).size();
            pie.update(filtered);
            totals.update([filtered_size, data_size - filtered_size]);

            var opacity = _([2/Math.pow(filtered_size,0.37), 100]).min();
            $('#line_opacity').val(opacity).change();
        });

        highlighter.bind('change:selected', function() {
            var highlighted = this.get('selected');
            pc.highlight(highlighted);
        });


        $('#line_opacity').change(function() {
            var val = $(this).val();
            $('#parallel .foreground path').css('stroke-opacity', val.toString());
            $('#opacity_level').html((Math.round(val*10000)/100) + "%");
        });

        $('#parallel').resize(function() {
            // vertical full screen
            pc.render();
            var val = $('#line_opacity').val();
            $('#parallel .foreground path').css('stroke-opacity', val.toString());
        });

        $('#parallel').resizable({
            handles: 's',
            resize: function () { return false; }
        });

        $('#myGrid').resizable({
            handles: 's'
        });

        function addslashes( str ) {
            return (str+'')
                .replace(/\"/g, "\"\"")        // escape double quotes
                .replace(/\0/g, "\\0");        // replace nulls with 0
        };
  //  })

};
var startDate="2014/01/01";
var endDate="2014/07/18";
$(document.body).ready(function() {
    //var rightwidth=$("#box").width()-180;
    //$("#contentleft").css("width",$("#box").width()-200);
    //$("#contentright").css("margin-left",rightwidth);
    $("#radindex2").find(".checkitem").change(function(ev){
        ConditionChanged(oildata);
    });
    $("#checkbox").find(".radioitem").change(function(ev){
        countrydatamanager(newoilcheckdata)
    })
    $("#radindex").find(".radioitem").change(function(ev){
        RaditemChange(oildata)
    })

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
        axis_width: 194,
        //选取块宽度
        picker_width: 12,
        //各区间值
        ranges: ranges,
        onChange: function (from_to) {
            startDate = new Date(from_to[0]).dateformat("yyyy/MM/dd");
            endDate = new Date(from_to[1]).dateformat("yyyy/MM/dd");
            $(".sliderlabelpanel>.label_left").html(new Date(from_to[0]).dateformat("yyyy/MM/dd"));
            $(".sliderlabelpanel>.label_right").html(new Date(from_to[1]).dateformat("yyyy/MM/dd"));

        },
        onSelect: function (index, from_to) {
            DatetimeMemanage(oildata);
        },
        afterInit: function () {
            var picker = this;
            var ranges = picker.options.ranges;
            $(".sliderlabelpanel>.label_left").html(new Date(ranges[0]).dateformat("yyyy/MM/dd"));
            $(".sliderlabelpanel>.label_right").html(new Date(ranges[ranges.length - 1]).dateformat("yyyy/MM/dd"));
        }
    });
    var mainwidth=$(".content_left").width()
    $("#main").css("width",mainwidth)
    $("#gridwidth").css("width",mainwidth)
    $("contentgrid").css("width",mainwidth)
    oilmap();
    //if(newoilcheckdata.length<=0){
    //    for(var i=0;i<oildata.length;i++){
    //        if(oildata[i]["原油编号"]=="ABO"){
    //            if($("#radindex2").find(".checkitem[value='ABO']").attr("checked")=="checked"){
    //                newoilcheckdata.push(oildata[i]);
    //            }
    //        }
    //
    //    }
    //    remove();
    //    oilmap();
    //}


})

var newoilcheckdata=[];
function ConditionChanged(data){
    newoilcheckdata=[];
    var checkaboitem=$("#radindex2").find(".checkitem[value='ABO']").attr("checked");
    var checkagbitem=$("#radindex2").find(".checkitem[value='AGB']").attr("checked");
    var checkeslitem=$("#radindex2").find(".checkitem[value='ESL']").attr("checked");

    if(checkaboitem=="checked"&&checkagbitem=="checked"&&checkeslitem=="checked"){
        for(var i=0;i<data.length;i++) {
            newoilcheckdata.push(data[i]);
        }
        remove()
        oilmap();
    }else if(checkaboitem=="checked"&&checkagbitem=="checked"){
        for(var i=0;i<data.length;i++){
            if(data[i]["原油编号"]=="ABO"){
                if(checkaboitem=="checked"){
                    newoilcheckdata.push(data[i]);
                }
            }
            if(data[i]["原油编号"]=="AGB"){
                if(checkagbitem=="checked"){
                    newoilcheckdata.push(data[i]);
                }
            }
            if(data[i]["原油编号"]=="ESL"){
                if(checkeslitem=="checked"){
                    newoilcheckdata.push(data[i]);
                }
            }
        }
        remove()
        oilmap();
    }else if(checkeslitem=="checked"){
        for(var i=0;i<data.length;i++){
            if(data[i]["原油编号"]=="ABO"){
                if(checkaboitem=="checked"){
                    newoilcheckdata.push(data[i]);
                }
            }
            if(data[i]["原油编号"]=="AGB"){
                if(checkagbitem=="checked"){
                    newoilcheckdata.push(data[i]);
                }
            }
            if(data[i]["原油编号"]=="ESL"){
                if(checkeslitem=="checked"){
                    newoilcheckdata.push(data[i]);
                }
            }
        }
        remove()
        oilmap();
    }else if(checkaboitem=="checked"){
        for(var i=0;i<data.length;i++){
            if(data[i]["原油编号"]=="ABO"){
                if(checkaboitem=="checked"){
                    newoilcheckdata.push(data[i]);
                }
            }
            if(data[i]["原油编号"]=="AGB"){
                if(checkagbitem=="checked"){
                    newoilcheckdata.push(data[i]);
                }
            }
            if(data[i]["原油编号"]=="ESL"){
                if(checkeslitem=="checked"){
                    newoilcheckdata.push(data[i]);
                }
            }
        }
        remove();
        oilmap();
    }else if(checkagbitem=="checked"){
        for(var i=0;i<data.length;i++){
            if(data[i]["原油编号"]=="ABO"){
                if(checkaboitem=="checked"){
                    newoilcheckdata.push(data[i]);
                }
            }
            if(data[i]["原油编号"]=="AGB"){
                if(checkagbitem=="checked"){
                    newoilcheckdata.push(data[i]);
                }
            }
            if(data[i]["原油编号"]=="ESL"){
                if(checkeslitem=="checked"){
                    newoilcheckdata.push(data[i]);
                }
            }
        }
        remove()
        oilmap();
    }

    if(checkaboitem==undefined&&checkagbitem==undefined&&checkeslitem==undefined){
        for( var i=0;i<data.length;i++){
            newoilcheckdata.push(data[i]);
        }
        remove()
        oilmap();
    }

}

//单选按钮处理事件

function RaditemChange(oildata){
    newoilcheckdata=[];
    var checkaboitem1=$("#radindex").find(".radioitem[value='石蜡基']").attr("checked");
    var checkagbitem1=$("#radindex").find(".radioitem[value='中间基']").attr("checked");
    var checkeslitem1=$("#radindex").find(".radioitem[value='环烷基']").attr("checked");

    if(checkaboitem1=="checked"&&checkagbitem1=="checked"&&checkeslitem1=="checked"){
        for(var i=0;i<oildata.length;i++) {
            newoilcheckdata.push(oildata[i]);
        }
        remove()
        oilmap();
    }else if(checkaboitem1=="checked"&&checkagbitem1=="checked"){
        for(var i=0;i<oildata.length;i++){
            if(oildata[i]["原油类别"]=="石蜡基"){
                if(checkaboitem1=="checked"){
                    newoilcheckdata.push(oildata[i]);
                }
            }
            if(oildata[i]["原油类别"]=="中间基"){
                if(checkagbitem1=="checked"){
                    newoilcheckdata.push(oildata[i]);
                }
            }
            if(oildata[i]["原油类别"]=="环烷基"){
                if(checkeslitem1=="checked"){
                    newoilcheckdata.push(oildata[i]);
                }
            }
        }
        remove()
        oilmap();
    }else if(checkeslitem1=="checked"){
        for(var i=0;i<oildata.length;i++){
            if(oildata[i]["原油类别"]=="石蜡基"){
                if(checkaboitem1=="checked"){
                    newoilcheckdata.push(oildata[i]);
                }
            }
            if(oildata[i]["原油类别"]=="中间基"){
                if(checkagbitem1=="checked"){
                    newoilcheckdata.push(oildata[i]);
                }
            }
            if(oildata[i]["原油类别"]=="环烷基"){
                if(checkeslitem1=="checked"){
                    newoilcheckdata.push(oildata[i]);
                }
            }
        }
        remove()
        oilmap();
    }else if(checkaboitem1=="checked"){
        for(var i=0;i<oildata.length;i++){
            if(oildata[i]["原油类别"]=="石蜡基"){
                if(checkaboitem1=="checked"){
                    newoilcheckdata.push(oildata[i]);
                }
            }
            if(oildata[i]["原油类别"]=="中间基"){
                if(checkagbitem1=="checked"){
                    newoilcheckdata.push(oildata[i]);
                }
            }
            if(oildata[i]["原油类别"]=="环烷基"){
                if(checkeslitem1=="checked"){
                    newoilcheckdata.push(oildata[i]);
                }
            }
        }
        remove();
        oilmap();
    }else if(checkagbitem1=="checked"){
        for(var i=0;i<oildata.length;i++){
            if(oildata[i]["原油类别"]=="石蜡基"){
                if(checkaboitem1=="checked"){
                    newoilcheckdata.push(oildata[i]);
                }
            }
            if(oildata[i]["原油类别"]=="中间基"){
                if(checkagbitem1=="checked"){
                    newoilcheckdata.push(oildata[i]);
                }
            }
            if(oildata[i]["原油类别"]=="环烷基"){
                if(checkeslitem1=="checked"){
                    newoilcheckdata.push(oildata[i]);
                }
            }
        }
        remove()
        oilmap();
    }

    if(checkaboitem1==undefined&&checkagbitem1==undefined&&checkeslitem1==undefined){
        newoilcheckdata=null;
       // for( var i=0;i<oildata.length;i++){
       //     newoilcheckdata.push(oildata[i]);
       // }
        remove()
        oilmap();
    }

    //if(checkaboitem1=="checked"){
   //    for( var i=0;i<oildata.length;i++){
   //        if(oildata[i]["原油类别"]=="石蜡基"){
   //            if(checkaboitem1=="checked"){
   //                newoilcheckdata.push(oildata[i]);
   //            }
   //        }
   //    }
   //    remove();
   //    oilmap();
   //}
   //
   // if(checkagbitem1=="checked"){
   //     for( var i=0;i<oildata.length;i++){
   //         if(oildata[i]["原油类别"]=="中间基"){
   //             if(checkagbitem1=="checked"){
   //                 newoilcheckdata.push(oildata[i]);
   //             }
   //         }
   //     }
   //     remove();
   //     oilmap();
   // }
   //
   // if(checkeslitem1=="checked"){
   //     for( var i=0;i<oildata.length;i++){
   //         if(oildata[i]["原油类别"]=="环烷基"){
   //             if(checkeslitem1=="checked"){
   //                 newoilcheckdata.push(oildata[i]);
   //             }
   //         }
   //     }
   //     remove();
   //     oilmap();
   // }
}

//原油产地checkbox处理
function countrydatamanager(cotrydata){
    var BubbleDeviceList=[];
    var coentlist=[];
    $("#checkbox").find(".radioitem:checked").each(function(i){
        BubbleDeviceList.push(this.value);
    });
    $("#radindex").find(".radioitem:checked").each(function(i){
        coentlist.push(this.value);
    });
    DataManager(cotrydata,BubbleDeviceList,coentlist);
}
var countrydata=[0,1];
function DataManager(_Data,_FilterDevices,coentlist){
    countrydata=[0,1];
    var tempData=[];
    var tempData2=[];
    for(var j=0;j<oildata.length;j++){
        if(coentlist.indexOf(oildata[j]["原油类别"])>-1){
            tempData2.push(oildata[j]);
        }
    }
    //if(_Data.length<=0){
    //    _Data=oildata
    //}
    if(tempData2!=null && tempData2.length>0){
        for(var i=0;i<tempData2.length;i++){
            if(_FilterDevices.indexOf(tempData2[i]["国家"])>-1){
                tempData.push(tempData2[i]);
            }
        }
    }
    if(tempData.length<=0){
        countrydata=tempData
    }else{
        newoilcheckdata=tempData
    }
    remove()
    oilmap();
    //return tempData;
}
function remove(){
    $("#totals").find("svg").remove();
    $("#pie").find("svg").remove();
    $("#legend").find("div").remove();
    $("#parallel").find("svg").remove();
    $("#parallel").find("div").remove();
    $("#myGrid").find("div").remove()
}
//时间控件处理事件

function DatetimeMemanage(_date){
   // newoilcheckdata=[];
    var startdatevalue=null;
    var enddatevalue=null;
   // if(newoilcheckdata.length<=1){
        newoilcheckdata=_date;
  //  }
    for(var i=0;i<newoilcheckdata.length;i++){
        if(newoilcheckdata[i]["日期"]==startDate){
            startdatevalue=i;
           //newoilcheckdata.push(oildata[i]);
        }
    }
    for(var i=0;i<newoilcheckdata.length;i++){
        if(newoilcheckdata[i]["日期"]==endDate){
            enddatevalue=i;
        }
    }
    var slicedata=newoilcheckdata.slice(startdatevalue,enddatevalue+1)

    newoilcheckdata=slicedata;
    remove();
    oilmap();
}

Date.prototype.dateformat = function(formatter)
{
    if(!formatter || formatter == "")
    {
        formatter = "yyyy/MM/dd";
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