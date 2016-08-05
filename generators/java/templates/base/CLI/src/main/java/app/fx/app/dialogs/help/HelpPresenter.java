package app.fx.app.dialogs.help;

import javafx.concurrent.Worker;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.ProgressIndicator;
import javafx.scene.web.WebView;
import org.apache.commons.io.IOUtils;
import org.markdown4j.Markdown4jProcessor;

import java.io.IOException;
import java.net.URL;
import java.util.ResourceBundle;

public class HelpPresenter implements Initializable {

	@FXML private WebView video;
	@FXML private ProgressIndicator progress;

    @Override
    public void initialize(URL url, ResourceBundle rb) {
		video.setVisible(false);
		progress.progressProperty().bind(video.getEngine().getLoadWorker().progressProperty());
		video.getEngine().getLoadWorker().stateProperty().addListener( (ov, oldState, newState) -> {
            if (newState == Worker.State.SUCCEEDED) {
                progress.setVisible(false);
                video.setVisible(true);
            }
        });
    }

	public void initTutorial() {
		//Todo: Download latest java 8.
		//Todo: Upload video & change url to tutorials.
		video.getEngine().load(
            "https://www.youtube.com/embed/pPFabRaQI-0?list=RDpPFabRaQI-0"
		);
	}

	public void initDocs() {
		try{
			String docsMd = IOUtils.toString(this.getClass().getResourceAsStream("/data/docs.md"));
			String docsHtml = new Markdown4jProcessor().process(docsMd);
			video.getEngine().loadContent(docsHtml);
		} catch (IOException e){
			e.printStackTrace();
		}
	}
}
