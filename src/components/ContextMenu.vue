<template>
	<div v-if="showMenu" :style="{
      position: 'absolute',
      top: `${menuStyle.top}px`,
      left: `${menuStyle.left}px`,
      zIndex: 1000,
      backgroundColor: 'white',
      border: '1px solid #ccc',
      boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.1)',
    }" id="contextMenu" class="context-menu">
		<ul>
			<li @click="addNode"><i class="el-icon-plus"></i> 添加节点 </li>
			<!-- <li @click="copyNode"><i class="el-icon-document-copy"></i> 复制节点 </li> -->
			<li @click="editNode"><i class="el-icon-edit"></i> 编辑节点 </li>
			<li @click="deleteNode"><i class="el-icon-delete"></i> 删除节点 </li>
			<li @click="executeNode"><i class="el-icon-video-play"></i> 执行节点 </li>
			<hr />
			<li v-permission="permission.save" @click="saveCanvas"><i class="el-icon-document"></i> 保存画布 </li>
			<li @click="loadCanvas"><i class="el-icon-folder-opened"></i> 读取画布 </li>
			<li @click="centerGraph"><i class="el-icon-position"></i> 居中画布 </li>
			<li @click="fullScreen"><i class="el-icon-full-screen"></i> 全屏画布 </li>
			<li @click="clearGraph"><i class="el-icon-delete"></i> 清空画布 </li>
		</ul>
	</div>
</template>

<script>
	export default {
		props: {
			showMenu: Boolean,
			menuStyle: Object
		},
		data() {
			return {
				permission: {
					save: ['admin', 'business:chain:save'],
				},
			};
		},
		emits: ['addNode', 'copyNode', 'editNode', 'deleteNode', 'executeNode'],
		methods: {
			addNode() {
				this.$emit('addNode');
			},
			copyNode() {
				this.$emit('copyNode');
			},
			editNode() {
				this.$emit('editNode');
			},
			deleteNode() {
				this.$emit('deleteNode');
			},
			executeNode() {
				this.$emit('executeNode');
			},
			saveCanvas() {
				this.$emit('saveCanvas');
			},
			loadCanvas() {
				this.$emit('loadCanvas');
			},
			centerGraph() {
				this.$emit('centerGraph');
			},
			clearGraph() {
				this.$emit('clearGraph');
			},
			fullScreen() {
				this.$emit('toggleFullscreen');
			}
		},
	};
</script>

<style scoped>
	.context-menu {
		padding: 10px;
		border-radius: 8px;
		background-color: #fff;
		border: 1px solid #ccc;
		box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
	}

	.context-menu ul {
		list-style-type: none;
		margin: 0;
		padding: 0;
	}

	.context-menu li {
		display: flex;
		align-items: center;
		padding: 8px 12px;
		cursor: pointer;
	}

	.context-menu li:hover {
		background-color: #f5f5f5;
	}

	.context-menu i {
		margin-right: 8px;
	}
</style>