<template>
	<view>
		<!--合同信息-->
		<view class="orderContractBg" v-if="contractList.length > 0 && isLoading">
			<view>
				<view class="orderContract-grid" v-for="(item, name) in contractList" :key="name" @tap.stop="lookContractAction(item)">
					<image class="contract-cover" :src="item.imgList && item.imgList.length > 0 ? item.imgList[0].filepath : imageBaseURL + 'order_contract_temp.png'"></image>
					<view class="contract-info">
						<view class="contractName">{{ item.contractName ? item.contractName : '--' }}</view>
						<view class="contractNo">编号：{{ item.contractNo ? item.contractNo : '--' }}</view>
						<view class="contractDate">签署日期 {{ item.applyTime ? item.applyTime : '--' }}</view>
					</view>
					<view :hidden="index == contractList.length - 1" style="width:100%;height:2rpx;background-color:#EBEFF8;margin:32rpx 0rpx;"></view>
				</view>
			</view>
		</view>
		<view v-if="isData && contractList.length == 0" class="noProductView">
			<view class="infoView">
				<image :src="imageBaseURL + 'no-order.png'"></image>
				<view>暂无合同信息~</view>
			</view>
		</view>
	</view>
</template>

<script>
import Util from '@/utils/util.js';
import { order } from '@/api/index.js';
export default {
	data() {
		return {
			imageBaseURL: this.$config.imgUrl + 'order/',
			contractList: [],
			isLoading: false,
			isData: false
		};
	},
	props: {
		contractNo: {
			type: String || Number || null,
			default: ''
		}
	},
	mounted() {
		if (this.contractNo) {
			this.getInithData();
		} else {
			this.isData = true
			this.isLoading = true;
		}
	},
	methods: {
		getInithData: function() {
			var contractData = {};
			var contractList = [];
			console.log(this.contractNo)
			this.contractNo.split(',').map(item => {
				console.log(item)
				this.$http.get(order.getOrderContractUrlListURL, { contractNo: item }).then(result => {
					if (result.code == 200) {
						if (result.data) {
							contractData = JSON.parse(result.data);
							contractList.push(contractData);
						}
						this.contractList = contractList
						if(this.contractList.length == 0) {
							this.isData = true
						}
						this.isLoading = true
					} else {
						this.isLoading = true
					}
				});
			})
		},
		/**
		 * 查看合同
		 */
		lookContractAction(item) {
			uni.showLoading({
				title: '加载中。。'
			})
			let url = item.pdfPath;
				Util.previewFdf(url).then(result => {
				uni.hideLoading()
			});
		}
	}
};
</script>
<style>
/* pages/order/components/orderContractInfo/orderContractInfo.css */

.orderContractBg .orderContract-grid {
	/* display: flex; */
	/* flex-direction: row; */
	padding-top: 60rpx;
	box-sizing: border-box;
}

.orderContractBg .orderContract-grid .contract-cover {
	width: 154rpx;
	height: 218rpx;
	display: inline-block;
}
.infoView {
	padding: 100rpx 0;
	font-size: 28rpx;
	line-height: 60rpx;
}
.orderContractBg .orderContract-grid .contract-info {
	width: calc(100% - 200rpx);
	margin-left: 32rpx;
	display: inline-block;
	vertical-align: top;
}

.orderContractBg .orderContract-grid .contract-info .contractName {
	color: #3a3b3d;
	font-size: 28rpx;
	font-weight: bold;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	line-height: 40rpx;
}

.orderContractBg .orderContract-grid .contract-info .contractNo {
	color: #a0a3a8;
	margin-top: 20rpx;
	font-size: 24rpx;
}

.orderContractBg .orderContract-grid .contract-info .contractDate {
	color: #a0a3a8;
	font-size: 24rpx;
	margin-top: 20rpx;
}

/* 无合同信息 */
.noProductView {
	width: 100%;
	text-align: center;
	font-size: 38rpx;
	color: #a0a3a8;
}

.noProductView .infoView image {
	width: 200rpx;
	height: 200rpx;
}
</style>
