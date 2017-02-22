<template>
    <div>
        <div v-if="isForm">
            <template v-for="item in formModel">
                <soform :data="item" :style="style" ref="soform"></soform>
            </template>
        </div>
        <!--<form id="form1" enctype="multipart/form-data">-->
        <div class="panel panel-default" :style="style">
            <div class="panel-body">
                <!--action="http://192.168.1.152:8077/API/SubmissionService/Upload" 田泽玉-->
                <!--action="http://192.168.1.152:8089/API/Submission/Upload" 汪敏-->
                <el-upload
                        :action="uploadapi"
                        type="drag"
                        :multiple="true"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :on-success="handleSuccess"
                        :on-error="handleError"
                        :default-file-list="fileList">
                    <i class="el-icon-upload"></i>
                    <div class="el-dragger__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">文件大小不能超过100M</div>
                </el-upload>
                <div class="submitList">
                    <button class="btn btn-info" @click="Submit()">提交</button>
                    <button class="btn btn-warning disabled" @click="Update">修改</button>
                    <button class="btn btn-danger disabled" @click="Delete">删除</button>
                </div>
            </div>
        </div>
        <!--</form>-->
        <div style="height: 100px">
        </div>
    </div>
</template>
<script>
    import soform from '../SoForm/SoForm.vue'
    import {Upload} from 'element-ui'
    import 'element-ui/lib/theme-default/index.css'
    export default {
        props: {
            uploadapi: String,
            style: String,
        },
        components: {
            "soform": soform,
            "el-upload": Upload
        },
        mounted: function () {
            this.GetDataMeta();
        },
        data: function () {
            return {
                isForm: false,
                formModel: [
                    {
                        "groupNam": "testform",
                        "groupTitle": "测试表单",
                        "fields": [
//                            {
//                                "type": "label",
//                                "name": "Author",
//                                "title": "标签",
//                                "maxLength": "50",
//                                "regExp": "xxx",
//                                "required": true,
//                                "value": "这是一个Label",
//                                "options": []
//                            }
                        ]
                    }
                ],
                fileList: [],
                subnum: 1,
                param: {
                    action: "",
                    naturekey: "",
                    fileIDs: [],
                    formList: []
                }
            }
        },
        methods: {
            handleSuccess(result){
                debugger
                let data = JSON.parse(result);
                this.param.fileIDs.push(data.fileID);
            },
            handleError(result){
                alert('提交失败')
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
//            Upload: function () {
//                alert("确定上传吗？")
//                var _this=this;
//                var data = new FormData();
//                var files = $("#fileUpload").get(0).files;
//                if (files.length > 0) {
//                    for (var i = 0; i < files.length; i++) {
//                        data.append(i.toString(), files[i]);
//                    }
//                }
//                else{
//                    alert("请选择文件")
//                }
//                $.ajax({
//                    type: "post",
//                    url: "http://192.168.1.152:8077/API/SubmissionService/Upload",
//                    contentType: false,
//                    cache: false,
//                    currentType: false,
//                    processData: false,
//                    data: data,
//                    success: function (result) {
//                        debugger;
//                        alert(1);
//                       var data=  JSON.parse(result);
//                         _this.param.fileIDs.push(data.fileID);
//                       // _this.AddHtml();
//                    }
//                });
//            },
            Submit: function () {
                var r = confirm("确定提交吗？")
                if (r == true)
                    this.PostData("submit");
                else
                    return;
            },

            Delete: function () {
                if(this.param.naturekey!=""){
                   _this.PostData("delete");
                }
                else{
                    alert("请先提交表单！")
                } 
                
            },

            Update: function () {
                if(this.param.naturekey!=""){
                   _this.PostData("update");
                }
                else{
                    alert("请先提交表单！")
                } 
            },

            GetDataMeta: function () {
                debugger
                var _this = this;
                $.ajax({
                    url: "http://192.168.1.152:8077/API/SearchService/GetMetadataDefinition",
                    type: "post",
                    data: {},
                    success: function (result) {
                        for (var item in result) {
                            if (result[item].innertag == false) {
                                debugger
                                _this.formModel[0].fields.push(result[item]);
                            }
                        }
                        _this.isForm = true;
                    },
                    error: function (result) {
                        console.log(result);
                    }
                })
            },

            PostData: function (value) {
                var _this = this;
                this.param.action=value;
                var forms = _this.$refs.soform;
                var formData;
                for (let i = 0; i < forms.length; i++) {
                    debugger
                    formData = forms[i].getFormData();
                    for (let j = 0; j < formData.length; j++) {
                        if (formData[j].isok == false) {
                            alert('[' + formData[j].title + ']有错误！')
                            return;
                        }
                    }
                    _this.param.formList.push(forms[i].getFormData());
                }
                $.ajax({
                    type: "post",
                    url: "/Submit/Submited",
                    data: {param: JSON.stringify(this.param)},
                    success: function (result) {
                        var data=JSON.parse(result);
                        $(".submitList:button").removeClass("disabled");
                        _this.naturekey=data.naturekey;
                    },
                    error: function (result) {
                        console.log(result);
                    }
                });
            }
        }
    }
</script>
<style scoped>
    #uploadList {
        margin: 10px;
    }

    .subadd {
        margin-left: 15px;
    }

    /*这个属性要在实例页面设置 写在这里并没有什么卵用*/
    input[type=file] {
        display: none;
    }
</style>
