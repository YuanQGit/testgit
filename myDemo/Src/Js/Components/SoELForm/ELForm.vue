<template>
    <el-tabs type="border-card" v-loading.body=true>
        <el-tab-pane label="用户管理">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item :label="text" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item :label="text" prop="region">
                <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="活动时间" required>
                <el-col :span="11">
                    <el-form-item prop="date1">
                        <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1"
                                        style="width: 100%;"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="11">
                    <el-form-item prop="date2">
                        <el-time-picker type="fixed-time" placeholder="选择时间" v-model="ruleForm.date2"
                                        style="width: 100%;"></el-time-picker>
                    </el-form-item>
                </el-col>
            </el-form-item>
            <el-form-item label="即时配送" prop="delivery">
                <el-switch on-text="" off-text="" v-model="ruleForm.delivery"></el-switch>
            </el-form-item>
            <el-form-item label="活动性质" prop="type">
                <el-checkbox-group v-model="ruleForm.type">
                    <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
                    <el-checkbox label="地推活动" name="type"></el-checkbox>
                    <el-checkbox label="线下主题活动" name="type"></el-checkbox>
                    <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="特殊资源" prop="resource">
                <el-radio-group v-model="ruleForm.resource">
                    <el-radio label="线上品牌商赞助"></el-radio>
                    <el-radio label="线下场地免费"></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="活动形式" prop="desc">
                <el-input type="textarea" v-model="ruleForm.desc"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSubmit">立即创建</el-button>
                <el-button @click="handleReset">重置</el-button>
            </el-form-item>
        </el-form>
        </el-tab-pane>
        <el-tab-pane label="配置管理"><i class="el-icon-upload2"></i></el-tab-pane>
        <el-tab-pane label="角色管理">角色管理</el-tab-pane>
        <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
    </el-tabs>

</template>

<script>
    import  element from 'element-ui'
    import 'element-ui/lib/theme-default/index.css'
    export default{
        props:{
            text:String
        },
        data() {
            return {
                ruleForm: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                rules: {
                    name: [
                        {required: true, message: '请输入活动名称', trigger: 'blur'},
                        {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
                    ],
                    region: [
                        {required: true, message: '请选择活动区域', trigger: 'change'}
                    ],
                    date1: [
                        {type: 'date', required: true, message: '请选择日期', trigger: 'change'}
                    ],
                    date2: [
                        {type: 'date', required: true, message: '请选择时间', trigger: 'change'}
                    ],
                    type: [
                        {type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change'}
                    ],
                    resource: [
                        {required: true, message: '请选择活动资源', trigger: 'change'}
                    ],
                    desc: [
                        {required: true, message: '请填写活动形式', trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            handleReset() {
                this.$refs.ruleForm.resetFields();
            },
            handleSubmit(ev) {
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        alert('submit!');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        },

        components: {
            "el-button": element.Button,
            "el-form":element.Form,
            "el-form-item":element.FormItem,
            "el-input":element.Input,
            "el-select":element.Select,
            "el-option":element.Option,
            "el-col":element.Col,
            "el-date-picker":element.DatePicker,
            "el-time-picker":element.TimePicker,
            "el-switch":element.Switch,
            "el-checkbox-group":element.CheckboxGroup,
            "el-checkbox":element.Checkbox,
            "el-radio-group":element.RadioGroup,
            "el-radio":element.Radio,
            "el-tabs":element.Tabs,
            "el-tab-pane":element.TabPane
        }
    }
</script>