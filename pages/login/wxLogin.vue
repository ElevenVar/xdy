<template>
	<view>
		<!-- S logo图 -->
			<view class="top_less">
				<image 
					class="login_pig" 
					:src="imgUrl + 'logins/logo.png' ">
				</image>
			</view>
		<!-- S logo图 -->
		<!-- S 表单提交 -->
			<view class="input_less">
				<view class="input_item">
					<tui-icon 
						class="icon" 
						name="mobile" 
						:size='20' 
						color='rgba(44,218,216,1)' 
						style="margin-right: 10rpx;">
					</tui-icon>
					<input 
						class="inpu_fass" 
						type="number" 
						maxlength="11"
						placeholder="请输入手机号"
						placeholder-style="color: #B8B8B8;"
						v-model="from.mobile">
					</input>
				</view>
				<view class="input_item">
					<tui-icon
						class="icon" 
						name="shield" 
						:size='20' 
						color='rgba(44,218,216,1)' 
						style="margin-right: 10rpx;">
					</tui-icon>
					<input 
						class="inpu_fass" 
						placeholder="请输入短信验证码" 
						placeholder-style="color: #B8B8B8;"
						type="number"
						maxlength="6"
						v-model="from.code"/>
					<button  
						class="send_button" 
						type="primary" 
						size="small" 
						:disabled="countFlag"
						@tap="sendMsg()">
						{{btnMsg == null ? '重新发送'+ countNum+'s' : btnMsg}}
					</button >
				</view>
			</view>
		<!-- E 表单提交 -->
		<!-- S 登陆主页 -->
			<view class="btn">
				<button
					class="login_btn" 
					type="primary" 
					size="small" 
					@tap="loginTap">
					绑定手机号
				</button >
			</view>
		<!-- E 登陆主页 -->
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
				from:{
					mobile: '',
					code: '',
					nickName: '',
					avatarUrl: '',
					sex: '',
					age: '',
					weChatCode: '',
					encryptedData: '',
					iv: ''
				},
				countNum: 60,// 倒计时周期
				countFlag: false,// 用于倒计时标记，true-正在倒计时
				intervalBtn:{},// 定时器
				btnMsg:"获取验证码",//默认按钮的值
			}
		},
		methods: {
			loginTap(){
				if (!this.from.mobile) {
					uni.showToast({
					    title: '请输入手机号！',
						icon: 'none',
					    duration: 2000
					});
					return;
				}
				if (!(/^1[23456789]\d{9}$/.test(this.from.mobile))){
					uni.showToast({
					    title: '手机号有误！',
						icon: 'none',
					    duration: 2000
					});
					return;
				}
				if (!this.from.code){
					uni.showToast({
					    title: '请输入验证码！',
						icon: 'none',
					    duration: 2000
					});
					return;
				}
				let _this = this;
				uni.getUserInfo({
					success: res =>{
						if(res.errMsg === 'getUserInfo:ok'){
							_this.from.encryptedData = res.encryptedData;
							_this.from.iv = res.iv;
							_this.from.nickName = res.userInfo.nickName;
							_this.from.avatarUrl = res.userInfo.avatarUrl;
							_this.from.sex = res.userInfo.gender;
							_this.$store.commit('SET_USERINFO', res.userInfo);
							
							// 小程序登录
							uni.login({
							  success(resLogin) {
								if (resLogin.errMsg === "login:ok") {
									_this.from.weChatCode = resLogin.code;
									_this.wechatRegister();
								}
							  }
							});
						}
					}
				});
			},
			wechatRegister(){
				// 微信 + 手机号 注册
				uni.showLoading({
				    title: '绑定中..',
					mask: true
				});
				this.$http.post(user.wechatRegister,this.from).then(res=>{
					uni.hideLoading();
					if (res.code == 200) {
						uni.setStorageSync("token",res.data.token);
						uni.setStorageSync("userInfo", res.data.userInfo);
						uni.setStorageSync("tokenExpire",res.data.tokenExpire);
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
						// 返回
						if(this.$store.state.xdyParams.xdyUrl){
							console.log(`${this.$store.state.xdyParams.xdyUrl}?token=${res.data.token}&platform=xdy&memberId=${res.data.userInfo.id}`)
							this.$store.commit('SET_WEB_VIEW_URL', `${this.$store.state.xdyParams.xdyUrl}?token=${res.data.token}&platform=xdy&memberId=${res.data.userInfo.id}`);
							uni.navigateTo({
								url: '/pages/webView/webView'
							});
						} else {
							uni.navigateBack({
							    delta: 2
							});
						}
					}else{
						uni.showToast({
						    title: res.message,
							icon: 'none',
						    duration: 2000
						});
					}
				});
			},
			countDown(){
				// 设置btn倒计时时显示的信息
				this.btnMsg = null;
				// 更改btn状态
				this.countFlag =! this.countFlag;
				// 设置倒计时
				this.intervalBtn = setInterval(() => {
					if(this.countNum <= 0) {
						// 重置btn提示信息
						this.btnMsg = "获取验证码";
						// 清除定时器
						clearInterval(this.intervalBtn)
						// 更改btn状态
						this.countFlag =! this.countFlag;
						// 重置倒计时状态
						this.countNum = 60;
					};
					// 倒计时
					this.countNum -- ;
				}, 1000);
			},
			sendMsg(){
				if (!this.from.mobile) {
					uni.showToast({
					    title: '请输入手机号！',
						icon: 'none',
					    duration: 2000
					});
					return;
				}
				if (!(/^1[23456789]\d{9}$/.test(this.from.mobile))){
					uni.showToast({
					    title: '手机号有误！',
						icon: 'none',
					    duration: 2000
					});
					return;
				}
				let set_data = {
					mobile: this.from.mobile,
					smsType: 'SMS_REGISTER_WECHAT'
				}
				uni.showLoading({
				    title: '发送中..',
					mask: true
				});
				this.$http.get(user.sendSms,set_data).then(res=>{
					uni.hideLoading();
					if (res.code == 200) {
						uni.showToast({
						    title: '发送成功',
						    duration: 2000
						});
						this.countDown();
					} else{
						uni.showToast({
						    title: res.message,
							icon: 'none',
						    duration: 2000
						});
					}
				})
			}
		}
	}
