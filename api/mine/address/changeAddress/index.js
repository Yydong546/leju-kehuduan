import request from "../../../request.js"

//封装删除地址接口
function delAddressInfo(addressId){
  return request({
    url:`/lejuClient/address/delAddressInfo/${addressId}`,
	method:'delete',
  })
}
//封装更新地址接口
function updateAddressInfo(data){
  return request({
    url:"/lejuClient/address/updateAddressInfo",
	method:'post',
	data
  })
}
//封装切换默认接口
function switchDefault(addressId,defaultStatus){
  return request({
    url:`/lejuClient/address/switchDefault/${addressId}/${defaultStatus}`,
	method:'post',
  })
}

export {
  delAddressInfo,
  updateAddressInfo,
  switchDefault
  }