<template>
    <div :id="_id" v-show="!hidden">
        <div v-if="!!_data">
            <table class="table table-bordered table-hover vue-table template-table" style="table-layout:fixed;word-wrap:break-word;">
                <thead>
                    <tr>
                        <th v-show="showcheckbox" class="vue-table-cell-checkbox">
                            <input type="checkbox" @change.stop.prevent="masterCheckboxChange($event)" v-model="_masterCheckboxChecked"/>
                        </th>
                        <th v-for="(f, index) of _data.fields" class="vue-table-th vue-table-cell-field" @click.stop.prevent="sort(index)" v-if="f.visible">  
                            <span v-html="f.title"></span> 
                            <span v-if="f.sortable">
                                <span class="icon-sort" :class="{'icon-sort-up':f.ascendingOrder,'icon-sort-down':f.ascendingOrder == false,'icon-sort-disabled':f.ascendingOrder == null}"></span>
                            </span> 
                        </th> 
                    </tr>
                </thead>
                <tbody>  
                    <tr v-for="n in _pageSize" v-if="(_pageIndex - 1) * _pageSize + n <= _count">
                        <td v-show="showcheckbox" class="vue-table-cell-checkbox">
                            <checkboxtemplate :keys="_data.fields" :values="_data.records[n-1]" :selectedkeys="_data.selectedKeys" :onselect="checkboxSelected"></checkboxtemplate> 
                        </td>
                        <td v-for="f of _data.fields" class="vue-table-cell-record" v-if="f.visible">
                            <div v-if="f.operationTemplate"><strparsetemplate :strtemplate="f.operationTemplate" :keys="_data.fields" :values="_data.records[n-1]"></strparsetemplate></div>
                            <div v-else>{{_data.records[n-1][f.name]}}</div>
                        </td>
                    </tr>
                </tbody>
                <tfoot> 
                    <tr>
                        <td :colspan="_footLength" class="vue-table-cell-pager">
                            <div class="vue-table-count" v-if="_count > 0">共 {{_count}} 条</div><div class="vue-table-count-helper">css-helper</div>
                            <div class="vue-table-pager" v-if="_count > _pageSize"><page :size="_pageSize" :count="_count" :pagenum="5" :onclick="pageSelected" ref="page"></page></div>
                        </td>
                    </tr>
                </tfoot>
            </table> 
        </div> 
    </div>
</template>

