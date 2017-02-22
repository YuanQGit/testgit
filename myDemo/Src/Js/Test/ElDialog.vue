<template>
	<button class="btn btn-info">打开嵌套表格的 Dialog</button>
	<soimg src></soimg>
</template>
<script type="text/javascript">
import {Dialog} from 'element-ui'
import soimg from './SoImage.vue'
export default{
	props:{
         url:String
	},
    components: {
        "el-upload": element.Upload,
        "soimg":soimg
        },
	}
</script>