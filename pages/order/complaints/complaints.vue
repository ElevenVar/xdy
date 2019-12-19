<template>
<!--pages/order/orderComplaints/orderComplaints.wxml-->
<view class="complaintsPage">
  <view class="topHeaderBg">
    <image :src="imageBaseURL + 'order_image_complaint_background.png'"></image>
    <view class="headerContent">
      <view>订单号</view>
      <view>100654052019010112</view>
    </view>
  </view>
  <view class="lineView"></view>
  <!-- 投诉理由 -->
  <view class="complaintsReasonBg">
    <view class="inputHeaderTitle">
      <view></view>
      <text space="ensp">  您为什么想要投诉？</text>
    </view>
    <view class="inputReasonBg">
      <view>请选择投诉理由</view>
      <view>
        <image :src="imageBaseURL + 'common_more_arrow.png'"></image>
      </view>
    </view>
  </view>
  <view class="lineView"></view>
  <!-- 描述 -->
  <view class="remarkBg">
    <view class="inputHeaderTitle">
      <view></view>
      <text space="ensp">  描述</text>
    </view>
    <view class="inputRemark">
      <textarea fixed="true" placeholder="请填写详细描述，系统将指派专人进行处理。" maxlength="200" @input="myAppealChange" :value="appealContent"></textarea>
    </view>
    <view class="anonymousBg">
      <van-radio-group :value="anonymousRadio" bind:change="anonymousComplaintsAction">
        <van-radio name="1" label-class="anonymousLabel">匿名投诉</van-radio>
      </van-radio-group>
    </view>
  </view>
  <view class="lineView"></view>
  <!-- 上传图片 -->
  <view class="update">
    <text style="font-size:28rpx;font-family:PingFangSC-Regular;font-weight:400;color:rgba(58,59,61,1);line-height:100rpx;">上传附件 </text>
    <text style="font-size:28rpx;font-family:PingFangSC-Regular;font-weight:400;color:#A0A3A8;line-height:100rpx;">（图片小于20M）</text>
    <view class="updateImg" @tap="chooseImage">
      <image :src="imageBaseURL + 'icon_plus2@2x.png'"></image>
    </view>
  </view>
  <!-- 提交按钮 -->
  <view class="submit">
    <text>提交</text>
  </view>
</view>

</template>

<script>
export default {
  data() {
    return {
      imageBaseURL: this.$config.imgUrl+'order/',
      anonymousRadio: ''
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  methods: {
    // 匿名提交事件
    anonymousComplaintsAction: function (e) {
      console.log(e);
      var name = e.detail;

      if (this.anonymousRadio !== '') {
        name = '';
      }

      console.log(name);
      this.anonymousRadio = name
    },
	chooseImage() {
		uni.chooseImage({
			
		})
	}
  }
};
</script>
<style>
/* pages/order/orderComplaints/orderComplaints.css */
.complaintsPage{
  width: 100%;
}

.topHeaderBg{
  width: 100%;
  height: 180rpx;
  position: relative;
}

.topHeaderBg image{
  width: 100%;
  height: 100%;
}

.topHeaderBg .headerContent{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 180rpx;
  padding: 50rpx 32rpx;
}

.topHeaderBg .headerContent>view:first-child{
  color: white;
  font-size: 26rpx;
}

.topHeaderBg .headerContent>view:last-child{
  color: white;
  font-size: 36rpx;
  font-weight: bolder;
}

.lineView{
  width: 100%;
  height: 20rpx;
  background-color: #F5F5F5;
}

.inputHeaderTitle{
  color: #707175;
  font-size: 24rpx;
  display: block;
  position: relative;
}

.inputHeaderTitle >view:first-child{
  width: 17rpx;
  height: 17rpx;
  border-radius: 10rpx;
  background-color: #FF5644;
  display: inline-block;
}

/* 投诉理由 */
.complaintsReasonBg{
  padding: 32rpx 32rpx 20rpx 32rpx;
  background: #fff;
}

.inputReasonBg{
  width: calc(100% - 64rpx);
  height: 72rpx;
  background-color: #F5F5F5;
  margin: 20rpx 0rpx;
  display: flex;
  justify-content: space-between;
  align-content: space-between;
  line-height: 72rpx;
  font-size: 28rpx;
  color: #3A3B3D;
  padding: 0rpx 32rpx;
}

.inputReasonBg image{
  width: 15rpx;
  height: 25rpx;
  vertical-align: middle;
}

/* 描述 */
.remarkBg{
  padding: 32rpx 32rpx 20rpx 32rpx;
  background: #fff;
}

.inputRemark{
  margin: 20rpx 0rpx 0rpx 0rpx;
  background-color: #F5F5F5;
  border-radius: 5rpx;
  font-size: 28rpx;
}

.inputRemark textarea{
  padding: 30rpx 24rpx;
  color: #3A3B3D;
}

.anonymousBg{
  margin-top: 20rpx;
}

.anonymousBg .anonymousLabel{
  color: #A0A3A8;
  font-size: 28rpx;
}

/* 上传图片 */
.update{
  height: 334rpx;
  padding: 0 30rpx 0 32rpx; 
  background-color: #FFFFFF;
  margin-top: 20rpx
}
.updateImg{
  height: 210rpx;
  width: 210rpx;
  background-color: #F5F5F5;
  display: flex;
  justify-content: center;
  align-items: center;
}
.updateImg image{
  height: 66rpx;
  width:66rpx;
}

/* 提交按钮 */
.submit{
  margin: auto;
  margin-top: 48rpx;
  width:686rpx;
  height:100rpx;
  text-align: center;
  background:linear-gradient(270deg,rgba(45,220,247,1) 0%,rgba(16,197,225,1) 100%);
  border-radius:56rpx;
  /* background-color: #B4EAF2; */
  margin-bottom: 40rpx;
}

.submit text{
  font-size:32rpx;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(255,255,255,1);
  line-height:100rpx;
}
</style>