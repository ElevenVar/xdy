<template>
	<view class="orderListPage">
		<!-- S 选项卡顶部 -->
		<scroll-view scroll-x scroll-with-animation class="tab-view" :scroll-left="scrollLeft">
			<view class="tab-bar-item" :data-current="index" v-for="(item, index) in typeList" :key="index" @tap.stop="swichNav(index)">
				<text class="tab-bar-title" :class="[currentType.code == item.code ? 'active' : '']">{{ `${item.name}(${item.count})` }}</text>
			</view>
		</scroll-view>
		<!-- E 选项卡顶部 -->

		<!-- 列表数据 -->
		<scroll-view class="listContainer" scroll-y @scrolltolower="scrolltolower">
			<view class="order-list-grid" v-for="(orderModel, id) in orderList" :key="id" @click.stop="lookProductProgressAction" :data-order="orderModel">
				<!-- 标题 -->
				<view class="headerBg">
					<text>订单 {{ orderModel.orderNumber }}</text>
					<text>{{ orderModel.orderStatus }}</text>
				</view>
				<view style="width:100%;height:2rpx;background-color:#EBEFF8;"></view>
				<!-- 内容 -->
				<!-- 产品显示内容 -->
				<view class="content" v-if="!orderModel.isPackage">
					<view class="productList" v-for="(productModel, id) in orderModel.shopArr" :key="id">
						<view class="title">{{ productModel.productName }}</view>
						<view class="subtitle" v-for="(item, index) in productModel.shopJsonArr" :key='index'>
							{{ item.attrValue }}: {{ item.attrDetailsName }}
						</view>
						<!-- 服务标签 -->
						<view class="serviceLabelBg">
							<view class="service-grid" v-for="(serviceModel, id) in productModel.additionItemJsonArr" :key="id">
								{{ serviceModel.additionItemName + '/￥' + filters.toFix(serviceModel.price * 0.01) }}
							</view>
						</view>
						<!-- 金额 -->
						<view class="productMoney">￥{{ filters.toFix(productModel.actualPrice * 0.01) }}</view>
					</view>
					<!-- 合计总金额 -->
					<view class="totalMoneyBg">
						<text>
							共
							<text class="totalCount">{{ orderModel.totalNum }}</text>
							件商品，合计：
						</text>
						<text class="totalMoney">￥{{ filters.toFix(orderModel.actualPrice * 0.01) }}</text>
					</view>
				</view>
				<!-- 套餐显示数据 -->
				<view class="content" v-else>
					<view class="packageTitle">{{ orderModel.packageName }}</view>
					<view class="packageList" v-for="(productModel, id) in orderModel.mainOrderList" :key="id">
						<view class="packageSubtitle">{{ productModel.productName }}</view>
					</view>
					<!-- 合计总金额 -->
					<view class="totalMoneyBg">
						<text>
							共
							<text class="totalCount">{{ orderModel.num }}</text>
							件商品，合计：
						</text>
						<text class="totalMoney">￥{{ filters.toFix(orderModel.actualPrice * 0.01) }}</text>
					</view>
				</view>
				<view style="width:100%;height:2rpx;background-color:#EBEFF8;"></view>
				<!-- 底部操作 -->
				<view class="orderOperationButtonBg" v-if="orderModel.orderStatusCode == 'CLOUD_ORDER_STATUS_NO_PAYMENT'">
					<view class="operationButton cancelButton" @click.stop="cancelButtonAction(orderModel)">取消订单</view>
					<view class="operationButton payButtonNow" @click.stop="payButtonAction(orderModel)">立即支付</view>
				</view>
				 <!-- v-if="orderModel.orderStatusCode == 'CLOUD_ORDER_STATUS_WAIT_HANDLE' && orderModel.orderSource != 'ORDER-SOURCE-IBOSS-IMPORT'" -->
				<view class="orderOperationButtonBg"
				 v-if="orderModel.orderStatusCode=='CLOUD_ORDER_STATUS_HANDLING' || orderModel.orderStatusCode=='CLOUD_ORDER_STATUS_REFUND_REJECT'
				 || orderModel.orderStatusCode=='CLOUD_ORDER_STATUS_WAIT_HANDLE' || orderModel.orderStatusCode=='CLOUD_ORDER_STATUS_CHARGE_BACK_REJECT'"
				 >
					<view class="operationButton applyContract" v-if="!orderModel.contractNo" @click.stop="applyContract(orderModel)">申请合同</view>
					<view class="operationButton payButtonNow" v-else @click.stop="lookContractAction(orderModel)">查看合同</view>
				</view>
				<!-- 查看进度 -->
				<view class="progressBg" v-else-if="orderModel.orderStatusCode == 'CLOUD_ORDER_STATUS_HANDLING'" @click.stop="lookProductProgressAction" :data-order="orderModel">
					<view class="content">
						<text class="leftLabel">生产信息</text>
						<view class="rightLabel">
							<text>查看详情</text>
							<image :src="imageUrl + 'order/common_more_arrow.png'"></image>
						</view>
					</view>
				</view>
				<!-- 立即评价 -->
				<!-- <view class="orderOperationButtonBg" v-if="orderModel.orderStatusCode == 'CLOUD_ORDER_STATUS_FINISHED'">
					<view class="operationButton evaluationButton" @click.stop="evaluationButtonAction(orderModel)">立即评价</view>
				</view> -->
				<!-- 退单-查看进度 -->
				<view
					class="orderOperationButtonBg"
					v-if="
						orderModel.orderStatusCode == 'CLOUD_ORDER_STATUS_REFUND_SUCCESS' ||
							orderModel.orderStatusCode == 'CLOUD_ORDER_STATUS_REFUND_REJECT' ||
							orderModel.orderStatusCode == 'CLOUD_ORDER_STATUS_WAIT_REFUNDING' ||
							orderModel.orderStatusCode == 'CLOUD_ORDER_STATUS_WAIT_REFUND' ||
							orderModel.orderStatusCode == 'CLOUD_ORDER_STATUS_CHARGE_BACK_SUCCESS' ||
							orderModel.orderStatusCode == 'CLOUD_ORDER_STATUS_CHARGE_BACK_REJECT' ||
							orderModel.orderStatusCode == 'CLOUD_ORDER_STATUS_WAIT_CHARGE_BACKING' ||
							orderModel.orderStatusCode == 'CLOUD_ORDER_STATUS_WAIT_CHARGE_BACK'
					"
				>
					<view class="operationButton backProgressButton" :data-order="orderModel" @click.stop="backProgressButtonAction">查看进度</view>
				</view>
				<!-- 立即续费 -->
				<!-- <view class='orderOperationButtonBg' wx:if="{{orderModel.orderStatusCode == 'CLOUD_ORDER_STATUS_WAIT_HANDLE'}}">
        <view class='operationButton renewButton' data-order='{{orderModel}}' catchtap='renewButtonAction'>立即续费</view>
      </view> -->
	  
			</view>
			<view v-if="isLoading && orderList.length == 0" class="Placeholder">
				<!-- <image :src="imageBaseURL + 'package_icon_no_search_res.png'"></image> -->
				<image :src="imageUrl + 'order/no-order.png'"></image>
				<text>暂无数据~</text>
			</view>
			<view class="bottomNodataText" v-if="isLoading && isNoMoreData && orderList.length != 0">暂无更多数据~</view>
		</scroll-view>
	</view>
