<template> 
    <div :id="_id" v-show="!hidden">
        <div v-if="_data"> 
            <ul class="nav nav-tabs" id="tab">
                <li :class="index == 0 ? 'active' : ''" v-for="(d, index) of _data">
                    <a data-toggle="tab" :href='("#" + _id + "-tab-" + index)'>{{d.name}}</a>
                </li>
            </ul>
            <br />
            <div class="tab-content">
                <div :id='(_id + "-tab-" + index)' class="tab-pane" :class="{'active':index == 0}" v-for="(d, index) of _data"> 
                    <datagrid :id='("grid-" + index + Date.now())' :data="d.gridData" :pagesize="d.pageSize" :count="d.count"></datagrid>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import datagrid from '../SoDataGrid/SoDataGrid.vue'
    export default {
        props: {
            id: {
                type: String,
                default: null
            },
            hidden: {
                type: Boolean,
                default: false
            },
            data: Array
        },
        computed: {
            _data() {
                let temp = []
                if (this.data && this.data.length) {
                    for (let value of this.data) {
                        var obj = {
                            "name": value.name,
                            "count": ("count" in value) ? value.count : value.records ? value.records.length : 0,
                            "pageSize": ("pageSize" in value) ? value.pageSize : value.records ? value.records.length : 0,
                            "gridData": {
                                "fields": value.fields ? value.fields : [],
                                "records": value.records ? value.records : []
                            }
                        }
                        temp.push(obj)
                    }
                }
                return temp
            }
        },
        components: {
            datagrid
        },
        beforeMount() {
            if (this.id) {
                this._id = this.id
            } else {
                this._id = "dataset-" + Date.now()
            }
        }
    }
</script>