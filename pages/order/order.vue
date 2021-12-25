<template>
	<view class="order">
		<view class="title">等待支付</view>
		<navigator url="/pages/mine/address/address">
			<view class="address" v-if="isNull">去选择收货地址</view>
			<view class="address-item" v-else>
				<view class="item-left">
					<view class="item-left-top">
						<view class="item-name">{{addressList.name}}</view>
						<view class="item-tel">{{addressList.phoneNumber}}</view>
						<view class="item-default" v-if="addressList.defaultStatus">默认</view>
					</view>
					<view class="item-address">{{addressList.province}} {{addressList.city}} {{addressList.region}} {{addressList.detailAddress}}</view>
				</view>
			</view>
		</navigator>
		<view class="orderList">
			<view class="orderHeader">
				<view class="orderNumber">订单编号:{{orderBase.orderSn}}</view>
				<view class="headerRight">等待支付</view>
			</view>
				<view class="orderMain" v-for="item in orderInfo" :key="item.id">
					<image :src="item.productSkuPic" class="main-photo"></image>
					<view class="main-right">
						<view class="first">
							<view class="main-name">{{item.productName}}</view>
							<view class="main-price">￥{{item.productPrice}}元</view>
						</view>
						<view class="second">
							<view class="main-imei">编号:{{item.id}}</view>
							<view class="main-num">×{{item.productQuantity}}</view>
						</view>
						<view class="main-spec">规格: {{item.productAttr[0].key}} : {{item.productAttr[0].value}}  {{item.productAttr[1].key}} : {{item.productAttr[1].value}}</view>
					</view>
				</view>
			<view class="orderTotal">合计: {{orderBase.totalAmount}}元</view>
			<view class="definepay" @tap="definePay">确认付款</view>
		</view>
	</view>
</template>

<script>
	import {getPreOrderById,addConfirmOrder} from "../../api/order/index.js"
	export default{
		data(){
			return{
				orderId:"",
				orderInfo:"",
				orderBase:"",
				addressList:{},
				isNull:"true"
			}
		},
		methods:{
			getOrderInfo(){
				getPreOrderById(this.orderId).then(res=>{
					// console.log(res)
					let {success,data,message}=res;
					if(success){
						this.orderInfo=data.orderItems
						data.orderItems.forEach(ele=>ele.productAttr=JSON.parse(ele.productAttr))
						this.orderBase=data.orderBase
					}else{
						uni.showToast({
							title:message,
							icon:"none"
						})
					}
				})
			},
			
			definePay(){
				addConfirmOrder(
				  {
				    "addressId": this.addressList.id,
				    "orderId": this.orderId,
				    "orderItemList": [
				      {
				        "productId": this.orderInfo[0].productId,
				        "productQuantity": this.orderInfo[0].productQuantity,
				        "productSkuId": this.orderInfo[0].productSkuId
				      }
				    ]
				  }
				).then(res=>{
					// console.log(res)
					let {success,data,message}=res;
					if(success){
						uni.navigateTo({
							url:`/pages/order/pay/pay?orderId=${data.orderId}`
						})
					}else{
						uni.showToast({
							title:message,
							icon:"none"
						})
					}
				})
			},
			getAddressList(){
				this.addressList=this.$store.state.item;
				// console.log(this.addressList)
				if(this.addressList.name){
					this.isNull=false
				}else{
					this.isNull=true
				}
			}
		},
		onLoad(options){
			// console.log(options);
			this.orderId=options.orderId;
		},
		onShow() {
			this.getOrderInfo();
			this.getAddressList();
		}
	}
</script>

