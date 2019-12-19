<template>
	<view class="container">
		<!-- S 支付结果 -->
		<view class="result-view">
			
			<!-- 支付成功 -->
			<view 
				class="result-view-success"
				v-if="isSuccess">
				<image :src="imgUrl + 'order/pay_success_icon.png'" class="img" />
				<view class="tip-text">订单支付成功！</view>
				<view class="pay-info">
					<view class="pay-way">支付方式：<text class="tip">呱呱支付</text></view>
					<view class="pay-money">支付金额：<text class="tip">¥{{ orderInfo.actualPrice }}</text></view>
				</view>
				<view class="operation-but">
					<navigator url="/pages/order/order/order" class="but">查看订单</navigator>
				</view>
			</view>
			
			<!-- 支付失败 -->
			<view
				class="result-view-success"
				v-else>
				<image :src="imgUrl + 'order/pay_fail_icon.png'" class="img" />
				<view class="tip-text tip-text-error">订单支付失败！</view>
				<view class="system-text">您的订单未能成功支付，如有疑问请致电客服人员！</view>
				<view class="pay-info">
					<view class="pay-way">支付方式：<text class="tip">微信支付</text></view>
					<view class="pay-money">支付金额：<text class="tip">¥ {{ orderInfo.actualPrice }}</text></view>
				</view>
				<view class="operation-but">
					<!-- <view class="but">选择其它支付方式</view> -->
					<navigator url="/pages/order/order/order" class="but">查看订单</navigator>
				</view>
			</view>
		</view>
		<!-- E 支付结果 -->
	</view>
</template>

<script>
	import tuiDivider from "@/components/divider/divider"
import mixinsShop from '@/common/mixins/shop.js';
	export default {
		name: "paySuccess",
		components:{
			tuiDivider
		},
		mixins: [mixinsShop],
		data() {
			return {
				imgUrl: this.$config.imgUrl,
				isSuccess: true,
				orderInfo: {}
			};
		},
		onLoad(options) {
			this.isSuccess = options.isSuccess
			if(!options.isSuccess){
				uni.setNavigationBarTitle({
					title: '支付失败'
				})
			}
			this.orderInfo = options
			console.log(this.orderInfo)
			this.$forceUpdate()
		},
		onUnload() {
			uni.navigateBack({
				delta: 2
			})
		}
	}
</script>

<style lang="scss" scoped>
	/* 支付结果
	---------------------------------------------------------------- */
	.result-view{
		.img{
			display: block;
			width: 180rpx;
			height: 180rpx;
			margin: 80rpx auto 30rpx;
		}
		.tip-text{
			padding: 0 32rpx;
			text-align: center;
			font-size: 32rpx;
			font-weight: bold;
			color: #252525;
		}
		.tip-text-error{
			color: #F54743;
		}
		.system-text{
			margin-top: 24rpx;
			color: #565656;
			font-size: 28rpx;
			text-align: center;
			padding: 0 32rpx;
		}
		.pay-info{
			margin-top: 32rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			.pay-way{
				display: inline-block;
				font-size: 28rpx;
				font-weight: 500;
				color: #565656;
				margin-right: 30rpx;
				.tip{
					font-weight: bold;
					color: #FF6600;
				}
			}
			.pay-money{
				display: inline-block;
				font-size: 28rpx;
				font-weight: bold;
				color: #565656;
				.tip{
					color: #FF6600;
				}
			}
		}
		.operation-but{
			margin-top: 60rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			.but{
				width: 280rpx;
				height: 76rpx;
				line-height: 76rpx;
				background-color: #FFFFFF;
				color: #000000;
				font-size: 28rpx;
				text-align: center;
				box-sizing: border-box;
				border: 2rpx solid #10BBB8;
				border-radius: 8rpx;
			}
		}
		
	}
	
	
	/* 推荐商品
	---------------------------------------------------------------- */
	.recommend-commodities{
		padding: 0 32rpx;
		margin-top: 80rpx;
	}
</style>
