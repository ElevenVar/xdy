<template>
    <view class="accountSetting page">
        <view class="body">
            <view class="head" @click="handleClick">
                <view class="head-img"><image :src="userInfo.avatarUrl ? userInfo.avatarUrl : altImg" ></image></view>
                <view class="head-content">
                    <view class="">
                        <view class="name">{{userInfo.nickName}}</view>
                        <view class="phone">{{userInfo.mobile}}</view>
                    </view>
                    <view><tui-icon class="icon" name="arrowright" :size="24" color="#878787"></tui-icon></view>
                </view>
            </view>
			<list-cell @click='goAddress' :arrow="true" :last="true">地址管理</list-cell>
            <view class="section">
                <view class="zp-list-item" @click="handleJump('phone')">
                    <view class="item-left">
                        <view  class="flex">
                            <text class="label">绑定手机管理</text>
                            <view class="content ellipsis">{{userInfo.mobile}}</view>
                        </view>
                        <view class="right-label">修改</view>
                    </view>
                    <tui-icon class="icon" name="arrowright" :size="24" color="#878787"></tui-icon>
                </view>
                <view class="zp-list-item"  @click="handleJump('password')">
                    <view class="item-left">
                        <view class="flex">
                            <text class="label">登录密码管理</text>
                            <view class="content ellipsis">建议定期修改，以确保账户安全</view>
                        </view>
                        <view class="right-label">修改</view>
                    </view>
                    <tui-icon class="icon" name="arrowright" :size="24" color="#878787"></tui-icon>
                </view>
          <!--      <view class="zp-list-item"  @click="handleJump('payway')">
                    <view class="item-left">
                        <view  class="flex">
                            <text class="label">支付密码管理</text>
                            <view class="content ellipsis">用于顶呱呱的支付验证</view>
                        </view>
                        <view class="right-label hot">去设置</view>
                    </view>
                    <tui-icon class="icon" name="arrowright" :size="24" color="#878787"></tui-icon>
                </view> -->
            </view>
            <block v-for="(item, index) in list" :key="index">
                <list-cell @click="detail(item)" :arrow="true" :last='index == (Number(list.length) - 1) ? true : false'>
                {{ item }}
                </list-cell>
            </block>
        </view>

        <view class="footer" @click="dengOut">退出登录</view>
    </view>
</template>

