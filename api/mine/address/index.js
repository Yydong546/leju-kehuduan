import request from "../../request.js"

//封装获取地址列表接口
function findAllAddress(){
  return request({
    url:"/lejuClient/address/findAllAddress",
  })
}


export {
  findAllAddress
  }