</template>

<script>
import filters from '@/utils/index.js';
import { order } from '@/api/index.js';
import Util from '@/utils/util.js';
export default {
	data() {
		return {
			// imageBaseURL: uni.imageBaseURL,
			typeList: [
				{
					name: '全部',
					count: 0,
					code: 'ALL'
				},
				{
					name: '待付款',
					count: 0,
					code: 'UN_PAY'
				},
				{
					name: '服务中',
					count: 0,
					code: 'SERVICING'
				},
				{
					name: '已结项',
					count: 0,
					code: 'FINISHED'
				},
				{
					name: '退单',
					count: 0,
					code: 'REFUND'
				}
			],
			//{ name: "待续费", count: 0, code: 'SERVICE_STATUS_RENEW' },
			typeIndex: 0,
			currentType: {
				name: '全部',
				count: 0,
				code: 'ALL'
			},
			orderList: [],
			page: 1,
			currentTab: 0, //预设当前项的值
			scrollLeft: 0, //tab标题的滚动条位置
			limit: 10,
			isNoMoreData: false,
			isLoading: false,
			filters: filters
		};
	},

	onLoad(options) {
		console.log(options);
		this.currentType.code = options.status ? options.status : 'ALL';
		this.initOrderData();
	},
	onShow() {
		if(uni.getStorageSync('orderChange')) {
			this.initOrderData();
			uni.removeStorageSync('orderChange')
		}
	},
	components: {},
	methods: {
		/**
		 * 查看合同
		 */
		lookContractAction(item) {
			uni.navigateTo({
				url: '/pages/order/orderDetails/orderDetails?orderId=' + item.id + '&type=contract'
			});
			// uni.showLoading({
			// 	title: '加载中。。'
			// })
			// console.log(item.contractNo)
			// this.$http.get(order.getOrderContractUrlListURL, { contractNo: item.contractNo }).then(result => {
			// if (result.code == 200) {
			// 	console.log(JSON.parse(result.data))
			// 	let url = JSON.parse(result.data).pdfPath;
			// 		Util.previewFdf(url).then(result => {
			// 		uni.hideLoading()
			// 	});
			// 	}
			// })
			
		},
		// 初始化获取数据
		initOrderData() {
			this.page = 1;
			this.fetchOrderCountByStatus();
			this.findOrderList();
			uni.pageScrollTo({
				scrollTop: 1
			});
		},
		/**
		 * 顶部标签筛选事件
		 */
		switchTab(e) {
			// 滚动切换标签样式
			this.currentTab = e.detail.current;
			this.checkCor();
		},
		prices(str) {
		  if (str % 100 == 0) {
			  return String(str / 100) + '.00'
		  } else if (str % 10 == 0) {
			  return String(str / 100) + '0'
		  } else {
			  let num = String((str / 100).toFixed(3))
			  return num.substr(0, num.length - 1)
		  }
		},
		swichNav(index) {
			// 点击标题切换当前页时改变样式
			if (this.currentType.code == this.typeList[index].code) {
				return false;
			} else {
				this.currentTab = index;
				if (this.currentTab > 2) {
					//这里距离按实际计算
					this.scrollLeft = 300;
				} else {
					this.scrollLeft = 0;
				}
				let model = this.typeList[index];
				this.typeIndex = index;
				this.currentType = model;
				this.page = 1;
				this.orderList = [];
				this.isLoading = false;
				this.initOrderData();
			}
		},
		/**
		 * 查询订单数量
		 */
		fetchOrderCountByStatus(e) {
			this.$http.get(order.getCloudOrderCountURL).then(res => {
				if (res.code == 200) {
					var typeList = this.typeList;
					for (var i = 0; i < this.typeList.length; i++) {
						var model = typeList[i];
						model.count = res.data[model.code];
					}
					this.typeList = typeList;
				} else if (res.code == 5223) {
					uni.showToast({
						title: res.message,
						icon: 'none'
					});
					uni.removeStorageSync('token');
					setTimeout(() => {
						uni.navigateBack({});
					}, 1500);
				}
			});
		},

		/**
		 * 查询订单
		 */
		findOrderList() {
			uni.showLoading({
				title: '加载中..',
				mask: true
			});
			let requestParams = {
				currentPage: this.page,
				pageSize: this.limit,
				orderStatus: this.currentType.code
			};
			this.$http.get(order.getOrderList, requestParams).then(res => {
				if (res.code == 200) {
					if (this.page == 1) {
						var dataList = res.data.records;
						for (var i = 0; i < dataList.length; i++) {
							var model = dataList[i];
							var totalNum = 0;

							if (model.shopArr) {
								for (let shop of model.shopArr) {
									if (shop.num) {
										totalNum += shop.num;
									}
								}
							}
							model.totalNum = totalNum;
						}
						this.orderList = dataList;
						this.isNoMoreData = res.data.records.length == res.data.totalCount;
						this.isLoading = true;
					} else {
						var serverDataList = res.data.records;
						for (var i = 0; i < serverDataList.length; i++) {
							var model = serverDataList[i];
							var totalNum = 0;

							if (model.shopArr) {
								for (let shop of model.shopArr) {
									if (shop.num) {
										totalNum += shop.num;
									}
								}
							}
							model.totalNum = totalNum;
						}
						var dataList = this.orderList;
						dataList = dataList.concat(serverDataList);
						this.orderList = dataList;
						this.isNoMoreData = res.data.records.length < this.limit;
						this.isLoading = true;
					}
				}
				uni.hideLoading();
			});
		},

		/**
		 * 支付按钮事件
		 */
		payButtonAction(orderModel) {
			console.log(orderModel);
			uni.showLoading({
				title: '加载中..',
				mask: true
			});
			// 立即支付
			// 呱呱支付:GUAGUA_ORDER_PAY_METHOD_GUAGUA 线下支付:GUAGUA_ORDER_PAY_METHOD_OFFLINE,模拟支付： GUAGUA_ORDER_PAY_METHOD_OFFLINE
			let orderPayMethod = 'GUAGUA_ORDER_PAY_METHOD_GUAGUA';
			this.$http.post(order.orderToPayActionURL, { orderIds: orderModel.orderId, app: 'WECHAT', orderPayMethod }).then(res => {
				uni.hideLoading();
				if (res.code == 200) {
					if(orderPayMethod == 'GUAGUA_ORDER_PAY_METHOD_OFFLINE') {
						uni.showToast({ title: '支付成功' });
						setTimeout(() => {
							this.initOrderData();
						}, 1500)
					} else if(orderPayMethod == 'GUAGUA_ORDER_PAY_METHOD_GUAGUA') {
						uni.setStorageSync('orderInfo', JSON.stringify({ orderIds: orderModel.orderId, actualPrice: this.prices(orderModel.actualPrice) }))
						this.$store.commit('SET_PAYURL', res.data);
						uni.navigateTo({
							url: `/pages/order/orderPayList/orderPayList`
						});
					}
				} else {
					uni.showToast({
						title: res.message,
						icon: 'none'
					});
				}
			})
		},

		/**
		 * 取消订单按钮事件
		 */
		cancelButtonAction(orderModel) {
			let that = this;
			uni.showModal({
				title: '提示',
				content: '确定取消订单吗？',
				success(res) {
					if (res.confirm) {
						uni.showLoading({ title: '取消订单中..', mask: true });
						that.$http.post(order.shoppingOrderCancelURL, { orderId: orderModel.id }).then(res => {
							uni.hideLoading();
							if (res.code == 200) {
								uni.showToast({ title: '取消成功', icon: 'success' });
								setTimeout(() => {
									that.initOrderData();
								}, 1500)
							} else {
								uni.showToast({ title: res.message, icon: 'icon' });
							}
						});
					}
				}
			});
		},

		/**
		 * 立即评价
		 */
		evaluationButtonAction(orderModel) {
			console.log(orderModel);
			uni.navigateTo({
				url: `/pages/order/evaluation/evaluation?orderId=${orderModel.orderId}&count=${1}`
			});
			// this.$http.get(order.getEvaluateCount, { orderId: orderModel.orderId }).then(res => {
			// 	if (res.code == 200) {
			// 		if (res.data >= 2) {
			// 			uni.showToast({
			// 				title: '订单已评价',
			// 				icon: 'none'
			// 			});
			// 		} else {
			// 			uni.navigateTo({
			// 				url: `/pages/order/evaluation/evaluation?order=${order}&count=${res.data}`
			// 			});
			// 		}
			// 	}
			// });
		},
		// 申请合同
		applyContract(orderModel){
			uni.navigateTo({
				url: `/pages/order/applyContract/applyContract?orderId=${orderModel.orderId}`
			})
		},
		/**
		 * 退单-查看进度
		 */
		backProgressButtonAction(event) {
			let order = event.currentTarget.dataset.order;
			uni.navigateTo({
				url: '/pages/order/orderDetails/orderDetails?orderId=' + order.orderId
			});
		},

		/**
		 * 立即续费
		 */
		renewButtonAction(event) {
			let order = event.currentTarget.dataset.order;
			uni.navigateTo({
				url: `/pages/product/goodsOrder/goodsOrder?order=${order}`
			});
		},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		scrolltolower() {
			console.log(this.isNoMoreData);
			if (this.isNoMoreData) {
				return;
			}

			this.setData({
				page: ++this.page
			});
			this.findOrderList();
		},
		/**
		 * 查看生产进度信息
		 */
		lookProductProgressAction(event) {
			let order = event.currentTarget.dataset.order;
			uni.navigateTo({
				url: '/pages/order/orderDetails/orderDetails?orderId=' + order.id
			});
		},
		setData(obj) {
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
	},
	computed: {
		imageUrl() {
			return this.$config.imgUrl;
		}
	}
};
</script>
<style lang="scss">
/* pages/tabbar/pages/orderList/orderList.css */
/* 选项卡顶部 */
::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}
.tab-view {
	width: 100%;
	height: 96rpx;
	overflow: hidden;
	box-sizing: border-box;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 99;
	background: #ffffff;
	white-space: nowrap;
	&:before {
		content: '';
		position: absolute;
		border-bottom: 1upx solid #d7d8d9;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		bottom: 0;
		right: 0;
		left: 0;
	}
	&::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}
}

