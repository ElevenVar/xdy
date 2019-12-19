<template>
    <view class="container">
        <scroll-view scroll-y scroll-with-animation class="tab-view" :scroll-top="scrollTop" :style="{ height: height + 'px' }">
            <view v-for="(item, index) in tabbar" :key="index" class="tab-bar-item" :class="[currentTab == index ? 'active' : '']"
                @tap.stop="swichNav(index, item.cateId)">
                <text class="ellipsis">{{ item.cateName }}</text>
            </view>
        </scroll-view>
        <scroll-view scroll-y class="right-box" :style="{ height: height + 'px' }" :scroll-top="scrollTopTwo">
            <!--内容部分 start 自定义可删除-->
            <view class="page-view" v-if="secondLevel">
                <view class="class-box">
                    <view class="class-item">
                        <view class="g-container">
                            <view class="g-box" @tap.stop="productList(items.cateId, items.cateName, items.cateLink)" v-for="(items, ind) in secondLevel"
                                :key="ind">
                                <image :src="items.catePhoneImg ? items.catePhoneImg : altImg" class="g-image" />
                                <view class="g-title">{{ items.cateName }}</view>
                            </view>
                            
                        </view>
                    </view>
                    <dataNull :tips='tips' v-if="!secondLevel || secondLevel.length == 0"></dataNull>
                </view>
            </view>
            <!--内容部分 end 自定义可删除-->
        </scroll-view>
    </view>
</template>

<script>
    import {
        commodity
    } from '@/api/index.js';
    import dataNull from '@/components/null-data/null-data.vue'
    export default {
        components: {
            dataNull
        },
        data() {
            const imgUrl = this.$config.imgUrl
            return {
                imgUrl: imgUrl,
                tips: {
                    image: imgUrl + 'nullData/null-product.png',
                    text: '抱歉，没有找到相关分类!',
                    top: 400 // 距离顶部的距离
                },
                list: [],
                tabbar: [],
                secondLevel: null, // 二级分类数据
                height: 0, //scroll-view高度
                currentTab: 0, //预设当前项的值
                scrollTop: 0, //tab标题的滚动条位置
                scrollTopTwo: 0, // 右边的滚动条位置
                firstId: null,
            };
        },
        computed: {
            altImg() {
                return this.$store.state.altImg
            }
        },
        onLoad: function(options) {
            uni.getSystemInfo({
                success: res => {
                    let header = 0;
                    this.height = res.windowHeight - uni.upx2px(header);
                }
            });
            this.getData()
        },
        methods: {
            // 点击标题切换当前页时改变样式
            swichNav: function(cur, id) {
                if (this.currentTab == cur) {
                    return false;
                } else {
                    this.currentTab = cur;
                    this.checkCor();
                    this.getDataEr(id);
                }
            },
            //判断当前滚动超过一屏时，设置tab标题滚动条。
            checkCor: function() {
                let that = this;
                //这里计算按照实际情况进行修改，动态数据要进行动态分析
                //思路：窗体高度/单个分类高度 200rpx 转px计算 =>得到一屏幕所显示的个数，结合后台传回分类总数进行计算
                //数据很多可以多次if判断然后进行滚动距离计算即可
                if (that.currentTab > 7) {
                    that.scrollTop = 500;
                } else {
                    that.scrollTop = 0;
                }
            },
            // 获取一级分类数据
            getData() {
                // 获取数据
                // this.tabbar = [];
                uni.showLoading({
                    title: '加载中...',
                    mask: true
                })
                this.$http.get(commodity.classfiyList).then(res => {
                    uni.hideLoading()
                    if (res.code == 200) {
                        this.tabbar = res.data;
                        this.firstId = this.tabbar[this.currentTab].cateId
                        this.getDataEr(this.firstId);
                    } else {
                        uni.showToast({
                            icon: 'none',
                            title: res.message || '请求异常'
                        });
                    }
                });
            },
            // 获取er级分类数据
            getDataEr(id) {
                uni.showLoading({
                    title: '加载中...',
                    mask: true
                })
                // 获取数据
                this.$http.get(commodity.classfiyList, {
                    pId: id
                }).then(res => {
                    uni.hideLoading()
                    if (res.code == 200) {
                        this.secondLevel = res.data;
                        this.scrollTopTwo = 0;
                    } else {
                        uni.showToast({
                            icon: 'none',
                            title: res.msgmessage
                        });
                    }
                });
            },
            productList(id, name, cateLink) {
				console.log(id, name, cateLink)
				if(cateLink) {
					this.$store.commit('SET_WEB_VIEW_URL', cateLink)
					uni.navigateTo({
						url: '/pages/webView/webView'
					})
				} else {
					uni.navigateTo({
					    url: `/pages/productList/productList?cateId=${id}&name=${name}`
					});
				}
            }
        }
    };
