/*
** 詹顺怀 2015/4/28.
**1.获取时间段 startDate，endDate
**2.统计相同字段出现的次数
**3.相同字段次数值的和
**4.拼接类似hoop的数据
**5.加载到页面上
*/

//DOME加载完毕
$(document.body).ready(function () {
    InitControl(); //控件初始化
    LoadDataRefreshHoop();
});

var startDate = "2001-01-01", endDate = "2002-10-31";
var safety = "人员安全", safetyvalue = "人员安全值"
var accident = "设备风险", accidentvalue = "设备风险值";
var risk = "工艺风险", riskvalue = "工艺风险值";
var process = "其它风险", processvalue = "其它风险值";
//1.控件初始化 日历
function InitControl() {
    //日期选择
    $("#datepicker01").Zebra_DatePicker({
        format: "Y-m-d",
        //format:"Y-m",
        direction: ["2001-01-01", "2002-10-31"],
        onSelect: function (date) {
            startDate = date;
            RefreshHoopMap();
        },
        onClear: function () {
        }
    }).val(startDate).width(120);

    $("#datepicker02").Zebra_DatePicker({
        format: "Y-m-d",
        //format:"Y-m",
        direction: ["2001-01-01", "2002-10-31"],
        onSelect: function (date) {
            endDate = date;
            RefreshHoopMap()
            //RefreshTreeMap(vytype, vydimension);
        },
        onClear: function () {
        }
    }).val(endDate).width(120);

}

//region 2.加载数据与筛选处理
var alldata = null;
function LoadDataRefreshHoop() {
    d3.csv("../data/ratingpsmt.csv", function (csv) {
        alldata = csv;
        RefreshHoopMap();
    });
}

//数据筛选处理
function DataFilterByCondition(_name,_value) {
    var TagItems = []; //{key,value,items}
    var TagNames = [];
    var tempdindex = -1;
    for (var i = 0; i < alldata.length; i++) {
        if (alldata[i]["date"] >= startDate && alldata[i]["date"] <= endDate) {
            tempdindex = TagNames.indexOf(alldata[i][_name]);
            if (tempdindex > -1) {
                TagItems[tempdindex].value += 1;
                TagItems[tempdindex].ratio += parseInt(alldata[i][_value]);
            } else {
                TagNames.push(alldata[i][_name]);
                TagItems.push({ feature: alldata[i][_name], ratio: parseInt(alldata[i][_value]), value: 1 });
            }
        }
    }
    return TagItems;
}

/* 3.更新数据并绘制到页面*/
function RefreshHoopMap() {
    var filterdataA = DataFilterByCondition(safety, safetyvalue);
    var filterdataB = DataFilterByCondition(accident, accidentvalue);
    var filterdataC = DataFilterByCondition(risk, riskvalue);
    var filterdataD = DataFilterByCondition(process, processvalue);
    for (var i = 0; i < $(".area").length; i++) {
        //$($(".area")[i]).innerHTML = "";
        var div = $($(".area")[i]).attr('id');
        $("#"+div).empty();
    }
    Draw(filterdataA, "安全", 0);
    Draw(filterdataB, "事故", 1);
    Draw(filterdataC, "风险", 2);
    Draw(filterdataD, "过程", 3);
}

function Draw(_list, _part, _id) {
    var data = '[{"key":"' + _part + '","period":"20010101-20021031","features":[';
    for (var i = 0; i < _list.length; i++) {
        data += '{"feature":"' + _list[i].feature + '","ratio":"' + _list[i].ratio + '","value":"' + _list[i].value + Math.random() * 30 + '","value_r":"' + Math.random() * 20 + '"},';
    }
    data = data.substr(0, data.length - 1);
    data += "]}]";
    data = JSON.parse(data);
    iDemand = new BID.Demand({ divID: $($(".area")[_id]).attr('id') });
    iDemand.drawBg().setData(data[0]).drawCircle(BID.getColor(0)).wordgraph = data;
}
