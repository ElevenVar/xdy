<template>
    <view>
        <!--pages/user/dataCenter/dataCenter.uniml-->
        <view class="hedaer">已上传资料</view>
        <view class="content" v-for="(item, index) in contentList" :key="index">
            <view class="line"></view>
            <view class="content-data">
                <view class="content-left" @click.stop="lookDetailImage" :data-image="item">
                    <image class="left-image" :src="imageBaseURL+'icon_idcard.png'" v-if="item.type == 0"></image>
                    <image class="left-image" :src="imageBaseURL+'icon_license.png'" v-else-if="item.type == 1"></image>
                    <image class="left-image" :src="imageBaseURL+'icon_drivecard.png'" v-else-if="item.type == 2"></image>
                    <image class="left-image" :src="imageBaseURL+'icon_bankcard.png'" v-else-if="item.type == 3"></image>
                    <image class="left-image" :src="imageBaseURL+'icon_test.png'" v-else></image>
                </view>
                <view class="content-middle">
                    <view class="middle-name ellipsis" v-if="!item.edit">{{item.title}}{{ item.newfilename ? item.newfilename :item.filename}}</view>
                    <view class="middle-editName" v-else>
                        <view class="middle-name middle-name-inline">{{item.title}}</view>
                        <input class="middle-name" style="color:#3A3B3D;" placeholder="请输入" :value="item.newfilename"
                            @blur="inputConfirm" @input="inputFocusAction" :data-item="item"></input>
                    </view>
                    <view class="middle-date">上传时间 {{item.filedate}}</view>
                </view>
                <view class="content-right">
                    <image class="right-image" :src="imageBaseURL + 'icon_edit.png'" @click.stop="editNameAction"
                        :data-item="item" v-if="!item.edit"></image>
                    <view v-else @click.stop="editNameAction" :data-item="item" data-save="1" class="right-save">保存</view>
                </view>
            </view>
        </view>
        <!-- 占位图 -->
        <block v-if="noData">
            <dataNull :tips='tips'></dataNull>
        </block>

        <view @click.stop="addDataAction" class="add">
            <image :src="imageBaseURL+'icon_plus@2x.png'"></image>
        </view>
    </view>
</template>

