package app.db;

import app.db.domain.Entity;
import app.db.domain.edges.HAVE;
import app.db.domain.nodes.That;
import app.db.domain.nodes.Thing;
import app.db.queries.ThatQuery;
import lombok.Getter;
import org.neo4j.ogm.config.Configuration;
import org.neo4j.ogm.service.Components;
import org.neo4j.ogm.session.Session;
import org.neo4j.ogm.session.SessionFactory;


/**
 * Todo: Add update,delete,create event callback on every database entity. For 2 way binding.
 */
public class Db {

    private static final Properties dbProps = new Properties();

    static {
        try {
            dbProps.load(Main.class.getResourceAsStream("/config/db.properties"));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    final static public class CONFIG {

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

    @Getter private static Session session;

    public static void open() {
        Configuration configuration = new Configuration();
        configuration.driverConfiguration()
                .setDriverClassName(CONFIG.DRIVER)
                .setURI(CONFIG.URL)
                .setCredentials(CONFIG.USERNAME,CONFIG.PASSWORD);

        session = new SessionFactory(
                configuration,
                Entity.class.getPackage().getName()
        ).openSession();

        if(CONFIG.SEED)
            seed();
    }

    public static void seed() {

        session.deleteAll(Entity.class);

        That that0 = new That("that0");
        that0.save();

        Thing thing0 = new Thing("thing0");
        thing0.save();

        new HAVE("grop0").save(thing0,that0);
    }

    public static void close() {
    }

    public static class ENTITY {

        public static void save(Entity entity) {
            session.save(entity, 0);
        }

        public static void delete(Entity entity) {
            session.delete(entity);
        }

    }

}
