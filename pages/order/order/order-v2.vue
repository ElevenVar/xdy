<template>
	<view class="container">
		<!-- S 选项卡顶部 -->
		<scroll-view scroll-x scroll-with-animation class="tab-view" :scroll-left="scrollLeft">
			<view 
				class="tab-bar-item" 
				:data-current="index"
				v-for="(item,index) in tabbar" :key="index"
				@tap.stop="swichNav">
				<text 
					class="tab-bar-title"
					:class="[currentTab==index ? 'active' : '']">
					{{`${item.text}(${item.num})`}}
				</text>
			</view>
		</scroll-view>
		<!-- E 选项卡顶部 -->
		
		<!-- S 选项卡内容 -->
		<swiper class="tab-content" :current="currentTab" duration="300" @change="switchTab">
			<swiper-item v-for="(item,index) in tabbar" :key="index">
				<scroll-view scroll-y class="scoll-y">
					<view class="order-view">
						<view class="order-card"
							v-for="(itemY,indexY) in orderList"
                            @tap="handleDetails"
							:key="indexY">
							<view class="order-card-header">
								<view 
									class="title dgg-cl" 
									:class="indexY == 1 ? 'title-counselor' : ''">
									<view class="dgg-fl">订单 {{ itemY.id }}</view>
									<view class="title-r dgg-fr" :class="'title-r-pay'">{{ itemY.orderStatus }}</view>
								</view>
								<view class="counselor" v-if="index == 1">
									经顾问 
									<text class="name">苏城宇</text>
									 发起预订单
								</view>
							</view>
							<view class="order-card-body">
								<view 
									class="card-item"
									v-for="(itemZ,indexZ) in itemY.mainOrderList"
									:key="indexZ">
									<view class="headline">{{ itemZ.productName }}</view>
									<view class="address">科技行业 /12个月 /科技行业 </view>
									<view class="tag">
										<view 
											class="tag-item"
											v-for="(item,index) in itemZ.shopArr"
											:key="index">
											上门服务
										</view>
									</view>
									<view class="price">￥2999</view>
								</view>
								<view class="statistics">
									<view class="num-text">共<text class="num">2</text>件商品 合计：</view>
									<view class="total">
										<text class="symbol">￥</text>
										8999.00
									</view>
								</view>
								<view class="state dgg-cl" v-if="indexY == 1">
									<view class="dgg-fl">工商银行信用资料审核</view>
									<view class="state-r dgg-fr">已完成</view>
								</view>
							</view>
							<view class="order-card-footer">
								<view class="but">取消订单</view>
								<view class="but but-pay">立即支付</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
		<!-- E 选项卡内容 -->
	</view>
</template>

<script>
	import { order } from '@/api/index.js'
	export default {
		data() {
			return {
				tabbar: [
					{
						text: '全部',
						num: 19
					},
					{
						text: '待付款',
						num: 16
					},
					{
						text: '服务中',
						num: 32
					},
					{
						text: '已结项',
						num: 32
					},
					{
						text: '退单',
						num: 32
					}
				],
				currentTab: 0, //预设当前项的值
				scrollLeft: 0, //tab标题的滚动条位置
				params: {
					currentPage: 1,
					pageSize: 10,
					otherParam: '',
					orderStatus: 'ALL'
				},
				orderList: [], // 订单列表
			};
		},
		onLoad() {
			console.log(order)
			this.getOrderData()
		},
		methods:{
			// 获取初始订单数据
			getOrderData() {
				this.$http.get(order.getOrderList, this.params).then(res => {
					if (res.code == 200) {
						console.log(res)
						this.orderList = res.data.records
					}
				})
			},
			switchTab(e) {
				// 滚动切换标签样式
				this.currentTab = e.detail.current;
				this.checkCor();
			},
			swichNav(e){
				// 点击标题切换当前页时改变样式
				let cur = e.currentTarget.dataset.current;
				if (this.currentTab == cur) {
					return false;
				} else {
					this.currentTab = cur
				}
			},
			checkCor() {
				//判断当前滚动超过一屏时，设置tab标题滚动条。
				if (this.currentTab > 3) {
					//这里距离按实际计算
					this.scrollLeft = 300
				} else {
					this.scrollLeft = 0
				}
			},
            handleDetails(){
                // 去详情
                uni.navigateTo({
                    url:'/pages/order/orderDetails/orderDetails'
                })
            }
		}
	}
</script>

