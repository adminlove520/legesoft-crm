import wepy from 'wepy'
export default class Home extends wepy.mixin {
    data = {
        login: false,
        showcheckuser: true,
        showcheckphone: true,
        userparams: null,
        userInfo: null,
        vipInfo: null,
        allCoupons: [], //所有可领取的优惠券
        uncouponnum: 0, //所有已领取未使用的优惠券
        showgift: false, //礼包弹框
        ConfirmButton: false, //弹框确定按钮
        getCouponarr: [],
        // 当前等级所需积分
        gradepoint: 2000,
        // 注册渠道编号
        registnum: '',
        marginHeight: 0
    }
    // 页面切换显示
    async onShow() {
        // if(this.vipInfo){
        //     // 获取卡券
        //     const couponres=await this.$parent.getcounon(0)
        //     console.log(couponres,'获取优惠券')
        //     if(!couponres.statu) return wepy.Toast('无可用优惠券','none')
        //     this.uncouponnum=this.$parent.globalData.uncouponnum
        //     this.$apply()
        // }
    }
    onHide() {
        console.log('离开');
        this.showgift=false
      }
    // 页面加载
    async onLoad(options) {
        // 登录wx
        let loginRes = await wepy.login().catch(err => err)
        console.log(loginRes,'wxlogin')
        this.$parent.globalData.code = loginRes.code
        console.log(this.$parent.globalData.code,'code')
        
        this.getLoginstatu()
        // // 动态修改我的福利图标的位置
        // const res = wx.getSystemInfoSync()
        // // console.log(res.windowHeight)
        // wx.createSelectorQuery().select('.weal_bd').boundingClientRect(rect=>{
        //   // console.log(rect)
        // this.marginHeight=100-(res.windowHeight-rect.bottom)
        // // console.log(this.marginHeight);
        //   this.$apply()
        //   }).exec()
          // 动态设置下拉字体
          wx.setBackgroundTextStyle({
            textStyle: 'dark' // 下拉背景字体、loading 图的样式为dark
          })
          wx.setBackgroundColor({
            backgroundColor: '#444444', // 窗口的背景色为白色
            backgroundColorBottom: '#ffffff', // 底部窗口的背景色为白色
          })
        
      }

    // 下拉刷新
    // onPullDownRefresh() {
    //     let _this = this
    //     this.getUser(this.cb(_this))
    // }

