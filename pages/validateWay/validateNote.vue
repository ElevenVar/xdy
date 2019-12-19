<template>
    <view class="validatePayPass page">
        <block v-if="routeType == 'setPhone-note' || routeType == 'setPss-note'  || routeType == 'payway'">
            <view class="notice">请输入绑定手机{{curPhone}}接收到的短信验证码</view>
            <view class="input_less">
                <view class="input_item">
                    <tui-icon class="icon" name="shield" :size="20" color="rgba(44,218,216,1)" style="margin-right: 10rpx;"></tui-icon>
                    <input class="inpu_fass" placeholder="请输入短信验证码" type="number" :value="code" @input="handleInput" />
                    <button :class="['send_button', isClick ? 'active' : '']" type="primary" size="small" @click="handleCode">{{ btnText }}</button>
                </view>
            </view>
            <view class="bad-notice" v-if="showError">
                <tui-icon class="icon" name="about" :size="16" color="#F54743"></tui-icon>
                <view class="text">短信验证码错误</view>
            </view>
            <view :class="['btn', code ? 'hot' : '']" @click="handleClick">下一步</view>
        </block>
        <block v-if="routeType == 'setPss-prePass'">
            <view class="notice">请输入原登录密码</view>
            <view class="input_less">
                <view class="input_item">
                	<tui-icon class="icon" name="pwd" :size='20' color='rgba(44,218,216,1)' style="margin-right: 10rpx;"></tui-icon>
                	<input class="inpu_fass" placeholder="请输入密码" type="password" :value="password" @input='handleInputPas'/>
                	<tui-icon class="icon2" name="eye" :size='20' color='rgba(212,218,224,1)' style="margin-right: 10rpx;"></tui-icon>
                </view>
            </view>
            <view class="bad-notice" v-if="showError">
                <tui-icon class="icon" name="about" :size="16" color="#F54743"></tui-icon>
                <view class="text">登录密码错误!</view>
            </view>
            <view :class="['btn', password ? 'hot' : '']" @click="handleClick">下一步</view>
        </block>
    </view>
</template>

<script>
import tuiIcon from '@/components/icon/icon';
import {accountSet} from '@/api/index.js'
export default {
    components: { tuiIcon },
    data() {
        const userInfo = uni.getStorageSync('userInfo')
        const phone = userInfo.mobile
        return {
            routeType: '',
            isClick: false,
            btnText: '获取验证码',
            number: 60,
            code: '',
            password: '',
            curPhone: phone, // 登陆手机号
            getCode: null, // 获取到的验证码
            showError: false // 是否显示短信验证码提示
        };
    },
    onLoad(e) {
        if (e) {
            this.routeType = e.class;
            if (this.routeType == 'setPss-prePass') {
                uni.setNavigationBarTitle({
                    title:'验证原登录密码'
                })
            }
        }
    },
    methods: {
        handleInput(e) {
            this.code = e.detail.value;
        },
        handleInputPas(e) {
            this.password = e.detail.value;
        },
        // 验证手机验证码
        checkCode (code, url) {
            this.$http.post(accountSet.checkSms, {code: code}).then(res => {
                console.log(res);
                if(res.code == 200) {
                    uni.navigateTo({
                        url: url
                    });
                } else{
                    this.showError=true
                    uni.showToast({
                        icon:'none',
                        title:res.message
                    })
                }
            })
        },
        // 验证原登录密码
        checkPass(pass){
            const phone = uni.getStorageSync('phone')
          this.$http.post(accountSet.checkPass, {password: pass}).then(res=>{
              if (res.code == 200) {
                  this.$store.commit('mine/SET_CURPASS', pass)
                  uni.navigateTo({
                      url: '/pages/validateWay/setNewPas'
                  });
              } else{
                  this.showError = true
                  uni.showToast({
                      icon:'none',
                      title:res.message
                  })
              }
          })
        },
        // 下一步
        handleClick() {
            // 来自修改绑定手机号
            if (this.routeType == 'setPhone-note') {
                if (this.code) {
                    this.checkCode(this.code, '/pages/login/moblieLogin?type=again')   
                }
            } else if (this.routeType == 'setPss-prePass') {
                // 来自登录密码 通过原登录密码验证修改   
                if (this.password) {
                    this.checkPass(this.password)
                   
                }
            } else if (this.routeType == 'setPss-note') {
                // 来自登录密码 请确保绑定手机号能正常接收短信验证码   
                if (this.code) {
                    this.checkCode(this.code, '/pages/validateWay/setNewPas')
                }
            } else if (this.routeType == 'payway') {
                // 来自支付密码管理   
                if (this.code) {
                    this.checkCode(this.code, '/pages/validateWay/validatePayPass?type=payway')
                }
            }
        },
        // 获取验证码
        handleCode() {
            if (this.isClick) {
                return;
            }
            this.isClick = true;
            const phone = uni.getStorageSync('phone')
            this.$http.get(accountSet.sendsms).then(res=>{
                console.log(res);
                if(res.code == 200) {
                    uni.showToast({
                        icon:'none',
                        title:'发送成功'
                    })
                   this.btnText = '重新发送 ' + this.number + 's';
                    let Interval = setInterval(() => {
                        this.number = this.number - 1;
                        this.btnText = '重新发送 ' + this.number + 's';
                        if (this.number <= 0) {
                            this.isClick = false;
                            this.number = 10;
                            this.btnText = '获取验证码';
                            clearInterval(Interval);
                        }
                    }, 1000); 
                } else{
                    uni.showToast({
                        icon:'none',
                        title:res.message
                    })
                }
                
            })
            
        }
    }
};
</script>

