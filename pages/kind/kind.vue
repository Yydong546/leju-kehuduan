<template>
	<view class="kind" :style="{paddingTop: h + 'px'}">
		<!-- 创意部分 -->
		<view @tap="goKindList(list[0].id)" class="creativity" v-if="list[0]">
			<view class="creativity-name">{{list[0].name}}</view>
			<view class="creativity-desc">Originality</view>
			<image :src="list[0].icon" class="creativity-photo"></image>
		</view>
		<!-- 风格部分 -->
		<view @tap="goKindList(list[1].id)" class="style" v-if="list[1]">
			<view class="style-name">{{list[1].name}}</view>
			<view class="style-desc">Decorations</view>
			<image :src="list[1].icon" class="style-photo"></image>
		</view>
		<view class="bottom">
			<!-- 饰品部分 -->
			<view @tap="goKindList(list[2].id)" class="jewelry" v-if="list[2]">
				<view class="jewelry-name">{{list[2].name}}</view>
				<view class="jewelry-desc">Style</view>
				<image :src="list[2].icon" class="jewelry-photo"></image>
			</view>
			<!-- 灯具部分 -->
			<view @tap="goKindList(list[3].id)" class="lamp" v-if="list[3]">
				<view class="lamp-name">{{list[3].name}}</view>
				<view class="lamp-desc">The lamp</view>
				<image :src="list[3].icon" class="lamp-photo"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import {findCategory} from "../../api/kind/index.js"
	export default {
		data() {
			return {
				h:0,
				list:[]
			}
		},
		methods: {
			// 跳转到kindList页面
			goKindList(id){
				uni.navigateTo({
					url:`./kindList/kindList?id=${id}`
				})
			},
			getList(){
				findCategory('1308336521604599809')
				.then(res=>{
					// console.log(res)
					let {success,data,meaasge}=res;
					if(success){
						this.list=data.category.children;
					}else{
						uni.showToast({
							title:meaasge,
							icon:"none"
						})
					}
				})
			}
		},
		onLoad(){
			// #ifdef MP-WEIXIN
				const obj=uni.getMenuButtonBoundingClientRect();
				console.log(obj);
				this.h=obj.top+obj.height;
			// #endif
			this.getList();
		}
	}
</script>

<style lang="scss" scoped>
	.kind{
		padding-bottom: 50rpx;
		width: 100%;
		background-color: #f1ece7;
		overflow: hidden;
		.creativity{
			width: 670rpx;
			height: 302rpx;
			margin: 48rpx auto;
		    background: #d5d5d5;
		    border-radius: 20px;
			box-shadow: 0 12px 20px 0 rgba(83,66,49,0.05);
			position: relative;
			overflow: hidden;
			.creativity-name{
				font-size: 48rpx;
				color: #3e3e3e;
				letter-spacing: 3.43rpx;
				line-height: 67rpx;
				position: absolute;
				left: 52rpx;
				bottom: 87rpx;
			}
			.creativity-desc{
				font-size: 30rpx;
				color: #7f7f7f;
				letter-spacing: 2.14rpx;
				line-height: 42rpx;
				position: absolute;
				left: 58rpx;
				bottom: 40rpx;
			}
			.creativity-photo{
				width: 416rpx;
				height: 252rpx;
				position: absolute;
				right: 0;
				bottom: 0;
			}
		}
		.style{
			width: 670rpx;
			height: 302rpx;
			margin: 48rpx auto;
			background: #fff;
			border-radius: 20px;
			box-shadow: 0 12px 20px 0 rgba(83,66,49,0.03);
			overflow: hidden;
			position: relative;
			.style-name{
				font-size: 48rpx;
				color: #3e3e3e;
				letter-spacing: 3.43rpx;
				line-height: 67rpx;
				position: absolute;
				left: 52rpx;
				bottom: 87rpx;
				z-index: 3;
			}
			.style-desc{
				font-size: 30rpx;
				color: #7f7f7f;
				letter-spacing: 2.14rpx;
				line-height: 42rpx;
				position: absolute;
				left: 58rpx;
				bottom: 40rpx;
				z-index: 3;
			}
			.style-photo{
				width: 416rpx;
				height: 100%;
				position: absolute;
				right: 0;
				bottom: 0;
			}
		}
		.bottom{
			width: 670rpx;
			height: 440rpx;
			margin: 0 auto 48rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.jewelry{
				width: 312rpx;
				height: 100%;
				background-color: #fafafa;
				border-radius: 20rpx;
				box-shadow: 0 12px 20px 0 rgba(83,66,49,0.03);
				position: relative;
				overflow: hidden;
				.jewelry-name{
					font-size: 48rpx;
					color: #3e3e3e;
					letter-spacing: 3.43rpx;
					line-height: 67rpx;
					position: absolute;
					left: 52rpx;
					bottom: 95rpx;
					z-index: 3;
				}
				.jewelry-desc{
					font-size: 30rpx;
					color: #7f7f7f;
					letter-spacing: 2.14rpx;
					line-height: 42rpx;
					position: absolute;
					left: 52rpx;
					bottom: 48rpx;
					z-index: 3;
				}
				.jewelry-photo{
					width: 100%;
					height: 392rpx;
					position: absolute;
					right: 0;
					bottom: 0;
				}
			}
		    .lamp{
				width: 312rpx;
				height: 100%;
				background-color: #fafafa;
				border-radius: 20rpx;
				box-shadow: 0 12px 20px 0 rgba(83,66,49,0.03);
				position: relative;
				.lamp-name{
					font-size: 48rpx;
					color: #3e3e3e;
					letter-spacing: 3.43rpx;
					line-height: 67rpx;
					position: absolute;
					left: 26rpx;
					bottom: 95rpx;
					z-index: 3;
				}
				.lamp-desc{
					font-size: 30rpx;
					color: #7f7f7f;
					letter-spacing: 2.14rpx;
					line-height: 42rpx;
					position: absolute;
					left: 32rpx;
					bottom: 48rpx;
					z-index: 3;
				}
				.lamp-photo{
					width: 100%;
					height: 100%;
					position: absolute;
					right: 0;
					bottom: 0;
				}
			}
		}
	}
</style>
