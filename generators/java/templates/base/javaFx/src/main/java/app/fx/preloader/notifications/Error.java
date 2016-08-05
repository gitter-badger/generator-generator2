package app.fx.preloader.notifications;

import javafx.application.Preloader;
import lombok.Getter;

public class Error
            extends Object
            implements Preloader.PreloaderNotification {

    @Getter private String error;

    public Error(String error) {
        this.error = error;
    }
}
