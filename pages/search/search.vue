<template>
	<view class="container">
		<view class="tui-searchbox">
			<view class="tui-search-input">
				<!-- #ifdef APP-PLUS || MP -->
				<icon type="search" :size='13' color='#333'></icon>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<view><tui-icon name="search" :size='16' color='#333'></tui-icon></view>
				<!-- #endif -->
				<input confirm-type="search" placeholder="搜索顶呱呱产品" @confirm='handleConfirm' :focus="true" auto-focus placeholder-class="tui-input-plholder"
				 class="tui-input" v-model.trim="key" /> 
				<!-- #ifdef APP-PLUS || MP -->
				<icon type="clear" :size='13' color='#bcbcbc' @tap="cleanKey" v-show="key"></icon>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<view @tap="cleanKey" v-show="key"><tui-icon name="close-fill" :size='16' color='#bcbcbc'></tui-icon></view>
				<!-- #endif -->
			</view>
			<view class="tui-cancle" @tap="back">取消</view>
		</view>

		<view class="tui-search-history" v-if="history.length>0">
			<view class="tui-history-header">
				<view class="tui-search-title">搜索历史</view>
				<tui-icon name="delete" :size='14' color='#333' @tap="openActionSheet" class="tui-icon-delete"></tui-icon>
			</view>
			<view class="tui-history-content">
				<block v-for="(item,index) in history" :key="index">
					<tui-tag type="gray" shape="circle" @tap='hadnleSearch(item)'>{{item}}</tui-tag>
				</block>
			</view>
		</view>
		<tui-actionsheet :show="showActionSheet" :tips="tips" @click="itemClick" @cancel="closeActionSheet"></tui-actionsheet>
	</view>

</template>

<script>
	import tuiIcon from "@/components/icon/icon"
	import tuiTag from "@/components/tag/tag"
	import tuiActionsheet from "@/components/actionsheet/actionsheet"
	export default {
		components: {
			tuiIcon,
			tuiTag,
			tuiActionsheet
		},
		data() {
            let history = uni.getStorageSync('history')
            let historyArr = history? history : []
			return {
                history: historyArr,
				key: "",
				showActionSheet: false,
				tips: "确认清空搜索历史吗？"
			}
		},
		methods: {
			back: function() {
				uni.navigateBack();
			},
			cleanKey: function() {
				this.key = ''
			},
			closeActionSheet: function() {
				this.showActionSheet = false
			},
			openActionSheet: function() {
				this.showActionSheet = true
			},
            // 清空历史记录
			itemClick: function(e) {
				let index = e.index;
				if (index == 0) {
					this.showActionSheet = false;
					this.history = []
                    uni.removeStorageSync('history')
				}
			},
            // 搜索
            handleConfirm(e){
                console.log(e.detail.value);
                let val = e.detail.value
                if (!val) {
                    return
                }
                this.key = ''
                if (this.history.length > 10) {
                    this.history.unshift(val)
                    this.history.pop()
                    uni.setStorageSync('history', this.history)
                } else{
                     this.history.unshift(val)
                     uni.setStorageSync('history', this.history)
                }
                uni.navigateTo({
                    url:'/pages/productList/productList?keywords=' + val
                })
            },
            // 点击历史记录
            hadnleSearch(e){
                uni.navigateTo({
                    url:'/pages/productList/productList?keywords=' + e
                })
            }
		}
	}
</script>

<style>
	page {
		color: #333;
		background: #fff;
	}

	.container {
		padding: 0 30upx 30upx 30upx;
		box-sizing: border-box;
	}

	.tui-searchbox {
		padding: 30upx 0;
		box-sizing: border-box;
		display: flex;
		align-items: center;
	}

	.tui-search-input {
		width: 100%;
		height: 66upx;
		border-radius: 35upx;
		padding: 0 30upx;
		box-sizing: border-box;
		background: #f2f2f2;
		display: flex;
		align-items: center;
		flex-wrap: nowrap;
	}

	.tui-input {
		flex: 1;
		color: #333;
		padding: 0 16upx;
		font-size: 28upx;
	}

	.tui-input-plholder {
		font-size: 28upx;
		color: #b2b2b2;
	}

	.tui-cancle {
		color: #888;
		font-size: 28upx;
		padding-left: 30upx;
		flex-shrink: 0;
	}

	.tui-history-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30upx 0;
	}

	.tui-icon-delete {
		padding: 10upx;
	}

	.tui-search-title {
		font-size: 28upx;
		font-weight: bold;
	}

	.tui-hot-header {
		padding: 30upx 0;
	}

	.tui-tag-class {
		display: inline-block;
		margin-bottom: 20upx;
		margin-right: 20upx;
		font-size: 26upx !important;
	}
</style>
