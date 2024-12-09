// 工具函数

export function deepClone(obj) {
	return JSON.parse(JSON.stringify(obj));
}