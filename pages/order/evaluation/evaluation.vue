<template>
	<!--pages/order/orderEvaluation/orderEvaluation.wxml-->
	<view class="orderEvaluationPage">
		<view class="topHeaderBg">
			<image :src="imageBaseURL + 'order/order_image_evaluation_bg.png'"></image>
			<view class="headerContent">
				<view>订单号</view>
				<view>{{ order.orderNumber }}</view>
			</view>
		</view>
		<!-- 评价标签 -->
		<view class="evaluationLabelListBg">
			<view class="title">本次服务哪些让你印象深刻？</view>
			<view class="label-grids">
				<view
					v-for="(item, index) in evaluationLabelList"
					:class="'label-grid ' + (item.selected ? 'selected' : '')"
					:key="name"
					@click.stop="evaluationLabelAction(index)"
				>
					{{ item.name }}
				</view>
			</view>
		</view>
		<view class="lineView"></view>
		<!-- 描述 -->
		<view class="remarkBg">
			<view class="inputRemark">
				<textarea :placeholder="isEvaluate ? '再聊聊你的体验感受吧！' : '聊聊你的体验感受吧！'" maxlength="500" @input="myAppealChange" :value="appealContent"></textarea>
			</view>
			<view class="anonymousBg">
				<label>
					<checkbox :value="anonymousRadio" />
					<text>匿名评价</text>
				</label>
			</view>
		</view>
		<view class="lineView"></view>
		<!-- 评分 -->
		<view class="rateBg" v-if="!isEvaluate">
			<view class="rateView">
				<text>服务评分</text>
				<!-- <van-rate custom-class="rateClass" size="23" :value="serviceRate" bind:change="onChangeServiceRate"></van-rate> -->
				<tui-rate :current="serviceRate" @change="changeServiceRate"></tui-rate>
			</view>
			<view class="rateView">
				<text>专业程度</text>
				<tui-rate :current="degreeRate" @change="changeDegreeRate"></tui-rate>
			</view>
			<view class="rateView">
				<text>响应速度</text>
				<tui-rate :current="speedRate" @change="changeSpeedRate"></tui-rate>
			</view>
		</view>

		<!-- 提交按钮 -->
		<view class="lineView" v-if="!isEvaluate"></view>
		<view class="submitButtonBg">
			<view class="submit" @click.stop="submitAction"><text>提交</text></view>
		</view>
	</view>
</template>

