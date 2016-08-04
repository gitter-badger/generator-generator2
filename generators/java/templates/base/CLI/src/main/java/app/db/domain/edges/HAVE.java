package app.db.domain.edges;

import app.db.Db;
import app.db.domain.Edge;
import app.db.domain.nodes.That;
import app.db.domain.nodes.Thing;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.neo4j.ogm.annotation.RelationshipEntity;

@AllArgsConstructor
@RelationshipEntity(type = "HAVE")
public class HAVE extends Edge {

    @Getter
    private String group;

    public void save(Thing thingStart, Thing thingEnd) {
        setStartNode(thingStart);
        setEndNode(thingEnd);
        Db.ENTITY.save(this);
    }

    public void save(Thing thing, That that) {
        setStartNode(thing);
        setEndNode(that);
        Db.ENTITY.save(this);
    }
}
