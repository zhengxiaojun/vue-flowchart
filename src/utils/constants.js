// 常量文件

export const DEFAULT_PORTS = {
	top: {
		position: "top",
		attrs: {
			circle: {
				r: 8,
				magnet: true,
				fill: "#00bcd4", // 优化端口颜色
				stroke: "#ffffff", // 白色边框
				strokeWidth: 2,
				style: {
					visibility: "hidden",
				},
			},
		},
	},
	bottom: {
		position: "bottom",
		attrs: {
			circle: {
				r: 8,
				magnet: true,
				fill: "#00bcd4", // 优化端口颜色
				stroke: "#ffffff", // 白色边框
				strokeWidth: 2,
				style: {
					visibility: "hidden",
				},
			},
		},
	},
	left: {
		position: "left",
		attrs: {
			circle: {
				r: 8,
				magnet: true,
				fill: "#00bcd4", // 优化端口颜色
				stroke: "#ffffff", // 白色边框
				strokeWidth: 2,
				style: {
					visibility: "hidden",
				},
			},
		},
	},
	right: {
		position: "right",
		attrs: {
			circle: {
				r: 8,
				magnet: true,
				fill: "#00bcd4", // 优化端口颜色
				stroke: "#ffffff", // 白色边框
				strokeWidth: 2,
				style: {
					visibility: "hidden",
				},
			},
		},
	},
};

export const DEFAULT_NODE_ATTRS = {
	body: {
		fill: "rgba(58,184,129,.5)", // 轻盈的背景色
		stroke: "#00796b", // 深绿色边框
		rx: 10, // 圆角矩形
		ry: 10, // 圆角矩形
	},
	label: {
		fontSize: 16, // 更适中的字体大小
		fontFamily: "Arial, sans-serif", // 简洁的字体
		fill: "#1d1d1f", // 标签文字颜色
		textWrap: {
			width: -10, // 自动换行
			ellipsis: true, // 超出显示省略号
		},
	},
};

export const DEFAULT_EDGE_ATTRS = {
	line: {
		stroke: "#1890ff",
		strokeWidth: 2,
		// strokeDasharray: "5,5",
		targetMarker: {
			name: "classic",
			size: 6
		}
	}
};

export const DEFAULT_HIGHLIGHT = {
	magnetAvailable: {
		name: "stroke",
		args: {
			padding: 2,
			attrs: {
				strokeWidth: 2,
				stroke: "#ffffff",
				fill: "#00bcd4"
			}
		}
	}
};

export const DEFAULT_SCROLLER = {
	enabled: true, // 启用滚动
	pageVisible: true, // 画布边界可见
	pageBreak: true, // 显示页面分隔线
	autoResize: true, // 自动调整大小
	padding: 10, // 设置边距
	minimap: {
		enabled: true, // 启用小地图
		container: document.createElement('div'), // 创建容器
		width: 150, // 小地图的宽度
		height: 150, // 小地图的高度
		scaleFactor: 0.1, // 缩放比例
		viewportStyle: { // 设置视口样式
			border: '1px solid #000',
			backgroundColor: 'rgba(0, 0, 0, 0.1)',
		}
	}
}

export const DEFAULT_PANNING = {
	enabled: true, // 启用平移
	eventTypes: ['leftMouseDown'] // 平移事件类型
}

export const DEFAULT_MOUSEWHEEL = {
	enabled: true, // 启用鼠标滚轮缩放
	zoomAtMousePosition: true, // 以鼠标位置为中心缩放
	modifiers: ['ctrl'] // 缩放时需要按住 Ctrl 键（可以去掉以不需要修饰键）
}

export const DEFAULT_SNAPLINE = {
	enabled: true, // 启用 snapline
	sharp: true, // 可选：让 snapline 更加明显
	radius: 30, // 调整吸附半径，避免吸附过于敏感或不明显
}