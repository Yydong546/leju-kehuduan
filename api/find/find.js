import request from "../request.js"

//封装发现接口
function findArticleByPage(start,limit){
  return request({
    url:`/lejuClient/productArticle/findArticleByPage/${start}/${limit}`,
  })
}

// 封装品牌列表接口
function findBrandsByPage(start,limit){
  return request({
    url:`/lejuClient/brand/findBrandsByPage/${start}/${limit}`,
  })
}


export {
  findArticleByPage,
  findBrandsByPage
  }