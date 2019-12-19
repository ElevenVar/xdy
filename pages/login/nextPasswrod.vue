<template>
	<view>
		<!-- S logo图 -->
			<view class="top_less">
				<text>通过注册手机短信验证码找回密码</text>
			</view>
		<!-- S logo图 -->
		<!-- S 表单提交 -->
			<view class="input_less">
				
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
						v-model="from.password"/>
					<tui-icon 
						class="icon2" 
						:name="isShow ? 'eye' : 'unseen'"  
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
					@tap="blackPassword" >
					确认修改
				</button >
			</view>
		<!-- E 登陆主页 -->
		
	</view>
</template>

<script>
	import tuiIcon from "@/components/icon/icon"
	import {user} from "@/api/index.js"
	export default {
		components: {
			tuiIcon,
		},
		data() {
			return {
				from:{
					mobile: '',
					password: '',
					code: ''
				},
				isShow: false
			}
		},
		onLoad(parameter) {
			console.log(parameter);
			this.from.mobile = parameter.mobile;
			this.from.code = parameter.code;
		},
		methods: {
			showPassdClick(){
				// 密码显示切换
				this.isShow = !this.isShow;
			},
			blackPassword(){
				if (!this.from.password) {
					uni.showToast({
					    title: '请输入密码！',
						icon: 'none',
					    duration: 2000
					});
					return;
				}
				uni.showLoading({
				    title: '修改中..',
					mask: true
				});
				this.$http.post(`${user.resetPassword}`,this.from).then(res=>{
					uni.hideLoading();
					if (res.code == 200) {
						// 返回
						uni.navigateBack({
						    delta: 2
						});
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
		margin-left: 32rpx;
		margin-top: 60rpx;
		margin-bottom: 40rpx;
		font-size:28rpx;
		font-family:PingFang SC;
		font-weight:500;
		color:rgba(86,86,86,1);
	}
	.input_less{
		margin: 0 32rpx;
		height:120rpx;
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

	


</style>

