package app.db.domain;

import app.db.Db;
import lombok.Getter;
import org.neo4j.ogm.annotation.GraphId;
import org.neo4j.ogm.annotation.NodeEntity;
import org.neo4j.ogm.annotation.typeconversion.DateLong;

import java.util.Date;

@NodeEntity
public abstract class Entity {

    @GraphId
    @Getter
    private Long id;

    @Getter
    @DateLong
    private Date createdAt = new Date();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || id == null || getClass() != o.getClass()) return false;

        Entity entity = (Entity) o;

        if (!id.equals(entity.id)) return false;

        return true;
    }

    public void delete() {
        Db.ENTITY.delete(this);
    }

    @Override
    public int hashCode() {
        return (id == null) ? -1 : id.hashCode();
    }

}
