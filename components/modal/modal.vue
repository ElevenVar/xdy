<template>
	<view>
		<view class="tui-modal-class tui-modal-box" :class="[show?'tui-modal-show':'']">
			<view v-if="!custom">
				<view class="tui-modal-title" v-if="title">{{title}}</view>
				<view class="tui-modal-content" :class="[title?'':'tui-mtop']" :style="{color:color,fontSize:px(size)}">{{content}}</view>
				<view class="tui-modalBtn-box" :class="[button.length>2?'tui-flex-column':'']">
					<block v-for="(item,index) in button" :key="index">
						<button class="tui-modal-btn" :class="['tui-'+(item.type || 'primary')+(item.plain?'-outline':''),button.length!=2?'tui-btn-width':'',button.length>2?'tui-mbtm':'',shape=='circle'?'tui-circle-btn':'']"
						 :hover-class="'tui-'+(item.plain?'outline':(item.type || 'primary'))+'-hover'" :data-index="index" @tap="handleClick">{{item.text || "确定"}}</button>
					</block>
				</view>
			</view>
			<view v-else>
				<slot></slot>
			</view>
		</view>
		<view class="tui-modal-mask" :class="[show?'tui-mask-show':'']" @tap="handleClickCancel"></view>

	</view>
</template>

<script>
	export default {
		name: "tuiModal",
		props: {
			//是否显示
			show: {
				type: Boolean,
				default: false
			},
			//标题
			title: {
				type: String,
				default: ""
			},
			//内容
			content: {
				type: String,
				default: ""
			},
			//内容字体颜色
			color: {
				type: String,
				default: "#999"
			},
			//内容字体大小
			size: {
				type: Number,
				default: 28
			},
			//形状 circle, square
			shape: {
				type: String,
				default: 'square'
			},
			button: {
				type: Array,
				default: function() {
					return [{
						text: "取消",
						type: "red",
						plain: true //是否空心
					}, {
						text: "确定",
						type: "red",
						plain: false
					}]
				}
			},
			//点击遮罩 是否可关闭
			maskClosable: {
				type: Boolean,
				default: true
			},
			//自定义弹窗内容
			custom: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {

			};
		},
		methods: {
			handleClick(e) {
				if (!this.show) return;
				const dataset = e.currentTarget.dataset;
				this.$emit('click', {
					index: Number(dataset.index)
				});
			},
			handleClickCancel() {
				if (!this.maskClosable) return;
				this.$emit('cancel');
			},
			px(num) {
				return uni.upx2px(num) + 'px'
			}
		}
	}
</script>

<style>
	.tui-modal-box {
		position: fixed;
		width: 84%;
		left: 50%;
		top: 50%;
		margin: auto;
		background: #fff;
		z-index: 99998;
		transform: translate(-50%, -50%);
		border-radius: 10upx;
		box-sizing: border-box;
		padding: 40upx 60upx;
		display: none;
	}

	.tui-modal-show {
		transform: translate(-50%, -50%);
		display: block;
	}

	.tui-modal-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
		z-index: 99996;
		display: none;
	}

	.tui-mask-show {
		display: block;
	}

	.tui-modal-title {
		text-align: center;
		font-size: 34upx;
		color: #333;
		padding-top: 20upx;
		font-weight: bold;
	}

	.tui-modal-content {
		text-align: center;
		color: #999;
		font-size: 28upx;
		padding-top: 20upx;
		padding-bottom: 60upx;
	}

	.tui-mtop {
		margin-top: 30upx;
	}

	.tui-mbtm {
		margin-bottom: 30upx;
	}

	.tui-modalBtn-box {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tui-flex-column {
		flex-direction: column;
	}

	.tui-modal-btn {
		width: 44%;
		height: 68upx;
		line-height: 68upx;
		position: relative;
		border-radius: 10upx;
		font-size: 24upx;
		overflow: visible;
	}

	.tui-modal-btn::after {
		content: "";
		position: absolute;
		width: 200%;
		height: 200%;
		-webkit-transform-origin: 0 0;
		transform-origin: 0 0;
		-webkit-transform: scale(0.5, 0.5);
		transform: scale(0.5, 0.5);
		left: 0;
		top: 0;
		border-radius: 20upx;
	}

	.tui-btn-width {
		width: 80% !important;
	}

	.tui-primary {
		background: #5677fc;
		color: #fff;
	}

	.tui-primary-hover {
		background: #4a67d6;
		color: #e5e5e5;
	}

	.tui-primary-outline {
		color: #5677fc;
		background: none;
	}

	.tui-primary-outline::after {
		border: 1px solid #5677fc;
	}

	.tui-danger {
		background: #ed3f14;
		color: #fff;
	}

	.tui-danger-hover {
		background: #d53912;
		color: #e5e5e5;
	}

	.tui-danger-outline {
		color: #ed3f14;
		background: none;
	}

	.tui-danger-outline::after {
		border: 1px solid #ed3f14;
	}

	.tui-red {
		background: #e41f19;
		color: #fff;
	}

	.tui-red-hover {
		background: #c51a15;
		color: #e5e5e5;
	}

	.tui-red-outline {
		color: #e41f19;
		background: none;
	}

	.tui-red-outline::after {
		border: 1px solid #e41f19;
	}

	.tui-warning {
		background: #ff7900;
		color: #fff;
	}

	.tui-warning-hover {
		background: #e56d00;
		color: #e5e5e5;
	}

	.tui-warning-outline {
		color: #ff7900;
		background: none;
	}

	.tui-warning-outline::after {
		border: 1px solid #ff7900;
	}

	.tui-green {
		background: #19be6b;
		color: #fff;
	}

	.tui-green-hover {
		background: #16ab60;
		color: #e5e5e5;
	}

	.tui-green-outline {
		color: #19be6b;
		background: none;
	}

	.tui-green-outline::after {
		border: 1px solid #19be6b;
	}

	.tui-white {
		background: #fff;
		color: #333;
	}

	.tui-white-hover {
		background: #f7f7f9;
		color: #666;
	}

	.tui-white-outline {
		color: #333;
		background: none;
	}

	.tui-white-outline::after {
		border: 1px solid #333;
	}

	.tui-gray {
		background: #ededed;
		color: #999;
	}

	.tui-gray-hover {
		background: #d5d5d5;
		color: #898989;
	}

	.tui-gray-outline {
		color: #999;
		background: none;
	}

	.tui-gray-outline::after {
		border: 1px solid #999;
	}

	.tui-outline-hover {
		opacity: 0.6;
	}

	.tui-circle-btn {
		border-radius: 40upx !important;
	}

	.tui-circle-btn::after {
		border-radius: 80upx !important;
	}
</style>
