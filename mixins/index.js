var obj ={
	data(){
		return {
			
		}
	},
	methods:{
		// 方法检查是否登录
		checkLogin(){
			let token =uni.getStorageSync("token");
			if(!token){
				uni.showModal({
					 title:"登录提示",
					 content:"暂未登录,是否立即登录",
					 success(res) {
					 	console.log(res)
						if(res.confirm){//点击的是确定,跳转到登录页面
							uni.navigateTo({
								url:"/pages/mine/login/login"
							})
						}else{
							uni.showToast({
								title:"您取消了登录",
								icon:"success"
							})
						}
					 }
				})
				return false
			}else{
				return true
			}
		}
	}
}

export default obj