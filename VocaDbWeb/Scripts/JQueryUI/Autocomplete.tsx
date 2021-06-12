import $ from 'jquery';
import 'jquery-ui';
import React, { useRef } from 'react';

interface AutocompleteProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	source?: any;
	select?: JQueryUI.AutocompleteEvent;
}

const Autocomplete = ({
	source,
	select,
	...props
}: AutocompleteProps): React.ReactElement => {
	const el = useRef<any>();

	React.useEffect(() => {
		const $el = $(el.current);
		$el.autocomplete({ source: source, select: select });
		return (): void => $el.autocomplete('destroy');
	}, [source, select]);

	return <input {...props} ref={el} />;
};

export default Autocomplete;
