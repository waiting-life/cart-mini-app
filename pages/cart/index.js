/**
 * 获取用户的收货地址
 *  1. 绑定点击事件
 *  2. 调用小程序内部的api, wx.chooseAddress 来获取用户的收货地址
 */
import {getSetting, chooseAddress, openSetting, showModal,showToast} from '../../utils/asyncWx'
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    // 1. 获取缓存中的收货地址信息
    const address = wx.getStorageSync('address') || {};
    address.all = address.provinceName+address.cityName+address.countyName+address.detailInfo
    const cart = wx.getStorageSync('cart') || []
    this.setCart(cart)
    this.setData({address})
    // 计算全选 every每一个回调返回true，才会返回true
    // 空数组调用every，返回值就是true
    // const allChecked = cart.length?cart.every(item => item.checked) : false
    // console.log(cart)
    // let totalPrice = 0
    // let totalNum = 0
    // let allChecked = true
    // cart.forEach(item => {
    //   if(item.checked) {
    //     totalPrice += item.num*item.goods_price
    //     totalNum += item.num
    //   } else {
    //     allChecked = false
    //   }
    // })
    // allChecked = cart.length!=0 ? allChecked : false
    // address.all = address.provinceName+address.cityName+address.countyName+address.detailInfo
    // // 2. 给data赋值
    // this.setData({
    //   address,
    //   cart,
    //   allChecked,
    //   totalPrice,
    //   totalNum
    // })
  },
  async handleChooseAddress() {
    // console.log('获取用户地址')
    // wx.getSetting({
    //   success: (result) => {
    //     // console.log(result)
    //     const scopeAddress = result.authSetting["scope.address"]
    //     if(scopeAddress === true || scopeAddress === undefined) {
    //       wx.chooseAddress({
    //         success: (result1) => {
    //           console.log(result1)
    //         }
    //       })
    //     } else {
    //       wx.openSetting({
    //         success: (result2) => {
    //           // 用户成功授权之后，直接可以调用获取收货地址
    //           wx.chooseAddress({
    //             success: (result3) => {
    //               console.log(result3)
    //             }
    //           })
    //         }
    //       });
            
    //     }
    //   }
    // })


    try {
      // 获取权限状态
      const res1 = await getSetting()
      const scopeAddress = res1.authSetting["scope.address"]
      // 判断权限状态
      if(scopeAddress === false) {
        await openSetting()
      }  
      const address = await chooseAddress()
      // 存入到缓存中
      wx.setStorageSync('address', address);
        
    } catch (error) {
      console.log(error)
    }
  },
  // 商品的选中
  handleItemChange(e) {
    // 1. 获取被修改的商品的id
    const goods_id = e.currentTarget.dataset.id 
    console.log(goods_id)
    // 2. 获取购物车数组
    const {cart} = this.data
    // 3. 找到被修改的商品对象
    const index = cart.findIndex(item => item.goods_id === goods_id)
    // 4. 选中状态取反
    cart[index].checked = !cart[index].checked
    // 5. 把购物车数据重新设置回data和缓存中
    this.setCart(cart)  
  },

  // 设置购物车状态同时 重新计算底部工具栏的数据 全选 总数量 总价格
  setCart(cart) {
    let totalPrice = 0
    let totalNum = 0
    let allChecked = true
    cart.forEach(item => {
      if(item.checked) {
        totalPrice += item.num*item.goods_price
        totalNum += item.num
      } else {
        allChecked = false
      }
    })
    allChecked = cart.length!=0 ? allChecked : false
    // address.all = address.provinceName+address.cityName+address.countyName+address.detailInfo
    // 2. 给data赋值
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    })
    wx.setStorageSync('cart', cart)
  },

  // 商品全选功能
  handleAllChecked() {
    // 1. 获取data中的数据
    let {allChecked, cart} = this.data
    // 2. 修改值
    allChecked = !allChecked
    // 3. 循环修改cart数组中商品的选中状态
    cart.forEach(item => item.checked = allChecked)
    // 4. 把修改后的值填充回data或者缓存中 
    this.setCart(cart)
  },

  // 商品数量的编辑功能
  async handleItemNumEdit(e) {
    const {operation, id} = e.currentTarget.dataset
    // console.log(operation, id)
    const {cart} = this.data
    let index = cart.findIndex(item => item.goods_id === id)
    // 判断是否要执行删除
    if(cart[index].num === 1 && operation === -1) {
      const result = await showModal({content: '您是否要删除该商品？'})
      console.log(result)
      if (result.confirm) {
        cart.splice(index, 1)
        this.setCart(cart)
      } else if(result.cancel) {
        console.log('用户点击取消')
      }
    } else {
      cart[index].num+=operation
      this.setCart(cart)
    }
  },
  // 点击结算
  async handlePay() {
    // 1. 判断收货地址
    const {address, totalNum} = this.data
    if(!address.userName) {
      await showToast({title: "您还没有选择收货地址"})
      return;
    }
    // 判断有没有选购商品
    if(totalNum === 0) {
      console.log(totalNum)
      await showTotast({title: "您还没有选购商品"})
      return;
    }
    // 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index',
    })
  }
})