<template>
    <view class="null-box">
        <image :src="tips.image" mode="" :style="{marginTop: tips.top + 'rpx'}"></image>
        <text>{{tips.text}}</text>
    </view>
</template>

<script>
    // 数据为空的组件
    export default{
        props:{
            tips: {
                type: Object,
                default: function (){
                    return {
                        image: '/static/image/coupon/no-coupon.png',
                        text: '暂无数据',
                        top: 0 // 距离顶部的距离
                    }
                }
            }
            
        },
        data(){
            const imgUrl = this.$config.imgUrl;
            return {
            	imgUrl : imgUrl,
                
            }
        }
    }
</script>

<style lang="scss">
    .null-box{
        text-align:center;
        image{
            width:198rpx;
            height:198rpx;
            display: block;
            margin: 0 auto 30rpx;
        }
        text{
            font-size:28rpx;
            line-height: 28rpx;
            font-weight:500;
            color:rgba(86,86,86,1);
        }
    }
</style>
