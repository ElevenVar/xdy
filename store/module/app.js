export default {
    state: {
       wxCode: '',
	   payUrl: ''
    },
    mutations: { 
        SET_WXCODE(state,val){
			state.wxCode = val
		},
		SET_PAYURL(state,url){
			state.payUrl = url
		}
    },
    getters: {

    },
    actions: {

    }
}