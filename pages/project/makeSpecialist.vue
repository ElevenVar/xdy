<template>
    <view class="makeSpecialist">
        <!--pages/solution/orderExpert/orderExpert.wxml-->
        <view class="top" v-if="!isProduct">
            <view>
                <view class="top-left">
                    <view class="top-name">{{ item.name }}</view>
                    <view class="top-info">
                        {{ item.tag }}
                    </view>
                    <view class="top-info">
                        {{ item.date }}年
                    </view>
                </view>
            </view>
            <image src="https://tguaguastatic.dgg.net/src/images/default/dggCloudImage/image-appointment_expert.png"></image>
        </view>

        <view class="nick" :style="userIsLogin ? 'height:270rpx;' : 'height:340rpx;'">
            <view class="nick-phone" v-if="userIsLogin">联系手机：{{ userInfo.mobile }}</view>
            <view class="nick-title" v-if="!userIsLogin">
                联系方式
            </view>
            <input placeholder="请输入您的联系方式" maxlength="11" @input="phoneDataInput" v-if="!userIsLogin" />
            <view class="nick-title">
                昵称
            </view>
            <input placeholder="请输入您的称呼（1~20字）" maxlength="20" @input="nickNameInput" />
        </view>

        <view class="nick" style="height:480rpx;">
            <view class="nick-title">
                描述
            </view>
            <textarea placeholder="请填写详细描述，系统将指派专人进行处理。" maxlength="500" @input="descriptionInput"></textarea>
        </view>

        <view class="bottom" @tap="submitAction">提交</view>
    </view>
</template>

<script>
    import {accountSet} from '@/api/index.js'
export default {
    data() {
        const userInfo = uni.getStorageSync('userInfo')
        return {
            item: {},
            userInfo: userInfo,
            obj: {
                name: '',
                phone: '',
                desc: ''
            }
        };
    },
    computed:{
        // 判断是否登录
        userIsLogin: () =>{
            const userInfo = uni.getStorageSync('userInfo')
            let type = userInfo ? true : false
            return type
        }
    },
    onLoad(e){
      this.item  = uni.getStorageSync('expertMsg') 
    },
    methods: {
        // 获取手机号
        phoneDataInput(e){
            console.log(e);
            this.obj.phone = e.detail.value
        },
        // 获取昵称
        nickNameInput(e){
            console.log(e);
            this.obj.name = e.detail.value
        },
        // 获取描述
        descriptionInput(e){
            console.log(e);
            this.obj.desc = e.detail.value
        },
        // 最后提交
        submitAction(){
            if(this.userIsLogin){
                if (!this.obj.name || !this.obj.desc){
                    uni.showToast({
                        icon:'none',
                        title: '请将信息填写完整'
                    })
                    return
                }
            } else{
                if (!this.obj.phone || !this.obj.name || !this.obj.desc){
                    uni.showToast({
                        icon:'none',
                        title: '请将信息填写完整'
                    })
                    return
                }
            }
            var params = {
                  msgSourceChannel: 'SMALL_PROGRAM_MSG_CHANNEL',
                  consultationContent: this.obj.desc,
                  customerSourceChannel: 'EXPERT_APPOINTMENT_CUSTOMER_CHANNEL',
                };
                if(this.userIsLogin){
                  params['customerCode'] = this.userInfo.customerNo;
                  params['customerName'] = this.userInfo.nickName;
                  params['customerNumber'] = this.userInfo.mobile;
                  params['customerId'] = this.userInfo.id;
                  
                }else{
                  params['customerCode'] = '';
                  params['customerName'] = this.obj.name;
                  params['customerNumber'] = this.obj.phone;
                }
                uni.showLoading({
                    mask:true
                })
                this.$http.post(accountSet.get_save_consultation, params).then(res => {
                    uni.hideLoading()
                    if (res.code == 200) {
                          uni.showToast({
                                  title: '提交成功',
                                  icon: 'none'
                                });
                        
                                setTimeout(()=>{
                                  uni.navigateBack({});
                                },1500);
                    } else{
                        uni.showToast({
                            icon:'none',
                            title:res.message
                        })
                    }
                })
        }
    },
    onHide() {
        console.log('sssssssss');
        uni.removeStorageSync('expertMsg')
    },
    onUnload(){
        uni.removeStorageSync('expertMsg')
    }
};
</script>

<style>
.top {
    height: 180rpx;
    background: linear-gradient(180deg, rgba(14, 214, 204, 1) 0%, rgba(11, 210, 200, 1) 100%);
    display: flex;
    justify-content: space-between;
    padding: 30rpx 50rpx;
    box-sizing: border-box;
    font-size: 24rpx;
    color: white;
    line-height: 60rpx;
    align-items: center;
    overflow-x: hidden;
    position: relative;
}

.top image {
    width: 130rpx;
    height: 120rpx;
    position: absolute;
    top: 18rpx;
    right: 22rpx;
}

.top .top-left {
    display: flex;
    align-items: center;
}

.top .top-name {
    display: inline-block;
    font-size: 28rpx;
}

.top .top-info {
    display: inline-block;
    padding:0 12rpx;
    border: 1rpx solid #fff;
    height: 40rpx;
    border-radius: 20rpx;
    margin-left: 10rpx;
    line-height: 40rpx;
}

/* nick */

.nick {
    height: 270rpx;
    background-color: white;
    padding: 0 30rpx;
    margin-top: 20rpx;
    overflow-x: hidden;
}
.nick-phone {
    font-size: 14px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: #3a3b3d;
    padding-top: 40rpx;
}
.nick-title {
    font-size: 24rpx;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(112, 113, 117, 1);
    height: 80rpx;
    line-height: 80rpx;
    position: relative;
    padding-left: 32rpx;
    box-sizing: border-box;
}

.nick-title::before {
    content: '';
    position: absolute;
    width:10rpx;
    height:10rpx;
    background:rgba(255,86,68,1);
    border-radius: 50%;
    left: 0;
    top: 50%;
    margin-top: -5rpx;
}

.nick input {
    height: 72rpx;
    background-color: #f5f5f5;
    font-size: 28rpx;
    padding: 0 20rpx;
    box-sizing: border-box;
}

.nick textarea {
    height: 360rpx;
    background-color: #f5f5f5;
    font-size: 28rpx;
    padding: 20rpx 20rpx;
    box-sizing: border-box;
    margin: 0rpx;
    width: 100%;
}

.bottom {
    margin: 0 30rpx;
    margin-top: 40rpx;
    height: 100rpx;
    background: linear-gradient(180deg, rgba(14, 214, 204, 1) 0%, rgba(11, 210, 200, 1) 100%);
    border-radius: 8rpx;
    text-align: center;
    line-height: 100rpx;
    color: white;
    font-size: 32rpx;
    overflow-x: hidden;
}
</style>
