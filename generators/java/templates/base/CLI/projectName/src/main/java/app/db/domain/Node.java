package app.db.domain;

import app.db.Db;

public abstract class Node extends Entity {

    public void save() {
        Db.ENTITY.save(this);
    }

}
