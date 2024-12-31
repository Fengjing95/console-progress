/**
 * 清除对象中的 undefined 值
 * @param obj 目标对象
 */
export function cleanObject(obj: Record<string, unknown>) {
	for (const key in obj) {
		if (obj[key] === undefined) {
			delete obj[key]
		}
	}
}

/**
 * 判断是否为 HEX 颜色值
 * @param hex 颜色值
 */
export function isHEX(hex: string) {
	return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex)
}
