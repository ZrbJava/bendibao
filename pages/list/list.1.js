// pages/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    category: {},
    shops: [],
    _page: 0,
    _limit: 10,
    id: 0,
    hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    // wx.re

    // 1.发送请求,获取当前要渲染的店铺分类下面所有店面
    wx.request({
      url: 'https://locally.uieee.com/categories/' + options.cat,
      success: (res) => {
        // 渲染标题

        this.setData({
          category: res.data,
          id: options.cat
        })
        // 修改标题
        wx.setNavigationBarTitle({
          title: res.data.name,
        })


        //2. 再次发送请求,来获取当前分类下面的前10条店铺信息
        //  var _page = this.data._page  var _limit = this.data._limit
        let { _page } = this.data
        _page++  //  注意得加1
        wx.request({
          url: 'https://locally.uieee.com/categories/' + options.cat + '/shops?_page=1&_limit=10',
          success: res => {
            this.setData({
              shops: res.data,
              _page: _page
            })
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 为了保险起见,可以判断一下标题是否已经渲染完成了,在这里再次添加一次
    if (this.data.category.name) {
      wx.setNavigationBarTitle({
        title: this.data.category.name,
      })
    }
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 当用户下拉的时候，表示数据要被重新加载
    // 需要重新发送请求,来重新渲染页面
    console.log(123)
    this.setData({    // 先将原来默认的值清除掉...
      shops: [],
      _page: 0,
      _limit: 10
    })
    let { id, _page, _limit } = this.data  // 解构赋值
    wx.request({
      url: 'https://locally.uieee.com/categories/' + id + '/shops',
      data: {
        _page: 1,
        _limit: 10
      },
      success: res => {
        this.setData({
          shops: res.data   //把新请求来的数据重新给到这个数据
        })

        // 需要停止默认的下拉刷新状态 
        wx.stopPullDownRefresh()
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 重新发送请求，获取下一个10条信息来加载 

    // 是否要再次的发送请求,要根据返回来的结果进行判断,如果当前的页码和数量之积大于总数的话，就不要再发请求
    if (!this.data.hasMore) return

    // let pageIndex = this.data._page
    // let pageSize = this.data._limit
    // let id = this.data.id
    let { _page, _limit, id } = this.data
    _page++
    wx.request({
      // url: 'https://locally.uieee.com/categories/'+id+'/shops?_page='+_page+'&_limit='+_limit,
      url: 'https://locally.uieee.com/categories/' + id + '/shops',
      data: {
        _page: _page,
        _limit: _limit
      },
      success: res => {
        const hasMore = _page * _limit < parseInt(res.header['X-Total-Count'])
        this.setData({
          // shops: res.data,   //这样重新赋值是不对的,会将原来的数据给覆盖掉
          shops: this.data.shops.concat(res.data),// 需要将请求来的数据重新追加到原数据后面
          _page: _page,
          hasMore: hasMore
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})