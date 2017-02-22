<template>
    <div>
        <div style="padding :0 7px 0 5px;max-width:900px;margin:auto">
            <textarea id="hero-demo"></textarea>
        </div>
    </div>
</template>
<script type="text/javascript">
    require('./lib/editor.js');
    import './lib/editor.css'
    export default{
        props: {
            value: String,
            ongetvalue: Function
        },
        mounted:function () {
            $('#hero-demo').tagEditor({
                placeholder: '输入....'
            });
        },
        methods: {
            GetValue:function() {
                let tags = $('#hero-demo').tagEditor('getTags')[0].tags;
                this.ongetvalue && this.ongetvalue(tags);
            }
        }
    }
</script>

