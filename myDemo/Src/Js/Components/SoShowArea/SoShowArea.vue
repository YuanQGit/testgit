<template>
    <div v-if="type!=null&&type=='flow'" v-for="row in data.layouts">
        <div v-for="col in row" >
            <div v-for="flowdata in data.data" v-if="col.id==flowdata.id">
                <div v-bind:style="col.css" class="{{col.keycol}}" v-if="flowdata.type=='text'&&flowdata.key!=''">{{flowdata.key}}</div>
                <div v-bind:style="col.css" class="{{col.keycol}}" v-if="flowdata.type=='img'&&flowdata.key!=''">{{flowdata.key}}</div>
                <div v-bind:style="col.css" class="{{flowdata.key==''?col.allcol:col.valcol}}" v-if="flowdata.type=='text'">{{flowdata.value}}</div>
                <div v-bind:style="col.css" class="{{flowdata.key==''?col.allcol:col.valcol}}" v-if="flowdata.type=='img'"><img style="width: 600px; height: 300px;" :src="flowdata.value" alt=""></div>
            </div>
        </div>
    </div>

    <table v-if="type!=null&&type=='table'" class="table table-bordered showarea_table" style="cellspacing:0; cellpadding:0;" >
        <tbody>
            <tr v-for="row in layout">
                <th v-bind:style="col.css" class="th_text" rowspan="{{col.rowspan}}" colspan="{{col.colspan}}" v-for="(index,col) in row" v-if="col.key!=''&&col.type=='text'&&index==0">{{col.key}}</th>
                <td v-bind:style="col.css" rowspan="{{col.rowspan}}" colspan="{{col.colspan}}" v-for="(index,col) in row"  v-if="col.type=='text'&&index==0" >{{col.value}}</td>
                <th v-bind:style="col.css"  rowspan="{{col.rowspan}}" colspan="{{col.colspan}}"  v-for="(index,col) in row" v-if="col.key!=''&&col.type=='img'&&index==0"><img v-bind:style="col.css" :src="col.value"></th>
                <td v-bind:style="col.css" rowspan="{{col.rowspan}}" colspan="{{col.colspan}}"  v-for="(index,col) in row" v-if="col.type=='img'&&index==0"><img v-bind:style="col.css" :src="col.value"></td>

                <th v-bind:style="col.css" class="th_text" rowspan="{{col.rowspan}}" colspan="{{col.colspan}}" v-for="(index,col) in row" v-if="col.key!=''&&col.type=='text'&&index==1">{{col.key}}</th>
                <td v-bind:style="col.css" rowspan="{{col.rowspan}}" colspan="{{col.colspan}}" v-for="(index,col) in row"  v-if="col.type=='text'&&index==1">{{col.value}}</td>
                <th v-bind:style="col.css"  rowspan="{{col.rowspan}}" colspan="{{col.colspan}}"  v-for="(index,col) in row" v-if="col.key!=''&&col.type=='img'&&index==1"><img v-bind:style="col.css" :src="col.value"></th>
                <td v-bind:style="col.css" rowspan="{{col.rowspan}}" colspan="{{col.colspan}}"  v-for="(index,col) in row" v-if="col.type=='img'&&index==1"><img v-bind:style="col.css" :src="col.value"></td>
            </tr>
        </tbody>
    </table>
</template>

<style scoped>
    .showarea_table{width: 100%;max-width: 100%;}
    .showarea_table tbody {
        display: table-row-group;
        vertical-align: middle;
    }
    .showarea_table tbody th{
        padding: 7px 10px;
        border-bottom: 1px solid #ddd;
        vertical-align: top;
        font-weight: normal;
        background-color: #f5f5f5;
    }
    .img_table{
        width: 100%;
        height: 100%;
    }
</style>
<script>
    export default {
        props: {
            data: Object,
            type: String
        },
        data: function () {
            return {
                //是拼接了table布局的数据和布局之后的集合
                layout: [],
                layouts: [],
                layoutstyle: null
            }
        },
        ready: function () {
            if(this.type=='table'){
                this.getData();
            }
        },
        methods: {
//            getData:function () {
//                var self=this;
//                /*这个东西是异步的*/
//                Vue.http.get(this.apiurl).then((response) => {
//                    if(response!=null){
//                        this.data=response.data;
//                        this.layouts=response.data.layouts;
//                        this.layoutstyle=response.data.layoutstyle.content;
//                        if(this.data.layoutstyle.content=='table'){
//                            var table=response.data!=null?response.data.table:null;
//                            var layouts=response.data!=null?response.data.layouts:null
//                            //这句是用于遍历layouts中的每一行的
//                            for(var row=0;layouts!=null&&row<layouts.length;row++){
//                                //这句是用于遍历layouts中的每一列的
//                                for(var col=0;col<layouts[row].length;col++){
//                                    //这句是用于遍历table表中的数据
//                                    for(var t=0;t<table.length;t++) {
//                                        //如果table表中的id和layouts表中的id相同，就把他们合并
//                                        if(layouts[row][col].id==table[t].id){
//                                            var object=layouts[row][col];
//                                            object.key=table[t].key;
//                                            object.value=table[t].value;
//                                            object.type=table[t].type;
//                                        }
//                                    }
//                                }
//                            }
//                            this.layout= layouts;
//                        }
//                    }
//                });
//            },
            getData: function () {
                if (this.data != null) {
                    var response = this.data;
                    this.layouts = response.layouts;
                    var tabledata = response != null ? response.data : null;
                    var layouts = response != null ? response.layouts : null
                    //这句是用于遍历layouts中的每一行的
                    for (var row = 0; layouts != null && row < layouts.length; row++) {
                        //这句是用于遍历layouts中的每一列的
                        for (var col = 0; col < layouts[row].length; col++) {
                            //这句是用于遍历table表中的数据
                            for (var t = 0; t < tabledata.length; t++) {
                                //如果table表中的id和layouts表中的id相同，就把他们合并
                                if (layouts[row][col].id == tabledata[t].id) {
                                    var object = layouts[row][col];
                                    object.key = tabledata[t].key;
                                    object.value = tabledata[t].value;
                                    object.type = tabledata[t].type;
                                }
                            }
                        }
                        this.layout = layouts;
                    }
                }
            }
        }
    }
</script>