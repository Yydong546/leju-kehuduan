import request from "../../../request.js"

//封装通过订单id获取订单明细接口
function getPreOrderById(orderId){
  return request({
    url:`/lejuClient/order/getPreOrderById/${orderId}`,
  })
}
//封装通过id获取退单明细接口
function orderReturn(returnId){
  return request({
    url:`lejuClient/orderReturn/${returnId}`,
  })
}


export {
	getPreOrderById,
	orderReturn
  }