import Pagination from '@Bootstrap/Pagination';
import ServerSidePagingStore from '@Stores/ServerSidePagingStore';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface ServerSidePagingProps {
	paging: ServerSidePagingStore;
}

const ServerSidePaging = observer(
	({ paging }: ServerSidePagingProps): React.ReactElement => {
		const { t } = useTranslation(['VocaDb.Web.Resources.Other']);

		return (
			<Pagination /* TODO */>
				<Pagination.First
					disabled={paging.isFirstPage}
					onClick={paging.goToFirstPage}
				>
					&laquo;&laquo; {t('VocaDb.Web.Resources.Other:PagedList.First')}
				</Pagination.First>
				<Pagination.Prev
					disabled={paging.isFirstPage}
					onClick={paging.previousPage}
				>
					&laquo; {t('VocaDb.Web.Resources.Other:PagedList.Previous')}
				</Pagination.Prev>

				{paging.showMoreBegin && <Pagination.Ellipsis disabled />}

				{paging.pages.map((page) => (
					<Pagination.Item
						active={page === paging.page}
						onClick={(): void => paging.setPage(page)}
						key={page}
					>
						{page}
					</Pagination.Item>
				))}

				{paging.showMoreEnd && <Pagination.Ellipsis disabled />}

				<Pagination.Next disabled={paging.isLastPage} onClick={paging.nextPage}>
					{t('VocaDb.Web.Resources.Other:PagedList.Next')} &raquo;
				</Pagination.Next>
				<Pagination.Last
					disabled={paging.isLastPage}
					onClick={paging.goToLastPage}
				>
					{t('VocaDb.Web.Resources.Other:PagedList.Last')} &raquo;&raquo;
				</Pagination.Last>
			</Pagination>
		);
	},
);

export default ServerSidePaging;
