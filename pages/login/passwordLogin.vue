<template>
	<view>
		<!-- S logo图 -->
			<view class="top_less">
				<image 
					class="login_pig" 
					:src="imgUrl + 'logins/logo.png'">
				</image>
			</view>
		<!-- S logo图 -->
		<!-- S 表单提交 -->
			<view class="input_less">
				<view class="input_item">
					<tui-icon class="icon" name="mobile" :size='20' color='rgba(44,218,216,1)' style="margin-right: 10rpx;"></tui-icon>
					<input 
						class="inpu_fass" 
						type="number" 
						maxlength="11"
						placeholder="请输入手机号"
						placeholder-style="color: #B8B8B8;"
						v-model="from.loginName">
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
						placeholder="请输入密码" 
						placeholder-style="color: #B8B8B8;"
						maxlength="18"
						:type="isShow ? 'text' : 'password'" 
						v-model="from.password" />
					<tui-icon 
						class="icon2" 
						:name="isShow ? 'eye' :'unseen'" 
						:size='20' 
						color='rgba(212,218,224,1)' 
						style="margin-right: 10rpx;"
						@click.stop="showPassdClick">
					</tui-icon>
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
					登录
				</button >
			</view>
		<!-- E 登陆主页 -->
		
		<!-- S 忘记密码 -->
			<view class="forget_item" @tap="forgetPassword">
				<text>忘记密码</text>
			</view>
		<!-- E 忘记密码 -->
		<!--S 还没账号？ 立即注册  -->
		<view class="footer_item" @tap="goToEnroll">
			<text>还没账号？</text>
			<text class="add_new">立即注册</text>
		</view>
		<!--E 还没账号？ 立即注册  -->
	</view>
</template>

<script>
	import tuiIcon from "@/components/icon/icon"
	import { user, carts} from "@/api/index.js"
	export default {
		components: {
			tuiIcon,
		},
		data() {
			const imgUrl = this.$config.imgUrl;
			return {
				imgUrl : imgUrl,
				from:{
					loginName: '',
					password: ''
				},
				isShow: false
			}
		},
		methods: {
			showPassdClick(){
				// 密码显示切换
				this.isShow = !this.isShow;
			},
			forgetPassword(){
				uni.navigateTo({
					url:'/pages/login/forgetPassword'
				})
			},
			goToEnroll(){
				uni.navigateTo({
					url:'/pages/login/enroll'
				})
			},
			loginTap(){
				// 登录
				if (!this.from.loginName) {
					uni.showToast({
					    title: '请输入手机号！',
						icon: 'none',
					    duration: 2000
					});
					return;
				}
				if (!(/^1[23456789]\d{9}$/.test(this.from.loginName))){
					uni.showToast({
					    title: '手机号有误！',
						icon: 'none',
					    duration: 2000
					});
					return;
				}
				if (!this.from.password){
					uni.showToast({
					    title: '请输入密码！',
						icon: 'none',
					    duration: 2000
					});
					return;
				}
				uni.showLoading({
				    title: '登录中..',
					mask: true
				});
				this.$http.post(`${user.login}`,this.from).then(res=>{
					uni.hideLoading();
					if (res.code == 200) {
						uni.setStorageSync("token",res.data.token);
						uni.setStorageSync("userInfo", res.data.userInfo);
                        uni.setStorageSync("phone",this.from.loginName);
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
						if(this.$store.state.xdyParams.xdyUrl){
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
		margin: 80rpx 32rpx 48rpx 32rpx;
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
		}
	}
	
	.inpu_fass{
		line-height: 120rpx;
		font-size: 32rpx;
		height: 120rpx;
		float: left;
		
	}
	.icon{
		margin-top: 39rpx;
		float: left;
		display: block;
	}
	.icon2{
		margin-top: 39rpx;
		float: right;
		display: block;
	}
	.send_button{
		position: absolute;
		top:40rpx;
		right: 20rpx;
		width:180rpx;
		height:58rpx;
		background:rgba(16,187,184,1);
		border-radius:29px;
		font-size: 28rpx;
		line-height: 58rpx;
	}
	.forget_item{
		text-align: center;
		font-size:28rpx;
		font-family:PingFang SC;
		font-weight:500;
		color:rgba(135,135,135,1);
	}
	.footer_item{
		position: absolute;
		left: 0;
		bottom: 48rpx;
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		font-size:26rpx;
		font-weight:500;
		color:rgba(171,175,179,1);
		text-align: center;
	}
	.add_new{
		color:#10BBB8 ;
	}

</style>

