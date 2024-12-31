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
