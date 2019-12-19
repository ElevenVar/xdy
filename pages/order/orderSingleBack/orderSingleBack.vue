<template>
	<!--pages/order/orderComplaints/orderComplaints.wxml-->
	<view class="complaintsPage">
		<view class="topHeaderBg">
			<image :src="imageBaseURL + 'order/order_image_return_bg.png'"></image>
			<view class="headerContent">
				<!-- <view class="one-line">代理记账成都IT行业小规模纳税人200-300w</view> -->
				<view>订单号</view>
				<view>{{ orderInfo.orderNumber }}</view>
			</view>
		</view>
		<view class="lineView"></view>
		<!-- 退单理由 -->
		<view class="complaintsReasonBg">
			<view class="inputHeaderTitle">
				<view></view>
				<text space="ensp">您为什么想要退单？</text>
			</view>
			<view class="inputReasonBg" @tap="show()">
				<view>{{ selectedRefundReson.name }}</view>
				<view><image :src="imageBaseURL + 'order/common_more_arrow.png'"></image></view>
			</view>
		</view>
		<!-- 退单类型 -->
		<view class="complaintsReasonBg">
			<view class="inputHeaderTitle">
				<view></view>
				<text space="ensp">请选择退单类型？</text>
			</view>
			<view class="inputReasonBg" @tap="showType()">
				<view>{{ selectedRefundType.name }}</view>
				<view><image :src="imageBaseURL + 'order/common_more_arrow.png'"></image></view>
			</view>
		</view>
		<view class="lineView"></view>
		<!-- 描述 -->
		<view class="remarkBg">
			<view class="inputHeaderTitle">
				<view></view>
				<text space="ensp">描述</text>
			</view>
			<view class="inputRemark"><textarea fixed="true" placeholder="请填写详细描述，系统将指派专人进行处理。" maxlength="200" v-model="remark"></textarea></view>
			<view class="anonymousBg">
				<label>
					<checkbox :value="anonymousRadio" />
					<text>匿名退单</text>
				</label>
			</view>
		</view>
		<view class="lineView"></view>
		<!-- 上传图片 -->
		<view class="update">
			<text style="font-size:28rpx;font-family:PingFangSC-Regular;font-weight:400;color:rgba(58,59,61,1);line-height:100rpx;">上传附件</text>
			<text style="font-size:28rpx;font-family:PingFangSC-Regular;font-weight:400;color:#A0A3A8;line-height:100rpx;">（图片小于20M）</text>
			<view class="imageContainer">
				<view class="updateImg" v-for="(item, index) in imageList" :key="index">
					<image class="show" :data-url="item" @click.stop="lookImagePre" :src="item"></image>
					<image :src="imageBaseURL + 'order/common_input_clear.png'" class="deleteImage" :data-index="index" @click.stop="deleteImageAction"></image>
				</view>
				<view class="updateImg" @click.stop="chooseImageAction"><image class="add" :src="imageBaseURL + 'order/icon_plus2@2x.png'"></image></view>
			</view>
		</view>
		<!-- 提交按钮 -->
		<view class="submit" @tap.stop="submitButtonAction"><text>提交</text></view>
		<tui-picker :showPickerStatus="showPickerStatus" :value="value" @hidePicker="hidePicker" :list="refundResonList" @onPicker="onPicker"></tui-picker>
		<tui-picker :showPickerStatus="showPickerStatusType" :value="value" @hidePicker="hidePicker" :list="refundTypeList" @onPicker="onPickerType"></tui-picker>
	</view>
</template>

