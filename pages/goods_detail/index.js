import {request} from '../../request/index'
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {}
  },
  GoodsInfo: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {goods_id} = options
    console.log(goods_id)
    this.getGoodsDetail(goods_id)
  },

  async getGoodsDetail(goods_id) {
    const result = await request({url: '/goods/detail', data : {goods_id}})
    this.GoodsInfo = result.data.message
    const { goods_name, goods_price, goods_introduce, pics} = result.data.message
    this.setData({
      goodsObj: {
        goods_name,
        goods_price, 
        // iphone部分手机不识别webp图片格式
        // 最好找后台，让他进行改
        // 临时自己改，确保后台存在 1.webp => 1.jpg
        // goods_introduce: goods_introduce.replace(/\.webp/g,'.jpg'),
        goods_introduce,
        pics
      }
    })
  },

  // 点击轮播图放大预览
  handlePreviewImage() {
    // 1. 先构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map(item => item.pics_mid)
    wx.previewImage({
      current: urls[0],
      urls
    });
  },

  // 点击加入购物车触发事件
  handleCartAdd() {
    console.log('点击加入购物车')
    // 获取缓存中的购物车
    let cart = wx.getStorageSync('cart') || [];
    // 判断商品对象是否存在于购物车数组中
    let index = cart.findIndex(item => item.goods_id === this.GoodsInfo.goods_id)
    if(index === -1) {
      // 不存在
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true
      cart.push(this.GoodsInfo)
    } else {
      cart[index].num++
    }
    // 把购物车重新添加回缓存中
    wx.setStorageSync('cart', cart);
    // 弹窗提醒
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      mask: true
    });
  }
})