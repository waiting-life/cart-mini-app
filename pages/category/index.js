import {request} from '../../request/index'
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuData: [],
    goodsData: [],

    // 被点击的左侧菜单
    currentIndex: 0,
    scrollTop: 0
  },
  //接口的返回数据
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const Cates = wx.getStorageSync('cates');
    if(!Cates) {
      this.getCates()
    } else {
      if(Date.now()-Cates.time > 1000*10) {
        this.getCates()
      } else {
        console.log('使用缓存中的数据')
        this.Cates = Cates.data
        const menuData = this.Cates.map(item => item.cat_name)
        const goodsData = this.Cates[0].children
        this.setData({
          menuData,
          goodsData
        })
      }
    }
  },
  // 获取分类数据
  // getCates() {
  //   request({
  //     url: '/categories'
  //   }).then(result => {
  //     const {message} = result.data
  //     this.Cates = message 
  //     wx.setStorageSync('cates', {time: Date.now(), data: this.Cates});
        
  //     const menuData = this.Cates.map(item => item.cat_name)
  //     const goodsData = this.Cates[0].children
  //     this.setData({
  //       menuData,
  //       goodsData,
  //       // 重新设置右边距离顶部的距离
  //       scrollTop: 0
  //     })
  //   })
  // },
  
  async getCates() {
    const result = await request({url: '/categories'})
    this.Cates = result.data.message 
    wx.setStorageSync('cates', {time: Date.now(), data: this.Cates});
      
    const menuData = this.Cates.map(item => item.cat_name)
    const goodsData = this.Cates[0].children
    this.setData({
      menuData,
      goodsData,
      // 重新设置右边距离顶部的距离
      scrollTop: 0
    })
  },

  handleItemTap(e) {
    const {index} = e.currentTarget.dataset
    const goodsData = this.Cates[index].children
    this.setData({
      currentIndex: index,
      goodsData
    })
  }
})