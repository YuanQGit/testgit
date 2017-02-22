<template>
    <div name="echarts" :style="style" :classname="classname" :id="id" v-show="!hidden">
    </div>
</template>
<script>
    //import echarts from 'echarts'
    let echarts=require("./echarts.common.min");
    export default{
        props:{
            data:Object,
            style:{
                type:String,
                default:"width:100%,height:100%"
            },
            classname:{
                type:String,
                default:"piechart"
            },
            id:{
                type:String,
                default:null
            },
            hidden:{
                type:Boolean,
                default:false,
            },
            maintitle:{
                type:String,
                default:""
            },
            subhead:{
                type:String,
                default:""
            },
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
            var self=this;
            var option={
                title : {
                    text:self.maintitle,
                    subtext:self.subhead,
                },
                legend: {
                    data:self.data.legend
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{b} : {c} ({d}%)"
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
                    var lst=[];
                    var opst={};
                    opst.type="pie";
                    opst.radius="55%";
                    opst.center=["50%", "60%"];
                    opst.itemStyle={
                        normal:{
                            label:{
                                show:true,
                                position:'innerTop',
                                formatter : function (params) {
                                    return !self.showlabel?params.name:params.name+'('+ params.percent+ '%)'
                                }
                            }
                        }
                    }
                    var list=[];
                    for(var i=0;i<self.data.dataArea.length;i++){
                        var bardata={};
                        bardata.name=self.data.legend[i];
                        bardata.value=self.data.dataArea[i];
                        list.push(bardata)
                    }
                    opst.data=list;
                    lst.push(opst)
                    return lst;
                }())
            };
debugger;
            var myCharts=echarts.init(this.$el);
            myCharts.setOption(option);
        }
    }
</script>