import { json, type RequestHandler } from '@sveltejs/kit';
import { simpleSearch } from '../SimpleSearch';

export const GET: RequestHandler = async ({ locals: { session }, url, fetch }) => {
	return json(await simpleSearch(url.searchParams, session, fetch));
};
