// Code from: https://github.com/react-bootstrap/react-bootstrap/blob/3d4c57374646949e6fedfef00236c99f4d1b4e71/src/TransitionWrapper.tsx
import useMergedRefs from '@restart/hooks/useMergedRefs';
import React, { useCallback, useRef } from 'react';
import safeFindDOMNode from 'react-overlays/safeFindDOMNode';
import Transition, {
	TransitionProps,
	TransitionStatus,
} from 'react-transition-group/Transition';

export type TransitionWrapperProps = TransitionProps & {
	childRef?: React.Ref<unknown>;
	children:
		| React.ReactElement
		| ((
				status: TransitionStatus,
				props: Record<string, unknown>,
		  ) => React.ReactNode);
};

// Normalizes Transition callbacks when nodeRef is used.
const TransitionWrapper = React.forwardRef<
	Transition<any>,
	TransitionWrapperProps
>(
	(
		{
			onEnter,
			onEntering,
			onEntered,
			onExit,
			onExiting,
			onExited,
			addEndListener,
			children,
			childRef,
			...props
		},
		ref,
	) => {
		const nodeRef = useRef<HTMLElement>(null);
		const mergedRef = useMergedRefs(nodeRef, childRef);

		const attachRef = (
			r: React.ComponentClass | Element | null | undefined,
		): void => {
			mergedRef(safeFindDOMNode(r));
		};

		const normalize = (callback?: (node: HTMLElement, param: any) => void) => (
			param: any,
		): void => {
			if (callback && nodeRef.current) {
				callback(nodeRef.current, param);
			}
		};

		/* eslint-disable react-hooks/exhaustive-deps */
		const handleEnter = useCallback(normalize(onEnter), [onEnter]);
		const handleEntering = useCallback(normalize(onEntering), [onEntering]);
		const handleEntered = useCallback(normalize(onEntered), [onEntered]);
		const handleExit = useCallback(normalize(onExit), [onExit]);
		const handleExiting = useCallback(normalize(onExiting), [onExiting]);
		const handleExited = useCallback(normalize(onExited), [onExited]);
		const handleAddEndListener = useCallback(normalize(addEndListener), [
			addEndListener,
		]);
		/* eslint-enable react-hooks/exhaustive-deps */

		return (
			<Transition
				ref={ref}
				{...props}
				onEnter={handleEnter}
				onEntered={handleEntered}
				onEntering={handleEntering}
				onExit={handleExit}
				onExited={handleExited}
				onExiting={handleExiting}
				addEndListener={handleAddEndListener}
				nodeRef={nodeRef}
			>
				{typeof children === 'function'
					? (
							status: TransitionStatus,
							innerProps: Record<string, unknown>,
					  ): React.ReactNode =>
							children(status, {
								...innerProps,
								ref: attachRef,
							})
					: React.cloneElement(children as React.ReactElement, {
							ref: attachRef,
					  })}
			</Transition>
		);
	},
);

export default TransitionWrapper;