<script>
import tuiRate from '@/components/rate/rate';
import { order as orders } from '@/api/index.js';
export default {
	data() {
		return {
			imageBaseURL: this.$config.imgUrl,
			evaluationLabelList: [],
			anonymousRadio: false,
			serviceRate: 5,
			degreeRate: 5,
			speedRate: 5,
			order: {},
			appealContent: '',
			reviewCount: 0,
			//评论次数
			isEvaluate: false,
			//是否是追评论
			isLoading: false,
			current: 5
		};
	},
	onLoad(options) {
		console.log(options);
		console.log('1111');
		this.getEvaluationLabelList();
		this.$http.get(orders.getOrderBaseInfoURL, { orderId: options.orderId }).then(result => {
			if (result.code == 200) {
				this.order = result.data;
			}
			uni.hideLoading();
		});
	},
	components: {
		tuiRate
	},
	props: {},
	methods: {
		changeServiceRate(value) {
			console.log(value);
			this.serviceRate = value.index;
		},
		changeDegreeRate(value) {
			console.log(value);
			this.degreeRate = value.index;
		},
		changeSpeedRate(value) {
			console.log(value.index);
			this.speedRate = value.index;
		},
		/**
		 * 查询服务标签
		 */
		getEvaluationLabelList() {
			let params = {
				code: 'EVALUATE_LABEL',
				type: '1'
			};
			this.$http.get(orders.cmsGetTreeBookByCodeURL, params).then(result => {
				console.log(result.data);
				if (result.code == 200) {
					this.evaluationLabelList = result.data;
					console.log(this.evaluationLabelList);
				}
			});
		},

		/**
		 * 标签选择事件
		 */
		evaluationLabelAction: function(selectedIndex) {
			this.evaluationLabelList[selectedIndex].selected = !this.evaluationLabelList[selectedIndex].selected;
			console.log(this.evaluationLabelList);
			this.$forceUpdate();
		},

		myAppealChange(e) {
			this.setData({
				appealContent: e.detail.value
			});
		},

		onChangeServiceRate(e) {
			this.setData({
				serviceRate: e.detail
			});
		},

		onChangeDegreeRate(e) {
			this.setData({
				degreeRate: e.detail
			});
		},

		onChangeSpeedRate(e) {
			this.setData({
				speedRate: e.detail
			});
		},

		/**
		 * 提交按钮事件
		 */
		submitAction() {
			if (this.isLoading) {
				console.log('重复提交');
				return;
			}

			if (this.isEvaluate) {
				//追评
				this.userAddEvaluationAction();
			} else {
				//评论
				this.userEvaluationAction();
			}
		},

		/**
		 * 追评
		 */
		userAddEvaluationAction: function() {
			if (this.appealContent == '') {
				uni.showToast({
					title: '再聊聊本次服务体验的感受吧',
					icon: 'none'
				});
				return;
			}

			let productId,
				productName = '';

			if (this.order.isPackage) {
				//isPackage = 1 的时候是套餐，取套餐的id 和name
				productId = this.order.packageId;
				productName = this.order.packageName;
			} else {
				let product = this.order.mainOrderList[0];
				productId = product.productId;
				productName = product.productName;
			}

			this.isLoading = true;
			let requestParams = {
				orderId: this.order.id,
				orderNo: this.order.orderNumber,
				productId: productId,
				productName: productName,
				evaluateContent: this.appealContent,
				platformCode: 'GUA_SOURCE_PLATFORM'
			};
			console.log(requestParams);
			uni.showLoading({
				title: '加载中..',
				mask: true
			});
			this.$http.post(orders.saveEvaluate, requestParams).then(result => {
				if (result.code == 200) {
					uni.showToast({
						title: '评价成功',
						icon: 'success'
					});
					setTimeout(() => {
						uni.navigateBack({});
					}, 2000);
				} else {
					//重置，允许提交
					this.isLoading = false;
				}
				uni.hideLoading();
			});
		},

		/**
		 * 评价
		 */
		userEvaluationAction: function() {
			let productId,
				productName,
				labelJson = '';

			if (this.order.isPackage) {
				//isPackage = 1 的时候是套餐，取套餐的id 和name
				productId = this.order.packageId;
				productName = this.order.packageName;
			} else {
				let product = this.order.mainOrderList[0];
				productId = product.productId;
				productName = product.productName;
			}

			for (let i of this.evaluationLabelList) {
				if (i.selected) {
					labelJson = i.code + ',' + labelJson;
				}
			}

			if (labelJson == '') {
				uni.showToast({
					title: '请选择您对本次服务的印象',
					icon: 'none'
				});
				return;
			}

			if (this.appealContent == '') {
				uni.showToast({
					title: '聊聊本次服务体验的感受吧',
					icon: 'none'
				});
				return;
			}

			var msg = '';

			if (this.speedRate == -1) {
				msg = '请对【响应速度】评分';
			}

			if (this.degreeRate == -1) {
				msg = '请对【专业程度】评分';
			}

			if (this.serviceRate == -1) {
				msg = '请对【服务评分】评分';
			}

			if (msg != '') {
				uni.showToast({
					title: msg,
					icon: 'none'
				});
				return;
			}

			this.isLoading = true;
			let requestParams = {
				orderId: this.order.id,
				orderNo: this.order.orderNumber,
				productId: productId,
				productName: productName,
				labelJson: labelJson,
				evaluateContent: this.appealContent,
				platformCode: 'GUA_SOURCE_PLATFORM',
				serviceScore: this.serviceRate,
				specialtyScore: this.degreeRate,
				speedScore: this.speedRate
			};
			console.log(requestParams);
			uni.showLoading({
				title: '加载中..',
				mask: true
			});
			this.$http.post(orders.saveEvaluate, requestParams).then(result => {
				if (result.code == 200) {
					uni.showToast({
						title: '评价成功',
						icon: 'success'
					});
					uni.setStorageSync('orderChange', true)
					setTimeout(() => {
						uni.navigateBack({});
					}, 1500);
				} else {
					//重置，允许提交
					this.isLoading = false;
				}
				uni.hideLoading();
			});
		},
		setData: function(obj) {
			let that = this;
			let keys = [];
			let val, data;
			Object.keys(obj).forEach(function(key) {
				keys = key.split('.');
				val = obj[key];
				data = that.$data;
				keys.forEach(function(key2, index) {
					if (index + 1 == keys.length) {
						that.$set(data, key2, val);
					} else {
						if (!data[key2]) {
							that.$set(data, key2, {});
						}
					}

					data = data[key2];
				});
			});
		}
	}
};
</script>
<style>
/* pages/order/orderEvaluation/orderEvaluation.css */
.orderEvaluationPage {
	width: 100%;
	background-color: white;
}

