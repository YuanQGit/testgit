<!-- 表格分页组件 -->
<!--suppress ALL -->
<template>
    <div>
    <nav class="boot-nav">
        <ul  v-bind:class="classObj">
            <li v-if="firstShow">
                <a href="javascript:void(0)" aria-label="Previous" @click="onFirstClick">
                    <span aria-hidden="true">首页</span>
                </a>
            </li>
            <li v-if="firstShow">
                <a href="javascript:void(0)" aria-label="Next" @click="onPrevClick">
                    <span aria-hidden="true">上一页</span>
                </a>
            </li>
            <li v-for="page in pages" v-bind:class="activeNum === page ? 'active' : ''">
                <a href="javascript:void(0)" v-text="page" @click="onPageClick(page)"></a>
            </li>
            <li v-if="lastShow">
                <a href="javascript:void(0)" aria-label="Next" @click="onNextClick">
                    <span aria-hidden="true">下一页</span>
                </a>
            </li>
            <li v-if="lastShow">
                <a href="javascript:void(0)" aria-label="Next" @click="onLastClick">
                    <span aria-hidden="true">末页</span>
                </a>
            </li>
        </ul>
    </nav>
    </div>
</template>

<script>
    export default {
        props: {
            // 每页显示数据个数
            size: {
                type: Number,
                default: 10
            },
            // 数据总大小
            count: {
                type: Number,
                default: 1
            },
            // 显示分页标签个数
            pagenum: {
                type: Number,
                default: 10
            },
            //点击分页返回 当前页码
            onclick: Function,

            //分页组件大小    lg大尺寸，   sm小尺寸
            pagersize: {
                type: String,
                default: ""
            }
        },
        data: function() {
            let islast = this.count > this.size;
            var isLg = this.pagersize == "lg" ? true : false;
            var isSm = this.pagersize == "sm" ? true : false;
            return {
                activeNum: 1,
                pages: [],
                firstShow: false,
                lastShow: islast,
                maxPage: Math.ceil(this.count / this.size),
                classObj: {
                    'pagination': true,
                    'boot-page': true,
                    'pagination-lg': isLg,
                    'pagination-sm': isSm
                }
            }
        },

        methods: {
            // 点击页码刷新数据
            onPageClick: function(page) {
                this.activeNum = page;
            },

            // 上一页
            onPrevClick: function() {
                // 当前页是否为当前最小页码
                if (this.activeNum > 1) {
                    //this.activeNum = this.activeNum - 1
                    if (this.activeNum == this.pages[0]) {
                        this.pages = [];
                        for (var i = this.activeNum - this.pagenum; i < this.activeNum; i++) {
                            this.pages.push(i);
                        }
                    }
                    this.activeNum = this.activeNum - 1;
                }
            },

            // 下一页
            onNextClick: function() {
                // 当前页是否为当前最大页码
                if (this.activeNum < this.maxPage) {
                    if (this.activeNum == this.pages[this.pages.length - 1]) {
                        this.pages = [];
                        for (var i = this.activeNum + 1; i < this.activeNum + 1 + this.pagenum; i++) {
                            if (i <= this.maxPage)
                                this.pages.push(i);
                        }
                    }
                    this.activeNum = this.activeNum + 1;
                }
            },

            // 第一页
            onFirstClick: function() {
                if (this.pages[0] === 1) {
                    this.activeNum = 1;
                } else {
                    this.pages = [];

                    for (var i = 1; i <= this.pagenum; i++) {
                        this.pages.push(i);
                    }
                    this.activeNum = 1;
                }
            },

            // 最后一页
            onLastClick: function() {
                if (this.pages[this.pages.length - 1] == this.maxPage) {
                    this.activeNum = this.maxPage;
                } else {
                    var lastPage = [];
                    var num = this.maxPage % this.pagenum;
                    if (num == 0) num = this.pagenum;
                    for (num; num > 0; num--) {
                        lastPage.push(this.maxPage - num + 1);
                    }
                    this.pages = lastPage;
                    this.activeNum = this.maxPage;
                }
            },

            // 获取页码
            getPages: function() {
                this.maxPage = Math.ceil(this.count / this.size);
                this.lastShow = this.count > this.size;
                this.pages = [];
                // 比较总页码和显示页数
                if (this.maxPage <= this.pagenum) {
                    for (var i = 1; i <= this.maxPage; i++) {
                        this.pages.push(i);
                    }
                } else {
                    for (var i = 1; i <= this.pagenum; i++) {
                        this.pages.push(i);
                    }
                }
            },

            // 页码变化获取数据
            getData: function() {
                this.onclick && this.onclick(this.activeNum);
            }
        },
        mounted: function() {
            this.getPages();
        },

        watch: {
            // 监听显示数量
            'size': function() {
                this.getPages();
                if (this.activeNum + 1 > this.pages.length) {
                    this.activeNum = this.pages.length - 1;
                }
                this.getData();
            },

            'count': function() {
                this.getPages();
            },

            // 监测当前页变化
            'activeNum': function() {
                if (this.activeNum == 1)
                    this.firstShow = false;
                else
                    this.firstShow = true;

                if (this.activeNum == this.maxPage)
                    this.lastShow = false;
                else
                    this.lastShow = true;
                this.getData();
            }
        }
    }
</script>

<style scoped>
    .boot-select {
        float: right;
        width: 80px;
    }
    
    .boot-nav {
        float: left;
    }
    
    .boot-page {
        display: inline-block;
        vertical-align: middle;
    }
    
    .page-total {
        display: inline-block;
        vertical-align: middle;
    }
</style>