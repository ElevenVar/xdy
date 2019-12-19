<template>
	<web-view :src="src"></web-view>
</template>

<script>
	export default {
		data() {
			return {
				src: this.$store.state.webViewUrl
			}
		}
	}
</script>

<style lang="scss">

</style>
