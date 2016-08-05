package app.fx.setup.views.finish;

import com.airhacks.afterburner.views.FXMLView;
import javafx.scene.Parent;

/**
 * Created by urosjarc on 12/30/15.
 */
public class FinishCtrl {

    private static final FinishPresenter pres;
    private static final FXMLView view;

    static {
        view = new FinishView();
        pres = (FinishPresenter) view.getPresenter();
    }

    public static Parent getView(){
        return view.getView();
    }

    public static boolean showReadme(){
        return pres.readmeCheckBox.isSelected();
    }
	public static boolean showTutorial(){
		return pres.tutorialCheckBox.isSelected();
	}

}
