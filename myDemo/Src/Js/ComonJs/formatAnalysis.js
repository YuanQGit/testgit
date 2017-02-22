//entrance, return string html of format
export function formatAnalysis(keys,values,strformat){
    var $result=""
    var $arrTemplate=strformat.split('$') 

    //多个模板的情况
    for(var i=0;i<$arrTemplate.length;i++){ 
        if(/\(.*?\)/g.test($arrTemplate[i])){//有（）则是附带有事件function
            $arrTemplate[i]=$arrTemplate[i].replace(/\'/g, "");//去掉‘’
            if(/\<#=.*?\#>/g.test($arrTemplate[i])){//匹配<#=  #>
                var format=$arrTemplate[i].replace(/\s/g,"").match(/\((\S*)\)/)//临时数组 去掉所有空格,截取括号内参数
                if(format){
                    var strPartialPar=this.getPartialPar(keys,values,format[1])//非全部参数
                    $result+=$arrTemplate[i].substring(0,$arrTemplate[i].indexOf('(')+1)+strPartialPar+$arrTemplate[i].substring($arrTemplate[i].indexOf(')'))
                }
            }else{
                var strAllPar=this.getAllPar(keys,values)//全部参数
                $result+=$arrTemplate[i].substring(0,$arrTemplate[i].indexOf('(')+1)+strAllPar+$arrTemplate[i].substring($arrTemplate[i].indexOf(')'))
            }
        }else{ //无（） 无事件
            if(/\<#=.*?\#>/g.test($arrTemplate[i])){//必须有<#= #>格式才返回
                var format=$arrTemplate[i].replace(/\s/g,"").match(/\<#=(\S*)\#>/)//临时数组 去掉所有空格,截取 <#= #>
                if(format){
                    var strPar=this.getPar(keys,values,format[1])//全部参数，返回中间的部分 
                    $result+=$arrTemplate[i].substring(0,$arrTemplate[i].indexOf('<#='))+strPar+$arrTemplate[i].substring($arrTemplate[i].indexOf("#>")+2)
                }
            }
        }
    }
    return $result
}

function getAllPar(keys,values){ 
    var $keys=keys
    var $values=values
    var arrParameter=[]
    for(var i=0;i<$keys.length;i++){ 
        if($values[$keys[i].field]){ 
            arrParameter.push("'"+$values[$keys[i].field]+"'")
        }    
    } 
    return arrParameter.toString()
}
            
function getPartialPar(keys,values,strFormat){  
    var $keys=this.keys
    var $values=this.values
    var arrFormat=strFormat.split(',')
    var arrParameter=[]
    for(var i=0;i<arrFormat.length;i++){
        var format=arrFormat[i].match(/\<#=(\S*)\#>/)//获取参数
        if(format){
            var parField=format[1]
            for(var j=0;j<$keys.length;j++){ 
                var field=$keys[j].field
                if(field&&field.indexOf(parField)>-1){ 
                    arrParameter.push("'"+$values[$keys[j].field]+"'")
                }    
            } 
        } 
    }
    return arrParameter.toString()
}

function getPar(keys,values,strValue){
    var $keys=keys
    var $values=values
    var $strValue=strValue 
    var result=""
    for(var j=0;j<$keys.length;j++){ 
        var field=$keys[j].field
        if(field&&strValue.indexOf(field)>-1){
            try{
                result=eval($strValue.replace(new RegExp(field,"gm"),"'"+$values[$keys[j].field]+"'"))
            }
            catch(e){
                result=$strValue.replace(field,$values[$keys[j].field])
            }
        }    
    }
    return result
}