import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

let defaultToken = '';
try {
    defaultToken = localStorage.getItem('blog_token') || '';
} catch (err) {
    console.log(err);
}

const store = new Vuex.Store({
    state: {
        token: defaultToken,
        newsId: '',
        recruitId: ''
    },
    getters: {
        getToken: state => {
            //通过方法访问
            return state.token ? state.token : 'no';
        }
    },
    mutations: {
        changeNewsId(state, val) {
            state.newsId = val;
        },
        changeRecruitId(state, val) {
            state.recruitId = val;
        },
        changeToken(state, val) {
            state.token = val;
        }
    },
    actions: {}
});

export default store;
