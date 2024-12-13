<template>
	<div id="graph-app">
		<!-- 画布 -->
		<div class="canvas-container" ref="canvas"></div>

		<!-- 小地图 -->
		<div id="minimap" class="minimap"></div>

		<!-- 右键菜单 -->
		<ContextMenu :showMenu="showContextMenu" :menuStyle="contextMenuPosition"
			@addNode="addNodeAtContextMenuPosition" @copyNode="copyNode" @editNode="editNode" @deleteNode="deleteNode"
			@saveCanvas="saveCanvas" @loadCanvas="loadCanvas" @centerGraph="centerGraph" @clearGraph="clearGraph"
			@toggleFullscreen="toggleFullscreen" />

		<!-- 删除连接线按钮 -->
		<el-button size="medium" v-if="showDeleteEdgeButton" :style="deleteEdgeButtonStyle" @click="deleteEdge"
			class="delete-edge-btn el-icon-delete" />

		<!-- 工具按钮 -->
		<!-- <GraphToolbar :graph="graph" @add-node="addNode" @align-nodes="alignNodes" @undo="undo" @redo="redo"
			@save-canvas="saveCanvas" @load-canvas="loadCanvas" @center-graph="centerGraph" @clear-graph="clearGraph"
			:can-undo="canUndo" :can-redo="canRedo" /> -->

		<!-- 编辑节点 -->
		<el-drawer :visible.sync="editDrawerVisible" direction="rtl">
			<el-form :model="editForm" style="padding: 10px 20px;">
				<el-form-item label="节点名称" label-width="100">
					<el-input v-model="editForm.name"></el-input>
				</el-form-item>
				<el-form-item label="节点数据" label-width="100">
					<el-input type="textarea" :rows="20" v-model="editForm.data"></el-input>
				</el-form-item>
			</el-form>
			<div class="drawer-footer">
				<el-button @click="editDrawerVisible = false">取消</el-button>
				<el-button type="primary" @click="confirmEdit">确定</el-button>
			</div>
		</el-drawer>

	</div>
</template>

