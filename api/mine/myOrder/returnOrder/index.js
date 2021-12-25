import request from "../../../request.js"

//封装通过订单id获取订单明细接口
function getPreOrderById(orderId){
  return request({
    url:`/lejuClient/order/getPreOrderById/${orderId}`,
  })
}
// 封装申请退单接口
function addOrderReturnApply(data){
  return request({
    url:`/lejuClient/orderReturn/addOrderReturnApply`,
	method:"post",
	data
  })
}
// 封装获取退单公司地址接口
function getCompanyAddrss(){
  return request({
    url:`/lejuClient/orderReturn/getCompanyAddrss`
  })
}


export {
	getPreOrderById,
    addOrderReturnApply,
	getCompanyAddrss
  }