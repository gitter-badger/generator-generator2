package app.fx.setup.views.intro;

import app.Config;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.text.Text;

import java.net.URL;
import java.util.ResourceBundle;

public class IntroPresenter implements Initializable {

	@FXML
	Text header;

    @Override
    public void initialize(URL url, ResourceBundle rb) {
		header.setText(String.format("Welcome to the %s Setup Wizard",Config.APP.NAME));
    }

}
