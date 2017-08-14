mui.init();
//初始化单页view
var viewApi = mui('#app').view({
    defaultPage: '#setting'
});
//初始化单页的区域滚动
mui('.mui-scroll-wrapper').scroll();
var view = viewApi.view;
(function($) {
    //处理view的后退与webview后退
    var oldBack = $.back;
    $.back = function() {
        if (viewApi.canBack()) { //如果view可以后退，则执行view的后退
            viewApi.back();
        } else { //执行webview后退
            oldBack();
        }
    };
})(mui);

//点击播放
var audio = $('audio')[0];
mui(".mui-table-view-chevron").on("tap","li",function(){
    $('a').css('text-decoration','none')
    change_music(this);
    play_music()
});
$('#play_pause').click(function (){
    play_music()
});
$('.pev').on('click',function(){
    change('pev')
});
$('.next').on('click',function(){
    change('next')
});
function change(ind){//上一首&&下一首
    var now_play=$('.now_play');
    if(now_play){
        var index=now_play.index();
        if (ind=='pev'){
             eq=parseInt(index-1)
        }else {
             eq=parseInt(index+1)
        }
        if ($('#icon').attr('class')=="mui-icon mui-icon-reload"){
            for (var i=0;i<$('.list').length;i++){
                eq = Math.ceil(Math.random()*i);
            }
        } else {
            eq > $('li').length - 1 && (eq = 0);
            eq < 0 && (eq = $('li').length - 1);
        }
        var li = $('.list:eq(' + eq+ ')');
        change_music(li[0]);
        changed()
    }
}
$('#icon').on('click',function(){
    mode(this)
})
//循环
function mode(_this){
    if ($(_this).attr('class')=="mui-icon mui-icon-bars"){
        $('#icon').removeClass()
        $(_this).addClass('mui-icon mui-icon-reload')
        $('i').text('随机播放')
    }else
    if ($(_this).attr('class')=="mui-icon mui-icon-reload"){
        $('#icon').removeClass()
        $(_this).addClass('mui-icon mui-icon-loop')
        $('audio').attr('loop','loop')
        $('i').text('单曲循环')
        }
    else
    if ($(_this).attr('class')=="mui-icon mui-icon-loop"){
        $('#icon').removeClass()
        $('audio').removeAttr('loop')
        $(_this).addClass('mui-icon mui-icon-bars')
        $('i').text('顺序播放')
        }


}

function pro(){//设置显示时间
    current = audio.currentTime;
    duration = audio.duration;
    bar(current/ duration);
    current_time = time_shift(current);
    duration_time = time_shift(duration);
    if (current_time == duration_time) {//歌曲播放完毕
        var index=$('.now_play').index();
        var eq=parseInt(index+1);
        if ($('#icon').attr('class')=="mui-icon mui-icon-reload"){
            for (var i=0;i<$('.list').length;i++){
                eq = Math.ceil(Math.random()*i);
            }
        } else {
            eq > $('li').length - 1 && (eq = 0);
            eq < 0 && (eq = $('li').length - 1);
        }
        var li = $('.list:eq(' + eq+ ')');
        change_music(li[0]);
        changed()
    }
    $('.bar span:first-child').text(current_time);
    $('.bar span:last-child').text(duration_time);
}


//切换
function changed(){
    duration_time='00:00'
    //切换歌曲
    var change_src=$('.now_play').attr('music')
    $('audio').attr('src',change_src);
    //切换字体
    var change_name=$('.now_play').find('a').find('p:eq(0)').text();
    var change_songer=$('.now_play').find('a').find('p:eq(1)').text();
    $('.music_name').text(change_name);
    $('.songer').find('span').text(change_songer);
    //切换图片
    var change_img=$('.now_play').attr('img');
    $('.cover')[0].style.background='url('+change_img+')';
    $('.cover').css('background-size','240px 240px');
    play_music()
}


/**
 * 设置进度条
 * @ratio   比例
 */
function bar(ratio) {
    var bar_in_width = parseInt($('.bar_out').width() * ratio-1);
    $('.bar_in').width(bar_in_width);
}


