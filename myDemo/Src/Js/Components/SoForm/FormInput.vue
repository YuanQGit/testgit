<template>
    <div>
        <!--日期-->
        <template v-if="data.uitype.toLowerCase()==type_menu.date">
            <label v-bind:for="inputid" class="col-sm-1 control-label" v-html="data.title+':'"></label>
            <div class="col-sm-5">
                <datepic
                        v-model="inputText"
                        type="date"
                        placeholder="选择日期">
                </datepic>
                <!--<input type="date" class="form-control" v-bind:id="inputid" v-model="inputText">-->
            </div>
        </template>

        <!--日期时间-->
        <template v-if="data.uitype.toLowerCase()==type_menu.datetime">
            <label v-bind:for="inputid" class="col-sm-1 control-label" v-html="data.title+':'"></label>
            <div class="col-sm-5">
                <datepic
                        v-model="inputText"
                        type="datetime"
                        placeholder="选择日期时间">
                </datepic>
                <!--<input type="datetime-local" class="form-control" v-bind:id="inputid" v-model="inputText">-->
            </div>
        </template>

        <!--Label-->
        <template v-if="data.uitype.toLowerCase()==type_menu.lable">
            <label v-bind:for="inputid" class="col-sm-1 control-label" v-html="data.title+':'"></label>
            <div class="col-sm-5">
                <input type="text" class="form-control" v-bind:id="inputid" v-model="inputText"
                       v-bind:value="data.value" disabled>
            </div>
        </template>

        <!--下拉框-->
        <template v-if="data.uitype.toLowerCase()==type_menu.dropdown">
            <label v-bind:for="inputid" class="col-sm-1 control-label" v-html="data.title+':'"></label>
            <div class="col-sm-5">
                <el-select v-model="inputText" filterable clearable placeholder="请选择">
                    <el-option
                            v-for="item in data.items"
                            :label="item.text"
                            :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </template>

        <!--文本框-->
        <template v-if="data.uitype.toLowerCase()==type_menu.text">
            <div v-bind:class="inputClass">
                <label v-bind:for="inputid" class="col-sm-1 control-label" v-html="data.title+':'"></label>
                <div class="col-sm-5">
                    <input type="text" class="form-control" v-bind:id="inputid" v-model="inputText" @blur="InputBlur">
                    <template v-if="showOk">
                        <span class="glyphicon glyphicon-ok form-control-feedback"></span>
                    </template>
                    <template v-if="showError">
                        <span class="glyphicon glyphicon-remove form-control-feedback"></span>
                        <span style="color:#a94442" v-html="errorStr"></span>
                    </template>
                </div>
            </div>
        </template>

        <!--文本域-->
        <template v-if="data.uitype.toLowerCase()==type_menu.textarea">
            <div v-bind:class="inputClass">
                <label v-bind:for="inputid" class="col-sm-1 control-label" v-html="data.title+':'"></label>
                <div class="col-sm-5">
                <textarea class="form-control" v-bind:id="inputid" rows="2" v-model="inputText" @blur="InputBlur">
                </textarea>
                    <template v-if="showOk">
                        <span class="glyphicon glyphicon-ok form-control-feedback"></span>
                    </template>
                    <template v-if="showError">
                        <span class="glyphicon glyphicon-remove form-control-feedback"></span>
                        <span style="color:#a94442" v-html="errorStr"></span>
                    </template>
                </div>
            </div>
        </template>

         <!--数组编辑框-->
        <template v-if="data.uitype.toLowerCase()==type_menu.tageditor">
          <label v-bind:for="inputid" class="col-sm-1 control-label" v-html="data.title+':'"></label>
            <div class="col-sm-5">
               <tag-editor></tag-editor>
            </div>
        </template>
    </div>
</template>
<script>

    import {DatePicker, Select, Option} from 'element-ui'
    import tagEditor from '../SoTagEditor/SoTagEditor.vue'
    import 'element-ui/lib/theme-default/index.css'
    export default{
        props: {
            data: Object
        },
        data: function () {
            return {
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                title:this.data.title,
                isok: !(this.data.required),//判断组件是否通过验证，required为false,isok为true
                showOk: false,
                showError: false,
                inputClass: {
                    'has-feedback': true,
                    'has-error': false,
                    'has-success': false
                },
                name: this.data.name,
                inputText: "",
                errorStr: "",
                inputid: this.data.uitype + '-' + this.GetId(),
                type_menu: {
                    lable: "label",
                    text: "text",
                    textarea: "textarea",
                    date: "date",
                    datetime: "datetime",
                    dropdown: "dropdown",
                    tageditor:"tageditor"
                }
            }
        },
        methods: {
            InputBlur: function () {
                // 非空判断——>正则判断——>长度判断
                var nullTest = true;
                var lenthTest = true;
                var regTest = true;
                if (this.data.required == true && !this.inputText.trim())
                    nullTest = false;

                if (this.data.maxLength) {
                    lenthTest = this.TestLenth();
                }

                if (this.data.regexp) {
                    regTest = this.TestReg();
                }
                if (nullTest == false) {
                    this.ShowError('此项不能为空！')
                    return;
                }
                if (regTest == false) {
                    this.ShowError('不符合验证要求！')
                    return;
                }

                if (lenthTest == false) {
                    this.ShowError('字数超过要求！')
                    return;
                }
                this.ShowOk();
            },
            ShowError: function (str) {
                this.inputClass['has-error'] = true;
                this.inputClass['has-success'] = false;
                this.showError = true;
                this.showOk = false;
                this.isok=false;
                this.errorStr = '*  ' + str + '*';
            },
            ShowOk: function () {
                this.inputClass['has-error'] = false;
                this.inputClass['has-success'] = true;
                this.showError = false;
                this.errorStr = "";
                this.showOk = true;
                this.isok=true;
            },
            GetId: function () {
                var guid = "";
                for (var i = 1; i <= 32; i++) {
                    var n = Math.floor(Math.random() * 16.0).toString(16);
                    guid += n;
                    if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
                        guid += "-";
                }
                return guid;
            },

            TestLenth: function () {
                if (this.inputText.trim().length > this.data.maxLength)
                    return false;
                else
                    return true;
            },

            TestReg: function () {
                var reg = eval(this.data.regexp);
                return reg.test(this.inputText.trim());
            }
        },
        components: {
            "datepic": DatePicker,
            "el-select": Select,
            "el-option": Option,
            "tag-editor":tagEditor,
        }
    }

</script>

<style scoped>
    .control-label {
        padding-right: 0;
        margin-left: 0px;
    }

    .control-label {
        padding-left: 0;
        font-size: 14px;
        line-height: 1.75;
        margin-bottom: 1em;
    }

    textarea {
        resize: none;
    }

</style>