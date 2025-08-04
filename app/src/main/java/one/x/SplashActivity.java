package one.x;

import android.content.Intent;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.splashscreen.SplashScreen;
import java.util.Locale;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import org.json.JSONException;
import org.json.JSONObject;

public class SplashActivity extends AppCompatActivity implements ServerListener {
  private Intent intent;
  private ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen splashScreen = SplashScreen.installSplashScreen(this);

    super.onCreate(savedInstanceState);
    intent = new Intent(this, MainActivity.class);
    // Keep the splash screen visible for this Activity.
    splashScreen.setKeepOnScreenCondition(() -> true);
    Locale langForTP = Locale.getDefault();
    String lang = langForTP.getLanguage();
    String Lang = lang.substring(0, 2);
    APP.TPLANG = Lang;
    APP.JsonLocale =
        Utils.readFileAsString(
            "/storage/emulated/0/1xApp/app/src/main/assets/one-x/locales/"
                + APP.TPLANG
                + ".json");
    NetworkChecker network_ = new NetworkChecker(this);
    network_.registerNetworkCallback();
    Utils.connectToServer(
        getApplicationContext(), APP.CHECKAPP, new String[] {}, new String[] {}, this);
  }

  @Override
  public void onDataLoaded(JSONObject response) {
    scheduler.schedule(
        () -> {
          try {
            final String vers = response.getString("version");
            final String size = response.getString("size");
            intent.putExtra("version", vers);
            intent.putExtra("size", size);
            startActivity(intent);
            finish();
          } catch (JSONException e) {
            intent.putExtra("version", "");
            intent.putExtra("size", "");
            startActivity(intent);
            finish();
          }
          runOnUiThread(
              () -> {
                // Action sur le thread UI si nécessaire
              });
        },
        4,
        TimeUnit.SECONDS);
  }

  @Override
  public void onConnectionError() {
    scheduler.schedule(
        () -> {
          intent.putExtra("version", "");
          intent.putExtra("size", "");
          startActivity(intent);
          finish();
          runOnUiThread(
              () -> {
                // Action sur le thread UI si nécessaire
              });
        },
        4,
        TimeUnit.SECONDS);
  }

  @Override
  protected void onDestroy() {
    super.onDestroy();
    if (scheduler != null) {
      scheduler.shutdown();
    }
  }

  @Override
  protected void onStart() {
    super.onStart();
    APP.CountryCode = Utils.getCountryCode(getApplicationContext());
  }
}
