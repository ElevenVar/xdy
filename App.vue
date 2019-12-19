<script>
import { iboss } from '@/api/index.js';
import { carts } from '@/api/index.js';
export default {
	onLaunch: function() {
		// 微信登录
		/*
		let _this = this;
		uni.login({
			success(loginRes) {
				_this.$store.commit('SET_WXCODE', loginRes.code);
			}
		});
		*/

		// 获取用户信息
		/**
			uni.getSetting({
				success: res => {
					if (res.authSetting['scope.userInfo']) {
						// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
						uni.getUserInfo({
							success: res => {
								// 可以将 res 发送给后台解码出 unionId
								//this.globalData.wxUserInfo = res.userInfo
								this.$store.commit('SET_USERINFO', res.userInfo);
								// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
								// 所以此处加入 callback 以防止这种情况
								if (this.userInfoReadyCallback) {
									this.userInfoReadyCallback(res);
								}
							}
						});
					}
				}
			});
		*/
		// 设置tab购物车数量+‘
		if(wx.getStorageSync('token')){
			this.$http.get(carts.get_cart_count).then(res => {
				if (res.code == 200) {
					if (res.data.cartCount > 0) {
						uni.setTabBarBadge({
							index: 2,
							text: String(res.data.cartCount)
						});
					}
				}
			});
		} else {
			
			uni.removeTabBarBadge({ index: 2 })
		}
	},
	onShow: function() {
		// 城市
		let city = uni.getStorageSync('currentCity');
		if (city == undefined || city == null || city == '' || JSON.stringify(city) == '{}') {
			uni.setStorageSync('currentCity', { id: 'C', name: '成都', code: 'COMPANY_CD' });
		}
		// 添加网关鉴权
		let requestParams = {
			mchMerchantSgin: this.$config.mchMerchantSgin,
			mchCoding: this.$config.mchCoding
		};
		
		this.$http.get(iboss.getAppToken, requestParams).then(res => {
			if (res.code == 200) {
				uni.setStorageSync('ibossAppToken', res.data);
			} else {
				console.log('获取ibossAppToken失败');
			}
		});
	},
	onHide: function() {}
};
</script>

<style>
/*每个页面公共css */
@import './common/app.css';
</style>
