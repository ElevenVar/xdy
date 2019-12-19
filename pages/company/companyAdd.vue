<template>
    <view class="companyAdd page">
        <block v-for="(item,index) in list" :key='index'>
            <view class="msg-label">{{item.title}}</view>
            <tui-list-cell v-for="(items,idx) in item.data" :key='idx' :last='idx == (item.data.length - 1)'>
                <text class="tui-list-cell-name">{{items.label}}</text>
                <view class="tui-right " v-if="items.type == 1">
                    <input type="text" maxlength='50' :value="obj[items.key]" @input='handleChange' :data-name='items.key'
                        :placeholder="'请输入' + items.label" />
                </view>
                <view class="tui-right hot" v-if="items.type == 2">
                    <picker mode="date" :value="obj[items.key]" :start="startDate" @change="bindDateChange" :data-name='items.key'
                        class="picker">
                        <view class="uni-input">{{ obj[items.key] ? obj[items.key] : '请选择日期' }}</view>
                    </picker>
                </view>
            </tui-list-cell>
        </block>
        <!-- Jing营范围 -->
        <view class="area-box">
            <textarea class="textarea" :value="obj.busScope" @input='handleChange' data-name='busScope' placeholder="请输入经营范围"
                maxlength='500' />
            </view>
        <!-- 上传图片 -->
        <view class="upload-box">
            <view class="tui-list-cell-name">营业执照 <text class="upload-desc">(图片小于20M；最多上传1张)</text></view>
            <view class="choose-img" @tap='userChangeHeadAction'>
                  <image class="defaultImg" v-if="!obj.licenseUrl" src="https://tguaguastatic.dgg.net/src/images/default/dggCloudImage/icon_plus2@2x.png" mode=""></image>
                  <image class="img" :src="obj.licenseUrl" mode="" v-else></image>
            </view>
            
        </view>
        
        <!-- 提交 -->
        <view class="msg-btn" @tap="saveCompany">
            提交
        </view>
         
    </view>
</template>

