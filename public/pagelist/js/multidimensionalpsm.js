/*************************
** zhanshunhuai 
** 2015-4-28~2015-4-29
** checkbox联动table数据
** 四象限数据气泡的颜色
************************/
var data = null;//所有的table数据来源
var templist = null; //对table数据来源进行筛选
var bubbledata = null; //四象限数据来源
var colordata = null;

$(document.body).ready(function () {
    Init();
});
/*************初始化，获得数据***************/
function Init() {
    d3.csv("../data/multidimensionalcolor.csv", function (csv) {
        colordata = csv;
        GetlengColor(colordata);
    });

    d3.csv("../data/multidimensionalpsm.csv", function (csv) {
        data = csv;
        data = FilterDataByType(data, "TierB");//对数据进行初步过滤
        Loadcheckbox(data);
    });
    

    d3.csv("../data/multidimensionalbubble.csv", function (csv) {
        bubbledata = csv;
        MDS();
        ReshHighcahrts(bubbledata);
    });
}
/*************对整体数据进行粗选***************/
function FilterDataByType(_data, _type) {
    var tempdata = [];
    for (var i = 0; i < _data.length; i++) {
        if (_data[i]["Type"] == _type) {
            tempdata.push(_data[i]);
        }
    }
    return tempdata;
}
/*************加载checkbox***************/
function Loadcheckbox(_data) {
    //_data = FilterDataByType(_data, "TierB"); //过滤数据
    LoadBubble(_data);

    var _checkliststr = "";
    _checkliststr = "<input  id='all' type='checkbox' class='ck' checked='checked' value=''/><font>(全部)</font><br />"
    for (var i = 0; i < _data.length; i++) {
        _checkliststr += "<input type='checkbox' class='ck' checked='checked' value='" + _data[i].Name + "'><font>" + _data[i].Name + "</font><br/>";
    }
    $("#sclist").append(_checkliststr);
    $("#sclist").find('.ck').iCheck({
        checkboxClass: 'icheckbox_flat-blue'
    });

    $("#sclist").find(".ck").on("ifChanged", function (ev) {
        templist = [];
        if (this.value === "") {
            if (this.checked) {
                $("#sclist").find(".ck").attr("checked", "checked");
                $("#sclist div").addClass("checked")
            } else {
                $("#sclist").find(".ck").removeAttr("checked");
                $("#sclist div").removeClass("checked")
            }
        }
        //将checked的 全部加入到数组中
        var checkedL = $("#sclist").find(".ck:gt(0):checked").length;
        if (checkedL > 0) {
            $("#sclist").find(".ck:checked").each(function (i, ev) {
                if (ev.value !== "") {
                    templist.push(ev.value);
                }
            });
        }
        //判断 全部 是否勾选
        if (checkedL < _data.length) {
            $("#all").removeAttr("checked");
            $("#all").parent().removeClass("checked");
        } else {
            $("#all").attr("checked", "checked");
            $("#all").parent().addClass("checked");
        }
        $("#mytb").empty(); //清空table
        LoadBubble(DataManager(_data, templist));
    })
}