<script>
	import ContextMenu from "./ContextMenu";
	import {
		Graph
	} from "@antv/x6";
	import {
		Snapline
	} from '@antv/x6-plugin-snapline'
	import {
		MiniMap
	} from '@antv/x6-plugin-minimap'
	import {
		History
	} from '@antv/x6-plugin-history'
	import {
		Selection
	} from '@antv/x6-plugin-selection'
	import {
		Keyboard
	} from '@antv/x6-plugin-keyboard'
	import {
		Clipboard
	} from '@antv/x6-plugin-clipboard'


	import {
		DEFAULT_PORTS,
		DEFAULT_NODE_ATTRS,
		DEFAULT_TOOL_ATTRS,
		DEFAULT_HIGHLIGHT,
		DEFAULT_SCROLLER,
		DEFAULT_PANNING,
		DEFAULT_MOUSEWHEEL,
		DEFAULT_SNAPLINE
	} from "@/utils/constants.js";
	import {
		deepClone
	} from "@/utils/utils.js";

	export default {
		name: "GraphCanvas",
		components: {
			ContextMenu
		},
		data() {
			return {
				graph: null,
				selectedNode: null,
				selectedEdge: null,
				canRedo: false,
				canUndo: false,
				showContextMenu: false,
				showDeleteEdgeButton: false,
				isMouseInCanvas: false, // 是否鼠标在画布范围内
				contextMenuPosition: {
					top: 0,
					left: 0
				},
				deleteEdgeButtonStyle: {
					top: '0px',
					left: '0px'
				},
				editDrawerVisible: false,
				editForm: {
					name: '',
					data: ''
				}
			};
		},
		mounted() {
			this.initGraph();
			window.addEventListener("keydown", this.handleKeyDown); // 监听键盘事件
			// 绑定鼠标进入和离开事件
			const canvasContainer = this.$refs.canvas;
			canvasContainer.addEventListener("mouseenter", this.handleMouseEnterCanvas);
			canvasContainer.addEventListener("mouseleave", this.handleMouseLeaveCanvas);
		},
		beforeDestroy() {
			if (this.graph) {
				this.graph.off();
				this.graph.dispose();
			}
			window.removeEventListener("keydown", this.handleKeyDown); // 移除键盘事件监听
		},
		methods: {
			// 初始化画布
			initGraph() {
				this.graph = new Graph({
					container: this.$refs.canvas,
					autoResize: true,
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
					// interacting: false,  // 禁用连接线等功能
					// interacting: {
					// 	edgeMovable: true, // 边的起点和终点可拖动
					// 	vertexMovable: true, // 边的中间顶点可拖动
					// },
					connecting: {
						snap: {
							radius: 20
						},
						allowBlank: false, // 不允许连接到空白区域
						allowLoop: false, // 不允许连接到自身
						allowNode: true, // 是否允许连接到节点
						allowEdge: true, // 是否允许连接到边
						highlight: true,
						connectionPoint: "boundary",
						anchor: "center",
						createEdge() {
							return this.createEdge({
								connector: {
									name: 'rounded', // 修改为 rounded，使连接线变弯曲
								},
								router: {
									name: 'manhattan', // 替代 manhattan 的路由器
									args: {
										padding: 20, // 设置边的转角间距
									},
								},
								// attrs: DEFAULT_EDGE_ATTRS,
								tools: DEFAULT_TOOL_ATTRS
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

				// 历史插件
				this.graph.use(new History({
					enabled: true,
				}));

				// 对齐插件
				this.graph.use(new Snapline(DEFAULT_SNAPLINE));

				// 地图插件
				this.graph.use(new MiniMap({
					container: document.getElementById('minimap'),
					padding: 20, // 增加边距
					scaleFactor: 0.1, // 缩放比例
					width: 200, // 小地图宽度
					height: 150, // 小地图高度
					scalable: true, // 启用缩放适配
				}));

				// 快捷键插件
				this.graph.use(new Clipboard({
					enabled: true,
				}), )
				this.graph.use(new Selection({
					enabled: true,
					showNodeSelectionBox: true,
				}), )
				this.graph.use(new Keyboard({
					enabled: true,
					global: true,
				}), )

				// 绑定快捷键 ctrl+c 复制
				this.graph.bindKey('ctrl+c', () => {
					const cells = this.graph.getSelectedCells()
					if (cells.length) {
						this.graph.copy(cells)
					}
					return false
				});

				// 绑定快捷键 ctrl+v 粘贴
				this.graph.bindKey('ctrl+v', () => {
					if (!this.graph.isClipboardEmpty()) {
						const cells = this.graph.paste({
							offset: 32
						})
						this.graph.cleanSelection()
						this.graph.select(cells)
					}
					return false
				});

				// 绑定所有事件
				this.bindGraphEvents();
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
					"node:click": ({
						node
					}) => this.handleNodeClick(node), // 监听节点单击事件
					"node:dblclick": ({
						node
					}) => {
						this.handelNodeDblClick(node);
					}, // 双击节点事件
					"node:mouseenter": ({
						node
					}) => this.togglePortVisibility(node, true), // 鼠标移入节点时显示端口
					"node:mouseleave": ({
						node
					}) => this.togglePortVisibility(node, false), // 鼠标移出节点时隐藏端口
					"history:change": () => this.setHistoryState(), // 设置状态
				};

				// 遍历映射表并绑定事件
				Object.entries(events).forEach(([event, handler]) =>
					this.graph.on(event, handler)
				);
			},
			// 设置历史状态
			setHistoryState() {
				this.canRedo = this.graph.canRedo();
				this.canUndo = this.graph.canUndo();
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
				this.graph.undo();
			},
			// 重做
			redo() {
				this.graph.redo();
			},
			// 保存画布
			saveCanvas() {
				const data = this.graph.toJSON();
				localStorage.setItem("canvasData", JSON.stringify(data));
				console.log("Canvas data saved to local storage.");
				this.closeContextMenu();
			},
			// 读取画布
			loadCanvas() {
				const data = localStorage.getItem("canvasData");
				if (data) {
					this.graph.fromJSON(JSON.parse(data));
					this.centerGraph();
					this.graph.trigger('graph:updated'); // 触发更新
					console.log("Canvas data loaded from local storage.");
					this.closeContextMenu();
				} else {
					console.log("No canvas data found in local storage.");
				}
			},
			// 居中画布
			centerGraph() {
				this.graph.centerContent();
				this.closeContextMenu();
			},
			// 清空画布
			clearGraph() {
				this.graph.clearCells();
				this.closeContextMenu();
			},
			// 右键菜单-添加节点功能
			addNodeAtContextMenuPosition() {
				const {
					left,
					top
				} = this.contextMenuPosition;
				// 将页面坐标转换为画布坐标
				const point = this.graph.clientToLocal({
					x: left,
					y: top
				});
				this.addNode(point.x, point.y); // 使用画布坐标
				this.closeContextMenu();
			},
			// 添加节点
			addNode(x = 200, y = 200) {
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
					this.$message({
						message: error.message,
						type: 'warning'
					});
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
				} catch (error) {
					this.$message({
						message: error.message,
						type: 'error'
					});
				} finally {
					this.closeContextMenu();
				}
			},
			// 复制节点
			copyNode() {
				try {
					if (!this.selectedNode) throw new Error("请选择一个节点进行操作");
					const node = deepClone(this.selectedNode).data;
					node.id = `node-copy-${Date.now()}`;
					node.position.x += 50;
					node.position.y += 50;
					this.graph.addNode(node);
					this.$message({
						message: '节点复制成功',
						type: 'success'
					});
				} catch (error) {
					this.$message({
						message: error.message,
						type: 'warning'
					});
				} finally {
					this.closeContextMenu();
				}
			},
			// 编辑节点
			async editNode() {
				try {
					if (!this.selectedNode) throw new Error("请选择一个节点进行操作");
					// console.log(this.selectedNode);
					// this.$prompt('请输入节点文本', '提示', {
					// 	confirmButtonText: '确定',
					// 	cancelButtonText: '取消',
					// 	inputPattern: /.+/,
					// 	inputErrorMessage: '节点文本不能为空'
					// }).then(({
					// 	value
					// }) => {
					// 	this.selectedNode.data.attr("label/text", value);
					// 	this.selectedNode.data.attr("text/text", value);
					// 	this.$message({
					// 		type: 'success',
					// 		message: '节点文本已更新: ' + value
					// 	});
					// }).catch(() => {
					// 	this.$message({
					// 		type: 'info',
					// 		message: '取消输入'
					// 	});
					// });

					this.editDrawerVisible = true;
				} catch (error) {
					this.$message({
						message: error.message,
						type: 'warning'
					});
				} finally {
					this.closeContextMenu();
				}
			},
			// 删除节点
			deleteNode() {
				try {
					if (!this.selectedNode) throw new Error("请选择一个节点进行操作");
					if (this.selectedNode.id != null) {
						this.graph.removeNode(this.selectedNode.id);
					} else {
						this.graph.removeNode(this.selectedNode.data);
					}
					this.selectedNode = null;
				} catch (error) {
					this.$message({
						message: error.message,
						type: 'warning'
					});
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

				// 获取当前的画布变换状态（偏移和缩放）
				const canvasRect = this.$refs.canvas.getBoundingClientRect();
				this.contextMenuPosition = {
					top: clientY - canvasRect.top,
					left: clientX - canvasRect.left + 50
				};
				if (node != null) {
					this.selectedNode = node;
				}
				this.showContextMenu = true;
			},
			// 关闭右键菜单
			closeContextMenu() {
				this.selectedNode = null;
				this.selectedEdge = null;
				this.showContextMenu = false;
				this.showDeleteEdgeButton = false;
			},
			// 单击节点事件
			handleNodeClick(node) {
				this.selectedNode = node; // 保存选中的节点
				this.togglePortVisibility(node, false); // 隐藏端口
				// const nodeData = node.getData(); // 获取节点的附加数据
				// const nodeLabel = node.getLabel(); // 获取节点的标签
				// this.$message({
				//     message: `节点被点击！\n标签：${nodeLabel}\n数据：${JSON.stringify(nodeData)}`,
				//     type: "info"
				// });

				// 可选：修改选中节点的样式
				// node.attr("body/stroke", "#ff0000"); // 设置边框颜色为红色
				// node.attr("body/strokeWidth", 3); // 加粗边框
			},
			// 双击节点事件
			handelNodeDblClick(node) {
				this.selectedNode = node; // 保存选中的节点
				// this.editDrawerVisible = true; // 显示编辑
				this.$prompt('请输入节点文本', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputPattern: /.+/,
					inputErrorMessage: '节点文本不能为空'
				}).then(({
					value
				}) => {
					this.selectedNode.attr("label/text", value);
					this.selectedNode.attr("text/text", value);
					this.$message({
						type: 'success',
						message: '节点文本已更新: ' + value
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消输入'
					});
				});
				// window.getSelection().removeAllRanges(); // 清除选中的文本
			},
			// 确认更新
			confirmEdit() {
				try {
					const parsedData = JSON.parse(this.editForm.data);
					this.selectedNode.setLabel(this.editForm.name); // 更新节点名称
					this.selectedNode.attr("label/text", this.editForm.name); // 更新节点文本
					this.selectedNode.setData(parsedData); // 更新节点的数据
					console.log("节点数据已更新：", parsedData);
					this.$message({
						message: "节点数据已更新！",
						type: 'success'
					});
					this.editDrawerVisible = false;
				} catch (e) {
					this.$message({
						message: "无效的数据格式！",
						type: 'error'
					});
				}
			},
			// 连接线点击
			handleEdgeClick({
				edge
			}) {
				this.selectedEdge = edge;
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
			// 鼠标进入画布范围
			handleMouseEnterCanvas() {
				this.isMouseInCanvas = true;
			},
			// 鼠标离开画布范围
			handleMouseLeaveCanvas() {
				this.isMouseInCanvas = false;
			},
			// 按键事件
			handleKeyDown(event) {
				if (event.key === "Delete" && this.isMouseInCanvas && !this.editDrawerVisible) {
					if (this.selectedNode) {
						this.deleteNode(); // 删除选中的节点
					} else if (this.selectedEdge) {
						this.deleteEdge(); // 删除选中的边
					} else {
						console.log("未选中任何节点或连接线");
					}
				}
			},
			// 切换全屏
			toggleFullscreen() {
				const canvasContainer = this.$refs.canvas.parentNode; // 获取画布的父容器
				if (!document.fullscreenElement) {
					canvasContainer.requestFullscreen().catch(err => {
						console.error(`Error attempting to enable full-screen mode: ${err.message}`);
					});
				} else {
					document.exitFullscreen();
				}
				this.closeContextMenu();
			}
		}
	};
</script>

<style scoped>
	.drawer-footer {
		position: absolute;
		bottom: 10px;
		right: 10px;
	}
</style>