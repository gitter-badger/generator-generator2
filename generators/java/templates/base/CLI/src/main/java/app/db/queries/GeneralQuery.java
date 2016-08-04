package app.db.queries;

import app.db.domain.Entity;

public class GeneralQuery extends Query<Entity> {

    @Override
    public Class<Entity> getType() {
        return Entity.class;
    }
}

