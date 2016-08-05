package diary.fx.app.views.bookmarks;

import diary.database.domain.edges.BOOKMARK;
import diary.database.domain.nodes.Entry;
import diary.database.domain.nodes.Realization;
import lombok.Getter;
import lombok.Setter;

abstract class BookmarkTableRow{
	private @Setter @Getter BOOKMARK bookmark;

}

class RealTableRow extends BookmarkTableRow{
    private @Getter Realization realization;
	public RealTableRow(Realization realization,BOOKMARK bookmark){
		this.realization = realization;
		this.setBookmark(bookmark);
	}
}
class EntrTableRow extends BookmarkTableRow{
	private @Getter Entry entry;
	public EntrTableRow(Entry entry,BOOKMARK bookmark){
		this.entry = entry;
		this.setBookmark(bookmark);
	}
}