.tab-bar-item {
	padding: 0;
	height: 96upx;
	min-width: 80upx;
	margin: 0 28upx;
	line-height: 96rpx;
	display: inline-block;
	text-align: center;
	box-sizing: border-box;
}
.tab-bar-title {
	display: inline-block;
	height: 96rpx;
	line-height: 96rpx;
	font-size: 28rpx;
	color: #252525;
	box-sizing: border-box;
}

.active {
	position: relative;
	z-index: 9999;
	font-size: 28rpx;
	font-weight: bold;
	border-bottom: 9upx solid #10bbb8;
}
.orderListPage {
	width: 100%;
	height: 100vh;
	overflow: hidden;
}

.topMenuBg {
	width: 100%;
	height: 88rpx;
}

/* 标签 */
.topTabLabel {
	min-width: 200rpx !important;
	max-width: 300rpx !important;
}

.listContainer {
	background-color: #f5f5f5;
	height: calc(100% - 100rpx);
	margin-top: 100rpx;
	overflow: auto;
}

.order-list-grid {
	margin: 26rpx 32rpx 0rpx 32rpx;
	border-radius: 10rpx;
	background-color: white;
}
.order-list-grid:last-child {
	margin-bottom: 20rpx;
}

.order-list-grid .headerBg {
	background-color: white;
	display: flex;
	justify-content: space-between;
	font-size: 28rpx;
	padding: 28rpx 32rpx 32rpx 28rpx;
	border-top-left-radius: 10rpx;
	border-top-right-radius: 10rpx;
}

