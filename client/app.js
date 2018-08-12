//app.js
//var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config');
var {
  singleRequest
} = require('./utils/util.js')

App({
  onLaunch: function() {
    let self = this;
    //qcloud.setLoginUrl(config.service.loginUrl)
    wx.login({
      success: function(res) {
        if (res.code) {
          //发起网络请求
          // console.log(config.API.user.login);
          singleRequest({
            url: config.API.user.login,
            postData: {
              code: res.code
            },
            success: (data) => {
              self.userInfo = {
                code: res.code,
                openId: data.data.openId,
                cookie:data.data.cookie,
                token:data.data.token
              }
              // 查看是否授权
              wx.getSetting({
                success: function (res) {
                  if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                    wx.getUserInfo({
                      success: function (res) {
                        self.addUserInfoFn(res.userInfo)
                        self.userInfo = Object.assign(self.userInfo, { user: res.userInfo})
                        console.log(self.userInfo)
                      }
                    })
                  }
                }
              })
            },
            error: (data) => {

            }
          });
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      },
      fail: function(e) {
        //console.log(e);
      },
      complete: (res) => {
        //console.log(res);
      }
    });
  },
  userInfo: {},
  addUserInfoFn(data){
    console.log(data)
    singleRequest({
      url: config.API.user.addInfo,
      postData: {
        jsonData: JSON.stringify(data)  
      },
      success: (res) => {
        console.log('success: ', res)
      },
      error: (res) => {
        console.log('error: ', res)
      }
    });
  }
})