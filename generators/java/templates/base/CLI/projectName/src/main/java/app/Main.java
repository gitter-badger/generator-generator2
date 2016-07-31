package app;

import java.util.Map;
import app.cmd.Install;
import app.cmd.Default;
import app.cmd.Exec;
import org.docopt.Docopt;

public final class Main {

    public static void main(final String[] args) {
        /**
         * Positional arguments: <argument> , ARGUMENT
         * Short options: -o ,-abc , -a -b -c
         * Long options: --option , --option==ARG
         * Optional elements: []
         * Required elements: ()
         * Group of arguments: <argument>... , (<x> <y>)...
         * Options description: --options==<km>   Info [default: 10]
         */
        final Map<String, Object> opts = new Docopt(
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

        System.out.println(opts);

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

    }
}