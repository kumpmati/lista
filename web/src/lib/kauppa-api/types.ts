import z from 'zod';

export const kauppaProductSchema = z.object({
	id: z.string(),
	ean_code: z.string().nullable(),
	title: z.string(),
	brand_name: z.string().nullable(),
	image_url: z.string().nullable(),
	created_at: z.iso.datetime()
});

export const kauppaProductPriceSchema = z.object({
	source_id: z.string(),
	price_cents: z.number(),
	unit_price_cents: z.number().nullable(),
	unit_type: z.string().nullable(),
	product_url: z.string(),
	last_checked: z.iso.datetime()
});

export const kauppaProductDetailsSchema = z.object({
	description: z.string().nullable(),
	ingredients: z.string().nullable(),
	country_code: z.string(),
	created_at: z.iso.datetime()
});

export const kauppaSearchProductSchema = kauppaProductSchema.extend({
	prices: z.array(kauppaProductPriceSchema)
});

export const kauppaFullProductSchema = kauppaProductSchema.extend({
	details: kauppaProductDetailsSchema.nullable(),
	prices: z.array(kauppaProductPriceSchema)
});

export const kauppaSearchResponseSchema = z.object({
	products: z.array(kauppaSearchProductSchema)
});

export const kauppaSourceSchema = z.object({
	id: z.string(),
	name: z.string()
});

export const kauppaSourceResponseSchema = z.array(kauppaSourceSchema);

export type KauppaFullProduct = z.infer<typeof kauppaFullProductSchema>;
export type KauppaSearchProduct = z.infer<typeof kauppaSearchProductSchema>;
export type KauppaSearchResponse = z.infer<typeof kauppaSearchResponseSchema>;

export type KauppaSource = z.infer<typeof kauppaSourceSchema>;
export type KauppaSourceResponse = z.infer<typeof kauppaSourceResponseSchema>;