<script>
import tuiIcon from '@/components/icon/icon';
import listCell from '@/components/list-cell/list-cell.vue';
import {accountSet, user} from '@/api/index.js'
export default {
    components: {
        tuiIcon,
        listCell
    },
    computed: {
        altImg() {
            return this.$store.state.altImg
        }
    },
    data() {
        return {
            list: ['账号绑定', '关于智能企服'],
            img: `${this.$config.imgUrl}mall/product/1.jpg`,
            userInfo:null
        };
    },
    onShow(){
        this.getInfo()
    },
    methods: {
        handleJump(e) {
            if(e == 'payway'){
                uni.navigateTo({
                    url:'/pages/validateWay/validateNote?class=' + e
                })
            } else if(e == 'password') {
               uni.navigateTo({
                   url:'/pages/validateWay/validateWay?type=' + e
               }) 
            }else if(e == 'phone') {
                 uni.navigateTo({
                    url:'/pages/validateWay/validateWay?type=' + e
                })
            }
          
        },
		detail(item) {
			if (item === '账号绑定') {
				uni.navigateTo({
					url: '/pages/accountSetting/accountBind/accountBind'
				})
			} else {
				uni.navigateTo({
					url: '/pages/accountSetting/about/about'
				})
			}
		},
        handleClick(){
            uni.navigateTo({
                url:'/pages/accountSetting/personalDetails/personalDetails'
            })
        },
		// 去我的订单
		goAddress () {
			uni.navigateTo({
				url: '/pages/accountSetting/address/mineAddress/mineAddress'
			})
		},
        dengOut() {
            uni.showModal({
                title: '提示',
                content: '确定要退出吗？',
                success: (res) => {
                    if (res.confirm) {
                        uni.showLoading({title:'退出中...', mask:true})
                        this.$http.get(user.logout).then(res => {
                            uni.hideLoading()
                            if(res.code == 200){
								uni.removeTabBarBadge({ index: 2 })
                                uni.removeStorageSync('token')
                                uni.removeStorageSync('phone')
                                uni.removeStorageSync('userInfo')
                                uni.reLaunch({
                                    url:'/pages/index/index'
                                })
                            } else {
                                uni.showToast({
                                    icon:'none',
                                    title:res.message
                                })
                            }
                        })
                    } else if (res.cancel) {
                        console.log('用户点击取消');
                    }
                }
            });
          

        },
        // 获取会员信息
        getInfo(){
            uni.showLoading({title:'加载中...', mask:true})
            this.$http.get(accountSet.memberInfo).then(res=>{
                uni.hideLoading()
                if (res.code == 200) {
                    uni.setStorageSync('userInfo', res.data.userInfo)
                    this.userInfo = res.data.userInfo
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
.accountSetting {
    .body {
        width: 100%;
        height: calc(100vh - 100rpx);
        overflow-y: auto;
    }
    .section{
        margin: 16rpx 0;
    }
    .head {
        width: 100%;
        height: 204rpx;
        padding: 0 32rpx;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        overflow: hidden;
        background: #fff;
		position: relative;
		&::after{
			content: '';
			position: absolute;
			display: inline-block;
			left: 32rpx;
			height:1rpx;
            transform: scaleY(0.5);
			background:#D7D8D9;
			right: 0;
			bottom: 0;
		}
        .head-img {
            width: 140rpx;
            height: 140rpx;
            border-radius: 50%;
            margin-right: 28rpx;
            overflow:hidden;
            image {
                width: 100%;
                height: 100%;
            }
        }
        .head-content {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .name {
                font-size: 32rpx;
                font-weight: bold;
                color: rgba(37, 37, 37, 1);
                margin-bottom: 23rpx;
            }
            .phone {
                font-size: 24rpx;
                font-weight: bold;
                color: #252525;
            }
			.icon{
				position: relative;
				left: 14rpx;
			}
        }
    }
    .footer {
        position: fixed;
        left: 0;
        bottom: 0;
        height: 100rpx;
        line-height: 100rpx;
        width: 100%;
        background-color: #ffffff;
        font-size: 32rpx;
        text-align: center;
        font-weight: bold;
        color: rgba(37, 37, 37, 1);
        padding-bottom: env(safe-area-inset-bottom);
    }
    .zp-list-item{
        width: 100%;
        height: 100rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background:#fff;
        padding: 0 18rpx 0 32rpx;
        box-sizing: border-box;
        position:relative;
        &:after{
            position: absolute;
            content: '';
            border-bottom: 1rpx solid #D7D8D9;
            right: 0;
            left: 32rpx;
            bottom: 0;
            -webkit-transform: scaleY(0.5);
            transform: scaleY(0.5);
        }
        &:last-child{
            &:after{
                display: none;
            }
        }
        .item-left{
            flex: 1;
            display: flex;
            align-items: center;
            overflow: hidden;
            justify-content: space-between;
            line-height:100%;
            .flex{
                display: flex;
                align-items: center;
                overflow: hidden;
            }
            .label{
                font-size:28rpx;
                font-weight:500;
                color:#252525;
                margin-right: 30rpx;
            }
            .content{
                max-width: 350rpx;
                font-size:24rpx;
                font-weight:500;
                color:#878787;
            }
            .right-label{
                font-size:24rpx;
                font-weight:500;
                color:rgba(135,135,135,1);
                &.hot{
                    color: #252525;
                }
            }
        }
    }
}
</style>
