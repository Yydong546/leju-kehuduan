<template>
	<view class="detail">
		<!-- banner图部分 -->
		<swiper class="banner-list" :indicator-dots="true" :circular="true" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item class="banner-item" v-for="item in productList.skuList" :key="item.id">
				<image :src="item.pic"></image>
			</swiper-item>
		</swiper>
	    <!-- 商品介绍部分 -->
		<view class="productInfo">
			<view class="collect">
				<uni-icons @tap="collectedEvent" :color="collectedFlag?'red':'white'" class="collect-icon" type="star" size="30"></uni-icons>
			</view>
			<view class="product-pri">
				<view class="product-sale">￥{{productList.price}}</view>
				<view class="product-price">￥{{productList.price}}</view>
				<view class="product-pro">没有促销使用原价</view>
			</view>
			<view class="product-name">{{productList.name}}</view>
			<view class="product-desc">{{productList.description}}</view>
		</view>
		<!-- 详情部分 -->
		<mp-html :tag-style=obj :content="productList.detailMobileHtml" />
		<!-- 底部购物车和购买部分 -->
		<view class="shop">
			<image src="../../static/icons/kf.png" class="shop-icon"></image>
			<view class="shop-container">
				<view class="shop-cart" @tap="maskShow(1)">添加到购物车</view>
				<view class="shop-buy" @tap="maskShow(0)">立即购买</view>
			</view>
		</view>
		<!-- 蒙层及弹出框部分 -->
		<view class="mask" @touchmove.stop.prevent v-if="isShowMask">
			<view class="content">
				<image :src="skuList[current].pic" class="con-photo"></image>
				<view class="con-name">{{productList.name}}</view>
				<view class="con-storage">库存数量:{{skuList[current].stock}}</view>
				<image @tap="closeMask" src="../../static/icons/x.png" class="con-icon"></image>
				<view class="choose">
					<view class="choose-title">商品选择:</view>
					<view class="choose-list">
						<view v-for="(item,index) in skuList" :key="index" @tap="changeItem(index)" class="choose-item" :class="{'border':current==index}">
							<view class="choose-item-color">{{item.spData[0].key}}:{{item.spData[0].value}}</view>
							<view class="choose-item-big">{{item.spData[1].key}}:{{item.spData[1].value}}</view>
						</view>
					</view>
				</view>
				<view class="service">
					<view class="service-title">特色服务:</view>
					<view class="service-item">送货上门</view>
					<view class="service-item">上门安装</view>
				</view>
				<view class="num">
					<view class="num-title">购买数量</view>
					<view @tap="reduceNUm" class="numReduce">-</view>
					<view class="num-main">{{num}}</view>
					<view @tap="addNum(skuList[current].stock)" class="numAdd">+</view>
				</view>
				<button @tap="define(skuList[current].id)" type="default" class="btn">确定</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {productDetail,addPreOrder,addCart} from "../../api/details/index.js"
	import mixin from "../../mixins/index.js"
	export default {
		mixins:[mixin],
		data() {
			return {
			collectedFlag:false,
			productId:"",
			productList:[],
			skuList:[],
			isShowMask:false,
			// 用于判断点击的是购物车还是购买
			flag:"",
			// 用于点击sku列表时切换
			current:0,
			// 用于设置数量
			num:1,
			obj:{
				img:"width:80%;height:auto;display:block; margin:0 auto;"
			}
			}
		},
		methods: {
			maskShow(flag){
			this.isShowMask=!this.isShowMask;
			this.flag=flag;
			},
			closeMask(){
				this.isShowMask=!this.isShowMask
			},
			changeItem(index){
				this.current=index;
			},
			reduceNUm(){
				if(this.num==0){
					this.num=0
				}else{
					this.num--
				}
			},
			addNum(maxNUm){
				if(this.num==maxNUm){
					this.num=maxNUm;
				}else{
					this.num++
				}
			},
			define(productSkuId){
				var _this=this;
				if(this.num==0){
					uni.showToast({
						title:"商品数量不能为0",
						icon:"none"
					})
				}else{
					// 发送请求,判断点击的是购买还是添加到购物车
					if(this.flag){//添加到购物车
					    // 判断是否登录
						if(!this.checkLogin()){
							return 
						}
						addCart({
							  "productId": _this.productId,
							  "productSkuId": productSkuId,
							  "quantity": _this.num
						}).then(res=>{
							// console.log(res);
							let {success,data,message}=res;
							if(success){
								uni.showToast({
									title:"添加成功",
									icon:"none"
								})
							}else{
								uni.showToast({
									title:message,
									icon:'error'
								})
							}
						})
					}else{//购买,生成确认单
					    // 判断是否登录
					    if(!this.checkLogin()){
						    return 
					    }
						addPreOrder({
							"orderItemList": [
							    {
							      "productId": _this.productId,
							      "productQuantity": _this.num,
							      "productSkuId": productSkuId
							    }
							  ],
						}).then(res=>{
							// console.log(res)
							let {success,data,message}=res;
							if(success){
								uni.showToast({
									title:"购买成功.1s后跳转到订单确认页",
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
									icon:'error'
								})
							}
						})
					}
					
				}
			},
			getProductList(){
				productDetail(this.productId)
				.then(res=>{
					// console.log(res)
					let {success,data,message}=res;
					if(success){
						this.productList=data.product;
						data.product.skuList.forEach(ele=>{
							ele.spData = JSON.parse(ele.spData)
						});
						this.skuList=data.product.skuList;
						uni.setNavigationBarTitle({
							title:data.product.name
						})
					}else{
						uni.showToast({
							title:message,
							icon:"none"
						})
					}
				})
			},
			collectedEvent(){
				// 判断有没有收藏过商品
				let collected =uni.getStorageSync("collected")
				if(!collected){
					// 没有收藏过任何商品
					uni.setStorageSync("collected",[this.productList])
					this.collectedFlag=true
					uni.showToast({
						title:'商品收藏成功',
						icon:"success"
					})
				}else{ //收藏过商品
					// 判断当前商品有没有被收藏过
					let item =collected.find(ele=>ele.id==this.productId)
					if(item){
						// 收藏过点击就取消收藏
						let index =collected.findIndex(ele=>ele.id==this.productId)
						collected.splice(index,1)
						this.collectedFlag=false
						uni.showToast({
							title:'商品取消收藏成功',
							icon:"none"
						})
					}else{
						// 没有收藏过就收藏
						collected.push(this.productList)
						this.collectedFlag=true
						uni.showToast({
							title:'商品收藏成功',
							icon:"success"
						})
					}
					uni.setStorageSync("collected",collected)
				}
			}
		},
		onShow(){
			let collected =uni.getStorageSync("collected")
			if(!collected){
				// 没有收藏过任何商品
				this.collectedFlag=false
			}else{ //收藏过商品
				// 判断当前商品有没有被收藏过
				let item =collected.find(ele=>ele.id==this.productId)
				if(item){
					// 收藏过
					this.collectedFlag=true
				}else{
					// 没有收藏过
					this.collectedFlag=false
				}
		   }
		},
		onLoad(options){
			// console.log(options)
			this.productId=options.id;
			this.getProductList();
		}
	}
