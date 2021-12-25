<template>
	<view class="payInfo">
		<view class="tips">订单支付成功</view>
		<view class="total">支付金额:{{payTotal}}元</view>
		<view class="mine" @tap="goMine">个人中心</view>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				payTotal:""
			}
		},
		methods:{
			goMine(){
				uni.switchTab({
					url:"/pages/mine/mine"
				})
			}
		},
		onLoad(options) {
			// console.log(options)
			this.payTotal=options.total
		}
	}
</script>

<style lang="scss" scoped>
	.payInfo{
		width: 100%;
		height: 100vh;
		background-color: #f1ece7;
		overflow: hidden;
		.tips{
			width: 100%;
			font-size: 48rpx;
			text-align: center;
			margin: 250rpx 0 10rpx;
		}
		.total{
			width: 100%;
			font-size: 32rpx;
			text-align: center;
		}
		.mine{
			width: 240rpx;
			height: 70rpx;
			line-height: 70rpx;
			border-radius: 20rpx;
			position: fixed;
			bottom: 60rpx;
			left: 50%;
			transform: translateX(-50%);
			text-align: center;
			color: #354e44;
			border: 2rpx solid #354e44;
		}
	}
</style>