.order-list-grid .headerBg > text:first-child {
	color: #707175;
}

.order-list-grid .headerBg > text:last-child {
	color: #ff984c;
}

.order-list-grid .content {
	margin: 34rpx 28rpx 28rpx 28rpx;
}

.order-list-grid .content .totalMoneyBg {
	text-align: right;
	margin: 20rpx 0rpx;
	color: #a0a3a8;
	font-size: 24rpx;
}

.order-list-grid .content .totalMoneyBg .totalMoney {
	font-size: 34rpx;
	color: #ff6600;
	font-weight: bold;
}

.order-list-grid .content .totalMoneyBg .totalCount {
	color: #3a3b3d;
}

.order-list-grid .content .productList {
	margin-top: 30rpx;
}

.order-list-grid .content .productList .title {
	max-height: 80rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	line-height: 40rpx;
	color: #3a3b3d;
	font-size: 28rpx;
	font-weight: bold;
}

.order-list-grid .content .productList .subtitle {
	max-height: 80rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	line-height: 40rpx;
	color: #a0a3a8;
	font-size: 24rpx;
	font-weight: normal;
	margin-top: 5rpx;
}

.order-list-grid .content .productList .productMoney {
	margin-top: 16rpx;
	font-size: 28rpx;
	color: #3a3b3d;
	font-weight: bold;
}

