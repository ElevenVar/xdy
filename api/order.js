import config from '@/config/index';
const {
	api
} = config;
export default {
	settle_commodity_list_xcx: `${api.cloud_product}/api/shopCart/v1/settle_commodity_list_xcx.do`, // 结算页商品列表
	createOrder: `${api.cloud_product}/api/shopCart/v1/createOrder.do`, //创建订单
	getOrderList: `${api.cloud_order}/api/order/v1/getOrderList.do`, // 获取订单列表
	getCloudOrderTotalMoneyURL: `${api.cloud_order}/api/order/v1/countPrice.do`, //实时计算订单总金额
	//shoppingCardSearchPriceURL: `${api.cloud_order}/api/order/v1/countPrice2.do`,//购物车查询价格
	getCloudOrderCountURL: `${api.cloud_order}/api/order/v1/countOrderByStatus.do`, //查询订单数量接口
	orderToPayActionURL: `${api.cloud_order}/api/order/pay/v1/toPay.do`, //订单去支付
	shoppingOrderCancelURL: `${api.cloud_order}/api/order/v1/cancelOrder.do`, //取消订单
	getOrderBaseInfoURL: `${api.cloud_order}/api/order/v1/getOrderBaseInfo.do`, //获取订单基础信息
	orderRefundURL: `${api.cloud_order}/api/order/refundOrder.do`, //退单、退款接口
	getOrderNewRefundURL: `${api.cloud_order}/api/order/v1/getNewRefund.do`, //获取最新退单信息
	getOrderRefundReasonURL: `${api.cloud_order}/api/order/v1/getRefundReason.do`, //获取退单/款原因列表
	getOrderFefundFileIDURL: `${api.cloud_order}/api/order/file/v1/getRefundRecordFileId.do`, //获取退款/退单文件上传ID
	getOrderFinanceInfoURL: `${api.cloud_order}/api/order/v1/getFinanceInfo.do`, //获取财务信息
	getOrderProgressListURL: `${api.cloud_order}/api/order/v1/getOrderProgressList.do`, //订单获取生产进度信息
	getOrderStatusListURL: `${api.cloud_order}/api/order/v1/getOrderStatusList.do`, //订单详情里，订单状态记录
	getOrderContractUrlListURL: `${api.cloud_order}/api/order/v1/getContractUrl.do`, //查看合同信息
	getProductListByIdsURL: `${api.cloud_order}/api/order/v1/getBuyOrderIds.do`, //获取当前客户购买过的产品
	shopingSearchOrderStatusURL: `${api.cloud_order}/api/order/pay/v1/getOrderStatus.do`, //查询订单支付状态
	getEvaluateCount: `${api.cloud_order}/api/uc/cloud/evaluate/v1/getEvaluateCount.do`, //获取会员对当前产品评价总数接口
    cmsGetTreeBookByCodeURL: `/api/tree_book/get_tree_book_list.do?code=EVALUATE_LABEL&type=1&status=1`, // 获取评价类别
    saveEvaluate: '/cloud_uc/api/uc/cloud/evaluate/v1/saveEvaluate.do', //客户保存订单评价内容
    contractUrl: `cloud_order/api/order/v2/contractUrl.do`,// 申请合同
	findOrderNo: `${api.cloud_product}/api/shopCart/v1/findOrderNo.do`
}
