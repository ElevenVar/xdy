<template>
    <view class="container" v-show="isShow">
        <!-- S 主体 -->
        <view class="confirm-order-body">
            <!-- 商品信息 -->
            <view class="commodity-view">
                <view class="commodity-view-title">商品及服务信息</view>
                <view class="commodity-view-list" v-for="(item, index) in shopCartList" :key="index">
                    <view class="commodity-information">
                        <image class="img" :src="item.skuImgs"></image>
                        <view class="info">
                            <view class="name-num dgg-cl">
                                <view class="name dgg-fl">{{ item.comName }} 成都</view>
                                <view class="num dgg-fr">x{{ item.shopSkuNumber }}</view>
                            </view>
                            <view class="area">{{ item.skuPropertyVname }}</view>
                            <view class="price">
                                <text class="symbol">￥</text>
                                {{ item.skuSellingPrice | price }}
                                <text class="decimals"></text>
                            </view>
                            <!-- <view class="tag" v-if="item.shopGetskuId">
								<view 
									class="tag-item" 
									v-for="(item,index) in 3"
									:key="index">
									满赠
								</view>
							</view> -->
                        </view>
                    </view>

                    <!-- <view class="appreciation" v-if="index == 0">
						<view 
							class="appreciation-list dgg-cl"
							v-for="(item,index) in 1"
							:key="index">
							<view class="appreciation-list-left dgg-fl"><text class="tip">【增值服务】</text>升级为三星服务顾问</view>
							<view class="appreciation-list-right dgg-fr">¥720/年 x1</view>
						</view>
					</view> -->
                </view>

                <view class="commodity-view-remark">
                    备注留言
                    <input v-model="params.remark" maxlength="100" class="text" type="text" placeholder="建议留言前先与商家进行沟通"
                        value="" />
                </view>

                <view class="commodity-view-total">
                    <view class="list">
                        共
                        <text class="num">{{ totalNum }}</text>
                        件商品
                        <!-- ，<text class="num">2</text>增值服务，促销优惠：<text class="price">¥22310.00</text></text> -->
                    </view>
                    <view class="list">
                        小计：
                        <text class="price">¥{{ settleData.waitPayMoney | price }}</text>
                    </view>
                </view>
            </view>

            <view class="coupon-view dgg-cl remmed" style="margin-bottom: 0;">
                <view class="coupon-view-left dgg-fl">推荐人编码</view>
                <view class="coupon-view-right dgg-fr">
                    <input v-model="params.loginName" maxlength="10" class="text" style="text-align: right;width: 400rpx;"
                        type="text" placeholder="该数据很重要，请如实填写" value="" />
                </view>
            </view>
            <!-- 优惠券 -->
            <view class="coupon-view dgg-cl" @tap="popupShow()">
                <view class="coupon-view-left dgg-fl">优惠券</view>
                <view class="coupon-view-right dgg-fr">
                    优惠：
                    <text class="price">{{ popupActivePrice }}</text>
                </view>
            </view>
            <!-- 清单 -->
            <view class="detailed-list-view">
                <view class="detailed-list-list dgg-cl">
                    <view class="detailed-list-list-left dgg-fl">商品及服务总数</view>
                    <view class="detailed-list-list-right dgg-fr">{{ totalNum }}件</view>
                </view>
                <view class="detailed-list-list dgg-cl">
                    <view class="detailed-list-list-left dgg-fl">商品金额</view>
                    <view class="detailed-list-list-right dgg-fr">¥{{ waitPayMoney | price }}</view>
                </view>
                <!-- <view class="detailed-list-list dgg-cl">
					<view class="detailed-list-list-left dgg-fl">促销优惠</view>
					<view class="detailed-list-list-right dgg-fr">- ¥{{ settleData.yhMoney }}0</view>
				</view> -->
                <view class="detailed-list-list dgg-cl">
                    <view class="detailed-list-list-left dgg-fl">优惠金额</view>
                    <view class="detailed-list-list-right dgg-fr">¥ -{{ settleData.yhMoney | price }}</view>
                </view>
            </view>
        </view>
        <!-- E 主体 -->

        <!-- S 底部 -->
        <view class="confirm-order-footer">
            <view class="footer-warp">
                <view class="total">
                    <text class="zp-text">待付款金额： </text><div class="int"><text class="symbol">¥</text> {{ ((prices(settleData.waitPayMoney) - prices(settleData.yhMoney))*100) | price}}</div>
                </view>
                <button class="but-submit" @tap="submitOrder">提交订单</button>
            </view>
        </view>
        <!-- E 底部 -->
        <!-- 页面领取优惠卷弹框 -->
        <tui-bottom-popup :show="skuPopupShow" @close="hidePopup">
            <view class="coupon-wrap">
                <view class="tui-icon tui-icon-close-fill tui-icon-close" style="color: #999;font-size:20px" @tap="hidePopup"></view>
                <view class="coupon-title">
                    <view class="coupon-title-info">选择优惠卷</view>
                    <view class="coupon-title-dsec" @tap.stop="showPopupDescs">
                        <image :src="imgUrl+'order/desc-icon.png'" mode=""></image>使用说明
                    </view>
                </view>
                <view class="coupon-tab">
                    <view :class="popupIndex == 0 ? 'active' : ''" @tap="changeCoupon(0)">可用优惠卷</view>
                    <view :class="popupIndex == 1 ? 'active' : ''" @tap="changeCoupon(1)">不可用优惠卷</view>
                </view>
                <view class="coupon-content">
                    <!-- <coupons :couponList="availableList" v-if="availableList.length > 0"></coupons> -->
                    <view class="company-ul" v-if="popupList.length > 0">
                        <block v-for="(row, index) in popupList" :key="index">
                            <view class="coupon-view" :class="popupIndex == 1 ? 'coupon-view-gray' : row.coupon.type === 'COUPON_TYPE_ZK' ? 'coupon-view-red' : ''">
                                <view class="coupon-item">
                                    <view class="coupon-wave-left">
                                        <view class="price" v-if="row.coupon.type === 'COUPON_TYPE_ZK'">
                                            {{ row.coupon.amount / 10 }}
                                            <text class="discount">折</text>
                                        </view>
                                        <view class="price" v-else>
                                            {{ row.coupon.amount / 100 }}
                                            <text class="discount">元</text>
                                        </view>
                                        <view class="condition" v-if="row.coupon.denomination != 0">满{{ row.coupon.denomination / 100 }}元可用</view>
                                        <view class="condition" v-else>无限制</view>
                                    </view>

                                    <view class="coupon-wave-right">
                                        <view class="headline" :style="{ color: popupIndex == 1 ? '#878787' : '' }">
                                            {{popupIndex == 1 ? row.dsec : row.coupon.productType == 0 ? '全部商品通用' : '限部分商品可用' }}
                                        </view>
                                        <view class="employ-warp dgg-cl">
                                            <view class="data dgg-fl">
                                                {{ row.item.sTime.split(' ')[0].replace(/-/g, '.') }}-{{ row.item.eTime.split(' ')[0].replace(/-/g, '.') }}
                                            </view>
                                            <!-- 立即使用 -->
                                            <label class="but dgg-fr checkbox" v-if="popupIndex == 0" @tap.stop="handleDetail(row, index)"
                                                :class="popupActiveIndex == index + 1 ? 'isChecked' : ''">
                                                <checkbox :checked="row.select" />
                                            </label>
                                        </view>
                                    </view>

                                    <image class="coupon-wave-img" v-if="row.item.status == 1" :src="imgUrl + 'coupon/use.png'"></image>

                                    <image class="coupon-wave-img" v-if="row.item.status == 3" :src="imgUrl + 'coupon/past.png'"></image>
                                </view>
                            </view>
                        </block>
                    </view>
                    <button class="yesCoupons" v-if="popupList.length > 0" @tap="hidePopup">确认选择</button>
                    <!-- 无券 -->
                    <view class="no-coupon" v-else>
                        <image class="no-coupon-img" :src="imgUrl + 'coupon/no-coupon.png'"></image>
                        <view class="no-coupon-text">暂无优惠券</view>
                    </view>
                </view>
            </view>
        </tui-bottom-popup>
        <tui-modal :show="showPopupDesc" @cancel="hidePopupDesc" :custom="true">
            <view class="popup-desc-wrap">
                <view class="popup-desc-title">优惠券使用说明</view>
                <view class="popup-desc-info-wrap">
                    <view class="popup-desc-info">1、同一个商品或服务只能使用一次优惠券；</view>
                    <view class="popup-desc-info">2、优惠券未到使用日期或已经过期不可再使用；</view>
                    <view class="popup-desc-info">3、满减优惠券所购商品必须满足相应金额后方可使用；</view>
                    <view class="popup-desc-info">4、优惠券金额大于订单应付金额时，差额不予退还；</view>
                </view>
                <div class="zp-popup-desc-btn" @click="hidePopupDesc">知道了</div>
            </view>
        </tui-modal>
    </view>
