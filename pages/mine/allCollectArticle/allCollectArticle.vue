<template>
	<view class="allCollectArticle">
		<view class="article-list">
			<view class="article-item" v-for="item in collectList" :key="item.id">
				<image :src="item.coverImg" class="item-photo"></image>
				<view class="item-name">{{item.title}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return{
			 collectList:[]
			}
		},
		methods:{
			getCollectList(){
				this.collectList=uni.getStorageSync("collectedArticle")
				console.log(this.collectList)
			}
		},
		onLoad() {
			this.getCollectList();
		}
	}
</script>

<style lang="scss" scoped>
	.allCollectArticle{
		width: 100%;
		height: 100vh;
		padding-top: 40rpx;
		background-color: #f1ece7;
		.article-list{
			width: 100%;
			padding: 0 30rpx;
			box-sizing: border-box;
			display: flex;
			justify-content: baseline first;
			flex-wrap: wrap;
			.article-item{
				width: 48%;
				height: 320rpx;
				background-color: #fff;
				margin: 0 25rpx 25rpx 0;
				&:nth-child(2n){
					margin-right: 0;
				}
				.item-photo{
					width: 100%;
					height: 238rpx;
				}
				.item-name{
					width: 100%;
					height: 76rpx;
					margin-top: 8rpx;
					padding: 20rpx 0;
					text-align: center;
					font-size: 24rpx;
					color: #3e3e3e;
					font-weight: 700;
					box-sizing: border-box;
				}
			}
		}
	}
</style>
