import { _featuredProducts } from '../featured.json/+server';
import type { EntryGenerator, RequestHandler } from './$types';
import sharp from 'sharp';

export const prerender = true;

export const GET: RequestHandler = async ({ fetch, params }) => {
	const img = (_featuredProducts[parseInt(params.imgNumber)].raw as { originalUrl: string })
		.originalUrl;
	const res = await fetch(img);
	const jpgBuffer = await sharp(await res.arrayBuffer())
		.resize({ width: 300, height: 300 })
		.png({ quality: 50 })
		.toBuffer();
	return new Response(new Blob([jpgBuffer], { type: 'image/png' }));
};

export const entries: EntryGenerator = () => {
	return _featuredProducts.map((x, i) => ({ imgNumber: i.toString() }));
};
