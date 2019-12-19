<template>
    <view class="messageDetail page">
        <block v-if="list && list.length > 0">
            <view class="detail-item" v-for="(item, index) in list" :key="index" @tap.stop="read(item, index)">
                <view class="date">{{ item.date }}</view>
                <view class="item-content">
                    <text class="item-title" :class="item.readStatus==1 ? 'item-title-active' : ''">{{ item.type }}</text>
                    <view class="item-desc">
                        <text>{{ item.content }}11</text>
                        <tui-icon class="icon" name="arrowright" :size="20" color="#878787"></tui-icon>
                    </view>
                </view>
            </view>
        </block>
        <block v-else><dataNull :tips="tips"></dataNull></block>
    </view>
</template>

<script>
import tuiIcon from '@/components/icon/icon';
import dataNull from '@/components/null-data/null-data.vue';
import { accountSet } from '@/api/index.js';
import config from '@/config/index';
const { messageUrl } = config;
export default {
    components: {
        tuiIcon,
        dataNull
    },
    data() {
        return {
            tips: {
                text: '暂无消息内容',
                image: `${this.$config.imgUrl}nullData/no-message.png`,
                top: 280
            },
            list: [],
			isMore: true,
			params: {
				msgType: 'CLOUND_SYSTEM_MESSAGE',
				pageNumber: 1,
				pageSize: 10
			},
        };
    },
	onReachBottom() {
		if (this.isMore) {
			this.params.pageNumber ++
			this.getMessageData()
		}
	},
	onLoad() {
		console.log('1111')
		this.getMessageData()
	},
	methods: {
		getMessageData() {
			uni.showLoading({ title: '加载中' })
			this.$http.get(accountSet.queryMemberMsg, this.params).then(res => {
				uni.hideLoading()
				res.data.list.map(item => {
					item.type = '系统消息'
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
		read(item, index){
			console.log(item)
			this.$http.post(accountSet.updateMember_status, { ids: item.id }).then(res => {
				console.log(res)
				if(res.code == 200) {
					this.list[index].readStatus = 0
				} else {
					uni.showToast({
						title: res.message
					})
				}
			})
		}
	}
};
</script>

<style lang="scss">
.detail-item {
	height: 100%;
    width: 100%;
    padding: 0 32rpx;
    box-sizing: border-box;
    .date {
        font-size: 24rpx;
        font-weight: 500;
        color: rgba(184, 184, 184, 1);
        width: 100%;
        text-align: center;
        margin: 30rpx 0 15rpx;
    }
    .item-content {
        width: 100%;
        min-height: 142rpx;
        background: rgba(255, 255, 255, 1);
        border-radius: 12rpx;
        padding: 32rpx;
        box-sizing: border-box;
        overflow: hidden;
        .item-title {
            font-size: 32rpx;
            font-weight: bold;
            color: rgba(37, 37, 37, 1);
            position: relative;
			&.item-title-active{
            &:after {
                position: absolute;
                content: '';
                right: -24rpx;
                top: 8rpx;
                width: 16rpx;
                height: 16rpx;
                background: rgba(245, 71, 67, 1);
                border-radius: 50%;
            }
			}
        }
        .item-desc {
            margin-top: 22rpx;
            font-size: 26rpx;
            font-weight: 500;
            color: #878787;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    }
}
</style>
