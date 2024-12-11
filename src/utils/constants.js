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
		stroke: "#070707", // #1890ff
		strokeWidth: 1,
		// strokeDasharray: "5,5",
		targetMarker: {
			name: "classic", // 终点箭头样式
			size: 8, // 箭头大小
			fill: '#FF0000', // 箭头填充颜色
		},
	}
};

export const DEFAULT_TOOL_ATTRS = [
	// {
	// 	name: 'segments', // 用于调整边的中间点
	// },
	// {
	// 	name: 'source-arrowhead', // 用于拖动起点
	// },
	{
		name: 'target-arrowhead', // 用于拖动终点
		args: {
			attrs: {
				d: 'M -3 -4 3 0 -3 4 Z',
				// fill: '#333',
				// stroke: '#fff',
				'stroke-width': 0,
				// cursor: 'move'
			},
		},
	},
];

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
	pannable: true,
	pageVisible: true, // 画布边界可见
	pageBreak: true, // 显示页面分隔线
	autoResize: true, // 自动调整大小
}

export const DEFAULT_PANNING = {
	enabled: true, // 启用平移
	eventTypes: ['leftMouseDown'] // 平移事件类型
}

export const DEFAULT_MOUSEWHEEL = {
	enabled: true, // 启用鼠标滚轮缩放
	zoomAtMousePosition: true, // 以鼠标位置为中心缩放
	// modifiers: ['ctrl'] // 缩放时需要按住 Ctrl 键（可以去掉以不需要修饰键）
}

export const DEFAULT_SNAPLINE = {
	enabled: true, // 启用 snapline
	sharp: true, // 可选：让 snapline 更加明显
	radius: 30, // 调整吸附半径，避免吸附过于敏感或不明显
}