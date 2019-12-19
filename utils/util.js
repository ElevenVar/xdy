const MD5 = require('./MD5.js');
const api = require('../api/index.js');
import Configs from "../config/index.js";
// 上传图片
/*
    url: 图片的本地路径
    type: 附件自定义类型	例如 pattern、 member_header
    fileId： 确定附件唯一性的ID	一般传userInfo里的ID
*/
// let appToken = uni.getStorageSync("ibossAppToken")
const uploadImage = (url, type, fileId, callBack) => {
    let city = uni.getStorageSync('currentCity');
    let token = uni.getStorageSync("token");
    let appToken = uni.getStorageSync("ibossAppToken");
    uni.uploadFile({
        url: api.user.uploadImg,
        filePath: url,
        name: 'file',
        header: {
            "X-App-Coding": Configs.mchCoding,
            "X-App-Token": appToken,
            "Content-Type": "application/x-www-form-urlencoded",
            "X-IBoss-Token": token,
            "X-Auth-Token": `WECHAT:${token ? token : ''}`,
            "X-Req-Date": getNetworkRequestDate()
        },
        formData: {
            'type': type,
            'fileId': fileId,
            'isDeleteOriginalFile': 'false',

        },
        success(res) {
            let item = JSON.parse(res.data);
            return typeof callBack == "function" && callBack(item);
        },
        fail(res) {
            return typeof callBack == "function" && callBack(false);
        }
    });
}

