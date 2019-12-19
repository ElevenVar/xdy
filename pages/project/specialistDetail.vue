<template>
    <view class="specialistDetail">
        <!--header-->
        <view class="tui-header-box" :style="{ height: height + 'px', background: 'rgba(0,0,0,' + opcity + ')'  }">
            <view class="tui-header" :style="{ paddingTop: top + 'px' }">
                <text class="tui-header-text" :style="{ color: '#fff' }"
                    >专家主页</text>
            </view>
            <view class="tui-header-icon" :style="{ marginTop: top + 'px' }">
                <tui-icon name="arrowleft" color="#fff" @tap="back"></tui-icon>
            </view>
        </view>
        <!--header end-->
        <view class="top">
            <view class="top-info" style="background: url('https://tguaguastatic.dgg.net/src/images/default/dggCloudImage/expert_main_background.png') center/cover no-repeat">
                <image :src="item.headshot_url"></image>
                <view class="top-content">
                    <view class="top-info-name">{{ item.expert_name }}</view>
                    <view class="top-info-address">地区：{{ item.area_city }}</view>
                    <view class="top-info-expert">{{ item.expert_tag }}</view>
                </view>

                <view class="top-year">
                    <view class="top-year-item">
                        <view class="top-year-item-color">
                            <span>{{ item.expire_date }}</span>
                            年
                        </view>
                        <view class="top-year-item-desc">{{ item.expert_domain }}</view>
                    </view>
                    <view class="top-year-line"></view>
                    <view class="top-year-item">
                        <view class="top-year-item-color">
                            <span>{{ item.service_times }}</span>
                        </view>
                        <view class="top-year-item-desc">已提供解决方案</view>
                    </view>
                </view>
            </view>
        </view>
        <view class="middle">
            <view class="field">
                <view class="field-top">
                    <view></view>
                    擅长领域
                </view>
                <view class="field-bottom">
                    <view class="field-bottom-item" v-for="(items, index) in item.skill_tag" :key="index">{{ items }}</view>
                </view>
            </view>

            <view class="field " style="margin-top:32rpx;height:auto;">
                <view class="field-top">
                    <view></view>
                    个人简介
                </view>
                <view class="intro"><rich-text :nodes="item.profile_content"></rich-text></view>
            </view>

            <view class="field " style="margin-top:32rpx;height:auto;margin-bottom:140rpx">
                <view class="field-top">
                    <view></view>
                    拥有证书
                </view>
                <view class="certificate">
                    <view class="certificate-item" v-for="(value, index) in item.credentia_list" :key="index">
                        <view class="img-box">
                            <image :src="value.credentiaImageUrl"></image>
                        </view>
                        <text>{{ value.expertCredentiaName }}</text>
                    </view>
                </view>
            </view>
        </view>
        <view class="bottom" @click="expertAction">预约专家</view>
        <view class="fixed-phone" @tap="phoneCallAction"><image :src="imageBaseURL + 'order_icon_customer.png'"></image></view>
    </view>
</template>

<script>
import tuiIcon from '@/components/icon/icon';
import {accountSet} from '@/api/index.js'
export default {
    components: {
        tuiIcon
    },
    data() {
        return {
            top: 0, //标题图标距离顶部距离
            height: 64, //header高度
            opcity: 0,
            imageBaseURL: 'https://tguaguastatic.dgg.net/src/images/default/dggCloudImage/',
            item: { 
            }
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
                this.top = obj.top ? obj.top + (obj.height - 32) / 2 : res.statusBarHeight + 6;
                this.scrollH = res.windowWidth;
            }
        });
        this.getData(options.id)
    },
    methods: {
        back() {
            uni.navigateBack();
        },
        // 初始化数据
        getData(id){
            this.$http.get(accountSet.getExpertDetail, {id}).then(res => {
                if (res.code == 200) {
                    this.item = res.data
                    // this.speciaList = res.data.expert_list.records
                } else{
                    uni.showToast({
                        icon:'none',
                        title:res.message
                    })
                }
            })
        },
      // 预约专家
      expertAction(e){
          let obj = {
              name: this.item.expert_name,
              tag: this.item.expert_tag,
              date: this.item.expert_domain + this.item.expire_date
          }
         uni.setStorageSync('expertMsg', obj)
         uni.navigateTo({
             url:'/pages/project/makeSpecialist'
         }) 
      },
      // 电话
      phoneCallAction (){
          uni.makePhoneCall({
            phoneNumber: this.$store.state.serverTel
          })
      }
    },
    onPageScroll(e) {
        let scroll = e.scrollTop <= 0 ? 0 : e.scrollTop;
        let opcity = scroll / 60;
        if (this.opcity >= 1 && opcity >= 1) {
            return;
        }
        this.opcity = opcity;
    
    },
};
</script>

