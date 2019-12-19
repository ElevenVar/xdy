<template>
	<view class="orderDetailPage" v-show="orderInfo">
		<view class="topHeaderInfo">
			<view class="orderNoLabelBg">
				<view class="title">
					<text>订单编号：</text>
					<text>{{ orderInfo.orderNumber }}</text>
				</view>
				<view class="rightContent">{{ orderInfo.orderStatus }}</view>
			</view>
			<view class="title">
				<text>下单时间：</text>
				<text>{{ orderInfo.orderTime }}</text>
			</view>
			<view class="title">
				<text>总金额：</text>
				<text>￥{{ orderInfo.actualPrice ? filters.toFix(orderInfo.actualPrice * 0.01) : '--' }}</text>
			</view>
			<view class="serviceConsultant">
				<view class="title" style="margin:8rpx 0rpx;">
					<text>服务顾问：</text>
					<text>{{ orderInfo.signUserName ? orderInfo.signUserName : '--' }}</text>
				</view>
					<!-- <button class="operationButton singleBackButton" v-if="orderInfo.orderStatusCode=='CLOUD_ORDER_STATUS_WAIT_HANDLE'" @tap="singleCancelBackButtonAction(orderInfo)">取消退单</button> -->
					<button class="operationButton singleBackButton" v-if="orderInfo.orderStatusCode=='CLOUD_ORDER_STATUS_WAIT_HANDLE'" @tap="singleBackButtonAction(orderInfo)">退单</button>
			
			</view>
		</view>
		<view class="lineView"></view>
		<!-- tab -->
		<view class="topTagBgView">
			<scroll-view class="label-grids" scroll-x="true">
				<view v-for="(item, index) in tabbarItem" :key="index" class="label-grid" :data-index="index" @click.stop="tabbarAction">
					<text :style="tabbarIndex == index ? 'color:rgba(58,59,61,1);' : 'color:#707175;'">{{ item.name }}</text>
					<view class="bottomLine" :hidden="tabbarIndex != index"></view>
				</view>
			</scroll-view>
		</view>
		<!-- 退单信息 -->
		<view v-if="currentTabbarTarget == 'backOrder'&&orderInfo"><order-singback-info :orderInfo="orderInfo" id="backOrder"></order-singback-info></view>
		<!-- 生产信息 -->
		<view v-if="currentTabbarTarget == 'product'&&orderInfo"><order-product-info :orderInfo="orderInfo" id="product"></order-product-info></view>
		<!-- 会计生产信息 -->
		<view v-if="currentTabbarTarget == 'accountProduct'&&orderInfo"><order-account-info :orderInfo="orderInfo" id="accountProduct"></order-account-info></view>
		<!-- 财务信息 -->
		<view v-if="currentTabbarTarget == 'taxation'&&orderInfo"><order-taxation-info :orderInfo="orderInfo" id="taxation"></order-taxation-info></view>
		<!-- 合同信息 -->
		<view v-if="currentTabbarTarget == 'contract'&&orderInfo"><order-contract-info :contractNo="orderInfo.contractNo" id="contract"></order-contract-info></view>

		<!-- 底部客服 -->
		<view class="bottomView">
			<!-- <view class="complaintButton" catchtap="complaintButtonAction">
				<image class="bottom-button-image" :src="imageUrl + 'order/order_icon_complaint.png'"></image>
				<text>投诉</text>
			</view> -->
			<button class="serviceOnlineButton" open-type="contact">
				<image class="bottom-button-image" :src="imageUrl + 'order/order_icon_customer.png'"></image>
				<text>在线客服</text>
			</button>
		</view>
	</view>
</template>

<script>
const app = getApp();
import filters from '@/utils/index.js';
import { order } from '@/api/index.js';
import orderProductInfo from '@/components/order/orderDetails/orderProductBaseInfo';
import orderTaxationInfo from '@/components/order/orderDetails/orderTaxationInfo';
import orderContractInfo from '@/components/order/orderDetails/orderContractInfo';
import orderSingbackInfo from '@/components/order/orderDetails/orderSingleBackInfo';
import orderAccountInfo from '@/components/order/orderDetails/accountProductInfo';

