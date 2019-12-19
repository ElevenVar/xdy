<template>
<view>
<!--pages/user/setting/addAddress/addAddress.wxml-->

<view class="lineView"></view>
<view class="cell">
  <input placeholder="联系人姓名" :value="contacts" @input="nameInput"></input>
</view>
<view class="smallLineBg">
  <view class="smallLine"></view>
</view>

<view class="cell">
  <input placeholder="联系人手机号" :value="phone" @input="phoneInput" maxlength="11" type="number"></input>
</view>
<view class="smallLineBg">
  <view class="smallLine"></view>
</view>

<view class="menuCell" @tap="addressChoose">
  <text class="meunName">所在地区</text>
  <text class="menuSubName">{{chooseAddress ? chooseAddress : '请选择'}}</text>
  <image :src="imageBaseURL+'common_more_arrow.png'" class="rightArrow"></image>
</view>
<view class="smallLineBg">
  <view class="smallLine"></view>
</view>

<view class="cell detail">
  <textarea class="detail-textarea" :placeholder="placeholder" :value="address" @input="addressInput" v-if="!isHiddenTextarea"></textarea>
  <view :class="'detail-textarea detail-position ' + (address ? '' : 'detail-textColor')" v-else>{{address ? address :placeholder }}</view>
 
</view>

<view class="lineView"></view>
<view class="cell defaultAddress">
  <view>设为默认地址</view>
  <switch color="#08C5E2" :checked="defaultAddress" bindchange="swithChange"></switch>
</view>
<view class="lineView"></view>
<view class="cell deleteAddress " @click.stop="deleteAddressAction" v-if="!isAdd">
  删除地址
</view>

<view class="bottom" @tap="addAddressAction">保存</view>
<w-picker mode="region" themeColor="#10BBB8" :defaultVal="[12, 0, 11]" @confirm="confirmAction" ref="region"></w-picker>
<!-- 删除地址弹框 -->
  <!-- <van-action-sheet :show="showDelete" :actions="actions" cancel-text="取消" bind:close="onClose" bind:select="deleteAddress" bind:cancel="onClose"></van-action-sheet>

<van-popup :show="showAddress" position="bottom" bind:close="onClose">
  <van-area :area-list="areaList" title="请选择地区" bind:confirm="confirmAction" bind:cancel="cancelAction" bind:change="changeAction"></van-area>
</van-popup> -->
</view>
</template>

