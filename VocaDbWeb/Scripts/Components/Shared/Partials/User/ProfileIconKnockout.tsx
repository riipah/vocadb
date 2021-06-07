import React from 'react';

interface ProfileIconKnockoutProps {
	src?: string;
	size: number;
}

const ProfileIconKnockout = ({
	src,
	size,
}: ProfileIconKnockoutProps): React.ReactElement => {
	return (
		<div
			/* TODO */ style={{
				width: `${size}px`,
				height: `${size}px`,
				display: 'inline-block',
			}}
		>
			<img src={src ?? '/Content/unknown.png'} alt="User avatar" />
		</div>
	);
};

export default ProfileIconKnockout;
