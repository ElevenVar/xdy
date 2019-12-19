<template>
	<view>
		<!-- 页面弹框 -->
		<!-- 优惠券上弹框 -->
		<tui-bottom-popup :show="getGiftsPopupShow" @close="close()">
		    <view class="get-gifts-popup">
		        <view class="popup-title-box"><view class="title">领取赠品</view></view>
		        <scroll-view scroll-y class="tui-popup-scroll">
		            <view class="cart-item" v-for="(product, index1) in gifList" :key='index1'>
		            	<view class="item-info-wrap">
		            		<view class="item-info-select">
		            			<label class="checkbox" :class="product.select? 'checked' : ''" @tap="changeSelect(product, 'select')">
		            				<checkbox :checked="product.select" />
		            			</label>
		            		</view>
		            		<image class="item-info-img" :src="product.img" mode=""></image>
		            		<view class="item-info-base">
		            			<view class="item-info-title">{{ product.title }}</view>
		            			<view class="item-info-sku">武侯区/无注册地址/认缴</view>
		            		<view class="item-price-wrap">
		            			<view class="item-price">
		            				￥<text>{{ product.price }}</text>.00
		            			</view>
		            		</view>
		            	</view>
		            </view>
					</view>
		        </scroll-view>
		        <view class="tui-icon tui-icon-close-fill tui-icon-close" style="color: #999;font-size:20px" @tap="close()"></view>
				<button type="primary" class="yes-btn" @tap="yes()">确定</button>
		    </view>
		</tui-bottom-popup>
	</view>
</template>

<script>
	import tuiBottomPopup from '@/components/bottom-popup/bottom-popup';
	export default {
		components: {
			tuiBottomPopup
		},
		props: {
			getGiftsPopupShow: {
				type: Boolean,
				default: false
			},
			list: {
				type: Array,
				default() {
					return []
				}
			}
		},
		computed: {
			gifList() {
				return this.list
			}
		},
		methods: {
			// 告诉父组件关闭弹出层
			close () {
				this.$emit('close')
			},
			yes () {
				this.$emit('yes')
			},
			// 选择状态改版
			changeSelect(product, key) {
				product[key] = !product[key]
				this.$forceUpdate()
			},
		}
	}
</script>

<style lang="scss">
	/* icon 也可以使用组件*/
	@import '../../static/style/icon.css';
/*领取赠品底部选择弹层*/
.tui-popup-class {
	border-top-left-radius: 24rpx;
	border-top-right-radius: 24rpx;
	padding-bottom: env(safe-area-inset-bottom);
}

	.tui-bottom-popup{
		background: none !important;
	}
	.get-gifts-popup{
		.tui-popup-scroll{
			border-bottom: 1px solid #d7d8d9;;
		}
		.popup-title-box {
		    line-height: 100rpx;
		    height: 100rpx;
		    text-align: center;
		    color: #252525;
		    font-size: 32rpx;
		    font-weight: bold;
		    border-bottom: 1px solid #d7d8d9;
			border-radius:24rpx 24rpx 0rpx 0rpx;
			background: #fff;
		}
		.coupon-box {
		    display: flex;
		    align-items: center;
		    width: 100%;
		    height: 200rpx;
		    border-radius: 10rpx 0 0 10rpx;
		    margin-bottom: 16rpx;
		}
		.tui-icon-close{
			position: absolute;
			right: 32rpx;
			top: 32rpx;
		}
		.yes-btn{
			display: block;
			width:686rpx;
			height:76rpx;
			margin: 12rpx auto 12rpx;
			background:rgba(16,187,184,1);
			border-radius:8rpx;
			color: #fff;
		}
		// 商品列表
		.cart-item{
			width: 100%;
			overflow: hidden;
			padding: 32rpx;
			box-sizing: border-box;
			display: flex;
			background: #fff;
			flex-direction: column;
			&.cart-item-top{
				margin-top: 16rpx;
			}
			.item-info-wrap{
				width: 100%;
				height: 160rpx;
				display: flex;
				.item-info-select{
					width: 36rpx;
					height: 100%;
					display: flex;
					align-items: center;
				}
				.item-info-img{
					width:160rpx;
					height:160rpx;
					margin-left: 32rpx;
				}
				.item-info-base{
					flex: 1;
					height: 100%;
					line-height: 1;
					display: flex;
					flex-direction: column;
					margin-left:25rpx;
					.item-info-title{
						font-size:28rpx;
						font-family:PingFang SC;
						font-weight:bold;
						color:rgba(37,37,37,1);
					}
					.item-info-sku{
						width:432rpx;
						height:38rpx;
						margin-top: 23rpx;
						margin-bottom: 35rpx;
						font-size:22rpx;
						font-family:PingFang SC;
						font-weight:500;
						color:rgba(135,135,135,1);
						line-height: 30rpx;
						text-indent: 17rpx;
					}
					.item-price-wrap{
						font-size:24rpx;
						font-family:PingFang SC;
						font-weight:bold;
						display: flex;
						justify-content: space-between;
						color:rgba(255,102,0,1);
						text{
							font-size: 36rpx;
						}
					}
					.item-num-wrap{
						display: flex;
						color:rgba(37,37,37,1);
						font-size:24rpx;
						font-family:DIN;
						font-weight:bold;
						align-items: center;
						.redux{
							width:24rpx;
							height:4rpx;
							background:rgba(86,86,86,1);
							border-radius:2px;
							&.no{
								background:rgba(240,242,245,1);
							}
						}
						input{
							width:90rpx;
							height:40rpx;
							background:rgba(240,242,245,1);
							text-align: center;
							margin: 0 16rpx;
						}
					}
				}
			}
		}
		.checkbox {
					width: 38rpx;
					height: 38rpx;
					background-size: 38rpx 38rpx;
					border:1px solid rgba(204,204,204,1);
				border-radius:50%;
			checkbox{
				opacity: 0;
				position: relative;
				z-index: 999;
			}
			&.checked{
				position: relative;
				border:1px solid #10BBB8;
				&::after{
					content: '\2713';
					color: #fff;
					background: #10BBB8;
					position: absolute;
				border-radius:50%;
				font-size: 24rpx;
					width: 38rpx;
					left: 0;
					position: absolute;
					z-index: 0;
					top: 0;
					height: 38rpx;
					text-align: center;
					line-height: 38rpx;
					z-index: 1;
				}
			}
		}
	}
</style>
