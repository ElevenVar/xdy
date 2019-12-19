<template>
    <view class="orderDetails page">
        <view class="body">
            <!-- 订单信息 -->
            <view class="order-message">
                <view class="order-item" v-for="(item, index) in list" :key="item.label">
                    <text class="label">{{ item[defaultData['key']] }}</text>
                    <view class="value">
                        <text>{{ item[defaultData['value']] }}</text>
                        <text v-if="index == 0" class="type">退单待审核</text>
                    </view>
                </view>
                <view class="btn">取消退单</view>
            </view>
            <!-- 订单信息 -->
            <!-- tab 切换 -->
            <view class="order-tab">
                <view class="tab-item" :class="[item.id == curTab ? 'active' : '']" v-for="item in tabList" :key="item.label" @click="tabClick(item.id)">{{ item.label }}</view>
            </view>
            <!-- tab 切换 -->
            <!-- 退单进度部分 -->
            <block v-if="curTab == 0">
                <view class="order-section">
                    <uni-steps :datas="[
                           {title:'发起退单',desc:'2018-11-11'},
                           {title:'完善资料',desc:'2018-11-12'},
                           {title:'初次审核，通过',desc:'2018-11-12'},
                            {title:'发起退单',desc:'2018-11-12'}]" 
                        :active="2" direction="column">
                    </uni-steps>
                    <view class="order-item">
                        <text class="label">申请原因</text>
                        <view class="value">
                            <text>个人原因</text>
                        </view>
                    </view>
                      <view class="order-item">
                          <text class="label">退单类型</text>
                          <view class="value">
                              <text>退单退款</text>
                          </view>
                      </view> 
                      <view class="order-item">
                          <text class="label">申请时间</text>
                          <view class="value">
                              <text>2019-06-01 15:00</text>
                          </view>
                      </view> 
                </view>
            </block>
            <!-- 退单进度部分 -->
            <!-- 生产信息部分 -->
            <block v-if="curTab == 1">
                <view class="order-section padding0">
                    <view class="card">
                        <view class="card-head">
                            <view class="head-name">商品: <text class="margin16">工商银行信用贷款</text></view>
                            <view class="head-right" @click="handleLook">
                                <view class="text">查看属性</view>
                                <tui-icon :name="isLook?'turningup':'turningdown'" size="20" color="#3A3B3D"></tui-icon>
                                <!-- <tui-icon name="turningup" size="14" color="#3A3B3D"></tui-icon> -->
                            </view>
                        </view>
                        <view class="card-content" v-show="isLook">
                            <view class="content-item">
                                <view class="item-label">地区: </view>
                                <view class="item-value">四川省 成都市</view>
                            </view>
                            <view class="content-item">
                                <view class="item-label">下单时间: </view>
                                <view class="item-value">2019-01-01 18:00</view>
                            </view>
                            <view class="content-item">
                                <view class="item-label">额外服务: </view>
                                <view class="item-value">XX服务、XX服务、XX服务、XX服务、XX服务XX服务、XX服务XX服务</view>
                            </view>
                            <view class="content-item">
                                <view class="item-label">服务顾问: </view>
                                <view class="item-value">苏城宇 50212543</view>
                            </view>
                        </view>
                        <view class="card-steps">
                            <uni-steps :datas="[
                                   {title:'接单',desc:'2018-11-11'},
                                   {title:'完善资料',desc:'2018-11-12'},
                                   {title:'报审',desc:''},
                                    {title:'放款',desc:''}]" 
                                :active="2">
                            </uni-steps>
                        </view>
                    </view>
                </view>
            </block>
            <!-- 生产信息部分 -->
            <!-- 合同信息 -->
            <blcok v-if='curTab == 3'>
                <view class="order-section padding0">
                    <view class="contract-item">
                        <image src="http://img4.imgtn.bdimg.com/it/u=201553806,1630236646&fm=26&gp=0.jpg" mode=""></image>
                        <view class="contract-msg">
                            <view class="name">成都攀枝花银行信用贷款合同</view>
                            <view class="number">编号：20115108101211120</view>
                            <view class="date">签署日期  2018-01-01</view>
                        </view>
                    </view>
                    <view class="contract-item">
                        <image src="http://img4.imgtn.bdimg.com/it/u=201553806,1630236646&fm=26&gp=0.jpg" mode=""></image>
                        <view class="contract-msg">
                            <view class="name">成都攀枝花银行信用贷款合同</view>
                            <view class="number">编号：20115108101211120</view>
                            <view class="date">签署日期  2018-01-01</view>
                        </view>
                    </view>
                </view>
            </blcok>
            <!-- 合同信息 -->
            <!-- 财务信息 -->
            <block v-if="curTab == 2">
                <view class="finance">
                    <view class="finance-head" :style="{background: `url(${imgUrl}details/finance.png) center/cover`}">
                        <view class="finance-item">
                            <view class="number">￥35,000.00</view>
                            <view class="name">合同总额</view>
                        </view>
                        <view class="finance-item">
                            <view class="number">￥35,000.00</view>
                            <view class="name">已付</view>
                        </view>
                    </view>
                    <view class="finance-body">
                        <view class="body-number hot">￥1000.00</view>
                        <view class="body-type">实退(-)</view>
                        <view class="body-name">成都响当当劳务派遣公司</view>
                        <view class="body-payWay">
                            <view class="label">支付方式: </view>
                            <view class="pay-list">
                                <view class="pay-item">退款</view>
                                <view class="pay-item">现金</view>
                            </view>
                        </view>
                        <view class="body-date">2019-01-09 18:00</view>
                        <!-- <view class="btn">
                            <tui-icon name="calendar" size="20" color="#707175"></tui-icon>
                            <text style="margin-left: 6rpx;">查看收据</text>
                        </view> -->
                    </view>
                    <view class="finance-body">
                        <view class="body-number">￥1000.00</view>
                        <view class="body-type">实退(-)</view>
                        <view class="body-name">成都响当当劳务派遣公司</view>
                        <view class="body-payWay">
                            <view class="label">支付方式: </view>
                            <view class="pay-list">
                                <view class="pay-item">退款</view>
                                <view class="pay-item">现金</view>
                            </view>
                        </view>
                        <view class="body-date">2019-01-09 18:00</view>
                        <view class="btn">
                            <tui-icon name="calendar" size="20" color="#707175"></tui-icon>
                            <text style="margin-left: 6rpx;">查看收据</text>
                        </view>
                    </view>
                </view>
            </block>
            <!-- 财务信息 -->
        </view>
        <!-- 底部 -->
        <view class="footer">
            <view class="hot">
                <image :src="imgUrl + 'details/tousu.png'" mode=""></image>
                <text>投诉</text>
            </view>
            <view class="item">
                <image :src="imgUrl + 'details/kefu.png'" mode=""></image>
                <text>投诉</text>
            </view>
        </view>
    </view>