<style lang="scss">
// header 自定义
    .tui-header-box {
        width: 100%;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 9998;
        background: #000000;

        .tui-header {
            width: 100%;
            font-size: 18px;
            line-height: 18px;
            font-weight: 500;
            height: 32px;
            text-align: center;
        }

        .tui-header-text {
            color: #FFFFFF;
            display: inline-block;
            text-align: center;
            line-height: 32px;
            font-size: 32rpx;
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

        .tui-icon-back {
            height: 32px !important;
            width: 32px !important;
            display: block !important;
        }
    }

    // header 自定义
top {
    width: 100%;
    height: 450rpx;
}

.top .top-info {
    width: 100%;
    height: 392rpx;
    padding: 20rpx 32rpx 0;
    box-sizing: border-box;
    position: relative;
    display: flex;
    align-items: center;
}

.top .top-info image {
    width: 120rpx;
    height: 120rpx;
    margin-right: 40rpx;
    border-radius: 60rpx;
}

.top .top-info .top-info-name {
    font-size: 36rpx;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 50rpx;
    margin-bottom: 12rpx;
    // position: absolute;
    // top: 64rpx;
    // left: 200rpx;
}

.top .top-info .top-info-address {
    display: inline-block;
    font-size: 24rpx;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 42rpx;
    background-color: #2b2b2b;
    border-radius: 20rpx;
    height: 42rpx;
    padding: 0 14rpx 0 24rpx;
}

.top .top-info .top-info-expert {
    // min-width: 168rpx;
    display: inline-block;
    padding: 0 32rpx;
    height: 54rpx;
    background: linear-gradient(270deg, rgba(242, 222, 176, 1) 0%, rgba(219, 180, 122, 1) 100%);
    border-radius: 8rpx 0 0 40rpx;
    font-size: 24rpx;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(58, 59, 61, 1);
    position: absolute;
    right: 0;
    top: 150rpx;
    text-align: center;
    line-height: 54rpx;
}

.top .top-year {
    height: 200rpx;
    position: absolute;
    bottom: -134rpx;
    left: 32rpx;
    right: 32rpx;
    display: flex;
    justify-content: space-around;
    font-size: 24rpx;
    background-color: white;
    border-radius: 8rpx;
    padding: 48rpx 0;
    box-sizing: border-box;
}

.top-year-item {
    text-align: center;
}

.top-year-item-color {
    color: $default-color;
    font-size: 28rpx;
    line-height:50rpx;
    margin-bottom: 8rpx;
}

.top-year-item span {
    font-size: 56rpx;
}
.top-year-item-desc{
    color: #707175;
    font-size: 24rpx;
    letter-spacing: 2rpx;
}

.top-year-line {
    background-color: #ebeff8;
    height: 106rpx;
    width: 2rpx;
}

.middle {
    padding: 0 34rpx;
    margin-top: 164rpx;
}

.middle .field {
    /* height: 180rpx; */
    background-color: white;
    border-radius: 8rpx;
}

.field-top {
    height: 80rpx;
    padding-top: 20rpx;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    font-size: 36rpx;
    font-family: PingFangSC-Medium;
    font-weight: bold;
    color: rgba(58, 59, 61, 1);
}

.field-top :first-child {
    width: 8rpx;
    background-color: $default-color;
    height: 36rpx;
    margin-right: 24rpx;
}

.field-bottom {
    padding: 0rpx 0rpx 20rpx 32rpx;
}

.field-bottom .field-bottom-item {
    display: inline-block;
    background: rgba(58, 59, 61, 1);
    border-radius: 6rpx;
    font-size: 24rpx;
    padding: 0 16rpx;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    margin-right: 24rpx;
    margin-bottom: 24rpx;
    height: 40rpx;
    line-height: 40rpx;
}

.intro {
    font-size: 28rpx;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(112, 113, 117, 1);
    padding: 40rpx 32rpx;
    padding-top: 0;
    word-break:break-all; 
}

.certificate {
    padding-bottom: 40rpx;
    padding-right: 32rpx;
    display: flex;
    flex-wrap: wrap;
}

.certificate-item {
    width: 184rpx;
    font-size: 24rpx;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    text-align: center;
    margin-left: 33rpx;
    margin-top:24rpx;
    .img-box{
        width: 184rpx;
        height: 184rpx;
        background:rgba(238,240,243,1);
        margin-bottom:16rpx;
        display:flex;
        align-items:center;
        justify-content:center;
        image{
           width:84rpx;
           height:118rpx;
        }
    }
}
.certificate-item text {
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-height: 34rpx;
    color: #707175;
}

/* bottom */

.bottom {
    background-color: $default-color;
    font-size: 32rpx;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    height: 100rpx;
    text-align: center;
    line-height: 100rpx;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
}

.fixed-phone {
    position: fixed;
    bottom: 100rpx;
    right: 0;
    width: 100rpx;
    height: 100rpx;
    border-top-left-radius: 100rpx;
    background-color: white;
}

.fixed-phone image {
    width: 50rpx;
    height: 50rpx;
    position: absolute;
    top: 40rpx;
    left: 40rpx;
}
</style>
