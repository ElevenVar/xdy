<template>
    <view class="container page" v-if="item">
        <!--header-->
        <view class="tui-header-box" :style="{ height: height + 'px', background: 'rgba(255,255,255,' + opcity + ')' }">
            <scroll-view id="tab-bar" class="tui-header" :style="{ paddingTop: top + 'px', opacity: opcity }" :scroll-x="true"
                :show-scrollbar="false">
                <view v-for="(tab, index) in tabBars" :key="tab.id" class="tui-header-text" :class="scrollInto == tab.id ? 'hot' : ''"
                    :id="tab.id" :data-current="index" :style="{ color: opcity >= 1 ? '#000' : '#fff' }" @click="ontabtap(tab.id)">
                    <text>{{ tab.name }}</text>
                </view>
            </scroll-view>
            <view class="tui-header-icon" :style="{ marginTop: top + 'px' }">
                <view class="tui-icon tui-icon-arrowleft tui-icon-back" :style="{ color: opcity >= 1 ? '#000' : '#fff', background: 'rgba(0, 0, 0,' + iconOpcity + ')' }"
                    @tap="back">
                    <!--  <tui-icon name="arrowleft" :color="opcity >= 1 ? '#000' : '#fff'"></tui-icon> -->
                </view>
            </view>
        </view>
        <!--header-->
        <view class="body">


            <!--商品信息-->
            <scroll-view scroll-y class="scroll-y" :scroll-into-view="scrollInto" @scroll="handleScroll">
                <!--商品信息-->
                <view id="product" class="section">
                    <!--banner-->
                    <view class="tui-banner-swiper">
                        <swiper :autoplay="true" :interval="5000" :duration="150" :circular="true" :style="{ height: 500 + 'rpx' }">
                            <swiper-item class="swiper-item" :data-index="index" @tap.stop="previewImage">
                                <!-- :style="{'background': `url(${item.commodity.comDefaultSkuImg}) center/cover no-repeat`}" -->
                                <image class="tui-slide-image" :style="{'background': `url(${item.commodity.comDefaultSkuImg}) center/cover no-repeat`}" />
                                <!-- :src="item.commodity.comDefaultSkuImg" -->
                            </swiper-item>
                        </swiper>
                        <!-- <tui-tag type="translucent" shape="circleLeft" size="small">{{ bannerIndex + 1 }}/{{ banner.length }}</tui-tag> -->
                    </view>

                    <!--banner-->

                    <view class="tui-pro-detail">
                        <view class="tui-product-title">
                            <block v-if='item.commodity.comSkuIsDiscuss == 0'>
                                <view class="tui-pro-pricebox tui-padding">
                                    <view class="tui-pro-price">
                                        <text v-if="item.commoditySku.skuSellingPrice" style="margin-left: -9rpx;">
                                            ￥
                                            <text class="tui-price">{{ item.commoditySku.skuSellingPrice }}</text>

                                        </text>
                                    </view>
                                </view>
                                <view class="tui-original-price tui-gray" v-if="item.commoditySku.skuMarketPrice">
                                    价格
                                    <text class="tui-line-through">￥{{ item.commoditySku.skuMarketPrice }}</text>
                                    <text class="product-sales-label">月销</text>
                                    <text class="product-sales">{{ item.commodity.comSalesVolumeSum }}</text>
                                </view>
                            </block>
                            <block v-else>
                                <view class="tui-pro-pricebox tui-padding">
                                    <view class="tui-pro-price">
                                        <text v-if="item.commoditySku.skuSellingPrice" style="font-size: 46rpx;">
                                            <!-- <text class="tui-price">面议</text> -->
                                            面议
                                        </text>
                                    </view>
                                </view>
                                <view class="tui-original-price tui-gray" v-if="item.commoditySku.skuMarketPrice">
                                    <text class="product-sales-label" style="margin-left: 0;">月销</text>
                                    <text class="product-sales">{{ item.commodity.comSalesVolumeSum }}</text>
                                </view>
                            </block>
                            <view class="tui-pro-titbox">
                                <view class="tui-pro-title">{{ item.commodity.comName }}</view>
                            </view>
                            <!-- #ifdef MP-WEIXIN -->
                            <button class="tui-share-btn tui-share-position" @click="showSharePopup">
                                <image :src="imgUrl + 'details/share.png'" mode="" class="share-icon"></image>
                                <text class="tui-share-text tui-gray">分享</text>
                            </button>
                            <!-- #endif -->
                            <!-- #ifndef MP-WEIXIN -->
                            <button class="tui-share-btn tui-share-position" open-type='share'>
                                <image :src="imgUrl + 'details/share.png'" mode="" class="share-icon"></image>
                                <text class="tui-share-text tui-gray">分享</text>
                            </button>
                            <!-- #endif -->
                            <!-- 促销标签 -->
                            <view class="tui-padding" v-if="item.commodity.compLabelId">
                                <view class="tui-label-info">
                                    <view class="info-item" v-for="(label, index) in item.commodity.compLabelName" :key="index">{{ label }}</view>
                                </view>
                            </view>
                        </view>

                        <view class="tui-discount-box tui-radius-all tui-mtop">
                            <view class="tui-list-cell" @tap="showCouponPopup" v-if="coupnList && coupnList.length > 0">
                                <view class="tui-cell-title">领券</view>
                                <view class="tui-tag-coupon-box">
                                    <view class="coupon-item" v-for="item in coupnTips" :key='item'><text v-if="item">{{item}}</text></view>
                                </view>
                                <tui-icon name="more-fill" :size="20" class="tui-right tui-top40" color="#666"></tui-icon>
                            </view>

                            <!--  <view class="tui-list-cell tui-last" @tap="showPromotionPopup">
                            <view class="tui-bold tui-cell-title">促销</view>
                            <view>
                                <view class="tui-promotion-box">
                                    <view class="promotion-item">多买优惠</view>
                                    <text>满1件，立减最低1件商品价格，包邮（限中国内地）</text>
                                </view>
                                <view class="tui-promotion-box">
                                    <view class="promotion-item">多买优惠</view>
                                    <text>满2件，立减最低2件商品价格，包邮（限中国内地）</text>
                                </view>
                                <view class="tui-promotion-box">
                                    <view class="promotion-item">特别赠品</view>
                                    <text>满3件，立减最低3件商品价格，包邮（限中国内地）</text>
                                </view>
                            </view>
                            <tui-icon name="more-fill" :size="20" class="tui-right tui-top40" color="#666"></tui-icon>
                        </view> -->
                        </view>

                        <view class="tui-basic-info tui-mtop tui-radius-all">
                            <view class="tui-list-cell" @tap="showPopup">
                                <view class="tui-bold tui-cell-title">已选</view>
                                <view class="tui-selected-box" style="padding-right: 38rpx;font-size: 28rpx;">{{ item.commoditySku.skuPropertyVname }}</view>
                                <tui-icon name="more-fill" :size="20" class="tui-right" color="#666"></tui-icon>
                            </view>
                            <view class="tui-list-cell">
                                <view class="tui-bold tui-cell-title">城市</view>
                                <view class="tui-addr-box" style="font-size: 28rpx;">
                                    <view class="tui-addr-item">{{ item.commodity.comAreasName }}</view>
                                </view>
                                <!-- <tui-icon name="more-fill" :size="20" class="tui-right" color="#666"></tui-icon> -->
                            </view>
                            <!-- v-if="item.commodity.comServeLabelsName.length > 0 item.commodity.comServeLabelsName" -->
                            <view class="tui-guarantee" v-if="item.commodity.comServeLabelsName.length > 0">
                                <view class="tui-guarantee-item" v-for="(label, index) in item.commodity.comServeLabelsName"
                                    :key="index">
                                    <tui-icon name="circle-selected" :size="14" color="#999"></tui-icon>
                                    <text class="tui-pl">{{label}}</text>
                                </view>
                                <block v-if="item.commodity.comServeLabelsName.length < 4">
                                    <view v-for="item in (4-item.commodity.comServeLabelsName.length)" :key='item'></view>
                                </block>

                            </view>
                        </view>
                    </view>
                    <!--商品信息end-->
                </view>
                <!--商品详情-->
                <view id="detail" class="section">
                    <!--商品详情-->
                    <view class="detail-tab" :style="{ top: height + 'px', position: canvasFlag?'sticky': 'static' }">
                        <view class="tab-text" :class="curDetailTab == item.id ? 'active' : ''" v-for="(item, index) in detailTab"
                            @click="handleClickDetail(item.id)" :key="index">
                            {{ item.name }}
                        </view>
                    </view>
                    <!--商品详情---商品介绍-->
                    <block v-if="curDetailTab == 1">
                        <!-- <view class="table-box">{{ item.commoditySku.skuDetailApp }}</view> -->
                        <rich-text :nodes="item.commodity.comDetailApp" />
                    </block>
                    <!--商品详情---规格参数-->
                    <block v-if="curDetailTab == 2">
                        <view class="table-box">
                            <block v-for="(td, index) in item.commodityPropertyByLableList" :key="index">
                                <view class="table-li">
                                    <view class="li-label">{{ td.propName }}</view>
                                    <view class="li-value">{{ td.valName ? td.valName : '-' }}</view>
                                </view>
                            </block>
                        </view>
                    </block>
                    <!--商品详情end-->
                </view>
            </scroll-view>
            <!--商品信息-->
        </view>
        <!--底部操作栏-->
        <view class="tui-operation">
            <block v-if="item.commoditySku.skuIsDiscuss == 0">
                <view class="tui-operation-left tui-col-5">
                    <button class="tui-operation-item" open-type='contact' hover-class="opcity" :hover-stay-time="150">
                        <image :src="imgUrl + 'details/zx.png'" mode=""></image>
                        <view class="tui-operation-text">咨询</view>
                    </button>
                    <view class="tui-operation-item" hover-class="opcity" :hover-stay-time="150" @tap="handleGoCart">
                        <image :src="imgUrl + 'details/car.png'" mode=""></image>
                        <view class="tui-operation-text">购物车</view>
                        <tui-badge type="danger" size="small">{{ cartCount }}</tui-badge>
                    </view>
                </view>
                <view class="tui-operation-right tui-right-flex tui-col-7 tui-btnbox-4">
                    <view class="tui-flex-1">
                        <view class="btn-item" @click="handleOver(0)">加入购物车</view>
                    </view>
                    <view class="tui-flex-1">
                        <view class="btn-item hot" @click="handleOver(1)">立即购买</view>
                    </view>
                </view>
            </block>
            <block v-else>
                <view class="tui-operation-left tui-col-5">
                    <view class="tui-operation-item" hover-class="opcity" :hover-stay-time="150" @tap="handleGoCart">
                        <image :src="imgUrl + 'details/car.png'" mode=""></image>
                        <view class="tui-operation-text">购物车</view>
                        <tui-badge type="danger" size="small">{{ cartCount }}</tui-badge>
                    </view>
                </view>
                <view class="tui-operation-right tui-right-flex tui-btnbox-4" style="width: 550rpx;">
                    <view class="tui-flex-1">
                        <button class="mBtn" type="primary" open-type='contact'>立即咨询</button>
                    </view>
                </view>
            </block>
        </view>

        <!--底部操作栏--->

        <!--底部选择层-->
        <!-- 商品详情sku等选择上弹框 -->
        <tui-bottom-popup :show="popupShow" @close="hidePopup">
            <view class="tui-popup-box">
                <view class="tui-product-box tui-padding">
                    <image :src="item.commoditySku.skuImgs" class="tui-popup-img"></image>
                    <view class="tui-popup-price">
                        <view class="tui-amount tui-bold" v-if="item.commoditySku.skuIsDiscuss == 0">￥{{ item.commoditySku.skuSellingPrice }}</view>
                        <view class="tui-amount tui-bold" v-else>面议</view>
                        <view class="tui-number">编号:{{ item.commodity.comCode }}</view>
                    </view>
                </view>
                <scroll-view scroll-y class="tui-popup-scroll">
                    <view class="tui-scrollview-box">
                        <block v-for="(items, index) in item.commodityPropertyBySkuList" :key="index">
                            <view class="tui-attr-title">{{ items.propName }}</view>
                            <view class="tui-attr-box">
                                <button class="tui-attr-item" v-for="tabItem in items.commodityPropertyValueList"
                                    :class="tabItem.isSelected == 1 ? 'tui-attr-active' : ''" :key="tabItem.valName"
                                    :disabled="tabItem.isShow == 0" @tap="handleCkeck(index, tabItem.valName)">
                                    {{ tabItem.valName }}
                                </button>
                            </view>
                        </block>
                        <view class="tui-number-box tui-attr-title">
                            <view class="tui-attr-title">数量</view>
                            <tui-numberbox :max="99" :min="1" :value="value" @change="change"></tui-numberbox>
                        </view>
                    </view>
                </scroll-view>
                <view class="tui-operation tui-operation-right tui-right-flex tui-popup-btn" v-if="item.commoditySku.skuIsDiscuss == 0">
                    <block v-if="btnType">
                        <button type="red" class="tui-btn-class" @click="handleSubmit(0)">加入购物车</button>
                        <button type="warning" class="tui-btn-class hot" @click="handleSubmit(1)">立即购买</button>
                    </block>
                    <block v-else><button type="red" class="tui-btn-class tui-flex-1" @click="handleSubmit(handleType)">确定</button></block>
                </view>
                <view class="tui-operation tui-operation-right tui-right-flex tui-popup-btn" v-if="item.commoditySku.skuIsDiscuss != 0">
                    <button class="tui-btn-class tui-flex-1 mBtn" type="primary" open-type='contact'>立即咨询</button>
                </view>
                <view class="tui-icon tui-icon-close-fill tui-icon-close" style="color: #999;font-size:20px" @tap="hidePopup"></view>
            </view>
        </tui-bottom-popup>
        <!-- 优惠券上弹框 -->
        <tui-bottom-popup :show="couponPopupShow" @close="hideCouponPopup">
            <view class="yhq-flex">
                <view class="popup-title-box">
                    <view class="title">领取优惠券</view>
                </view>
                <scroll-view scroll-y class="tui-popup-scroll hot">
                    <coupon v-if="coupnList && coupnList.length > 0" :couponList="coupnList" @handleGetOne='handleGetOne'></coupon>
                    <dataNull v-else :tips='tips'></dataNull>
                </scroll-view>
                <view class="tui-icon tui-icon-close-fill tui-icon-close" style="color: #999;font-size:20px" @tap="hideCouponPopup"></view>
            </view>
        </tui-bottom-popup>
        <!-- 可参加的促销活动 上弹框 -->
        <tui-bottom-popup :show="promotionPopupShow" @close="hidePromotionPopup">
            <view class="">
                <view class="popup-title-box">
                    <view class="title">可参加的促销活动</view>
                </view>
                <scroll-view scroll-y class="tui-popup-scroll">
                    <view class="tui-scrollview-box hot">
                        <view class="promotion-box">
                            <view class="promotion-tag">特别赠品</view>
                            <view class="promotion-text">满3件，立减最低3件商品价格，包邮（限中国内地）</view>
                            <view class="promotion-icon">
                                <tui-icon class="icon" name="arrowright" :size="20" color="#707175"></tui-icon>
                            </view>
                        </view>
                        <view class="promotion-box">
                            <view class="promotion-tag">特别赠品</view>
                            <view class="promotion-text">满3件，立减最低3件商品价格，包邮（限中国内地）</view>
                            <view class="promotion-icon">
                                <tui-icon class="icon" name="arrowright" :size="20" color="#707175"></tui-icon>
                            </view>
                        </view>
                        <view class="promotion-notice">说明：满减、满赠、多买优惠促销活动 仅可在购物车中任选其一（当存在多个优惠时提示）</view>
                    </view>
                </scroll-view>
                <view class="tui-icon tui-icon-close-fill tui-icon-close" style="color: #999;font-size:20px" @tap="hidePromotionPopup"></view>
            </view>
        </tui-bottom-popup>
        <!-- 分享 上弹框 -->
        <tui-bottom-popup :show="sharePopupShow" @close="hideSharePopup">
            <view class="">
                <view class="popup-title-box">
                    <view class="title">分享到</view>
                </view>
                <view class="share-box">
                    <button class="share-item" v-for="item in shardData" :key="item.name" :open-type="item.name == '微信好友' ? 'share': ''"
                        @tap="handleShare(item.name)">
                        <image :src="item.img"></image>
                        <text>{{ item.name }}</text>
                    </button>
                </view>
                <!-- <view class="tui-icon tui-icon-close-fill tui-icon-close" style="color: #999;font-size:20px" @tap="hidePromotionPopup"></view> -->
            </view>
        </tui-bottom-popup>
        <!-- 分享弹窗 -->
        <!--底部选择层-->
        <!-- // 生成海报 -->
        <view class="lz-model" v-if="showDig" @tap="close">
            <view class="lz-box" @tap.stop="opens">
                <view class="lz-content">
                    <view class="lz-del" @tap.stop="close">
                        <!-- <tui-icon name="close" color="#e41f19"></tui-icon> -->
                        <icon type="clear" size="32" />
                    </view>
                    <image :src="tempFilePath" class="canvasBox" />
                </view>
                <view class="lz-btn" @tap="sharClick">
                    保存图片
                </view>
            </view>
        </view>
        <canvas class="canvas" canvas-id="share" v-if="canvasfals" style="position:fixed;top:9999px" />
    </view>
