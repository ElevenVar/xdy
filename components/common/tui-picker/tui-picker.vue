<template>
	<view class="conatiner">
		<!--picker-view start-->
		<view class="tui-mask-screen" :class="[showPickerStatu?'tui-mask-show':'']" @tap="hidePicker"></view>
		<view class="tui-picker-box" :class="[showPickerStatu?'tui-pickerbox-show':'']">
			<view class="picker-header list-item">
				<view class="btn-cancle" hover-class="opcity" :hover-stay-time="150" @tap.stop="hidePicker">取消</view>
				<view class="btn-sure" hover-class="opcity" :hover-stay-time="150" @tap.stop="picker">确定</view>
			</view>
			<picker-view indicator-style="height: 50px;" class="picker-view" :value="value" @change="columnPicker">
				<picker-view-column>
					<view v-for="(item,index) in list" :key="index" class="item">{{item.name}}</view>
				</picker-view-column>
			</picker-view>
		</view>
		<!--picker-view end-->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				proviceArr: [],
				values: [0],
				districtArr: [],
				iconHidden: true,
				searchKey: "",
				showPickerStatu: false
			}
		},
		watch: {
			showPickerStatus(n) {
				this.showPickerStatu = n
			}
		},
		props: ['list', 'value', 'showPickerStatus'],
		methods: {
			//picker change切换事件
			columnPicker: function(e) {
				this.values = e.detail.value
			},
			//确定按钮
			picker: function(e) {
				this.$emit('onPicker', this.values)
			},
			// 显示picker-view
			showPicker: function() {
				this.showPickerStatu = true
			},
			// 隐藏picker-view
			hidePicker: function() {
				this.$emit('hidePicker')
				this.showPickerStatu = false
			}
		}
	}
</script>

<style>
	/* picker start*/

	.tui-mask-screen {
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

	.tui-picker-box {
		width: 100%;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 99999;
		visibility: hidden;
		transform: translate3d(0, 100%, 0);
		transform-origin: center;
		transition: all 0.3s ease-in-out;
		min-height: 20rpx;
		background: #fff;
	}
	.phcolor{
		color: #999;
	}
	.tui-pickerbox-show {
		transform: translate3d(0, 0, 0);
		visibility: visible;
	}

	.picker-header {
		width: 100%;
		height: 90upx;
		padding: 0 46upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
		font-size: 32upx;
		background: #fff;
	}

	.list-item::after {
		left: 0;
	}
	/* #ifdef H5 */
	
	/* #endif */
	.btn-cancle {
		padding: 20upx;
		color: #888;
	}

	.btn-sure {
		padding: 20upx;
		color: #5677fc;
	}

	.picker-view {
		width: 100%;
		height: 260px;
	}

	.item {
		line-height: 50px;
		text-align: center;
	}

	/* picker end*/
</style>
