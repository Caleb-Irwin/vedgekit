export interface SearchRes {
	adRuleMap: AdRuleMap;
	searchResults: SearchResults;
}

interface SearchResults {
	solrProducts: SolrProduct[];
	eppFacet: Facet | EmptyFacet;
	whatsNewFacet: Facet | EmptyFacet;
	onClearanceFacet: Facet | EmptyFacet;
	onSaleFacet: Facet | EmptyFacet;
	ftoosFacet: Facet | EmptyFacet;
	overStockFacet: Facet | EmptyFacet;
	parentCategoryName: string;
	searchRequest: SearchRequest;
	brands: unknown[];
	categories: Category[];
	recommendedCategory: (number | string)[];
	productCount: number;
	pageLength: number;
	pageStart: number;
	variationsMap: TagNames;
}

interface Category {
	name: string;
	url: string;
	count: number;
	isRoot: unknown | null;
	parentName: string;
	identifier: unknown | null;
}

interface SearchRequest {
	currentPageStart: number;
	rowsPerPage: number;
	searchTerm: string;
	resultsSize: number;
	catLevel: number;
	storeId: number;
	langId: number;
	eventType: string;
	categoryQuery: string;
	brandQuery: string;
	eppQuery: string;
	onSaleQuery: string;
	ftoosQuery: string;
	overStockQuery: string;
	clearanceQuery: string;
	whatsNewQuery: string;
	categoryDisplayName: string;
	searchUrl: string;
	breadCrumbUrl: string;
	subEvent: string;
	solrRelevance: string;
	dealerName: string;
	restrictionsType: string;
	restrictionName: string;
	categoryBreadCrumb: string;
	rootCategory: string;
	ltype: string;
	custCode: string;
	userId: number;
	paginationUrl: string;
	destination: string;
	deptId: number;
	variationQuery: string;
	variationLevel: number;
	lId: number;
	cc: string;
	disableFuzzySearch: boolean;
	prioritySearch: boolean;
	primarySearchTerm: string;
	pd: boolean;
	itemsWithSpace: boolean;
	skus: unknown[];
	emptyFuzzySearch: boolean;
	variationDisplayName: string;
	rules: Rules[];
	mad: string;
	solrUrl: string;
	defaultClientId: number;
	catalogId: number;
}

interface Rules {
	attributeRulesId: number;
	ruleAttribute: string;
	rulePos: number;
	ruleTerm: string;
	ruleView: string;
	ruleType: string;
	level: number;
	ruleShow: string;
	catIdentifier: string;
}

interface EmptyFacet {
	facetName: null;
	count: 0;
	url: null;
	selectedValue: null;
	facetDisplayName: null;
}

interface Facet {
	facetName: string;
	count: number;
	url: string;
	selectedValue: null;
	facetDisplayName: null;
}

interface SolrProduct {
	partnumber: string;
	sku: null | unknown;
	searchwords: null | unknown;
	videoUrl: null | unknown;
	brandname_exact: null | unknown;
	productID: string;
	catalog_id: string;
	productImage: null | unknown;
	categorye: null | unknown;
	name: string;
	boost1: null | unknown;
	defaultGalleryImageFileName: string;
	defaultListImageFileName: string;
	dealerProduct: boolean;
	shortDescription: null | unknown;
	longDescription: null | unknown;
	uom: null | unknown;
	needsDropDown: boolean;
	definingAttrName: null | unknown;
	nameForSEO: string;
	defaultBasicsGVImageFileName: null | unknown;
	defaultBasicsLVImageFileName: null | unknown;
	onSale: boolean;
	ftoos: boolean;
	overStock: boolean;
	onClearance: boolean;
	newItem: boolean;
	field2: null | unknown;
	customCode: null | unknown;
	showItemInStockIndex: number;
	epp: boolean;
	inventory: number;
	basicsItems: BasicsItem[];
	basicsItemsMap: BasicsItemsMap;
	hidden: boolean;
}

interface BasicsItemsMap {
	[gid: string]: BasicsItem;
}

interface BasicsItem {
	itemPartNumber: string;
	parentPartNumber: string;
	definingAttributeName: null | unknown;
	definingAttributeValue: null | unknown;
	etilizeId: string;
	listViewImgURL: string;
	galleryViewImgUrl: string;
	catentryId: null | unknown;
	field2: null | unknown;
	customerCode: string;
	customCode: string;
	storeId: number;
	price: string;
	langId: number;
	etilizeLVImg: boolean;
	etilizeGVImg: boolean;
	etilizeImageSpecs: null | unknown;
	itemName: string;
	prices: TagNames;
	priceRanges: [] | unknown;
	priceForCart: string;
	hasPriceRanges: boolean;
	outOfStock: boolean;
	longDescription: string;
	shortDescription: string;
	productSpecifications: null | unknown;
	trimmedProductSpecification: null | unknown;
	showCartButton: boolean;
	showQuoteButton: boolean;
	supplementaryCharges: null | unknown;
	xrefno: string;
	hidden: boolean;
	itemDescription: null | unknown;
	selling_UOM: string;
	pkg_UOM: string;
	showSupplementaryCharges: boolean;
}

interface AdRuleMap {
	adrules: unknown[];
	tagNames: TagNames;
}

interface TagNames {}
