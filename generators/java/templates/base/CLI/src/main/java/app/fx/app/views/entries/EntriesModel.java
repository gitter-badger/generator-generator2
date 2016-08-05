package diary.fx.app.views.entries;

import diary.database.domain.edges.BOOKMARK;
import diary.database.domain.edges.CONTENT;
import diary.database.domain.nodes.Entry;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
class EntryTableRow {
    private @Getter BOOKMARK bookmark;
    private @Getter int countRealizations;
    private @Getter Entry entry;
    private @Getter CONTENT content;
}
