<template>
	<view class="mine" :style="{paddingTop: h + 'px'}">
		<!-- 用户信息部分 -->
		<view class="userInfo">
			<image @tap="goUserInfo(userInfo)" :src="userInfo.icon"></image>
			<view class="userInfo-right">
				<view class="right-title">
				   <view v-if="this.userInfo.length==0">hi~</view>
				{{userInfo.nickname}}
				</view>
				<view class="right-name">用户名:{{userInfo.username}}</view>
			</view>
		</view>
		<!-- 注册登录按钮部分 -->
		<view class="btnContainer" v-if="this.userInfo.length==0">
			<button @tap="goRegister" type="default" class="btn-register">注册</button>
			<button @tap="goLogin" type="default" class="btn-login">登录</button>
		</view>
		<!-- 订单信息部分 -->
		<view class="productInfo">
			<view class="productInfo-title">我的订单</view>
			<view class="productInfo-list">
				<view @tap="goMyOrder(index)" class="productInfo-item" v-for="(item,index) in productInfoList" :key="index">
					<image :src="item.src"></image>
					<view class="productInfo-item-title">{{item.title}}</view>
				</view>
			</view>
		</view>
		<!-- 其他部分 -->
		<view class="other">
			<view class="other-item" @tap="collectProduct">
				<image src="/static/icons/save.png"></image>
				<view class="other-item-title">商品收藏</view>
			</view>
			<view class="other-item" @tap="brandTip">
				<image src="/static/icons/brand.png"></image>
				<view class="other-item-title">品牌</view>
			</view>
			<view class="other-item" @tap="allCollectArticle">
				<image src="/static/icons/article.png"></image>
				<view class="other-item-title">文章收藏</view>
			</view>
			<view class="other-item" @tap="findAllAddress">
				<image src="/static/icons/address.png"></image>
				<view class="other-item-title">地址</view>
			</view>
			<view class="other-item" @tap="cardTip">
				<image src="/static/icons/card.png"></image>
				<view class="other-item-title">卡包</view>
			</view>
			<view class="other-item" @tap="goCart">
				<image src="/static/icons/cart2.png"></image>
				<view class="other-item-title">购物车</view>
			</view>
			<view class="other-item">
				<image src="/static/icons/kf.png"></image>
				<view class="other-item-title">联系客服</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {getMemberInfo,findAllAddress} from "../../api/mine/index.js"
	import mixin from "../../mixins/index.js"
	export default {
		mixins:[mixin],
		data() {
			return {
				h:0,
				productInfoList:[
					{
					   src:"/static/icons/icon-pay.png",
					   title:"待付款"
					},
					{
					   src:"/static/icons/pay-done.png",
					   title:"已付款"
					},
					{
					   src:"/static/icons/icon-car.png",
					   title:"已发货"
					},
					{
					   src:"/static/icons/icon-done.png",
					   title:"已收货"
					},
					{
					   src:"/static/icons/icon-back.png",
					   title:"售后"
					},
				],
			    userInfo:[],
				AllAddress:{}
			}
		},
		methods: {
			goLogin(){
				uni.navigateTo({
					url:"/pages/mine/login/login"
				})
			},
			goRegister(){
				uni.navigateTo({
					url:"/pages/mine/register/register"
				})
			},
			getUserInfo(){
				getMemberInfo().then(res=>{
					// console.log(res)
					let {success,data,message}=res;
					if(success){
						this.userInfo=data.userInfo;
					}else{
						uni.showToast({
							title:message,
							icon:"none"
						})
					}
				})
			},
			// 地址列表
			findAllAddress(){
				findAllAddress().then(res=>{
					// console.log(res)
					let {success,message}=res;
					if(success){
						uni.navigateTo({
							url:"/pages/mine/address/address"
						})
					}else{
						uni.showToast({
							title:message,
							icon:"none"
						})
					}
				})
			},
			// 商品收藏
			collectProduct(){
				uni.navigateTo({
					url:"/pages/mine/collectProduct/collectProduct"
				})
			},
			// 文章收藏
			allCollectArticle(){
				uni.navigateTo({
					url:"/pages/mine/allCollectArticle/allCollectArticle"
				})
			},
			// 品牌
			brandTip(){
				uni.showToast({
					title:"品牌功能暂未开通!",
					image:"/static/icons/leju-logo.png"
				})
			},
			// 卡包
			cardTip(){
				uni.showToast({
					title:"卡包功能暂未开通!",
					image:"/static/icons/leju-logo.png"
				})
			},
			// 点击头像跳转到用户信息页面
			goUserInfo(userInfo){
				uni.setStorageSync("userInfo",userInfo);
				uni.navigateTo({
					url:"/pages/mine/userInfo/userInfo"
				})
			},
			// 点击购物车跳转到购物车页面
			goCart(){
				uni.navigateTo({
					url:"/pages/mine/cart/cart"
				})
			},
			// 点击我的订单跳转
			goMyOrder(index){
				uni.navigateTo({
					url:`/pages/mine/myOrder/myOrder?index=${index}`
				})
			}
		},
		onLoad(){
			// #ifdef MP-WEIXIN
				const obj=uni.getMenuButtonBoundingClientRect();
				console.log(obj);
				this.h=obj.top+obj.height;
			// #endif
		},
		onShow(){
			// 使用mixin混入的方法,检查是否登录
			this.checkLogin();
			if(this.checkLogin()){
				this.getUserInfo();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.mine{
		width: 100%;
		padding: 0 40rpx 20rpx;
		box-sizing: border-box;
		background-color:  #f1ece7;
		overflow: hidden;
		// 用户信息部分样式
		.userInfo{
			width: 100%;
			height: 150rpx;
			padding-top: 60rpx;
			display: flex;
			justify-content: start;
			align-items: center;
			image{
				display: block;
				width: 150rpx;
				height: 100%;
				background-color: #999999;
				border-radius: 50%;
			}
			.userInfo-right{
				margin-left: 32rpx;
				padding: 14rpx 0;
				box-sizing: border-box;
				.right-title{
					font-size: 40rpx;
					font-weight: 600;
					color: #3d4c46;
					margin-bottom: 28rpx;
				}
				.right-name{
					font-size: 26rpx;
					color: #999;
				}
			}
		}
	        // 注册登录按钮部分样式
		.btnContainer{
				width: 100%;
				height: 76rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 30rpx;
				margin: 40rpx 0;
				.btn-register{
					display: block;
					width: 180rpx;
					border: 2rpx solid #354e44;
					color: #354e44;
					background-color: #f1ece7;
					border-radius: 10rpx;
					text-align: center;
					box-sizing: border-box;
					margin: 0 30rpx;
				}
				.btn-login{
					display: block;
					width: 180rpx;
					background-color: #354e44;
					color: #fff;
					border-radius: 10rpx;
					text-align: center;
					margin: 0 30rpx;
				}
		    }
		   // 订单信息部分样式
		.productInfo{
			width: 100%;
			background-color: #fff;
			margin-top: 60rpx;
			padding: 0 54rpx;
			box-sizing: border-box;
			border-radius: 30rpx;
			.productInfo-title{
				height: 76rpx;
				line-height: 76rpx;
				font-size: 26rpx;
				border-bottom: 2rpx solid #ddd;
				box-sizing: border-box;
			}
			.productInfo-list{
				width: 100%;
				height: 132rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.productInfo-item{
					height: 104rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					flex-direction: column;
					image{
						width: 40rpx;
						height: 40rpx;
					}
					.productInfo-item-title{
						font-size: 26rpx;
						line-height: 36rpx;
						margin-top: 10rpx;
					}
				}
			}
		}
	    // 其他部分样式
		.other{
			width: 100%;
			height: 600rpx;
			border-radius: 30rpx;
			margin-top: 60rpx;
			padding: 30rpx 0 60rpx;
			background-color: #fff;
			display: flex;
			justify-content: baseline first;
			flex-wrap: wrap;
			.other-item{
				width:33.3%;
				height: 200rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				image{
					width: 50rpx;
					height: 50rpx;
				}
				.other-item-title{
				    font-size: 26rpx;
					line-height: 38rpx;
					margin-top: 30rpx;
				}
			}
		}
	}
</style>
