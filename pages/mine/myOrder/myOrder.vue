<template>
	<view class="myOrder">
		<view class="nav">
			<view @tap="changeItem(index)" class="nav-item" :class="{'red':onIndex==index}"
				v-for="(item,index) in navItem" :key="index">{{item.name}}</view>
		</view>

		<!-- 页面内容区域 -->
		<view class="container" v-if="onIndex!=4">
			<view class="orderList" v-for="(item,index) in newOrderInfo" :key="index">
				<view class="orderHeader">
					<view class="orderNumber">订单编号:{{item.order.orderSn}}</view>
					<view class="headerRight">{{item.order.status | statusText}}</view>
				</view>
				<view class="orderMain" v-for="item2 in item.items" :key="item2.id">
					<image :src="item2.productSkuPic" class="main-photo"></image>
					<view class="main-right">
						<view class="first">
							<view class="main-name">{{item2.productName}}</view>
							<view class="main-price">￥{{item2.productPrice}}元</view>
						</view>
						<view class="second">
							<view class="main-imei">编号:{{item2.id}}</view>
							<view class="main-num">×{{item2.productQuantity}}</view>
						</view>
						<view class="main-spec">规格: {{item2.productAttr[0].key}} : {{item2.productAttr[0].value}}
							{{item2.productAttr[1].key}} : {{item2.productAttr[1].value}}
						</view>
					</view>
					<view @tap="goReturnOrder(item.order.id,item2.id)" class="return" v-if="onIndex==2">退货</view>
				</view>
				<view class="order-desc">
					<view class="orderTime">时间:{{item.order.createTime}}</view>
					<view class="orderTotal">合计: {{item.order.totalAmount}}元</view>
				</view>
				<view class="ispay" v-if="item.order.status==0">
					<view @tap="NoOrder(item.order.id)" class="cancelpay">取消订单</view>
					<view @tap="surePay(item.order.id)" class="definepay">付款</view>
				</view>
				<view class="isreceive" v-if="item.order.status==2">
					<view @tap="sureReceive(item.order.id)" class="defineReceive">确认收货</view>
				</view>
				<view class="removeOrder" v-if="item.order.status==3">
					<view @tap="sureRemoveOrder(item.order.id)" class="sureremove">订单已关闭,点击删除记录</view>
				</view>
			</view>
		</view>
		<!-- 售后页面 -->
		<view class="aftermarket" v-else>
			<view class="after-list" v-for="item in returnInfo" :key="item.id">
				<view class="after-header">
					<view class="after-orderNumber">订单编号:{{item.orderSn}}</view>
					<view @tap="goReturnInfo(item.orderId,item.id)" class="after-headerRight">{{item.status | orderProcessText}}</view>
				</view>
				<view class="after-main">
					<image :src="item.productPic" class="after-main-photo"></image>
					<view class="after-main-right">
						<view class="first">
							<view class="first-main-name">{{item.productName}}</view>
							<view class="first-main-price">￥{{item.productPrice}}元</view>
						</view>
						<view class="second">
							<view class="second-main-imei">编号:{{item.id}}</view>
							<view class="second-main-num">×{{item.productCount}}</view>
						</view>
						<view class="after-main-spec">规格: {{item.productAttr[0].key}} : {{item.productAttr[0].value}}
							{{item.productAttr[1].key}} : {{item.productAttr[1].value}}
						</view>
					</view>
				</view>
				<view class="after-desc">
					<view class="after-orderTime">时间:{{item.createTime}}</view>
					<view class="after-orderTotal">合计: {{item.productCount*item.productPrice}}元</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		findAllOrders,cancelOrder,receiveDone,clearOrderFocus,orderReturnApplys
	} from "../../../api/mine/myOrder/index.js"
	import mixin from "../../../mixins/index.js"
	export default {
		mixins: [mixin],
		data() {
			return {
				onIndex: "",
				// current:""
				navItem: [{
						name: "待付款"
					},
					{
						name: "已付款"
					},
					{
						name: "已发货"
					},
					{
						name: "已收货"
					},
					{
						name: "售后"
					}
				],
				orderInfo: [],
				returnInfo:[]
			}
		},
		methods: {
			// 点击切换nav栏,获取数据
			changeItem(index) {
				this.onIndex = index
			},
			// 获取订单列表数据
			getOrderInfo() {
				findAllOrders().then(res => {
					// console.log(res)
					let {
						success,
						data,
						message
					} = res;
					if (success) {
						data.orderList.forEach(ele => ele.items.forEach(ele => ele.productAttr = JSON.parse(ele
							.productAttr)))
						this.orderInfo = data.orderList;
						// console.log(this.orderInfo)
					} else {
						uni.showToast({
							title: message,
							icon: "none"
						})
					}
				})
			},
			// 取消订单
			NoOrder(orderId){
				// console.log(orderId)
				cancelOrder(orderId).then(res=>{
					// console.log(res)
					let {success,message}=res;
					if(success){
						uni.showToast({
							title:"取消成功",
							icon:"none"
						})
					}else{
						uni.showToast({
							title:message,
							icon:"none"
						})
					}
				})
			},
			// 确认付款
			surePay(orderId){
				uni.navigateTo({
					url:`/pages/order/order?orderId=${orderId}`
				})
			},
			// 确认收货
			sureReceive(orderId){
				receiveDone({
					"orderId":orderId
				}).then(res=>{
					// console.log(res)
					let {success,message}=res;
					if(success){
						uni.showToast({
							title:"收货成功",
							icon:"none"
						})
					}else{
						uni.showToast({
							title:message,
							icon:"none"
						})
					}
				})
			},
			// 订单关闭,删除订单信息
			sureRemoveOrder(orderId){
				if (!this.checkLogin()) {
					return
				}
				clearOrderFocus(orderId).then(res=>{
					// console.log(res)
					let {success,message}=res;
					if(success){
						uni.showToast({
							title:"删除成功",
							icon:"none"
						})
					}else{
						uni.showToast({
							title:message,
							icon:"none"
						})
					}
				})
			},
			// 获取退单列表
			getReturnInfo(){
				orderReturnApplys().then(res=>{
					// console.log(res)
					let {success,data,message}=res;
					if(success){
						data.items.forEach(ele=>ele.productAttr=JSON.parse(ele.productAttr))
						this.returnInfo=data.items;
					}else{
						uni.showToast({
							title:message,
							icon:"none"
						})
					}
				})
			},
		    // 点击退货跳转到退货填写信息页面
			goReturnOrder(orderId,id){
				console.log(orderId,id)
				uni.navigateTo({
					url:`/pages/mine/myOrder/returnOrder/returnOrder?orderId=${orderId}&id=${id}`
				})
			},
			// 售后中点击状态跳转到退货信息页面
			goReturnInfo(orderId,id){
				console.log(orderId,id)
				uni.navigateTo({
					url:`/pages/mine/myOrder/returnInfo/returnInfo?orderId=${orderId}&id=${id}`
				})
			}
		},
		filters: {
			statusText(val) {
				if (val == 0) {
					return "未付款"
				} else if (val == 1) {
					return "已付款,等待发货"
				} else if (val == 2) {
					return "已发货"
				} else if (val == 3) {
					return "已收货"
				} else if (val == 4) {
					return "已退单"
				} else {
					return "无效订单"
				}
			},
		    orderProcessText(process) {
				var text = '等待处理';
				switch (JSON.stringify(process)) {
					case '0':
						text = '等待处理';
						break;
					case '1':
						text = '确认退货,等待用户发货';
						break;
					case '2':
						text = '已退款';
						break;
					case '3':
						text = '已拒绝';
						break;
					case '9':
						text = '拒绝退货';
						break;

					default:
						break;
				}
				return text;
		    }
		},
		computed: {
			newOrderInfo() {
				if (this.onIndex < 3) {
					return this.orderInfo.filter(ele => ele.order.status == this.onIndex)
				} else if (this.onIndex == 3) {
					return this.orderInfo.filter(ele => ele.order.status == 3 || ele.order.status == 4)
				}
			}
		},
		onLoad(options) {
			if (!this.checkLogin()) {
				return
			}
			// console.log(options)
			this.onIndex = options.index;
			this.getOrderInfo();
			this.getReturnInfo();
		}
	}