<script>
// pages/user/setting/addAddress/addAddress.js
import util from '@/utils/util.js';
import wPicker from '@/components/w-picker/w-picker.vue';
import { accountSet } from '@/api/index.js'
export default {
  data() {
    return {
		imageBaseURL: this.$config.imgUrl+'order/',
      contacts: '',
      // 联系人名称
      phone: '',
      // 联系人手机号
      area: '',
      city: '',
      province: '',
      address: '',
      // 地址
      defaultAddress: 0,
      //是否默认（1默认，0非默认）
      showAddress: false,
      province_list: {},
      city_list: {},
      areaList: {},
      chooseAddress: '',
      isAdd: true,
      //是否是添加地址
      itemId: '',
      //修改地址ID
      showDelete: false,
      actions: [{
        subname: '是否确认删除该地址？'
      }, {
        name: '确认',
        className: 'yes-delete'
      }],
      isHiddenTextarea: false,
      placeholder: '详细地址：如道路、门牌号、小区、楼栋号、单元室等',
      isAdding: false //正在保存中

    };
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.item) {
      let item = JSON.parse(options.item);
      let chooseAddress = item.province + item.city + item.area;
      this.setData({
        isAdd: false,
        contacts: item.contacts,
        phone: item.phone,
        chooseAddress: chooseAddress,
        address: item.address,
        itemId: item.id,
        defaultAddress: item.defaultAddress,
        province: item.province,
        city: item.city,
        area: item.area
      });
    }
  },
  components: {
    wPicker
  },
  props: {},
  methods: {
    // 地址选择
    addressChoose() {
      this.setData({
        showAddress: true,
        isHiddenTextarea: true
      });
	  this.mode = 'region';
	   this.$refs.region.show();
    },

    onClose() {
      this.setData({
        showAddress: false,
        showDelete: false
      });
      this.showTextarea();
    },

    showTextarea() {
      let that = this;
      setTimeout(() => {
        that.setData({
          isHiddenTextarea: false
        });
      }, 350);
    },

    nameInput(e) {
      this.setData({
        contacts: e.detail.value
      });
    },

    phoneInput(e) {
      this.setData({
        phone: e.detail.value
      });
    },

    addressInput(e) {
      this.setData({
        address: e.detail.value
      });
    },

    swithChange(e) {
      let defaultAddress = 0;

      if (e.detail.value) {
        defaultAddress = 1;
      }

      ;
      this.setData({
        defaultAddress
      });
    },

    // 添加地址
    addAddressAction() {
      if (this.isAdding) {
        console.log("手速不要太快");
        return;
      }

      this.isAdding = true;

      if (!this.contacts) {
        uni.showToast({
          title: "名称为空",
          icon: 'none'
        });
        return;
      }

      if (!this.phone) {
        uni.showToast({
          title: "手机号为空",
          icon: 'none'
        });
        return;
      }

      if (!this.province) {
        uni.showToast({
          title: "所在地区为空",
          icon: 'none'
        });
        return;
      }

      if (!this.address) {
        uni.showToast({
          title: "详细地区为空",
          icon: 'none'
        });
        return;
      }

      if (this.isAdd) {
        this.addAddressRequest();
      } else {
        this.updataAddressRequest();
      }
    },

    //删除地址
    deleteAddressAction() {
      this.showDelete = true
      this.isHiddenTextarea = true
      uni.showModal({
          title: '提示',
          content: '确定要删除该地址吗？',
          success: (res) => {
              if (res.confirm) {
                  uni.showLoading({title:'删除中...', mask:true})
                  this.deleteAddress() 
              } else if (res.cancel) {
                  console.log('用户点击取消');
              }
          }
      });
    },

    deleteAddress() {
      this.showDelete= false
      this.showTextarea();
      let params = {
        addressId: this.itemId
      };
      this.$http.post(accountSet.addressDel, params).then(result => {

        if (result.code == 200) {
          uni.showToast({
            title: "删除成功",
            icon: 'none'
          });
          setTimeout(() => {
            uni.navigateBack({});
          }, 1000);
        }
      });
    },

    //修改地址
    updataAddressRequest() {
      let params = {
        contacts: this.contacts,
        area: this.area,
        city: this.city,
        province: this.province,
        address: this.address,
        // 地址
        defaultAddress: this.defaultAddress,
        addressId: this.itemId
      };

      if (this.phone.indexOf("*") == -1) {
        params['phone'] = this.phone;
      }
      this.$http.post(accountSet.addressUpdate, params).then(result => {
        if (result.code == 200) {
          uni.showToast({
            title: "保存成功",
            icon: 'none'
          });
          setTimeout(() => {
            uni.navigateBack({});
          }, 1000);
        } else {
          this.isAdding = false;
        }
      });
    },

    // 新增地址
    addAddressRequest() {
      let params = {
        contacts: this.contacts,
        phone: this.phone,
        // 联系人手机号
        area: this.area,
        city: this.city,
        province: this.province,
        address: this.address,
        // 地址
        defaultAddress: this.defaultAddress
      };
      this.$http.post(accountSet.addressSave, params).then(result => {
        if (result.code == 200) {
          uni.showToast({
            title: "保存成功",
            icon: 'none'
          });
          setTimeout(() => {
            uni.navigateBack({});
          }, 1000);
        } else {
          this.isAdding = false;
        }
      });
    },

    //    地址弹窗方法
    confirmAction(e) {
	  console.log(e)
	  this.chooseAddress = e.result
	  this.province = e.checkArr[0]
	  this.city = e.checkArr[1]
	  this.area = e.checkArr[2]
      this.showTextarea();
    },

    cancelAction() {
      this.setData({
        showAddress: false
      });
      this.showTextarea();
    },

    changeAction(e) {
      let index = e.detail.index;
      let city = e.detail.values[index];

      if (index == 0) {
        // 获取城市
        this.getCityArray(city.code);
      } else if (index == 1) {
        this.getCountyArray(city.code);
      } else {}

      this.showTextarea();
    },

    getFirstKey(data) {
      for (var key in data) return key;
    },

    setData: function (obj) {
      let that = this;
      let keys = [];
      let val, data;
      Object.keys(obj).forEach(function (key) {
        keys = key.split('.');
        val = obj[key];
        data = that.$data;
        keys.forEach(function (key2, index) {
          if (index + 1 == keys.length) {
            that.$set(data, key2, val);
          } else {
            if (!data[key2]) {
              that.$set(data, key2, {});
            }
          }

          data = data[key2];
        });
      });
    }
  }
};
</script>
<style lang="scss">
/* pages/user/setting/addAddress/addAddress.css */
page{
  background-color: #F5F5F5;
  font-size: 28rpx;
}
.lineView{
  background-color: #F5F5F5;
  height: 7px;
  width: 100%;
}

.smallLineBg{
  background-color: white;
  width: 100%;
}

.smallLine{
  height: 1rpx;
  background-color: #F5F5F5;
  clear: both;
  margin-left: 15px;
  margin-right: 15px;
}
.cell{
  height: 100rpx;
  background-color: white;
  padding: 0 30rpx;
}
.cell input{
  height: 100%;
  line-height: 100%;
  
}
.detail{
  height: auto;
  padding: 20rpx 30rpx;
}
.detail-textarea{
   width: 100%;
   height: 180rpx; 
   font-size: 28rpx;
}
.detail-position{
 padding: 10rpx;
  box-sizing: border-box;
}
.detail-textColor{
  color:#999999;
}
.menuCell{
  width: 100%;
  height: 48px;
  background-color: white;
}

.meunName{
  margin-top: 13px;
  margin-left: 15px;
  color: #333333;
  float: left;
}
.menuSubName{
  margin-top: 14px;
  margin-right: 30px;
  font: 14px medium;
  color: #999999;
  text-align: right;
  float: right;
}
.rightArrow{
  width: 6px;
  height: 11px;
  position: absolute;
  right: 15px;
  margin-top: 18px;
}
.defaultAddress{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.deleteAddress{
  line-height: 100rpx;
  text-align: center;
  color: #FF5644;
}
.bottom {
  position: fixed;
  bottom: 64rpx;
  left: 30rpx;
  right: 30rpx;
  height: 100rpx;
  background: $default-color;
  border-radius: 28px;
  text-align: center;
  line-height: 100rpx;
  color: white;
  font-size: 32rpx;
}

</style>