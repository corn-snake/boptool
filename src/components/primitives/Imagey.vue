<template>
	<div>
		<img :src="reffed" />
	</div>
</template>
<script>
	export default {
		props: ["reffed"],
	};
</script>
<style scoped>
	img {
		max-height: inherit;
		border-radius: 2em;
	}
</style>
