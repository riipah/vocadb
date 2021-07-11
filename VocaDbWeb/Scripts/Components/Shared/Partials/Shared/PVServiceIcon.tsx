import PVService from '@Models/PVs/PVService';
import React from 'react';

const videoServiceLinkUrl = (service: PVService): string => {
	switch (service) {
		case PVService.Bandcamp:
			return '/Content/ExtIcons/bandcamp.png';
		case PVService.Bilibili:
			return '/Content/ExtIcons/bilibili.png';
		case PVService.File:
		case PVService.LocalFile:
			return '/Content/Icons/music.png';
		case PVService.NicoNicoDouga:
			return '/Content/nico.png';
		case PVService.Piapro:
			return '/Content/ExtIcons/piapro.png';
		case PVService.SoundCloud:
			return '/Content/Icons/soundcloud.png';
		case PVService.Youtube:
			return '/Content/youtube.png';
		case PVService.Vimeo:
			return '/Content/ExtIcons/vimeo.png';
		case PVService.Creofuga:
			return '/Content/ExtIcons/creofuga.png';
		default:
			return '';
	}
};

interface PVServiceIconProps {
	service: PVService;
}

const PVServiceIcon = React.memo(
	({ service }: PVServiceIconProps): React.ReactElement => {
		const iconUrl = videoServiceLinkUrl(service);

		return (
			<img src={iconUrl} alt={PVService[service]} title={PVService[service]} />
		);
	},
);

export default PVServiceIcon;
