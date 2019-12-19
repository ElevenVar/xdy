<template>
    <view class="page-my">
		
			<!-- <web-view src="http://172.16.75.2:13001/productDetails/1910129237?platform=qidabao"></web-view> -->
        <!-- S 顶部 -->
        <view class="info--order-warp">
            <!-- 个人信息 -->
            <view class="info-warp">
                <view class="info" @tap="loginTap">
                    <view class="head-portrait">
                        <image class="img" :src="avatarUrl"></image>
                    </view>
                    <view class="basic">
                        <view class="nickname">{{nickName}}</view>
                    </view>
                    <image class="qr-code" :src="imgUrl + 'my/qr-code.png'" v-if="isQrCode" @tap.stop="qrCodeTap">
                    </image>
                </view>
            </view>

            <!-- 订单 -->
            <view class="order">
                <view class="tui-classify-box">
                    <view class="tui-classify-item" @tap="pageJumps('../../order/order/order?status=UN_PAY',1)">
                        <image :src="imgUrl+ 'my/tb1.png'" class="tui-classify-img" />
                        <view class="tui-classify-name">待付款</view>
                    </view>
                    <view class="tui-classify-item" @tap="pageJumps('../../order/order/order?status=SERVICING',1)">
                        <image :src="imgUrl+ 'my/tb2.png'" class="tui-classify-img" />
                        <view class="tui-classify-name">服务中</view>
                    </view>
                    <view class="tui-classify-item" @tap="pageJumps('../../order/order/order?status=FINISHED',1)">
                        <image :src="imgUrl+ 'my/tb3.png'" class="tui-classify-img" />
                        <view class="tui-classify-name">已结项</view>
                    </view>
                    <view class="tui-classify-item" @tap="pageJumps('../../order/order/order?status=REFUND',1)">
                        <image :src="imgUrl+ 'my/tb4.png'" class="tui-classify-img" />
                        <view class="tui-classify-name">退款/售后</view>
                    </view>
                    <view class="tui-classify-item" @tap="pageJumps('../../order/order/order?status=ALL',1)">
                        <image :src="imgUrl+ 'my/tb5.png'" class="tui-classify-img" />
                        <view class="tui-classify-name">全部订单</view>
                    </view>
                </view>
            </view>
        </view>
        <!-- E 顶部 -->

        <!-- S 主体 -->
        <view class="content">
            <!-- 我的礼品 -->
            <view class="list-view">
                <tui-list-cell :arrow="true" class="tui-list" :last='true' @tap="pageJumps('../coupon/coupon',1)">
                    <image :src="imgUrl+ 'my/yhq.png'" class="logo" mode="widthFix"></image>
                    <text class="tui-list-cell-name">我的优惠券</text>
                    <view class="tui-right">{{couponCount ? couponCount : ''}}</view>
                </tui-list-cell>
                <!-- <tui-list-cell 
					:arrow="true" 
					class="tui-list" 
					:last='true'
					@tap="pageJumps('../gift/gift')">
					<image :src="imgUrl+ 'my/lpq.png'" class="logo" mode="widthFix"></image>
					<view class="tui-list-cell-name">我的礼品券</view>
				</tui-list-cell> -->
            </view>

            <!-- 我的基本信息 -->
            <view class="list-view">
                <tui-list-cell :arrow="true" class="tui-list" @click="pageJumps('/pages/messageCenter/messageCenter',1)">
                    <image :src="imgUrl+ 'my/zl.png'" class="logo" mode="widthFix"></image>
                    <text class="tui-list-cell-name">我的资料</text>
                </tui-list-cell>
                <tui-list-cell :arrow="true" class="tui-list" :last='true' @click="pageJumps('/pages/company/company',1)">
                    <image :src="imgUrl+ 'my/qy.png'" class="logo" mode="widthFix"></image>
                    <view class="tui-list-cell-name">我的企业</view>
                </tui-list-cell>
                <!-- <tui-list-cell :arrow="true" class="tui-list">
					<image :src="imgUrl+ 'my/ht.png'" class="logo" mode="widthFix"></image>
					<view class="tui-list-cell-name">我的合同</view>
				</tui-list-cell> -->
                <!-- <tui-list-cell :arrow="true" class="tui-list" @click="pageJumps('/pages/my/like/like',1)">
                    <image :src="imgUrl+ 'my/gz.png'" class="logo" mode="widthFix"></image>
                    <view class="tui-list-cell-name">我的关注</view>
                </tui-list-cell> -->
                <!-- <tui-list-cell :arrow="true" class="tui-list" :last='true'>
					<image :src="imgUrl+ 'my/yq.png'" class="logo" mode="widthFix"></image>
					<view class="tui-list-cell-name">邀请记录</view>
				</tui-list-cell> -->
            </view>

            <!-- 我的消息 -->
            <view class="list-view">
                <tui-list-cell :arrow="true" class="tui-list" @click="pageJumps('/pages/message/message',1)">
                    <image :src="imgUrl+ 'my/xx.png'" class="logo" mode="widthFix"></image>
                    <text class="tui-list-cell-name">消息</text>
                    <tui-badge type="danger" class="tui-right" v-if="msgCount">{{msgCount ? msgCount : 0}}</tui-badge>
                </tui-list-cell>
                <tui-list-cell :arrow="true" class="tui-list">
                    <image :src="imgUrl+ 'my/kh.png'" class="logo" mode="widthFix"></image>
                    <button class="tui-list-cell-name bttn" open-type="contact">客户服务</button>
                </tui-list-cell>
                <!-- <tui-list-cell :arrow="true" class="tui-list" @click="pageJumps('/pages/helpCenter/helpCenter',0)">
					<image :src="imgUrl+ 'my/bz.png'" class="logo" mode="widthFix"></image>
					<view class="tui-list-cell-name">帮助中心</view>
				</tui-list-cell> -->
                <tui-list-cell :arrow="true" class="tui-list" @click="pageJumps('/pages/accountSetting/accountSetting',1)"
                    :last='true'>
                    <image :src="imgUrl+ 'my/sz.png'" class="logo" mode="widthFix"></image>
                    <view class="tui-list-cell-name">设置</view>
                </tui-list-cell>

            </view>
        </view>
        <!-- E 主体 -->

        <!-- S 我的信息二维码 -->
        <tui-modal class="modal-qrcode" :show="modalQr" @cancel="hideCancel" :custom="true">
            <view class="tui-modal-qrcode">
                <view class="head">
                    我的二维码
                    <tui-icon @click.stop="closeModle" class="icon" name="close-fill" :size='26' color='rgba(184,184,184,1)'>
                    </tui-icon>
                </view>
                <view class="body">
                    <canvas :style="{width:qrcode_w+'px', height:qrcode_w+'px'}" :canvas-id="'userInfoQrcode'"></canvas>
                </view>
                <view class="footer">当您到达公司前台，请出示此二维码</view>
            </view>
        </tui-modal>
        <!-- E 我的信息二维码 -->
    </view>
