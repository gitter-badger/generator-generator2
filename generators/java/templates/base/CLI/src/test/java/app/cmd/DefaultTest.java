package app.cmd;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;

@PrepareForTest({ Default.class })
@RunWith(PowerMockRunner.class)
public class DefaultTest {

	@Before
	public void setUp() {
	}

	@Test
	public void test() {
		new Default();
	}

}

