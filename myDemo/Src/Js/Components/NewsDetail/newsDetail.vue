<template>
    <!--<div id="left" class="col-md-9" style="height: 100%;">-->
        <!--<div class="basicinfo">-->
            <div >
                <showarea  :data="data" :type="type"></showarea>
                <!--<div class="showarea_slt">-->
                    <!--<button type="button" class="btn btn-default" onclick="showPic">预览缩略图</button>-->
                    <!--<button type="button" class="btn btn-default" onclick="downloadPic">下载缩略图</button>-->
                <!--</div>-->
            </div>
        <!--</div>-->
    <!--</div>-->
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
    export default {
        props: {
            data: Object,
            type: String,

        },
        components: {
            showarea,
        }
    }
</script>