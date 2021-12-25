<template>
	<view class="find" :style="{paddingTop: h + 'px'}">
		<!-- 头部 -->
		<view class="header" :style="{top: h + 'px'}">
			<view @tap="changeMain(index)" class="header-item" :class="{'line':current==index}" v-for="(item,index) in titleList" :key="item.name">{{item.name}}</view>
		</view>
		<view class="main" :style="{paddingTop: h + 'px'}">
			<!-- 精选文章 -->
			<view class="article" v-if="!current">
				<navigator :url="`findInfo/findInfo?id=${item.id}`" class="article-item" v-for="item in articleList" :key="item.id">
					<image :src="item.coverImg" class="article-item-photo"></image>
					<view class="article-item-title">{{item.title}}</view>
					<view class="article-item-desc">{{item.author}}</view>
					<view class="article-item-bottom">
						<image src="../../static/icons/view.png" class="item-bottom-iconLeft"></image>
						<view class="item-bottom-num">{{item.viewCount}}</view>
						<view @tap.stop="collectedArticle(item)" class="item-bottom-iconRight">
						<uni-icons :color="item.isCollected?'red':'gray'" type="star" size="20"></uni-icons>	
						</view>
					</view>
				</navigator>
			</view>
			<!-- 品牌列表 -->
			<view class="brand" v-else>
				<view class="brand-item" v-for="item in brandList" :key="item.id">
					<image :src="item.bigPic" class="brand-item-photo"></image>
					<view class="brand-item-bottom">{{item.name}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		    findArticleByPage,
            productArticle,
            findBrandsByPage,
			} 
    from "../../api/find/find.js"
	export default {
		data() {
			return {
				titleList:[
					{name:"精选文章"},
					{name:"品牌列表"}
				],
				h:0,
				current:0,
				articleList:[],
				brandList:[],
			}
		},
		methods: {
			changeMain(index){
				this.current=index;
			},
			getBrandList(){
				findBrandsByPage("1","10").then(res=>{
					// console.log(res);
					let {success,data,message}=res;
					if(success){
						this.brandList=data.rows;
					}else{
						uni.showToast({
							title:message,
							icon:"none"
						})
					}
				})
			},
			// 文章收藏
			collectedArticle(item){
				// 先判断有没有收藏过
				let collected=uni.getStorageSync("collectedArticle");
				if(!collected){
					// 之前没有收藏过文章
					uni.setStorageSync("collectedArticle",[item])
					item.isCollected=true,
					uni.showToast({
						title:"文章收藏成功",
						icon:"success"
					})
				}else{
					// 判断当前文章有没有收藏过
					let items=collected.find(ele=>ele.id==item.id)
					if(items){
						// 当前文章收藏过,点击取消收藏
						let index =collected.findIndex(ele=>ele.id==item.id)
						collected.splice(index,1)
						item.isCollected=false;
						uni.showToast({
							title:"文章取消收藏成功",
							icon:"error"
						})
					}else{
						collected.push(item)
						item.isCollected=true;
						uni.showToast({
							title:'文章收藏成功',
							icon:"success"
						})
					}
					uni.setStorageSync("collectedArticle",collected)
				}
			}
		},
		onLoad(){
			// #ifdef MP-WEIXIN
				const obj=uni.getMenuButtonBoundingClientRect();
				console.log(obj);
				this.h=obj.top+obj.height;
			// #endif
			// 获取文章列表
				findArticleByPage("1","10").then(res=>{
					// console.log(res);
					let {success,data,message}=res;
					if(success){
						let collected=uni.getStorageSync("collectedArticle");
						if(!collected){
							// 当前没有收藏过文章
							data.rows.forEach(ele=>{
								ele.isCollected=false;
							})
						}else{
							data.rows.forEach(ele=>{
								let items =collected.find(item=>ele.id==item.id);
								if(items){
									ele.isCollected=true;
								}else{
									ele.isCollected=false;
								}
							})
						}
						this.articleList=data.rows;
						this.id=data.rows.id;
					}else{
						uni.showToast({
							title:message,
							icon:"none"
						})
					}
				})
			this.getBrandList();
		},
		onShow(){
		}
	}
</script>

<style lang="scss" scoped>
	.find{
		width: 100%;
		background-color: #f1ece7;
		overflow: hidden;
		padding-top: 88rpx !important;
		// 头部部分样式
		.header{
			width: 100%;
			height: 88rpx;
			line-height: 44rpx;
			color: #fff;
			background-color: #354e44;
			font-size: 32rpx;
			position: fixed;
			left: 0;
			top: 0;
			z-index: 5;
			display: flex;
			justify-content: center;
			align-items: center;
			& .header-item:first-child{
				margin: 0 10rpx;
				padding:10rpx 0;
				box-sizing: border-box;
				height: 66rpx;
			}
			& .header-item:last-child{
				margin: 0 10rpx;
				padding:10rpx 0;
				box-sizing: border-box;
				height: 66rpx;
			}
			& .line{
				border-bottom: 2rpx solid #fff;
			}
		}
		// 内容部分样式
	    .main{
			width: 100%;
			.article{
				width:100%;
				.article-item{
					width: 670rpx;
					height: 480rpx;
					margin: 28rpx 40rpx;
					color: #fff;
					border-radius: 40rpx;
					overflow: hidden;
					position: relative;
					.article-item-photo{
						width: 100%;
						height: 382rpx;
						display: block;
					}
					.article-item-title{
						font-size: 48rpx;
						line-height: 68rpx;
						position: absolute;
						left: 20rpx;
						top: 244rpx;
					}
					.article-item-desc{
						font-size: 30rpx;
						line-height: 42rpx;
						position: absolute;
						left: 20rpx;
						top: 316rpx;
					}
					.article-item-bottom{
						width: 100%;
						height: 100rpx;
						background-color: #fff;
						border-top: 1rpx solid gray;
						padding: 0 60rpx;
						box-sizing: border-box;
						display: flex;
						justify-content: space-between;
						align-items: center;
						.item-bottom-iconLeft{
							width: 40rpx;
							height: 40rpx;
							margin-right: 30rpx;
						}
						.item-bottom-num{
							font-size: 26rpx;
							color: #3e3e3e;
							margin-right: 380rpx;
						}
						.item-bottom-iconRight{
							width: 40rpx;
							height: 40rpx;
							line-height: 40rpx;
						}
					}
				}
			}
		    .brand{
		    	width:100%;
		    	.brand-item{
		    		width: 690rpx;
		    		height: 592rpx;
		    		margin: 30rpx;
		    		border-radius: 20rpx;
		    		overflow: hidden;
					background-color: #fff;
		    		.brand-item-photo{
		    			width: 100%;
		    			height: 480rpx;
						display: block;
		    		}
		    		.brand-item-bottom{
		    			width: 100%;
		    			height: 100rpx;
						line-height: 100rpx;
						padding-left: 20rpx;
		    			box-sizing: border-box;
						font-size: 32rpx;
						font-weight: 600;
						color: #3e3e3e;
		    		}
		    	}
		}
	  }
    }
</style>
