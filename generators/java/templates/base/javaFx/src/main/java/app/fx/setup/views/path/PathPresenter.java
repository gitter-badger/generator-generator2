package app.fx.setup.views.path;

import app.Config;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.stage.DirectoryChooser;
import lombok.Getter;

import java.io.File;
import java.net.URL;
import java.util.ResourceBundle;

public class PathPresenter implements Initializable {

    @FXML
    private Button browseButton;

    @FXML
    @Getter private TextField dirField;

    @FXML
    private Label appSpaceLabel;

    @FXML
    private Label freeSpaceLabel;

    @Override
    public void initialize(URL url, ResourceBundle rb) {
        File appDir = new File(System.getProperty("user.home"),Config.APP.NAME.toLowerCase());
        dirField.setText(appDir.getPath());

        appSpaceLabel.setText("~ 10MB");

        freeSpaceLabel.setText(
            String.format("%.2f", File.listRoots()[0].getFreeSpace() / 1000000000.00)
            + "GB"
        );

    }

    public void browse(){
		String packageName = Config.APP.NAME.toLowerCase();

        DirectoryChooser directoryChooser = new DirectoryChooser();
        directoryChooser.setInitialDirectory(new File(dirField.getText()).getParentFile());
        directoryChooser.setTitle("Installation directory...");
        File selectedDir = directoryChooser.showDialog(browseButton.getScene().getWindow());

        if (selectedDir != null) {
            File appDir = new File(selectedDir.getAbsolutePath(),packageName);
            dirField.setText(appDir.getPath());

            if (appDir.exists()) {
                Alert alert = new Alert(Alert.AlertType.WARNING);
                alert.setTitle("WARNING");
                alert.setHeaderText("Directory duplicates.");
                alert.setContentText(String.format("One or more folders with the name '%s' already exist!",packageName));
                alert.showAndWait();

                dirField.setText(System.getProperty("user.home"));
                browse();
            }
        }
    }



}