<script>
import TuiPicker from '@/components/common/tui-picker/tui-picker.vue';
import { order } from '@/api/index.js';
import { uploadImage } from '@/utils/util.js';
export default {
	data() {
		return {
			imageBaseURL: this.$config.imgUrl,
			anonymousRadio: false,
			showPickerStatus: false,
			refundResonList: [],
			remark: '',
			selectedRefundReson: { name: '请选择退单原因' },
			value: [0],
			appealContent: '',
			orderInfo: {},
			selectedRefundType: { name: '请选择退单类型' },
			refundTypeList: [
				{
					code: 'GUAUGA_ORDER_TDLX_TD',
					name: '退单'
				},
				{
					code: 'GUAUGA_ORDER_TDLX_TK',
					name: '退款'
				}
			],
			showPickerStatusType: false,
			uploadTargetId: '',
			uploadFileId: '',
			imageList: []
		};
	},
	components: {
		TuiPicker
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		this.orderInfo = JSON.parse(options.order);
		console.log(this.orderInfo);
		this.getOrderRefundResonList();
		this.getUploadImageFileId();
	},
	methods: {
		// 获取退单原因配置
		getOrderRefundResonList() {
			this.$http.get(order.getOrderRefundReasonURL, {}).then(res => {
				if (res.code == 200) {
					this.refundResonList = res.data;
				}
			});
		},
		// 打开退单理由弹窗
		show() {
			this.showPickerStatus = true;
		},
		// 打开退单类型弹窗
		showType() {
			this.showPickerStatusType = true;
		},
		// 匿名提交事件
		anonymousComplaintsAction: function(e) {
			this.anonymousRadio = name;
		},
		// 退单理由弹窗确定
		onPicker(value) {
			console.log(value);
			this.selectedRefundReson = this.refundResonList[value];
			this.showPickerStatus = false;
		},
		// 退单类型弹窗确定
		onPickerType(value) {
			console.log(value);
			this.selectedRefundType = this.refundTypeList[value];
			this.showPickerStatusType = false;
		},
		hidePicker() {
			this.showPickerStatusType = false;
			this.showPickerStatus = false;
		},
		/**
		 * 选择图片
		 */
		chooseImageAction() {
			var that = this;
			if (that.imageList.length >= 9) {
				uni.showToast({
					title: '最多只能上传9张图片',
					icon: 'none'
				});
				return;
			}
			uni.chooseImage({
				count: 9 - that.imageList.length,
				success: function(res) {
					console.log(res);
					that.isUploadSuccess = false;
					if (that.imageList.length > 0) {
						var tempList = that.imageList;
						tempList = tempList.concat(res.tempFilePaths);
						that.imageList = tempList;
					} else {
						that.imageList = res.tempFilePaths;
					}
				},
				fail: function(error) {
					console.log(error);
				}
			});
		},

		/**
		 * 删除图片
		 */
		deleteImageAction: function(event) {
			let index = event.currentTarget.dataset.index;
			var imageList = this.imageList;
			imageList.splice(index, 1);
			this.imageList = imageList;
		},

		/**
		 * 预览图片
		 */
		lookImagePre: function(event) {
			let current = event.currentTarget.dataset.url;
			uni.previewImage({
				urls: this.imageList,
				current: current
			});
		},
		//获取文件上传ID
		getUploadImageFileId() {
			this.$http.get(order.getOrderFefundFileIDURL, { orderId: this.orderInfo.orderId }).then(res => {
				if (res.code == 200) {
					(this.uploadFileId = res.data.targetId), (this.uploadTargetId = res.data.targetId);
				}
			});
		},
		// 上传图片
		uploadChooseImage() {
			const userInfo = uni.getStorageSync('userInfo');
			uni.showLoading({ title: '上传中', mask: true });
			let count = 0
			this.imageList.map(item => {
				(function(item){
					uploadImage(item,  'member_header', this.uploadFileId, res => {
						console.log(res)
						uni.hideLoading();
						count++
						if(count == this.imageList.length) {
							this.isUploadSuccess = true;
						}
					});
				})(item)
			})
		},
		/**
		 * 提交
		 */
		submitButtonAction: function(event) {
			if (!this.selectedRefundReson.code) {
				uni.showToast({ title: '请选择退款原因', icon: 'none' });
			} else if (!this.selectedRefundType.code) {
				uni.showToast({ title: '请选择退款类型', icon: 'none' });
			} else if (!this.remark) {
				uni.showToast({ title: '请填写详细描述', icon: 'none' });
			} else {
				this.orderRefundOperation();
			}
		},
		/**
		 * 退单操作
		 */
		orderRefundOperation() {
			var reasonObj = {
				reasonCode: this.selectedRefundReson.code,
				reasonMsg: this.selectedRefundReson.name
			};
			var reasonObjList = [];
			reasonObjList.push(reasonObj);
			let requestParams = {
				orderId: this.orderInfo.orderId,
				refundCode: this.selectedRefundType.code,
				questionDescri: this.remark,
				reasonJson: JSON.stringify(reasonObjList),
				id: this.uploadTargetId
			};
			if (this.imageList.length > 0) {
				this.uploadChooseImage();
			}
			uni.showLoading({ title: '加载中..' })
			this.$http.post(order.orderRefundURL, requestParams).then(res => {
				uni.hideLoading()
				if (res.code == 200) {
					uni.showToast({ title: res.message, icon: 'none' });
					uni.setStorageSync('orderChange', true)
					setTimeout(() => {
						uni.navigateBack({});
					}, 1500);
				} else {
					uni.showToast({ title: res.message, icon: 'none' });
				}
			}).catch(() => {
				uni.hideLoading()
			});
		}
	}
};
</script>
<style>
/* pages/order/orderComplaints/orderComplaints.css */
.complaintsPage {
	width: 100%;
}

