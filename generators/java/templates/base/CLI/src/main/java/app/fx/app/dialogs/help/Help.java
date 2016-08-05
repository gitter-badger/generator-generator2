package app.fx.app.dialogs.help;

import com.airhacks.afterburner.views.FXMLView;
import javafx.scene.Scene;
import javafx.stage.Modality;
import javafx.stage.Stage;

public class Help {

	private HelpPresenter pres;
	private FXMLView view;

	public Help(){
		view = new HelpView();
		pres = (HelpPresenter) view.getPresenter();
	}

	public void showTutorial(){
		pres.initTutorial();
		init();
	}

	public void showDocumentation() {
		pres.initDocs();
		init();
	}

	private void init(){
		Scene scene = new Scene(view.getView());
		Stage stage = new Stage();
		stage.setScene(scene);
		stage.setResizable(false);
		stage.setTitle("Help");
		stage.initModality(Modality.WINDOW_MODAL);
		stage.showAndWait();
	}

}
