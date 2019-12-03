import wepy from 'wepy'
import tool from '@/mixins/tool/tool'
export default class Home extends wepy.mixin {
    data = {
        headimg:'',
        vipname:'',
        sex:'',
        phone:'',
        cnsy:'',
        jbidname:'',
        card:'',
        cardnum:'',
        cardtime:''
    }
    // 页面切换显示
    onShow() {
    }
    // 页面加载
    async onLoad() {
        var vipInfo = this.$parent.globalData.vipInfo
        this.headimg=this.$parent.globalData.userInfo.avatarUrl
        this.vipname=vipInfo.vipname
        this.sex=this.$parent.globalData.userInfo.gender == 0 ? '女' : '男'
        this.phone=vipInfo.phone
        this.cnsy=tool.formatTime(vipInfo.csny, 'Y-M-D')
        this.jbidname=vipInfo.qpname
        this.card=vipInfo.vid
        this.cardnum=vipInfo.cardnum
        this.cardtime=tool.formatTime(vipInfo.createtime, 'Y-M-D')
        this.$apply()
        let params = {
            eid: this.$parent.globalData.vipInfo.eid,
            vip: this.$parent.globalData.vipInfo.vid
        }
        const { data: res } = await wepy.post('/myzone/tocustomform', params)
        console.log(res,'获取自定义表单')
        if(!res.statu) return wepy.Toast()
        this.vipname = res.t.vinfo.vipname
        this.phone = res.t.vinfo.phone
        this.cnsy = res.t.vinfo.csny
        this.sex=res.t.vinfo.sex==1?'男':'女'
        this.$apply()
    }
    // 页面初次渲染
    async onReady(){
        
    }
    // 处理事件函数
    methods = {

    }
    // 计算函数
    computed = {

    }
}