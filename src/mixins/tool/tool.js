var barcode = require('./barcode.js');
var qrcode = require('./qrcode.js');
function convert_length(length) {
    return Math.round(wx.getSystemInfoSync().windowWidth * length / 750);
  }
function barc(id, code, width, height) {
    barcode.code128(wx.createCanvasContext(id), code, convert_length(width), convert_length(height))
  }

  function qrc(id, code, width, height) {
    qrcode.api.draw(code, {
      ctx: wx.createCanvasContext(id),
      width: convert_length(width),
      height: convert_length(height)
    })
  }
  /*const formatTime = date => {
    if(!date){
      return '';
    }
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
  
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }*/
  
  
  /** 
   * 时间戳转化为年 月 日 时 分 秒 
   * number: 传入时间戳 
   * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
  */
  function formatTime(number, format) {
    if (!number){
      return;
    }
    var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
    var returnArr = [];
  
    //var date = new Date(number * 1000);
    var date = new Date(number);
    returnArr.push(date.getFullYear());
    returnArr.push(formatNumber(date.getMonth() + 1));
    returnArr.push(formatNumber(date.getDate()));
  
    returnArr.push(formatNumber(date.getHours()));
    returnArr.push(formatNumber(date.getMinutes()));
    returnArr.push(formatNumber(date.getSeconds()));
  
    for (var i in returnArr) {
      format = format.replace(formateArr[i], returnArr[i]);
    }
    return format;
  }  
  
  const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
  }
function a() {
    console.log('aa');
}

function b() {
    console.log('bb');
}

module.exports = {
    b,
    a,
    barcode:barc,
    qrcode: qrc,
    formatTime: formatTime
}