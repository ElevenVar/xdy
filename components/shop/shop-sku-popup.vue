<template>
	<!-- 商品详情sku等选择上弹框 -->
	<tui-bottom-popup :show="skuPopupShow" @close="hidePopup">
		<view class="tui-popup-box">
			<view class="tui-product-box tui-padding">
				<image :src="item ? item.commoditySku.skuImgs : product.skuImgs" class="tui-popup-img"></image>
				<view class="tui-popup-price">
					<view class="tui-amount tui-bold" v-if="skuIsDiscuss==0">￥{{ item ? item.commoditySku.skuSellingPrice : product.skuSellingPrice | price }}</view>
					<view class="tui-amount tui-bold" v-else>面议</view>
					<view class="tui-number">编号:{{item ? item.commodity.comCode : product.comCode }}</view>
				</view>
			</view>
			<scroll-view scroll-y class="tui-popup-scroll">
				<view class="tui-scrollview-box"  v-if="item">
					<block v-for="(items, index) in item.commodityPropertyBySkuList" :key="index">
						<view class="tui-attr-title">{{ items.propName }}</view>
						<view class="tui-attr-box">
							<button
								class="tui-attr-item"
								v-for="tabItem in items.commodityPropertyValueList"
								:class="tabItem.isSelected == 1 ? 'tui-attr-active' : ''"
								:key="tabItem.valName"
								:disabled="tabItem.isShow == 0"
								@tap="handleCkeck(index, tabItem.valName)"
							>
								{{ tabItem.valName }}
							</button>
						</view>
					</block>
					<view class="tui-number-box tui-bold tui-attr-title">
						<view class="tui-attr-title">数量</view>
						<tui-numberbox max="99" min="1" :value="skuItemNum" @change="change"></tui-numberbox>
					</view>
				</view>
				<load-more v-else></load-more>
			</scroll-view>
			<view class="tui-operation tui-operation-right tui-right-flex tui-popup-btn tui-btn-class-yes ">
				<block><button type="red" class="tui-btn-class tui-flex-1" v-if="skuIsDiscuss==0"  @click="handleSubmit(handleType)">确定</button>
				<button class="tui-btn-class tui-flex-1" type="primary" open-type='contact' v-else>立即咨询</button>
				</block>
			</view>
			<view class="tui-icon tui-icon-close-fill tui-icon-close" style="color: #999;font-size:24px" @tap="hidePopup"></view>
		</view>
	</tui-bottom-popup>
</template>

