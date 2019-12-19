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
						name="mobile" 
						:size='20' 
						color='rgba(44,218,216,1)' 
						style="margin-right: 10rpx;">
					</tui-icon>
					<input 
						class="inpu_fass" 
						type="number" 
						placeholder="请输入手机号"
						placeholder-style="color: #B8B8B8;"
						maxlength="11"
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
					@tap="nexTo">
					下一步
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
					code: ''
				},
				countNum: 60,// 倒计时周期
				countFlag: false,// 用于倒计时标记，true-正在倒计时
				intervalBtn:{},// 定时器
				btnMsg:"获取验证码",//默认按钮的值
			}
		},
		methods: {
			nexTo:function(){
				if (!this.from.mobile) {
					uni.showToast({
					    title: '请输入手机号！',
						icon: 'none',
					    duration: 2000
					});
					return;
				}
				if (!(/^1[34578]\d{9}$/.test(this.from.mobile))){
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
				uni.navigateTo({
					url:'/pages/login/nextPasswrod?mobile=' + this.from.mobile + '&code=' + this.from.code
				})
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
					smsType: 'SMS_FORGET'
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
			},
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

