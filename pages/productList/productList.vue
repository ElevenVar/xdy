<template>
    <view class="container page">
        <!--header-->
        <view class="tui-header-box">
            <view class="tui-header" :style="{width:width+'px',height:height+'px'}">
                <view class="tui-back" :style="{marginTop:arrowTop+'px'}" @tap="back">
                    <tui-icon name="arrowleft" color="#000"></tui-icon>
                </view>
                <view class="tui-searchbox tui-search-mr" :style="{marginTop:inputTop+'px'}" @tap="search">
                    <!-- #ifdef APP-PLUS || MP -->
                    <icon type="search" :size='13' color='#999'></icon>
                    <!-- #endif -->
                    <text class="tui-search-text" v-if="!searchKey">搜索商品</text>
                    <view class="tui-search-key" v-if="searchKey">
                        <view class="tui-key-text">{{searchKey}}</view>
                        <tui-icon name="shut" :size='12' color='#fff'></tui-icon>
                    </view>
                </view>
            </view>
        </view>
        <!--header-->
        <block >
            <!--list-->
            <view class="tui-product-list" :style="{marginTop:px(dropScreenH)}" v-if="productList.length> 0">
                <block v-if="productList && productList.length> 0">
                    <!--商品列表-->
                    <product-item :item='item' v-for="(item,index) in productList" :key="index"></product-item>
                    <!--商品列表-->
                </block>
            </view>
            <!--list-->
            <nomore :visible='nomore'></nomore>
            <view v-if="productList.length == 0">
                <dataNull :tips='tips'></dataNull>
            </view>
        </block>
        
    </view>
</template>

<script>
    import tuiIcon from "@/components/icon/icon"
    import productItem from "@/components/product-item/pruduct-item.vue"
    import {
        commodity
    } from "@/api/index.js"
    import {
        regFenToYuan
    } from "@/utils/util.js"
    import dataNull from '@/components/null-data/null-data.vue'
    import nomore from '@/components/nomore/nomore.vue'
    export default {
        components: {
            tuiIcon,
            productItem,
            dataNull,
            nomore
        },
        data() {
            const imgUrl = this.$config.imgUrl
            return {
                imgUrl: imgUrl,
                tips: {
                    image: imgUrl + 'nullData/null-product.png',
                    text: '抱歉，没有找到相关商品!',
                    top: 400 // 距离顶部的距离
                },
                searchKey: "", //搜索关键词
                width: 200, //header宽度
                height: 64, //header高度
                inputTop: 0, //搜索框距离顶部距离
                arrowTop: 0, //箭头距离顶部距离
                dropScreenH: 0,
                attrData: [],
                scrollTop: 0,
                productList: null,
                pageIndex: 1,
                cateId: '', // 商品分类Id
                page: '', // 当前页
                totalPage: '', // 总页数
                nomore: false, // 底部是否显示更多了
            }
        },
        onLoad: function(options) {
            let obj = {};
            // #ifdef MP-WEIXIN
            obj = wx.getMenuButtonBoundingClientRect();
            // #endif
            // #ifdef MP-BAIDU
            obj = swan.getMenuButtonBoundingClientRect();
            // #endif
            // #ifdef MP-ALIPAY
            my.hideAddToDesktopMenu();
            // #endif
            uni.getSystemInfo({
                success: (res) => {
                    this.width = obj.left || res.windowWidth;
                    this.height = obj.top ? (obj.top + obj.height + 8) : (res.statusBarHeight + 44);
                    this.inputTop = obj.top ? (obj.top + (obj.height - 30) / 2) : (res.statusBarHeight +
                        7);
                    this.arrowTop = obj.top ? (obj.top + (obj.height - 32) / 2) : (res.statusBarHeight +
                        6);
                    this.searchKey = options.searchKey;
                    //略小，避免误差带来的影响
                    this.dropScreenH = this.height * 750 / res.windowWidth;
                }
            })
            this.cateId = options.cateId ? options.cateId : ''
            this.keywords = options.keywords ? options.keywords : ''
            if (options.keywords) {
                this.searchKey = options.keywords
            } else {
                this.searchKey = options.name
            }
            // 初始数据
            this.initData(1);
        },
        methods: {
            initData(page) {
                // 获取数据
                if (page == 1) {
                    uni.showLoading({
                        title: '加载中...',
                        mask: true
                    })
                }
                let data
                if (this.keywords) {
                    data = {
                        keywords: this.keywords,
                        page: page
                    }
                } else {
                    data = {
                        comCateIdFind: this.cateId,
                        page: page
                    }
                }

                this.$http.post(commodity.commodityList, data).then(res => {
                    uni.hideLoading()
                    if (res.code == 200) {
                        if (page == 1) {
                            res.data.data.forEach(val => {
                                val.comDefaultSkuPrice = regFenToYuan(val.comDefaultSkuPrice)
                            })
                            this.productList = res.data.data
                            this.totalPage = res.data.draw
                            this.page = res.data.recordsFiltered
                        } else {
                            res.data.data.forEach(val => {
                                val.comDefaultSkuPrice = regFenToYuan(val.comDefaultSkuPrice)
                            })
                            this.productList = this.productList.concat(res.data.data)
                            this.totalPage = res.data.draw
                            this.page = res.data.recordsFiltered
                        }

                    } else {
                        uni.showToast({
                            icon: 'none',
                            title: res.message
                        })
                    }
                })
            },
            px(num) {
                return uni.upx2px(num) + "px"
            },
            back: function() {
                uni.navigateBack()
            },
            search: function() {
                uni.navigateTo({
                    url: '/pages/search/search'
                })
            },
            onReachBottom() {
                if (this.page < this.totalPage) {
                    this.initData(this.page + 1)
                } else {
                    this.nomore = true
                    // uni.showToast({
                    //     icon:'none',
                    //     title:'没有更多数据了'
                    // })
                }
            },
        }
    }
