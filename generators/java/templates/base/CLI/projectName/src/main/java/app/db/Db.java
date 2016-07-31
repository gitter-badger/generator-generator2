package app.db;

import app.db.domain.Entity;
import app.db.domain.edges.HAVE;
import app.db.domain.nodes.That;
import app.db.domain.nodes.Thing;
import lombok.Getter;
import org.neo4j.ogm.service.Components;
import org.neo4j.ogm.session.Session;
import org.neo4j.ogm.session.SessionFactory;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

/**
 * Todo: Add update,delete,create event callback on every database entity. For 2 way binding.
 */
public class Db {

    @Getter
    private static Session session;

    public static void open(String driver, String dbUrl) {
        Components.configuration().driverConfiguration()
                .setDriverClassName(driver)
                .setURI(dbUrl)
                .setCredentials("neo4j", "root");
        session = new SessionFactory(
                Entity.class.getPackage().getName()
        ).openSession();
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

        System.out.println("Closing database...");

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
