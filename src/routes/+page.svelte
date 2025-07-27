<script lang="ts">
	import { createUploader } from '$lib/utils/uploadthing';

	import { UploadButton, UploadDropzone } from '@uploadthing/svelte';

	const uploader = createUploader('imageUploader', {
		onClientUploadComplete: (res) => {
			console.log(`onClientUploadComplete`, res);
			alert('Upload Completed');
		},
		onUploadError: (error: Error) => {
			alert(`ERROR! ${error.message}`);
		}
	});
</script>

<div class="p-4">
	<h1 class="text-2xl font-bold">Pdf Editor</h1>
	<div class="mx-auto max-w-md">
		<div class="ut-flex ut-flex-col ut-items-center ut-justify-center ut-gap-4">
			<UploadDropzone {uploader} />
		</div>
	</div>
</div>
