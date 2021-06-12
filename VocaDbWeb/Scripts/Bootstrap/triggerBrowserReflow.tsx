// Code from: https://github.com/react-bootstrap/react-bootstrap/blob/dec919bf9bb0cb3153f3e3afe6a486968b218329/src/triggerBrowserReflow.tsx

// reading a dimension prop will cause the browser to recalculate,
// which will let our animations work
export default function triggerBrowserReflow(node: HTMLElement): void {
	// eslint-disable-next-line @typescript-eslint/no-unused-expressions
	node.offsetHeight;
}
