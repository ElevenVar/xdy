<template>
	<view class="container">
		<!-- S 顶部 -->
		<view class="bannere-warp">
			<!-- 定位-搜索 -->
			<view class="location-search">
				<view class="location-search-warp">
					<view class="location" @tap="optCityTap">
						<view class="location-conten">
							{{ curCity?curCity:'定位中' }}
							<tui-icon class="turningdown" name="turningdown" :size="20" color="#10bbb8"></tui-icon>
						</view>
					</view>
					<view class="search" @tap="searchTap">搜索顶呱呱产品</view>
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
					:circular="true"
				>
					<swiper-item v-for="(item, index) in banner" :key="index" class="tui-banner-item">
						<image :src="item.backgroundImgUrl" class="tui-slide-image" :class="[current != index ? 'tui-banner-scale' : '']" mode="scaleToFill"></image>
					</swiper-item>
				</swiper>
			</view>
		</view>
		<!-- E 顶部 -->

		<!-- S 咨询 -->
		<!-- <div class="onlien-query-wrap">
			<view class="a" @tap="onTel">
				<image class="img" :src="imgUrl + 'index/home_tel_icon.png'" alt=""></image>
				<view class="strong">电话咨询</view>
				<view class="p">4000-962540</view>
			</view>
			<button class="a" open-type="contact">
				<image class="img" :src="imgUrl + 'index/home_online_icon.png'" alt=""></image>
				<view class="strong">在线咨询</view>
				<view class="p">专业顾问服务</view>
			</button>
		</div> -->
		<!-- E 咨询 -->

		<!-- S 导航 -->
		<!-- 导航 -->
		<view class="nav-warp">
			<view class="tui-classify-box">
				<view class="tui-classify-item" v-for="(item, index) in classify" :key="index" @tap="more(item)" :data-key="item.name">
					<image :src="item.img" class="tui-classify-img" />
					<view class="tui-classify-name">{{ item.name }}</view>
				</view>
			</view>
		</view>
		<!-- 公告 -->
		<!-- S 活动 -->
		<!-- <view class="activity" @tap="goActive('/activity/20191111/mainVenue')"><image :src="imgUrl + 'index/home_active_banner11.gif'" alt=""></image></view> -->
		<!-- E 活动 -->
		<view class="nav-warp">
			<view class="tui-rolling-news" @tap="handleMore">
				<!-- <tui-icon name="news" :size='22' color='#555'></tui-icon> -->
				<view class="tui-tip"><image class="image" :src="imgUrl + 'index/front-page.png'"></image></view>
				<swiper :vertical="true" :autoplay="true" :circular="true" :interval="4000" class="tui-swiper">
					<swiper-item v-for="(item, index) in headlines" :key="index" class="tui-swiper-item">
						<view class="tui-news-item">{{ item.articleTitle }}</view>
					</swiper-item>
				</swiper>
				<view class="tui-arrows"><tui-icon name="arrowright" :size="22" color="#878787"></tui-icon></view>
			</view>
		</view>
		<!-- E 导航 -->

		<!-- S 优惠活动 -->
		<view class="active-wrap" v-if="yhCommodityList.length > 0">
			<view class="home-title">优惠活动</view>
			<view class="active-contont">
				<view class="a" v-for="(item, index) in yhCommodityList" :key="index" @tap="goActive(item.pictureUrl, 1)">
					<!-- <view class="h2">{{ item.comName }}</view>
				<view class="p">{{ item.comRemark }}</view> -->
				</view>
			</view>
		</view>
		<!-- E 优惠活动 -->

		<!-- S 解决方案 -->
		<!-- <view class="module-item module-item__margin-top">
			<view class="module-item-header dgg-cl">
				<view class="title dgg-fl">解决方案</view>
				<view class="more dgg-fr" @click="handleClick">
					更多
					<tui-icon class="icon" name="arrowright" :size="20" color="#707175"></tui-icon>
				</view>
			</view>
			<view class="module-item-content scheme">
				<view class="dgg-row dgg-cl" style="margin-left: -10rpx;margin-right: -10rpx;">
					<view class="dgg-col dgg-col-5 dgg-gutter-20" v-for="(item, index) in solutionList" :key="index">
						<view class="scheme-item" @tap="handleSolutDet(item.id)">
							<image class="scheme-item-img" :src="item.pcIndexBackgroundUrl"></image>
							<text>{{ item.solutionName }}</text>
						</view>
					</view>
				</view>
			</view>
		</view> -->
		<!-- E 解决方案 -->

		<!-- S 推荐服务商品 -->
		<view class="recm-product-wrap" v-if="rmCommodityList.length > 0">
			<view class="home-title">
				推荐服务/商品
				<navigator class="go-more" url="/pages/productList/recommendList">
					更多
					<tui-icon name="arrowright" :size="22" color="#878787"></tui-icon>
				</navigator>
			</view>
			<view class="dgg-row">
				<!-- <div class="dgg-col dgg-col-5 dgg-gutter-20" > -->
				<product-item-vertical v-for="(item, index) in rmCommodityList" :key="index" :item="item"></product-item-vertical>
				<!-- </div> -->
			</view>
		</view>
		<!-- E 推荐服务商品 -->

		<view class="no-more-data" v-if="noMore && rmCommodityList.length > 0">没有更多数据了</view>
		<!-- S 我的信息二维码 -->
		<tui-modal class="modal-qrcode" :show="modalQr" @cancel="hideCancel" :custom="true">
			<view class="tui-modal-qrcode">
				<view class="head">
					我的二维码
					<tui-icon @click.stop="closeModle" class="icon" name="close-fill" :size="26" color="rgba(184,184,184,1)"></tui-icon>
				</view>
				<view class="body"><canvas :style="{ width: qrcode_w + 'px', height: qrcode_w + 'px' }" :canvas-id="'userInfoQrcode'"></canvas></view>
				<view class="footer">当您到达公司前台，请出示此二维码</view>
			</view>
		</tui-modal>
		<!-- E 我的信息二维码 -->
	</view>
