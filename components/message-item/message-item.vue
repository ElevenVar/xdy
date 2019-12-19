<template>
	<view class="messageClassify page">
		<block v-if="list && list.length > 0">
			<view class="mine-box">
				<block v-for="(item, index) in list" :key="index">
				<button class="mine-item" v-if="item.contact" open-type="contact">
					<view class="item-img">
						<image :src="item.img" mode=""></image>
						<view class="badge" v-if="item.readStatus == 1"></view>
					</view>
					<view class="item-content">
						<view class="item-type">
							<view class="name">{{ item.type }}</view>
							<view class="date">{{ item.date }}</view>
						</view>
						<view class="item-desc" :class="item.list ? 'one-line' : ''">{{ item.content }}</view>
						<!-- <view class="item-desc ellipsis">{{ item.content }}</view> -->
					</view>
				</button>
				<view class="mine-item" v-if="!item.contact" @tap="handleTap(item, index)">
					<view class="item-img">
						<image :src="item.img" mode=""></image>
						<view class="badge" v-if="item.readStatus == 1 && !item.total"></view>
						<view class="badge active" v-if="item.total*1 > 0">{{ item.total }}</view>
					</view>
					<view class="item-content">
						<view class="item-type">
							<view class="name">{{ item.type }}</view>
							<view class="date">{{ item.date }}</view>
						</view>
						<view class="item-desc" :class="item.list ? 'one-line' : ''">{{ item.content }}</view>
						<!-- <view class="item-desc ellipsis">{{ item.content }}</view> -->
					</view>
				</view>
				</block>
			</view>
		</block>
		<block v-else><dataNull :tips="tips"></dataNull></block>
	</view>
</template>

<script>
import tuiBadge from '@/components/badge/badge';
import tuiIcon from '@/components/icon/icon';
import { accountSet } from '@/api/index.js';
export default {
	components: {
		tuiIcon,
		tuiBadge
	},
	props: {
		list: {
			type: Array,
			default: function() {
				return [];
			}
		}
	},
	data() {
		return {};
	},
	methods: {
		handleTap(e, index) {
			console.log(e)
			if (e.url) {
				uni.navigateTo({
					url: `${e.url}?index=${index}`
				});
			}
			if(e.id){
				this.$http.post(accountSet.updateMember_status, { ids: e.id }).then(res => {
					console.log(res)
					if(res.code == 200) {
						e.readStatus = 0
						console.log(e.readStatus)
						this.$emit('changeReadStatus', index)
					} else {
						uni.showToast({
							title: res.message
						})
					}
				})
			}
		}
	}
};
</script>

<style lang="scss">
.mine-item {
	width: 100%;
	min-height: 140rpx;
	display: flex;
	align-items: center;
	background: #fff;
	padding: 0 !important;
	overflow: initial;
	.one-line{
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	&.hot {
		.item-content {
			&:after {
				display: block;
			}
		}
	}
	.item-img {
		width: 84rpx;
		height: 84rpx;
		margin: 0 26rpx 0 32rpx;
		position: relative;
		image {
			width: 100%;
			height: 100%;
		}
		.badge {
			display: inline-block;
			position: absolute;
			top: -12rpx;
			right: -12rpx;
			font-size: 22rpx;
			line-height: 1;
			color: #fff;
			padding: 8rpx;
			border-radius: 50rpx;
			font-weight: bold;
			background: #f54743;
			border: 2rpx solid rgba(255, 255, 255, 1);
			&.active{
				padding: 8rpx 12rpx;
				border-radius: 50%;
			}
		}
	}
	.item-content {
		flex: 1;
		box-sizing: border-box;
		border-bottom: 1rpx solid #d7d8d9;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: left;
		overflow: hidden;
		padding: 34rpx 0;
		.item-type {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-right: 32rpx;
			// padding-top: 34rpx;
			box-sizing: border-box;
			margin-bottom: 15rpx;
			lign-height: 32rpx;
			.name {
				font-size: 32rpx;
				font-weight: bold;
				color: rgba(37, 37, 37, 1);
			}
			.date {
				font-size: 24rpx;
				font-weight: 500;
				color: #b8b8b8;
			}
		}
		.item-desc {
			width: 100%;
			padding-right: 72rpx;
			box-sizing: border-box;
			text-align: left;
			font-size: 26rpx;
			font-weight: 500;
			color: #878787;
			line-height: 46rpx;
		}
	}
	&:nth-last-child(1) .item-content {
		border-bottom: none;
	}
}
</style>
