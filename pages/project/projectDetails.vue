<template>
    <view class="">
        <view class="solutionListPage">
            <view class="headerBg">
                <image mode="scaleToFill" src="https://fastdfs.dgg.net/group9/M00/2F/72/CgIBv11UwUmEfeg8AAAAADgGlek66.jpeg"></image>
                <view class="headerInfo">
                    <view class="title ellipsis"><text>{{details.solution_name}}</text></view>
                    <view class="content two-line" style="-webkit-line-clamp: 5"><text>{{details.silution_description}}</text></view>
                </view>
            </view>

            <!-- 专家列表 -->
            <view class="speciaList">
                <view class="speciaList-grid" v-for="(item, index) in details.expert_list.records" :key="index" @click.stop="specialistDetail(item.id)">
                    <view class="leftImage">
                        <image :src="item.headshot_url"></image>
                        <view>{{ item.expert_tag }}</view>
                    </view>
                    <view class="listRightInfo">
                        <view class="title">
                            <view class="title-name">
                                <text>{{ item.expert_name }}</text>
                            </view>
                            <view
                                class="title-year title-name"
                                style="background:url('https://tguaguastatic.dgg.net/src/images/default/dggCloudImage/solution_year.png') center/100% 100% no-repeat"
                            >
                                <text class="title-year-num">{{ item.expire_date }}</text>
                                <text>{{ item.expert_domain }}{{ item.expire_date }}年</text>
                            </view>
                        </view>
                        <view class="content">
                            <text>{{ item.expert_abstract }}</text>
                        </view>

                        <view class="bottomView">
                            <view class="personField">
                                <view class="text">擅长:</view>
                                <view class="tab-box">
                                    <text class='tab-item' space="nbsp" v-for="(items, index) in item.skill_tag" :key="index">{{ items }}</text>
                                </view>
                            </view>
                        </view>
                        <view class="bottomView bottomView-expert" @click.stop="expertAction(item)">预约专家</view>
                    </view>

                    <view class="bottom-line"></view>
                </view>
            </view>
            <!-- <view class="bottom">已经到底了哦...</view> -->
            <!-- 占位图 -->

            <view class="fixed-phone" @tap="phoneCallAction"><image src="https://tguaguastatic.dgg.net/src/images/default/dggCloudImage/order_icon_customer.png"></image></view>
        </view>
    </view>
</template>

<script>
import tuiIcon from '@/components/icon/icon';
import {accountSet} from '@/api/index.js'
export default {
    components: {
        tuiIcon
    },
    data() {
        return {
            id: '',
            details: null,
        };
    },
    onLoad(e) {
        this.id = e.id
        this.getData(this.id)
    },
    onShow() {
        
    },
    methods:{
        // 初始化数据
        getData(id){
            uni.showLoading({
                title: '加载中...',
                mask: true
            })
            this.$http.get(accountSet.getSolutionDetail, {id}).then(res => {
                uni.hideLoading()
                if (res.code == 200) {
                    this.details = res.data
                    // this.speciaList = res.data.expert_list.records
                } else{
                    uni.showToast({
                        icon:'none',
                        title:res.message
                    })
                }
            })
        },
        // 专家主页
        specialistDetail(e){
            uni.navigateTo({
                url:'/pages/project/specialistDetail?id=' + e
            })
        },
        // 预约专家
        expertAction(e){
            let obj = {
                 name: e.expert_name,
                 tag: e.expert_tag,
                 date: e.expert_domain + e.expire_date
             }
            uni.setStorageSync('expertMsg', obj)
           uni.navigateTo({
               url:'/pages/project/makeSpecialist'
           }) 
        },
        phoneCallAction() {
            uni.makePhoneCall({
              phoneNumber: this.$store.state.serverTel
            })
          },
    }
};
</script>

