<template>
    <div class="form-group col-sm-12">
            <form_input  v-for="item in data" :data="item"  ref="form_input"></form_input>
    </div>
</template>
<script>
    import form_input from '../SoForm/FormInput.vue'
    export default{
        props: {
            data: Array
        },
        methods:{
           getText:function () {
               var texts=[];
               for (let i = 0; i < this.$refs.form_input.length; i++) {
                    texts.push( {text:this.$refs.form_input[i].inputText , name:this.$refs.form_input[i].name,
                        isok:this.$refs.form_input[i].isok,title:this.$refs.form_input[i].title});
               }
               return texts;
           }
    },
        components: {
            form_input: form_input
        }
    }
</script>

<style scoped>
</style>