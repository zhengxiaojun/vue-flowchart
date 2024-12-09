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
			<li @click="addNode">添 加</li>
			<li @click="copyNode">复 制</li>
			<li @click="editNode">编 辑</li>
			<li @click="deleteNode">删 除</li>
			<li @click="deleteNode">执 行</li>
		</ul>
	</div>
</template>

<script>
	export default {
		props: {
			showMenu: Boolean,
			menuStyle: Object
		},
		emits: ['addNode', 'copyNode', 'editNode', 'deleteNode'],
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
		},
	};
</script>

<style>
</style>