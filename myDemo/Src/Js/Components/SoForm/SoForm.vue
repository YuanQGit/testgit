<template>
    <div v-bind:style="style" v-if="!hidden">
        <div class="panel panel-default" style="margin:10px">
            <div class="panel-heading">
                <h4 v-html="data.groupTitle"></h4>
            </div>
            <div class="panel-body">
                <form v-if="list.length>0" class="form-horizontal" role="form">
                    <form_row v-for="item in list" :data="item"  ref="form_row"></form_row>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    import form_row from '../SoForm/FormRow.vue'
    export default{
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
            data: Object,
            onFormData: Function,
            id: {
                type: String,
                default: ""
            },
            style: String,
            class: String,
            hidden: {
                type: Boolean,
                default: false
            }
        },
        data: function () {
            return {
                list: this.GetRow()
            }
        },
        methods: {
            GetRow: function () {
                let list = this.data.fields;
                let rowlist = [];
                let rowArray = [];
                for (let i = 0; i < list.length; i++) {
                    rowArray.push(list[i]);
                    if (rowArray.length == 2 || i == list.length - 1) {
                        rowlist.push(rowArray);
                        rowArray = [];
                    }
                }
                return rowlist;
            },

            getFormData: function () {
                var _this = this;
                var texts = [];
                var rowtexts = [];
                for (let i = 0; i < _this.$refs.form_row.length; i++) {
                    rowtexts = _this.$refs.form_row[i].getText();
                    for (let i = 0; i < rowtexts.length; i++) {
                        texts.push(rowtexts[i]);
                    }
                }
                return texts;
            }
        },
        components: {
            form_row: form_row
        }
    }
</script>

<style scoped>
</style>

