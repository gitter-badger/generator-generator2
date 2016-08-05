package diary.fx.app.views.realizations;

import com.airhacks.afterburner.views.FXMLView;
import diary.database.domain.edges.BOOKMARK;
import diary.database.domain.edges.CONTENT;
import diary.database.domain.nodes.Realization;
import diary.database.queries.EntryQuery;
import javafx.beans.property.SimpleObjectProperty;
import javafx.collections.FXCollections;
import javafx.scene.Parent;
import javafx.scene.control.TableColumn;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class RealizationsCtrl {

    private static final RealizationsPresenter pres;
    private static final FXMLView view;

    static {
        view = new RealizationsView();
        pres = (RealizationsPresenter) view.getPresenter();
		updateTable();
    }

    public static Parent getView(){
        return view.getView();
    }

	private static void updateTable() {

		List<RealizationTableRow> rows = new ArrayList<>();

		for (Map<String, Object> result : new EntryQuery().findRealizationTableInfos()) {

			rows.add(new RealizationTableRow(
                (Realization) result.get("realization"),
                (CONTENT) result.get("content"),
                (BOOKMARK) result.get("bookmark")
			));

		}

		pres.getDate().setCellValueFactory((TableColumn.CellDataFeatures<RealizationTableRow, String> p) -> {
			return new SimpleObjectProperty<String>(p.getValue().getRealization().getCreatedAt().toString());
		});
		pres.getImportance().setCellValueFactory((TableColumn.CellDataFeatures<RealizationTableRow, Integer> p) -> {
			return new SimpleObjectProperty<Integer>(p.getValue().getRealization().getImportance());
		});
		pres.getBookmarked().setCellValueFactory((TableColumn.CellDataFeatures<RealizationTableRow, String> p) -> {
			BOOKMARK bookmark = p.getValue().getBookmark();
			String returnStr = null;
			if(bookmark != null) returnStr = bookmark.getGroup();
			return new SimpleObjectProperty<String>(returnStr);
		});
		pres.getTags().setCellValueFactory((TableColumn.CellDataFeatures<RealizationTableRow, String> p) -> {
			return new SimpleObjectProperty<String>(String.join(", ",p.getValue().getContent().getTags()));
		});
		pres.getBody().setCellValueFactory((TableColumn.CellDataFeatures<RealizationTableRow, String> p) -> {
			return new SimpleObjectProperty<String>(p.getValue().getRealization().getBody());
		});

		pres.getTable().setItems(FXCollections.observableArrayList(rows));
	}
}
