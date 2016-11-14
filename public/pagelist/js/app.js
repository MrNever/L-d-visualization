/**
 * Created by wanli on 2015/4/13.
 */

//页面加载事件处理
$(document.body).ready(function(){
    TreeLoad();//左侧导航树加载
})

//2.初始化左侧导航树
function TreeLoad(){
     //初始化数据
    var _nodesdata={
    showcheck:false,
    data:[
      {
        "id" : "0",
        "text" : "非常规图形展示",
        "value" : "0",
        "showcheck":false,
        complete : true,
        "isexpand" : true,
        "checkstate" : 0,
        "hasChildren" : true,
        ChildNodes:[
          {
            "id" : "18",
            "text" : "报警分析_综合分析",
            "value" : "alarmanalytical",
            "showcheck":false,
            complete : true,
            "isexpand" : false,
            "checkstate" : 0,
            "hasChildren" : false
          },
          {
            "id" : "19",
            "text" : "报警分析_报警诊断",
            "value" : "alarmdiagnose",
            "showcheck":false,
            complete : true,
            "isexpand" : false,
            "checkstate" : 0,
            "hasChildren" : false
          },
          {
            "id" : "20",
            "text" : "报警分析_报警自定义分析",
            "value" : "alarmcustomanalyse",//待添加
            "showcheck":false,
            complete : true,
            "isexpand" : false,
            "checkstate" : 0,
            "hasChildren" : false
          },
          {
            "id" : "21",
            "text" : "报警分析_历史记录",
            "value" : "historydianom",
            "showcheck":false,
            complete : true,
            "isexpand" : false,
            "checkstate" : 0,
            "hasChildren" : false
          },
          {
            "id" : "23",
            "text" : "异常工况时序分析",
            "value" : "exceptiontiming",
            "showcheck":false,
            complete : true,
            "isexpand" : false,
            "checkstate" : 0,
            "hasChildren" : false
          },
          {
            "id" : "24",
            "text" : "报警分布",
            "value" : "heatmap",
            "showcheck":false,
            complete : true,
            "isexpand" : false,
            "checkstate" : 0,
            "hasChildren" : false
          },
          {
            "id" : "1",
            "text" : "报警KPI变化",
            "value" : "alarmkpi",
            "showcheck":false,
            complete : true,
            "isexpand" : false,
            "checkstate" : 0,
            "hasChildren" : false
          },
          {
            "id" : "2",
            "text" : "易挥发泄漏气体变化",
            "value" : "climate",
            "showcheck":false,
            complete : true,
            "isexpand" : false,
            "checkstate" : 0,
            "hasChildren" :false
          },
          {
            "id" : "3",
            "text" : "原油成分分析",
            "value" : "oilcomponent",
            "showcheck":false,
            complete : true,
            "isexpand" : false,
            "checkstate" : 0,
            "hasChildren" :false
          },
          //{
          //  "id" : "4",
          //  "text" : "报警分析-热图",
          //  "value" : "alarmheatmap",
          //  "showcheck":false,
          //  complete : true,
          //  "isexpand" : false,
          //  "checkstate" : 0,
          //  "hasChildren" :false
          //},
          {
            "id" : "5",
            "text" : "报警分析-TreeMap",
            "value" : "alarmtreemap",
            "showcheck":false,
            complete : true,
            "isexpand" : false,
            "checkstate" : 0,
            "hasChildren" :false
          },
          {
            "id" : "6",
            "text" : "乙烯装置能耗分析-TreeMap",
            "value" : "vinyldevicetreemap",
            "showcheck":false,
            complete : true,
            "isexpand" : false,
            "checkstate" : 0,
            "hasChildren" :false
          },
          {
            "id" : "7",
            "text" : "乙烯装置能耗分析-Scatter",
            "value" : "vinyldevicescatter",
            "showcheck":false,
            complete : true,
            "isexpand" : false,
            "checkstate" : 0,
            "hasChildren" :false
          },
          {
            "id" : "22",
            "text" : "裂解炉产能VS能耗对比分析",
            "value" : "interactive",
            "showcheck":false,
            complete : true,
            "isexpand" : false,
            "checkstate" : 0,
            "hasChildren" :false
          },
          //{
          //  "id" : "8",
          //  "text" : "异常工况时序分析",
          //  "value" : "abnormaltimeseries",
          //  "showcheck":false,
          //  complete : true,
          //  "isexpand" : false,
          //  "checkstate" : 0,
          //  "hasChildren" :false
          //},
          {
            "id" : "9",
            "text" : "风险注册库关键热词云图",
            "value" : "risklibrarycloud",
            "showcheck":false,
            complete : true,
            "isexpand" : false,
            "checkstate" : 0,
            "hasChildren" :false
          },
          {
            "id" : "10",
            "text" : "现金流分析",
            "value" : "cashoverview",
            "showcheck":false,
            complete : true,
            "isexpand" : false,
            "checkstate" : 0,
            "hasChildren" :false
          },
          //{
          //  "id" : "11",
          //  "text" : "进度完成分析",
          //  "value" : "progressanalysis",
          //  "showcheck":false,
          //  complete : true,
          //  "isexpand" : false,
          //  "checkstate" : 0,
          //  "hasChildren" :false
          //},
          {
            "id" : "12",
            "text" : "现金流历史趋势分析",
            "value" : "cashtrend",
            "showcheck":false,
            complete : true,
            "isexpand" : false,
            "checkstate" : 0,
            "hasChildren" :false
          },
          //{
          //  "id" : "13",
          //  "text" : "装置现金流构成分析",
          //  "value" : "devicecashcomponent",
          //  "showcheck":false,
          //  complete : true,
          //  "isexpand" : false,
          //  "checkstate" : 0,
          //  "hasChildren" :false
          //},
          {
            "id" : "14",
            "text" : "装置现金流趋势分析",
            "value" : "devicecashtrend",
            "showcheck":false,
            complete : true,
            "isexpand" : false,
            "checkstate" : 0,
            "hasChildren" :false
          },
          //,{
          //  "id" : "15",
          //  "text" : "OLAP维度信息展示",
          //  "value" : "olapshow",
          //  "showcheck":false,
          //  complete : true,
          //  "isexpand" : false,
          //  "checkstate" : 0,
          //  "hasChildren" :false
          //}
          {
            "id" : "16",
            "text": "过程安全管理等级趋势分析",
            "value": "ratingpsmt",
            "showcheck":false,
            complete : true,
            "isexpand" : false,
            "checkstate" : 0,
            "hasChildren" :false
        }, {
            "id": "17",
            "text": "过程安全管理多维度分析",
            "value": "multidimensionalpsm",
            "showcheck": false,
            complete: true,
            "isexpand": false,
            "checkstate": 0,
            "hasChildren": false
        }
          //{
          //  "id" : "5",
          //  "text" : "综合查询",
          //  "value" : "5",
          //  "showcheck":false,
          //  complete : true,
          //  "isexpand" : false,
          //  "checkstate" : 0,
          //  "hasChildren" : true,
          //  ChildNodes:[
          //    {
          //      "id" : "51",
          //      "text" : "炼钢",
          //      "value" : "51",
          //      "showcheck":false,
          //      complete : true,
          //      "isexpand" : false,
          //      "checkstate" : 0,
          //      "hasChildren" :true,
          //      ChildNodes:[]
          //    },
          //    {
          //      "id" : "52",
          //      "text" : "热轧",
          //      "value" : "43",
          //      "showcheck":false,
          //      complete : true,
          //      "isexpand" : false,
          //      "checkstate" : 0,
          //      "hasChildren" :true,
          //      ChildNodes:[]
          //    },
          //    {
          //      "id" : "53",
          //      "text" : "冷轧",
          //      "value" : "53",
          //      "showcheck":false,
          //      complete : true,
          //      "isexpand" : false,
          //      "checkstate" : 0,
          //      "hasChildren" :true,
          //      ChildNodes:[
          //        {
          //          "id" : "531",
          //          "text" : "酸轧",
          //          "value" : "531",
          //          "showcheck":false,
          //          complete : true,
          //          "isexpand" : false,
          //          "checkstate" : 0,
          //          "hasChildren" :false
          //        }
          //      ]
          //    }
          //  ]
          //}
        ]
      }]
  };

    $("#PageNodeTree").html("").treeview(_nodesdata);
    $("#PageNodeTree").bind("click",function(ev){
      var selnode=$("#PageNodeTree").getCurrentNode();
      var pageurl="pages/"+selnode.value+".html"
      $("#rightpanelform").attr("src",pageurl);
  });
}