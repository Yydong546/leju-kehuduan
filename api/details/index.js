import request from "../request.js"

//封装商品详情接口
function productDetail(productId){
  return request({
    url:`/lejuClient/product/productDetail/${productId}`,
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
//封装添加到购物车接口
function addCart(data){
  return request({
    url:"/lejuClient/cart/addCart",
	method:"post",
	data
  })
}


export {
	productDetail,
	addPreOrder,
	addCart
  }