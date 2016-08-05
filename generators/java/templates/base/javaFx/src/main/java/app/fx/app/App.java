package app.fx.app;

import app.Config;
import app.db.Db;
import app.fx.preloader.notifications.Update;
import app.fx.preloader.notifications.Error;
import com.airhacks.afterburner.injection.Injector;
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.stage.Stage;

import java.io.File;

public class App extends Application {

	private AppPresenter pres;
	private AppView view;
	private Stage stage;

    @Override
    public void init() throws Exception {
        /**
         * APP PRE CHECK
         */
        notifyPreloader(new Update("Pre loading check...",-1.0));
        preCheckErrNotification();

        /**
         * ENV
         */
        notifyPreloader(new Update("Setting env...",0.2));

        /**
         * CONFIG
         */
        notifyPreloader(new Update("Reading configuration...",0.25));

        /**
         * DATABASE
         */
        notifyPreloader(new Update("Init database...",0.5));
        Db.open(
                Config.DB.DRIVER,
                Config.DB.URL,
                Config.DB.USERNAME,
                Config.DB.PASSWORD
        );

        /**
         * SEEDING
         */
        notifyPreloader(new Update("Seeding database...",0.75));
        if(Config.DB.SEED) Db.seed();

        notifyPreloader(new Update("Finishing...", 1.0));
        //Todo: Remove this on production Thread.sleep(500);

    }

    @Override
    public void start(Stage stage) throws Exception {
        view = new AppView();
        Scene scene = new Scene(view.getView());

		this.stage = stage;
        this.stage.setScene(scene);
        this.stage.setTitle(Config.APP.NAME);
        this.stage.show();
    }

    @Override
    public void stop() throws Exception {
        Db.close();
        Injector.forgetAll();
    }

    public void preCheckErrNotification() throws Exception {
        boolean pass = true;
        String errStr = "ERRORS:\n";
        String installPath = Config.getInstallPath();

        if (installPath == null) {
            pass = false;
            errStr += " - App is not installed!";

        } else if (!new File(installPath).exists()) {
            pass = false;
            errStr += " - Missing: \"" + installPath + "\"";
        }

        if (!pass) {
            notifyPreloader(new Error(errStr));
        }

    }
}