<script>
    import page from '../SoPage/SoPage.vue'
    import checkboxtemplate from '../SoCheckboxTemplate/SoCheckboxTemplate.vue'
    import strparsetemplate from '../SoStrParseTemplate/SoStrParseTemplate.vue'
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
            data: Object,
            count: {
                type: Number,
                default: 0
            },
            pagesize: {
                type: Number,
                default: 0
            },
            showcheckbox: {
                type: Boolean,
                default: false
            },
            onsort: Function,
            onselectpage: Function
        },
        computed: {
            _data() {
                return this.data
            },
            _count() {
                let temp = 0
                if (this.count) {
                    temp = this.count
                } else if (!!this.data && this.data.records && this.data.records.length) {
                    temp = this.data.records.length
                } else {
                    temp = 0
                }
                return temp
            },
            _pageSize() {
                let temp = 0
                if (this.pagesize) {
                    temp = this.pagesize
                } else if (!!this.data && this.data.records && this.data.records.length) {
                    temp = this.data.records.length
                } else {
                    temp = 0
                }
                return temp
            },
            _footLength() {
                let temp = 0
                if (!!this.data && this.data.fields) {
                    let fields = this.data.fields,
                        len = fields.length
                    for (let value of fields) {
                        if (!value.visible) {
                            len = len - 1
                        }
                    }
                    temp = this.showcheckbox ? len + 1 : len
                }
                return temp
            }
        },
        watch: {
            data() {
                this.pageActiveNumReset() // set current page to page 1 
                this.cacheDataRecords() // set records cache
                this.selectionSetAttribute() // set arrtribute selection
            }
        },
        methods: {
            sort(fieldIndex) {
                this._pageIndex = 1
                let hasSortField = false,
                    fields = this._data.fields
                if (!fields[fieldIndex].sortable) return
                fields.forEach((value, index) => {
                    if (value.sortable) {
                        if (index == fieldIndex) {
                            if (value.ascendingOrder) {
                                value.ascendingOrder = false
                            } else {
                                value.ascendingOrder = true
                            }
                        } else {
                            value.ascendingOrder = null
                        }
                        hasSortField = true
                    }
                })
                if (!hasSortField) return
                let $detail = {},
                    sortField = fields[fieldIndex].name,
                    ascendingOrder = fields[fieldIndex].ascendingOrder
                $detail.sortField = sortField
                $detail.ascendingOrder = ascendingOrder
                $detail.selectedKeys = this._data.selectedKeys
                if (this.onsort) {
                    if (this.id) {
                        let returnRecords = this.onsort(soModels.getReturnModel(this._id, $detail)) // invoke common function return additional info 
                        returnRecords && this.updateRecords(returnRecords)
                    } else {
                        this.onsort($detail)
                    }
                } else {
                    let tempRecords = sessionStorage.getItem(this._id)
                    if (tempRecords) {
                        tempRecords = this.sortHelper(JSON.parse(tempRecords), sortField, ascendingOrder)
                        this.updateRecords(tempRecords)
                    }
                }
                this._masterCheckboxChecked = false
                this.pageActiveNumReset()
            },
            pageSelected(pageIndex) {
                this._pageIndex = pageIndex
                let $detail = {}
                $detail.pager = {
                    "pageSize": this.pagesize,
                    "pageIndex": pageIndex
                }
                let ascendingOrder, sortField
                for (let value of this._data.fields) {
                    let visible = value.visible,
                        sortable = value.sortable
                    ascendingOrder = value.ascendingOrder
                    if (visible && sortable && ascendingOrder != null) {
                        sortField = value.name
                        break
                    }
                }
                $detail.sortField = sortField
                $detail.ascendingOrder = ascendingOrder
                $detail.selectedKeys = this._data.selectedKeys
                if (this.onselectpage) {
                    if (this.id) {
                        let returnRecords = this.onselectpage(soModels.getReturnModel(this._id, $detail))
                        returnRecords && this.updateRecords(returnRecords)
                    } else {
                        this.onselectpage($detail)
                    }
                } else {
                    let tempRecords = sessionStorage.getItem(this._id)
                    if (tempRecords) {
                        tempRecords = JSON.parse(tempRecords)
                        if (sortField) {
                            tempRecords = this.sortHelper(tempRecords, sortField, ascendingOrder)
                        }
                        let start = this.pagesize * (pageIndex - 1),
                            end = this.pagesize * pageIndex,
                            sliceRecords = tempRecords.slice(start, end)
                        if (sliceRecords.length < 1) return
                        this.updateRecords(sliceRecords)
                    }
                }
                this._masterCheckboxChecked = false
            },
            masterCheckboxChange(event) { //select all  
                let targets = event.currentTarget,
                    fields = this._data.fields,
                    records = this._data.records.slice(0, this._pageSize)
                if (targets.checked) {
                    for (let r of records) {
                        let keyVal = "",
                            temp = []
                        for (let f of fields) {
                            if (f.key) {
                                let name = f.name
                                temp.push(r[name])
                            }
                        }
                        keyVal = temp.join('|')
                        if (keyVal && this._data.selectedKeys.indexOf(keyVal) < 0) {
                            this._data.selectedKeys.push(keyVal)
                        }
                    }
                } else {
                    for (let r of records) {
                        let keyVal = "",
                            temp = []
                        for (let f of fields) {
                            if (f.key) {
                                let name = f.name
                                temp.push(r[name])
                            }
                        }
                        keyVal = temp.join('|')
                        let index = this._data.selectedKeys.indexOf(keyVal)
                        if (index > -1) {
                            this._data.selectedKeys.splice(index, 1)
                        }
                    }
                }
                this.selectionSetAttribute()
            },
            checkboxSelected(key) {
                if (this.showcheckbox) {
                    let index = this._data.selectedKeys.indexOf(key)
                    if (index > -1) {
                        this._data.selectedKeys.splice(index, 1)
                    } else {
                        this._data.selectedKeys.push(key)
                    }
                    this.selectionSetAttribute()
                }
            },
            sortHelper(arr, field, order) {
                let refer = [],
                    result = [],
                    self = this
                arr.forEach((value, index) => {
                    let temp = (isNaN(value[field]) ? value[field] : self.padLeft(value[field], 15)) + ':' + index
                    refer.push(temp)
                })
                refer.sort()
                if (!order) refer.reverse()
                for (let value of refer) {
                    let index = value.split(':')[1]
                    result.push(arr[index])
                }
                return result
            },
            padLeft(field, width) {
                let len = field.toString().length
                while (len < width) {
                    field = "0" + field
                    len = len + 1
                }
                return field
            },
            pageActiveNumReset() {
                if (this.$refs && this.$refs.page) {
                    this.$refs.page.activeNum = 1
                }
            },
            selectionSetAttribute() {
                if (!!this._data && this._data.selectedKeys) {
                    $("#" + this._id)[0].setAttribute("selection", this._data.selectedKeys)
                }
            },
            cacheDataRecords() {
                if (!!this.data && this.data.records) {
                    sessionStorage.removeItem(this._id)
                    sessionStorage.setItem(this._id, JSON.stringify(this.data.records))
                }
            },
            updateRecords(newRecords) {
                let fields = this._data.fields
                this._data.records.forEach((record, index) => {
                    if (index < newRecords.length) {
                        fields.forEach(field => {
                            let name = field.name
                            record[name] = newRecords[index][name]
                        })
                    }
                })
            }
        },
        components: {
            page,
            checkboxtemplate,
            strparsetemplate
        },
        beforeMount() {
            if (this.id) {
                this._id = this.id
            } else {
                this._id = "grid-" + Date.now()
            }
            this._pageIndex = 1
            this._masterCheckboxChecked = false
        },
        mounted() {
            this.selectionSetAttribute()
            this.cacheDataRecords()
        }
    }
</script>

<style scoped>
    .vue-table-cell-pager {
        text-align: right;
        overflow: hidden;
    }
    
    .vue-table-count {
        float: left;
        margin: inherit;
        font-size: medium;
        margin-top: 23px;
    }
    
    .vue-table-count-helper {
        float: left;
        height: 71px;
        opacity: 0;
    }
    
    .vue-table-pager {
        float: right;
    }
    
    .vue-table thead,
    .vue-table tfoot {
        background-color: #f8f8f8;
    }
    
    .vue-table-cell-field {
        text-align: center;
    }
    
    .vue-table-cell-record {
        text-align: left;
    }
    
    .vue-table-cell-checkbox {
        width: 50px;
        text-align: center;
    }
    
    .vue-table-th {
        cursor: pointer;
        position: relative;
    }
    
    .icon-sort-disabled {
        color: #999;
    }
    
    .vue-table-empty {
        text-align: center;
        line-height: 60px!important;
    }
    
    .icon-sort:before {
        top: 3px;
        font-size: 15px;
        float: right;
        position: relative;
    }
    
    .icon-sort-up:before {
        top: 3px;
        font-size: 15px;
        float: right;
        position: relative;
    }
    
    .icon-sort-down:before {
        top: 3px;
        font-size: 15px;
        float: right;
        position: relative;
    }
</style>