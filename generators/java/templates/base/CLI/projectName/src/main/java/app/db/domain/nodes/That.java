package app.db.domain.nodes;

import app.db.domain.Node;
import lombok.AllArgsConstructor;
import org.neo4j.ogm.annotation.typeconversion.DateLong;

@AllArgsConstructor
public class That extends Node {

    @DateLong
    private String name;
}

