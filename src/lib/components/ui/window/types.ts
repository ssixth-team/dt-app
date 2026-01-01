export type WindowVariant = 'default' | 'alert' | 'fullscreen';

export interface WindowProps {
	open: boolean;
	title?: string;
	variant?: WindowVariant;
	closeOnOverlay?: boolean;
	closeOnEscape?: boolean;
	width?: string;
	height?: string;
	maxWidth?: string;
	maxHeight?: string;
	onClose?: () => void;
}

export interface WindowTitlebarProps {
	title?: string;
	onClose?: () => void;
	onMaximize?: () => void;
	showMaximize?: boolean;
	isMaximized?: boolean;
	onDragStart?: (e: MouseEvent) => void;
}