function play_music(){//播放音乐
    T = setInterval(pro, 1000);
    if (audio.paused && audio.src) {
        $('#play_pause').css('background', 'url(image/pause.png)');
        mode()
        setTimeout(function(){
            audio.play();
        },10);

        setTimeout(function () {
            $('.cover').css({'animation': 'change 25s linear infinite'});//头像转动
        }, 100);
        draw_bar()
    }
    else {
        clearInterval(T);
        $('#play_pause').css('background', 'url(image/play.png)');
        $('.cover').css({'AnimationPlayState': 'paused'});//暂停转动
        audio.pause();
        reset();
    }
}


//设置声音条
$('.voice_bar_out').on('touchstart',function (e){
    var voice_left=$('.voice_bar_out')[0].offsetLeft;
    var voice_width=$('.voice_bar_out').width();
    var width=(e.touches[0].clientX)-(voice_left);
    if(width>0&&width<199){
        $('.voice_bar_in').width(width);
        audio.volume=width/voice_width;
    }
    $(window).on('touchmove',function (e) {
        var x =e.touches[0].clientX -voice_left ;
        if(x>0&&x<199){
            $('.voice_bar_in').width(x);
            audio.volume = x/(voice_width);
        }
    })
    $(window).on('touchend',function () {
        $(this).unbind('touchmove');
        audio.muted=false
    })
})

//设置进度条
function draw_bar() {
    $('.bar_out').on('touchstart',function (e) {
        var music_width=(e.touches[0].clientX)-($('.bar_out')[0].offsetLeft);
        var rat =  music_width / $('.bar_out').width();//比例
        $('.bar_in').width( music_width);
        audio.currentTime = duration * rat;
        $(window).on('touchmove',function (e) {
            audio.muted=true;
            var xleft =e.touches[0].clientX;
            var width = $('.bar_out')[0].offsetLeft
            if(xleft >width && xleft < width + $('.bar_out').width()){
                var now_width = xleft - $('.bar_out')[0].offsetLeft;
                var ratio = now_width / $('.bar_out').width();//比例
                $('.bar_in').width(now_width);
                audio.currentTime = duration * ratio;
            }
        })
        $(window).on('touchend',function () {
            $(this).unbind('touchmove');
            audio.muted=false
        })
    });
}


//歌单点击时,切换歌曲
function change_music(_this){
    $('.list').removeClass('now_play');
    $(_this).addClass('now_play');
    //切换名字
    var name=$(_this).find('a').find('p:eq(0)').text();
    var songer=$(_this).find('a').find('p:eq(1)').text();
    $('.music_name').text(name);
    $('.songer').find('span').text(songer);
    //切换歌曲
    var music_src=$(_this ).attr('music');
    $('audio').attr('src',music_src);
    //切换图片
    var img_src=$(_this ).attr('img');
    $('.cover')[0].style.background='url('+img_src+')';
    $('.cover').attr('src',img_src)
    $('.cover').css('background-size','240px 240px')
    $('.cover').css({'animation': ''});
    //跳转页面时获取的路径和歌名，歌手
    se.set('name',name)
    se.set('songer',songer)
    lo.setItem('img',img_src)
}


/**
 * 重置拖拽
 */
function reset() {
    $('.bar_btn').unbind('touchstart');
    $(window).unbind('touchmove');
}

/**
 * 时间转换
 * @param time
 */
function time_shift(time) {
    var m = parseInt(time / 60) < 10 ? '0' + parseInt(time / 60) : parseInt(time / 60);
    var s = parseInt(time % 60) < 10 ? '0' + parseInt(time % 60) : parseInt(time % 60);
    var date = m + ':' + s;
    return date;
}


$('.mui-icon-home').click(function(){
    var home_src=$('audio').attr('src')
    se.set('src',home_src);
    var home_time = audio.currentTime;
    se.set('time',home_time);
    var home_name=$('.music_name').text();
    var home_songer=$('.songer').text();
    se.set('songer',home_songer)
    se.set('name',home_name)
})
//返回页面时
$(function(){
    var _src=se.get('src')
    $('audio').attr('src',_src);
    var _time=se.get('time');
    $('audio')[0].currentTime=_time
    var _img=lo.getItem('img')
    $('.cover')[0].style.background='url('+_img+')';
    $('.cover').css('background-size','240px 240px')
    var _name=se.get('name')
    var _songer=se.get('songer')
    $('.music_name').text(_name);
    $('.songer').find('span').text(_songer);
       play_music()
    se.rmItem('src');
    se.rmItem('time')
    se.rmItem('name')
    se.rmItem('songer')
})
