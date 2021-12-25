<template>
	<view class="changeAddress">
		<view class="item">
			<view class="item-title">收件人</view>
			<input class="input" type="text" v-model="addressName" placeholder="请输入收件人姓名"/>
		</view>
		<view class="item">
			<view class="item-title">电话号码</view>
			<input class="input" type="text" v-model="addressTel" placeholder="请输入收件人手机号码"/>
		</view>
		<view class="area">
		<view class="area-title">所在地区</view>
		<view class="area-main">
			<view class="area-main-desc"  @tap="openChooseAddress" v-if="!areaList.cityCode">请点击选择地址</view>
			<view class="area-main-desc" v-else>{{areaList.label}}</view>
			<simple-address ref="simpleAddress" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm" themeColor="#007AFF"></simple-address>
		</view>
		</view>
		<view class="item">
			<view class="item-title">详细地址</view>
			<input class="input" type="text" v-model="addressDetail" placeholder="输入详细地址"/>
		</view>
		<view class="default">
			<view class="default-title">设置默认地址</view>
			<switch @change="changeFault" color="#354e44"/>
		</view>
		<button @tap="removeAddress" type="default" class="remove">删除地址</button>
		<button @tap="saveAddress" type="default" class="button">保存地址</button>
	</view>
</template>

<script>
	import {delAddressInfo,updateAddressInfo,switchDefault} from "../../../../api/mine/address/changeAddress/index.js"
	export default{
		data(){
			return{
				cityPickerValueDefault: [0, 0, 1],
				addressName:"",
				addressTel:"",
				areaList:{},
				addressDetail:"",
				isDefault:"0",
				addressId:""
			}
		},
		methods:{
			onConfirm(e) {
			    // console.log(e);
				this.areaList=e;
			},
			openChooseAddress(){
				 this.$refs.simpleAddress.open();
			},
			// 判断是否是默认地址
			changeFault(e){
				// console.log(e);
				if(e.detail.value){
				this.isDefault=1	
				}else{
					this.isDefault=0
				}
				// console.log(this.isDefault)
			},
			// 删除地址
			removeAddress(){
				delAddressInfo(this.addressId).then(res=>{
					// console.log(res);
					let {success,message}=res;
					if(success){
						uni.showToast({
							title:"删除地址成功",
							icon:"success"
						})
						setTimeout(()=>{
							uni.navigateTo({
								url:"/pages/mine/address/address"
							})
						},1000)
					}else{
						uni.showToast({
							title:message,
							icon:"none"
							
						})
					}
				})
			},
			// 保存地址
			saveAddress(){
				updateAddressInfo({
					  "city": this.areaList.labelArr[1],
					  "cityCode": this.areaList.provinceCode+','+this.areaList.cityCode+','+this.areaList.areaCode,
					  "createTime": "",
					  "defaultStatus": this.isDefault,
					  "detailAddress": this.addressDetail,
					  "id": this.addressId,
					  "name": this.addressName,
					  "phoneNumber": this.addressTel,
					  "province": this.areaList.labelArr[0],
					  "region": this.areaList.labelArr[2]
				}).then(res=>{
					let {success,message}=res;
					if(success){
						switchDefault(this.addressId,this.isDefault).then(res=>{
							let {success,message}=res;
							if(success){
								uni.navigateTo({
									url:"/pages/mine/address/address"
								})
							}else{
								uni.showToast({
									title:message,
									icon:"none"
								})
							}
						})
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
			// console.log(options);
			this.addressId=options.id;
		},
		onShow() {
			
		}
	}
</script>

<style lang="scss" scoped>
	.changeAddress{
		width: 100%;
		height: 100vh;
		background-color: #f1ece7;
		box-sizing: border-box;
		display: flex;
		justify-content: start;
		align-items: center;
		flex-direction: column;
		.item{
			width: 700rpx;
			height: 120rpx;
			margin: 0 25rpx;
			border-bottom: 2rpx solid #ccc;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.item-title{
				font-size: 30rpx;
				line-height: 120rpx;
				font-weight: 200;
			}
			.input{
				width: 500rpx;
				height: 120rpx;
				padding: 20rpx 0;
				box-sizing: border-box;
			}
		}
		.area{
			width: 700rpx;
			height: 120rpx;
			margin: 0 25rpx;
			border-bottom: 2rpx solid #ccc;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.area-title{
				font-size: 30rpx;
				line-height: 120rpx;
				font-weight: 200;
			}
			.area-main{
				width: 500rpx;
				height: 120rpx;
				line-height: 80rpx;
				padding: 20rpx 0;
				box-sizing: border-box;
				font-size: 30rpx;
			}
		}
		.default{
			width: 700rpx;
			height: 120rpx;
			margin: 0 25rpx;
			border-bottom: 2rpx solid #ccc;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.default-title{
				font-size: 30rpx;
				line-height: 120rpx;
				font-weight: 200;
			}
		}
		.remove{
			display: block;
			width: 700rpx;
			height: 100rpx;
			line-height: 100rpx;
			text-align: center;
			background-color:#e64340;
			color: #fff;
			font-size: 36rpx;
			margin: 60rpx auto 0;
		}
		.button{
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
