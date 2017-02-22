<template>
    <div v-if="!hidden">
        <div id="imgContainer" v-bind:style="style">
            <img @click="imgClick" id="imageFullScreen" :src="url"/>
            <div id="positionButtonDiv" v-if="showtool">
                <p><span> <img id="zoomInButton" class="zoomButton" src="../../../Img/ZoomImage/zoomIn.png"
                               title="zoom in"
                               alt="zoom in"/>
                <img id="zoomOutButton" class="zoomButton" src="../../../Img/ZoomImage/zoomOut.png" title="zoom out"
                     alt="zoom out"/>
                </span></p>
                <p>
                <span class="positionButtonSpan">
                    <map name="positionMap" class="positionMapClass">
                        <area id="topPositionMap" shape="rect" coords="20,0,40,20" title="move up" alt="move up"/>
                        <area id="leftPositionMap" shape="rect" coords="0,20,20,40" title="move left" alt="move left"/>
                        <area id="rightPositionMap" shape="rect" coords="40,20,60,40" title="move right"
                              alt="move right"/>
                        <area id="bottomPositionMap" shape="rect" coords="20,40,40,60" title="move bottom"
                              alt="move bottom"/>
                    </map>
                    <img src="../../../Img/ZoomImage/position.png" usemap="#positionMap"/>
                </span>
                </p>
            </div>
        </div>
    </div>
</template>
<script>
    require('./lib/jqzoom.js');
   import {Dialog} from 'element-ui'
    export default {
        props: {
            id:{
                type: String,
                default: null
            },
            url: String,
            showtool: {
                type: Boolean,
                default: true
            },
            onclick: Function,
            style: {
               type:String,
               default:"width:900px;height:"+ (window.screen.availHeight/1.54)+"px;margin:0;"
            },

            hidden: {
                type: Boolean,
                default: false
            }
        },
      
        mounted:function(){
            if(!document.getElementById("imageFullScreen")) return;
            // if(document.getElementById("positionButtonDiv")){
            //     var left=document.getElementById("imgContainer").offsetWidth;
            //     document.getElementById("positionButtonDiv").style.left=(left-70)+'px';
            // }
            $('#imageFullScreen').smartZoom({'containerClass': 'zoomableContainer'});
            $('#topPositionMap,#leftPositionMap,#rightPositionMap,#bottomPositionMap').bind("click", moveButtonClickHandler);
            $('#zoomInButton,#zoomOutButton').bind("click", zoomButtonClickHandler);
            function zoomButtonClickHandler(e) {
                var scaleToAdd = 0.8;
                if (e.target.id == 'zoomOutButton')
                    scaleToAdd = -scaleToAdd;
                $('#imageFullScreen').smartZoom('zoom', scaleToAdd);
            }

            function moveButtonClickHandler(e) {
                var pixelsToMoveOnX = 0;
                var pixelsToMoveOnY = 0;
                switch (e.target.id) {
                    case "leftPositionMap":
                        pixelsToMoveOnX = 50;
                        break;
                    case "rightPositionMap":
                        pixelsToMoveOnX = -50;
                        break;
                    case "topPositionMap":
                        pixelsToMoveOnY = 50;
                        break;
                    case "bottomPositionMap":
                        pixelsToMoveOnY = -50;
                        break;
                }
                $('#imageFullScreen').smartZoom('pan', pixelsToMoveOnX, pixelsToMoveOnY);
            }
        },
        methods: {
            imgClick: function () {
                if(this.id)
                    this.onclick && this.onclick(soModels.getReturnModel(this.id,""));
                else
                    this.onclick && this.onclick();
            }
        }
    };

</script>

<style scoped>

    /*#pageContent {*/
    /*width: 980px;*/
    /*height: 500px;*/
    /*overflow: hidden;*/
    /*position: relative;*/
    /*margin: 50px auto;*/
    /*}*/

  /*  #imgContainer {
        width: 900px;
        height: 500px;
        margin:0;
    }*/

    #positionButtonDiv {
        background: rgb(58, 56, 63);
        background: rgba(58, 56, 63, 0.8);
        border: solid 1px #100000;
        color: #FFFFFF;
        padding: 8px;
        text-align: left;
        position: absolute;
        right: 60px;
        top: 60px;
    }

    #positionButtonDiv .positionButtonSpan img {
        float: right;
        border: 0;
    }

    .positionMapClass area {
        cursor: pointer;
    }

    .zoomButton {
        border: 0;
        cursor: pointer;
    }

</style>