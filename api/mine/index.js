import request from "../request.js"

//封装分类接口
function getMemberInfo(){
  return request({
    url:"/lejuClient/login/getMemberInfo",
  })
}
//封装查询地址接口
function findAllAddress(){
  return request({
    url:"/lejuClient/address/findAllAddress",
  })
}


export {
  getMemberInfo,
  findAllAddress
  }