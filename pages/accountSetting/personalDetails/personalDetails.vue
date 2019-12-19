<template>
    <view class="personalDetails">
        <view class="list-view">
            <tui-list-cell :arrow="true" class="tui-list" @click="userChangeHeadAction">
                <text class="tui-list-cell-name">头像</text>
                <view class="image"><image :src="obj.avatarUrl ? obj.avatarUrl : altImg" mode="widthFix"></image></view>
            </tui-list-cell>
            <tui-list-cell>
                <text class="tui-list-cell-name">昵称</text>
                <view class="tui-right hot">
                    <input type="text" :value="obj.nickName" @input='handleChange' />
                </view>
            </tui-list-cell>
            <!--  <tui-list-cell @click="handleJump('姓名')">
                <text class="tui-list-cell-name">姓名</text>
                <view class="tui-right hot">
                    <input type="text" :value="obj.name" />
                </view>
            </tui-list-cell> -->
            <tui-list-cell :arrow="true">
                <text class="tui-list-cell-name">性别</text>
                <view class="tui-right">
                    <!-- {{ obj.sex ? obj.sex : '暂无' }} -->
                    <picker @change="handleSex" :value="obj.sexName" :range="sexArray" range-key='name' class="picker">
                        <view class="uni-input">{{ obj.sexName ? obj.sexName : '暂无' }}</view>
                    </picker>
                </view>
            </tui-list-cell>
            <tui-list-cell :arrow="true">
                <text class="tui-list-cell-name">年龄</text>
                <view class="tui-right">
                    <picker @change="handleAge" :value="obj.age" :range="ageArray" class="picker">
                        <view class="uni-input">{{ obj.age ? obj.age : '暂无' }}</view>
                    </picker>
                </view>
            </tui-list-cell>
            <!-- <tui-list-cell @click="handleJump('邮箱')">
                <text class="tui-list-cell-name">邮箱</text>
                <view class="tui-right hot"><input type="text" :value="obj.email" /></view>
            </tui-list-cell> -->
            <!--  <tui-list-cell :arrow="true" :last="true" @click="handleAddress">
                <text class="tui-list-cell-name">所在地</text>
                <text class="tui-right">{{ obj.address }}</text>
            </tui-list-cell> -->
            <view class="btn" @tap="handleSubmit">
                保存
            </view>
            <!-- // 地区 -->
            <!-- <w-picker mode="region" themeColor="#10BBB8" :defaultVal="[12, 0, 11]" @confirm="onConfirm" ref="region"></w-picker> -->
            <!-- // 性别 -->
            <!-- <w-picker v-if="sexArray.length != 0" mode="selector" :defaultVal="[1]" @confirm="onConfirm" ref="selector" themeColor="#10BBB8" :selectList="sexArray"></w-picker> -->
            <!-- // 年龄 -->
            <!-- <w-picker mode="selector" :defaultVal="[1]" @confirm="onConfirmAge" ref="age" themeColor="#10BBB8" :selectList="ageArray"></w-picker> -->
        </view>
    </view>
</template>

