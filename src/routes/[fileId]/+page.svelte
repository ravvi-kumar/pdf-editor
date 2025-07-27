<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<h1>{data.fileUrl}</h1>
<div>{@html data.content}</div>