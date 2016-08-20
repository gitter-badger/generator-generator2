package app;

import app.cmd.Default;
import app.cmd.Exec;
import app.cmd.Install;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;

import static org.mockito.Mockito.times;
import static org.powermock.api.mockito.PowerMockito.*;

@PrepareForTest({ Main.class })
@RunWith(PowerMockRunner.class)
public class MainTest {

	@Before
	public void setUp() throws Exception {
		spy(Main.class);
		whenNew(Default.class).withAnyArguments().thenReturn(null);
		whenNew(Exec.class).withAnyArguments().thenReturn(null);
		whenNew(Install.class).withAnyArguments().thenReturn(null);
	}

	@Test
	public void Default() throws Exception {
		Main.main(new String[] {});

		verifyPrivate(Main.class, times(1)).invoke("start");
		verifyPrivate(Main.class, times(1)).invoke("finish");
		verifyNew(Default.class, times(1)).withNoArguments();
	}

	@Test
	public void Install() throws Exception {
		Main.main(new String[] {"install"});
		verifyNew(Install.class, times(1)).withNoArguments();
	}

	@Test
	public void Exec() throws Exception {
		Main.main(new String[] {"exec", "name", "--option=option"});
		verifyNew(Exec.class, times(1)).withArguments("name", "option");
	}

}

