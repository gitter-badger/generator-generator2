package app.fx.preloader.notifications;

import javafx.application.Preloader;
import lombok.Getter;

public class Update
        extends Object
        implements Preloader.PreloaderNotification {

    @Getter private String message;
    @Getter private Double progress;

    public Update(String message, Double progress) {
        this.message = message;
        this.progress = progress;
    }
}
