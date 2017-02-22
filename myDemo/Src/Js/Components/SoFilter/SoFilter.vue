<template>
    <div>
    <div class="filter-head">
        <span>{{tip}} </span>
        <div class="pull-right" style="cursor: pointer;" @click="showList">
            <span class="glyphicon glyphicon-filter"></span>筛选
        </div>
    </div>
    <div class="filter-filtrate">
        <span style="font-weight: bold; color: #3385ff;">{{title}}</span>
        <template v-for="item in data">
            <sodropdown class="filter-dropdown"  :data="item.droplist"
                        :filter="item.filter"  :title="item.title"
                        :checkbox="item.checkbox" :onclick="txtclick" ref="sodropdown">
            </sodropdown>
        </template>
        <div class="pull-right" style="cursor: pointer" @click="hideList">
            <span v-bind:class="{ 'glyphicon glyphicon-chevron-up': isup, 'glyphicon glyphicon-remove':isdel }"> </span>
            {{clickTitle}}
        </div>
    </div>
    </div>
</template>
<script>
    import sodropdown from  '../SoDropdown/SoDropDown.vue';
    export default {
        data: function () {
            return {
                isup: true,
                isdel: false,
                clickTitle: "收起",
            }
        },
        mounted: function () {
            $(".filter-filtrate").hide();
        },
        props: {
            data: Array,
            tip: String,
            title: {
                type: String,
                default: "筛选条件"
            },
            onclean: Function,
            onclick: Function
        },

        methods: {
            txtclick: function (value) {
                this.isup = false;
                this.isdel = true;
                this.clickTitle = "清除";
                this.onclick && this.onclick(value);
            },
            showList: function () {
                $(".filter-head").hide(500);
                $(".filter-filtrate").show(500);
                this.isup = true;
            },

            hideList: function () {
                if (this.isup == true) {
                    $(".filter-head").show(500);
                    $(".filter-filtrate").hide(500);
                } else {
                    this.isup = true;
                    this.isdel = false;
                    this.clickTitle = "收起";
                    var  models=this.$refs.sodropdown;
                    for (let i = 0; i < models.length; i++) {
                        models[i].initDrop();
                    }
                }
            }
        },
        components: {
            sodropdown: sodropdown
        }
    }
</script>

<style scoped>
    .filter-dropdown {
        display: inline;
        margin-right: 50px;
        margin-bottom: 15px;
    }
</style>