</template>

<script>
    import tuiIcon from "@/components/icon/icon"
    import uniSteps from "@/components/uni-steps/uni-steps.vue"
export default {
    components:{
        tuiIcon, uniSteps
    },
    data() {
        const imgUrl = this.$config.imgUrl;
        return {
        	imgUrl : imgUrl,
            defaultData: {
                key: 'label',
                value: 'value'
            },
            list: [
                {
                    label: '订单编号:',
                    value: '100654052019010112'
                },
                {
                    label: '下单时间:',
                    value: '2019-01-01 18:00'
                },
                {
                    label: '总金额:',
                    value: '￥2888'
                },
                {
                    label: '服务顾问:',
                    value: '苏城宇 50212543'
                }
            ],
            tabList: [
                {
                    id: 0,
                    label: '退单进度'
                },
                {
                    id: 1,
                    label: '生产信息'
                },
                {
                    id: 2,
                    label: '财务信息'
                },
                {
                    id: 3,
                    label: '合同信息'
                }
            ],
            curTab: 1,
            isLook: false
        };
    },
    methods: {
        tabClick(id) {
            this.curTab = id;
        },
        // 查看属性
        handleLook(){
            this.isLook = !this.isLook
        }
    }
};
</script>

<style lang="scss">
.padding {
    padding: 0 32rpx;
    box-sizing: border-box;
}
.padding0{
    padding-bottom: 0;
}
.margin16{
    margin-left: 16rpx;
}
.body {
    width: 100%;
    height: calc(100% - 114rpx);
    padding-bottom: 30rpx;
    box-sizing: border-box;
    overflow-y: auto;
}
.orderDetails {
    font-size: 28rpx;
    height: 100vh;
}
// 订单部分
.order-message {
    padding: 32rpx 32rpx 12rpx;
    box-sizing: border-box;
    margin-bottom: 20rpx;
    background: #fff;
    text-align: center;
    position: relative;
    }
    .btn {
        position: absolute;
        right: 32rpx;
        bottom: 26rpx;
        width: 158rpx;
        height: 56rpx;
        line-height: 56rpx;
        text-align: center;
        border-radius: 28rpx;
        border: 2rpx solid rgba(160, 163, 168, 1);
        font-size: 24rpx;
        font-weight: 400;
        color: rgba(112, 113, 117, 1);
    }
    .order-item {
        display: flex;
        align-items: center;
        margin-bottom: 16rpx;
    }
    .label {
        font-family: PingFangSC;
        font-weight: 400;
        color: rgba(112, 113, 117, 1);
        margin-right: 16rpx;
    }
    .value {
        flex: 1;
        font-weight:bold;
        color: rgba(58, 59, 61, 1);
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .type {
        color: #ff984c;
        font-weight:500;
    }

// 订单tab切换
.order-tab {
    width: 100%;
    height: 94rpx;
    line-height: 94rpx;
    background: #fff;
    border-bottom: 2rpx solid #ebeff8;
    display: flex;
    align-items: center;
    justify-content: space-around;
    .tab-item {
        height: 100%;
        color: #707175;
        position: relative;
        &.active {
            color: #3a3b3d;
            font-weight:bold;
            &::after {
                content: '';
                width: 100%;
                height: 4rpx;
                background: #231815;
                position: absolute;
                left: 0;
                bottom: 0;
            }
        }
    }
}
// tab切换对应的各个模块1
.order-section{
    padding:44rpx 32rpx 32rpx;
    background: #fff;
    box-sizing: border-box;
    .label{
        margin-right: 28rpx;
    }
    .value{
        font-weight: 400;
    }
}
// 生产信息部分
.card{
    width:100%;
    min-height:290rpx;
    background:rgba(255,255,255,1);
    box-shadow:0 4rpx 18rpx 0 rgba(220,220,220,0.5);
    border-radius:8rpx;
    .card-head{
        width: 100%;
        height: 94rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 28rpx;
        box-sizing: border-box;
        border-bottom:1rpx solid #EBEFF8;
        .head-name{
            font-size:28rpx;
            font-weight:bold;
            color:rgba(58,59,61,1);
        }
        .head-right{
            font-size:24rpx;
            font-weight:400;
            color:rgba(58,59,61,1);
            display:flex;
            align-items:center;
            .text{
                margin-right: 12rpx;
            }
        }
    }
    .card-content{
        padding: 28rpx 28rpx 12rpx;
        box-sizing: border-box;
        border-bottom:1rpx solid #EBEFF8;
        .content-item{
            display: flex;
            align-content: flex-start;
            justify-content: space-between;
            font-size:28rpx;
            font-weight:400;
            color:rgba(112,113,117,1);
            margin-bottom:16rpx;
            .item-label{
                min-width:144rpx;
                text-align: left;
                margin-right: 12rpx;
            }
            .item-value{
                flex: 1;
                text-align: right;
            }
        }
    }
    .card-steps{
        padding:0 28rpx 32rpx;
        box-sizing: border-box;
        margin-top:38rpx;
    }
}

// 合同信息部分
.contract-item{
    width: 100%;
    height: 250rpx;
    border-bottom: 1rpx solid #EBEFF8;
    margin-bottom: 32rpx;
    display:flex;
    align-items:flex-start;
    image{
        width: 154rpx;
        height: 218rpx;
        margin-right: 32rpx;
    }
    .name{
        font-size:28rpx;
        line-height: 28rpx;
        font-weight:bold;
        color:rgba(58,59,61,1);
        margin-bottom: 20rpx;
    }
    .number, .date{
        font-size:24rpx;
        line-height: 34rpx;
        color:#A0A3A8;
    }
    &:last-child{
        border-bottom: none;
        margin-bottom: 0;
        height: 218rpx;
    }
}

// finance财务信息
.finance{
    .finance-head{
        height: 206rpx;
        width: 100%;
        margin-top: 22rpx;
        display: flex;
        align-items: center;
        // background: url('/static/image/details/finance.png');
        .finance-item{
            flex: 1;
            color: #fff;
            padding-left:32rpx;
            box-sizing:border-box;
            position:relative;
            .number{
                font-size: 40rpx;
                font-weight: bold;
                line-height:56rpx;
            }
            .name{
                font-size: 24rpx;
                color: #707175;
                line-height:34rpx;
            }
            &:last-child::after{
                content: '';
                position: absolute;
                left: -2rpx;
                top: 50%;
                width:4rpx;
                height:74rpx;
                background:#48494F;
                margin-top: -37rpx;
            }
        }
    }
    .finance-body{
        padding: 32rpx;
        box-sizing: border-box;
        background: #fff;
        border-bottom: 1rpx solid #EBEFF8;
        position:relative;
        .btn{
            position: absolute;
            right: 32rpx;
            bottom: 32rpx;
            width:218rpx;
            height:64rpx;
            border-radius:32rpx;
            border:2rpx solid rgba(173,180,190,1);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size:28rpx;
            color:rgba(112,113,117,1);
        }
        .body-number{
            font-size:40rpx;
            font-weight:bold;
            color:#FF6600;
            line-height:56rpx;
            &.hot{
                color:#12CB90;
            }
        }
        .body-type{
            font-size:24rpx;
            color:#707175;
            line-height:34rpx;
            margin-bottom: 28rpx;
        }
        .body-name{
            font-size:28rpx;
            color:#707175;
            line-height:40rpx;
        }
        .body-payWay{
            font-size:24rpx;
            color:#707175;
            line-height:36rpx;
            display:flex;
            align-items:center;
            margin: 16rpx 0 22rpx;
            .label{
                margin-right: 24rpx;
            }
            .pay-list{
                display:flex;
                align-items:center;
                .pay-item{
                    display: inline-block;
                    padding: 0 18rpx;
                    height:36rpx;
                    background:#F5F5F5;
                    border-radius:18rpx;
                    margin-right: 12rpx;
                }
            }
        }
        .body-date{
            font-size:24rpx;
            color:rgba(160,163,168,1);
            line-height:34rpx;
        }
    }
}
// 底部
.footer {
    width: 100%;
    height: 114rpx;
    bottom: env(safe-area-inset-bottom);
    position: fixed;
    left: 0;
    bottom: 0;
    background: #fff;
    display: flex;
    align-items: center;
    border-top: 1rpx solid #EBEFF8;
    .item{
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size:28rpx;
        color:#707175;
        height:100%;
        image{
            width: 50rpx;
            height: 48rpx;
            margin-right: 20rpx;
        }
        
    }
    .hot{
        width: 206rpx;
        border-right: 2rpx solid #EBEFF8;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size:28rpx;
        color:#707175;
        height:100%;
        image{
            width: 50rpx;
            height: 48rpx;
            margin-right: 20rpx;
        }
    }
}
</style>
