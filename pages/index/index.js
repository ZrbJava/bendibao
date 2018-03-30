Page({
  data:{
    indicatorDots:true,
    autoplay:true,
    interval:1000,
    duration:500,
    circular:true,
    // 轮播图图片列表
    swiperUrl:[],
    // 导航栏菜单
    nav:[
      
    ],
  },
  onLoad:function(){
    // 轮播图请求
    wx.request({
      url: 'https://locally.uieee.com/slides',
      success: res => {
        this.setData({
          swiperUrl:res.data
        }); 
      }
    }),
    //导航菜单请求  
    wx.request({
      url: 'https://locally.uieee.com/categories',
      success: res=>{
        console.log(res);
      this.setData({
        nav:res.data
      });

      }
    })
  }
});