import baseurl from "./baseurl"
function fun(config){
  return new Promise((resolve,rejected)=>{
    uni.request({
      url: baseurl+config.url,
      data:config.data,
      method:config.method,
	  header:{
		  token:uni.getStorageSync("token")
	  },
      timeout:5000,
      success(res){
		if(res.data.code==20002){
			// token过期
			uni.showModal({
				title:"登录提示",
				content:"token过期,请重新登录",
				success(res2) {
					if(res2.confirm){
						uni.navigateTo({
							url:"/pages/mine/login/login"
						})
					}
				}
			})
		}else{
			resolve(res.data)
		}
      },
      fail(error){
        rejected(error)
      }
    })
  })
}

export default fun