/*************对数据进行筛选，细选 找到checked的数据***************/
function DataManager(_Data, _FilterDevices) {
    var tempData = [];
    if (_Data != null && _Data.length > 0) {
        for (var i = 0; i < _Data.length; i++) {
            if (_FilterDevices.indexOf(_Data[i]["Name"]) > -1) {
                tempData.push(_Data[i]);
            }
        }
    }
    return tempData;
}
/*************加载数据到table***************/
function LoadBubble(_Data) {
    var _trlist = "";
    _trlist = "<tr><th></th><th></th><th>Win-Loss Ration</th><th class='thbackcolor'>Popularity</th><th>Matches</th><th class='thbackcolor'>KDA</th><th>Avg Kills</th><th class='thbackcolor'>Avg Deaths</th><th>Avg Assists</th></tr>";
    if (_Data.length > 0) {
        _trlist += "<tr name='" + _Data[0].Name + "'><td id='charttype' class='tbwidth' rowspan='" + _Data.length + "'>Tier A</td><td class='textL'>" + _Data[0].Name + "</td><td>" + _Data[0].Ratio + "</td><td class='tbbackcolor'>" + _Data[0].Popularity + "%</td><td>" + _Data[0].Matches + "</td><td class='tbbackcolor'>" + _Data[0].KDA + "</td><td>" + _Data[0].Kills + "</td><td class='tbbackcolor'>" + _Data[0].Deaths + "</td><td>" + data[0].Assists + "</td></tr>";
        for (var i = 1; i < _Data.length; i++) {
            _trlist += "<tr  name='" + _Data[i].Name + "'><td class='textL'>" + _Data[i].Name + "</td><td>" + _Data[i].Ratio + "</td><td class='tbbackcolor'>" + _Data[i].Popularity + "%</td><td>" + _Data[i].Matches + "</td><td class='tbbackcolor'>" + _Data[i].KDA + "</td><td>" + _Data[i].Kills + "</td><td class='tbbackcolor'>" + _Data[i].Deaths + "</td><td>" + _Data[i].Assists + "</td></tr>";
        }
    }
    _trlist+="<tr></tr>"
    $("#mytb").append(_trlist);
}


/*************更新highchart数据***************/
function ReshHighcahrts(_data) {
    var xlist = [];
    var ylist = [];
    var listdata = "[";
    for (var i = 0; i < _data.length; i++) {
        xlist.push(_data[i].x);
        ylist.push(_data[i].y);
        var z = 100 * _data[i].x * _data[i].x + _data[i].y * _data[i].y;
        var color = GetPointColor(z, colordata);
        listdata += "{x:" + _data[i].x + ",y:" + _data[i].y + ",z:" + _data[i].z + ",color:'" + color + "'},";
    }
    listdata = listdata.substr(0, listdata.length - 1);
    listdata += "]";
    //var vdata = JSON.parse(listdata);
    var vdata = eval(listdata);

    var xmin = d3.min(xlist);
    var xmax = d3.max(xlist);
    var midx = (parseFloat(xmin) + parseFloat(xmax)) / 2;
    var ymin = d3.min(ylist);
    var ymax = d3.max(ylist);
    var midy = (parseFloat(ymin) + parseFloat(ymax)) / 2;

    var chart = $('#MDS').highcharts();
    if (chart != null) {
        if (chart.series.length > 0) {
            for (var i = chart.series.length - 1; i >= 0; i--) {
                chart.series[i].remove();
            }
        }
        chart.addSeries({ data: vdata });
        chart.xAxis[0].update({ title: { text: '平均值 Win-Loss Ratio' },
            plotLines: [{ color: 'RGB(218,218,218)', dashStyle: 'solid', width: 1, value: midx,
                        label: {text: 'Game Average',rotation: 0, verticalAlign: 'bottom',y: -10},
                        zIndex: 100
                        }],
            gridLineWidth: 0
        });
        chart.yAxis[0].update({ title: { text: 'KDA' },
            plotLines: [{ color: 'RGB(218,218,218)', dashStyle: 'solid', width: 1, value: midy,
                label: { text: 'Game Average', rotation: 0, verticalAlign: 'bottom', y: -10 },
                zIndex: 100
            }],
            gridLineWidth: 0
        });
    }
}
/*************加载数据到highchart***************/
function MDS() {
    $('#MDS').highcharts({
        chart: {
            type: 'bubble',
            //zoomType: 'xy',
            plotBorderWidth: 1
        },
        title: {
            text: null
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false
        }
    });

}
/*************获得图例标签***************/
function GetlengColor(_data) {
    var divlist = "";
    for (var i in colordata) {
        divlist += "<div class='divkind'><div class='divpic' style='background-color:" + _data[i].color + "'></div><div class='divtext'>" + _data[i].name + "</div></div>";
    }
    $("#lenglist").append(divlist);
}
/*************获得每个气泡的颜色***************/
function GetPointColor(_value, _data) {
    var s = "RGB(156,95,77)";
    for (var i in _data) {
        if (_data[i].min <= _value && _value <= _data[i].max) {
            s = _data[i].color;
        }
    }
    return s;
}
