import request from "../request.js"

//封装分类接口
function findCategory(id){
  return request({
    url:`/lejuClient/productCategory/findCategory/${id}`,
  })
}


export {
  findCategory
  }