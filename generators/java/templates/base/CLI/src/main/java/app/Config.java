package app;

import java.io.IOException;
import java.util.Properties;
import java.util.prefs.Preferences;

/**
 * # All application configuration holder.
 */
public final class Config {

	/** */
	private Config() {
	}

	/**
	 * Name of execution environment.
	 */
	public static final String ENV = System.getProperty("ENV", "production");

	/** */
	private static final Preferences PREFS = Preferences.userNodeForPackage(Config.class);
	/** */
	private static final Properties ENV_PROPS = new Properties();
	/** */
	private static final Properties APP_PROPS = new Properties();
	/** */
	private static final Properties BUILD_PROPS = new Properties();

	/**
	 * Load all recources configuration properties files.
	 */
	static {
		try {
			ENV_PROPS.load(Main.class.getResourceAsStream("/config/env.properties"));
			APP_PROPS.load(Main.class.getResourceAsStream("/config/app.properties"));
			BUILD_PROPS.load(Main.class.getResourceAsStream("/config/build.properties"));
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	/**
	 * Holder for all application informations.
	 */
	public static final class APP {

		/** */
		public static final String NAME = APP_PROPS.getProperty("name");
		/** */
		public static final String DESCRIPTION = APP_PROPS.getProperty("description");

	}

	/**
	 * Information holder for current build version.
	 */
	public static final class BUILD {

		/** */
		public static final String DATE = BUILD_PROPS.getProperty("date");
		/** */
		public static final String VERSION = BUILD_PROPS.getProperty("version");

	}

	/**
	 * Set preferences installation path for the application.
	 * <p>
	 * In this path application will store:
	 * <p>
	 * - Database.
	 * - Reading user configuration files.
	 * - Logging output.
	 * - etc...
	 *
	 * @param path Should be something like `$USER_HOME`.
	 */
	public static void setInstallPath(final String path) {
		PREFS.put("installPath", path);
	}

	/**
	 * Get installation path from preferences.
	 *
	 * @return String or null.
	 */
	public static String getInstallPath() {
		return PREFS.get("installPath", null);
	}
}
