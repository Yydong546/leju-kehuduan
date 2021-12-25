<template>
	<view class="cart">
		<view class="cart-list">
			<view class="cart-item" v-for="item in cartList" :key="item.id">
				<evan-checkbox primary-color="#354e44" v-model="item.isChecked">
					<view class="item-main" @tap.stop>
						<image :src="item.productPic" class="main-photo"></image>
						<view class="main-right">
							<view class="right-title">{{item.productName}}</view>
							<view class="right-sn">编号: {{item.id}}</view>
							<view class="right-price">价格:￥{{item.price}}</view>
							<view class="right-num">数量:{{item.quantity}}</view>
						</view>
					</view>
				</evan-checkbox>
				<view class="changeNum">
					<view class="numReduce" @tap="reduce(item)">-</view>
					<view class="number">{{item.quantity}}</view>
					<view class="numAdd" @tap="add(item)">+</view>
				</view>
			</view>
		</view>
		<view class="bottom">
			<view class="bottom-tip">全选</view>
			<evan-checkbox v-model="isAllChecked" primary-color="#354e44"></evan-checkbox>
			<view class="total">合计:￥<text>{{totalMoney}}</text></view>
		    <button class="settle" type="default" @tap="settlePay">结算</button>
		</view>
	</view>
</template>

<script>
	import {findAllCartItem,delCartItems,addPreOrder} from "../../../api/mine/cart/index.js";
	import mixin from "../../../mixins/index.js"
	export default {
		mixins:[mixin],
		data(){
			return{
				isChecked:false,
				cartList:[]
			}
		},
		computed:{
			isAllChecked:{
				get(){
					return this.cartList.every(ele=>ele.isChecked)
				},
				set(val){
					this.cartList.forEach(ele=>ele.isChecked=val)
				}
			},
			totalMoney(){
				return this.cartList.reduce((total,current)=>{
					if(current.isChecked){
						return total + current.price * current.quantity
					}else{
						return total
					}
				},0)
			}
		},
		methods:{
			getCartList(){
				findAllCartItem().then(res=>{
					// console.log(res)
					let {success,data,message}=res;
					if(success){
						data.items.forEach(ele=>ele.isChecked=false)
						this.cartList=data.items;
					}else{
						uni.showToast({
							title:message,
							icon:"none"
						})
					}
				})
			},
			// 点击减商品数量减少
			reduce(item){
				// console.log(item)
				if(item.quantity==1){
					uni.showModal({
						title:"是否要删除该商品?",
						success(res) {
							// console.log(res);
							if(res.confirm){
								// 调用删除接口
								delCartItems([item.id]).then(res=>{
									// console.log(res)
									let {success,message}=res;
									if(success){
										uni.showToast({
											title:"删除成功",
											icon:"success"
										})
									}else{
										uni.showToast({
											title:message,
											icon:"none"
										})
									}
								})
							}else if(res.cancel){
								uni.showToast({
									title:"您取消了",
									icon:"none"
								})
							}
						}
					})
				}else{
					item.quantity--
				}
			},
			// 点击加商品数量增加
			add(item){
				item.quantity++
			},
			// 结算
			settlePay(){
				let isNullNum=this.cartList.every(ele=>!ele.isChecked)
				if(isNullNum){ //未选商品
					uni.showToast({
						title:"请选择商品",
						icon:"none"
					})
				}else{ //调用接口
				 var obj={"orderItemList": []}
				 this.cartList.forEach(ele=>{
				    if(ele.isChecked){
				       let tempobj={
				       "cartId": ele.id,
				       "productId": ele.productId,
				       "productQuantity":ele.quantity,
				       "productSkuId": ele.productSkuId
				      }
					  obj.orderItemList.push(tempobj)
				 	}
				 })
					addPreOrder(obj).then(res=>{
						// console.log(res);
						let {success,data,message}=res;
						if(success){
							uni.showToast({
								title:"购买成功,1s后跳转到订单确认页",
								icon:"success"
							})
							setTimeout(()=>{
								uni.navigateTo({
									url:`/pages/order/order?orderId=${data.orderId}`
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
			}
		},
		onLoad() {
			// 判断是否登录
			if(!this.checkLogin()){
			    return 
			}
			this.getCartList();
		}
	}
</script>

<style lang="scss" scoped>
	.cart{
		width: 100%;
		height: 100vh;
		background-color: #f1ece7;
		overflow: hidden;
		.cart-list{
			width: 100%;
			padding: 0 40rpx;
			box-sizing: border-box;
			margin-top: 50rpx;
			.cart-item{
				width: 100%;
				height: 236rpx;
				padding: 20rpx;
				box-sizing: border-box;
				background-color: #fff;
				border-radius: 20rpx;
				margin-bottom: 50rpx;
				.item-main{
					width: 100%;
					display: flex;
					justify-content: start;
					align-items: center;
					.main-photo{
						width: 136rpx;
						height: 136rpx;
					}
					.main-right{
						flex: 1;
						height: 136rpx;
						margin-left: 30rpx;
						.right-title{
							width: 400rpx;
							color: #3e3e3e;
							font-size: 26rpx;
							margin-bottom: 6rpx;
						}
						.right-sn{
							color: #8d8d8d;
							font-size: 22rpx;
							margin-bottom: 6rpx;
						}
						.right-price{
							color: red;
							font-size: 22rpx;
							margin-bottom: 6rpx;
						}
						.right-num{
							color: #8d8d8d;
							font-size: 22rpx;
						}
					}
				}
				.changeNum{
					display: flex;
					justify-content: right;
					align-items: center;
					.numReduce{
						width: 60rpx;
						height: 60rpx;
						line-height: 60rpx;
						border-radius: 50%;
						background-color: #f1ece7;
						font-size: 30rpx;
						margin: 0 6rpx;
						text-align: center;
					}
					.number{
						width: 90rpx;
						height: 60rpx;
						line-height: 60rpx;
						border-radius: 30rpx;
						background-color: #f1ece7;
						font-size: 30rpx;
						margin: 0 6rpx;
						text-align: center;
					}
					.numAdd{
						width: 60rpx;
						height: 60rpx;
						line-height: 60rpx;
						border-radius: 50%;
						background-color: #f1ece7;
						font-size: 30rpx;
						margin: 0 6rpx;
						text-align: center;
					}
				}
			}
		}
		.bottom{
			width: 100%;
			height: 150rpx;
			background-color: #fff;
			position: fixed;
			bottom: 0;
			left: 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 50rpx;
			box-sizing: border-box;
			.bottom-tip{
				margin-right: 10rpx;
			}
			.total{
				width: 300rpx;
				// margin-left: 100rpx;
				text-align: right;
				text{
					color: red;
				}
			}
			.settle{
				display: block;
				width: 208rpx;
				height: 80rpx;
				line-height: 80rpx;
				border-radius: 28rpx;
				text-align: center;
				color: #fff;
				font-size: 32rpx;
				background-color: #354e44;
			}
		}
	}
</style>