</script>

<style>
    .container {
        padding-bottom: env(safe-area-inset-bottom);
    }

    /* 隐藏scroll-view滚动条*/

    ::-webkit-scrollbar {
        width: 0;
        height: 0;
        color: transparent;
    }

    .tui-header-box {
        width: 100%;
        background: #fff;
        position: fixed;
        z-index: 99998;
        left: 0;
        top: 0;
    }

    .tui-header {
        display: flex;
        align-items: flex-start;
    }

    .tui-back {
        margin-left: 8upx;
        height: 32px !important;
        width: 32px !important;
        line-height: 32px;

    }

    .tui-searchbox {
        width: 100%;
        height: 30px;
        margin-right: 30upx;
        border-radius: 15px;
        font-size: 12px;
        background: #F0F2F5;
        padding: 3px 10px;
        box-sizing: border-box;
        color: #999;
        display: flex;
        align-items: center;
        overflow: hidden;
    }

    /* #ifdef MP-WEIXIN */
    .tui-search-mr {
        margin-right: 20upx !important;
    }

    /* #endif */
    /* #ifdef MP-BAIDU */
    .tui-search-mr {
        margin-right: 20upx !important;
    }

    /* #endif */

    .tui-search-text {
        padding-left: 16upx;
    }

    .tui-search-key {
        max-width: 80%;
        height: 100%;
        padding: 0 16upx;
        margin-left: 12upx;
        display: flex;
        align-items: center;
        border-radius: 15px;
        background: rgba(0, 0, 0, 0.5);
        color: #fff;
    }

    .tui-key-text {
        box-sizing: border-box;
        padding-right: 12upx;
        font-size: 12px;
        line-height: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    /* 商品列表*/

    .tui-product-list {
        padding: 32rpx;
        background: #F0F2F5;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        box-sizing: border-box;
    }

    /* 商品列表*/
</style>
