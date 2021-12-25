import request from "../../request.js"

//封装分类接口
function doLogin(data){
  return request({
    url:"/lejuClient/login/doLogin",
	method:"post",
	data
  })
}


export {
  doLogin
  }