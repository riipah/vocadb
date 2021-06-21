import VocaDbContext from './VocaDbContext';

interface VdbFunctionsStatic {
	boldCaseInsensitive: (text: string, term: string) => string;

	disableTabReload: (tab: any) => void;

	showLoginPopup: () => void;
}

interface VdbResourcesStatic {
	albumEdit: any;
	entryEdit: any;
	shared: any;
	song: any;
	album: { addedToCollection?: string };
	albumDetails: {
		download: string;
	};
}

interface VdbStatic {
	functions: VdbFunctionsStatic;
	resources: VdbResourcesStatic;
	values: VocaDbContext;
}

const vdb: VdbStatic = {
	functions: {} as VdbFunctionsStatic,
	resources: {} as VdbResourcesStatic,
	values: new VocaDbContext(),
};

export default vdb;

declare global {
	interface Window {
		vdb: VdbStatic;
	}
}

window.vdb = vdb;
