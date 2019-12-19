<template>
    <view class="helpCenter page">
        <block v-for="(item, index) in list" :key="index">
            <list-cell @click="detail" :arrow="true" :last='index == (Number(list.length) - 1) ? true : false'>{{ item }}</list-cell>
        </block>
    </view>
</template>

<script>
import listCell from '@/components/list-cell/list-cell.vue';
export default {
    components: {
        listCell
    },
    data() {
        return {
            list: ['新手指南', '关于我们', '服务保障', '加入我们']
        };
    },
    methods: {
        detail() {
            uni.navigateTo({ url: '/pages/helpCenterSon/helpCenterSon' });
        }
    }
};
</script>

<style>
.helpCenter {
    padding-top: 16rpx;
}
</style>
