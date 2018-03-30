// pages/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    category: {},
    shops: [],
    _page: 1,
    _limit: 10,
    id: 0,
    hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    // 获取当前分类名称，并设置给导航栏标题
    wx.request({
      url: "https://locally.uieee.com/categories/" + options.cat,
      success: (res) =>{
        console.log(res);
        this.setData({
          category: res.data,
          id:options.cat
        });
        // 设置导航栏标题
        wx.setNavigationBarTitle({
          title:res.data.name,
        });
      }
    });
    wx.request({
      url: `https://locally.uieee.com/categories/${options.cat}/shops/?_page=${this._page}_limit=${this._limit}`,
      success: (res) => {
        this.setData({
          shops:res.data,
        });
      }
    });


  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // console.log(this.data);
    if (this.data.category.name) {
      wx.setNavigationBarTitle({
        title:this.data.category.name
      });
    }

    console.log(this.data.shops);
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 下拉刷新重新加载数据
    // 1.首先清空之前数据
    this.setData({
      shops:[]
    });
    wx.request({
      url:`https://locally.uieee.com/categories/${this.data.id}/shops/?`,
      data: {
        _page: this.data._page,
        _limit: this.data._limit,
      },
      success: (res) => {
        console.log(res.data);
        this.setData({
          shops: res.data
        });
        // 成功加载数据后，把关闭下拉刷新
        wx.stopPullDownRefresh()
      }
    });
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (e) {
    // console.log(1);
    var { _page, id, _limit } = this.data;
    _page++;
    // console.log(_page, _limit);
    // 每次请求前都判断一下是否还有跟多数据，如果所有数据请求完，则将结束请求
    if (!this.data.hasMore) {
      return;
    }
    wx.request({
      url: `https://locally.uieee.com/categories/${id}/shops/?_page=${_page}_limit=${_limit}`,
      success: (res) => {
        // 判断是否还有更多数据，并更新会data中的hasMore属性。
        const hasMore = _page * _limit <= res.header["X-Total-Count"] ? true : false;
        this.setData({
          shops: this.data.shops.concat(res.data),
          _page: _page,
          hasMore : hasMore
        });
      }
    });
   
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})