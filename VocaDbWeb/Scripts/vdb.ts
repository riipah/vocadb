/* eslint-disable prettier/prettier */
/* eslint-disable import/first */

import './VocaDb'

// ~/bundles/shared/common
export { setLanguagePreferenceCookie } from '@Shared/TopBar';
export { default as ui } from '@Shared/MessagesTyped';
export { default as functions } from '@Shared/GlobalFunctions';
export { default as HttpClient } from '@Shared/HttpClient';
export { default as UrlMapper } from '@Shared/UrlMapper';
import '@KnockoutExtensions/StopBinding';
import '@KnockoutExtensions/Show';
export { default as EntryReportRepository } from '@Repositories/EntryReportRepository';
export { default as UserRepository } from '@Repositories/UserRepository';
export { default as TopBarViewModel } from '@ViewModels/TopBarViewModel';
export { default as SharedLayoutScripts } from '@Shared/SharedLayoutScripts';

// ~/bundles/shared/main
export { default as EntryUrlMapper } from '@Shared/EntryUrlMapper';
import '@KnockoutExtensions/ConfirmClick';
import '@KnockoutExtensions/Dialog';
import '@KnockoutExtensions/EntryToolTip';
import '@KnockoutExtensions/jqButton';
import '@KnockoutExtensions/jqButtonset';
import '@KnockoutExtensions/Markdown';
import '@KnockoutExtensions/ToggleClick';
import '@KnockoutExtensions/Song/SongTypeLabel';
import '@KnockoutExtensions/Bootstrap/Tooltip';
import '@KnockoutExtensions/qTip';
import '@KnockoutExtensions/TagAutoComplete';
import '@KnockoutExtensions/Filters/Truncate';
export { default as TagRepository } from '@Repositories/TagRepository';
export { default as ResourceRepository } from '@Repositories/ResourceRepository';
export { default as SongRepository } from '@Repositories/SongRepository';
export { default as ArtistRepository } from '@Repositories/ArtistRepository';

// ~/bundles/shared/edit
export { default as DialogService } from '@Shared/DialogService';
import '@KnockoutExtensions/ArtistAutoComplete';
import '@KnockoutExtensions/SongAutoComplete';
import '@KnockoutExtensions/FocusOut';
import '@KnockoutExtensions/InitialValue';

// ~/bundles/Home/Index
export { default as NewsListViewModel } from '@ViewModels/NewsListViewModel';
export { default as HomeIndex } from './Home/Index';

// ~/bundles/ActivityEntry/Index
import '@KnockoutExtensions/MomentJsTimeAgo';
//export { default as ResourceRepository } from '@Repositories/ResourceRepository';
export { default as ActivityEntryListViewModel } from '@ViewModels/ActivityEntry/ActivityEntryListViewModel';
export { default as ActivityEntryIndex } from './ActivityEntry/Index';

// ~/bundles/Admin/ManageEntryTagMappings
import '@KnockoutExtensions/TagAutoComplete';
export { default as ManageEntryTagMappingsViewModel } from '@ViewModels/Admin/ManageEntryTagMappingsViewModel';
export { default as AdminManageEntryTagMappings } from './Admin/ManageEntryTagMappings';

// ~/bundles/Admin/ManageTagMappings
import '@KnockoutExtensions/TagAutoComplete';
export { default as ManageTagMappingsViewModel } from '@ViewModels/Admin/ManageTagMappingsViewModel';
export { default as AdminManageTagMappings } from './Admin/ManageTagMappings';

// ~/bundles/Admin/ManageIPRules
import '@KnockoutExtensions/FormatDateFilter';
export { default as AdminRepository } from '@Repositories/AdminRepository';
export { default as ManageIPRulesViewModel } from '@ViewModels/Admin/ManageIPRulesViewModel';
export { default as AdminManageIPRules } from './Admin/ManageIPRules';

// ~/bundles/Admin/ManageWebhooks
export { default as AdminManageWebhooks } from './Admin/ManageWebhooks';

