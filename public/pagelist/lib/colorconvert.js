/**
 * Created by wanli on 2015/4/28.
 */
//十六进制颜色值域RGB格式颜色值之间的相互转换

var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
/*RGB颜色转换为16进制*/
String.prototype.colorHex = function(){
    var that = this;
    if(/^(rgb|RGB)/.test(that)){
        var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g,"").split(",");
        var strHex = "#";
        for(var i=0; i<aColor.length; i++){
            var hex = Number(aColor[i]).toString(16);
            if(hex === "0"){
                hex += hex;
            }
            strHex += hex;
        }
        if(strHex.length !== 7){
            strHex = that;
        }
        return strHex;
    }else if(reg.test(that)){
        var aNum = that.replace(/#/,"").split("");
        if(aNum.length === 6){
            return that;
        }else if(aNum.length === 3){
            var numHex = "#";
            for(var i=0; i<aNum.length; i+=1){
                numHex += (aNum[i]+aNum[i]);
            }
            return numHex;
        }
    }else{
        return that;
    }
};

/*16进制颜色转为RGB格式*/
String.prototype.colorRgb = function(){
    var sColor = this.toLowerCase();
    if(sColor && reg.test(sColor)){
        if(sColor.length === 4){
            var sColorNew = "#";
            for(var i=1; i<4; i+=1){
                sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));
            }
            sColor = sColorNew;
        }
        //处理六位的颜色值
        var sColorChange = [];
        for(var i=1; i<7; i+=2){
            sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));
        }
        return "RGB(" + sColorChange.join(",") + ")";
    }else{
        return sColor;
    }
};

function colorConversion(code){
    var len=code.length;
    var f=new Array();
    f['0']=0;
    f['1']=1;
    f['2']=2;
    f['3']=3;
    f['4']=4;
    f['5']=5;
    f['6']=6;
    f['7']=7;
    f['8']=8;
    f['9']=9;
    f['A']=10;
    f['B']=11;
    f['C']=12;
    f['D']=13;
    f['E']=14;
    f['F']=15;
    code=code.toLocaleUpperCase();//转换为大写
    var s=code.substr(0,1);
    if(s=='#'){
        code=code.substr(1,6);
    }
    var r=f[code[0]]*16+f[code[1]];
    var g=f[code[2]]*16+f[code[3]];
    var b=f[code[4]]*16+f[code[5]];
    return [r,g,b];
}


/* 获取两个颜色值之间的渐变色
 参数：
 thisRGB：当前背景颜色的6位代码
 toRGB：目标背景颜色的6位代码
 _value1：数值1
 _valu2：数值2
 */
function colorGradient(thisRGB,toRGB,_value1,_valu2){
    var _thisRGB=colorConversion(thisRGB); //16进制转换10进制
    var _toRGB=colorConversion(toRGB);

    var _step=20;
    var _R_step=parseInt(Math.abs(_thisRGB[0]-_toRGB[0])/_step);
    var _G_step=parseInt(Math.abs(_thisRGB[1]-_toRGB[1])/_step);
    var _B_step=parseInt(Math.abs(_thisRGB[2]-_toRGB[2])/_step);

    var s=parseInt(_value1/((_value1+_valu2)/20));
    var r=_step==1?_toRGB[0]:(_thisRGB[0]>_toRGB[0]?_thisRGB[0]-_R_step*s:_thisRGB[0]+_R_step*s);
    var g=_step==1?_toRGB[1]:(_thisRGB[1]>_toRGB[1]?_thisRGB[1]-_G_step*s:_thisRGB[1]+_G_step*s);
    var b=_step==1?_toRGB[2]:(_thisRGB[2]>_toRGB[2]?_thisRGB[2]-_B_step*s:_thisRGB[2]+_B_step*s);

    return 'rgb('+r+','+g+','+b+')';
}