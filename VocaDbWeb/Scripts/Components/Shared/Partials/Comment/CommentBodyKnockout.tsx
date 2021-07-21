import Markdown from '@Components/KnockoutExtensions/Markdown';
import React from 'react';

interface CommentBodyKnockoutProps {
	message: string;
}

const CommentBodyKnockout = React.memo(
	({ message }: CommentBodyKnockoutProps): React.ReactElement => {
		return <Markdown>{message}</Markdown>;
	},
);

export default CommentBodyKnockout;
