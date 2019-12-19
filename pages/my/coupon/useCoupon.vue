<template>
    <view class="useCoupon page">
        <scroll-view class="body" :scroll-y='true' @scrolltolower='scrolltolower'>
            <view class="notice" >
                <text v-if="couponType == 'COUPON_TYPE_ZK'">满{{denomination}}打{{coupnprice}}折,以下商品均参加本次优惠</text>
                <text v-else> 满{{denomination}}-{{coupnprice}},以下商品均参加本次优惠</text>
            </view>
            <view v-if="productList">
                <view class="tui-product-list" >
                    <block v-for="(item, index) in productList" :key="index">
                        <!--商品列表-->
                        <product-item :item='item' :cartBtnShow='true' @handleSku='handleSku'></product-item>
                        <!--商品列表-->
                    </block>
                </view>
                <view v-if="!productList || productList.length == 0" style="width: 100%;">
                    <dataNull :tips='tips'></dataNull>
                </view>
                <nomore :visible='nomore'></nomore>
            </view>
            
            
        </scroll-view>
        <view class="footer">
            <view class="left-box">
                <view class="total-price ellipsis">已选<text>{{totalCount}}</text>件产品，小计: <text class="value ">￥ {{totalprice}}.00</text></view>
                <block v-if="couponType == 'COUPON_TYPE_ZK'">
                    <view class="youhui" v-if="denomination > totalprice">再买<text>¥{{computedPrice}}.00</text>可享受优惠</view>
                    <view class="youhui" v-else>已满足优惠条件，下单使用该劵可打{{coupnprice}}折</view>
                </block>
                <block v-else>
                    <view class="youhui" v-if="denomination > totalprice">再买<text>¥{{computedPrice}}.00</text>可享受优惠</view>
                    <view class="youhui" v-else>已满足优惠条件，下单使用该劵可立减¥{{computedPrice}}</view>
                </block>
                
            </view>
            <view class="right-box" @tap="handleGoCart">去购物车</view>
        </view>
       

        <!-- 商品详情sku等选择上弹框 -->
        <tui-bottom-popup :show="popupShow" @close="hidePopup">
            <view class="tui-popup-box">
                <view class="tui-product-box tui-padding">
                    <image :src="list.commoditySku.skuImgs" class="tui-popup-img"></image>
                    <view class="tui-popup-price">
                        <view class="tui-amount tui-bold">￥{{ list.commoditySku.skuSellingPrice }}.00</view>
                        <view class="tui-number">编号:{{ list.commodity.comCode }}</view>
                    </view>
                </view>
                <scroll-view scroll-y class="tui-popup-scroll">
                    <view class="tui-scrollview-box">
                        <block v-for="(items, index) in list.commodityPropertyBySkuList" :key="index">
                            <view class="tui-attr-title">{{ items.propName }}</view>
                            <view class="tui-attr-box">
                                <button class="tui-attr-item" v-for="tabItem in items.commodityPropertyValueList"
                                    :class="tabItem.isSelected == 1 ? 'tui-attr-active' : ''" :key="tabItem.valName"
                                    :disabled="tabItem.isShow == 0" @tap="handleCkeck(index, tabItem.valName)">
                                    {{ tabItem.valName }}
                                </button>
                            </view>
                        </block>
                        <view class="tui-number-box tui-bold tui-attr-title">
                            <view class="tui-attr-title">数量</view>
                            <tui-numberbox :max="99" :min="1" :value="value" @change="change"></tui-numberbox>
                        </view>
                    </view>
                </scroll-view>
                <view class="tui-operation tui-operation-right tui-right-flex tui-popup-btn">
                    <button type="red" class="tui-btn-class tui-flex-1" @click="handleSubmit(list.commoditySku.skuSellingPrice)">确定</button>
                </view>
                <view class="tui-icon tui-icon-close-fill tui-icon-close" style="color: #999;font-size:20px" @tap="hidePopup"></view>
            </view>
        </tui-bottom-popup>
    </view>
</template>

