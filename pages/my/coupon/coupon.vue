<template>
	<view class="container page-view">
		<!-- S 选项卡顶部 -->
		<view class="tab-view">
			<view 
				class="tab-bar-item" 
				:data-status="item.status"
				v-for="(item,index) in tabbar" 
				:key="index"
				@tap.stop="swichNav">
				<text 
					class="tab-bar-title"
					:class="[currentTab == item.status ? 'active' : '']">
					{{`${item.text}(${item.num})`}}
				</text>
			</view>
		</view>
		<!-- E 选项卡顶部 -->
		
		<!-- S 选项卡内容 -->
		<view class="tab-content">
			<dgg-scroll 
				ref="scroll" 
				class="scoll-y" 
				@onPullDown="onPullDown"
				@onLoadMore="onLoadMore">
				<!-- 有券 -->
				<view v-if="isCoupon">
					<tui-swipe-action 
						class="swipe-action"
						:actions="actions"  
						@click="handlerButton"
						v-for="row in couponRow"
						:key="row.item.no" 
						:params="row">
						<template v-slot:content>
							<view 
								class="coupon-view"
								:class="row.item.status == 0 && row.coupon.type === 'COUPON_TYPE_ZK'  ? 'coupon-view-red' : (row.item.status == 1 || row.item.status == 3 ? 'coupon-view-gray' : '')">
								<view class="coupon-item" @tap="handleDetail(row.item.status,row.item.no)">
									<view class="coupon-wave-left">
										<view class="price" v-if="row.coupon.type === 'COUPON_TYPE_ZK'">
											{{row.coupon.amount / 10}}
											<text class="discount">折</text>
										</view>
										<view class="price" v-else>
											{{row.coupon.amount / 100}}
											<text class="discount">元</text>
										</view>
										<view class="condition">满{{row.coupon.denomination / 100}}元可用</view>
									</view>
									
									<view class="coupon-wave-right">
										<view class="headline">{{row.coupon.productType == 0 ? '全部商品通用': '限部分商品可用'}}</view>
										<view class="employ-warp dgg-cl">
											<view class="data dgg-fl">
												{{row.item.sTime.split(' ')[0].replace(/-/g, '.')}}-{{row.item.eTime.split(' ')[0].replace(/-/g, '.')}}
											</view>
											<view 
												class="but dgg-fr" 
												v-if="row.item.status != 1 && row.item.status != 3"
												@tap.stop="handleJump(row.coupon.productType, row.coupon)">
												立即使用
											</view>
										</view>
									</view>
									
									<image
										class="coupon-wave-img" 
										v-if="row.item.status == 1" 
										:src="imgUrl+ 'coupon/use.png'">
									</image>
									
									<image 
										class="coupon-wave-img" 
										v-if="row.item.status == 3" 
										:src="imgUrl+ 'coupon/past.png'">
									</image>
								</view>
							</view>
						</template>
					</tui-swipe-action>
					
					<tui-loadmore :visible="loding" :index="3"></tui-loadmore>
					<tui-nomore :visible="nomore" text="已经到底了~"></tui-nomore>
				</view>
			
				<!-- 无券 -->
				<view class="no-coupon" v-else>
					<image 
						class="no-coupon-img"
						:src="imgUrl+ 'coupon/no-coupon.png'">
					</image>
					<view class="no-coupon-text">暂无优惠券</view>
				</view>
			</dgg-scroll>
		</view>
		<!-- E 选项卡内容 -->
	</view>
</template>

