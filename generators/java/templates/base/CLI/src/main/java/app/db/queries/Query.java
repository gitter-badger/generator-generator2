package app.db.queries;

import app.db.Db;
import org.neo4j.ogm.session.Session;

abstract class Query<T> {

    public final Session DB = Db.getSession();

    public Iterable<T> findAll() {
        return DB.loadAll(getType());
    }

    public T find(Long id) {
        return DB.load(getType(), id);
    }

    public void delete(Long id) {
        DB.delete(DB.load(getType(), id));
    }

    public abstract Class<T> getType();
}
