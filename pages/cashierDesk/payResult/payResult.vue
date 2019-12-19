<template>
	<view class="container">
		<!-- S 支付结果 -->
		<view class="result-view">
			
			<!-- 支付成功 -->
			<view 
				class="result-view-success"
				v-if="isSuccess">
				<view class="img"></view>
				<view class="tip-text">订单支付成功！</view>
				<view class="pay-info">
					<view class="pay-way">支付方式：<text class="tip">微信支付</text></view>
					<view class="pay-money">支付方式：<text class="tip">¥8400.00</text></view>
				</view>
				<view class="operation-but">
					<view class="but">查看订单</view>
				</view>
			</view>
			
			<!-- 支付失败 -->
			<view
				class="result-view-success"
				v-else>
				<view class="img"></view>
				<view class="tip-text tip-text-error">订单支付失败！</view>
				<view class="system-text">您的订单未能成功支付，如有疑问请致电客服人员！</view>
				<view class="pay-info">
					<view class="pay-way">支付方式：<text class="tip">微信支付</text></view>
					<view class="pay-money">支付方式：<text class="tip">¥8400.00</text></view>
				</view>
				<view class="operation-but">
					<view class="but">选择其它支付方式</view>
				</view>
			</view>
		</view>
		<!-- E 支付结果 -->
		
		<!-- S 推荐商品 -->
		<view class="recommend-commodities">
			<tui-divider 
				color="#878787"
				:size="28"
				bgcolor="#F0F2F5"
				dividerColor="#CCCCCC">
				推荐商品
			</tui-divider>
			<view class="dgg-row" style="margin-left: -10rpx;margin-right: -10rpx;">
				<view class="dgg-col dgg-col-5 dgg-gutter-20" 
					v-for="(item,index) in 4" 
					:key="index">
					<product-item></product-item>
				</view>
			</view>
		</view>
		<!-- E 推荐商品 -->
	</view>
</template>

<script>
	import tuiDivider from "@/components/divider/divider"
	import productItem from "@/components/product-item/pruduct-item.vue"
	
	export default {
		name: "paySuccess",
		components:{
			tuiDivider, 
			productItem
		},
		data() {
			return {
				isSuccess: true
			};
		}
	}
</script>

<style lang="scss" scoped>
	/* 支付结果
	---------------------------------------------------------------- */
	.result-view{
		.img{
			width: 180rpx;
			height: 180rpx;
			background-color: #10BBB8;
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
				border: 1rpx solid #10BBB8;
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
