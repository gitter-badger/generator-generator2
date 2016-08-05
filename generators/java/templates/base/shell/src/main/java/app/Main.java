package app;

import java.io.IOException;
import java.util.Map;

import app.cmd.Install;
import app.cmd.Default;
import app.cmd.Exec;
import app.db.Db;
import app.fx.app.App;
import app.fx.preloader.Preloader;
import app.fx.setup.Setup;
import com.sun.javafx.application.LauncherImpl;
import org.docopt.Docopt;
import org.springframework.shell.Bootstrap;

public final class Main {

    private static Map<String,Object> opts;

    public static void main(final String[] args) {
        start();

        try {
            Bootstrap.main(args);
        } catch (IOException e) {
            e.printStackTrace();
        }

        finish();
    }

    private static void start(){
    }
    private static void finish() {
    }
}
