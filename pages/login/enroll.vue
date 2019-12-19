<template>
	<view>
		<!-- S logo图 -->
			<view class="top_less">
				<image 
					class="login_pig" 
					:src="imgUrl + 'logins/logo.png'">
				</image>
			</view>
		<!-- S logo图 -->
		<!-- S 表单提交 -->
			<view class="input_less">
				<view class="input_item">
					<tui-icon 
						class="icon" 
						name="mobile" 
						:size='20' 
						color='rgba(44,218,216,1)' 
						style="margin-right: 10rpx;">
					</tui-icon>
					<input 
						class="inpu_fass" 
						type="number" 
						maxlength="11"
						placeholder="请输入手机号"
						placeholder-style="color: #B8B8B8;"
						v-model="from.mobile">
					</input>
				</view>
				<view class="input_item less_it">
					<tui-icon 
						class="icon" 
						name="shield" 
						:size='20' 
						color='rgba(44,218,216,1)' 
						style="margin-right: 10rpx;">
					</tui-icon>
					<input 
						class="inpu_fass" 
						placeholder="请输入短信验证码" 
						placeholder-style="color: #B8B8B8;"
						type="number"
						maxlength="6"
						v-model="from.code"/>
					<button  
						class="send_button" 
						type="primary" 
						size="small" 
						:disabled="countFlag"
						@tap="sendMsg()">
						{{btnMsg == null ? '重新发送'+ countNum+'s' : btnMsg}}
					</button >
				</view>
				
				<view class="input_item">
					<tui-icon 
						class="icon" 
						name="pwd" 
						:size='20' 
						color='rgba(44,218,216,1)' 
						style="margin-right: 10rpx;">
					</tui-icon>
					<input 
						class="inpu_fass" 
						placeholder="请输入密码" 
						placeholder-style="color: #B8B8B8;"
						maxlength="18"
						:type="isShow ? 'text' : 'password'"
						v-model="from.password"/>
					<tui-icon 
						class="icon2" 
						:name="isShow ? 'eye' :'unseen'" 
						:size='20' 
						color='rgba(212,218,224,1)' 
						style="margin-right: 10rpx;"
						@click.stop="showPassdClick">
					</tui-icon>
				</view>
				
				<view class="input_item item_lus">
					<label class="chenf">
						<checkbox-group class="checkbox-group" @change="checkboxChange">
							<checkbox 
								:value="checkbox"
								:checked="checkbox"
								style="transform:scale(0.7)"/>
						</checkbox-group>
					</label>
					<text @click="showModle">智能企服注册协议</text>
					<tui-icon
						class="icon3" 
						name="arrowright" 
						:size='20' 
						color='rgba(44,218,216,1)' 
						style="margin-right: 10rpx;"
						@click="showModle">
					</tui-icon>
				</view>
			</view>
		<!-- E 表单提交 -->
		<!-- S 登陆主页 -->
			<view class="btn">
				<button  
					class="login_btn" 
					type="primary" 
					size="small" 
					open-type="getUserInfo"
					@getuserinfo="getUserinfo">
					注册
				</button >
			</view>
		<!-- E 登陆主页 -->
		
		<!-- S 弹框 注册协议 -->
		<tui-modal 
			class="modal-agreement" 
			:show="modalAgreement" 
			@cancel="hideCancel" 
			:custom="true">
			<view class="modal-agreement-content">
				<view class="head">智能企服注册协议</view>
				<view class="body">
					<view class="h2 margin-bottom-22">在您注册过程中，您需要完成我们的注册流程并通过点击同意的形式在线签署以下协议，请您务必仔细阅读、充分理解协议中的条款内容后再点击同意：《智能企服平台用户注册协议》</view>
					<view class="h2 margin-bottom-22">1、服务条款的确认及接受</view>
					<view class="h2 margin-bottom-22">2、服务需知</view>
					<view class="h2 margin-bottom-22">3、订单</view>
					<view class="h2 margin-bottom-22">4、交付</view>
					<view class="h2 margin-bottom-22">5、户个人信息保护及授权</view>
					<view class="h2 margin-bottom-22">6、违约责任</view>
					<view class="h2 margin-bottom-22">7、法律管辖适用及其他</view>
					<view class="h2 margin-bottom-22">【特别提示】当您按照注册页面提示填写信息、阅读并同意协议且完成全部注册程序后，即表示您已充分阅读、理解并接受协议的全部内容。</view>
					<view class="h2 margin-bottom-22">阅读协议的过程中，如果您不同意相关协议或其中任何条款约定，您应立即停止注册程序。</view>
					<view class="h1 margin-bottom-22">一、服务条款的确认及接受</view>
					<view class="h2 margin-bottom-22">1、智能企服平台网站（包含域名为www.dgg.cn的网站以及智能企服平台微信小程序）各项电子服务的所有权和运作权归属于“顶呱呱科技股份有限公司”所有，本网站提供的服务将完全按照其发布的服务条款和操作规则严格执行。您确认所有服务条款并完成注册程序时，本协议在您与本网站间成立并发生法律效力，同时您成为本网站正式用户。</view>
					<view class="h2 margin-bottom-22">2、根据国家法律法规变化及本网站运营需要，本网站有权对本协议条款及相关规则不时地进行修改，修改后的内容一旦以任何形式公布在本网站上即生效，并取代此前相关内容，您应不时关注本网站公告、提示信息及协议、规则等相关内容的变动。您知悉并确认，如您不同意更新后的内容，应立即停止使用本网站；如您继续使用本网站，即视为知悉变动内容并同意接受</view>
					<view class="h1 margin-bottom-22">二、服务需知</view>
					<view class="h2 margin-bottom-22">1、基于本网站所提供的网络服务的重要性，您确认并同意：</view>
					<view class="h2 margin-bottom-22">（1）提供的注册资料真实、准确、完整、合法有效，注册资料如有变动的，应及时更新；</view>
					<view class="h2 margin-bottom-22">（2）如果您提供的注册资料不合法、不真实、不准确、不详尽的，您需承担因此引起的相应责任及后果，并且本网站保留终止您使用本网站各项服务的权利。</view>
					<view class="h1 margin-bottom-22">三、订单</view>
					<view class="h2 margin-bottom-22">1、在您下订单时，请您仔细确认所购商品的名称、价格、数量、型号、规格、尺寸、联系地址、电话、收货人等信息。收货人与您本人不一致的，收货人的行为和意思表示视为您的行为和意思表示，您应对收货人的行为及意思表示的法律后果承担连带责任。</view>
					<view class="h2 margin-bottom-22">2、您理解并同意：本网站上销售商展示的产品和价格等信息仅仅是要约邀请，您下单时须填写您希望购买的商品数量、价款及支付方式、收货人、联系方式、收货地址（合同履行地点）、合同履行方式等内容；系统生成的订单信息是计算机信息系统根据您填写的内容自动生成的数据，仅是您发出的合同要约；您下单并支付货款后合同即成立。</view>
					<view class="h2 margin-bottom-22">3、尽管本网站做出最大的努力，但由于市场变化及各种以合理商业努力难以控制因素的影响，本网站无法避免您提交的订单信息中的商品出现缺货、价格标示错误等情况；如您下单所购买的商品出现以上情况，您有权取消订单，本网站亦有权自行取消订单，若您已经付款，则为您办理退款。</view>
					<view class="h1 margin-bottom-22">四、交付</view>
					<view class="h2 margin-bottom-22">1、您在本网站购买的产品由系统或单据记录的签收时间为交付时间；您购买的商品采用在线传输方式交付的，销售商向您指定系统发送的时间为交付时间；您购买服务的，生成的电子或者实物凭证中载明的时间为交付时间。</view>
					<view class="h1 margin-bottom-22">五、用户个人信息保护及授权</view>
					<view class="h2 margin-bottom-22">1、您知悉并同意，为方便您使用本网站相关服务，本网站将存储您在使用时的必要信息，包括但不限于您的真实姓名、性别、生日、联系方式、通讯录、相册、日历、定位信息等。除法律法规规定的情形外，未经您的许可本网站不会向第三方公开、透露您的个人信息。本网站对相关信息采取专业加密存储与传输方式，利用合理措施保障用户个人信息的安全。</view>
					<view class="h2 margin-bottom-22">2、您知悉并确认，您在注册帐号或使用本网站的过程中，需要提供真实的身份信息，本网站将根据国家法律法规相关要求，进行基于移动电话号码的真实身份信息认证。若您提供的信息不真实、不完整，则无法使用本网站或在使用过程中受到限制，同时，由此产生的不利后果，由您自行承担。</view>
					<view class="h2 margin-bottom-22">3、您在使用本网站某一特定服务时，该服务可能会另有单独的协议、相关业务规则等（以下统称为“单独协议”），您在使用该项服务前请阅读并同意相关的单独协议；您使用前述特定服务，即视为您已阅读并同意接受相关单独协议。</view>
					<view class="h2 margin-bottom-22">4、您充分理解并同意：</view>
					<view class="h2 margin-bottom-22">（1）接收通过邮件、短信、电话等形式，向在本网站注册、购物的用户、收货人发送的订单信息、促销活动等内容</view>
					<view class="h2 margin-bottom-22">（2）为配合行政监管机关、司法机关执行工作，在法律规定范围内本网站有权向上述行政、司法机关提供您在使用本网站时所储存的相关信息，包括但不限于您的注册信息等，或使用相关信息进行证据保全，包括但不限于公证、见证等；</view>
					<view class="h2 margin-bottom-22">（3）本网站依法保障您在安装或使用过程中的知情权和选择权，在您使用本网站服务过程中，涉及您设备自带功能的服务会提前征得您同意，您一经确认，本网站有权开启包括但不限于收集地理位置、读取通讯录、使用摄像头、启用录音等提供服务必要的辅助功能。</view>
					<view class="h2 margin-bottom-22">（4）本网站有权根据实际情况，在法律规定范围内自行决定单个用户在本网站及服务中数据的最长储存期限以及用户日志的储存期限，并在服务器上为其分配数据最大存储空间等。</view>
					<view class="h2 margin-bottom-22">六、违约责任</view>
					<view class="h2 margin-bottom-22">1、如果本网站发现或收到他人举报投诉您违反本协议约定或存在任何恶意行为的，本网站有权不经通知随时对相关内容进行删除、屏蔽，并视行为情节对违规帐号处以包括但不限于警告、限制或禁止使用部分或全部功能、帐号封禁、注销等处罚，并公告处理结果。</view>
					<view class="h2 margin-bottom-22">2、本网站有权依据合理判断对违反有关法律法规或本协议规定的行为采取适当的法律行动，并依据法律法规保存有关信息向有关部门报告等，您应独自承担由此而产生的一切法律责任。</view>
					<view class="h2 margin-bottom-22">3、您理解并同意，因您违反本协议或相关服务条款的规定，导致或产生第三方主张的任何索赔、要求或损失，您应当独立承担责任；本网站因此遭受损失的，您也应当一并赔偿。</view>
					<view class="h2 margin-bottom-22">七、法律管辖适用及其他</view>
					<view class="h2 margin-bottom-22">1、本协议的订立、执行和解释及争议的解决均应适用中国法律。如双方就本协议内容或其执行发生任何争议，双方应尽力友好协商解决；协商不成时，应向协议签订地有管辖权的人民法院提起诉讼。</view>
					<view class="h2 margin-bottom-22">2、如果本协议中任何一条被视为废止、无效或因任何理由不可执行，该条应视为可分的且并不影响任何其余条款的有效性和可执行性。</view>
					<view class="h2 margin-bottom-22">3、本协议未明示授权的其他权利仍由本网站保留，您在行使这些权利时须另外取得本网站的书面许可。本网站如果未行使前述任何权利，并不构成对该权利的放弃。</view>
					<view class="h2 margin-bottom-22">4、您点击“同意”按钮即视为您完全接受本协议，在点击之前请您再次确认已知悉并完全理解本协议的全部内容。</view>
				</view>
				<view class="footer">
					<view class="but" @tap.stop="hideModleTap(false)">不同意</view>
					<view class="but but-agree" @tap.stop="hideModleTap(true)">同意</view>
				</view>
			</view>
		</tui-modal>
		<!-- E 弹框 注册协议 -->
		
	</view>
