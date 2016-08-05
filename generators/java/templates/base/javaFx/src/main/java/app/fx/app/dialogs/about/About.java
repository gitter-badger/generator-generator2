package app.fx.app.dialogs.about;

import com.airhacks.afterburner.views.FXMLView;
import javafx.scene.Scene;
import javafx.stage.Modality;
import javafx.stage.Stage;

public class About {

	private AboutPresenter pres;
	private FXMLView view;

	public About(){
		view = new AboutView();
		pres = (AboutPresenter) view.getPresenter();

		Scene scene = new Scene(view.getView());
		Stage stage = new Stage();
		stage.setScene(scene);
		stage.setResizable(false);
		stage.setTitle("About");
		stage.initModality(Modality.WINDOW_MODAL);
		stage.show();
	}

}
