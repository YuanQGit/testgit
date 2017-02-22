<template>
    <div class="top" v-bind:style="style" v-if="!hidden">
        <div class="top_title">
            <h5>{{title}}</h5>
            <span ><img @click="imgClick" :src="refresh | getIcon" alt="#"/></span>
        </div>
        <div class="top_content" v-if="!hidden" >
            <table class="table table-hover" >
                <thead>
                    <tr>
                        <th style="width: 10%;">排名</th>
                        <th v-for="f in topdata.fields" v-if="f.title=='名称'" style="width:45%">{{f.title}}</th>
                        <th v-for="f in topdata.fields" v-if="f.title!='名称'">{{f.title}}</th>
                    </tr>
                </thead>
                <tbody>
                <tr v-if="data==null">
                    <td>没有任何数据</td>
                </tr>
                <tr v-for="(r,rindex) in topdata.records">
                    <td>
                        <span v-if="rindex<=2" class="ibx-hotTop-rank first">{{rindex+1}}</span>
                        <span v-else class="ibx-hotTop-rank bottom">{{rindex+1}}</span>
                    </td>
                    <td v-for="(f,findex) in topdata.fields">
                        <a @click="tdClick(urlContainer[findex][rindex])" v-if="f.url&&f.url!=''">{{r[f["name"]]}}</a>
                        <span v-else>{{r[f["name"]]}}</span>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>

</template>

<style scoped>
    body{
        font-family:"Microsoft YaHei";
        font-weight: normal;
    }


    .top .top_title{
        background-color: white;
        border-color: #e7eaec;
        border-image: none;
        border-style: solid solid none;
        border-width: 4px 0px 0;
        color: inherit;
        margin-bottom: 0;
        padding: 14px 15px 7px;
        min-height: 48px;
        border-bottom: solid 1px #E7EAEC;
    }

    .top .top_title h5{
        font-weight: 600;
        display: inline-block;
        font-size: 18px;
        margin: 0 0 7px;
        padding: 0;
        text-overflow: ellipsis;
        float: left;
    }
    .top .top_title a{
        display: block;
        margin-bottom: 5px;
    }

    .top .top_title img{
        display: block;
        float: right;
        text-align: center;
        margin: 0 auto;
        margin-right: 10px;
        margin-top:-10px;
        /*padding-bottom: 5px;*/
    }

    .top .top_content{
        padding: 10px;
        clear: both;
        background-color: white;
    }

    thead{
        vertical-align: middle;
    }

    table thead tr th{
        line-height: 1.42857;
        padding: 10px;
        vertical-align: middle;
        border-bottom: 2px solid #ddd;
        font-weight: bold;
        font-size: 15px;
    }

    table tbody{
        vertical-align: middle;
    }

    table tbody tr td{
        border-top: 1px solid #e7eaec;
        line-height: 1.42857;
        padding: 10px;
        vertical-align: middle;
    }

    .ibx-hotTop-rank {
        float: left;
        width: 16px;
        height: 16px;
        line-height: 16px;
        color: #fff;
        text-align: center;
        margin: 10px 10px;
        margin-left: 0;
        font-size: 12px;
    }

     tbody td .first {
        background-color: #f44528;
    }

     tbody td .bottom{
        background-color: #ff943e;
    }

    a hover{
        cursor: pointer;
    }


</style>
<script>
    import   analysis from "../../ComonJs/formatAnalysis"
    import   getIcon from  "../../ComonJs/formatIcon"
    export default {
        props: {
            id:{
                type:String,
                default:null
            },
            data: Object,
            title: String,
            class:{
                type:String,
                default:""
            },
            style:{
                type:String,
                default:""
            },
            hidden:{
                type:Boolean,
                default:false
            },
            ontdclick:Function,
            onrefresh:Function
        },
        data:function () {
            return{
                urlContainer:[],
                refresh:"refresh",
                topdata:''
            }
        },
        mounted:function () {
            //如何只有一行数据可以跳转的时候
            this.topdata=this.data;
            console.log(this.topdata);

            if(this.data!=null){
                var field=this.data.fields;
                for(var i=0;i<this.data.fields.length;i++){
                    if(field[i].url&&field[i].url!="") {
                        var record = [];
                        for (var j = 0; j < this.data.records.length; j++) {
                            var key = [{"field": "id"}]
                            var value = this.data.records[j]
                            var test = analysis(key, value, field[i].url);
                            record[j] = test;
                            this.urlContainer.push(record);
                        }
                        this.urlContainer[i]=record;
                        record = [];
                    }
                }
            }
        },
        methods: {
            tdClick:function (url) {
                this.ontdclick&&this.ontdclick(soModels.getReturnModel(this.id,url));
            },
            imgClick: function () {
                if(this.onrefresh){
                    this.data=this.onrefresh(soModels.getReturnModel(this.id,""));
                    console.log(this.data)
                }
            }
        },
        filters:{
            getIcon: function (str) {
                return getIcon(str);
            }
        }
    }
</script>