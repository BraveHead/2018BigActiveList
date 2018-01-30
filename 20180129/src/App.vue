<template>
    <div id="app">
        <transition :name="transitionName">
            <router-view class="child-view"></router-view>
        </transition>
    </div>
</template>

<script>
    import store from './vuex/main'

    export default {
        name: 'app',
        store,
        data() {
            return {
                msg: 'Welcome to Your Vue.js App',
                transitionName: 'fade',
            }
        },
        watch: {
            '$route'(to, from) {
                //    console.log('现在路由:',to.path.split('/')[1],'来自路由:',from.path.split('/')[1],'现在的动画:',this.transitionName)
                const toDepth = to.path.split('/').length
                const fromDepth = from.path.split('/').length
                console.log(to.path, from.path)
                if ((to.path.indexOf('home') !== -1 || to.path === '/' ) && toDepth === 2) {
                    this.transitionName = 'slide-right';
                } else {
                    this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
                }
            }
        },
        methods: {
            activated: function () {
                this.$getGoIndex()
            },
        }
    }
</script>

<style lang="scss" scoped>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        width: 100%;
        height: 100%;
    }

    h1, h2 {
        font-weight: normal;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
</style>