</template>

<script>
    import tuiIcon from "@/components/icon/icon"
    import tuiListCell from "@/components/list-cell/list-cell"
    import tuiBadge from "@/components/badge/badge"
    import tuiModal from "@/components/modal/modal"

    import util from "@/utils/util.js"
    import qrCode from "@/utils/weapp-qrcode.js"
    import {accountSet} from "@/api/index.js"

    export default {
        name: "pageMy",
        components: {
            tuiIcon,
            tuiListCell,
            tuiBadge,
            tuiModal
        },
        data() {
            const imgUrl = this.$config.imgUrl;
            return {
                imgUrl: imgUrl,
                isQrCode: false,
                modalQr: false,
                qrcode_w: uni.upx2px(380),
                avatarUrl: '',
                nickName: '',
                msgCount: null, // 消息数量
                couponCount: null, //优惠券数量
            }
        },
        onShow() {
            const hest = this.$config.imgUrl + 'my/tx.png';
            if (uni.getStorageSync("token")) {
                const userInfo = uni.getStorageSync("userInfo");
                this.isQrCode = true;
                this.avatarUrl = userInfo.avatarUrl ? userInfo.avatarUrl : hest;
                this.nickName = userInfo.nickName ? userInfo.nickName : '顶呱呱用户';
                // this.getAccount()
            } else {
                this.avatarUrl = hest;
                this.nickName = '未登录';
            }
        },
        methods: {
            hideCancel() {
                // 关闭弹框
                this.modalQr = false;
            },
            closeModle() {
                // 点击X - 关闭弹框
                this.hideCancel();
            },
            // 获取数量统计
            getAccount() {
                let data = {
                    "queryItem": ["coupon", "msg"],
                    "msg": {
                        "readStatus": 1
                    }
                }
                uni.showLoading({
					title: '加载中...'
				});
                this.$http.post(accountSet.getAccount, data,{header: {
                      "Content-Type": "application/json"
                    }}).then(res => {
                    uni.hideLoading()
                    if (res.code == 200) {
                        console.log(res.data);
                        let msgCount = ''
                        let couponCount = ''
                        res.data.msg.forEach(el => {
                            msgCount += el.count
                        })
                        this.couponCount = res.data.coupon.all
                        this.msgCount = msgCount
                    } else {
                        uni.showToast({
                            icon: 'none',
                            title: res.message
                        })
                    }
                })
            },
            async qrCodeTap() {
                // 打开弹框
                let text_qrcode = '';
                let qrImg = '';
                uni.showLoading({
                    title: '正在生成二维码',
                    mask: true
                });
                const res = await this.$http.get(accountSet.getCodeContent);
                if (res.code == 0) {
                    text_qrcode = res.data.codeData;
                    qrImg = res.data.logo;
                	new qrCode('userInfoQrcode', {
                	    text: text_qrcode,
                	    width: this.qrcode_w,
                	    height: this.qrcode_w,
                	    colorDark: "#333333",
                	    colorLight: "#FFFFFF",
                	    correctLevel: qrCode.CorrectLevel.H
                	});
                	this.modalQr = true;
                } else {
                    uni.showToast({
                        icon: 'none',
                        title: '获取二维码信息失败'
                    })
                    return
                }
                
                uni.hideLoading();

            },
            async pageJumps(url_parameter, isLogin) {
                /*
                 * @parameter url_parameter 跳转链接
                 * @parameter isLogin 是否登录 1 登录 0 不需要登录
                 * 页面跳转
                 */
                if (isLogin == 1) {
                    const res = await util.checkUserIsLogin();
                    if (res.code == 200) {
                        uni.navigateTo({
                            url: url_parameter
                        });
                    } else {
                        uni.showToast({
                            title: res.msg,
                            icon: 'none',
                            mask: true
                        })
                        setTimeout(() => {
                            uni.navigateTo({
                                url: '/pages/login/login'
                            })
                        }, 1000)
                    }
                } else {
                    uni.navigateTo({
                        url: url_parameter
                    });
                }
            },
            async loginTap() {
                // 登录
                const res = await util.checkUserIsLogin();
                if (res.code != 200) {
                    uni.showToast({
                        title: res.msg,
                        icon: 'none',
                        mask: true
                    })
                    setTimeout(() => {
                        uni.navigateTo({
                            url: '/pages/login/login'
                        })
                    }, 1000)
                } else {
                    uni.navigateTo({
                        url: '/pages/accountSetting/personalDetails/personalDetails'
                    });
                }
            }
        }
    }