</template>

<script>
    import tuiIcon from '@/components/icon/icon';
    import tuiTag from '@/components/tag/tag';
    import tuiBadge from '@/components/badge/badge';
    import tuiBottomPopup from '@/components/bottom-popup/bottom-popup';
    import tuiNumberbox from '@/components/numberbox/numberbox';
    import coupon from '@/components/coupon/coupon.vue';
    import {
        commodity,
        accountSet
    } from '@/api/index.js';
    // import { regFenToYuan } from '@/utils/util.js';
    function regFenToYuan(str) {
        if (str % 100 == 0) {
            return String(str / 100) + '.00'
        } else {
            return str / 100
        }
    }
    import dataNull from '@/components/null-data/null-data.vue'
    import util from "@/utils/util.js"
    export default {
        components: {
            tuiIcon,
            tuiTag,
            tuiBadge,
            tuiBottomPopup,
            tuiNumberbox,
            coupon,
            dataNull
        },
        data() {
            const imgUrl = this.$config.imgUrl
            return {
                imgUrl: imgUrl,
                tips: {
                    image: imgUrl + 'coupon/no-coupon.png',
                    text: '暂无可领取优惠券!',
                    top: 40 // 距离顶部的距离
                },
                addCart: {
                    skuId: '',
                    skuNumber: 1,
                    sourceType: 0, // 0:正常加入购物车、 1:立即购买
                    serveIds: null,
                    comShowClient: 'COUPON_PLAT_1' // COUPON_PLAT_2(C端PC)  COUPON_PLAT_1(小程序)
                }, // 加入购物车， 立即购买
                item: null, // 商品详情信息集合
                cartCount: 0, // 购物车数量
                height: 64, //header高度
                top: 0, //标题图标距离顶部距离
                scrollH: 0, //滚动总高度
                opcity: 0,
                iconOpcity: 0.5,
                // sku 属性选择模态框
                popupShow: false,
                // sku的名字
                skuName: '',
                // 优惠券选择模态框
                couponPopupShow: false,
                // 可选优惠活动模态框
                promotionPopupShow: false,
                // 分享动模态框
                sharePopupShow: false,
                btnType: true, // sku模态框底部按钮显示,判断是从底部按钮点击还是直接点击模态框
                handleType: 0, // 0 加入购物车  1 立即购买
                value: 1, // 商品数量
                collected: false,
                scrollInto: 'product',
                tabBars: [{
                        id: 'product',
                        name: '商品'
                    },
                    {
                        id: 'detail',
                        name: '详情'
                    }
                ],
                // 每个楼层距离顶部的高度的数组
                productsTop: [],
                scrollTop: 0,
                // 商品详情的tab
                detailTab: [{
                        id: 1,
                        name: '商品介绍'
                    },
                    {
                        id: 2,
                        name: '规格参数'
                    },
                    // {
                    //     id: 3,
                    //     name: '商品明细'
                    // }
                ],
                curDetailTab: 1,
                shardData: [{
                        name: '微信好友',
                        img: `${this.$config.imgUrl}details/weixin.png`
                    },
                    {
                        name: '朋友圈',
                        img: `${this.$config.imgUrl}details/pengyouquan.png`
                    },
                    // {
                    //     name: '手机QQ',
                    //     img: `${this.$config.imgUrl}details/QQ.png`
                    // },
                    // {
                    //     name: '新浪微博',
                    //     img: `${this.$config.imgUrl}details/weibo.png`
                    // },
                    // {
                    //     name: 'QQ空间',
                    //     img: `${this.$config.imgUrl}details/QQKJ.png`
                    // },
                    // {
                    //     name: '复制链接',
                    //     img: `${this.$config.imgUrl}details/src.png`
                    // }
                ],
                coupnList: [], //优惠券
                coupnTips: [], // 优惠券标签
                CoupnData: {}, //查询优惠券列表参数
                comCode: '',
                posterHeight: '', // 画布的高度
                tempFilePath: '', // 海报生成的临时路径
                resMsg: '', // 系统信息
                canvasfals: false,
                showDig: false,
                context: null
            };
        },
        onLoad: function(options) {
			console.log(options)
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
            console.log('obj', obj);
            uni.getSystemInfo({
                success: res => {
                    console.log('res', res);
                    this.resMsg = res
                    this.width = obj.left || res.windowWidth;
                    this.height = obj.top ? obj.top + obj.height + 8 : res.statusBarHeight + 44;
                    this.top = obj.top ? obj.top + (obj.height - 32) / 2 : res.statusBarHeight + 6;
                    this.scrollH = res.windowWidth;
                    this.posterHeight = parseInt((res.windowWidth / 375) * 587)
                }
            });

            // 获取从路由携带过来的商品参数  ? options.comDefaultSkuCode : '200002';
            this.skuCode = options.skuCode
            this.context = uni.createCanvasContext('share')
        },
        onReady: function() {
            var query = uni.createSelectorQuery();
            this.productsTop = [];
            query
                .selectAll('.section')
                .boundingClientRect(rect => {
                    rect.forEach((item, index) => {
                        this.productsTop.push(item.top);
                    });
                })
                .exec();
        },
        onShow() {
            this.getdetails();
            if (uni.getStorageSync('token')) {
                console.log('有 token');
                this.getCartCount();
            }

        },
        methods: {
            // 分享列表事件
            handleShare(e) {
                switch (e) {
                    case '朋友圈':
                        uni.showLoading()
                        this.drawPoster()
                        break;
                    case '微信好友':
                        break;
                }
                this.hideSharePopup()
            },
            // 转为unicode 编码  
            encodeUnicode(str) {
                var res = [];
                for (var i = 0; i < str.length; i++) {
                    res[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
                }
                return "\\u" + res.join("\\u");
            },
            // 生成海报, 获取网络图片的信息
            async drawPoster() {
                try {
                    // let data = {
                    //     skuCode: this.item.commoditySku.skuCode,
                    //     cityName: this.$store.state.cityData.cityName,
                    //     code: this.$store.state.cityData.code
                    //     
                    // }
                    // data = JSON.stringify(data)
                    // data = this.item.commoditySku.skuCode
                    // let cityName = this.encodeUnicode(this.$store.state.cityData.cityName)
                    let data = this.item.commoditySku.skuCode + ',' + this.$store.state.cityData.code
                    console.log('scene----------', data);
                    let qrImg = await this.$http.post(accountSet.getQrImg, {
                        scene: data
                    }, {
                        header: {
                            "Content-Type": "application/json"
                        }
                    }).then(res => {
                        if (res.code == 200) {
                            return res.data
                        } else {
                            uni.showToast({
                                icon: 'none',
                                title: '获取小程序码失败,请重试'
                            })
                        }
                    })
                    await this.clickShare(qrImg)
                } catch (e) {
                    uni.showToast({
                        icon: 'none',
                        title: '生成海报失败,请重试'
                    })
                }

            },
            // 点击分享
            async clickShare(qrImg) {
                uni.showToast({
                    title: '生成中...',
                    icon: 'loading',
                    duration: 100000
                })
                let _this = this
                const imgUrl = this.item.commodity.comDefaultSkuImg
                // 下载文件到本地，再去执行绘制，不下载，在真机上图片显示不出来
                this.canvasfals = false
                let code = qrImg
                let title = this.item.commodity.comName //标题
                let discountPrice = this.item.commoditySku.skuSellingPrice //折后价格
                let orignPrice = this.item.commoditySku.skuMarketPrice //原价
                let comSalesVolumeSum = this.item.commodity.comSalesVolumeSum // 销量
                console.log('qrImg', qrImg);
                let data = {
                    codeImg: '',
                    bgImg: '',
                    title,
                    discountPrice,
                    orignPrice,
                    comSalesVolumeSum
                }
                try {
                    await uni.getImageInfo({
                        src: code,
                        success: (res) => {
                            data.codeImg = res.path
                            console.log('data.codeImg---', data.codeImg, res.path)
                        },
                        fail: (err) => {
                            uni.showToast({
                                icon: 'none',
                                title: '获取小程序码失败'
                            })
                        }
                    })
                    await uni.getImageInfo({
                        src: imgUrl,
                        success: function(res) {
                            _this.canvasfals = true
                            data.bgImg = res.path
                            // 绘图方法
                            setTimeout(() => {
                                _this.createNewImg(data)
                            }, 500)
                        }
                    })
                } catch (e) {
                    //TODO handle the exception
                    console.log('获取图片地址出错');
                }

            },
            // 生成图片
            createNewImg(data) {
                let context = this.context
                console.log(data);

                // 绘制白色背景
                context.setFillStyle('#fff')
                context.fillRect(0, 0, 10000, 10000)
                // 绘制商品图片
                const canvasWidth = this.createRpx2px(320 * 2)
                const avatarWidth = this.createRpx2px(300 * 2)
                const avatarHeight = this.createRpx2px(290 * 2)
                const avatarTop = this.createRpx2px(160 * 2)
                context.drawImage(data.bgImg, canvasWidth / 2 - avatarWidth / 2, avatarTop - avatarHeight / 2,
                    avatarWidth,
                    avatarHeight)
                // 绘制商品标题
                const goodsTitle = data.title
                this.dealWords({
                    ctx: context, // 画布上下文
                    fontSize: 16, // 字体大小
                    word: goodsTitle, // 需要处理的文字
                    maxWidth: 305, // 一行文字最大宽度
                    x: 10, // 文字在x轴要显示的位置
                    y: 325, // 文字在y轴要显示的位置
                    setFillStyle: '#333',
                    maxLine: 2 // 文字最多显示的行数
                })
                // 绘制价格￥符号
                this.dealWords({
                    ctx: context, // 画布上下文
                    fontSize: 12, // 字体大小
                    word: '￥', // 需要处理的文字
                    maxWidth: 20, // 一行文字最大宽度
                    x: 10, // 文字在x轴要显示的位置
                    y: 370, // 文字在y轴要显示的位置
                    setFillStyle: '#fe4543', // 字体颜色
                    maxLine: 1 // 文字最多显示的行数
                })
                // 绘制价格
                this.dealWords({
                    ctx: context, // 画布上下文
                    fontSize: 18, // 字体大小
                    word: data.discountPrice.toString(), // 需要处理的文字
                    maxWidth: 285, // 一行文字最大宽度
                    x: 20, // 文字在x轴要显示的位置
                    y: 370, // 文字在y轴要显示的位置
                    setFillStyle: '#fe4543', // 字体颜色
                    maxLine: 1 // 文字最多显示的行数
                })
                // 绘制原价
                this.dealWords({
                    ctx: context, // 画布上下文
                    fontSize: 14, // 字体大小
                    word: '原价:  ￥' + data.orignPrice.toString(), // 需要处理的文字
                    maxWidth: 285, // 一行文字最大宽度
                    x: 10, // 文字在x轴要显示的位置
                    y: 400, // 文字在y轴要显示的位置
                    setFillStyle: '#999', // 字体颜色
                    maxLine: 1 // 文字最多显示的行数
                })
                // 绘制原价删除线
                context.moveTo(10, 414)
                context.lineTo(100, 414)
                context.lineWidth = 1
                context.strokeStyle = '#999'
                context.stroke() // 进行绘制
                // 绘制销量
                this.dealWords({
                    ctx: context, // 画布上下文
                    fontSize: 14, // 字体大小
                    word: '销量:  ' + data.comSalesVolumeSum.toString(), // 需要处理的文字
                    maxWidth: 120, // 一行文字最大宽度
                    x: 10, // 文字在x轴要显示的位置
                    y: 430, // 文字在y轴要显示的位置
                    setFillStyle: '#999', // 字体颜色
                    maxLine: 1 // 文字最多显示的行数
                })
                // 绘制活动数量
                // this.dealWords({
                //     ctx: context, // 画布上下文
                //     fontSize: 14, // 字体大小
                //     word: '活动数量:  0', // 需要处理的文字
                //     maxWidth: 120, // 一行文字最大宽度
                //     x: 150, // 文字在x轴要显示的位置
                //     y: 430, // 文字在y轴要显示的位置
                //     setFillStyle: '#999', // 字体颜色
                //     maxLine: 1 // 文字最多显示的行数
                // })
                // 绘制底部描述文字
                this.dealWords({
                    ctx: context, // 画布上下文
                    fontSize: 12, // 字体大小
                    word: '长按/扫描识别查看商品', // 需要处理的文字
                    maxWidth: 305, // 一行文字最大宽度
                    x: 160, // 文字在x轴要显示的位置
                    y: 470, // 文字在y轴要显示的位置
                    setFillStyle: '#7086fa', // 字体颜色
                    textAlign: 'center',
                    maxLine: 1 // 文字最多显示的行数
                })
                context.drawImage(data.codeImg, 220, 370, 100, 100)
                console.log('完成作画-------', data.codeImg);
                // 完成作画
                context.draw()
                setTimeout(() => {
                    uni.canvasToTempFilePath({
                        canvasId: 'share',
                        fileType: 'jpg',
                        quality: 1,
                        success: (res) => {
                            uni.hideToast()
                            console.log('完成作画', res.tempFilePath);
                            this.tempFilePath = res.tempFilePath
                            this.showDig = true
                        },
                        fail: (err) => {
                            uni.hideToast()
                            this.showDig = false

                            uni.showToast({
                                title: '生成失败',
                                icon: 'loading',
                                duration: 2000
                            })
                        }
                    })
                }, 500)
            },
            createRpx2px(rpx) {
                const {
                    windowWidth
                } = uni.getSystemInfoSync()
                return windowWidth / 750 * rpx
            },
            opens() {
                this.showDig = true
            },
            close() {
                this.showDig = false
            },
            // 保存
            sharClick() {
                wx.showToast({
                    title: '保存中...',
                    icon: 'loading',
                    duration: 100000
                })
                let that = this
                wx.saveImageToPhotosAlbum({
                    filePath: this.tempFilePath,
                    success(res) {
                        wx.hideToast()
                        wx.showModal({
                            content: '图片已保存到相册，赶紧晒一下吧~',
                            showCancel: false,
                            confirmText: '好的',
                            confirmColor: '#333',
                            success: (res) => {
                                if (res.confirm) {
                                    that.showDig = false
                                }
                            },
                            fail: function(res) {}
                        })
                    },
                    fail: function(res) {
                        wx.showToast({
                            title: res.errMsg,
                            icon: 'none',
                            duration: 2000
                        })
                    }
                })
            },
            // 处理文字多出省略号显示
            dealWords(options) {
                options.ctx.setFontSize(options.fontSize) // 设置字体大小
                options.ctx.setFillStyle(options.setFillStyle)
                options.ctx.textAlign = options.textAlign || ''
                var allRow = Math.ceil(options.ctx.measureText(options.word).width / options.maxWidth) // 实际总共能分多少行
                var count = allRow >= options.maxLine ? options.maxLine : allRow // 实际能分多少行与设置的最大显示行数比，谁小就用谁做循环次数

                var endPos = 0 // 当前字符串的截断点
                for (var j = 0; j < count; j++) {
                    var nowStr = options.word.slice(endPos) // 当前剩余的字符串
                    var rowWid = 0 // 每一行当前宽度
                    if (options.ctx.measureText(nowStr).width > options.maxWidth) { // 如果当前的字符串宽度大于最大宽度，然后开始截取
                        for (var m = 0; m < nowStr.length; m++) {
                            rowWid += options.ctx.measureText(nowStr[m]).width // 当前字符串总宽度
                            if (rowWid > options.maxWidth) {
                                if (j === options.maxLine - 1) { // 如果是最后一行
                                    options.ctx.fillText(nowStr.slice(0, m - 1) + '...', options.x, options.y + (j + 1) *
                                        18) // (j+1)*18这是每一行的高度
                                } else {
                                    options.ctx.fillText(nowStr.slice(0, m), options.x, options.y + (j + 1) * 18)
                                }
                                endPos += m // 下次截断点
                                break
                            }
                        }
                    } else { // 如果当前的字符串宽度小于最大宽度就直接输出
                        options.ctx.fillText(nowStr.slice(0), options.x, options.y + (j + 1) * 18)
                    }
                }
            },
            previewImage: function(e) {
                let arr = [this.item.commodity.comDefaultSkuImg];
                uni.previewImage({
                    urls: arr
                });
            },
            back: function() {
                uni.navigateBack();
            },
            // sku 模态框显示
            showPopup: function() {
                this.popupShow = true;
                this.btnType = true;
            },
            // sku 模态框隐藏
            hidePopup: function() {
                this.popupShow = false;
            },
            // 优惠券 模态框显示
            showCouponPopup: function() {
                this.couponPopupShow = true;
            },
            // 优惠券 模态框
            hideCouponPopup: function() {
                this.couponPopupShow = false;
            },
            // 促销 模态框显示
            showPromotionPopup: function() {
                this.promotionPopupShow = true;
            },
            // 促销 模态框
            hidePromotionPopup: function() {
                this.promotionPopupShow = false;
            },
            // 分享 模态框显示
            showSharePopup: function() {
                this.sharePopupShow = true;
            },
            // 分享 模态框
            hideSharePopup: function() {
                this.sharePopupShow = false;
            },
            // 商品数量点击
            change: function(e) {
                this.value = e.value;
                this.addCart.skuNumber = e.value;
            },
            // 获取购物车数量
            getCartCount() {
                uni.showLoading({
                    title: '加载中...',
                    mask: true
                })
                this.$http.get(commodity.getCartCount).then(res => {
                    uni.hideLoading()
                    if (res.code == 200) {
                        this.cartCount = res.data.cartCount;
                        uni.setTabBarBadge({
                            index: 2,
                            text: String(res.data.cartCount)
                        });
                    } else {
                        uni.showToast({
                            icon: 'none',
                            title: res.msg
                        });
                    }
                });
            },
            // 点击hender分类跳转
            ontabtap(e) {
                this.scrollInto = e;
            },
            // scroll-y滚动的时候
            handleScroll(e) {
                this.scrollTop = e.detail.scrollTop;
                this.onScrollViewScroll({
                    scrollTop: e.detail.scrollTop
                });
                let scroll = e.detail.scrollTop <= 0 ? 0 : e.detail.scrollTop;
                // let opcity = scroll / this.scrollH;
                let opcity = scroll / 100;
                if (this.opcity >= 1 && opcity >= 1) {
                    return;
                }
                this.opcity = opcity;
                this.iconOpcity = 0.5 * (1 - opcity < 0 ? 0 : 1 - opcity);
            },
            onScrollViewScroll(e) {
                // 当前滚动的距离
                let scrollTop = e.scrollTop;
                // 遍历每个商品距离顶部的距离
                this.productsTop.forEach((item, index) => {
                    if (scrollTop > item - 50) {
                        this.scrollInto = this.tabBars[index].id;
                    }
                });
            },
            // sku 属性选择
            handleCkeck(index, name) {

                this.item.commodityPropertyBySkuList[index].commodityPropertyValueList.forEach(el => {
                    if (el.valName == name) {
                        el.isSelected = 1;
                    } else {
                        el.isSelected = 0;
                    }
                });
                let num = this.getSkuIDs(this.item.commodityPropertyBySkuList);
                let data = {
                    values: num,
                    comId: this.item.commoditySku.skuComId
                };
                uni.showLoading({
                    title: '加载中...',
                    mask: true
                });
                this.$http.get(commodity.skuSearch, data).then(res => {
                    uni.hideLoading();
                    if (res.code == 200) {
                        res.data.commoditySku.skuSellingPrice = regFenToYuan(res.data.commoditySku.skuSellingPrice);
                        res.data.commoditySku.skuMarketPrice = regFenToYuan(res.data.commoditySku.skuMarketPrice);
                        this.item.commodityPropertyBySkuList = res.data.commodityPropertyBySkuList;
                        this.item.commoditySku = res.data.commoditySku;
                        this.addCart.skuId = this.item.commoditySku.skuId
                    } else {
                        uni.showToast({
                            icon: 'none',
                            title: res.msg
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
            // 前往购物车
            handleGoCart() {
                uni.switchTab({
                    url: '/pages/shop/index/index'
                });
            },
            // 商品详情tab点击切换
            handleClickDetail(e) {
                this.curDetailTab = e;
            },
            // 获取商品详情
            getdetails() {
                uni.showLoading({
                    title: '加载中...',
                    mask: true
                })
                this.$http.get(commodity.commodityDetail, {
                    skuCode: this.skuCode
                }).then(res => {
                    uni.hideLoading();
                    if (res.code == 200) {
                        let comServeLabelsName = res.data.commodity.comServeLabelsName;
                        let compLabelName = res.data.commodity.compLabelName ? res.data.commodity.compLabelName :
                            '';
                        res.data.commodity.comServeLabelsName = comServeLabelsName ? comServeLabelsName.split(
                            ',') : [];
                        res.data.commodity.comServeLabelsName = res.data.commodity.comServeLabelsName.slice(0,
                            4)
                        res.data.commodity.compLabelName = compLabelName.split(',');
                        res.data.commoditySku.skuSellingPrice = regFenToYuan(res.data.commoditySku.skuSellingPrice);
                        res.data.commoditySku.skuMarketPrice = regFenToYuan(res.data.commoditySku.skuMarketPrice);
                        res.data.commodity.comDetailApp = res.data.commodity.comDetailApp ? res.data.commodity.comDetailApp
                            .replace(/<img/g, "<img style='max-width: 100% !important'") : ''
                        this.item = res.data;
                        this.addCart.skuId = res.data.commoditySku.skuId;
                        this.CoupnData = {
                            productId: this.item.commoditySku.skuComId,
                            cateId: this.item.commodity.comCateIdThree
                        }
                        this.getCoupn(this.CoupnData)
                    } else {
                        uni.showToast({
                            icon: 'none',
                            title: res.msg
                        });
                        this.timeOut = setTimeout(() => {
                            uni.navigateBack();
                        }, 1000);
                    }
                });
            },
            // 点击立即购买 或 添加购物车  0 加入购物车  1 立即购买
            handleOver(e) {
                if (e == 0) {
                    // "comIsShopCart": "是否允许加入购物车 0否 1是",
                    if (this.item.commodity.comIsShopCart == 0) {
                        uni.showToast({
                            icon: 'none',
                            title: '此商品禁止加入购物车'
                        })
                        return
                    }
                }
                this.showPopup();
                this.btnType = false;
                this.handleType = e;
            },
            async handleSubmit(e) {
                this.hidePopup();
                // 判断是否登录
                const res = await util.checkUserIsLogin();
                if (res.code != 200) {
                    uni.showToast({
                        title: res.msg,
                        icon: 'none'
                    })
                    setTimeout(() => {
                        uni.navigateTo({
                            url: '/pages/login/login'
                        })
                    }, 1000)
                    return
                }
                if (e == 0) {
                    uni.showLoading()

                    console.log(this.addCart.skuId);
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
                            this.cartCount = res.data.cartCount;
                        } else {
                            uni.showToast({
                                icon: 'none',
                                title: res.msg
                            });
                        }
                    });
                } else if (e == 1) {
                    this.addCart.sourceType = 1;
                    uni.showLoading();
                    this.$http.post(commodity.byAdd, this.addCart).then(res => {
                        console.log('立即购买', res);
                        if (res.code == 200) {
                            uni.hideLoading();
                            this.cartCount = res.data.cartCount;
                            // uni.navigateTo({ url: '/pages/order/confirmOrder/confirmOrder' });
                            uni.navigateTo({
                                url: `/pages/order/confirmOrder/confirmOrder?sourceType=${this.addCart.sourceType}&skuId=${this.addCart.skuId}&comId=${this.item.commodity.comCode}&comCateIdThree=${this.item.commodity.comCateIdTwo}`
                            })
                        } else {
                            uni.showToast({
                                icon: 'none',
                                title: res.msg
                            });
                        }
                    });
                }
            },
            // 获取优惠券列表
            getCoupn(data) {
                this.$http.get(commodity.getCoupnList, data).then(res => {
                    console.log(res);
                    if (res.code == 200) {
                        res.data.forEach(el => {
                            el.amount = Number(el.amount)
                            el.denomination = Number(el.denomination)
                            if (el.type == 'COUPON_TYPE_ZK') {
                                el.tipsName = `${el.amount / 10}折劵`
                            } else {
                                el.tipsName = `满${el.denomination / 100} 减 ${el.amount / 100}`
                            }
                        })
                        this.coupnList = res.data
                        if (this.coupnList && this.coupnList.length > 0) {
                            if (this.coupnList.length > 1) {
                                this.coupnTips = [this.coupnList[0]['tipsName'], this.coupnList[1]['tipsName']]
                            } else {
                                this.coupnTips = [this.coupnList[0]['tipsName']]
                            }
                        } else {
                            this.coupnTips = []
                        }

                    } else {
                        uni.showToast({
                            icon: 'none',
                            title: res.msg
                        });
                    }
                })
            },
            // 点击领取优惠券
            async handleGetOne(e) {
                // 判断是否登录
                const res = await util.checkUserIsLogin();
                if (res.code != 200) {
                    uni.showToast({
                        title: res.msg,
                        icon: 'none'
                    })
                    setTimeout(() => {
                        uni.navigateTo({
                            url: '/pages/login/login'
                        })
                    }, 1000)
                    return
                }
                uni.showLoading({
                    title: '领取中...',
                    mask: true
                })
                this.$http.post(commodity.getCoupnOne, {
                    couponId: e
                }).then(res => {
                    console.log(11111, res);
                    uni.hideLoading()
                    if (res.code == 200) {
                        this.getCoupn(this.CoupnData)
                    } else {
                        uni.showToast({
                            icon: 'none',
                            title: res.message
                        });
                    }
                })
            }
        },
        onHide() {
            clearTimeout(this.timeOut);
        },
        onShareAppMessage() {
            return {
                title: this.item.commodity.comName,
                path: '/pages/index/index?skuCode=' + this.item.commoditySku.skuCode + '&cityName=' + this.$store.state
                    .cityData.cityName + '&code=' + this.$store.state.cityData.code
            }
        }
    };
</script>

<style lang="scss">
    /* icon 也可以使用组件*/
    @import '../../static/style/icon.css';

    page {
        background: #f7f7f7;
        overflow: hidden;
    }

    .yhq-flex {
        height: 1074rpx;
        display: flex;
        flex-direction: column;

        .tui-popup-scroll {
            flex: 1;
        }
    }

    button {
        border: none;
        border-radius: 0;
    }

    .mBtn {
        height: 100rpx;
        line-height: 100rpx;
        background: #10BBB8 !important;
    }

    // 生成海报
    .lz-model {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;

        .lz-box {
            width: 85%;
            margin-top: 130rpx;

            .lz-content {
                background: white;
                height: 100%;
                margin-bottom: 50rpx;
                border-radius: 4px;
                position: relative;

                .lz-del {
                    border-radius: 50%;
                    z-index: 10;
                    width: 50rpx;
                    height: 50rpx;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: absolute;
                    top: -10px;
                    right: -10px;
                    background: white;
                }
            }

            .lz-btn {
                background: #fe4543;
                color: white;
                text-align: center;
                padding: 20rpx 0;
            }
        }

        .canvasBox {
            display: block;
            height: 1000rpx;
        }
    }

    .canvas {
        width: 85%;
        display: block;
        height: 1000rpx;
        background-color: white;
    }

    // 商品详情 规格参数
    .table-box {
        width: 100%;
        padding: 32rpx 20rpx 100rpx;
        background: #fff;
        box-sizing: border-box;

        .table-li {
            display: flex;
            align-items: center;
            border: 1rpx solid #d7d8d9;
            height: 62rpx;
            line-height: 62rpx;
            font-size: 24rpx;
            font-family: PingFang SC;
            font-weight: 500;
            color: rgba(135, 135, 135, 1);

            .li-label {
                border-right: 1rpx solid #d7d8d9;
                width: 220rpx;
                padding-left: 30rpx;
                box-sizing: border-box;
            }

            .li-value {
                flex: 1;
                padding-left: 30rpx;
                box-sizing: border-box;
            }
        }

        .table-li+.table-li {
            border-top: none;
        }
    }

    ::-webkit-scrollbar {
        width: 0;
        height: 0;
        color: transparent;
    }

    .container {
        // padding-bottom: 110upx;
        box-sizing: border-box;
        overflow-x: hidden;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100vh;
    }

    .tui-header-box {
        width: 100%;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 9998;
    }

    .scroll-y {
        width: 100%;
        height: 100%;
        // height: calc(100vh - 100rpx);
    }

    .tui-header {
        width: 100%;
        font-size: 18px;
        line-height: 18px;
        font-weight: 500;
        height: 32px;
        text-align: center;
    }

    .tui-header-text {
        display: inline-block;
        text-align: center;
        line-height: 32px;
        font-size: 32rpx;
    }

    .tui-header-text+.tui-header-text {
        margin-left: 20rpx;
    }

    .tui-header-text.hot {
        position: relative;

        &:after {
            content: '';
            background: #10bbb8;
            width: 100%;
            height: 6rpx;
            position: absolute;
            left: 0;
            bottom: 0;
            border-radius: 3rpx;
        }
    }

    .tui-header-icon {
        position: fixed;
        top: 0;
        left: 10px;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        height: 32px;
        transform: translateZ(0);
        z-index: 99999;
    }

    .tui-header-icon .tui-badge {
        background: #e41f19 !important;
        position: absolute;
        right: -4px;
    }

    .tui-icon-ml {
        margin-left: 20upx;
    }

    .tui-icon {
        border-radius: 16px;
    }

    .tui-icon-back {
        height: 32px !important;
        width: 32px !important;
        display: block !important;
    }

    .tui-header-icon .tui-icon-more-fill {
        height: 20px !important;
        width: 20px !important;
        padding: 6px !important;
        display: block !important;
    }

    .tui-banner-swiper {
        position: relative;
    }

    .tui-banner-swiper .tui-tag-class {
        position: absolute;
        color: #fff;
        bottom: 30upx;
        right: 0;
    }

    .swiper-item {
        width: 100%;
        height: 500rpx;
        overflow: hidden;
        text-align: center;
        display: block;
    }

    .tui-slide-image {
        height: 100%;
        width: 100%;
        // display: block;
        vertical-align: top;
        object-fit: cover;
    }

    /*内容 部分*/

    .tui-padding {
        padding: 0 32upx;
        box-sizing: border-box;
    }

    .tui-size {
        font-size: 24upx;
        line-height: 24upx;
    }

    .tui-gray {
        color: #999;
    }

    .tui-icon-red {
        color: #ff201f;
    }

    .tui-mtop {
        margin-top: 16upx;
    }

    .tui-pro-detail {
        box-sizing: border-box;
        color: #333;
    }

    .tui-product-title {
        background: #fff;
        padding: 32upx 0;
        position: relative;
    }

    .tui-pro-pricebox {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #ff201f;
        font-size: 36upx;
        font-weight: bold;
        line-height: 44upx;
    }

    .tui-pro-price {
        display: flex;
        align-items: center;
        font-size: 36rpx;
        color: #ff6600;
    }

    .tui-pro-price .tui-tag-class {
        transform: scale(0.7);
        transform-origin: center center;
        line-height: 24upx;
        font-weight: normal;
    }

    .tui-price {
        font-size: 58upx;
        font-family: 'DIN';
        // letter-spacing: 0;
        margin-left: -1rpx;
    }

    .tui-original-price {
        font-size: 26upx;
        color: #878787;
        line-height: 26upx;
        padding: 24upx 32upx 32rpx;
        box-sizing: border-box;
    }

    .tui-line-through {
        text-decoration: line-through;
    }

    .product-sales-label {
        margin: 0 8rpx 0 30rpx;
    }

    .tui-collection {
        color: #333;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        height: 44upx;
    }

    .tui-scale {
        transform: scale(0.7);
        transform-origin: center center;
        line-height: 24upx;
        font-weight: normal;
    }

    .tui-icon-collection {
        line-height: 20px !important;
        margin-bottom: 0 !important;
    }

    .tui-pro-titbox {
        font-size: 32upx;
        font-weight: 800;
        padding: 0 32upx;
        color: #252525;
        box-sizing: border-box;
    }

    .tui-pro-title {
        // padding-top: 20upx;
    }

    .tui-share-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        background: #fff;
    }

    .share-icon {
        width: 40rpx;
        height: 40rpx;
        // margin-bottom: 6rpx;
    }

    .tui-share-position {
        padding: 0;
        position: absolute;
        right: 32rpx;
        top: 32upx;
    }

    .tui-share-text {
        font-size: 20rpx;
        font-weight: 500;
        letter-spacing: 2rpx;
        color: rgba(37, 37, 37, 1);
    }

    .tui-label-info {
        display: flex;
        align-items: center;
        margin-top: 23rpx;
        letter-spacing: 2rpx;
    }

    .info-item {
        height: 38rpx;
        display: inline-block;
        padding: 0 17rpx;
        line-height: 38rpx;
        background: rgba(255, 239, 229, 1);
        border-radius: 4rpx;
        color: #ff6600;
        font-size: 22rpx;
        font-weight: bold;
        margin-right: 16rpx;
    }

    .tui-discount-box {
        background: #fff;
    }

    .tui-list-cell {
        position: relative;
        display: flex;
        align-items: center;
        font-size: 26upx;
        line-height: 26upx;
        padding: 36upx 30upx;
        box-sizing: border-box;
    }

    .tui-right {
        position: absolute;
        right: 30upx;
        top: 30upx;
    }

    .tui-top40 {
        top: 40upx !important;
    }

    .tui-bold {
        font-weight: bold;
    }

    .tui-list-cell::after {
        content: '';
        position: absolute;
        border-bottom: 1upx solid #eaeef1;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
        bottom: 0;
        right: 0;
        left: 126upx;
    }

    .tui-last::after {
        border-bottom: 0 !important;
    }

    .tui-tag-coupon-box {
        display: flex;
        align-items: center;
        /*  flex: 1;
    flex-wrap: wrap; */
    }

    .coupon-item {
        height: 36rpx;
        line-height: 36rpx;
        display: inline-block;
        padding: 0 12rpx;
        background: rgba(255, 102, 0, 1);
        margin: 0 16rpx 0 0;
        font-size: 24rpx;
        color: #fff;
        font-weight: 500;
    }

    .tui-tag-coupon-box .tui-tag-class {
        margin-right: 20upx;
    }

    .tui-cell-title {
        width: 66upx;
        padding-right: 30upx;
        flex-shrink: 0;
        font-size: 28rpx;
        color: #252525;
        font-weight: 800;
    }

    .tui-promotion-box {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 10upx 0;
        width: 74%;
        color: #252525;
        font-weight: 500;
        font-size: 26rpx;
    }

    .promotion-item {
        height: 28rpx;
        display: inline-block;
        padding: 0 12rpx;
        line-height: 28rpx;
        background: rgba(255, 239, 229, 1);
        border: 1px solid rgba(255, 102, 0, 1);
        font-size: 22rpx;
        font-weight: 500;
        color: rgba(255, 102, 0, 1);
        margin-right: 14rpx;
    }

    .tui-promotion-box .tui-tag-class {
        display: inline-block !important;
        transform: scale(0.8);
        transform-origin: 0 center;
    }

    .tui-basic-info {
        background: #fff;
    }

    .tui-addr-box {
        width: 76%;
    }

    .tui-addr-item {
        // padding: 10upx;
        line-height: 34upx;
    }

    .tui-guarantee {
        background: #fdfdfd;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: 14upx 50rpx 24upx;
        box-sizing: border-box;
        font-size: 24upx;
        color: #878787;
    }

    .tui-guarantee-item {
        color: #878787;
        // margin-left: 50upx;
        padding-top: 10upx;
        font-size: 24rpx;
    }

    .tui-guarantee-item:nth-child(1) {
        margin-left: 0;
    }

    .tui-guarantee-item text {
        margin-left: 6rpx;
    }

    .tui-pl {
        padding-left: 4upx;
    }

    .tui-cmt-box {
        background: #fff;
    }

    .tui-between {
        justify-content: space-between !important;
    }

    .tui-cmt-all {
        color: #ff201f;
        padding-right: 8upx;
    }

    .tui-cmt-content {
        font-size: 26upx;
    }

    .tui-cmt-user {
        display: flex;
        align-items: center;
    }

    .tui-acatar {
        width: 60upx;
        height: 60upx;
        border-radius: 30upx;
        display: block;
        margin-right: 16upx;
    }

    .tui-cmt {
        padding: 14upx 0;
    }

    .tui-attr {
        font-size: 24upx;
        color: #999;
        padding: 6upx 0;
    }

    .tui-cmt-btn {
        padding: 50upx 0 30upx 0;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .tui-tag-cmt {
        min-width: 130upx;
        padding: 20upx 52upx !important;
        font-size: 26upx !important;
        display: inline-block;
    }

    .detail-tab {
        width: 100%;
        height: 92rpx;
        line-height: 92rpx;
        background: rgba(255, 255, 255, 1);
        display: flex;
        align-items: center;
        margin-top: 16rpx;
        position: sticky;
        top: 64px;
        z-index: 10;
    }

    .tab-text {
        flex: 1;
        text-align: center;
        font-size: 28rpx;
        font-weight: 500;
        color: #565656;
        position: relative;

        &.active {
            color: #10bbb8;
        }

        &:after {
            content: '';
            position: absolute;
            width: 1rpx;
            height: 28rpx;
            background: rgba(215, 216, 217, 1);
            top: 50%;
            margin-top: -14rpx;
            right: 0;
        }
    }

    .tab-text:last-child::after {
        display: none;
    }

    .tui-nomore-box {
        padding-top: 10upx;
    }

    .tui-product-img {
        transform: translateZ(0);
    }

    .tui-product-img image {
        width: 100%;
        display: block;
    }

    /*底部操作栏*/

    .tui-col-7 {
        width: 58.33333333%;
    }

    .tui-col-5 {
        width: 41.66666667%;
    }

    .body {
        width: 100%;
        // height: calc(100vh - 100rpx);
        overflow-y: auto;
        flex: 1;
    }

    .tui-operation {
        width: 100%;
        height: 100upx;
        /* box-sizing: border-box; */
        background: #fff;
        box-shadow: 0 0 6upx 0 rgba(0, 0, 0, 0.14);
        // position: fixed;
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
        padding: 0;
        line-height: 20rpx;
        background: #fff;
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

    /*底部选择弹层*/

    .tui-popup-class {
        border-top-left-radius: 24upx;
        border-top-right-radius: 24upx;
        padding-bottom: env(safe-area-inset-bottom);
    }

    /*分享弹窗*/
    .share-box {
        display: flex;
        // height: 430rpx;
        padding: 48rpx 0;
        box-sizing: border-box;
        // justify-content: space-between;
        flex-wrap: wrap;
    }

    .share-item {
        min-width: 25%;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        // margin-left: 43rpx;
        margin-bottom: 48rpx;
        background: #FFFFFF;
        overflow: visible;

        image {
            width: 96rpx;
            height: 96rpx;
        }

        text {
            font-size: 24rpx;
            line-height: 24rpx;
            font-weight: bold;
            color: rgba(37, 37, 37, 1);
            margin-top: 24rpx;
        }
    }

    /*优惠券 底部选择弹层*/
    .popup-title-box {
        line-height: 100rpx;
        height: 100rpx;
        text-align: center;
        color: #252525;
        font-size: 32rpx;
        font-weight: bold;
        border-bottom: 1px solid #d7d8d9;
    }

    .coupon-box {
        display: flex;
        align-items: center;
        width: 100%;
        height: 200rpx;
        background: rgba(244, 244, 244, 1);
        border-radius: 10rpx 0 0 10rpx;
        margin-bottom: 16rpx;
    }

    /*优惠活动  底部选择碳层*/
    .promotion-box {
        width: 100%;
        display: flex;
        align-items: center;
        margin-bottom: 48rpx;

        .promotion-tag {
            height: 28rpx;
            display: inline-block;
            padding: 0 12rpx;
            line-height: 28rpx;
            background: rgba(255, 239, 229, 1);
            border: 1px solid rgba(255, 102, 0, 1);
            font-size: 22rpx;
            font-weight: 500;
            color: rgba(255, 102, 0, 1);
            margin-right: 14rpx;
        }

        .promotion-icon {
            margin-left: 16rpx;
        }

        .promotion-text {
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            padding: 10upx 0;
            // width: 80%;
            color: #252525;
            font-weight: 500;
            font-size: 26rpx;
        }
    }

    .promotion-notice {
        font-size: 26rpx;
        font-weight: 500;
        color: #b8b8b8;
    }

    /*商品详情 底部选择弹层*/
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
        line-height: 64rpx !important;
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
        // border-bottom: 1px solid #d7d8d9;
    }

    /*底部选择弹层*/
</style>
