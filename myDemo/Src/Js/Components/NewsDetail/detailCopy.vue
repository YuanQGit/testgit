<template>
    <!--左边的包括上下两部分：上面是一个table的表格，下面是一个tabs-->
    <div id="left" class="col-md-9" style="height: 100%;">
        <div class="basicinfo">
            <div >
                <showarea  :data="data.showarea" :type="type"></showarea>
                <div class="showarea_slt">
                    <button type="button" class="btn btn-default" onclick="showPic">预览缩略图</button>
                    <button type="button" class="btn btn-default" onclick="downloadPic">下载缩略图</button>
                </div>
            </div>
        </div>
        <div>
            <tabs :data="data.tabs" :onTabClick="onTabClick" :onClick="onClick"></tabs>
        </div>
    </div>

    <!--右边的包括一部分：右边的详细信息栏（包括文本框和树形）-->
    <div id="right" class="col-md-3">
        <div class="basicdata">
            <div>
                <showinglist :totalTitle="totaltitle" :data="data.showinglist"
                                :count="count" :onLoadMore="onloadmore" :onItemClick="onItemClick" :onSelect="onSelect">
                </showinglist>

            </div>
        </div>
    </div>
</template>

<style>
    .basicinfo {
        padding: 15px 10px;
        border: 1px solid #ddd;
        margin-top: 20px;
        margin-bottom: 20px;
        margin-left: 10px;
        margin-right: 10px;
    }
    
    .basicdata {
        margin-top: 20px;
    }
    .showarea_slt{
        margin-left: 870px;
    }
</style>

<script>
    import showarea from '../ShowArea/showarea.vue';
    import tabs from '../Tabs/Tabs.vue';
    import showinglist from '../ShowingList/showinglist.vue';
    export default {
        props: {
            data: Object,
            totaltitle: String,
            count: Number,
            type: String,

            onloadmorelist: Function,
            onitemclick: Function,
            ongetdata: Function,
            onselect: Function,
            ontabclick:Function,
            onclick:Function
        },
        methods: {
            onloadmore: function(index) {
                this.data = this.onloadmorelist(index);
                return this.data.showinglist;
            },
            onItemClick: function(content) {
                this.onitemclick && this.onitemclick(content);

            },
            onSelect: function(node) {
                this.onselect(node);
            },
            onTabClick:function (title) {
                this.ontabclick(title);
            },
            onClick:function (title) {
                this.onclick(title);
            }

        },
        components: {
            showarea,
            tabs,
            showinglist
        }
    }
</script>