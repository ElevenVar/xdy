<template>
    <view class="faq page">
        <view class="big-title">订单问题：</view>
        <view class="small-title">1.下单后可以取消订单吗？</view>
        <view class="content">
               用户购物操作后，请及时关注订单状态，如若订单未确认，未付款前，可操作取消订单/删除订单；已确认，已付款的商品如需取消或退货，无法操作，需联系商家进行沟通，或收到商品后点击售后申请进行相关操作。
            所以，温馨提醒各用户下单前务必确认订单，避免操作过程造成的沟通困扰！
        </view>
    </view>
</template>

<script>
export default {
    methods: {
        detail() {}
    }
};
</script>

<style lang="scss">
.faq {
    padding: 32rpx;
    box-sizing: border-box;
    background: #fff;
    min-height: 100vh;
    .big-title{
        font-size:32rpx;
        font-weight:bold;
        color:rgba(37,37,37,1);
        margin: 32rpx 0 34rpx;
    }
    .small-title{
        font-size:28rpx;
        font-weight:bold;
        color:rgba(37,37,37,1);
        margin-bottom: 16rpx;
    }
    .content{
        font-size:28rpx;
        font-weight:500;
        color:#565656;
        margin-bottom: 32rpx;
        text-align: left;
    }
}
</style>
