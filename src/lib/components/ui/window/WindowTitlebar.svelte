<script lang="ts">
	import type { WindowTitlebarProps } from './types';
	import './window.scss';

	let { title = '', onClose, onMaximize, showMaximize = true }: WindowTitlebarProps = $props();

	function handleClose() {
		onClose?.();
	}

	function handleMaximize() {
		onMaximize?.();
	}
</script>

<div class="window-titlebar">
	<div style="width: 52px;"></div>
	<!-- Spacer for centering title -->
	{#if title}
		<div class="window-title">{title}</div>
	{/if}
	<div class="window-controls">
		<button
			class="window-control-btn window-control-close"
			onclick={handleClose}
			aria-label="닫기"
			type="button"
		></button>
		<button
			class="window-control-btn window-control-minimize"
			aria-label="최소화"
			type="button"
			disabled
		></button>
		{#if showMaximize}
			<button
				class="window-control-btn window-control-maximize"
				onclick={handleMaximize}
				aria-label="최대화"
				type="button"
			></button>
		{/if}
	</div>
</div>
