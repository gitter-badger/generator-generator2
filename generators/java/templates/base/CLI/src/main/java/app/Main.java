package app;

import app.cmd.Default;
import app.cmd.Exec;
import app.cmd.Install;
import org.docopt.Docopt;

import java.util.Map;

/**
 * # Application entry point.
 */
public final class Main {

	/** */
	private Main() {

	}

	/**
	 * Map which should holds simplified `String[] args`.
	 */
	private static Map<String, Object> opts;

	/**
	 * Starting point of execution.
	 * <p>
	 * - Will parse args to more user friendly format.
	 * - Execute 'start()`.
	 * - Execute main logic.
	 * - Execute 'finish()`.
	 *
	 * @param args System args.
	 */
	public static void main(final String[] args) {
		setOpts(args);
		start();

		if (opts.get("install").equals(true)) {
			new Install();
		} else if (opts.get("exec").equals(true)) {
			new Exec(
				(String) opts.get("<name>"),
				(String) opts.get("--option")
			);
		} else {
			new Default();
		}

		finish();
	}

	/**
	 * Parse args with docopt and set opts label.
	 * <p>
	 * Docopt info:
	 * <p>
	 * - Positional arguments: `<argument> , ARGUMENT`
	 * - Short options: `-o ,-abc , -a -b -c`
	 * - Long options: `--option , --option==ARG`
	 * - Optional elements: `[]`
	 * - Required elements: `()`
	 * - Group of arguments: `<argument>... , (<x> <y>)...`
	 * - Options description: `--options==<km>   Info [default: 10]`
	 *
	 * @param args Command arguments
	 */
	private static void setOpts(final String[] args) {
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

	/**
	 * Init starting configuration for main logic.
	 */
	private static void start() {
	}

	/**
	 * Cleaning at the end.
	 * <p>
	 * - Closing database.
	 * - Some finish checks.
	 * - etc...
	 */
	private static void finish() {
	}
}