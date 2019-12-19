import Http from './http';
import Configs from "../config/index.js";
import util from '../utils/util.js';

const http = new Http();
http.config.baseURL = Configs.baseURL;
http.config.debug = false;

const signKey = 'MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBAIbrYimFf4jqsaOHgpAV24xHFaHgmcrzsraYOBueL58Lpo5CKUUwAPpMnb4TKYmBV0ol+eJgiDLiAtDM8UMdjxTS776FYliIOYW2JdX1Fz0gAIwINXWlHhB/u01xZnls9rpKEH1up7+VgRMBe/cAsrufLaiTfJzBXNZdkw5sGCXDAgMBAAECgYAIGdQACDr7HpRh7D4DprxS9OWwnYq+a9l8KzGbPuk/FHUAr6pItDQq0zTZd88TqYdzNUqGtCMZYwamQNfvnrO7hpiJvUNtsDhuEgIvT4unEiaxAPBu8kr3jPIzGKlEo7gY+ot3Js5MxMhsAsUQmnidRVqRMGeWLca4XGk8ond4QQJBAOKl0uGdFw9aID5wbcwWa9CqNYXJwyRFv0dQh9u4c1+VU28NgFJTo2TcrPzwvaCJF3WLn+9a/wBeR0soxBJLfCMCQQCYZHEmZPlpYZ81uVrGo52aKyFAbJ2SnHmPvXTsP0bZnLBDZkklFPefW2rzGoVT2knM3zedP/XArPfe2dxLFvnhAkBlFw9DIBz79PfywZTHdayrCnAK9135nL5fIZUnNFMJbAIlw0Db94AmaaMiwoHhy6PSAu/YA58/W82ywUEK4+4/AkAr8Xq3SZKqEp5oTYShlviRRjKWczuU1U4wZr9aiHyTr50cMliROtSUvTW/2DvuDBoP26Yb0B+7aaUoO8ZMWNnBAkBXvhh98nRW7/0YPSoTKvXKb8oCQT/6X5k2uGTRZDW6CkNGrz5aS1FBZzQtN/PokIkuWxssD6ihzz9MATvAdA7W';


/**
   * 获取授权 Authorization
   * @param {data} 请求参数
   * @param {requestDate} 获取当前时间
   * @param {signKey} 签名key
   */
function getAuthorization (data, requestDate,signKey) {
	let handleData = util.deepCopyobject(data);
	let keyData = {
		key: signKey
	};
	let keyParamStr = util.handleRequestWithParams(keyData);
	let handleParamStr = util.handleRequestWithParams(handleData);
	handleParamStr = handleParamStr + '&' + keyParamStr;
	let md5Str = util.dggMD5WithString(handleParamStr, true);
	return md5Str;
}

// 请求拦截器
http.interceptor.request = config => {
	// console.log(config)
	if (config.method === 'POST' && config.header['Content-Type'] !== 'application/json') {
		config.header['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
	}
	
	let city = uni.getStorageSync('currentCity');
	let token = uni.getStorageSync("token");
	let appToken = uni.getStorageSync("ibossAppToken");
	
	// 获取当前时间
	const getNetworkRequestDate = util.getNetworkRequestDate();
	
	config.header["Authorization"] = getAuthorization(config.data, getNetworkRequestDate);
	config.header["X-IBoss-Token"] = token ? token : ''; // 第一版 使用 token
	config.header["X-Auth-Token"] = `WECHAT:${token ? token : ''}`; // 第二版 使用 token
	config.header["X-Req-Date"] = getNetworkRequestDate;
	config.header["X-App-Coding"] = Configs.mchCoding;
	config.header["X-App-Token"] = appToken;
	config.header["X-Req-Area"] = city.code;
	
    return config;
}
// 响应拦截器
http.interceptor.response = response => {
	let result = response.data;
	if(result.code == 5223 || result.code == 501){ // 登录过期拦截
		uni.removeStorageSync('token')
		setTimeout(() => {
			uni.navigateTo({
				url: '/pages/login/login'
			})
		}, 100);
		return result;
	}
	return result;
}

export default http;

