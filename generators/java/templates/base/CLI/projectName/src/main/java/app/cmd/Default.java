package app.cmd;

import app.db.Db;
import app.db.domain.nodes.That;
import app.db.queries.ThatQuery;

import java.util.function.Consumer;

public class Default {
    public Default(){
        System.out.println("Execute default command...");
        System.out.println("Get database all <that entities>: ");
        Iterable<That> allThat = new ThatQuery().findAll();
        allThat.forEach(that -> System.out.println(" - " + that.getId() + " = " + that.getName()));
    }
}
