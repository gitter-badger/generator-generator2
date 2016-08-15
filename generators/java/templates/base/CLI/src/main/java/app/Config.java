package app;

import java.io.File;
import java.io.IOException;
import java.util.Properties;
import java.util.prefs.Preferences;
import org.apache.commons.validator.routines.UrlValidator;

/**
 * # All application configuration holder.
 */
final public class Config {

	/**
	 * Name of execution environment.
	 */
    public static final String ENV = System.getProperty("ENV", "production");

    private static final Preferences prefs = Preferences.userNodeForPackage(Config.class);
    private static final Properties envProps = new Properties();
    private static final Properties appProps = new Properties();
    private static final Properties buildProps = new Properties();

	/**
	 * Load all recources configuration properties files.
	 */
    static {
        try {
            envProps.load(Main.class.getResourceAsStream("/config/env.properties"));
            appProps.load(Main.class.getResourceAsStream("/config/app.properties"));
            buildProps.load(Main.class.getResourceAsStream("/config/build.properties"));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

	/**
	 * Holder for all application informations.
	 */
    final static public class APP {

        public static final String NAME = appProps.getProperty("name");
        public static final String DESCRIPTION = appProps.getProperty("description");
        public static final String HOMEPAGE = appProps.getProperty("homepage");
        public static final String LICENSE = appProps.getProperty("license");
        public static final String AUTHOR_NAME = appProps.getProperty("authorName");
        public static final String AUTHOR_EMAIL = appProps.getProperty("authorEmail");
        public static final String AUTHOR_URL = appProps.getProperty("authorUrl");

    }

	/**
	 * Information holder for current build version.
	 */
    final static public class BUILD {

        public static final String DATE = buildProps.getProperty("date");
        public static final String VERSION = buildProps.getProperty("version");

    }

	/**
	 * Set preferences installation path for the application.
	 *
	 * In this path application will store:
	 *
	 *  - Database.
	 *  - Reading user configuration files.
	 *  - Logging output.
	 *  - etc...
	 *
	 * @param path Should be something like `$USER_HOME`.
     */
    public static void setInstallPath(String path) {
        prefs.put("installPath", path);
    }

	/**
	 * Get installation path from preferences.
	 * @return String or null.
     */
    public static String getInstallPath() {
        return prefs.get("installPath", null);
    }
}
