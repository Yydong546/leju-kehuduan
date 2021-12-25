<template>
	<view class="home" :style="{paddingTop: h + 'px'}">
		<!-- 头部部分 -->
		<view class="header" :style="{top:h + 'px'}">
			<image src="../../static/icons/search.png" class="header-search"></image>
			<image src="../../static/icons/cart.png" class="header-cart"></image>
		</view>
		<!-- 轮播图部分 -->
		<swiper class="banner-list" :indicator-dots="true" indicator-color="#d8d8d8" indicator-active-color="#3e3e3e" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<swiper-item class="banner-item" v-for="item in bannerList" :key="item.id">
				<image class="img" :src="item.pic"></image>
			</swiper-item>
		</swiper>
		<!-- 分类部分 -->
		<view class="classify">
			<navigator :url="`/pages/kind/kindList/kindList?id=${item.id}`" class="classify-item" v-for="item in classifyList" :key="item.id">
				<image :src="item.icon" class="classify-item-photo"></image>
				<view class="classify-item-title">{{item.name}}</view>
			</navigator>
		</view>
		<!-- 限时活动部分 -->
		<view class="activity">
			<view class="activity-left">
				<image src="../../static/icons/广播.png" class="activity-left-icon"></image>
				限时活动:
			</view>
			<view class="activity-right">
				<swiper class="right-list" :vertical="true" :autoplay="true" :interval="3000" :duration="1000">
					<swiper-item @tap="goDetails(item.id)" class="right-item" v-for="item in activityList" :key="item.id">
						<view class="activity-right-name">{{item.name}}</view>
						<view class="activity-right-price">
							<view class="activity-right-price-top">
								{{item.price}}元
							</view>
							<view class="activity-right-price-bottom">
								现价:{{item.promotionPrice}}元
							</view>
						</view>
					</swiper-item>
				</swiper>
			</view>
		</view>
		<!-- 热门推荐部分 -->
		<view class="hot">
			<view class="hot-title">热门推荐</view>
			<view class="hot-main">
				<swiper class="hot-main-list" :autoplay="true" :interval="1000" :duration="1000" :circular="true">
					<swiper-item @tap="goDetails(item.id)" class="hot-main-item" v-for="item in hotList" :key="item.id">
						<image :src="item.pic" class="hot-main-item-photo"></image>
						<view class="hot-main-item-name">{{item.name}}</view>
					</swiper-item>
				</swiper>
			</view>
		</view>
		<!-- 新品推荐部分 -->
		<view class="new">
			<view class="new-title">新品推荐</view>
			<view class="new-main">
				<view class="new-item" @tap="goDetails(item.id)" v-for="item in newList" :key="item.id">
					<image :src="item.pic" class="new-item-photo"></image>
					<view class="new-item-right">
						<view class="item-right-name">{{item.name}}</view>
						<view class="item-right-price">价格: {{item.price}}</view>
					</view>
				</view>

			</view>
		</view>
		<!-- 猜你喜欢部分 -->
		<view class="like">
			<view class="like-title">猜你喜欢</view>
			<view class="like-main">
				<view class="like-item" @tap="goDetails(item.id)" v-for="item in likeList" :key="item.id">
					<image :src="item.pic" class="like-item-photo"></image>
					<view class="like-item-text">
						<view class="like-item-title">{{item.name}}</view>
						<view class="like-item-bottom">
							<view class="like-item-price">￥{{item.price}}</view>
							<view class="like-item-desc">{{item.brandName}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		bannerAds,
		findCategory,
		recommendList,
		hotList as hotListApi,
		lejuLatestProducts,
		saleMostProducts

	}
	from "../../api/home/index.js";

	export default {
		data() {
			return {
				h:0,
				bannerList: [],
				classifyList: [],
				activityList: [],
				hotList: [],
				newList: [],
				likeList: []
			}
		},
		methods: {
			goDetails(id){
				uni.navigateTo({
					url:`/pages/details/detail?id=${id}`
				})
			},
			getBannerList() {
				bannerAds().then(res => {
					// console.log(res);
					let {
						success,
						data,
						message
					} = res;
					if (success) {
						this.bannerList = data.items;
					} else {
						uni.showToast({
							title: message,
							icon: "none"
						})
					}
				})
			},
			getClassifyList() {
				findCategory('1308336521604599809').then(res => {
					// console.log(res);
					let {
						success,
						data,
						message
					} = res;
					if (success) {
						this.classifyList = data.category.children;
					} else {
						uni.showToast({
							title: message,
							icon: "none"
						})
					}
				})
			},
			getActivityList() {
				recommendList().then(res => {
					// console.log(res);
					let {
						success,
						data,
						message
					} = res;
					if (success) {
						this.activityList = data.items;
					} else {
						uni.showToast({
							title: message,
							icon: "none"
						})
					}
				})
			},
			getHotList() {
				hotListApi().then(res => {
					// console.log(res);
					let {
						success,
						data,
						message
					} = res;
					if (success) {
						this.hotList = data.items;
					} else {
						uni.showToast({
							title: message,
							icon: "none"
						})
					}
				})
			},
			getNewList() {
				lejuLatestProducts().then(res => {
					// console.log(res);
					let {
						success,
						data,
						message
					} = res;
					if (success) {
						this.newList = data.productList;
					} else {
						uni.showToast({
							title: message,
							icon: "none"
						})
					}
				})
			},
			getLikeList() {
				saleMostProducts().then(res => {
					// console.log(res);
					let {
						success,
						data,
						message
					} = res;
					if (success) {
						this.likeList = data.items;
					} else {
						uni.showToast({
							title: message,
							icon: "none"
						})
					}
				})
			}
		},
		onLoad() {
			this.getBannerList();
			this.getClassifyList();
			this.getActivityList();
			this.getHotList();
			this.getNewList();
			this.getLikeList();
			// #ifdef MP-WEIXIN
				const obj=uni.getMenuButtonBoundingClientRect();
				console.log(obj);
				this.h=obj.top+obj.height;
			// #endif
		}
	};