</script>

<style  scoped lang="scss">
	@import '../../static/style/thorui.css';
	.top_less{
		margin-top: 107rpx;
		margin-bottom: 80rpx;
	}
	.top_less{
		text-align:center;
		.login_pig{
			width: 264rpx;
			height: 142rpx;
		}
	}
	.input_less{
		margin: 0 32rpx;
		height:241rpx;
		background:rgba(255,255,255,1);
		border-radius:4px;
		padding: 0 32rpx;
	}
	.btn{
		
	}
	.login_btn{
		margin: 48rpx 32rpx;
		width: 686rpx;
		height: 96rpx;
		background: rgba(16,187,184,1);;
	}
	.input_item{
		height: 120rpx;
		clear: both;
		border-bottom: 1px solid #D7D8D9;
		&:last-child{
			border-bottom: none;
			position: relative;
		}
	}
	
	.inpu_fass{
		height: 120rpx;
		float: left;
		
	}
	.icon{
		margin-top: 39rpx;
		float: left;
		display: block;
	}
	.send_button{
		position: absolute;
		top:36rpx;
		right: 20rpx;
		display: inline-block;
		padding: 0 20rpx;
		height:58rpx;
		background:rgba(16,187,184,1);
		border-radius: 8rpx;
		font-size: 26rpx;
		line-height: 58rpx;
	}
	.send_button[disabled]{
		background: #F5F7FA;
		color: #B8B8B8;
	}

</style>

