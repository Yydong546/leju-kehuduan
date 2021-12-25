<template>
	<view class="returnOrder">
		<!-- 退货订单信息 -->
		<view class="orderList">
			<view class="orderHeader">
				<view class="orderNumber">订单编号: {{orderInfo.orderSn}}</view>
			</view>
				<view class="orderMain">
					<image :src="productInfo.productSkuPic" class="main-photo"></image>
					<view class="main-right" v-if="productInfo.productAttr">
						<view class="first">
							<view class="main-name">{{productInfo.productName}}</view>
							<view class="main-price">￥{{productInfo.productPrice}}元</view>
						</view>
						<view class="second">
							<view class="main-imei">编号:{{productInfo.id}}</view>
							<view class="main-num">×{{productInfo.productQuantity}}</view>
						</view>
						<view class="main-spec">规格: {{productInfo.productAttr[0].key}} : {{productInfo.productAttr[0].value}}  {{productInfo.productAttr[1].key}} : {{productInfo.productAttr[1].value}}</view>
					</view>
				</view>
			<view class="orderTotal">合计: {{productInfo.totalPrice}}元</view>
		</view>
	    <!-- 问题描述部分 -->
		<view class="container">
			<view class="return-num">
				<view class="num-key">请选择退单数量:</view>
				<view class="num-value">{{productInfo.productQuantity}}</view>
			</view>
			<view class="return-reason">
				<view class="reason-key">请输入退货原因:</view>
				<input class="reason-value" type="text" v-model="reason" placeholder="请输入退货原因"/>
			</view>
			<view class="return-address">
				<view class="address-key">请选择退货地址:</view>
				<view class="address-value" v-if="addressList[0]">
					<picker mode="selector" :value="value" range-key="region" :range="addressList" @change="changeValue">
						<view>{{addressList[value].region}}</view>
					</picker>
				</view>	
			</view>
			<view class="return-questions">
				<view class="questions-key">请输入问题描述:</view>
				<textarea class="questions-value" v-model="questionsDesc" placeholder="请输入问题描述"/>
			</view>
			<view class="return-photo">
				<view class="photo-title">温馨提醒:</view>
				<view class="photo-desc">上传图片总大小不能超过3m，单个文件大小不能超过1m，图片总个数不能超过3张</view>
				<view class="photo-icon">
					<view class="icon-tip" @tap="updateImg">
						<view class="tip-bg">+</view>
						<view class="tip-title">上传图片</view>
					</view>
						<image v-for="item in imgPath" :src="item.path" class="icon-img"></image>
				</view>
			</view>
		</view>
		<button @tap="submit" class="btn" type="default">提交</button>
	</view>
</template>

<script>
	import baseurl from "../../../../api/baseurl.js"
	import {getPreOrderById,addOrderReturnApply,getCompanyAddrss} from "../../../../api/mine/myOrder/returnOrder/index.js"
	export default {
		data(){
			return{
				orderId:"",
				id:"",
				orderInfo:[],
				productInfo:[],
				reason:"",
				addressList:[],
				value:0,
				questionsDesc:"",
				imgPath:[]
			}
		},
		methods:{
			// 获取订单信息和商品信息
			getOrderInfo(){
				getPreOrderById(this.orderId).then(res=>{
					// console.log(res)
					let {success,data,message}=res;
					if(success){
						this.orderInfo=data.orderBase
						data.orderItems.forEach(ele=>ele.productAttr=JSON.parse(ele.productAttr))
						this.productInfo=data.orderItems.find(ele=>ele.id==this.id)
						// console.log(this.productInfo)
					}else{
						uni.showToast({
							title:message,
							icon:"none"
						})
					}
				})
			},
			// 获取公司地址
			getAddressList(){
				getCompanyAddrss().then(res=>{
					// console.log(res)
					let {success,data,message}=res;
					if(success){
						this.addressList=data.items
						
					}else{
						uni.showToast({
							title:message,
							icon:"none"
						})
					}
				})
			},
			changeValue(e){
				console.log(e);
				this.value=e.detail.value;
			},
			updateImg(){
				var _this=this;
				uni.chooseFile({
					success(res) {
						console.log(res)
						if(res.tempFiles.length>3){
							uni.showToast({
								title:"一次不能上传超过三张图片",
								icon:"none"
							})
							return
						}
						let item =res.tempFiles.forEach(ele=>ele.size>1024*1024)
						if(item){
							uni.showToast({
								title:"单张图片大小不能超过1M",
								icon:"none"
							})
							return
						}
						if((_this.imgPath.length+res.tempFiles.length)>3){
							uni.showToast({
								title:"总图片不能超过三张图片",
								icon:"none"
							})
							return
						}
						_this.imgPath.push(...res.tempFiles)
					}
				})
			},
			submit(){
				// 上传图片到服务器
				var arr =[]
				this.imgPath.forEach(ele=>{
					var p=new Promise((resolve,reject)=>{
						uni.uploadFile({
							url:baseurl+"/lejuClient/orderReturn/uploadImg",
							filePath:ele.path,
							name:"file",
							success(res){
								resolve(res)
								// console.log(res);
								// arr.push(JSON.parse(res.data).data.fileUrl)
							}
						})
					})
					arr.push(p)
				})
				// let tempPromise =Promise.all(arr)
				// console.log(tempPromise);
				var imgPaths = []
				Promise.all(arr).then(res=>{
					console.log(res)
					res.forEach(ele=>{
						imgPaths.push(JSON.parse(ele.data).data.fileUrl)
					})
					addOrderReturnApply({
						  "companyAddressId":this.addressList[this.value].id,
						  "count": this.productInfo.productQuantity,
						  "description": this.questionsDesc,
						  "orderId": this.orderId,
						  "orderItemId": this.id,
						  "proofPics":imgPaths.join(","),
						  "reason": this.reason
					}).then(res=>{
						console.log(res)
						let {success,data,message}=res;
						if(success){
							uni.showToast({
								title:"退货成功",
								icon:"none"
							})
						}else{
							uni.showToast({
								title:message,
								icon:"none"
							})
						}
					})	
				})
			}
		},
		onLoad(options) {
			// console.log(options);
			this.orderId=options.orderId;
			this.id=options.id;
			this.getOrderInfo();
			this.getAddressList();
		}
	}
