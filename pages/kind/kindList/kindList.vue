<template>
	<view class="kindList">
		<!-- 头部导航部分 -->
		<view class="tab-list">
			<view @tap="changeTab(index)" class="tab-item" v-for="(item,index) in tabList" :key="index">
			  <view :class="{red:current==index}">{{item.name}}</view>
			  <view class="tab-item-icon" v-if="index==1 || index==2">
				<uni-icons type="arrowup" size="8" :color="item.status=='up'?'red':'white'"></uni-icons>
				<uni-icons type="arrowdown" size="8" :color="item.status=='down'?'red':'white'"></uni-icons>
			  </view>
			</view>
		</view>
		<!-- 内容部分 -->
		<view class="main">
			<navigator :url="`/pages/details/detail?id=${item.id}`" class="main-item" v-for="item in productList" :key="item.id">
				<image :src="item.pic" class="main-item-photo"></image>
				<view class="main-item-text">
					<view class="main-item-title">{{item.name}}</view>
					<view class="main-item-bottom">
						<view class="main-item-price">￥{{item.price}}元</view>
						<view class="main-item-desc">不凡</view>
					</view>
				</view>
			</navigator>
		</view>
	</view>
</template>


<script>
	import {findProductList} from "../../../api/kind/kindList/index.js"
	export default{
		data(){
			return{
				current:0,
				isDesc:0,
				sortBy:"",
				categoryId:"",
				productList:[],
				total:0,
				start:1,
				tabList:[
					{
						name:"新品",
						status:"default"
					},
					{
						name:"销量",
						status:"default"
					},
					{
						name:"价格",
						status:"default"
					},
					{
						name:"筛选",
						status:"default"
					}
				]
			}
		},
		methods:{
			changeTab(idx){
				this.current=idx;
				this.tabList.forEach((ele,index)=>{
					if(index!=idx){
						ele.status='default'
					}
				})
				if(idx==1){ //按销量排序
					this.sortBy="sale"
				}else if(idx==2){ //按价格排序
					this.sortBy="price"
				}
				this.start=1;
				this.productList=[];
				if(this.tabList[idx].status=='default'){
					this.tabList[idx].status='up'
					this.isDesc=1
				}else if(this.tabList[idx].status=='up'){
					this.tabList[idx].status='down'
					this.isDesc=0
				}else if(this.tabList[idx].status=='down'){
					this.tabList[idx].status='up'
					this.isDesc=1
				}
				
				this.getproductList();
			},
			getproductList(){
				findProductList(this.start,5,{
					  "categoryId": this.categoryId,
					  "isDesc":this.isDesc,
					  "sortBy":this.sortBy
				}).then(res=>{
					// console.log(res);
					let {success,data,message}=res;
					if(success){
						this.productList.push(...data.rows);
						this.total=data.total;
					}else{
						uni.showToast({
							title:message,
							icon:"none"
						})
					}
					uni.stopPullDownRefresh();
				})
			}
		},
		onLoad(options){
			// console.log(options)
			this.categoryId=options.id;
			this.getproductList();
		},
		onPullDownRefresh(){
			// 刷新时从第一页开始获取
			this.start=1;
			// 刷新时制空
			this.productList=[];
			this.getproductList();
		},
		onReachBottom(){
			this.start++;
			if(this.total>this.productList.length){
				this.getproductList();
			}
		}
	}
</script>

<style lang="scss" scoped>
	@mixin over {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.kindList {
		width: 100%;
		padding-bottom: 100rpx;
		background-color: #f1ece7;
		overflow: hidden;
		// 头部导航部分样式
		.tab-list{
			width: 100%;
			height: 62rpx;
			line-height: 62rpx;
			// font-size: 30rpx;
			color: #fff;
			background-color: #354e44;
			padding-top: 14rpx;
			text-align: center;
			display: flex;
			justify-content: space-around;
			align-items: center;
			position: fixed;
			left: 0;
			top: 0;
			/* #ifdef H5 */
			top: 88rpx;
			/* #endif */
			z-index: 5;
			.tab-item{
				display: flex;
				justify-content: space-around;
				align-items: center;
				.tab-item-icon{
					line-height: 16rpx;
					margin-left: 6rpx;
					display: flex;
					justify-content:center;
					align-items:center;
					flex-direction: column;
				}
			}
			
			.red{
				color: red;
			}
		}
		// 内容部分样式
		.main {
			width: 670rpx;
			margin: 120rpx 20px 0;
			display: flex;
			justify-content:baseline first;
			flex-wrap: wrap;
			.main-item {
				width: 47%;
				height: 420rpx;
				margin: 0 40rpx 40rpx 0;
				background-color: #fff;

				&:nth-child(2n) {
					margin-right: 0;
				}

				.main-item-photo {
					width: 100%;
					height: 238rpx;
				}

				.main-item-text {
					width: 100%;
					height: 182rpx;
					padding: 36rpx;
					box-sizing: border-box;
					font-size: 26rpx;
					color: #3e3e3e;

					.main-item-title {
						font-weight: 700;
						margin-top: 8rpx;
						height: 38rpx;
						@include over();
					}

					.main-item-bottom {
						height: 36rpx;
						margin-top: 20rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;

						.main-item-price {
							color: red;
						}

						.main-item-desc {
							@include over();
							margin-left: 40rpx;
						}
					}
				}
			}
		}
	}
</style>
