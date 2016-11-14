/**
 * Created by Mr_hu on 2015/5/27.
 */
var startDate="2015-01-01",endDate="2015-03-31"
var companypropety="资产公司";
$(document.body).ready(function(){
    var ranges = [];
    for (var i = Date.parse(new Date(startDate)); i < Date.parse(new Date(endDate)); i = i + (5 * 24 * 60 * 3600)) {
        ranges.push(i);
    }
    var picker = $("#slideryear1").range_picker({
        //是否显示分割线
        show_seperator: false,
        //是否启用动画
        animate: false,
        //初始化开始区间值
        from: startDate,
        //初始化结束区间值
        to: endDate,
        axis_width: 185,
        //选取块宽度
        picker_width: 14,
        //各区间值
        ranges: ranges,
        onChange: function (from_to) {
            $(".sliderlabelpanel>.label_left").html(new Date(from_to[0]).dateformat("yyyy-MM-dd"));
            $(".sliderlabelpanel>.label_right").html(new Date(from_to[1]).dateformat("yyyy-MM-dd"));
            startDate = new Date(from_to[0]).dateformat("yyyy-MM-dd");
            endDate = new Date(from_to[1]).dateformat("yyyy-MM-dd");
        },
        onSelect: function (index, from_to) {
            KPIDatamanager(alldata)
            highchartdatamanager(chartdatamam)
        },
        afterInit: function () {
            var picker = this;
            var ranges = picker.options.ranges;
            $(".sliderlabelpanel>.label_left").html(new Date(ranges[0]).dateformat("yyyy-MM-dd"));
            $(".sliderlabelpanel>.label_right").html(new Date(ranges[ranges.length - 1]).dateformat("yyyy-MM-dd"));
        }
    });

    $(".sel").change(function(ev){
        var optionvalue= $(".sel").val();
        companypropety=optionvalue
        highchartdatamanager(chartdatamam)
    })
    LoadData()
})

