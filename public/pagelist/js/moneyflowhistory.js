/**
 * Created by Mr_hu on 2015/6/15.
 */
$(document.body).ready(function(){
    InitControl();
    LoadData();
});
function InitControl(){
    $("#main").css("width","980px");
    $("#btnQuery").bind("click",function(ev){
        var strtext=$("#txtsearchtext").val();
        filterdata=DataFiltermanager(alldata,strtext);
        table(filterdata);
    })
    $("#print").bind('click',function(ev){
        btnPrintClick();
    })

}

var alldata=null;
var filterdata=null;
function LoadData(){
   // d3.csv("../data/moneyflowhistory.csv",function(csv){
      //  console.log(JSON.stringify(csv))
    var csv=moneyflowhistory
        alldata=csv;
        filterdata=alldata;
        table(filterdata);
   // })
}

function table(filterdata){
    var dimensions = new Filter();
    var highlighter = new Selector();
    dimensions.set({data: filterdata });
    var columns = _(filterdata[0]).keys();
    var slicky = new grid({
        model: dimensions,
        selector: highlighter,
        width: 980,
        columns: columns
    });
    slicky.update();
    $('#myGrid').resizable({
        handles: 's'
    });
    $('#export_selected').click(function() {
        var data = dimensions.get('filtered');
        var topnumber=5000;
        if(data.length>topnumber){
            data.splice(topnumber,(data.length-topnumber));
        }
        var keys = _.keys(data[0]);
        var csv = _(keys).map(function(d) { return '"' + addslashes(d) + '"'; }).join(",");
        _(data).each(function(row) {
            csv += "\n";
            csv += _(keys).map(function(k) {
                var val = row[k];
                if (_.isString(val)) {
                    return '"' + addslashes(val) + '"';
                }
                if (_.isNumber(val)) {
                    return val;
                }
                if (_.isNull(val)) {
                    return "";
                }
            }).join(",");
        });
        var uriContent = "data:application/octet-stream," + encodeURIComponent(csv);
        var myWindow = window.open(uriContent, "Nutrient CSV"+".txt");
        myWindow.focus();
        return false;
    });
    $("#myGrid").css("height","500px")
    $(".slick-viewport").css("height","500")
    $(".slick-header").find("div").css("background","#d3d7d4")
    function addslashes( str ) {
        return (str+'')
            .replace(/\"/g, "\"\"")        // escape double quotes
            .replace(/\0/g, "\\0");        // replace nulls with 0
    };
}

function DataFiltermanager(data,_text){
    var tempdata=[];
    for(var i=0;i<data.length;i++){
        for(var item in data[i]){
            if(data[i][item]!=null && (data[i][item]+"").indexOf(_text)>-1){
                tempdata.push(data[i]);
                break;
            }
        }
    }
    return tempdata;
}

function btnPrintClick(){
    window.print();
}