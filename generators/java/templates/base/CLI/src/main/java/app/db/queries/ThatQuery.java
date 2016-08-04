package app.db.queries;

import app.db.domain.nodes.That;

import java.util.Collections;
import java.util.Map;

public class ThatQuery extends Query<That> {

    public Iterable<Map<String, Object>> findNames() {
        return DB.query(
                " MATCH (that:That)" +
                " RETURN that.name;",
                Collections.EMPTY_MAP);
    }

    public Iterable<That> findAll() {
        return DB.loadAll(getType());
    }

    @Override
    public Class<That> getType() {
        return That.class;
    }

}

