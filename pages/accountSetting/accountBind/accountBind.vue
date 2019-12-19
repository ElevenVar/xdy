<template>
	<view class="personalDetails">
		<view class="list-view">
            <block v-for="(item, index) in list" :key='item.label'>
                <tui-list-cell
                	:arrow="true" 
                	class="tui-list" 
                    @tap='handleClick(item.type, item.value)'
                	:last='index == (list.length-1)'>
                    
                    <!-- wechat/qq/sina -->
                	<image v-if="item.type == 'wechat'" :src="imageBaseURL+ 'my/wx_icon.png'" class="logo" mode="widthFix"></image>
                    <image v-if="item.type == 'sina'" :src="imageBaseURL+ 'my/wb_icon.png'" class="logo" mode="widthFix"></image>
                    <image v-if="item.type == 'qq'" :src="imageBaseURL+ 'my/qq_icon.png'" class="logo" mode="widthFix"></image>
                	<view class="tui-list-cell-name">{{item.label}}</view>
                	<view class="tui-ist-cell-status">{{item.value ? '已关联': '未关联'}}</view>
                </tui-list-cell>
            </block>
		<!-- 	<tui-list-cell 
				:arrow="true" 
				class="tui-list" >
				<image :src="imageBaseURL+ 'my/wx_icon.png'" class="logo" mode="widthFix"></image>
				<view class="tui-list-cell-name">微信</view>
				<view class="tui-ist-cell-status">已关联</view>
			</tui-list-cell>
			<tui-list-cell 
				:arrow="true" 
				class="tui-list" >
				<image :src="imageBaseURL+ 'my/wb_icon.png'" class="logo" mode="widthFix"></image>
				<view class="tui-list-cell-name">新浪微博</view>
				<view class="tui-ist-cell-status">已关联</view>
			</tui-list-cell>
			<tui-list-cell 
				:arrow="true" 
				class="tui-list" 
				:last='true'>
				<image :src="imageBaseURL+ 'my/qq_icon.png'" class="logo" mode="widthFix"></image>
				<view class="tui-list-cell-name">QQ</view>
				<view class="tui-ist-cell-status">已关联</view>
			</tui-list-cell> -->
		</view>
	</view>
</template>

<script>
	import tuiIcon from "@/components/icon/icon"
	import tuiListCell from "@/components/list-cell/list-cell"
    import {accountSet} from '@/api/index.js';
	export default {
		components: {
			tuiIcon,
			tuiListCell
		},
		data() {
			return {
				imageBaseURL: this.$config.imgUrl,
                list:null
			};
		},
        onShow(){
            this.getList()
        },
        methods:{
            getList(){
                uni.showLoading({
                    title: '加载中...',
                    mask: true
                })
                this.$http.get(accountSet.getAccountList).then(res => {
                       uni.hideLoading()
                       if (res.code == 200) {
                           this.list = this.strMapToObj(res.data)
                       } else {
                           uni.showToast({
                               icon: 'none',
                               title: res.message || '请求异常'
                           });
                       }
                   })
            },
            // 解绑
            handleClick(e, val){
                if(!val){
                    uni.showToast({
                        icon: 'none',
                        title: '请重新微信授权登录，进行绑定',
                        mask: true
                    })
                    setTimeout(()=>{
                        uni.navigateTo({
                            url:'/pages/login/login'
                        })
                    }, 1000)
                    return
                }
                let that = this
                uni.showModal({
                  title: '操作警告',
                  content: '解除绑定后将无法使用共享登录，且无法同步订单及物流信息！',
                  success (res) {
                    if (res.confirm) {
                      that.unBind(e)
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
            },
            // 解绑
            unBind(e){
                uni.showLoading({
                    title: '解除绑定中...',
                    mask: true
                })
                this.$http.post(accountSet.getUnbindList, {accountType: e}).then(res => {
                    uni.hideLoading()
                    if (res.code == 200) {
                        uni.showToast({
                            icon: 'none',
                            title: '解绑成功,请重新登录',
                            mask: true
                        })
                        uni.removeTabBarBadge({ index: 2 })
                        uni.removeStorageSync('token')
                        uni.removeStorageSync('phone')
                        uni.removeStorageSync('userInfo')
                        setTimeout(()=>{
                            uni.reLaunch({
                                url:'/pages/index/index'
                            })
                        }, 1000)
                    } else {
                        uni.showToast({
                            icon: 'none',
                            title: res.message
                        });
                    }
                })
            },
            // 转换结构
            strMapToObj(strMap){
                // 账户类型 - wechat/qq/sina
                let newArr = []
                let keyArr = Object.keys(strMap)
                keyArr.forEach(el => {
                    if(el == 'wechat'){
                        newArr.push({label: '微信', value:strMap[el], type: el })
                    }else if(el == 'qq'){
                         newArr.push({label: 'QQ', value:strMap[el], type: el })
                    }else if(el == 'sina'){
                         newArr.push({label: '新浪微博', value:strMap[el], type: el })
                    }
                })
                console.log('newArr', newArr);
                return newArr
              }
        },
	}
</script>

<style lang="scss">
.personalDetails{
	.list-view{
		image{
			width:48rpx;
			height:42rpx;
		}
		.tui-list{
			.tui-list-cell-name{
				margin-left: 25rpx;
			}
			.tui-ist-cell-status{
				font-size:24rpx;
				font-family:PingFang SC;
				font-weight:500;
				color:rgba(135,135,135,1);
				position: absolute;
				right: 67rpx;
			}
		}
		.tui-list-cell::after {
			left: 104rpx !important
		}
	}
}
</style>
