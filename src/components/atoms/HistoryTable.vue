<script setup>
	const props = defineProps(["t",]);
</script>
<template>
	<table class="history">
		<tr>
			<th colspan="4">{{ title }}</th>
		</tr>
		<tr>
			<th>Round</th>
			<th>Card</th>
			<th>Report</th>
			<th>Orders</th>
		</tr>
		<tr v-for="(p, turn) in h">
			<td>#{{ turn }}</td>
			<td v-for="i in 3"><button class="linkcolor simplesilver ovbutton">↓</button></td>
		</tr>
	</table>
</template>
<style>
	table {
		table-layout: fixed;
		border: 1px dashed color-mix(in srgb, var(--linkcolor) 80%, #c0c0c0 20%);
		border-collapse: collapse;
	}
	td,
	th {
		width: fit-content;
		min-width: 5em;
		&:not(:first-of-type) {
			border-left: 1px solid #000;
		}
		text-align: center;
	}
	tr {
		border-bottom: 1px solid var(--linkcolor);
		&:first-of-type {
			border-bottom-color: #000;
		}
	}
	td button {
		display: inline-block;
		vertical-align: middle;
		padding: 0;
		margin-bottom: 5px;
	}
	.dt {
		table {
			border-color: color-mix(in srgb, #3982bf 80%, #c0c0c0 20%);
		}
		tr {
			border-bottom-color: #3982bf;
			&:first-of-type {
				border-bottom-color: #fff;
			}
		}
		td:not(:first-of-type),
		th:not(:first-of-type) {
			border-left-color: #fff;
		}
	}
</style>
