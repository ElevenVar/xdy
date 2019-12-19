<template>
    <view class="company page">
        <block v-if="list">
            <view class="company-ul" >
                <view class="company-li" v-for="item in list" :key='item.id' @tap="handleDetail(item.id)">
                    <image class="img" :src="imgUrl + 'index/company.png'" mode=""></image>
                    <view class="name ellipsis">{{item.companyName}}</view>
                </view> 
            </view>
            <image class="btn" :src="imgUrl + 'index/add-company.png'" mode="" @tap="handleAdd"></image>
            <dataNull v-if="!list && list.length == 0" :tips='tips'></dataNull>
        </block>
    </view>
</template>

<script>
    import dataNull from "@/components/null-data/null-data.vue"
    import {accountSet} from '@/api/index.js'
    export default {
        data() {
            const imgUrl = this.$config.imgUrl
            return {
                imgUrl: imgUrl,
                tips: {
                    image: `${imgUrl}nullData/no-company.png`,
                    text: '暂无公司哦!点击下方按钮进行创建',
                    top: 62
                },
                list: null
            }
        },
        components: {
            dataNull
        },
        onShow() {
          this.getList()  
        },
        methods:{
            // 去新增页面
            handleAdd(){
                uni.navigateTo({
                    url:'/pages/company/companyAdd'
                })
            },
            // 去往编辑
            handleDetail(e){
              uni.navigateTo({
                  url:'/pages/company/companyAdd?attrId=' + e
              })  
            },
            // 获取数据
            getList(){
                this.$http.get(accountSet.getCompanyList).then(res => {
                    if (res.code == 200) {
                        this.list = res.data
                    } else{
                        uni.showToast({
                            icon:'none',
                            title:res.message
                        })
                    }
                })
            }
        }
    }
</script>

<style lang="scss">
    .company-ul{
        padding: 32rpx;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        .company-li{
            width:328rpx;
            height:328rpx;
            background:rgba(255,255,255,1);
            margin-bottom: 30rpx;
            display:flex;
            flex-direction: column;
            align-items:center;
            justify-content:center;
            padding: 0 20rpx;
            box-sizing:border-box;
            .img{
                width: 82rpx;
                height: 94rpx;
                display: block;
                margin-bottom: 24rpx;
            }
            .name{
                width: 100%;
                text-align: center;
               font-size:24rpx;
               font-family:PingFangSC;
               font-weight:400;
               color:rgba(58,59,61,1);
            }
        }
    }
    .btn{
        width: 212rpx;
        height: 212rpx;
        position: fixed;
        bottom: 10rpx;
        left: 50%;
        transform: translateX(-50%);
    }
</style>