</script>

<style lang="scss" scoped>
	@mixin over {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.detail{
		width: 100%;
		padding-bottom: 200rpx;
		background-color: #f1ece7;
		// banner图部分样式
		.banner-list{
			width: 100%;
			height: 634rpx;
			.banner-item{
				width: 100%;
				height: 100%;
				image{
				width: 100%;
				height: 100%;	
				}
			}
		}
		// 商品介绍部分样式
		.productInfo{
			width: 600rpx;
			padding: 75rpx 70rpx;
			position: relative;
			.collect{
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
				background-color: #354e44;
				position: absolute;
				right: 100rpx;
				top: -50rpx;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			.product-pri{
				height: 72rpx;
				line-height: 72rpx;
				display: flex;
				justify-content: start;
				align-items: center;
				.product-sale{
					color: #f2270c;
					font-size: 60rpx;
				}
				.product-price{
					font-size: 24rpx;
					color: #b5b5b5;
					text-decoration: line-through;
					font-weight: 400;
					margin-left: 4rpx;
				}
				.product-pro{
					height: 30rpx;
					line-height: 30rpx;
					font-size: 20rpx;
					color: #fff;
					margin-left: 10rpx;
					padding: 0 12rpx;
					background-color: #f2270c;
					border-radius: 6rpx;
				}
			}
		    .product-name{
				color: #262626;
				font-size: 32rpx;
				font-weight: 700;
			}
			.product-desc{
				color: #666;
				font-size: 24rpx;
				padding-top: 36rpx;
			}
		}
	    // 底部购物车和购买部分样式
		.shop{
			width: 100%;
			height: 120rpx;
			padding: 0 60rpx;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			align-items: center;
			position: fixed;
			left: 0;
			bottom: 0;
			background-color: #fff;
			.shop-icon{
				width: 40rpx;
				height: 40rpx;
			}
			.shop-container{
				width: 480rpx;
				height: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				.shop-cart{
					width: 240rpx;
					height: 80rpx;
					line-height: 80rpx;
					font-size: 30rpx;
					color: #8f8f94;
					background-color: #e2e2e2;
					text-align: center;
				}
				.shop-buy{
					width: 240rpx;
					height: 80rpx;
					line-height: 80rpx;
					font-size: 30rpx;
					color: #fff;
					background-color: #354e44;
					text-align: center;
				}
			}
			
		}
	    //蒙层及弹出框部分
		.mask{
			width: 100%;
			height: 100vh;
			background-color: rgba(0,0,0,.5);
			position: fixed;
			left: 0;
			top: 0;
			display: flex;
			justify-content: center;
			align-items: center;
			.content{
				width: 640rpx;
				height: 920rpx;
				background-color: #fff;
				border-radius: 40rpx;
				position: relative;
				.con-photo{
					width: 192rpx;
					height: 192rpx;
					background-color: pink;
					border-radius: 20rpx;
					position: absolute;
					left: 60rpx;
					top: -60rpx;
				}
				.con-name{
				    font-size: 14px;
				    color: #3e3e3e;
				    margin-left: 142px;
				    margin-top: 42px;
					font-weight: 600;
				    width: 130px;
					@include over()
				}
				.con-storage{
					font-size: 12px;
					color: #b0b0b0;
					margin-top: 3px;
					line-height: 16px;
					margin-left: 142px;
				}
				.con-icon{
					width: 42rpx;
					height: 42rpx;
					position: absolute;
					right: 60rpx;
					top: 60rpx;
				}
				.choose{
					width:500rpx;
					margin: 40rpx auto;
					.choose-title{
						width: 100%;
						font-size: 14px;
						color: #3e3e3e;
						line-height: 20px;
						letter-spacing: 2px;
						font-weight: 600;
					}
					.choose-list{
						width: 100%;
						overflow-y: scroll;
						height: 170rpx;
						// overflow: hidden;
						.choose-item{
							width:480rpx;
							height: 60rpx;
							border-radius: 20rpx;
							line-height: 60rpx;
							background-color: #f2f4f3;
							padding-left: 10rpx;
							box-sizing: border-box;
							margin: 10rpx;
							color: #3e3e3e;
							font-size: 26rpx;
							display: flex;
							.choose-item-color{
								margin-right: 10rpx;
							}
						}
						& .border{
							border: 4rpx solid #354e44;
							box-sizing: border-box;
							line-height:56rpx;
						}
					}
				}
				.service{
					width:500rpx;
					height: 220rpx;
					margin: 40rpx auto;
					border-bottom: 1rpx solid #999999;
					.service-title{
						width: 100%;
						font-size: 14px;
						color: #3e3e3e;
						line-height: 20px;
						letter-spacing: 2px;
						font-weight: 600;
					}
					.service-item{
						width:480rpx;
						height: 60rpx;
						border-radius: 20rpx;
						line-height: 60rpx;
						background-color: #f2f4f3;
						padding-left: 10rpx;
						box-sizing: border-box;
						margin: 10rpx;
						color: #3e3e3e;
						font-size: 26rpx;
					}
				}
				.num{
					width:100%;
					height: 60rpx;
					line-height: 60rpx;
					margin-top: 40rpx;
					padding: 0 70rpx;
					text-align: center;
					box-sizing: border-box;
					display: flex;
					justify-content: start;
					align-items: center;
						.num-title{
							font-size: 28rpx;
							color: #3e3e3e;
							letter-spacing: 4rpx;
							font-weight: 600;
						}
						.numReduce{
							width: 60rpx;
							height: 60rpx;
							border-radius: 50%;
							background-color: #f1ece7;
							margin:0 6rpx 0 140rpx;
						}
						.num-main{
							width: 90rpx;
							height: 60rpx;
							border-radius: 60rpx;
							font-size: 30rpx;
							background-color: #f1ece7;
						}
						.numAdd{
							width: 60rpx;
							height: 60rpx;
							border-radius: 50%;
							background-color: #f1ece7;
							margin:0 6rpx;
						}
				}
				.btn{
					width: 208rpx;
					height: 80rpx;
					line-height: 80rpx;
					border-radius: 30rpx;
					margin: 48rpx auto;
					background-color: #354e44;
					color: #fff;
					font-size: 32rpx;
				}
			}
		}
	}
</style>
