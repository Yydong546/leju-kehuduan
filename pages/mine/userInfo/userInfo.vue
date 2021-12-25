<template>
	<view class="userInfo">
		<view @tap="changeUser" class="change">修改用户信息</view>
		<view class="main" v-if="this.current">
			<view class="avatar">
				<view class="title">头像</view>
				<image :src="userInfoList.icon" class="photo"></image>
			</view>
			<view class="item">
				<view class="title">用户名</view>
				<view class="value">{{userInfoList.username}}</view>
			</view>
			<view class="item">
				<view class="title">昵称</view>
				<view class="value">{{userInfoList.nickname}}</view>
			</view>
			<view class="item">
				<view class="title">手机号</view>
				<view class="value">{{userInfoList.phone}}</view>
			</view>
		</view>
		<view class="main" v-else>
			<view class="change-avatar">
				<view class="title">头像</view>
				<image :src="avatarSrc" class="photo" v-if="this.isShowPhoto"></image>
				<view @tap="updatePhoto" class="uploadIcon" v-else>上传头像</view>
			</view>
			<view class="item">
				<view class="title">用户名</view>
				<view class="value">用户名不可修改</view>
			</view>
			<view class="item">
				<view class="title">昵称</view>
				<view class="value" v-if="this.current">{{userInfoList.nickname}}</view>
				<input class="input" v-model="nickname" v-else type="text" placeholder="请输入昵称"/>
			</view>
			<view class="item">
				<view class="title">手机号</view>
				<view class="value" v-if="this.current">{{userInfoList.phone}}</view>
				<input class="input" v-model="phone" v-else type="text" placeholder="请输入手机号"/>
			</view>
		</view>
		<button v-if="this.current" @tap="quitLogin" type="default" class="quit">退出登录</button>
		<button v-else @tap="renewUserInfo" type="default" class="renew">更新</button>
	</view> 
</template>

<script>
	import baseurl from "../../../api/baseurl.js";
	import {updateMemberInfo} from "../../../api/mine/userInfo/index.js";
	export default {
		data(){
			return{
				userInfoList:[],
				current:true,
				isShowPhoto:false,
				avatarSrc:"",
				nickname:"",
				phone:""
			}
		},
		methods:{
		// 跳转到登录页面
		quitLogin(){
			uni.removeStorageSync("token");
			uni.navigateTo({
				url:"/pages/mine/login/login"
			})
		},
		changeUser(){
			this.current=!true
		},
		// 上传头像
		updatePhoto(){
			let _this=this;
			// 第一步:选择图片
			uni.chooseImage({
				count:1,
				sizeType:["original"],
				sourceType:["album"],
				success(res){
					// console.log(res)
					let imgPath=res.tempFilePaths[0];
					// 第二步:上传到服务器
					uni.uploadFile({
						url:baseurl+"/lejuClient/login/uploadAvatar",
						filePath:imgPath,
						name:"file",
						success(res2){
							// console.log(res2);
							let info = JSON.parse(res2.data);
							let {success,data,message}=info;
							if(success){
								_this.avatarSrc=data.fileUrl
							}else{
								uni.showToast({
									title:message,
									icon:"error"
								})
							}
							_this.isShowPhoto=true
						}
					})
				}
			})
		},
		// 更新用户信息
		renewUserInfo(){
			updateMemberInfo({
				  "icon": this.avatarSrc,
				  "nickname": this.nickname,
				  "phone": this.phone,
				  "id":this.userInfoList.id,
			}).then(res=>{
				// console.log(res)
				let {success,message}=res;
				if(success){
					uni.showToast({
						title:"更新成功,需要重新登录,1s后跳转到登录页面",
						image:"/static/icons/leju-logo.png"
					})
					setTimeout(()=>{
						uni.navigateTo({
							url:"/pages/mine/login/login"
						})
					},1000)
				}else{
					uni.showToast({
						title:message,
						icon:"none"
					})
				}
			})
		}
		},
		onLoad() {
			
		},
		onShow() {
			this.userInfoList=uni.getStorageSync("userInfo")
			// console.log(this.userInfoList)
		}
	}
</script>

<style lang="scss" scoped>
	.userInfo{
		width: 100%;
		height: 100vh;
		background-color: #f1ece7;
		padding-top: 20rpx;
		position: relative;
		.change{
			width: 220rpx;
			height: 60rpx;
			line-height: 60rpx;
			border: 2rpx solid #354e44;
			border-radius: 20rpx;
			color: #354e44;
			text-align: center;
			font-size: 26rpx;
			position: absolute;
			right: 20rpx;
			top: 20rpx;
		}
		.main{
			width: 100%;
			padding: 100rpx 30rpx 0;
			box-sizing: border-box;
			.avatar{
				width: 100%;
				height: 176rpx;
				padding: 10rpx 30rpx;
				border-bottom: 2rpx solid #e5e5e5;
				box-sizing: border-box;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.title{
					font-size: 32rpx;
					color: #494949;
				}
				.photo{
					width: 120rpx;
					height: 120rpx;
					border-radius: 50%;
				}
			}
			.change-avatar{
				width: 100%;
				height: 176rpx;
				padding: 10rpx 30rpx;
				border-bottom: 2rpx solid #e5e5e5;
				box-sizing: border-box;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.title{
					font-size: 32rpx;
					color: #494949;
				}
				.photo{
					width: 120rpx;
					height: 120rpx;
					border-radius: 50%;
				}
				.uploadIcon{
					width: 173rpx;
					height: 60rpx;
					line-height: 60rpx;
					border-radius: 20rpx;
					border: 2rpx solid #354e44;
					color: #354e44;
					font-size: 26rpx;
					text-align: center;
				}
			}
			.item{
				width: 100%;
				height: 116rpx;
				padding: 10rpx 30rpx;
				border-bottom: 2rpx solid #e5e5e5;
				box-sizing: border-box;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.title{
					font-size: 32rpx;
					color: #494949;
				}
				.value{
					font-size: 32rpx;
					color: #a1a1a1;
				}
				.input{
					width: 400rpx;
					height: 100%;
					padding: 10rpx 20rpx;
					box-sizing: border-box;
					text-align: right;
				}
			}
		}
		.quit{
			display: block;
			width: 370rpx;
			height: 88rpx;
			line-height: 88rpx;
			background-color: #354e44;
			border-radius: 20rpx;
			color: #fff;
			position: absolute;
			bottom: 400rpx;
			left: 50%;
			transform: translateX(-50%);
		}
		.renew{
			display: block;
			width: 370rpx;
			height: 88rpx;
			line-height: 88rpx;
			background-color: #354e44;
			border-radius: 20rpx;
			color: #fff;
			position: absolute;
			bottom: 400rpx;
			left: 50%;
			transform: translateX(-50%);
		}
	}
</style>
