<template>
	<!-- S 没有添加商品到购物车 -->
	<view class="no-shop-warp">
		<view class="empty">
			<image class="floorplan" :src="imgUrl + 'shop/no_row.png'"></image>
			<view class="hint-text">
				<view>购物车还是空的</view>
				<view>您还未添加任何商品或服务！</view>
			</view>
			<!-- 登录 -->
			<view class="empty-but" v-if="isLogin">
				<navigator open-type="switchTab" class="but  but-shop" url="/pages/classify/index/index">去购物</navigator>
			</view>
			<!-- 没有登录 -->
			<view v-else>
				<view class="empty-but">
					<navigator open-type="switchTab" class="but" url="/pages/classify/index/index">去购物</navigator>
					<navigator open-type="navigate" class="but but-login" url="/pages/login/login">登录</navigator>
				</view>
			</view>
		</view>
		<!-- 推荐商品 -->
		<view class="recommend-commodities">
			<tui-divider color="#878787" v-if="commodityList.length > 0" :size="28" bgcolor="#F0F2F5" dividerColor="#CCCCCC">推荐商品</tui-divider>
			<view class="dgg-row" style="margin-left: -10rpx;margin-right: -10rpx;">
				<view class="dgg-col dgg-col-5 dgg-gutter-20" v-for="(item,index) in commodityList" :key="index">
					<product-item :item='item'></product-item>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import tuiDivider from "@/components/divider/divider.vue"
	import productItem from "@/components/product-item/pruduct-item.vue"
	import { commodity  } from '@/api/index.js'
	import mixinsShop from '@/common/mixins/shop.js';
	export default {
		components: {
			tuiDivider,
			productItem
		},
		mixins: [mixinsShop],
		props: {
			isLogin: {
				type: Boolean,
				default: false
			}
		},
		data(){
			const imgUrl = this.$config.imgUrl;
			return {
				imgUrl : imgUrl,
				commodityList: []
			}
		},
		mounted() {
			uni.showLoading({
				title: '加载中..'
			})
			this.$http.post(commodity.getCommodityList, { page: 1, limit: 4, cateId: '', comShowClient: 'COUPON_PLAT_1' }).then(res => {
				if(res.code == 200) {
					res.data.data.forEach(val => {
						val.comDefaultSkuPrice = this.price(val.comDefaultSkuPrice)
					})
					this.commodityList = res.data.data
				}
				uni.hideLoading()
			})
		},
		methods: {
			price (str) {
				if(str % 100 == 0) {
					return String(str/100)+'.00'
				} else if(str % 10 == 0) {
					return String(str/100)+'0'
				} else {
					return str/100
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	/* 没有添加商品到购物车
	---------------------------------------------------------------- */
	.no-shop-warp {
		padding: 0 32rpx;

		/* 空状态展位图 */
		.empty {
			text-align: center;

			.floorplan {
				display: block;
				width: 198rpx;
				height: 198rpx;
				margin: 120rpx auto 24rpx;
			}

			.hint-text {
				color: #565656;
				font-size: 28rpx;
				font-weight: 500;
			}

			.empty-but {
				margin-top: 32rpx;

				.but {
					display: inline-block;
					width: 200rpx;
					height: 68rpx;
					line-height: 68rpx;
					border: 1rpx solid rgba(16, 187, 184, 1);
					background-color: rgba(255, 255, 255, 1);
					border-radius: 8rpx;
					margin:0 16rpx;
					color: #10BBB8;
					text-align: center;
					font-size: 32rpx;
					box-sizing: content-box;

					&:last-child {
						margin-left: 0;
					}
				}

				.but-login {
					color: #FFFFFF;
					background-color: #10BBB8;
					box-sizing: content-box;
				}

				.but-shop {
					width: 240rpx;
					color: #FFFFFF;
					background-color: #10BBB8;
					box-sizing: content-box;
				}
			}
		}

		/* 推荐商品 */
		.recommend-commodities {
			margin-top: 120rpx;
		}
	}
</style>