var alldata=null
var chartdatamam=null
function LoadData(){
   //d3.csv("../data/analysisbysynthesis.csv",function(csv){
       var csv=analysisbysynthesis;
       alldata=csv
       KPIDatamanager(alldata);
     //  KPIDatamanager(alldata);
  // })
}
var startdate="2015-01-01",enddate="2015-03-31";
function KPIDatamanager(alldata){

    var groupdcompanyata={
        capitalcompanydate:[],//资产公司
        stockcompanydata:[]//股份公司
    };
    for(var k=0;k<alldata.length;k++){
        if(alldata[k]["公司类型"]=="资产公司"){
            groupdcompanyata.capitalcompanydate.push(alldata[k]);
        }else{
            groupdcompanyata.stockcompanydata.push(alldata[k]);
        }
    }
    var groupdata={
        capitaldate:[],//资产公司
        stockdata:[]//股份公司
    };
    //region 1.合并资产公司一天内多个时间段的是数据
      var tempdatetime=[];
      var timeindex=null;
      for(var i=0;i<groupdcompanyata.capitalcompanydate.length;i++ ){
          timeindex=tempdatetime.indexOf(groupdcompanyata.capitalcompanydate[i]["日期"])
          if(timeindex>-1){
              groupdata.capitaldate[timeindex]["日现金流"]=parseInt(groupdata.capitaldate[timeindex]["日现金流"])+parseInt(groupdcompanyata.capitalcompanydate[i]["日现金流"]);
              groupdata.capitaldate[timeindex]["月累计现金流"]=parseInt(groupdata.capitaldate[timeindex]["月累计现金流"])+parseInt(groupdcompanyata.capitalcompanydate[i]["月累计现金流"]);
              groupdata.capitaldate[timeindex]["月预计现金流"]=parseInt(groupdata.capitaldate[timeindex]["月预计现金流"])+parseInt(groupdcompanyata.capitalcompanydate[i]["月预计现金流"]);
              groupdata.capitaldate[timeindex]["比上月日均"]=parseInt(groupdata.capitaldate[timeindex]["比上月日均"])+parseInt(groupdcompanyata.capitalcompanydate[i]["比上月日均"]);
              groupdata.capitaldate[timeindex]["比计划日均"]=parseInt(groupdata.capitaldate[timeindex]["比计划日均"])+parseInt(groupdcompanyata.capitalcompanydate[i]["比计划日均"]);
              groupdata.capitaldate[timeindex]["比计划进度"]=parseInt(groupdata.capitaldate[timeindex]["比计划进度"])+parseInt(groupdcompanyata.capitalcompanydate[i]["比计划进度"]);
              groupdata.capitaldate[timeindex]["月累计环比"]=parseInt(groupdata.capitaldate[timeindex]["月累计环比"])+parseInt(groupdcompanyata.capitalcompanydate[i]["月累计环比"]);
              groupdata.capitaldate[timeindex]["企业现金流"]=parseInt(groupdata.capitaldate[timeindex]["企业现金流"])+parseInt(groupdcompanyata.capitalcompanydate[i]["企业现金流"]);
              groupdata.capitaldate[timeindex]["产品产量"]=parseInt(groupdata.capitaldate[timeindex]["产品产量"])+parseInt(groupdcompanyata.capitalcompanydate[i]["产品产量"]);
              groupdata.capitaldate[timeindex]["高限负荷率"]=parseInt(parseInt(groupdata.capitaldate[timeindex]["高限负荷率"]))+parseInt(groupdcompanyata.capitalcompanydate[i]["高限负荷率"]);

          }else{
              tempdatetime.push(groupdcompanyata.capitalcompanydate[i]["日期"]);
              groupdata.capitaldate.push(groupdcompanyata.capitalcompanydate[i]);
          }
      }
    //endregion

    //region 1.合并股份公司公司一天内多个时间段的是数据
    var tempstockdatetime=[];
    var timestockindex=null;
    for(var i=0;i<groupdcompanyata.stockcompanydata.length;i++ ){
        timestockindex=tempstockdatetime.indexOf(groupdcompanyata.stockcompanydata[i]["日期"])
        if(timestockindex>-1){
            groupdata.stockdata[timestockindex]["日现金流"]=parseInt(groupdata.stockdata[timestockindex]["日现金流"])+parseInt(groupdcompanyata.stockcompanydata[i]["日现金流"]);
            groupdata.stockdata[timestockindex]["月累计现金流"]=parseInt(groupdata.stockdata[timestockindex]["月累计现金流"])+parseInt(groupdcompanyata.stockcompanydata[i]["月累计现金流"]);
            groupdata.stockdata[timestockindex]["月预计现金流"]=parseInt(groupdata.stockdata[timestockindex]["月预计现金流"])+parseInt(groupdcompanyata.stockcompanydata[i]["月预计现金流"]);
            groupdata.stockdata[timestockindex]["比上月日均"]=parseInt(groupdata.stockdata[timestockindex]["比上月日均"])+parseInt(groupdcompanyata.stockcompanydata[i]["比上月日均"]);
            groupdata.stockdata[timestockindex]["比计划日均"]=parseInt(groupdata.stockdata[timestockindex]["比计划日均"])+parseInt(groupdcompanyata.stockcompanydata[i]["比计划日均"]);
            groupdata.stockdata[timestockindex]["比计划进度"]=parseInt(groupdata.stockdata[timestockindex]["比计划进度"])+parseInt(groupdcompanyata.stockcompanydata[i]["比计划进度"]);
            groupdata.stockdata[timestockindex]["月累计环比"]=parseInt(groupdata.stockdata[timestockindex]["月累计环比"])+parseInt(groupdcompanyata.stockcompanydata[i]["月累计环比"]);
            groupdata.stockdata[timestockindex]["企业现金流"]=parseInt(groupdata.stockdata[timestockindex]["企业现金流"])+parseInt(groupdcompanyata.stockcompanydata[i]["企业现金流"]);
            groupdata.stockdata[timestockindex]["产品产量"]=parseInt(groupdata.stockdata[timestockindex]["产品产量"])+parseInt(groupdcompanyata.stockcompanydata[i]["产品产量"]);
            groupdata.stockdata[timestockindex]["高限负荷率"]=parseInt(parseInt(groupdata.stockdata[timestockindex]["高限负荷率"]))+parseInt(groupdcompanyata.stockcompanydata[i]["高限负荷率"]);
        }else{
            tempstockdatetime.push(groupdcompanyata.stockcompanydata[i]["日期"]);
            groupdata.stockdata.push(groupdcompanyata.stockcompanydata[i]);
        }
    }
    //endregion

    chartdatamam=groupdata

    // region 3资产公司
    //日现金流

    var groupdatecapital={
        datemoney:[],
        monthmoney:[],
        monthexpectmonry:[]
    }
    var capitaldatetime="2015-01-01";
    if(startDate!="2015-01-01"){
        capitaldatetime=startDate;
    }
    if(endDate!="2015-03-31"){
        capitaldatetime=endDate;
    }
    for(var n=0;n<groupdata.capitaldate.length;n++){
        if(groupdata.capitaldate[n]["日期"]==capitaldatetime){
            groupdatecapital.datemoney.push({
                date:groupdata.capitaldate[n]["日期"],
                dtmoney:groupdata.capitaldate[n]["日现金流"],
                tomonthdt:parseInt(groupdata.capitaldate[n]["比上月日均"]-groupdata.capitaldate[n]["日现金流"]),
                tomonthdtbfb:parseFloat(parseInt(parseInt(groupdata.capitaldate[n]["比上月日均"]-groupdata.capitaldate[n]["日现金流"]))/groupdata.capitaldate[n]["日现金流"]*100).toFixed(2),
                plan:parseInt(groupdata.capitaldate[n]["比计划日均"]),
                planbfb:parseFloat(parseInt(parseInt(groupdata.capitaldate[n]["日现金流"]-groupdata.capitaldate[n]["比计划日均"]))/groupdata.capitaldate[n]["日现金流"]*100).toFixed(2)});
        }
    }
    //月累计现金流
    var monthdata=groupdata
    var startdatevalue=null;
    var enddatevalue=null;
    for(var i=0;i<monthdata.capitaldate.length;i++){
        if(monthdata.capitaldate[i]["日期"]==startDate){
            startdatevalue=i;
            //newoilcheckdata.push(oildata[i]);
        }
    }
    for(var i=0;i<monthdata.capitaldate.length;i++){
        if(monthdata.capitaldate[i]["日期"]==endDate){
            enddatevalue=i;
        }
    }
    var slicedata=monthdata.capitaldate.slice(startdatevalue,enddatevalue)
    var sldata=[];
    var lendate=[];
    var indextem=null
    for(var i=0;i<slicedata.length;i++){
        indextem=lendate.indexOf(slicedata[i]["公司类型"])
        if(indextem>-1){
            sldata[indextem]["月累计现金流"]=parseInt(sldata[indextem]["月累计现金流"])+parseInt(slicedata[i]["月累计现金流"]);
            sldata[indextem]["月累计环比"]=parseInt(sldata[indextem]["月累计环比"])+parseInt(slicedata[i]["月累计环比"]);
            sldata[indextem]["比计划进度"]=parseInt(sldata[indextem]["比计划进度"])+parseInt(slicedata[i]["比计划进度"]);
        }else{
            lendate.push(slicedata[i]["公司类型"]);
            sldata.push(slicedata[i])
        }
    }
    groupdatecapital.monthmoney.push({
        date1:startDate,
        date2:endDate,
        monthcapitamoney:sldata[0]["月累计现金流"],
        monthcahb:parseInt(sldata[0]["月累计现金流"]-sldata[0]["月累计环比"]),
        monthcahbbfb:parseFloat(parseInt(sldata[0]["月累计现金流"]-sldata[0]["月累计环比"])/sldata[0]["月累计现金流"]*100).toFixed(2),
        plancount:sldata[0]["比计划进度"],
        plancountbfb:parseFloat(parseInt(sldata[0]["月累计现金流"]-sldata[0]["比计划进度"])/sldata[0]["月累计现金流"]*100).toFixed(2)
    })
   if(parseInt(groupdatecapital.monthmoney[0].plancountbfb)<0){

   }else{
       groupdatecapital.monthmoney[0].plancountbfb="+"+groupdatecapital.monthmoney[0].plancountbfb
   }
    //月预计现金流
    var monthplandata=groupdata;
    var startvalue=null;
    var endvalue=null;
    var startcapitalmonthtime="2015-01-01";
    var endcapitalmonthtime="2015-01-31"
    if(startDate!="2015-01-01"){
        var sundate=startDate.substring(0,7)
        var pingdate=sundate+"-01"
        startcapitalmonthtime=pingdate;
        if(pingdate.substring(5,7)=="02"){
            endcapitalmonthtime=sundate+"-28"
        }
        if(pingdate.substring(5,7)=="01"||pingdate.substring(5,7)=="03"){
            endcapitalmonthtime=sundate+"-31"
        }

    }
    for(var i=0;i<monthplandata.capitaldate.length;i++){
        if(monthplandata.capitaldate[i]["日期"]==startcapitalmonthtime){
            startvalue=i;
            //newoilcheckdata.push(oildata[i]);
        }
    }
    for(var i=0;i<monthplandata.capitaldate.length;i++){
        if(monthplandata.capitaldate[i]["日期"]==endcapitalmonthtime){
            endvalue=i;
        }
    }
    var slicedatamonth=monthplandata.capitaldate.slice(startvalue,endvalue)
    var slmonthdata=[];
    var lenmonthdate=[];
    var indextemx=null
    for(var i=0;i<slicedatamonth.length;i++){
        indextemx=lenmonthdate.indexOf(slicedatamonth[i]["公司类型"])
        if(indextemx>-1){
            slmonthdata[indextemx]["月预计现金流"]=parseInt(slmonthdata[indextemx]["月预计现金流"])+parseInt(slicedatamonth[i]["月预计现金流"]);
            slmonthdata[indextemx]["月累计环比"]=parseInt(slmonthdata[indextemx]["月累计环比"])+parseInt(slicedatamonth[i]["月累计环比"]);
            slmonthdata[indextemx]["比计划进度"]=parseInt(slmonthdata[indextemx]["比计划进度"])+parseInt(slicedatamonth[i]["比计划进度"]);
        }else{
            lenmonthdate.push(slicedatamonth[i]["公司类型"]);
            slmonthdata.push(slicedatamonth[i])
        }
    }
    groupdatecapital.monthexpectmonry.push({
        date1:endcapitalmonthtime.substring(6,7)+"月",
        monthcapitamoney:slmonthdata[0]["月预计现金流"],
        monthcahb:parseInt(slmonthdata[0]["月预计现金流"]-slmonthdata[0]["月累计环比"]),
        monthcahbbfb:parseFloat(parseInt(slmonthdata[0]["月预计现金流"]-slmonthdata[0]["月累计环比"])/slmonthdata[0]["月预计现金流"]*100).toFixed(2),
        plancount:slmonthdata[0]["比计划进度"],
        plancountbfb:parseFloat(parseInt(slmonthdata[0]["比计划进度"]-slmonthdata[0]["月预计现金流"])/slmonthdata[0]["月预计现金流"]*100).toFixed(2)
    })


    //股份公司
    var countmonry={
        datecountmoney:[],
        monthcountmoney:[],
        monthcountexpectmonry:[]
    }
    var stockdatetime="2015-01-01";
    if(startDate!="2015-01-01"){
        stockdatetime=startDate;
    }
    if(endDate!="2015-03-31"){
        stockdatetime=endDate;
    }
    for(var n=0;n<groupdata.stockdata.length;n++){
        if(groupdata.stockdata[n]["日期"]==stockdatetime){
            countmonry.datecountmoney.push({
                date:groupdata.stockdata[n]["日期"],
                dtmoney:groupdata.stockdata[n]["日现金流"],
                tomonthdt:parseInt(groupdata.stockdata[n]["比上月日均"]-groupdata.stockdata[n]["日现金流"]),
                tomonthdtbfb:parseFloat(parseInt(parseInt(groupdata.stockdata[n]["比上月日均"]-groupdata.stockdata[n]["日现金流"]))/groupdata.stockdata[n]["日现金流"]*100).toFixed(2),
                plan:parseInt(groupdata.stockdata[n]["比计划日均"]),
                planbfb:parseFloat(parseInt(parseInt(parseInt(groupdata.stockdata[n]["比计划日均"]+5000)-groupdata.stockdata[n]["日现金流"]))/groupdata.stockdata[n]["日现金流"]*100).toFixed(2)});
        }
    }
    //月累计现金流
    var monthcountdata=groupdata
    var startdate=null;
    var enddate=null;
    for(var i=0;i<monthcountdata.stockdata.length;i++){
        if(monthcountdata.stockdata[i]["日期"]==startDate){
            startdate=i;
            //newoilcheckdata.push(oildata[i]);
        }
    }
    for(var i=0;i<monthcountdata.stockdata.length;i++){
        if(monthcountdata.stockdata[i]["日期"]==endDate){
            enddate=i;
        }
    }
    var slicedatavalue=monthcountdata.stockdata.slice(startdate,enddate)
    var sldatacount=[];
    var lendatecount=[];
    var indextemcount=null
    for(var i=0;i<slicedatavalue.length;i++){
        indextem=lendate.indexOf(slicedatavalue[i]["公司类型"])
        if(indextem>-1){
            sldatacount[indextemcount]["月累计现金流"]=parseInt(sldatacount[indextemcount]["月累计现金流"])+parseInt(slicedatavalue[i]["月累计现金流"]);
            sldatacount[indextemcount]["月累计环比"]=parseInt(sldatacount[indextemcount]["月累计环比"])+parseInt(slicedatavalue[i]["月累计环比"]);
            sldatacount[indextemcount]["比计划进度"]=parseInt(sldatacount[indextemcount]["比计划进度"])+parseInt(slicedatavalue[i]["比计划进度"]);
        }else{
            lendatecount.push(slicedatavalue[i]["公司类型"]);
            sldatacount.push(slicedatavalue[i])
        }
    }
    countmonry.monthcountmoney.push({
        date1:startDate,
        date2:endDate,
        monthcapitamoney:sldatacount[0]["月累计现金流"],
        monthcahb:parseInt(sldatacount[0]["月累计现金流"]-sldatacount[0]["月累计环比"]),
        monthcahbbfb:parseFloat(parseInt(sldatacount[0]["月累计现金流"]-sldatacount[0]["月累计环比"])/sldatacount[0]["月累计现金流"]*100).toFixed(2),
        plancount:sldatacount[0]["比计划进度"],
        plancountbfb:parseFloat(parseInt(sldatacount[0]["比计划进度"]-sldatacount[0]["月累计现金流"])/sldatacount[0]["月累计现金流"]*100).toFixed(2)
    })

    //月预计现金流
    var monthplancountdata=groupdata;
    var startvaluecount=null;
    var endvaluecount=null;
    var startstockmonthtime="2015-01-01";
    var endstockmonthtime="2015-01-31"
    if(startDate!="2015-01-01"){
        var stockdate=startDate.substring(0,7)
        var pingstockdate=stockdate+"-01"
        startstockmonthtime=pingstockdate;
        if(pingdate.substring(5,7)=="02"){
            endstockmonthtime=sundate+"-28"
        }
        if(pingdate.substring(5,7)=="01"||pingdate.substring(5,7)=="03"){
            endstockmonthtime=sundate+"-31"
        }
    }
    //if(endDate!="2015-01-31"){
    //    var stockdate=startDate.substring(0,7)
    //    var pingdate=sundate+"-01"
    //    startstockmonthtime=pingdate;
    //    if(pingdate.substring(5,7)=="02"){
    //        endstockmonthtime=sundate+"-28"
    //    }
    //    if(pingdate.substring(5,7)=="01"||pingdate.substring(5,7)=="03"){
    //        endstockmonthtime=sundate+"-31"
    //    }
    //}
    for(var i=0;i<monthplancountdata.stockdata.length;i++){
        if(monthplancountdata.stockdata[i]["日期"]==startstockmonthtime){
            startvaluecount=i;
            //newoilcheckdata.push(oildata[i]);
        }
    }
    for(var i=0;i<monthplancountdata.stockdata.length;i++){
        if(monthplancountdata.stockdata[i]["日期"]==endstockmonthtime){
            endvaluecount=i;
        }
    }
    var slicedatamonthcount=monthplancountdata.stockdata.slice(startvaluecount,endvaluecount)
    var slmonthdatacount=[];
    var lenmonthdatecount=[];
    var indextemxone=null
    for(var i=0;i<slicedatamonthcount.length;i++){
        indextemxone=lenmonthdatecount.indexOf(slicedatamonthcount[i]["公司类型"])
        if(indextemxone>-1){
            slmonthdatacount[indextemxone]["月预计现金流"]=parseInt(slmonthdatacount[indextemxone]["月预计现金流"])+parseInt(slicedatamonthcount[i]["月预计现金流"]);
            slmonthdatacount[indextemxone]["月累计环比"]=parseInt(slmonthdatacount[indextemxone]["月累计环比"])+parseInt(slicedatamonthcount[i]["月累计环比"]);
            slmonthdatacount[indextemxone]["比计划进度"]=parseInt(slmonthdatacount[indextemxone]["比计划进度"])+parseInt(slicedatamonthcount[i]["比计划进度"]);
        }else{
            lenmonthdatecount.push(slicedatamonthcount[i]["公司类型"]);
            slmonthdatacount.push(slicedatamonthcount[i])
        }
    }
    countmonry.monthcountexpectmonry.push({
        date1:endstockmonthtime.substring(6,7)+"月",
        monthcapitamoney:slmonthdatacount[0]["月预计现金流"],
        monthcahb:parseInt(slmonthdatacount[0]["月预计现金流"]-slmonthdatacount[0]["月累计环比"]),
        monthcahbbfb:parseFloat(parseInt(slmonthdatacount[0]["月预计现金流"]-slmonthdatacount[0]["月累计环比"])/slmonthdatacount[0]["月预计现金流"]*100).toFixed(2),
        plancount:slmonthdata[0]["比计划进度"],
        plancountbfb:parseFloat(parseInt(slmonthdatacount[0]["月预计现金流"]-slmonthdatacount[0]["比计划进度"])/slmonthdatacount[0]["月预计现金流"]*100).toFixed(2)
    })

    //endregion
    KPIshow(groupdatecapital,countmonry)
    highchartdatamanager(groupdata)
}
function KPIshow(groupdata,countmonry){
    //资产公司kpi
     var content_left_div="";
     content_left_div+="<div class='' style='display:-webkit-box;-webkit-box-flex:1;'><div style='text-align: left;-webkit-box-flex:1;  padding-left: 10px;'>日现金流</div><div style='text-align: right;-webkit-box-flex:1;  padding-right: 10px;'>"+groupdata.datemoney[0].date+"</div></div>"+
     "<div style='text-align:center;-webkit-box-flex:1;font-size: 25px;'>"+groupdata.datemoney[0].dtmoney+"万元</div><div style='background:#eb7b29;display:-webkit-box;-webkit-box-flex:1;'><div style='-webkit-box-flex:1;text-align: center;color: #ffffff'>比上月日均：</div><div style='-webkit-box-flex:1;text-align: center;color: #ffffff'>"+groupdata.datemoney[0].tomonthdt+"万元</div><div style='-webkit-box-flex:1;text-align: center;color: #ffffff'>"+groupdata.datemoney[0].tomonthdtbfb+"%</div></div>"+
     "<div style='background:#72c74e;display:-webkit-box;-webkit-box-flex:1;'><div style='-webkit-box-flex:1;text-align: center;color: #ffffff'>比计划日均：</div><div style='-webkit-box-flex:1;text-align: center;color: #ffffff'>+"+groupdata.datemoney[0].plan+"万元</div><div style='-webkit-box-flex:1;text-align: center;color: #ffffff'>+"+groupdata.datemoney[0].planbfb+"%</div></div>";
     $(".content_left_div1").html(content_left_div)

     var content_left_div="";
     content_left_div+="<div class='' style='display:-webkit-box;-webkit-box-flex:1;'><div style='text-align: left;-webkit-box-flex:1;  padding-left: 10px;'>月累计现金流</div><div style='text-align: right;-webkit-box-flex:1;  padding-right: 10px;'>"+groupdata.monthmoney[0].date1+"-"+groupdata.monthmoney[0].date2+"</div></div>"+
     "<div style='text-align:center;-webkit-box-flex:1;font-size: 25px;'>"+groupdata.monthmoney[0].monthcapitamoney+"万元</div><div style='background:#eb7b29;display:-webkit-box;-webkit-box-flex:1;'><div style='-webkit-box-flex:1;text-align: center;color: #ffffff'>月累计环比：</div><div style='-webkit-box-flex:1;text-align: center;color: #ffffff'>"+groupdata.monthmoney[0].monthcahb+"万元</div><div style='-webkit-box-flex:1;text-align: center;color: #ffffff'>"+groupdata.monthmoney[0].monthcahbbfb+"%</div></div>"+
     "<div style='background:#72c74e;display:-webkit-box;-webkit-box-flex:1;'><div style='-webkit-box-flex:1;text-align: center;color: #ffffff'>比计划进度：</div><div style='-webkit-box-flex:1;text-align: center;color: #ffffff'>+"+groupdata.monthmoney[0].plancount+"万元</div><div style='-webkit-box-flex:1;text-align: center;color: #ffffff'>"+groupdata.monthmoney[0].plancountbfb+"%</div></div>";
     $(".content_left_div2").html(content_left_div)

    var content_left_div="";
    content_left_div+="<div class='' style='display:-webkit-box;-webkit-box-flex:1;'><div style='text-align: left;-webkit-box-flex:1;  padding-left: 10px;'>月预计现金流</div><div style='text-align: right;-webkit-box-flex:1;  padding-right: 10px;'>"+groupdata.monthexpectmonry[0].date1+"</div></div>"+
    "<div style='text-align:center;-webkit-box-flex:1;font-size: 25px;'>"+groupdata.monthexpectmonry[0].monthcapitamoney+"万元</div><div style='background:#eb7b29;display:-webkit-box;-webkit-box-flex:1;'><div style='-webkit-box-flex:1;text-align: center;color: #ffffff'>月累计环比：</div><div style='-webkit-box-flex:1;text-align: center;color: #ffffff'>"+groupdata.monthexpectmonry[0].monthcahb+"万元</div><div style='-webkit-box-flex:1;text-align: center;color: #ffffff'>"+groupdata.monthexpectmonry[0].monthcahbbfb+"%</div></div>"+
    "<div style='background:#72c74e;display:-webkit-box;-webkit-box-flex:1;'><div style='-webkit-box-flex:1;text-align: center;color: #ffffff'>比计划进度：</div><div style='-webkit-box-flex:1;text-align: center;color: #ffffff'>+"+groupdata.monthexpectmonry[0].plancount+"万元</div><div style='-webkit-box-flex:1;text-align: center;color: #ffffff'>+"+groupdata.monthexpectmonry[0].plancountbfb+"%</div></div>";
    $(".content_left_div3").html(content_left_div)

    //股份公司kpi
    var content_right_div="";
    content_right_div+="<div class='' style='display:-webkit-box;-webkit-box-flex:1;'><div style='text-align: left;-webkit-box-flex:1;  padding-left: 10px;'>日现金流</div><div style='text-align: right;-webkit-box-flex:1;  padding-right: 10px;'>"+countmonry.datecountmoney[0].date+"</div></div>"+
    "<div style='text-align:center;-webkit-box-flex:1;font-size: 25px;'>"+countmonry.datecountmoney[0].dtmoney+"万元</div><div style='background:#eb7b29;display:-webkit-box;-webkit-box-flex:1;'><div style='-webkit-box-flex:1;text-align: center;color: #ffffff'>比上月日均：</div><div style='-webkit-box-flex:1;text-align: center;color: #ffffff'>"+countmonry.datecountmoney[0].tomonthdt+"万元</div><div style='-webkit-box-flex:1;text-align: center;color: #ffffff'>"+countmonry.datecountmoney[0].tomonthdtbfb+"%</div></div>"+
    "<div style='background:#72c74e;display:-webkit-box;-webkit-box-flex:1;'><div style='-webkit-box-flex:1;text-align: center;color: #ffffff'>比计划日均：</div><div style='-webkit-box-flex:1;text-align: center;color: #ffffff'>+"+countmonry.datecountmoney[0].plan+"万元</div><div style='-webkit-box-flex:1;text-align: center;color: #ffffff'>+"+countmonry.datecountmoney[0].planbfb+"%</div></div>";
    $(".content_right_div1").html(content_right_div)

    var content_right_div="";
    content_right_div+="<div class='' style='display:-webkit-box;-webkit-box-flex:1;'><div style='text-align: left;-webkit-box-flex:1;  padding-left: 10px;'>月累计现金流</div><div style='text-align: right;-webkit-box-flex:1;  padding-right: 10px;'>"+countmonry.monthcountmoney[0].date1+"-"+countmonry.monthcountmoney[0].date2+"</div></div>"+
    "<div style='text-align:center;-webkit-box-flex:1;font-size: 25px;'>"+countmonry.monthcountmoney[0].monthcapitamoney+"万元</div><div style='background:#eb7b29;display:-webkit-box;-webkit-box-flex:1;'><div style='-webkit-box-flex:1;text-align: center;color: #ffffff'>月累计环比：</div><div style='-webkit-box-flex:1;text-align: center;color: #ffffff'>"+countmonry.monthcountmoney[0].monthcahb+"万元</div><div style='-webkit-box-flex:1;text-align: center;color: #ffffff'>"+countmonry.monthcountmoney[0].monthcahbbfb+"%</div></div>"+
    "<div style='background:#72c74e;display:-webkit-box;-webkit-box-flex:1;'><div style='-webkit-box-flex:1;text-align: center;color: #ffffff'>比计划进度：</div><div style='-webkit-box-flex:1;text-align: center;color: #ffffff'>+"+countmonry.monthcountmoney[0].plancount+"万元</div><div style='-webkit-box-flex:1;text-align: center;color: #ffffff'>+"+countmonry.monthcountmoney[0].plancountbfb+"%</div></div>";
    $(".content_right_div2").html(content_right_div)

    var content_right_div="";
    content_right_div+="<div class='' style='display:-webkit-box;-webkit-box-flex:1;'><div style='text-align: left;-webkit-box-flex:1;  padding-left: 10px;'>月预计现金流</div><div style='text-align: right;-webkit-box-flex:1;  padding-right: 10px;'>"+countmonry.monthcountexpectmonry[0].date1+"</div></div>"+
    "<div style='text-align:center;-webkit-box-flex:1;font-size: 25px;'>"+countmonry.monthcountexpectmonry[0].monthcapitamoney+"万元</div><div style='background:#eb7b29;display:-webkit-box;-webkit-box-flex:1;'><div style='-webkit-box-flex:1;text-align: center;color: #ffffff'>月累计环比：</div><div style='-webkit-box-flex:1;text-align: center;color: #ffffff'>"+countmonry.monthcountexpectmonry[0].monthcahb+"万元</div><div style='-webkit-box-flex:1;text-align: center;color: #ffffff'>"+countmonry.monthcountexpectmonry[0].monthcahbbfb+"%</div></div>"+
    "<div style='background:#72c74e;display:-webkit-box;-webkit-box-flex:1;'><div style='-webkit-box-flex:1;text-align: center;color: #ffffff'>比计划进度：</div><div style='-webkit-box-flex:1;text-align: center;color: #ffffff'>+"+countmonry.monthcountexpectmonry[0].plancount+"万元</div><div style='-webkit-box-flex:1;text-align: center;color: #ffffff'>+"+countmonry.monthcountexpectmonry[0].plancountbfb+"%</div></div>";
    $(".content_right_div3").html(content_right_div)

}
var chartdata=null
function highchartdatamanager(groupchatdata){

    //var datagroup={
    //    topdata:[],
    //    buttomdata:[]
    //}
    //for(var i=0;i<groupchatdata.length;i++){
    //    if(groupchatdata[i]["公司类型"]=="资产公司"){
    //        datagroup.topdata.push(groupchatdata[i]);
    //    }else{
    //        datagroup.buttomdata.push(groupchatdata[i]);
    //    }
    //}
    var chartdata=null
    if(companypropety=="资产公司"){
        chartdata=groupchatdata.capitaldate;
    }else{
        chartdata=groupchatdata.stockdata
    }
    var chartgroupdata={
             companymoney:[],//企业现金流
             companyouyput:[],//主产品产量
             weightalarm:[] //高限负荷率
        }
    var groupkes=[];
    var omrygroup=[];
    var tempindex=-1;
    for(var i=0;i<chartdata.length;i++){
    if(chartdata[i]["公司类型"]==companypropety){
       if(chartdata[i]["日期"]>=startDate && chartdata[i]["日期"]<=endDate){
                tempindex=groupkes.indexOf(chartdata[i]["企业类型"]);
                if(tempindex>-1){
                    chartgroupdata.companymoney[tempindex].items[0]=parseInt(chartgroupdata.companymoney[tempindex].items[0])+parseInt(chartdata[i]["企业现金流"]);//.push([]);
                    chartgroupdata.companyouyput[tempindex].items[0]=parseInt(chartgroupdata.companyouyput[tempindex].items[0])+parseInt(chartdata[i]["产品产量"]);//.push([]);
                    chartgroupdata.weightalarm[tempindex].items[0]=parseInt(chartgroupdata.weightalarm[tempindex].items[0])*0.2+parseInt(chartdata[i]["高限负荷率"]);//.push([]);
                }else{
                    groupkes.push(chartdata[i]["企业类型"]);
                    chartgroupdata.companymoney.push({group:chartdata[i]["企业类型"],items:[parseInt(chartdata[i]["企业现金流"])]});
                    chartgroupdata.companyouyput.push({group:chartdata[i]["企业类型"],items:[parseInt(chartdata[i]["产品产量"])]});
                    chartgroupdata.weightalarm.push({group:chartdata[i]["企业类型"],items:[parseInt(chartdata[i]["高限负荷率"])]});
                }
            }
       }
      }

    var seriesdata=[{name:"企业现金流：万元",data:[],yAxis:1}];//,{name:"主产品产量：万吨",data:[],yAxis:1},{name:"高限负荷率：%",data:[],yAxis:2}];
    for(var i=0;i<chartgroupdata.companymoney.length;i++){
        if(chartgroupdata.companymoney[i].items[0]>0){
            seriesdata[0].data.push({x:i,y:chartgroupdata.companymoney[i].items[0],color:"#5fb23c"});
        }else{
            seriesdata[0].data.push({x:i,y:chartgroupdata.companymoney[i].items[0],color:"#eb7929"});
        }

    }
    var seriesdata2=[{name:"主产品产量：万吨",data:[],yAxis:1}]
    for(var i=0;i<chartgroupdata.companyouyput.length;i++){
        seriesdata2[0].data.push({x:i,y:chartgroupdata.companyouyput[i].items[0],color:"#0088cc"});
    }
    var seriesdata3=[{name:"高限负荷率：%",data:[],yAxis:1}]
    for(var i=0;i<chartgroupdata.weightalarm.length;i++){
        seriesdata3[0].data.push({x:i,y:chartgroupdata.weightalarm[i].items[0],color:"#ffc000"});
    }
    var seriescount1={data:seriesdata,xitems:["燕山", "上海", "海南", "江汉", "镇海", "天津", "石家庄", "洛阳", "茂名", "湖北化肥", "广州", "仪征", "金陵", "中原", "高桥", "扬子", "武汉乙烯","南化"]}
    var seriescount2={data:seriesdata2,xitems:["燕山", "上海", "海南", "江汉", "镇海", "天津", "石家庄", "洛阳", "茂名", "湖北化肥", "广州", "仪征", "金陵", "中原", "高桥", "扬子", "武汉乙烯","南化"]}
    var seriescount3={data:seriesdata3,xitems:["燕山", "上海", "海南", "江汉", "镇海", "天津", "石家庄", "洛阳", "茂名", "湖北化肥", "广州", "仪征", "金陵", "中原", "高桥", "扬子", "武汉乙烯","南化"]}
   // highchart(seriescount);
    groupchart(seriescount1,seriescount2,seriescount3)
  // chart(seriescount1,seriescount2,seriescount3)
   // }
}
function groupchart(serie1,serie2,serie3){
    var documentid=null;
    var title=null;
    var seriesdata=null;
    var xAxisdata=null;
    var enable=null;
        if(serie1.data[0].name=="企业现金流：万元"){
            documentid='container2';
            title=serie1.data[0].name
            seriesdata=serie1
            xAxisdata=serie1.xitems
            enable=true
            highchart(documentid,title,seriesdata,xAxisdata,enable)
        }
        if(serie2.data[0].name=="主产品产量：万吨"){
            documentid='containercenter';
            title=serie2.data[0].name
            seriesdata=serie2
            xAxisdata=serie2.xitems
            enable=false;
            highchart(documentid,title,seriesdata,xAxisdata,enable)
        }
        if(serie3.data[0].name=="高限负荷率：%"){
            documentid='containerleft';
            title=serie3.data[0].name
            seriesdata=serie3
            xAxisdata=serie3.xitems
            enable=false
            highchart(documentid,title,seriesdata,xAxisdata,enable)
        }
        var domwidth=$(".content_left_buttom").width();
        $(".chartcontent").css("width",domwidth);
        //highchart(documentid,title,seriesdata,xAxisdata)

}

