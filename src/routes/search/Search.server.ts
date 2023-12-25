import type { SessionManager } from '$lib/server/session';
import type { SearchRes } from './SearchRes.server';

export async function search(
	conf: { searchTerm?: string; page?: number; rawQuery?: { [query: string]: string } },
	session: SessionManager,
	customFetch?: typeof fetch
): Promise<SearchRes> {
	const res = await session.req(
		'/search',
		{},
		{
			customQuery: {
				rpp: '12',
				srn: ((conf.page || 0) * 12).toString(),
				rs: '12',
				catalogId: '10002',
				wn: '*',
				cln: '*',
				epp: '*',
				os: '*',
				ftoos: '*',
				ost: '*',
				sev: '*',
				solr_relevance: '*',
				slr_rpp: '12',
				cl: '0',
				cn: '*',
				ev: 'ca',
				root: '',
				ltype: 'lv',
				dealerId: '',
				cc: '70000',
				lId: '0',
				searchPageAdd: '',
				searchPageAdRow1: '',
				mad: '0',
				va: '*',
				vl: '0',
				bn: '*',
				restrictionName: '',
				deptId: '0',
				userId: '0',
				adfalg: 'false',
				prioritySearch: 'false',
				headerSearch: 'false',
				primarySearchTerm: '*',
				adrule: 'true',
				...(conf.rawQuery ? conf.rawQuery : { searchTerm: conf.searchTerm ?? '' })
			}
		},
		customFetch
	);
	return await res.json<SearchRes>();
}