</script>

<style lang="scss" scoped>
	@mixin over {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.home {
		width: 100%;
		background-color: #f1ece7;
		//头部部分样式
		.header{
			width: 100%;
			height: 100rpx;
			padding: 30rpx;
			box-sizing: border-box;
			position: fixed;
			top: 0;
			left: 0;
			z-index: 5;
			.header-search{
				width: 42rpx;
			    height: 42rpx;
				float: left;
				margin-left: 560rpx;
			}
			.header-cart{
				width: 42rpx;
			    height: 42rpx;
				float: right;
			}
		}

		// 轮播图部分样式
		.banner-list{
			height: 360rpx;
			.banner-item{
				height: 360rpx;
				.img {
					width: 100%;
					height: 100%;
				}
			}
		}
		
		// 分类部分样式
		.classify {
			width: 100%;
			height: 130rpx;
			margin: 60rpx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 40rpx;
			box-sizing: border-box;

			.classify-item {
				width: 102rpx;
				height: 111rpx;

				.classify-item-photo {
					display: block;
					width: 68rpx;
					height: 68rpx;
					margin: 0 auto 10rpx;
				}

				.classify-item-title {
					text-align: center;
					color: #3e3e3e;
					font-size: 26rpx;
				}
			}
		}

		// 限时活动部分样式
		.activity {
			width: 670rpx;
			height: 96rpx;
			margin: 40rpx;
			font-size: 28rpx;
			background-color: #fff;
			display: flex;
			justify-content: start;
			align-items: center;
			padding: 0 40rpx;
			box-sizing: border-box;

			.activity-left {
				width: 200rpx;
				font-weight: 600;
				color: #efb171;
				display: flex;
				justify-content: space-around;
				align-items: center;

				.activity-left-icon {
					width: 48rpx;
					height: 48rpx;
				}
			}

			.activity-right {
				flex: 1;
				display: flex;
				justify-content: space-around;
				align-items: center;

				.right-list {
					width: 100%;
					height: 96rpx;

					.right-item {
						width: 100%;
						height: 96rpx;
						display: flex;
						justify-content: space-around;
						align-items: center;

						.activity-right-name {
							width: 200rpx;
							color: #3e3e3e;
						}

						.activity-right-price {
							color: red;
							font-size: 24rpx;
							font-weight: 600;

							.activity-right-price-top {
								color: #333333;
							}
						}
					}
				}
			}
		}

		// 热门推荐部分样式
		.hot {
			width: 100%;
			height: 400rpx;
			padding: 0 30rpx;
			box-sizing: border-box;

			.hot-title {
				font-size: 32rpx;
				color: #3e3e3e;
				font-weight: 600;
				padding: 30rpx 0;
			}

			.hot-main {
				width: 100%;

				.hot-main-list {
					width: 690rpx;
					height: 300rpx;

					.hot-main-item {
						width: 230rpx !important;
						height: 100%;
						margin: 0 20rpx;

						.hot-main-item-photo {
							width: 208rpx;
							height: 176rpx;
						}

						.hot-main-item-name {
							width: 100%;
							font-size: 26rpx;
							line-height: 38rpx;
							margin-top: 20rpx;
							color: #3e3e3e;
							font-weight: 600;
							@include over() text-align: center;
					}
						}
				}
			}
		}

		// 新品推荐部分样式
		.new {
			width: 100%;
			height: 362rpx;
			padding: 0 30rpx;
			box-sizing: border-box;

			.new-title {
				font-size: 32rpx;
				color: #3e3e3e;
				font-weight: 600;
				padding: 30rpx 0;
			}

			.new-main {
				width: 720rpx;
				height: 260rpx;
				overflow-x: scroll;
				display: flex;
				justify-content: space-between;
				flex-wrap: nowrap;
				align-items: center;

				.new-item {
					width: 590rpx;
					height: 260rpx;
					background-color: #fff;
					margin-right: 30rpx;
					border-radius: 20rpx;
					display: flex;
					justify-content: start;
					align-items: center;

					.new-item-photo {
						width: 260rpx;
						height: 168rpx;
						margin: 0 20rpx 0 46rpx;
					}

					.new-item-right {
						flex: 1;
						height: 160rpx;
						font-size: 26rpx;
						color: #3e3e3e;

						.item-right-name {
							width: 320rpx;
							height: 72rpx;
							margin-bottom: 50rpx;
							@include over()
						}

						.item-right-price {
							width: 320rpx;
							height: 35rpx;
						}
					}
				}
			}
		}

		// 猜你喜欢部分样式
		.like {
			width: 100%;
			padding: 0 30rpx;
			box-sizing: border-box;

			.like-title {
				font-size: 32rpx;
				color: #3e3e3e;
				font-weight: 600;
				padding: 30rpx 0;
			}

			.like-main {
				width: 100%;
				display: flex;
				justify-content:baseline first;
				flex-wrap: wrap;
				
				.like-item {
					width: 47%;
					height: 420rpx;
					margin: 20rpx 40rpx 20rpx 0;
					background-color: #fff;
					&:nth-child(2n){
						margin-right: 0;
					}
					.like-item-photo {
						width: 100%;
						height: 238rpx;
					}

					.like-item-text {
						width: 100%;
						height: 182rpx;
						padding: 36rpx;
						box-sizing: border-box;
						font-size: 26rpx;
						color: #3e3e3e;

						.like-item-title {
							font-weight: 700;
							margin-top: 8rpx;
							height: 38rpx;
							@include over();
						}

						.like-item-bottom {
							height: 36rpx;
							margin-top: 20rpx;
							display: flex;
							justify-content: space-between;
							align-items: center;

							.like-item-price {
								color: red;
							}
							.like-item-desc {
								@include over();
								margin-left: 40rpx;
							}
						}
					}
				}
			}
		}
	}
</style>
