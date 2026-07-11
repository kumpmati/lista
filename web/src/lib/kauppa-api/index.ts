import type { KauppaFullProduct, KauppaSearchResponse, KauppaSourceResponse } from './types';

export interface KauppaAPI {
	health(): Promise<boolean>;
	getSources(): Promise<KauppaSourceResponse>;
	search(query: string, sources: string[]): Promise<KauppaSearchResponse>;
	getProduct(id: string, sources: string[]): Promise<KauppaFullProduct>;
}
