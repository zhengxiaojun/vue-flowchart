<template>
	<div class="toolbar">
		<button @click="addNode">添加节点</button>
		<button @click="alignNodes">对齐节点</button>
		<button @click="undo">撤销</button>
		<button @click="redo">重做</button>
		<button @click="loadCanvas">读取画布</button>
		<button @click="saveCanvas">保存画布</button>
		<button @click="centerGraph">居中画布</button>
		<button @click="clearGraph">清空画布</button>
	</div>
</template>

<script>
	export default {
		name: "GraphToolbar",
		methods: {
			addNode() {
				this.$emit("add-node");
			},
			alignNodes() {
                this.$emit("align-nodes");
            },
			undo() {
				this.$emit("undo");
			},
			redo() {
				this.$emit("redo");
			},
			saveCanvas() {
				this.$emit("save-canvas");
			},
			loadCanvas() {
				this.$emit("load-canvas");
			},
			centerGraph() {
				this.$emit("center-graph");
			},
			clearGraph() {
				this.$emit("clear-graph");
			},
		},
	};
</script>

<style>
</style>