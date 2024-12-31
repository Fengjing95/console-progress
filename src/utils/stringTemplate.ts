/**
 * 格式化字符串模板
 * @param template 字符串模板
 * @param data 插入的数据
 */
export function formatStringTemplate(template: string, data: Record<string, string | number>) {
	return template.replace(/{(\w+)}/g, (match: string, key: string) =>
		// 如果data中没有对应的key，则保留原始的占位符
		key in data ? data[key] + '' : match
	)
}