<style lang="scss">
	/* 隐藏scroll-view滚动条*/
	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}
	/* 选项卡
	---------------------------------------------------------------- */
	
	/* 选项卡顶部 */
	.tab-view{
		width: 100%;
		height: 96rpx;
		overflow: hidden;
		box-sizing: border-box;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 99;
		background: #FFFFFF;
		white-space: nowrap;
		&:before {
			content: '';
			position: absolute;
			border-bottom: 1upx solid #D7D8D9;
			-webkit-transform: scaleY(0.5);
			transform: scaleY(0.5);
			bottom: 0;
			right: 0;
			left: 0;
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
		font-weight:bold;
		border-bottom: 9upx solid #10BBB8;
	}
	
	/* 选项卡内容 */
	.tab-content{
		margin-top: 96rpx;
		height: calc(100vh - 96rpx);
	}
	.scoll-y{
		height: 100%;
	}
	
	/* 订单信息
	---------------------------------------------------------------- */
	.order-view{
		padding: 0 32rpx;
		&:first-child{
			margin-top: 32rpx;
		}
	}
	
	.order-card{
		background-color: #FFFFFF;
		margin-bottom: 32rpx;
	}
	
	.order-card-header{
		padding: 0 32rpx;
		position: relative;
		box-sizing: border-box;
		&:after{
			content: '';
			position: absolute;
			border-bottom: 1upx solid #D7D8D9;
			-webkit-transform: scaleY(0.5);
			transform: scaleY(0.5);
			bottom: 0;
			right: 0;
			left: 0;
		}
		.title{
			box-sizing: border-box;
			padding-top: 30rpx;
			padding-bottom: 30rpx;
			line-height: 1;
			font-size: 28rpx;
			color: #707175;
			.title-r{
				color: #A0A3A8;
			}
			.title-r-pay{
				color: #FF984C;
			}
		}
		.title-counselor{
			padding-top: 30rpx;
			padding-bottom: 16rpx;
			line-height: 1;
		}
		.counselor{
			font-size: 28rpx;
			color: #707175;
			line-height: 1;
			padding-bottom: 32rpx;
			.name{
				color: #3A3B3D;
				font-weight: bold;
				padding: 0 12rpx;
			}
		}
	}
	.order-card-body{
		padding: 32rpx;
		
		.card-item{
			margin-bottom: 40rpx;
			.headline{
				line-height: 1;
				font-size: 28rpx;
				font-weight: bold;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
			}
			.address{
				margin-top: 16rpx;
				font-size: 24rpx;
				color: #A0A3A8;
			}
			.tag{
				margin-top: 10rpx;
				.tag-item{
					display: inline-block;
					height: 40rpx;
					line-height: 40rpx;
					border-radius: 4rpx;
					background-color: #F5F5F5;
					color: #707175;
					font-size: 24rpx;
					padding: 0 16rpx;
					margin-right: 12rpx;
				}
			}
			.price{
				margin-top: 16rpx;
				line-height: 1;
				color: #3A3B3D;
				font-size: 28rpx;
				font-weight: bold;
			}
		}
		
		.statistics{
			text-align: right;
			margin-top: 40rpx;
			.num-text{
				display: inline-block;
				font-size: 24rpx;
				color: #A0A3A8;
				.num{
					color: #313131;
				}
			}
			.total{
				display: inline-block;
				color: #FF6600;
				font-size: 36rpx;
				font-weight: bold;
				.symbol{
					font-size: 24rpx;
				}
			}
		}
		.state{
			margin-top: 16rpx;
			padding: 0 32rpx;
			height: 80rpx;
			line-height: 80rpx;
			background-color: #F0F2F5;
			color: #707175;
			font-size: 24rpx;
			box-sizing: border-box;
			.state-r{
				color: #10C5E1;
			}
		}
	}
	
	.order-card-footer{
		display: flex;
		align-items: center;
		justify-content: flex-end;
		height: 112rpx;
		padding: 0 32rpx;
		position: relative;
		box-sizing: border-box;
		
		&:before{
			content: '';
			position: absolute;
			border-top: 1upx solid #D7D8D9;
			-webkit-transform: scaleY(0.5);
			transform: scaleY(0.5);
			top: 0;
			right: 0;
			left: 0;
		}
		
		.but{
			height: 60rpx;
			line-height: 60rpx;
			padding: 0 26rpx;
			border: 1rpx solid #A0A3A8;
			color: #707175;
			font-size: 24rpx;
			border-radius: 8rpx;
			margin-right: 16rpx;
			&:last-child{
				margin-right: 0;
			}
		}
		
		.but-pay{
			color: #FF6600;
			border: 1rpx solid #FF6600;
		}
	}
</style>
