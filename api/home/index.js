import request from "../request.js"

// 封装banner图接口
function bannerAds(){
  return request({
    url:"/lejuClient/home/bannerAds",
  })
}
//封装分类接口
function findCategory(id){
  return request({
    url:`/lejuClient/productCategory/findCategory/${id}`,
  })
}
// 封装限时活动接口
function recommendList(){
  return request({
    url:"/lejuClient/home/recommendList",
  })
}
// 封装热门推荐接口
function hotList(){
  return request({
    url:"/lejuClient/home/hotList",
  })
}
// 封装新品推荐接口
function lejuLatestProducts(){
  return request({
    url:"/lejuClient/home/lejuLatestProducts",
  })
}
// 封装猜你喜欢接口
function saleMostProducts(){
  return request({
    url:"/lejuClient/home/saleMostProducts",
  })
}


export {
  bannerAds,
  findCategory,
  recommendList,
  hotList,
  lejuLatestProducts,
  saleMostProducts
  }