</template>

<script>
	import tuiIcon from "@/components/icon/icon"
	import tuiModal from "@/components/modal/modal"
	import {user} from "@/api/index.js"
	export default {
		components: {
			tuiIcon,
			tuiModal
		},
		data() {
			const imgUrl = this.$config.imgUrl;
			return {
				imgUrl : imgUrl,
				checkbox: true,
				from:{
					mobile: '',
					password: '',
					code: '',
					nickName: '',
					avatarUrl: '',
					sex: '',
					age: ''
				},
				isShow: false,
				countNum: 60,// 倒计时周期
				countFlag: false,// 用于倒计时标记，true-正在倒计时
				intervalBtn:{},// 定时器
				btnMsg:"获取验证码",//默认按钮的值
				modalAgreement: false
			}
		},
		methods: {
			hideCancel(){
				// 关闭弹框回调
				this.modalAgreement = false;
			},
			showModle(){
				// 打开弹框
				this.modalAgreement = true;
			},
			hideModleTap(type){
				// 关闭弹框
				this.checkbox = type;
				this.hideCancel();
			},
			showPassdClick(){
				// 密码显示切换
				this.isShow = !this.isShow;
			},
			getUserinfo(res){
				if (!this.from.mobile) {
					uni.showToast({
					    title: '请输入手机号！',
						icon: 'none',
					    duration: 2000
					});
					return;
				}
				if (!(/^1[23456789]\d{9}$/.test(this.from.mobile))){
					uni.showToast({
					    title: '手机号有误！',
						icon: 'none',
					    duration: 2000
					});
					return;
				}
				if (!this.from.code){
					uni.showToast({
					    title: '请输入验证码！',
						icon: 'none',
					    duration: 2000
					});
					return;
				}
				if (!this.from.password){
					uni.showToast({
					    title: '请输入密码！',
						icon: 'none',
					    duration: 2000
					});
					return;
				}
				if (!this.from.password){
					uni.showToast({
					    title: '请输入密码！',
						icon: 'none',
					    duration: 2000
					});
					return;
				}
				if (!this.checkbox){
					uni.showToast({
					    title: '请勾选智能企服注册协议！',
						icon: 'none',
					    duration: 2000
					});
					return;
				}
				let _this = this;
				if (res.detail.errMsg === 'getUserInfo:ok') {
					this.$store.commit('SET_USERINFO', res.detail.userInfo);
					this.from.avatarUrl = res.detail.userInfo.avatarUrl;
					this.from.sex = res.detail.userInfo.gender;
					
					this.phoneRegister();
				}
			},
			phoneRegister(){
				// 微信授权登录
				uni.showLoading({
				    title: '注册中..',
					mask: true
				});
				this.$http.post(user.phoneRegister,this.from).then(res=>{
					console.log(res);
					uni.hideLoading();
					if (res.code == 200) {
						uni.setStorageSync("token",res.data.token);
						uni.setStorageSync("userInfo", res.data.userInfo);
						uni.setStorageSync("tokenExpire",res.data.tokenExpire);
						this.$store.commit('SET_USERINFO', res.data.userInfo);
						
						uni.showToast({
						    title: '注册成功',
						    duration: 2000
						});
						
						// 返回
						uni.navigateBack({
						    delta: 3
						});
					}else{
						uni.showToast({
						    title: res.message,
							icon: 'none',
						    duration: 2000
						});
					}
				});
			},
			checkboxChange(e){
				// 勾选智能企服注册协议
				console.log(e.detail.value[0]);
				this.checkbox = e.detail.value[0] == 'false' ? true : false;
			},
			countDown(){
				// 设置btn倒计时时显示的信息
				this.btnMsg = null;
				// 更改btn状态
				this.countFlag =! this.countFlag;
				// 设置倒计时
				this.intervalBtn = setInterval(() => {
					if(this.countNum <= 0) {
						// 重置btn提示信息
						this.btnMsg = "获取验证码";
						// 清除定时器
						clearInterval(this.intervalBtn)
						// 更改btn状态
						this.countFlag =! this.countFlag;
						// 重置倒计时状态
						this.countNum = 60;
					};
					// 倒计时
					this.countNum -- ;
				}, 1000);
			},
			sendMsg(){
				if (!this.from.mobile) {
					uni.showToast({
					    title: '请输入手机号！',
						icon: 'none',
					    duration: 2000
					});
					return;
				}
				if (!(/^1[23456789]\d{9}$/.test(this.from.mobile))){
					uni.showToast({
					    title: '手机号有误！',
						icon: 'none',
					    duration: 2000
					});
					return;
				}
				let set_data = {
					mobile: this.from.mobile,
					smsType: 'SMS_REGISTER_WECHAT'
				}
				uni.showLoading({
				    title: '发送中..',
					mask: true
				});
				this.$http.get(user.sendSms,set_data).then(res=>{
					uni.hideLoading();
					if (res.code == 200) {
						uni.showToast({
						    title: '发送成功',
						    duration: 2000
						});
						this.countDown();
					} else{
						uni.showToast({
						    title: res.message,
							icon: 'none',
						    duration: 2000
						});
					}
				})
			},
		}
	}
