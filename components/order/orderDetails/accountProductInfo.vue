<template>
	<!-- 会计生产方法 -->
	<view class="accountProductBg">
		<view class="topHeaderInfo">
			<view class="yearView">
				<image class="yearOpIcon" @click.stop="yearSubtractionAction" :src="imageBaseURL + 'common_icon_leftarrow.png'"></image>
				<text>{{ yearNum }}</text>
				<image @click.stop="yearAddAction" class="yearOpIcon" v-if="yearNum == currentYearNum" :src="imageBaseURL + 'common_icon_rightarrow_gray.png'"></image>
				<image @click.stop="yearAddAction" class="yearOpIcon" v-else :src="imageBaseURL + 'common_icon_rightarrow.png'"></image>
			</view>
			<view class="markView">
				<view class="notBegin">
					<view class="colorGray"></view>
					<text>未开始</text>
				</view>
				<view class="notBegin">
					<view class="colorGreen"></view>
					<text>已完成</text>
				</view>
				<view class="notBegin">
					<view class="colorBlue"></view>
					<text>进行中</text>
				</view>
			</view>
		</view>
		<!-- 列表 -->
		<view class="companyListBg">
			<view class="list-grid" v-for="(item, name) in compnayList" :key="name">
				<view class="name">成都XXX科技有限公司</view>
				<view class="code">信用代码:Q12111111111111111</view>
				<view style="height:2rpx;background-color:#F5F5F5;"></view>
				<view class="monthView">
					<view class="month-grid" v-for="(item, index) in 12" :key="index">
						<view :class="index == 1 ? 'leftRadius colorGreen' : index == 4 ? 'rightRadius colorGreen' : index > 1 && index <= 4 ? 'colorGreen' : ''">
							{{ index + 1 }}
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { order } from '@/api/index.js'
export default {
	data() {
		return {
			imageBaseURL: this.$config.imgUrl + 'order/',
			yearNum: 2018,
			currentYearNum: 2019,
			compnayList: [{}, {}, {}]
		};
	},
	props: {
		orderInfo: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	methods: {
		fetchData() {
			console.log(params);
			console.log('会计生产方法');
		},
		/**
		 * 年份相减
		 */
		yearSubtractionAction() {
			this.yearNum = --this.yearNum
		},
		/**
		 * 年份相加
		 */
		yearAddAction() {
			if (this.yearNum == this.currentYearNum) {
				return;
			}
			this.yearNum = ++this.yearNum
		}
	}
};
</script>
<style>
.accountProductBg {
	margin: 0rpx 32rpx 146rpx 32rpx;
}

.topHeaderInfo {
	height: 100rpx;
	display: flex;
	justify-content: space-between;
}

.topHeaderInfo .yearView {
	width: 240rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	color: #3a3b3d;
	font-size: 28rpx;
	font-weight: bold;
}

.topHeaderInfo .yearView .yearOpIcon {
	width: 15rpx;
	height: 25rpx;
	vertical-align: middle;
}

.topHeaderInfo .markView {
	width: calc(100% - 320rpx);
	display: flex;
	color: #a0a3a8;
	font-size: 24rpx;
	align-items: center;
	justify-content: space-between;
}

.topHeaderInfo .markView .notBegin {
	display: flex;
	align-items: center;
}

.topHeaderInfo .markView .notBegin view {
	width: 18rpx;
	height: 18rpx;
	border-radius: 18rpx;
	margin-right: 10rpx;
}

.topHeaderInfo .markView .notBegin .colorGreen {
	background-color: #12ca90;
}

.topHeaderInfo .markView .notBegin .colorBlue {
	background-color: #10c5e1;
}

.topHeaderInfo .markView .notBegin .colorGray {
	background-color: #f5f5f5;
}

/* 列表 */
.companyListBg {
}

.list-grid {
	-webkit-box-shadow: #dcdcdc 0px 0px 10px;
	-moz-box-shadow: #dcdcdc 0px 0px 10px;
	box-shadow: #dcdcdc 0px 0px 10px;
	border-radius: 5rpx;
	margin-bottom: 32rpx;
}

.list-grid .name {
	color: #3a3b3d;
	font-size: 28rpx;
	font-weight: bold;
	padding: 32rpx 32rpx 16rpx 32rpx;
}

.list-grid .code {
	color: #707175;
	font-size: 24rpx;
	padding: 0rpx 32rpx 32rpx 32rpx;
}

.list-grid .monthView {
	margin: 40rpx 28rpx 0rpx 28rpx;
	display: flex;
	justify-content: space-between;
	padding-bottom: 40rpx;
	border-radius: 40rpx;
}

.list-grid .monthView .month-grid {
	width: 78rpx;
	height: 60rpx;
	text-align: center;
	line-height: 60rpx;
	background-color: #f5f5f5;
	font-size: 24rpx;
}

.list-grid .monthView .month-grid:first-child {
	border-top-left-radius: 40rpx;
	border-bottom-left-radius: 40rpx;
	/* padding-left: 10rpx; */
}

.list-grid .monthView .month-grid:last-child {
	border-top-right-radius: 40rpx;
	border-bottom-right-radius: 40rpx;
	/* padding-right: 10rpx; */
}

.list-grid .monthView .month-grid .leftRadius {
	border-top-left-radius: 40rpx;
	border-bottom-left-radius: 40rpx;
	color: white;
}

.list-grid .monthView .month-grid .rightRadius {
	border-top-right-radius: 40rpx;
	border-bottom-right-radius: 40rpx;
	color: white;
}

.list-grid .monthView .month-grid .colorGreen {
	background-color: #12ca90;
	color: white;
}

.list-grid .monthView .month-grid .colorBlue {
	background-color: #10c5e1;
	color: white;
}

.list-grid .monthView .month-grid .colorGray {
	background-color: #f5f5f5;
	color: #3a3b3d;
}
</style>
