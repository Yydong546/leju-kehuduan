<template>
	<view class="pay">
		<view class="orderSn">
			<view class="orderSn-key">订单编号:</view>
			<view class="orderSn-value">{{orderInfo.orderSn}}</view>
		</view>
		<view class="orderTotal">
			<view class="orderTotal-key">订单金额:</view>
			<view class="orderTotal-value">{{orderInfo.totalAmount}}元</view>
		</view>
		<view class="pay-way">
			<view class="pay-title">选择支付方式</view>
			<view class="way-item">
				<image src="../../../static/icons/alipay.png" class="img"></image>
				<view class="way-name">支付宝支付</view>
			    <radio :checked="true" color="#354e44"/>
			</view>
			<view class="way-item">
				<image src="../../../static/icons/wxpay.png" class="img"></image>
				<view class="way-name">微信支付</view>
			    <radio :checked="false" color="#354e44"/>
			</view>
		</view>
		<button @tap="payNow" type="default" class="btn-pay">立即支付</button>
		<view class="order-desc">
			点击立即支付,即代表您同意
			<text>《条款协议》</text>
		</view>
	</view>
</template>

<script>
	import {getPreOrderById,payConfirm} from "../../../api/order/pay/index.js"
	export default {
		data(){
			return{
				orderId:"",
				orderInfo:[],
				isChecked:true,
				payType:1
			}
		},
		methods:{
			getOrderInfo(){
				getPreOrderById(this.orderId).then(res=>{
					console.log(res);
					let {success,data,message}=res;
					if(success){
						this.orderInfo=data.orderBase;
					}else{
						uni.showToast({
							title:message,
							icon:"none"
						})
					}
				})
			},
			payNow(){
				payConfirm({
					"orderId":this.orderId,
					"payType":this.payType
				}).then(res=>{
					console.log(res);
					let {success,message}=res;
					if(success){
						uni.showToast({
							title:"支付成功",
							icon:"success"
						})
						setTimeout(()=>{
							uni.navigateTo({
								url:`/pages/order/pay/payInfo/payInfo?total=${this.orderInfo.totalAmount}`
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
		onLoad(options) {
			console.log(options);
			this.orderId=options.orderId;
			this.getOrderInfo();
		}
	}
</script>

<style lang="scss" scoped>
	.pay{
		width: 100%;
		height: 100vh;
		background-color: #f1ece7;
		padding: 0 22rpx;
		box-sizing: border-box;
		.orderSn{
			width: 100%;
			height: 90rpx;
			display: flex;
			justify-content: start;
			align-items: center;
			.orderSn-key{
				color: #7d7d7d;
				font-size: 32rpx;
			}
			.orderSn-value{
				font-size: 32rpx;
				margin-left: 10rpx;
			}
		}
		.orderTotal{
			width: 100%;
			height: 90rpx;
			display: flex;
			justify-content: start;
			align-items: center;
			margin-bottom: 40rpx;
			.orderTotal-key{
				color: #7d7d7d;
				font-size: 32rpx;
			}
			.orderTotal-value{
				font-size: 32rpx;
				margin-left: 10rpx;
				color: #354e44;
			}
		}
		.pay-way{
			.pay-title{
				width: 100%;
				font-size: 34rpx;
			}
			.way-item{
				width: 100%;
				height: 120rpx;
				display: flex;
				justify-content: start;
				align-items: center;
				.img{
					width: 80rpx;
					height: 80rpx;
					display: block;
					margin-right: 20rpx;
				}
				.way-name{
					font-size: 30rpx;
					width: 550rpx;
				}
			}
		}
		.btn-pay{
			display: block;
			width: 520rpx;
			height: 80rpx;
			line-height: 80rpx;
			background-color: #354e44;
			border-radius: 40rpx;
			text-align: center;
			color: #fff;
			font-size: 36rpx;
			margin-top: 80rpx;
			margin-bottom: 10rpx;
		}
		.order-desc{
			width: 520rpx;
			font-size: 24rpx;
			color: #999;
			margin: 0 auto;
			text-align: center;
			text{
				color: #5a9ef7;
			}
		}
	}
</style>
