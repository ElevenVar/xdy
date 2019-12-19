<template>
	<view class="commodity" @click="handleJump(item.comDefaultSkuCode, item.cateLink)">
		<view class="img"><image :src="item.comDefaultSkuImg ? item.comDefaultSkuImg : altImg"></image></view>
		<view class="product-info">
			<view class="title-wrap">
				<view class="title">{{ item.comName }}</view>
			</view>
			<!-- <view class="tag">
        <text class="tag-item" v-for="(items, index) in ['满减']" :key="index">{{ items }}</text>
      </view> -->
			<view class="num">
				<!-- <view class="num-item ellipsis">浏览: {{item.comPageviewSum}}</view> -->
				<view class="num-item ellipsis">{{ item.comRemark }}</view>
			</view>
			<view class="tag-wrap" v-if="item.commodityPromotionLabel">
				<view class="num-item ellipsis" v-if="item.commodityPromotionLabel.compLabelName">{{ item.commodityPromotionLabel.compLabelName }}</view>
			</view>
			<view class="price">
				<view class="ellipsis" v-if="item.comSkuIsDiscuss==0">
					<text class="dollar-sign">￥</text>
					{{ item.comDefaultSkuPrice | price }}
				</view>
				<view class="ellipsis" v-else>
					面议
				</view>
				<view class="cartBtn" v-if="cartBtnShow" @click.stop="handleSku(item)"></view>
			</view>
		</view>
	</view>
</template>

<script>
// 产品列表 item 组件
import mixinsShop from '@/common/mixins/shop.js';
export default {
	components: {},
	mixins: [mixinsShop],
	computed: {
		altImg() {
			return this.$store.state.altImg;
		}
	},
	props: {
		item: {
			type: Object,
			default: () => {
				return {
					comDefaultSkuImg: 'http://www.dggcn.com/uploadfile/2019/0424/20190424054120975.jpg',
					comName: '会计代理服务',
					comDefaultSkuPrice: 500,
					comPageviewSum: 10,
					comSalesVolumeSum: 66
				};
			}
		},
		cartBtnShow: false // 是否显示有添加到购物车的按钮 默认不显示
	},
	data() {
		const url = this.$config.imgUrl;
		return {
			imgBaseUrl: url
		};
	},
	methods: {
		handleJump(e, cateLink) {
			if (cateLink) {
				this.$store.commit('SET_WEB_VIEW_URL', cateLink);
				uni.navigateTo({
					url: '/pages/webView/webView'
				});
			} else {
				uni.navigateTo({
					url: '/pages/productDetails/productDetails?skuCode=' + e
				});
			}
		},
		// 购物车图标点击事件
		handleSku(e) {
			this.$emit('handleSku', e);
		}
	}
};
</script>
<style lang="scss">
.commodity {
	width: 100%;
	background: rgba(255, 255, 255, 1);
	margin-bottom: 20rpx;
	padding: 32rpx 32rpx 16rpx 32rpx;
	box-sizing: border-box;
	position: relative;
	// height:284rpx;
	display: flex;
	// padding-bottom: 0;
	.img {
		width: 120rpx;
		height: 120rpx;
		image {
			width: 100%;
			height: 100%;
		}
	}
	.product-info {
		padding-left: 24rpx;
		flex: 1;
		overflow: hidden;
	}
	.title {
		font-size: 28rpx;
		font-weight: bold;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		flex: 1;
		line-height: 32rpx;
	}
	.title-wrap {
		height: 30rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}
	.tag-wrap {
		width: 100%;
		overflow: hidden;
		margin-top: 20rpx;
		view {
			// width: 110rpx;
            display: inline-block;
            padding: 0 8rpx;
			border-radius: 4rpx;
			font-size: 22rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(135, 135, 135, 1);
			text-align: center;
			border: 2rpx solid rgba(215, 216, 217, 1);
		}
	}
	.tag {
		max-width: 90rpx;
		display: flex;
		margin: 20rpx 0;
		.tag-item {
			display: block;
			margin-right: 8rpx;
			font-size: 22rpx;
			padding: 2rpx 12rpx;
			background: rgba(255, 242, 235, 1);
			border-radius: 4rpx;
			color: rgba(255, 102, 0, 1);
		}
	}
	.price {
		line-height: 1.2;
		font-size: 36rpx;
        margin-top: 22rpx;
		font-weight: bold;
		color: rgba(255, 102, 0, 1);
		display: flex;
		justify-content: space-between;
		align-items: center;
		.dollar-sign {
			font-size: 24rpx;
		}
		.cartBtn {
			width: 46rpx;
			height: 46rpx;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			background: #fff2eb;
			color: #ffffff;
			font-size: 22rpx;
			font-weight: 500;
			position: absolute;
			right: 24rpx;
			bottom: 42rpx;
			.icon {
				margin-right: 4rpx;
			}
		}
	}
	.num {
		font-size: 22rpx;
		font-weight: 500;
		color: rgba(135, 135, 135, 1);
		display: flex;
		margin-top: 20rpx;
		align-items: center;
		justify-content: space-between;
		.num-item {
			flex: 1;
			line-height: 1;
		}
	}
}
</style>
