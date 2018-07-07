const staticData = require('../../data/staticData');

// pages/citychoose/citychoose.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cities: [],
    showItems: [],
    inputText: '',
    alternative: null,
  },
  cancel() {
    this.setData({
      inputText: '',
      showItems: this.data.cities,
    })
  },
  choose(e) {
    console.log(e)
    let val = e.target.dataset.item.name;
    if (val) {
      let pages = getCurrentPages()
      let indexPage = pages[pages.length - 2];
      indexPage.setData({
        hasChanged: true,
        searchCity: val,
      })

      wx.navigateBack({});
    }
  },
  inputFilter(e) {
    let val = e.detail.value.replace(/\s+/g, '');
    let cities = this.data.cities;
    let alternative = {};
    if (val) {
      for (let key in cities) {
        let items = cities[key];
        for (let i=0;i<items.length;i++) {
          let item = items[i];
          if (item.name.indexOf(val) !== -1) {
            if (!alternative[key]) {
              alternative[key] = []
            }
            alternative[key].push(item);
          }
        }
      }
      if (Object.keys(alternative).length === 0) {
        alternative = null;  
      }
      this.setData({
        alternative,
        showItems: alternative,
      })
    } else {
      thi.setData({
        alternative: null,
        showItems: cities,
      })
    }
  },

  getSortedAreaObj(area) {
    area = area.sort((a, b) => {
      if (a.letter > b.letter) {
        return 1;
      }
      if (a.letter < b.letter) {
        return -1;
      }
      return 0;
    });

    let obj = {}
    for (let i=0; i<area.length; i++) {
      let item = area[i];
      if (!obj[item.letter]) {
        obj[item.letter] = [];
      }
      obj[item.letter].push(item);
    }
    return obj;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let cities = this.getSortedAreaObj(staticData.cities || {});
    this.setData({
      cities,
      showItems: cities,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})