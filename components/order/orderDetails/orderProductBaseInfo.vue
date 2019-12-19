<template>
	<view>
		<!--生产信息-->
		<view :hidden="progressData.length == 0" class="productBaseBg">
			<view class="productNode-grid" v-for="(item, name) in progressData" :key="name">
				<view class="topHeaderInfo">
					<view class="title">
						<text>商品：</text>
						<text>{{ item[0].productName }}</text>
					</view>
					<!-- <view class='moreInfo' data-index='{{index}}' catchtap='lookMoreButtonAction'>
        <text>查看更多 </text>
        <image src="{{item.open ? imageBaseURL + 'home_icon_dropup.png' : imageBaseURL + 'home_icon_dropdown.png'}}"></image>
      </view> -->
				</view>
				<view style="background-color:#EBEFF8;height:2rpx;"></view>
				<view class="productInfo" :hidden="!item.open">
					<view class="productLabelText">
						<text>地区：</text>
						<text>{{ currentCity.name }}</text>
					</view>
					<view class="productLabelText">
						<text>下单时间：</text>
						<text>{{ orderInfo.orderTime }}</text>
					</view>
					<view class="productLabelText">
						<text>额外服务：</text>
						<text>--</text>
					</view>
					<view class="productLabelText">
						<text>服务顾问：</text>
						<text>{{ orderInfo.signUserName ? orderInfo.signUserName : '--' }}</text>
					</view>
				</view>
				<view style="background-color:#EBEFF8;height:2rpx;" :hidden="!item.open"></view>
				<!-- 节点信息 -->
				<view class="progressBg">
					<scroll-view class="progress-grids" scroll-x="true">
						<view class="node" v-for="(nodeModel, nodeName) in item[0].progressList" :key="nodeName">
							<view class="progressImage">
								<view :style="index == 0 ? 'background-color:white;' : ''"></view>
								<image :src="imageBaseURL + 'icon_product_node_next.png'"></image>
								<view :style="index == item[0].progressList.length - 1 ? 'background-color:white;' : ''"></view>
							</view>
							<view class="progressName">{{ nodeModel.nodeName }}</view>
							<view class="progressDate">{{ nodeModel.createTime ? nodeModel.createTime : '--' }}</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>

		<!-- 无生产信息 -->
		<view :hidden="progressData.length > 0" class="noProductView">
			<view class="infoView">
				<image :src="imageBaseURL + 'no-order.png'"></image>
				<view>暂无生产信息~</view>
			</view>
		</view>
	</view>
</template>

<script>
import util from '@/utils/util.js';
import { order } from '@/api/index.js'
export default {
	data() {
		return {
			orderId: '',
			productList: [],
			imageBaseURL: this.$config.imgUrl + 'order/',
			progressData: [],
			currentCity: wx.getStorageSync('currentCity')
		};
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
		fetchData: function() {
			console.log('生产信息');
			this.getScProductOrderNodeList(); // this.getOrderBaseInfo();
		},

		/**
		 * 查询销售订单进度
		 */
		getOrderStatusList: function() {
			wx.network.getRequest(order.getOrderStatusListURL,{ orderId: this.orderInfo.orderId }).then(result => {
				if (result.code == 200) {
					this.setData({
						progressData: result.data
					});
				}
			});
		},

		/**
		 * 查询生产订单节点信息
		 */
		getScProductOrderNodeList: function() {
			this.$http.get(order.getOrderProgressListURL, { orderId: this.orderInfo.orderId }).then(result => {
				if (result.code == 200 && result.data.length > 0) {
					var progressList = [];
					for (let progressData of result.data) {
						let tempArray = [];
						for (let i of progressData) {
							let item = i[0];
							item.open = false;
							for (let j of item.progressList) {
								if (j.createTime) {
									j.createTime = util.formatDate(j.createTime);
								}
							}
							tempArray.push(item);
						}
						progressList.push(tempArray);
					}
					this.progressData = progressList
				}
			});
		},

		/**
		 * 查询订单基础信息
		 */
		getOrderBaseInfo: function() {
			this.$http.get(order.getOrderBaseInfoURL, { orderId: this.orderInfo.orderId }).then(result => {
				if (result.code == 200) {
					this.orderInfo = result.data
				}
			});
		},

		/**
		 * 查看更多
		 */
		lookMoreButtonAction: function(e) {
			console.log('展开');
			var index = e.currentTarget.dataset.index;
			var progressData = this.progressData;
			var product = progressData[index];
			product.open = !product.open;
			this.progressData = progressData
		}
	}
};
</script>
<style>
/* pages/order/components/orderProductBaseInfo/orderProductBaseInfo.css */
.productBaseBg {
	margin: 34rpx 32rpx 146rpx 32rpx;
}

