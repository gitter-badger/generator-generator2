package app;

import org.junit.*;
import org.junit.runner.RunWith;
import org.powermock.api.support.membermodification.MemberModifier;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import org.powermock.reflect.Whitebox;

import static org.mockito.Mockito.*;

import java.util.prefs.Preferences;

import static junit.framework.TestCase.*;
import static org.powermock.api.mockito.PowerMockito.mockStatic;

@PrepareForTest(Config.class)
@RunWith(PowerMockRunner.class)
public class ConfigTest {

    static public Config instance;
    static public Preferences prefsMock;
    static public String prefs_get_return = "prefs_get_return";
    static public String prefs_key = "installPath";

    @Before
    public void setUp() throws IllegalAccessException {
        //Setup mocks
        mockStatic(Preferences.class);
        prefsMock = mock(Preferences.class);
        MemberModifier.field(Config.class, "PREFS").set(instance, prefsMock);

        //Setup mocks actions
        when(Preferences.userNodeForPackage(Config.class)).thenReturn(prefsMock);
        when(prefsMock.get(prefs_key, null)).thenReturn(prefs_get_return);
    }

    @Test
    public void ENV() {
        Assert.assertTrue(Config.ENV == "production" || Config.ENV == "development");
    }

    @Test
    public void APP() {
        assertNotNull(Config.APP.NAME);
        assertNotNull(Config.APP.DESCRIPTION);
    }

    @Test
    public void BUILD() {
        assertNotNull(Config.BUILD.DATE);
        assertNotNull(Config.BUILD.VERSION);
    }

    @Test
    public void getInstallPath() {
        assertEquals(instance.getInstallPath(), prefs_get_return);
        verify(prefsMock, times(1)).get(prefs_key, null);
    }

    @Test
    public void setInstallPath() {
        instance.setInstallPath(prefs_key);
        verify(prefsMock, times(1)).put(prefs_key, prefs_key);
    }
}
