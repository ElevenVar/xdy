<template>
	<view class="container">
		<!-- S 主体 -->
		<view class="pay-body">
			<!-- 支付基本信息 -->
			<view class="pay-basic-info">
				<view class="pay-money">
					需支付：
					<text class="symbol">¥</text>
					<text class="integer">53512</text>
					<text class="decimals">.00</text>
				</view>
				<view class="pay-order">
					流水号：
					<text class="num">L0210002883 </text>
				</view>
			</view>
			
			<!-- 选择支付方式 -->
			<radio-group @change="radioChange">
				<view 
					class="pay-way-view"
					v-for="item in payWayRow"
					:key="item.tittle">
					<view class="header">{{item.tittle}}</view>
					<label 
						class="tui-cell-class tui-list-cell"
						:class="indexY == item.children.length -1 ? 'tui-cell-last' : '' "
						v-for="(itemY,indexY) in item.children"
						:key="itemY.name">
						<image :src="imgUrl+itemY.icon" class="logo" mode="widthFix"></image>
						<view class="tui-list-cell-name">{{itemY.name}}</view>
						<radio 
							class="tui-right" 
							color="#10BBB8" 
							name="pay" 
							:value="itemY.value"
							:checked="itemY.value == current"/>
					</label>
				</view>
			</radio-group>
		</view>
		<!-- E 主体 -->
		
		<!-- S 底部 -->
		<view class="pay-footer">
			<view class="but" @tap="payment()">立即支付</view>
		</view>
		<!-- E 底部 -->
	</view>
</template>

<script>
	import tuiListCell from "@/components/list-cell/list-cell"
	import { order } from '@/api/index.js'
	export default {
		name:"pay",
		components: {
			tuiListCell
		},
		data() {
			return {
				imgUrl: this.$config.imgUrl,
				payWayRow: [{
					tittle: '选择支付平台',
					children:[
						{
							value: 1,
							name: '微信支付',
							icon:'order/pay_icon1.png'
						},{
							value: 2,
							name: '支付宝支付',
							icon:'order/pay_icon2.png'
						},{
							value: 3,
							name: '银联在线支付',
							icon:'order/pay_icon3.png'
						}
					]
				},{
					tittle: '选择网上银行支付',
					children:[
						{
							value: 4,
							name: '中国农业银行-网银支付',
							icon:'order/pay_icon4.png'
						},{
							value: 5,
							name: '中国建设银行-网银支付',
							icon:'order/pay_icon5.png'
						}
					]
				}],
				current: 1,
				orderIds: []
			};
		},
		onLoad(options) {
			console.log(JSON.parse(options.orderIds))
			this.orderIds = JSON.parse(options.orderIds)
		},
		methods:{
			payment(){
				// 立即支付
				// uni.navigateTo({
				// 	url: "../payResult/payResult"
				// })
				this.$http.post(order.orderToPayActionURL, { orderIds: this.orderIds, app: 'WECHAT', orderPayMethod: 'GUAGUA_ORDER_PAY_METHOD_GUAGUA'}).then(res => {
					if (res.code == 200) {
						uni.navigateTo({
							url: `/pages/cashierDesk/payResult/payResult`
						})
					}
				})
			},
			radioChange(evt){
				this.current = evt.target.value;
			}
		}
	}
</script>

<style scoped>
	.tui-list-cell {
		position: relative;
		width: 100%;
	    height: 100rpx;
		padding: 0 32upx;
		box-sizing: border-box;
		overflow: hidden;
		display: flex;
		align-items: center;
		
	}
	
	.tui-cell-hover {
		background: #f7f7f9 !important;
	}
	
	.tui-list-cell::after {
		content: '';
		position: absolute;
		border-bottom: 1upx solid #D7D8D9;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		bottom: 0;
		right: 0;
		left: 94upx;
	}
	
	.tui-cell-last::after {
		border-bottom: 0 !important;
	}
	
	.tui-list-cell.tui-cell-arrow:before {
		content: " ";
		height: 11px;
		width: 11px;
		border-width: 2px 2px 0 0;
		border-color: #878787;
		border-style: solid;
		-webkit-transform: matrix(0.5, 0.5, -0.5, 0.5, 0, 0);
		transform: matrix(0.5, 0.5, -0.5, 0.5, 0, 0);
		position: absolute;
		top: 50%;
		margin-top: -7px;
		right: 30upx;
	}
	.tui-list-cell-name {
		padding-left: 20upx;
		vertical-align: middle;
		line-height: 30upx;
	}	
	
	.tui-right {
		margin-left: auto;
		font-size: 32upx;
		line-height: 1;
		color: #10BBB8;
		transform:scale(0.8)
	}
	
	.tui-list-cell-name {
		padding-left: 20rpx;
		vertical-align: middle;
		line-height: 30rpx;
		color: #565656;
		font-weight: bold;
		font-size: 28rpx;
	}
	.logo {
		height: 48rpx;
		width: 48rpx;
	}
</style>
<style lang="scss" scoped>
	/* 主体
	---------------------------------------------------------------- */
	.pay-body{
		flex: 1;
		width: 100%;
		height: calc(100vh - 100rpx);
		overflow-y: auto;
		box-sizing: border-box;
		
		/* 支付基本信息 */
		.pay-basic-info{
			height: 94rpx;
			line-height: 94rpx;
			padding: 0 32rpx;
			box-sizing: border-box;
			.pay-money{
				display: inline-block;
				margin-right: 30rpx;
				height: 94rpx;
				line-height: 94rpx;
				font-size: 28rpx;
				color: #252525;
				.symbol{
					color: #FF6600;
					font-size: 24rpx;
					font-weight: bold;
				}
				.integer{
					color: #FF6600;
					font-size: 42rpx;
					font-weight: bold;
				}
				.decimals{
					color: #FF6600;
					font-size: 28srpx;
					font-weight: bold;
				}
			}
			.pay-order{
				display: inline-block;
				height: 94rpx;
				line-height: 94rpx;
				font-size: 28rpx;
				color: #252525;
				.num{
					font-weight: bold;
					font-size: 32rpx;
				}
			}
		}
		
		/* 选择支付方式 */
		.pay-way-view{
			min-height: 300rpx;
			background-color: #FFFFFF;
			margin-bottom: 16rpx;
			.header{
				height: 100rpx;
				line-height: 100rpx;
				padding: 0 32rpx;
				font-size: 28rpx;
				color: #252525;
				font-weight: bold;
			}
		}
	}
	
	/* 底部
	---------------------------------------------------------------- */
	.pay-footer{
		display: flex;
		align-items: center;
		position: fixed;
		left: 0;
		bottom: 0;
		height: 100rpx;
		line-height: 100rpx;
		width: 100%;
		background-color: #FFFFFF;
		box-shadow:0px 0px 6px 0px rgba(0, 0, 0, 0.14);
		padding: 0 32rpx;
		box-sizing: border-box;
		.but{
			width: 100%;
			height: 76rpx;
			line-height: 76rpx;
			border-radius: 8rpx;
			background-color: #FF6600;
			text-align: center;
			color: #FFFFFF;
			font-size: 32rpx;
		}
	}
</style>
