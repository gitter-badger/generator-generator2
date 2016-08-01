package app.db.domain.nodes;

import app.db.domain.Node;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
public class That extends Node {

    @Getter private String name;
}

