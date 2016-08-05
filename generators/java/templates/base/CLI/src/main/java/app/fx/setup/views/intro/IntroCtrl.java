package diary.fx.setup.views.intro;

import com.airhacks.afterburner.views.FXMLView;
import javafx.scene.Parent;

/**
 * Created by urosjarc on 12/30/15.
 */
public class IntroCtrl {
    private static final IntroPresenter pres;
    private static final FXMLView view;

    static {
		view = new IntroView();
        pres = (IntroPresenter) view.getPresenter();
    }

    public static Parent getView(){
        return view.getView();
    }

}
