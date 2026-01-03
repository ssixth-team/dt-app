import { writable } from 'svelte/store';

interface WindowInstance {
  id: string;
  overlayElement: HTMLElement | null;
}

// Body scroll lock 관리를 위한 전역 상태
let previousBodyOverflow = '';
let lockCount = 0;

function lockBodyScroll() {
  if (typeof document !== 'undefined' && lockCount === 0) {
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  lockCount++;
}

function unlockBodyScroll() {
  lockCount--;
  if (typeof document !== 'undefined' && lockCount === 0) {
    document.body.style.overflow = previousBodyOverflow;
  }
}

function createWindowStack() {
  const { subscribe, update } = writable<WindowInstance[]>([]);

  return {
    subscribe,
    register: (id: string, overlayElement: HTMLElement | null, isModal: boolean = true) => {
      if (isModal) {
        lockBodyScroll();
      }
      update((stack) => [...stack, { id, overlayElement }]);
    },
    unregister: (id: string, isModal: boolean = true) => {
      if (isModal) {
        unlockBodyScroll();
      }
      update((stack) => {
        const filtered = stack.filter((w) => w.id !== id);
        // 다른 윈도우가 있으면 가장 최근 윈도우로 포커스 이동
        if (filtered.length > 0) {
          const lastWindow = filtered[filtered.length - 1];
          if (lastWindow.overlayElement) {
            // 약간의 지연을 두고 포커스 이동 (DOM 업데이트 대기)
            setTimeout(() => {
              lastWindow.overlayElement?.focus();
            }, 50);
          }
        }
        return filtered;
      });
    },
    clear: () => update(() => [])
  };
}

export const windowStack = createWindowStack();
