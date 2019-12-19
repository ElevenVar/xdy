<template>
	<view class="know-list-wrap">
		<!--header-->
		<view class="tui-header-box" :style="{ height: height + 'px', background: 'rgba(0,0,0,' + opcity + ')' }">
			<view class="tui-header" :style="{ paddingTop: top + 'px' }">
				<text class="tui-header-text" :style="{ color: opcity >= 1 ? '#fff' : 'rgba(255,255,255,' + opcity + ')' }" v-if="Number(opcity)">热点动态</text>
			</view>
			<view class="tui-header-icon" :style="{ marginTop: top + 'px' }"><tui-icon name="arrowleft" color="#fff" @tap="back"></tui-icon></view>
		</view>
		<!--header end-->
		<!-- 顶部banner -->
		<view class="banner-wrap" v-if="tabList && tabList.length > 0">
			<image :src="imgUrl + 'index/banner.png'" mode=""></image>
			<scroll-view
				id="tab-bar"
				class="tab-wrap"
				:scroll-x="true"
				:scroll-left="scrollLeft"
				:show-scrollbar="false"
				:scroll-with-animation='true'
			>
				<view v-for="(item, index) in tabList" :key="index" class="tab-item" @tap="changeTab(item, index)">
					<text :class="activeIndex == index ? 'active' : ''">{{ item.name }}</text>
				</view>
			</scroll-view>
		</view>
        <block v-if="listShow">
            <!-- 列表数据 -->
		<view class="list-wrap" v-if="list && list.length > 0">
				<navigator class="list-item" v-for="(item, index) in list" :key="index" :url="'/pages/knowCenter/detail/detail?id=' + item.id">
					<text class="list-item-title two-line">{{ item.articleTitle ? item.articleTitle : '' }}</text>
					<view class="list-item-info">
						<view class="list-item-left">
							<text class="list-item-dsec two-line">{{ item.articleAbstract ? item.articleAbstract : '' }}</text>
							<text class="list-item-time">{{ item.publishTime ? item.publishTime : '' }}</text>
						</view>
						<image class="list-item-img" :src="item.itemCoverUrl ? item.itemCoverUrl : ''" mode="scaleToFill"></image>
					</view>
				</navigator>
		</view>
        <dataNull v-else :tips='tips'></dataNull>
        </block>
		
	</view>
</template>

<script>
import tuiIcon from '@/components/icon/icon';
import { accountSet } from '@/api/index.js';
import dataNull from '@/components/null-data/null-data.vue'
export default {
	components: {
		tuiIcon, dataNull
	},
	data() {
        const imgUrl = this.$config.imgUrl
        return {
		imgUrl: imgUrl,
		tips: {
		    image: imgUrl + 'nullData/null-jiejue.png',
		    text: '抱歉，没有找到相关数据!',
		    top: 250 // 距离顶部的距离
            },
			top: 0, //标题图标距离顶部距离
			height: 64, //header高度
			width: '',
			opcity: 0,
			tabList: [],
			list: [],
			activeIndex: 0,
			page: 1,
			totalPage: null,
			scrollLeft: 0, // 横向滚动条的位置
			limit: 10, // 每页的显示数量
			ArticleCode: '', // 当前分类tab下的code值
            listShow: false, 
		};
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
            this.getArticleType()
        },
        methods: {
            // 切换列表
            changeTab(item, index) {
                if (this.activeIndex == index) {
                	return false;
                }else{
                    this.activeIndex = index
                    this.ArticleCode = item.code
                    this.checkCor(index)
                    this.getList(this.page, this.ArticleCode)
                }
                
            },
            // 返回上一页
            back() {
                uni.navigateBack({})
            },
            // 获取知识中心tab分类
            getArticleType() {
                let data = {
                    code: 'INFO',
                    status: 1,
                    type: 1
                }
                this.$http.get(accountSet.getArticleType, data).then(res => {
                    if (res.code == 200) {
                        this.tabList = res.data
                        this.ArticleCode = res.data ? res.data[0].code : ''
                        if(this.tabList && this.tabList.length > 0){
                            this.getList(this.page, this.ArticleCode)
                        }
                    } else {
                        uni.showToast({
                            icon: 'none',
                            title: res.message
                        })
                    }
                })
            },
            // 获取列表
            getList(page, code) {
                let data = {
                    pcode: 'INFO',
                    code: code,
                    publishPlatform: 'MINI-PROGRAM',
                    start: page,
                    limit: this.limit
                }
                uni.showLoading({
					title: '加载中...'
				});
                this.$http.get(accountSet.getArticleList, data).then(res => {
                    uni.hideLoading()
                    this.listShow = true
                    if (res.code == 200) {
                        if (this.page == 1) {
                            this.list = res.data.records
                            this.page = res.data.currentPage
                            this.totalPage = res.data.totalPage
                        } else{
                            this.list = this.list.concant(res.data.records) 
                            this.page = res.data.currentPage
                            this.totalPage = res.data.totalPage
                        }
                    } else{
                        uni.showToast({
                            icon: 'none',
                            title: res.message
                        })
                    }
                })
            },
            checkCor (cur) {
                  if(cur > 2) {
                    this.scrollLeft = cur * 60;
                  } else{
                    this.scrollLeft = 0;
                  }
                console.log(cur, this.scrollLeft);
            },
        },
        computed: {
            left() {
                if (this.activeIndex == 0) {
                    return '34rpx'
                } else if (this.activeIndex == 1) {
                    return '224rpx'
                } else if (this.activeIndex == 2) {
                    return '412rpx'
                } else if (this.activeIndex == 3) {
                    return '600rpx'
                }
            }
        },
        onReachBottom () {
          if(this.page < this.totalPage){
              this.getList(this.page + 1, this.ArticleCode)
          } else {
              uni.showToast({
                  icon:'none',
                  title:'没有更多数据了'
              })
          }
        },
        onPageScroll(e) {
            console.log(e);
            let scroll = e.scrollTop <= 0 ? 0 : e.scrollTop;
            let opcity = scroll / 60;
            if (this.opcity >= 1 && opcity >= 1) {
                return;
            }
            this.opcity = opcity;

        }
    }
</script>

<style lang="scss">
@import './list.scss';

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
		color: #ffffff;
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
</style>
