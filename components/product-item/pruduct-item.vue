<template>
	<view class="commodity" @tap="handleJump(item.comDefaultSkuCode, item.cateLink)">
		<view class="image" :style="{'background': `url(${item.comDefaultSkuImg ? item.comDefaultSkuImg : altImg}) center/cover no-repeat`}">
            <!-- <image :src="item.comDefaultSkuImg ? item.comDefaultSkuImg : altImg"></image> --></view>
		<view class="title">{{ item.comName }}</view>
		<view class="tag">
			<view class="tag-item" v-if="item.commodityPromotionLabel.compLabelName">{{ item.commodityPromotionLabel.compLabelName }}</view>
		</view>
		<view class="price">
			<view class="ellipsis" v-if='item.comSkuIsDiscuss == 0'>
				<text class="dollar-sign">￥</text>
				{{ item.comDefaultSkuPrice }}
			</view>
            <block v-else>
                <view class="ellipsis">
                	面议
                </view>
            </block>
			<view class="cartBtn" v-if="cartBtnShow" @tap.stop="handleSku(item)"><tui-icon class="icon" name="cart" :size="16" color="#FF6600"></tui-icon></view>
		</view>
		<view class="num">
			<!-- <view class="num-item ellipsis">浏览: {{item.comPageViewSum}}</view> -->
			<view class="num-item ellipsis">销量: {{ item.comSalesVolumeSum }}</view>
		</view>
	</view>
</template>

<script>
// 产品列表 item 组件
import tuiIcon from '@/components/icon/icon';
export default {
	components: {
		tuiIcon
	},
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
					comPageViewSum: 10,
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
	width: 335rpx;
	min-height: 513rpx;
	background: rgba(255, 255, 255, 1);
	margin-bottom: 20rpx;
	padding: 24rpx;
	box-sizing: border-box;
	position: relative;
	.image {
		height: 287rpx;
		image {
			width: 100%;
			height: 100%;
		}
	}
	.title {
		margin-top: 20rpx;
		font-size: 28rpx;
		font-weight: bold;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.tag {
		margin-top: 16rpx;
        height: 40rpx;
		.tag-item {
			display: inline-block;
			margin-right: 8rpx;
			height: 40rpx;
			line-height: 40rpx;
			font-size: 22rpx;
			padding: 0 12rpx;
			background: rgba(255, 242, 235, 1);
			border-radius: 4rpx;
			color: rgba(255, 102, 0, 1);
		}
	}
	.price {
		margin-top: 24rpx;
		font-size: 32rpx;
		font-weight: bold;
		color: rgba(255, 102, 0, 1);
		display: flex;
		justify-content: space-between;
		align-items: center;
		.dollar-sign {
			font-size: 24rpx;
			margin-right: 7rpx;
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
		margin-top: 12rpx;
		font-size: 22rpx;
		font-weight: 500;
		color: rgba(135, 135, 135, 1);
		display: flex;
		align-items: center;
		justify-content: space-between;
		.num-item {
			flex: 1;
		}
	}
}
</style>
