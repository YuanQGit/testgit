<template>
    <div name="echarts" :style="style">
    </div>
</template>
<script>
    import echarts from 'echarts'
    export default{
        data(){
            return {
                style:"height:"+this.height+";"+"width:"+this.width
            }
        },
        props:{
            height:{
                type:String,
                default:"500px"
            },
            width:{
                type:String,
                default:"600px"
            },
            maintitle:{
                type:String,
                default:""
            },
            subhead:{
                type:String,
                default:""
            },
            type:{
                type:String,
                default:"bar"
            },
            legend:Array,
            data:Array,
            xaxis:{
                type:Array,
                default:[]
            }
        },
        ready(){
            var self=this;
            var option={
                title : {
                    text: self.maintitle,
                    subtext:self.subhead,
                },
                legend: {
                    data:self.legend
                },

                xAxis:{
                    "type":"category",
                    "data":self.xaxis
                },
                yAxis:{
                    "type":"value"
                },
                series:(function () {
                    var list=[];
                    debugger;
                    for(var i=0;i<self.data.length;i++){
                        var bardata={};
                        bardata.name=self.legend[i];
                        bardata.type=self.type;
                        bardata.data=self.data[i];
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
