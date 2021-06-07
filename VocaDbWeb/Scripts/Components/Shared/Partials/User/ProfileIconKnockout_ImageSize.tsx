import EntryThumbContract from '@DataContracts/EntryThumbContract';
import UserApiContract from '@DataContracts/User/UserApiContract';
import ImageSize from '@Models/Images/ImageSize';
import React from 'react';

import ProfileIconKnockout from './ProfileIconKnockout';

const getImageUrl = (
	size: ImageSize,
	mainPicture: EntryThumbContract,
): string | undefined => {
	switch (size) {
		case ImageSize.Thumb:
			return mainPicture.urlThumb;
		case ImageSize.SmallThumb:
			return mainPicture.urlSmallThumb;
		case ImageSize.TinyThumb:
			return mainPicture.urlTinyThumb;
		default:
			return mainPicture.urlThumb;
	}
};

const userThumbMax = 512;
const userThumbSize = 80;
const userTinyThumbSize = 20;

const getUserImageSizePx = (size: ImageSize): number => {
	switch (size) {
		case ImageSize.Original:
			return userThumbMax;
		case ImageSize.Thumb:
		case ImageSize.SmallThumb:
			return userThumbSize;
		case ImageSize.TinyThumb:
			return userTinyThumbSize;
		default:
			return userThumbMax;
	}
};

interface ProfileIconKnockout_ImageSizeProps {
	imageSize: ImageSize;
	user: UserApiContract;
	size: number;
}

const ProfileIconKnockout_ImageSize = ({
	imageSize,
	user,
	size,
}: ProfileIconKnockout_ImageSizeProps): React.ReactElement => {
	return (
		<ProfileIconKnockout
			src={user.mainPicture ? getImageUrl(size, user.mainPicture) : undefined}
			size={size > 0 ? size : getUserImageSizePx(imageSize)}
		/>
	);
};

export default ProfileIconKnockout_ImageSize;
