var bmap = require('../../libs/bmap-wx.js');
let globalData = getApp().globalData
const SYSTEMINFO = globalData.systemInfo;
Page({
  data: {
    weatherData: '',
    bcgColor: '#40a7e7',
    cityDates: {},
    icons: ['/img/clothing.png', '/img/carwashing.png', '/img/pill.png', '/img/running.png', '/img/sun.png'],
    searchText: null,
    // 是否已经弹出
    hasPopped: false,
    animationMain: {},
    animationOne: {},
    animationTwo: {},
    animationThree: {},
    delta: {},   
    pos: {},
    hasChanged: false,
    searchCity: ''
  },
  onLoad: function () {
    this.init();
  },
  onShow(){
    if (!this.data.hasChanged) {
      this.init({})
    } else {
      this.search(this.data.searchCity);
      this.setData({
        hasChanged: false,
        searchCity: ''
      });
    }
  },
  init(params={}) {
    var that = this;
    // 新建百度地图对象 
    var BMap = new bmap.BMapWX({
      ak: globalData.ak,
    });
    // 发起weather请求 
    BMap.weather({
      location: params.location,      
      fail: that.fail,
      success: that.success,
    });
  },
  calcPM(value) {
    if (value > 0 && value <= 50) {
      return {
        val: value,
        desc: '优',
        detail: '',
      }
    } else if (value > 50 && value <= 100) {
      return {
        val: value,
        desc: '良',
        detail: '',
      }
    } else if (value > 100 && value <= 150) {
      return {
        val: value,
        desc: '轻度污染',
        detail: '对敏感人群不健康',
      }
    } else if (value > 150 && value <= 200) {
      return {
        val: value,
        desc: '中度污染',
        detail: '不健康',
      }
    } else if (value > 200 && value <= 300) {
      return {
        val: value,
        desc: '重度污染',
        detail: '非常不健康',
      }
    } else if (value > 300 && value <= 500) {
      return {
        val: value,
        desc: '严重污染',
        detail: '有毒物',
      }
    } else if (value > 500) {
      return {
        val: value,
        desc: '爆表',
        detail: '能出来的都是条汉子',
      }
    }
  },
  success(data) {
    wx.stopPullDownRefresh();
    var res = {
      ...data.originalData,
      ...data.currentWeather[0],
    };
    res.temperature = data.currentWeather[0].date.match(/\d+/g)[2];
    res.airCondition = this.calcPM(res.pm25).desc;
    this.setData({
      cityDates: res,
    });
  },
  fail(data) {
    console.log(data)
  },
  commitSearch(res) {
    let val = ((res.detail || {}).value || '').replace(/\s+/g, '')
    this.search(val)
  },
  search(address) {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300,
    });
    var that = this;
    this.geocoder(address, (loc) => {
      that.init({
        location: `${loc.lng},${loc.lat}`,
      })
    });
  },
  geocoder(address, success) {
    let that = this;
    wx.request({
      url: getApp().setGeocoderUrl(address),
      success(res) {
        let data = res.data || {};
        if (data.status === 0) {
          let ret = data.result || {}
          success && success(ret.location);
        } else {
          wx.showToast({
            title: data.msg || '网络不给力，请稍后重试'
          })
        }
      },
      fail(res) {
        wx.showToast({
          title: res.errMsg || '网络不给力，请稍后重试'
        })
      },
      complete() {
        that.setData({
          searchText: '',
        })
      },
    })  
  },
  popp() {
    let animationMain = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationOne = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationTwo = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationThree = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    animationMain.rotateZ(180).step();
    animationOne.translate(-50, -60).rotateZ(360).opacity(1).step();
    animationTwo.translate(-90, 0).rotateZ(360).opacity(1).step();
    animationThree.translate(-50, 60).rotateZ(360).opacity(1).step();

    this.setData({
      animationMain: animationMain.export(),
      animationOne: animationOne.export(),
      animationTwo: animationTwo.export(),
      animationThree: animationThree.export(),
    })
  },
  back() {
    let animationMain = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationOne = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationTwo = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationThree = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    animationMain.rotateZ(180).step();
    animationOne.translate(0, 0).rotateZ(-360).opacity(0).step();
    animationTwo.translate(0, 0).rotateZ(-360).opacity(0).step();
    animationThree.translate(0, 0).rotateZ(-360).opacity(0).step();

    this.setData({
      animationMain: animationMain.export(),
      animationOne: animationOne.export(),
      animationTwo: animationTwo.export(),
      animationThree: animationThree.export(),
    })
  },
  menuMain() {
    if (!this.data.hasPopped) {
      this.popp();
      this.setData({
        hasPopped: true,
      });
    } else {
      this.back();
      this.setData({
        hasPopped: false,
      });
    }
  },
  menuTouchStart(e) {
    let touches = e.touches[0];
    let target = e.target;
    let delta = {
      x: target.offsetLeft - touches.pageX,
      y: target.offsetTop -  touches.pageY,
    }
    this.setData({
      delta,
    })
  },
  menuMainMove(e) {
    if (this.data.hasPopped) {
      this.back();
      this.setData({
        hasPopped: false,
      })
    }
    let windowWidth = SYSTEMINFO.windowWidth
    let windowHeight = SYSTEMINFO.windowHeight
    let touches = e.touches[0]
    let clientX  = touches.clientX
    let clientY = touches.clientY
    // 边界判断
    if (clientX > windowWidth - 40) {
      clientX = windowWidth - 40
    }
    if (clientX <= 90) {
      clientX = 90
    }
    if (clientY > windowHeight - 40 - 60) {
      clientY = windowHeight - 40 - 60
    }
    if (clientY <= 60) {
      clientY = 60
    }
    let delta = this.data.delta;
    let pos = {
      left: clientX + delta.x,
      top: clientY + delta.y,
    }
    this.setData({
      pos,
    })
  },
  menuOne() {
    this.menuMain()
    wx.navigateTo({
      url: '/pages/citychoose/citychoose'
    })
  },

})