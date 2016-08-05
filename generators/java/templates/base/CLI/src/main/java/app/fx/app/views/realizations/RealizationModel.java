package diary.fx.app.views.realizations;

import diary.database.domain.edges.BOOKMARK;
import diary.database.domain.edges.CONTENT;
import diary.database.domain.nodes.Realization;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
class RealizationTableRow {
    private @Getter Realization realization;
    private @Getter CONTENT content;
	private @Getter BOOKMARK bookmark;
}
