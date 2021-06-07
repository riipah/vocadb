import $ from 'jquery';
import 'jquery-ui';
import React, { useImperativeHandle } from 'react';

const useJQueryUIAutocomplete = (
	el: React.RefObject<any>,
	options: JQueryUI.AutocompleteOptions,
): void => {
	React.useEffect(() => {
		const $el = $(el.current);
		$el.autocomplete(options);
		return (): void => $el.autocomplete('destroy');
	});
};

type AutocompleteProps = JQueryUI.AutocompleteOptions &
	React.InputHTMLAttributes<HTMLInputElement>;

const Autocomplete = React.forwardRef<
	HTMLInputElement,
	React.PropsWithChildren<AutocompleteProps>
>(({ select, source, ...props }, ref) => {
	const el = React.useRef<HTMLInputElement>(undefined!);
	useImperativeHandle<HTMLInputElement, HTMLInputElement>(
		ref,
		() => el.current,
	);
	useJQueryUIAutocomplete(el, { select, source });

	return <input ref={el} {...props} />;
});

export default Autocomplete;
