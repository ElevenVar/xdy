<template>
	<view class="know-detail-wrap">
		<view class="know-detail">
			<text class="know-detail-title">{{ detail.a_title }}</text>
			<text class="know-detail-time">{{ detail.publish_time }}</text>
			<image class="know-detail-banner" :src="detail.a_image" mode=""></image>
			<rich-text attrs='know-detail-content' :nodes="detail.a_content"></rich-text>
		</view>
		<view class="detail-footer">已经到底了</view>
	</view>
</template>

<script>
    import {
        accountSet
    } from '@/api/index.js'
	export default {
		data() {
			return {
				detail: null
			};
		},
		filters: {
			// 利用过滤器重置富文本img宽度样式
			reg(str) {
				return str.replace(/<img/g, "<img style='max-width: 100% !important'")
			}
		},
        onLoad(e) {
            this.id  = e.id
            this.getDetail(this.id)
        },
        methods:{
            getDetail(id){
                uni.showLoading({
					title: '加载中...'
				});
                this.$http.get(accountSet.getArticleDetails,{id}).then(res => {
                    uni.hideLoading()
                    if (res.code == 200) {
                        this.detail = res.data
                        this.detail.a_content = this.detail.a_content.replace(/<img/g, "<img style='max-width: 100% !important'")
                    } else{
                        uni.showToast({
                            icon: 'none',
                            title: res.message
                        })
                    }
                })
            }
        }
	}
</script>

<style lang="scss" scoped>
	@import  './detail.scss'
</style>
