<template>
	<view class="container" v-show="orderNo">
		<view class="order-info">
			<image class="icon" :src="imgUrl + 'shop/select-icon.png'" />
			<view class="info">
				<view class="tip">订单提交成功！</view>
				<view class="order-number">订单编号：<text class="text">{{ orderNo }}</text></view>
			</view>
		</view>
		
		<view class="system-tip">请在24小时内完成订单支付，以免系统取消订单！</view>
		
		<view class="operation-but">
			<navigator open-type="redirect" url="/pages/order/order/order" class="but">查看订单</navigator>
			<view class="but but-pay" @tap="payment()">立即支付</view>
		</view>
	</view>
</template>

<script>
	import { order } from '@/api/index.js'
	export default {
		name: "submitOrder",
		data() {
			return {
				imgUrl: this.$config.imgUrl,
				orderIds: [],
				actualPrice: '0.00',
				orderNo: '',
				params: {
				  orderIds: '',
				  app: 'WECHAT',
				  orderPayMethod: 'GUAGUA_ORDER_PAY_METHOD_GUAGUA',
				  payType: 'ORF_PAY_WECHAT',
				  openId: wx.getStorageSync('openId'),
				  sourceType: 'SOURCE_XDY'
				},
				payParams: {}
			};
		},
		onLoad(options) {
			console.log(options, '222')
			this.orderIds = JSON.parse(options.orderIds)
			this.params.orderIds = JSON.parse(options.orderIds).join(',')
			this.actualPrice = options.actualPrice
			this.params.orderIds =  this.orderIds.join(',')
			this.getOrderNo()
		},
		methods:{
			getOrderNo() {
				this.$http.post(order.findOrderNo, { orderIds: this.orderIds.join(',') }).then(res => {
					if(res.code == 200) {
						this.orderNo = res.data
					} else {
						uni.showToast({
							title: res.msg
						})
					}
				})
			},
			payment(){
				uni.showLoading({
					title: '加载中..',
					mask: true
				});
				// 立即支付
			// 呱呱支付:GUAGUA_ORDER_PAY_METHOD_GUAGUA 线下支付:GUAGUA_ORDER_PAY_METHOD_OFFLINE,模拟支付： GUAGUA_ORDER_PAY_METHOD_OFFLINE
				this.$http.post(order.orderToPayActionURL, this.params).then(res => {
					uni.hideLoading();
					if (res.code == 200) {
						if(this.params.orderPayMethod == 'GUAGUA_ORDER_PAY_METHOD_OFFLINE') {
							uni.showToast({ title: '支付成功' });
							setTimeout(() => {
								uni.navigateTo({
									url: '/pages/order/order/order'
								})
							}, 1000)
						} else if(this.params.orderPayMethod == 'GUAGUA_ORDER_PAY_METHOD_GUAGUA') {
							this.payParams = res.data
							this.requestWXPayWithParams(this.payParams)
						}
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none'
						});
					}
				})
			},
			requestWXPayWithParams(options) {
				console.log(options);
				//代表已经发起了一次支付
				//this.data.isPayAction = true;
				let that = this;
				uni.getProvider({
					 service: 'payment',
					success(res) {
						uni.requestPayment({
							provider: res.provider[0],
							timeStamp: options.timeStamp,
							package: options.package,
							signType: options.signType,
							nonceStr: options.nonceStr,
							paySign: options.paySign,
							success: result => {
								setTimeout(() => {
									uni.redirectTo({
										url: `/pages/product/paySuccess/paySuccess?isSuccess=true&actualPrice=${that.actualPrice}`
									});
								}, 1500);
							},
							fail: result => {
								// 支付失败的时候
								//返回上一页面
								if(result.errMsg == 'requestPayment:fail cancel'){
									uni.showModal({
										title: '提示',
										content: '你还未支付',
										cancelText: '狠心离开',
										confirmText: '立即支付',
										success(res) {
											if (res.confirm) {
												that.requestWXPayWithParams(that.payParams)
											} else {
												uni.redirectTo({
													url: '/pages/order/order/order'
												});
											}
										}
									});
								} else {
									uni.redirectTo({
										url: `/pages/product/paySuccess/paySuccess?isSuccess=`
									});
								}
							},
							complete: result => {}
						});
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.order-info{
		margin-top: 160rpx;
		height: 88rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		.icon{
			width: 88rpx;
			height: 88rpx;
			margin-right: 24rpx;
			border-radius: 50%;
		}
		.info{
			height: 88rpx;
			.tip{
				font-size: 32rpx;
				color: #252525;
				line-height: 1;
				font-weight: bold;
			}
			.order-number{
				margin-top: 24rpx;
				font-size: 28rpx;
				color: #565656;
				line-height: 1;
				.text{
					color: #565656;
					font-weight: 600;
				}
			}
		}
	}
	
	.system-tip{
		margin-top: 50rpx;
		font-size: 28rpx;
		font-weight: 500;
		color: #878787;
		text-align: center;
	}
	
	.operation-but{
		margin-top: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		
		.but{
			display: inline-block;
			width: 280rpx;
			height: 76rpx;
			line-height: 76rpx;
			background-color: #FFFFFF;
			border:1rpx solid #10BBB8;
			border-radius:8rpx;
			color: #10BBB8;
			font-size: 28rpx;
			text-align: center;
			margin-right: 48rpx;
			box-sizing: border-box;
			font-weight:500;
			&:last-child{
				margin-right: 0;
			}
		}
		
		.but-pay{
			background-color: #FF6600;
			border: none;
			color: #FFFFFF;
		}
	}
</style>
