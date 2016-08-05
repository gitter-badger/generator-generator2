package app.fx.setup.views.path;

import com.airhacks.afterburner.views.FXMLView;
import javafx.scene.Parent;

/**
 * Created by urosjarc on 12/30/15.
 */
public class PathCtrl {
    private static final PathPresenter pres;
    private static final FXMLView view;

    static {
        view = new PathView();
        pres = (PathPresenter) view.getPresenter();
    }

    public static Parent getView() {
        return view.getView();
    }

    public static String getPath(){
        return pres.getDirField().getText();
    }
}
