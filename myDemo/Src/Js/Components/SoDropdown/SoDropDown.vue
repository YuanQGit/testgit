<template>
    <div class="dropdown">
        <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" role="button"
           aria-expanded="false"> {{listitle}}
            <span class="caret"></span></a>
        <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
            <li role="presentation" v-for="(item,index) in data">
                <a v-if="checkbox" v-on:click="checkClick(index)" v-on:click.stop>
                    <input type="checkbox" v-bind:value="index" v-model="checkeds[index]"/>
                    <span> {{item.text}} </span><span style="color:green"> {{item.count}}</span>
                </a>
                <a v-else v-on:click="textClick(index)">
                    {{item.text}}
                </a>
            </li>
            <template v-if="selectall">
                <li role="presentation" class="divider"></li>
                <li role="presentation" class="bottom-link">
                    <a role="menuitem" href="#" v-on:click=" filterAll">所有{{title}}</a>
                    <a role="menuitem" href="#" v-on:click="filterfun" v-show="checkbox">
                        <span class="glyphicon glyphicon-search"></span>搜索
                    </a>
                </li>
            </template>
        </ul>
    </div>
</template>
<script>
    export default {
        props: {
            filter: {
                type: String,
                default: ""
            },
            data: {
                type: Array,
                default: []
            },
            title: {
                type: String,
                default: ""
            },
            checkbox: {
                type: Boolean,
                default: true
            },
            selectall:{
                type: Boolean,
                default: true
            },
            onclick: Function
        },
        data: function () {
            var _this=this;
            var cks = [];
            for (var i = 0; i < this.data.length; i++) {
                //cks.$set(i, false);
                cks[i]=false;
            }
            return {
                checkeds: cks,
                listitle: this.title,
                filterstr: {
                    filter: this.filter,
                    data: []
                }
            }
        },
        methods: {
            //返回筛选条件
            filterBcak: function () {
                this.onclick && this.onclick(this.filterstr);
                this.filterstr = [];
            },
            initDrop: function () {
                this.listitle = this.title;
                for (var i = 0; i < this.data.length; i++) {
                    this.checkeds.$set(i, false);

                }
            },
            checkAllDrop: function () {
                this.listitle = "所有" + this.title;
                for (var i = 0; i < this.data.length; i++) {
                    this.checkeds.$set(i, true);
                }
            },
            //Text点击事件
            textClick: function (index) {
                this.listitle = this.data[index].text;
                var arrays = [];
                arrays.push({text: this.listitle, index: index});
                this.filterstr.data = arrays;
                this.filterBcak();
            },

            //设置checkbox的状态
            checkClick: function (index) {
                var ischek = this.checkeds[index] == true ? false : true;
                this.$set(this.checkeds,index, ischek);
            },
            //搜索所有
            filterAll: function () {
                this.checkAllDrop();
                var arrays = [];
                this.data.forEach(function (value, index) {
                    arrays.push({text: value.text, index: index});
                });
                this.filterstr.data = arrays;
                this.filterBcak();
            },
            //搜索
            filterfun: function () {
                var arrays = [];
                for (var i = 0; i < this.checkeds.length; i++) {
                    if (this.checkeds[i]) {
                        arrays.push({text: this.data[i].text, value: this.data[i].value, index: i});
                    }
                }
                this.filterstr.data = arrays;
                var n = arrays.length;
                if (n == 0) {
                    this.filterAll();
                    return;
                }
                else {
                    if (n == 1)
                        this.listitle = arrays[0].text;
                    else
                        this.listitle = "选中" + n + "个";
                }
                this.filterBcak();
            }
        }
    }
</script>

<style scoped>
    a {
        cursor: pointer;
    }

    input {
        cursor: pointer;
    }

    .dropdown {
        left: 20px;
    }

    .dropdown-toggle {
        color: #898989;
    }

    .dropdown .caret {
        color: #898989;
        margin: 0;
    }

    /* .bottom-link > a:nth-child(1) {
    display: inline-block;
    width: 57%;
} */
    .bottom-link > a > span {
        color: #ccc;
        padding: 2px;
    }

    .dropdown-menu .divider {
        height: 1px;
        margin: 5px 0;
        overflow: hidden;
        background-color: #e5e5e5;
    }

    /* .bottom-link > a:nth-child(2) {
    display: inline-block;
    width: 40%;
    padding: 3px 1px;
} */
</style>