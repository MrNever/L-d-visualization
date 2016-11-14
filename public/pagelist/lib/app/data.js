
/**
 *
 * DATA SOURCE:  http://www.census.gov/foreign-trade/statistics/country/
 *
 */

function fetchData() {
   // d3.csv("../data/ustrade_2000-2013.csv", function(csv) {
    var csv=ustrad_2000_2013;
        var normalized=[];

        for (var i=0; i < csv.length; i++)  {
            var row=csv[i];

            //for (var y=1; y < 13; y++) {
            //    if (row.CTY_CODE < "1000") continue;  //Remove Aggregated Continent Data
            //    var newRow={};
            //    newRow.Year=row.year;
            //    newRow.Country=row.CTYNAME;
            //    newRow.Month=(y < 10) ? "0" + String(y) : String(y);
            //    newRow.Imports=Number(row["I_" + String(y)]);
            //    newRow.Exports=Number(row["E_" + String(y)]);
            //    normalized.push(newRow);
            //
            //}
            for (var y=1; y <16; y++) {
                if (row.CTY_CODE < "1000") continue;  //Remove Aggregated Continent Data
                var newRow={};
                newRow.Year=row.IDATE;
                newRow.Country=row.TAG;
                if(y<10){
                    newRow.Month=(y <10) ? "0"+String(y) : String(y);
                }else{
                    newRow.Month=(y <16) ? String(y) : String(y);
                }
                newRow.Imports=Number(row.TVALUE);
                newRow.Exports=Number(row.NVALUE);
                normalized.push(newRow);
            }
        }

        countriesGrouped = d3.nest()
            .key(function(d) { return d.Year; })
            .key(function(d) { return d.Month; })
            .entries(normalized);

        //Sum total deficit for each month
        var totalImport=0;
        var totalExport=0;

        for (var y=0; y < countriesGrouped.length; y++) {
            var yearGroup=countriesGrouped[y];
            for (var m=0; m < yearGroup.values.length; m++) {
                var monthGroup=yearGroup.values[m];
                for (var c=0; c < monthGroup.values.length; c++) {
                    var country=monthGroup.values[c];
                    totalImport= Number(totalImport) + Number(country.Imports);
                    totalExport=Number(totalExport) + Number(country.Exports);
                }
                //    console.log("totalExport=" + String(totalExport));
                monthlyExports.push(totalExport);
                monthlyImports.push(totalImport);
            }

        }

        //Start running
        run();
        //refreshIntervalId = setInterval(run, delay);
        // run();

  //  });
    ShowTags();
}
function ShowTags(){
    var strHTML="";
   // var tags=["BA105","BA106","BA107","BA108","BA109","BA110","BA111","BA112","BA113","BA114","BA115"];
    var tags=["BA105裂解炉","BA106裂解炉","BA107裂解炉","BA108裂解炉","BA109裂解炉","BA110裂解炉","BA111裂解炉","BA112裂解炉","BA113裂解炉","BA114裂解炉","BA115裂解炉","BA1101裂解炉","BA1102裂解炉","BA1103裂解炉","BA1104裂解炉"];
    for(var i=0;i<tags.length;i++){
        strHTML+="<div class='tagitem'>"+tags[i]+"裂解炉</div>";
    }
    strHTML="<div class='taglist'>"+strHTML+"</div>";
    $("#rightPanelDiv").html(strHTML);
}