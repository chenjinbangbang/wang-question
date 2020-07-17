let url = '';


function http(url, type, data, cb) {
  // wx.showLoading({
  //   title: '加载中',
  // })

  let header = {
    'content-type': "application/x-www-form-urlencoded"
  }

  if (!url.includes('/auth/login')) {
    header['Authorization'] = 'Bearer ' + tt.getStorageSync('access_token')
  }

  tt.request({
    url: 'https://wwx.wwxcj.com' + url,
    // url: 'http://192.168.2.239:81' + url,
    data: data,
    method: type,
    header,
    success: function (res) {
      console.log('---',res)
      switch(true) {
        case [200,201].includes(res.statusCode):
          if(url.includes('/auth/login')) {
            if(res.data.success) {
              tt.setStorageSync('access_token', res.data.data.access_token);
            }
          }
          return typeof cb == "function" && cb(res.data)
          break;
        // case 404:
        //   tt.showToast({ title: '网络错误，请重新连接', icon: 'none' });
        //   break;
        default:
          tt.showToast({ title: data.message || '网络错误，请重新连接', icon: 'none' });
          break;
      }
    },
    fail(err){
      tt.showToast({ title: err.errMsg || '请求失败', icon: 'none' });
      console.error(err)
    }
  })
}
module.exports = {
  http: http
} 