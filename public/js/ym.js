$(function () {
    function getUrlPage(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    }
    //读取导航数据
    var ulStr = $("<ul id='navList'></ul>");
    var liStr = "";
    var index = getUrlPage('q')
    for (var i = 0; i < pageConfig[index].pageList.length; i++) {
        if (i == 0) {
            liStr = "<li><a  target='mainframe' href='" + pageConfig[index].pageList[i].url + "' class='active'>" + pageConfig[index].pageList[i].name + "</a></li>"
        } else {
            liStr += "<li><a  target='mainframe' href='" + pageConfig[index].pageList[i].url + "' class=''>" + pageConfig[index].pageList[i].name + "</a></li>"
        }
    }
    $('.title').html("<div class='classname'>"+pageConfig[index].name+"</div><div class='home'><a href='../index.html'><img src='../images/HomeIco.png'></a></div>");

    $('#main').html('<iframe name="mainframe" style="width: 100%;height:100%;padding:0px;margin: 0px;"  src="'+pageConfig[index].pageList[0].url+'" frameborder="0" scrolling="no"></iframe>');
    $('#navList').html(liStr);
    //navi导航切换
    $('#navList').find('li a').click(function () {
        $('#navList').find('li a').removeClass('active');
        $(this).addClass("active");
    });

})