/* 套餐 */
.order-list-grid .content .packageTitle {
	max-height: 80rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	line-height: 40rpx;
	color: #3a3b3d;
	font-size: 28rpx;
	font-weight: bold;
}

.order-list-grid .content .packageList {
}

.order-list-grid .content .packageList .packageSubtitle {
	max-height: 80rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	line-height: 40rpx;
	color: #a0a3a8;
	font-size: 24rpx;
	font-weight: normal;
	margin-top: 5rpx;
}

.serviceLabelBg {
	width: 100%;
	display: flex;
	display: -webkit-flex;
	flex: 4;
	flex-direction: row;
	flex-wrap: wrap;
}
.serviceLabelBg .service-grid {
	color: #707175;
	font-size: 24rpx;
	padding: 4rpx 12rpx 4rpx 12rpx;
	background: rgba(241, 241, 241, 1);
	margin-right: 20rpx;
	margin-top: 10rpx;
	border-radius: 5rpx;
}

/* 底部操作按钮 */
.orderOperationButtonBg {
	height: 120rpx;
	display: flex;
	justify-content: flex-end;
	align-items: flex-end;
	vertical-align: middle;
}

.orderOperationButtonBg .operationButton {
	width: 160rpx !important;
	height: 60rpx !important;
	line-height: 60rpx;
	font-size: 24rpx;
	border-radius: 30rpx;
	border: 1rpx solid;
	text-align: center;
}

