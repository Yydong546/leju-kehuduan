<template>
	<view class="findInfo">
		<view class="findInfo-title">{{articleList.title}}</view>
		<view class="findInfo-author">作者:{{articleList.author}}</view>
		<view class="findInfo-date">时间:{{articleList.createTime}}</view>
		<view class="findInfo-desc">概要描述:{{articleList.summary}}</view>
		<image :src="articleList.coverImg" class="findInfo-photo"></image>
		<mp-html :tag-style=obj :content="articleList.content1" />
		<mp-html :tag-style=obj :content="articleList.content2" />
	</view>
</template>

<script>
	import {productArticle} from "../../../api/find/findInfo/findInfo.js"
	export default {
		data() {
			return {
				articleId:"",
				articleList:[],
				obj:{
					img:"width:100%;height:auto;display:block;",
					p:"width:80%;height:auto;display:block; margin:0 auto;"
				}
			}
		},
		methods: {
			getArticleList(){
				productArticle(this.articleId).then(res=>{
					console.log(res);
					let {success,data,message} =res;
					if(success){
						this.articleList=data.productArticle;
						uni.setNavigationBarTitle({
							title:data.productArticle.title
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
		onLoad(options){
			// console.log(options)
			this.articleId=options.id;
			this.getArticleList();
		}
	}
</script>

<style lang="scss" scoped>
	.findInfo{
		width: 100%;
		background-color: #f1ece7;
		padding: 0 60rpx;
		overflow: hidden;
		box-sizing: border-box;
		.findInfo-title{
			margin-top: 60rpx;
			font-size: 50rpx;
			font-weight: 600;
		}
		.findInfo-author{
			font-size: 30rpx;
			text-align: right;
		}
		.findInfo-date{
			font-size: 30rpx;
			text-align: right;
		}
		.findInfo-desc{
			font-size: 30rpx;
			margin-bottom: 40rpx;
		}
		.findInfo-photo{
			
		}
	}
</style>
