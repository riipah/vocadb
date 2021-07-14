import SafeAnchor from '@Bootstrap/SafeAnchor';
import UserApiContract from '@DataContracts/User/UserApiContract';
import ImageSize from '@Models/Images/ImageSize';
import EntryUrlMapper from '@Shared/EntryUrlMapper';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';

import ProfileIconKnockout_ImageSize from '../User/ProfileIconKnockout_ImageSize';
import CommentBodyKnockout from './CommentBodyKnockout';

interface CommentKnockoutStore {
	author: UserApiContract;
	canBeDeleted?: boolean;
	canBeEdited?: boolean;
}

interface CommentKnockoutProps {
	commentKnockoutStore: CommentKnockoutStore;
	message: string;
	allowMarkdown: boolean;
	onDelete?: () => void;
	onEdit?: () => void;
	standalone?: boolean;
	children?: React.ReactNode;
}

const CommentKnockout = observer(
	({
		commentKnockoutStore,
		message,
		allowMarkdown,
		onDelete,
		onEdit,
		standalone = true,
		children,
	}: CommentKnockoutProps): React.ReactElement => {
		const { t } = useTranslation(['ViewRes']);

		return (
			<div
				className={classNames(
					'comment',
					'media',
					standalone && 'comment-large',
				)}
			>
				<a
					href={EntryUrlMapper.details_user_byName(
						commentKnockoutStore.author.name,
					)}
					className="pull-left"
				>
					<ProfileIconKnockout_ImageSize
						imageSize={ImageSize.Thumb}
						user={commentKnockoutStore.author}
						size={70}
					/>
				</a>

				<div className="media-body">
					<div className="pull-right">
						<span /* TODO */ className="comment-date"></span>

						{onEdit && commentKnockoutStore.canBeEdited && (
							<>
								&nbsp;&nbsp;
								<SafeAnchor onClick={onEdit} className="textLink editLink">
									{t('ViewRes:Shared.Edit')}
								</SafeAnchor>
							</>
						)}

						{onDelete && commentKnockoutStore.canBeDeleted && (
							<>
								&nbsp;&nbsp;
								<SafeAnchor
									// TODO: confirmClick
									onClick={(): void => {
										if (
											window.confirm(
												'Are you sure you want to delete this comment?' /* TODO: localize */,
											)
										) {
											onDelete();
										}
									}}
									className="textLink deleteLink"
								>
									{t('ViewRes:Shared.Delete')}
								</SafeAnchor>
							</>
						)}
					</div>
					<h3 className="media-heading comment-large-header">
						<a
							href={EntryUrlMapper.details_user_byName(
								commentKnockoutStore.author.name,
							)}
						>
							{commentKnockoutStore.author.name}
						</a>
					</h3>
					{children ?? <CommentBodyKnockout message={message} />}
				</div>
			</div>
		);
	},
);

export default CommentKnockout;
