<template>
	<view>
		<!-- S logo图 -->
			<view class="top_less">
				<image 
					class="login_pig" 
					:src="imgUrl + 'logins/logo.png' ">
				</image>
			</view>
		<!-- E logo图 -->
		
		<!-- S 登陆按钮 -->
			<view class="low_less">
				<button  
					class="tui-btn1 login_btn"
					open-type="getUserInfo"
					type="primary" 
					size="small"  
					@getuserinfo="getUserinfo">
					<tui-icon 
						class="icon" 
						name="wechat" 
						:size='20' 
						color='rgba(255,255,255,1)' 
						style="margin-right: 10rpx;">
					</tui-icon>
					微信授权登录
				</button >
				<button  
					class="tui-btn2 login_btn" 
					type="primary" 
					size="small"  
					@tap = 'goTomoblieLogin' >
					<tui-icon 
						class="icon" 
						name="mobile" 
						:size='20' 
						color='rgba(44,218,216,1)' 
						style="margin-right: 10rpx;">
					</tui-icon>
					手机快捷登录
				</button >
				<button  
					class="tui-btn3 login_btn" 
					type="primary" 
					size="small" 
					@tap = 'goTopaswordLogin' >
					<tui-icon 
						class="icon" 
						name="pwd" 
						:size='20' 
						color='rgba(44,218,216,1)' 
						style="margin-right: 10rpx;">
					</tui-icon>
					账号密码登录
				</button >
			</view>
		<!-- E 登陆按钮 -->
	</view>
</template>

<script>
	import tuiIcon from "@/components/icon/icon"
	import {user, carts} from "@/api/index.js"
	export default {
		components: {
			tuiIcon,
		},
		data() {
			const imgUrl = this.$config.imgUrl;
			return {
				imgUrl : imgUrl,
			}
		},
		onShow(){
			
		},
		methods: {
			getUserinfo(res){
				console.log(res);
				if (res.detail.errMsg === 'getUserInfo:ok') {
					let encryptedData = res.detail.encryptedData;
					let iv = res.detail.iv;
					this.$store.commit('SET_USERINFO', res.detail.userInfo);
					let _this = this;
					// 小程序登录
					uni.login({
					  success(resLogin) {
					    console.log(resLogin);
						if (resLogin.errMsg === "login:ok") {
							_this.wechatLogin(resLogin.code,encryptedData,iv);
						}
					  }
					});
				}
			},
			wechatLogin(wxCode,encryptedData,iv){
				// 微信授权登录
				let set_data ={
					"weChatCode": wxCode,
					"encryptedData": encryptedData,
					"iv": iv
				}
				uni.showLoading({
				    title: '登录中..',
					mask: true
				});
				this.$http.post(user.wechatLogin,set_data).then(res=>{
					console.log(res);
					uni.hideLoading();
					if (res.code == 200) {
						uni.setStorageSync("token",res.data.token);
						uni.setStorageSync("userInfo", res.data.userInfo);
						uni.setStorageSync("tokenExpire",res.data.tokenExpire);
						this.$store.commit('SET_USERINFO', res.data.userInfo);
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
						// 返回
						uni.navigateBack({
						    delta: 1
						});
					}else if(res.code == 506){
						uni.navigateTo({
							url:'/pages/login/wxLogin'
						})
					}else{
						uni.showToast({
						    title: res.message,
							icon: 'none',
						    duration: 2000
						});
					}
				});
			},
			//路由跳转 手机登录
			goTomoblieLogin:function(){
				uni.navigateTo({
					url:'/pages/login/moblieLogin'
				})
			},
			//路由跳转  密码登录
			goTopaswordLogin:function(){
				uni.navigateTo({
					url:'/pages/login/passwordLogin'
				})
			}
		}
	}
</script>

<style  scoped lang="scss">
	@import '../../static/style/thorui.css';
	
	.login_btn{
		margin: 32rpx 48rpx;
		width: 654rpx;
		height: 96rpx;
		line-height: 96rpx;
	}
	.tui-btn1{
		background:rgba(16,187,184,1);
		border:1rpx solid rgba(16,187,184,1);
	}
	.tui-btn2{
		background:rgba(255,255,255,1);
		border-radius:6rpx;
		font-family:PingFang SC;
		color:rgba(16,187,184,1);
	}
	.tui-btn3{
		background:rgba(255,255,255,1);
		border-radius:6rpx;
		font-family:PingFang SC;
		color:rgba(16,187,184,1);
	}
	.top_less{
		text-align:center;
		.login_pig{
			width: 264rpx;
			height: 142rpx;
		}
	}
	
	.top_less{
		margin-top: 227rpx;
		margin-bottom: 140rpx;
	}
</style>
