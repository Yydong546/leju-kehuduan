<template>
	<view class="register">
		<image @tap="setAvatar" :src="avatarSrc" class="avatar"></image>
		<view class="iptContainer">
			<input type="tel" v-model="tel" placeholder="手机号"/>
			<input type="password" v-model="password" placeholder="请输入登录密码"/>
			<input type="text" v-model="username" placeholder="请输入用户名 该用户名将用于账户登录"/>
			<input type="text" v-model="name" placeholder="请输入昵称"/>
			<input type="text" v-model="code" placeholder="请输入验证码"/>
		</view>
		<view @tap="submitInfo" class="btn-register">注册</view>
	</view>
</template>

<script>
	import baseurl from "../../../api/baseurl.js"
	import WxValidate from "../../../utils/WxValidate.js"
	import {register} from "../../../api/mine/register/index.js"
	export default{
		data(){
			return{
				avatarSrc:"",
				tel:"",
				password:"",
				username:"",
				name:"",
				code:""
			}
		},
		methods:{
			setAvatar(){
				var _this =this;
				    //1.选择图片
					uni.chooseImage({
						count:1,
						sizeType:["original"],
						sourceType:["album"],
						success(res){
							// console.log(res)
							let imagePath=res.tempFilePaths[0]
							// 2.上传到服务器
							uni.uploadFile({
								url:baseurl+'/lejuClient/login/uploadAvatar',
								filePath:imagePath,
								name:"file",
								success(res2) {
									// console.log(res2)
								let info=JSON.parse(res2.data);
								let {success,data,message} =info;
								 if(success){
									 _this.avatarSrc=data.fileUrl
								 }else{
									 uni.showToast({
									 	title:message,
										icon:"error"
									 })
								 }
								}
							})
					}
				})
			},
		    initValidate() {
		        let rules = {
		          tel: {
		            required: true,
		            tel:true
		          },
		          password: {
		            required: true,
					rangelength:[6,10]
		          },
		          username: {
		            required: true,
		          }, 
		          name: {
		            required: true,
		          },
				  code: {
				    required: true,
					minlength:4,
					maxlength:4
				  }
		        }
		    
		        let message = {
		         tel: {
		            required: '请输入手机号',
		            tel:"请输入11位的手机号码"
		          },
		          password: {
		            required: '请输入密码',
					rangelength:'请输入6-10位数密码'
		          },
		          username: {
		            required: "请设置您的用户名",
		          }
		          ,
		          name: {
		            required: "请设置昵称",
		          },
				  code: {
				    required: "请输入验证码",
					minlength:'验证码为四位',
					maxlength:'验证码为四位'
				  }
		        }
		        //实例化当前的验证规则和提示消息
		        this.WxValidate = new WxValidate(rules, message);
		      },
			  submitInfo(){
				   let obj={
					   tel:this.tel,
					   password:this.password,
					   username:this.username,
					   name:this.name,
					   code:this.code
				   };
				   if (!this.WxValidate.checkForm(obj)) {
				    //表单元素验证不通过，此处给出相应提示
				      let error = this.WxValidate.errorList[0];
					  // console.log(error);
					  uni.showToast({
					  	title:error.msg,
						icon:"error"
					  })
				    }else{
						register({
							"icon": this.avatarSrc,
							"nickname": this.name,
							"password": this.password,
							"phone": this.tel,
							"username": this.username
						}).then(res=>{
							console.log(res)
							let {success,message}=res;
							if(success){
								uni.navigateTo({
									url:"/pages/mine/login/login"
								})
							}else{
								uni.showToast({
									title:message,
									icon:"error"
								})
							}
						})
					}
			  }
		},
		
		onLoad(){
			this.initValidate();
		}
	}
</script>

<style lang="scss" scoped>
	.register{
		width: 100%;
		height: 100vh;
		background-color: #f1ece7;
		display: flex;
		justify-content: start;
		align-items: center;
		flex-direction: column;
		.avatar{
			width: 160rpx;
			height: 160rpx;
			margin: 120rpx 0 100rpx;
			border-radius: 50%;
			background-color: #999999;
		}
		.iptContainer{
			width: 100%;
			padding: 0 70rpx;
			box-sizing: border-box;
			input{
				width: 100%;
				height: 100rpx;
				padding: 32rpx;
				box-sizing: border-box;
				border-radius: 40rpx;
				font-size: 14px;
				margin: 24rpx 0;
				    box-shadow: 0 0 30px 0 rgba($color: #fff, $alpha:0.8);
			}
		}
		.btn-register{
			width: 600rpx;
			height: 100rpx;
			line-height: 100rpx;
			margin:100rpx auto 0;
			border-radius: 60rpx;
			color: #fff;
			background-color: #354e44;
			text-align: center;
			letter-spacing: 10rpx;
		}
	}
</style>
