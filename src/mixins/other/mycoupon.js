import wepy from 'wepy'
export default class Home extends wepy.mixin {
    data = {
        // tab栏
        canuse: '',
        useed: '',
        unuse: '',
        btnTab:'canuse',
        coupons:'',
        // coupons:[1,2,3],
        nocoupon:'none',
        // nocoupon:'none',
        couponbox:'none',
        // couponbox:'block',
        couponbg:'couponbged',
        toDetail:true,
    }
    // 页面切换显示
    onShow() {
        this.changeBtn('canuse', this);
    }
    // 页面加载
    onLoad() {
        // console.log('mycoupon页加载');
    }
    // tab栏切换
    async changeBtn(btn, _this) {
        if (btn === 'canuse') {
            this.canuse = 'selected'
            this.useed=''
            this.unuse=''
            this.btnTab='canuse'
        } else if (btn === 'useed') {
            this.useed = 'selected'
            this.canuse=''
            this.unuse=''
            this.btnTab='useed'
        } else if (btn === 'unuse') {
            this.unuse = 'selected'
            this.canuse=''
            this.useed=''
            this.btnTab='unuse'
        }
        var types = 0;
        if (btn == 'useed') {
            types = 2;
        } else if (btn == 'unuse') {
            types = 3;
        }
        wx.showLoading({
            title: '加载中',
            mask: true
          })
        // 发请求
        let params={
            eid: this.$parent.globalData.vipInfo.eid,
            vipid: this.$parent.globalData.vipInfo.vid,
            ctype: types
          }
        const {data:res}=await wepy.post('/coupon/getmycoupon',params)
        console.log(res,'获取我的优惠券');
        if(res.statu){
            this.coupons=res.rows
            this.nocoupon='none'
            this.couponbox='block'
            this.$apply()
            if(types == 0){
                this.couponbg='couponbg'
                this.$apply()
            }else {
                this.couponbg='couponbged'
                this.$apply()
            }
        }else {
            this.nocoupon='block'
            this.couponbox='none'
            this.$apply()
        }
        
        wx.hideLoading();
    }
    // 处理事件函数
    methods = {
        // tab栏切换触发
        useBtnFun: function (e) {
            // console.log(e.currentTarget.id,666);
            this.changeBtn(e.currentTarget.id, this);
          },
        // 前往优惠券详情页
        couponDetail(e){
            if (this.data.toDetail){
                wx.setStorageSync('id', e.currentTarget.dataset.id)
                wx.setStorageSync('cid', e.currentTarget.dataset.cid)
                // console.log(e.currentTarget.dataset.id);
                wepy.navigateTo({
                  url: '/packageA/pages/other/coupondetail?id=' + e.currentTarget.dataset.id + '&cid=' + e.currentTarget.dataset.cid
                });
            }
        },
        // 前往优惠券领取
        tocoupon(){
            wepy.switchTab({
                url:'/pages/tabs/coupon'
            })
        }
    }
    // 计算函数
    computed = {

    }
}