import { PUBLIC_KAUPPA_API_URL } from '$env/static/public';
import type { z, ZodType } from 'zod';
import type { KauppaAPI } from '.';
import {
	type KauppaSearchResponse,
	type KauppaFullProduct,
	kauppaSearchResponseSchema,
	type KauppaSourceResponse,
	kauppaSourceResponseSchema,
	kauppaFullProductSchema
} from './types';

export class HTTPKauppaAPI implements KauppaAPI {
	private apiKey: string;

	constructor(apiKey: string) {
		this.apiKey = apiKey;
	}

	private async req<T extends ZodType>(url: string, schema: T): Promise<z.infer<T>> {
		const response = await fetch(url, {
			headers: { Authentication: `Bearer ${this.apiKey}` }
		});

		const parsed = schema.safeParse(await response.json());
		if (!parsed.success) {
			throw new Error(`malformed api response: ${parsed.error.message}`);
		}

		return parsed.data;
	}

	async getSources(): Promise<KauppaSourceResponse> {
		return this.req(`${PUBLIC_KAUPPA_API_URL}/api/sources`, kauppaSourceResponseSchema);
	}

	async search(query: string, sources: string[]): Promise<KauppaSearchResponse> {
		const params = new URLSearchParams({ query, sources: sources.join(',') });

		return this.req(`${PUBLIC_KAUPPA_API_URL}/api/search?${params}`, kauppaSearchResponseSchema);
	}

	async getProduct(id: string, sources: string[]): Promise<KauppaFullProduct> {
		const params = new URLSearchParams({ sources: sources.join(',') });

		return this.req(
			`${PUBLIC_KAUPPA_API_URL}/api/products/${id}?${params}`,
			kauppaFullProductSchema
		);
	}
}
