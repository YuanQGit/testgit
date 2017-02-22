<template>
<div>
<img :src="url" v-bind:style="styleobj" @click="imgClick" />
	 <el-dialog title="" v-model="isShow" top="5%" size="large">
	  <soimg :url="url"></soimg>
	 </el-dialog>
 </div>
</template>
<script type="text/javascript">
	import {Dialog} from 'element-ui'
	import soimg from './SoImage.vue'
	export default{
		props:{
          url:String,
          styleobj:Object
		},
		data:function(){
			debugger
			let _this=this;
             return{
             	isShow:false
             }
		},
		 methods: {
            imgClick: function () {
            	debugger
             this.isShow=true;
            }
        },

        components: {
            "el-dialog": Dialog,
            "soimg":soimg
        },
	}
</script>