export type DataShape = {
	channels?: Array<string>;
	delay?: string;
	disable_notification?: boolean;
	files?: Record<string, string>;
	message_template?: string;
	override_switch?: boolean;
	send2tg?: boolean;
	send_featured_image?: boolean;
};

export type DataState = {
	isSaving: boolean;
	isDirty: boolean;
	data: DataShape;
	savedData: DataShape;
};
