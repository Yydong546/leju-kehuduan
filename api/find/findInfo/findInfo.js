import request from "../../request.js"

// 封装文章明细接口
function productArticle(id){
  return request({
    url:`/lejuClient/productArticle/productArticle/${id}`,
  })
}

export {
  productArticle
  }