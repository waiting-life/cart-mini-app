import { request} from '../../request/index'
import {requestPayment} from '../../utils/asyncWx'
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0,
  },
  onShow() {
    // 1. 获取缓存中的收货地址信息
    const address = wx.getStorageSync('address') || {};
    address.all = address.provinceName+address.cityName+address.countyName+address.detailInfo
    let cart = wx.getStorageSync('cart') || []
    cart = cart.filter(item => item.checked)
    let totalPrice = 0
    let totalNum = 0
    cart.forEach(item => {
      totalPrice += item.num*item.goods_price
      totalNum += item.num
    })
    // address.all = address.provinceName+address.cityName+address.countyName+address.detailInfo
    // 2. 给data赋值
    this.setData({
      cart,
      address,
      totalPrice,
      totalNum
    })
  },

  // 点击支付按钮后触发事件
  async handleOrderPay() {
    // 1. 判断缓存中有没有token
    const token = wx.getStorageSync("token");
    // 2. 判断
    if(!token) {
      wx.navigateTo({
        url: '/pages/auth/index'
      });
      return
    }
    // 3. 创建订单
    // 3.1 准备创建订单要的请求头参数
    const header = {Authorization:token}
    // 3.2 准备请求体参数
    const order_price = this.data.totalPrice
    const consignee_addr = this.data.address.all
    let goods = []
    const {cart} = this.data
    cart.forEach(item => goods.push({
      goods_id: item.goods_id,
      goods_number: item.num,
      goods_price: item.goods_price
    }))
    const orderParams = {order_price, consignee_addr, goods, }
    // 4. 准备发送请求，创建订单，获取订单号
    const {order_number} = await request({url: '/my/orders/create', method: 'POST', data:orderParams, header})
    console.log(order_number) 
    // 5. 发起预支付接口
    const {pay} = await request({url: '/my/orders/req_unifiedorder', method: 'POST', header, data: {order_number}})
    // 6. 发起微信支付
    const res = await requestPayment(pay)
    console.log(res)
  }
})
