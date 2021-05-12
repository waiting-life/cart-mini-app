import {request} from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
  data: {
    swiperList: [],
    catesList: [],
    // 楼层数据
    floorList: []
  },
  //options(Object)
  onLoad: function(options) {
    //  wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result) => {
    //     console.log(result)
    //     const {message} = result.data 
    //     this.setData({
    //       swiperList: message
    //     })
    //   },
    //   fail: () => {},
    //   complete: () => {}
    // });
    this.getSwiperList()
    this.getCateList()
    this.getFloorList()      
  },

  // 获取轮播图的数据
  async getSwiperList() {
    const result = await request({url: '/home/swiperdata'})
    this.setData({
      swiperList: result.data.message
    })
  },
  // getSwiperList() {
  //   request({url: '/home/swiperdata'})
  //   .then(result => {
  //     const {message} = result.data 
  //     this.setData({
  //       swiperList: message
  //     })
  //   })
  // },

  // 获取分类导航数据
  async getCateList() {
    const result = await request({url: '/home/catitems'})
    this.setData({
      catesList: result.data.message
    })
  },
  // getCateList() {
  //   request({url: '/home/catitems'})
  //   .then(result => {
  //     const {message} = result.data 
  //     this.setData({
  //       catesList: message
  //     })
  //   })
  // },

  // 获取楼层数据
  async getFloorList() {
    const result = await request({url: '/home/floordata'})
    this.setData({
      floorList: result.data.message
    })
  }
  // getFloorList() {
  //   request({url: '/home/floordata'})
  //   .then(result => {
  //     const {message} = result.data 
  //     this.setData({
  //       floorList: message
  //     })
  //   })
  // }
});
  