</template>

<script>
    import {
        order,
        coupon
    } from '@/api/index.js';
    import mixinsShop from '@/common/mixins/shop.js';
    import coupons from '@/components/coupon/coupon.vue';
    import tuiModal from '@/components/modal/modal';
    import tuiBottomPopup from '@/components/bottom-popup/bottom-popup';
    export default {
        name: 'confirmOrderPage',
        mixins: [mixinsShop],
        components: {
            coupons,
            tuiBottomPopup,
            tuiModal
        },
        data() {
            return {
                imgUrl: this.$config.imgUrl,
                shopCartList: [], //订单列表
                settleData: {}, // 订单统计信息
                cartCount: 0, // 订单商品数量
                waitPayMoney: 0,
                isShow: false,
                params: {
                    // 提交订单参数
                    sourceType: '', // 订单来源 0:购物车 1:立即购买
                    shopIds: '', // 购物车唯一ID(1,2,3)
                    areaCode: 'COMPANY_CD', // 地区编号
                    orderSourceApp: 'WECHAT', //订单来源 小程序 标识为3
                    remark: '', // 订单备注
                    couponNo: '', // 使用优惠卷id
                    loginName: '' // 商务登录工号
                },
                popupIndex: 0,
                popupActiveIndex: '',
                popupActivePrice: '0.00',
                preferentialPrice: '0.00',
                skuPopupShow: false,
                from: {
                    page: 1,
                    status: 0
                },
                popupList: [],
                availableList: [],
                unavailableList: [],
                showPopupDesc: false,
                couponParams: {}
            };
        },
        onLoad(options) {
            console.log(options)
            // console.log(typeof options.shopIds);
            this.params.shopIds = options.shopIds;
            this.couponParams = options
            this.params.sourceType = options.sourceType;
            this.getOrderList(options);
            this.getCouponList();
        },
        methods: {
            // 获取订单列表
            getOrderList(options) {
                uni.showLoading({
                    title: '加载中..'
                });
                // if(options.sourceType == 2)
                this.$http.get(order.settle_commodity_list_xcx, options).then(res => {
                    if (res.code == 200) {
                        this.isShow = true;
                        this.shopCartList = res.data.shopCartList;
                        this.settleData = res.data.settleData;
                        this.cartCount = res.data.cartCount;
                        this.waitPayMoney = res.data.settleData.waitPayMoney;
                        this.preferentialPrice = res.data.settleData.yhMoney;
                        this.$forceUpdate();
                    }
                    uni.hideLoading();
                });
            },
            changeCoupon(index) {
                this.popupIndex = index;
                index == 0 ? (this.popupList = this.availableList) : (this.popupList = this.nuavailableList);
            },
            // 获取优惠卷列表
            getCouponList() {
                this.$http.get(coupon.couponList, this.from).then(res => {
                    if (res.code == 200) {
                        res.data.forEach(item => {
                            item.select = false;
                        });

                        function replaceStr(str) {
                            return str.replace(/\-/g, '/')
                        }
                        let nowTime = new Date().getTime();
                        // 获取不可使用优惠卷
                        let nuavailableList = [],
                            availableList = [];
                        res.data.map(item => {
                            if (item.coupon.plat.indexOf('COUPON_PLAT_1') == -1) {
                                item.dsec = '只限pc端使用'
                                nuavailableList.push(item);
                            } else if (item.coupon.type == 'COUPON_TYPE_DJ' && item.coupon.denomination *
                                1 != 0 ? this.settleData.waitPayMoney * 1 < item.coupon.denomination /
                                100 : '') {
                                item.dsec = '金额不满' + item.coupon.denomination / 100
                                nuavailableList.push(item);
                                // } else if (new Date(replaceStr(item.item.sTime)).getTime() > nowTime) {
                                // 	item.dsec = '未到使用时间'
                                // 	nuavailableList.push(item);
                                // } else if(new Date(replaceStr(item.item.eTime)).getTime() < nowTime){
                                // 	item.dsec = '已过期'
                                // 	nuavailableList.push(item);
                            } else if (item.outTime) {
                                item.dsec = '已过期'
                                nuavailableList.push(item)
                            } else if (item.item.status == 1) {
                                item.dsec = '已使用'
                                nuavailableList.push(item);
                            } else if (item.coupon.productType == 1) {
                                // item.coupon.types.findIndex(item1 => {
                                // 	console.log(item1)
                                // 	 console.log(this.couponParams.comCateIdThree,'------', item1.level1, item1.name)
                                // })
                                if (item.coupon.types.findIndex(item1 => this.couponParams.comCateIdThree
                                        .indexOf(item1.level1) != -1) == -1) {
                                    item.dsec = '该商品不可用'
                                    nuavailableList.push(item);
                                } else {
                                    availableList.push(item)
                                }
                            } else if (item.coupon.productType == 2) {
                                // item.coupon.types.findIndex(item1 => 
                                //  console.log(this.couponParams.comId, '2222222',  item1.no,item1.name)
                                //  )
                                if (item.coupon.types.findIndex(item1 => this.couponParams.comId.indexOf(
                                        item1.no) != -1) == -1) {
                                    item.dsec = '该商品不可用'
                                    nuavailableList.push(item);
                                } else {
                                    availableList.push(item)
                                }
                            } else {
                                availableList.push(item)
                            }
                        });
                        this.availableList = availableList
                        this.nuavailableList = nuavailableList
                        this.popupList = availableList;
                    } else {
                        uni.showToast({
                            title: res.message,
                            icon: 'none',
                            duration: 2000
                        });
                    }
                });
            },
            // 选择使用的优惠卷
            handleDetail(item, index) {
                if (this.popupActiveIndex != index + 1) {
                    this.params.couponNo = item.item.no;
                    if (item.coupon.type == 'COUPON_TYPE_DJ') {
                        this.popupActivePrice = '￥ ' + item.coupon.amount / 100;
                        if (this.waitPayMoney * 1 - item.coupon.amount >= 0) {
                            this.popupActiveIndex = index + 1;
                            this.settleData.yhMoney = item.coupon.amount;
                        } else {
                            uni.showToast({
                                title: '优惠金额不得大于支付金额',
                                icon: 'none'
                            });
                        }
                    } else {
                        this.popupActiveIndex = index + 1;
                        this.popupActivePrice = item.coupon.amount / 10 + '折';
                        this.settleData.yhMoney = this.prices((this.waitPayMoney * (100 - item.coupon.amount)));
                        console.log(this.settleData.yhMoney)
                    }
                } else {
                    this.popupActiveIndex = '';
                    this.params.couponNo = '';
                    this.params.couponNo = '0.00';
                    this.popupActivePrice = '0.00';
                    this.settleData.waitPayMoney = this.waitPayMoney;
                    this.settleData.yhMoney = this.preferentialPrice;
                }
            },

            prices(str) {
                if (str % 100 == 0) {
                    return String(str / 100) + '.00'
                } else if (str % 10 == 0) {
                    return String(str / 100) + '0'
                } else {
                    let num = String((str / 100).toFixed(3))
                    return num.substr(0, num.length - 1)
                }
            },
            // 创建订单
            submitOrder() {
                uni.showLoading({
                    title: '提交订单中',
                    mask: true
                });
                if (this.params.sourceType == 1) {
                    this.params.shopIds = this.shopCartList[0].shopId;
                }
                this.$http.post(order.createOrder, this.params).then(res => {
                    uni.hideLoading();
                    if (res.code == 200) {
						let price = this.prices(this.settleData.waitPayMoney - this.settleData.yhMoney)
                        uni.redirectTo({
                            url: `/pages/order/submitOrder/submitOrder?orderIds=${JSON.stringify(res.data)}&actualPrice=${ price }`
                        });
                    } else {
                        uni.showToast({
                            title: res.msg,
                            icon: 'none'
                        });
                    }
                });
            },
            // 关闭优惠卷弹框
            hidePopup() {
                this.skuPopupShow = false;
            },
            // 打开优惠卷弹框
            popupShow() {
                this.skuPopupShow = true;
            },
            hidePopupDesc() {
                this.showPopupDesc = false;
            },
            showPopupDescs() {
                this.showPopupDesc = true;
            }
        },
        computed: {
            // 计算商品总价
            totalPrice() {
                return this.shopCartList.reduce((all, item) => {
                    return all + item.skuSellingPrice * 1;
                }, 0);
            },
            // 计算商品总数
            totalNum() {
                return this.shopCartList.reduce((all, item) => {
                    return all + item.shopSkuNumber;
                }, 0);
            }
        }
    };
</script>

<style lang="scss">
    @import '../../../static/style/icon.css';
    @import './confirmOrder.scss';
    .zp-popup-desc-btn{
        width:300rpx;
        height:64rpx;
        background:rgba(16,187,184,1);
        border-radius:8rpx;
        font-size: 28rpx;
        text-align: center;
        line-height: 64rpx;
        margin: 28rpx auto;
        color: #FFFFFF;
    }
</style>
