<script lang="ts">
	import { createUploadThing } from '$lib/utils/uploadthing';
	import { pdfToHtml } from '$lib/utils/pdf-to-html';
	import { goto } from '$app/navigation';

	let isConvertingPdf = $state(false);
	let isUploading = $state(false);
	let isNavigating = $state(false);

	const { startUpload } = createUploadThing('imageUploader', {
		onClientUploadComplete: () => {
			alert('Upload Completed');
		}
	});

	async function handleChange(
		e: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) {
		console.log("handle change")
		try {
			const file = e.currentTarget.files?.[0];
			if (!file) return;

			// Do something with files
			isConvertingPdf = true;
			const htmlContent = await pdfToHtml(file);
			isConvertingPdf = false;
			// Then start the upload
			isUploading = true
			const result = await startUpload([file]);
			if (!result?.length) {
				return;
			}
			const fileUrl = result[0].ufsUrl;
			console.log(fileUrl);
			isUploading = false;

			// #NOTE: here i got the fileUrl, fileName and htmlContent
			isNavigating = true;
			const response = await fetch('/api/content', {
				method: 'POST',
				body: JSON.stringify({
					fileName: file.name,
					fileUrl,
					htmlContent
				})
			});
			const fileUploadResult = await response.json();
			if (!fileUploadResult.success) {
				throw new Error('Failed to upload file');
			}
			const fileId = fileUploadResult.fileId
			goto(`/${fileId}`);
			isNavigating = false;
		} catch (error) {
			console.error(error);
		} finally {
			isNavigating = false;
		}
	}
</script>

<div class="p-4">
	<h1 class="text-2xl font-bold">Pdf Editor</h1>
	<div class="mx-auto max-w-md">
		{#if isConvertingPdf}
			<p>Converting PDF to HTML...</p>
		{:else if isUploading}
			<p>Uploading...</p>
		{:else if isNavigating}
			<p>Navigating...</p>
		{:else}
			<div class="w-full max-w-md rounded-lg bg-white p-4 shadow-md">
				<label for="file-upload" class="block w-full">
					<div
						class="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-10 transition hover:border-blue-400"
					>
						<p class="text-sm text-gray-600">Click to upload or drag and drop</p>
						<p class="mt-1 text-xs text-gray-500">PDF up to 16MB</p>
					</div>
					<input
						id="file-upload"
						type="file"
						onchange={handleChange}
						accept="application/pdf"
						class="hidden"
					/>
				</label>
			</div>
		{/if}
	</div>
</div>