// ~/bundles/Admin/PVsByAuthor
export { default as AdminPVsByAuthor } from './Admin/PVsByAuthor';

// ~/bundles/Admin/ViewAuditLog
export { default as ViewAuditLogViewModel } from '@ViewModels/Admin/ViewAuditLogViewModel';
export { default as AdminViewAuditLog } from './Admin/ViewAuditLog';

// ~/bundles/Album/Create
export { default as AlbumCreateViewModel } from '@ViewModels/Album/AlbumCreateViewModel';
export { default as AlbumCreate } from './Album/Create';

// ~/bundles/Album/Deleted
export { default as AlbumRepository } from '@Repositories/AlbumRepository';
export { default as DeletedAlbumsViewModel } from '@ViewModels/Album/DeletedAlbumsViewModel';
export { default as AlbumDeleted } from './Album/Deleted';

// ~/bundles/Album/Details
import '@KnockoutExtensions/MomentJsTimeAgo';
import '@KnockoutExtensions/FormatDateFilter';
export { default as AlbumDetailsViewModel } from '@ViewModels/Album/AlbumDetailsViewModel';
export { default as AlbumDetails } from './Album/Details';

// ~/bundles/Album/Edit
import '@KnockoutExtensions/ParseInteger';
import '@KnockoutExtensions/FormatLengthSecondsFilter';
import '@KnockoutExtensions/BindingHandlers/ReleaseEventAutoComplete';
import '@KnockoutExtensions/FormatDateFilter';
export { default as AlbumEditViewModel } from '@ViewModels/Album/AlbumEditViewModel';
export { default as AlbumEdit } from './Album/Edit';

// ~/bundles/Album/Merge
import '@KnockoutExtensions/AlbumAutoComplete';
//export { default as AlbumRepository } from '@Repositories/AlbumRepository';
export { default as AlbumMergeViewModel } from '@ViewModels/Album/AlbumMergeViewModel';
export { default as AlbumMerge } from './Album/Merge';

// ~/bundles/Album/ViewVersion
//export { default as AlbumRepository } from '@Repositories/AlbumRepository';
export { default as ArchivedAlbumViewModel } from '@ViewModels/Album/ArchivedAlbumViewModel';
export { default as AlbumViewVersion } from './Album/ViewVersion';

// ~/bundles/Artist/Create
export { default as ArtistCreateViewModel } from '@ViewModels/ArtistCreateViewModel';
export { default as ArtistCreate } from './Artist/Create';

// ~/bundles/Artist/Details
import '@KnockoutExtensions/MomentJsTimeAgo';
import '@KnockoutExtensions/SlideVisible';
import '@KnockoutExtensions/ScrollEnd';
import '@KnockoutExtensions/Highcharts';
export { default as PVPlayersFactory } from '@ViewModels/PVs/PVPlayersFactory';
export { default as ArtistDetailsViewModel } from '@ViewModels/Artist/ArtistDetailsViewModel';
export { default as ArtistDetails } from './Artist/Details';

// ~/bundles/Artist/Edit
import '@KnockoutExtensions/BindingHandlers/DatePicker';
export { default as ArtistEditViewModel } from '@ViewModels/Artist/ArtistEditViewModel';
export { default as ArtistEdit } from './Artist/Edit';

// ~/bundles/Artist/Merge
import '@KnockoutExtensions/ArtistAutoComplete';
export { default as ArtistMergeViewModel } from '@ViewModels/Artist/ArtistMergeViewModel';
export { default as ArtistMerge } from './Artist/Merge';

// ~/bundles/Artist/ViewVersion
export { default as ArchivedArtistViewModel } from '@ViewModels/Artist/ArchivedArtistViewModel';
export { default as ArtistViewVersion } from './Artist/ViewVersion';

// ~/bundles/Comment/Index
export { default as CommentListViewModel } from '@ViewModels/Comment/CommentListViewModel';

// ~/bundles/Comment/CommentsByUser
export { default as CommentCommentsByUser } from './Comment/CommentsByUser';

