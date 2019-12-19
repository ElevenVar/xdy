<template>
	<view class="personalDetails">
		<view class="list-view">
			<tui-list-cell>
				<text class="tui-list-cell-name require">甲方名称</text>
				<view class="tui-right hot"><input type="text" maxlength="10" placeholder="请填写甲方名称" v-model="params.firstName" /></view>
			</tui-list-cell>
			<tui-list-cell>
				<text class="tui-list-cell-name require">负责人</text>
				<view class="tui-right hot"><input type="text" maxlength="10" placeholder="请填写负责人名称" v-model="params.firstContacts" /></view>
			</tui-list-cell>
			<tui-list-cell>
				<text class="tui-list-cell-name require">联系电话</text>
				<view class="tui-right hot"><input type="text" maxlength="11" placeholder="请填写联系电话" v-model="params.firstPhone" /></view>
			</tui-list-cell>
			<tui-list-cell>
				<text class="tui-list-cell-name">E-mail</text>
				<view class="tui-right hot"><input type="text" maxlength="20" placeholder="请填写邮箱" v-model="params.firstEmail" /></view>
			</tui-list-cell>

			<tui-list-cell>
				<text class="tui-list-cell-name">通讯地址</text>
				<view class="tui-right hot"><input type="text"  maxlength="30" placeholder="请填写通讯地址" v-model="params.firstAddr" /></view>
			</tui-list-cell>
			<view class="btn" @tap="handleSubmit">立即申请合同</view>
		</view>
	</view>
</template>

<script>
import tuiIcon from '@/components/icon/icon';
import tuiListCell from '@/components/list-cell/list-cell';
import tuiBadge from '@/components/badge/badge';
import wPicker from '@/components/w-picker/w-picker.vue';
import util from '@/utils/util.js';
import { order } from '@/api/index.js';
export default {
	components: {
		tuiIcon,
		tuiListCell,
		tuiBadge,
		wPicker
	},
	data() {
		return {
			mode: '',
			img: `${this.$config.imgUrl}mall/product/1.jpg`,
			sexArray: [],
			isClick: true,
			params: {
				orderId: '',
				firstName: '',
				firstContacts: '',
				firstPhone: '',
				firstEmail: '',
				firstAddr: ''
			}
		};
	},
	onLoad(options) {
		this.params.orderId = options.orderId;
	},
	methods: {
		// 立即申请合同
		handleSubmit() {
			let nameReg = /^(?:[\u4e00-\u9fa5·]{1,16})$/; //姓名正则
			let telReg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/; // 手机正则
			// 邮箱正则
			let emailReg = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
			let zuoReg = /\d{3}-\d{8}|\d{4}-\d{7}/;
			if (!this.params.firstName) {
				uni.showToast({ title: '请填写甲方名称', icon: 'none' });
			} else if (!nameReg.test(this.params.firstName)) {
				uni.showToast({ title: '请填写中文甲方名称', icon: 'none' });
			} else if (!this.params.firstContacts) {
				uni.showToast({ title: '请填写负责人名称', icon: 'none' });
			} else if (!nameReg.test(this.params.firstContacts)) {
				uni.showToast({ title: '请填写中文负责人名称', icon: 'none' });
			} else if (!this.params.firstPhone) {
				uni.showToast({ title: '请填写联系电话', icon: 'none' });
			} else if (!telReg.test(this.params.firstPhone)) {
				uni.showToast({ title: '请填写正确的联系电话', icon: 'none' });
			} else if (this.params.firstEmail && !emailReg.test(this.params.firstEmail)) {
				uni.showToast({ title: '请填写正确的邮箱', icon: 'none' });
			} else {
				if(this.isClick){
					this.isClick = false
					uni.showLoading({ title: '加载中', mask: true })
					this.$http.post(order.contractUrl, this.params).then(res => {
						uni.hideLoading()
						if(res.code == 200) {
							uni.setStorageSync('orderChange', true)
							uni.showToast({ title: '提交成功', icon: 'none' });
							setTimeout(() => {
								uni.navigateBack({})
							}, 1500)
						} else {
							uni.showToast({ title: res.message, icon: 'none' });
							this.isClick = true
						}
					})
				}
			}
		}
	}
};
</script>

<style scoped>
.tui-right {
	margin-left: auto;
	margin-right: 32rpx;
	font-size: 28rpx;
	line-height: 1;
	color: #252525;
	font-weight: 500;
	flex: 1;
	text-align: right;
}

.tui-right.hot {
	margin-right: 0;
}

.tui-list >>> .tui-list-cell {
	height: 160rpx !important;
}

.image {
	width: 84rpx;
	height: 84rpx;
	border-radius: 50%;
	margin-left: auto;
	margin-right: 34rpx;
}

.tui-list-cell-name {
	/* padding-left: 20rpx; */
	vertical-align: middle;
	line-height: 30rpx;
	color: #565656;
	font-weight: bold;
	font-size: 28rpx;
	position: relative;
}
.tui-list-cell-name.require::after{
	content: '*';
	color: red;
	margin-left: 10rpx;
}
input {
	font-size: 28rpx;
	font-weight: 500;
	color: #252525;
}

.input-placeholder {
	font-size: 28rpx;
	font-weight: 500;
	color: #878787;
}

.btn {
	width: 686rpx;
	height: 96rpx;
	line-height: 96rpx;
	text-align: center;
	color: #fff;
	font-size: 32rpx;
	margin: 80rpx auto 0;
	background: rgba(16, 187, 184, 1);
	border-radius: 8rpx;
}

.picker {
	width: 100%;
	height: 100%;
	line-height: 100%;
}
</style>
