<template> 
    <input type="checkbox" class="checkbox-inner" v-model="_defaultChecked" @change="select()" />
</template>

<script>
    export default {
        props: {
            keys: Array,
            values: Object,
            selectedkeys: Array,
            onselect: Function
        },
        computed: {
            _defaultChecked() {
                let temp = false,
                    selection = [],
                    tempKey = []
                if (this.keys && !!this.values && this.selectedkeys) {
                    for (let value of this.keys) {
                        if (value.key) {
                            let name = value.name
                            selection.push(this.values[name])
                        }
                    }
                    for (let value of this.selectedkeys) {
                        tempKey.push(value)
                    }
                }
                let strKeys = selection.join('|')
                temp = tempKey.indexOf(strKeys) > -1
                return temp
            }
        },
        methods: {
            select() {
                if (this.onselect) {
                    var selection = [],
                        $keys = this.keys,
                        $values = this.values
                    for (var i in $keys) {
                        if ($keys[i].key) {
                            var name = $keys[i].name
                            selection.push($values[name])
                        }
                    }
                    this.onselect(selection.join('|'))
                }
            }

            //templateRealize() {
            // var $selectedKeys = this.selectedkeys,
            //     $keys = this.keys,
            //     $values = this.values,
            //     selection = []
            // for (var i in $keys) {
            //     if ($keys[i].key) {
            //         var name = $keys[i].name
            //         selection.push($values[name])
            //     }
            // }
            // var strKeys = selection.join('|')
            // return $selectedKeys ? $selectedKeys.indexOf(strKeys) > -1 : false
            //}
        }

        // created() {
        //     if (this.selectedkeys && this.keys && this.values) {
        //         this.defaultChecked = this.templateRealize()
        //     }
        // }

        // watch: {
        //     values() {
        //         this.defaultChecked = this.templateRealize()
        //     },
        //     selectedkeys() {
        //         this.defaultChecked = this.templateRealize()
        //     }
        // }
    }
</script>