</template>

<script>
import tuiIcon from '@/components/icon/icon';
import tuiFooter from '@/components/footer/footer';
import tuiModal from '@/components/modal/modal';
import { pageIndex, accountSet, iboss, commodity } from '@/api/index.js';
import cityData from '@/utils/citiData.js';
import util from '@/utils/util.js';
import productItemVertical from '@/components/product-item/product-item-vertical.vue';
import qrCode from '@/utils/weapp-qrcode.js';
export default {
	components: {
		tuiIcon,
		tuiFooter,
		tuiModal,
		productItemVertical
	},
	data() {
		const imgUrl = this.$config.imgUrl;
		return {
			imgUrl: imgUrl,
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
					name: '推荐商品',
					type: 'navigateTo',
					url: '/pages/productList/recommendList'
				},
				{
					img: imgUrl + 'index/nav_qbfl.png',
					name: '全部分类',
					type: 'switchTab',
					url: '/pages/classify/index/index'
				},
				{
					img: imgUrl + 'index/nav_jufa.png',
					name: '解决方案',
					type: 'navigateTo',
					url: '/pages/project/projectList'
				},
				{
					img: imgUrl + 'index/nav_cxjd.png',
					name: '查询进度',
					type: 'navigateTo',
					url: '/pages/order/order/order'
				},
				{
					img: imgUrl + 'index/nav_qdm.png',
					name: '签到码',
					type: 'navigateTo',
					url: '/pages/knowCenter/list/list'
				}
			],
			current: 0,
			headlines: ['苹果XR对比华为Mate20你会选择谁', '格兰仕暗示拜访拼多多后遭天猫打压，拼多多高层赞其有勇气', '耐克没进前十，今年Q1全球受欢迎品牌榜'],
			navigate: [
				{
					text: '举报邮箱：jubao@dgg.net',
					color: '#b8b8b8',
					size: 24
				},
				{
					text: '投诉电话：4000-962540',
					color: '#b8b8b8',
					size: 24
				}
			],
			copyright: '2019版权所有 顶呱呱',
			noMore: false,
			params: {
				page: 1,
				limit: 10,
				comShowClient: 'COUPON_PLAT_1',
				cateId: ''
			}
		};
	},
	computed: {
		curCity() {
			return this.$store.state.cityData.cityName;
		}
	},
	onLoad(e) {
		if(!this.curCity){
			this.getCity()
		}
		const scene = decodeURIComponent(e.scene);
		uni.showLoading({
			title: '加载中。。'
		});
		if (scene && scene != 'undefined') {
			let data = scene.split(',');
			console.log('scene+++', data);
			let skuCode = data[0];
			let cityCode = data[1];
			let cityName = '';
			cityData.forEach(el => {
				if (el.code == cityCode) {
					cityName = el.name;
				}
			});
			uni.setStorageSync('currentCity', {
				cityName: cityName,
				code: cityCode
			});
			this.$store.commit('SETCITY', {
				cityName: cityName,
				code: cityCode
			});
			uni.navigateTo({
				url: '/pages/productDetails/productDetails?skuCode=' + skuCode
			});
		}
		if (e.skuCode) {
			let data = {
				cityName: e.cityName,
				code: e.code
			};
			uni.setStorageSync('currentCity', data);
			this.$store.commit('SETCITY', data);
			uni.navigateTo({
				url: '/pages/productDetails/productDetails?skuCode=' + e.skuCode
			});
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
					this.initData();
				} else {
					console.log('获取ibossAppToken失败');
				}
			});
		} else {
			this.initData();
		}

		if (!uni.getStorageSync('token')) {
			uni.removeTabBarBadge({ index: 2 });
		}
	},
	onPullDownRefresh() {
		this.initData();
	},
	async onReachBottom() {
		if (this.noMore) {
			return;
		}
		uni.showLoading({
			title: '加载中..'
		});
		this.params.page++;
		let res = await this.$http.post(pageIndex.commodityRm, this.params);
		uni.hideLoading();
		if (res.data.data.length > 0) {
			this.rmCommodityList = this.rmCommodityList.concat(res.data.data);
		} else {
			this.noMore = true;
		}
		if (this.rmCommodityList.length >= 20) {
			this.noMore = true;
		}
	},
	onShareAppMessage() {
		return {
			title: '顶呱呱-智能企服',
			path: '/pages/index/index'
		};
	},
	methods: {
		async initData() {
			// 初始化数据
			// uni.showLoading({
			//     title: '加载中..',
			// 	mask: true
			// });
			this.params.page = 1;
			this.noMore = false;
			this.loadMoreData();
			await this.getList();
			// await this.getCommodityROW();
			uni.hideLoading();
			uni.stopPullDownRefresh();
		},
		// 获取城市定位
		async getCity(){
			let that = this
			uni.getLocation({
				success: async res => {
					console.log('获取成功1')
					let cityList = await this.$http.get(commodity.getCity)
					uni.request({
						url: 'http://api.map.baidu.com/geocoder/v2/?ak=wpStIAtm70fyDoUkl3XZwy01WsLvytxj&location=30.64242,104.04311&output=json&pois=1',
						success(r) {
							if(r.data.status == 0) {
								let isHas = cityList.data.find(item => item.name+'市' == r.data.result.addressComponent.city)
								if(isHas){
								  that.$store.commit('SETCITY', { cityName: isHas.name, code: isHas.code });
								} else {
								  that.$store.commit('SETCITY',{ cityName: '成都', code: 'COMPANY_CD' })
								}
							}
						}
					})
				},
				fail(err){
					console.log(err, 'err')
					// that.$store.commit('SETCITY',{ cityName: '成都', code: 'COMPANY_CD' })
					uni.showModal({
						title: '提示',
						content:'为了更好的为您服务，请授权地址权限',
						success(res) {
							if(res.confirm){
								uni.openSetting({
									success(res) {
										if(res.authSetting['scope.userLocation']){
											uni.getLocation({
												success: async res => {
													let cityList = await that.$http.get(commodity.getCity)
													uni.request({
														url: 'https://api.map.baidu.com/geocoder/v2/?ak=wpStIAtm70fyDoUkl3XZwy01WsLvytxj&location=30.64242,104.04311&output=json&pois=1',
														success(r) {
															if(r.data.status == 0) {
																let isHas = cityList.data.find(item => item.name+'市' == r.data.result.addressComponent.city)
																if(isHas){
																  that.$store.commit('SETCITY', { cityName: isHas.name, code: isHas.code });
																  that.getList()
																} else {
																  that.$store.commit('SETCITY',{ cityName: '成都', code: 'COMPANY_CD' })
																}
															}
														}
													})
												},
											})
										} else {
											that.$store.commit('SETCITY',{ cityName: '成都', code: 'COMPANY_CD' })
										}
									}
								})
							} else {
								that.$store.commit('SETCITY',{ cityName: '成都', code: 'COMPANY_CD' })
							}
						}
					})
				}
			})
		},
		loadMoreData() {
			this.$http.post(pageIndex.commodityRm, this.params).then(res => {
				this.rmCommodityList = [];
				if (res.data.data.length > 0) {
					this.rmCommodityList = this.rmCommodityList.concat(res.data.data);
				} else {
					this.noMore = true;
				}
			});
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
					colorDark: '#333333',
					colorLight: '#FFFFFF',
					correctLevel: qrCode.CorrectLevel.H
				});
				this.modalQr = true;
			} else {
				uni.showToast({
					icon: 'none',
					title: '获取二维码信息失败'
				});
				return;
			}

			uni.hideLoading();
		},
		optCityTap() {
			// 选择城市
			uni.navigateTo({
				url: '../selectCity/selectCity?currentCity=' + this.curCity
			});
		},
		// 拨打电话
		onTel() {
			uni.makePhoneCall({
				phoneNumber: '4000-962540'
			});
		},
		searchTap() {
			// 搜索页
			uni.navigateTo({
				url: '../search/search'
			});
		},
		handleMore() {
			// 知识中心
			uni.navigateTo({
				url: '/pages/knowCenter/list/list'
			});
		},
		getCommodityROW() {
			// 获取商品数据
			return this.$http.post(pageIndex.hotProduct, { comShowClient: 'COUPON_PLAT_1', limit: 4 }).then(res => {
				if (res.code == 200) {
					this.yhCommodityList = res.data.yhCommodityList.slice(0, 4);
					// this.rmCommodityList = res.data.rmCommodityList;
				} else {
					console.log(res.msg);
				}
			});
		},
		// 获取banner 动态，解决方案
		getList() {
			let data = {
				start: 1,
				limit: 4,
				spaceCode: 'PC_INDEX_BANNER', // MINI_PROGRAM_INDEX_TOP
				pcode: 'INFO',
				// code: 'PC_INDEX_BANNER', // MINI_PROGRAM_INDEX_TOP
				publishPlatform: 'MINI-PROGRAM',
				isRecommend: '1',
				spaceCodeV1: 'WAP_INDEX_DISCOUNTS'
				// solutionCategoryCode: ''
			};
			this.$http.get(pageIndex.homeProduct, data).then(res => {
				if (res.code == 200) {
					console.log(res);
					this.banner = res.data.advertisingSpaceList;
					this.solutionList = res.data.solutionList.records;
					this.headlines = res.data.articlePortalList.records;
					this.yhCommodityList = res.data.advertisingSpaceListV1.slice(0, 4);
				} else {
					console.log(res.msg);
				}
			});
		},
		pageToCommodityDetail(comDefaultSkuCode) {
			// 跳转到商品详情
			uni.navigateTo({
				url: '/pages/productDetails/productDetails?skuCode=' + comDefaultSkuCode
			});
		},
		// 去活动页面
		goActive(url, type) {
			if (type == 1) {
				this.$store.commit('SET_WEB_VIEW_URL', url);
				uni.navigateTo({
					url: '/pages/webView/webView'
				});
			} else {
				let token = uni.getStorageSync('token');
				let memberId = uni.getStorageSync('userInfo').id;
				console.log(`https://m.dgg.cn/activity/20191111/mainVenue?token=${token}&platform=xdy&memberId=${memberId}`);
				this.$store.commit('SET_WEB_VIEW_URL', `https://m.dgg.cn/activity/20191111/mainVenue?token=${token}&platform=xdy&memberId=${memberId}`);
				uni.navigateTo({
					url: '/pages/webView/webView'
				});
			}
		},
		// 解决方案详情
		handleSolutDet(e) {
			uni.navigateTo({
				url: '/pages/project/projectDetails?id=' + e
			});
		},
		// classify分类跳转页面--如果查询进度如果登陆就单独做一个判断
		async more(item) {
			if (item.url == '/pages/order/order/order') {
				const res = await util.checkUserIsLogin();
				if (res.code == 200) {
					uni[item.type]({
						url: item.url
					});
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none',
						mask: true
					});
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/login/login'
						});
					}, 1000);
				}
			} else if (item.name == '签到码') {
				const res = await util.checkUserIsLogin();
				if (res.code == 200) {
					this.qrCodeTap();
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none',
						mask: true
					});
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/login/login'
						});
					}, 1000);
				}
			} else {
				uni[item.type]({
					url: item.url
				});
			}
		},
		handleClick() {
			uni.navigateTo({
				url: '/pages/project/projectList'
			});
		}
	}
};
</script>