// ~/bundles/Discussion/Index
import '@KnockoutExtensions/FormatDateFilter';
import '@KnockoutExtensions/MomentJsTimeAgo';
export { default as DiscussionIndexViewModel } from '@ViewModels/Discussion/DiscussionIndexViewModel';
export { default as DiscussionIndex } from './Discussion/Index';

// ~/bundles/EventSeries/Details
export { default as EventSeriesDetailsViewModel } from '@ViewModels/ReleaseEvent/EventSeriesDetailsViewModel';
export { default as EventSeriesDetails } from './Event/SeriesDetails';

// ~/bundles/EventSeries/Edit
export { default as ReleaseEventRepository } from '@Repositories/ReleaseEventRepository';
export { default as ReleaseEventSeriesEditViewModel } from '@ViewModels/ReleaseEvent/ReleaseEventSeriesEditViewModel';
export { default as EventEditSeries } from './Event/EditSeries';

// ~/bundles/EventSeries/ViewVersion
//export { default as ReleaseEventRepository } from '@Repositories/ReleaseEventRepository';
export { default as ArchivedEntryViewModel } from '@ViewModels/ArchivedEntryViewModel';
export { default as EventViewSeriesVersion } from './Event/ViewSeriesVersion';

// ~/bundles/MikuDbAlbum/Index
export { default as MikuDbAlbumIndex } from './MikuDbAlbum/Index';

// ~/bundles/MikuDbAlbum/PrepareForImport
export { default as MikuDbAlbumPrepareForImport } from './MikuDbAlbum/PrepareForImport';

// ~/bundles/ReleaseEvent/Details
//export { default as ReleaseEventRepository } from '@Repositories/ReleaseEventRepository';
export { default as ReleaseEventDetailsViewModel } from '@ViewModels/ReleaseEvent/ReleaseEventDetailsViewModel';
export { default as EventDetails } from './Event/Details';

// ~/bundles/ReleaseEvent/Edit
import '@KnockoutExtensions/BindingHandlers/DatePicker';
import '@KnockoutExtensions/ReleaseEventSeriesAutoComplete';
import '@KnockoutExtensions/BindingHandlers/SongListAutoComplete';
import '@KnockoutExtensions/BindingHandlers/VenueAutoComplete';
import '@KnockoutExtensions/FormatDateFilter';
import '@KnockoutExtensions/FormatLengthSecondsFilter';
export { default as ReleaseEventEditViewModel } from '@ViewModels/ReleaseEvent/ReleaseEventEditViewModel';
export { default as EventEdit } from './Event/Edit';

// ~/bundles/ReleaseEvent/EventsBySeries
export { default as EventEventsBySeries } from './Event/EventsBySeries';

// ~/bundles/ReleaseEvent/EventsByVenue
export { default as EventEventsByVenue } from './Event/EventsByVenue';

// ~/bundles/ReleaseEvent/Index
export { default as EventIndex } from './Event/Index';

// ~/bundles/ReleaseEvent/ViewVersion
//export { default as ReleaseEventRepository } from '@Repositories/ReleaseEventRepository';
//export { default as ReleaseEventDetailsViewModel } from '@ViewModels/ReleaseEvent/ReleaseEventDetailsViewModel'
export { default as EventViewVersion } from './Event/ViewVersion';

// ~/bundles/Search/Index
import '@KnockoutExtensions/Artist/ArtistTypeLabel';
import '@KnockoutExtensions/Tag/TagCategoryAutoComplete';
import '@KnockoutExtensions/ArtistAutoComplete';
import '@KnockoutExtensions/SlideVisible';
import '@KnockoutExtensions/ScrollEnd';
import '@KnockoutExtensions/BindingHandlers/ReleaseEventAutoComplete';
import '@KnockoutExtensions/BindingHandlers/DatePicker';
import '@KnockoutExtensions/SongAutoComplete';
//export { default as PVPlayersFactory } from '@ViewModels/PVs/PVPlayersFactory';
export { default as SearchViewModel } from '@ViewModels/Search/SearchViewModel';
export { default as SearchIndex } from './Search/Index';

