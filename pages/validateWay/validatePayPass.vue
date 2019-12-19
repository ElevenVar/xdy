<template>
    <view class="validateNote">
        <view class="notice">请输入支付密码,以验证身份</view>
        <view class="content" @tap="hiddenKeyboard">
            <view class="input-row padding" @tap.stop="showKeyboard">
            	<view :class="['item',{'item-active':codeLength==index}]" v-for="(k,index) in arr" :key="index">
            		<!-- {{code.charAt(index)}} -->
                    <view v-if='code.charAt(index)' class="pass-text"></view>
            	</view>
            </view>
            <DigitalKeyboard @change="contToggle" @closeKeyboard="closeKeyboard" :keyBoardSwitch="keyBoardSwitch" :decimalPoint="true"></DigitalKeyboard>
        </view>
        <view class="bad-notice">
            <tui-icon class="icon" name="about" :size='16' color='#F54743'></tui-icon>
            <view class="text">支付密码错误！今天还有3次机会</view>
        </view>
        <view class="padding">
            <view :class="['btn', code?'hot': '']" @click="handleClick">下一步</view>
        </view>
    </view>
</template>

<script>
    import tuiIcon from '@/components/icon/icon';
    import DigitalKeyboard from '@/components/digital-keyboard/digital-keyboard.vue'
    export default{
        components:{tuiIcon, DigitalKeyboard},
        data(){
            return{
                arr:['','','','','',''],
                code:'',
                codeLength:null,
                length:6,
                keyBoardSwitch:false,
                pageType: ''
            }
        },
        onLoad(e) {
            this.pageType = e.type
        },
        methods: {
            showKeyboard(){
            	this.codeLength=this.code.length==6?5:this.code.length;
            	this.keyBoardSwitch=true;
            },
            hiddenKeyboard(){
            	this.keyBoardSwitch=false;
            	this.codeLength=null;
            },
            closeKeyboard(value){
            	console.log(value);
            },
            contToggle(k){
            	let len=this.code.length;
            	if(k===''){
            		this.code=this.code.substring(0,len-1);
            		this.codeLength=this.code.length;
            		return;
            	}
            	this.codeLength=len+1;
            	this.code+=k.toString();
            	if(this.length===len+1){
            		this.keyBoardSwitch=false;
            		return;
            	}
            },
            // 下一步
            handleClick(){
                if(this.pageType === 'payway'){
                    if (this.code) {
                        uni.navigateTo({
                            url: '/pages/validateWay/setResult?type=payway'
                        });
                    }
                } else {
                    if (this.code) {
                        uni.navigateTo({
                            url: '/pages/validateWay/setResult?type=setPhone'
                        });
                    }
                }
                
            },
        }
    }
</script>
<style lang="scss">
	.input-row{
		width: 100%;
		margin: 0 auto;
		font-size: 26rpx;
        font-weight: bold;
		text-align: center;
        display: flex;
        align-items:center;
        justify-content:space-between;
		.item{
			width: 90rpx;
			height: 90rpx;
			line-height: 90rpx;
			// margin:0 24rpx;
			border-bottom: 4rpx solid #252525;
			background: #fff;
			box-sizing: border-box;
            .pass-text{
                width:24rpx;
                height:24rpx;
                background:rgba(37,37,37,1);
                border-radius:50%;
                margin:33rpx auto;
            }
		}
		.item-active{
			position: relative;
			border: 1px solid #10BBB8;
			transform: scale(1.2);
			--webkit-transform: scale(1.2);
		}
	}
</style>
<style lang="scss">
    .padding{
        padding:0 32rpx;
        box-sizing: border-box;
    }
    .validateNote{
        height:100vh;
        overflow: hidden;
        background:#fff;
        .notice{
            font-size:28rpx;
            font-family:PingFang SC;
            font-weight:500;
            text-align: center;
            color:#252525;
            margin-bottom: 24rpx;
            margin-top: 50rpx;
        }
        .btn{
            width:100%;
            height:96rpx;
            text-align: center;
            line-height: 96rpx;
            font-size:36rpx;
            font-family:PingFang SC;
            font-weight:500;
            color:rgba(255,255,255,1);
            background:rgba(16,187,184,0.5);
            border-radius:8rpx;
            margin-top:80rpx;
            &.hot{
                background: #10BBB8;
            }
        }
        .send_button{
        	position: absolute;
        	top:36rpx;
        	right: 20rpx;
        	min-width:180rpx;
            display: inline-block;
        	height:58rpx;
        	background:rgba(16,187,184,1);
        	border-radius: 8rpx;
        	font-size: 26rpx;
        	line-height: 58rpx;
            &.active{
                background: #F5F7FA;
                color: #B8B8B8;
            }
        }
        .input-placeholder{
               font-size:32rpx;
               font-weight:500;
               color:#B8B8B8;
           }
           .bad-notice{
               display: flex;
               align-items: center;
               justify-content: center;
               font-size:24rpx;
               font-weight:500;
               color:rgba(245,71,67,1);
               margin-top:32rpx;
               .icon{
                   display: block;
                   margin-right: 8rpx;
               }
           }
    }
</style>
