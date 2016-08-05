package diary.fx.app.views.bookmarks;

import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.TreeTableColumn;
import javafx.scene.control.TreeTableView;
import lombok.Getter;

import java.net.URL;
import java.util.ResourceBundle;

public class BookmarksPresenter implements Initializable {

	@FXML @Getter private TreeTableView<Object> treeTable;
	@FXML @Getter private TreeTableColumn<Object,Object> group;
	@FXML @Getter private TreeTableColumn<Object,Object> date;

    @Override
    public void initialize(URL url, ResourceBundle rb) { }

}
