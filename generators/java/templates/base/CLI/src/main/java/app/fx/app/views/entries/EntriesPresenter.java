package diary.fx.app.views.entries;

import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import lombok.Getter;

import java.net.URL;
import java.util.ResourceBundle;

public class EntriesPresenter implements Initializable {

	@FXML @Getter private TableView<EntryTableRow> table;
	@FXML @Getter private TableColumn<EntryTableRow,String> date;
	@FXML @Getter private TableColumn<EntryTableRow,Integer> realizations;
	@FXML @Getter private TableColumn<EntryTableRow,String> bookmarked;
	@FXML @Getter private TableColumn<EntryTableRow,String> tags;
	@FXML @Getter private TableColumn<EntryTableRow,String> title;

	@Override
    public void initialize(URL url, ResourceBundle rb) {

	}
}
