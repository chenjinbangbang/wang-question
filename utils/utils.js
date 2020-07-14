let url = '';


function http(url, type, data, cb) {
  // wx.showLoading({
  //   title: '加载中',
  // })

  let header = {
    'content-type': "application/x-www-form-urlencoded"
  }

  if (!url.includes('/auth/login')) {
    header['Authorization'] = 'Baerar ' + tt.getStorageSync('access_token')
  }

  tt.request({
    url: 'https://wwx.wwxcj.com' + url,
    // url: 'http://localhost:3000' + url,
    data: data,
    method: type,
    header,
    success: function (res) {
      return typeof cb == "function" && cb(res.data)
    },

  })
}
module.exports = {
  http: http
} 