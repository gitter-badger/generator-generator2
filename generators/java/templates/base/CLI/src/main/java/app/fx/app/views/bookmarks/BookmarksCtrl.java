package diary.fx.app.views.bookmarks;

import com.airhacks.afterburner.views.FXMLView;
import diary.database.domain.edges.BOOKMARK;
import diary.database.domain.nodes.Entry;
import diary.database.domain.nodes.Realization;
import diary.database.queries.EntryQuery;
import javafx.beans.property.SimpleObjectProperty;
import javafx.scene.Parent;
import javafx.scene.control.TreeItem;
import javafx.scene.control.TreeTableColumn;

import java.util.ArrayList;
import java.util.Map;

public class BookmarksCtrl {

    private static final BookmarksPresenter pres;
    private static final FXMLView view;

    static {
        view = new BookmarksView();
        pres = (BookmarksPresenter) view.getPresenter();
		updateTable();
    }

	public static Parent getView(){
        return view.getView();
    }

	private static void updateTable() {
		final TreeItem<Object> realizationNode = new TreeItem<>("Realizations");
		final TreeItem<Object> entryNode = new TreeItem<>("Entries");
		realizationNode.setExpanded(true);
		entryNode.setExpanded(true);

		for (Map<String, Object> result : new EntryQuery().findRealizationBookmarks()) {
			BOOKMARK bookmark = (BOOKMARK) result.get("bookmark");
			TreeItem<Object> group = new TreeItem(bookmark.getGroup());
			for(Realization realization : (ArrayList<Realization>) result.get("collect(realization)")){
				group.getChildren().add(
                    new TreeItem<>( new RealTableRow(realization,bookmark) )
				);
			}
			group.setExpanded(false);
			realizationNode.getChildren().add(group);
		}

		for (Map<String, Object> result : new EntryQuery().findEntryBookmarks()) {
			BOOKMARK bookmark = (BOOKMARK) result.get("bookmark");
			TreeItem<Object> group = new TreeItem(bookmark.getGroup());
			for(Entry entry: (ArrayList<Entry>) result.get("collect(entry)")){
				group.getChildren().add(
                    new TreeItem<>( new EntrTableRow(entry,bookmark) )
				);
			}
			group.setExpanded(false);
			entryNode.getChildren().add(group);
		}

		final TreeItem<Object> root = new TreeItem<>("Bookmarks");
		root.setExpanded(true);
		root.getChildren().setAll(realizationNode,entryNode);
		pres.getTreeTable().setRoot(root);

		pres.getGroup().setCellValueFactory((TreeTableColumn.CellDataFeatures<Object, Object> p) -> {
			Object object = p.getValue().getValue();
			if(object instanceof RealTableRow)
				return new SimpleObjectProperty<Object>(((RealTableRow) object).getRealization().getBody());
			if (object instanceof EntrTableRow)
				return new SimpleObjectProperty<Object>(((EntrTableRow) object).getEntry().getTitle());
			return new SimpleObjectProperty<Object>(object);
		});
		pres.getDate().setCellValueFactory((TreeTableColumn.CellDataFeatures<Object, Object> p) -> {
			Object object = p.getValue().getValue();
			if(object instanceof BookmarkTableRow)
				return new SimpleObjectProperty<Object>(((BookmarkTableRow) object).getBookmark().getCreatedAt());
			return null;
		});

	}

}
