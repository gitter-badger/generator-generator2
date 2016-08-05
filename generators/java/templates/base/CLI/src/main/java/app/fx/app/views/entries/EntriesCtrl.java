package diary.fx.app.views.entries;

import com.airhacks.afterburner.views.FXMLView;
import diary.database.domain.edges.BOOKMARK;
import diary.database.domain.edges.CONTENT;
import diary.database.domain.nodes.Entry;
import diary.database.queries.EntryQuery;
import javafx.beans.property.SimpleObjectProperty;
import javafx.collections.FXCollections;
import javafx.scene.Parent;
import javafx.scene.control.TableColumn;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Todo: Controllers must be static all the time... good example is with angular (facility_redezign)!
 */
public class EntriesCtrl {

    private static final EntriesPresenter pres;
    private static final FXMLView view;

    static {
		view = new EntriesView();
        pres = (EntriesPresenter) view.getPresenter();
		updateTable();
    }

	public static Parent getView(){
		return view.getView();
	}

	private static void updateTable() {

		List<EntryTableRow> rows = new ArrayList<>();

		for (Map<String, Object> result : new EntryQuery().findEntryTableInfos()) {

			rows.add(new EntryTableRow(
                (BOOKMARK) result.get("bookmark"),
                (int) result.get("count(realization)"),
                (Entry) result.get("entry"),
                (CONTENT) result.get("content")
			));

		}

		pres.getDate().setCellValueFactory((TableColumn.CellDataFeatures<EntryTableRow, String> p) -> {
			return new SimpleObjectProperty<String>(p.getValue().getEntry().getCreatedAt().toString());
		});
		pres.getRealizations().setCellValueFactory((TableColumn.CellDataFeatures<EntryTableRow, Integer> p) -> {
			return new SimpleObjectProperty<Integer>(p.getValue().getCountRealizations());
		});
		pres.getBookmarked().setCellValueFactory((TableColumn.CellDataFeatures<EntryTableRow,String> p) -> {
			BOOKMARK bookmark = p.getValue().getBookmark();
			String returnStr = null;
			if(bookmark != null) returnStr = p.getValue().getBookmark().getGroup();
			return new SimpleObjectProperty<String>(returnStr);
		});
		pres.getTags().setCellValueFactory((TableColumn.CellDataFeatures<EntryTableRow, String> p) -> {
			return new SimpleObjectProperty<String>(String.join(", ", p.getValue().getContent().getTags()));
		});
		pres.getTitle().setCellValueFactory((TableColumn.CellDataFeatures<EntryTableRow, String> p) -> {
			return new SimpleObjectProperty<String>(p.getValue().getEntry().getTitle());
		});

		pres.getTable().setItems(FXCollections.observableArrayList(rows));
	}
}
