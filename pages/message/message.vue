<template>
	<view class="message page"><listItem :list="list"></listItem></view>
</template>

<script>
import listItem from '@/components/message-item/message-item.vue';
import { accountSet } from '@/api/index.js';
import config from '@/config/index';
const { messageUrl } = config;
export default {
	components: {
		listItem
	},
	data() {
		return {
			list: [
				{
					img: `${this.$config.imgUrl}message/kf.png`,
					content: '',
					type: '小顶云客服',
					date: '09:21:14',
					number: '02',
					contact: true,
					list: true
					// url: '/pages/messageClassify/messageClassify'
				},
				{
					img: `${this.$config.imgUrl}message/tz.png`,
					content: '',
					type: '平台通知',
					date: '09:21:14',
					number: '',
					url: '/pages/messageClassify/messageClassify',
					contact: false,
					list: true
				},
				{
					img: `${this.$config.imgUrl}message/yh.png`,
					content: '',
					type: '优惠促销',
					date: '09:21:14',
					number: '',
					url: '/pages/messageClassify/messageClassify',
					contact: false,
					list: true
				},
				{
					img: `${this.$config.imgUrl}message/xt.png`,
					content: '',
					type: '系统消息',
					date: '09:21:14',
					number: '',
					url: '/pages/messageDetail/messageDetail',
					contact: false,
					list: true
				}
			]
		};
	},
	onShow() {
		this.getMessageData();
	},
	methods: {
		//系统消息 CLOUND_SYSTEM_MESSAGE 
		    //活动消息 CLOUD_ACTIVE_MESSAGE
		    //服务通知 CLOUD_SERVICE_NOTICE
		getMessageData() {
			// 平台通知
			this.$http.get(accountSet.queryMemberMsg, {msgType: 'CLOUD_SERVICE_NOTICE', pageNumber: 1, pageSize: 1}).then(res => {
				console.log(res);
				if(res.code == 200) {
					this.list[1].content = res.data.list[0] ? res.data.list[0].content : '暂无消息'
				} else {
					this.list[3].content = '暂无消息'
				}
					this.$forceUpdate()
			});
			// 优惠促销
			this.$http.get(accountSet.queryMemberMsg, {msgType: 'CLOUD_ACTIVE_MESSAGE', pageNumber: 1, pageSize: 1}).then(res => {
				if(res.code == 200) {
					this.list[2].content = res.data.list[0] ? res.data.list[0].content : '暂无消息'
				} else {
					this.list[3].content = '暂无消息'
				}
					this.$forceUpdate()
			});
			// 系统消息
			this.$http.get(accountSet.queryMemberMsg, {msgType: 'CLOUND_SYSTEM_MESSAGE', pageNumber: 1, pageSize: 1}).then(res => {
				if(res.code == 200) {
					this.list[3].content = res.data.list[0] ? res.data.list[0].content : '暂无消息'
				} else {
					this.list[3].content = '暂无消息'
				}
					this.$forceUpdate()
			});
			
			
			// 平台通知
			this.$http.get(accountSet.queryMemberMsg, {msgType: 'CLOUD_SERVICE_NOTICE', readStatus: 1}).then(res => {
				console.log(res);
				if(res.code == 200) {
					this.list[1].total = res.data.total
					this.$forceUpdate()
				}
			});
			// 优惠促销
			this.$http.get(accountSet.queryMemberMsg, {msgType: 'CLOUD_ACTIVE_MESSAGE', readStatus: 1}).then(res => {
				if(res.code == 200) {
					this.list[2].total = res.data.total
					this.$forceUpdate()
				}
			});
			// 系统消息
			this.$http.get(accountSet.queryMemberMsg, {msgType: 'CLOUND_SYSTEM_MESSAGE', readStatus: 1}).then(res => {
				if(res.code == 200) {
					this.list[3].total = res.data.total
					this.$forceUpdate()
				}
			});
		}
	}
};
</script>

<style lang="scss"></style>
