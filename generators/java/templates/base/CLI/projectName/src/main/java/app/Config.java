package app;

import java.io.File;
import java.io.IOException;
import java.util.Properties;
import java.util.prefs.Preferences;
import org.apache.commons.validator.routines.UrlValidator;

final public class Config {

    public static final String ENV = System.getProperty("ENV", "production");
    private static final Preferences prefs = Preferences.userNodeForPackage(Config.class);

    private static final Properties envProps = new Properties();
    private static final Properties dbProps = new Properties();
    private static final Properties appProps = new Properties();
    private static final Properties buildProps = new Properties();

    static {
        try {
            envProps.load(Main.class.getResourceAsStream("/config/env.properties"));
            dbProps.load(Main.class.getResourceAsStream("/config/db.properties"));
            appProps.load(Main.class.getResourceAsStream("/config/app.properties"));
            buildProps.load(Main.class.getResourceAsStream("/config/build.properties"));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    final static public class DB {

        public static final String USERNAME = dbProps.getProperty("username");
        public static final String PASSWORD = dbProps.getProperty("password");
        public static final String DRIVER = envProps.getProperty(ENV + "." + "db.driver");
        public static final Boolean SEED = Boolean.parseBoolean(envProps.getProperty(ENV + "." + "db.seed"));
        public static final String URL;

        static {
            String url = envProps.getProperty(ENV + "." + "db.url", null);

            if(new UrlValidator().isValid(url)){
                url = new File(getInstallPath(), url).getPath();
            }

            URL=url;
        }

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