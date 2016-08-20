package app.cmd;

/** */
public class Exec {

	/**
	 * Nice and clean code execution steps in constructor.
	 *
	 * @param name Cmd name.
	 * @param options Cmd option.
	 * @see app.Main#setOpts(String[]) More information about constructor parameters.
	 */
	public Exec(final String name, final String options) {
		System.out.println("Execute exec command...");
		System.out.println(" - " + name);
		System.out.println(" - " + options);
	}
}
