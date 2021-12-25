import request from "../../../request.js"

//封装新增地址接口
function addAddressInfo(data){
  return request({
    url:"/lejuClient/address/addAddressInfo",
	method:'post',
	data
  })
}


export {
  addAddressInfo
  }