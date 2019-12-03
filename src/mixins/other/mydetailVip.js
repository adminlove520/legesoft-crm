import wepy from 'wepy'
import tool from '@/mixins/tool/tool'
import QR from "@/mixins/tool/wxqrcode.js"
export default class Home extends wepy.mixin {
    data = {
        cardnum: '',
        qrcode: '',
        BARImgUrl: ''
    }
    // 页面切换显示
    onShow() {
    }
    // 页面加载
    async onLoad(options) {
      let that=this
        this.cardnum=options.cardnum
        this.$apply()
        //   生成条形码
      tool.barcode('barcode', options.cardnum, 750, 240)
      setTimeout(() => {
        // 利用插件生成二维码图片
        let qrcodeSize = that.getQRCodeSize()
        that.createQRCode(options.cardnum, qrcodeSize)
        // 获取画布的图像信息
        that.saveCanvas()
        wx.hideLoading()
      }, 500);
    }

     //适配不同屏幕大小的canvas
  getQRCodeSize() {
    var size = 0;
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 278; //不同屏幕下QRcode的适配比例；设计稿是750宽
      var width = res.windowWidth / scale;
      size = width;

    } catch (e) {
      // Do something when catch error
      // console.log("获取设备信息失败"+e);
    }
    return size;
  }

  createQRCode(text, size) {
    //调用插件中的draw方法，绘制二维码图片

    let that = this

    // console.log('QRcode: ', text, size)
    let _img = QR.createQrCodeImg(text, {
      size: parseInt(size)
    })
    that.qrcode = _img
    this.$apply()
  }
   // 获取条形码画布的图像信息
   saveCanvas() {
    wx.canvasToTempFilePath({
      canvasId: 'barcode',
      success: (res) => {
        this.BARImgUrl = res.tempFilePath
        this.$apply()
      },
      fail(res) {
        console.log(res);
      }
    })
  }
    // 处理事件函数
    methods = {

    }
    // 计算函数
    computed = {

    }
}