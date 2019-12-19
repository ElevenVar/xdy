<template>
	<view class="container">
		<!-- S 有添加商品到购物车 -->
		<view class="shop" v-if="shopCartList.length > 0">
			<!-- 顶部 -->
			<view class="shop-top">
				<navigator hover-class="none" :url="'/pages/selectCity/selectCity?currentCity=' + cityData.cityName" class="city">
					<image class="location-icon" src="/static/image/shop/location-icon.png" mode=""></image>
					{{ cityData.cityName }}
					<tui-icon
						class="turningdown"
						name="turningdown" 
						:size='20' 
						color='#666'>
					</tui-icon>
				</navigator>
				<view class="edit-product" @tap="isEdit = !isEdit">{{ isEdit ? '完成' : '编辑商品' }}</view>
			</view>
			<!-- 购物车列表 -->
			<view class="cart-wrap">
				<!-- item.type 1.满减  2.满赠  3.多买优惠 4.套装 5.正常普通商品 -->
				<view class="cart-list" :class="true ? 'cart-list-top' : ''">
					<!-- <view class="cart-list" v-for="(item, index) in shopCartList" :class="item.type==5?'cart-list-top':''" :key='index'> -->
					<!-- <view class="cart-head" v-if="item.type != 5">
						<label class="checkbox" @tap="changeSelect(item, 'select')" v-if="item.type == 4 && !isEdit" :class="item.select? 'isChecked' : ''">
							<checkbox :checked='item.select' />
						</label>
						<label class="checkbox" @tap="changeSelect(item, 'editSelect')" v-if="item.type == 4 && isEdit" :class="item.select? 'isChecked' : ''">
							<checkbox :checked='item.editSelect' />
						</label> -->
					<!-- <view class="cart-mark">{{ item.type | type }}</view> -->
					<!-- 满减信息，多买优惠折扣 -->
					<!-- <view class="active-info">
							<text v-if="item.type==1" v-for="(item1, index1) in item.fullReduction" :key='index1'>
								满{{ item1.full }}减{{ item1.reduction }}{{ index1 + 1 == item.fullReduction.length ? '' : ',' }}
							</text>
							<text v-if="item.type==2" v-for="(item1, index1) in item.fullReduction" :key='index1'>
								满{{ item1.full }}件{{ item1.reduction }}折{{ index1 + 1 == item.fullReduction.length ? '' : ',' }}
							</text>
							<text v-if="item.type==3">已满3999元</text> -->
					<!-- 优惠信息 -->
					<!-- <view v-if="item.type == 1 || item.type == 2" class="item-preferential">(<text>已优惠¥32.50</text>)</view>
							<!-- 套餐展示套餐名称 -->
					<!-- <text v-if="item.type == 4">{{ item.title }}</text>
						</view> -->
					<!-- 领取赠品 -->
					<!-- <view v-if="item.type == 3" class="get-gifts" @tap="getGiftsPopupShow=true">领取赠品<tui-icon name="arrowright" size="16"
							 color="#10BBB8"></tui-icon>
						</view> -->
					<!-- 去凑单 -->
					<!-- <navigator open-type="switchTab" url="/pages/classify/index/index" class="go-single">{{ item.type==1 ? '去凑单' : '活动商品' }}
							<tui-icon name="arrowright" size="16" color="#252525"></tui-icon>
						</navigator> -->
					<!-- </view> -->

					<!-- 商品列表 -->
					<view class="cart-item" :class="true ? 'cart-item-top' : ''" v-for="(product, index1) in shopCartList" :key="index1">
						<view class="item-info-wrap">
							<view class="item-info-select">
								<label
									class="checkbox"
									@tap="changeSelect(product, 'shopIsSelected')"
									:class="{ isChecked: product.shopIsSelected, 'no-active': product.skuFlag == 0 || product.skuStatus == 0 }"
									v-if="item.type != 4 && product.status != 2 && product.status != 3 && !isEdit"
								>
									<checkbox :checked="product.shopIsSelected" />
								</label>
								<label class="checkbox" @tap="changeSelect(product, 'editSelect')" :class="{ isChecked: product.editSelect }" v-if="item.type != 4 && isEdit">
									<checkbox :checked="product.editSelect" />
								</label>
							</view>
							<!-- 商品图片 -->
							<navigator
								:url="'/pages/productDetails/productDetails?comCode=' + product.comCode"
								class="item-info-img"
								:class="{ 'status-shelves': product.skuFlag == 0, 'status-overdue': product.skuStatus == 0 }"
							>
								<image :src="product.skuImgs" mode=""></image>
							</navigator>
							<!-- 商品信息 -->
							<view class="item-info-base">
								<navigator :url="'/pages/productDetails/productDetails?comCode=' + product.comCode" class="item-info-title">
									<text class="item-info-title-text">{{ product.comName }}</text>
								</navigator>
								<!-- 商品sku点击重新选择 -->
								<view class="item-info-sku" :class="item.type == 4 ? 'no-active' : ''" @tap="openSkuPopup(product)">
									<view class="item-info-sku-title">
										<text>{{ product.skuPropertyVname | regskuPropertyName }}</text>
										<tui-icon style="width: 50rpx;