<script>
import tuiBottomPopup from '@/components/bottom-popup/bottom-popup';
import tuiNumberbox from '@/components/numberbox/numberbox';
import loaDmore from '@/components/loadmore/loadmore.vue'
import { commodity } from '@/api/index.js';
import { regFenToYuan } from '@/utils/util.js';
import mixinsShop from '@/common/mixins/shop.js';
export default {
	components: {
		tuiBottomPopup,
		tuiNumberbox,
		loaDmore
	},
	mixins: [mixinsShop],
	data() {
		return {
			skuId: '',
			num: '',
			item: false,
			skuIsDiscuss: 0
		};
	},
	props: {
		skuPopupShow: {
			type: Boolean,
			default: false
		},
		items: {
			type: Object || Boolean,
			default() {
				return false;
			}
		},
		skuItemNum: {
			type: Number,
			default: 1
		},
		product: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	watch: {
		items(newVal) {
			if(newVal){
				this.skuId = this.items.commoditySku.skuId;
				this.item = this.items
			}
		},
		skuPopupShow(newVal){
			this.item = false
			if(!newVal){
				this.$parent.skuItem = false
			}
		},
		item(n){
			if(JSON.stringify(n.commoditySku) == '{}') {
				this.item = false
			}
		}
	},
	methods: {
		// sku 属性选择
		handleCkeck(index, name) {
			this.item.commodityPropertyBySkuList[index].commodityPropertyValueList.forEach(el => {
				if (el.valName == name) {
					el.isSelected = 1;
				} else {
					el.isSelected = 0;
				}
			});
			let num = this.getSkuIDs(this.item.commodityPropertyBySkuList);
			let data = {
				values: num,
				comId: this.item.commoditySku.skuComId
			};
			uni.showLoading({});
			this.$http.get(commodity.skuSearch, data).then(res => {
				uni.hideLoading();
				if (res.code == 200) {
					this.item.commodityPropertyBySkuList = res.data.commodityPropertyBySkuList;
					this.item.commoditySku = res.data.commoditySku;
					this.skuId = res.data.commoditySku.skuId;
					this.skuIsDiscuss = res.data.commoditySku.skuId;
				} else {
					uni.showToast({
						icon: 'none',
						title: res.msg
					});
				}
			});
		},
		// 遍历sku已选属性
		getSkuIDs(data) {
			let arr = [];
			data.forEach(el => {
				el.commodityPropertyValueList.forEach(val => {
					if (val.isSelected == 1) {
						arr.push(val.valId);
					}
				});
			});
			return arr.join(',');
		},
		// 父组件关闭弹窗事件
		hidePopup() {
			this.$emit('close');
		},
		// 输入框的值改变
		change(e) {
			let num = e.value < 2 ?  1 : e.value
			this.$emit('skuItemNumChange', num);
			this.num = num;
		},
		handleSubmit() {
			console.log(this.item)
			this.$emit('changeSku', {
				skuSellingPrice: this.item.commoditySku.skuSellingPrice,
				skuId: this.skuId,
				shopIds: this.item.commoditySku.shopIds,
				num: this.num ? this.num : this.skuItemNum,
				skuPropertyVname: this.item.commoditySku.skuPropertyVname
			});
		}
	}
};
</script>

<style lang="scss" scoped>
/* icon 也可以使用组件*/
@import '../../static/style/icon.css';

.tui-btn-class-yes {
	position: static !important;
	margin-bottom: 20rpx;
	margin-top: 20rpx;
}
.tui-popup-class {
	border-top-left-radius: 24rpx;
	border-top-right-radius: 24rpx;
	padding-bottom: env(safe-area-inset-bottom);
	background: #fff !important;
}
.yes-btn {
	display: block;
	width: 686rpx;
	height: 76rpx;
	margin: 12rpx auto 12rpx;
	background: #10bbb8;
	border-radius: 8rpx;
	color: #fff;
}

.tui-popup-btn {
	width: 100%;
	position: absolute;
	left: 0;
	bottom: 0;
	padding: 0 32rpx;
	box-sizing: border-box;
}

.tui-popup-btn .tui-btn-class {
	width: 686rpx;
	height: 76rpx;
	line-height: 76rpx;
	color: #fff;
	font-weight: 500;
	background: #10bbb8;
	border-radius: 8rpx;
	display: block !important;
	font-size: 32rpx !important;

	&.hot {
		background: #ff6600;
	}
}

.tui-icon-close {
	position: absolute;
	top: 30rpx;
	right: 30rpx;
}

.tui-product-box {
	display: flex;
	align-items: flex-end;
	font-size: 24rpx;
	padding: 0 32rpx;
	padding-bottom: 30rpx;
	margin-top: 32rpx;
}
.tui-popup-img {
	height: 200rpx;
	width: 200rpx;
	border-radius: 24rpx;
	display: block;
}

.tui-popup-price {
	padding-left: 36rpx;
	padding-bottom: 8rpx;
}

.tui-amount {
	color: #ff6600;
	font-size: 36rpx;
}

.tui-number {
	font-size: 24rpx;
	line-height: 24rpx;
	padding-top: 12rpx;
	color: #878787;
}

.tui-popup-scroll {
	font-size: 26rpx;
	height: 500rpx;
	border-bottom: 1px solid #d7d8d9;
}

.tui-scrollview-box {
	padding: 0 32rpx 0rpx 32rpx;
	box-sizing: border-box;
}

.tui-scrollview-box.hot {
	padding-top: 32rpx;
	padding-bottom: 0;
}

.tui-attr-title {
	padding: 10rpx 0;
	color: #252525;
	font-size: 28rpx;
}

.tui-attr-box {
	font-size: 0;
	padding: 20rpx 0;
}

.tui-attr-item {
	max-width: 100%;
	min-width: 200rpx;
	height: 64rpx;
	display: -webkit-inline-flex;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	background: #f0f2f5;
	color: #565656;
	padding: 0 24rpx;
	box-sizing: border-box;
	border-radius: 8rpx;
	margin-right: 24rpx;
	margin-bottom: 24rpx;
	font-size: 28rpx;
}

.tui-number-box {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 0 30rpx 0;
	margin-bottom: 20rpx;
	box-sizing: border-box;
}

/*商品详情 底部选择弹层*/
.tui-attr-active {
	background: #E0FAFA;
	border: 2rpx solid #10BBB8;
	border-radius: 8rpx;
	color: #10BBB8;
	font-weight: 500;
}
/*底部选择弹层*/
</style>
