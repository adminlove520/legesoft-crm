var window = wx.getSystemInfoSync();
var left = 900 - window.windowWidth;
import wepy from 'wepy'
export default class Home extends wepy.mixin {
    data = {
        moveStyle: 'width:' + (900 + left) + 'px;margin-left:-' + left + 'px;',
        mrx: left,
        otype0:'',
        otype1:'',
        otype2:'',
        otype3:'',
        otype4:'',
        otype5:'',
        otype6:'',
        otype7:'',
        otype8:'',
        orders:'',
        orderbox:'',
        noorder:''
    }
    // 页面切换显示
    onShow() {

    }
    // 页面加载
    onLoad(options) {
        // console.log(options);
        this.changeBtn(options.otype, this);
    }
    // tab栏切换
    async changeBtn(btn, _this) {
        var statue = parseInt(btn[btn.length - 1])
        if(btn==='otype0'){
            this.otype0='selected'
            this.otype1=''
            this.otype2=''
            this.otype3=''
            this.otype4=''
            this.otype5=''
            this.otype6=''
            this.otype7=''
            this.otype8=''
        }else if(btn==='otype1'){
            this.otype0=''
            this.otype1='selected'
            this.otype2=''
            this.otype3=''
            this.otype4=''
            this.otype5=''
            this.otype6=''
            this.otype7=''
            this.otype8=''
        }else if(btn==='otype2'){
            this.otype0=''
            this.otype1=''
            this.otype2='selected'
            this.otype3=''
            this.otype4=''
            this.otype5=''
            this.otype6=''
            this.otype7=''
            this.otype8=''
        }else if(btn==='otype3'){
            this.otype0=''
            this.otype1=''
            this.otype2=''
            this.otype3='selected'
            this.otype4=''
            this.otype5=''
            this.otype6=''
            this.otype7=''
            this.otype8=''
        }else if(btn==='otype4'){
            this.otype0=''
            this.otype1=''
            this.otype2=''
            this.otype3=''
            this.otype4='selected'
            this.otype5=''
            this.otype6=''
            this.otype7=''
            this.otype8=''
        }else if(btn==='otype5'){
            this.otype0=''
            this.otype1=''
            this.otype2=''
            this.otype3=''
            this.otype4=''
            this.otype5='selected'
            this.otype6=''
            this.otype7=''
            this.otype8=''
        }else if(btn==='otype6'){
            this.otype0=''
            this.otype1=''
            this.otype2=''
            this.otype3=''
            this.otype4=''
            this.otype5=''
            this.otype6='selected'
            this.otype7=''
            this.otype8=''
        }else if(btn==='otype7'){
            this.otype0=''
            this.otype1=''
            this.otype2=''
            this.otype3=''
            this.otype4=''
            this.otype5=''
            this.otype6=''
            this.otype7='selected'
            this.otype8=''
        }else if(btn==='otype8'){
            this.otype0=''
            this.otype1=''
            this.otype2=''
            this.otype3=''
            this.otype4=''
            this.otype5=''
            this.otype6=''
            this.otype7=''
            this.otype8='selected'
        }
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        let params={
            vipid: this.$parent.globalData.vipInfo.vid,
            statue: statue
          }
        const {data : res}=await wepy.post('/order/getlist',params)
        // console.log(res);
        if(!this.data.status){
            this.orderbox='none',
            this.noorder='block'
            this.$apply()
            wx.hideLoading()
            return
        }
        this.orders=res.t
        this.orderbox='block'
        this.norder='none'
        this.$apply()
    }
    // 处理事件函数
    methods = {
        useBtnFun: function (e) {
            this.changeBtn(e.currentTarget.id, this);
          }
    }
    // 计算函数
    computed = {

    }
}