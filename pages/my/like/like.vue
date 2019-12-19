<template>
	<view class="my-like-wrap" :style="{ paddingBottom: isEdit ? '50px' : '' }">
		<!-- 顶部 -->
		<view class="shop-top">
			<view class="num">
				您关注了<text>{{ productList.length }}</text>件商品
			</view>
			<view class="edit-product" @tap="onEdit()">{{isEdit ? '完成' : '编辑商品'}}</view>
		</view>
		<!-- 关注商品列表 -->
		<!-- <view class="tui-product-list" :style="{marginTop:px(dropScreenH)}" v-if="productList.length > 0"> -->
		<view class="tui-product-list" v-if="productList.length > 0">
			<view class="tui-product-item" v-for="(item,index) in productList" :key="index">
				<label class="checkbox" @tap.stop="changeSelect(item, 'allEditSelect')" :class="item.allEditSelect? 'isChecked' : ''"  v-if="isEdit">
					<checkbox :checked='item.allEditSelect' />
				</label>
				<product-item :item='item'></product-item>
			</view>
		</view>
		<view class="tui-product-footer" v-if="isEdit">
			<view class="product-footer">
				<label class="checkbox" :class="allallEditSelect?'isChecked':''" @tap="allSelect()">
					<checkbox :checked="allallEditSelect" />
				</label>
				<text class="all-select-text">全选</text>
				<view class="num">
					已选择<text>{{ allSelectNum.length }}</text>件商品
				</view>
			</view>
			<view class="edit-product" @tap="onDelete()">删除</view>
		</view>
		<tui-divider v-if="productList.length > 2" color="#878787" :size="28" bgcolor="#F0F2F5" dividerColor="#CCCCCC">没有更多了</tui-divider>
		<!--关注商品列表-->
	</view>
</template>

<script>
	import tuiIcon from "@/components/icon/icon"
	import productItem from "@/components/product-item/pruduct-item.vue"
	import tuiDivider from "@/components/divider/divider"
	export default {
		components: {
			tuiIcon,
			tuiDivider,
			productItem
		},
		data() {
			return {
				isEdit: false,
				allallEditSelect: false,
				allSelectNum: [],
				productList: [{
						comDefaultSkuImg: 'http://www.dggcn.com/uploadfile/2019/0424/20190424054120975.jpg',
						comName: '会计代理服务',
						comDefaultSkuPrice: 500,
						comPageViewSum: 10,
						comSalesVolumeSum: 66,
						allEditSelect: false
					},
					{
						comDefaultSkuImg: 'http://www.dggcn.com/uploadfile/2019/0424/20190424054120975.jpg',
						comName: '会计代理服务',
						comDefaultSkuPrice: 500,
						comPageViewSum: 10,
						comSalesVolumeSum: 66,
						allEditSelect: false
					},
					{
						comDefaultSkuImg: 'http://www.dggcn.com/uploadfile/2019/0424/20190424054120975.jpg',
						comName: '会计代理服务',
						comDefaultSkuPrice: 500,
						comPageViewSum: 10,
						comSalesVolumeSum: 66,
						allEditSelect: false
					}
				],
			};
		},
		methods: {
			changeSelect(product, key) {
				product[key] = !product[key]
			},
			onEdit () {
				this.isEdit = !this.isEdit;
			},
			allSelect() {
				this.allallEditSelect = !this.allallEditSelect
				this.productList.map(item => {
					item.allEditSelect = this.allallEditSelect
				})
			},
			onDelete () {
				
			}
		},
		watch: {
			// 监听所有选中状态
			productList: {
				handler(newVal) {
					console.log(newVal, '监听')
					this.allallEditSelect = newVal.every(item => {
						return item.allEditSelect == true
					})
				this.allSelectNum = newVal.filter(item => item.allEditSelect)
				},
				deep: true
			}
		}
	}
</script>

<style lang="scss">
	@import './like.scss';
</style>
