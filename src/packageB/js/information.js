import wepy from 'wepy'
import tool from '@/mixins/tool/tool'
import math from '@/mixins/tool/math'
export default class Home extends wepy.mixin {
    data = {
        userInfo: null,
        vipInfo: null,
        vipname: '',
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
        console.log(111);
        this.userInfo = this.$parent.globalData.userInfo
        this.vipInfo = this.$parent.globalData.vipInfo
        // this.getGender()
        this.getVipUser()
    }
    // 获取完善信息
    async getVipUser() {
        let params = {
            eid: this.vipInfo.eid,
            vip: this.vipInfo.vid
        }
        const { data: res } = await wepy.post('/myzone/tocustomform', params)
        console.log(res)
        if(!res.statu){
            this.vipname=this.vipInfo.vipname
            this.phone=this.vipInfo.phone
            this.birDate=tool.formatTime(this.vipInfo.csny, 'Y-M-D')
            this.gender=this.vipInfo.sex==1?'男':'女'
            this.$apply()
            console.log('未设置自定义信息')
            wepy.Toast('无自定义信息')
            return
        }
        // 获取用户基本信息
        this.vipname = res.t.vinfo.vipname
        this.phone = res.t.vinfo.phone
        this.birDate = res.t.vinfo.csny
        this.gender=res.t.vinfo.sex==1?'男':'女'
        this.$apply()
        // 获取自定义字段指定参数
        res.t.list.forEach(item=>{
            // 可选值
            let optionvalarr=''
            // 已填值
            let valarr=''
            if(item.fieldtype=="input"){
                valarr=item.fieldval
            }
            if(item.fieldtype=="selector"){
                valarr=item.fieldval
                console.log(item,'selector');
                optionvalarr=[]
                optionvalarr=item.optionval.split(',')
            }
            if(item.fieldtype=="region"){
                console.log(item,'region');
                valarr=item.fieldval?item.fieldval.split(';'):[]
            }
            if(item.fieldtype=="time"){
                valarr=item.fieldval
            }
            if(item.fieldtype=="date"){
                valarr=item.fieldval
            }
            if(item.fieldtype=="checkbox"){
                valarr=item.fieldval?item.fieldval.split(';'):[]
                // let oldarr=['游泳','唱歌']
                let oldarr=item.fieldval?item.fieldval.split(';'):[]
                console.log(item,'checkbox');
                optionvalarr=[]
                item.optionval.split(',').forEach((item,index)=>{
                    optionvalarr.push({
                        val: item,
                        checked: oldarr.some((item2)=>{
                            if(item2==item){
                                console.log(item2,item);
                                
                                return true
                            }
                        })
                    })
                })

                // valarr=item.fieldval?item.fieldval.split(','):[]
                // 老值
                // if(item.oldfieldval){
                //     valarr=item.oldfieldval.split(',')
                // }
                

                
            }

            this.customData.push({
                fieldtype: item.fieldtype,
                fieldnum:item.fieldnum,
                formid:item.formid,
                fieldname:item.fieldname,
                optionval:optionvalarr,
                val:valarr,
                // oldfieldval:item.oldfieldval,
                // valchange:2
            })
        })
        // this.customData=res.rows
        this.$apply()
    }
    // getGender() {
    //     let gender = this.userInfo.gender
    //     if (gender === 1) {
    //         gender = '男'
    //     } else {
    //         gender = '女'
    //     }
    //     this.gender = gender
    //     this.birDate = tool.formatTime(this.vipInfo.csny, 'Y-M-D')
    // }
    // 处理事件函数
    methods = {
        inputName(e) {
            this.vipname = e.detail.value
        },
        inputGender(event) {
            // const { picker, value, index } = event.detail;
            console.log(event.detail);
            let gender=''
            if (event.detail.value == 0) {
                gender = '男'
            } else {
                gender = '女'
            }
            this.gender = gender
        },
        pinkerGenter(event) { //选中性别
            
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
            console.log(e);
            
        },
        // 自定义
        //   下拉列表 fieldtype: "selector"
          bindselectorChange: function (e) {
            console.log(e.detail.value)
            let i=e.currentTarget.dataset.id
            this.customData[i].val=this.customData[i].optionval[e.detail.value] 
            this.$apply()  
          },
        bindcheckChange(e){
            console.log(e)
            let i=e.currentTarget.dataset.id
            this.customData[i].val=e.detail.value
            
            this.$apply() 
        },
        bindcheckChange2(e){
            console.log(e)
            let i=e.currentTarget.id
            let index=e.currentTarget.dataset.id
            // 当前选择的值
            console.log(this.customData[i].optionval[index]);
            this.customData[i].optionval[index].checked=!this.customData[i].optionval[index].checked
            
        },
        bindChange(e){
            console.log(e.detail.value)
            let i=e.currentTarget.dataset.id
            this.customData[i].val=e.detail.value
            this.$apply() 
        },
        
        inputCode(e) {
            this.code = e.detail.value
        },
        
        // 提交表单
        async subMessUser() {
            
            // 获取固定表单
            let flag = true
            let userForm = {
                name: this.vipname,
                gender: this.gender=='男' ? 1 : 0,
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
            // 校验自定义的字段required===1的是否为空
            this.customData.forEach(item=>{
                console.log(item,'校验');
                
                if(item.required==1&&item.val==null){
                    console.log(item,2);
                    flag=false
                }
            })
            if(!flag) return wepy.baseToast('信息不能为空')

            let data=[]
           
            let param={
                eid:this.vipInfo.eid,
                vid:this.vipInfo.vid,
                phone:this.phone,
                sex:this.gender=='男'?1:0,
                csny:this.birDate,
                vipname:this.vipname
            }
            data.push(param)
            
            this.customData.forEach(item=>{
                // 存自定义信息
                data.push({
                    eid:this.vipInfo.eid,
                    vid:this.vipInfo.vid,
                    fieldnum:item.fieldnum,
                    formid:item.formid,
                    fieldval:Array.isArray(item.val)?item.val.join(';'):item.val,
                    
                })
            })
            
            
            console.log(data,'保存的值');
            
            const { data: res } = await wepy.post('/myzone/savecustomform', data)
            console.log(res)
            if(!res.statu) return wepy.baseToast('完善信息失败')
            wepy.baseToast('保存完毕')
            // 跳转到首页
            setTimeout(()=>{
                wepy.switchTab({
                    url:'/pages/tabs/home'
                })
            },300)
        }
    }
    // 计算函数
    computed = {

    }
}