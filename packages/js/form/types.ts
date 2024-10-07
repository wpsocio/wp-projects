export type RepeatableValue<T = unknown> = { value?: T; id?: string };

export type ArrayField<T> = T & { id?: string };
