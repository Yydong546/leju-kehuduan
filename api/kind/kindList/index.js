import request from "../../request.js"

//封装商品接口
function findProductList(start,limit,data){
  return request({
    url:`/lejuClient/product/findProductList/${start}/${limit}`,
	method:"post",
	data
  })
}


export {
  findProductList
  }