// ~/bundles/Song/Create
import '@KnockoutExtensions/Artist/ArtistTypeLabel';
export { default as SongCreateViewModel } from '@ViewModels/SongCreateViewModel';
export { default as SongCreate } from './Song/Create';

// ~/bundles/Song/Details
import '@KnockoutExtensions/MomentJsTimeAgo';
export { default as SongDetailsViewModel } from '@ViewModels/Song/SongDetailsViewModel';
export { default as SongDetails } from './Song/Details';

// ~/bundles/Song/Edit
import '@KnockoutExtensions/FormatDateFilter';
import '@KnockoutExtensions/FormatLengthSecondsFilter';
import '@KnockoutExtensions/BindingHandlers/DatePicker';
import '@KnockoutExtensions/BindingHandlers/ReleaseEventAutoComplete';
export { default as SongEditViewModel } from '@ViewModels/Song/SongEditViewModel';
export { default as SongEdit } from './Song/Edit';

// ~/bundles/Song/Merge
export { default as SongMergeViewModel } from '@ViewModels/Song/SongMergeViewModel';
export { default as SongMerge } from './Song/Merge';

// ~/bundles/Song/TopRated
import '@KnockoutExtensions/SlideVisible';
import '@KnockoutExtensions/FormatDateFilter';
export { default as RankingsViewModel } from '@ViewModels/Song/RankingsViewModel';
export { default as SongRankings } from './Song/Rankings';

// ~/bundles/Song/ViewVersion
export { default as ArchivedSongViewModel } from '@ViewModels/Song/ArchivedSongViewModel';
export { default as SongViewVersion } from './Song/ViewVersion';

// ~/bundles/SongList/Details
import '@KnockoutExtensions/SlideVisible';
import '@KnockoutExtensions/ScrollEnd';
import '@KnockoutExtensions/ArtistAutoComplete';
//export { default as PVPlayersFactory } from '@ViewModels/PVs/PVPlayersFactory';
export { default as SongListViewModel } from '@ViewModels/SongList/SongListViewModel';
export { default as SongListDetails } from './SongList/Details';

// ~/bundles/SongList/Edit
import '@KnockoutExtensions/BindingHandlers/DatePicker';
export { default as SongListEditViewModel } from '@ViewModels/SongList/SongListEditViewModel';
export { default as SongListEdit } from './SongList/Edit';

// ~/bundles/SongList/Featured
import '@KnockoutExtensions/FormatDateFilter';
export { default as FeaturedSongListsViewModel } from '@ViewModels/SongList/FeaturedSongListsViewModel';
export { default as SongListFeatured } from './SongList/Featured';

// ~/bundles/SongList/Import
export { default as ImportSongListViewModel } from '@ViewModels/SongList/ImportSongListViewModel';
export { default as SongListImport } from './SongList/Import';

// ~/bundles/Stats/Index
import '@KnockoutExtensions/Highcharts';
export { default as StatsViewModel } from '@ViewModels/StatsViewModel';
export { default as StatsIndex } from './Stats/Index';

// ~/bundles/Tag/Details
import '@KnockoutExtensions/MomentJsTimeAgo';
//export { default as TagRepository } from '@Repositories/TagRepository';
export { default as TagDetailsViewModel } from '@ViewModels/Tag/TagDetailsViewModel';
export { default as TagDetails } from './Tag/Details';

// ~/bundles/Tag/Edit
import '@KnockoutExtensions/Tag/TagCategoryAutoComplete';
//export { default as TagRepository } from '@Repositories/TagRepository';
export { default as TagEditViewModel } from '@ViewModels/TagEditViewModel';
export { default as TagEdit } from './Tag/Edit';

// ~/bundles/Tag/Index
//export { default as TagRepository } from '@Repositories/TagRepository';
export { default as TagCreateViewModel } from '@ViewModels/Tag/TagCreateViewModel';
export { default as TagIndex } from './Tag/Index';

