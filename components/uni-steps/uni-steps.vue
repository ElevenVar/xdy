<template>
	<view class="uni-steps">
		<view class="uni-steps-items" :class="'uni-steps-' + direction">
			<view class="uni-steps-item" v-for="(item,index) in steps" :key="index" :class="[item.status ? 'uni-steps-' + item.status : '']">
				<view class="uni-steps-item-circle-container" v-if="direction == 'row'">
					<view class="uni-steps-item-circle" v-if="item.status !== 'process'" :style="{backgroundColor:item.status === 'finish' ? activeColor : ''}">
                        <tui-icon name="toright" size="14" color="#fff"></tui-icon>
                    </view>
                    <view v-else class="uni-steps-item-circle" :class="[item.status == 'process'?'active':'']" :style="{backgroundColor:activeColor}">
                        <tui-icon name="toright" size="14" color="#fff"></tui-icon>
                    </view>
				</view>
                <view class="uni-steps-item-circle-container" v-else>
                	<view class="uni-steps-item-circle" v-if="item.status !== 'process'" :style="{backgroundColor:item.status === 'finish' ? activeColor : ''}">
                        <tui-icon name="check" size="14" color="#fff" lineHeight='42'></tui-icon>
                    </view>
                    <view v-else class="uni-steps-item-circle" :class="[item.status == 'process'?'active':'']" :style="{backgroundColor:activeColor}">
                        <tui-icon name="check" size="14" lineHeight='42' color="#fff"></tui-icon>
                    </view>
                </view>
                <view class="uni-steps-item-title-container" :style="{color:item.status === 'process' ? activeColor : ''}">
					<view class="uni-steps-item-title">{{ item.title }}</view>
					<view class="uni-steps-item-desc" v-if="item.desc">{{ item.desc}}</view>				</view>
				<view class="uni-steps-item-line" v-if="index !== steps.length-1" :style="{backgroundColor:item.status === 'finish' ? activeColor : ''}"></view>
			</view>
		</view>
	</view>
</template>

<script>
	import tuiIcon from "@/components/icon/icon"
	export default {
		name: "uni-steps",
		components: {
			tuiIcon
		},
		props: {
            direction: { //排列方向 row column
            	type: String,
            	default: 'row'
            },
			activeColor: { //激活状态颜色
				type: String,
				default: '#12CB90'
			},
			active: { //当前步骤
				type: [Number, String],
				default: 0
			},
			datas: Array //数据
		},
		data() {
			return {}
		},
		computed: {
			steps() {
				let steps = []
				this.datas.forEach((item, index) => {
					let step = {}
					step.title = item.title
					step.desc = item.desc
					step.status = this.getStatus(index)
					steps.push(step)
				})
				return steps
			}
		},
		methods: {
			getStatus(index) {
				if (index < Number(this.active)) {
					return 'finish'
				} else if (index === Number(this.active)) {
					return 'process'
				}
				return ''
			}
		}
	}
</script>

<style lang="scss">
	$steps-line-color:#D8DBE4;
	$steps-text-color:#969799;
	$steps-title-size:24rpx;
	$steps-desc-size:20rpx;
	$steps-text-finish-color:#333333;
	$steps-bg-color:#ffffff;

	.uni-steps {
		width: 100%;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		position: relative;
	
		&-items {
			position: relative;
			display: flex;
			flex-direction: row;
			box-sizing: border-box;
            &.uni-steps-column {
            	padding-left: 42rpx;
            	flex-direction: column;
            
            	.uni-steps-item {
                    min-height: 120rpx;
            		&-title-container {
            			transform: none;
            			display: block;
            			line-height: 36upx;
                        text-align: left;
                        position: absolute;
                        top: 6rpx;
                        left: 20rpx;
            		}
            
            		&-title {
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                    }
            
            		&-desc {
            			white-space: normal;
            			display: -webkit-box;
            			-webkit-box-orient: vertical;
            			-webkit-line-clamp: 2;
            			overflow: hidden;
            		}
            
            		&-circle-container {
            			left: -21rpx;
            			top: -1px;
            			bottom: auto;
            			padding: 8px 0px;
            			z-index: 1;
            		}
            
            		&-line {
            			height: 100%;
            			width: 1px;
            			left: -21rpx;
            			top: -1px;
            			bottom: auto;
            		}
            
            	}
            }
		}
	
		&-item {
			flex: 1;
			position: relative;
			padding-top: 58rpx;
	
			&-title-container {
				text-align: center;
				// margin-left: 3px;
				// display: inline-block;
				// transform: translateX(-50%);
				color: $steps-text-color;
                margin-top: 6rpx;
			}
	
			&-title {
				font-size: $steps-title-size;
                color: #3A3B3D;
			}
	
			&-desc {
				font-size: $steps-desc-size;
                color: #A0A3A8;
			}
	
			&:first-child {
				.uni-steps-item-title-container {
					transform: none;
					margin-left: 0;
				}
			}
	
			&-circle-container {
				position: absolute;
				top: 0;
				left: 50%;
                transform: translateX(-50%);
				// padding: 0 8px;
				background-color: $steps-bg-color;
				z-index: 1;
			}
	
			&-circle {
				width: 42rpx;
				height: 42rpx;
				background-color: $steps-text-color;
				border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                &.active{
                    box-shadow: 0 0 10rpx 10rpx rgba(18,203,144,0.4);
                }
			}
	
			&-line {
				background-color: $steps-line-color;
				position: absolute;
				top: 18rpx;
				left: 81rpx;
				width: 100%;
				height: 6rpx;
			}
	
			&.uni-steps-finish {
				.uni-steps-item-title-container {
					// color: $steps-text-finish-color;
				}
			}
	
			&.uni-steps-process {
				.uni-steps-item-circle-container {
					// bottom: 3px;
					display: flex;
				}
			}
		}
	}
</style>