<style lang="scss">
    .solutionListPage{
      background-color: white;
      overflow-x: hidden;
      max-width: 100%;
    }
    .headerBg {
      width: 100%;
      height: 500rpx;
      position: relative;
    }
    
    .headerBg image {
      width: 100%;
      height: 100%;
      z-index: 0;
    }
    
    .headerInfo {
      position: absolute;
      overflow: hidden;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      padding: 20rpx;
    }
    
    .headerInfo .title {
      margin-top: 80rpx;
      color: white;
      font-size: 40rpx;
      font-family: PingFangSC-Regular;
      font-weight: 400;
    }
    .title-name{
      /* height: 50rpx; */
      /* display: block; */
    overflow: hidden;
    white-space: nowrap;
    text-overflow:ellipsis;
    
    }
    .headerInfo .content {
      margin-top: 20rpx;
      font-size: 14px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(213, 220, 233, 1);
      max-width: calc(100% - 40rpx);
      max-height: 210rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 5;
    }
    
    /* 专家列表 */
    
    .speciaList {
      width: 100%;
    }
    
    .speciaList-grid {
      min-height: 300rpx;
      padding: 40rpx 20rpx;
      box-sizing: border-box;
      display: flex;
      display: -webkit-flex;
      position: relative;
    }
    .speciaList-grid:last-child{
        .bottom-line{
            display: none;
        }
    }
    .speciaList-grid .leftImage {
      width: 160rpx;
      height: 160rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      border-top-left-radius: 5rpx;
      border-top-right-radius: 5rpx;
    }
    
    .speciaList-grid .leftImage image {
      width: 140rpx;
      height: 140rpx;
    }
    
    .speciaList-grid .leftImage view {
      background: linear-gradient(180deg, rgba(237, 213, 158, 1) 0%, rgba(222, 177, 107, 1) 100%);
      border-radius: 4rpx;
      font-size: 18rpx;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      width: 100%;
      text-align: center;
      height: 30rpx;
      line-height: 30rpx;
    }
    
    .listRightInfo {
      width: 510rpx;
      height: 100%;
      overflow: hidden;
      padding-left: 20rpx;
    }
    
    .listRightInfo >view {
      width: 100%;
    }
    
    .listRightInfo .title {
      font-size: 32rpx;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color: #3a3b3d;
      display: flex;
      justify-content: space-between;
      height: 50rpx;
      line-height: 50rpx;
    }
    
    .listRightInfo .title-year {
      font-size: 20rpx;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(58, 59, 61, 1);
      line-height: 50rpx;
      width: 200rpx;
    }
    
    .listRightInfo .title-year-num {
      font-size: 24rpx;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color: rgba(243, 216, 158, 1);
      line-height: 40rpx;
      width: 45rpx;
      display: inline-block;
      text-align: center;
    }
    
    .listRightInfo .title .personFieldLabel {
      color: white;
      background-color: gray;
      margin: 0rpx 10rpx;
      border-radius: 5rpx;
      padding: 0rpx 5rpx;
      font-size: 26rpx;
    }
    
    .listRightInfo .title .personFieldYeasNumber {
      font-size: 38rpx;
    }
    
    .listRightInfo .content {
      font-size: 24rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      margin: 10rpx 0 20rpx;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(112, 113, 117, 1);
      max-height: 76rpx;
    }
    
    .bottomView {
      /* position: absolute; */
      bottom: 20rpx;
      min-height: 60rpx;
      width: 100%;
      display: flex;
      display: -webkit-flex;
      overflow: hidden;
    }
    
    .bottomView .personField {
        font-size: 24rpx;
        color: #A0A3A8;
        line-height: 40rpx;
        display:flex;
        align-items:flex-start;
        .text{
            width: 60rpx;
            margin-right: 8rpx; 
        }
        .tab-box{
            flex: 1;
            display:flex;
            align-items:center;
            flex-wrap:wrap;
            .tab-item{
                padding: 0 16rpx;
                min-height: 40rpx;
                margin-bottom: 20rpx;
                margin-right: 16rpx;
                line-height: 40rpx;
                background: #F1F1F1;
            }
        }
    }
    
    .bottomView .subscribeButton {
      width: 200rpx;
      height: calc(100% - 4rpx);
      text-align: center;
      line-height: 60rpx;
      border: 1rpx cyan solid;
      color: cyan;
      font-size: 32rpx;
    }
    
    
    .bottomView .personField >text:first-child {
      margin-left: 0rpx;
      padding: 0rpx;
      background-color: white;
      color: gray;
    }
    
    .bottomView-expert {
      background: #10BBB8;
      border-radius: 8rpx;
      font-size: 28rpx;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 60rpx;
      display: flex;
      justify-content: center;
      margin-top:10rpx;
    }
    .bottom-line{
      position: absolute;
      background-color: #EBEFF8;
      height: 2rpx;
      bottom: 0;
      left: 34rpx;
      right: 34rpx;
    }
    
    .bottom {
      font-size: 24rpx;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(173, 180, 190, 1);
      height: 120rpx;
      line-height: 120rpx;
      text-align: center;
      background-color: #f5f5f5;
    }
    .fixed-phone{
      position: fixed;
      bottom: 0;
      right: 0;
      width: 100rpx;
      height: 100rpx;
      border-top-left-radius: 100rpx;
      background-color: white;
    }
    .fixed-phone image{
      width: 50rpx;
      height: 50rpx;
      position: absolute;
      top: 40rpx;
      left: 40rpx;
    }

</style>
