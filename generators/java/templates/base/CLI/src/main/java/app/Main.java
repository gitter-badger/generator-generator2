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
        setOpts(args);
        start();

        if(opts.get("install").equals(true)){
            new Install();
        }
        else if(opts.get("exec").equals(true)){
            new Exec(
                (String) opts.get("<name>"),
                (String) opts.get("--option")
            );
        }
        else{
            new Default();
        }

        finish();
    }

    private static void setOpts(String[] args){
        /**
         * Positional arguments: <argument> , ARGUMENT
         * Short options: -o ,-abc , -a -b -c
         * Long options: --option , --option==ARG
         * Optional elements: []
         * Required elements: ()
         * Group of arguments: <argument>... , (<x> <y>)...
         * Options description: --options==<km>   Info [default: 10]
         */
        opts = new Docopt(
                "Description:\n"
                        + String.format("  %s\n", Config.APP.DESCRIPTION)
                        + "\n"
                        + "Usage:\n"
                        + String.format("  %s\n", Config.APP.NAME)
                        + String.format("  %s install\n", Config.APP.NAME)
                        + String.format("  %s exec <name> --option=ARGS\n", Config.APP.NAME)
                        + String.format("  %s (-h | --help)\n", Config.APP.NAME)
                        + String.format("  %s (-v | --version)\n", Config.APP.NAME)
                        + "\n"
                        + "Options:\n"
                        + "  -v --version  Show version.\n"
                        + "  -h --help     Show this screen.\n"
                        + "\n")
                .withVersion(Config.APP.NAME + " " + Config.BUILD.VERSION)
                .parse(args);
    }
    private static void start(){
    }
    private static void finish() {
    }
}
