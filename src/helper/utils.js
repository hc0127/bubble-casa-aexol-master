export const createDebounce = () => {
	let timeout = null;
	return (fnc, delayMs) => {
		clearTimeout(timeout);
		timeout = setTimeout(() =>{
			fnc();
		}, delayMs || 500)
	}
}
