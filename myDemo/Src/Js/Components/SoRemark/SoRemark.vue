<template>
    <div :id="id" :className="classname" :style="style" v-show="!hidden">
        <replybox :onreply="onreplys"></replybox>
        <ul class="list-inline">
            <li>
                <ul class="list-inline">
                    <li class="filter" v-if="filters" v-for='(filter,index) in filters' @click="onfilters(index)">
                        <span v-if="index!=0">|</span>
                        <a>{{filter.name}}</a>
                    </li>
                </ul>
            </li>
            <li class="com-total-num pull-right">总共<span class="com-num">{{count}}</span>条评论</li>
        </ul>
        <ul class="comment-main cl" id="com-list">
            <li class="item cl" v-for='node in data'>
                <review :user="user" :remarkdata="node" :ondeleteremark="deleteremark" :onaddremark="onaddremark"
                        :onpraise="onPraiseFn"></review>
            </li>
        </ul>
        <div class="loadmore" @click="onshowmore">
            <div v-if="showmoredata">
                <div class="text-center">点击加载更多精彩评论&nbsp<span class="glyphicon glyphicon-arrow-down"></span></div>
            </div>
            <div v-else>
                <div class="text-center">所有评论已加载完成</div>
            </div>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue';
    import review from './SoReview.vue';
    import replybox from './SoReplyBox.vue';
    export default{
        data(){
            return {
                filters: [{
                    name: "最新评论",
                    text: "Newest"
                }, {
                    name: "我的评论",
                    text: "My"
                }, {
                    name: "所有评论",
                    text: "All"
                }],
                filterOption: "All",
                pageindex: 0,
                showmoredata: true,
            }
        },
        props: {
            id:{
                type:String,
                default:null
            },
            classname:{
                type:String,
                default:"remark"
            },
            style:{
                type:String,
                default:"width:100%;height:100%"
            },
            hidden:{
                type:Boolean,
                default:false
            },
            data: Array,
            count: {
                type: Number,
                default: 0
            },
            user: Object,
            size: {
                type: Number,
                defulat:10
            },
            ondelete: Function,
            onreply: Function,
            onloadmore: Function,
            onpraise: Function,
            onfilter: Function
        },
        methods: {
            //过滤
            onfilters: function (index) {
                debugger;
                this.filterOption = this.filters[index].text;
                if(this.onfilter){
                    if(this.id==null){
                        this.onfilter(this.filterOption)
                    }else {
                        this.onfilter(soModels.getReturnModel(this.id,this.filterOption))
                    }
                }
                this.pageindex = 0;
                this.showmoredata = true;
            },
            //发表评论
            onreplys: function (data) {
                var comm=[{
                    userId: this.user.userId,
                    userName: this.user.userName,
                    text: data.text,
                    remarkDate:new Date().toLocaleString()
                }];
                var newreplydata = {
                    userId: this.user.userId,
                    photoUrl: this.user.userPhotoUrl ? this.user.userPhotoUrl : "",
                    comments:JSON.stringify(comm)
                };
                if(this.onreply){
                    if(this.id==null){
                        this.onreply(newreplydata)
                    }else {
                        this.onreply(soModels.getReturnModel(this.id,newreplydata))
                    }
                }
                this.pageindex = 0;
                this.showmoredata = true;
                this.filterOption = "All";
            },
            //删除评论
            deleteremark: function (data) {
                if(this.ondelete){
                    if(this.id==null){
                        this.ondelete(data)
                    }else {
                        this.ondelete(soModels.getReturnModel(this.id,data))
                    }
                }
                this.pageindex = 0;
                this.showmoredata = true;
                this.filterOption = "All";
            },
            //回复
            onaddremark: function (data) {
                if(this.onreply){
                    if(this.id==null){
                        this.onreply(data)
                    }else {
                        this.onreply(soModels.getReturnModel(this.id,data))
                    }
                }
                this.pageindex = 0;
                this.showmoredata = true;
                this.filterOption = "All";
            },
            //加载更多方法
            onshowmore: function () {
                this.pageindex = this.data.length;
                var loadprops = {
                    pager: {
                        pageSize: this.size,
                        pageIndex: this.pageindex
                    },
                    filterOption: this.filterOption
                }
                var showdata;
                if(this.onloadmore){
                    if(this.id==null){
                        showdata=this.onloadmore(loadprops)
                    }else {
                        showdata=this.onloadmore(soModels.getReturnModel(this.id,loadprops))
                    }
                }
                var moreData = [];
                if (showdata.length == 0) {
                    this.showmoredata = false;
                    return;
                }
                for (var j = 0; j < showdata.length; j++) {
                    moreData.push(showdata[j])
                }
                for (var i = 0; i < moreData.length; i++) {
                    this.data.push(moreData[i]);
                }
            },
            //点赞
            onPraiseFn: function (data) {
                if(this.onpraise){
                    if(this.id==null){
                        this.onpraise(data)
                    }else {
                        this.onpraise(soModels.getReturnModel(this.id,data))
                    }
                }
            }
        },
        components: {
            review, replybox
        },
    }
</script>

<style scoped>
    ul {
        margin-bottom: 0px;
    }

    span, h3 {
        color: dodgerblue;
        font-size: small;
    }

    .remarknumber {
        font-family: '微软雅黑', arial, verdana, sans-serif;
        font-size: large;
        margin-right: 5px;
    }

    li {
        color: #2aabd2;
    }

    .list-group-item {
        border: 0px !important;
    }

    .text-center {
        font-family: '微软雅黑', arial, verdana, sans-serif;
        color: darkgray;
    }

    .loadmore {
        margin-top: 50px;
        margin-bottom: 20px;
        height: 40px;
        background-color: gainsboro;
        padding-top: 12px;
        cursor: pointer;
    }

    .loadmore:hover {
        background: #b9def0;
    }

    .filter {
        cursor: pointer;
    }

    .glyphicon-arrow-down {
        color: #9d9d9d;
    }

    hr {
        margin-top: 0px;
        margin-bottom: 0px;
    }

    .top {
        margin-bottom: -5px;
        position: relative;
        top: -3px;

    }

    .list-group-item {
        padding: 0px;

    }

    .topline {
        margin-bottom: 15px;
    }
</style>