<script>
    import tuiIcon from '@/components/icon/icon';
    import tuiListCell from '@/components/list-cell/list-cell';
    import {accountSet, user} from '@/api/index.js'
    import util from '@/utils/util.js';
    export default{
        data(){
            return{
                obj:{
                    companyName: '', // 企业名称
                    establishDate: '', // 成立时间 -(yyyy-MM-dd)例：2019-06-20
                    companyAddress: '', // 企业地址
                    industryInvolved: '', // 所属行业
                    legalRep: '', // 法人代表
                    regCapital: '', // 注册基金
                    icCode: '', // 工商类型
                    busDate: '', // 营业期限 -(yyyy-MM-dd)例：2019-06-20
                    regNumber: '', // 注册号
                    regOrgan: '', // 登记机构
                    orgCode: '', // 组织机构代码
                    socialCredit: '', // 统一社会信用编码
                    issueDate: '', // 发照日期 -(yyyy-MM-dd)例：2019-06-20
                    operatConditions: '', // 经营状况
                    busScope: '', // 经营范围
                    licenseUrl: '', // 营业执照图片地址
                    attrId: '', // 企业信息ID -修改时必填
                },
                list: [
                    {
                       title: '基础信息',
                        data: [
                            {
                                label: '企业名称',
                                key: 'companyName',
                                type: 1,
                                value: ''
                            },
                            {
                                label: '企业地址',
                                key: 'companyAddress',
                                type: 1,
                                value: ''
                            },
                            {
                                label: '法人代表',
                                key: 'legalRep',
                                type: 1,
                                value: ''
                            },
                            {
                                label: '工商类型',
                                key: 'icCode',
                                type: 1,
                                value: ''
                            },
                        ] 
                    },
                    {
                       title: '工商信息',
                        data: [
                            {
                                label: '注册号',
                                key: 'regNumber',
                                type: 1,
                                value: ''
                            },
                            {
                                label: '组织机构代码',
                                key: 'orgCode',
                                type: 1,
                                value: ''
                            },
                            {
                                label: '成立时间',
                                key: 'establishDate',
                                type: 2,
                                value: ''
                            },
                            {
                                label: '发照日期',
                                key: 'issueDate',
                                type: 2,
                                value: ''
                            },
                            {
                                label: '营业期限',
                                key: 'busDate',
                                type: 2,
                                value: ''
                            },
                        ] 
                    },
                    {
                       title: '登记信息',
                        data: [
                            {
                                label: '所属行业',
                                key: 'industryInvolved',
                                type: 1,
                                value: ''
                            },
                            {
                                label: '登记机构',
                                key: 'regOrgan',
                                type: 1,
                                value: ''
                            },
                            {
                                label: '注册基金',
                                key: 'regCapital',
                                type: 1,
                                value: ''
                            },
                            {
                                label: '统一社会信用编码',
                                key: 'socialCredit',
                                type: 1,
                                value: ''
                            },
                            {
                                label: '经营状况',
                                key: 'operatConditions',
                                type: 1,
                                value: ''
                            },
                        ] 
                    },
                    
                    
                ]
            }
        },
         computed: {
                startDate() {
                    return this.getDate('start');
                }
            },
        components:{
           tuiIcon,  tuiListCell
        },
        onLoad(e){
            if(e.attrId){
                uni.setNavigationBarTitle({
                    title: '修改企业信息'
                })
                this.getDetails(e.attrId)
            }
        },
        methods:{
            getDate(type) {
                const date = new Date();
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let day = date.getDate();
            
                if (type === 'start') {
                    year = year - 60;
                } else if (type === 'end') {
                    year = year + 2;
                }
                month = month > 9 ? month : '0' + month;;
                day = day > 9 ? day : '0' + day;
                return `${year}-${month}-${day}`;
            },
            bindDateChange(e){
                switch (e.currentTarget.dataset.name){
                    case 'establishDate':
                        this.obj.establishDate = e.detail.value
                        break;
                    case 'busDate':
                        this.obj.busDate = e.detail.value
                        break;
                    case 'issueDate':
                        this.obj.issueDate = e.detail.value
                        break;      
                }
            },
            handleChange(e){
                switch (e.currentTarget.dataset.name){
                    case 'companyName':
                        this.obj.companyName = e.detail.value
                        break;
                    case 'companyAddress':
                        this.obj.companyAddress = e.detail.value
                        break;
                    case 'industryInvolved':
                        this.obj.industryInvolved = e.detail.value
                        break;
                    case 'legalRep':
                        this.obj.legalRep = e.detail.value
                        break;
                    case 'regCapital':
                        this.obj.regCapital = e.detail.value
                        break;
                    case 'icCode':
                        this.obj.icCode = e.detail.value
                        break;
                    case 'regOrgan':
                        this.obj.regOrgan = e.detail.value
                        break;
                    case 'socialCredit':
                        this.obj.socialCredit = e.detail.value
                        break;
                    case 'operatConditions':
                        this.obj.operatConditions = e.detail.value
                        break;
                    case 'busScope':
                        this.obj.busScope = e.detail.value
                        break;
                    case 'orgCode':
                        this.obj.orgCode = e.detail.value
                        break;
                    case 'regNumber':
                        this.obj.regNumber = e.detail.value
                        break;
                }
            },
            // 获取单个企业详情
            getDetails(attrId){
                this.$http.get(accountSet.getCompanyDetail, {attrId}).then(res => {
                    if (res.code == 200) {
                        this.obj = {
                            companyName: res.data.companyName, // 企业名称
                            establishDate: res.data.establishDate, // 成立时间 -(yyyy-MM-dd)例：2019-06-20
                            companyAddress: res.data.companyAddress, // 企业地址
                            industryInvolved: res.data.industryInvolved, // 所属行业
                            legalRep: res.data.legalRep, // 法人代表
                            regCapital: res.data.regCapital, // 注册基金
                            icCode: res.data.icCode, // 工商类型
                            busDate: res.data.busDate, // 营业期限 -(yyyy-MM-dd)例：2019-06-20
                            regNumber: res.data.regNumber, // 注册号
                            regOrgan: res.data.regOrgan, // 登记机构
                            orgCode: res.data.orgCode, // 组织机构代码
                            socialCredit: res.data.socialCredit, // 统一社会信用编码
                            issueDate: res.data.issueDate, // 发照日期 -(yyyy-MM-dd)例：2019-06-20
                            operatConditions: res.data.operatConditions, // 经营状况
                            busScope: res.data.busScope, // 经营范围
                            licenseUrl: res.data.licenseUrl, // 营业执照图片地址
                            attrId: res.data.id, // 企业信息ID -修改时必填
                        }
                    } else{
                        uni.showToast({
                            icon:'none',
                            title:res.message
                        })
                    }
                })
            },
            // 保存或修改企业信息
            saveCompany(){
                console.log(this.obj);
                let keyArr = Object.keys(this.obj)
                    keyArr.forEach(e => {
                        if(!this.obj[e] && e != 'licenseUrl' && e != 'attrId'){
                            uni.showToast({
                                icon:'none',
                                title: '请将信息填写完整'
                            })
                            return
                        }
                    })
                this.$http.post(accountSet.saveCompany, this.obj).then(res => {
                    if (res.code == 200) {
                        let title = this.obj.attrId ? '更改成功' : '保存成功'
                        uni.showToast({
                            icon:'none',
                            title: title
                        })
                        setTimeout(()=>{
                            uni.navigateBack()
                        }, 1000)
                    } else{
                        uni.showToast({
                            icon:'none',
                            title:res.message
                        })
                    }
                })
            },
            /*选择图片*/
            userChangeHeadAction() {
                var vm = this;
                uni.chooseImage({
                    count: 1,
                    sizeType: ['original', 'compressed'],
                    sourceType: ['album', 'camera'],
                    success: function(res) {
                        var chooseImagePath = res.tempFilePaths[0];
                        vm.uploadUserChooseHeaderImage(chooseImagePath);
                    },
                });
            },
            
            /**
             * 上传图片 
             */
            uploadUserChooseHeaderImage(filePath) {
                var fileId = 'MEMBER_' + uni.getStorageSync('userInfo').id
                wx.showLoading({
                    title: '上传中',
                    mask: true,
                });
                util.uploadImage(filePath, 'company', fileId, res=>{
                    uni.hideLoading();
                    console.log(res);
                    if (res.code == 200) {
                        this.obj.licenseUrl = res.data.filepath
                    } else{
                        uni.showToast({
                            title: '图片上传失败',
                        });
                    }
                    
                })
            },
        }
    }
