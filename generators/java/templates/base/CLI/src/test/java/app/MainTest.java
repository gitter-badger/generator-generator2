package app;

import org.docopt.Docopt;
import org.junit.*;
import org.junit.runner.RunWith;
import org.powermock.api.support.membermodification.MemberModifier;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.powermock.api.mockito.PowerMockito.*;

@PrepareForTest({Docopt.class})
@RunWith(PowerMockRunner.class)
public class MainTest {

    public static Docopt docoptMock;

    @Before
    public void setUp() throws Exception {
        mockStatic(Docopt.class);
        docoptMock = mock(Docopt.class);
        whenNew(Docopt.class).withAnyArguments().thenReturn(docoptMock);
    }

    @Test
    public void main(){
        //Todo: Make tests for this...
    }
}

