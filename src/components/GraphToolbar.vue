<template>
	<div class="toolbar">
		<!-- <el-button type="primary" @click="addNode">添加节点</el-button> -->
		<!-- <el-button type="primary" @click="alignNodes">对齐节点</el-button> -->
		<!-- <el-button type="primary" @click="undo" :disabled="!canUndo">撤销</el-button> -->
		<!-- <el-button type="primary" @click="redo" :disabled="!canRedo">重做</el-button> -->
		<el-button type="primary" @click="loadCanvas">读取数据</el-button>
		<!-- <el-button type="primary" @click="saveCanvas">保存画布</el-button> -->
		<el-button type="primary" @click="centerGraph">居中画布</el-button>
		<el-button type="primary" @click="clearGraph">清空画布</el-button>
	</div>
</template>

<script>
	export default {
		name: "GraphToolbar",
		props: {
			canUndo: {
				type: Boolean,
				default: false
			},
			canRedo: {
				type: Boolean,
				default: false
			}
		},
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