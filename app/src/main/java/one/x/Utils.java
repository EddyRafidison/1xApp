package one.x;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import android.location.LocationManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Build;
import android.telephony.TelephonyManager;
import android.view.Gravity;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.graphics.drawable.DrawableCompat;
import com.android.volley.Request;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.material.snackbar.Snackbar;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.json.JSONException;
import org.json.JSONObject;

public class Utils {
  public static void showAlertIfNoConnection(Context ctx, View v) {
    if (!APP.isInternetNetworkON) {
      showMessage(v, ctx.getString(R.string.no_connection), "");
    }
  }

  public static void showMessage(View v, String msg, String status) {
    int color = Color.GREEN;
    if (!status.equals("ok")) {
      color = Color.RED;
    }
    Snackbar sb = Snackbar.make(v, msg, Snackbar.LENGTH_LONG);
    View snackbarView = sb.getView();
    FrameLayout.LayoutParams params = (FrameLayout.LayoutParams) snackbarView.getLayoutParams();
    params.gravity = Gravity.TOP;
    params.setMargins(16, 30, 16, 0);
    snackbarView.setLayoutParams(params);
    DrawableCompat.setTint(snackbarView.getBackground(), color);
    TextView textView = snackbarView.findViewById(R.id.snackbar_text);
    textView.setGravity(Gravity.CENTER_HORIZONTAL);
    sb.show();
  }

  public static boolean isNetworkAvailable(Context ctx) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
      return APP.isInternetNetworkON;
    } else {
      ConnectivityManager connectivityManager =
          (ConnectivityManager) ctx.getSystemService(Context.CONNECTIVITY_SERVICE);
      if (connectivityManager != null) {
        NetworkInfo activeNetwork = connectivityManager.getActiveNetworkInfo();
        APP.isInternetNetworkON = activeNetwork != null && activeNetwork.isConnected();
      }
    }
    return APP.isInternetNetworkON;
  }

  private static JSONObject post(String[] keys, String[] value) {
    JSONObject jo = new JSONObject();
    int kl = keys.length;
    try {
      for (int i = 0; i < kl; i++) {
        jo.put(keys[i], value[i]);
      }
    } catch (JSONException ignored) {
    }
    return jo;
  }

  public static void connectToServer(
      Context ctx, String url, String[] keys, String[] values, final ServerListener slistener) {
    try {
      final JsonObjectRequest jsonObjectRequest =
          new JsonObjectRequest(
              Request.Method.POST,
              url,
              post(keys, values),
              response -> {
                slistener.onDataLoaded(response);
              },
              error -> {
                slistener.onConnectionError();
              }) {

            @NonNull
            @Override
            public Map<String, String> getHeaders() {
              // Build the headers
              final Map<String, String> params = new HashMap<>();
              params.put("Content-Type", "application/json");
              return params;
            }
          };
      Volley.newRequestQueue(ctx).add(jsonObjectRequest);
    } catch (Exception e) {
      slistener.onConnectionError();
    }
  }

  public static String readFileAsString(String path) {
    try {
      File file = new File(path);
      FileInputStream fis = new FileInputStream(file);
      byte[] data = new byte[(int) file.length()];
      fis.read(data);
      fis.close();
      return new String(data, "UTF-8");
    } catch (IOException e) {
      e.printStackTrace();
      return "{}";
    }
  }

  public static String getCountryCode(Context context) {
    String countryCode = null;

    // via TelephonyManager
    TelephonyManager tm = (TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE);
    if (tm != null) {
      countryCode = tm.getSimCountryIso(); // Essaye SIM
      if (countryCode == null || countryCode.isEmpty()) {
        countryCode = tm.getNetworkCountryIso(); // Essaye réseau
      }
    }

    // fallback via géolocalisation
    if (countryCode == null || countryCode.isEmpty()) {
      LocationManager lm = (LocationManager) context.getSystemService(Context.LOCATION_SERVICE);
      if (ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_COARSE_LOCATION)
          == PackageManager.PERMISSION_GRANTED) {
        Location location = lm.getLastKnownLocation(LocationManager.NETWORK_PROVIDER);
        if (location != null) {
          try {
            Geocoder geocoder = new Geocoder(context, Locale.getDefault());
            double lat = location.getLatitude();
            double lon = location.getLongitude();
            if (Build.VERSION.SDK_INT <= 32) {
              List<Address> addresses = geocoder.getFromLocation(lat, lon, 1);
              if (!addresses.isEmpty()) {
                countryCode = addresses.get(0).getCountryCode();
              }
            } else {
              geocoder.getFromLocation(
                  lat,
                  lon,
                  1,
                  new Geocoder.GeocodeListener() {
                    @Override
                    public void onGeocode(List<Address> addresses) {
                      if (addresses != null && !addresses.isEmpty()) {
                        String country = addresses.get(0).getCountryName();
                      }
                    }
                  });
            }
          } catch (IOException e) {
            e.printStackTrace();
          }
        }
      }
    }

    return countryCode != null ? countryCode.toUpperCase() : "FR";
  }
}
