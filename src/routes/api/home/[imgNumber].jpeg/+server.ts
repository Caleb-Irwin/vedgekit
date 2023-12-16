import { _bannerImages } from '../featured.json/+server';
import type { EntryGenerator, RequestHandler } from './$types';
import sharp from 'sharp';

export const prerender = true;

export const GET: RequestHandler = async ({ fetch, params }) => {
	const img = _bannerImages[parseInt(params.imgNumber)];
	const res = await fetch(img.originalUrl);
	const jpgBuffer = await sharp(await res.arrayBuffer())
		.toFormat('jpeg', { quality: 80 })
		.toBuffer();
	return new Response(new Blob([jpgBuffer], { type: 'image/jpeg' }));
};

export const entries: EntryGenerator = () => {
	return _bannerImages.map(({ index }) => ({ imgNumber: index.toString() }));
};
