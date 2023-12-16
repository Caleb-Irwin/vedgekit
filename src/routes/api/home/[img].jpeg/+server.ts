import { _getBannerImages } from '../featured.json/+server';
import type { EntryGenerator, RequestHandler } from './$types';
import sharp from 'sharp';

export const prerender = true;

export const GET: RequestHandler = async ({ fetch, params }) => {
	const res = await fetch(decodeURIComponent(params.img).replaceAll('%2E', '.'));
	const jpgBuffer = await sharp(await res.arrayBuffer())
		.toFormat('jpeg', { quality: 80 })
		.toBuffer();
	return new Response(new Blob([jpgBuffer], { type: 'image/jpeg' }));
};

export const entries: EntryGenerator = async () => {
	return (await _getBannerImages()).map(({ imgParam }) => ({ img: imgParam }));
};