.orderOperationButtonBg .cancelButton {
	color: #707175;
	border-color: #707175;
	margin: 30rpx 0rpx;
}

.orderOperationButtonBg .payButtonNow {
	color: #ff6600;
	border-color: #ff6600;
	margin: 30rpx 26rpx 30rpx 16rpx;
}

.orderOperationButtonBg .applyContract{
	color: #10BBB8;
	border-color: #10BBB8;
	margin: 30rpx 26rpx 30rpx 16rpx;
}
.orderOperationButtonBg .evaluationButton {
	color: #10c5e1;
	border-color: #10c5e1;
	margin: 30rpx 26rpx 30rpx 16rpx;
}

.orderOperationButtonBg .backProgressButton {
	color: #707175;
	border-color: #707175;
	margin: 30rpx 26rpx 30rpx 16rpx;
}

.orderOperationButtonBg .renewButton {
	color: #ff6600;
	border-color: #ff6600;
	margin: 30rpx 26rpx 30rpx 16rpx;
}

/* 查看进度标签 */
.progressBg {
	height: 120rpx;
}

.progressBg .content {
	margin: 20rpx 26rpx 40rpx 26rpx;
	height: 80rpx;
	background-color: #f5f5f5;
	font-size: 24rpx;
	line-height: 80rpx;
	padding: 0rpx 20rpx;
	display: flex;
	justify-content: space-between;
	align-items: space-between;
}

.progressBg .content .leftLabel {
	color: #707175;
}

.progressBg .content .rightLabel {
	color: #10c5e1;
}

.progressBg .content .rightLabel image {
	width: 15rpx;
	height: 25rpx;
	vertical-align: middle;
	margin-left: 15rpx;
}

.bottomNodataText {
	color: #a0a3a8;
	font-size: 28rpx;
	line-height: 28rpx;
	text-align: center;
	height: 80rpx;
	line-height: 80rpx;
}

/* 占位图 */
.Placeholder {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.Placeholder image {
	margin-top: 160rpx;
	height: 278rpx;
	width: 278rpx;
}
.Placeholder text {
	font-size: 24rpx;
	font-family: PingFangSC-Regular;
	font-weight: 400;
	color: rgba(173, 180, 190, 1);
	line-height: 34rpx;
	margin-top: 50rpx;
}
</style>
