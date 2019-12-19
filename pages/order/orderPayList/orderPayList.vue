<template>
	<web-view :src="src"></web-view>
</template>

<script>
export default {
	data() {
		return {
			src: ''
		};
	},
	onLoad(options) {
		console.log(options)
		if(options.src){
			this.src = options.src.replace('@@', '?').replace(/%%/g, '=').replace(/\+\+/g, '&')
		} else if (JSON.stringify(options) == '{}') {
			this.src = this.$store.state.app.payUrl + '&isXcx=1';
			console.log(this.src)
		} else {
			this.requestWXPayWithParams(options);
		}
	},
	methods: {
		/**
		 * 发起微信支付
		 */
		requestWXPayWithParams(options) {
			console.log(options);
			//代表已经发起了一次支付
			//this.data.isPayAction = true;
			var packageInfo = options.package;
			packageInfo = packageInfo.replace(/\~\|\|\~/g, '=');
			var paySign = options.paySign;
			paySign = paySign.replace(/\~\|\|\~/g, '=');
			let timeStamp = options.timeStamp;
			let signType = options.signType;
			let nonceStr = options.nonceStr;
			let params = {
				timeStamp: timeStamp,
				package: packageInfo,
				signType: signType,
				nonceStr: nonceStr,
				paySign: paySign
			};
			uni.getProvider({
				 service: 'payment',
				success(res) {
					uni.requestPayment({
						provider: res.provider[0],
						timeStamp: timeStamp,
						package: packageInfo,
						signType: signType,
						nonceStr: nonceStr,
						paySign: paySign,
						success: result => {
							setTimeout(() => {
								uni.redirectTo({
									url: `/pages/product/paySuccess/paySuccess?isSuccess=true`
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
											uni.navigateBack({});
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
};
</script>

<style lang="scss"></style>
