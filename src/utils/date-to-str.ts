function padding(num: number): string {
	return num < 10 ? `0${num}` : num.toString();
}

export function DateToStr(date: Date): string {
	return `${date.getFullYear()}-${padding(date.getMonth() + 1)}-${padding(date.getDate())}`;
}
