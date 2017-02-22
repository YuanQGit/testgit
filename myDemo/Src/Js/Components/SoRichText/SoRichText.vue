<template>
    <div v-if="!hidden"   v-bind:style="style" >
            <div class="embed-responsive embed-responsive-16by9" v-if="url!=''">
                <iframe class="embed-responsive-item"  v-bind:src="url"></iframe>
            </div>
        <div v-else>
            <div v-html="htmltext" v-bind:style="style"></div>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            id:{
                type: String,
                default: null
            },
            htmltext: String,
            url: {
                type: String,
                default: ""
            },
            style: String,
            class: String,
            hidden: {
                type: Boolean,
                default: false
            }
        }
    };
</script>