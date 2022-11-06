import { reactive, toRefs } from 'vue';

const store = {
	state: reactive({
		popup: null
	}),

	getState() {
		return toRefs(this.state)
	},

	triggerPopup(name) {
		this.state.popup = name
	}
}

export default store;
