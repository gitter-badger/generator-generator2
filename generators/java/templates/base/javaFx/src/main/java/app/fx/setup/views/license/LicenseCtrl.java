package app.fx.setup.views.license;

import com.airhacks.afterburner.views.FXMLView;
import javafx.beans.property.BooleanProperty;
import javafx.scene.Parent;

/**
 * Created by urosjarc on 12/30/15.
 */
public class LicenseCtrl {
    private static final LicensePresenter pres;
    private static final FXMLView view;

    static {
        view = new LicenseView();
        pres = (LicensePresenter) view.getPresenter();
    }

    public static Parent getView() {
        return view.getView();
    }

    public static boolean userChoice() {
        BooleanProperty terms = pres.termsGroup.getSelectedToggle().selectedProperty();

        if (terms.getBean() == pres.agreeRadioBtn) {
            return true;
        } else return false;

    }
}