const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatDate(time) {
    let date = new Date(time)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    // const hour = date.getHours()
    // const minute = date.getMinutes()
    // const second = date.getSeconds()
    return [year, month, day].map(formatNumber).join('-')
}
// 时间戳转换日期
function transformTime(timestamp) {
    //console.log(timestamp);
    if (timestamp.toString().length <= 13) {
        let date = new Date(timestamp * 1)
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        const hour = date.getHours()
        const minute = date.getMinutes()
        const second = date.getSeconds()
        return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
    } else {
        return timestamp;
    }
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

//手机号码隐藏显示
const numberSuitScanf = (phoneNumber) => {
    var numberString = '暂无';
    if (phoneNumber == null) {
        return numberString;
    } else {
        if (phoneNumber.length == 11) {
            var replaceStr = phoneNumber.substr(3, 4);
            numberString = phoneNumber.replace(replaceStr, '****');
        } else {
            var halfLength = phoneNumber.length / 2;
            if (halfLength < 4) {
                var replaceStr = phoneNumber.substr(phoneNumber.length - halfLength, halfLength);
                numberString = phoneNumber.replace(replaceStr, '****');
            } else {
                var replaceStr = phoneNumber.substr(phoneNumber.length - 4, 4);
                numberString = phoneNumber.replace(replaceStr, '****');
            }
        }
        return numberString;
    }
};

/**
 * 检查用户登录信息，token是否过期等
 */
const checkUserIsLogin = () => {
    return new Promise((resolve, reject) => {
        var localUserInfo = uni.getStorageSync("token");
        if (localUserInfo) {
            var tokenExpire = uni.getStorageSync("tokenExpire");
            var timestamp = parseFloat(tokenExpire);
            var expireDate = new Date(timestamp);
            var nowDate = new Date();
            if (nowDate >= expireDate) {
                let response = {
                    code: 1,
                    msg: '您登录已过期，请重新登录！',
                    data: localUserInfo
                };
                resolve(response);
            } else {
                let response = {
                    code: 200,
                    msg: "您已登录，且token有效！",
                    data: localUserInfo
                }
                resolve(response);
            }
        } else {
            let response = {
                code: -1,
                msg: "您没有登录，请先登录！",
                data: null
            }
            resolve(response);
        }
    });
};

/**
 * 时间戳转换成时间函数 
 */
const formatDateTime = (inputTime) => {
    var date = new Date(inputTime);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
};

/**
 * 获取用于网络请求验证的时间
 */
const getNetworkRequestDate = () => {
    var date = new Date();
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '' + m + '' + d + 'T' + h + '' + minute + '' + second + 'D';
};

/**
 *  获取微信登录Code
 */
const getWeChatTempLoginCode = () => {
    return new Promise((resolve, reject) => {
        uni.login({
            success: res => {
                resolve(res)
            },
            fail: error => {
                reject(err)
            }
        });
    })
}

/**
 *  拨打电话接口
 */
const callPhoneAction = (phone) => {
    return new Promise((resolve, reject) => {
        uni.makePhoneCall({
            phoneNumber: phone,
            success(res) {
                resolve(res)
            },
            fail(err) {
                reject(err)
            }
        })
    })
}

/**
 * 预览pdf
 */
const previewFdf = (url) => {
    return new Promise((resolve, reject) => {
        uni.downloadFile({
            url: url,
            success: function(res) {
                var Path = res.tempFilePath //返回的文件临时地址，用于后面打开本地预览所用
                uni.openDocument({
                    filePath: Path,
                    fileType: "pdf",
                    success: function(res) {
                        resolve(res)
                    }
                })
            },
            fail: function(res) {
                reject(res)
            }
        })
    })
}
// 活动详情倒计时
function handleActivityDetialCountDownDate(endDate) {

    var time = new Date().getTime();
    var endTime = new Date(endDate).getTime();

    var tamp = (endTime - time) / 1000;
    return tamp;
}

function handleTamp(tamp) {

    var day = getTime(Math.floor(tamp / (60 * 60 * 24)));
    var hour = getTime(Math.floor(tamp / 3600 % 24));
    var minute = getTime(Math.floor(tamp / 60) % 60);
    var second = getTime(Math.floor(tamp) % 60);
    var result = {
        day,
        hour,
        minute,
        second
    };
    return result;
}

function getTime(time) {
    if (time * 1 <= 9) {
        return "0" + time
    } else {
        return "" + time
    }
}

function timestampConvertDate(obj) {
    var date = new Date(obj);
    var y = 1900 + date.getYear();
    var m = "0" + (date.getMonth() + 1);
    var d = "0" + date.getDate();
    return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
}
// 判断空对象
function isEmptyObject(e) {
    var t;
    for (t in e)
        return !1;
    return !0
}
// 深拷贝对象
function deepCopyobject(a) {

    var c = {};

    c = JSON.parse(JSON.stringify(a));

    return c;

}

/**
 * Map转JSON
 * **/
const mapToJson = (map) => {
    return JSON.stringify(strMapToObj(map));
}

/**
 * Map转Object
 * **/
const strMapToObj = (strMap) => {
    let obj = Object.create(null);
    for (let [k, v] of strMap) {
        obj[k] = v;
    }
    return obj;
}

/**
 * 处理请求参数，拼接成字符串
 */
const handleRequestWithParams = (params) => {
    var resultStr = '';
    var newkey = Object.keys(params).sort();
    var newObj = {};
    for (var i = 0; i < newkey.length; i++) {
        newObj[newkey[i]] = params[newkey[i]];
    }
    for (var key in newObj) {
        let value = newObj[key];

        if (value != undefined && value != null && value != '') {
            resultStr = resultStr + key + '=' + newObj[key] + '&';
        }
    }
    resultStr = resultStr.substr(0, resultStr.length - 1);

    return resultStr;
}

/**
 * 计算MD5值
 */
const dggMD5WithString = (str, isUpperCase) => {
    if (isUpperCase == true) {
        return MD5.hexMD5(str).toUpperCase();
    } else {
        return MD5.hexMD5(str);
    }
}

/**
 * 查询图片
 */
const regFenToYuan = (fen) => {
    var num = fen;
    num = fen * 0.01;
    num += '';
    var reg = num.indexOf('.') > -1 ? /(\d{1,3})(?=(?:\d{3})+\.)/g : /(\d{1,3})(?=(?:\d{3})+$)/g;
    num = num.replace(reg, '$1');
    return num
};

module.exports = {
    formatTime,
    numberSuitScanf,
    checkUserIsLogin,
    getWeChatTempLoginCode,
    callPhoneAction,
    previewFdf,
    handleActivityDetialCountDownDate,
    handleTamp,
    timestampConvertDate,
    mapToJson,
    strMapToObj,
    getNetworkRequestDate,
    handleRequestWithParams,
    dggMD5WithString,
    isEmptyObject,
    deepCopyobject,
    formatDate,
    transformTime,
    regFenToYuan,
    uploadImage
}
