<template>
    <div v-html="_rawHtml"></div>
</template>

<script>
    export default {
        props: {
            strtemplate: String,
            keys: {
                type: Array,
                default: []
            },
            values: {
                type: Object,
                default: null
            }
        },
        computed: {
            _rawHtml() {
                let temp = ""
                if (this.strtemplate && this.keys && !!this.values) {
                    temp = this.parseTemplate()
                }
                return temp
            }
        },
        methods: {
            parseTemplate() {
                let $arrTemplate = this.strtemplate.split('$'),
                    $result = ""
                for (let i = 0; i < $arrTemplate.length; i++) { //多个模板的情况
                    if (/\(.*?\)/g.test($arrTemplate[i])) { //有（）则是附带有事件function
                        $arrTemplate[i] = $arrTemplate[i].replace(/\'/g, ""); //去掉‘’
                        if (/\<#=.*?\#>/g.test($arrTemplate[i])) { //匹配<#=  #>
                            let format = $arrTemplate[i].replace(/\s/g, "").match(/\((\S*)\)/) //临时数组 去掉所有空格,截取括号内参数
                            if (format) {
                                let strPartialPar = this.getPartialPar(format[1]) //部分参数
                                $result += $arrTemplate[i].substring(0, $arrTemplate[i].indexOf('(') + 1) + strPartialPar + $arrTemplate[i].substring($arrTemplate[i].indexOf(')'))
                            }
                        } else {
                            let strAllPar = this.getAllPar() //全部参数
                            $result += $arrTemplate[i].substring(0, $arrTemplate[i].indexOf('(') + 1) + strAllPar + $arrTemplate[i].substring($arrTemplate[i].indexOf(')'))
                        }
                    } else { //无（） 无事件
                        if (/\<#=.*?\#>/g.test($arrTemplate[i])) { //必须有<#= #>格式才返回
                            let format = $arrTemplate[i].replace(/\s/g, "").match(/\<#=(\S*)\#>/) //临时数组 去掉所有空格,截取 <#= #>
                            if (format) {
                                let strPar = this.replacePar(format[1])
                                $result += $arrTemplate[i].substring(0, $arrTemplate[i].indexOf('<#=')) + strPar + $arrTemplate[i].substring($arrTemplate[i].indexOf("#>") + 2)
                            }
                        }
                    }
                }
                return $result
            },
            getAllPar() {
                let $values = this.values,
                    arrParameters = []
                for (let value of this.keys) {
                    if ($values[value.name]) {
                        arrParameters.push("'" + $values[value.name] + "'")
                    }
                }
                return arrParameters.toString()
            },
            getPartialPar(strFormat) {
                let $values = this.values,
                    arrFormat = strFormat.split(','),
                    arrParameter = []
                for (let i = 0; i < arrFormat.length; i++) {
                    let format = arrFormat[i].match(/\<#=(\S*)\#>/) //获取参数
                    if (format) {
                        let parField = format[1]
                        for (let value of this.keys) {
                            let name = value.name
                            if (name && name.indexOf(parField) > -1) {
                                arrParameter.push("'" + $values[name] + "'")
                            }
                        }
                    }
                }
                return arrParameter.toString()
            },
            replacePar(strValue) {
                let $value = strValue,
                    $values = this.values,
                    result = ""
                for (let value of this.keys) {
                    let name = value.name
                    if (name && strValue.indexOf(name) > -1) {
                        try {
                            result = eval($value.replace(new RegExp(name, "gm"), "'" + $values[name] + "'"))
                        } catch (e) {
                            result = $value.replace(name, $values[name])
                        }
                    }
                }
                return result
            }
        }
    }
</script>