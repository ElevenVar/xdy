<template>
	<view>
		<view class="tui-popup-class tui-bottom-popup" :class="{'tui-popup-show':show}" :style="{background:bgcolor,height:height?px(height):'auto'}">
			<slot></slot>
		</view>
		<view class="tui-popup-mask" :class="[show?'tui-mask-show':'']" v-if="mask" @tap="handleClose"></view>
	</view>
</template>

<script>
	export default {
		name:"tuiBottomPopup",
		props: {
			//是否需要mask
			mask: {
				type: Boolean,
				default: true
			},
			//控制显示
			show: {
				type: Boolean,
				default: false
			},
			//背景颜色
			bgcolor: {
				type: String,
				default: "#fff"
			},
			//高度 upx
			height: {
				type: Number,
				default: 0
			}
		},
		methods: {
			handleClose() {
				if (!this.show) {
					return;
				}
				this.$emit('close', {});
			},
			px(num){
				return uni.upx2px(num) + 'px'
			}
		}
	}
</script>

<style>
	.tui-bottom-popup {
		width: 100%;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 99999;
		visibility: hidden;
		transform: translateY(100%);
		transform-origin: center;
		transition: all 0.3s ease-in-out;
		min-height: 20upx;
	}

	.tui-popup-show {
		transform: translateY(0);
		visibility: visible;
	}

	.tui-popup-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
		z-index: 99996;
		transition: all 0.3s ease-in-out;
		opacity: 0;
		visibility: hidden;
	}

	.tui-mask-show {
		opacity: 1;
		visibility: visible;
	}
</style>
