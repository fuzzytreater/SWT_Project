import com.ourcorp.Login;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvFileSource;

import static org.junit.Assert.assertEquals;

public class TestLogin {

    @ParameterizedTest
    @CsvFileSource(resources = "", numLinesToSkip = 1)
    public void testSomething() {
    }

}
