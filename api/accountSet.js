import config from '@/config/index';
const {
	api
} = config;
export default {
	sendsms: `${api.cloud_member}/api/auth/send_sms_by_member.do`, // 给会员发送验证码接口
	checkSms: `${api.cloud_member}/api/auth/sms_check.do`, // 会员短信验证接口
	updatePhone: `${api.cloud_member}/api/auth/info/update_mobile.do`, // 会员账号修改
	updatePass: `${api.cloud_member}/api/auth/gua/update_password.do`, // 会员密码修改
	checkPass: `${api.cloud_member}/api/auth/gua/check_pwd.do`, // 会员密码检查
	memberInfo: `${api.cloud_member}/api/auth/find_member_info.do`, //获取会员信息接口
    updateMsg: `${api.cloud_member}/api/auth/info/update.do`, //修改会员信息
    getSex: `/api/tree_book/get_tree_book_list.do?code=CMS_SEX&type=1&status=1`, // 获取性别
    /*解决方案 接口 */
    getSolutionList: `${api.content_cms}/api/solution_list.do`, //解决方案列表
    getSolutionDetail: `${api.content_cms}/api/get_solution.do`, //单个方案
    getExpertDetail: `${api.content_cms}/api/get_expert_details.do`, //专家详情
    get_save_consultation: `${api.cloud_uc}/api/uc/public/consultation/v1/save_consultation.do`, //客户保存咨询内容 预约专家
	/* 地址接口 */
	addressSave: `${api.cloud_member}/api/address/save.do`, //联系地址添加
	addressUpdate: `${api.cloud_member}/api/address/update.do`, //联系地址修改
	addressFindList: `${api.cloud_member}/api/address/find_list.do`, //联系地址列表
	addressDel: `${api.cloud_member}/api/address/del.do`, //联系地址删除
    /*知识中心 接口*/
    getArticleType: `${api.content_cms}/api/article_category_list.do`, //分类列表接口
    getArticleList: `${api.content_cms}/api/article_page_list.do`, //资讯列表接口
    getArticleDetails: `${api.content_cms}/api/get_mobile_article.do`, //资讯详情
    /*我的企业 接口*/
    getCompanyList: `${api.cloud_member}/api/company/attr/get_company_attr_list.do`, // 我的企业列表
    saveCompany: `${api.cloud_member}/api/company/attr/save.do`, // 保存我的企业
    getCompanyDetail: `${api.cloud_member}/api/company/attr/find_info.do`, // 通过ID获取企业信息
    /*我的资料 */
    getMsgList: `${api.cloud_annex}/annex/find_file.do`, // 查询附件 get
    saveMsg: `${api.cloud_annex}/annex/update_file_name.do`, // 保存
    /*获取二维码内容*/
    getCodeContent: `${api.cloud_member}/api/code/find_code_data.do`, // 获取二维码内容

	
	// 我的消息接口
	queryMemberMsgCount: `${api.cloud_member}/api/uc/cloud/member/v1/query_member_msg_Count`, // 查询未读消息总数
	queryMemberMsg: `${api.cloud_uc}/api/uc/cloud/member/v1/query_member_msg.do`, // 查询客户消息列表（分页）
	queryMemberMsgCount: `${api.cloud_member}/api/uc/cloud/member/v1/query_member_msg_Count.do`, // 根据消息类型分类统计
	sendMessage: `${api.cloud_member}/api/uc/cloud/member/v1/send_message.do`, // 发送会员消息
	updateMember_status: `${api.cloud_uc}/api/uc/cloud/member/v1/update_member_status.do`, // 发送会员消息
	phoneSendMessage: `${api.cloud_member}/api/uc/cloud/member/v1/phone_send_message.do`, // 根据手机号发送消息
    
    /*账号绑定*/
    getAccountList: `${api.cloud_member}/api/auth/gua/find_account.do`, // 获取会员绑定账户列表
    getUnbindList: `${api.cloud_member}/api/auth/gua/unbind_account.do`, // 解绑账户
    
    /*我的 模块 数据统计*/
    getAccount: `${api.cloud_member}/api/member/v1/info/statistics.do`, // 获取消息数量优惠券数量
    
    /*生成小程序码*/
    getQrImg: `${api.cloud_product}/api/goods/commodity/v1/wxacode.do`
}

