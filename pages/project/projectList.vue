<template>
    <view class="projext page">
        <!--header-->
        <view class="tui-header-box" :style="{ height: height + 'px', background: 'rgba(0,0,0,' + opcity + ')'  }">
            <view class="tui-header" :style="{ paddingTop: top + 'px' }">
                <text class="tui-header-text" :style="{ color: opcity >= 1 ? '#fff' : 'rgba(255,255,255,' + opcity + ')' }"
                    v-if="Number(opcity)">解决方案</text>
            </view>
            <view class="tui-header-icon" :style="{ marginTop: top + 'px' }">
                <tui-icon name="arrowleft" color="#fff" @tap="back"></tui-icon>
            </view>
        </view>
        <!--header end-->
        <view class="body">
            <view class="heade-bg">
                <image src="https://tguaguastatic.dgg.net/src/images/default/dggCloudImage/solution_list_bg.png" mode=""></image>
            </view>
            <view v-if="list">
                <block v-for="(item, index) in list" :key='index'>
                    <view class="section" @tap="handleClick(item.id)">
                        <view class="index">0{{index + 1}}</view>
                        <view class="section-content" :style="{background: 'url('+item.minProListImageUrl+') center/cover no-repeat'}">
                            <view class="content-title ellipsis">{{item.solutionName}}</view>
                            <view class="content-desc two-line">{{item.solutionDescription}}</view>
                            <view class="btn">查看详情</view>
                        </view>
                    </view>
                </block>
                <dataNull :tips='tips' v-if='!list || list.length == 0'></dataNull>
                <nomore :visible='nomore' bgcolor='#201E1F'></nomore>
            </view>

            
        </view>


    </view>
</template>

<script>
    import tuiIcon from '@/components/icon/icon';
    import {
        accountSet
    } from '@/api/index.js'
    import dataNull from '@/components/null-data/null-data.vue'
    import nomore from '@/components/nomore/nomore.vue'
    export default {
        components: {
            tuiIcon,
            dataNull,
            nomore
        },
        computed: {
            altImg() {
                return this.$store.state.altImg
            }
        },
        data() {
            const imgUrl = this.$config.imgUrl
            return {
                imgUrl: imgUrl,
                tips: {
                    image: imgUrl + 'nullData/null-jiejue.png',
                    text: '抱歉，暂无解决方案!',
                    top: 40 // 距离顶部的距离
                },
                top: 0, //标题图标距离顶部距离
                height: 64, //header高度
                opcity: 0,
                page: '', // 当前页
                totalPage: '', // 总页数
                list: null,
                nomore: false, // 底部是否显示更多了
            }
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
        },
        onShow() {
            this.getList()
        },
        methods: {
            back() {
                uni.navigateBack();
            },
            handleClick(e) {
                uni.navigateTo({
                    url: '/pages/project/projectDetails?id=' + e
                })
            },
            getList(page = 1) {
                if (page == 1) {
                    uni.showLoading({
                        title: '加载中...',
                        mask: true
                    })
                }
                this.$http.get(accountSet.getSolutionList, {
                    start: page
                }).then(res => {
                    uni.hideLoading()
                    if (res.code == 200) {
                        if (page == 1) {
                            this.list = res.data.records
                            this.totalPage = res.data.totalPage
                            this.page = res.data.currentPage
                        } else {
                            this.list = this.list.concat(res.data.records)
                            this.totalPage = res.data.totalPage
                            this.page = res.data.currentPage
                        }
                    } else {
                        uni.showToast({
                            icon: 'none',
                            title: res.message
                        })
                    }
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
        onReachBottom() {
            if (this.page < this.totalPage) {
                this.getList(this.page + 1)
            } else {
                this.nomore = true
                // uni.showToast({
                //     icon: 'none',
                //     title: '没有更多数据了'
                // })
            }
        },
    }
</script>

<style lang="scss">
    ::-webkit-scrollbar {
        width: 0;
        height: 0;
        color: transparent;
    }

    .projext {
        width: 100%;
        min-height: 100vh;
        background: #201E1F;
        display: flex;
        flex-direction: column;
    }

    .body {
        flex: 1;
        overflow-y: auto;
    }

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

    // 头部背景
    .heade-bg {
        width: 100%;
        height: 470rpx;

        image {
            height: 100%;
            width: 100%;
        }
    }

    // 方案列表
    .section {
        width: 100%;
        height: 430rpx;
        padding: 32rpx;
        box-sizing: border-box;
        // background:#10BBB8;
        position: relative;

        .index {
            font-size: 80rpx;
            color: rgba(50, 50, 50, 1);
            margin-left: 12rpx;
            font-weight: bold;
			font-family: 'DIN';
        }

        .section-content {
            // width: 100%;
            height: 320rpx;
            padding: 0 32rpx;
            overflow: hidden;
            box-sizing: border-box;
            position: absolute;
            left: 32rpx;
            right: 32rpx;
            top: 105rpx;

            .content-title {
                font-size: 32rpx;
                font-weight: 600;
                color: rgba(255, 255, 255, 1);
                line-height: 44rpx;
                margin: 44rpx 0 12rpx 0;
                letter-spacing: 2rpx;
            }

            .content-desc {
                font-size: 24rpx;
                font-weight: 400;
                color: #CFD2DC;
                line-height: 34rpx;
                margin: 0 0 12rpx 0;
                letter-spacing: 2rpx;
            }

            .btn {
                width: 148rpx;
                height: 44rpx;
                background: linear-gradient(270deg, rgba(255, 131, 0, 1) 0%, rgba(255, 102, 0, 1) 100%);
                border-radius: 22rpx;
                text-align: center;
                line-height: 44rpx;
                color: #fff;
                font-size: 20rpx;
                position: absolute;
                left: 36rpx;
                bottom: 40rpx;
            }
        }
    }
</style>
