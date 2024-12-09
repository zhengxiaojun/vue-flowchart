<template>
	<div id="app">
		<GraphCanvas ref="graphCanvas" />
	</div>
</template>

<script>
	import GraphCanvas from "./components/GraphCanvas.vue";

	export default {
		name: "App",
		components: {
			GraphCanvas,
		}
	};
</script>

<style>
	@import "./styles.css";
</style>