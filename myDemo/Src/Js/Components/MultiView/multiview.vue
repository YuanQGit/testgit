<template>
    <ul>
        <li v-for="option in options">
            <div name="echarts" :style="style"></div>
        </li>
    </ul>
</template>
<script>
    import echarts from 'echarts'
    export default{
        data(){
          return {
              index:0
          }
        },
        props:{
            options:Array,
            style:String,
        },
        ready(){
            debugger;
            var myc=[];
            for(var i=0;i<this.options.length;i++){
                var myCharts=echarts.init(this.$el.children[i].children[0]);
                myCharts.setOption(this.options[i]);
                myc.push(myCharts)
            }
            for(var j=0;j<myc.length;j++){
                var arr=[];
                for(var k=0;k<myc.length;k++){
                    if(k!=j){
                        arr.push(myc[k]);
                    }
                }
                myc[j].connect(arr);
            }
        }
    }
</script>