<script>
    import productItem from "@/components/product-item/pruduct-item.vue"
    import tuiNumberbox from '@/components/numberbox/numberbox';
    import tuiBottomPopup from '@/components/bottom-popup/bottom-popup';
    import tuiIcon from '@/components/icon/icon';
    import data from './commdity.js'
    import {
        commodity
    } from '@/api/index.js';
    import dataNull from '@/components/null-data/null-data.vue'
    import nomore from '@/components/nomore/nomore.vue'
    export default {
        components: {
            productItem,
            tuiBottomPopup,
            tuiNumberbox,
            tuiIcon,
            dataNull,
            nomore
        },
        computed:{
            computedPrice(){
                if(this.denomination > this.totalprice) {
                    return this.denomination - this.totalprice
                } else {
                    return this.coupnprice
                }
            }
        },
        data() {
            const imgUrl = this.$config.imgUrl
            return {
                imgUrl: imgUrl,
                tips: {
                    image: imgUrl + 'nullData/null-product.png',
                    text: '抱歉，没有找到相关商品!',
                    top: 200 // 距离顶部的距离
                },
                productList: null,
                list: {

                }, //sku数据
                // sku 属性选择模态框
                popupShow: false,
                value: 1, // 商品数量
                addCart: {
                    skuId: '',
                    skuNumber: 1,
                    sourceType: 0, // 0:正常加入购物车、 1:立即购买
                    serveIds: null
                }, // 加入购物车， 立即购买
                page: 1, // 当前页
                totalPage: '', // 总页数
                nomore: false, // 底部是否显示更多了
                totalCount: 0, // 总件数
                totalprice: 0, // 总价格
                coupnprice: 0, //优惠金额
                denomination: 0, // 满多少可用
                discount: 0, // 折扣
                couponType: '', // 优惠券类型 COUPON_TYPE_ZK 折扣券
            }
        },
        onLoad(e) {
            const coupon = uni.getStorageSync('useCoupon')
            this.couponType = coupon.type
            if(coupon.type === 'COUPON_TYPE_ZK') {
                this.discount = coupon.amount / 10
                this.denomination = coupon.denomination / 100
            } else {
                this.coupnprice = coupon.amount / 100
                this.denomination = coupon.denomination / 100
            }
            this.couponNo = e.couponNo
            this.initData(this.page)
        },
        methods: {
            // 获取数据 商品列表
            initData(page) {
                // 获取数据
                if (page == 1) {
                    uni.showLoading({
                        title: '加载中...',
                        mask: true
                    })
                }
                let data = {
                    couponNo: this.couponNo,
                    page: page
                }
                this.$http.post(commodity.getCouponCommidity, data).then(res => {
                    uni.hideLoading()
                    if (res.code == 200) {
                        if (page == 1) {
                            res.data.data.forEach(val => {
                                val.comDefaultSkuPrice = val.comDefaultSkuPrice / 100
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
                            title: res.message || res.msg
                        })
                    }
                })
            },
            // sku 模态框隐藏
            hidePopup: function() {
                this.popupShow = false;
            },
            // 商品数量点击
            change: function(e) {
                this.value = e.value;
                this.addCart.skuNumber = e.value;
            },
            // 获取商品详情
            getdetails(comCode) {
                uni.showLoading({
                    title: '加载中...',
                    mask: true
                })
                this.$http.get(commodity.commodityDetail, {
                    comCode: comCode
                }).then(res => {
                    uni.hideLoading();
                    if (res.code == 200) {
                        let comServeLabelsName = res.data.commodity.comServeLabelsName;
                        let compLabelName = res.data.commodity.compLabelName ? res.data.commodity.compLabelName :
                            '';
                        res.data.commodity.comServeLabelsName = comServeLabelsName.split(',');
                        res.data.commodity.compLabelName = compLabelName.split(',');
                        res.data.commoditySku.skuSellingPrice = res.data.commoditySku.skuSellingPrice / 100;
                        res.data.commoditySku.skuMarketPrice = res.data.commoditySku.skuMarketPrice / 100;
                        this.list = res.data;
                        this.addCart.skuId = res.data.commoditySku.skuId;
                    } else {
                        uni.showToast({
                            icon: 'none',
                            title: res.msg || res.message
                        });
                    }
                });
            },
            // 点击购物车icon
            handleSku(e) {
                console.log('hello ', e);
                this.popupShow = true; // sku 模态框显示
                this.getdetails(e.comCode)
            },
            // sku 属性选择
            handleCkeck(index, name) {
                this.list.commodityPropertyBySkuList[index].commodityPropertyValueList.forEach(el => {
                    if (el.valName == name) {
                        el.isSelected = 1;
                    } else {
                        el.isSelected = 0;
                    }
                });
                let num = this.getSkuIDs(this.list.commodityPropertyBySkuList);
                let data = {
                    values: num,
                    comId: this.list.commoditySku.skuComId
                };
                uni.showLoading({
                    title: '加载中...',
                    mask: true
                });
                this.$http.get(commodity.skuSearch, data).then(res => {
                    uni.hideLoading();
                    if (res.code == 200) {
                        res.data.commoditySku.skuSellingPrice = res.data.commoditySku.skuSellingPrice / 100;
                        res.data.commoditySku.skuMarketPrice = res.data.commoditySku.skuMarketPrice / 100;
                        this.list.commodityPropertyBySkuList = res.data.commodityPropertyBySkuList;
                        this.list.commoditySku = res.data.commoditySku;
                    } else {
                        uni.showToast({
                            icon: 'none',
                            title: res.msg || res.message
                        });
                    }
                });
            },
            // 遍历sku已选属性
            getSkuIDs(data) {
                let arr = [];
                data.forEach(el => {
                    el.commodityPropertyValueList.forEach(val => {
                        if (val.isSelected == 1) {
                            arr.push(val.valId);
                        }
                    });
                });
                return arr.join(',');
            },
            // 点击弹框内的确定
            handleSubmit(price) {
                this.popupShow = false;
                uni.showLoading()
                this.$http.post(commodity.byAdd, this.addCart).then(res => {
                    uni.hideLoading()
                    if (res.code == 200) {
                        uni.showToast({
                            icon: 'none',
                            title: '加入购物车成功'
                        });
                        uni.setTabBarBadge({
                            index: 2,
                            text: String(res.data.cartCount)
                        });
                        this.totalCount += this.addCart.skuNumber
                        this.totalprice += this.addCart.skuNumber * price
                    } else {
                        uni.showToast({
                            icon: 'none',
                            title: res.msg || res.message
                        });
                    }
                });
            },
            // 前往购物车
            handleGoCart() {
                uni.switchTab({
                    url: '/pages/shop/index/index'
                });
            },
            // 页面触底
            scrolltolower(){
                console.log('wwwwwwwwwwwww');
                if (this.page < this.totalPage) {
                    console.log(111111111111111);
                    this.initData(this.page + 1)
                } else {
                    this.nomore = true
                    // uni.showToast({
                    //     icon:'none',
                    //     title:'没有更多数据了'
                    // })
                }
            }
        },
        onUnload() {
            uni.removeStorageSync('useCoupon')
        },
    }
</script>

<style lang="scss">
    .useCoupon {
        display: flex;
        flex-direction: column;
        height: 100vh;

        .body {
            flex: 1;
            overflow: auto;
            padding: 0 32rpx;
            box-sizing: border-box;

            .notice {
                display: block;
                width: 100%;
                line-height: 90rpx;
                text-align: center;
                font-size: 28rpx;
                font-family: PingFang SC;
                font-weight: 500;
                color: rgba(230, 162, 60, 1);
            }

            .tui-product-list {
                background: #F0F2F5;
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                box-sizing: border-box;
            }
        }

        .footer {
            width: 100%;
            height: 96rpx;
            background: rgba(255, 255, 255, 1);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 32rpx;
            box-sizing: border-box;
            flex-wrap: nowrap;
            overflow: hidden;
            padding-bottom: env(safe-area-inset-bottom);

            .total-price {
                font-size: 26rpx;
                font-family: PingFang SC;
                font-weight: bold;
                color: rgba(37, 37, 37, 1);

                .value {
                    font-size: 32rpx;
                    font-family: DIN;
                    font-weight: bold;
                    color: rgba(255, 102, 0, 1);
                }
            }

            .youhui {
                font-size: 22rpx;
                font-family: PingFang SC;
                font-weight: bold;
                color: rgba(37, 37, 37, 1);
                margin-top: 8rpx;
            }

            .left-box {
                // flex: 1;
                width: calc(100% - 230rpx);
            }

            .right-box {
                width: 220rpx;
                height: 76rpx;
                margin-left: 10rpx;
                line-height: 76rpx;
                text-align: center;
                background: rgba(16, 187, 184, 1);
                border-radius: 8rpx;
                color: #FFFFFF;
                font-size: 32rpx;
                font-family: PingFang SC;
                font-weight: 500;
            }
        }
    }

    .tui-popup-box {
        position: relative;
        padding: 30upx 0 100upx 0;
    }

    .tui-popup-btn {
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 0;
        padding: 0 32rpx;
        box-sizing: border-box;
    }

    .tui-popup-btn .tui-btn-class {
        width: 331rpx;
        height: 76rpx;
        line-height: 76rpx;
        color: #fff;
        font-weight: 500;
        background: #10bbb8;
        border-radius: 8rpx;
        display: block !important;
        font-size: 32upx !important;

        &.hot {
            background: #ff6600;
        }
    }

    .tui-icon-close {
        position: absolute;
        top: 30upx;
        right: 30upx;
    }

    .tui-product-box {
        display: flex;
        align-items: flex-end;
        font-size: 24upx;
        padding-bottom: 30upx;
    }

    .tui-popup-img {
        height: 200upx;
        width: 200upx;
        border-radius: 24upx;
        display: block;
    }

    .tui-popup-price {
        padding-left: 36upx;
        padding-bottom: 8upx;
    }

    .tui-amount {
        color: #ff6600;
        font-size: 36upx;
    }

    .tui-number {
        font-size: 24upx;
        line-height: 24upx;
        padding-top: 12upx;
        color: #878787;
    }

    .tui-popup-scroll {
        height: 600upx;
        font-size: 26upx;
    }

    .tui-popup-scroll.hot {
        padding-top: 32rpx;
    }

    .tui-scrollview-box {
        padding: 0 32upx 60upx 32upx;
        box-sizing: border-box;
    }

    .tui-scrollview-box.hot {
        padding-top: 32upx;
        padding-bottom: 0;
    }

    .tui-attr-title {
        padding: 10upx 0;
        color: #252525;
        font-size: 28rpx;
    }

    .tui-attr-box {
        font-size: 0;
        padding: 20upx 0;
    }

    .tui-attr-item {
        max-width: 100%;
        min-width: 200upx;
        height: 64upx;
        display: -webkit-inline-flex;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: #f0f2f5;
        color: #565656;
        padding: 0 24upx;
        box-sizing: border-box;
        border-radius: 8upx;
        margin-right: 24upx;
        margin-bottom: 24upx;
        font-size: 28upx;
    }

    .tui-attr-active {
        background: #E0FAFA;
        border: 2rpx solid #10BBB8;
        border-radius: 8rpx;
        color: #10BBB8;
        font-weight: 500;
    }

    .tui-number-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20upx 0 30upx 0;
        margin-bottom: 20rpx;
        box-sizing: border-box;
        border-bottom: 1px solid #d7d8d9;
    }

    /*底部选择弹层*/
    /*底部操作栏*/

    .tui-col-7 {
        width: 58.33333333%;
    }

    .tui-col-5 {
        width: 41.66666667%;
    }

    .tui-operation {
        width: 100%;
        height: 100upx;
        /* box-sizing: border-box; */
        background: #fff;
        box-shadow: 0 0 6upx 0 rgba(0, 0, 0, 0.14);
        position: fixed;
        display: flex;
        align-items: center;
        justify-content: space-between;
        z-index: 10;
        bottom: 0;
        left: 0;
        padding-bottom: env(safe-area-inset-bottom);
    }

    .tui-safearea-bottom {
        width: 100%;
        height: env(safe-area-inset-bottom);
    }

    .tui-operation::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        border-top: 1upx solid #eaeef1;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
    }

    .tui-operation-left {
        display: flex;
        align-items: center;
    }

    .tui-operation-item {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        position: relative;
    }

    .tui-operation-item:last-child::before {
        content: '';
        width: 2rpx;
        height: 100%;
        background: #D7D8D9;
        position: absolute;
        left: -1rpx;
        top: 0;
    }

    .tui-operation-item image {
        width: 40rpx;
        height: 40rpx;
    }

    .tui-operation-text {
        font-size: 20rpx;
        color: #252525;
        margin-top: 12rpx;
    }

    .tui-opacity {
        opacity: 0.5;
    }

    .tui-scale-small {
        transform: scale(0.9);
        transform-origin: center center;
    }

    .tui-operation-right {
        height: 100upx;
        /* box-sizing: border-box; */
        padding-top: 0;
    }

    .tui-right-flex {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .tui-btnbox-4 .tui-btn-class {
        width: 90% !important;
        display: block !important;
        font-size: 32upx !important;
    }

    .btn-item {
        background: #10bbb8;
        height: 100%;
        text-align: center;
        line-height: 100rpx;
        color: #fff;
    }

    .btn-item.hot {
        background: #ff6600;
    }

    .tui-operation .tui-badge-class {
        position: absolute;
        top: -6upx;
        /* #ifdef H5 */
        transform: translateX(50%);
        /* #endif  */
    }

    .tui-flex-1 {
        flex: 1;
    }

    /*底部操作栏*/
</style>
