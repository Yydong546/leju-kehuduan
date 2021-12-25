import request from "../../request.js"

//封装分类接口
function register(data){
  return request({
    url:"/lejuClient/member/register",
	method:"post",
	data
  })
}


export {
  register
  }