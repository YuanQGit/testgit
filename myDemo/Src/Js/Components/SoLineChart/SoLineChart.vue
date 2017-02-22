<template>
    <div name="echarts" :style="style" :id="id" :classname="classname" v-show="!hidden">
    </div>
</template>
<script>
    import echarts from 'echarts'
    export default{
        props:{
            hidden:{
                type:Boolean,
                default:false,
            },
            classname:{
                type:String,
                default:"linechart"
            },
            id:{
                type:String,
                default:null
            },
            style:{
                type:String,
                default:"width:100%;height:100%;"
            },
            maintitle:{
                type:String,
                default:""
            },
            subhead:{
                type:String,
                default:""
            },
            data:Object,
            showtool:{
                type:Boolean,
                default:false
            },
            showlabel:{
                type:Boolean,
                default:false
            },
        },
        mounted(){
            debugger;
            var self=this;
            var option={
                title : {
                    text: self.maintitle,
                    subtext:self.subhead,
                },
                legend: {
                    data:self.data.legend
                },
                xAxis:{
                    "type":"category",
                    "data":self.data.xAxis
                },
                yAxis:{
                    "type":"value"
                },
                toolbox: {
                    show : self.showtool,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        saveAsImage : {show: true}
                    }
                },
                series:(function () {
                    var list=[];
                    for(var i=0;i<self.data.dataArea.length;i++){
                        var bardata={};
                        bardata.name=self.data.legend[i];
                        bardata.type="line";
                        bardata.itemStyle={
                            normal: {
                                label : {
                                    show: self.showlabel, position: 'top'
                                }
                            }
                        };
                        bardata.data=self.data.dataArea[i];
                        list.push(bardata)
                    }
                    return list
                }())
            };

            var myCharts=echarts.init(this.$el);
            myCharts.setOption(option);
        }
    }
</script>