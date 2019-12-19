<template>
	<view class="invitationListContent">
		<view class="cellBgView" v-for="(item, index) in addressList" :key="index">
			<view style=" padding-bottom: 20rpx;">
				<text class="productNameLabel">{{ item.contacts }}</text>
			</view>
			<view class="content">
				<view class="content-left">
					<view class="content-address">
						<view class="content-default" :hidden="!item.defaultAddress">默认</view>
						{{ item.province }}&nbsp;&nbsp;{{ item.city }}&nbsp;&nbsp;{{ item.area }}&nbsp;&nbsp;{{ item.address }}
					</view>
				</view>
				<view class="content-right" @click.stop="editAction(item)">编辑</view>
			</view>
		</view>

		<!-- 无数据显示 -->
		<view class="noDataBgView" v-if="!addressList || addressList.length== 0">
			<view class="noDataContent">
				<image class="noDataImage" :src="imageBaseURL + 'my/wujilu.png'"></image>
				<view class="noDataLabel"><text>未添加地址</text></view>
			</view>
		</view>

		<view class="bottom" @tap="addAddressAction">添加新地址</view>
	</view>
</template>

<script>
import { accountSet } from '@/api/index.js';
export default {
	data() {
		return {
			imageBaseURL: this.$config.imgUrl,
			isNoMoreData: true,
			addressList: null,
			isLoading: false,
			error: false,
			isShow: false
		};
	},
	onReachBottom: function() {
		if (this.isNoMoreData == true) {
			uni.showToast({
				title: '没有更多数据了',
				icon: 'none'
			});
			return;
		}

		this.fetchDataList();
	},
	onShow: function() {
		this.fetchDataList();
	},
	onLoad: function(options) {},
	props: {},
	methods: {
		/**
		 * 刷新页面
		 */
		refresh(e) {
			this.setData({
				error: false
			});
			uni.startPullDownRefresh({});
		},

		/**
		 * 拉取数据
		 */
		fetchDataList: function() {
			this.setData({
				error: false
			});
			this.$http.post(accountSet.addressFindList, {}).then(result => {
				uni.stopPullDownRefresh();
				this.setData({
					isLoading: true
				});
				console.log(result.data);

				if (result.code == 200) {
					var dataList = result.data;
					this.setData({
						addressList: dataList,
						isNoMoreData: true
					});
					if (result.data.length == 0) {
						this.isShow = true;
					}
				} else {
					this.isShow = true;
					uni.showToast({
						title: result.message ? result.message : result.msg,
						icon: 'none'
					});
				}
			});
		},

		editAction(item) {
			uni.navigateTo({
				url: '/pages/accountSetting/address/addAddress/addAddress?item=' + JSON.stringify(item)
			});
		},

		addAddressAction() {
			if (this.addressList.length > 9) {
				uni.showToast({
					title: '联系地址已达上限',
					icon: 'none'
				});
				return;
			}

			uni.navigateTo({
				url: '/pages/accountSetting/address/addAddress/addAddress'
			});
		},

		setData: function(obj) {
			let that = this;
			let keys = [];
			let val, data;
			Object.keys(obj).forEach(function(key) {
				keys = key.split('.');
				val = obj[key];
				data = that.$data;
				keys.forEach(function(key2, index) {
					if (index + 1 == keys.length) {
						that.$set(data, key2, val);
					} else {
						if (!data[key2]) {
							that.$set(data, key2, {});
						}
					}

					data = data[key2];
				});
			});
		}
	}
};
</script>
<style lang="scss">
/* pages/user/setting/mineAddress/mineAddress.css */

/* pages/invitation/invitationList.css */

page {
	background-color: #f5f5f5;
}

.invitationListContent {
	padding-bottom: 164rpx;
}

.cellBgView {
	margin-top: 16rpx;
	border-radius: 10rpx;
	margin: 30rpx 30rpx;
	background-color: white;
	padding: 30rpx;
	padding-bottom: 0px;
}

.content {
	display: flex;
	justify-content: space-between;
	padding-bottom: 20rpx;
}

.content-left {
	color: #707175;
	font-size: 28rpx;
	display: flex;
}

.content-default {
	background-color: #c7f2f8;
	font-size: 24rpx;
	color: #08c5e2;
	width: 82rpx;
	height: 34rpx;
	line-height: 34rpx;
	text-align: center;
	border-radius: 4rpx;
	display: inline-block;
	margin-right: 6rpx;
	margin-bottom: 6rpx;
}

.content-address {
	padding-left: 10rpx;
}

.content-right {
	width: 150rpx;
	height: 70rpx;
	color: #adb4be;
	text-align: center;
	font-size: 28rpx;
	border-left: 1px #ebeff8 dashed;
}

.cellContent {
	margin: 30rpx 0rpx;
}

.commonCell {
	margin: 20rpx 0rpx;
	display: flex;
	justify-content: space-between;
}

.titleLabel {
	font-size: 28rpx;
	font-family: PingFang-SC-Medium;
	font-weight: 500;
	color: rgba(153, 153, 153, 1);
	min-width: 140rpx;
}

.contentLabel {
	font-size: 28rpx;
	font-family: PingFang-SC-Medium;
	font-weight: 500;
	border-radius: 24rpx;
	height: 48rpx;
	width: 136rpx;
	text-align: center;
	line-height: 48rpx;
}

.productNameLabel {
	font-size: 32rpx;
	font-family: PingFang-SC-Bold;
	font-weight: bold;
	color: rgba(51, 51, 51, 1);
}

.noDataBgView {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	width: 100%;
	height: 100vh;
	background-color: #f5f5f5;
	z-index: -1;
}

.noDataContent {
	position: absolute;
	top: 40%;
	left: 50%;
	transform: translate(-50%, -50%);
	text-align: center;
	vertical-align: middle;
}

.noDataImage {
	width: 240rpx;
	height: 240rpx;
}

.noDataLabel {
	font-size: 28rpx;
	color: rgba(153, 153, 153, 1);
}

.bottom {
	position: fixed;
	bottom: 64rpx;
	left: 30rpx;
	right: 30rpx;
	height: 100rpx;
	background: $default-color;
	border-radius: 28px;
	text-align: center;
	line-height: 100rpx;
	color: white;
	font-size: 32rpx;
}
</style>
