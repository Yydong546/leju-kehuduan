import request from "../../request.js"

//封装查询订单列表接口
function findAllOrders(){
  return request({
    url:"/lejuClient/order/findAllOrders"
  })
}
// 封装未付款中取消订单接口
function cancelOrder(orderId){
  return request({
    url:`/lejuClient/order/cancelOrder/${orderId}`,
	method:"post"
  })
}
// 封装未付款中确认付款接口
// function addPreOrder(data){
//   return request({
//     url:"/lejuClient/order/addPreOrder",
// 	method:"post",
// 	data
//   })
// }
// 封装确认收货接口
function receiveDone(data){
  return request({
    url:"/lejuClient/order/receiveDone",
	method:"post",
	data
  })
}
// 封装删除订单信息接口
function clearOrderFocus(orderId){
  return request({
    url:`/lejuClient/order/_clearOrderFocus?orderId=${orderId}`,
	method:"post"
  })
}
// 封装退货列表接口
function orderReturnApplys(){
  return request({
    url:`/lejuClient/orderReturn/orderReturnApplys`
  })
}



export {
  findAllOrders,
  cancelOrder,
  receiveDone,
  clearOrderFocus,
  orderReturnApplys
  }