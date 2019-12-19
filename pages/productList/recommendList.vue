<template>
    <view class="container page">
        <!--header-->
        <view class="tui-header-box">
            <view class="tui-header" :style="{ width: width + 'px', height: height + 'px' }">
                <view class="tui-back" :style="{ marginTop: arrowTop + 'px' }" @tap="back">
                    <tui-icon name="arrowleft" color="#000"></tui-icon>
                </view>
                <view class="tui-searchbox tui-search-mr" :style="{ marginTop: inputTop + 'px' }" @tap="search">
                    <!-- #ifdef APP-PLUS || MP -->
                    <icon type="search" :size="13" color="#999"></icon>
                    <!-- #endif -->
                    <text class="tui-search-text" v-if="!searchKey">搜索商品</text>
                    <view class="tui-search-key" v-if="searchKey">
                        <view class="tui-key-text">{{ searchKey }}</view>
                        <tui-icon name="shut" :size="12" color="#fff"></tui-icon>
                    </view>
                </view>
            </view>
            <!--header-->
           
                <scroll-view scroll-x scroll-with-animation class="tab-view" v-if="tabbar.length > 0" :scroll-left="scrollLeft">
                    <view v-for="(item, index) in tabbar" :key="index" class="tab-bar-item" :class="[currentTab == index ? 'active' : '']"
                        :data-current="index" @tap.stop="swichNav(index, item.cateId)">
                        <text class="tab-bar-title">{{ item.cateName }}</text>
                    </view>
                </scroll-view>
        </view>
         <block v-if="showList">
        <!--list-->
        <view class="tui-product-list" :style="{ marginTop:tabbar.length > 0 ?  px(dropScreenH) : '32rpx' }">
            <block v-for="(item, index) in productList" :key="index">
                <!-- <template is="productItem" data="{{item,index:index,isList:isList}}" /> -->
                <!--商品列表-->
                <product-item :item="item"></product-item>
                <!--商品列表-->
            </block>
        </view>
        <dataNull v-if="!productList || productList.length == 0" :tips='tips'></dataNull>
        </block>
        <!--list-->
        <nomore :visible='nomore'></nomore>
    </view>
</template>

