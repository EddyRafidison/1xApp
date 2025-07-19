package one.x;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.splashscreen.SplashScreen;
import java.util.Locale;
import org.json.JSONException;
import org.json.JSONObject;

public class SplashActivity extends AppCompatActivity implements ServerListener {
  private Intent intent;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen splashScreen = SplashScreen.installSplashScreen(this);

    super.onCreate(savedInstanceState);
    intent = new Intent(this, MainActivity.class);
    // Keep the splash screen visible for this Activity.
    splashScreen.setKeepOnScreenCondition(() -> true);
    Locale langForTP = Locale.getDefault();
    String lang = langForTP.getLanguage();
    if (lang.startsWith("fr")) {
      APP.TPLANG = Locale.FRENCH;
    }
    NetworkChecker network_ = new NetworkChecker(this);
    network_.registerNetworkCallback();
    Utils.connectToServer(
        getApplicationContext(), APP.CHECKAPP, new String[] {}, new String[] {}, this);
    if (!APP.isNetworkON) {
      Toast.makeText(this, getString(R.string.connect_error), Toast.LENGTH_SHORT).show();
    }
  }

  @Override
  public void onDataLoaded(JSONObject response) {
    try {
      final String vers = response.getString("version");
      final String size = response.getString("size");
      intent.putExtra("version", vers);
      intent.putExtra("size", size);
    } catch (JSONException je) {
      Toast.makeText(this, getString(R.string.nv_check_failed), Toast.LENGTH_SHORT).show();
    }
    startActivity(intent);
    finish();
  }

  @Override
  public void onConnectionError() {
    Toast.makeText(this, getString(R.string.nv_check_failed), Toast.LENGTH_SHORT).show();
    startActivity(intent);
    finish();
  }
}
