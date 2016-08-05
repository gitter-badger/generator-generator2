package diary.fx.app.views.realizations;

import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import lombok.Getter;

import java.net.URL;
import java.util.ResourceBundle;

public class RealizationsPresenter implements Initializable {

	@FXML @Getter private TableView<RealizationTableRow> table;
	@FXML @Getter private TableColumn<RealizationTableRow,String> date;
	@FXML @Getter private TableColumn<RealizationTableRow,Integer> importance;
	@FXML @Getter private TableColumn<RealizationTableRow,String> tags;
	@FXML @Getter private TableColumn<RealizationTableRow,String> bookmarked;
	@FXML @Getter private TableColumn<RealizationTableRow,String> body;

    @Override
    public void initialize(URL url, ResourceBundle rb) { }

}