<style lang="scss">
.validatePayPass {
    padding: 32rpx;
    box-sizing: border-box;
    .notice {
        font-size: 28rpx;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(37, 37, 37, 1);
        margin-bottom: 24rpx;
    }
    .input_less {
        background: rgba(255, 255, 255, 1);
        border-radius: 4rpx;
        padding: 0 32rpx;
        .icon {
            margin-top: 39rpx;
            float: left;
            display: block;
        }
        .icon2{
        	margin-top: 39rpx;
        	float: right;
        	display: block;
        }
    }
    .login_btn {
        margin: 48rpx 32rpx;
        width: 686rpx;
        height: 96rpx;
        background: rgba(16, 187, 184, 1);
    }
    .input_item {
        height: 120rpx;
        clear: both;
        border-bottom: 1px solid #d7d8d9;
        &:last-child {
            border-bottom: none;
            position: relative;
        }
    }
    .inpu_fass {
        height: 120rpx;
        float: left;
    }
    .btn {
        width: 100%;
        height: 96rpx;
        text-align: center;
        line-height: 96rpx;
        font-size: 36rpx;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        background: rgba(16, 187, 184, 0.5);
        border-radius: 8rpx;
        margin-top: 80rpx;
        &.hot {
            background: #10bbb8;
        }
    }
    .send_button {
        position: absolute;
        top: 36rpx;
        right: 20rpx;
        min-width: 180rpx;
        display: inline-block;
        height: 58rpx;
        background: rgba(16, 187, 184, 1);
        border-radius: 8rpx;
        font-size: 26rpx;
        line-height: 58rpx;
        &.active {
            background: #f5f7fa;
            color: #b8b8b8;
        }
    }
    .input-placeholder {
        font-size: 32rpx;
        font-weight: 500;
        color: #b8b8b8;
    }
    .bad-notice {
        display: flex;
        align-items: center;
        font-size: 24rpx;
        font-weight: 500;
        color: rgba(245, 71, 67, 1);
        margin-top: 32rpx;
        .icon {
            display: block;
            margin-right: 8rpx;
        }
    }
}
</style>