    // 发起登录拿到登录状态
  async getLoginstatu() {
    const statures = await this.$parent.checkLogin()
    console.log(statures, '登录状态')
    // statures.loginstatu=1/0,没有登录过或者过期
    if (statures.loginstatu !== true) {
      
      // 判断是否已授权用户信息
      const statures = await this.$parent.getSettingStatus('scope.userInfo')
      console.log(statures, '授权状态')
      // 没有授权过，需要点击授权
      if(statures.statu===1){
        console.log('点击授权用户信息');
        wepy.Toast('点击授权用户信息', 'none')
        return
      }
      // 拒绝授权过，需要点击授权
      if(statures.statu===2){
        console.log('点击授权用户信息')
        wepy.Toast('点击授权用户信息', 'none')
        return
      }
      // 授权过
      const userinfoRes = await wepy.getUserInfo().catch(err => err)
      console.log(userinfoRes,'获取用户信息');
      this.$parent.globalData.userInfo = userinfoRes.userInfo
      this.userInfo = userinfoRes.userInfo
      this.showcheckuser = false
      this.showcheckphone = true
      this.$apply()
      return
    }
    

    // this.$parent.globalData.vipInfo=vip
    // this.vipInfo=vip
    // 授权过
    // 判断是否已授权用户信息
    const settingstatures = await this.$parent.getSettingStatus('scope.userInfo')
    console.log(settingstatures, '授权状态')
    // 没有授权过，需要点击授权
    if(settingstatures.statu===1){
      console.log('点击授权用户信息');
      wepy.Toast('点击授权用户信息', 'none')
      return
    }
    // 拒绝授权过，需要点击授权
    if(settingstatures.statu===2){
      console.log('点击授权用户信息')
      wepy.Toast('点击授权用户信息', 'none')
      return
    }
    // 授权过用户信息
    const userinfoRes = await wepy.getUserInfo().catch(err => err)
    console.log(userinfoRes,'获取用户信息');
    this.$parent.globalData.userInfo = userinfoRes.userInfo
    this.userInfo = userinfoRes.userInfo

    // 缓存中获取数据
    var datames = wx.getStorageSync('datames')
    console.log(datames,'老用户登录');
    
    // 请求服务器获取vipinfo
    // 发起老用户登录
    let getparamres=await this.$parent.getVipInfo2(datames,this.userInfo)
    console.log(getparamres,'老用户登录结果')
    // 如果失败了
    if(!getparamres.statu){
      console.log(222);
      // that.cbparams(that)
      // return
      wepy.Toast('服务器无响应')
      return
    }
    // 赋值
    this.$parent.globalData.vipInfo=getparamres.t
    this.vipInfo=getparamres.t


    this.login=true
    this.showcheckuser = false
    this.showcheckphone = false
    this.$apply()
    // 获取卡券
	// const couponres=await this.$parent.getcounon(0)
	// console.log(couponres,'获取优惠券')
	// if(!couponres.statu) return wepy.Toast('无可用优惠券','none')
	// this.uncouponnum=this.$parent.globalData.uncouponnum
  //   this.$apply()
    // console.log('不是首次登录')
  }
    
    
    // 处理事件函数
    methods = {
        // 点击获取用户信息
    async getUserInfo(e) {
        // console.log(e, '点击授权用户信息')
        // 取消授权
        if (e.detail.errMsg != "getUserInfo:ok") {
          wepy.Toast('取消了授权用户信息', 'none')
          return
        }
        // // 同意授权用户信息-----手动校验手机号获取vip信息
        this.$parent.globalData.userInfo = e.detail.userInfo
        this.userInfo = e.detail.userInfo
        // this.userparams = e.detail
        this.showcheckuser = false
        // this.showcheckphone = true
        this.$apply()
      },
      // 点击获取手机号，并登录/注册
      async getPhoneNumber(e) {
        let that=this
        console.log(e)
        if (e.detail.errMsg !== "getPhoneNumber:ok") return wepy.Toast('取消了手机授权', 'none')
        // this.userparams=e.detail
        // 发起注册登录
        let getparamres=await this.$parent.getparam(e.detail,this.userInfo)
        console.log(getparamres,'getparam')
        // 如果失败了
        if(!getparamres.statu){
          console.log(222);
          // that.cbparams(that)
          // return
          wepy.Toast('服务器无响应')
          return
        }
        // 赋值
        this.$parent.globalData.vipInfo=getparamres.t
        this.vipInfo=getparamres.t
        // this.$apply()
        if(getparamres.t.rescode===0){
          console.log('已注册')
          this.login=true
              this.showcheckuser=false
          this.showcheckphone=false
          this.$apply()
          wepy.baseToast('登录成功')
        }
        if(getparamres.t.rescode===null){
          console.log('未注册')
          wepy.baseToast('注册成功')
          // 弹礼包框------------------
          this.showgift = true
          this.login=true
              this.showcheckuser=false
          this.showcheckphone=false
          this.$apply()
        }
        let datames={
          openid: getparamres.t.wxid,
          unionid: getparamres.t.unionid,
          userInfo: this.userInfo
        }
        // 存入本地缓存---------------------------
        wx.setStorageSync('datames', datames)
        
        this.$parent.globalData.openid=getparamres.t.wxid
        this.$parent.globalData.unionid=getparamres.t.unionid
        // 获取卡券
        //     const couponres=await this.$parent.getcounon(0)
        //     console.log(couponres,'获取优惠券')
        //     if(!couponres.statu) return wepy.Toast('无可用优惠券','none')
        // this.uncouponnum=this.$parent.globalData.uncouponnum
        // this.$apply()
      },
        // 前往会员信息
        toMyDetail() {


            if (!this.login) return wepy.Toast('请先登录')
            wepy.navigateTo({
                url: '/pages/other/mydetail'
            })
        },
        // 前往会员二维码信息
        toMyDetailVip(v) {
            // console.log(v);
            wepy.navigateTo({
                url: '/pages/other/mydetailVip?cardnum=' + this.vipInfo.cardnum
            })
        },
        // 前往我的优惠券
        toMyCoupon() {
            if (!this.login) return wepy.Toast('请先登录')
            wepy.navigateTo({
                url: '/packageA/pages/other/mycoupon'
            })
        },
        // 前往订单
        toOrder(e) {
            if (!this.login) return wepy.Toast('请先登录')
            wepy.navigateTo({
                url: '/packageB/pages/other/order?otype=' + e.currentTarget.id
            })
        },
        // 完善信息
        toInformation() {
            if (!this.login) return wepy.Toast('请先登录')
            wepy.navigateTo({
                url: '/packageB/pages/other/information'
            })
        },
    }
    // 计算函数
    computed = {

    }
}