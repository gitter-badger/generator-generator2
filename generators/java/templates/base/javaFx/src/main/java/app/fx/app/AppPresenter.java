package app.fx.app;

import app.fx.app.dialogs.about.About;
import app.fx.app.dialogs.help.Help;
import javafx.application.Platform;
import javafx.fxml.Initializable;

import java.net.URL;
import java.util.ResourceBundle;

public class AppPresenter implements Initializable {

	@Override
	public void initialize(URL url, ResourceBundle rb) { }

	public void exit(){
		Platform.exit();
	}

	public void findEntries(){
		//Todo: Implementation.
		System.out.println("Find entries");
	}

	public void showTutorial(){
		new Help().showTutorial();
	}

	public void showDocs(){
		new Help().showDocumentation();
	}

	public void showAbout(){
		new About();
	}

}

