<template>
    <form id="" class="comment-form pos" onsubmit="return false">
        <textarea  class="comment-area" v-model="con" name="textarea"></textarea>
        <p class="comment-warn">还可以输入<span id="com-num">{{number}}</span>个字</p>
        <div class="mtm pos cl">
            <div class="sooilem-btn pull-left">
               <!-- <span class="glyphicon glyphicon-eye-open"></span>表情-->
            </div>
            <button id="p-comment" class="btn btn-primary pull-right" @click="onsubmit">评论</button>
            <span class="comment-tip f12  pull-right">评论促进思想交流</span>
        </div>
    </form>
</template>
<style>

</style>
<script>
    export default{
        data(){
            return {
                number:500,
                con:this.content

            }
        },
        props:{
            content:{
                type:String,
                default:""
            },

            onreply: Function,
        },
        mounted: function () {
            this.remainNum();
        },
        methods:{
            onsubmit:function(){
                var replydata={
                    text:this.con,
                    time:new Date()
                };
                this.onreply&&this.onreply(replydata);
                this.con="";
            },
            remainNum:function () {
                var length=this.con.length;
                this.number=(500-length);
            },
            limitword:function () {
                if(this.con.length>500){
                    this.con=this.con.substring(0,499);
                }
            },
        },
        watch:{
            'con':function () {
                this.remainNum();
                this.limitword();
            }
        }
    }
</script>