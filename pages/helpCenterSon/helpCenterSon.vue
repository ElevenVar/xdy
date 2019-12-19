<template>
    <view class="helpCenterSon">
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
            list: ['隐私保护', '注册引导', '购物流程', '常见问题']
        };
    },
    methods: {
        detail() {
            uni.navigateTo({ url: '/pages/faq/faq' });
        }
    }
};
</script>

<style>
.helpCenterSon {
    padding-top: 16rpx;
}
</style>
