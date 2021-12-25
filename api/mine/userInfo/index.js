import request from "../../request.js"

//封装更新用户信息接口
function updateMemberInfo(data){
  return request({
    url:"/lejuClient/member/updateMemberInfo",
	method:"post",
	data
  })
}



export {
  updateMemberInfo
  }