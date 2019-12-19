<template>
    <view>
        <!-- <view class="coupon-view" :class="item.state == 2 ? 'coupon-view-red' : (item.state == 3 || item.state == 4 ? 'coupon-view-gray' : '')"> -->
        <view class="coupon-view"
            v-for="(item, index) in couponList"
            :key='index'
            :class="item.receiveStatus ? 'coupon-view-red' : 'coupon-view-gray'"
        >
            <view class="coupon-item">
                <view class="coupon-wave-left" :class="[item.type == 'COUPON_TYPE_ZK' ? 'hot': '']">
                    <view class="price" v-if="item.type == 'COUPON_TYPE_ZK'">
                        {{item.amount / 10}}
                        <text class="discount">折</text>
                    </view>
                    <view class="price" v-else>
                        {{item.amount / 100}}
                        <text class="discount">元</text>
                    </view>
                    <view class="condition">满{{item.denomination / 100}}可用</view>
                </view>

                <view class="coupon-wave-right">
                    <view class="headline">{{item.name}}</view>
                    <view class="employ-warp ">
                        <view class="data">{{item.startGetDateStr}}-{{item.endGetDateStr}}</view>
                        <view class="but"
                         :class="item.receiveStatus ? '' : 'hot'"
                         @tap="handleGetOne(item.id, item.receiveStatus)"
                         >{{item.receiveStatus ? '立即领取' : '已领取'}}</view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        name: "coupon",
        props: {
            couponList: {
                type: Array
            }
        },
        data() {
            return {
                // couponList: [
                //     {
                //         name: '优惠券名称',
                //         type: 'COUPON_TYPE_DJ', // COUPON_TYPE_DJ:代金券 COUPON_TYPE_ZK：折扣券
                //         denomination: '200', // 满多少可用-0等于无限制
                //         amount: '500', // 优惠金额/折扣
                //         receiveStatus: true, // 是否可领取
                //     }
                // ]
            }
        },
        methods: {
            handleGetOne(e, status){
                if(status){
                   this.$emit('handleGetOne', e) 
                }
                
            }
        }
    }
</script>

<style lang="scss">
    .coupon-view {
        position: relative;
        padding: 0 32rpx;
        margin: 0;
    }

    .coupon-item {
        height: 200rpx;
        background: #F4F4F4;
        border-radius: 10rpx 0px 0px 10rpx;
        overflow: hidden;
        position: relative;
        width: 100%;
        padding: 0;
        margin:0 0 16rpx 0;
    }

    .coupon-wave-left {
        position: absolute;
        left: 0;
        top: 0;
        width: 220rpx;
        height: 200rpx;
        // background: linear-gradient(135deg, rgba(252, 159, 0, 1) 0%, rgba(255, 119, 0, 1) 100%);
        background:linear-gradient(135deg,rgba(252,159,0,1) 0%,rgba(255,119,0,1) 100%);
        border-radius: 10rpx 0px 0px 10rpx;
        display:flex;
        flex-direction: column;
        align-items:center;
        justify-content: center;
        &.hot{
           background:linear-gradient(135deg,rgba(255,129,83,1) 0%,rgba(255,83,81,1) 100%);
        }
        &:before {
            content: '';
            position: absolute;
            top: 0;
            height: 100%;
            width: 13px;
            background-image: radial-gradient(#F4F4F4 0, #F4F4F4 4px, transparent 4px);
            background-size: 13px 13px;
            background-position: 0 2px;
            background-repeat: repeat-y;
            z-index: 1;
            right: -7px;
        }

        .price {
            font-size: 80rpx;
            font-weight: bold;
            color: #ffffff;
            font-family: 'DIN';
            text-align: center;
            line-height: 1;

            .discount {
                font-size: 32rpx;
            }
        }

        .condition {
            margin-top: 10rpx;
            font-size: 24rpx;
            font-weight: 500;
            text-align: center;
            color: #FFFFFF;
        }
    }

    .coupon-wave-right {

        padding-left: 250rpx;
        padding-right: 32rpx;

        .headline {
            margin-top: 50rpx;
            line-height: 1;
            font-size: 32rpx;
            font-weight: bold;
            color: #252525;
        }

        .employ-warp {
            margin-top: 30rpx;
            height: 48rpx;
            line-height: 48rpx;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .data {
                font-size: 22rpx;
                color: #878787;
                font-family: 'DIN';
                font-weight: 400;
            }

            .but {
                display: inline-block;
                font-size: 26rpx;
                height: 48rpx;
                line-height: 48rpx;
                padding: 0 15rpx;
                background-color: #10BBB8;
                color: #FFFFFF;
                border-radius: 8rpx;
                &.hot{
                    background: #B8B8B8;
                    color: #fff;
                }
            }
        }

    }

    .coupon-wave-img {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 114rpx;
        height: 114rpx;
    }

    .coupon-view-red {
        // .coupon-wave-left {
        //     background: linear-gradient(135deg, rgba(255, 129, 83, 1) 0%, rgba(255, 83, 81, 1) 100%);
        // }
    }

    .coupon-view-gray {
        .coupon-wave-left {
            background: rgba(194, 198, 204, 1);
        }
    }
</style>
