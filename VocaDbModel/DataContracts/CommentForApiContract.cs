#nullable disable

using System;
using System.Runtime.Serialization;
using VocaDb.Model.DataContracts.Api;
using VocaDb.Model.DataContracts.Users;
using VocaDb.Model.Domain.Comments;

namespace VocaDb.Model.DataContracts
{
	[DataContract]
	public class CommentForApiContract : IComment
	{
		public CommentForApiContract() { }

		public CommentForApiContract(Comment comment, IUserIconFactory iconFactory, bool includeMessage = true)
		{
			ParamIs.NotNull(() => comment);

			Author = comment.Author != null ? new UserForApiContract(comment.Author, iconFactory, UserOptionalFields.MainPicture) : null;
			AuthorName = comment.Author?.Name;
			Created = comment.Created.ToUniversalTime();
			Id = comment.Id;
			Message = (includeMessage ? comment.Message : null);
		}

		[DataMember]
		public UserForApiContract Author { get; init; }

		[DataMember]
		public string AuthorName { get; init; }

		/// <summary>
		/// Comment creation date in UTC.
		/// </summary>
		[DataMember]
		public DateTime Created { get; init; }

		[DataMember(EmitDefaultValue = false)]
		public EntryForApiContract Entry { get; init; }

		[DataMember]
		public int Id { get; set; }

		[DataMember]
		public string Message { get; init; }
	}

	[Flags]
	public enum CommentOptionalFields
	{
		None = 0,
		Entry = 1 << 0,
	}
}
