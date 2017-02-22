<template>
    <div v-if="!hidden">
        <template v-if="showfilter">
            <sooil_filter :data="filters" :tip="tip" :title="filtertitle" :onclick="txtclick" :onclean="clean">
            </sooil_filter>
        </template>

        <sooil_list :data="data" :highlight="highlight" :onclick="titleclick" :titletemplate="titletemplate">
        </sooil_list>
        <template v-if="allowpaging">
            <sooil_page :size="size" :count="count" :onclick="pager" :pagenum="pagenum">
            </sooil_page>
        </template>
    </div>
</template>
<script>
    import sooil_filter from '../SoFilter/SoFilter.vue';
    import sooil_list from '../SoDataList/SoDataList.vue';
    import sooil_page from '../SoPage/SoPage.vue';
    export default {
        props: {
            id: {
                type: String,
                default: null
            },
            class: String,
            style: String,
            hidden: {
                type: Boolean,
                default: false
            },
            filters: Array,
            data: Array,
            titletemplate: String,
            highlight: Array,
            size: Number,
            count: Number,
            onselectpage: Function,
            onitemclick: Function,
            onfilterclear: Function,
            onfilterclick: Function,
            showfilter: {
                type: Boolean,
                default: false
            },
            allowpaging: {
                type: Boolean,
                default: false
            }
        },
        data: function () {
            debugger
            return {
                pagenum: 10,
                tip: "",
                filtertitle: "筛选条件"
            }
        },
        methods: {
            txtclick: function (value) {
                if (this.id)
                    this.onfilterclick && this.onfilterclick(soModels.getReturnModel(this.id, value));
                else
                    this.onfilterclick && this.onfilterclick(value);
            },

            clean: function (value) {
                if (this.id)
                    this.onfilterclear && this.onfilterclear(soModels.getReturnModel(this.id, value));
                else
                    this.onfilterclear && this.onfilterclear(value);
            },

            pager: function (value) {
                if (this.id)
                    this.onselectpage && this.onselectpage(soModels.getReturnModel(this.id, value));
                else
                    this.onselectpage && this.onselectpage(value);
            },

            titleclick: function (value) {
                if (this.id)
                    this.onitemclick && this.onitemclick(soModels.getReturnModel(this.id, value));
                else
                    this.onitemclick && this.onitemclick(value);
            }
        },
        components: {
            sooil_filter, sooil_list, sooil_page
        },

        watch: {
            'count': function () {
                if (typeof (this.count) != "undefined")
                    this.tip = "Sooil为你找到相关结果" + this.count + "个";
            }
        }
    }
</script>
