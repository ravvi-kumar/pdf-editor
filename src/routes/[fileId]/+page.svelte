<script lang="ts">
	import { browser } from '$app/environment';
	import { onDestroy } from 'svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let isSaving = $state(false);

	let editableDiv: HTMLDivElement;

	if (browser) {
		document.designMode = 'on';

		function onHover(e:MouseEvent){
			const div = e.target as HTMLDivElement;
			div.style.outline="1px dashed gray";
			div.style.outlineOffset = "10px"; // this pushes the outline outward

		}

		function onHoverLeave(e:MouseEvent){
			const div = e.target as HTMLDivElement;
			div.style.outline="none";
			div.style.outlineOffset = "0px"; // optional reset

		}

		const divs = document.querySelectorAll('div');
		divs.forEach((div)=>{
			div.addEventListener('mouseover',onHover)
			div.addEventListener('mouseout',onHoverLeave)
		})

		onDestroy(()=>{
			divs.forEach((div)=>{
				div.removeEventListener('mouseover',onHover)
				div.removeEventListener('mouseout',onHoverLeave)
			})
		})
	}

	async function save() {
		try {
			isSaving = true;
			const newContent = editableDiv.innerHTML;
			const response = await fetch('/api/content', {
				method: 'PATCH',
				body: JSON.stringify({
					fileId: data.id,
					htmlContent: newContent
				})
			});
			const result = await response.json();
			if (!result.success) {
				throw new Error('Failed to save file');
			}
		} catch (error) {
			console.error(error);
		} finally {
			isSaving = false;
		}
	}

	function download() {
		window.print();
	}
</script>

<!-- edit and save buttons -->
<div contenteditable="false" class="absolute top-0 right-0 z-10 p-2">
	<button
		contenteditable="false"
		onclick={save}
		class="cursor-pointer rounded-md bg-blue-600 px-3 py-1 text-white transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
		>
		{isSaving ? 'Saving...' : 'Save'}</button
	>
	<button
		contenteditable="false"
		onclick={download}
		class="cursor-pointer rounded-md bg-white px-3 py-1 text-black transition focus:ring-2 focus:outline-none"
		>Download</button
	>
</div>
<div bind:this={editableDiv}>{@html data.content}</div>

<style>
	@media print {
		button {
			display: none !important;
		}
	}
</style>
