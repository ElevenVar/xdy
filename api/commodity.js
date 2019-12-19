import config from '@/config/index';
const { api } = config;
export default {
	// cart: `${api.cloud_product}/api/shopCart/v1/shop_cart_list_xcx.do`, //获取购物车列表
    // classfiyList: '/api/iboss/commodityCategory/v2/list_data_index.do', // 商品分类 get 全部返回 自己做处理
    classfiyList: `${api.cloud_product}/api/commodity/commodityCategory/v2/category_list.do`, // 商品分类 get 点击一次请求一次
    commodityList: `${api.cloud_product}/api/commodity/v1/commodity_page_list_xcx.do`, // 商品列表 post
    commodityDetail: `${api.cloud_product}/api/commodity/v1/commodity_details_xcx.do`, //商品详情 get
    byAdd: `${api.cloud_product}/api/shopCart/v1/add_shop_cart.do`, // 0:正常加入购物车、 1:立即购买 post
    skuSearch: `${api.cloud_product}/api/commodity/v1/select_commodity_details_pc.do`, // 选择SKU属性查询商品
    getCartCount: `${api.cloud_product}/api/shopCart/v1/get_cart_count.do`, // 选择SKU获取购物车数量
    getCoupnList: `${api.cloud_member}/api/coupon/v1/find_member_coupon_type.do`, // 获取优惠券列表
    getCoupnOne: `${api.cloud_member}/api/coupon/v1/get_coupon.do`, // 点击领取优惠券
    /*推荐商品接口*/
    getCommodityClassfiy: `${api.cloud_product}/api/commodity/v1/cate_commodity_list_xcx.do`, // 推荐分类列表
    getCommodityList: `${api.cloud_product}/api/commodity/v1/commodity_rm.do`, // 热门(推荐)商品列表
    /*获取城市接口*/
    getCity: `/api/tree_book/get_tree_book_list.do?code=COMPANY&type=1&status=1`, // 获取城市接口
    /*【公共】优惠劵去使用商品列表*/
    getCouponCommidity: `${api.cloud_product}/api/commodity/v1/commodity_page_list_coupon.do`, // 优惠劵去使用商品列表
}