import {request} from '../../request/index'
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: '综合',
        isActive: true
      },
      {
        id: 1,
        value: '销量',
        isActive: false
      },
      {
        id: 2,
        value: '价格',
        isActive: false
      }
    ],
    goodsData: []
  },
  // 接口要的参数
  QueryParams: {
    query: '',
    cid: '',
    pagenum: 1,
    pageSize: 10
  },

  // 总页数
  totalPages: 1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid
    this.getGoodsList()
  },
  // 获取商品列表数据
  async getGoodsList() {
    const result = await request({
      url: "/goods/search",
      data: this.QueryParams 
    })
    // console.log(result)
    const {goods} = result.data.message
    const {total} = result.data.message
    // console.log(total)
    this.totalPages = Math.ceil(total/this.QueryParams.pageSize)
    // console.log(this.totalPages)
    this.setData({
      goodsData: [...this.data.goodsData, ...goods]
    })
    // 关闭下拉刷新的提示窗口
    wx.stopPullDownRefresh()
  },

  handleTabsItemChange(e) {
    const {index} = e.detail
    const {tabs} = this.data
    tabs.forEach((tab, i) => i===index ? tab.isActive = true : tab.isActive = false)
    this.setData({
      tabs
    })
  },

  // 用户上滑页面滚动条触底开始加载页面
  onReachBottom() {
    // console.log('onReachBottom')
    if(this.QueryParams.pagenum >= this.totalPages) {
      wx.showToast({
        title: '没有下一页数据'
      });
        
    } else {
      this.QueryParams.pagenum++;
      this.getGoodsList()
    }
  },

  // 下拉刷新的事件
  onPullDownRefresh() {
    // 1. 充值数组
    this.setData({
      goodsData: []
    })
    // 2. 重置页码
    this.QueryParams.pagenum = 1;
    // 3. 重新发送请求
    this.getGoodsList()
  }
})