<script>
    import tuiIcon from '@/components/icon/icon';
    import tuiListCell from '@/components/list-cell/list-cell';
    import tuiBadge from '@/components/badge/badge';
    import wPicker from '@/components/w-picker/w-picker.vue';
    import util from '@/utils/util.js';
    import {
        accountSet,
        user
    } from '@/api/index.js'
    export default {
        components: {
            tuiIcon,
            tuiListCell,
            tuiBadge,
            wPicker
        },
        computed: {
            ageArray: () => {
                let arr = []
                for (let i = 1; i < 100; i++) {
                    arr.push(i)
                }
                return arr
            },
            altImg (){
                return this.$store.state.altImg
            }
        },
        data() {
            const userInfo = uni.getStorageSync('userInfo')
            return {
                mode: '',
                img: `${this.$config.imgUrl}mall/product/1.jpg`,
                sexArray: [],
                obj: userInfo
            };
        },
        onShow() {
            this.getAge()
        },
        methods: {
            onConfirm(val) {
                console.log(val);
                //如果页面需要调用多个mode类型，可以根据mode处理结果渲染到哪里;
                switch (this.mode) {
                    case 'selector':
                        this.obj.sex = val.result;
                        break;
                    case 'region':
                        let arr = val.checkArr;
                        this.obj.address = arr[0] + ' ' + arr[1] + ' ' + arr[2];
                        break;

                }
                // this.resultInfo=val;
            },
            onConfirmAge(val) {
                switch (this.mode) {
                    case 'selector':
                        this.obj.age = val.result;
                        break;

                }
            },
            handleAddress() {
                this.mode = 'region';
                this.$refs.region.show();
            },
            handleSex(e) {
                console.log(e);
                Object.assign(this.obj, {
                    sex: this.sexArray[e.detail.value]['code']
                })
                Object.assign(this.obj, {
                    sexName: this.sexArray[e.detail.value]['name']
                })
                console.log(this.obj.sex, this.obj.sexName);
            },
            handleAge(e) {
                this.obj.age = this.ageArray[e.target.value]
                console.log(this.obj.age);
                // Object.assign(this.obj, {age: this.ageArray[e.target.value]} )
            },
            handleChange(e) {
                console.log(e);
                this.obj.nickName = e.detail.value
            },
            // 获取性别
            getAge() {
                this.$http.get(accountSet.getSex).then(res => {
                    if (res.code == 200) {
                        this.sexArray = res.data
                        if (this.obj.sex) {
                            this.sexArray.forEach(el => {
                                if (this.obj.sex == el.code) {
                                    Object.assign(this.obj, {
                                        sexName: el.name
                                    })
                                }
                            })
                        } else {
                            Object.assign(this.obj, {
                                sexName: '暂无'
                            })
                        }
                    } else {
                        uni.showToast({
                            title: res.message,
                            icon: 'none'
                        })
                    }
                })
            },
            // 修改信息
            handleSubmit() {
                console.log(this.obj);

                this.$http.post(accountSet.updateMsg, this.obj).then(res => {
                    console.log(res);
                    if (res.code == 200) {
                        uni.showToast({
                            title: '更改成功',
                            icon: 'none'
                        })
                        uni.setStorageSync('userInfo', res.data.userInfo)
                        this.Timeout = setTimeout(() => {
                            uni.navigateBack()
                        }, 1000);

                    } else {
                        uni.showToast({
                            title: res.message,
                            icon: 'none'
                        })
                    }
                })
            },
            /**
             * 用户点击更换头像
             */
            userChangeHeadAction() {
                var vm = this;
                uni.chooseImage({
                    count: 1,
                    sizeType: ['original', 'compressed'],
                    sourceType: ['album', 'camera'],
                    success: function(res) {
                        console.log(res);
                        var chooseImagePath = res.tempFilePaths[0];
                        console.log("图片地址：" + chooseImagePath);
                        vm.uploadUserChooseHeaderImage(chooseImagePath);
                    },
                });
            },

            /**
             * 上传图片 
             */
            uploadUserChooseHeaderImage(filePath) {
                var fileId = this.obj.id;
                wx.showLoading({
                    title: '上传中',
                    mask: true,
                });
                util.uploadImage(filePath, 'member_header', fileId, res=>{
                    uni.hideLoading();
                    console.log(res);
                    if (res.code == 200) {
                        this.obj.avatarUrl = res.data.filepath
                    } else{
                        uni.showToast({
                            title: '图片上传失败',
                        });
                    }
                    
                })
            },
        },
        onHide() {
            clearTimeout(this.Timeout)
        }
    };
</script>

<style scoped>
    .tui-right {
        margin-left: auto;
        margin-right: 32rpx;
        font-size: 28rpx;
        line-height: 1;
        color: #252525;
        font-weight: 500;
        flex: 1;
        text-align: right;
    }

    .tui-right.hot {
        margin-right: 0;
    }

    .tui-list>>>.tui-list-cell {
        height: 160rpx !important;
    }

    .image {
        width: 84rpx;
        height: 84rpx;
        display: block;
        overflow: hidden;
        border-radius: 50%;
        margin-left: auto;
        margin-right: 34rpx;
    }
    .image image{
        width: 100%;
        height: 100%;
    }
    .tui-list-cell-name {
        /* padding-left: 20rpx; */
        vertical-align: middle;
        line-height: 30rpx;
        color: #565656;
        font-weight: bold;
        font-size: 28rpx;
    }

    input {
        font-size: 28rpx;
        font-weight: 500;
        color: #252525;
    }

    .input-placeholder {
        font-size: 28rpx;
        font-weight: 500;
        color: #878787;
    }

    .btn {
        width: 686rpx;
        height: 96rpx;
        line-height: 96rpx;
        text-align: center;
        color: #fff;
        font-size: 32rpx;
        margin: 80rpx auto 0;
        background: rgba(16, 187, 184, 1);
        border-radius: 8rpx;
    }

    .picker {
        width: 100%;
        height: 100%;
        line-height: 100%;
    }
</style>
