<template>
	<view class="tui-timeaxis-class tui-time-axis">
		<slot></slot>
	</view>
</template>

<script>
	export default {
		name:"tuiTimeAxis",
		data() {
			return {

			};
		}
	}
</script>

<style>
	.tui-time-axis {
		padding-left: 20px;
		box-sizing: border-box;
		position: relative;
	}

	.tui-time-axis::before {
		content: " ";
		position: absolute;
		left: 0;
		top: 0;
		width: 2px;
		bottom: 0;
		border-left: 2px solid #ddd;
		-webkit-transform-origin: 0 0;
		transform-origin: 0 0;
		-webkit-transform: scaleX(0.5);
		transform: scaleX(0.5);
	}
</style>