</script>

<style scoped>
	.modal-agreement >>> .tui-modal-box{
		padding: 0;
	}
</style>
<style  scoped lang="scss">
	@import '../../static/style/thorui.css';
	.top_less{
		margin-top: 107rpx;
		margin-bottom: 80rpx;
	}
	.top_less{
		text-align:center;
		.login_pig{
			width: 264rpx;
			height: 142rpx;
		}
	}
	.input_less{
		margin: 0 32rpx;
		height:100%;
		background:rgba(255,255,255,1);
		border-radius:4px;
		padding: 0 32rpx;
	}
	.less_it{
		position: relative;
	}
	.login_btn{
		margin: 48rpx 32rpx;
		width: 686rpx;
		height: 96rpx;
		background: rgba(16,187,184,1);;
	}
	.input_item{
		height: 120rpx;
		clear: both;
		border-bottom: 1px solid #D7D8D9;
		&:last-child{
			border-bottom: none;
			position: relative;
		}
	}
	.inpu_fass{
		height: 120rpx;
		float: left;
		
	}
	.icon{
		margin-top: 39rpx;
		float: left;
		display: block;
	}
	.icon2{
		margin-top: 39rpx;
		float: right;
		display: block;
	}
	.send_button{
		position: absolute;
		top:36rpx;
		right: 20rpx;
		display: inline-block;
		padding: 0 20rpx;
		height:58rpx;
		background:rgba(16,187,184,1);
		border-radius: 8rpx;
		font-size: 26rpx;
		line-height: 58rpx;
	}
	.send_button[disabled]{
		background: #F5F7FA;
		color: #B8B8B8;
	}
	.item_lus{
		line-height: 120rpx;
		color: #10BBB8;
		font-size:28rpx;
	}
	.checkbox-group{
		display: inline-block;
	}
	
	/* 弹框 注册协议
	---------------------------------------------------------------- */
	.modal-agreement-content{
		.head{
			height: 120rpx;
			line-height: 120rpx;
			font-size: 36rpx;
			font-weight: 600;
			text-align: center;
			color: #252525;
		}
		.body{
			height: 500rpx;
			padding: 0 32rpx 10rpx 32rpx;
			box-sizing: border-box;
			overflow-y: auto;
			.h1{
				color: #252525;
				font-size: 28rpx;
				font-weight: 600;
				
			}
			.h2{
				color: #252525;
				font-size: 28rpx;
			}
			.margin-bottom-22{
				margin-bottom: 22rpx;
			}
		}
		.footer{
			height: 120rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			box-shadow:0px -1px 0px 0px rgba(215,216,217,1);
			.but{
				height: 64rpx;
				line-height: 64rpx;
				width: 200rpx;
				text-align: center;
				border:1rpx solid rgba(16,187,184,1);
				border-radius:8rpx;
				box-sizing: border-box;
				color: #10BBB8;
				font-size: 28rpx;
				margin-right: 80rpx;
				&:last-child{
					margin-right: 0;
				}
			}
			.but-agree{
				border: none;
				background: #10BBB8;
				color: #FFFFFF;
			}
		}
	}
</style>


