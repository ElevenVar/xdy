<template>
    <view class="setResult">
        <view class="setPhoneBox">
            <image :src="tips.img" mode="" class="img"></image>
            <view class="text">{{tips.desc}}</view>
            <view class="back-btn" @click="handleBack">返回</view>
        </view>
    </view>
</template>

<script>
    export default{
        data(){
            const imgUrl = this.$config.imgUrl;
            return {
            	imgUrl : imgUrl,
                tips: {
                    img: imgUrl + 'index/s-pass.png',
                    desc: '手机绑定成功'
                }
            }
        },
        methods:{
            handleBack(){
                uni.reLaunch({
                    url:'/pages/my/index/index'
                })
            }
        },
        onLoad(e){
            if (e.type=='setPhone'){
                 uni.setNavigationBarTitle({
                    title: '手机绑定成功'
                });
                this.tips= {
                    img: this.imgUrl + 'index/s-phone.png',
                    desc: '手机绑定成功'
                }
            } else if (e.type=='setPass'){
                 uni.setNavigationBarTitle({
                    title: '登录密码修改成功'
                });
                this.tips= {
                    img: this.imgUrl + 'index/s-pass.png',
                    desc: '登录密码修改成功'
                }
            } else if (e.type=='payway'){
                 uni.setNavigationBarTitle({
                    title: '支付密码设置成功'
                });
                this.tips= {
                    img: this.imgUrl + 'index/s-pass.png',
                    desc: '支付密码设置成功'
                }
            }
           
        }
    }
</script>

<style lang="scss">
    .setPhoneBox{
        width:100%;
        display:flex;
        align-items:center;
        flex-direction:column;
        margin-top:75rpx;
        .text{
            text-align: center;
            font-size:32rpx;
            font-family:PingFang SC;
            font-weight:bold;
            color:rgba(37,37,37,1);
        }
        .img{
            width: 202rpx;
            height: 202rpx;
            display: block;
            margin: 30rpx 0;
        }
        .back-btn{
            width:280rpx;
            height:76rpx;
            margin: 60rpx auto 0;
            line-height: 76rpx;
            background:rgba(255,255,255,1);
            border:1px solid rgba(16,187,184,1);
            border-radius:8rpx;
            font-size:28rpx;
            text-align: center;
            font-family:PingFang SC;
            font-weight:500;
            color:rgba(0,0,0,1);
            
        }
    }
</style>
