let url='';


function http(url,type, data, cb) {
  // wx.showLoading({
  //   title: '加载中',
  // })
  
    tt.request({
      // url: 'https://wwx.wwxcj.com' + url,
      url: 'http://localhost:3000' + url,
      data: data,
      method: type,
      header:{'content-type':"application/x-www-form-urlencoded"},
      success: function (res) {
        return typeof cb == "function" && cb(res.data)
      },
    
    })
}
module.exports={
  http:http
} 