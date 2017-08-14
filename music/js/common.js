//自执行函数
(function(win,doc){
    /**
     * local_strong
     * @type {{setItem: Function, getItem: Function, rmItem: Function}}
     * session_strong.setItem(json,value)   设置localStorage     如果只有json {name:value}   两个参数   name,value
     * session_strong.getItem(name)         获取localStorage
     * session_strong.rmItem(name)          删除localStorage
     */
    var lo = {
        setItem:function(json,value) {
            if (value) {
                win.localStorage.setItem(json, value)
            } else {
                for (var i in json) {
                    win.localStorage.setItem(i, json[i]);
                }
            }
        },
        getItem:function(name) {
            return win.localStorage.getItem(name)
        },
        rmItem:function(name){
            name ? win.localStorage.removeItem(name) : win.localStorage.clear();
        }
    };

    /**
     * session_strong
     * @type {{setItem: Function, getItem: Function, rmItem: Function}}
     * session_strong.setItem(json,value)   设置sessionStorage     如果只有json {name:value}   两个参数   name,value
     * session_strong.getItem(name)         获取sessionStorage
     * session_strong.rmItem(name)          删除sessionStorage
     */
    var se = {
        set:function(json,value) {
            if (value) {
                win.sessionStorage.setItem(json, value)
            } else {
                for (var i in json) {
                    win.sessionStorage.setItem(i, json[i]);
                }
            }
        },
        get:function(name) {
            return win.sessionStorage.getItem(name)
        },
        rmItem:function(name){
            name ? win.sessionStorage.removeItem(name) : win.sessionStorage.clear();
        }
    };

    /**
     * cookie
     * @type {{set: Function, get: Function, remove: Function}}
     * cookie.set(json,val,time)    设置cookie    如果只有json {name:[value,time]}   三个参数  name,value,time
     * cookie.get(name)             获取cookie
     * cookie.remove(name)          删除cookie
     */
    var cookie = {
        set: function (json,value,time) {
            var date = new Date();
            if (value) {
                date.setTime(date.getTime() + 1000 * time);
                doc.cookie = json + '=' + escape(value) + ';expires=' + date.toGMTString();
            }else {
                for (var i in json) {
                    date.setTime(date.getTime() + 1000 * json[i][1]);
                    //cookie写入中文乱码使用escape()转码
                    doc.cookie = i + '=' + escape(json[i][0]) + ';expires=' + date.toGMTString();
                }
            }
        },
        get: function (name) {
            var co = doc.cookie.split('; ');
            var json = {};
           for(var i =0;i<co.length;i++){
               var s = co[i].split('=');
               //如果使用的是escape()转码 ，unescape()来进行解码
               json[s[0]] = unescape(s[1]);
           }
            return json[name];
        },
        remove: function (name) {
            this.set(name,'123',-1);
        }
    };
    win.cookie = cookie;
    win.se = se;
    win.lo= lo;
})(window,document);