position: relative;
left: -16rpx;
" name="arrowdown" size="14" color="#252525"></tui-icon>
									</view>
								</view>
								<view class="item-price-wrap">
									<view class="item-price">
										￥
										<text>{{ product.skuSellingPrice | price }}</text>
									</view>
									<!-- 商品数量加减 -->
									<view class="item-num-wrap" v-if="item.type != 4 && product.status != 2 && product.status != 3">
										<!-- <text class="redux" @tap="product.num>0 ? product.num-- : product.num=0" :class="product.num>0?'':'no'"></text> -->
										<text class="redux" @tap="updateNum(product, 'redux')" :class="product.shopSkuNumber > 1 ? '' : 'no'"></text>
										<input type="number" @input="updateNum(product, 'input')" @blur="changeNum(product)" maxlength="2" v-model="product.shopSkuNumber" />
										<text class="add" @tap="updateNum(product, 'add')">+</text>
									</view>
								</view>
							</view>
						</view>
						<view class="item-more-wrap">
							<!-- 直降 -->
							<!-- <view class="gifts-wrap">
								<view class="gifts-mark">直降</view>
								<view class="gifts-title">已优惠 ¥10.00</view>
								<view class="gigts-num">x1</view>
							</view> -->
							<!-- 赠品 -->
							<view class="gifts-wrap" v-for="(gift, giftIndex) in product.giftsList" :key="giftIndex">
								<view class="gifts-mark">赠品</view>
								<view class="gifts-title">{{ gift.title }}</view>
								<view class="gigts-num">x{{ gift.num }}</view>
							</view>
							<!-- 增值服务 -->
							<view class="gifts-wrap" v-for="(addServe, addServeIndex) in product.addServeList" :key="addServe.id">
								<view class="add-mark">增值服务</view>
								<view class="gifts-title">{{ addServe.title }}</view>
								<view class="gigts-num">¥{{ addServe.price }}/年x{{ addServe.num }}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="shop-bottom">
				<label class="checkbox" :class="allProductSelect ? 'isChecked' : ''" v-if="!isEdit" @tap="allSelect()"><checkbox :checked="allProductSelect" /></label>
				<label class="checkbox" :class="allEditSelect ? 'isChecked' : ''" v-else @tap="allSelect()"><checkbox :checked="allEditSelect" /></label>
				<text class="all-select-text">全选</text>
				<view class="all-price-wrap">
					<view class="all-price" v-if="!isEdit">
						合计:
						<text>￥{{ settleData.waitPayMoney | price }}</text>
					</view>
					<view class="all-preferential" v-if="!isEdit">
						<text space="emsp" class="waitPayMoney" style="margin-right: 32rpx">总额：{{ settleData.waitPayMoney | price }}</text>
						<text>优惠：{{ settleData.yhMoney | price }}</text>
					</view>
				</view>
				<view class="submit" :class="selectNum <= 0 ? 'no-cart' : ''" v-if="!isEdit" @tap="goBuy()">去结算<text>({{ selectNum }})</text></view>
				<view class="del-product" @tap="deleteAll()" v-else>删除</view>
			</view>
		</view>
		<!-- E 有添加商品到购物车 -->

		<!-- 没有添加商品到购物车 -->
		<shop-no-data :isLogin="isLogin" :commodityList='commodityList' v-if="shopCartList.length == 0 && isShow"></shop-no-data>
		<!-- 领取赠品弹窗 -->
		<!-- <shop-gifts-popup :list="shopCartList[0].productList" :getGiftsPopupShow='getGiftsPopupShow' @yes='yesGetGifts' @close='getGiftsPopupShow=false'></shop-gifts-popup> -->
		<!-- 商品sku选择弹窗 -->
		<shop-sku-popup
			:skuPopupShow="skuPopupShow"
			@changeSku="changeSku"
			@close="close"
			@skuItemNumChange="skuItemNumChange"
			:product="product"
			:items="skuItem"
			:skuItemNum="skuItemNum"
		></shop-sku-popup>
	</view>
