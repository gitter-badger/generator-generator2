package app.db.domain.nodes;


import app.db.domain.Node;
import lombok.AllArgsConstructor;
import org.neo4j.ogm.annotation.typeconversion.DateLong;

import java.util.Date;

@AllArgsConstructor
public class Thing extends Node {

    @DateLong
    private String name;
}