// ~/bundles/Tag/Merge
//export { default as TagRepository } from '@Repositories/TagRepository';
export { default as TagMergeViewModel } from '@ViewModels/Tag/TagMergeViewModel';
export { default as TagMerge } from './Tag/Merge';

// ~/bundles/Tag/ViewVersion
//export { default as TagRepository } from '@Repositories/TagRepository';
//export { default as ArchivedEntryViewModel } from '@ViewModels/ArchivedEntryViewModel';
export { default as TagViewVersion } from './Tag/ViewVersion';

// ~/bundles/User/AlbumCollection
import '@KnockoutExtensions/ArtistAutoComplete';
import '@KnockoutExtensions/BindingHandlers/ReleaseEventAutoComplete';
export { default as AlbumCollectionViewModel } from '@ViewModels/User/AlbumCollectionViewModel';
export { default as UserAlbumCollection } from './User/AlbumCollection';

// ~/bundles/User/Details
import '@KnockoutExtensions/SlideVisible';
import '@KnockoutExtensions/ArtistAutoComplete';
import '@KnockoutExtensions/MomentJsTimeAgo';
import '@KnockoutExtensions/BindingHandlers/ReleaseEventAutoComplete';
import '@KnockoutExtensions/Highcharts';
import '@KnockoutExtensions/ScrollEnd';
import '@KnockoutExtensions/FormatDateFilter';
//export { default as PVPlayersFactory } from '@ViewModels/PVs/PVPlayersFactory';
export { default as FollowedArtistsViewModel } from '@ViewModels/User/FollowedArtistsViewModel';
export { default as RatedSongsSearchViewModel } from '@ViewModels/User/RatedSongsSearchViewModel';
//export { default as AlbumCollectionViewModel } from '@ViewModels/User/AlbumCollectionViewModel';
export { default as UserDetailsViewModel } from '@ViewModels/User/UserDetailsViewModel';
export { default as UserDetails } from './User/Details';

// ~/bundles/User/Edit
export { default as UserEdit } from './User/Edit';

// ~/bundles/User/EntryEdits
export { default as UserEntryEdits } from './User/EntryEdits';

// ~/bundles/User/FavoriteSongs
export { default as UserFavoriteSongs } from './User/FavoriteSongs';

// ~/bundles/User/Index
export { default as ListUsersViewModel } from '@ViewModels/User/ListUsersViewModel';
export { default as UserIndex } from './User/Index';

// ~/bundles/User/Messages
import '@KnockoutExtensions/BindingHandlers/UserAutoComplete';
export { default as UserMessagesViewModel } from '@ViewModels/User/UserMessagesViewModel';
export { default as UserMessages } from './User/Messages';

// ~/bundles/User/MySettings
export { default as MySettingsViewModel } from '@ViewModels/User/MySettingsViewModel';
export { default as UserMySettings } from './User/MySettings';

// ~/bundles/User/RatedSongs
import '@KnockoutExtensions/SlideVisible';
import '@KnockoutExtensions/ArtistAutoComplete';
import '@KnockoutExtensions/ScrollEnd';
//export { default as PVPlayersFactory } from '@ViewModels/PVs/PVPlayersFactory';
//export { default as RatedSongsSearchViewModel } from '@ViewModels/User/RatedSongsSearchViewModel';

// ~/bundles/User/RequestVerification
export { default as RequestVerificationViewModel } from '@ViewModels/User/RequestVerificationViewModel';
export { default as UserRequestVerification } from './User/RequestVerification';

// ~/bundles/User/Stats
export { default as UserStats } from './User/Stats';

// ~/bundles/Venue/Details
export { default as VenueDetailsViewModel } from '@ViewModels/Venue/VenueDetailsViewModel';
export { default as VenueDetails } from './Venue/Details';

// ~/bundles/Venue/Edit
export { default as VenueEditViewModel } from '@ViewModels/Venue/VenueEditViewModel';
export { default as VenueEdit } from './Venue/Edit';

// ~/bundles/Venue/ViewVersion
export { default as VenueRepository } from '@Repositories/VenueRepository';
export { default as VenueViewVersion } from './Venue/ViewVersion';
