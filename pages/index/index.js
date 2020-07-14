const app = getApp()
import http from "../../utils/utils.js";
let openid = ''
let show = 0;
let numid = ''
Page({
  data: {
    num: 1,
  },

  onLoad: function () {
    // setTimeout(() => {
    //   this.defaultTap()
    // },1000)

    this.setData({
      show: 1
    })
    tt.login({
      success: (res) => {
        console.log('我要在不请求')
        let data = {
          code: res.code
        }
        // http.http('/tt/user/login/do', 'post', data, (res) => {//获取用户openid
        http.http('/auth/login', 'post', data, (res) => {//获取用户openid
          console.log('我请求成功了', res)
          tt.setStorageSync('openid', res.data);
          openid = res.data
          this.getdata(this.data.num);
        })
      }
    });
  },
  getdata(id) {//获取题目
    tt.getStorage({
      key: 'openid', // 缓存数据的key
      success: (res) => {
        let datas = {
          question: id,
          openid: res.data
        }
        // http.http('/tt/question/get', 'get', datas, (res) => {
        http.http('/wang/request/list', 'get', datas, (res) => {
          console.log(res)
          let list = [{
            opt: 'A',
            name: res.data.option1,
            num: 1
          },
          {
            opt: 'B',
            num: 2,
            name: res.data.option2,
          },
          {
            opt: 'C',
            num: 3,
            name: res.data.option3,
          },
          {
            opt: 'D',
            num: 4,
            name: res.data.option4,
          },
          ]
          if (res.data.content) {
            this.setData({
              array: res.data,
              list: list,
            })
          }
          if (this.data.num == 11) {
            numid = res.data
            this.setData({
              num: 10
            })
          } else {
            this.setData({
              num: this.data.num,
            })
          }
        })
      }
    });
  },
  selectopt(res) {//选择

    let id = res.currentTarget.id
    this.data.num++;
    if (this.data.num == 11) {
      this.setData({
        show: 0
      })
    }
    this.getdata(this.data.num);


    // let data = {
    //   openid: openid,
    //   question: this.data.num,
    //   reply: id
    // }
    // http.http('/tt/question/reply/do', 'post', data, (res) => {
    //   this.data.num++;
    //   if (this.data.num == 11) {
    //     this.setData({
    //       show: 0
    //     })
    //   }
    //   this.getdata(this.data.num);
    // })

  },
  defaultTap: function () {//调用广告
    // tt.navigateTo({
    //   url: '/pages/repely/repely?num=' + numid+'&id=1' // 指定页面的url
    // });
    // return
    let banner = tt.createRewardedVideoAd({
      adUnitId: "63i8m7594deag4koqs",
      adIntervals: 30
    })

    banner.show().then(() => {
      console.log("广告显示成功");
    }).catch(err => {
      console.log("广告组件出现问题", err);
      tt.navigateTo({
        url: '/pages/repely/repely?num=' + numid + '&id=1' // 指定页面的url
      });
    });

    banner.onClose(res => {//关闭广告给奖励
      if (res.isEnded) {
        tt.showLoading({
          title: '正在生成报告', // 内容
          success: (res) => {
            setTimeout(res => {
              tt.navigateTo({
                url: '/pages/repely/repely?num=' + numid // 指定页面的url
              });
              tt.hideLoading();

            }, 2000)
          }
        });
      }
    })

  }
})
