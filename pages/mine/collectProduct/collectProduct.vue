<template>
	<view class="collectProduct">
		<view class="product-list">
			<view @tap="goDetails(item.id)" class="product-item" v-for="item in productList" :key="item.id">
				<image :src="item.pic" class="item-photo"></image>
				<view class="item-right">
					<view class="right-name">{{item.name}}</view>
					<view class="right-bottom">
						<view class="right-tip">收藏</view>
						<view class="right-price">￥ {{item.price}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data(){
			return{
				productList:[]
			}
		},
		methods:{
			getProductList(){
				this.productList=uni.getStorageSync("collected");
				console.log(this.productList)
			},
			goDetails(id){
				uni.navigateTo({
					url:`/pages/details/detail?id=${id}`
				})
			}
		},
		onLoad() {
			this.getProductList();
		}
	}
</script>

<style lang="scss" scoped>
	.collectProduct{
		width: 100%;
		height: 100vh;
		background-color: #f1ece7;
		overflow: hidden;
		.product-list{
			width: 690rpx;
			margin: 40rpx auto 0;
			.product-item{
				width: 100%;
				height: 220rpx;
				padding: 30rpx;
				box-sizing: border-box;
				margin-bottom: 40rpx;
				background-color: #fff;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-radius: 20rpx;
				.item-photo{
					width: 126rpx;
					height: 100%;
				}
				.item-right{
					flex: 1;
					display: flex;
					justify-content: start;
					align-items: start;
					flex-direction: column;
					padding-left: 50rpx;
					.right-name{
						font-size: 24rpx;
						color: #494949;
						line-height: 36rpx;
						margin-bottom: 40rpx;
					}
					.right-bottom{
						width: 100%;
						display: flex;
						justify-content: space-between;
						align-items: center;
						line-height: 36rpx;
						.right-tip{
							font-size: 24rpx;
							color: #494949;
						}
						.right-price{
							font-size: 32rpx;
							color: #1c4b47;
							font-weight: 600;
						}
					}
				}
			}
		}
	}
</style>
