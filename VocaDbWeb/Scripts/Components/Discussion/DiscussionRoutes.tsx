import Layout from '@Components/Shared/Layout';
import LoginManager from '@Models/LoginManager';
import DiscussionRepository from '@Repositories/DiscussionRepository';
import HttpClient from '@Shared/HttpClient';
import UrlMapper from '@Shared/UrlMapper';
import DiscussionIndexStore from '@Stores/Discussion/DiscussionIndexStore';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes } from 'react-router-dom';

import '../../../wwwroot/Content/Styles/discussions.css';

const DiscussionFolder = React.lazy(() => import('./DiscussionFolder'));
const DiscussionIndex = React.lazy(() => import('./DiscussionIndex'));
const DiscussionTopic = React.lazy(() => import('./DiscussionTopic'));

interface DiscussionLayoutProps {
	children?: React.ReactNode;
}

export const DiscussionLayout = ({
	children,
}: DiscussionLayoutProps): React.ReactElement => {
	const { t } = useTranslation(['ViewRes.Discussion']);

	return (
		<Layout title={t('ViewRes.Discussion:Index.Discussions')}>
			{children}
		</Layout>
	);
};

const loginManager = new LoginManager(vdb.values);

const httpClient = new HttpClient();
const urlMapper = new UrlMapper(vdb.values.baseAddress);
const discussionRepo = new DiscussionRepository(httpClient, urlMapper);

const discussionIndexStore = new DiscussionIndexStore(
	loginManager,
	discussionRepo,
	loginManager.canDeleteComments,
);

const DiscussionRoutes = (): React.ReactElement => {
	return (
		<Routes>
			<Route
				path="/"
				element={
					<DiscussionIndex discussionIndexStore={discussionIndexStore} />
				}
			/>
			<Route
				path="folders/:folderId"
				element={
					<DiscussionFolder discussionIndexStore={discussionIndexStore} />
				}
			/>
			<Route
				path="topics/:topicId"
				element={
					<DiscussionTopic discussionIndexStore={discussionIndexStore} />
				}
			/>
		</Routes>
	);
};

export default DiscussionRoutes;