.topHeaderBg {
	width: 100%;
	height: 244rpx;
	position: relative;
}

.topHeaderBg image {
	width: 100%;
	height: 100%;
}
.one-line {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.topHeaderBg .headerContent {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 180rpx;
	padding: 50rpx 32rpx;
	color: white;
	font-size: 26rpx;
}

.topHeaderBg .headerContent > view:nth-child(2) {
	margin: 15rpx 0;
}
.topHeaderBg .headerContent > view:nth-child(1),
.topHeaderBg .headerContent > view:nth-child(3) {
	color: white;
	font-size: 36rpx;
	font-weight: bolder;
}

.lineView {
	width: 100%;
	height: 20rpx;
	background-color: #f5f5f5;
}

.inputHeaderTitle {
	color: #707175;
	font-size: 24rpx;
	display: block;
	position: relative;
}
.inputHeaderTitle text {
	display: inline-block;
	text-indent: 20rpx;
}
.inputHeaderTitle > view:first-child {
	width: 17rpx;
	height: 17rpx;
	border-radius: 10rpx;
	background-color: #ff5644;
	display: inline-block;
}

/* 退单理由 */
.complaintsReasonBg {
	padding: 32rpx 32rpx 20rpx 32rpx;
	background: #fff;
}

.inputReasonBg {
	width: calc(100% - 64rpx);
	height: 72rpx;
	background-color: #f5f5f5;
	margin: 20rpx 0rpx;
	display: flex;
	justify-content: space-between;
	align-content: space-between;
	line-height: 72rpx;
	font-size: 28rpx;
	color: #3a3b3d;
	padding: 0rpx 32rpx;
}

.inputReasonBg image {
	width: 15rpx;
	height: 25rpx;
	vertical-align: middle;
}

/* 描述 */
.remarkBg {
	padding: 32rpx 32rpx 20rpx 32rpx;
	background: #fff;
}

.inputRemark {
	margin: 20rpx 0rpx 0rpx 0rpx;
	background-color: #f5f5f5;
	border-radius: 5rpx;
	font-size: 28rpx;
}

.inputRemark textarea {
	padding: 30rpx 24rpx;
	color: #3a3b3d;
}

.anonymousBg {
	margin-top: 20rpx;
	height: 60rpx;
	line-height: 60rpx;
	font-size: 28rpx;
	font-family: PingFangSC-Regular, PingFangSC;
	font-weight: 400;
	color: rgba(160, 163, 168, 1);
}
.anonymousBg checkbox {
	width: 40rpx;
	height: 40rpx;
	margin-right: 30rpx;
}
.anonymousBg .anonymousLabel {
	color: #a0a3a8;
	font-size: 28rpx;
}
/* 上传图片 */
.imageContainer {
	display: flex;
	display: -webkit-flex;
	flex: 3;
	flex-direction: row;
	flex-wrap: wrap;
	/* padding: 28rpx 80rpx 24rpx 80rpx; */
	justify-content: space-between;
	align-content: flex-start;
}

.update {
	padding: 0 30rpx 0 32rpx;
	background-color: #ffffff;
	margin-top: 20rpx;
}

.updateImg {
	height: 210rpx;
	width: 210rpx;
	background-color: #f5f5f5;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-bottom: 30rpx;
	position: relative;
}

.updateImg .show {
	height: 210rpx;
	width: 210rpx;
}

.updateImg .add {
	height: 66rpx;
	width: 66rpx;
}

.updateImg .deleteImage {
	position: absolute;
	top: 0;
	right: 0;
	height: 30rpx;
	width: 30rpx;
}

/* 提交按钮 */
.submit {
	margin: auto;
	margin-top: 48rpx;
	width: 686rpx;
	height: 100rpx;
	text-align: center;
	background: rgba(85, 138, 242, 1);
	border-radius: 56rpx;
	/* background-color: #B4EAF2; */
	margin-bottom: 40rpx;
}

.submit text {
	font-size: 32rpx;
	font-family: PingFangSC-Regular;
	font-weight: 400;
	color: rgba(255, 255, 255, 1);
	line-height: 100rpx;
}
</style>
