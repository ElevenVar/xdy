import config from '@/config/index';
const { api } = config;
export default {
	shop_cart_list_xcx: `${api.cloud_product}/api/shopCart/v1/shop_cart_list_xcx.do`, // 获取购物车列表
	save_cart_selected: `${api.cloud_product}/api/shopCart/v1/save_cart_selected.do`, // 保存产品到购物车
	get_cart_count: `${api.cloud_product}/api/shopCart/v1/get_cart_count.do`, // 查询客户购物车总数量
	updateCartAttr: `${api.cloud_product}/api/shopCart/v1/update_shop_cart_sku.do`, // 修改产品/套餐属性
	deleteCart: `${api.cloud_product}/api/shopCart/v1/del_cart_sku.do`, // 删除购物车商品
	update_sku_number: `${api.cloud_product}/api/shopCart/v1/update_sku_number.do`, //购物车加减数量
}