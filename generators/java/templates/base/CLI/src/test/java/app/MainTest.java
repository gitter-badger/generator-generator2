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
        String[] args = {"naval_fate","ship","new","test"};
        Main.main(args);
        verify(docoptMock, times(1)).withVersion("Naval Fate 2.0");
        verify(docoptMock, times(1)).parse(args);
    }
}