.topHeaderBg {
	width: 100%;
	height: 180rpx;
	position: relative;
}

.topHeaderBg image {
	width: 100%;
	height: 100%;
}

.topHeaderBg .headerContent {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 180rpx;
	padding: 50rpx 32rpx;
}

.topHeaderBg .headerContent > view:first-child {
	color: #3a3b3d;
	font-size: 26rpx;
}

.topHeaderBg .headerContent > view:last-child {
	color: #3a3b3d;
	font-size: 32rpx;
	font-weight: bolder;
}

/* 评价标签 */
.evaluationLabelListBg {
	margin-top: 46rpx;
}

.evaluationLabelListBg .title {
	color: #707175;
	font-size: 28rpx;
	width: 100%;
	text-align: center;
}

.evaluationLabelListBg .label-grids {
	display: flex;
	display: -webkit-flex;
	flex: 3;
	flex-direction: row;
	flex-wrap: wrap;
	padding: 28rpx 80rpx 24rpx 80rpx;
	justify-content: space-around;
	align-content: space-around;
}

.evaluationLabelListBg .label-grids .label-grid {
	padding: 12rpx 34rpx;
	border: 1rpx solid #a0a3a8;
	margin-bottom: 28rpx;
	font-size: 24rpx;
	color: #707175;
	border-radius: 30rpx;
	background-color: white;
}

.evaluationLabelListBg .label-grids .selected {
	color: white;
	border: 1rpx solid #ff6600;
	background-color: #ff6600;
}

.lineView {
	margin: 0rpx 32rpx;
	height: 1rpx;
	background-color: #ebeff8;
}

.inputHeaderTitle {
	color: #707175;
	font-size: 24rpx;
	display: block;
	position: relative;
}

.inputHeaderTitle > view:first-child {
	width: 17rpx;
	height: 17rpx;
	border-radius: 10rpx;
	background-color: #ff5644;
	display: inline-block;
}

/* 描述 */
.remarkBg {
	padding: 32rpx 32rpx 20rpx 32rpx;
}

.inputRemark {
	margin: 20rpx 0rpx 0rpx 0rpx;
	background-color: #f5f5f5;
	border-radius: 5rpx;
	font-size: 28rpx;
}

.inputRemark textarea {
	padding: 30rpx 24rpx;
	color: #3a3b3d;
}

.anonymousBg {
	margin-top: 20rpx;
	height: 60rpx;
	line-height: 60rpx;
	font-size: 28rpx;
	font-family: PingFangSC-Regular, PingFangSC;
	font-weight: 400;
	color: rgba(160, 163, 168, 1);
}
.anonymousBg checkbox {
	width: 40rpx;
	height: 40rpx;
	margin-right: 30rpx;
}
.anonymousBg .anonymousLabel {
	color: #a0a3a8;
	font-size: 28rpx;
}

.rateBg {
	margin: 35rpx 32rpx 40rpx 32rpx;
	color: #3a3b3d;
	font-size: 28rpx;
	font-weight: bold;
}

.rateBg .rateView {
	display: flex;
	justify-content: space-between;
	margin-top: 25rpx;
}

.rateBg .rateView > text:first-child {
	line-height: 50rpx;
}

/* 提交按钮 */
.submitButtonBg {
	margin-top: 0rpx;
	background-color: white;
	padding: 48rpx 32rpx;
}

.submitButtonBg .submit {
	text-align: center;
	background: #ff6600;
	border-radius: 56rpx;
	/* background-color: #B4EAF2; */
}

.submitButtonBg .submit text {
	font-size: 32rpx;
	font-family: PingFangSC-Regular;
	font-weight: 400;
	color: rgba(255, 255, 255, 1);
	line-height: 100rpx;
}
.container {
	padding: 20upx 0 120upx 0;
	box-sizing: border-box;
}

.header {
	padding: 80upx 90upx 60upx 90upx;
	box-sizing: border-box;
}

.title {
	font-size: 34upx;
	color: #333;
	font-weight: 500;
}

.sub-title {
	font-size: 24upx;
	color: #7a7a7a;
	padding-top: 18upx;
}

.tui-rate-box {
	padding: 40upx;
	box-sizing: border-box;
	margin-bottom: 30upx;
	background: #fff;
	font-size: 30upx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.tui-title {
	font-size: 30upx;
}
</style>
