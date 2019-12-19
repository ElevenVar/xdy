<template>
	<view class="tui-cell-class tui-list-cell" :class="{'tui-cell-arrow':arrow,'tui-cell-last':last}" :hover-class="hover?'tui-cell-hover':''"
	 :style="{background: bgcolor,fontSize: px(size),color:color}" :hover-stay-time="150" @tap="handleClick">
		<slot></slot>
	</view>
</template>

<script>
	export default {
		name: "tuiListCell",
		props: {
			arrow: {
				type: Boolean,
				default: false //是否有箭头
			},
			hover: {
				type: Boolean,
				default: true //是否有点击效果
			},
			last: {
				type: Boolean,
				default: false //最后一条数据隐藏线条
			},
			bgcolor: {
				type: String,
				default: "#fff" //背景颜色
			},
			size: {
				type: Number,
				default: 28 //字体大小
			},
			color: {
				type: String,
				default: "#252525" //字体颜色
			},
			index: {
				type: Number,
				default: 0
			},
			left:{
				type: Number,
				default: 32
			}
		},
		methods: {
			handleClick() {
				this.$emit('click', {
					index: this.index
				});
			},
			px: function(num) {
				return uni.upx2px(num) + 'px';
			}
		}
	}
</script>

<style>
	.tui-list-cell {
		position: relative;
		width: 100%;
        height: 100rpx;
		padding: 0 32upx;
		box-sizing: border-box;
		overflow: hidden;
		display: flex;
		align-items: center;
	}

	.tui-cell-hover {
		background: #f7f7f9 !important;
	}

	.tui-list-cell::after {
		content: '';
		position: absolute;
		border-bottom: 1upx solid #D7D8D9;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		bottom: 0;
		right: 0;
		left: 32upx;
	}

	.tui-cell-last::after {
		border-bottom: 0 !important;
	}

	.tui-list-cell.tui-cell-arrow:before {
		content: " ";
		height: 11px;
		width: 11px;
		border-width: 2px 2px 0 0;
		border-color: #878787;
		border-style: solid;
		-webkit-transform: matrix(0.5, 0.5, -0.5, 0.5, 0, 0);
		transform: matrix(0.5, 0.5, -0.5, 0.5, 0, 0);
		position: absolute;
		top: 50%;
		margin-top: -7px;
		right: 30upx;
	}
</style>
