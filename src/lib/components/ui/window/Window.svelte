<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { WindowProps } from './types';
  import WindowTitlebar from './WindowTitlebar.svelte';
  import './window.scss';

  let {
    open = $bindable(false),
    title = '',
    variant = 'default',
    closeOnOverlay = true,
    closeOnEscape = true,
    width = '600px',
    height = 'auto',
    maxWidth = '90vw',
    maxHeight = '90vh',
    onClose,
    children
  }: WindowProps & { children?: any } = $props();

  let overlayElement: HTMLDivElement | null = $state(null);
  let windowElement: HTMLDivElement | null = $state(null);
  let isAnimating = $state(false);
  let isVisible = $state(false);
  let isMaximized = $state(false);
  let previousBodyOverflow = '';

  // 애니메이션 상태
  let overlayClass = $derived(
    open ? (isAnimating ? 'window-overlay-enter' : '') : isAnimating ? 'window-overlay-exit' : ''
  );

  let windowClass = $derived(
    open ? (isAnimating ? 'window-enter' : '') : isAnimating ? 'window-exit' : ''
  );

  // ESC 키 핸들러
  function handleKeydown(event: KeyboardEvent) {
    if (closeOnEscape && event.key === 'Escape' && open) {
      event.preventDefault();
      handleClose();
    }
  }

  // Overlay 클릭 핸들러
  function handleOverlayClick(event: MouseEvent) {
    if (closeOnOverlay && event.target === overlayElement) {
      handleClose();
    }
  }

  // 닫기 핸들러
  function handleClose() {
    open = false;
    onClose?.();
  }

  // 최대화 핸들러
  function handleMaximize() {
    isMaximized = !isMaximized;
  }

  // Body scroll lock
  function lockBodyScroll() {
    if (typeof document !== 'undefined') {
      previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
  }

  function unlockBodyScroll() {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = previousBodyOverflow;
    }
  }

  // Focus trap
  function trapFocus(element: HTMLElement) {
    const focusableElements = element.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    function handleTabKey(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable?.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable?.focus();
        }
      }
    }

    element.addEventListener('keydown', handleTabKey);
    firstFocusable?.focus();

    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  }

  // open 상태 변경 감지
  $effect(() => {
    if (open) {
      isVisible = true;
      isAnimating = true;
      lockBodyScroll();

      // 애니메이션 완료 후
      const timer = setTimeout(() => {
        isAnimating = false;
        if (windowElement) {
          const cleanup = trapFocus(windowElement);
          return cleanup;
        }
      }, 200);

      return () => clearTimeout(timer);
    } else if (isVisible) {
      // 닫기 애니메이션 시작
      isAnimating = true;

      // 애니메이션 완료 후 DOM에서 제거
      const timer = setTimeout(() => {
        isVisible = false;
        isAnimating = false;
        unlockBodyScroll();
      }, 200); // 200ms로 늘려서 부드럽게

      return () => clearTimeout(timer);
    }
  });

  // 키보드 이벤트 리스너
  onMount(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeydown);
    }
  });

  onDestroy(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', handleKeydown);
    }
    unlockBodyScroll();
  });

  // 스타일 계산
  let windowStyle = $derived(() => {
    if (isMaximized || variant === 'fullscreen') {
      return 'width: 100%; height: 100%;';
    }
    return `width: ${width}; height: ${height}; max-width: ${maxWidth}; max-height: ${maxHeight};`;
  });
</script>

{#if isVisible}
  <div
    bind:this={overlayElement}
    class="window-overlay {overlayClass}"
    onclick={handleOverlayClick}
    onkeydown={handleKeydown}
    role="dialog"
    aria-modal="true"
    aria-labelledby={title ? 'window-title' : undefined}
    tabindex="-1"
  >
    <div
      bind:this={windowElement}
      class="window-container {windowClass} variant-{variant}"
      class:variant-fullscreen={isMaximized}
      style={windowStyle()}
    >
      <WindowTitlebar {title} {isMaximized} onClose={handleClose} onMaximize={handleMaximize} />
      <div class="window-content">
        {@render children?.()}
      </div>
    </div>
  </div>
{/if}