</script>

<style lang="scss" scoped>
	.myOrder {
		width: 100%;
		height: 100%;
		background-color: #f1ece7;

		.nav {
			width: 100%;
			height: 80rpx;
			line-height: 60rpx;
			padding-top: 10rpx;
			box-sizing: border-box;
			display: flex;
			justify-content: space-around;
			align-items: center;
			background-color: #354e44;
			font-size: 30rpx;
			color: #fff;
			position: fixed;
			left: 0;
			top: 88rpx;
			z-index: 11;

			.nav-item {
				box-sizing: border-box;
			}

			.red {
				color: #dd524d;
				border-bottom: 2rpx solid #dd524d;
			}
		}

		.container {
			width: 100%;
			height: 100vh;
			overflow: auto;
			margin-top: 80rpx;
			.orderList {
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

				.orderHeader {
					width: 100%;
					height: 32rpx;
					line-height: 32rpx;
					padding-bottom: 30rpx;
					color: #3e3e3e;
					font-size: 24rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;

					.headerRight {
						color: #034c46;
					}
				}

				.orderMain {
					width: 100%;
					height: 226rpx;
					padding: 30rpx 0;
					border-top: 2rpx solid #ccc;
					border-bottom: 2rpx solid #ccc;
					box-sizing: border-box;
					display: flex;
					justify-content: center;
					align-items: center;
					position: relative;

					.main-photo {
						width: 162rpx;
						height: 162rpx;
					}

					.main-right {
						flex: 1;
						height: 162rpx;
						margin-left: 28rpx;

						.first {
							height: 74rpx;
							display: flex;
							justify-content: space-between;
							align-items: center;
							color: #3e3e3e;
							font-size: 26rpx;
							line-height: 74rpx;

							.main-name {
								width: 260rpx;
								overflow: hidden;
								white-space: nowrap;
								text-overflow: ellipsis;
							}
						}

						.second {
							height: 30rpx;
							margin-top: 4rpx;
							display: flex;
							justify-content: space-between;
							align-items: center;
							color: #8d8d8d;
							font-size: 22rpx;
							line-height: 30rpx;
						}

						.main-spec {
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
					.return{
						position:absolute;
						right: 0;
						bottom: 10rpx;
						color: #8d8d8d;
						font-size: 24rpx;
						border-bottom: 2rpx solid #8d8d8d;
					}
				}

				.order-desc {
					width: 100%;
					height: 36rpx;
					line-height: 36rpx;
					font-size: 26rpx;
					margin-top: 14rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;

					.orderTotal {
						color: #dd524d;
					}
				}

				.ispay {
					width: 100%;
					height: 50rpx;
					display: flex;
					justify-content: flex-end;
					align-items: center;
					margin-top: 20rpx;

					.cancelpay {
						width: 124rpx;
						height: 50rpx;
						line-height: 50rpx;
						color: #2d4f43;
						font-size: 26rpx;
						border: 2rpx solid #2d4f43;
						border-radius: 10rpx;
						text-align: center;
						margin-right: 20rpx;
					}

					.definepay {
						width: 124rpx;
						height: 50rpx;
						line-height: 50rpx;
						color: #2d4f43;
						font-size: 26rpx;
						border: 2rpx solid #2d4f43;
						border-radius: 10rpx;
						text-align: center;
					}
				}
				.isreceive{
					width: 100%;
					height: 50rpx;
					display: flex;
					justify-content: flex-end;
					align-items: center;
					margin-top: 20rpx;
					.defineReceive{
						width: 124rpx;
						height: 50rpx;
						line-height: 50rpx;
						color: #2d4f43;
						font-size: 26rpx;
						border: 2rpx solid #2d4f43;
						border-radius: 10rpx;
						text-align: center;
					}
				}
				.removeOrder{
					width: 100%;
					height: 50rpx;
					display: flex;
					justify-content: end;
					align-items: center;
					margin-top: 20rpx;
					.sureremove{
						width: 350rpx;
						height: 50rpx;
						line-height: 50rpx;
						padding: 0 26rpx;
						box-sizing: border-box;
						font-size: 26rpx;
						color: #2d4f43;
						border: 2rpx solid #dd524d;
						border-radius: 10rpx;
						text-align: center;
					}
				}
			}
		}
		.aftermarket {
			width: 100%;
			height: 100vh;
			overflow: auto;
			margin-top: 80rpx;
			.after-list {
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
		
				.after-header {
					width: 100%;
					height: 32rpx;
					line-height: 32rpx;
					padding-bottom: 30rpx;
					color: #3e3e3e;
					font-size: 24rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
		
					.after-headerRight {
						color: #034c46;
					}
				}
		
				.after-main {
					width: 100%;
					height: 226rpx;
					padding: 30rpx 0;
					border-top: 2rpx solid #ccc;
					border-bottom: 2rpx solid #ccc;
					box-sizing: border-box;
					display: flex;
					justify-content: center;
					align-items: center;
					position: relative;
		
					.after-main-photo {
						width: 162rpx;
						height: 162rpx;
					}
		
					.after-main-right {
						flex: 1;
						height: 162rpx;
						margin-left: 28rpx;
		
						.first {
							height: 74rpx;
							display: flex;
							justify-content: space-between;
							align-items: center;
							color: #3e3e3e;
							font-size: 26rpx;
							line-height: 74rpx;
		
							.first-main-name {
								width: 260rpx;
								overflow: hidden;
								white-space: nowrap;
								text-overflow: ellipsis;
							}
						}
		
						.second {
							height: 30rpx;
							margin-top: 4rpx;
							display: flex;
							justify-content: space-between;
							align-items: center;
							color: #8d8d8d;
							font-size: 22rpx;
							line-height: 30rpx;
						}
		
						.after-main-spec {
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
		
				.after-desc {
					width: 100%;
					height: 36rpx;
					line-height: 36rpx;
					font-size: 26rpx;
					margin-top: 14rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
		
					.after-orderTotal {
						color: #dd524d;
					}
				}
			}
		}
	}
</style>