</script>

<style lang="scss" scoped>
	.returnOrder{
		width: 100%;
		// height: 100vh;
		background-color: #f1ece7;
		overflow: hidden;
		padding: 0 30rpx;
		box-sizing: border-box;
		// 退货订单信息
		.orderList{
			width: 100%;
			margin: 30rpx 0;
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
		}
	    .container{
			width: 100%;
			background-color: #fff;
			border-radius: 20rpx;
			.return-num{
				width: 100%;
				height: 90rpx;
				padding: 30rpx;
				box-sizing: border-box;
				font-size: 24rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 2rpx solid #f1ece7;
			}
			.return-reason{
				width: 100%;
				height: 90rpx;
				padding: 30rpx;
				box-sizing: border-box;
				font-size: 24rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 2rpx solid #f1ece7;
				.reason-value{
					width: 300rpx;
					text-align: right;
					font-size: 26rpx;
				}
			}
			.return-address{
				width: 100%;
				height: 90rpx;
				padding: 30rpx;
				box-sizing: border-box;
				font-size: 24rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 2rpx solid #f1ece7;
			}
			.return-questions{
				width: 100%;
				height: 360rpx;
				padding: 30rpx;
				box-sizing: border-box;
				font-size: 24rpx;
				display: flex;
				justify-content: space-between;
				align-items: start;
				border-bottom: 2rpx solid #f1ece7;
				.questions-value{
					width: 300rpx;
					font-size: 24rpx;
				}
			}
			.return-photo{
				width: 100%;
				height: 320rpx;
				padding: 30rpx;
				box-sizing: border-box;
				font-size: 24rpx;
				display: flex;
				justify-content: start;
				align-items: start;
				flex-direction: column;
				border-bottom: 2rpx solid #f1ece7;
				.photo-title{
					margin-bottom: 4rpx;
					font-weight: 600;
				}
				.photo-desc{
					margin-bottom: 30rpx;
				}
				.photo-icon{
					width: 100%;
					height: 120rpx;
					display: flex;
					justify-content: start;
					align-items: center;
					.icon-tip{
						width: 120rpx;
						height: 120rpx;
						text-align: center;
						display: flex;
						justify-content: center;
						align-items: center;
						flex-direction: column;
						.tip-bg{
							width: 100%;
							height: 80rpx;
							font-size: 100rpx;
							color: #ccc;
							line-height: 80rpx;
						}
						.tip-title{
							display: block;
							width: 100%;
							height: 40rpx;
							line-height: 40rpx;
						}
					}
					.icon-img{
						width: 120rpx;
						height: 120rpx;
						margin-left: 20rpx;
					}
				}
			}
		}
	    .btn{
	     	display: block;
	     	width: 540rpx;
	     	height: 100rpx;
			line-height: 100rpx;
	     	margin: 120rpx auto;
			border-radius: 40rpx;
			background-color: #354e44;
			color: #fff;
			text-align: center;
			font-size: 30rpx;
	    }
	}
</style>
