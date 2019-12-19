import config from '@/config/index';
const {
   api, baseURL
} = config;

// 购物车相关接口拆分
import cart from './cart.js'
export const carts = cart;
// 商品相关接口
import commoditys from './commodity.js'
export const commodity = commoditys
// 订单相关接口
import orders from './order.js'
export const order = orders

// 账户设置相关接口
import accountSets from './accountSet.js'
export const accountSet = accountSets
// 网关鉴权

export const iboss = {
	authURL: 'api/disposition/auth/iboss_auth.do', //iboss鉴权接口 post
	getAppToken: 'api/disposition/token/get_app_token.do', //获取应用token get
}

// 用户

export const user = {
	wechatLogin: `${api.cloud_member}/api/auth/wechat_login.do`, // 微信登录 post
	login: `${api.cloud_member}/api/auth/gua/login.do`, // 账号-密码登录 post
	sendSms: `${api.cloud_member}/api/auth/wechat_send_sms.do`, // 发送验证码 get
	smsLogin: `${api.cloud_member}/api/auth/gua/sms_login.do`, // 账号登录接口-验证码登录 get
    logout: `${api.cloud_member}/api/auth/logout.do`, // 退出登录
    uploadImg: `${baseURL}cloud_annex/annex/upload.do`, // 图片上传
	wechatRegister: `${api.cloud_member}/api/auth/register.do`, //微信+手机号注册 post
	phoneRegister: `${api.cloud_member}/api/auth/wechat_register_phone.do`, //手机号注册 post
	resetPassword: `${api.cloud_member}/api/auth/gua/reset_password.do`, //密码重置 post
}


// 首页

export const pageIndex = {
	hotProduct: `${api.cloud_product}/api/commodity/v1/home_page_commodity.do`, // 首页热门产品 get
    homeProduct: `${api.content_cms}/api/home/home_page_list_xcx.do`, // 首页广告位、首页资讯列表、首页解决方案
	commodityRm: `${api.cloud_product}/api/commodity/v1/commodity_rm.do`, //【公共】热门(推荐)商品列表
}

// 我的优惠券

export const coupon = {
	couponList: `${api.cloud_member}/api/coupon/v1/get_member_coupon_list.do`, // 优惠券列表接口 get
	member: `${api.cloud_member}/api/coupon/v1/get_member_coupon_info.do`, // 优惠券数量 get
	del: `${api.cloud_member}/api/coupon/v1/del_coupon_item.do`, // 删除个人优惠券 post
	details: `${api.cloud_member}/api/coupon/v1/find_coupon_item.do`, // 优惠券信息 post
}