<script>
    import {accountSet} from "@/api/index.js"
    import util from '@/utils/util.js';
    import dataNull from '@/components/null-data/null-data.vue'
    export default {
        data() {
            const imgUrl = this.$config.imgUrl
            return {
            imgUrl: imgUrl,
            tips: {
                image: imgUrl + 'nullData/null-jiejue.png',
                text: '抱歉，暂无资料!',
                top: 250 // 距离顶部的距离
                },
                imageBaseURL: 'https://tguaguastatic.dgg.net/src/images/default/dggCloudImage/',
                currentType: '',
                fileId: '',
                contentList: [],
                noData: false,
                currentEditItem: {}
            };
        },
components: {
		dataNull
	},
        /**
         * 页面上拉触底事件的处理函数
         */
        onReachBottom: function() {
            uni.showToast({
                title: '没有更多数据了',
                icon: 'none'
            });
        },

        /**
         * 生命周期函数--监听页面显示
         */
        onShow: function() {
            this.initData();
        },


        onLoad: function(options) {
            let userInfo = uni.getStorageSync('userInfo');
            let fileId = 'MEMBER_' + userInfo.id;
            this.fileId = fileId
        },
        methods: {
            initData() {
                uni.showLoading({
                    mask:true, title:'加载中...'
                })
                let p = new Promise((resolve, reject) => {
                    let params = {
                        fileId: this.fileId,
                        type: 'idcard'
                    };
                    this.$http.get(accountSet.getMsgList, params).then(result => {
                        if (result.code == 200) {
                            let data = result.data;
                            console.log('res p', data);
                            for (let i of data) {
                                i.type = 0;
                                i.edit = false;
                                i.title = '身份证-';
                            }

                            resolve(data);
                        }
                    });
                });
                let p1 = new Promise((resolve, reject) => {
                    let params = {
                        fileId: this.fileId,
                        type: 'driving_license'
                    };
                    this.$http.get(accountSet.getMsgList, params).then(result => {
                        if (result.code == 200) {
                            let data = result.data;

                            for (let i of data) {
                                i.type = 1;
                                i.edit = 0;
                                i.title = '驾驶证-';
                            }

                            resolve(data);
                        }
                    });
                });
                let p2 = new Promise((resolve, reject) => {
                    let params = {
                        fileId: this.fileId,
                        type: 'motor_vehicle_driving_permit'
                    };
                    this.$http.get(accountSet.getMsgList, params).then(result => {
                        if (result.code == 200) {
                            let data = result.data;

                            for (let i of data) {
                                i.type = 2;
                                i.edit = 0;
                                i.title = '行驶证-';
                            }

                            resolve(data);
                        }
                    });
                });
                let p3 = new Promise((resolve, reject) => {
                    let params = {
                        fileId: this.fileId,
                        type: 'business_license'
                    };
                    this.$http.get(accountSet.getMsgList, params).then(result => {
                        if (result.code == 200) {
                            let data = result.data;

                            for (let i of data) {
                                i.type = 3;
                                i.edit = 0;
                                i.title = '营业执照-';
                            }

                            resolve(data);
                        }
                    });
                });
                let p4 = new Promise((resolve, reject) => {
                    let params = {
                        fileId: this.fileId,
                        type: 'bank_statement'
                    };
                    this.$http.get(accountSet.getMsgList, params).then(result => {
                        if (result.code == 200) {
                            let data = result.data;

                            for (let i of data) {
                                i.type = 4;
                                i.edit = 0;
                                i.title = '银行流水-';
                            }

                            resolve(data);
                        }
                    });
                });
                // , p1, p2, p3, p4
                Promise.all([p, p1, p2, p3, p4]).then(res => {
                    uni.hideLoading();
                    console.log('res all', res);
                    let list = [];

                    for (let i of res) {
                        list = list.concat(i);
                    } // console.log(list);


                    this.contentList = list,
                    this.noData = false

                    if (list.length == 0) {
                        this.noData = true
                    }
                });
            },

            // 输入完成
            inputConfirm(e) {
                console.log(e.detail.value);
                var currentItem = this.currentEditItem;
                currentItem.newfilename = e.detail.value;
                this.currentEditItem = currentItem
            },

            /**
             * 输入框事件
             */
            inputFocusAction (event) {
                console.log(event);
                //保存当前正在编辑的项目
                let item = event.currentTarget.dataset.item;
                this.currentEditItem = {
                        fileid: item.fileid,
                        filename: item.filename,
                        filepath: item.filepath,
                        newfilename: event.detail.value
                    }
            },

            // 保存
            editNameAction(e) {
                console.log("保存文件名");
                let item = e.currentTarget.dataset.item; //console.log(item);

                item.edit = !item.edit;

                for (let i of this.contentList) {
                    if (i.filepath == item.filepath && i.filename == item.filename) {
                        i.edit = !i.edit;
                    }
                }

                this.contentList = this.contentList

                if (!this.currentEditItem || !this.currentEditItem.filename || !this.currentEditItem.newfilename || !
                    this.currentEditItem.fileid) {
                    return;
                }

                if (this.currentEditItem && this.currentEditItem.filename != this.currentEditItem.newfilename) {
                    let params = {
                        fileId: this.currentEditItem.fileid,
                        fileName: this.currentEditItem.filename,
                        newFileName: this.currentEditItem.newfilename
                    };
                    uni.showLoading();
                    this.$http.post(accountSet.saveMsg, params).then(result => {
                        uni.hideLoading();

                        if (result.code == 200) {
                            uni.showToast({
                                title: '保存成功',
                                icon: 'none'
                            });
                            var currentItem = this.currentEditItem;
                            currentItem.filename = currentItem.newfilename;

                            for (let i of this.contentList) {
                                if (this.currentEditItem && i.filepath == this.currentEditItem.filepath) {
                                    i.filename = currentItem.filename;
                                    i.newfilename = currentItem.filename;
                                    break;
                                }
                            }

                            this.currentEditItem = currentItem,
                            this.contentList = this.contentList
                        }
                    });
                }
            },

            addDataAction() {
                let that = this;
                uni.showActionSheet({
                    itemList: ['身份证', '驾驶证', '行驶证', '营业执照', '银行流水'],
                    success: function(res) {
                        // console.log(res.tapIndex)
                        if (res.tapIndex == 0) {
                            that.currentType = 'idcard'
                        } else if (res.tapIndex == 1) {
                            that.currentType ='driving_license'
                        } else if (res.tapIndex == 2) {
                            that.currentType = 'motor_vehicle_driving_permit'
                        } else if (res.tapIndex == 3) {
                            that.currentType = 'business_license'
                        } else {
                            that.currentType = 'bank_statement'
                        }

                        that.chooseImage();
                    },
                    fail: function(res) {
                        console.log(res.errMsg);
                    }
                });
            },

            // 选择图片(上传图片)
            chooseImage() {
                uni.chooseImage({
                    count: 1,
                    sizeType: ['original', 'compressed'],
                    //可选择原图或压缩后的图片
                    sourceType: ['album', 'camera'],
                    //可选择性开放访问相册、相机
                    success: res => {
                        this.uploadImage(res.tempFilePaths[0]);
                    }
                });
            },
            uploadImage(filePath) {
                var fileId = this.fileId;
                wx.showLoading({
                    title: '上传中',
                    mask: true,
                });
                util.uploadImage(filePath, this.currentType, fileId, res=>{
                    uni.hideLoading();
                    console.log(res);
                    if (res.code == 200) {
                        uni.showToast({
                            title: '上传成功',
                            icon: 'none'
                        });
                        this.initData()
                    } else{
                        uni.showToast({
                            title: '图片上传失败',
                        });
                    }
                    
                })
            },

            /**
             * 查看图片
             */
            lookDetailImage: function(event) {
                console.log(event);
                let image = event.currentTarget.dataset.image;
                let imageURL = image.filepath;

                if (imageURL) {
                    uni.previewImage({
                        urls: [imageURL]
                    });
                }
            },
            setData: function(obj) {
                let that = this;
                let keys = [];
                let val, data;
                Object.keys(obj).forEach(function(key) {
                    keys = key.split('.');
                    val = obj[key];
                    data = that.$data;
                    keys.forEach(function(key2, index) {
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
<style>
    /* pages/user/dataCenter/dataCenter.css */

    .hedaer {
        font: 36rpx;
        color: #313131;
        height: 126rpx;
        line-height: 126rpx;
        padding-left: 30rpx;
    }

    .content {
        min-height: 152rpx;
        width: calc(100%-60rpx);
        position: relative;
        padding: 0 30rpx;
    }

    .line {
        background-color: #ebeff8;
        height: 1rpx;
        width: 100%;
    }

    .content-data {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .content-left {
        width: 96rpx;
        height: 100%;
    }

    .content-middle {
        width: calc(100% - 120rpx);
        height: 100%;
        padding: 20rpx;
        box-sizing: border-box;
        padding-top: 40rpx;
    }

    .content-right {
        width: 60rpx;
        height: 100%;
        font-size: 28rpx;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(16, 197, 225, 1);
        line-height: 40rpx;
    }

    .left-image {
        width: 96rpx;
        height: 96rpx;
        margin-top: 28rpx;
    }

    .right-image {
        margin-top: 28rpx;
        width: 24rpx;
        height: 24rpx;
        float: right;
        text-align: left;
    }

    .right-save {
        margin-top: 28rpx;
    }

    .middle-name {
        font-size: 28rpx;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(58, 59, 61, 1);
        /* line-height: 68rpx; */
        /* height: 68rpx; */
        overflow: hidden;
        text-overflow: ellipsis;
        height: 68rpx;
        line-height: 68rpx;
    }

    .middle-date {
        font-size: 24rpx;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(112, 113, 117, 1);
        line-height: 34rpx;
    }

    .middle-editName {
        min-height: 68rpx;
        display: flex;
        align-content: flex-start;
    }

    .middle-editName input {
        display: inline-block;
        height: 68rpx;
        font-size: 28rpx;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(173, 180, 190, 1);
        line-height: 68rpx;
    }

    .middle-name-inline {
        display: inline-block;
        line-height: 68rpx;
        height: 68rpx;
    }

    .add {
        position: fixed;
        width: 120rpx;
        height: 120rpx;
        bottom: 70rpx;
        text-align: center;
        left: calc(50% - 60rpx);
    }

    .add image {
        height: 120rpx;
        width: 120rpx;
    }
</style>
