<template>
	<view class="container page-view">
		<!-- S 选项卡顶部 -->
		<view class="tab-view">
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
		</view>
		<!-- E 选项卡顶部 -->
		
		<!-- S 选项卡内容 -->
		<view class="tab-content">
			<!-- 有券 -->
			<scroll-view scroll-y class="scoll-y" v-if="isCoupon">
				<tui-swipe-action 
					class="swipe-action"
					:actions="actions"  
					@click="handlerButton" 
					v-for="(item,index) in couponRow"
					:key="index" 
					:params="item">
					<template v-slot:content>
						<view 
							class="coupon-view"
							:class="item.state == 2 || item.state == 3 ? 'coupon-view-gray' : ''">
							<view class="coupon-item">
								<view class="coupon-wave-left">
									<view class="title">三只松鼠零食大礼包</view>
									<view class="data">2017.10.20-2017.12.38</view>
								</view>
								
								<view class="coupon-wave-right" v-if="item.state == 1">立即使用</view>
								
								<image
									class="coupon-wave-img" 
									v-if="item.state == 2" 
									:src="imgUrl+ 'coupon/use.png'">
								</image>
								
								<image 
									class="coupon-wave-img" 
									v-if="item.state == 3" 
									:src="imgUrl+ 'coupon/past.png'">
								</image>
							</view>
						</view>
					</template>
				</tui-swipe-action>
			</scroll-view>
			<!-- 无券 -->
			
			<view class="no-coupon" v-else>
				<image 
					class="no-coupon-img"
					:src="imgUrl+ 'coupon/no-coupon.png'">
				</image>
				<view class="no-coupon-text">暂无优惠券</view>
			</view>
		</view>
		<!-- E 选项卡内容 -->
	</view>
</template>

<script>
	import tuiSwipeAction from "@/components/swipe-action/swipe-action"
	export default {
		name: "couponPage",
		components:{
			tuiSwipeAction
		},
		data() {
			const imgUrl = this.$config.imgUrl;
			return {
				imgUrl : imgUrl,
				tabbar: [
					{
						text: '未使用',
						num: 19
					},
					{
						text: '已使用',
						num: 16
					},
					{
						text: '已过期',
						num: 32
					}
				],
				currentTab: 0, //预设当前项的值
				actions: [{
						name: '删除',
						color: '#fff',
						fontsize: 28,//单位upx
						width: 80, //单位px
						//icon: 'like.png',//此处为图片地址
						background: '#ed3f14'
					}
				],
				couponRow: [
					{
						price: 500,
						state: 1
					},
					{
						price: 8.8,
						state: 2
					},
					{
						price: 8.8,
						state: 3
					}
				],
				isCoupon: true, // 是否有优惠券
			};
		},
		methods:{
			swichNav(e){
				// 点击标题切换当前页时改变样式
				let cur = e.currentTarget.dataset.current;
				if (this.currentTab == cur) {
					return false;
				} else {
					this.currentTab = cur
				}
			},
			handlerButton(){
				
			}
		}
	}
</script>
<style scoped>
	.swipe-action >>> .tui-swipeout-wrap{
		margin-bottom: 32rpx;
	}	
</style>
<style lang="scss" scoped>
	.page-view{
		background: #FFFFFF !important;
		width: 100vw;
		height: 100vh;
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
		width: 33.3333%;
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
		box-sizing: border-box;
		padding-top: 32rpx;
	}
	
	
	/* 优惠券
	---------------------------------------------------------------- */
	.coupon-view{
		position: relative;
		padding: 0 32rpx;
	}
	.coupon-item{
		height: 200rpx;
		background: #F4F4F4;
		border-radius: 10rpx 0px 0px 10rpx;
		overflow: hidden;
		position: relative;
		padding-right: 172rpx;
	}
	
	.coupon-wave-left{
		height: 200rpx;
		padding: 32rpx;
		box-sizing: border-box;
		background: url(https://dgg-xiaodingyun.oss-cn-beijing.aliyuncs.com/xdy-xcx/gift/bg.png) no-repeat;
		background-size: 100% 100%;
		border-radius:10rpx 0px 0px 10rpx;
		
		.title{
			color: #FFFFFF;
			font-weight: bold;
			font-size: 32rpx;
			line-height: 1;
		}
		.data{
			margin-top: 20rpx;
			color: #FFFFFF;
			font-size: 24rpx;
		}
	}
	
	.coupon-wave-right{
		width: 172rpx;
		height: 200rpx;
		position: absolute;
		top: 0;
		right: 0;
		line-height: 200rpx;
		text-align: center;
		color: #10BBB8;
		font-weight:bold;
	}
	.coupon-wave-img{
		position: absolute;
		right: 0;
		bottom: 0;
		width: 114rpx;
		height: 114rpx;
	}
	
	
	.coupon-view-gray{
		.coupon-wave-left{
			background: url(https://dgg-xiaodingyun.oss-cn-beijing.aliyuncs.com/xdy-xcx/gift/bg_gray.png) no-repeat;
			background-size: 100% 100%;
		}
	}
	
	/* 无优惠券
	---------------------------------------------------------------- */
	.no-coupon-img{
		display: block;
		margin: 240rpx auto 30rpx;
		width: 198rpx;
		height: 198rpx;
	}
	.no-coupon-text{
		font-size: 28rpx;
		color: #565656;
		font-weight:500;
		text-align: center;
	}
</style>
