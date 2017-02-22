<template>
    <div :id="_id" v-show="!hidden" class="tree-default-style"> 
        <div :id="_innerId"></div> 
    </div>
</template>

<script>
    export default {
        props: {
            id: {
                type: String,
                default: null
            },
            hidden: {
                type: Boolean,
                default: false
            },
            data: Array,
            showcheckbox: {
                type: Boolean,
                default: false
            },
            enableedit: {
                type: Boolean,
                default: false
            },
            onloaded: Function,
            onnodeselected: Function,
            onadd: Function,
            onupdate: Function,
            ondelete: Function
        },
        computed: {
            _data() {
                let temp = []
                if (this.data && this.data.length) {
                    this.treeFixData() //fix jstree data format bug 
                    temp = this.data
                }
                return temp
            }
        },
        watch: {
            data() {
                $('#' + this._innerId).jstree(true).destroy()
                this.treeCreate()
            }
        },
        methods: {
            treeFixData() {
                for (let i = 0; i < this.data.length; i++) {
                    if (!(("id" in this.data[i]) && ("parentId" in this.data[i]))) { //rarely case but prevent error result, source data not include id, parentId then delete this
                        this.data.splice(i, 1)
                        i--
                    }
                }
                for (let value of this.data) {
                    let parentId = value.parentId
                    if (isNaN(parentId)) {
                        parentId = parentId.replace(/ /g, "")
                    }
                    let id = parentId == "" || parentId == null || parentId == "#" ? "#" : this.checkParentId(parentId) //set root node "#"
                    delete value.parentId;
                    value.parent = id //parentId->parent
                }
            },
            checkParentId(pId) {
                for (let value of this.data) {
                    let id = value.id
                    if (isNaN(id)) {
                        id = id.replace(/ /g, "")
                    }
                    if (pId == id) {
                        return pId
                    }
                }
                return "#"
            },
            treeCreate() {
                let self = this,
                    plugins = ['types', 'sort'],
                    contextmenu = {}
                if (self.showcheckbox) {
                    plugins.push("checkbox")
                }
                if (self.enableedit) {
                    plugins.push('contextmenu') // right menu
                    plugins.push('dnd') // drag & drop
                        //plugins.push('unique') // unique name
                    contextmenu.items = self.contextMenuItemsSet
                    contextmenu.show_at_node = false
                }
                $('#' + self._innerId).jstree({
                    'plugins': plugins,
                    'contextmenu': contextmenu,
                    'types': {
                        'default': {
                            'icon': 'fa fa-folder'
                        },
                        'html': {
                            'icon': 'fa fa-file-code-o'
                        },
                        'svg': {
                            'icon': 'fa fa-file-picture-o'
                        },
                        'css': {
                            'icon': 'fa fa-file-code-o'
                        },
                        'img': {
                            'icon': 'fa fa-file-image-o'
                        },
                        'js': {
                            'icon': 'fa fa-file-text-o'
                        }
                    },
                    'core': {
                        "multiple": self.showcheckbox ? true : false, // multiple select
                        "check_callback": self.enableedit ? true : false, // right click contextmenu
                        "animation": true, // no use now
                        "data": self._data
                    },
                    'sort': function(a, b) {
                        return this.get_node(a).original.orderIndex && this.get_node(b).original.orderIndex ? (this.get_node(a).original.orderIndex > this.get_node(b).original.orderIndex ? 1 : -1) : (this.get_type(a) === this.get_type(b) ? (this.get_text(a) > this.get_text(b) ? 1 : -1) : this.get_type(a) >= this.get_type(b))
                    }
                }).on("loaded.jstree", function(e, data) {
                    self.loadedEvent()
                }).on("changed.jstree", function(e, data) {
                    self.nodeSelectedEvent(data)
                }).on("create_node.jstree", function(e, data) {
                    self.nodeAddEvent(data)
                }).on("rename_node.jstree", function(e, data) {
                    self.nodeUpdateEvent(data)
                }).on("move_node.jstree", function(e, data) {
                    self.nodeUpdateEvent(data)
                }).on("delete_node.jstree", function(e, data) {
                    self.nodeDeleteEvent(data)
                }).on("copy_node.jstree", function(e, data) {
                    self.nodeAddEvent(data)
                }).on("cut.jstree", function(e, data) {})
            },
            contextMenuItemsSet() {
                let items = {
                    "create": {
                        "separator_before": false,
                        "separator_after": false,
                        "label": "新增",
                        "action": false,
                        "submenu": {
                            "create1": {
                                "separator_before": false,
                                "separator_after": false,
                                "label": "新增同级",
                                "action": function(data) {
                                    let inst = $.jstree.reference(data.reference),
                                        obj = inst.get_node(data.reference)
                                    inst.create_node(obj, {}, "after", function(new_node) {
                                        setTimeout(function() {
                                            inst.edit(new_node)
                                        }, 0)
                                    })
                                }
                            },
                            "create2": {
                                "separator_before": false,
                                "separator_after": false,
                                "label": "新增子级",
                                "action": function(data) {
                                    let inst = $.jstree.reference(data.reference),
                                        obj = inst.get_node(data.reference)
                                    inst.create_node(obj, {}, "last", function(new_node) {
                                        setTimeout(function() {
                                            inst.edit(new_node)
                                        }, 0)
                                    })
                                }
                            }
                        }
                    },
                    "rename": {
                        "separator_before": false,
                        "separator_after": false,
                        "label": "重命名",
                        "action": function(data) {
                            let inst = $.jstree.reference(data.reference),
                                obj = inst.get_node(data.reference)
                            inst.edit(obj)
                        }
                    },
                    "remove": {
                        "separator_before": false,
                        "separator_after": false,
                        "label": "删除",
                        "action": function(data) {
                            if (confirm("确定删除选中节点?")) {
                                let inst = $.jstree.reference(data.reference),
                                    obj = inst.get_node(data.reference)
                                if (inst.is_selected(obj)) {
                                    inst.delete_node(inst.get_selected()) // what case?
                                } else {
                                    inst.delete_node(obj)
                                }
                            }
                        }
                    },
                    "ccp": {
                        "separator_before": true,
                        "separator_after": false,
                        "label": "编辑",
                        "action": false,
                        "submenu": {
                            "copy": {
                                "separator_before": false,
                                "icon": false,
                                "separator_after": false,
                                "label": "复制",
                                "action": function(data) {
                                    var inst = $.jstree.reference(data.reference),
                                        obj = inst.get_node(data.reference);
                                    if (inst.is_selected(obj)) {
                                        inst.copy(inst.get_top_selected());
                                    } else {
                                        inst.copy(obj);
                                    }
                                }
                            },
                            "cut": {
                                "separator_before": false,
                                "separator_after": false,
                                "label": "剪切",
                                "action": function(data) {
                                    var inst = $.jstree.reference(data.reference),
                                        obj = inst.get_node(data.reference);
                                    if (inst.is_selected(obj)) {
                                        inst.cut(inst.get_top_selected());
                                    } else {
                                        inst.cut(obj);
                                    }
                                }
                            },
                            "paste": {
                                "separator_before": false,
                                "icon": false,
                                "_disabled": function(data) {
                                    return !$.jstree.reference(data.reference).can_paste();
                                },
                                "separator_after": false,
                                "label": "粘贴",
                                "action": function(data) {
                                    var inst = $.jstree.reference(data.reference),
                                        obj = inst.get_node(data.reference);
                                    inst.paste(obj);
                                }
                            }
                        }
                    }
                }
                return items
            },
            loadedEvent() {
                if (this._data) {
                    let selectedNodes = []
                    for (let value of this._data) {
                        if (value && value.state) {
                            let isSelected = value.state.selected ? value.state.selected : false
                            if (isSelected) {
                                let selectedNode = {
                                    "id": value.id,
                                    "parentId": value.parent,
                                    "text": value.text,
                                    "value": value.value
                                }
                                selectedNodes.push(selectedNode)
                            }
                        }
                    }
                    let $detail = {
                        "selectedNodes": selectedNodes
                    }
                    if (this.onloaded) {
                        if (this.id) {
                            this.onloaded(soModels.getReturnModel(this._id, $detail))
                        } else {
                            this.onloaded($detail)
                        }
                    }
                }
            },
            nodeSelectedEvent(data) {
                if (data.selected) { // get selected node 
                    $("#" + this._id)[0].setAttribute("selection", data.selected) // set arrtribute selection
                }
                if (data.action == "select_node" || data.action == "deselect_node") {
                    let $detail = {}
                    if (!!data.node) {
                        let activeNode = data.node
                        $detail.activeNode = {
                            "id": activeNode.id,
                            "parentId": activeNode.parent == "#" ? null : activeNode.parent,
                            "text": activeNode.text,
                            "value": activeNode.original.value,
                            "state": {
                                "opened": activeNode.state.opened,
                                "selected": activeNode.state.selected
                            }
                        }
                    }
                    if (data.selected) {
                        let selectedID = data.selected,
                            selectedNodes = []
                        for (let id of selectedID) {
                            for (let value of this._data) {
                                if (id.toString() == value.id.toString()) {
                                    selectedNodes.push({
                                        "id": value.id.toString(),
                                        "parentId": value.parent.toString() == "#" ? null : value.parent.toString(),
                                        "text": value.text,
                                        "value": value.value,
                                        "state": value.state ? {
                                            "opened": value.state.opened,
                                            "selected": true
                                        } : null
                                    })
                                }
                            }
                        }
                        $detail.selectedNodes = selectedNodes
                    }
                    if (this.onnodeselected) {
                        if (this.id) {
                            this.onnodeselected(soModels.getReturnModel(this._id, $detail))
                        } else {
                            this.onnodeselected($detail)
                        }
                    }
                }
            },
            nodeAddEvent(data) {
                let $detail = {
                    "newNode": {
                        "id": data.node.id,
                        "parentId": data.node.parent,
                        "text": data.node.text,
                        "value": data.node.text,
                        "state": {
                            "selected": true,
                            "opened": true
                        }
                    }
                }
                if (this.onadd) {
                    if (this.id) {
                        let newId = this.onadd(soModels.getReturnModel(this._id, $detail))
                        if (newId) {
                            data.instance.set_id(data.node, newId)
                        } else {
                            data.instance.refresh()
                        }
                    } else {
                        this.onadd($detail)
                    }
                }
            },
            nodeUpdateEvent(data) {
                let $detail = {
                    "newNode": {
                        "id": data.node.id,
                        "parentId": data.node.parent != "#" ? data.node.parent : null,
                        "text": data.node.text,
                        "value": data.node.text,
                        "state": {
                            "selected": data.node.state ? data.node.state.selected : false,
                            "opened": data.node.state ? data.node.state.opened : false
                        }
                    },
                    "originalNode": {
                        "id": data.node.id,
                        "parentId": data.old_parent ? data.old_parent != "#" ? data.old_parent : null : data.node.parent != "#" ? data.node.parent : null,
                        "text": data.old ? data.old : data.node.text,
                        "value": data.old ? data.old : data.node.text,
                        "state": {
                            "selected": data.node.state ? data.node.state.selected : false,
                            "opened": data.node.state ? data.node.state.opened : false
                        }
                    }
                }
                if (this.onupdate) {
                    if (this.id) {
                        let isSuccess = this.onupdate(soModels.getReturnModel(this._id, $detail))
                        if (!isSuccess) {
                            data.instance.refresh()
                        }
                    } else {
                        this.onupdate($detail)
                    }
                }
            },
            nodeDeleteEvent(data) {
                let temp = data.node.children ? data.node.children : []
                temp.unshift(data.node.id)
                let $detail = {
                    "id": temp
                }
                if (this.ondelete) {
                    if (this.id) {
                        let isSuccess = this.ondelete(soModels.getReturnModel(this._id, $detail))
                        if (!isSuccess) {
                            data.instance.refresh()
                        }
                    } else {
                        this.ondelete($detail)
                    }
                }
            },
            nodeEditEvent(data) {
                let $detail = {
                    "newNode": {
                        "id": data.node.id,
                        "parentId": data.node.parent,
                        "text": data.node.text,
                        "value": data.node.text,
                        "state": {
                            "selected": true,
                            "opened": true
                        }
                    }
                }
                if (this.onadd) {
                    if (this.id) {
                        let newId = this.onadd(soModels.getReturnModel(this._id, $detail))
                        if (newId) {
                            data.instance.set_id(data.node, newId)
                        } else {
                            data.instance.refresh()
                        }
                    } else {
                        this.onadd($detail)
                    }
                }
            },
        },
        beforeMount() {
            if (this.id) {
                this._id = this.id
            } else {
                this._id = "tree-" + Date.now()
            }
            this._innerId = this._id + "-in-" + Date.now()
        },
        mounted() {
            this.treeCreate()
        }
    }
</script>

<style>
    .tree-default-style {
        font-size: 13px;
        color: #676a6c;
    }
    
    .jstree-open>.jstree-anchor>.fa-folder:before {
        content: "\f07c";
    }
    
    .jstree-default .jstree-icon.none {
        width: 0;
    }
    
    .fa {
        display: inline-block;
        font: normal normal normal 14px/1 FontAwesome;
        font-size: inherit;
        text-rendering: auto;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    
    .fa-folder:before {
        content: "\f07b";
    }
</style>