</script>

<style>
    page {
        background: #fcfcfc;
    }

    /* 左侧导航布局 start*/

    /* 隐藏scroll-view滚动条*/

    ::-webkit-scrollbar {
        width: 0;
        height: 0;
        color: transparent;
    }

    .tui-searchbox {
        width: 100%;
        height: 92upx;
        padding: 0 30upx;
        box-sizing: border-box;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 100;
    }

    .tui-searchbox::after {
        content: '';
        position: absolute;
        border-bottom: 1upx solid #d2d2d2;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
        bottom: 0;
        right: 0;
        left: 0;
    }

    .tui-search-input {
        width: 100%;
        height: 60upx;
        background: #f1f1f1;
        border-radius: 30upx;
        font-size: 26upx;
        color: #999;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .tui-search-text {
        padding-left: 16upx;
    }

    .tab-view {
        /* height: 100%; */
        width: 220upx;
        position: fixed;
        left: 0;
        top: 0upx;
        z-index: 10;
        background-color: #f6f6f6;
    }

    .tab-bar-item {
        width: 100%;
        height: 110upx;
        background: #f6f6f6;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 26upx;
        color: #444;
        font-weight: 400;
        overflow: hidden;
        padding: 0 10rpx;
        box-sizing: border-box;
    }

    .active {
        position: relative;
        color: #000;
        font-size: 30upx;
        font-weight: 600;
        background: #fcfcfc;
    }

    .active::before {
        content: '';
        position: absolute;
        border-left: 8upx solid #10bbb8;
        height: 30upx;
        left: 0;
    }

    /* 左侧导航布局 end*/

    .right-box {
        width: 100%;
        position: fixed;
        padding-left: 254upx;
        box-sizing: border-box;
        left: 0;
        top: 0;
		background: #FFFFFF;
    }

    .page-view {
        width: 100%;
        overflow: hidden;
        padding-right: 32upx;
        box-sizing: border-box;
        padding-bottom: env(safe-area-inset-bottom);
    }

    .swiper {
        width: 100%;
        height: 220upx;
        border-radius: 12upx;
        overflow: hidden;
        transform: translateZ(0);
    }

    /* #ifdef APP-PLUS || MP */
    .swiper .wx-swiper-dot {
        width: 8upx;
        height: 8upx;
        display: inline-flex;
        background: none;
        justify-content: space-between;
    }

    .swiper .wx-swiper-dot::before {
        content: '';
        flex-grow: 1;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 16upx;
        overflow: hidden;
    }

    .swiper .wx-swiper-dot-active::before {
        background: #fff;
    }

    .swiper .wx-swiper-dot.wx-swiper-dot-active {
        width: 16upx;
    }

    /* #endif */

    /* #ifdef H5 */
    >>>.swiper .uni-swiper-dot {
        width: 8rpx;
        height: 8rpx;
        display: inline-flex;
        background: none;
        justify-content: space-between;
    }

    >>>.swiper .uni-swiper-dot::before {
        content: '';
        flex-grow: 1;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 16rpx;
        overflow: hidden;
    }

    >>>.swiper .uni-swiper-dot-active::before {
        background: #fff;
    }

    >>>.swiper .uni-swiper-dot.uni-swiper-dot-active {
        width: 16rpx;
    }

    /* #endif */

    .slide-image {
        width: 100%;
        height: 220upx;
    }

    .class-box {
        padding-top: 0upx;
        padding-bottom: 32rpx;
    }

    .class-item {
        background: #fff;
        width: 100%;
        box-sizing: border-box;
        /* 	padding: 20upx;
		margin-bottom: 20upx;
		border-radius: 12upx; */
    }

    .class-name {
        font-size: 22upx;
    }

    .g-container {
        /* padding-top: 20upx; */
        display: flex;
        display: -webkit-flex;
        justify-content: space-between;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .g-box {
        width: 227upx;
        text-align: center;
    }

    .g-image {
        width: 224upx;
        height: 224upx;
        margin: 32upx 0 16upx;
    }

    .g-title {
        font-size: 26upx;
        color: #252525;
        line-height: 26upx;
        font-weight: bold;
    }
</style>
