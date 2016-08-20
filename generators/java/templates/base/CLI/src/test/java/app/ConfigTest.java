package app;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.powermock.api.support.membermodification.MemberModifier;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;

import java.util.prefs.Preferences;

import static junit.framework.TestCase.assertEquals;
import static junit.framework.TestCase.assertNotNull;
import static org.mockito.Mockito.*;
import static org.powermock.api.mockito.PowerMockito.mockStatic;

@PrepareForTest(Config.class)
@RunWith(PowerMockRunner.class)
public class ConfigTest {

	private static Config instance;
	private static Preferences prefsMock;
	private static String prefsGetReturn = "prefsGetReturn";
	private static String prefsKey = "installPath";

	@Before
	public void setUp() throws IllegalAccessException {
		//Setup mocks
		mockStatic(Preferences.class);
		prefsMock = mock(Preferences.class);
		MemberModifier.field(Config.class, "PREFS").set(instance, prefsMock);

		//Setup mocks actions
		when(Preferences.userNodeForPackage(Config.class)).thenReturn(prefsMock);
		when(prefsMock.get(prefsKey, null)).thenReturn(prefsGetReturn);
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
		assertEquals(instance.getInstallPath(), prefsGetReturn);
		verify(prefsMock, times(1)).get(prefsKey, null);
	}

	@Test
	public void setInstallPath() {
		instance.setInstallPath(prefsKey);
		verify(prefsMock, times(1)).put(prefsKey, prefsKey);
	}
}
