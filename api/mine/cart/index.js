import request from "../../request.js"

//封装获取购物车列表接口
function findAllCartItem(){
  return request({
    url:"/lejuClient/cart/findAllCartItem",
  })
}
// 删除购物车列表项接口
function delCartItems(data){
  return request({
    url:"/lejuClient/cart/delCartItems",
	method:'post',
	data
  })
}
//封装生成确认单接口
function addPreOrder(data){
  return request({
    url:"/lejuClient/order/addPreOrder",
	method:"post",
	data
  })
}


export {
  findAllCartItem,
  delCartItems,
  addPreOrder
  }