</script>

<style scoped>
    .tui-list-cell-name {
        padding-left: 20upx;
        vertical-align: middle;
        line-height: 30upx;
    }

    .tui-list>>>.tui-list-cell::after {
        left: 94upx !important
    }

    .modal-qrcode>>>.tui-modal-box {
        padding: 0;
    }

    .tui-right {
        margin-left: auto;
        margin-right: 34upx;
        font-size: 32upx;
        line-height: 1;
        color: #565656;
    }

    .tui-list-cell-name {
        padding-left: 20rpx;
        vertical-align: middle;
        line-height: 30rpx;
        color: #565656;
        font-size: 28rpx;
        font-family: PingFang SC;

    }

    .tui-list-cell-name.bttn {
        text-align: left;
        width: 100%;
        height: 100%;
        line-height: 100rpx;
        background: #fff;
        position: static;
    }

    .logo {
        height: 48rpx;
        width: 48rpx;
    }
</style>
<style lang="scss" scoped>
    .page-my {
        .info--order-warp {
            height: 453rpx;
            background: rgba(255, 255, 255, 1);
            border-radius: 0rpx 0rpx 24rpx 24rpx;

            .info-warp {
                padding: 32rpx;

                .info {
                    position: relative;
                    height: 240rpx;
                    background-image: url("https://dgg-xiaodingyun.oss-cn-beijing.aliyuncs.com/xdy-xcx/my/info_bj.png");
                    background-size: 100% 100%;
                    background-repeat: no-repeat;
                    border-radius: 16rpx;

                    .head-portrait {
                        width: 146rpx;
                        height: 146rpx;
                        background: rgba(255, 255, 255, 0.3);
                        border-radius: 50%;
                        position: absolute;
                        left: 48rpx;
                        top: 50%;
                        margin-top: -73rpx;

                        .img {
                            width: 130rpx;
                            height: 130rpx;
                            border-radius: 50%;
                            position: relative;
                            left: 50%;
                            top: 50%;
                            margin-left: -65rpx;
                            margin-top: -65rpx;
                        }
                    }
                }

                .basic {
                    padding-left: 220rpx;
                    padding-top: 100rpx;

                    .nickname {
                        font-size: 32rpx;
                        font-weight: bold;
                        color: rgba(255, 255, 255, 1);
                    }

                    .member {
                        padding: 0 16rpx;
                        height: 40rpx;
                        line-height: 40rpx;
                        background: rgba(0, 0, 0, 0.12);
                        border-radius: 20rpx;
                        font-weight: bold;
                        color: rgba(255, 255, 255, 1);
                        font-size: 24rpx;
                        display: inline-flex;
                        align-items: center;

                        .iocn {
                            width: 30rpx;
                            height: 26rpx;
                            margin-right: 8rpx;
                        }
                    }
                }

                .qr-code {
                    position: absolute;
                    right: 48rpx;
                    top: 50%;
                    margin-top: -24rpx;
                    width: 48rpx;
                    height: 48rpx;
                }

                .sign-in {
                    position: absolute;
                    right: 0;
                    top: 50%;
                    margin-top: -28rpx;
                    width: 186rpx;
                    height: 56rpx;
                    line-height: 56rpx;
                    background: linear-gradient(90deg, rgba(147, 233, 238, 1) 0%, rgba(79, 204, 204, 1) 100%);
                    border-radius: 28rpx 0rpx 0rpx 28rpx;
                    color: rgba(255, 255, 255, 1);
                    font-size: 26rpx;
                    padding-left: 24rpx;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    box-sizing: border-box;

                    .iocn {
                        margin-right: 8rpx;
                        width: 28rpx;
                        height: 26rpx;
                    }
                }
            }

            .order {
                .tui-classify-box {
                    width: 100%;
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    justify-content: space-between;
                    padding-top: 18rpx;
                    background-color: #fff;
                }

                .tui-classify-item {
                    width: 20%;
                    text-align: center;
                }

                .tui-classify-img {
                    width: 48rpx;
                    height: 48rpx;
                }

                .tui-classify-name {
                    font-size: 24rpx;
                    line-height: 26rpx;
                    padding-top: 16rpx;
                    color: #252525;
                    white-space: nowrap;
                }
            }
        }

        .content {
            padding: 16rpx 32rpx;

            .list-view {
                margin-bottom: 16rpx;
                overflow: hidden;
                border-radius: 12rpx;

                &:last-child {
                    margin-bottom: 0;
                }
            }
        }
    }

    /* 我的二维码个人信息
	---------------------------------------------------------------- */
    .tui-modal-qrcode {
        .head {
            height: 100rpx;
            line-height: 100rpx;
            font-weight: 600;
            color: #252525;
            font-size: 32rpx;
            text-align: center;
            position: relative;

            .icon {
                position: absolute;
                top: 50%;
                right: 32rpx;
                transform: translate(0, -50%);
            }
        }

        .body {
            canvas {
                display: block;
                margin: 0 auto 60rpx;
            }
        }

        .footer {
            height: 90rpx;
            line-height: 90rpx;
            text-align: center;
            box-shadow: 0px -1px 0px 0px rgba(215, 216, 217, 1);
            font-size: 28rpx;
            color: #878787;
        }
    }
</style>
