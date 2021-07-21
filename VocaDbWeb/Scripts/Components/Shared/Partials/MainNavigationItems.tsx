import LoginManager from '@Models/LoginManager';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const loginManager = new LoginManager(vdb.values);

const MainNavigationItems = React.memo(
	(): React.ReactElement => {
		const { t } = useTranslation(['ViewRes']);

		return (
			<ul className="nav nav-list">
				<li>
					<a href={'/'}>{t('ViewRes:Layout.Home')}</a>
				</li>
				<li>
					<a href={'/Search?searchType=Artist'}>
						{t('ViewRes:Shared.Artists')}
					</a>
					<ul>
						{loginManager.canManageDatabase && (
							<li>
								<a href={'/Artist/Create'}>{t('ViewRes:Layout.AddArtist')}</a>
							</li>
						)}
					</ul>
				</li>
				<li>
					<a href={'/Search?searchType=Album'}>{t('ViewRes:Shared.Albums')}</a>
					<ul>
						{loginManager.canManageDatabase && (
							<li>
								<a href={'/Album/Create'}>{t('ViewRes:Layout.AddAlbum')}</a>
							</li>
						)}
						<li>
							<a href={'/Search?searchType=Album&sort=RatingAverage'}>
								{t('ViewRes:Shared.TopRatedAlbums')}
							</a>
						</li>
						<li>
							<a href={'/Search?searchType=Album&sort=ReleaseDate'}>
								{t('ViewRes:Layout.NewAlbums')}
							</a>
						</li>
						<li>
							<a href={'/Search?searchType=Album&tag=free&childTags=True'}>
								{t('ViewRes:Layout.FreeAlbums')}
							</a>
						</li>
					</ul>
				</li>
				<li>
					<a href={'/Search?searchType=Song'}>{t('ViewRes:Shared.Songs')}</a>
					<ul>
						{loginManager.canManageDatabase && (
							<li>
								<a href={'/Song/Create'}>{t('ViewRes:Layout.AddSong')}</a>
							</li>
						)}
						<li>
							<a href={'/Song/Rankings'}>
								{t('ViewRes:Shared.TopFavoritedSongs')}
							</a>
						</li>
						<li>
							<a
								href={
									'/Search?searchType=Song&sort=AdditionDate&onlyWithPVs=true'
								}
							>
								{t('ViewRes:Layout.NewPVs')}
							</a>
						</li>
					</ul>
				</li>
				<li>
					<a href={'/Search?searchType=ReleaseEvent'}>
						{t('ViewRes:Shared.ReleaseEvents')}
					</a>
					<ul>
						<li>
							<a href={'/Event'}>{t('ViewRes:Layout.UpcomingEvents')}</a>
						</li>
					</ul>
				</li>
				<li>
					<a href={'/SongList/Featured'}>
						{t('ViewRes:Shared.FeaturedSongLists')}
					</a>
				</li>
				<li>
					<a href={'/Tag'}>{t('ViewRes:Layout.Tags')}</a>
				</li>
				<li>
					<Link to="/User">{t('ViewRes:Shared.Users')}</Link>
				</li>
				<li>
					<a href={'/Help'}>{t('ViewRes:Layout.Help')}</a>
				</li>
				<li>
					<Link to="/discussion">{t('ViewRes:Layout.Discussions')}</Link>
				</li>
				<li>
					<a href="https://wiki.vocadb.net/">{t('ViewRes:Layout.Wiki')}</a>
				</li>
				<li>
					<a href={vdb.values.blogUrl}>{t('ViewRes:Layout.Blog')}</a>
				</li>
				{loginManager.canMikuDbImport && (
					<li>
						<a href={'/MikuDbAlbum'}>{t('ViewRes:Layout.MikuDbAlbum')}</a>
					</li>
				)}
				{loginManager.canAccessManageMenu && (
					<li>
						<a href={'/Admin'}>{t('ViewRes:Layout.Manage')}</a>
					</li>
				)}
				{!vdb.values.isLoggedIn && (
					<>
						<li>
							<a
								href={'/User/Login'}
								onClick={(): void => {} /* TODO: showLoginPopup */}
							>
								{t('ViewRes:Layout.LogIn')}
							</a>
						</li>
						<li>
							<a href={'/User/Create'}>{t('ViewRes:Layout.Register')}</a>
						</li>
					</>
				)}
			</ul>
		);
	},
);

export default MainNavigationItems;
