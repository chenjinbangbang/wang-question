const app = getApp()
const rateX = tt.getSystemInfoSync().windowWidth / 750;
const rateY = tt.getSystemInfoSync().windowHeight / 1334;
let id=''
console.log(rateX, rateY, 'rateYrateY')

function getImageInfo(url) {
  return new Promise((resolve, reject) => {
    tt.getImageInfo({
      src: url,
      success: resolve,
      fail: reject,
    })
  })
}

function canvasBgImg(ctx, path, x, y, width, height) {
  console.log('生成背景', path)
  ctx.drawImage(
    path,
    x,
    y,
    width,
    height
  )
}

function canvasText(ctx, name, color, size, x, y) {
  console.log('生成昵称', name)
  // 这是微信名
  ctx.setFontSize(size)
  ctx.setFillStyle(color)
  // ctx.setTextAlign('center'); 文字居中
  ctx.fillText(
    name,
    x,
    y
  )
}

function canvasHeadImg(ctx, path, x, y, banjing) {
  console.log('生成头像', path)
  ctx.arc(x, y, banjing, 0, 2 * Math.PI)
  ctx.setFillStyle('#EEEEEE')
  ctx.fill()
  ctx.clip()
  ctx.drawImage(path, x - banjing, y - banjing, banjing * 2, banjing * 2)
}

function canvasToTempFilePath(option, context) {
  return new Promise((resolve, reject) => {
    tt.canvasToTempFilePath({
      ...option,
      success: function (res) {
        resolve(res)
      },
      fail: reject,
    }, context)
  })
}

function saveImageToPhotosAlbum(option, pagethis) {
  return new Promise((resolve, reject) => {
    tt.saveImageToPhotosAlbum({
      filePath: option.tempFilePath,
      success: resolve,
      fail: (res) => {
       
      }
    })

  })
}

let num = ''
Page({
  data: {
    bg: 'https://wwx.wwxcj.com/media/webimg/zuanshi.png',

  },
  createCanvas(bg, headImg) {
    console.log('我在生成报告', headImg)
    let {
      nickName,
      windowWidth,
      windowHeight
    } = this.data
    const ctx = tt.createCanvasContext('canvas', this)

    this.setData({
      ctx
    })

    canvasBgImg(ctx, bg, 0, 0, windowWidth, windowHeight)
    canvasText(ctx, nickName, '#FECA5A', 30 * rateX, 240 * rateX, 130 * rateY)
    canvasHeadImg(ctx, headImg, 160 * rateX, 100 * rateY, 55 * rateX)

    // ctx.save()
    ctx.draw()
  },
  reso() {
    tt.navigateTo({
      url: '/pages/index/index'
    });
  },
  getbanner: function () {//调用广告
    let banner = tt.createRewardedVideoAd({
      adUnitId: "63i8m7594deag4koqs",
      adIntervals: 30
    })
    banner.show().then(() => {
      console.log("广告显示成功");
    }).catch(err => {
      console.log("广告组件出现问题", err);
      this.setData({
        shows: 0
      })
    });
    banner.onClose(res => {//关闭广告给奖励
      if (res.isEnded) {
        this.setData({
          shows: 0
        })
      }
    })
  },
  onLoad: function (option) {
    tt.showLoading({
      title: '正在生成报告', // 内容
      success: res => {
        setTimeout(res => {
          tt.hideLoading();
        }, 1500)
      }
    })
    if(option.id){
      id=option.id
    }
    num =option.num
    console.log(option)
    let {
      windowHeight,
      windowWidth,
      pixelRatio
    } = tt.getSystemInfoSync()
    this.setData({
      windowHeight,
      windowWidth,
      pixelRatio,
      shows: 1
    })
    this.getUserInfo()
  },
  close() {
    console.log(0)
    this.setData({
      shows: 1
    })
  },
  saveImage: function () {
    let {
      windowWidth,
      windowHeight,
      ctx,
      pixelRatio
    } = this.data
    ctx.draw(true, () => {
      canvasToTempFilePath({
        quality: 1,
        canvasId: `canvas`,
        width: windowWidth * pixelRatio,
        height: windowHeight * pixelRatio,
        destWidth: windowWidth * pixelRatio,
        destHeight: windowHeight * pixelRatio,
      }, this).then(
        ({
          tempFilePath
        }) => {
          saveImageToPhotosAlbum({
            tempFilePath,
          }, this).then(() => {
            tt.showToast({
              icon: 'none',
              title: '分享图片已保存至相册',
              duration: 2000,
            })
          }).catch(() => { })
        }
      )
    })
  },
  getUserInfo: function (res) {
    return new Promise((resolve, reject) => {
      // tt.login({
      //   success: (res) => {
         
          tt.getUserInfo({
            success: ({
              errMsg,
              userInfo: {
                avatarUrl,
                nickName
              }
              
            }) => {
            // console.log(avatarUrl,'我的图片1')
            console.log('头像：', avatarUrl)
            
              if (errMsg === 'getUserInfo:ok') {
                this.setData({
                  avatarUrl,
                  nickName
                })
                this.getImg()
              }
            },
            fail: (res) => {
              console.log('我获取失败了1', res)
              if (res.errMsg === 'getUserInfo:fail auth deny') {
                tt.openSetting({
                  success: (res) => {
                    tt.getUserInfo({
                      success: ({
                        errMsg,
                        userInfo: {
                          avatarUrl,
                          nickName
                        }
                      }) => {
                        if (errMsg === 'getUserInfo:ok') {
                          this.setData({
                            avatarUrl,
                            nickName
                          })
                          this.getImg()
                        }
                      }
                    })
                  }
                })
              }
            }
          });
      //   },
      //   fail(res) {
      //     console.log('我获取失败了2', res)
      //   }
      // });
    })
  },
  getImg() {
    let {
      bg,
      avatarUrl
    } = this.data

    //  if(id==1){
    //    avatarUrl= `https://sf1-ttcdn-tos.pstatp.com${avatarUrl.split('http://sf1-ttcdn-tos.pstatp.com')[1]}`
    //    console.log(avatarUrl,'我的图片2')
    //  }
              
    if (num == 1 || num == 2 || num == 3 || num == 0) {
      console.log('???')
      bg = 'https://wwx.wwxcj.com/media/webimg/zuanshi.png'
      // canvasText(ctx, '永恒钻石', '#ffffff', 30 * rateX, 145 * rateX, 370 * rateY)


    } else if (num == 4 || num == 5 || num == 6) {
      console.log(2)

      bg = 'https://wwx.wwxcj.com/media/webimg/xingyao.png'
      // canvasText(ctx, '至尊星耀', '#ffffff', 30 * rateX, 100 * rateX, 350 * rateY)

    } else if (num == 7 || num == 8) {
      bg = 'https://wwx.wwxcj.com/media/webimg/wangzhe.png'
      // canvasText(ctx, '最强王者x30', '#ffffff', 30 * rateX, 140 * rateX, 720 * rateY)

    } else if (num == 9 || num == 10) {
      bg = 'https://wwx.wwxcj.com/media/webimg/rongyao.png'
      // canvasText(ctx, '荣耀王者x66', '#ffffff', 30 * rateX, 140 * rateX, 720 * rateY)
    }

    getImageInfo(bg).then(res => {
      this.createCanvas(res.path, avatarUrl)
    })
    // this.createCanvas(bg, avatarUrl)

    // Promise.all([getImageInfo(bg), getImageInfo(avatarUrl)]).then(res => {
    //   console.log('???', res)
    //   this.createCanvas(...res)
    // }).catch(res => {
    // })

  }
})