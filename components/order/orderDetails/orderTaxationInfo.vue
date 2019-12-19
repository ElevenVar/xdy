<template>
	<view>
		<!--财税方法-->
		<view class="orderTaxationBg">
			<view class="topHeaderBg">
				<image :src="imageBaseURL + 'product_image_finance_bg.png'"></image>
				<view class="headerContent">
					<view class="left">
						<view>￥{{ filters.toFix(orderInfo.actualPrice * 0.01) }}</view>
						<view>合同总额</view>
					</view>
					<view class="middle"></view>
					<view class="left">
						<view>
							￥{{
								orderInfo.orderStatusCode == 'CLOUD_ORDER_STATUS_NO_PAYMENT' || orderInfo.orderStatusCode == 'CLOUD_ORDER_STATUS_CLOSED'
									? '0.00'
									: financialData.totalMoney
									? filters.toFix(financialData.totalMoney * 0.01)
									: ''
							}}
						</view>
						<view>已付</view>
					</view>
				</view>
			</view>
			<!-- 付款列表 -->
			<view class="payListView">
				<view class="payinfo-grid" v-for="(item, name) in payList" :key="name">
					<view class="money" :style="item.recordType == 1 ? 'color:#FF6600;' : ''">￥{{ item.actualMoney ? filters.toFix(item.actualMoney * 0.01) : '' }}</view>
					<view class="moneyRemark">{{ item.recordType == 0 ? '退款' : '付款' }}</view>
					<!-- <view class='moneyBody'>成都响当当劳务派遣公司</view> -->
					<view class="payWay">
						<text>支付方式：</text>
						<view class="payWayBg">
							<view class="payWay-grids">
								<view class="payWay-grid">{{ item.payMethod }}</view>
								<!-- <view class='payWay-grid' wx:for="{{item.payWayList}}" wx:key="name" wx:for-item="payWayModel">
              {{payWayModel.name}}
            </view> -->
								<view class="payWay-grid">{{ item.paymentMethod }}</view>
							</view>
						</view>
					</view>
					<view class="payDate">{{ item.createTime ? item.createTime : '' }}</view>
					<view :hidden="index == payList.length - 1" style="width:100%;height:2rpx;background-color:#EBEFF8;margin-top:32rpx;"></view>

					<!-- <view hidden='{{index != 1}}' class='receiptBg' style="{{index == (payList.length-1) ? 'bottom: 36rpx;' : ''}}">
        <van-button round custom-class="receiptButton" bind:click="receiptButtonAction">
          <image style='width:40rpx;height:40rpx;margin-top:-5rpx;vertical-align: middle;' src="{{imageBaseURL + 'icon_bankcard.png'}}"></image>
        查看收据
        </van-button>
      </view> -->
				</view>
			</view>
		</view>
	</view>
</template>

<script>
// pages/order/components/orderTaxationInfo/orderTaxationInfo.js
import util from '@/utils/util.js';
import filters from '@/utils/index.js';
import { order } from '@/api/index.js';
export default {
	data() {
		return {
			imageBaseURL: this.$config.imgUrl + 'order/',
			payList: [],
			financialData: {}
		};
	},
	beforeMount() {
		this.filters = filters;
	},
	props: {
		orderInfo: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	mounted() {
		this.fetchData()
	},
	methods: {
		fetchData() {
			this.$http.get(order.getOrderFinanceInfoURL, { orderId: this.orderInfo.orderId }).then(result => {
				if (result.code == 200) {
					var payList = result.data.records;
					for (let model of payList) {
						if (model.createTimeStamp && model.createTimeStamp.length > 0) {
							model.createTime = util.transformTime('' + model.createTimeStamp * 1000);
						}
					}
					this.setData({
						financialData: result.data,
						payList: result.data.records
					});
				}
			});
		},

		/**
		 * 查看收据
		 */
		receiptButtonAction: function(e) {
			console.log('查看收据');
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
/* pages/order/components/orderTaxationInfo/orderTaxationInfo.css */
.orderTaxationBg {
	margin: 0rpx 0rpx 146rpx 0rpx;
}

.topHeaderBg {
	width: 100%;
	height: 206rpx;
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
	height: 206rpx;
	display: flex;
}

.topHeaderBg .headerContent .left {
	width: 50%;
}

.topHeaderBg .headerContent .left > view:first-child {
	padding: 58rpx 32rpx 0rpx 32rpx;
	font-size: 40rpx;
	color: white;
	font-weight: bold;
}

.topHeaderBg .headerContent .left > view:last-child {
	padding: 0rpx 32rpx 0rpx 40rpx;
	font-size: 24rpx;
	color: #707175;
}

.topHeaderBg .headerContent .middle {
	position: absolute;
	left: 50%;
	top: 66rpx;
	bottom: 66rpx;
	width: 2rpx;
	background: #48494f;
}

/* 付款列表 */
.payListView {
	margin-top: 40rpx;
}

.payListView .payinfo-grid {
	padding: 0rpx 32rpx 32rpx 32rpx;
	position: relative;
}

.payListView .payinfo-grid .money {
	color: #12cb90;
	font-size: 40rpx;
	margin-left: -5rpx;
	font-weight: bold;
}

.payListView .payinfo-grid .moneyRemark {
	color: #707175;
	font-size: 24rpx;
}

.payListView .payinfo-grid .moneyBody {
	color: #707175;
	font-size: 28rpx;
	min-height: 60rpx;
	line-height: 60rpx;
	margin-top: 10rpx;
}

.payListView .payinfo-grid .payWay {
	color: #707175;
	font-size: 24rpx;
}

.payListView .payinfo-grid .payWayBg {
	display: inline-block;
	width: calc(100% - 120rpx);
}

.payListView .payinfo-grid .payWayBg .payWay-grids {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
}

.payListView .payinfo-grid .payWayBg .payWay-grids .payWay-grid {
	background-color: #f5f5f5;
	margin-right: 12rpx;
	margin-bottom: 12rpx;
	padding: 2rpx 18rpx;
	border-radius: 38rpx;
}

.payListView .payinfo-grid .payDate {
	color: #a0a3a8;
	font-size: 24rpx;
	margin-top: 0rpx;
}

.payListView .payinfo-grid .receiptBg {
	position: absolute;
	right: 32rpx;
	bottom: 68rpx;
}

.payListView .payinfo-grid .receiptBg .receiptButton {
	width: 218rpx !important;
	height: 64rpx !important;
	line-height: 64rpx !important;
	color: #707175;
	padding: 0rpx;
	font-size: 28rpx;
}
</style>