</template>

<script>
import mixinsShop from '@/common/mixins/shop.js';
import tuiIcon from '@/components/icon/icon';
import shopGiftsPopup from '@/components/shop/shop-gifts-popup.vue';
import shopNoData from '@/components/shop/shop-no-data.vue';
import shopSkuPopup from '@/components/shop/shop-sku-popup.vue';
import { carts, commodity } from '@/api/index.js';
import { mapState } from 'vuex'
export default {
	components: {
		tuiIcon,
		shopGiftsPopup,
		shopNoData,
		shopSkuPopup
	},
	mixins: [mixinsShop],
	data() {
		return {
			isLogin: false, // 用户有无登录
			shopCartList: [], // 购物车数据
			isShow: false, // 是否展示未登录状态
			skuPopupShow: false, // 商品sku选择弹框
			getGiftsPopupShow: false, // 领取赠品弹框
			isEdit: false, //是否是编辑状态
			allEditSelect: false, // 编辑状态是否全选
			allProductSelect: false, // 非编辑状态是否全选,
			settleData: {}, // 价格信息
			skuItem: {
				commoditySku: {}
			},
			product: {},
			skuItemNum: 1,
			commodityList: [],
			selectNum: 0
		};
	},
	onHide() {
		this.isShow = false;
		this.skuPopupShow = false;
		this.isEdit = false;
	},
	onLoad() {
		if (uni.getStorageSync('token')) {
			uni.showLoading({ title: '加载中..' });
		}
		uni.getProvider({
			 service: 'payment',
			success(res) {
				console.log(res, '2222222')
			}
		})
	},
	onShow() {
		if (uni.getStorageSync('token')) {
			this.isLogin = true;
			this.getInitData();
		} else {
			this.isLogin = false;
			this.isShow = true;
			uni.removeTabBarBadge({ index: 2 });
		}
	},
	methods: {
		getInitData() {
			this.$http.get(carts.shop_cart_list_xcx).then(res => {
				console.log(res.code);
				if (res.code == 200) {
					res.data.shopCartList.map(item => {
						item.editSelect = false;
						item.shopIsSelected = item.shopIsSelected == 1 ? true : false;
						if (item.skuFlag == 0 || item.skuStatus == 0) {
							item.shopIsSelected = false;
						}
					});
					this.shopCartList = res.data.shopCartList;
					this.settleData = res.data.settleData;
					if (this.shopCartList.length == 0) {
						this.isShow = true;
					}
				} else if (res.code === 5233 || res.code === 5223) {
					uni.removeStorageSync('token');
					this.isShow = true;
				} else {
					this.isShow = true;
				}
				uni.hideLoading();
			});
		},
		// 输入框数量改变失去焦点
		changeNum(product) {
			product.shopSkuNumber < 1 ? product.shopSkuNumber = 1 : ''
			let update_sku_number = () => {
				this.$http.post(carts.update_sku_number, { shopIds: product.shopId, shopSkuNumber: product.shopSkuNumber }).then(res => {
					if (res.code != 200) {
						uni.showToast({ icon: 'none', title: res.data.msg });
					}
				});
			};
			// 对加减购物车数量做防抖处理
			this.debounce(update_sku_number);
		},
		// 商品数量加减
		updateNum(product, type) {
			if (product.skuFlag == 0 || product.skuStatus == 0) {
				return;
			}
			if (type == 'add') {
				product.shopSkuNumber < 99 ? product.shopSkuNumber++ : (product.shopSkuNumber = 99);
			} else if(type == 'redux') {
				product.shopSkuNumber > 1 ? product.shopSkuNumber-- : (product.shopSkuNumber = 1);
			} else if(type == 'input') {
				product.shopSkuNumber = product.shopSkuNumber
			}
			let update_sku_number = () => {
				this.$http.post(carts.update_sku_number, { shopIds: product.shopId, shopSkuNumber: product.shopSkuNumber }).then(res => {
					if (res.code != 200) {
						uni.showToast({ icon: 'none', title: res.data.msg });
					}
				});
			};
			// 对加减购物车数量做防抖处理
			this.debounce(update_sku_number);
		},
		// 选择状态改变
		changeSelect(product, key) {
			console.log(key);
			if (key == 'shopIsSelected') {
				if (product.skuFlag == 0 || product.skuStatus == 0) {
					return;
				}
				product[key] = !product[key];
				let save_cart_selected = () => {
					this.$http.post(carts.save_cart_selected, { shopIds: product.shopId, operType: product[key] ? 1 : 0 }).then(res => {
						if (res.code != 200) {
							uni.showToast({ icon: 'none', title: res.data.msg });
						}
					});
				};
				// 对选择状态改变做防抖处理
				this.debounce(save_cart_selected);
			} else {
				product[key] = !product[key];
			}
		},
		// 全部选中
		allSelect() {
			// 如果是编辑状态
			if (this.isEdit) {
				this.allEditSelect = !this.allEditSelect;
				this.shopCartList.map(item => {
					item.editSelect = this.allEditSelect;
				});
			} else {
				this.allProductSelect = !this.allProductSelect;
				let selectedList = [];
				this.shopCartList.map(item => {
					item.shopIsSelected = this.allProductSelect;
					if (item.skuFlag == 0 || item.skuStatus == 0) {
						item.shopIsSelected = false;
					}
					selectedList.push(item.shopId);
				});
				this.$http.post(carts.save_cart_selected, { shopIds: selectedList, operType: this.allProductSelect ? 1 : 0 }).then(res => {
					if (res.code != 200) {
						uni.showToast({ icon: 'none', title: res.data.msg });
					}
				});
			}
		},
		// 删除购物车
		deleteAll() {
			let editSelectList = [];
			let editSelectIndex = [];
			this.shopCartList.map((item, index) => {
				item.editSelect ? editSelectList.push(item.shopId) : [];
				item.editSelect ? editSelectIndex.push(index) : [];
			});
			console.log(editSelectList);
			if (editSelectList.length == 0) {
				uni.showToast({
					title: '请选择要删除的商品',
					icon: 'none'
				});
			} else {
				this.$http.post(carts.deleteCart, { shopId: editSelectList }).then(res => {
					if (res.code == 200) {
						let count = 0;
						editSelectIndex.map((item, index) => {
							this.shopCartList.splice(item - count++, 1);
						});
						uni.showToast({
							title: '删除成功',
							icon: 'none'
						});
					}
				});
			}
		},
		// 领取赠品结果，来自子组件
		yesGetGifts() {
			this.getGiftsPopupShow = false;
		},
		// 打开sku选择弹窗
		openSkuPopup(product) {
			if (product.skuFlag == 0 || product.skuStatus == 0) {
				return;
			}
			uni.showLoading({ title: '加载中..' });
			this.product = product;
			this.skuItemNum = product.shopSkuNumber;
			this.skuPopupShow = true;
			this.$http.get(commodity.commodityDetail, { skuCode: product.skuCode }).then(res => {
				if (res.code == 200) {
					this.skuItem = res.data;
				}
				uni.hideLoading()
			});
		},
		// 子组件弹窗的关闭弹窗事件
		close() {
			this.skuPopupShow = false;
			this.getGiftsPopupShow = false;
		},
		// sku子组件数量加减
		skuItemNumChange(e) {
			this.skuItemNum = e;
		},
		// sku子组件确认更换sku
		changeSku(params) {
			let skuIdOld = this.skuItem.commoditySku.skuId;
			this.skuPopupShow = false;
			console.log(params)
			if (params.skuId && params.skuId != this.skuItem.commoditySku.skuId) {
				this.$http.post(carts.updateCartAttr, { skuId: params.skuId, skuIdOld, skuNumber: params.num }).then(res => {
					if (res.code == 200) {
						this.getInitData();
					} else {
						uni.showToast({ icon: 'none', title: res.data.msg });
					}
				});
			} else if (params.num && params.num != this.product.shopSkuNumber) {
				this.$http.post(carts.update_sku_number, { shopIds: this.product.shopId, shopSkuNumber: params.num }).then(res => {
					if (res.code == 200) {
						this.product.shopSkuNumber = params.num;
					} else {
						uni.showToast({ icon: 'none', title: res.data.msg });
					}
				});
			}
		},
		// 去结算
		goBuy() {
			if (this.selectNum <= 0) {
				return;
			}
			let selectedList = [], comId = [], comCateIdThree = [];
			this.shopCartList.map(item => {
				if (item.shopIsSelected) {
					selectedList.push(item.shopId);
					comCateIdThree.push(item.comCateIdTwo)
					comId.push(item.comCode)
				}
			});
			uni.navigateTo({ url: `/pages/order/confirmOrder/confirmOrder?sourceType=0&shopIds=${selectedList.join(',')}&comId=${comId.join(',')}&comCateIdThree=${comCateIdThree.join(',')}` });
		}
	},
	watch: {
		// 监听所有选中状态
		shopCartList: {
			handler(newVal) {
				let waitPayMoney = 0;
				let selectedList = []
				let selectNum = 0
				newVal.map(item => {
					
					if (item.shopIsSelected) {
						selectedList.push(item.shopId);
					}
					if (item.skuFlag != 0 && item.skuStatus != 0 && item.shopIsSelected) {
						selectNum += item.shopSkuNumber*1
					}
					item.shopIsSelected ? (waitPayMoney += item.skuSellingPrice * item.shopSkuNumber) : '';
				});
				this.selectNum = selectNum > 99 ? '99+' : selectNum
				this.allProductSelect = newVal
					.filter(item => item.skuFlag != 0 && item.skuStatus != 0)
					.every(item => {
						return item.shopIsSelected == true;
					});
				this.allEditSelect = newVal.every(item => {
						return item.editSelect == true;
					});
				this.settleData.waitPayMoney = waitPayMoney;
				if (newVal.length == 0) {
					this.isShow = true;
				}
				if (newVal.length > 0) {
					uni.setTabBarBadge({
						index: 2,
						text: String(newVal.length)
					});
				} else {
					uni.removeTabBarBadge({ index: 2 });
				}
			},
			deep: true
		}
	},
	computed: {
		...mapState(['cityData'])
	}
};
</script>

<style lang="scss">
@import './index.scss';
</style>
