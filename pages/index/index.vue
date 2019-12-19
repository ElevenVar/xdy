<template>
	<view class="container">
		<!-- S 顶部 -->
		<view class="bannere-warp">
			<!-- 定位-搜索 -->
			<view class="location-search">
				<view class="location-search-warp">
					<view 
						class="location" 
						@tap="optCityTap">
						<view class="location-conten">
							{{curCity}}
							<tui-icon 
								class="turningdown"
								name="turningdown" 
								:size='20' 
								color='#10bbb8'>
							</tui-icon>
						</view>
					</view>
					<view 
						class="search"
						@tap="searchTap">
						搜索顶呱呱产品
					</view>
				</view>
			</view>
			<!-- 轮播图 -->
			<view class="tui-banner-box">
				<swiper 
					indicator-active-color="#10BBB8"
					indicator-color="#ededed"
					:indicator-dots="true" 
					:autoplay="true" 
					:interval="5000" 
					:duration="150" 
					class="tui-banner-swiper"
					:circular="true">
					<swiper-item v-for="(item,index) in banner" :key="index" class="tui-banner-item">
						<image 
							:src="item.backgroundImgUrl" 
							class="tui-slide-image" 
							:class="[current!=index?'tui-banner-scale':'']"
							mode="scaleToFill">
						</image>
					</swiper-item>
				</swiper>
			</view>
		</view>
		<!-- E 顶部 -->

		<!-- S 导航 -->
		<view class="nav-warp">
			<!-- 导航 -->
			<view class="tui-classify-box">
				<view class="tui-classify-item" v-for="(item,index) in classify" :key="index" @tap="more(item)" :data-key="item.name">
					<image :src="item.img" class="tui-classify-img" />
					<view class="tui-classify-name">{{item.name}}</view>
				</view>
			</view>

			<!-- 公告 -->

			<view class="tui-rolling-news" @tap="handleMore">
				<!-- <tui-icon name="news" :size='22' color='#555'></tui-icon> -->
				<view class="tui-tip">
					<image 
						class="image" 
						:src=" imgUrl + 'index/front-page.png'">
					</image>
				</view>
				<swiper :vertical="true" :autoplay="true" :circular="true" :interval="4000" class="tui-swiper">
					<swiper-item v-for="(item,index) in headlines" :key="index" class="tui-swiper-item">
						<view class="tui-news-item">{{item.articleTitle}}</view>
					</swiper-item>
				</swiper>
				<view class="tui-arrows">
					<tui-icon name="arrowright" :size='22' color='#878787'></tui-icon>
				</view>
			</view>
		</view>
		<!-- E 导航 -->

		<!-- S 优惠产品 -->
		<view class="module-item module-item__margin-top" v-if="yhCommodityList.length > 0">
			<view class="module-item-header dgg-cl">
				<view class="title dgg-fl">优惠产品</view>
				<!-- <view class="more dgg-fr">
					更多
					<tui-icon class="icon" name="arrowright" :size='20' color='#707175'></tui-icon>
				</view> -->
			</view>
			<view class="module-item-content product">
				<view class="dgg-row dgg-cl" style="margin-left: -10rpx;margin-right: -10rpx;">
					<view 
						class="dgg-col dgg-col-5 dgg-gutter-20" 
						v-for="(item,index) in yhCommodityList" 
						:key="index"
						@tap="pageToCommodityDetail(item.comDefaultSkuCode)">
						<view class="product-item">
							<view class="product-item-content">
								<view class="title">{{item.comName}}</view>
								<view class="describe">{{item.comRemark}}</view>
								<view class="price">
                                    <block v-if='item.comSkuIsDiscuss == 0'>
                                        <text class="real">
										<text class="currency">￥</text>
										{{item.comDefaultSkuPricea / 100}}
									</text>
									<text class="discounts">￥{{item.comSkuMarketPrice / 100}}</text>
                                    </block>
									<block v-else>
                                        <text class="real">
                                        	面议
                                        </text>
                                    </block>
								</view>
								<view class="tag">限时促销 低至9折</view>
							</view>
							<view class="product-item-tag">{{item.compLabelName}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- E 优惠产品 -->

		<!-- S 热门产品 -->
		<view class="module-item module-item__margin-top" v-if="rmCommodityList.length > 0">
			<view class="module-item-header dgg-cl">
				<view class="title dgg-fl">热门产品</view>
				<!-- <view class="more dgg-fr">
					更多
					<tui-icon class="icon" name="arrowright" :size='20' color='#707175'></tui-icon>
				</view> -->
			</view>
			<view class="module-item-content hot-product">
				<view class="dgg-row dgg-cl">
					<view 
						class="dgg-col dgg-col-5 hot-product-item" 
						v-for="(item,index) in rmCommodityList" 
						:key="index"
						@tap="pageToCommodityDetail(item.comDefaultSkuCode)">
						<view 
							class="icon" 
							:class="index % 2 ? 'icon_tow' : '' ">
							<image 
								class="icon-img" 
								:src="item.comDefaultSkuImg">
							</image>
						</view>
						<view 
							class="content" 
							:class="index % 2 ? 'content_tow' : ''">
							<view class="content-title">{{item.comName ? item.comName : ''}}</view>
							<view class="content-describe">{{item.comSlogan ? item.comSlogan : ''}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- E 热门产品 -->

		<!-- S 解决方案 -->
		<view class="module-item module-item__margin-top">
			<view class="module-item-header dgg-cl">
				<view class="title dgg-fl">解决方案</view>
				<view class="more dgg-fr" @click="handleClick">
					更多
					<tui-icon class="icon" name="arrowright" :size='20' color='#707175'></tui-icon>
				</view>
			</view>
			<view class="module-item-content scheme">
				<view class="dgg-row dgg-cl" style="margin-left: -10rpx;margin-right: -10rpx;">
					<view class="dgg-col dgg-col-5 dgg-gutter-20" v-for="(item,index) in solutionList" :key="index">
						<view class="scheme-item" @tap="handleSolutDet(item.id)">
							<image class="scheme-item-img" :src="item.pcIndexBackgroundUrl"></image>
                            <text>{{item.solutionName}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- E 解决方案 -->

		<!-- S 尾部 -->
		<view class="dgg-footer">
			<image class="dgg-footer-img" :src="imgUrl+ 'index/footer_logo.png'"></image>
			<tui-footer 
				:fixed="false" 
				:copyright="copyright" 
				:navigate="navigate" 
				tui-footer-class="tui-custom">
			</tui-footer>
		</view>
		<!-- E 尾部 -->
		
		<!-- S 我的信息二维码 -->
		<tui-modal class="modal-qrcode" :show="modalQr" @cancel="hideCancel" :custom="true">
		    <view class="tui-modal-qrcode">
		        <view class="head">
		            我的二维码
		            <tui-icon @click.stop="closeModle" class="icon" name="close-fill" :size='26' color='rgba(184,184,184,1)'>
		            </tui-icon>
		        </view>
		        <view class="body">
		            <canvas :style="{width:qrcode_w+'px', height:qrcode_w+'px'}" :canvas-id="'userInfoQrcode'"></canvas>
		        </view>
		        <view class="footer">当您到达公司前台，请出示此二维码</view>
		    </view>
		</tui-modal>
		<!-- E 我的信息二维码 -->
	</view>
</template>

<script>
	import tuiIcon from "@/components/icon/icon"
	import tuiFooter from "@/components/footer/footer"
	import tuiModal from "@/components/modal/modal"
	import {pageIndex , accountSet, iboss} from "@/api/index.js"
	import cityData from '@/utils/citiData.js'
	import util from "@/utils/util.js"
	import qrCode from "@/utils/weapp-qrcode.js"
	console.log(cityData);
	export default {
		components: {
			tuiIcon,
			tuiFooter,
			tuiModal
		},
		data() {
			const imgUrl = this.$config.imgUrl;
			return {
				imgUrl : imgUrl,
				modalQr: false,
				qrcode_w: uni.upx2px(380),
				banner1: [],
                banner: [], // 轮播图
                solutionList: [], // 解决方案
				yhCommodityList: [], // 优惠商品
				rmCommodityList: [], //热门商品
				classify: [
					{
						img: imgUrl + 'index/nav_tjsp.png',
						name: "推荐商品",
						type: 'navigateTo',
						url: '/pages/productList/recommendList'
					},
					{
						img: imgUrl + 'index/nav_qbfl.png',
						name: "全部分类",
						type: 'switchTab',
						url: '/pages/classify/index/index'
					},
					{
						img: imgUrl + 'index/nav_jufa.png',
						name: "解决方案",
						type: 'navigateTo',
						url: '/pages/project/projectList'
					},
					{
						img: imgUrl + 'index/nav_cxjd.png',
						name: "查询进度",
						type: 'navigateTo',
						url: '/pages/order/order/order'
					},
					{
						img: imgUrl + 'index/nav_qdm.png',
						name: "签到码",
						type: 'navigateTo',
						url: '/pages/knowCenter/list/list'
					}
				],
				current: 0,
				headlines: [
					"苹果XR对比华为Mate20你会选择谁",
					"格兰仕暗示拜访拼多多后遭天猫打压，拼多多高层赞其有勇气",
					"耐克没进前十，今年Q1全球受欢迎品牌榜"
				],
				navigate: [{
					text: "举报邮箱：jubao@dgg.net",
					color: "#b8b8b8",
					size: 24
				}, {
					text: "投诉电话：4000-962540",
					color: "#b8b8b8",
					size: 24
				}],
				copyright: '2019版权所有 顶呱呱',
			}
		},
        computed:{
          curCity (){
              return this.$store.state.cityData.cityName
          }  
        },
		onLoad(e) {
            const scene = decodeURIComponent(e.scene)
            console.log(scene);
			uni.showLoading({
				title: '加载中。。'
			})
            if(scene && scene != 'undefined'){
                let data = scene.split(',')
                console.log('scene+++',data);
                let skuCode = data[0]
                let cityCode = data[1]
                let cityName = ''
                cityData.forEach(el => {
                    if(el.code == cityCode){
                        cityName = el.name
                    }
                })
                uni.setStorageSync('currentCity', {
                    cityName: cityName,
                    code: cityCode
                })
                this.$store.commit('SETCITY', {
                    cityName:cityName,
                    code:cityCode
                })
               uni.navigateTo({
               	url: '/pages/productDetails/productDetails?skuCode=' + skuCode
               }) 
            }
            if(e.skuCode){
                let data = {
                    cityName: e.cityName,
                    code: e.code
                }
               uni.setStorageSync('currentCity', data)
               this.$store.commit('SETCITY', data)
               uni.navigateTo({
               	url: '/pages/productDetails/productDetails?skuCode=' + e.skuCode
               })
            }
		},
		onShow() {
            if (!uni.getStorageSync('ibossAppToken')) {
                // 添加网关鉴权
                let requestParams = {
                	mchMerchantSgin: this.$config.mchMerchantSgin,
                	mchCoding: this.$config.mchCoding
                };
               this.$http.get(iboss.getAppToken, requestParams).then(res => {
               	if (res.code == 200) {
               		uni.setStorageSync('ibossAppToken', res.data);
                    this.initData()
               	} else {
               		console.log('获取ibossAppToken失败');
               	}
               }); 
            } else {
                this.initData()
            }
			
			if(!uni.getStorageSync('token')){
				uni.removeTabBarBadge({ index: 2 })
			}
		},
		onPullDownRefresh() {
			this.initData()
		},
		onShareAppMessage(){
			return {
			  title: '顶呱呱-智能企服',
			  path: '/pages/index/index'
			}
		},
		methods: {
			async initData(){
				// 初始化数据
				// uni.showLoading({
				//     title: '加载中..',
				// 	mask: true
				// });
                await this.getList()
				await this.getCommodityROW();
				uni.hideLoading();
				uni.stopPullDownRefresh()
			},
			hideCancel() {
			    // 关闭弹框
			    this.modalQr = false;
			},
			closeModle() {
			    // 点击X - 关闭弹框
			    this.hideCancel();
			},
			async qrCodeTap() {
			    // 打开弹框
			    let text_qrcode = '';
			    let qrImg = '';
			    uni.showLoading({
			        title: '正在生成二维码',
			        mask: true
			    });
			    const res = await this.$http.get(accountSet.getCodeContent);
				if (res.code == 0) {
				    text_qrcode = res.data.codeData;
				    qrImg = res.data.logo;
					new qrCode('userInfoQrcode', {
					    text: text_qrcode,
					    width: this.qrcode_w,
					    height: this.qrcode_w,
					    colorDark: "#333333",
					    colorLight: "#FFFFFF",
					    correctLevel: qrCode.CorrectLevel.H
					});
					this.modalQr = true;
				} else {
				    uni.showToast({
				        icon: 'none',
				        title: '获取二维码信息失败'
				    })
				    return
				}
			    
			    uni.hideLoading();
			
			},
			optCityTap() {
				// 选择城市
				uni.navigateTo({
					url: '../selectCity/selectCity?currentCity=' + this.curCity
				})
			},
			searchTap() {
				// 搜索页
				uni.navigateTo({
					url: '../search/search'
				})
			},
            handleMore(){
                // 知识中心
                uni.navigateTo({
					url: '/pages/knowCenter/list/list'
				})
            },
			getCommodityROW(){
				// 获取商品数据
				return this.$http.post(pageIndex.hotProduct, {comShowClient:"COUPON_PLAT_1", limit: 4}).then(res=>{
					if (res.code == 200) {
						this.yhCommodityList = res.data.yhCommodityList.slice(0,4);
						this.rmCommodityList = res.data.rmCommodityList;
					} else{
						console.log(res.msg);
					}
				})
			},
            // 获取banner 动态，解决方案
            getList(){
                let data = {
                    start: 1,
                    limit: 4,
                    spaceCode: 'PC_INDEX_BANNER', // MINI_PROGRAM_INDEX_TOP
                    pcode: 'INFO',
                    // code: 'PC_INDEX_BANNER', // MINI_PROGRAM_INDEX_TOP
                    publishPlatform: 'MINI-PROGRAM',
                    isRecommend: '1',
                    // solutionCategoryCode: ''
                    
                }
                this.$http.get(pageIndex.homeProduct, data).then(res=>{
                    if (res.code == 200) {
                    	console.log(res)
                        this.banner = res.data.advertisingSpaceList
                        this.solutionList = res.data.solutionList.records
                        this.headlines = res.data.articlePortalList.records
                    } else{
                    	console.log(res.msg);
                    }
                })
            },
			pageToCommodityDetail(comDefaultSkuCode) {
				// 跳转到商品详情
				uni.navigateTo({
				    url: '/pages/productDetails/productDetails?skuCode=' + comDefaultSkuCode
				})
			},
            // 解决方案详情
            handleSolutDet(e){
                uni.navigateTo({
                    url: '/pages/project/projectDetails?id=' + e
                })
            },
			// classify分类跳转页面--如果查询进度如果登陆就单独做一个判断
			async more (item) {
				if(item.url == '/pages/order/order/order') {
					const res = await util.checkUserIsLogin();
					if (res.code == 200) {
					    uni[item.type]({
					    	url: item.url
					    })
					} else {
					    uni.showToast({
					        title: res.msg,
					        icon: 'none',
					        mask: true
					    })
					    setTimeout(() => {
					        uni.navigateTo({
					            url: '/pages/login/login'
					        })
					    }, 1000)
					}
				} else if(item.name == '签到码'){
					const res = await util.checkUserIsLogin();
					if (res.code == 200) {
					    this.qrCodeTap();
					} else {
					    uni.showToast({
					        title: res.msg,
					        icon: 'none',
					        mask: true
					    })
					    setTimeout(() => {
					        uni.navigateTo({
					            url: '/pages/login/login'
					        })
					    }, 1000)
					}
				}else {
					uni[item.type]({
						url: item.url
					})
				}
			},
            handleClick(){
                uni.navigateTo({
                    url: '/pages/project/projectList'
                })
            }
		}
	}
</script>

<style scoped>
	.modal-qrcode>>>.tui-modal-box {
	    padding: 0;
	}
</style>
<style scoped lang="scss">
	@import '../../static/style/thorui.css';

	.container {
		padding-bottom: env(safe-area-inset-bottom);
		box-sizing: border-box;
	}

	/*
	**顶部
	****************/
	.bannere-warp {
		width: 100%;
		position: relative;
		height: 368rpx;
		overflow-x: hidden;

		.location-search {
			width: 100%;
			height: 60rpx;
			line-height: 60rpx;
			position: absolute;
			top: 20rpx;
			left: 0;
			z-index: 100;
			.location-search-warp{
				font-size: 26rpx;
				height: 60rpx;
				margin: 0 32rpx;
				position: relative;
				
				.location{
					position: absolute;
					top: 0;
					left: 0;
					width: 148rpx;
					height: 60rpx;
					line-height: 60rpx;
					background-color: rgba($color: #000000, $alpha: 0.06);
					border-radius: 30rpx;
					color: #10bbb8;
					font-size: 26rpx;
					box-sizing: border-box;
					
					.location-conten{
						position: relative;	
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						padding: 0 32rpx;
						.turningdown{
							position: absolute;
							top: 50%;
							right: 10rpx;
							transform: translate(0,-50%);
							z-index: 100;
						}
					}
				}
				
				
				
				.search{
					margin-left: 164rpx;
					background-color: rgba($color: #000000, $alpha: 0.06);
					border-radius: 30rpx;
					height: 60rpx;
					line-height: 60rpx;
					padding: 0 32rpx;
					box-sizing: border-box;
					font-size: 26rpx;
					color: #b7b7b7;
				}
			}
		}
	}

	/*轮播*/

	.tui-banner-box {
		width: 100%;
		box-sizing: border-box;
		background: #fff;
	}

	.tui-banner-swiper {
		width: 100%;
		height: 368rpx;
	}

	.tui-banner-item {
		width: 100%;
		box-sizing: border-box;
	}

	.tui-slide-image {
		width: 100%;
		height: 368rpx;
		display: block;
		transition: all 0.1s linear;
	}


	//  导航
	.nav-warp {
		background-color: #FFFFFF;
		overflow-x: hidden;
		/*classify*/

		.tui-classify-box {
			width: 100%;
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			justify-content: space-between;
			padding: 28rpx 0;
			background-color: #fff;
		}

		.tui-classify-item {
			width: 20%;
			text-align: center;
		}

		.tui-classify-img {
			width: 90rpx;
			height: 90rpx;
		}

		.tui-classify-name {
			font-size: 26rpx;
			line-height: 26rpx;
			padding-top: 8rpx;
			color: #4C4C55;
			white-space: nowrap;
		}


		/* 公告*/
		.tui-rolling-news {
			width: 100%;
			padding: 0 32rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-wrap: nowrap;
			background: #fff;
		}

		.tui-rolling-news::after {
			left: 0;
		}

		.tui-tip {
			width: 164rpx;
			height: 80rpx;
			line-height: 80rpx;
			display: flex;
			align-items: center;

			.image {
				width: 164rpx;
				height: 25rpx;
				display: inline-block;
			}
		}

		.tui-arrows {
			width: 15px;
			height: 80rpx;
			line-height: 80rpx;
            margin-left: 2rpx;
		}

		.tui-swiper {
			margin-left: 24rpx;
			font-size: 28rpx;
			height: 80rpx;
			flex: 1;
		}

		.tui-swiper-item {
			display: flex;
			align-items: center;
		}

		.tui-news-item {
			line-height: 26rpx;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			color: #878787;
		}

	}

	.module-item {
		background: #FFFFFF;
		min-height: 200rpx;
		padding: 0 32rpx;
		overflow-x: hidden;
		box-sizing: border-box;

		.module-item-header {
			height: 94rpx;
			line-height: 94rpx;

			.title {
				font-size: 32rpx;
				color: #252525;
				font-weight: bold;
			}

			.more {
				font-size: 24rpx;
				color: #707175;

				.icon {
					margin-right: -20rpx;
				}
			}
		}
	}

	.module-item__margin-top {
		margin-top: 15rpx;
	}

	// 优惠产品
	.product {
		padding-bottom: 10rpx;

		.product-item {
			height: 281rpx;
			background-color: #ffffff;
			box-shadow: 0rpx 0rpx 8rpx 0rpx rgba(31, 37, 57, 0.1);
			border-radius: 4rpx 0rpx 0rpx 0rpx;
			position: relative;
			margin-bottom: 20rpx;
			padding: 25rpx;

			.product-item-content {
				.title {
					margin-top: 40rpx;
					margin-bottom: 10rpx;
					line-height: 1.5;
					font-size: 28rpx;
					color: #252525;
					font-weight: bold;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				.describe {
					line-height: 1.5;
					font-size: 22rpx;
					color: #878787;
					font-weight: 400;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
					min-height: 62rpx;
				}

				.price {
					margin-top: 20rpx;

					.real {
						font-size: 30rpx;
						color: #FF6600;
						font-weight: bold;
						font-family: 'DIN';
						.currency{
							font-size: 22rpx;
							font-weight: normal;
							font-family: 'DIN';
						}
					}

					.discounts {
						margin-left: 8rpx;
						font-size: 22rpx;
						color: #B8B8B8;
						text-decoration: line-through;
					}
				}

				.tag {
					margin-top: 20rpx;
					height: 36rpx;
					line-height: 36rpx;
					padding: 0 10rpx;
					background-color: #FFF2EB;
					font-size: 22rpx;
					color: #FF6600;
					border-radius: 4rpx;
					display: inline-block;
				}
			}

			.product-item-tag {
				position: absolute;
				top: 0;
				left: 0;
				height: 36rpx;
				line-height: 36rpx;
				background-image: linear-gradient(144deg,
					#ff8800 0%,
					#ff6600 100%),
					linear-gradient(#ff6600,
					#ff6600);
				background-blend-mode: normal,
					normal;
				border-radius: 4rpx 0rpx 4rpx 0rpx;
				font-size: 20rpx;
				display: inline-block;
				color: #ffffff;
				padding: 0 10rpx;
			}
		}

	}

	//热门产品
	.hot-product {
		.hot-product-item {
			// height: 130rpx;
            padding-bottom: 32rpx;
			box-sizing: border-box;
			position: relative;

			&:not(:nth-child(2n)):before {
				content: '';
				position: absolute;
				z-index: 0;
				top: 0;
				right: 0;
				height: 100%;
				border-right: 1rpx solid #D7D8D9;
				-webkit-transform: scaleX(0.5);
				transform: scaleX(0.5);
				-webkit-transform-origin: 100% 0;
				transform-origin: 100% 0;
			}

			&:after {
				content: '';
				position: absolute;
				z-index: 0;
				bottom: 0;
				left: 0;
				width: 100%;
				height: 1rpx;
				border-bottom: 1rpx solid #D7D8D9;
				-webkit-transform: scaleY(0.5);
				transform: scaleY(0.5);
				-webkit-transform-origin: 0 100%;
				transform-origin: 0 100%;
			}

			&:nth-last-child(1) {
				&:after {
					content: '';
					position: absolute;
					z-index: 0;
					bottom: 0;
					left: 0;
					width: 100%;
					height: 1rpx;
					border-bottom: none;
					-webkit-transform: scaleY(0.5);
					transform: scaleY(0.5);
					-webkit-transform-origin: 0 100%;
					transform-origin: 0 100%;
				}
			}

			&:nth-last-child(2) {
				&:after {
					content: '';
					position: absolute;
					z-index: 0;
					bottom: 0;
					left: 0;
					width: 100%;
					height: 1rpx;
					border-bottom: none;
					-webkit-transform: scaleY(0.5);
					transform: scaleY(0.5);
					-webkit-transform-origin: 0 100%;
					transform-origin: 0 100%;
				}
			}

			.icon {
				position: absolute;
				top: 0;
				left: 0;
				width: 78rpx;
				height: 130rpx;

				.icon-img {
					width: 50rpx;
					height: 50rpx;
					margin-top: 32rpx;
				}

			}
			.icon_tow{
				width: 104rpx;
				.icon-img {
					margin-left: 32rpx;
				}
			}

			.content {
				margin-left: 78rpx;
				padding-top: 32rpx;
				padding-right: 32rpx;
				
				.content-title {
					color: #252525;
					font-size: 26rpx;
					font-weight: bold;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				.content-describe {
					font-size: 24rpx;
					color: #878787;
					margin-top: 10rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
			
			.content_tow {
				margin-left: 104rpx;
				padding-right: 0rpx;
			}
		}
	}

	// 解决方案
	.scheme {
		padding-bottom: 10rpx;

		.scheme-item {
			height: 160rpx;
			border-radius: 4rpx;
			margin-bottom: 20rpx;
            text-align:center;
            color: #fff;
            line-height:160rpx;
            font-size:32rpx;
            font-family:PingFang SC;
            font-weight:bold;
            position:relative;
			.scheme-item-img {
				display: inline-block;
				width: 100%;
				height: 100%;
                position: absolute;
                left: 0;
                top: 0;
			}
            text{
               position: absolute;
               left: 0;
               top: 0; 
               right: 0;
               bottom: 0;
               margin: auto;
            }
		}
	}


	.dgg-footer {
		.dgg-footer-img{
			padding: 0 32rpx;
			height: 80rpx;
			width: 100%;
			display: block;
			box-sizing: border-box;
			margin: 32rpx auto 0;
		}
	}
	
	/* 我的二维码个人信息
	---------------------------------------------------------------- */
	.tui-modal-qrcode {
	    .head {
	        height: 100rpx;
	        line-height: 100rpx;
	        font-weight: 600;
	        color: #252525;
	        font-size: 32rpx;
	        text-align: center;
	        position: relative;
	
	        .icon {
	            position: absolute;
	            top: 50%;
	            right: 32rpx;
	            transform: translate(0, -50%);
	        }
	    }
	
	    .body {
	        canvas {
	            display: block;
	            margin: 0 auto 60rpx;
	        }
	    }
	
	    .footer {
	        height: 90rpx;
	        line-height: 90rpx;
	        text-align: center;
	        box-shadow: 0px -1px 0px 0px rgba(215, 216, 217, 1);
	        font-size: 28rpx;
	        color: #878787;
	    }
	}
</style>
