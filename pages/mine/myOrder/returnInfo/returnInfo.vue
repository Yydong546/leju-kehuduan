<template>
	<view class="returnInfo">
		<view class="after-list">
			<view class="after-header">
				<view class="after-orderNumber">订单编号:{{orderInfo.orderSn}}</view>
			</view>
			<view class="after-main" v-if="getReturnInfoList.id">
				<image :src="returnProductInfo.productPic" class="after-main-photo"></image>
				<view class="after-main-right">
					<view class="first">
						<view class="first-main-name">{{returnProductInfo.productName}}</view>
						<view class="first-main-price">￥{{returnProductInfo.productPrice}}元</view>
					</view>
					<view class="second">
						<view class="second-main-imei">编号:{{returnProductInfo.id}}</view>
						<view class="second-main-num">×{{returnProductInfo.productCount}}</view>
					</view>
					<view class="after-main-spec">规格: {{returnProductInfo.productAttr[0].key}} : {{returnProductInfo.productAttr[0].value}}
						{{returnProductInfo.productAttr[1].key}} : {{returnProductInfo.productAttr[1].value}}
					</view>
				</view>
			</view>
			<view class="after-desc">
				<view class="after-orderTime">时间:{{returnProductInfo.createTime}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {getPreOrderById,orderReturn} from "../../../../api/mine/myOrder/returnInfo/index.js"
	export default {
		data(){
			return{
				orderId:"",
				id:"",
				returnId:"",
				orderInfo:[],
				returnProductInfo:[],
				orderReturnInfo:[]
			}
		},
		methods:{
			getReturnInfoList(){
				getPreOrderById(this.orderId).then(res=>{
					console.log(res)
					let {success,data,message}=res;
					if(success){
					    this.orderInfo=data.orderBase
						// console.log(this.orderInfo)
						data.orderItems.forEach(ele=>ele.productAttr=JSON.parse(ele.productAttr))
						this.returnProductInfo=data.orderItems.find(ele=>ele.returnId==this.id)
						// console.log(this.returnProductInfo)
						this.returnId=this.returnProductInfo.returnId
						console.log(this.returnId)
					}else{
						uni.showToast({
							title:message,
							icon:"none"
						})
					}
				})
			},
			getOrderReturnInfo(){
				orderReturn(JSON.stringify(this.returnId)).then(res=>{
					console.log(res)
				})
			}
		},
		onLoad(options) {
			// console.log(options)
			this.orderId=options.orderId
			this.id=options.id
			this.getReturnInfoList();
			this.getOrderReturnInfo();
		},
		onShow() {
			
		}
	}
</script>

<style lang="scss" scoped>
	.returnInfo{
		width: 100%;
		height: 100vh;
		overflow: auto;
		background-color: #f1ece7;
	}
</style>
