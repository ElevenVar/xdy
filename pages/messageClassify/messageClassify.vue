<template>
	<view class="message page">
		<listItem @changeReadStatus='changeReadStatus' v-if='list.length > 0' :list="list"></listItem>
		
			<block v-else><dataNull :tips="tips"></dataNull></block>
		</view>
</template>

<script>
import listItem from '@/components/message-item/message-item.vue';
import dataNull from '@/components/null-data/null-data.vue';
import { accountSet } from '@/api/index.js';
import config from '@/config/index';
const { messageUrl } = config;
export default {
	components: {
		listItem,
		dataNull
	},
	data() {
		return {
			imgUrl: '',
			tips: {
				text: '暂无消息内容',
				image: `${this.$config.imgUrl}nullData/no-message.png`,
				top: 280
			},
		//系统消息 CLOUND_SYSTEM_MESSAGE
		//活动消息 CLOUD_ACTIVE_MESSAGE
		//服务通知 CLOUD_SERVICE_NOTICE
			list: [],
			params: {
				msgType: 'CLOUND_SYSTEM_MESSAGE',
				pageNumber: 1,
				pageSize: 10
			},
			isMore: true,
			title: ''
		};
	},
	onReachBottom() {
		if (this.isMore) {
			this.params.pageNumber ++
			this.getMessageData()
		}
	},
	onLoad(options) {
		uni.setNavigationBarTitle({
			title: options.index == 1 ? '平台通知' : '优惠促销'
		});
		options.index == 1 ? this.params.msgType = 'CLOUD_SERVICE_NOTICE' : this.params.msgType = 'CLOUD_ACTIVE_MESSAGE';
		options.index == 1 ? this.imgUrl = `${this.$config.imgUrl}message/tz.png` : this.imgUrl = `${this.$config.imgUrl}message/yh.png`;
		options.index == 1 ? this.title = '平台通知' : this.title = '优惠促销';
		this.getMessageData()
	},
	methods: {
		getMessageData() {
			uni.showLoading({ title: '加载中' })
			this.$http.get(accountSet.queryMemberMsg, this.params).then(res => {
				uni.hideLoading()
				res.data.list.map(item => {
					item.img = this.imgUrl
					item.type = this.title
				})
				if (res.code == 200) {
					this.list = this.list.concat(res.data.list)
					if (this.list.length >= res.data.total) {
						this.isMore = false
					}
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
				}
			});
		},
		// 子组件更改阅读状态
		changeReadStatus(index){
			this.list[index].readStatus = 0
			console.log(this.list[index].readStatus)
		}
	}
};
</script>

<style lang="scss">

</style>

