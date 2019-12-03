import wepy from 'wepy'
import tool from '@/mixins/tool/tool'
import math from '@/mixins/tool/math'
import Toast from '@/assets/vant/toast/toast'
export default class Home extends wepy.mixin {
    data = {
        vipInfo: '',
        name: '',
        gender: '',
        showGender: false,
        genderPicker: ['男', '女'],
        phone: '',
        identity: '',
        birDate: '',
        region: ["湖北省", "武汉市", "江汉区"],
        postcode: '',
        code: '',
        flagbtn:false,
        codeText:'获取验证码',
        codeCheck:'',
        // 自定义表单数据
        customData:[],
        // 获取的自定义表单
        oldCustomData:[],
        outdate:true
    }
    // 页面切换显示
    onShow() {
        // this.getGender()
    }
    // 页面加载
    onLoad() {
        this.vipInfo = this.$parent.globalData.vipInfo
        this.name = this.vipInfo.vipname
        this.phone = this.vipInfo.phone
        this.getGender()
        // this.getVipUser()
    }
    // 获取完善信息
    async getVipUser() {
        let params = {
            eid: this.vipInfo.eid,
            vid: this.vipInfo.vid
        }
        const { data: res } = await wepy.post('/myzone/tocustomform', params)
        // const { data: res } = await wepy.posttest('https://m.ligesoft.com/wx/wxsa/myzone/tocustomform', params)
        console.log(res);
        if(!res.statu) return wepy.Toast('获取完善信息失败')
        // 获取自定义字段指定参数
        res.rows.forEach(item=>{
            this.customData.push({
                fieldnum:item.fieldnum,
                fieldname:item.fieldname,
                fieldval:item.fieldval,
                oldfieldval:item.oldfieldval,
                valchange:item.valchange
            })
        })
        // this.customData=res.rows
        this.$apply()
    }
    getGender() {
        let gender = this.$parent.globalData.userInfo.gender
        if (gender === 1) {
            gender = '男'
        } else {
            gender = '女'
        }
        this.gender = gender
        this.birDate = tool.formatTime(this.vipInfo.csny, 'Y-M-D')
    }
    // 处理事件函数
    methods = {
        inputName(e) {
            this.name = e.detail.value
        },
        inputGender(e) {
            this.gender = e.detail.value
        },
        pinkerGenter(event) { //选中性别
            const { picker, value, index } = event.detail;
            // console.log(event.detail);
            this.gender = value
            this.showGender = false
        },
        onCancelGenter() { //关闭性别输入框
            this.showGender = false
        },
        showGender() { //点击性别
            this.showGender = true
        },
        inputPhone(e) {
            this.phone = e.detail.value
        },
        inpuTidentity(e) {
            this.identity = e.detail.value
        },
        bindBirthdayChange(e) {
            this.birDate = e.detail.value
        },
        // bindCustomDataChange: function (e) {
        //     // console.log(e.detail.value);
        //     // this.region = e.detail.value
        // },
        inputCode(e) {
            this.code = e.detail.value
        },
        // 改变自定义表单值  表单值e.detail.value  指定表单e.target.id
        customDataItem(e){
            // console.log(this.customData[e.target.id]);
            this.customData[e.target.id].fieldval=e.detail.value
        },
        // 获取验证码
        getCode() {
            this.flagbtn=true
            // console.log('获取验证码');
            let phone=this.phone
            // 校验手机号
            if(!phone || !(/^1[34578]\d{9}$/.test(phone))){
                wepy.baseToast('请认真填写手机号')
                return
            }
            // 倒计时
            this.codeText=10
            let stop=setInterval(()=>{
                if(this.codeText<=1){
                    this.codeText='获取验证码'
                    this.$apply()
                    clearInterval(stop)
                    return
                }
                this.codeText=this.codeText-1
                this.$apply()
            },1000)
            // 模拟发验证码
            let mathNum = math.randomNum(1000, 9000)
            // console.log(mathNum);
            setTimeout(() => {
                wepy.baseToast(String(mathNum))
                this.code = mathNum
                this.codeCheck=mathNum
                this.$apply()
            }, 500)
        },
        // 提交表单
        async subMessUser() {
            // 校验验证码
            // if(!this.code) return wepy.baseToast('验证码不能为空')
            // if(this.codeCheck!=this.code) return wepy.baseToast('验证码错误')
            // 获取固定表单
            let flag = true
            let userForm = {
                name: this.name,
                gender: this.gender=='男' ? 0 : 1,
                phone: this.phone,
                birDate: this.birDate
            }
            // console.log(userForm);
            // 校验是否未填信息
            Object.keys(userForm).forEach(k=>{
                if(userForm[k]===''){
                    // console.log(k,userForm[k],1);
                    
                    flag=false
                }
            })
            // this.customData.forEach(item=>{
            //     if(!item.fieldval){
            //         console.log(item,2);
            //         flag=false
            //     }
            // })
            if(!flag) return wepy.baseToast('信息不能为空')
            let params={
                eid:this.vipInfo.eid,
                vid:this.vipInfo.vid,
                phone:userForm.phone,
                sex:userForm.gender,
                csny:userForm.birDate,
                vipname:userForm.name
                // data:this.customData
            }
            // console.log(params);
            
            // // 测试
            let resflag=true
            if(!resflag) return wepy.baseToast('完善信息失败')
            // wepy.baseToast('该模块正在开发')
            wepy.baseToast('保存完毕')
            // 跳转到首页
            setTimeout(()=>{
                wepy.switchTab({
                    url:'/pages/tabs/home'
                })
            },1000)
        }
    }
    // 计算函数
    computed = {

    }
}