import request from "../../request.js"

//封装确认单详情接口
function getPreOrderById(orderId){
  return request({
    url:`/lejuClient/order/getPreOrderById/${orderId}`,
  })
}
// 封装确认付款接口
function payConfirm(data){
  return request({
    url:"/lejuClient/order/payConfirm",
	method:"post",
	data
  })
}




export {
	getPreOrderById,
	payConfirm
  }