<style scoped>
.modal-qrcode >>> .tui-modal-box {
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
		.location-search-warp {
			font-size: 26rpx;
			height: 60rpx;
			margin: 0 32rpx;
			position: relative;

			.location {
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

				.location-conten {
					position: relative;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					padding: 0 32rpx;
					.turningdown {
						position: absolute;
						top: 50%;
						right: 10rpx;
						transform: translate(0, -50%);
						z-index: 100;
					}
				}
			}

			.search {
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
.activity {
	padding-bottom: 16rpx;
	background: #fff;
	image {
		width: 100%;
		height: 180rpx;
	}
}
// 咨询
.onlien-query-wrap {
	width: 100%;
	height: 186rpx;
	background: rgba(255, 255, 255, 1);
	margin-top: 16rpx;
	display: flex;
	padding: 32rpx 0;
	box-sizing: border-box;
	& > .a {
		display: block;
		width: 50%;
		height: 100%;
		line-height: 1;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		background: rgba(255, 255, 255, 1);
		&:first-child {
			border-right: 2rpx solid #d7d8d9;
		}
		.img {
			width: 44rpx;
			height: 44rpx;
			position: relative;
			top: -8rpx;
		}
		.strong {
			display: block;
			font-size: 28rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(37, 37, 37, 1);
			line-height: 1;
			margin-top: 15rpx;
		}
		.p {
			font-size: 24rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(135, 135, 135, 1);
			line-height: 1;
			margin-top: 12rpx;
		}
	}
}
/*轮播*/
.recm-product-wrap {
	padding: 0 32rpx;
}
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

.no-more-data {
	height: 40rpx;
	text-align: center;
	font-size: 24rpx;
	color: #999;
	line-height: 40rpx;
}
//  导航
.nav-warp {
	background-color: #f0f2f5;
	overflow-x: hidden;
	margin-top: 16rpx;
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
		color: #4c4c55;
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
	background: #ffffff;
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

// 优惠活动
.active-wrap {
	height: 558rpx;
	background: rgba(255, 255, 255, 1);
	margin-top: 16rpx;
	overflow: hidden;
	padding: 0 32rpx;
	.active-contont {
		width: 100%;
		height: 416rpx;
		position: relative;
		.h2 {
			font-size: 34rpx;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: rgba(255, 255, 255, 1);
			line-height: 34rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.p {
			font-size: 24rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(255, 255, 255, 1);
			line-height: 32rpx;
			margin-top: 20rpx;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
			overflow: hidden;
		}
		& > .a:first-child {
			position: absolute;
			width: 300rpx;
			height: 416rpx;
			background: url(https://dgg-xiaodingyun.oss-cn-beijing.aliyuncs.com/xdy-xcx/index/home_yu1.png) no-repeat;
			background-size: 100% 100%;
			border-radius: 8rpx;
			left: 0;
			top: 0;
			padding: 48rpx 24rpx;
			box-sizing: border-box;
			p {
				-webkit-line-clamp: 8;
			}
		}
		& > .a:nth-child(2) {
			position: absolute;
			width: 370rpx;
			height: 180rpx;
			background: url(https://dgg-xiaodingyun.oss-cn-beijing.aliyuncs.com/xdy-xcx/index/home_yu2.png) no-repeat;
			background-size: 100% 100%;
			right: 0;
			top: 0;
			border-radius: 8rpx;
			padding: 44rpx 28rpx;
			box-sizing: border-box;
			p {
				-webkit-line-clamp: 3;
			}
		}
		& > .a:nth-child(3) {
			position: absolute;
			width: 178rpx;
			height: 220rpx;
			background: url(https://dgg-xiaodingyun.oss-cn-beijing.aliyuncs.com/xdy-xcx/index/home_yu3.png) no-repeat;
			background-size: 100% 100%;
			border-radius: 8rpx;
			left: 316rpx;
			top: 192rpx;
			padding: 28rpx 16rpx;
			box-sizing: border-box;
			p {
				-webkit-line-clamp: 3;
			}
		}
		& > .a:nth-child(4) {
			position: absolute;
			width: 178rpx;
			height: 220rpx;
			background: url(https://dgg-xiaodingyun.oss-cn-beijing.aliyuncs.com/xdy-xcx/index/home_yu4.png) no-repeat;
			background-size: 100% 100%;
			border-radius: 8rpx;
			right: 0;
			top: 192rpx;
			padding: 28rpx 16rpx;
			box-sizing: border-box;
			p {
				-webkit-line-clamp: 3;
			}
		}
	}
}
.home-title {
	font-size: 32rpx;
	font-family: PingFangSC-Semibold, PingFang SC;
	font-weight: 600;
	color: rgba(37, 37, 37, 1);
	line-height: 1;
	margin-top: 40rpx;
	margin-bottom: 32rpx;
	.go-more {
		font-size: 24rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: rgba(135, 135, 135, 1);
		float: right;
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
			border-right: 1rpx solid #d7d8d9;
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
			border-bottom: 1rpx solid #d7d8d9;
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
		.icon_tow {
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
		text-align: center;
		color: #fff;
		line-height: 160rpx;
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: bold;
		position: relative;
		.scheme-item-img {
			display: inline-block;
			width: 100%;
			height: 100%;
			position: absolute;
			left: 0;
			top: 0;
		}
		text {
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
	.dgg-footer-img {
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
