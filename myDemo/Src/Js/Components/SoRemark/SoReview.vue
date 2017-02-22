<template>
    <div>
        <a class="avatar-sm  pull-left"  href="#">
            <img :src="remarkdata.userPhotoUrl==null||remarkdata.userPhotoUrl==''?defaultPhoto:remarkdata.userPhotoUrl" class="img-circle">
        </a>
        <div class="comment-cont comment-data">
            <h5 class="user">
                <a href="">{{remarker.userName}}</a>
                <time>{{remarker.remarkDate}}</time>
            </h5>
            <ul>
                <li v-for="(node,index) in premarklist" v-if="premarklist" :style="'margin-left:'+offset*index+'px'">
                    <div class="retext">
                        <p><span>{{node.userName}}</span>{{node.text}}<span class="remarkd">{{node.remarkDate}}</span></p>
                    </div>
                </li>
            </ul>
            <p class="text">{{remarker.text}}</p>
            <div class="oper cl">
                <a class="comment-toggle p-replay" @click="remark"><span class="glyphicon glyphicon-comment"></span> 回复</a>
                <a class="comment-toggle p-replay" @click="deletereply"><span class="glyphicon glyphicon-trash"></span> 删除</a>
                <span class="oper-hide">
                    <span v-if="status">
                        <a href="" data-toggle="" @click="onPra" style="color:royalblue">
                            <span class="glyphicon glyphicon-thumbs-up"></span> 赞(<em>{{praise}}</em>)
                        </a>
                    </span>
                    <span v-else>
                        <a href="" data-toggle="" @click="onPra"  style="color:grey">
                            <span class="glyphicon glyphicon-thumbs-up"></span> 赞(<em>{{praise}}</em>)
                        </a>
                    </span>
                </span>
            </div>
            <div v-if="remarkshow">
                <replybox :content="content" :onreply="onreply"></replybox>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import replybox from './SoReplyBox.vue'
    import defaultPhoto from '../../../Img/RemarkDefault/Default.png'
    export default {
        data: function () {
            return {
                defaultPhoto:defaultPhoto,
                content: "",
                remarkshow: false,
                replyprefix: "",
                premarklist:[],
                offset:20,
                praise:this.remarkdata.praiseUsers.length,
                status:this.praiseFilter(),
                remarker:{}
            }
        },
        props: {
            user: Object,
            remarkdata: Object,
            ondeleteremark: Function,
            onaddremark: Function,
            onpraise:Function
        },
        created:function(){
            var remarks=eval(this.remarkdata.comments);
            var replyList=[];
            for(var i=0;i<remarks.length;i++){
                if(remarks.length==1){
                    this.remarker=remarks[0];
                }else {
                    if(i==0){
                        var tempComment={};
                        tempComment.userId=remarks[i].userId;
                        tempComment.userName="@"+remarks[i].userName+"：";
                        tempComment.text=remarks[i].text;
                        tempComment.remarkDate=remarks[i].remarkDate;
                        replyList.push(tempComment);
                    }else if(i==(remarks.length-1)){
                        this.remarker=remarks[i];
                    }else {
                        var tempComment={};
                        tempComment.userId=remarks[i].userId;
                        tempComment.userName=remarks[i].userName+"@"+remarks[i-1].userName+"：";
                        tempComment.text=remarks[i].text;
                        tempComment.remarkDate=remarks[i].remarkDate
                        replyList.push(tempComment);
                    }
                }
            }
            this.premarklist=replyList;
            this.replyprefix= "@" + this.remarker.userName + ":";
        },
        components: {
            replybox
        },
        methods: {
            //点击回复评论事件
            remark: function () {
                if(this.user.userId==this.remarkdata.remarkerId){
                    return;
                }
                this.content=this.replyprefix;
                this.remarkshow = !this.remarkshow;
            },
            //点赞事件
            onPra: function () {
                this.status = !this.status;
                if (this.status) {
                    ++this.praise;
                } else {
                    --this.praise;
                }
                this.onpraise&&this.onpraise({"id":this.remarkdata.id,"userId":this.user.userId,"praised":this.status});
            },
            //删除评论事件
            deletereply: function () {
                if(this.user.userId==this.remarkdata.remarkerId){
                    this.ondeleteremark&&this.ondeleteremark(this.remarkdata);
                }
            },
            //提交回复评论事件
            onreply: function (data) {
                var text = data.text.substring(this.replyprefix.length);
                var ptextlist={
                    userId:this.user.userId,
                    userName:this.user.userName,
                    text:text,
                    remarkDate:new Date().toLocaleString()
                };
                var remarks=eval(this.remarkdata.comments);
                remarks.push(ptextlist);
                var replydata = {
                    comments:JSON.stringify(remarks),
                    userId: this.user.userId,
                    userName: this.user.userName,
                    photoUrl:this.user.userPhotoUrl?this.user.userPhotoUrl:"",
                };
                this.onaddremark&&this.onaddremark(replydata);
                this.remarkshow = !this.remarkshow;
            },
            //判断是否已经点赞的方法
            praiseFilter:function () {
                var userPraises=this.remarkdata.praiseUsers;
                var tempBool=false;
                for(var i=0;i<userPraises.length;i++){
                    if(userPraises[i].userId==this.user.userId){
                        tempBool=true;
                        break;
                    }
                }
                return tempBool;
            }
        }
    }
</script>