/* 节点信息 */
.infoView {
	padding: 100rpx 0;
	font-size: 28rpx;
	line-height: 60rpx;
}
.productNode-grid {
	-webkit-box-shadow: #dcdcdc 0px 0px 10px;
	-moz-box-shadow: #dcdcdc 0px 0px 10px;
	box-shadow: #dcdcdc 0px 0px 10px;
	border-radius: 5rpx;
	margin-bottom: 32rpx;
}

.productNode-grid .topHeaderInfo {
	height: 94rpx;
	display: flex;
	justify-content: space-between;
}

.productNode-grid .topHeaderInfo .title {
	color: #3a3b3d;
	font-size: 28rpx;
	padding: 28rpx;
}

.productNode-grid .topHeaderInfo .moreInfo {
	color: #3a3b3d;
	font-size: 24rpx;
	width: 140rpx;
	line-height: 94rpx;
	margin-right: 28rpx;
	text-align: right;
}

.productNode-grid .topHeaderInfo .moreInfo image {
	width: 25rpx;
	height: 15rpx;
}

.productNode-grid .productInfo {
	font-size: 28rpx;
	margin: 28rpx;
}

.productNode-grid .productInfo .productLabelText {
	display: flex;
	justify-content: space-between;
	min-height: 50rpx;
	line-height: 50rpx;
}

.productNode-grid .productInfo .productLabelText > text:first-child {
	color: #707175;
	text-align: left;
}

.productNode-grid .productInfo .productLabelText > text:last-child {
	color: #707175;
	text-align: right;
	max-width: calc(100% - 140rpx);
}

/* 节点信息 */
.productNode-grid .progressBg {
	width: 100%;
	display: flex;
	flex-direction: row;
	overflow: auto;
}

.productNode-grid .progress-grids {
	white-space: nowrap;
	display: flex;
}

.productNode-grid .progressBg .progress-grids .node {
	width: 200rpx;
	text-align: center;
	padding-bottom: 32rpx;
	display: inline-block;
}

.productNode-grid .progressBg .progress-grids .node .progressImage {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-content: center;
	margin-top: 32rpx;
}

.productNode-grid .progressBg .progress-grids .node .progressImage image {
	width: 42rpx;
	height: 42rpx;
}

.productNode-grid .progressBg .progress-grids .node .progressImage > view {
	width: calc((100% - 42rpx) * 0.5);
	height: 4rpx;
	background-color: #12cb90;
	margin-top: 19rpx;
}

.productNode-grid .progressBg .progress-grids .node .progressImage > view:last-child {
	width: calc((100% - 42rpx) * 0.5);
	height: 4rpx;
	background-color: #12cb90;
}

.productNode-grid .progressBg .progress-grids .node .progressName {
	color: #3a3b3d;
	font-size: 24rpx;
	margin-top: 20rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	line-height: 30rpx;
	padding: 0rpx 10rpx;
	width: calc(100% - 20rpx);
}

.productNode-grid .progressBg .progress-grids .node .progressDate {
	color: #a0a3a8;
	font-size: 20rpx;
	width: 100%;
	min-height: 28rpx;
}

/* 无生产信息 */
.noProductView {
	width: 100%;
	text-align: center;
	font-size: 38rpx;
	color: #a0a3a8;
}

.noProductView .infoView image {
	width: 200rpx;
	height: 200rpx;
}
</style>
