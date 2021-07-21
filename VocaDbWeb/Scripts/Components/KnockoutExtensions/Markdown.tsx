import React from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

interface MarkdownProps {
	children: string;
}

const Markdown = ({ children }: MarkdownProps): React.ReactElement => {
	return <ReactMarkdown remarkPlugins={[gfm]}>{children}</ReactMarkdown>;
};

export default Markdown;
