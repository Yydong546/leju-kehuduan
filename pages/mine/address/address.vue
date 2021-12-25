<template>
	<view class="address">
		<view class="address-list" v-if="addressInfo && addressInfo.length>0">
			<view @tap="transmitAddress(item)" class="address-item" v-for="item in addressInfo" :key="item.id">
				<view class="item-left">
					<view class="item-left-top">
						<view class="item-name">{{item.name}}</view>
						<view class="item-tel">{{item.phoneNumber}}</view>
						<view class="item-default" v-if="item.defaultStatus">默认</view>
					</view>
					<view class="item-address">{{item.province}} {{item.city}} {{item.region}} {{item.detailAddress}}</view>
				</view>
				<view class="item-edit" @tap.stop.prevent="changeAddress(item.id)">
					<image src="../../../static/icons/edit.png" class="edit-icon"></image>
				</view>
			</view>
		</view>
		<view class="tips" v-else>暂无收货地址,请点击按钮添加</view>
		<button type="default" class="addAddress" @tap="addAddress">新增地址</button>
	</view>
</template>

<script>
	import {findAllAddress} from "../../../api/mine/address/index.js"
	export default {
		data(){
			return{
				addressInfo:[],
				isDefault:false
			}
		},
		methods:{
			getAddressInfo(){
				findAllAddress().then(res=>{
					// console.log(res)
					let {success,data,message}=res;
					if(success){
						this.addressInfo=data.items;
					}else{
						uni.showToast({
							title:meassge,
							icon:"none"
						})
					}
				})
			},
			addAddress(){
				uni.navigateTo({
					url:"/pages/mine/address/addAddress/addAddress"
				})
			},
			transmitAddress(item){
				// console.log(item);
				this.$store.commit("setItem",item)
				uni.navigateBack({
					delta:1,
				})
			},
			changeAddress(id){
				console.log(id)
				uni.navigateTo({
					url:`/pages/mine/address/changeAddress/changeAddress?id=${id}`
				})
			}
		},
		onLoad(){
			
		},
		onShow() {
			this.getAddressInfo();
		}
	}
</script>

<style lang="scss" scoped>
	.address{
		width: 100%;
		height: 100vh;
		background-color: #f1ece7;
		.tips{
			width: 700rpx;
			height: 130rpx;
			line-height: 88rpx;
			color: gray;
			padding: 20rpx 0;
			margin: 0 auto;
			border-bottom: 2rpx solid #ccc;
			box-sizing: border-box;
		}
		.address-list{
			width: 100%;
			display: flex;
			justify-content: start;
			align-items: center;
			flex-direction: column;
			.address-item{
				width: 700rpx;
				height: 130rpx;
				padding: 20rpx 0;
				margin: 0 auto;
				border-bottom: 2rpx solid #ccc;
				box-sizing: border-box;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.item-left{
					width: 600rpx;
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
		}
		.addAddress{
			display: block;
			width: 520rpx;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			background-color: #354e44;
			border-radius: 80rpx;
			color: #fff;
	         font-size: 30rpx;
			 position: fixed;
			 left: 50%;
			 bottom: 20rpx;
			 transform: translateX(-50%);
		}
	}
</style>
