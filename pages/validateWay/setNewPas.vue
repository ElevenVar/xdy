<template>
    <view class="">
         <view class="notice">请输入登录密码</view>
        <!-- S 表单提交 -->
        	<view class="input_less">
        		<view class="input_item">
        			<tui-icon class="icon" name="psd" :size='20' color='rgba(44,218,216,1)' style="margin-right: 10rpx;"></tui-icon>
        			<input class="inpu_fass" placeholder="请输入新登录密码" type="password"  v-model="passwordOne"/>
        			<tui-icon class="icon2" name="unseen" :size='20' color='rgba(212,218,224,1)' style="margin-right: 10rpx;"></tui-icon>
        		</view>
        		<view class="input_item">
        			<tui-icon class="icon" name="psd" :size='20' color='rgba(44,218,216,1)' style="margin-right: 10rpx;"></tui-icon>
        			<input class="inpu_fass" placeholder="再次确认新登录密码" type="password" v-model="passwordTwo" />
        			<tui-icon class="icon2" name="eye" :size='20' color='rgba(212,218,224,1)' style="margin-right: 10rpx;"></tui-icon>
        		</view>
        	</view>
            <view class="bad-notice" v-if="showError">
                <tui-icon class="icon" name="about" :size="16" color="#F54743"></tui-icon>
                <view class="text">密码错误！两次新密码输入不一致！！</view>
            </view>
        <!-- E 表单提交 -->
        <!-- S 登陆主页 -->
        	<view class="btn" @click="handleClick">
        		<button  class="login_btn" type="primary" size="small" >
        			确定修改
        		</button >
        	</view>
        <!-- E 登陆主页 -->
    </view>
</template>


<script>
	import tuiIcon from "@/components/icon/icon"
    import {accountSet} from '@/api/index.js'
    import { mapState } from 'vuex'

	export default {
		components: {
			tuiIcon
		},
        computed: {
            ...mapState({
              oldPass: state => state.mine.curPass // 旧密码
            })
          },
		data() {
			return {
				showError: false, // 是否显示错误信息
                passwordOne: '', // 第一次输入新密码
                passwordTwo: '', // 第二次输入旧密码
			}
		},
		methods: {
			handleClick() {
                console.log(this.oldPass);
                if(!this.passwordOne || !this.passwordTwo){
                    uni.showToast({
                        icon:'none',
                        title:'请将信息填写完整'
                    })
                    return
                }
                if (this.passwordOne != this.passwordTwo) {
                    this.showError = true
                    return
                }
                uni.showLoading()
                this.$http.post(accountSet.updatePass, {password: this.passwordOne, oldPassword: this.oldPass}).then(res => {
                    uni.hideLoading()
                    if(res.code == 200) {
                        uni.setStorageSync("token",res.data.token);
                        uni.setStorageSync("userInfo", JSON.stringify(res.data.userInfo));
                        uni.navigateTo({
                            url:'/pages/validateWay/setResult?type=setPass'
                        })
                    }else{
                        uni.showToast({
                            icon:'none',
                            title:res.message
                        })
                    }
                })
                
            },
		},
        onLoad(e){
        }
	}
</script>

<style lang="scss">
    .notice {
        font-size: 28rpx;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(37, 37, 37, 1);
        margin:48rpx 0 24rpx 32rpx;
    }
    .input-placeholder {
        font-size: 32rpx;
        font-weight: 500;
        color: #b8b8b8;
    }
    .bad-notice {
        padding: 0 32rpx;
        width: 100%;
        box-sizing: border-box;
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
    .input_less{
    	margin: 0 32rpx;
    	min-height:241rpx;
    	background:rgba(255,255,255,1);
    	border-radius:4px;
    	padding: 0 32rpx;
    }
    .login_btn{
    	margin: 48rpx 32rpx;
    	width: 686rpx;
    	height: 96rpx;
    	background: #10BBB8!important;
    }
    .input_item{
    	height: 120rpx;
    	clear: both;
    	border-bottom: 1px solid #D7D8D9;
    	&:last-child{
    		border-bottom: none;
    		position: relative;
    	}
        .icon{
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
    .inpu_fass{
    	height: 120rpx;
    	float: left;
    	
    }
    
    .send_button{
    	position: absolute;
    	top:36rpx;
    	right: 20rpx;
    	width:180rpx;
    	height:58rpx;
    	background:rgba(16,187,184,1);
    	border-radius: 8rpx;
    	font-size: 26rpx;
    	line-height: 58rpx;
    }
</style>
