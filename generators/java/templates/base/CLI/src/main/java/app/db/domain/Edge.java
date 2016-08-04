package app.db.domain;

import lombok.Getter;
import lombok.Setter;
import org.neo4j.ogm.annotation.EndNode;
import org.neo4j.ogm.annotation.StartNode;

public abstract class Edge extends Entity {

    @StartNode
    @Setter @Getter private Node startNode;
    @EndNode
    @Setter @Getter private Node endNode;

}
