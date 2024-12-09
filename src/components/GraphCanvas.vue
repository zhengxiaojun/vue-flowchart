<template>
	<div id="graph-app">
		<!-- 工具按钮 -->
		<GraphToolbar :graph="graph" @add-node="addNode" @align-nodes="alignNodes" @undo="undo" @redo="redo"
			@save-canvas="saveCanvas" @load-canvas="loadCanvas" @center-graph="centerGraph" @clear-graph="clearGraph" />
		<!-- 删除连接线按钮 -->
		<button v-if="showDeleteEdgeButton" :style="deleteEdgeButtonStyle" @click="deleteEdge" class="delete-edge-btn">
			删除
		</button>
		<!-- 画布 -->
		<div class="canvas-container" ref="canvas"></div>
		<!-- 画布地图 -->
		<!-- <div id="minimap"></div> -->
		<!-- 右键菜单 -->
		<ContextMenu :showMenu="showContextMenu" :menuStyle="contextMenuPosition"
			@addNode="addNodeAtContextMenuPosition" @copyNode="copyNode" @editNode="editNode"
			@deleteNode="deleteNode" />
	</div>
</template>

<script>
	import GraphToolbar from "./GraphToolbar";
	import ContextMenu from "./ContextMenu";
	import {
		Graph
	} from "@antv/x6";
	import {
		DEFAULT_PORTS,
		DEFAULT_NODE_ATTRS,
		DEFAULT_EDGE_ATTRS,
		DEFAULT_HIGHLIGHT,
		DEFAULT_SCROLLER,
		DEFAULT_PANNING,
		DEFAULT_MOUSEWHEEL,
		DEFAULT_SNAPLINE
	} from "@/utils/constants.js";
	import {
		HistoryManager
	} from "@/utils/history.js";

	import {
		deepClone
	} from "@/utils/utils.js";

	export default {
		name: "GraphCanvas",
		components: {
			GraphToolbar,
			ContextMenu
		},
		data() {
			return {
				graph: null,
				selectedNode: null,
				selectedEdge: null,
				historyManager: null,
				showContextMenu: false,
				showDeleteEdgeButton: false,
				contextMenuPosition: {
					top: 0,
					left: 0
				},
				deleteEdgeButtonStyle: {
					top: '0px',
					left: '0px'
				}
			};
		},
		mounted() {
			this.initGraph();
			this.resizeCanvas();
			window.addEventListener("resize", this.resizeCanvas);
		},
		beforeDestroy() {
			if (this.graph) {
				this.graph.off();
				this.graph.dispose();
			}
			window.removeEventListener("resize", this.resizeCanvas);
		},
		methods: {
			// 初始化画布
			initGraph() {
				const that = this;
				this.graph = new Graph({
					container: this.$refs.canvas,
					width: this.$refs.canvas.parentNode.offsetWidth,
					height: this.$refs.canvas.parentNode.offsetHeight,
					grid: true,
					background: {
						color: '#e9edf0'
					},
					highlighting: DEFAULT_HIGHLIGHT,
					scroller: DEFAULT_SCROLLER,
					panning: DEFAULT_PANNING,
					mousewheel: DEFAULT_MOUSEWHEEL,
					snapline: DEFAULT_SNAPLINE,
					connecting: {
						snap: {
							radius: 20
						},
						allowBlank: false,
						allowLoop: false,
						highlight: true,
						connectionPoint: "boundary",
						anchor: "center",
						createEdge() {
							return that.graph.createEdge({
								connector: {
									name: 'rounded', // 修改为 rounded，使连接线变弯曲									
								},
								router: {
									name: 'manhattan', // 使用 manhattan 路由器对齐端口									
								},
								attrs: DEFAULT_EDGE_ATTRS
							});
						},
						validateConnection({
							sourceView,
							targetView,
							sourceMagnet,
							targetMagnet
						}) {
							if (!sourceMagnet || !targetMagnet || sourceView === targetView) return false;
							return true;
						}
					}
				});
				// 初始化历史管理器
				this.historyManager = new HistoryManager(this.graph);

				// 绑定所有事件
				this.bindGraphEvents();

				// 获取canvas-container并将小地图容器绑定到它
				const canvasContainer = this.$refs.canvas;
				const minimapContainer = this.graph.options.scroller.minimap.container;
				canvasContainer.appendChild(minimapContainer); // 将小地图添加到canvas容器中
			},
			// 绑定画布事件
			bindGraphEvents() {
				// 定义事件与对应处理函数的映射
				const events = {
					"node:contextmenu": ({
							e,
							node
						}) =>
						this.handleContextMenu(e, {
							type: "node",
							data: node
						}), // 右键菜单事件		            
					"blank:contextmenu": (e) => this.handleContextMenu(e), // 右键菜单事件
					"blank:click": this.closeContextMenu, // 点击空白处关闭右键菜单
					"edge:click": ({
						edge,
						e
					}) => this.handleEdgeClick({
						edge,
						e
					}), // 连接线点击事件
					"node:dblclick": ({
						node
					}) => this.handleDoubleClick(node), // 监听节点双击事件
					"node:mouseenter": ({
						node
					}) => this.togglePortVisibility(node, true), // 鼠标移入节点时显示端口
					"node:mouseleave": ({
						node
					}) => this.togglePortVisibility(node, false), // 鼠标移出节点时隐藏端口
				};

				// 遍历映射表并绑定事件
				Object.entries(events).forEach(([event, handler]) =>
					this.graph.on(event, handler)
				);
			},
			// 切换端口可见性
			togglePortVisibility(node, isVisible) {
				const visibility = isVisible ? "visible" : "hidden";
				node.getPorts().forEach(port => {
					node.portProp(port.id, "attrs/circle/style", {
						visibility
					});
				});
			},
			// 撤销
			undo() {
				this.historyManager.undo();
			},
			// 重做
			redo() {
				this.historyManager.redo();
			},
			// 保存画布
			saveCanvas() {
				const data = this.graph.toJSON();
				localStorage.setItem("canvasData", JSON.stringify(data));
				console.log("Canvas data saved to local storage.");
			},
			// 读取画布
			loadCanvas() {
				const data = localStorage.getItem("canvasData");
				if (data) {
					this.graph.fromJSON(JSON.parse(data));
					console.log("Canvas data loaded from local storage.");
				} else {
					console.log("No canvas data found in local storage.");
				}
			},
			// 居中画布
			centerGraph() {
				this.graph.centerContent();
			},
			// 清空画布
			clearGraph() {
				this.graph.clearCells();
			},
			// 右键菜单-添加节点功能
			addNodeAtContextMenuPosition() {
				this.addNode(this.contextMenuPosition.left, this.contextMenuPosition.top);
				this.showContextMenu = false;
			},
			// 添加节点
			addNode(x = 100, y = 100) {
				try {
					this.graph.addNode({
						x,
						y,
						width: 100,
						height: 60,
						label: "新节点",
						attrs: DEFAULT_NODE_ATTRS,
						ports: {
							items: ["top", "bottom", "left", "right"].map(id => ({
								id,
								group: id
							})),
							groups: DEFAULT_PORTS
						},
						data: {
							name: 111,
							age: 30
						}
					});
				} catch (error) {
					alert(error.message);
				} finally {
					this.closeContextMenu();
				}
			},
			// 对齐节点
			alignNodes() {
				try {
					const nodes = this.graph.getNodes();
					const gridSize = 20; // Adjust the grid size as needed

					nodes.forEach(node => {
						const position = node.position();
						const alignedX = Math.round(position.x / gridSize) * gridSize;
						const alignedY = Math.round(position.y / gridSize) * gridSize;
						node.position(alignedX, alignedY);
					});

					this.historyManager.saveAction(); // Save the action to history
				} catch (error) {
					alert(error.message);
				} finally {
					this.closeContextMenu();
				}
			},
			// 复制节点
			copyNode() {
				try {
					if (!this.selectedNode) throw new Error("请选择一个节点进行操作");
					const node = deepClone(this.selectedNode).data;
					console.log(node)
					node.id = `node-copy-${Date.now()}`;
					node.position.x += 50;
					node.position.y += 50;
					this.graph.addNode(node);
				} catch (error) {
					alert(error.message);
				} finally {
					this.closeContextMenu();
				}
			},
			// 编辑节点
			async editNode() {
				try {
					if (!this.selectedNode) throw new Error("请选择一个节点进行操作");
					console.log(this.selectedNode)
					const newText = prompt("编辑节点文本:", this.selectedNode.data.attr("label/text"));
					if (newText !== null) {
						this.selectedNode.data.attr("label/text", newText);
						this.selectedNode.data.attr("text/text", newText);
					}
				} catch (error) {
					alert(error.message);
				} finally {
					this.closeContextMenu();
				}
			},
			// 删除节点
			deleteNode() {
				try {
					if (!this.selectedNode) throw new Error("请选择一个节点进行操作");
					this.graph.removeNode(this.selectedNode.data);
					this.selectedNode = null;
				} catch (error) {
					alert(error.message);
				} finally {
					this.closeContextMenu();
				}
			},
			// 右键菜单显示			
			handleContextMenu(e, node = null) {
				const ele = e.e || e;
				ele.preventDefault();
				const {
					clientX,
					clientY
				} = ele;
				this.selectedNode = node;
				this.contextMenuPosition = {
					top: clientY,
					left: clientX
				};
				this.showContextMenu = true;
			},
			// 关闭右键菜单
			closeContextMenu() {
				this.showContextMenu = false;
				this.showDeleteEdgeButton = false;
				this.historyManager.saveAction();
			},
			// 双击节点事件
			handleDoubleClick(node) {
				const currentData = node.getData();
				const newData = prompt("修改节点的数据（当前数据: " + JSON.stringify(currentData) + "）", JSON.stringify(currentData));

				if (newData !== null) {
					try {
						const parsedData = JSON.parse(newData);
						node.setData(parsedData); // 更新节点的数据
						console.log("节点数据已更新：", parsedData);
					} catch (e) {
						alert("无效的数据格式！");
					}
				}
			},
			// 连接线点击
			handleEdgeClick({
				edge,
				e
			}) {
				this.selectedEdge = edge;
				this.showDeleteEdgeButton = true;
				this.deleteEdgeButtonStyle = {
					top: `${e.clientY}px`,
					left: `${e.clientX}px`
				};
			},
			// 删除连接线
			deleteEdge() {
				try {
					if (this.selectedEdge) {
						this.graph.removeEdge(this.selectedEdge);
						this.showDeleteEdgeButton = false;
						this.selectedEdge = null;
					}
				} catch (error) {
					alert(error.message);
				} finally {
					this.closeContextMenu();
				}
			},
			// 重新计算画布尺寸
			resizeCanvas() {
				const canvas = this.$refs.canvas;
				if (canvas && this.graph) {
					const newWidth = canvas.parentNode.offsetWidth || 800; // 宽度默认值
					const newHeight = canvas.parentNode.offsetHeight || 600; // 高度默认值
					this.graph.resize(newWidth, newHeight); // 更新画布尺寸

					// 重新设置小地图的尺寸，以适应新的画布大小
					const minimapContainer = this.graph.options.scroller.minimap.container;
					minimapContainer.style.width = `${newWidth * 0.1}px`; // 小地图的宽度为画布宽度的10%
					minimapContainer.style.height = `${newHeight * 0.1}px`; // 小地图的高度为画布高度的10%
				} else {
					console.error('Canvas container not found or graph not initialized.');
				}
			}
		},
	};
</script>

<style>
</style>