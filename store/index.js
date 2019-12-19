import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
import app from './module/app';
import user from './module/user';
import mine from './module/mine';
export default new Vuex.Store({
    state: {
        serverTel: '4000-962540', // 服务电话
        // 城市选择数据
        cityData: {
            cityName: '成都',
            code: 'COMPANY_CD'
        },
        // 默认图片地址
        altImg: 'https://dgg-xiaodingyun.oss-cn-beijing.aliyuncs.com/xdy-xcx/index/ailImg.png',
		webViewUrl: ''
    },
    mutations: {
        'SETCITY'(state,val){
			state.cityData = val
		},
		SET_WEB_VIEW_URL(state,val){
			state.webViewUrl = val
		},
    },
    actions: {
  
    },
    modules: {
      app,
      user,
      mine
    }
  })
  