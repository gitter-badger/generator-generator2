package app.fx.setup;

import app.Config;
import com.airhacks.afterburner.injection.Injector;
import app.fx.app.dialogs.help.Help;
import app.fx.setup.views.finish.FinishCtrl;
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.stage.Stage;

public class Setup extends Application {

	private Stage stage;
    private SetupPresenter pres;
    private SetupView view;

    @Override
    public void start(Stage stage) throws Exception {

        /**
         * APP INSTALLED CHECK
         */
        if (Config.getInstallPath() != null) {
            Alert alert = new Alert(Alert.AlertType.ERROR);
            alert.setTitle("ERROR");
            alert.setHeaderText("Application is installed!");
            alert.setContentText(
                    "Application install folder has been moved!\n" +
                            "Missing path: \"" + Config.getInstallPath() + "\""
            );
            alert.showAndWait();
			System.exit(0);
        }

        /**
         * LOAD FXML STRUCTURE
         */
        view = new SetupView();
        Scene scene = new Scene(view.getView());

        /**
         * SETUP CTRL
         */
        pres = (SetupPresenter) view.getPresenter();

        /**
         * STAGE env
         */
		this.stage = stage;
        this.stage.setScene(scene);
        this.stage.setTitle("Setup");
		this.stage.setResizable(false);
        this.stage.show();

    }


    @Override
    public void stop() throws Exception {

		view.getView().setVisible(false);
        FinishCtrl finish = pres.model.getFinishModule();

		Help help0 = new Help();
		Help help1 = new Help();

        if(finish.showReadme()) help0.showDocumentation();
		if(finish.showTutorial()) help1.showTutorial();

		Injector.forgetAll();

    }
}