function highchart(domid,tit,datasers,xaxisdata,enble){
    $("#"+domid).highcharts({
        chart: {
            type:'bar',
            marginTop:30
            //type: 'column'
        },
        title:{
            text:'',
            style: {
                color: '#FF00FF',
                fontWeight: 'bold'
            }
        },
        xAxis: {
            //enabled:false,
            categories:xaxisdata,
            //labels: {
            //    enabled: true,  //是否显示x轴刻度值
            //    labels: {
            //        formatter: function () {
            //            return this.value
            //        }
            //    }
            //},
            tickWidth:0,
            labels: {
                enabled:enble
            },
            title: {
                enabled: false
            }
        },
        yAxis: [{
            gridLineWidth:1,
            labels: {
                align: 'right',
                x: -5
            },
            linkedTo: 0,
            opposite:true,
            title: {
                offset: 10,
                text:tit//企业现金流
            }
        },{
            //min:0,
            lineColor:"#dcdcdc",
            lineWidth:1,
            tickColor:"#dcdcdc",
            tickWidth:1,
            tickLength:10,
            gridLineWidth:1,
            tickPosition:"inside",
            labels: {
                align: 'right',
                x: -5
            },
            //linkedTo: 1,
            opposite:false,
            title: {
            ///    offset: -250,
                text:""//企业现金流
            },
            //top: '0%',
            //height:'100%',
            lineWidth: 1
        }],
        legend: {
            enabled:false
            //layout: 'vertical',
            //align: 'right',
            //verticalAlign: 'top',
            //x: 35,
            //y:-9,
            //MinHeight:225,
            //itemStyle: {
            //    color: '#666666'
            //}
        },
        credits: {
            enabled: false
        },
        tooltip: {
            shared: true
        },
        plotOptions: {
            area: {
                stacking: 'normal',
                lineColor: '#666666',
                lineWidth: 1
                //marker: {
                //    lineWidth: 1,
                //    lineColor: '#666666'
                //}
            }
        },
        series:datasers.data
    });
   var chartwidth=$(".content_left_buttom").width()/3;

    $("#container2").css("width",chartwidth);
    $("#containercenter").css("width",chartwidth);
    $("#containerleft").css("width",chartwidth);
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