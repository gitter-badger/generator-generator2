package app;

import java.io.IOException;
import java.util.Properties;
import java.util.prefs.Preferences;

final public class Config {

    public static final String ENV = System.getProperty("ENV", "production");
    private static final Preferences prefs = Preferences.userNodeForPackage(Config.class);

    private static final Properties dbProps = new Properties();
    private static final Properties appProps = new Properties();
    private static final Properties buildProps = new Properties();

    static {
        try {
            dbProps.load(Main.class.getResourceAsStream("/config/env.properties"));
            appProps.load(Main.class.getResourceAsStream("/config/app.properties"));
            buildProps.load(Main.class.getResourceAsStream("/config/build.properties"));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    final static public class DB {

        public static final String TYPE = dbProps.getProperty(ENV + "." + "db.type");
        public static final Boolean SEED = Boolean.parseBoolean(dbProps.getProperty(ENV + "." + "db.seed"));
        public static final String URL = dbProps.getProperty(ENV + "." + "db.url");

    }

    final static public class APP {

        public static final String NAME = appProps.getProperty("name");
        public static final String WEBSITE = appProps.getProperty("website");
        public static final String LICENSE = appProps.getProperty("license");
        public static final String DESCRIPTION = appProps.getProperty("description");

    }

    final static public class BUILD {

        public static final String DATE = buildProps.getProperty("date");
        public static final String VERSION = buildProps.getProperty("version");

    }

    public static void setInstallPath(String path) {
        prefs.put("installPath", path);
    }

    public static String getInstallPath() {
        return prefs.get("installPath", null);
    }
}