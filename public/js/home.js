$(document.body).ready(function(ev){
    var divStr = "";
    for (var i = 0; i < pageConfig.length; i++) {
        divStr+='<div class="img1"><div><a href="'+pageConfig[i].url+'?q='+i+'">' +
        '<img src="'+pageConfig[i].img+'" width="228px" height="180px" data-cname="'+pageConfig[i].name+'"></a></div>' +
        ' <div class="titlename"><span class="zt2">'+pageConfig[i].name+'</span> </div> </div>'
    }
    $('#itemlist1').html(divStr);
    $('#itemlist1').find(".img1>div>a>img").mouseover(function(ev){
        var _pageconfig=null;
        var thisimgname=$(this).data("cname");
        for(var i=0;i<pageConfig.length;i++){
            if(pageConfig[i].name==thisimgname){
                _pageconfig=pageConfig[i];
                break;
            }
        }
        if(_pageconfig!=null){
            $(this).attr("src",_pageconfig.hoverimg);
        }
    }).mouseout(function(ev){
        var _pageconfig=null;
        var thisimgname=$(this).data("cname");
        for(var i=0;i<pageConfig.length;i++){
            if(pageConfig[i].name==thisimgname){
                _pageconfig=pageConfig[i];
                break;
            }
        }
        if(_pageconfig!=null){
            $(this).attr("src",_pageconfig.img);
        }
    })
})