<script>
	import tuiSwipeAction from "@/components/swipe-action/swipe-action"
	import dggScroll from "@/components/dgg-scroll/dgg-scroll.vue"
	import tuiNomore from "@/components/nomore/nomore"
	import tuiLoadmore from "@/components/loadmore/loadmore"
	import {coupon} from "@/api/index.js"
	
	export default {
		name: "couponPage",
		components:{
			tuiSwipeAction,
			dggScroll,
			tuiLoadmore,
			tuiNomore
		},
		data() {
			const imgUrl = this.$config.imgUrl;
			return {
				imgUrl : imgUrl,
				tabbar: [
					{
						text: '未使用',
						status: 0,
						num: 0
					},
					{
						text: '已使用',
						status: 1,
						num: 0
					},
					{
						text: '已过期',
						status: 3,
						num: 0
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
				couponRow: [],
				isCoupon: true, // 是否有优惠券
				from:{
					page: 1,
					limit: 10,
					status: 0
				},
				loding: false,
				nomore: false
			};
		},
		onShow() {
			this.from = {
				page: 1,
				limit: 10,
				status: this.currentTab
			}
			this.initData();
		},
		methods:{
			async initData(){
				const res = await this.getMember();
				if (res.code == 5223) {//登录过期
					return;
				}
				await this.getCouponRow();
			},
			async swichNav(e){
				// 点击标题切换当前页时改变样式
				let cur = e.currentTarget.dataset.status;
				if (this.currentTab == cur) {
					return false;
				} else {
					this.currentTab = cur;
					this.from.status = cur;
					this.from.page = 1;
					this.couponRow = [];
					this.loding = false;
					this.nomore = false;
					await this.getCouponRow();
				}
			},
			handlerButton(e){
				this.delCoupon(e.item.item.no,e.index)
			},
            handleJump (productType, code){
				/*
				* @parameter productType 商品类型 0 全部商品通用 1限部分商品可用
				* 页面跳转
				*/
				if (productType == 0) {
					uni.navigateTo({
					    url:'/pages/productList/productList'
					})
				} else{
                    uni.setStorageSync('useCoupon', code)
					uni.navigateTo({
					    url:'/pages/my/coupon/useCoupon?couponNo=' + code.no
					})
                    
				}
                
            },
            handleDetail(e,no){
				// 去优惠券详情
                if(e == 1){
                    uni.navigateTo({
                        url:'/pages/my/coupon/couponDetils?no=' + no
                    })
                }
            },
			delCoupon(no,index){
				// 删除优惠券
				uni.showLoading({
				    title: '删除中..',
					mask: true
				});
				this.$http.post(coupon.del,{couponItemNo: no}).then(res=>{
					uni.hideLoading();
					if (res.code == 200) {
						this.couponRow.splice(index, 1); 
						uni.showToast({
						    title: '删除成功',
						    duration: 2000
						});
						this.getMember();
					} else{
						uni.showToast({
						    title: res.message,
							icon: 'none',
						    duration: 2000
						});
					}
				});
			},
			async onLoadMore(){
				// 上拉加载更多
				const res = await this.$http.get(coupon.couponList,this.from);
				if (res.code == 200) {
					if (res.data.length == 0) {
						this.loding = false;
						this.nomore = true;
						return res;
					}
					this.loding = true;
					if (res.data.length > 0) {
						this.from.page++;
					}
					for (let key in res.data) {
						this.couponRow.push(res.data[key]);
					}
				} else{
					uni.showToast({
					    title: res.message,
						icon: 'none',
					    duration: 2000
					});
				}
			},
			async onPullDown(done){
				// 下拉刷新
				this.from.page = 1 ;
				this.$http.get(coupon.couponList,this.from).then(res=>{
					done();
					if (res.code == 200) {
						this.couponRow = res.data;
						if (res.data.length > 0) {
							this.isCoupon = true;
							this.from.page++;
						}else{
							this.isCoupon = false;
						}
					}else{
						uni.showToast({
						    title: res.message,
							icon: 'none',
						    duration: 2000
						});
					}
				});
			},
			getCouponRow(type){
				// 获取优惠券数据 type 1 下拉 
				if (!type) {
					uni.showLoading({
					    title: '加载中..',
						mask: true
					});
				}
				
				return this.$http.get(coupon.couponList,this.from).then(res=>{
					if (!type) {
						uni.hideLoading();
					}
					
					if (res.code == 200) {
						if (res.data.length == 0) {
							this.isCoupon = false;
							return res;
						}
						
						if (res.data.length > 0) {
							this.from.page++;
						}
						this.isCoupon = true;
						this.couponRow = res.data;
						return res;
					} else{
						uni.showToast({
						    title: res.message,
							icon: 'none',
						    duration: 2000
						});
					}
				});
			},
			getMember(){
				// 获取优惠券数量
				return this.$http.get(coupon.member).then(res=>{
					if (res.code == 200) {
						const getRow = res.data;
						for(var key in getRow){
							 switch(key){
								case 'canUse':
									this.tabbar[0].num = getRow[key];
								break;
								case 'used':
									this.tabbar[1].num = getRow[key];
								break;
								case 'outTime':
									this.tabbar[2].num = getRow[key];
								break;
							}
						}
					} else{
						uni.showToast({
						    title: res.message,
							icon: 'none',
						    duration: 2000
						});
					}
					return res;
				})
			},
		}
	}
</script>
<style scoped>
	.swipe-action >>> .tui-swipeout-wrap{
		margin-bottom: 32rpx;
	}
	.swipe-action >>> .tui-swipeout-wrap:first-child{
		margin-top: 32rpx;
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
	}
	
	.coupon-wave-left{
		position: absolute;
		left: 0;
		top: 0;
		width: 220rpx;
		height: 200rpx;
		background:linear-gradient(135deg,rgba(252,159,0,1) 0%,rgba(255,119,0,1) 100%);
		border-radius:10rpx 0px 0px 10rpx;
		&:before{
			content: '';
			position: absolute;
			top: 0;
			height: 100%;
			width: 13px;
			background-image: radial-gradient(#F4F4F4 0, #F4F4F4 4px, transparent 4px);
			background-size: 13px 13px;
			background-position: 0 2px;
			background-repeat: repeat-y;
			z-index: 1;
			right: -7px;
		}
		.price{
			font-size: 80rpx;
			font-weight: bold;
			color: #FFFFFF;
			text-align: center;
			line-height: 1;
			margin-top: 47rpx;
			
			.symbol{
				font-size:40rpx;
			}
			.discount{
				font-size: 32rpx;
			}
		}
		
		.condition{
			margin-top: 10rpx;
			font-size: 24rpx;
			font-weight:500;
			text-align: center;
			color: #FFFFFF;
		}
	}
	
	.coupon-wave-right{
		
		padding-left: 252rpx;
		padding-right: 32rpx;
		.headline{
			margin-top: 50rpx;
			line-height: 1;
			font-size: 32rpx;
			font-weight: bold;
			color: #252525;
		}
		
		.employ-warp{
			margin-top: 30rpx;
			height: 48rpx;
			line-height: 48rpx;
			.data{
				font-size: 22rpx;
				color: #878787;
			}
			.but{
				display: inline-block;
				font-size: 26rpx;
				height: 48rpx;
				line-height: 48rpx;
				padding: 0 15rpx;
				background-color: #10BBB8;
				color: #FFFFFF;
				border-radius:8rpx;
			}
		}
		
	}
	.coupon-wave-img{
		position: absolute;
		right: 0;
		bottom: 0;
		width: 114rpx;
		height: 114rpx;
	}
	
	.coupon-view-red{
		.coupon-wave-left{
			background:linear-gradient(135deg,rgba(255,129,83,1) 0%,rgba(255,83,81,1) 100%);
		}
	}
	
	.coupon-view-gray{
		.coupon-wave-left{
			background:rgba(194,198,204,1);
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
