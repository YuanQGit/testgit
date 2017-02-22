<template>
    wyiadfeyofizadf
    <div class="panel panel-default base">
        <div class="panel-heading">
            <h1 class="panel-title" id="panel-title">{{totaltitle}}</h1>
        </div>
        <div class="panel-body ">
            <!--一级标题-->
            <div v-if="data.title&&data.title!=''&&data.title!='[]'">
                【
                    <span v-for="title in data.title">
                    <a href="#" @click="onclick($event)">{{title}}</a>
                    </span>
                】
            </div>
            <div v-for="(subtitle,index) in data.subtitle">
                <!--当为水平布局时-->
                <div  v-if="subtitle.type=='horizontal'">
                    <h2 v-if="subtitle.title!=''">{{subtitle.title}}</h2>
                    <a href="#" @click="onclick($event)" v-for="list in subtitle.content" v-if="subtitle.content!=''" class="horizontal">{{list}}</a>

                    <a href="#" :class='"moreHref_"+index' style="color:blue;" @click="getmore(index)" v-if="subtitle.isLoadMore=='true'">更多...</a>
                    <a href="#" :class='"lessHref_"+index' style="color:blue;display: none;" @click="hidemore(index)">收起</a>
                </div>

                <!--当为垂直布局时-->
                <div v-if="subtitle.type=='vertical'">
                    <h2 v-if="subtitle.title!=''">{{subtitle.title}}</h2>
                    <a href="#" @click="onclick($event)" v-for="list in subtitle.content" v-if="subtitle.content!=''" class="vertical">{{list}}</a>

                    <a href="#" :class='"moreHref_"+index' style="color:blue;" @click="getmore(index)" v-if="subtitle.isLoadMore=='true'">更多...</a>
                    <a href="#" :class='"lessHref_"+index' style="color:blue;display: none;" @click="hidemore(index)">收起</a>
                </div>

                <!--当为树时-->
                <div v-if="subtitle.type=='tree'">
                    <h2 v-if="subtitle.title!=''">{{subtitle.title}}</h2>
                    <tree :data="subtitle.content"
                          :onSelect="onSelect">
                    </tree>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .base {
        font-family: '微软雅黑', arial, verdana, sans-serif;
        font-size: 14px;
        color: #333;
        box-sizing: border-box;
    }
    
    .panel-default {
        width: 300px;
    }
    
    .panel-default .panel-heading {
        color: #333;
        background-color: #f5f5f5;
        border-color: #ddd;
    }
    
    .panel-heading {
        padding: 10px 15px;
        border-bottom: 1px solid transparent;
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
    }
    
    h1 {
        font-size: 16px;
        background-color: #f5f5f5;
    }
    
    .panel-body {
        padding: 15px;
        border-color: #ddd;
        border-bottom-left-radius: 3px;
        border-bottom-right-radius: 3px;
    }
    
    h2 {
        font-size: 14px;
        color: #1024EE;
        margin-top: 0px;
        margin-bottom: 0px;
    }
    
    a {
        cursor: pointer;
        color: #337ab7;
        text-decoration: none;
        background-color: transparent;
        display: inline-block;
        padding-right: 5px;
    }
    
    .subtitle {
        display: inline-block;
        margin-bottom: 10px;
    }
    
    .vertical {
        display: block;
    }
</style>
<script>
    import tree from '../Tree/tree.vue';
    export default {
        props: {
            totaltitle: {
                type: String,
                default: ""
            },
            count: {
                type: Number,
                default: 5,
            },
            data: Object,
            onloadmore: Function,
            onitemclick: Function,
            onselect: Function
        },
        data: function() {
            return {
                subtitle_content_copy: [],
            }
        },
        components: {
            tree
        },
        methods: {
            onclick: function(event) {
                var content = event.currentTarget.innerText
                this.onitemclick(content);
            },
            /*这个是当文本为text的时候，点击更多的时候加载出所有的内容*/
            getmore: function(index) {
                $('.moreHref_' + index).css("display", "none");
                $('.lessHref_' + index).css("display", "inline-block");
                if (!this.subtitle_content_copy[index]) {
                    this.subtitle_content_copy[index] = [];
                }
                if (this.subtitle_content_copy[index].length < this.data.subtitle[index].content.length) {
                    this.data = this.onloadmore(index);
                } else {
                    this.data.subtitle[index].content = this.subtitle_content_copy[index];
                }
            },
            /*这个是当文本为text的时候，点击收起的时候收起部分内容*/
            hidemore: function(index) {
                this.subtitle_content_copy[index] = this.data.subtitle[index].content;
                this.data.subtitle[index].content = this.data.subtitle[index].content.slice(0, this.count);
                $('.lessHref_' + index).css("display", "none");
                $('.moreHref_' + index).css("display", "inline-block");
            },

            onSelect: function(node) {
                this.onselect(node)
            }
        },
    }
</script>