export default {
	data() {
		return {
			tabbarItem: [],
			tabbarIndex: undefined,
			currentTabbarTarget: '',
			orderId: '',
			orderInfo: false,
			filters: filters,
			imageUrl: this.$config.imgUrl
		};
	},
	onHide: function() {},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		console.log(options)
		if(options.type){
			this.currentTabbarTarget = options.type
			console.log(this.currentTabbarTarget)
			this.tabbarIndex = 2
		}
		this.orderId = options.orderId;
		this.getOrderBaseInfo();
	},
	onShow() {
		if(uni.getStorageSync('orderChange')) {
			this.getOrderBaseInfo();
		}
	},
	components: {
		orderProductInfo,
		orderTaxationInfo,
		orderContractInfo,
		orderSingbackInfo,
		orderAccountInfo
	},
	methods: {
		/**
		 * 查询订单基础信息
		 */
		getOrderBaseInfo: function() {
			uni.showLoading({ title: '加载中..' })
			this.$http.get(order.getOrderBaseInfoURL, { orderId: this.orderId }).then(result => {
				if (result.code == 200) {
					this.orderInfo = result.data;
					this.handleShowTabbarItem();
				}
				uni.hideLoading()
			});
		},
		/**
		 * 根据不同状态显示不同信息
		 */
		handleShowTabbarItem: function(event) {
			let orderStatusCode = this.orderInfo.orderStatusCode;
			console.log(orderStatusCode);
			if (orderStatusCode == 'CLOUD_ORDER_STATUS_WAIT_CHARGE_BACK' ||
				orderStatusCode == 'CLOUD_ORDER_STATUS_WAIT_CHARGE_BACKING' ||
				orderStatusCode == 'CLOUD_ORDER_STATUS_CHARGE_BACK_SUCCESS' ||
				orderStatusCode == 'CLOUD_ORDER_STATUS_WAIT_REFUND' ||
				orderStatusCode == 'CLOUD_ORDER_STATUS_WAIT_REFUNDING' ||
				orderStatusCode == 'CLOUD_ORDER_STATUS_REFUND_REJECT' ||
				orderStatusCode == 'CLOUD_ORDER_STATUS_REFUND_SUCCESS'
			) {
				//orderStatusCode == 'CLOUD_ORDER_STATUS_CHARGE_BACK_REJECT' ||
				var tabbarItem = [
					{
						name: '退单信息',
						target: 'backOrder'
					},
					{
						name: '财务信息',
						target: 'taxation'
					},
					{
						name: '合同信息',
						target: 'contract'
					}
				];
				(this.tabbarItem = tabbarItem), (this.tabbarIndex = 0), (this.currentTabbarTarget = 'backOrder');
			} else {
				var tabbarItem = [
					{
						name: '生产信息',
						target: 'product'
					},
					{
						name: '财务信息',
						target: 'taxation'
					},
					{
						name: '合同信息',
						target: 'contract'
					}
				];
				this.tabbarItem = tabbarItem;
				if(!this.currentTabbarTarget){
					this.tabbarIndex = 0;
					this.currentTabbarTarget = 'product';
				}
			}
		},

		/**
		 * 退单
		 */
		singleBackButtonAction(item) {
			uni.navigateTo({
				url: `/pages/order/orderSingleBack/orderSingleBack?order=${JSON.stringify(this.orderInfo)}`
			})
		},

		/**
		 * 取消退单
		 */
		singleCancelBackButtonAction(item) {
			console.log(item);
		},

		/**
		 * 标签栏点击事件
		 */
		tabbarAction: function(e) {
			var index = e.currentTarget.dataset.index;
			let selectedItem = this.tabbarItem[index];
			this.currentTabbarTarget = selectedItem.target;
			this.tabbarIndex = index
		},
		/**
		 * 投诉
		 */
		complaintButtonAction: function(e) {
			uni.navigateTo({
				url: '../orderComplaints/orderComplaints'
			});
		},

		/**
		 * 在线客服
		 */
		serviceOnlineButtonAction: function(e) {
			uni.makePhoneCall({
				phoneNumber: uni.getStorageSync('serviceTel')
			});
		}
	}
};
</script>
<style>
/* pages/order/orderDetailInfo/orderDetailInfo.css */
.orderDetailPage {
	background-color: white;
}

.topHeaderInfo {
	padding: 10rpx 32rpx 16rpx 32rpx;
}

.topHeaderInfo .orderNoLabelBg {
	display: flex;
	justify-content: space-between;
}

.title {
	font-size: 28rpx;
	line-height: 56rpx;
}

.title > text:first-child {
	color: #707175;
}

.title > text:last-child {
	color: #3a3b3d;
	font-weight: bold;
}

.topHeaderInfo .orderNoLabelBg .rightContent {
	font-size: 28rpx;
	color: #ff984c;
	line-height: 56rpx;
}

.lineView {
	height: 20rpx;
	background-color: #f5f5f5;
}

/* 标签页面 */

.topTagBgView {
	width: 100%;
	height: 80rpx;
}

.topTagBgView .label-grids {
	width: 100%;
	height: 100%;
	white-space: nowrap;
	display: flex;
	border-bottom: solid;
	border-bottom-color: rgba(245, 245, 245, 1);
	border-bottom-width: 1rpx;
}

.topTagBgView .label-grids .label-grid {
	display: inline-block;
	text-align: center;
	width: 33.33%;
	height: 100%;
}

.topTagBgView .label-grids .label-grid text {
	line-height: 74rpx;
	font-size: 28rpx;
	font-family: PingFangSC-Medium;
	font-weight: 500;
	color: rgba(58, 59, 61, 1);
}

.topTagBgView .label-grids .label-grid .bottomLine {
	width: 100rpx;
	height: 6rpx;
	background-color: #231815;
	margin-left: 73rpx;
	border-radius: 5rpx;
}

.serviceConsultant {
	display: flex;
	justify-content: space-between;
	line-height: 60rpx;
}

.operationButton {
	min-width: 160rpx !important;
	height: 60rpx !important;
	line-height: 60rpx !important;
	font-size: 24rpx;margin-right: 0;
}

.singleBackButton {
	color: #707175;
	border-color: #707175;
	/* float: right; */
}

/* 底部操作 */
.bottomView {
	position: fixed;
	bottom: 0rpx;
	left: 0rpx;
	right: 0rpx;
	height: 114rpx;
	width: 100%;
	background-color: white;
	border-top: 1rpx #f5f5f5 solid;
	z-index: 10;
	display: flex;
	display: -webkit-flex;
	align-items: center;
	justify-content: space-around;
	-webkit-justify-content: space-around;
	text-align: center;
	color: #707175;
	font-size: 28rpx;
}

.bottom-button-image {
	width: 50rpx;
	height: 48rpx;
	vertical-align: middle;
	margin-top: -10rpx;
	margin-right: 16rpx;
}

.bottomView .complaintButton {
	width: 30%;
	height: 100%;
	line-height: 114rpx;
	border-right: 2rpx #ebeff8 solid;
}

.bottomView .serviceOnlineButton {
	width: 100%;
	height: 100%;
	line-height: 114rpx;
}
</style>
