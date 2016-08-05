package diary.fx.setup.views.license;

import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.RadioButton;
import javafx.scene.control.TextArea;
import javafx.scene.control.ToggleGroup;
import org.apache.commons.io.IOUtils;

import java.net.URL;
import java.util.ResourceBundle;

public class LicensePresenter implements Initializable {

    @FXML
    private TextArea license;

    @FXML
    public ToggleGroup termsGroup;

    @FXML
    public RadioButton agreeRadioBtn;

    @Override
    public void initialize(URL url, ResourceBundle rb) {
        try{
            String lic = IOUtils.toString(
                this.getClass().getResourceAsStream("/data/license-gpl-3.0.txt"),
                "UTF-8"
            );
            license.setText(lic);
        } catch (Exception e){
            e.printStackTrace();
        }

    }

}
