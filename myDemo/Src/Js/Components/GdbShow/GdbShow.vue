<template>
    <object align="left" classid="clsid:D2546426-13FD-4018-85F1-F5BD61147C8F" :style="style"
            codebase="JoGIS4.ocx#version=1,0,0,1" wmode="Opaque" VIEWASTEXT>
        <PARAM NAME="_Version" VALUE="65536">
        <PARAM NAME="_ExtentX" VALUE="20000">
        <PARAM NAME="_ExtentY" VALUE="15000">
        <PARAM NAME="_StockProps" VALUE="0">
        <PARAM NAME="WMODE" VALUE="transparent">
    </object>
</template>
<script>
    export default{
        props:{
            url:String,
            style:{
                type:String,
                default:"width:600px;height:500px;"
            }
        },
        mounted: function () {
                this.$el.LoadMapFile(this.url);
                this.createContextMenu();
        },
        methods:{
            createContextMenu:function () {
                this.$el.ResetTools();
                this.$el.AddTool(13);//放大
                this.$el.AddTool(14);//缩小
                this.$el.AddTool(15);//移动/手势
                this.$el.AddTool(17);//复位
            }
        }
    }
</script>
