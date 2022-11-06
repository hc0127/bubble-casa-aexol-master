import { notify } from "@kyvg/vue3-notification";
import { error } from "../api/callApi.js"

export const serverError = (e) => {
	//todo add redirect to error info page
	notify({
		title: 'Something went wrong',
		type: 'error'
	})
	console.error(e)
}

export const requestFailError = (e) => {
	const errorMsg = error.value[e] ? error.value[e] : e
	notify({
		title: `Request failed. Status code: ${errorMsg}`,
		type: 'error'
	})
}
