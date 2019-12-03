import wepy from 'wepy'
// appid: wx4c9f05d1255545a2  雅黛丽旧---雅黛丽vip
// 秘钥 225b692ec4c7d75119f6ce4dc147bfbc 

// appid:wx9422402d1ebc7cfb 雅黛丽新cdm系统
// AppSecret(小程序密钥)468d47e0d73ae31601b1689c114e94c0

// wx627972fa7b9597ee 有赞
// AppID(小程序ID)wx9070d9cdad1eef4c 力格微小店
// AppSecret(小程序密钥)788a935947b76071272f35ee91da5753复制
// 加载可扩展版 icon:success/loading/none
wepy.Toast = (str = '加载中',state='loading') => {
    wepy.showToast({
        title: str,
        icon: state,
        mask:true,
        duration: 1500
    })
}
// 加载完毕
wepy.baseToast = (str = '加载成功',state='success') => {
    wepy.showToast({
        title: str,
        icon: state,
        duration: 1500
    })
}
// 后台请求状态加载
wepy.Load = (title = '加载中',mask=true,cb=()=>{}) => {
    wx.showLoading({
        title: title,
        mask: mask,
        success: cb
      })
}
wepy.hLoad = () => {
    wx.hideLoading()
}
// 请求根路径
// get
// const baseURL = 'https://m.ligesoft.com/wx/wxsa'
// const baseURL = 'https://b2bc.ligesoft.com/wx/wxsa'
// const baseURL = 'http://t.ligesoft.com/wx/wxsa'
const baseURL = 'http://192.168.10.104:9091/wx/wxsa'
wepy.get = (url, data = {}) => {
    return wepy.request({
        url: baseURL + url,
        method: 'GET',
        data
    })
}
// post
wepy.post = (url, data = {}) => {
    return wepy.request({
        url: baseURL + url,
        method: 'POST',
        data,
        header: {
            'content-type': 'application/json', // 默认值
            'auth': "ligesofts"
          }
    })
}
// test
wepy.gettest = (url, data = {}) => {
    return wepy.request({
        url: url,
        method: 'GET',
        data
    })
}
wepy.posttest = (url, data = {}) => {
    return wepy.request({
        url: url,
        method: 'POST',
        data,
        header: {
            'content-type': 'application/json', // 默认值
            'auth': "ligesofts"
          }
    })
}