<style lang="scss" scoped>
	.order{
		width: 100%;
		height: 100vh;
		padding-bottom: 100rpx;
		background-color: #f1ece7;
		display: flex;
		justify-content: start;
		align-items: center;
		flex-direction: column;
		.title{
			width: 650rpx;
			height: 88rpx;
			line-height: 88rpx;
			border-bottom: 2rpx solid #ccc;
			box-sizing: border-box;
			margin: 0 auto;
			font-size: 36rpx;
			color: #494949;
		}
		.address{
			width: 650rpx;
			height: 136rpx;
			line-height: 96rpx;
			border-bottom: 2rpx solid #ccc;
			box-sizing: border-box;
			margin: 0 auto;
			padding: 20rpx 0;
			font-size: 28rpx;
			color: #494949;
		}
		.address-item{
			width: 650rpx;
			height: 136rpx;
			padding: 20rpx 0;
			margin: 0 auto;
			border-bottom: 2rpx solid #ccc;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.item-left{
				width: 100%;
				padding-left: 30rpx;
				box-sizing: border-box;
				display: flex;
				justify-content: start;
				align-items: start;
				flex-direction: column;
				.item-left-top{
					display: flex;
					justify-content: start;
					align-items: center;
					margin-bottom: 20rpx;
					.item-name{
						font-size: 28rpx;
						margin-right: 20rpx;
					}
					.item-tel{
						font-size: 24rpx;
						color: #999;
					}
					.item-default{
						width: 48rpx;
						background-color: #354e44;
						border-radius: 10rpx;
						padding: 0 18rpx;
						font-size: 22rpx;
						color: #fff;
						margin-left: 20rpx;
					}
				}
				.item-address{
					width: 100%;
					color: #333;
					font-size: 24rpx;
				}
			}
			.item-edit{
				flex: 1;
				height: 88rpx;
				border-left: 1rpx solid #ccc;
				display: flex;
				justify-content: center;
				align-items: center;
				image{
					width: 40rpx;
					height: 40rpx;
				}
			}
		}
		.orderList{
			width: 672rpx;
			margin: 30rpx auto;
			padding: 36rpx;
			box-sizing: border-box;
			background-color: #fff;
			border-radius: 20rpx;
			display: flex;
			justify-content: start;
			align-items: center;
			flex-direction: column;
			.orderHeader{
				width: 100%;
				height: 32rpx;
				line-height: 32rpx;
				padding-bottom: 30rpx;
				color: #3e3e3e;
				font-size: 24rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.headerRight{
					color: #034c46;
				}
			}
			.orderMain{
				width: 100%;
				height: 226rpx;
				padding: 30rpx 0;
				border-top: 2rpx solid #ccc;
				border-bottom: 2rpx solid #ccc;
				box-sizing: border-box;
				display: flex;
				justify-content: center;
				align-items: center;
				.main-photo{
					width: 162rpx;
					height: 162rpx;
				}
				.main-right{
					flex: 1;
					height: 162rpx;
					margin-left: 28rpx;
					.first{
						height: 74rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;
						color: #3e3e3e;
						font-size: 26rpx;
						line-height: 74rpx;
							.main-name{
								width:260rpx;
								overflow: hidden;
								white-space: nowrap;
								text-overflow: ellipsis;
							}
					}
					.second{
						height: 30rpx;
						margin-top: 4rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;
						color: #8d8d8d;
						font-size: 22rpx;
						line-height: 30rpx;	
					}
					.main-spec{
						width: 100%;
						height: 30rpx;
						margin-top: 4rpx;
						color: #8d8d8d;
						font-size: 22rpx;
						line-height: 30rpx;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
				}
			}
			.orderTotal{
				width: 100%;
				height: 36rpx;
				line-height: 36rpx;
				font-size: 26rpx;
				margin-top: 14rpx;
				text-align: right;
			}
			.definepay{
				width: 124rpx;
				height: 50rpx;
				line-height: 50rpx;
				color: #2d4f43;
				font-size: 26rpx;
				border: 2rpx solid #2d4f43;
				border-radius: 10rpx;
				text-align: center;
				margin: 20rpx 0 0 470rpx;
			}
		}
	}
</style>
