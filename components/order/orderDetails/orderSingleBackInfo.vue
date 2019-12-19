<template>
	<!--pages/order/components/orderSingleBackInfo/orderSingleBackInfo.wxml-->
	<view class="singleBackBg">
		<!-- 还没有进度显示 -->
		<view class="noProgressView">
			<view class="showTextLabel">
				<text>服务类型：</text>
				<text>{{ orderBackInfo.refundCode }}</text>
			</view>
			<view class="showTextLabel">
				<text>申请原因：</text>
				<text>{{ orderBackInfo.recordList[0].reasonMsg }}</text>
			</view>
			<view class="showTextLabel">
				<text>申请时间：</text>
				<text>{{ orderBackInfo.createTime }}</text>
			</view>
		</view>
		<!-- 退单进度 -->
		<!-- <view wx:if="{{orderInfo.orderStatusCode != 'CLOUD_ORDER_STATUS_WAIT_CHARGE_BACK'}}" class='backProgress-grid' wx:for="{{progressList}}" wx:key="nodeName">
    <view class='leftView'>
      <image wx:if="{{index == 0}}" src="{{imageBaseURL + 'icon_progress_success.png'}}"></image>
      <view class='progressNum' wx:else>{{index}}</view>
      <view class='verticalLine'></view>
    </view>
    <view class='rightContent'>
      <view class='title'>最终审核，通过</view>
      <view class='subTitle'>退款金额￥5920.00，将于20个工作日内转入支付账户</view>
      <view class='dateLabel'>2019-05-16 19:00</view>
      <text space="ensp">\n</text>
    </view>
  </view> -->
	</view>
</template>

<script>
import { order } from '@/api/index.js'
export default {
	data() {
		return {
			orderBackInfo: {},
			progressList: [{}, {}, {}],
			imageBaseURL: this.$config.imgUrl + 'order/'
		};
	},

	components: {},

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
			this.$http.get(order.getOrderNewRefundURL, { orderId: this.orderInfo.orderId }).then(result => {
				if (result.code == 200) {
					var backRecordList = result.data.reasonJson ? JSON.parse(result.data.reasonJson) : {};
					var backInfo = result.data;
					backInfo['recordList'] = backRecordList;
					this.orderBackInfo = backInfo
				}
			});
		}
	}
};
</script>
<style>
/* pages/order/components/orderSingleBackInfo/orderSingleBackInfo.css */
.singleBackBg {
	margin: 50rpx 32rpx 146rpx 32rpx;
}

.backProgress-grid {
	display: flex;
}

.backProgress-grid .leftView {
	width: 54rpx;
	display: flex;
	flex-direction: column;
	align-content: center;
	text-align: center;
}

.backProgress-grid .leftView image {
	width: 54rpx;
	height: 58rpx;
}

.backProgress-grid .leftView .verticalLine {
	width: 6rpx;
	background-color: #d8dbe4;
	height: calc(100% - 42rpx);
	margin-left: 24rpx;
}

.backProgress-grid .leftView .progressNum {
	width: 42rpx;
	height: 42rpx;
	background-color: #d8dbe4;
	border-radius: 27rpx;
	text-align: center;
	line-height: 42rpx;
	color: #b2b9cb;
	font-size: 28rpx;
	font-weight: bold;
	margin-left: 5rpx;
}

.backProgress-grid:last-child .leftView .verticalLine {
	height: 0rpx;
}

.backProgress-grid .rightContent {
	margin-left: 26rpx;
}

.backProgress-grid .rightContent .title {
	font-size: 28rpx;
	color: #3a3b3d;
	font-weight: bold;
	min-height: 44rpx;
}

.backProgress-grid .rightContent .subTitle {
	font-size: 24rpx;
	color: #707175;
}

.backProgress-grid .rightContent .dateLabel {
	font-size: 24rpx;
	color: #a0a3a8;
	min-height: 40rpx;
	line-height: 40rpx;
}

.noProgressView {
	font-size: 28rpx;
	padding-bottom: 30rpx;
}

.noProgressView .showTextLabel {
	margin-bottom: 16rpx;
}

.noProgressView .showTextLabel > text:first-child {
	color: #707175;
}

.noProgressView .showTextLabel > text:last-child {
	color: #313131;
}
</style>
