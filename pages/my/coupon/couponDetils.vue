<template>
    <view class="couponDetils page">
        <view class="detailes-item">
            <view class="item-label">优惠券来源</view>
            <view class="item-value">
                <text v-if="row.coupon.couponClass === 'COUPON_CLASS_USER'">商务赠券</text>
				<text v-else-if="row.coupon.couponClass === 'COUPON_CLASS_MONEY'">消费满减券</text>
				<text v-else-if="row.coupon.couponClass === 'COUPON_CLASS_REGISTER'">注册赠送</text>
				<text v-else-if="row.coupon.couponClass === 'COUPON_CLASS_ALL'">全场赠送</text>
				<text v-else>主动领取券</text>
            </view>
        </view>
        <view class="detailes-item">
            <view class="item-label">优惠券面值</view>
            <view class="item-value hot">
                <text v-if="row.coupon.type === 'COUPON_TYPE_ZK'">{{row.coupon.amount / 10}}折</text>
				<text v-else>¥{{row.coupon.amount / 100}}</text>
            </view>
        </view>
        <view class="detailes-item">
            <view class="item-label">优惠券使用满足金额</view>
            <view class="item-value hot">
                <text>¥{{row.coupon.denomination / 100}}</text>
            </view>
        </view>
        <view class="detailes-item">
            <view class="item-label">开始使用时间</view>
            <view class="item-value">
                <text>{{row.item.sTime}}</text>
            </view>
        </view>
		<view class="detailes-item">
		    <view class="item-label">截止使用时间</view>
		    <view class="item-value">
		        <text>{{row.item.eTime}}</text>
		    </view>
		</view>
        <view class="detailes-item">
            <view class="item-label">优惠券类型</view>
            <view class="item-value">
                <text>{{row.coupon.productType == 0 ? '全部商品通用': '限部分商品可用'}}</text>
                <!-- <tui-icon class="icon" name="arrowright" :size='20' color='#878787'></tui-icon> -->
            </view>
        </view>
		<view class="detailes-item">
		    <view class="item-label">优惠券秘钥</view>
		    <view class="item-value">
		        <text>{{row.item.no}}</text>
		    </view>
		</view>
		<view class="detailes-item">
		    <view class="item-label">使用记录</view>
		    <view class="item-value">
		       <text>订单：{{ row.item.orderNo.split(',')[0] ? row.item.orderNo.split(',')[0] : '' }}</text>
		    </view>
		</view>
    </view>
</template>

<script>
    import tuiIcon from "@/components/icon/icon"
	import {coupon} from "@/api/index.js"
	
    export default{
        components:{
            tuiIcon
        },
        data(){
            return{
				row: {
					coupon: {},
					item:{
						orderNo: ''
					}
				}
            }
        },
		onLoad(parameters) {
			this.getDetails(parameters.no);
		},
		methods:{
			getDetails(no){
				// 获取优惠券信息
				uni.showLoading({
				    title: '加载中..',
					mask: true
				});
				this.$http.get(coupon.details,{couponItemNo: no}).then(res=>{
					uni.hideLoading();
					if (res.code == 200) {
						this.row = res.data;
					} else{
						uni.showToast({
						    title: res.message,
							icon: 'none',
						    duration: 2000
						});
					}
				});
			}
		}
    }
</script>

<style lang="scss">
    .couponDetils{
        padding-top: 16rpx;
        .detailes-item{
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 100rpx;
            padding: 0 32rpx;
            position: relative;
            background:#FFFFFF;
            &::after{
                content: '';
                position:absolute;
                border-bottom: 1rpx solid #D7D8D9;
                -webkit-transform: scaleY(0.5);
                transform: scaleY(0.5);
                left: 32rpx;
                right: 0;
                bottom: 0;
            }
            &:last-child{
                &::after{
                    display: none;
                }
            }
            .item-label{
                font-size:26rpx;
                font-family:PingFang SC;
                font-weight:500;
                color:rgba(86,86,86,1);
            }
            .item-value{
                font-size:32rpx;
                font-family:PingFang SC;
                font-weight:500;
                color:rgba(37,37,37,1);
                &.hot{
                    color: #FF6600;
                }
                .icon{
                    margin-left: 24rpx;
                }
            }
        }
    }
</style>