<script>
    import tuiIcon from '@/components/icon/icon';
    import productItem from '@/components/product-item/pruduct-item.vue';
    import {
        commodity
    } from '@/api/index.js';
    import nomore from '@/components/nomore/nomore.vue'
    import dataNull from '@/components/null-data/null-data.vue'
    export default {
        components: {
            tuiIcon,
            productItem,
            nomore,
            dataNull
        },
        data() {
            const imgUrl = this.$config.imgUrl
            return {
                imgUrl: imgUrl,
                tips: {
                    image: imgUrl + 'nullData/null-product.png',
                    text: '抱歉，没有找到相关商品!',
                    top: 250 // 距离顶部的距离
                },
                searchKey: '', //搜索关键词
                width: 200, //header宽度
                height: 64, //header高度
                inputTop: 0, //搜索框距离顶部距离
                arrowTop: 0, //箭头距离顶部距离
                dropScreenH: 0,
                tabbar: null,
                scrollTop: 0,
                winHeight: '', //窗口高度
                currentTab: 0, //预设当前项的值
                scrollLeft: 0, //tab标题的滚动条位置
                productList: [],
                page: 1, // 当前页
                limit: 10, // 每页显示的条数
                totalPage: '', // 总页数
                nomore: false, // 底部是否显示更多了
                showList: false,
            };
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
                success: res => {
                    this.width = obj.left || res.windowWidth;
                    this.height = obj.top ? obj.top + obj.height + 8 : res.statusBarHeight + 44;
                    this.inputTop = obj.top ? obj.top + (obj.height - 30) / 2 : res.statusBarHeight + 7;
                    this.arrowTop = obj.top ? obj.top + (obj.height - 32) / 2 : res.statusBarHeight + 6;
                    this.searchKey = options.searchKey;
                    //略小，避免误差带来的影响
                    this.dropScreenH = (this.height * 750) / res.windowWidth;
                }
            });

            // 初始数据
            this.initData();
        },
        onShow() {
            // this.initData()
        },
        methods: {
            // 获取数据 初始化数据
            async initData() {
                // 获取分类
                this.getTreeBookList()
            },
            // 获取全部分类
            getTreeBookList() {
                this.$http.get(commodity.getCommodityClassfiy).then(res => {
                    if (res.code == 200) {
                        this.tabbar = res.data
                        this.firstId = this.tabbar[0].cateId
						this.getProduct(1)
                    } else {
                        uni.showToast({
                            icon: 'none',
                            title: res.message
                        })
                    }
                })
            },
			price (str) {
				if(str % 100 == 0) {
					return String(str/100)+'.00'
				} else if(str % 10 == 0) {
					return String(str/100)+'0'
				} else {
					return str/100
				}
			},
            // 获取推荐获取分类下的商品商品
            getProduct(page) {
                let requestParams = {
                    page: page,
                    limit: this.limit,
                    cateId: this.firstId,
					comShowClient: 'COUPON_PLAT_1'
                }
                if (page == 1) {
                    uni.showLoading({
                        title: '加载中...',
                        mask: true
                    })
                }
                this.$http.post(commodity.getCommodityList, requestParams).then(res => {
                    uni.hideLoading()
                    this.showList = true
                    if (res.code == 200) {
                        if (page == 1) {
                            res.data.data.forEach(val => {
                                val.comDefaultSkuPrice = this.price(val.comDefaultSkuPrice)
                            })
                            this.productList = res.data.data
                            this.totalPage = res.data.draw
                            this.page = res.data.recordsFiltered
                        } else {
                            res.data.data.forEach(val => {
                                val.comDefaultSkuPrice = val.comDefaultSkuPrice / 100
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
            // 点击标题切换当前页时改变样式
            swichNav(index, code) {
                let cur = index;
                if (this.currentTab == cur) {
                    return false;
                } else {
                    if (cur > 2) {
                        console.log(cur,this.scrollLeft);
                        this.scrollLeft = cur * 100;
                    } else {
                        this.scrollLeft = 0;
                    }
                    this.currentTab = cur;
                    this.firstId = code
                    this.getProduct(1)

                }
            },
            px(num) {
                return uni.upx2px(num) + 'px';
            },
            back: function() {
                uni.navigateBack();
            },
            search: function() {
                uni.navigateTo({
                    url: '/pages/search/search'
                });
            },
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
    };
</script>

<style lang="scss">
    .container {
        padding-bottom: env(safe-area-inset-bottom);
        overflow: hidden;
        /* #ifdef H5 */
        height: 100%;
        /* #endif */
        /* #ifndef H5 */
        height: 100vh;
        /* #endif */
    }

    /* 隐藏scroll-view滚动条*/

::-webkit-scrollbar {
        width: 0;
        height: 0;
        color: transparent;
    }
    .tab-view::before {
        content: '';
        position: absolute;
        border-bottom: 1upx solid #eaeef1;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
        bottom: 0;
        right: 0;
        left: 0;
    }

    .tab-view {
        width: 100%;
        height: 100upx;
        overflow: hidden;
        box-sizing: border-box;
        position: relative;
        /* 
		top: 100rpx;;
		z-index: 99; */
        background: #fff;
        white-space: nowrap;
    }

    .tab-view::-webkit-scrollbar {
        width: 0;
        height: 0;
        color: transparent;
    }

    .tab-bar-item {
        padding: 0;
        height: 96rpx;
        min-width: 80upx;
        line-height: 96rpx;
        margin: 0 28upx;
        display: inline-block;
        text-align: center;
        box-sizing: border-box;
    }

    .tab-bar-title {
        height: 96rpx;
        line-height: 96rpx;
        font-size: 28rpx;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
    }

    .active {
        font-weight: bold;
        position: relative;

        .tab-bar-title {
            font-weight: bold;
        }
    }

    .active::after {
        display: block;
        position: absolute;
        content: '';
        width: 100%;
        height: 6rpx;
        background: rgba(16, 187, 184, 1);
        border-radius: 3px;
        bottom: 0;
        // left: 50%;
        // margin-left: -;
    }

    /*tabbar end*/
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
        background: #f0f2f5;
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
        background: #f0f2f5;
        display: flex;
        box-sizing: border-box;
        height: calc(100vh-324rpx);
        justify-content: space-between;
        flex-wrap: wrap;
        box-sizing: border-box;
        padding-top: 130rpx;
        overflow: auto;
    }

    /* 商品列表*/
</style>
