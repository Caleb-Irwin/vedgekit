import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = async ({ fetch }) => {
	return fetch(
		'/api/home/https%3A%2F%2Fimg.shopofficeonline.com%2Fvenxia%2FAttachment%2F02-OP-Top-Ad-E-EN.png.jpg'
	);
};
