import React from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

interface CommentBodyKnockoutProps {
	message: string;
}

const CommentBodyKnockout = React.memo(
	({ message }: CommentBodyKnockoutProps): React.ReactElement => {
		// TODO: markdown
		return <ReactMarkdown remarkPlugins={[gfm]}>{message}</ReactMarkdown>;
	},
);

export default CommentBodyKnockout;
