import { ref } from 'vue';
import { requestFailError, serverError } from '../helper/notifications';

export const useFetch = (type) => {
	const loading = ref(false);
	const loading_fetch = ref(false);

	const fetchData = async (promiseFunc, type) => {
		const checkType = (status) => {
			if (type === 'fetch') {
				loading_fetch.value = status;
			} else {
				loading.value = status;
			}
		}

		try {
			checkType(true)
			const res = await promiseFunc();

			if (!res.success) {
				requestFailError(res.error)
			}
			checkType(false)
			return res

		} catch (e) {
			checkType(false)
			serverError(e);
		}
	}

	return {
		loading,
		loading_fetch,
		fetchData
	}
}
