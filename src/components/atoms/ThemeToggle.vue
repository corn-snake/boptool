<script setup>
	const props = defineProps(["lt"]);
</script>
<template>
	<footer>
		<button @click="() => $emit('noon')">
			<div :class="['c', { right: !lt }]">
				<img
					:src="
						lt
							? 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Tonatiuhco.svg/1024px-Tonatiuhco.svg.png'
							: 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Metztli-Luna-Moon.png'
					"
					alt=""
				/>
			</div>
		</button>
	</footer>
</template>

<style scoped>
	footer {
		padding: 0.4em;
		align-self: center;
	}
	button {
		display: flex;
		align-items: center;
		width: 4.5em;
		height: 2em;
		padding: 0 0.3em;
		background-color: color-mix(in srgb, currentColor 12%, transparent);
		border-radius: 17pt;
	}
	.c {
		height: 1.5em;
		width: 1.5em;
		border-radius: 0.75em;
		background-color: #fff;
		transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), var(--trbg);
		object-fit: contain;
	}
	.c.right {
		transform: translateX(calc(4.5rem - 0.6rem - 1.5rem - 1px));
	}
	img {
		width: 100%;
		filter: grayscale(100%);
		border-radius: 0.75em;
	}
	:not(.right) img {
		filter: grayscale(100%) sepia(100%);
	}
</style>