</script>
<style lang="scss">
    .msg-btn{
        width:686rpx;
        height:100rpx;
        font-size:32rpx;
        text-align: center;
        font-family:PingFangSC;
        font-weight:400;
        color:rgba(255,255,255,1);
        line-height:100rpx;
        background:$default-color;
        border-radius:56rpx;
        margin: 60rpx auto;
    }
</style>
<style scoped>
    .area-box{
        width: 100%;
        height: 446rpx;
        background: #fff;
        padding: 32rpx;
        box-sizing: border-box;
        margin-top: 20rpx;
    }
    .textarea{
        width: 100%;
        height: 100%;
        background: #F5F5F5;
        padding: 24rpx;
        box-sizing: border-box;
        
    }
    .upload-box{
        margin-top: 20rpx;
        width: 100%;
        height: auto;
        background: #fff;
        padding: 32rpx;
        box-sizing: border-box;
    }
    .upload-desc{
        color: #A0A3A8;
        
    }
    .choose-img{
        width:210rpx;
        height:210rpx;
        background:rgba(245,245,245,1);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 40rpx;
    }
    .img{
        width:210rpx;
        height:210rpx;
    }
    .defaultImg{
        width: 66rpx;
        height: 66rpx;
        
    }
    .msg-label{
        line-height: 106rpx;
        padding-left: 32rpx;
        font-size:36rpx;
        font-family:PingFangSC;
        font-weight:500;
        color:rgba(49,49,49,1);
    }
    .tui-right {
        margin-left: auto;
        margin-right: 32rpx;
        font-size: 28rpx;
        line-height: 1;
        color: #252525;
        font-weight: 500;
        flex: 1;
        text-align: right;
    }
    
    .tui-right.hot {
        color: #707175;
    }
    
    .tui-list>>>.tui-list-cell {
        height: 160rpx !important;
    }
    
    .image {
        width: 84rpx;
        height: 84rpx;
        border-radius: 50%;
        margin-left: auto;
        margin-right: 34rpx;
    }
    
    .tui-list-cell-name {
        /* padding-left: 20rpx; */
        vertical-align: middle;
        line-height: 30rpx;
        color: #707175;
        font-weight: bold;
        font-size: 28rpx;
        margin-right: 12rpx;
    }
    
    input {
        font-size: 28rpx;
        font-weight: 500;
        color: #252525;
    }
    
    .input-placeholder {
        font-size: 28rpx;
        font-weight: 500;
        color: #ADB4BE;
    }
    
    .btn {
        width: 686rpx;
        height: 96rpx;
        line-height: 96rpx;
        text-align: center;
        color: #fff;
        font-size: 32rpx;
        margin: 80rpx auto 0;
        background: rgba(16, 187, 184, 1);
        border-radius: 8rpx;
    }
    
    .picker {
        width: 100%;
        height: 100%;
        line-height: 100%;
    }
</style>
