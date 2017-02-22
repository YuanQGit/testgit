<template>
    <div>
        <div class="media" v-for="item in data">
            <div class="media-heading">
                <h1>
                    <img v-bind:src="getIcon(item.format)"/>
                    <a href="#" @click="titleClick(item)" :title="item.title">
                        <span v-html="tempLated(item)"></span>
                    </a>
                </h1>
                <slot name="collect"></slot>
            </div>
            <div class="media-left">
                <img class="media-object" :src="item.imgStr" alt="..." v-if="item.imgStr!=''">
            </div>

            <div class="media-body">
                <h2 class="media-heading" v-if="item.source!=''">
                    <span style="color: green">来源:</span>
                    <span v-html="getHighLight(item.source)"></span>
                </h2>
                <h2 class="media-heading" v-if="item.source!=''">
                    <span style="color: green">作者:</span>
                    <span v-html="getHighLight(item.author)"></span>
                </h2>
                <h2 class="media-heading" v-if="item.source!=''">
                    <span style="color: green">创建日期:</span>
                    <span v-html="getHighLight(item.createDate)"></span>

                </h2>
                <h2 class="media-heading" v-if="item.source!=''">
                    <span style="color: green">摘要:</span>
                    <span v-html="getHighLight(item.summary )"></span>
                </h2>
            </div>
        </div>
    </div>
</template>
<script>
    import   GetIcon from  "../../ComonJs/formatIcon"
    import   high from "../../ComonJs/highLight"
    import   analysis from "../../ComonJs/formatAnalysis"
    export default {
        props: {
            data: {
                type: Array,
                default: []
            },
            highlight: Array,
            titletemplate: {
                type: String,
                default: ''
            },
            onclick: Function
        },
        data: function () {
            return {
                parentdata: ["title"]
            }
        },
        methods: {
            titleClick: function (value) {
                this.onclick && this.onclick(value);
            },
            getIcon: function (str) {
                return GetIcon(str);
            },

            getHighLight: function (str) {
                if (!this.highlight) return str;
                if (this.highlight.length == 0) return str;
                var ht = new high();
                ht.KeyWords = this.highlight;
                ht.Text = str;
                return ht.refreshContent("");
            },

            tempLated: function (item) {
                debugger
                var tempstr = item.title;
                if (this.titletemplate && this.titletemplate != ""){

                    tempstr = analysis(this.parentdata, item, this.titletemplate);
                }

                if (!this.highlight) return tempstr;
                if (this.highlight.length == 0) return tempstr;
                var ht = new high();
                ht.KeyWords = this.highlight;
                ht.Text = tempstr;
                return ht.refreshContent("");
            }
        },
    };
</script>

<style scoped>
    .media h1 {
        display: inline-block;
        font-size: 16px;
        margin: 0;
    }

    .media h1 a:link,
    .media h1 a:visited,
    .media h1 a:hover,
    .panel-body h2 {
        color: #1024ee;
    }

    .media h1 a,
    span.search,
    .media-body h2 a:hover {
        text-decoration: underline;
    }

    .media-heading a {
        font-family: '微软雅黑', arial, verdana, sans-serif;
        font-size: 14px;
    }

    a {
        cursor: pointer;
    }

    .media-object {
        width: 120px;
        height: 120px;
        margin-left: 18px;
    }

    .media-body h2,
    .noimg h3 {
        font-size: 14px;
        line-height: 21px;
    }

    .media-body {
        padding-left: 7px;
        padding-bottom: 20px;
    }

    .media-left {
        padding-left: 18px;
        padding-right: 10px;
    }
</style>