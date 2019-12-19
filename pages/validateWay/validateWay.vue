<template>
    <view class="validateWay page">
        <block v-if="routeType == 'phone'">
            <view class="way-box" @click="handleClick('setPhone-note')">
                <view class="way-img"><tui-icon class="icon" name="mobile" :size="20" color="#fff"></tui-icon></view>
                <view class="way-content">
                    <text class="way-name">通过验证原手机短信验证码修改</text>
                    <text class="way-desc ellipsis">请确保绑定手机号能正常接收短信验证码</text>
                </view>
                <tui-icon class="icon" name="arrowright" :size="22" color="#878787"></tui-icon>
            </view>
            <!-- <view class="way-box" @click="handleClick('setPhone-payPass')">
                <view class="way-img"><tui-icon class="icon" name="shield" :size="20" color="#fff"></tui-icon></view>
                <view class="way-content">
                    <text class="way-name">通过支付密码验证修改</text>
                    <text class="way-desc ellipsis">记得支付密码，原手机号无法正常接收短信选此方式</text>
                </view>
                <tui-icon class="icon" name="arrowright" :size="22" color="#878787"></tui-icon>
            </view> -->
        </block>
        <block v-else>
            <view class="way-box" @click="handleClick('setPss-prePass')">
                <view class="way-img"><tui-icon class="icon" name="pwd" :size="20" color="#fff"></tui-icon></view>
                <view class="way-content">
                    <text class="way-name">通过原登录密码验证修改</text>
                    <text class="way-desc ellipsis">如果记得原登录密码请选择此方式</text>
                </view>
                <tui-icon class="icon" name="arrowright" :size="22" color="#878787"></tui-icon>
            </view>
            <view class="way-box" @click="handleClick('setPss-note')">
                <view class="way-img"><tui-icon class="icon" name="mobile" :size="20" color="#fff"></tui-icon></view>
                <view class="way-content">
                    <text class="way-name">通过验证原手机短信验证码修改</text>
                    <text class="way-desc ellipsis">请确保绑定手机号能正常接收短信验证码</text>
                </view>
                <tui-icon class="icon" name="arrowright" :size="22" color="#878787"></tui-icon>
            </view>
        </block>
    </view>
</template>

<script>
import tuiIcon from '@/components/icon/icon';
export default {
    components: {
        tuiIcon
    },
    data() {
        return {
            routeType: 'phone',
            inputValue: ''
        };
    },
    onLoad(e) {
        if (e) {
            this.routeType = e.type;
        }
    },
    methods: {
        handleClick(e) {
            switch (e) {
                // 绑定手机号 通过验证原手机短信验证码修改
                case 'setPhone-note':
                    uni.navigateTo({
                        url: '/pages/validateWay/validateNote?class=' + e
                    });
                    break;
                // 绑定手机号 通过支付密码验证修改    
                case 'setPhone-payPass':
                    uni.navigateTo({
                        url: '/pages/validateWay/validatePayPass'
                    });
                    break;
                // 登录密码 通过原登录密码验证修改    
                case 'setPss-prePass':
                    uni.navigateTo({
                        url: '/pages/validateWay/validateNote?class=' + e
                    });
                    break;
                // 登录密码 请确保绑定手机号能正常接收短信验证码    
                case 'setPss-note':
                    uni.navigateTo({
                        url: '/pages/validateWay/validateNote?class=' + e
                    });
                    break;        
            }
        }
    }
};
</script>

<style lang="scss">
.validateWay {
    padding-top: 16rpx;
    .way-box {
        width: 100%;
        height: 140rpx;
        padding: 0 32rpx;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #fff;
        position: relative;
        &:last-child {
            &:after {
                display: none;
            }
        }
        &::after {
            content: '';
            position: absolute;
            border-bottom: 1rpx solid #d7d8d9;
            -webkit-transform: scaleY(0.5);
            transform: scaleY(0.5);
            bottom: 0;
            right: 0;
            left: 32rpx;
        }
        .way-img {
            width: 80rpx;
            height: 80rpx;
            background: rgba(16, 187, 184, 1);
            border-radius: 16rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 16rpx;
        }
        .way-content {
            flex: 1;
            overflow: hidden;
            display: flex;
            justify-content: center;
            flex-direction: column;
            text-align: left;
            .way-name {
                font-size: 32rpx;
                font-weight: 500;
                color: rgba(37, 37, 37, 1);
            }
            .way-desc {
                font-size: 24rpx;
                font-weight: 500;
                color: #878787;
                margin-top: 15rpx;
            }
        }
    }
}
</style>
