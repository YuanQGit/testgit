<template>
    <div>
    <div class="detail" v-if="!hidden" v-bind:style="style">
        <div class="basicInfo" style="clear: both;">
            <div  class="basicInfo_Pic" style="float: left;">
                <img v-if="data.thumbnailUrl&&data.thumbnailUrl!=''" :src="data.thumbnailUrl" alt="#">
                <img v-else :src="thumbnail | getIcon" alt="#">
            </div>

            <div class="basicInfo_data" style="float: right;">
                <table class="table table-bordered">
                    <tr v-for="basicInfo in data.basicInfo">
                        <th>{{basicInfo.key}}</th>
                        <td>{{basicInfo.value}}</td>
                    </tr>
                </table>
            </div>
        </div>

        <div class="groups" v-for="group in data.groups" style="clear: both" >
            <p>{{group.name}}</p>
            <table class="table table-bordered">
                <tr v-for="item in group.items">
                    <th>{{item.key}}</th>
                    <td>{{item.value}}</td>
                </tr>
                <!--<tr v-if="group.items.length!=0 && group.items.length%2==0" v-for="n in group.items.length/2">-->
                    <!--<th>{{group.items[2*n-2].key}}</th>-->
                    <!--<td>{{group.items[2*n-2].value}}</td>-->
                    <!--<th>{{group.items[2*n-1].key}}</th>-->
                    <!--<td>{{group.items[2*n-1].value}}</td>-->
                <!--</tr>-->
            </table>
        </div>
        <div class="thumbnail">
            <button type="button" v-if="showpreview==true||showpreview==True" class="btn btn-default" v-on:click="showPic(data.id)">预览</button>
            <button type="button" v-if="showdownload==true||showdownload==True" class="btn btn-default" v-on:click="downloadPic(data.id)">下载</button>
        </div>




    </div>
    <table class="table table-hover">
        <tbody>
            <tr><td>2</td><td>1</td></tr>
            <tr><td>2</td><td>1</td></tr>
            <tr><td>2</td><td>1</td></tr>
            <tr><td>2</td><td>1</td></tr>
            <tr><td>2</td><td>1</td></tr>
            <tr><td>2</td><td>1</td></tr>
            <tr><td>2</td><td>1</td></tr>
        </tbody>
    </table>
    </div>
</template>


<style scoped>



</style>
<script>
    import   getIcon from  "../../ComonJs/formatIcon"
    export default {
        props: {
            id:String,
            data: Object,
            class:{
                type:String,
                default:""
            },
            style:{
                type:String,
                default:""
            },
            hidden:{
                type:Boolean,
                default:false
            },
            showpreview:Boolean,
            showdownload:Boolean,
            onpreview:Function,
            ondownload:Function
        },
        data:function () {
            return{
                thumbnail:"thumbnail"
            }

        },
        ready:function () {
            if(this.data.thumbnailUrl&&this.data.thumbnailUrl!=""){
                this.thumbnail=this.data.thumbnailUrl;
            }
        },
        methods: {
            showPic:function (id) {
               this.onpreview&&this.onpreview(soModels.getReturnModel(this.id,id))
            },
            downloadPic:function (id) {
               this.ondownload && this.ondownload(soModels.getReturnModel(this.id,id))
            }
        },
        filters:{
            getIcon: function (str) {
                return getIcon(str);
            }
        }
    }
</script>