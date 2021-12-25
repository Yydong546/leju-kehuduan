<template>
	<view class="login" :style="{paddingTop: h + 'px'}">
		<!-- 头像部分 -->
		<image src="" class="avatar"></image>
		<!-- 输入框部分 -->
		<view class="main">
			<input type="text" v-model="username" value="" placeholder="用户名/电话"/>
			<input type="password" v-model="password" value="" placeholder="密码"/>
		</view>
		<!-- 登录按钮部分 -->
		<view class="submit">
			<button @tap="submitGoMine" type="default">登录</button>
		</view>
		<!-- 找回密码注册账号部分 -->
		<view class="other">
			<view class="retrieve">找回密码</view>
			<view @tap="goRegister" class="register">注册账号</view>
		</view>
	</view>
</template>

<script>
	import {doLogin} from "../../../api/mine/login/index.js"
	export default {
		data() {
			return {
				h:0,
				username:"",
				password:""
			}
		},
		methods: {
			goRegister(){
				uni.navigateTo({
					url:"/pages/mine/register/register"
				})
			},
			submitGoMine(){
				doLogin({
					username:this.username,
					password:this.password
				}).then(res=>{
					// console.log(res)
					let {success,data,message}=res;
					if(success){
						uni.setStorageSync("token",data.token);
						uni.showToast({
							title:"登录成功",
							icon:"success"
						})
						setTimeout(()=>{
							uni.switchTab({
								url:"/pages/mine/mine"
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
		onLoad(){
			// #ifdef MP-WEIXIN
				const obj=uni.getMenuButtonBoundingClientRect();
				console.log(obj);
				this.h=obj.top+obj.height;
			// #endif
		}
	}
</script>

<style lang="scss" scoped>
	.login{
		width: 100%;
		height: 100vh;
		background-color: #f1ece7;
		display: flex;
		justify-content: start;
		align-items: center;
		flex-direction: column;
		// 头像部分样式
		.avatar{
			display: block;
			width: 160rpx;
			height: 160rpx;
			border-radius: 50%;
			background-color: #fff;
			margin: 150rpx 0 100rpx;
		}
		// 输入框部分样式
		.main{
			width: 100%;
			height: 300rpx;
			padding: 0 70rpx;
			box-sizing: border-box;
			display: flex;
			justify-content: start;
			align-items: center;
			flex-direction: column;
			input{
				width: 100%;
				height: 100rpx;
				line-height: 40rpx;
				box-shadow: 0 0 30px 0 #FFFFFF;
				border-radius: 50rpx;
				padding: 30rpx;
				margin: 24rpx 0;
				box-sizing: border-box;
			}
		}
		// 登录按钮提交部分
		.submit{
			width: 100%;
			height: 200rpx;
			display: flex;
			justify-content: center;
			align-items: end;
			button{
				width: 600rpx;
				height: 100rpx;
				border-radius: 100rpx;
				color: #fff;
				background-color: #354e44;
				border: 2rpx solid #354e44;
				box-sizing: border-box;
			}
		}
		// 找回密码和注册部分样式
		.other{
			margin-top: 64rpx;
			height: 40rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 28rpx;
			color: #999999;
			text-align: center;
			.retrieve{
				width: 160rpx;
				border-right: 2rpx solid #999999;
			}
			.register{
				width: 160rpx;
			}
		}
	}
</style>
