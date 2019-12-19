<template>
	<view class="about-wrap">
		<view class="about-info">
			<image class="logo" src="https://dgg-xiaodingyun.oss-cn-beijing.aliyuncs.com/xdy-xcx/logins/logo.png" mode=""></image>
			<text>顶呱呱 - 智能企服平台</text>
			<text class="v">版本号：v1.0.10</text>
		</view>
		<view class="about-footer">
			<text>版权所有</text>
			<text>顶呱呱科技股份有限公司</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
	.about-wrap{
		width: 100%;
		height: 100vh;
		background:rgba(240,242,245,1);
		text-align: center;
		display: flex;
    flex-direction: column;
		.about-info{
			flex: 1;
			.logo{
				width: 264rpx;
				height: 142rpx;
				margin-top: 160rpx;
				margin-bottom: 34rpx;
			}
			text{
				display: block;
				font-size:28rpx;
				font-family:PingFang SC;
				font-weight:500;
				line-height: 1;
				color:rgba(135,135,135,1);
				margin: 0 auto;
				&.v{
					margin-top: 23rpx;
				}
			}
		}
		.about-footer{
			height: 100rpx;
			text{
				display: block;
				font-size:24rpx;
				font-family:PingFang SC;
				font-weight:500;
				color:rgba(184,184,184,1);
				margin: 0 auto;
				line-height: 40rpx;
			}
		}
	}
</style>
